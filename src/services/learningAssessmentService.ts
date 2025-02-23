// File: /src/services/learningAssessmentService.ts
// Description: Service for interacting with the CrewAI learning assessment system
// Author: GitHub Copilot
// Created: 2024-02-20

import { apiClient } from '@/lib/apiClient';
import type { AxiosError } from 'axios';

export interface LearningStyle {
  primary: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  scores: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
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

export class AssessmentError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AssessmentError';
  }
}

export const startLearningAssessment = async (
  studentId: string
): Promise<AssessmentResult> => {
  try {
    const response = await apiClient.post<AssessmentResult>(
      '/api/learning-assessment/start',
      { studentId }
    );
    return {
      ...response.data,
      timestamp: new Date(response.data.timestamp)
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      throw new AssessmentError(
        'Authentication required',
        'UNAUTHORIZED'
      );
    }
    if (axiosError.response?.status === 429) {
      throw new AssessmentError(
        'Too many assessment attempts. Please try again later.',
        'RATE_LIMITED'
      );
    }
    throw new AssessmentError(
      'Failed to start learning assessment',
      'START_FAILED',
      error
    );
  }
};

export const getLearningAssessmentProgress = async (
  assessmentId: string
): Promise<AssessmentProgress> => {
  try {
    const response = await apiClient.get<AssessmentProgress>(
      `/api/learning-assessment/${assessmentId}/progress`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      throw new AssessmentError(
        'Assessment not found',
        'NOT_FOUND'
      );
    }
    throw new AssessmentError(
      'Failed to get assessment progress',
      'PROGRESS_FAILED',
      error
    );
  }
};