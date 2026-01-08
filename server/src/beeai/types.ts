export type SessionStatus = 'active' | 'needs_more_data' | 'complete';

export interface BeeAIMemory {
  question_history: string[];
  response_scores: number[];
  session_status: SessionStatus;
  focus_modality: string | null;
  final_report: BeeAIReport | null;
}

export interface BeeAIReport {
  learningStyle: 'Visual' | 'Auditory' | 'Read/Write' | 'Kinesthetic' | 'Multimodal';
  confidence: number;
  explanation: string;
  nextSteps: string[];
  model: string;
  createdAt: string;
  traceId?: string;
}

export interface BeeAIWorkflowRun {
  report: BeeAIReport | null;
  memory: BeeAIMemory | null;
  traceId?: string;
}
