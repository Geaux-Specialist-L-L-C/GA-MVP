# React Application Structure and Content - Part 13

Generated on: 2025-12-29 15:16:30

## /src/components/chat/ChatUI.tsx

```tsx
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
```

---

## /src/components/chat/LearningStyleChat.tsx

```tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import { CheshireService } from '../../services/cheshireService';
import { LearningStyle } from '../../types/profiles';
import Button from '../common/Button';

type ValidLearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface CheshireResponse {
  data: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireError {
  code?: string;
  message: string;
}

const isValidLearningStyle = (style: string): style is ValidLearningStyle => {
  return ['visual', 'auditory', 'kinesthetic', 'reading/writing'].includes(style);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Initialize chat with assessment start message
  useEffect(() => {
    setMessages([{ 
      text: "Hi! I'm here to help assess your learning style. Let's start with a few questions. How do you prefer to learn new things?", 
      sender: "bot" 
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await CheshireService.checkConnection();
    setConnectionError(!isConnected);
  };

  const retryWithDelay = async (fn: () => Promise<void>, maxRetries = 3, delay = 1000): Promise<void> => {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithDelay(fn, maxRetries - 1, delay);
      }
      throw error;
    }
  };

  const handleResponse = async (response: CheshireResponse): Promise<void> => {
    const rawLearningStyle = response?.memories?.find(m => m.metadata?.learning_style)?.metadata?.learning_style;
    if (rawLearningStyle && isValidLearningStyle(rawLearningStyle) && studentId) {
      const learningStyle: LearningStyle = {
        type: rawLearningStyle,
        strengths: [],
        recommendations: []
      };
      try {
        await saveLearningStyle(studentId, learningStyle);
        await updateStudentAssessmentStatus(studentId, "completed");
      } catch (error) {
        console.error('Error saving learning style:', error);
        setMessages(prev => [...prev, { 
          text: "There was an error saving your learning style. Please try again.", 
          sender: "bot" 
        }]);
      }
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      setLoading(true);
      const response = await CheshireService.sendChatMessage(
        userMessage,
        currentUser?.uid || 'anonymous',
        studentId || 'default'
      );

      if (response) {
        setMessages(prev => [...prev, { text: response.data, sender: 'bot' }]);
        await handleResponse(response);
      }
      
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = CheshireService.getErrorMessage(error as CheshireError);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>
            ⚠️ Connection Error - Check if the chat service is running
          </ConnectionError>
        )}
      </ChatHeader>
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
          className="form-input"
        />
        <Button onClick={sendMessage} $variant="primary">
          <FaPaperPlane />
        </Button>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

export default LearningStyleChat;
```

---

## /src/components/chat/TestChat.tsx

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';

const TestChat: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');
  const [testMessage, setTestMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { currentUser } = useAuth();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await CheshireService.checkConnection();
      setConnectionStatus(isConnected ? 'Connected ✅' : 'Not connected ❌');
    } catch (error) {
      setConnectionStatus('Connection failed ❌');
      setError(CheshireService.getErrorMessage(error));
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim() || !currentUser?.uid) return;

    try {
      setError('');
      const result = await CheshireService.sendChatMessage(
        testMessage,
        currentUser.uid,
        'test'
      );
      setResponse(result.data);
      if (result.memories?.length) {
        console.log('Memories received:', result.memories);
      }
    } catch (error) {
      setError(CheshireService.getErrorMessage(error));
    }
  };

  return (
    <TestContainer>
      <TestCard>
        <h2>Cheshire Service Test</h2>
        
        <StatusSection>
          <h3>Connection Status:</h3>
          <StatusText>{connectionStatus}</StatusText>
          <RefreshButton onClick={checkConnection}>
            Refresh Connection
          </RefreshButton>
        </StatusSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TestSection>
          <h3>Send Test Message:</h3>
          <TestInput
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
          />
          <SendButton 
            onClick={handleTestMessage}
            disabled={!testMessage.trim() || !currentUser}
          >
            Send Message
          </SendButton>
        </TestSection>

        {response && (
          <ResponseSection>
            <h3>Response:</h3>
            <ResponseText>{response}</ResponseText>
          </ResponseSection>
        )}
      </TestCard>
    </TestContainer>
  );
};

const TestContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const TestCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }

  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const StatusSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const StatusText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
`;

const TestInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ResponseSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ResponseText = styled.div`
  white-space: pre-wrap;
  font-family: monospace;
  padding: 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const SendButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default TestChat;
```

---

## /src/components/error-boundaries/WebSocketErrorBoundary.tsx

```tsx
// File: /src/components/error-boundaries/WebSocketErrorBoundary.tsx
// Description: Error boundary for handling WebSocket connection failures
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebSocketErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to your error reporting service
    console.error('WebSocket Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorMessage>
            Connection Error: Unable to establish real-time connection
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Retry Connection
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  padding: 1rem;
  border: 1px solid #fee2e2;
  border-radius: 0.375rem;
  background-color: #fef2f2;
  margin: 1rem 0;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #b91c1c;
  }
`;

export default WebSocketErrorBoundary;
```

---

## /src/components/error-boundaries/__tests__/WebSocketErrorBoundary.test.tsx

```tsx
// File: /src/components/error-boundaries/__tests__/WebSocketErrorBoundary.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WebSocketErrorBoundary from '../WebSocketErrorBoundary';

// Mock component that throws an error
const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test WebSocket error');
  }
  return <div>No error</div>;
};

describe('WebSocketErrorBoundary', () => {
  beforeEach(() => {
    // Reset console.error to prevent noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <WebSocketErrorBoundary>
        <div>Test content</div>
      </WebSocketErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <WebSocketErrorBoundary>
        <ErrorComponent shouldThrow />
      </WebSocketErrorBoundary>
    );

    expect(screen.getByText(/Connection Error/)).toBeInTheDocument();
    expect(screen.getByText(/Retry Connection/)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn();

    render(
      <WebSocketErrorBoundary onRetry={mockOnRetry}>
        <ErrorComponent shouldThrow />
      </WebSocketErrorBoundary>
    );

    fireEvent.click(screen.getByText(/Retry Connection/));
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('renders custom fallback when provided', () => {
    const fallback = <div>Custom error message</div>;

    render(
      <WebSocketErrorBoundary fallback={fallback}>
        <ErrorComponent shouldThrow />
      </WebSocketErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('resets error state after retry', () => {
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      
      return (
        <WebSocketErrorBoundary onRetry={() => setShouldThrow(false)}>
          <ErrorComponent shouldThrow={shouldThrow} />
        </WebSocketErrorBoundary>
      );
    };

    render(<TestComponent />);

    // Initially shows error
    expect(screen.getByText(/Connection Error/)).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByText(/Retry Connection/));

    // Should show success state
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
```

---

## /src/components/templates/DashboardLayout.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import AuthForm from '../organisms/AuthForm';
import AssessmentFlow from '../organisms/AssessmentFlow';

interface DashboardLayoutProps {
  userData: {
    name: string;
    email: string;
    profilePicture: string;
  };
  routeContext: {
    currentRoute: string;
  };
  children: React.ReactNode;
  onLogout: () => void;
  sidebar?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userData,
  routeContext,
  children,
  onLogout,
  sidebar = true,
}) => {
  return (
    <Container>
      <Header>
        <Profile>
          <ProfilePicture src={userData.profilePicture} alt={`${userData.name}'s profile`} />
          <ProfileInfo>
            <Name>{userData.name}</Name>
            <Email>{userData.email}</Email>
          </ProfileInfo>
        </Profile>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>
      <Main>
        {sidebar && <Sidebar>Sidebar content here</Sidebar>}
        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4a90e2;
  color: white;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-weight: bold;
`;

const Email = styled.span`
  font-size: 0.875rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Main = styled.main`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #f4f4f4;
  padding: 1rem;
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem;
`;

export default DashboardLayout;
```

---

## /src/components/auth/AuthErrorDialog.tsx

```tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '../../theme';
import styled from 'styled-components';

interface AuthError {
  message: string;
  retry?: boolean;
}

interface AuthErrorDialogProps {
  open: boolean;
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => Promise<void>;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}): JSX.Element | null => {
  if (!error) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <CloseIconButton
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </CloseIconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button 
            onClick={onRetry} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Try Again
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

interface StyledProps {
  theme: Theme;
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: ${({ theme }: StyledProps) => theme.spacing.md};
  }
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }: StyledProps) => theme.spacing.sm};
  top: ${({ theme }: StyledProps) => theme.spacing.sm};
`;

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }: StyledProps) => theme.spacing.md} 0 0;
`;

export default AuthErrorDialog;
```

---

## /src/components/auth/AuthRoute.tsx

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Allow access to auth pages if not authenticated
  return <>{children}</>;
};

export default AuthRoute;
```

---

## /src/components/auth/Login.css

```css
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-form h2 {
    text-align: center;
    color: #2C3E50;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-weight: 500;
    font-size: 1rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input::placeholder {
    color: #a0aec0;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.login-button:hover {
    background-color: #4338ca;
}

.login-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

.error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
}

.login-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
}

.login-footer p {
    margin-bottom: 0.5rem;
    color: #4a5568;
}

.login-footer a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
}

.login-footer a:hover {
    text-decoration: underline;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.divider span {
    padding: 0 10px;
    color: #64748b;
    font-size: 0.875rem;
}

.google-button {
    width: 100%;
    padding: 0.75rem;
    background-color: white;
    color: #333;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.2s ease;
}

.google-button:hover {
    background-color: #f8fafc;
}

.google-button img {
    width: 18px;
    height: 18px;
}

@media (max-width: 480px) {
    .login-form {
        padding: 1.5rem;
    }
}
```

---

## /src/components/auth/LoginForm.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
import Button from '../common/Button';
import FormGroup from '../molecules/FormGroup';
import './auth.css';

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc3545;
  &:hover {
    opacity: 0.7;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const LoginForm: React.FC = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      <FormGroup
        label="Email"
        inputs={[{
          placeholder: 'Enter your email',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          error: false
        }]}
      />
      <FormGroup
        label="Password"
        inputs={[{
          placeholder: 'Enter your password',
          value: password,
          onChange: (e) => setPassword(e.target.value),
          error: false
        }]}
      />
      <Button type="submit" $variant="primary">
        Login
      </Button>
      <GoogleLoginButton />
    </Form>
  );
};

