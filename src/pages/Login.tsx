import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface LocationState {
  from?: {
    pathname: string;
  };
  error?: string;
}

const Login: React.FC = () => {
  const { currentUser, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const [error, setError] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const errorMessage = location.state?.error || null;

  useEffect(() => {
    if (currentUser) {
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      setIsRedirecting(true);
      await loginWithGoogle();
    } catch (err: any) {
      setIsRedirecting(false);
      setError(err?.message || 'Failed to sign in with Google');
    }
  };

  if (loading || isRedirecting) {
    return (
      <LoadingContainer>
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>
            Connecting to Google...
          </LoadingText>
        </LoadingOverlay>
      </LoadingContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome Back</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={loading || isRedirecting}
        >
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
      </LoginBox>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 2rem;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    background: ${props => props.disabled ? 'white' : '#f5f5f5'};
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const RedirectMessage = styled.p`
  text-align: center;
  color: #4b5563;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: white;
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color, #4CAF50);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: var(--primary-color, #4CAF50);
  font-size: 1.1rem;
  font-weight: 500;
`;

export default Login;
