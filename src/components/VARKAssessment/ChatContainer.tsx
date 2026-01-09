import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import VARKResults from './VARKResults';
import { useVARKAssessment } from '../../hooks/useVARKAssessment';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface VARKResults {
  visual: number;
  auditory: number;
  readWrite: number;
  kinesthetic: number;
  primaryStyle: string;
}

interface Assessment {
  inProgress: boolean;
  currentQuestionIndex: number;
  answers: Array<{
    question: string;
    answer: string;
  }>;
  results: VARKResults | null;
  isComplete?: boolean;
}

interface ChatContainerProps {
  studentId?: string;
  gradeBand?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ studentId, gradeBand }) => {
  const {
    messages,
    sendMessage,
    isLoading,
    assessment,
    isComplete
  } = useVARKAssessment({ studentId, gradeBand });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h2 className="text-2xl font-bold">Learning Style Assessment</h2>
        <p className="mt-2 opacity-90">Let's discover how you learn best through a friendly conversation.</p>
      </div>
      
      <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
        {messages.map((msg: Message, index: number) => (
          <ChatMessage 
            key={index} 
            message={msg.text} 
            sender={msg.sender} 
            timestamp={msg.timestamp}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      {isComplete ? (
        <VARKResults results={assessment.results!} />
      ) : (
        <div className="p-4 border-t">
          <ChatInput 
            onSendMessage={sendMessage}
            disabled={isLoading} 
          />
        </div>
      )}
    </motion.div>
  );
};

export default ChatContainer;
