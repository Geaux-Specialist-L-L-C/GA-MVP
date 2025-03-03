// File: /src/types/chat.ts
// Description: Type definitions for chat functionality
// Author: evopimp
// Created: 2025-03-03 06:08:46

export enum MessageType {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isComplete: boolean;
}

export enum LearningStyle {
  VISUAL = "visual",
  AUDITORY = "auditory",
  READING = "reading",
  KINESTHETIC = "kinesthetic",
  MULTIMODAL = "multimodal"
}

export interface LearningStyleResult {
  primaryStyle: LearningStyle;
  scores: {
    [LearningStyle.VISUAL]: number;
    [LearningStyle.AUDITORY]: number;
    [LearningStyle.READING]: number;
    [LearningStyle.KINESTHETIC]: number;
  };
  recommendations: string[];
}