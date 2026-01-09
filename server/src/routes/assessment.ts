import { Router, type Response } from 'express';
import { z } from 'zod';
import type { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { authenticate } from '../middleware/auth.js';
import { db } from '../services/firestore.js';
import { sendVarkAnswer, startVarkSession } from '../services/orchestration.js';
import { getAssessmentProvider } from '../services/vertex.js';
import type {
  AssessmentDecision,
  AssessmentResult,
  AuthenticatedRequest,
  LearningStyle,
  Message
} from '../types.js';

const router = Router();

const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1)
});

const gradeBandSchema = z.enum(['K-2', '3-5', '6-8', '9-12']);
const modeSchema = z.enum(['vark', 'summary']);

const requestSchema = z.object({
  parentId: z.string().min(1).optional(),
  studentId: z.string().min(1),
  messages: z.array(messageSchema),
  sessionId: z.string().min(1).optional(),
  gradeBand: gradeBandSchema.optional(),
  mode: modeSchema.optional()
});

const allowedStyles: LearningStyle[] = [
  'Visual',
  'Auditory',
  'Read/Write',
  'Kinesthetic',
  'Multimodal'
];

const MIN_EVIDENCE = 4;
const VARK_PRIMARY_MAP: Record<string, LearningStyle> = {
  V: 'Visual',
  A: 'Auditory',
  R: 'Read/Write',
  K: 'Kinesthetic',
  Multi: 'Multimodal'
};

const fallbackResult = (model: string): AssessmentResult => ({
  learningStyle: 'Multimodal',
  confidence: 0.5,
  explanation:
    'We could not confidently determine a single learning style, so a blended approach is recommended.',
  nextSteps: [
    'Mix visuals, discussion, and hands-on activities.',
    'Ask the student which format feels easiest today.',
    'Adjust study methods based on what keeps them engaged.'
  ],
  model,
  createdAt: new Date().toISOString()
});

const normalizeAssessment = (input: unknown, model: string): AssessmentResult => {
  const base = fallbackResult(model);
  let parsed: Record<string, unknown> | null = null;

  if (typeof input === 'string') {
    const trimmed = input.trim();
    try {
      parsed = JSON.parse(trimmed) as Record<string, unknown>;
    } catch (error) {
      const start = trimmed.indexOf('{');
      const end = trimmed.lastIndexOf('}');
      if (start >= 0 && end > start) {
        try {
          parsed = JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
        } catch (innerError) {
          parsed = null;
        }
      }
    }
  } else if (typeof input === 'object' && input !== null) {
    parsed = input as Record<string, unknown>;
  }

  if (!parsed) {
    return base;
  }

  const style = allowedStyles.includes(parsed.learningStyle as LearningStyle)
    ? (parsed.learningStyle as LearningStyle)
    : base.learningStyle;
  const confidence =
    typeof parsed.confidence === 'number' && parsed.confidence >= 0 && parsed.confidence <= 1
      ? parsed.confidence
      : base.confidence;
  const explanation = typeof parsed.explanation === 'string' ? parsed.explanation : base.explanation;
  const nextSteps = Array.isArray(parsed.nextSteps)
    ? parsed.nextSteps.filter((step) => typeof step === 'string')
    : base.nextSteps;

  const trimmedSteps =
    nextSteps.length >= 3 && nextSteps.length <= 6 ? nextSteps : base.nextSteps;

  return {
    learningStyle: style,
    confidence,
    explanation,
    nextSteps: trimmedSteps,
    model,
    createdAt: new Date().toISOString()
  };
};

const lowSignalTokens = new Set([
  'maybe',
  'idk',
  "i don't know",
  'dont know',
  'ok',
  'okay',
  'yes',
  'no',
  'k',
  'nah',
  'sure',
  'fine',
  'idc',
  'n/a'
]);

const isLowSignal = (content: string): boolean => {
  const normalized = content.trim().toLowerCase();
  if (!normalized) return true;
  const noPunct = normalized.replace(/[^\w\s]/g, '').trim();
  if (!noPunct) return true;
  if (lowSignalTokens.has(noPunct)) return true;
  if (noPunct.length < 6) return true;
  const wordCount = noPunct.split(/\s+/).filter(Boolean).length;
  return wordCount < 3;
};

const countEvidence = (messages: Message[]): number =>
  messages.filter((message) => {
    if (message.role !== 'user') return false;
    const normalized = message.content.trim();
    if (!normalized) return false;
    if (isLowSignal(normalized)) return false;
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    return normalized.length >= 12 || wordCount >= 3;
  }).length;

