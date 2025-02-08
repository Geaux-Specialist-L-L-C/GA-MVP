import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBook, FaHeadphones, FaEye, FaRunning, FaBrain, FaUsers } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/layout/Header";

const LearningStyles: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  const learningStyles = [
    { title: "Visual", description: "Learn through seeing, watching, and reading", icon: <FaEye /> },
    { title: "Auditory", description: "Learn through listening and speaking", icon: <FaHeadphones /> },
    { title: "Reading/Writing", description: "Learn through reading and writing text", icon: <FaBook /> },
    { title: "Kinesthetic", description: "Learn through doing and moving", icon: <FaRunning /> },
    { title: "Logical", description: "Learn through reasoning and problem-solving", icon: <FaBrain /> },
    { title: "Social", description: "Learn through group interaction and collaboration", icon: <FaUsers /> }
  ];

  return (
    <>
      <Header />
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Title>Learning Styles</Title>
          <Subtitle>Discover how you learn best</Subtitle>

          <StylesGrid>
            {learningStyles.map((style, index) => (
              <StyleCard key={index} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <IconWrapper>{style.icon}</IconWrapper>
                <h3>{style.title}</h3>
                <p>{style.description}</p>
              </StyleCard>
            ))}
          </StylesGrid>

          <CTASection>
            <h2>Want to know your learning style?</h2>
            <StyledButton onClick={() => navigate('/take-assessment')}>
              Take the Assessment
            </StyledButton>
          </CTASection>

          <GoogleLoginSection>
            <p>Sign in to unlock more features!</p>
            <GoogleLoginButton onClick={handleGoogleLogin}>Sign in with Google</GoogleLoginButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </GoogleLoginSection>
        </motion.div>
      </Container>
    </>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1100px;
  margin: 80px auto 0;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const StyleCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 280px;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 2rem;
  }
`;

const StyledButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background: var(--secondary-color);
  }
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleLoginButton = styled.button`
  background: #4285F4;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  display: inline-block;
  
  &:hover {
    background: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

export default LearningStyles;
