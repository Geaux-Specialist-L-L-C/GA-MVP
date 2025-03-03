// File: /src/components/chat/ChatInput.tsx
// Description: Input component for chat interface
// Author: evopimp
// Created: 2025-03-03 06:08:46

import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isDisabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isDisabled = false,
  className = ""
}) => {
  const [message, setMessage] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !isDisabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`border-t border-gray-200 p-4 ${className}`}>
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDisabled ? "Assessment complete" : "Type your message..."}
          disabled={isDisabled}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;