import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInteractionAnalysis } from '@/hooks/useInteractionAnalysis';
import { Brain, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  learningStyle?: string;
}

export const LearningStyleChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const {
    startInteraction,
    recordFeedback,
    completeInteraction,
    adaptContent,
    learningStyle,
    loading
  } = useInteractionAnalysis();

  // Process and send message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Start tracking interaction
    startInteraction();

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Get AI response
      let response = await processAIResponse(input);

      // Adapt response based on learning style
      if (learningStyle) {
        response = await adaptContent(response);
      }

      // Add AI message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        learningStyle: learningStyle?.style
      };

      setMessages(prev => [...prev, aiMessage]);

      // Complete interaction tracking
      await completeInteraction(input);
    } catch (error) {
      console.error('Error processing message:', error);
      // Handle error...
    }
  };

  // Request clarification or feedback
  const handleClarification = useCallback(async () => {
    recordFeedback();
    // Implement clarification request logic...
  }, [recordFeedback]);

  // Render learning style indicator
  const renderStyleIndicator = () => {
    if (!learningStyle) return null;

    const styles = {
      visual: { icon: '👁️', color: 'bg-blue-100' },
      auditory: { icon: '👂', color: 'bg-green-100' },
      reading: { icon: '📚', color: 'bg-yellow-100' },
      kinesthetic: { icon: '🤚', color: 'bg-purple-100' }
    };

    const style = styles[learningStyle.style as keyof typeof styles];

    return (
      <div className={`px-3 py-1 rounded-full ${style.color} flex items-center gap-2`}>
        <span>{style.icon}</span>
        <span className="capitalize">{learningStyle.style}</span>
        <span className="text-sm opacity-75">
          ({(learningStyle.confidence * 100).toFixed(0)}%)
        </span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Adaptive Learning Chat
        </CardTitle>
        {renderStyleIndicator()}
      </CardHeader>

      <CardContent>
        <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80