// frontend/src/services/agentService.ts
import { apiClient } from '../utils/apiClient';
import { TaskRequest, TaskStatus, TaskResult } from '../types/task';

export const agentService = {
  /**
   * Create a new agent task
   */
  createTask: async (taskRequest: TaskRequest): Promise<string> => {
    const response = await apiClient.post('/api/tasks', taskRequest);
    return response.data.task_id;
  },
  
  /**
   * Get the status of a task
   */
  getTaskStatus: async (taskId: string): Promise<TaskStatus> => {
    const response = await apiClient.get(`/api/tasks/${taskId}/status`);
    return response.data;
  },
  
  /**
   * Poll for task status until completion or error
   */
  pollTaskStatus: async (
    taskId: string, 
    onStatusUpdate: (status: TaskStatus) => void,
    intervalMs: number = 2000,
    maxAttempts: number = 30
  ): Promise<TaskResult | null> => {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await agentService.getTaskStatus(taskId);
          onStatusUpdate(status);
          
          if (status.status === 'completed') {
            clearInterval(interval);
            resolve(status.result);
          } else if (status.status === 'failed') {
            clearInterval(interval);
            reject(new Error(status.details || 'Task failed'));
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Task polling timed out'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, intervalMs);
    });
  }
};