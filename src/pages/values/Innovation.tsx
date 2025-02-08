import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import useAuth from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Innovation: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        <FaLightbulb size={40} />
        <h1>Innovation</h1>
      </ValueHeader>
      <ValueContent>
        <p>Innovation drives our approach to personalized learning:</p>
        <ValuePoints>
          <li>Leveraging cutting-edge educational technology</li>
          <li>Developing adaptive learning pathways</li>
          <li>Creating interactive and engaging content</li>
          <li>Implementing data-driven teaching methods</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
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

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Innovation;
