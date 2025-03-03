// File: /src/hooks/useAnalysis.tsx
// Description: Hook for analyzing learning style assessment responses
// Author: evopimp
// Created: 2025-03-03 06:08:46

import { useState } from "react";
import { Message, LearningStyleResult, LearningStyle } from "@/types/chat";
import { openAIService } from "@/services/openAIService";
import { saveAssessmentResult } from "@/services/learningStyleService";
import { useAuth } from "@/hooks/useAuth";

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const analyzeResponses = async (messages: Message[]): Promise<LearningStyleResult> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Prepare the conversation for analysis
      const conversationText = messages.map(msg => 
        `${msg.type}: ${msg.content}`
      ).join("\n\n");
      
      // Create system prompt for analysis
      const systemPrompt = {
        role: "system",
        content: `You are a learning style analyzer. Based on the conversation below, analyze the user's VARK 
        (Visual, Auditory, Reading/Writing, Kinesthetic) learning style preferences. The conversation contains 
        user responses to an assessment. Provide the analysis in the following JSON format:
        {
          "primaryStyle": "visual|auditory|reading|kinesthetic|multimodal",
          "scores": {
            "visual": 0-10,
            "auditory": 0-10,
            "reading": 0-10,
            "kinesthetic": 0-10
          },
          "recommendations": ["1-3 specific study recommendations based on their learning style"]
        }
        Only respond with the properly formatted JSON.`
      };
      
      const userPrompt = {
        role: "user",
        content: `Analyze this conversation for VARK learning style preferences:\n${conversationText}`
      };
      
      // Call OpenAI for analysis
      const analysisResponse = await openAIService.createChatCompletion([systemPrompt, userPrompt]);
      
      // Parse the response to get the learning style result
      const result: LearningStyleResult = JSON.parse(analysisResponse);
      
      // Save the result if a user is logged in
      if (user) {
        await saveAssessmentResult(user.uid, result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze responses";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeResponses,
    isAnalyzing,
    error
  };
}