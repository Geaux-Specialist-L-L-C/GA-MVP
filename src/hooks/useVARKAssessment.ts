import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  startVarkAssessment, 
  sendVarkResponse,
  type VarkChatResponse,
  type VarkChatResult
} from '../services/varkService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface Assessment {
  inProgress: boolean;
  sessionId?: string;
  currentQuestion?: string;
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

export const useVARKAssessment = (options?: { studentId?: string; gradeBand?: string }) => {
  const { currentUser } = useAuth();
  const resolvedStudentId = options?.studentId ?? currentUser?.uid;
  const gradeBand = options?.gradeBand;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment>({
    inProgress: false,
    answers: [],
    results: null
  });

  const normalizeResults = (result: VarkChatResult) => {
    const total = result.scores.v + result.scores.a + result.scores.r + result.scores.k;
    const divisor = total > 0 ? total : 1;
    const toPercent = (value: number) => Math.round((value / divisor) * 100);
    const primaryStyle = {
      V: 'Visual',
      A: 'Auditory',
      R: 'Read/Write',
      K: 'Kinesthetic',
      Multi: 'Multimodal'
    }[result.primary] ?? 'Multimodal';

    return {
      visual: toPercent(result.scores.v),
      auditory: toPercent(result.scores.a),
      readWrite: toPercent(result.scores.r),
      kinesthetic: toPercent(result.scores.k),
      primaryStyle
    };
  };

  const appendQuestion = (response: VarkChatResponse) => {
    if (!response.question) {
      return;
    }
    setMessages(prev => [...prev, {
      text: response.question.text,
      sender: 'ai',
      timestamp: new Date().toISOString()
    }]);
    setAssessment(prev => ({
      ...prev,
      currentQuestion: response.question?.text
    }));
  };

  // Initialize assessment when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (currentUser && resolvedStudentId && !assessment.inProgress) {
        setIsLoading(true);
        try {
          const token = await currentUser.getIdToken(true);
          const response = await startVarkAssessment({
            parentId: currentUser.uid,
            studentId: resolvedStudentId,
            gradeBand,
            token
          });
          if (!response.sessionId) {
            throw new Error('Missing sessionId in assessment response');
          }
          setMessages([]);
          appendQuestion(response);
          
          setAssessment(prev => ({
            ...prev,
            inProgress: true,
            sessionId: response.sessionId
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
  }, [currentUser, resolvedStudentId, gradeBand]);

  const sendMessage = async (messageText: string) => {
    if (!currentUser?.uid || !assessment.sessionId || !resolvedStudentId) return;

    const userMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const token = await currentUser.getIdToken(true);
      const response = await sendVarkResponse({
        parentId: currentUser.uid,
        studentId: resolvedStudentId,
        sessionId: assessment.sessionId,
        message: messageText,
        gradeBand,
        token
      });

      setAssessment(prev => ({
        ...prev,
        answers: [...prev.answers, {
          question: prev.currentQuestion ?? '',
          answer: messageText
        }],
        results: response.result ? normalizeResults(response.result) : prev.results,
        isComplete: response.status === 'complete'
      }));

      if (response.status === 'complete' && response.result) {
        const summary = response.result.summary;
        const recommendations = response.result.recommendations
          .map((step) => `- ${step}`)
          .join('\n');
        setMessages(prev => [...prev, {
          text: `${summary}\n${recommendations}`,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }]);
        setAssessment(prev => ({
          ...prev,
          currentQuestion: undefined
        }));
      } else {
        appendQuestion(response);
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