export default LoginForm;
```

---

## /src/components/auth/SignUp.css

```css
.signup-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
}
```

---

## /src/components/auth/SignUp.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';
import FormGroup from '../molecules/FormGroup';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const createCheshireAccount = async (uid: string, email: string) => {
    try {
      await CheshireService.createCheshireUser(uid, email);
    } catch (error) {
      console.error('Error creating Cheshire account:', error);
      throw new Error('Failed to create Cheshire account');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(formData.email, formData.password);
      
      if (userCredential?.user) {
        await createCheshireAccount(userCredential.user.uid, userCredential.user.email || '');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>Create an Account</h2>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <DismissButton onClick={() => setError('')}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup
            label="Email"
            inputs={[{
              placeholder: 'Enter your email',
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              error: false
            }]}
          />
          <FormGroup
            label="Password"
            inputs={[{
              placeholder: 'Enter your password',
              value: formData.password,
              onChange: (e) => setFormData({ ...formData, password: e.target.value }),
              error: false
            }]}
          />
          <FormGroup
            label="Confirm Password"
            inputs={[{
              placeholder: 'Confirm your password',
              value: formData.confirmPassword,
              onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
              error: false
            }]}
          />
          <Button type="submit" $variant="primary">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Form>

        <Divider>
          <span>Or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle />
          <span>Sign up with Google</span>
        </GoogleButton>

        <LoginPrompt>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginPrompt>
      </SignUpCard>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  span {
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
`;

const Link = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc2626;
  &:hover {
    opacity: 0.7;
  }
`;

export default SignUp;
```

---

## /src/components/auth/auth.css

```css
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.auth-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
}

.auth-error-dismiss {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.auth-error-dismiss:hover {
  opacity: 1;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
  gap: 0.5rem;
}

.google-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.google-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 3rem);
  height: 1px;
  background-color: #e5e7eb;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background-color: #fff;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.btn.btn-secondary {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.btn.btn-secondary:hover {
  background-color: #e5e7eb;
}
```

---

## /src/server/main.py

```plaintext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vue.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## /src/server/routes/studentRoutes.js

```javascript
const express = require('express');
const router = express.Router();

// ...existing code...

router.post('/students', async (req, res) => {
  try {
    const { name } = req.body;
    // Here you would typically create a new student in your database
    // This is a mock response
    const newStudent = {
      id: Date.now(),
      name,
      createdAt: new Date()
    };
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student profile: ${error.message}` });
  }
});

router.get('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically fetch the student from your database
    // This is a mock response
    const student = {
      id: student_id,
      name: 'John Doe',
      createdAt: new Date()
    };
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to get student profile: ${error.message}` });
  }
});

