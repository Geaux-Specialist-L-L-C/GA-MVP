import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBook, FaHeadphones, FaEye, FaRunning, FaBrain, FaUsers } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/layout/Header";
import Button from "../components/common/Button";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  text-align: center;
  color: var(--text-color);
  margin-bottom: 3rem;
  font-weight: normal;
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StyleCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CTASection = styled.div`
  text-align: center;
  margin: 4rem 0;
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin: 0 auto;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
`;

interface LearningStyle {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const LearningStyles: React.FC = () => {
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

  const learningStyles: LearningStyle[] = [
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
            <Button to='/take-assessment' $variant="primary">
              Take the Assessment
            </Button>
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

export default LearningStyles;