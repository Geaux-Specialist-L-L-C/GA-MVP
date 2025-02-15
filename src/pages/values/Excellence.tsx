import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeProps {
  theme: DefaultTheme;
}

const Excellence: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaTrophy size={40} />
        <h1>Excellence</h1>
      </ValueHeader>
      <ValueContent>
        <p>We strive for excellence in every aspect of education:</p>
        <ValuePoints>
          <li>Setting high academic standards while supporting individual growth</li>
          <li>Continuously improving our teaching methodologies</li>
          <li>Providing top-quality educational resources</li>
          <li>Measuring and celebrating student achievements</li>
        </ValuePoints>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const GoogleButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.875rem;
`;

export default Excellence;
