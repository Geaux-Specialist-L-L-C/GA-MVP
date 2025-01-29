import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const CHESHIRE_API = 'https://cheshire.geaux.app';
const MAX_RETRIES = 3;

const questions = [
  "How do you prefer to learn new information?",
  "When solving problems, do you prefer visual aids?",
  "Do you learn better through hands-on activities?",
  "When remembering things, do you recall images or words?"
];

const TakeAssessment = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.post(`${CHESHIRE_API}/auth/token`, {
          username: 'admin',
          password: 'admin'
        });
        setToken(response.data.access_token);
        // Initialize first question after auth
        sendMessage("Let's begin your learning style assessment");
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    authenticate();
  }, []);

  const sendMessage = async (text) => {
    if (isLoading || !token) return;
    
    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", content: text }]);

    try {
      const response = await axios.post(`${CHESHIRE_API}/message`, 
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: response.data.content || response.data.message
        }]);
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Learning Style Assessment</h1>
        <p>Discover your learning preferences</p>
      </Header>

      <AssessmentContainer>
        <MessageList>
          {messages.map((msg, idx) => (
            <Message key={idx} $isUser={msg.role === "user"}>
              {msg.content}
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </MessageList>

        <QuestionPanel>
          <Question>{questions[currentQuestion]}</Question>
          <ButtonGroup>
            <ResponseButton onClick={() => sendMessage("Yes")}>Yes</ResponseButton>
            <ResponseButton onClick={() => sendMessage("No")}>No</ResponseButton>
          </ButtonGroup>
        </QuestionPanel>
      </AssessmentContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const AssessmentContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const MessageList = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
`;

const Message = styled.div`
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
  max-width: 80%;
  ${props => props.$isUser ? `
    background: #007bff;
    color: white;
    margin-left: auto;
  ` : `
    background: #f0f2f5;
    color: #1c1e21;
  `}
`;

const QuestionPanel = styled.div`
  padding: 1rem;
  text-align: center;
`;

const Question = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ResponseButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

export default TakeAssessment;