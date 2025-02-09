import React, { useState } from 'react';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';
import './ChatUI.css';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;
    
    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const chatId = 'default';
      const response = await CheshireService.sendChatMessage(
        inputText,
        currentUser.uid,
        chatId
      );

      const tutorMessage: Message = {
        sender: 'tutor',
        text: response.data
      };
      setMessages(prev => [...prev, tutorMessage]);

      const memories = response.memories || [];
      if (memories.length > 0) {
        const learningStyleMemory = memories.find(
          memory => memory.metadata?.learning_style
        );
        if (learningStyleMemory?.metadata?.learning_style) {
          console.log('Learning style detected:', learningStyleMemory.metadata.learning_style);
        }
      }
    } catch (error) {
      const errorMessage = CheshireService.getErrorMessage(error);
      setMessages(prev => [...prev, { sender: 'tutor', text: errorMessage }]);
    } finally {
      setIsProcessing(false);
    }
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && (
          <div className="message tutor processing">
            Thinking...
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          placeholder="Type your message..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
          disabled={isProcessing}
        />
        <button 
          onClick={handleSend}
          disabled={isProcessing || !inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;