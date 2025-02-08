import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { FaPaperPlane } from "react-icons/fa";

const API_URL = "https://cheshire.geaux.app/api/chat";

const LearningStyleChat: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
    { text: "Hello! I'm here to help identify your learning style. Let's begin!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: { text: string; sender: "user" | "bot" } = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        user_id: currentUser?.uid,
        message: input
      });

      const botMessage: { text: string; sender: "user" | "bot" } = { text: response.data.reply, sender: "bot" };
      setMessages([...messages, userMessage, botMessage]);

      if (response.data.learningStyle) {
        saveLearningStyle(response.data.learningStyle);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages([...messages, { text: "Oops! Something went wrong.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  const saveLearningStyle = async (learningStyle: string) => {
    try {
      await axios.post("https://cheshire.geaux.app/api/save-style", {
        user_id: currentUser?.uid,
        learningStyle
      });
      setMessages([...messages, { text: `Your learning style has been saved as: ${learningStyle}`, sender: "bot" }]);
    } catch (error) {
      console.error("Error saving learning style:", error);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>🎓 Learning Style Chat</ChatHeader>
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
        />
        <SendButton onClick={sendMessage}><FaPaperPlane /></SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  max-width: 500px;
  margin: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
`;

const ChatBody = styled.div`
  padding: 15px;
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div<{ sender: "user" | "bot" }>`
  background: ${({ sender }) => (sender === "user" ? "#007bff" : "#f1f1f1")};
  color: ${({ sender }) => (sender === "user" ? "white" : "black")};
  align-self: ${({ sender }) => (sender === "user" ? "flex-end" : "flex-start")};
  padding: 10px;
  border-radius: 8px;
  margin: 5px 0;
  max-width: 75%;
`;

const ChatFooter = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin-left: 5px;
  border-radius: 4px;
  cursor: pointer;
`;

export default LearningStyleChat;