router.put('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { name } = req.body;
    // Here you would typically update the student in your database
    // This is a mock response
    const updatedStudent = {
      id: student_id,
      name,
      createdAt: new Date()
    };
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update student profile: ${error.message}` });
  }
});

router.delete('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically delete the student from your database
    // This is a mock response
    res.status(200).json({ detail: `Student ${student_id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student profile: ${error.message}` });
  }
});

// ...existing code...

module.exports = router;
```

---

## /src/server/routes/student_routes.py

```plaintext
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

router = APIRouter()

class StudentCreate(BaseModel):
    name: str

class StudentUpdate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int
    created_at: datetime

students_db = {}

@router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    try:
        new_student = Student(
            id=int(time.time()),
            name=student.name,
            created_at=datetime.now()
        )
        students_db[new_student.id] = new_student
        return new_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create student profile")

@router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student_update: StudentUpdate):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = Student(id=student_id, name=student_update.name, created_at=student.created_at)
    students_db[student_id] = updated_student
    return updated_student

@router.delete("/students/{student_id}")
async def delete_student(student_id: int):
    student = students_db.pop(student_id, None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Student deleted successfully"}
```

---

## /src/pages/About.tsx

```tsx
// File: /src/pages/About.tsx
// Description: About page component providing information about Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">About Geaux Academy</h1>
      <p className="mt-4">Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.</p>
    </div>
  );
};

export default About;
```

---

## /src/pages/Contact.tsx

```tsx
// File: /src/pages/Contact.tsx
// Description: Contact page component providing contact information and a contact form.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-4">Feel free to reach out to us with any questions or feedback.</p>
    </div>
  );
};

export default Contact;
```

---

## /src/pages/Curriculum.tsx

```tsx
// File: /src/pages/Curriculum.tsx
// Description: Curriculum page component outlining the learning curriculum.
// Author: GitHub Copilot
// Created: 2023-10-10

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import CourseCard from "../components/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
  image?: string;
}

const Curriculum: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<'elementary' | 'middle' | 'high'>('middle');
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      setError('');
      await login();
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
    }
  };

  const subjects: Course[] = [
    {
      id: '1',
      title: 'Mathematics',
      description: 'Core mathematics curriculum covering algebra, geometry, and more.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'math'
    },
    {
      id: '2',
      title: 'Science',
      description: 'Comprehensive science program including biology, chemistry, and physics.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'science'
    }
    // Add more courses as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Curriculum</h1>
      <p className="mt-4">Our curriculum is designed to adapt to your learning style and pace.</p>

      <div className="flex justify-center gap-4 mt-8">
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'elementary' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('elementary')}
        >
          Elementary School
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'middle' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('middle')}
        >
          Middle School
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'high' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('high')}
        >
          High School
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-2 rounded mt-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {subjects.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      <div className="text-center mt-16 p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Ready to Start Learning?</h2>
        <p className="mt-4">Join our platform to access the full curriculum and personalized learning paths.</p>
        <button 
          className="flex items-center gap-2 px-4 py-2 border rounded mt-4" 
          onClick={handleLogin}
        >
          <FcGoogle />
          <span>Sign in with Google to Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default Curriculum;
```

---

## /src/pages/Features.tsx

```tsx
// File: /src/pages/Features.tsx
// Description: Features page component highlighting the key features of Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const Features: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Features</h1>
      <ul className="mt-4 list-disc list-inside">
        <li>AI-powered learning style assessment</li>
        <li>Personalized learning paths</li>
        <li>Real-time progress tracking</li>
        <li>Interactive dashboard</li>
      </ul>
    </div>
  );
};

export default Features;
```

---

## /src/pages/Home.tsx

```tsx
import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FaGraduationCap, FaChartLine, FaLightbulb } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  h1 {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const HeroImage = styled.img`
  max-width: 100%;
  height: auto;
  margin: 2rem auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
`;

const FlipContainer = styled.div`
  perspective: 1000px;
  height: 200px;
`;

const FlipInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;

  &:hover {
    transform: rotateY(180deg);
  }
`;

const FlipFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FlipBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: var(--primary-color);
  color: white;
  transform: rotateY(180deg);
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  margin: 2rem 0;

  h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;

  p {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
`;

interface FlipCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ icon, title, description }) => {
  return (
    <FlipContainer>
      <FlipInner className="flip">
        <FlipFront>
          <IconWrapper>{icon}</IconWrapper>
          <h3>{title}</h3>
        </FlipFront>
        <FlipBack>
          <p>{description}</p>
        </FlipBack>
      </FlipInner>
    </FlipContainer>
  );
};

const features: Feature[] = [
  { icon: <FaGraduationCap />, title: "Expert Instruction", description: "Learn from industry professionals." },
  { icon: <FaChartLine />, title: "Track Progress", description: "Monitor your growth with analytics." },
  { icon: <FaLightbulb />, title: "Interactive Learning", description: "Engage with hands-on exercises." },
];

const Home: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    try {
      setError("");
      await login();
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Login error:", error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <h1>Welcome to Geaux Academy</h1>
          <p>Empowering Personalized Learning through AI</p>
          <HeroImage src="/images/hero-learning.svg" alt="Learning illustration" />
        </HeroContent>
      </HeroSection>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FlipCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </FeaturesGrid>

      <CallToAction>
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join Geaux Academy today and unlock your full potential.</p>
        <GoogleLoginSection>
          <p>Sign in with Google to get started</p>
          <GoogleLoginButton onClick={handleLogin}>
            <img src="/google-icon.svg" alt="Google" width="24" height="24" />
            Sign in with Google
          </GoogleLoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </GoogleLoginSection>
      </CallToAction>
    </Container>
  );
};

export default memo(Home);
```

---

## /src/pages/LearningPlan.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface Subject {
  name: string;
  description: string;
  activities: string[];
}

interface UserData {
  learningStyle: string;
  grade: string;
  learningPlan: Subject[];
}

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const LearningPlan: React.FC = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [learningStyle, setLearningStyle] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const fetchUserProfile = async (): Promise<void> => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData;
        setLearningStyle(userData.learningStyle || "");
        setGrade(userData.grade || "");
        setSubjects(userData.learningPlan || []);
      }
    } catch (error) {
      setError("Failed to load user profile");
      console.error("Error:", error);
    }
  };

  const generateLearningPlan = async (): Promise<void> => {
    if (!currentUser) {
      setError("Please sign in first");
      return;
    }
    
    if (!learningStyle || !grade) {
      setError("Please complete your profile first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `Create a learning plan for a ${grade} grade student with ${learningStyle} learning style.`
          }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const newPlan = JSON.parse(data.choices[0].message.content);
      
      await saveToFirestore(newPlan);
      setSubjects(newPlan);
    } catch (error) {
      setError("Failed to generate learning plan");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveToFirestore = async (plan: Subject[]): Promise<void> => {
    if (!currentUser) {
      throw new Error("User must be signed in");
    }
    
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        learningPlan: plan
      });
    } catch (error) {
      throw new Error("Failed to save learning plan");
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Personalized Learning Plan</h1>
      
      {error && (
        <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <p>Learning Style: <span className="font-semibold">{learningStyle}</span></p>
          <p>Grade Level: <span className="font-semibold">{grade}</span></p>
        </div>

        <button
          onClick={generateLearningPlan}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Learning Plan"}
        </button>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">{subject.name}</h3>
              <p className="text-gray-600 mb-2">{subject.description}</p>
              <ul className="list-disc list-inside">
                {subject.activities.map((activity, idx) => (
                  <li key={idx} className="text-gray-700">{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlan;
```

---

## /src/pages/LearningStyles.tsx

```tsx
// File: /src/pages/LearningStyles.tsx
// Description: Learning Styles page component explaining different learning styles.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { FaHeadphones, FaBook, FaRunning, FaBrain, FaUsers, FaEye } from 'react-icons/fa';
import Card from '../components/common/Card';

const LearningStyles: React.FC = () => {
  const learningStyles = [
    { title: "Visual", description: "Learn through seeing and watching demonstrations", icon: <FaEye /> },
    { title: "Auditory", description: "Learn through listening and speaking", icon: <FaHeadphones /> },
    { title: "Reading/Writing", description: "Learn through reading and writing text", icon: <FaBook /> },
    { title: "Kinesthetic", description: "Learn through doing and moving", icon: <FaRunning /> },
    { title: "Logical", description: "Learn through reasoning and problem-solving", icon: <FaBrain /> },
    { title: "Social", description: "Learn through group interaction and collaboration", icon: <FaUsers /> }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Learning Styles</h1>
      <p className="mt-4">Discover your preferred learning style and how Geaux Academy can help you learn more effectively.</p>

      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StylesGrid>
          {learningStyles.map((style, index) => (
            <MotionStyleCard 
              key={index}
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>{style.icon}</IconWrapper>
              <h3>{style.title}</h3>
              <p>{style.description}</p>
            </MotionStyleCard>
          ))}
        </StylesGrid>

        <CTASection>
          <h2>Want to know your learning style?</h2>
          <Button to='/take-assessment' $variant="primary">
            Take the Assessment
          </Button>
        </CTASection>
      </m.div>
    </div>
  );
};

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(Card)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MotionStyleCard = m.create(StyleCard);

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const CTASection = styled.div`
  text-align: center;
  margin: 4rem 0;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const Button = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-block;
  padding: 1rem 2rem;
  background: ${({ theme, $variant }) => 
    $variant === 'secondary' ? theme.palette.secondary.main : theme.palette.primary.main};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'secondary' ? theme.palette.secondary.dark : theme.palette.primary.dark};
  }
`;

export default LearningStyles;
```

---

## /src/pages/Login.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login: React.FC = () => {
  const { loginWithGoogle, loading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof clearError === 'function') {
      clearError();
    }
  }, [clearError]);

  const handleDismissError = () => {
    setLocalError('');
    if (typeof clearError === 'function') {
      clearError();
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLocalError('');
      setLoading(true);
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome Back</Title>
        {(localError || authError) && (
          <ErrorMessage>
            <span>{localError || authError}</span>
            <DismissButton 
              onClick={handleDismissError}
              type="button"
              aria-label="Dismiss error message"
            >✕</DismissButton>
          </ErrorMessage>
        )}
        
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button"
          aria-label="Sign in with Google"
        >
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
        <SignUpPrompt>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignUpPrompt>
      </LoginBox>
    </LoginContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default Login;
```

---

## /src/pages/NotFound.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const NotFound: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed or doesn't exist.</p>
      <StyledLink to="/">Return to Home</StyledLink>
      <GoogleButton onClick={handleGoogleLogin}>
        <FcGoogle className="text-xl" />
        Sign in with Google
      </GoogleButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
`;

export default NotFound;
```

---

## /src/pages/TakeAssessment.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';
import styled from 'styled-components';
import LearningStyleChat from '../components/chat/LearningStyleChat';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async (): Promise<void> => {
      if (!studentId || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          setError("Student profile not found");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [currentUser, studentId]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) {
      setError("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      await updateStudentAssessmentStatus(studentId, "completed");
      setStudent(prev => prev ? { ...prev, hasTakenAssessment: true } : null);
    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading assessment...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!student) {
    return <ErrorContainer>No student found</ErrorContainer>;
  }

  return (
    <AssessmentContainer>
      <Header>
        <h1>Learning Style Assessment</h1>
        <StudentName>for {student.name}</StudentName>
      </Header>

      <ContentSection>
        <p>Chat with our AI assistant to help determine your learning style. The assistant will ask you questions and analyze your responses to identify the learning style that best suits you.</p>
        <LearningStyleChat />
      </ContentSection>

      <ActionSection>
        <CompleteButton 
          onClick={handleAssessmentCompletion}
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete Assessment"}
        </CompleteButton>
      </ActionSection>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const StudentName = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const CompleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

export default TakeAssessment;
```

---

## /src/pages/Todos.tsx

```tsx
import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

interface Todo {
  id: number;
  title: string;
  // Add other todo properties as needed
}

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select('*');
      
      if (error) {
        console.error('Error fetching todos:', error);
        return;
      }

      if (data && data.length > 0) {
        setTodos(data);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```

---

## /src/pages/VarkStyles.tsx

```tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaEye, FaHeadphones, FaBookReader, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface LearningStyle {
  icon: JSX.Element;
  title: string;
  description: string;
  characteristics: string[];
}

const VarkStyles: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  const styles: LearningStyle[] = [
    {
      icon: <FaEye />,
      title: "Visual Learning",
      description: "Learn through seeing and observing",
      characteristics: [
        "Prefer diagrams and charts",
        "Remember visual details",
        "Benefit from visual aids",
        "Excel with graphic organizers"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Auditory Learning",
      description: "Learn through listening and speaking",
      characteristics: [
        "Excel in discussions",
        "Remember spoken information",
        "Benefit from lectures",
        "Learn through verbal repetition"
      ]
    },
    {
      icon: <FaBookReader />,
      title: "Read/Write Learning",
      description: "Learn through written words",
      characteristics: [
        "Enjoy reading materials",
        "Take detailed notes",
        "Prefer written instructions",
        "Learn through writing summaries"
      ]
    },
    {
      icon: <FaRunning />,
      title: "Kinesthetic Learning",
      description: "Learn through doing and experiencing",
      characteristics: [
        "Learn by doing",
        "Prefer hands-on activities",
        "Remember through practice",
        "Benefit from role-playing"
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <m.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your VARK Learning Style
        </m.h1>
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Understanding how you learn best is the first step to academic success
        </m.p>
      </Header>

      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h2>{style.title}</h2>
            <p>{style.description}</p>
            <CharacteristicsList>
              {style.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </CharacteristicsList>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection>
        <h2>Ready to optimize your learning journey?</h2>
        <p>Take our assessment to discover your learning style and get personalized recommendations.</p>
        <ButtonGroup>
          <PrimaryButton to="/signup">Get Started Now</PrimaryButton>
          <SecondaryButton to="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </CTASection>

      <GoogleLoginSection>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

const Container = styled(m.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled(m.header)`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StyleCard = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: var(--background-alt);
  border-radius: 12px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default VarkStyles;
```

---

## /src/pages/values/Collaboration.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

const Collaboration: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      // Handle error as string per user preference
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaUsers size={40} />
        <h1>Collaboration</h1>
      </ValueHeader>
      <ValueContent>
        <p>We believe in the power of working together:</p>
        <ValuePoints>
          <li>Fostering partnerships between teachers, students, and parents</li>
          <li>Creating supportive learning communities</li>
          <li>Encouraging peer-to-peer learning</li>
          <li>Building strong educational networks</li>
        </ValuePoints>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default Collaboration;
```

---

## /src/pages/values/Excellence.tsx

```tsx
import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeProps {
  theme: DefaultTheme;
}

const Excellence: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaTrophy size={40} />
        <h1>Excellence</h1>
      </ValueHeader>
      <ValueContent>
        <p>We strive for excellence in every aspect of education:</p>
        <ValuePoints>
          <li>Setting high academic standards while supporting individual growth</li>
          <li>Continuously improving our teaching methodologies</li>
          <li>Providing top-quality educational resources</li>
          <li>Measuring and celebrating student achievements</li>
        </ValuePoints>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const GoogleButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.875rem;
`;

export default Excellence;
```

---

## /src/pages/values/Innovation.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Innovation: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaLightbulb size={40} />
        <h1>Innovation</h1>
      </ValueHeader>
      <ValueContent>
        <p>Innovation drives our approach to personalized learning:</p>
        <ValuePoints>
          <li>Leveraging cutting-edge educational technology</li>
          <li>Developing adaptive learning pathways</li>
          <li>Creating interactive and engaging content</li>
          <li>Implementing data-driven teaching methods</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Innovation;
```

---

## /src/pages/values/Integrity.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Integrity: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaBalanceScale size={40} />
        <h1>Integrity</h1>
      </ValueHeader>
      <ValueContent>
        <p>At Geaux Academy, integrity is the foundation of everything we do. We believe in:</p>
        <ValuePoints>
          <li>Maintaining the highest ethical standards in education</li>
          <li>Being transparent with our teaching methods and student progress</li>
          <li>Creating a safe and honest learning environment</li>
          <li>Delivering on our promises to students and parents</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(motion.div)`
  max-width: 800px;
  margin: 80px auto;
  padding: 2rem;
`;

const ValueHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);

  h1 {
    margin-top: 1rem;
    font-size: 2.5rem;
  }
`;

const ValueContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ValuePoints = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt);
    border-radius: 4px;
    
    &:hover {
      transform: translateX(5px);
      transition: transform 0.2s;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Integrity;
```

---

## /src/pages/__tests__/About.test.tsx

```tsx
// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Contact.test.tsx

```tsx
// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Curriculum.test.tsx

```tsx
// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Features.test.tsx

```tsx
// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Features from "../Features";

describe('Features Component', () => {
  test("renders Features component with correct content", () => {
    renderWithProviders(<Features />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
    expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
    expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
    expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
  });
});
```

---

## /src/pages/__tests__/Home.test.tsx

```tsx
// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockLoginWithGoogle } from "../../test/testUtils";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithProviders(<Home />, { withRouter: true });
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
```

---

## /src/pages/__tests__/LearningStyles.test.tsx

```tsx
// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />, { withRouter: true });
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});
```

---

## /src/pages/profile/ParentProfile/CreateStudent.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import StudentCard from '../../../components/student/StudentCard';

interface NewStudent {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

const CreateStudent: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: NewStudent = { 
        name: studentName, 
        grade, 
        parentId: currentUser.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(currentUser.uid, newStudent);
      setStudentName('');
      setGrade('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create student profile. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Student Name:
            <Input
              type="text"
              value={studentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              required
            />
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            Grade Level:
            <Select 
              value={grade} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default CreateStudent;
```

---

## /src/pages/profile/ParentProfile/ParentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useAuth } from "../../../contexts/AuthContext";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          if (profile) {
            setParentProfile({
              ...profile,
              name: profile.displayName,
              id: profile.id || user.uid,
              students: profile.students.map((student: string) => ({
                id: student,
                name: '',
                age: 0,
                grade: '',
                parentId: profile.id || user.uid,
                hasTakenAssessment: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })) || [],
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: profile.updatedAt || new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleProfileSwitch = (studentId: string) => {
    setSelectedStudent(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || "Parent"}</p>
        <p>Email: {user?.email}</p>
        {!user && (
          <GoogleButton onClick={handleGoogleLogin}>
            Sign in with Google
          </GoogleButton>
        )}
      </ProfileSection>

      {user && (
        <>
          <StudentManagement>
            <h2>Student Profiles</h2>
            <AddStudentButton>➕ Add Student</AddStudentButton>
            
            <StudentList>
              {parentProfile?.students?.map((student) => (
                <StudentCard key={student.id} onClick={() => handleProfileSwitch(student.id)}>
                  <h3>{student.name}</h3>
                  <p>Grade: {student.grade}</p>
                  <p>Assessment: {student.hasTakenAssessment ? 'Completed' : 'Pending'}</p>
                  <ViewProfileButton>View Profile</ViewProfileButton>
                </StudentCard>
              ))}
            </StudentList>
          </StudentManagement>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
              <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
              <Tab active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>Curriculum</Tab>
              <Tab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</Tab>
            </TabList>

            <TabContent>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'progress' && <StudentProgressTracker />}
              {activeTab === 'curriculum' && <CurriculumApproval />}
              {activeTab === 'insights' && <LearningStyleInsights />}
            </TabContent>
          </TabContainer>

          <NotificationSection>
            <NotificationCenter />
          </NotificationSection>
        </>
      )}
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const ProfileSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AddStudentButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NotificationSection = styled.div`
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const OverviewTab = styled.div`
  // Add specific styles for the overview tab content
`;

const ViewProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default ParentDashboard;
```

---

## /src/pages/profile/ParentProfile/ParentProfile.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../../store/slices/profileSlice';
import { RootState } from '../../../store';
import { Student } from '../../../types/auth';  // Using the auth Student type consistently
import { useAuth } from '../../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import { getStudentProfile } from '../../../services/profileService';

const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name || '',
        grade: newStudent.grade || '',
        parentId: parent?.id || '',
        hasTakenAssessment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      if (parent?.students) {
        try {
          const studentsPromises = parent.students.map(async studentId => {
            const student = await getStudentProfile(studentId);
            return student as Student;  // Ensure type consistency
          });
          const fetchedStudents = await Promise.all(studentsPromises);
          setStudentsData(fetchedStudents.filter((s): s is Student => s !== null));
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudentsData();
  }, [parent?.students]);

  return (
    <Container>
      <ProfileBox>
        <Title>Parent Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <div className="students-section">
          <h3>My Students</h3>
          <button onClick={() => setShowAddStudent(true)}>Add Student</button>

          {showAddStudent && (
            <div className="add-student-form">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newStudent.grade || ''}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
              />
              <button onClick={handleAddStudent}>Save</button>
              <button onClick={() => setShowAddStudent(false)}>Cancel</button>
            </div>
          )}

          <div className="students-list">
            {studentsData.map((student) => (
              <div key={student.id} className="student-card">
                <h4>{student.name}</h4>
                {student.grade && <p>Grade: {student.grade}</p>}
                <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
                <div className="progress-summary">
                  {student.hasTakenAssessment ? (
                    <div className="assessment-status">Assessment Complete</div>
                  ) : (
                    <div className="assessment-status">Assessment Needed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ProfileBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default ParentProfile;
```

---

## /src/pages/profile/ParentProfile/ParentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createParentProfile } from '../../../services/profileService';
import styled from 'styled-components';

interface FormData {
  displayName: string;
  phone: string;
  email: string;
}

export const ParentProfileForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    displayName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a profile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('📝 Creating parent profile for:', currentUser.uid);
      await createParentProfile({
        uid: currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        phone: formData.phone
      });
      setSuccess(true);
      console.log('✅ Parent profile created successfully');
    } catch (err) {
      console.error('❌ Error creating parent profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage>
        Profile created successfully! You can now add students to your account.
      </SuccessMessage>
    );
  }

  return (
    <FormContainer>
      <h2>Complete Your Parent Profile</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your full name"
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              displayName: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              phone: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              email: e.target.value
            })}
            required
            disabled={!!currentUser?.email}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
`;

export default ParentProfileForm;
```

---

## /src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../types/student';

interface StudentProgressTrackerProps {
  studentData?: Student[];
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ studentData }) => {
  return (
    <ProgressContainer>
      <h3>Student Progress Overview</h3>
      {studentData?.map(student => (
        <ProgressCard key={student.id}>
          <h4>{student.name}</h4>
          <ProgressBar>
            <Progress width={75} />
          </ProgressBar>
        </ProgressCard>
      ))}
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div`
  margin: 15px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
`;

export default StudentProgressTracker;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../../types/auth';

interface CurriculumApprovalProps {
  studentData?: Student[];
}

const CurriculumApproval: React.FC<CurriculumApprovalProps> = ({ studentData }) => {
  return (
    <ApprovalContainer>
      <h3>Pending Curriculum Approvals</h3>
      {studentData?.map(student => (
        <ApprovalCard key={student.id}>
          <h4>{student.name}</h4>
          <ApprovalActions>
            <button className="approve">Approve</button>
            <button className="review">Review</button>
          </ApprovalActions>
        </ApprovalCard>
      ))}
    </ApprovalContainer>
  );
};

const ApprovalContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApprovalCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.review {
      background: #FFA726;
      color: white;
    }
  }
`;

export default CurriculumApproval;
```

---

## /src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const NotificationCenter: React.FC = () => {
  return (
    <NotificationContainer>
      <h3>Notifications</h3>
      <NotificationList>
        {/* Placeholder for notifications */}
        <NotificationItem>
          <span>No new notifications</span>
        </NotificationItem>
      </NotificationList>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NotificationList = styled.div`
  margin-top: 15px;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export default NotificationCenter;
```

---

## /src/pages/profile/components/LearningStyleInsights.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../types/student';

interface LearningStyleInsightsProps {
  studentData?: Student[];
}

const LearningStyleInsights: React.FC<LearningStyleInsightsProps> = ({ studentData }) => {
  return (
    <InsightsContainer>
      <h3>Learning Style Analytics</h3>
      {studentData?.map(student => (
        <InsightCard key={student.id}>
          <h4>{student.name}</h4>
          <InsightContent>
            <div>Learning Style: {student.learningStyle || 'Not assessed'}</div>
            <div>Recommended Activities: {student.recommendedActivities?.length || 0}</div>
          </InsightContent>
        </InsightCard>
      ))}
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const InsightContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default LearningStyleInsights;
```

---

## /src/pages/profile/StudentProfile/StudentDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface StudentData extends Student {
  recentActivities: Array<{
    id?: string;
    type: string;
    name: string;
    date: string;
  }>;
  progress: Array<{
    type: string;
    value: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID not found');
        return;
      }

      try {
        const data = await getStudentProfile(id);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || id,
            recentActivities: [],
            progress: []
          } as StudentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return <StyledErrorContainer>{error}</StyledErrorContainer>;
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledHeader>
        <StyledHeaderLeft>
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Grade {studentData?.grade}</p>
        </StyledHeaderLeft>
      </StyledHeader>

      <DashboardGrid>
        <MainSection>
          {!studentData?.hasTakenAssessment && (
            <AssessmentSection>
              <h2>Learning Style Assessment</h2>
              <p>Take your learning style assessment to get personalized recommendations.</p>
              <LearningStyleChat />
            </AssessmentSection>
          )}

          {studentData?.hasTakenAssessment && studentData.learningStyle && (
            <LearningStyleSection>
              <h2>Your Learning Style: {studentData.learningStyle}</h2>
              <p>Based on your assessment, we've customized your learning experience.</p>
            </LearningStyleSection>
          )}

          <ProgressSection>
            <h2>Recent Progress</h2>
            {/* Add progress visualization here */}
          </ProgressSection>
        </MainSection>
      </DashboardGrid>
    </m.div>
  );
};

const DashboardContainer = styled(m.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

const StyledHeader = styled(m.header)`
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  h1 {
    margin: 0;
    color: var(--primary-color);
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const MainSection = styled.div`
  display: grid;
  gap: 2rem;
`;

const AssessmentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LearningStyleSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default StudentDashboard;
```

---

## /src/pages/profile/StudentProfile/StudentProfile.tsx

```tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";
import CourseCard from "../../../components/CourseCard";

interface Course {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const StudentProfile: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  const courses: Course[] = [
    { title: "Introduction to Learning Styles", type: "Video Animated", category: "Learning Fundamentals" },
    { title: "Learning Style Quiz", type: "Quiz", category: "Assessment" },
    { title: "Visual Learning Techniques", type: "Mind Map", category: "Learning Techniques" }
  ];

  return (
    <Container>
      <ProfileBox>
        <Title>Student Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search courses..."
          className="border px-4 py-2 w-full mb-4 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* Course List */}
        <div className="grid grid-cols-3 gap-4">
          {courses
            .filter((course) => course.title.toLowerCase().includes(filter.toLowerCase()))
            .map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default StudentProfile;
```

---

## /src/pages/profile/StudentProfile/StudentProfileForm.tsx

```tsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, firestore as db } from '../../../config/firebase';
import styled from 'styled-components';

interface StudentFormData {
  firstName: string;
  lastName: string;
  age: string;
  grade: string;
}

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const StudentProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    age: '',
    grade: ''
  });

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      grade: ''
    });
    setFormState({
      loading: false,
      error: null,
      success: false
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormState(prev => ({ ...prev, error: 'First and last name are required' }));
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 4 || parseInt(formData.age) > 18) {
      setFormState(prev => ({ ...prev, error: 'Age must be between 4 and 18' }));
      return false;
    }
    if (!formData.grade.trim()) {
      setFormState(prev => ({ ...prev, error: 'Grade is required' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = auth.currentUser?.uid;
    
    if (!parentId) {
      setFormState(prev => ({ ...prev, error: 'Parent authentication required' }));
      return;
    }

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        parentId,
        createdAt: new Date().toISOString()
      });
      
      setFormState({ loading: false, error: null, success: true });
      setTimeout(resetForm, 3000);
    } catch (error) {
      setFormState({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false
      });
    }
  };

  return (
    <FormContainer>
      {formState.success && (
        <SuccessMessage>Student added successfully!</SuccessMessage>
      )}
      {formState.error && (
        <ErrorMessage>{formState.error}</ErrorMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name *</Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name *</Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Age *</Label>
          <Input
            type="number"
            min="4"
            max="18"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Grade *</Label>
          <Input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={formState.loading}>
          {formState.loading ? 'Adding Student...' : 'Add Student'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const SuccessMessage = styled(Message)`
  background: var(--success-color);
  color: white;
`;

const ErrorMessage = styled(Message)`
  background: var(--danger-color);
  color: white;
`;

export default StudentProfileForm;
```

---

## /src/pages/styles/Contact.css

```css
.contact-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
```

---

## /src/test/mockThemes.ts

```typescript
import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';
import type { Theme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350'
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

export const mockMuiTheme = muiTheme;

const spacing = Object.assign(
  ((factor: number) => `${0.25 * factor}rem`) as Theme['spacing'],
  {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  }
);

export const mockStyledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing,
  colors: {
    border: '#e0e0e0',
    text: '#000000',
    background: {
      hover: '#f5f5f5'
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee'
    }
  },
  borderRadius: {
    default: '4px'
  }
};
```

---

## /src/test/setup.ts

```typescript
// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Mock Firebase Auth
jest.mock('firebase/auth');

// Mock Firebase Config
jest.mock('../firebase/config', () => ({
  auth: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  }
}));
```

---

## /src/test/setupTests.ts

```typescript
// File: /src/test/setupTests.ts
// Description: Jest setup configuration for testing WebSocket functionality

import '@testing-library/jest-dom';

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: { error: Error }) => void) | null = null;
  readyState: number = WebSocket.CONNECTING;
  url: string;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.();
  }

  send(data: string) {
    // Mock send implementation
  }

  // Test helper methods
  static mockMessage(data: any) {
    MockWebSocket.instances.forEach(instance => {
      instance.onmessage?.({ data: JSON.stringify(data) });
    });
  }

  static mockError(error: Error) {
    MockWebSocket.instances.forEach(instance => {
      instance.onerror?.({ error });
    });
  }

  static mockClose() {
    MockWebSocket.instances.forEach(instance => {
      instance.close();
    });
  }

  static reset() {
    MockWebSocket.instances = [];
  }
}

// Mock window.WebSocket
(global as any).WebSocket = MockWebSocket;

// Reset WebSocket mocks between tests
beforeEach(() => {
  MockWebSocket.reset();
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

---

## /src/test/testUtils.tsx

```tsx
import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Enable React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
): RenderResult => {
  const defaultAuthValue: AuthContextProps = {
    currentUser: null,
    isAuthReady: true,
    loading: false,
    error: null,
    login: mockLoginWithGoogle,
    loginWithGoogle: mockLoginWithGoogle,
    logout: jest.fn(),
    clearError: jest.fn(),
    ...mockAuthValue
  };

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  if (withRouter) {
    const router = createMemoryRouter(
      [{ path: "*", element: <Providers>{ui}</Providers> }],
      { 
        initialEntries: ['/'],
        future
      }
    );
    return render(<RouterProvider router={router} future={future} />, options);
  }

  return render(<Providers>{ui}</Providers>, options);
};
```

---

## /src/test/mocks/WebSocketMock.ts

```typescript
// File: /src/test/mocks/WebSocketMock.ts
// Description: Mock WebSocket implementation for testing
// Author: GitHub Copilot
// Created: 2024

export class WebSocketMock implements Partial<WebSocket> {
  // WebSocket states
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  // Required WebSocket properties
  public url: string;
  public binaryType: BinaryType = 'blob';
  private _readyState: number = WebSocketMock.CONNECTING;

  // Event handlers
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  // Mock methods
  public close(code?: number, reason?: string): void {
    this._readyState = WebSocketMock.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }

  public send(data: string): void {
    // Mock implementation
  }

  // Getter for readyState to make it appear read-only
  get readyState(): number {
    return this._readyState;
  }

  // Test helper methods
  public mockOpen(): void {
    this._readyState = WebSocketMock.OPEN;
    if (this.onopen) {
      this.onopen(new Event('open'));
    }
  }

  public mockClose(code: number = 1000, reason: string = ''): void {
    this._readyState = WebSocketMock.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }

  public mockError(): void {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }

  public mockMessage(data: any): void {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  public mockSetReadyState(state: number): void {
    this._readyState = state;
  }
}
```

---

## /src/utils/animations.js

```javascript
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};

export const containerVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20 
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};
```

---

## /src/utils/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

---

## /src/styles/global.css

```css
:root {
  /* Colors */
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
  
  /* Layout */
  --header-height: 64px;
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: 'Arial', sans-serif;
  --line-height: 1.6;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--text-color);
}

/* Layout Components */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
}

.page-container {
  padding-top: var(--header-height);
}

/* Common Components */
.card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--white);
  border: none;
}

.btn-secondary {
  background-color: var(--white);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.btn:hover {
  transform: translateY(-2px);
}

/* Forms */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: inherit;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
  }
}
```

---

## /src/styles/global.ts

```typescript
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
```

---

## /src/styles/theme.js

```javascript

```

---

## /src/styles/components/common.ts

```typescript
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface ButtonProps extends ThemeProps {
  $variant?: 'primary' | 'secondary';
}

export const Container = styled(m.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }: ThemeProps) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }: ThemeProps) => theme.spacing.xl} 0;
`;

export const Card = styled(m.div)`
  background: ${({ theme }: ThemeProps) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }: ThemeProps) => theme.spacing.lg};
`;

export const Button = styled(m.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: ThemeProps) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }: ButtonProps) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }: ButtonProps) => 
      $variant === 'secondary' 
        ? theme.palette.secondary.dark 
        : theme.palette.primary.dark};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m.div)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

---

## /src/firebase/auth-service-worker.ts

```typescript
import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { firestore } from './config';

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let retryCount = 0;

const registerWithRetry = async (): Promise<ServiceWorkerRegistration> => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth',
      type: 'module',
      updateViaCache: 'none'
    });
    return registration;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return registerWithRetry();
    }
    throw error;
  }
};

export const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Secure context required for authentication'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    serviceWorkerRegistration = await registerWithRetry();

    const activationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, SW_TIMEOUT);

      if (serviceWorkerRegistration?.active) {
        clearTimeout(timeout);
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    await activationPromise;

    return {
      success: true,
      isSecure: isSecureContext(),
      supportsServiceWorker: true
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    return false;
  }

  // Initialize Firestore persistence after successful service worker registration
  try {
    const settings: FirestoreSettings = {
      cacheSizeBytes: 50000000, // 50 MB
    };
    
    await enableIndexedDbPersistence(db);
    
    return true;
  } catch (error) {
    console.error('Failed to enable persistence:', error);
    return false;
  }
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect && import.meta.env.VITE_AUTH_POPUP_FALLBACK === 'true') {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

export default initAuthServiceWorker;
```

---

## /src/firebase/auth-service.ts

```typescript
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth, User } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  private async refreshUserToken(user: User): Promise<string> {
    try {
      const token = await user.getIdToken(true);
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      const token = await this.refreshUserToken(result.user);
      
      // Store token in a secure way
      if (window.isSecureContext) {
        sessionStorage.setItem('authToken', token);
      }
      
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      if (window.isSecureContext) {
        sessionStorage.removeItem('authToken');
      }
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      await this.ensureInitialized();
      const currentUser = this._auth.currentUser;
      
      if (!currentUser) {
        return null;
      }

      const token = await this.refreshUserToken(currentUser);
      
      if (window.isSecureContext) {
        sessionStorage.setItem('authToken', token);
      }
      
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  getCurrentToken(): string | null {
    if (!window.isSecureContext) {
      return null;
    }
    return sessionStorage.getItem('authToken');
  }
}
```

---

## /src/firebase/config.ts

```typescript
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  initializeAuth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  PopupRedirectResolver
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Interface for initialization errors
interface InitializationError extends Error {
  service: string;
  code?: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_VAPID_KEY' // Added VAPID key to required environment variables
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // Added VAPID key to firebaseConfig
};

// SSL configuration
const sslConfig = {
  key: import.meta.env.VITE_SSL_KEY,
  cert: import.meta.env.VITE_SSL_CERT
};

// Service instances
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;
let storage: FirebaseStorage;

// Check for secure context
const isSecureContext = window.isSecureContext;
if (!isSecureContext) {
  console.warn('Application is not running in a secure context. Some features will be disabled.');
}

// Maximum retries for initialization
const MAX_INIT_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

// Initialize Firebase services with retry mechanism
async function initializeFirebaseServices(retryCount = 0): Promise<void> {
  try {
    // Only initialize once
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);

      // Initialize Auth with persistence and popup (preferred method)
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver as PopupRedirectResolver
      });

      // Initialize Firestore with persistence and single tab manager
      firestore = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentSingleTabManager({
            forceOwnership: true
          }),
          cacheSizeBytes: CACHE_SIZE_UNLIMITED
        })
      });

      // Initialize Storage
      storage = getStorage(app);

      // Initialize Analytics if supported and in secure context
      if (isSecureContext) {
        const analyticsSupported = await isAnalyticsSupported();
        if (analyticsSupported) {
          analytics = getAnalytics(app);
        }
      }

      // Initialize Cloud Messaging if supported and in secure context
      if (isSecureContext) {
        const messagingSupported = await isMessagingSupported();
        if (messagingSupported) {
          messaging = getMessaging(app);
        }
      }
    } else {
      // Get existing instances if already initialized
      app = getApps()[0];
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    const err = error as InitializationError;
    console.error('Firebase initialization error:', err);

    // Retry initialization if under max attempts
    if (retryCount < MAX_INIT_RETRIES) {
      console.log(`Retrying Firebase initialization (${retryCount + 1}/${MAX_INIT_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return initializeFirebaseServices(retryCount + 1);
    }

    throw new Error(`Failed to initialize Firebase services after ${MAX_INIT_RETRIES} attempts: ${err.message}`);
  }
}

// Initialize services immediately
initializeFirebaseServices().catch(error => {
  console.error('Critical: Failed to initialize Firebase:', error);
});

export {
  app,
  auth,
  firestore,
  analytics,
  messaging,
  storage,
  firebaseConfig,
  sslConfig,
  initializeFirebaseServices,
  type FirebaseApp,
  type Auth,
  type Firestore,
  type Analytics,
  type Messaging,
  type FirebaseStorage,
  type InitializationError
};
```

---

## /src/firebase/firebase-messaging-sw.ts

```typescript
// File: /src/firebase/firebase-messaging-sw.ts
// Description: Firebase service worker configuration for handling background messages and notifications
// Author: GitHub Copilot
// Created: 2024-02-17

/// <reference lib="webworker" />

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage, MessagePayload } from 'firebase/messaging/sw';
import { firebaseConfig } from './config';

declare const self: ServiceWorkerGlobalScope;

// Initialize Firebase in the service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload: MessagePayload) => {
  console.log('[Firebase Messaging SW] Received background message:', payload);

  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions: NotificationOptions = {
    body: payload.notification?.body,
    icon: '/images/logo.svg',
    badge: '/images/logo.svg',
    tag: payload.collapseKey || 'default',
    data: payload.data,
    requireInteraction: true,
    silent: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Add custom click handling here
  const clickAction = event.notification.data?.clickAction || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If a window client is already open, focus it
        for (const client of windowClients) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(clickAction);
        }
      })
  );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all pages immediately
      self.clients.claim(),
      // Optional: Clean up old caches here if needed
    ])
  );
});
```

---

## /src/firebase/messaging-utils.ts

```typescript
// File: /src/firebase/messaging-utils.ts
// Description: Firebase messaging utilities with proper TypeScript support and error handling
// Author: GitHub Copilot
// Created: 2024-02-17

import { getToken, getMessaging } from 'firebase/messaging';
import { app } from './config';

const VAPID_KEY = 'YOUR_VAPID_KEY_HERE'; // TODO: Replace with actual VAPID key

export interface ServiceWorkerRegistrationResult {
  success: boolean;
  token?: string;
  error?: string;
}

export async function registerMessagingWorker(): Promise<ServiceWorkerRegistrationResult> {
  if (!window.isSecureContext) {
    return {
      success: false,
      error: 'Service Worker registration requires a secure context (HTTPS or localhost)'
    };
  }

  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      error: 'Service Worker is not supported in this browser'
    };
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      type: 'module'
    });

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      return {
        success: false,
        error: 'Failed to get messaging token'
      };
    }

    return {
      success: true,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register service worker'
    };
  }
}

export async function unregisterMessagingWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
}
```

---

## /src/services/agentService.ts

```typescript
// frontend/src/services/agentService.ts
import { apiClient } from '../utils/apiClient';
import { TaskRequest, TaskStatus, TaskResult } from '../types/task';

