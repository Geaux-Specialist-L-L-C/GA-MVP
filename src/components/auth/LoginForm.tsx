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
  &:hover {
    background-color: #357abd;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset error when component unmounts or when email/password changes
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [email, password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      clearError();
      setIsSubmitting(true);
      await loginWithGoogle();
      // Navigation is handled in AuthContext after successful login
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        error={authError}
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