const followUpQuestions = () => [
  'When learning something new, do you prefer pictures/videos, listening, reading, or hands-on practice?',
  'Tell me about a time school felt easy. What were you doing?',
  'Do you remember better after writing notes, talking about it, or building/trying it?'
];

const missingEvidenceMessage = () => [`Need at least ${MIN_EVIDENCE} detailed responses.`];

const getLatestUserMessage = (messages: Message[]): string => {
  for (let idx = messages.length - 1; idx >= 0; idx -= 1) {
    const message = messages[idx];
    if (message?.role === 'user') {
      return message.content.trim();
    }
  }
  return '';
};

const resolveLearningStyle = (primary?: string): LearningStyle =>
  VARK_PRIMARY_MAP[primary ?? ''] ?? 'Multimodal';

const toScorePercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const buildVarkProfile = (result: {
  scores: { v: number; a: number; r: number; k: number };
  primary: string;
  summary: string;
  recommendations: string[];
}, sessionId: string) => {
  const total = result.scores.v + result.scores.a + result.scores.r + result.scores.k;
  const scoreEntries = [
    { key: 'Visual', value: result.scores.v },
    { key: 'Auditory', value: result.scores.a },
    { key: 'Read/Write', value: result.scores.r },
    { key: 'Kinesthetic', value: result.scores.k }
  ].sort((a, b) => b.value - a.value);

  const primary = resolveLearningStyle(result.primary);
  const secondary = scoreEntries.find((entry) => entry.key !== primary)?.key ?? null;
  const confidence = total > 0 ? Math.min(1, scoreEntries[0]?.value / total) : 0;

  return {
    model: 'vark',
    scores: {
      visual: toScorePercent(result.scores.v, total),
      auditory: toScorePercent(result.scores.a, total),
      read_write: toScorePercent(result.scores.r, total),
      kinesthetic: toScorePercent(result.scores.k, total)
    },
    primary,
    secondary,
    confidence,
    summary: result.summary,
    recommendations: result.recommendations,
    assessedAt: new Date().toISOString(),
    sessionId
  };
};

const maybeMarkInProgress = async (
  studentRef: DocumentReference,
  studentData: DocumentData | undefined
) => {
  const existingStatus = studentData?.assessmentStatus;
  const existingStyle = studentData?.learningStyle;
  if (!(existingStatus === 'completed' && existingStyle)) {
    await studentRef.update({
      assessmentStatus: 'in_progress',
      updatedAt: new Date().toISOString()
    });
  }
};

const handleVarkChat = async (
  payload: z.infer<typeof requestSchema>,
  res: Response,
  studentRef: DocumentReference,
  studentData: DocumentData | undefined,
  parentId: string
) => {
  const { studentId, messages, sessionId, gradeBand } = payload;

  if (!sessionId && messages.length > 0) {
    return res.status(400).json({
      ok: false,
      error: { code: 'MISSING_SESSION_ID', message: 'sessionId is required for responses' }
    });
  }

  if (!sessionId) {
    const start = await startVarkSession({ studentId, gradeBand });
    if (!start.ok) {
      return res.status(502).json(start);
    }
    await maybeMarkInProgress(studentRef, studentData);
    return res.status(200).json({
      ok: true,
      sessionId: start.sessionId,
      status: 'in_progress',
      question: start.question
    });
  }

  const answer = getLatestUserMessage(messages);
  if (!answer) {
    return res.status(400).json({
      ok: false,
      error: { code: 'MISSING_ANSWER', message: 'answer is required' }
    });
  }

  const response = await sendVarkAnswer({ sessionId, answer, studentId });
  if (!response.ok) {
    return res.status(502).json(response);
  }

  if (response.status === 'complete') {
    const result = response.result;
    if (!result) {
      return res.status(502).json({
        ok: false,
        error: { code: 'ORCHESTRATION_MISSING_RESULT', message: 'missing result from orchestration' }
      });
    }

    const learningStyle = resolveLearningStyle(result.primary);
    const varkProfile = buildVarkProfile(result, sessionId);
    await studentRef.update({
      learningStyle,
      hasTakenAssessment: true,
      assessmentStatus: 'completed',
      vark_profile: varkProfile,
      updatedAt: new Date().toISOString()
    });

    try {
      await db.collection('assessments').add({
        parentId,
        studentId,
        messages,
        result: {
          learningStyle,
          confidence: varkProfile.confidence,
          explanation: result.summary,
          nextSteps: result.recommendations,
          model: 'vark',
          createdAt: new Date().toISOString(),
          vark_profile: varkProfile
        },
        createdAt: new Date().toISOString(),
        model: 'vark',
        decision: 'final',
        evidenceCount: messages.length
      });
    } catch (error) {
      // non-fatal for chat completion
    }

    return res.status(200).json({
      ok: true,
      sessionId,
      status: 'complete',
      result
    });
  }

  if (!response.question?.text) {
    return res.status(502).json({
      ok: false,
      error: { code: 'ORCHESTRATION_MISSING_QUESTION', message: 'missing question from orchestration' }
    });
  }

  await maybeMarkInProgress(studentRef, studentData);
  return res.status(200).json({
    ok: true,
    sessionId: response.sessionId,
    status: 'in_progress',
    question: response.question
  });
};

