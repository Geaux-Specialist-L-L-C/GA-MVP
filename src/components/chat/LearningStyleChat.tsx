import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleResponse = async (response: any) => {
    try {
      if (response.learningStyle && studentId) {
        await saveLearningStyle(studentId, response.learningStyle);
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
      const response = await axios.post('https://cheshire.geaux.app/api/chat', {
        message: userMessage,
        userId: currentUser?.uid,
        studentId
      });

      setMessages(prev => [...prev, { text: response.data.message, sender: 'bot' }]);
      await handleResponse(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>🎓 Learning Style Assessment</ChatHeader>
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
