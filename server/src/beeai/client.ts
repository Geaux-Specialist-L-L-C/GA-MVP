import type { Message } from '../types.js';
import type { BeeAIMemory, BeeAIReport, BeeAIWorkflowRun } from './types.js';

interface RunWorkflowInput {
  messages: Message[];
  memory: BeeAIMemory;
  parentId: string;
  studentId: string;
}

export interface BeeAIConfig {
  apiKey: string;
  apiUrl: string;
  workflowId: string;
}

export class BeeAIClient {
  private config: BeeAIConfig | null;

  constructor(config = resolveConfig()) {
    this.config = config;
  }

  async runWorkflow(input: RunWorkflowInput): Promise<BeeAIWorkflowRun> {
    if (!this.config) {
      throw new Error('BeeAI config missing');
    }

    const url = `${this.config.apiUrl}/v1/workflows/${this.config.workflowId}/run`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        input: {
          messages: input.messages,
          memory: input.memory,
          parentId: input.parentId,
          studentId: input.studentId
        }
      })
    });

    if (!response.ok) {
      throw new Error(`BeeAI workflow failed (${response.status})`);
    }

    const data = (await response.json()) as BeeAIRunResponse;
    const report = normalizeReport(data.output?.final_report);
    const memory = (data.output?.memory as BeeAIMemory | undefined) ?? null;

    return {
      report,
      memory,
      traceId: data.trace_id
    };
  }
}

interface BeeAIRunResponse {
  trace_id?: string;
  output?: {
    final_report?: unknown;
    memory?: unknown;
  };
}

const normalizeReport = (input: unknown): BeeAIReport | null => {
  if (!input || typeof input !== 'object') return null;
  const candidate = input as Record<string, unknown>;
  if (!candidate.learningStyle) return null;
  const learningStyle = candidate.learningStyle as BeeAIReport['learningStyle'];
  const confidence =
    typeof candidate.confidence === 'number' && Number.isFinite(candidate.confidence)
      ? clamp(candidate.confidence, 0, 1)
      : 0.5;
  const explanation =
    typeof candidate.explanation === 'string'
      ? candidate.explanation
      : 'Learning style estimate based on current session.';
  const nextSteps = Array.isArray(candidate.nextSteps)
    ? candidate.nextSteps.filter((step) => typeof step === 'string')
    : [];
  const createdAt =
    typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString();

  return {
    learningStyle,
    confidence,
    explanation,
    nextSteps: nextSteps.length ? nextSteps : ['Try a mix of visuals, audio, reading, and hands-on.'],
    model: typeof candidate.model === 'string' ? candidate.model : 'beeai',
    createdAt,
    traceId: typeof candidate.traceId === 'string' ? candidate.traceId : undefined
  };
};

const resolveConfig = (): BeeAIConfig | null => {
  const apiKey = process.env.BEEAI_API_KEY?.trim();
  const apiUrl = process.env.BEEAI_API_URL?.trim() ?? 'https://api.beeai.dev';
  const workflowId =
    process.env.BEEAI_WORKFLOW_ID?.trim() ?? process.env.BEEAI_WORKFLOW_PATH?.trim();

  if (!apiKey || !workflowId) {
    return null;
  }

  return {
    apiKey,
    apiUrl,
    workflowId
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
