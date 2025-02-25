import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  saveAssessmentResults, 
  startAssessment, 
  sendUserResponse 
} from '../services/varkService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface Assessment {
  inProgress: boolean;
  currentQuestionIndex: number;
  assessmentId?: string;
  isComplete?: boolean;
  answers: Array<{
    question: string;
    answer: string;
  }>;
  results: {
    visual: number;
    auditory: number;
    readWrite: number;
    kinesthetic: number;
    primaryStyle: string;
  } | null;
}

export const useVARKAssessment = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment>({
    inProgress: false,
    currentQuestionIndex: 0,
    answers: [],
    results: null
  });

  // Initialize assessment when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (currentUser && !assessment.inProgress) {
        setIsLoading(true);
        try {
          const response = await startAssessment(currentUser.uid);
          setMessages([{
            text: response.initialMessage,
            sender: 'ai',
            timestamp: new Date().toISOString()
          }]);
          
          setAssessment(prev => ({
            ...prev,
            inProgress: true,
            assessmentId: response.assessmentId
          }));
        } catch (error) {
          console.error('Error starting assessment:', error);
          setMessages([{
            text: 'Sorry, there was an error starting the assessment. Please try again.',
            sender: 'ai',
            timestamp: new Date().toISOString()
          }]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeChat();
  }, [currentUser]);

  const sendMessage = async (messageText: string) => {
    if (!currentUser?.uid || !assessment.assessmentId) return;

    const userMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await sendUserResponse({
        userId: currentUser.uid,
        assessmentId: assessment.assessmentId,
        message: messageText,
        questionIndex: assessment.currentQuestionIndex
      });
      
      setMessages(prev => [...prev, {
        text: response.message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
      
      setAssessment(prev => ({
        ...prev,
        currentQuestionIndex: response.nextQuestionIndex,
        answers: [...prev.answers, {
          question: response.currentQuestion,
          answer: messageText
        }],
        results: response.results || null,
        isComplete: response.isComplete
      }));
      
      if (response.isComplete && response.results) {
        await saveAssessmentResults(currentUser.uid, response.results);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: "I'm sorry, there was an error processing your response. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    assessment,
    isComplete: assessment.isComplete || false
  };
};