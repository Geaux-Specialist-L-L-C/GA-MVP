import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const navigate = useNavigate();
  const { createUser, googleLogin } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    setError('');
    setLoading(true);
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign up with Google');
    }
    setLoading(false);
  };

  // ...existing styled components code...
  return (
    <FormContainer>
      <FormBox>
        <h2>Sign Up</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          // ...rest of the existing JSX...
        </form>
      </FormBox>
    </FormContainer>
  );
};

// ...existing styled components...

export default SignUp;
