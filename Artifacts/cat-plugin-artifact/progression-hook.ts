// File: src/hooks/useCompetencyProgression.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { competencyProgression } from '@/services/competencyProgression';
import type { CompetencyLevel } from '@/types/progression';

export function useCompetencyProgression(subject?: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dueReviews, setDueReviews] = useState<CompetencyLevel[]>([]);
  const [learningPath, setLearningPath] = useState<string[]>([]);

  // Fetch due reviews on mount and periodically
  useEffect(() => {
    if (!user) return;

    const fetchDueReviews = async () => {
      try {
        const reviews = await competencyProgression.getReviewDueTopics(user.uid);
        setDueReviews(reviews);
      } catch (err) {
        console.error('Failed to fetch due reviews:', err);
      }
    };

    fetchDueReviews();
    const interval = setInterval(fetchDueReviews, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  // Fetch learning path when subject changes
  useEffect(() => {
    if (!user || !subject) return;

    const fetchLearningPath = async () => {
      setLoading(true);
      try {
        const path = await competencyProgression.getRecommendedPath(
          user.uid,
          subject
        );
        setLearningPath(path);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch learning path'));
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [user, subject]);

  // Record assessment result
  const recordAssessment = useCallback(async (
    topic: string,
    score: number
  ) => {
    if (!user || !subject) return;

    setLoading(true);
    try {
      await competencyProgression.recordAssessment(
        user.uid,
        subject,
        topic,
        score
      );

      // Refresh learning path
      const path = await competencyProgression.getRecommendedPath(
        user.uid,
        subject
      );
      setLearningPath(path);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to record assessment'));
    } finally {
      setLoading(false);
    }
  }, [user, subject]);

  return {
    dueReviews,
    learningPath,
    recordAssessment,
    loading,
    error
  };
}