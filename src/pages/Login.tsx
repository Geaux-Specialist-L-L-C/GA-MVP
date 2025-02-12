import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Remove .tsx extension
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { loginWithGoogle, login, loading: authLoading } = useAuth();  // Destructure needed methods
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      // Navigation is handled in AuthContext after successful login
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('auth/popup-closed-by-user')) {
          setError('Popup closed by user. Please try again.');
        } else if (err.message.includes('NS_ERROR_DOM_COEP_FAILED')) {
          setError('Cross-Origin-Embedder-Policy error. Please check your browser settings.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to sign in with Google');
      }
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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
  color: #333;
  font-size: 0.9rem;
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

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #357abd;
  }

  &:disabled {
    background: #9fc7e8;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #666;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  &::before {
    margin-right: 0.5rem;
  }
  
  &::after {
    margin-left: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
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
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #c8c9ca;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: #4a90e2;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
