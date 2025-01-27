import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const TakeAssessment = () => {
  const [messages, setMessages] = useState([
    { 
      role: "system", 
      content: "Welcome to your learning style assessment. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    setError("");
    setIsLoading(true);
    const newMessage = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AZURE_ENDPOINT}/openai/deployments/${process.env.REACT_APP_MODEL_NAME}/chat/completions`,
        {
          messages: [...messages, newMessage].map(({ role, content }) => ({ role, content })),
          max_tokens: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_AZURE_API_KEY,
          },
        }
      );

      const botMessage = {
        ...response.data.choices[0].message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setError("Failed to get AI response. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container>
      <Header>
        <h1>Take Assessment</h1>
        <p>Interact with our AI to discover your learning style!</p>
      </Header>
      <ChatContainer>
        <ChatMessages>
          {messages.map((message, index) => (
            <Message 
              key={index} 
              role={message.role} 
              aria-label={`${message.role} message`}
            >
              <MessageContent>{message.content}</MessageContent>
              <Timestamp>{message.timestamp.toLocaleTimeString()}</Timestamp>
            </Message>
          ))}
          {isLoading && <LoadingMessage aria-live="polite">AI is thinking...</LoadingMessage>}
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
          <div ref={messagesEndRef} />
        </ChatMessages>
        <ChatInput>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            aria-label="Message input"
          />
          <SendButton 
            onClick={sendMessage} 
            disabled={isLoading}
            aria-label="Send message"
          >
            {isLoading ? "Sending..." : "Send"}
          </SendButton>
        </ChatInput>
      </ChatContainer>
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
  margin-bottom: 2rem;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
`;

const ChatContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ChatMessages = styled.div`
  padding: 1.5rem;
  height: 500px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.role === 'user' ? '#e3f2fd' : '#f5f5f5'};
  align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #666;
  display: block;
  margin-top: 0.5rem;
`;

const ChatInput = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 1rem;
  font-size: 1rem;

  &:disabled {
    background: #f5f5f5;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 0.5rem;
  color: #666;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background: #ffebee;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  text-align: center;
`;

export default TakeAssessment;