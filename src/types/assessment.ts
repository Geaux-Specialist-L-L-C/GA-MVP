// File: /src/types/assessment.ts
// Description: Type definitions for learning assessment system
// Author: GitHub Copilot
// Created: 2024-02-20

export type LearningStyleType = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

export interface LearningStyle {
  primary: LearningStyleType;
  scores: Record<LearningStyleType, number>;
  confidence: number;
}

export interface AssessmentResult {
  assessmentId: string;
  studentId: string;
  learningStyle: LearningStyle;
  recommendations: string[];
  timestamp: Date;
}

export interface AssessmentProgress {
  assessmentId: string;
  completed: boolean;
  progress: number;
  learningStyle?: LearningStyle;
}

export interface AssessmentError {
  code: string;
  message: string;
  details?: unknown;
}