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
  const [authMethod, setAuthMethod] = useState<'popup' | 'redirect'>('popup');
  const errorMessage = location.state?.error || null;

  useEffect(() => {
    if (currentUser) {
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath);
    }
  }, [currentUser, navigate, location]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      setIsRedirecting(true);
      setAuthMethod('popup');
      await loginWithGoogle();
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        setAuthMethod('redirect');
        setError('Popup was blocked. Trying redirect method...');
        // The redirect will happen automatically from AuthContext
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setIsRedirecting(false);
        setError((err?.message as string) || 'Failed to sign in with Google. Please try again later.');
      }
    }
  };

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
          {isRedirecting 
            ? authMethod === 'redirect' 
              ? 'Redirecting to Google...' 
              : 'Signing in...'
            : 'Sign in with Google'
          }
        </GoogleButton>
        {isRedirecting && authMethod === 'redirect' && (
          <RedirectMessage>
            You'll be redirected to Google to complete sign-in...
          </RedirectMessage>
        )}
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

export default Login;
