import { BeeAIClient } from './client.js';
import {
  createDefaultMemory,
  loadSessionMemory,
  saveSessionMemory
} from './sessionStore.js';
import type { BeeAIMemory, BeeAIReport } from './types.js';
import type { Message } from '../types.js';
import type { AssessmentProvider, ProviderContext, ProviderResult } from '../services/providerTypes.js';

export class BeeAIAssessmentProvider implements AssessmentProvider {
  private client: BeeAIClient;

  constructor(client = new BeeAIClient()) {
    this.client = client;
  }

  async generateAssessment(
    messages: Message[],
    context?: ProviderContext
  ): Promise<ProviderResult> {
    const parentId = context?.parentId ?? 'anonymous_parent';
    const studentId = context?.studentId ?? 'anonymous_student';

    const memory = (await loadSessionMemory(parentId, studentId)) ?? createDefaultMemory();
    let report: BeeAIReport | null = null;
    let updatedMemory: BeeAIMemory = memory;

    try {
      const runResult = await this.client.runWorkflow({
        messages,
        memory,
        parentId,
        studentId
      });
      report = runResult.report ?? null;
      updatedMemory = runResult.memory ?? memory;
    } catch (error) {
      // fall back to a safe default; route-level normalization will handle
      report = {
        learningStyle: 'Multimodal',
        confidence: 0.45,
        explanation: 'BeeAI workflow unavailable; using safe default response.',
        nextSteps: [
          'Share a few more details about how learning feels easiest.',
          'Describe whether pictures, audio, text, or hands-on practice works best.',
          'Try answering one more question to refine the recommendation.'
        ],
        model: 'beeai-fallback',
        createdAt: new Date().toISOString()
      };
    }

    await saveSessionMemory(parentId, studentId, updatedMemory);

    if (!report) {
      report = {
        learningStyle: 'Multimodal',
        confidence: 0.4,
        explanation: 'Need more responses to choose a specific learning style.',
        nextSteps: [
          'Share a few more details about how learning feels easiest.',
          'Describe whether pictures, audio, text, or hands-on practice works best.',
          'Try answering one more question to refine the recommendation.'
        ],
        model: 'beeai-orchestrator',
        createdAt: new Date().toISOString()
      };
    }

    return {
      raw: report,
      model: report.model
    };
  }
}
