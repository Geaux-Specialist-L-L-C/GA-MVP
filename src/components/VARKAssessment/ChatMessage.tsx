import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  const isUser = sender === 'user';
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-blue-600 text-white ml-auto rounded-br-sm' 
          : 'bg-white shadow-md rounded-bl-sm'
      }`}>
        <p className="text-sm sm:text-base whitespace-pre-wrap">{message}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formattedTime} • {isUser ? 'You' : 'AI Tutor'}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;