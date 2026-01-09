import { firestore as db } from '../config/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface VarkQuestionOption {
  key: string;
  text: string;
}

export interface VarkQuestion {
  id: string;
  text: string;
  options: VarkQuestionOption[];
}

export interface VarkScores {
  visual: number;
  auditory: number;
  readWrite: number;
  kinesthetic: number;
  primaryStyle: string;
}

export interface VarkChatResult {
  scores: {
    v: number;
    a: number;
    r: number;
    k: number;
  };
  primary: string;
  summary: string;
  recommendations: string[];
}

export interface VarkChatResponse {
  ok: boolean;
  sessionId?: string;
  status?: 'in_progress' | 'complete';
  question?: VarkQuestion;
  result?: VarkChatResult;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

const API_BASE = import.meta.env.VITE_ASSESSMENT_API_BASE ?? '';

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as {
      error?: string | { message?: string };
      message?: string;
    };
    if (typeof data.error === 'string') return data.error;
    if (data.error && typeof data.error.message === 'string') return data.error.message;
    return data.message ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

export const startVarkAssessment = async (input: {
  parentId: string;
  studentId: string;
  gradeBand?: string;
  token: string;
}): Promise<VarkChatResponse> => {
  const response = await fetch(`${API_BASE}/api/assessment/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.token}`
    },
    body: JSON.stringify({
      parentId: input.parentId,
      studentId: input.studentId,
      gradeBand: input.gradeBand,
      messages: []
    })
  });
  
  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    const error = new Error(errorMessage);
    (error as { status?: number }).status = response.status;
    throw error;
  }

  const payload = (await response.json()) as VarkChatResponse;
  if (!payload.ok) {
    const error = new Error(payload.error?.message ?? 'Assessment failed');
    (error as { status?: number; code?: string }).status = response.status;
    (error as { status?: number; code?: string }).code = payload.error?.code;
    throw error;
  }

  return payload;
};

export const sendVarkResponse = async (input: {
  parentId: string;
  studentId: string;
  sessionId: string;
  message: string;
  gradeBand?: string;
  token: string;
}): Promise<VarkChatResponse> => {
  const response = await fetch(`${API_BASE}/api/assessment/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.token}`
    },
    body: JSON.stringify({
      parentId: input.parentId,
      studentId: input.studentId,
      gradeBand: input.gradeBand,
      sessionId: input.sessionId,
      messages: [{ role: 'user', content: input.message }]
    }),
  });
  
  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    const error = new Error(errorMessage);
    (error as { status?: number }).status = response.status;
    throw error;
  }

  const payload = (await response.json()) as VarkChatResponse;
  if (!payload.ok) {
    const error = new Error(payload.error?.message ?? 'Assessment failed');
    (error as { status?: number; code?: string }).status = response.status;
    (error as { status?: number; code?: string }).code = payload.error?.code;
    throw error;
  }

  return payload;
};

export const saveAssessmentResults = async (
  userId: string, 
  results: VarkScores
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const resultsRef = doc(db, 'varkResults', userId);
    
    // Update user document with primary learning style
    await updateDoc(userRef, {
      primaryLearningStyle: results.primaryStyle,
      updatedAt: serverTimestamp()
    });
    
    // Save detailed results
    await setDoc(resultsRef, {
      ...results,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving results:', error);
    throw error;
  }
};
