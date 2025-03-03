// File: /src/components/chat/ChatMessage.tsx
// Description: Individual chat message component
// Author: evopimp
// Created: 2025-03-03 06:08:46

import React from "react";
import { Message, MessageType } from "@/types/chat";
import { formatTime } from "@/utils/formatters";

interface ChatMessageProps {
  message: Message;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className = "" }) => {
  const getMessageStyles = () => {
    switch (message.type) {
      case MessageType.USER:
        return "bg-primary-100 ml-auto text-gray-800";
      case MessageType.ASSISTANT:
        return "bg-primary-600 text-white";
      case MessageType.SYSTEM:
        return "bg-gray-200 text-gray-800 mx-auto";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <div 
        className={`p-3 rounded-lg max-w-[80%] ${getMessageStyles()}`}
      >
        {message.content}
      </div>
      <span className="text-xs text-gray-500 mt-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};

export default ChatMessage;