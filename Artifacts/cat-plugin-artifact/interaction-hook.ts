// File: src/hooks/useInteractionAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { interactionAnalyzer } from '@/services/interactionAnalysis';

export interface InteractionTelemetry {
  queryStartTime: number;
  feedbackCount: number;
}

export function useInteractionAnalysis() {
  const { user } = useAuth();
  const [currentInteraction, setCurrentInteraction] = useState<InteractionTelemetry | null>(null);
  const [learningStyle, setLearningStyle] = useState<{
    style: string;
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Update learning style prediction periodically
  useEffect(() => {
    if (!user) return;

    const updateLearningStyle = async () => {
      try {
        const prediction = await interactionAnalyzer.predictLearningStyle(user.uid);
        setLearningStyle({
          style: prediction.style,
          confidence: prediction.confidence
        });
      } catch (error) {
        console.error('Failed to update learning style:', error);
      }
    };

    // Update every 5 minutes
    const interval = setInterval(updateLearningStyle, 5 * 60 * 1000);
    updateLearningStyle(); // Initial update

    return () => clearInterval(interval);
  }, [user]);

  // Start tracking a new interaction
  const startInteraction = useCallback(() => {
    setCurrentInteraction({
      queryStartTime: Date.now(),
      feedbackCount: 0
    });
  }, []);

  // Record feedback iteration
  const recordFeedback = useCallback(() => {
    if (currentInteraction) {
      setCurrentInteraction(prev => prev ? {
        ...prev,
        feedbackCount: prev.feedbackCount + 1
      } : null);
    }
  }, [currentInteraction]);

  // Complete and analyze the current interaction
  const completeInteraction = useCallback(async (
    query: string
  ) => {
    if (!user || !currentInteraction) return;

    setLoading(true);
    try {
      await interactionAnalyzer.captureInteraction(
        user.uid,
        query,
        currentInteraction.queryStartTime,
        {
          feedbackIterations: currentInteraction.feedbackCount
        }
      );

      // Update learning style prediction
      const prediction = await interactionAnalyzer.predictLearningStyle(user.uid);
      setLearningStyle({
        style: prediction.style,
        confidence: prediction.confidence
      });
    } catch (error) {
      console.error('Failed to complete interaction:', error);
    } finally {
      setLoading(false);
      setCurrentInteraction(null);
    }
  }, [user, currentInteraction]);

  // Adapt content based on current learning style
  const adaptContent = useCallback(async (
    content: string
  ): Promise<string> => {
    if (!learningStyle) return content;

    try {
      return await interactionAnalyzer.adaptContent(
        content,
        learningStyle.style as any
      );
    } catch (error) {
      console.error('Failed to adapt content:', error);
      return content;
    }
  }, [learningStyle]);

  return {
    startInteraction,
    recordFeedback,
    completeInteraction,
    adaptContent,
    learningStyle,
    loading
  };
}