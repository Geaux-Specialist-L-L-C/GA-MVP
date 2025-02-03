import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CHESHIRE_API = 'https://cheshire.geaux.app';

const TakeAssessment = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Initial system prompt for CheshireCat
  const systemPrompt = `You are an educational assessment expert helping students discover their learning style. 
    Ask open-ended questions to understand their learning preferences. Consider their grade level (K-12) and avoid bias. 
    Focus on understanding how they: 
    - Process new information
    - Engage with learning materials
    - Remember concepts best
    - Solve problems
    Start by asking for their grade level and then adapt questions accordingly.`;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const authenticate = async () => {
      try {
        const response = await axios.post(`${CHESHIRE_API}/auth/token`, {
          username: 'admin',
          password: 'admin'
        });
        setToken(response.data.access_token);
        // Initialize chat with system prompt
        sendMessage(systemPrompt, 'system');
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    authenticate();
  }, [currentUser, navigate]);

  const sendMessage = async (text, role = 'user') => {
    if (isLoading || !token) return;
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role, content: text }]);
      
      const response = await axios.post(`${CHESHIRE_API}/message`, 
        { text, role },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.content || response.data.message
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Learning Style Assessment</h1>
          <p>Let's discover how you learn best through a friendly chat</p>
        </Header>

        <AssessmentContainer>
          <MessageList>
            {messages.map((msg, idx) => (
              <Message key={idx} $isUser={msg.role === 'user'}>
                {msg.content}
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </MessageList>

          <ChatInput onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response here..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </ChatInput>
        </AssessmentContainer>
      </motion.div>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

const AssessmentContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MessageList = styled.div`
  padding: 2rem;
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  max-width: 80%;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.$isUser ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.$isUser ? 'white' : 'var(--text-color)'};
`;

const ChatInput = styled.form`
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid #eee;

  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }

  button {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      background: var(--secondary-color);
    }
  }
`;

export default TakeAssessment;