export const agentService = {
  /**
   * Create a new agent task
   */
  createTask: async (taskRequest: TaskRequest): Promise<string> => {
    const response = await apiClient.post('/api/tasks', taskRequest);
    return response.data.task_id;
  },
  
  /**
   * Get the status of a task
   */
  getTaskStatus: async (taskId: string): Promise<TaskStatus> => {
    const response = await apiClient.get(`/api/tasks/${taskId}/status`);
    return response.data;
  },
  
  /**
   * Poll for task status until completion or error
   */
  pollTaskStatus: async (
    taskId: string, 
    onStatusUpdate: (status: TaskStatus) => void,
    intervalMs: number = 2000,
    maxAttempts: number = 30
  ): Promise<TaskResult | null> => {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await agentService.getTaskStatus(taskId);
          onStatusUpdate(status);
          
          if (status.status === 'completed') {
            clearInterval(interval);
            resolve(status.result);
          } else if (status.status === 'failed') {
            clearInterval(interval);
            reject(new Error(status.details || 'Task failed'));
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Task polling timed out'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, intervalMs);
    });
  }
};
```

---

## /src/services/api.js

```javascript
import axios from 'axios';
import { auth } from '@/config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

## /src/services/auth-service.ts

```typescript
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';

const auth = getAuth();

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error('Failed to sign in with Google');
  }
};
```

