// File: /src/types/task.ts
// Description: Type definitions for task-related data structures
// Author: GitHub Copilot
// Created: 2024

export interface TaskStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  task_id: string;
  last_updated?: string;
  details?: string;
}

export interface TaskResult {
  content: any;
  metadata?: {
    agent_id?: string;
    agent_name?: string;
    agent_role?: string;
    [key: string]: any;
  };
}

export interface TaskRequest {
  task_type: string;
  subject: string;
  grade_level: string;
  learning_style: string;
  custom_params?: Record<string, any>;
}