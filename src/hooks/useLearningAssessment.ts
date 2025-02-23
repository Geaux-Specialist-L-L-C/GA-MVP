// File: /src/hooks/useLearningAssessment.ts
// Description: Hook for managing learning style assessment state and API interactions
// Author: GitHub Copilot
// Created: 2024-02-20

import { useState, useEffect, useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { 
  startLearningAssessment,
  getLearningAssessmentProgress,
  type AssessmentResult,
  type LearningStyle 
} from '@/services/learningAssessmentService';

interface UseLearningAssessmentReturn {
  startAssessment: () => Promise<AssessmentResult>;
  learningStyle: LearningStyle | null;
  isLoading: boolean;
  progress: number;
}

export const useLearningAssessment = (studentId: string): UseLearningAssessmentReturn => {
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const { showBoundary } = useErrorBoundary();

  // Cleanup function for WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;

    if (assessmentId) {
      ws = new WebSocket(process.env.VITE_WS_URL || 'wss://localhost:3001');

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.assessmentId === assessmentId) {
            setProgress(data.progress);
            if (data.progress === 100) {
              setAssessmentId(null);
            }
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        showBoundary(new Error('Assessment progress monitoring failed'));
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [assessmentId, showBoundary]);

  const startAssessment = useCallback(async (): Promise<AssessmentResult> => {
    setIsLoading(true);
    setProgress(0);

    try {
      const { assessmentId: newAssessmentId, learningStyle: initialStyle } = 
        await startLearningAssessment(studentId);
      
      setAssessmentId(newAssessmentId);
      setLearningStyle(initialStyle);

      // Poll for assessment progress until complete
      const pollInterval = 2000; // 2 seconds
      const maxAttempts = 30; // 1 minute total
      let attempts = 0;

      while (attempts < maxAttempts) {
        const progress = await getLearningAssessmentProgress(newAssessmentId);
        
        if (progress.completed) {
          setLearningStyle(progress.learningStyle);
          setIsLoading(false);
          setAssessmentId(null);
          return progress;
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
        attempts++;
      }

      throw new Error('Assessment timed out');
    } catch (error) {
      setIsLoading(false);
      setAssessmentId(null);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to complete learning assessment');
    }
  }, [studentId]);

  return {
    startAssessment,
    learningStyle,
    isLoading,
    progress
  };
};

export default useLearningAssessment;