---

## /src/services/cheshireService.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { auth } from '../config/firebase';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface CheshireError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  config?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      const err = error as CheshireError;
      console.error('TIPI health check failed:', err);
      if (err.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw err;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error as CheshireError);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error as CheshireError);
    }
  }

  static getErrorMessage(error: CheshireError): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}
```

---

## /src/services/dataService.ts

```typescript
import { supabase } from '@/supabaseClient';

export const fetchData = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

export const insertData = async (table: string, data: object) => {
  const { error } = await supabase.from(table).insert(data);
  if (error) throw error;
};

export const updateData = async (table: string, id: number, data: object) => {
  const { error } = await supabase.from(table).update(data).eq('id', id);
  if (error) throw error;
};

export const deleteData = async (table: string, id: number) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};
```

---

## /src/services/firebaseService.ts

```typescript
// frontend/src/services/firebaseService.ts
// Using relative import until TS path mapping for @/config resolves in tooling
import { auth } from '../config/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
const googleProvider = new GoogleAuthProvider();

export const firebaseService = {
  // Firebase Authentication
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  },
  
  getIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
};
```

---

## /src/services/firestore.ts

```typescript
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(firestore, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(firestore, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...
```

---

## /src/services/mongoService.ts

```typescript
import axios from 'axios';
import { firebaseService } from './firebaseService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await firebaseService.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mongoService = {
  // User profile operations
  getUserProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUserProfile: async (userId: string, profileData: any) => {
    const response = await apiClient.put(`/users/${userId}`, profileData);
    return response.data;
  },
  
  // Learning style operations
  saveLearningStyle: async (userId: string, learningStyle: string, assessmentResults: any) => {
    const response = await apiClient.post(`/users/${userId}/learning-style`, {
      style: learningStyle,
      results: assessmentResults
    });
    return response.data;
  },
  
  getLearningStyle: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/learning-style`);
    return response.data;
  },
  
  // Curriculum operations
  saveCurriculum: async (userId: string, curriculum: any) => {
    const response = await apiClient.post(`/users/${userId}/curriculum`, curriculum);
    return response.data;
  },
  
  getCurriculumList: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/curriculum`);
    return response.data;
  },
  
  getCurriculumById: async (userId: string, curriculumId: string) => {
    const response = await apiClient.get(`/users/${userId}/curriculum/${curriculumId}`);
    return response.data;
  }
};
```

---

## /src/services/mongodbService.ts

```typescript
// File: /src/services/mongodbService.ts
// Description: Service for MongoDB operations replacing Firestore functionality
// Created: 2025-02-25

