import axios from 'axios';

const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL;

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

export class CheshireService {
  static async checkConnection(): Promise<boolean> {
    try {
      await axios.get(`${CHESHIRE_API_URL}/`);
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    const response = await axios.post<CheshireResponse>(`${CHESHIRE_API_URL}/message`, {
      text: message
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    
    // Extract the response text from the Cheshire Cat format
    return {
      data: response.data.response,
      memories: response.data.memories
    };
  }

  static getErrorMessage(error: any): string {
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}