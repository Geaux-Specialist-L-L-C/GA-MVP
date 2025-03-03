// File: /src/hooks/useOpenAI.tsx
// Description: Hook for OpenAI API integration
// Author: evopimp
// Created: 2025-03-03 06:08:46

import { useState } from "react";
import { Message, MessageType } from "@/types/chat";
import { openAIService } from "@/services/openAIService";

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string, previousMessages: Message[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert our messages to the format expected by OpenAI
      const formattedMessages = previousMessages.map(msg => ({
        role: msg.type === MessageType.USER ? "user" : 
              msg.type === MessageType.ASSISTANT ? "assistant" : "system",
        content: msg.content
      }));

      // Add the current message
      formattedMessages.push({
        role: "user",
        content
      });

      // Get assessment-specific system message
      const systemMessage = {
        role: "system",
        content: `You are a learning style assessment assistant for Geaux Academy. 
        Your goal is to determine the user's VARK (Visual, Auditory, Reading/Writing, Kinesthetic) learning style preferences 
        through a conversation. Ask questions that help identify their preferences without explicitly mentioning VARK.
        Focus on how they prefer to learn new information, study habits, and what kinds of learning experiences they enjoy.
        Limit your assessment to 5-6 questions. Be conversational and engaging. After the last question, tell them you've 
        completed the assessment and will analyze their results.`
      };

      // Add system message at the beginning
      formattedMessages.unshift(systemMessage);

      // Call OpenAI service
      const response = await openAIService.createChatCompletion(formattedMessages);
      
      return {
        id: `assistant-${Date.now()}`,
        content: response,
        type: MessageType.ASSISTANT,
        timestamp: new Date()
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
}