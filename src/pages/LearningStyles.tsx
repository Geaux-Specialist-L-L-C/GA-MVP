import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBook, FaHeadphones, FaEye, FaRunning, FaBrain, FaUsers } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/layout/Header";
import Button from "../components/common/Button";

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

// ... existing styled components ...

export default LearningStyles;