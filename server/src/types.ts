import type { Request } from 'express';

export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface AssessmentRequestBody {
  parentId: string;
  studentId: string;
  messages: Message[];
}

export type LearningStyle =
  | 'Visual'
  | 'Auditory'
  | 'Read/Write'
  | 'Kinesthetic'
  | 'Multimodal';

export interface AssessmentResult {
  learningStyle: LearningStyle;
  confidence: number;
  explanation: string;
  nextSteps: string[];
  model: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  uid: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
