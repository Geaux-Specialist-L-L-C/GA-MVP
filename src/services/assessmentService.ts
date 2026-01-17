import { buildApiUrl } from './api';

export interface AssessmentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AssessmentResult {
  learningStyle: string;
  confidence: number;
  explanation: string;
  nextSteps: string[];
  model: string;
  createdAt: string;
  decision?: 'final' | 'needs_more_data';
  missingEvidence?: string[];
  questions?: string[];
  evidenceCount?: number;
}

export interface AssessLearningStyleInput {
  parentId: string;
  studentId: string;
  messages: AssessmentMessage[];
  token: string;
}

export const assessLearningStyle = async (
  input: AssessLearningStyleInput
): Promise<AssessmentResult> => {
  const response = await fetch(buildApiUrl('/api/learning-style/assess'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.token}`
    },
    body: JSON.stringify({
      parentId: input.parentId,
      studentId: input.studentId,
      messages: input.messages
    })
  });

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    const error = new Error(errorMessage);
    (error as { status?: number }).status = response.status;
    throw error;
  }

  return response.json() as Promise<AssessmentResult>;
};

export const checkAssessmentHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl('/healthz'));
    if (!response.ok) return false;
    const payload = (await response.json()) as { ok?: boolean };
    return payload.ok === true;
  } catch {
    return false;
  }
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error ?? data.message ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};
