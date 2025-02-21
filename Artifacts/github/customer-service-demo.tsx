import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, Loader2, Languages, Bot } from 'lucide-react';

// Mock API client for demo purposes
const mockApiClient = {
  initializeChat: async () => {
    return {
      chatId: 'demo-' + Math.random().toString(36).substr(2, 9),
      suggestedResponses: [
        { text: "What are your business hours?", confidence: 0.9 },
        { text: "How do I reset my password?", confidence: 0.85 },
        { text: "Can I get a refund?", confidence: 0.8 }
      ]
    };
  },
  sendMessage: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const responses = {
      "What are your business hours?": {
        text: "Our business hours are Monday to Friday, 9 AM to 6 PM EST.",
        type: "text"
      },
      "How do I reset my password?": {
        text: "To reset your password, please click on the 'Forgot Password' link on the login page. We'll send you an email with instructions.",
        type: "text"
      },
      "Can I get a refund?": {
        text: "Our refund policy allows returns within 30 days of purchase. Would you like to initiate a refund request?",
        type: "quick_replies",
        components: [
          { type: "button", data: { text: "Yes, start refund" } },
          { type: "button", data: { text: "No, just asking" } }
        ]
      }
    };

    return responses[message] || {
      text: "I understand you're asking about " + message + ". Let me help you with that. What specific information would you like to know?",
      type: "text"
    };
  }
};

const CustomerServiceDemo = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [suggestedResponses, setSuggestedResponses] = useState([]);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const response = await mockApiClient.initializeChat();
        setChatId(response.chatId);
        setSuggestedResponses(response.suggestedResponses);
      } catch (err) {
        setError('Failed to initialize chat. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { type: 'user', content: message }]);
      setInputMessage('');

      const response = await mockApiClient.sendMessage(message);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.text,
        components: response.components
      }]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            <CardTitle>Customer Service Bot</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">EN</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                <p>Hello! I'm here to help you. How can I assist you today?</p>
              </div>
            </div>
            
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-500' : 'bg-blue-100'
                }`}>
                  {message.type === 'user' ? (
                    <MessageSquare className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className={`rounded-lg p-3 max-w-md ${
                  message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}>
                  <p>{message.content}</p>
                  {message.components && (
                    <div className="mt-2 flex gap-2">
                      {message.components.map((component, idx) => (
                        component.type === 'button' && (
                          <Button
                            key={idx}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickReply(component.data.text)}
                          >
                            {component.data.text}
                          </Button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p>Typing...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mx-4 my-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestedResponses.length > 0 && messages.length === 0 && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(response.text)}
                >
                  {response.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerServiceDemo;