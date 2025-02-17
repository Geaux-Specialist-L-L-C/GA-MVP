import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';
import FormGroup from '../molecules/FormGroup';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const createCheshireAccount = async (uid: string, email: string) => {
    try {
      await CheshireService.createCheshireUser(uid, email);
    } catch (error) {
      console.error('Error creating Cheshire account:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(formData.email, formData.password);
      
      if (userCredential?.user) {
        await createCheshireAccount(userCredential.user.uid, userCredential.user.email || '');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>Create an Account</h2>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <DismissButton onClick={() => setError('')}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup
            label="Email"
            inputs={[{
              placeholder: 'Enter your email',
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              error: false
            }]}
          />
          <FormGroup
            label="Password"
            inputs={[{
              placeholder: 'Enter your password',
              value: formData.password,
              onChange: (e) => setFormData({ ...formData, password: e.target.value }),
              error: false
            }]}
          />
          <FormGroup
            label="Confirm Password"
            inputs={[{
              placeholder: 'Confirm your password',
              value: formData.confirmPassword,
              onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
              error: false
            }]}
          />
          <Button type="submit" $variant="primary">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Form>

        <Divider>
          <span>Or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle />
          <span>Sign up with Google</span>
        </GoogleButton>

        <LoginPrompt>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginPrompt>
      </SignUpCard>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  span {
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
`;

const Link = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
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

const DismissButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc2626;
  &:hover {
    opacity: 0.7;
  }
`;

export default SignUp;
