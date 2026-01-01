import { VertexAI } from '@google-cloud/vertexai';
import type { Message } from '../types.js';

export interface ProviderResult {
  raw: unknown;
  model: string;
}

export interface AssessmentProvider {
  generateAssessment(messages: Message[]): Promise<ProviderResult>;
}

const DEFAULT_MODEL = 'gemini-1.5-flash';

const getVertexConfig = () => {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_REGION ?? process.env.VERTEX_LOCATION;
  if (!project || !location) {
    return null;
  }
  return {
    project,
    location,
    model: process.env.VERTEX_MODEL ?? DEFAULT_MODEL
  };
};

class VertexAssessmentProvider implements AssessmentProvider {
  private client: VertexAI;
  private modelName: string;

  constructor(project: string, location: string, modelName: string) {
    this.client = new VertexAI({ project, location });
    this.modelName = modelName;
  }

  async generateAssessment(messages: Message[]): Promise<ProviderResult> {
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const prompt = buildPrompt(messages);
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512
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
    'You are an assistant that must return STRICT JSON only.',
    'Analyze the conversation and output JSON with exactly these keys:',
    'learningStyle, confidence, explanation, nextSteps, model, createdAt.',
    'learningStyle must be one of ["Visual","Auditory","Read/Write","Kinesthetic","Multimodal"].',
    'confidence is a number from 0 to 1.',
    'explanation is a short parent-friendly string.',
    'nextSteps is an array of 3-6 short suggestions.',
    'model should be the model name you used.',
    'createdAt must be an ISO timestamp.',
    'Conversation transcript:',
    transcript
  ].join('\n');
};

export const getAssessmentProvider = (): AssessmentProvider => {
  const config = getVertexConfig();
  if (!config) {
    return new StubAssessmentProvider();
  }

  return new VertexAssessmentProvider(config.project, config.location, config.model);
};
