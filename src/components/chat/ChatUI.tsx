import React, { useState } from 'react';
import { assessLearningStyle } from '../../services/assessmentService';
import { useAuth } from '../../contexts/AuthContext';
import './ChatUI.css';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

const ChatUI: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;
    if (!studentId) {
      setError('Missing student ID. Open the assessment from a student profile.');
      return;
    }

    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken(true);
      const result = await assessLearningStyle({
        parentId: currentUser.uid,
        studentId,
        token,
        messages: [
          { role: 'user', content: inputText }
        ]
      });

      const tutorMessage: Message = {
        sender: 'tutor',
        text: `Learning style: ${result.learningStyle}\n${result.explanation}`
      };
      setMessages(prev => [...prev, tutorMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Assessment failed.';
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
      {error && <div className="message tutor">{error}</div>}
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
