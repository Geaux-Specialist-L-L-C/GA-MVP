import type { Message } from '../types.js';

export interface ProviderResult {
  raw: unknown;
  model: string;
}

export interface AssessmentProvider {
  generateAssessment(messages: Message[], context?: ProviderContext): Promise<ProviderResult>;
}

export interface ProviderContext {
  parentId: string;
  studentId: string;
  sessionId?: string;
}
