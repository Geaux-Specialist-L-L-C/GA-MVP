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
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(70, 84, 246, 0.2);
  }
`;

const LoginForm: React.FC = (): JSX.Element => {
  const { login, loginWithGoogle, loading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

  const handleLogin = async (): Promise<void> => {
    try {
      setLocalError('');
      setLoading(true);
      await login(email, password);
      const destination = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to log in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLocalError('');
      setLoading(true);
      await loginWithGoogle();
      const destination = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
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
      <Button type="submit" $variant="primary" disabled={loading || authLoading}>
        Login
      </Button>
      <GoogleLoginButton
        handleGoogleLogin={handleGoogleLogin}
        loading={loading || authLoading}
        error={localError || authError || undefined}
        onDismissError={handleDismissError}
      />
    </Form>
  );
};

export default LoginForm;
