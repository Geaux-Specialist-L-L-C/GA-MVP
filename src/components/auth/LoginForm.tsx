import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
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

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #357abd;
  }
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, loginWithGoogle } = useAuth();  // Fixed function name
  const navigate = useNavigate();
  const location = useLocation();

  const clearError = () => {
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await login(email, password);
      navigate((location.state as any)?.from?.pathname || '/dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await loginWithGoogle();  // Fixed function name
      navigate((location.state as any)?.from?.pathname || '/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign in was cancelled. Please try again.');
      } else {
        setAuthError(error.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset error when component unmounts or when email/password changes
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [email, password, clearError]);

  return (
    <div className="auth-container card">
      <h2 className="auth-title">Welcome Back</h2>
      
      {authError && (
        <ErrorMessage role="alert">
          {authError}
          <CloseButton onClick={clearError} aria-label="Dismiss error">
            ×
          </CloseButton>
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          autoComplete="email"
          disabled={isSubmitting}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Password"
          autoComplete="current-password"
          disabled={isSubmitting}
          minLength={6}
        />

        <SubmitButton type="submit" disabled={isSubmitting || !email || !password}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </SubmitButton>
      </Form>

      <GoogleLoginButton 
        handleGoogleLogin={handleGoogleLogin}
        error={authError || undefined}
        loading={isSubmitting}
        onDismissError={clearError}
      />
      
      <div className="auth-divider">
        <span>New to Geaux Academy?</span>
      </div>
      
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/signup')}
      >
        Create an Account
      </button>
    </div>
  );
};

export default LoginForm;
