/src/components/Chat.js

import { useState } from 'react';
import Message from './Message';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to your learning style assessment. How can I help you today?" }
  ]);

  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <Message key={index} $isUser={message.role === "user"}>
          <p>{message.content}</p>
        </Message>
      ))}
    </div>
  );
};

export default Chat;
