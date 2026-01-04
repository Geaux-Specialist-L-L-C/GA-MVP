import type { Message } from '../types.js';
import type { AssessmentProvider, ProviderResult } from '../services/providerTypes.js';

type SessionStatus = 'active' | 'needs_more_data' | 'complete';

interface BeeAIMemory {
  question_history: string[];
  response_scores: number[];
  session_status: SessionStatus;
  focus_modality: string | null;
  final_report: BeeAIReport | null;
}

interface BeeAIReport {
  learningStyle: 'Visual' | 'Auditory' | 'Read/Write' | 'Kinesthetic' | 'Multimodal';
  confidence: number;
  explanation: string;
  nextSteps: string[];
  model: string;
  createdAt: string;
}

interface Agent {
  execute(memory: BeeAIMemory, messages: Message[]): void;
}

class ScenarioGeneratorAgent implements Agent {
  execute(memory: BeeAIMemory) {
    if (memory.session_status !== 'active') return;
    if (memory.question_history.length > 0) return;
    memory.question_history.push(
      'Tell me about a time learning felt easy. Were you looking at pictures, listening, reading, or doing something hands-on?'
    );
  }
}

class ResponseEvaluatorAgent implements Agent {
  execute(memory: BeeAIMemory, messages: Message[]) {
    if (memory.session_status !== 'active') return;
    const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content);
    if (!userMessages.length) return;

    const latest = userMessages[userMessages.length - 1].toLowerCase();
    memory.response_scores.push(scoreModality(latest));
  }
}

class ConsistencyCheckerAgent implements Agent {
  execute(memory: BeeAIMemory) {
    if (memory.session_status !== 'active') return;
    const votes = memory.response_scores;
    if (votes.length < 3) {
      memory.session_status = 'needs_more_data';
      return;
    }

    const top = pickTopModality(votes);
    memory.focus_modality = top;
    memory.session_status = 'complete';
  }
}

class PreferenceSynthesizerAgent implements Agent {
  execute(memory: BeeAIMemory) {
    if (memory.session_status !== 'complete' || memory.final_report) return;

    const learningStyle = memory.focus_modality ?? 'Multimodal';
    const confidence = clamp(
      memory.response_scores.length ? 0.55 + memory.response_scores.length * 0.05 : 0.5,
      0,
      0.9
    );

    memory.final_report = {
      learningStyle,
      confidence,
      explanation:
        'Based on the answers so far, this is the best-fit learning style. More data can refine it.',
      nextSteps: nextStepsForStyle(learningStyle),
      model: 'beeai-orchestrator',
      createdAt: new Date().toISOString()
    };
  }
}

export class BeeAIAssessmentProvider implements AssessmentProvider {
  private agents: Agent[];

  constructor() {
    this.agents = [
      new ScenarioGeneratorAgent(),
      new ResponseEvaluatorAgent(),
      new ConsistencyCheckerAgent(),
      new PreferenceSynthesizerAgent()
    ];
  }

  async generateAssessment(messages: Message[]): Promise<ProviderResult> {
    const memory: BeeAIMemory = {
      question_history: [],
      response_scores: [],
      session_status: 'active',
      focus_modality: null,
      final_report: null
    };

    for (const agent of this.agents) {
      agent.execute(memory, messages);
    }

    if (!memory.final_report) {
      memory.final_report = {
        learningStyle: 'Multimodal',
        confidence: 0.45,
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
      raw: memory.final_report,
      model: memory.final_report.model
    };
  }
}

const modalityKeywords: Record<string, string[]> = {
  Visual: ['see', 'visual', 'diagram', 'picture', 'video', 'look'],
  Auditory: ['hear', 'listen', 'audio', 'auditory', 'podcast', 'talk', 'conversation'],
  'Read/Write': ['read', 'write', 'notes', 'text', 'book', 'article'],
  Kinesthetic: ['hands', 'build', 'experiment', 'do', 'practice', 'touch', 'move']
};

const scoreModality = (content: string): number => {
  const lowered = content.toLowerCase();
  const matches = Object.values(modalityKeywords).map((keywords) =>
    keywords.some((keyword) => lowered.includes(keyword))
  );
  return matches.filter(Boolean).length || 1;
};

const pickTopModality = (scores: number[]): BeeAIReport['learningStyle'] => {
  const total = scores.reduce((sum, score) => sum + score, 0);
  if (!Number.isFinite(total) || total <= 0) return 'Multimodal';
  if (total > 10) return 'Visual';
  if (total > 7) return 'Auditory';
  if (total > 5) return 'Read/Write';
  if (total > 3) return 'Kinesthetic';
  return 'Multimodal';
};

const nextStepsForStyle = (style: BeeAIReport['learningStyle']): string[] => {
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

  return base[style] ?? base.Multimodal;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