import { connectToDatabase } from '../config/dbConfig';

// Connect to MongoDB when the service is imported
connectToDatabase()
  .then(() => console.log('MongoDB service initialized'))
  .catch(err => console.error('Failed to initialize MongoDB service:', err));

// Generic get document function
export async function getData<T>(model: any, id: string): Promise<T | null> {
  try {
    const document = await model.findOne({ uid: id }).lean();
    return document as T | null;
  } catch (error) {
    console.error(`Error getting document with ID ${id}:`, error);
    throw error;
  }
}

// Generic get documents function
export async function getDocuments<T>(model: any, filter = {}): Promise<T[]> {
  try {
    const documents = await model.find(filter).lean();
    return documents as T[];
  } catch (error) {
    console.error(`Error getting documents:`, error);
    throw error;
  }
}

// Generic set document function
export async function setData<T>(model: any, id: string, data: Partial<T>): Promise<T> {
  try {
    const update = { ...data };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    
    const document = await model.findOneAndUpdate(
      { uid: id }, 
      update, 
      options
    ).lean();
    
    return document as T;
  } catch (error) {
    console.error(`Error setting document with ID ${id}:`, error);
    throw error;
  }
}

// Generic create document function
export async function createData<T>(model: any, data: T): Promise<T> {
  try {
    const newDocument = new model(data);
    await newDocument.save();
    return newDocument.toObject() as T;
  } catch (error) {
    console.error(`Error creating document:`, error);
    throw error;
  }
}

// Generic update document function
export async function updateData<T>(model: any, id: string, data: Partial<T>): Promise<T | null> {
  try {
    const updatedDocument = await model.findOneAndUpdate(
      { uid: id }, 
      { $set: { ...data, updatedAt: new Date() } }, 
      { new: true }
    ).lean();
    
    return updatedDocument as T | null;
  } catch (error) {
    console.error(`Error updating document with ID ${id}:`, error);
    throw error;
  }
}

