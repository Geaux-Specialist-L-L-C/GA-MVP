import { Router, type Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { db } from '../services/firestore.js';
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

const requestSchema = z.object({
  parentId: z.string().min(1),
  studentId: z.string().min(1),
  messages: z.array(messageSchema)
});

const allowedStyles: LearningStyle[] = [
  'Visual',
  'Auditory',
  'Read/Write',
  'Kinesthetic',
  'Multimodal'
];

const MIN_EVIDENCE = 4;

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

export const handleAssessment = async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = requestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { parentId, studentId, messages } = parseResult.data;
  const evidenceCount = countEvidence(messages);
  const decision: AssessmentDecision =
    evidenceCount < MIN_EVIDENCE ? 'needs_more_data' : 'final';

  if (!req.user || req.user.uid !== parentId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const studentRef = db.collection('students').doc(studentId);
  const studentSnap = await studentRef.get();

  if (!studentSnap.exists) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const studentData = studentSnap.data();
  if (studentData?.parentId !== parentId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const provider = getAssessmentProvider();
  let providerResult: { raw: unknown; model: string };
  try {
    providerResult = await provider.generateAssessment(messages);
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

router.post('/assessment/chat', authenticate, handleAssessment);
router.post('/learning-style/assess', authenticate, handleAssessment);

export default router;

export { countEvidence, isLowSignal };
