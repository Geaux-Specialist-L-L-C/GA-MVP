// File: src/hooks/useDeclarativeMemory.ts
import { useState, useCallback } from 'react';
import { declarativeMemory } from '@/services/declarativeMemory';

interface UseDeclarativeMemoryOptions {
  onError?: (error: Error) => void;
}

export function useDeclarativeMemory(options: UseDeclarativeMemoryOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    if (options.onError) {
      options.onError(error);
    }
  }, [options]);

  const uploadMaterial = useCallback(async (
    file: File,
    metadata: DocumentMetadata
  ) => {
    setLoading(true);
    try {
      await declarativeMemory.storeCurriculumMaterial(file, metadata);
      setError(null);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload material');
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const searchMaterials = useCallback(async (
    query: string,
    filters: Partial<DocumentMetadata> = {}
  ) => {
    setLoading(true);
    try {
      const results = await declarativeMemory.searchCurriculumMaterials(query, filters);
      setError(null);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search materials');
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getRelated = useCallback(async (
    materialId: string,
    limit?: number
  ) => {
    setLoading(true);
    try {
      const results = await declarativeMemory.getRelatedMaterials(materialId, limit);
      setError(null);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get related materials');
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateMetadata = useCallback(async (
    materialId: string,
    updates: Partial<DocumentMetadata>
  ) => {
    setLoading(true);
    try {
      await declarativeMemory.updateMaterialMetadata(materialId, updates);
      setError(null);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update metadata');
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    uploadMaterial,
    searchMaterials,
    getRelated,
    updateMetadata,
    loading,
    error
  };
}