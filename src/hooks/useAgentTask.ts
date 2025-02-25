// frontend/src/hooks/useAgentTask.ts
import { useState, useCallback } from 'react';
import { agentService } from '../services/agentService';
import { TaskRequest, TaskStatus, TaskResult } from '../types/task';

export const useAgentTask = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [result, setResult] = useState<TaskResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const startTask = useCallback(async (taskRequest: TaskRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newTaskId = await agentService.createTask(taskRequest);
      setTaskId(newTaskId);
      
      // Start polling for task status
      agentService.pollTaskStatus(
        newTaskId,
        (newStatus) => setStatus(newStatus),
        2000,  // Poll every 2 seconds
        30     // Max 30 attempts (60 seconds total)
      )
      .then((taskResult) => {
        setResult(taskResult);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
      
      return newTaskId;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, []);
  
  const cancelTask = useCallback(() => {
    // Would implement task cancellation if the API supports it
    setLoading(false);
  }, []);
  
  return {
    taskId,
    status,
    result,
    loading,
    error,
    startTask,
    cancelTask
  };
};