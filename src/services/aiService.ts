// File: /src/services/aiService.ts
// Description: Service for interacting with Cheshire Cat AI framework
// Author: evopimp
// Created: 2025-02-27

import axios from 'axios';
import { getAuth } from 'firebase/auth';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  sources?: {
    text: string;
    metadata: Record<string, any>;
  }[];
}

export const aiService = {
  /**
   * Send a message to the AI assistant and get a response
   */
  sendMessage: async (message: string, contextId?: string): Promise<ChatResponse> => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Add contextual information if available
      const contextualMessage = contextId 
        ? `[Context: ${contextId}] ${message}`
        : message;
      
      const response = await axios.post('/api/assistant/chat', 
        { content: contextualMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error communicating with AI assistant:', error);
      throw error;
    }
  },
  
  /**
   * Upload learning material to the AI's knowledge base
   */
  uploadMaterial: async (
    file: File, 
    courseId: string, 
    lessonId?: string,
    title?: string,
    description?: string
  ): Promise<any> => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('course_id', courseId);
      
      if (lessonId) formData.append('lesson_id', lessonId);
      if (title) formData.append('title', title || file.name);
      if (description) formData.append('description', description);
      
      const response = await axios.post('/api/assistant/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading material to AI:', error);
      throw error;
    }
  },
  
  /**
   * Analyze the user's learning style based on interactions
   */
  analyzeLearningStyle: async (): Promise<any> => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get('/api/assistant/learning-style', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing learning style:', error);
      throw error;
    }
  }
};