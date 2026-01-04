import type { Message } from '../types.js';

export interface ProviderResult {
  raw: unknown;
  model: string;
}

export interface AssessmentProvider {
  generateAssessment(messages: Message[]): Promise<ProviderResult>;
}