// Generic delete document function
export async function deleteData(model: any, id: string): Promise<boolean> {
  try {
    const result = await model.deleteOne({ uid: id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting document with ID ${id}:`, error);
    throw error;
  }
}
```

---

## /src/services/openai.js

```javascript
import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default openaiClient;
```

---

## /src/services/profileService.ts

```typescript
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { Parent, Student, LearningStyle } from "../types/profiles";

// Cache for storing profiles
const profileCache = new Map();

// Helper to check online status
const isOnline = () => navigator.onLine;

// Helper to handle offline errors
const handleOfflineError = (operation: string) => {
  const error = new Error(`Cannot ${operation} while offline`);
  error.name = 'OfflineError';
  return error;
};

// ✅ Create Parent Profile
export const createParentProfile = async (parentData: Partial<Parent>): Promise<string> => {
  try {
    if (!parentData.uid) throw new Error('User ID is required');
    
    const parentRef = doc(firestore, 'parents', parentData.uid);
    await setDoc(parentRef, {
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: []
    });
    
    console.log('✅ Parent profile created successfully:', parentData.uid);
    return parentData.uid;
  } catch (error) {
    console.error('❌ Error creating parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Parent Profile
export const getParentProfile = async (userId: string): Promise<Parent | null> => {
  try {
    console.log('🔍 Fetching parent profile for:', userId);

    // Check cache first
    if (profileCache.has(`parent_${userId}`)) {
      return profileCache.get(`parent_${userId}`);
    }

    const docRef = doc(firestore, 'parents', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const parentProfile: Parent = {
        uid: data.uid || userId,
        email: data.email || '',
        displayName: data.displayName || '',
        students: data.students || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      console.log('✅ Parent profile found:', parentProfile);
      // Cache the result
      profileCache.set(`parent_${userId}`, parentProfile);
      return parentProfile;
    }
    
    console.log('ℹ️ No parent profile found, creating one...');
    // If no profile exists, create one
    await createParentProfile({ uid: userId });
    return getParentProfile(userId); // Retry fetch after creation
    
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`parent_${userId}`) || null;
    }
    console.error('❌ Error fetching parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  try {
    // Check cache first
    if (profileCache.has(`student_${studentId}`)) {
      return profileCache.get(`student_${studentId}`);
    }

    const studentRef = doc(firestore, "students", studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error("Student profile not found");
    }

    const studentData = studentDoc.data() as Student;
    // Cache the result
    profileCache.set(`student_${studentId}`, studentData);
    return studentData;
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`student_${studentId}`) || null;
    }
    throw error;
  }
};

// ✅ Add Student Profile
export const addStudentProfile = async (parentId: string, studentData: {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}) => {
  try {
    console.log('📝 Adding student profile for parent:', parentId);
    
    // Add the student to the students collection
    const studentRef = await addDoc(collection(firestore, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(firestore, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);

    if (parentDoc.exists()) {
      const currentStudents = parentDoc.data().students || [];
      await updateDoc(parentRef, {
        students: [...currentStudents, studentRef.id],
        updatedAt: new Date().toISOString()
      });
    }

    console.log('✅ Student profile added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('❌ Error adding student profile:', error);
    throw error;
  }
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  if (!isOnline()) {
    throw handleOfflineError('update assessment status');
  }

  const studentRef = doc(firestore, "students", studentId);
  try {
    await updateDoc(studentRef, {
      hasTakenAssessment: status === 'completed',
      assessmentStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        hasTakenAssessment: status === 'completed',
        assessmentStatus: status,
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

// ✅ Save Learning Style
export const saveLearningStyle = async (studentId: string, learningStyle: LearningStyle): Promise<void> => {
  if (!isOnline()) {
    throw handleOfflineError('save learning style');
  }

  try {
    console.log('📝 Saving learning style for student:', studentId);
    const studentRef = doc(firestore, 'students', studentId);
    
    await updateDoc(studentRef, {
      learningStyle,
      updatedAt: new Date().toISOString()
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        learningStyle,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Learning style saved successfully');
  } catch (error) {
    console.error('❌ Error saving learning style:', error);
    throw error;
  }
};

// Listen for online/offline events to manage cache
window.addEventListener('online', () => {
  console.info('Back online. Syncing data...');
  // Could add sync logic here if needed
});

window.addEventListener('offline', () => {
  console.warn('Gone offline. Using cached data...');
});

export class ProfileService {
  async getUserProfile(userId: string): Promise<any> {
    // ...existing API call logic...
    // Example:
    const response = await fetch(`/api/profiles/${userId}`);
    return response.json();
  }
}
```

---

## /src/services/userService.ts

```typescript
// File: /src/services/userService.ts
// Description: MongoDB service for user operations
// Created: 2025-02-25

import User, { IUser } from '../models/User';
import { getData, getDocuments, setData, updateData, deleteData } from './mongodbService';

// Get user by Firebase Auth UID
export const getUserById = async (uid: string): Promise<IUser | null> => {
  return await getData<IUser>(User, uid);
};

// Get users by role
export const getUsersByRole = async (role: string): Promise<IUser[]> => {
  return await getDocuments<IUser>(User, { role });
};

// Create or update user
export const createOrUpdateUser = async (userData: Partial<IUser>): Promise<IUser> => {
  if (!userData.uid) {
    throw new Error('User ID is required');
  }
  
  return await setData<IUser>(User, userData.uid, userData);
};

// Update user profile
export const updateUserProfile = async (uid: string, userData: Partial<IUser>): Promise<IUser | null> => {
  return await updateData<IUser>(User, uid, userData);
};

// Delete user
export const deleteUser = async (uid: string): Promise<boolean> => {
  return await deleteData(User, uid);
};

// Create user profile from Firebase Auth user
export const createUserFromAuth = async (firebaseUser: any): Promise<IUser> => {
  const userData: Partial<IUser> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    role: 'parent', // Default role
  };
  
  return await createOrUpdateUser(userData);
};
```

---

## /src/services/varkService.ts

```typescript
import { firestore as db } from '../config/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface AssessmentResponse {
  assessmentId: string;
  initialMessage: string;
}

interface VARKResults {
  visual: number;
  auditory: number;
  readWrite: number;
  kinesthetic: number;
  primaryStyle: string;
}

interface UserResponse {
  message: string;
  nextQuestionIndex: number;
  currentQuestion: string;
  isComplete: boolean;
  results?: VARKResults;
}

export const startAssessment = async (userId: string): Promise<AssessmentResponse> => {
  const response = await fetch('/api/vark/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to start assessment');
  }
  
  return response.json();
};

export const sendUserResponse = async ({
  userId,
  assessmentId,
  message,
  questionIndex,
}: {
  userId: string;
  assessmentId: string;
  message: string;
  questionIndex: number;
}): Promise<UserResponse> => {
  const response = await fetch('/api/vark/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      assessmentId,
      message,
      questionIndex,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to process response');
  }
  
  return response.json();
};

export const saveAssessmentResults = async (
  userId: string, 
  results: VARKResults
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const resultsRef = doc(db, 'varkResults', userId);
    
    // Update user document with primary learning style
    await updateDoc(userRef, {
      primaryLearningStyle: results.primaryStyle,
      updatedAt: serverTimestamp()
    });
    
    // Save detailed results
    await setDoc(resultsRef, {
      ...results,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving results:', error);
    throw error;
  }
};
```

---

## /src/services/websocketService.ts

```typescript
// File: /src/services/websocketService.ts
// Description: WebSocket service for handling real-time task updates
import { TaskStatus, TaskResult } from '../types/task';

export interface WebSocketMessage {
  type: string;
  task_id?: string;
  status?: TaskStatus;
  result?: TaskResult;
  error?: string;
}

interface WebSocketEventMap {
  connect: void;
  disconnect: void;
  error: Error;
  task_update: TaskStatus;
  task_result: TaskResult;
  subscription_ack: { task_id: string };
}

type WebSocketEventListener<K extends keyof WebSocketEventMap> = 
  (data: WebSocketEventMap[K]) => void;

type EventListeners = {
  [K in keyof WebSocketEventMap]: Set<WebSocketEventListener<K>>;
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  // Change the listeners type to use a more flexible Record type
  private listeners: Record<keyof WebSocketEventMap, Set<any>> = {
    connect: new Set(),
    disconnect: new Set(),
    error: new Set(),
    task_update: new Set(),
    task_result: new Set(),
    subscription_ack: new Set()
  };
  private pendingMessages: string[] = [];
  private isConnecting = false;

  constructor(private readonly baseUrl: string) {
    // Force ws:// for local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.baseUrl = 'ws://localhost:5173';
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // This should be implemented based on your authentication method
      return await localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      this.ws = new WebSocket(`${this.baseUrl}/ws/tasks/${token}`);
      
      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connect', undefined);
        
        // Send any pending messages
        while (this.pendingMessages.length > 0) {
          const message = this.pendingMessages.shift();
          if (message) this.send(message);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'task_update':
              if (message.status) {
                this.emit('task_update', message.status);
              }
              break;
            
            case 'task_result':
              if (message.result) {
                this.emit('task_result', message.result);
              }
              break;
            
            case 'subscription_ack':
              if (message.task_id) {
                this.emit('subscription_ack', { task_id: message.task_id });
              }
              break;
            
            case 'error':
              if (message.error) {
                this.emit('error', new Error(message.error));
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.emit('disconnect', undefined);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        this.isConnecting = false;
        this.emit('error', new Error('WebSocket error occurred'));
      };
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private getBackoffDelay(): number {
    // Calculate exponential backoff with random jitter
    const minDelay = 1000; // 1 second minimum
    const maxDelay = 30000; // 30 seconds maximum
    const baseDelay = Math.min(
      minDelay * Math.pow(2, this.reconnectAttempts),
      maxDelay
    );
    
    // Add random jitter (±30%)
    const jitter = baseDelay * 0.3 * (Math.random() * 2 - 1);
    return Math.max(minDelay, Math.min(baseDelay + jitter, maxDelay));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Failed to reconnect after maximum attempts'));
      return;
    }

    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = this.getBackoffDelay();
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  subscribe<K extends keyof WebSocketEventMap>(
    event: K,
    listener: WebSocketEventListener<K>
  ): () => void {
    this.listeners[event].add(listener);
    
    return () => {
      this.listeners[event].delete(listener);
    };
  }

  private emit<K extends keyof WebSocketEventMap>(
    event: K,
    data: WebSocketEventMap[K]
  ): void {
    this.listeners[event].forEach((listener: WebSocketEventListener<K>) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  subscribeToTask(taskId: string): void {
    const message = JSON.stringify({
      type: 'subscribe_task',
      task_id: taskId
    });

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send(message);
    } else {
      this.pendingMessages.push(message);
      this.connect().catch(error => {
        console.error('Error connecting to WebSocket:', error);
      });
    }
  }

  private send(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.pendingMessages.push(message);
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  hasActiveSubscriptions(): boolean {
    // Check if there are any active listeners for task-related events
    return (
      this.listeners.task_update.size > 0 ||
      this.listeners.task_result.size > 0 ||
      this.listeners.subscription_ack.size > 0
    );
  }
}

export const websocketService = new WebSocketService(
  process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:5173'
);

export default websocketService;
```

---

## /src/services/__tests__/websocketService.reconnect.test.ts

```typescript
// File: /src/services/__tests__/websocketService.reconnect.test.ts
import websocketService from '../websocketService';
import { WebSocketMock } from '../../test/mocks/WebSocketMock';

describe('WebSocketService - Reconnection', () => {
  let mockWebSocket: WebSocketMock;
  
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.getItem = jest.fn().mockResolvedValue('test-token');
    
    mockWebSocket = new WebSocketMock('ws://test.com');
    
    // Assign the mock constructor to global WebSocket
    (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should attempt reconnection with exponential backoff', async () => {
    const connectSpy = jest.spyOn(websocketService as any, 'connect');
    await websocketService.connect();

    // Simulate connection error and close
    mockWebSocket.mockError();
    mockWebSocket.mockClose();

    // First reconnect attempt (1s ± 30% jitter)
    jest.advanceTimersByTime(1000);
    expect(connectSpy).toHaveBeenCalledTimes(2);

    // Second reconnect attempt (2s ± 30% jitter)
    jest.advanceTimersByTime(2000);
    expect(connectSpy).toHaveBeenCalledTimes(3);

    // Third reconnect attempt (4s ± 30% jitter)
    jest.advanceTimersByTime(4000);
    expect(connectSpy).toHaveBeenCalledTimes(4);
  });

  it('should stop reconnecting after max attempts', async () => {
    const connectSpy = jest.spyOn(websocketService as any, 'connect');
    const errorHandler = jest.fn();
    websocketService.subscribe('error', errorHandler);
    
    await websocketService.connect();

    // Simulate multiple connection failures
    for (let i = 0; i < 6; i++) {
      mockWebSocket.mockError();
      mockWebSocket.mockClose();
      jest.advanceTimersByTime(30000);
    }

    expect(connectSpy).toHaveBeenCalledTimes(6); // Initial + 5 retries
    expect(errorHandler).toHaveBeenCalledWith(
      expect.any(Error)
    );
    expect(errorHandler.mock.calls[0][0].message).toMatch(/Failed to reconnect/);
  });

  it('should reset reconnection attempts on successful connection', async () => {
    await websocketService.connect();

    // Simulate two failed connections
    mockWebSocket.mockError();
    mockWebSocket.mockClose();
    jest.advanceTimersByTime(1000);
    
    mockWebSocket.mockError();
    mockWebSocket.mockClose();
    jest.advanceTimersByTime(2000);

    // Simulate successful connection
    mockWebSocket.mockSetReadyState(WebSocketMock.OPEN);
    mockWebSocket.mockOpen();

    // Verify attempts were reset by checking next reconnection
    mockWebSocket.mockError();
    mockWebSocket.mockClose();

    const reconnectSpy = jest.spyOn(websocketService as any, 'attemptReconnect');
    jest.advanceTimersByTime(1000);

    expect(reconnectSpy).toHaveBeenCalled();
    expect(websocketService as any).toHaveProperty('reconnectAttempts', 1);
  });

  it('should maintain message queue during reconnection', async () => {
    await websocketService.connect();
    
    // Queue a message while disconnected
    mockWebSocket.mockSetReadyState(WebSocketMock.CLOSED);
    websocketService.subscribeToTask('test-task');

    // Create new mock for reconnection
    const newMockWebSocket = new WebSocketMock('ws://test.com');
    const sendSpy = jest.spyOn(newMockWebSocket, 'send');
    
    // Update the mock WebSocket constructor
    (global as any).WebSocket = jest.fn().mockImplementation(() => newMockWebSocket);
    
    await websocketService.connect();
    newMockWebSocket.mockOpen();

    expect(sendSpy).toHaveBeenCalledWith(
      expect.stringContaining('test-task')
    );
  });
});
```

---

## /src/services/__tests__/websocketService.test.ts

```typescript
// File: /src/services/__tests__/websocketService.test.ts
// Description: Unit tests for WebSocket service

import { WebSocketService } from '../websocketService';
import { TaskStatus, TaskResult } from '../../types/task';

// Mock WebSocket
class MockWebSocket {
  private listeners: Record<string, Function[]> = {
    open: [],
    message: [],
    close: [],
    error: []
  };
  public readyState = 0;

  constructor(public url: string) {
    setTimeout(() => {
      this.readyState = 1;
      this.listeners.open.forEach(listener => listener());
    }, 0);
  }

  addEventListener(event: string, listener: Function) {
    this.listeners[event].push(listener);
  }

  send(data: string) {}

  close() {
    this.readyState = 3;
    this.listeners.close.forEach(listener => listener());
  }

  // Helper to simulate incoming messages
  _receiveMessage(data: any) {
    this.listeners.message.forEach(listener => 
      listener({ data: JSON.stringify(data) })
    );
  }

  // Helper to simulate errors
  _triggerError() {
    this.listeners.error.forEach(listener => listener());
  }
}

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('WebSocketService', () => {
  let service: WebSocketService;
  const baseUrl = 'ws://test.com';

  beforeEach(() => {
    // Reset mocks
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
    mockLocalStorage.clear.mockReset();

    // Create new service instance
    service = new WebSocketService(baseUrl);

    // Mock WebSocket global
    (global as any).WebSocket = MockWebSocket;
  });

  it('should connect to WebSocket server with auth token', async () => {
    const mockToken = 'test-token';
    mockLocalStorage.getItem.mockResolvedValue(mockToken);

    let connected = false;
    service.subscribe('connect', () => {
      connected = true;
    });

    await service.connect();
    expect(connected).toBe(true);
  });

  it('should handle task updates correctly', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    const mockStatus: TaskStatus = {
      status: 'in_progress',
      task_id: 'test-123',
      last_updated: new Date().toISOString()
    };

    let receivedStatus: TaskStatus | null = null;
    service.subscribe('task_update', (status) => {
      receivedStatus = status;
    });

    // Simulate incoming task update
    (global as any).WebSocket.prototype._receiveMessage({
      type: 'task_update',
      status: mockStatus
    });

    expect(receivedStatus).toEqual(mockStatus);
  });

  it('should handle task results correctly', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    const mockResult: TaskResult = {
      content: { test: 'data' }
    };

    let receivedResult: TaskResult | null = null;
    service.subscribe('task_result', (result) => {
      receivedResult = result;
    });

    // Simulate incoming task result
    (global as any).WebSocket.prototype._receiveMessage({
      type: 'task_result',
      result: mockResult
    });

    expect(receivedResult).toEqual(mockResult);
  });

  it('should attempt reconnection on disconnect', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    let disconnectCount = 0;
    let connectCount = 0;

    service.subscribe('disconnect', () => {
      disconnectCount++;
    });

    service.subscribe('connect', () => {
      connectCount++;
    });

    // Simulate disconnect
    (global as any).WebSocket.prototype._triggerError();

    // Wait for reconnect attempt
    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(disconnectCount).toBeGreaterThan(0);
    expect(connectCount).toBeGreaterThan(1);
  });

  it('should handle subscription acknowledgments', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    let receivedAck: { task_id: string } | null = null;
    service.subscribe('subscription_ack', (ack) => {
      receivedAck = ack;
    });

    const mockTaskId = 'test-123';
    service.subscribeToTask(mockTaskId);

    // Simulate subscription acknowledgment
    (global as any).WebSocket.prototype._receiveMessage({
      type: 'subscription_ack',
      task_id: mockTaskId
    });

    expect(receivedAck).toEqual({ task_id: mockTaskId });
  });

  it('should clean up resources on disconnect', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    let disconnected = false;
    service.subscribe('disconnect', () => {
      disconnected = true;
    });

    service.disconnect();
    expect(disconnected).toBe(true);
  });
});
```

---

## /src/models/Assessment.ts

```typescript
// File: /src/models/Assessment.ts
// Description: MongoDB schema model for assessments
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  studentId: string;
  assessmentType: string;
  score: number;
  details?: any;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true, ref: 'Student' },
    assessmentType: { type: String, required: true },
    score: { type: Number, required: true },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries by student and assessment type
AssessmentSchema.index({ studentId: 1, assessmentType: 1 });

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
```

---

## /src/models/LearningPlan.ts

```typescript
// File: /src/models/LearningPlan.ts
// Description: MongoDB schema model for learning plans
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject {
  name: string;
  topics: {
    name: string;
    activities: {
      title: string;
      description: string;
      type: string;
      duration: string;
      resources?: string[];
    }[];
  }[];
}

export interface ILearningPlan extends Document {
  studentId: string;
  grade: string;
  learningStyle: string;
  subjects: ISubject[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const LearningPlanSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true, ref: 'Student' },
    grade: { type: String, required: true },
    learningStyle: { type: String, required: true },
    subjects: [{
      name: { type: String, required: true },
      topics: [{
        name: { type: String, required: true },
        activities: [{
          title: { type: String, required: true },
          description: { type: String, required: true },
          type: { type: String, required: true },
          duration: { type: String, required: true },
          resources: [{ type: String }]
        }]
      }]
    }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { 
      type: String,
      enum: ['active', 'completed', 'pending'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.LearningPlan || mongoose.model<ILearningPlan>('LearningPlan', LearningPlanSchema);
```

---

## /src/models/Parent.ts

```typescript
// File: /src/models/Parent.ts
// Description: MongoDB schema model for parents
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IParent extends Document {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  students: string[]; // References to student IDs
}

const ParentSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    students: [{ type: String, ref: 'Student' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Parent || mongoose.model<IParent>('Parent', ParentSchema);
```

---

## /src/models/Student.ts

```typescript
// File: /src/models/Student.ts
// Description: MongoDB schema model for students
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  uid: string;
  firstName: string;
  lastName: string;
  grade: string;
  parentId: string;
  learningStyle?: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
    primary: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  };
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    grade: { type: String, required: true },
    parentId: { type: String, required: true, ref: 'Parent' },
    learningStyle: {
      visual: { type: Number, min: 0, max: 100, default: 0 },
      auditory: { type: Number, min: 0, max: 100, default: 0 },
      reading: { type: Number, min: 0, max: 100, default: 0 },
      kinesthetic: { type: Number, min: 0, max: 100, default: 0 },
      primary: { 
        type: String, 
        enum: ['visual', 'auditory', 'reading', 'kinesthetic'],
      }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
```

---

## /src/models/User.ts

```typescript
// File: /src/models/User.ts
// Description: MongoDB schema model for users
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'admin' | 'parent' | 'student' | 'teacher';
}

const UserSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    photoURL: { type: String },
    role: { 
      type: String, 
      enum: ['admin', 'parent', 'student', 'teacher'],
      default: 'parent'
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

---