const handleLegacyAssessment = async (
  payload: z.infer<typeof requestSchema>,
  res: Response,
  studentRef: DocumentReference,
  studentData: DocumentData | undefined,
  parentId: string
) => {
  const { studentId, messages } = payload;
  const evidenceCount = countEvidence(messages);
  const decision: AssessmentDecision =
    evidenceCount < MIN_EVIDENCE ? 'needs_more_data' : 'final';

  const provider = getAssessmentProvider();
  let providerResult: { raw: unknown; model: string };
  try {
    providerResult = await provider.generateAssessment(messages, { parentId, studentId });
  } catch (error) {
    providerResult = { raw: null, model: 'unavailable' };
  }

  const normalized = normalizeAssessment(providerResult.raw, providerResult.model);
  const responsePayload: AssessmentResult = {
    ...normalized,
    decision,
    evidenceCount
  };

  if (decision === 'needs_more_data') {
    responsePayload.confidence = Math.min(responsePayload.confidence, 0.4);
    responsePayload.missingEvidence = missingEvidenceMessage();
    responsePayload.questions = followUpQuestions();

    const existingStatus = studentData?.assessmentStatus;
    const existingStyle = studentData?.learningStyle;
    if (!(existingStatus === 'completed' && existingStyle)) {
      await studentRef.update({
        assessmentStatus: 'in_progress',
        updatedAt: new Date().toISOString()
      });
    }
  } else {
    const existingStatus = studentData?.assessmentStatus;
    const existingStyle = studentData?.learningStyle;
    if (existingStatus === 'completed' && existingStyle && normalized.confidence < 0.55) {
      responsePayload.learningStyle = existingStyle as LearningStyle;
    } else {
      await studentRef.update({
        learningStyle: responsePayload.learningStyle,
        hasTakenAssessment: true,
        assessmentStatus: 'completed',
        updatedAt: new Date().toISOString()
      });
    }
  }

  try {
    await db.collection('assessments').add({
      parentId,
      studentId,
      messages,
      result: responsePayload,
      createdAt: new Date().toISOString(),
      model: normalized.model,
      decision,
      evidenceCount
    });
  } catch (error) {
    // TODO: add structured logging for failed assessment history writes
  }

  return res.status(200).json(responsePayload);
};

const handleAssessmentRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  defaultMode: 'vark' | 'summary'
) => {
  const parseResult = requestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { studentId, messages, sessionId, gradeBand, mode, parentId: bodyParentId } =
    parseResult.data;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (bodyParentId && bodyParentId !== userId) {
    return res.status(400).json({
      ok: false,
      error: {
        code: 'CLIENT_PARENT_MISMATCH',
        message: 'parentId does not match authenticated user'
      }
    });
  }

  const resolvedMode = mode ?? defaultMode;
  const isVark = Boolean(sessionId)
    ? true
    : resolvedMode === 'summary'
      ? false
      : resolvedMode === 'vark'
        ? true
        : Boolean(gradeBand && messages.length === 0) || defaultMode === 'vark';
  const parentId = userId;

  const studentRef = db.collection('students').doc(studentId);
  const studentSnap = await studentRef.get();

  if (!studentSnap.exists) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const studentData = studentSnap.data();
  if (studentData?.parentId !== parentId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (isVark) {
    return handleVarkChat(parseResult.data, res, studentRef, studentData, parentId);
  }

  return handleLegacyAssessment(parseResult.data, res, studentRef, studentData, parentId);
};

export const handleAssessment = async (req: AuthenticatedRequest, res: Response) =>
  handleAssessmentRequest(req, res, 'summary');

export const handleAssessmentChat = async (req: AuthenticatedRequest, res: Response) =>
  handleAssessmentRequest(req, res, 'vark');

router.post('/assessment/chat', authenticate, handleAssessmentChat);
router.post('/learning-style/assess', authenticate, handleAssessment);

export default router;

export { countEvidence, isLowSignal };
