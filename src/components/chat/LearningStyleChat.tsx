import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import { CheshireService } from '../../services/cheshireService';
import LoadingSpinner from '../common/LoadingSpinner';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'http://localhost:1865'; // Update this for production

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Initialize chat with assessment start message
  useEffect(() => {
    setMessages([{ 
      text: "Hi! I'm here to help assess your learning style. Let's start with a few questions. How do you prefer to learn new things?", 
      sender: "bot" 
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async () => {
    const isConnected = await CheshireService.checkConnection();
    setConnectionError(!isConnected);
  };

  const retryWithDelay = async (fn: () => Promise<any>, retries: number = MAX_RETRIES): Promise<any> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return retryWithDelay(fn, retries - 1);
      }
      throw error;
    }
  };

  const handleResponse = async (response: any) => {
    try {
      // Check if response contains learning style data
      const learningStyle = response?.data?.memories?.find((m: any) => 
        m.metadata?.learning_style
      )?.metadata?.learning_style;

      if (learningStyle && studentId) {
        await saveLearningStyle(studentId, learningStyle);
        await updateStudentAssessmentStatus(studentId, "completed");
      }
    } catch (error) {
      console.error('Error saving learning style:', error);
      setMessages(prev => [...prev, { 
        text: "There was an error saving your learning style. Please try again.", 
        sender: "bot" 
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      setLoading(true);
      const response = await CheshireService.sendChatMessage(
        userMessage,
        currentUser?.uid || 'anonymous',
        studentId || 'default'
      );

      if (response.data) {
        setMessages(prev => [...prev, { text: response.data, sender: 'bot' }]);
      }
      
      await handleResponse(response.data);
      setConnectionError(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = CheshireService.getErrorMessage(error);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      setConnectionError(true);
      checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>
            ⚠️ Connection Error - Check if the chat service is running
          </ConnectionError>
        )}
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>{msg.text}</Message>
        ))}
        {loading && <Message sender="bot">Typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBody>
      <ChatFooter>
        <ChatInput
          type="text"
          value={input}
          placeholder="Type your response..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="form-input"
        />
        <SendButton onClick={sendMessage} className="btn btn-primary">
          <FaPaperPlane />
        </SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

const SendButton = styled.button`
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LearningStyleChat;
