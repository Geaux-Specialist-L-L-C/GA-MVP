import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login: React.FC = () => {
  const {
    currentUser,
    isAuthReady,
    loginWithGoogle,
    loading: authLoading,
    error: authError,
    clearError
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof clearError === 'function') {
      clearError();
    }
  }, [clearError]);

  useEffect(() => {
    if (currentUser && isAuthReady) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [currentUser, isAuthReady, location.state?.from?.pathname, navigate]);

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
      <LoginContent className="glass-card">
        <LoginCopy>
          <span className="badge">Welcome back</span>
          <h1>Continue your learning journey.</h1>
          <p>Access your personalized dashboard, progress insights, and learning plan.</p>
          <InfoList>
            <li>Secure, one-tap Google sign in</li>
            <li>Instant access to your assessment results</li>
            <li>Personalized learning plan updates</li>
          </InfoList>
        </LoginCopy>

        <LoginBox>
          <Title>Sign in</Title>
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
      </LoginContent>
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
  min-height: calc(100vh - 80px);
  padding: 20px;
`;

const LoginContent = styled.div`
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const LoginCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    color: var(--text-secondary);
  }
`;

const InfoList = styled.ul`
  display: grid;
  gap: 0.5rem;
  padding-left: 1.2rem;
  color: var(--text-secondary);
`;

const LoginBox = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
`;

const Title = styled.h1`
  text-align: left;
  color: var(--text-primary);
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #111827;
  border: 1px solid var(--border-color);
  border-radius: 12px;
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
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default Login;
