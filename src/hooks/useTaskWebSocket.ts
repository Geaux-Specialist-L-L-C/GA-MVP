// frontend/src/hooks/useTaskWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import type { TaskStatus, TaskResult } from '../types/task';
import websocketService from '../services/websocketService';

export const useTaskWebSocket = (taskId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [result, setResult] = useState<TaskResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!taskId) return;

    // Set up event subscriptions
    const unsubscribeConnect = websocketService.subscribe('connect', () => {
      setIsConnected(true);
      setError(null);
      websocketService.subscribeToTask(taskId);
    });

    const unsubscribeDisconnect = websocketService.subscribe('disconnect', () => {
      setIsConnected(false);
    });

    const unsubscribeError = websocketService.subscribe('error', (error: Error) => {
      setError(error);
    });

    const unsubscribeTaskUpdate = websocketService.subscribe('task_update', (status: TaskStatus) => {
      setStatus(status);
    });

    const unsubscribeTaskResult = websocketService.subscribe('task_result', (result: TaskResult) => {
      setResult(result);
    });

    // Connect to WebSocket server
    websocketService.connect().catch(error => {
      setError(error);
    });

    // Cleanup function
    return () => {
      // Unsubscribe from all events
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
      unsubscribeTaskUpdate();
      unsubscribeTaskResult();

      // If we have no more active tasks, disconnect the WebSocket
      if (!websocketService.hasActiveSubscriptions()) {
        websocketService.disconnect();
      }
    };
  }, [taskId]);

  // Reset state when taskId changes
  useEffect(() => {
    setStatus(null);
    setResult(null);
    setError(null);
  }, [taskId]);

  // Expose WebSocket status and data to component
  return {
    isConnected,
    status,
    result,
    error
  };
};