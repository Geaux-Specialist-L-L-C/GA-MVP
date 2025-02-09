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