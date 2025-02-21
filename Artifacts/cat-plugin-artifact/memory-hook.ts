// File: src/hooks/useMemorySystem.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dualMemorySystem } from '@/services/memoryService';
import { LearningSession } from '@/types/memory';

export function useMemorySystem() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningPatterns, setLearningPatterns] = useState<LearningSession[]>([]);

  // Fetch learning patterns on mount and user change
  useEffect(() => {
    if (user) {
      fetchLearningPatterns();
    }
  }, [user]);

  // Store a new learning interaction
  const storeInteraction = useCallback(async (
    content: string,
    metadata: Record<string, any>
  ) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const success = await dualMemorySystem.storeInteraction(content, {
        userId: user.uid,
        timestamp: new Date(),
        ...metadata
      });

      if (success) {
        // Refresh patterns after storing new interaction
        await fetchLearningPatterns();
      }

      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to store interaction');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch and analyze learning patterns
  const fetchLearningPatterns = useCallback(async (timeframe?: number) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const patterns = await dualMemorySystem.analyzeLearningPatterns(
        user.uid,
        timeframe
      );
      setLearningPatterns(patterns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch learning patterns');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Search declarative memory
  const searchMemory = useCallback(async (
    query: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return [];

    try {
      return await dualMemorySystem.searchDeclarativeMemory(query, {
        userId: user.uid,
        ...metadata
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search memory');
      return [];
    }
  }, [user]);

  return {
    storeInteraction,
    fetchLearningPatterns,
    searchMemory,
    learningPatterns,
    loading,
    error
  };
}