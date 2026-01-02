import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { assessLearningStyle, checkAssessmentHealth } from '../../services/assessmentService';
import Button from '../common/Button';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

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

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await checkAssessmentHealth();
    setConnectionError(!isConnected);
  };

  const formatAssessmentResponse = (result: {
    learningStyle: string;
    explanation: string;
    nextSteps: string[];
  }) => {
    const steps = result.nextSteps.map((step) => `- ${step}`).join('\n');
    return [
      `Based on your answers, your learning style is ${result.learningStyle}.`,
      result.explanation,
      'Next steps:',
      steps
    ].join('\n');
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      if (!currentUser) {
        setMessages((prev) => [
          ...prev,
          { text: 'Please sign in to continue the assessment.', sender: 'bot' }
        ]);
        return;
      }
      if (!studentId) {
        setMessages((prev) => [
          ...prev,
          { text: 'Missing student information. Please try again.', sender: 'bot' }
        ]);
        return;
      }

      setLoading(true);
      const token = await currentUser.getIdToken(true);
      const apiMessages = [...messages, { text: userMessage, sender: 'user' }].map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const result = await assessLearningStyle({
        parentId: currentUser.uid,
        studentId,
        messages: apiMessages,
        token
      });

      setMessages((prev) => [
        ...prev,
        { text: formatAssessmentResponse(result), sender: 'bot' }
      ]);
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const message = getFriendlyErrorMessage(error);
      setMessages((prev) => [...prev, { text: message, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>⚠️ Connection Error - Check if the assessment service is running</ConnectionError>
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
        <Button onClick={sendMessage} $variant="primary">
          <FaPaperPlane />
        </Button>
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

export default LearningStyleChat;

const getFriendlyErrorMessage = (error: unknown) => {
  const status = (error as { status?: number }).status;
  if (status === 401) {
    return 'Please sign in again to continue your assessment.';
  }
  if (status === 403) {
    return 'You do not have access to this student.';
  }
  if (status === 404) {
    return 'We could not find that student record. Please try again.';
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
};
