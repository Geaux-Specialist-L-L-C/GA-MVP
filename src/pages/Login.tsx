import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

const Login: React.FC = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const errorMessage = location.state?.error || null;

  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath);
    }
  }, [user, navigate, location]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
    } catch (error) {
      setError('Failed to sign in with Google: ' + (error as Error).message);
      console.error('Login error:', error);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome Back</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        
        <GoogleButton onClick={handleGoogleLogin}>
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
  transition: background 0.2s;

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

export default Login;
