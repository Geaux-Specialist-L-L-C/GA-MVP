import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Integrity: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaBalanceScale size={40} />
        <h1>Integrity</h1>
      </ValueHeader>
      <ValueContent>
        <p>At Geaux Academy, integrity is the foundation of everything we do. We believe in:</p>
        <ValuePoints>
          <li>Maintaining the highest ethical standards in education</li>
          <li>Being transparent with our teaching methods and student progress</li>
          <li>Creating a safe and honest learning environment</li>
          <li>Delivering on our promises to students and parents</li>
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
  max-width: 800px;
  margin: 80px auto;
  padding: 2rem;
`;

const ValueHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);

  h1 {
    margin-top: 1rem;
    font-size: 2.5rem;
  }
`;

const ValueContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ValuePoints = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt);
    border-radius: 4px;
    
    &:hover {
      transform: translateX(5px);
      transition: transform 0.2s;
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

export default Integrity;
