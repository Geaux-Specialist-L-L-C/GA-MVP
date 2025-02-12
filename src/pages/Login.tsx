import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { loginWithGoogle, login, loading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [localError, setLocalError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear any existing auth errors when component mounts
    clearError();
  }, [clearError]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalError('');
      setLoading(true);
      await login(formData.email, formData.password);
      // Navigation is handled by AuthContext
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
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
      // Navigation is handled by AuthContext
    } catch (err) {
      // Don't set local error here as AuthContext handles it
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
            <DismissButton onClick={() => {
              setLocalError('');
              clearError();
            }}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleEmailLogin}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            Sign in with Email
          </LoginButton>
        </Form>

        <Divider>or</Divider>
        
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={loading}
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

const Form = styled.form`
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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

const Divider = styled.div`
  text-align: center;
  margin: 1rem 0;
  color: #777;
  
  &::before,
  &::after {
    content: '';
    display: inline-block;
    width: 45%;
    height: 1px;
    background-color: #ddd;
    margin: 0 0.5rem;
    vertical-align: middle;
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
