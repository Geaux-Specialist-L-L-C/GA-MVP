// File: /src/services/openAIService.ts
// Description: Service for OpenAI API interactions
// Author: evopimp
// Created: 2025-03-03 06:08:46

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

class OpenAIService {
  private apiKey: string;
  private model: string;
  private apiUrl: string = "https://api.openai.com/v1/chat/completions";

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
    this.model = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o";
    
    if (!this.apiKey) {
      console.error("OpenAI API key is missing. Please add it to your environment variables.");
    }
  }

  async createChatCompletion(messages: OpenAIMessage[]): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();