import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaHeadphones, FaEye, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const LearningStyles = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Learning Styles</h1>
        <p>Discover how you learn best</p>
      </Header>

      <StylesGrid>
        <StyleCard>
          <IconWrapper>
            <FaEye />
          </IconWrapper>
          <h3>Visual</h3>
          <p>Learn through seeing, watching, and reading</p>
        </StyleCard>

        <StyleCard>
          <IconWrapper>
            <FaHeadphones />
          </IconWrapper>
          <h3>Auditory</h3>
          <p>Learn through listening and speaking</p>
        </StyleCard>

        <StyleCard>
          <IconWrapper>
            <FaBook />
          </IconWrapper>
          <h3>Reading/Writing</h3>
          <p>Learn through reading and writing text</p>
        </StyleCard>

        <StyleCard>
          <IconWrapper>
            <FaRunning />
          </IconWrapper>
          <h3>Kinesthetic</h3>
          <p>Learn through doing and moving</p>
        </StyleCard>
      </StylesGrid>

      <CTASection>
        <h2>Want to know your learning style?</h2>
        <StyledLink to="/take-assessment">Take the Assessment</StyledLink>
      </CTASection>

      <GoogleLoginSection>
        <GoogleLoginButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleLoginButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: var(--primary-color);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-color);
    font-size: 1.2rem;
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StyleCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  
  h3 {
    color: var(--primary-color);
    margin: 1rem 0;
  }
  
  p {
    color: var(--text-color);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 2rem;
  }
`;

const StyledLink = styled(Link)`
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--secondary-color);
  }
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleLoginButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background: var(--secondary-color);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default LearningStyles;
