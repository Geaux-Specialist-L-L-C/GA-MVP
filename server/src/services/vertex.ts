import { VertexAI } from '@google-cloud/vertexai';
import type { Message } from '../types.js';
import { getVertexConfig } from './vertexConfig.js';
import type { VertexConfig } from './vertexConfig.js';

export interface ProviderResult {
  raw: unknown;
  model: string;
}

export interface AssessmentProvider {
  generateAssessment(messages: Message[]): Promise<ProviderResult>;
}

class VertexAssessmentProvider implements AssessmentProvider {
  private client: VertexAI;
  private modelName: string;
  private temperature: number;
  private maxOutputTokens: number;
  private timeoutMs: number;

  constructor(config: VertexConfig, client?: VertexAI) {
    this.client = client ?? new VertexAI({ project: config.project, location: config.location });
    this.modelName = config.model;
    this.temperature = config.temperature;
    this.maxOutputTokens = config.maxOutputTokens;
    this.timeoutMs = config.timeoutMs;
  }

  async generateAssessment(messages: Message[]): Promise<ProviderResult> {
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const prompt = buildPrompt(messages);

    const execute = async () => {
      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxOutputTokens
        }
      });

      const text = response.response.candidates
        ?.flatMap((candidate) => candidate.content.parts ?? [])
        .map((part) => ('text' in part ? part.text : ''))
        .join('')
        .trim();

      return {
        raw: text ?? '',
        model: this.modelName
      };
    };

    return this.withRetry(() => this.withTimeout(execute));
  }

  private async withTimeout<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.timeoutMs || this.timeoutMs <= 0) {
      return fn();
    }

    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Vertex request timed out'));
      }, this.timeoutMs);

      fn()
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (!isRetryableError(error) || attempt === 1) {
          throw error;
        }
        await sleep(200);
      }
    }
    throw lastError;
  }
}

class StubAssessmentProvider implements AssessmentProvider {
  async generateAssessment(messages: Message[]): Promise<ProviderResult> {
    const combined = messages.map((message) => message.content).join(' ').toLowerCase();
    const style = pickStyle(combined);
    const stub = {
      learningStyle: style,
      confidence: 0.62,
      explanation:
        'Based on the chat so far, this is a best-effort guess of how the student seems to learn.',
      nextSteps: nextStepsForStyle(style),
      model: 'stub'
    };

    return {
      raw: stub,
      model: 'stub'
    };
  }
}

const pickStyle = (text: string) => {
  if (text.includes('visual') || text.includes('see') || text.includes('diagram')) {
    return 'Visual';
  }
  if (text.includes('listen') || text.includes('auditory') || text.includes('hear')) {
    return 'Auditory';
  }
  if (text.includes('read') || text.includes('write') || text.includes('notes')) {
    return 'Read/Write';
  }
  if (text.includes('hands') || text.includes('kinesthetic') || text.includes('build')) {
    return 'Kinesthetic';
  }
  return 'Multimodal';
};

const nextStepsForStyle = (style: string) => {
  const base = {
    Visual: [
      'Use diagrams or pictures when introducing new ideas.',
      'Summarize lessons with charts or color-coded notes.',
      'Try short videos before homework sessions.'
    ],
    Auditory: [
      'Discuss key ideas out loud before writing answers.',
      'Use audiobooks or read assignments together.',
      'Encourage short verbal summaries after each lesson.'
    ],
    'Read/Write': [
      'Provide written checklists for study sessions.',
      'Encourage rewriting notes in their own words.',
      'Use flashcards with concise text prompts.'
    ],
    Kinesthetic: [
      'Add hands-on activities or experiments when possible.',
      'Take short movement breaks between study blocks.',
      'Use manipulatives or real-world examples.'
    ],
    Multimodal: [
      'Mix visuals, discussion, and hands-on practice.',
      'Rotate study formats to keep engagement high.',
      'Let the student choose the format that feels easiest.'
    ]
  } as const;

  return base[style as keyof typeof base] ?? base.Multimodal;
};

const buildPrompt = (messages: Message[]) => {
  const transcript = messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');

  return [
    'Return STRICT JSON only. Do not include markdown fences, prose, or commentary.',
    'Use exactly this JSON shape and allowed values:',
    '{',
    '  "learningStyle": "Visual|Auditory|Read/Write|Kinesthetic|Multimodal",',
    '  "confidence": 0.0-1.0,',
    '  "explanation": "short parent-friendly string",',
    '  "nextSteps": ["3-6 actionable bullet strings"],',
    '  "model": "<model name>",',
    '  "createdAt": "<ISO 8601 timestamp>"',
    '}',
    'Rules:',
    '- Respond with JSON only (no markdown, no preamble).',
    '- learningStyle must be exactly one of: Visual, Auditory, Read/Write, Kinesthetic, Multimodal.',
    '- nextSteps must be an array of 3-6 concise action items.',
    '- Keep explanation brief and supportive for parents.',
    'Conversation transcript:',
    transcript
  ].join('\n');
};

export const getAssessmentProvider = (): AssessmentProvider => {
  const config = getVertexConfig();
  if (!config) {
    return new StubAssessmentProvider();
  }

  return new VertexAssessmentProvider(config);
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const isRetryableError = (error: unknown) => {
  const maybeError = error as { code?: unknown; status?: unknown; message?: unknown };
  const code = maybeError?.code ?? maybeError?.status;
  if (code === 429 || code === 503) {
    return true;
  }

  const message =
    typeof maybeError?.message === 'string' ? maybeError.message.toLowerCase() : undefined;
  return message?.includes('timeout') || message?.includes('deadline') || false;
};

export { buildPrompt };
