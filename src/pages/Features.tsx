import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FaChartLine, FaChalkboardTeacher, FaGamepad, FaBullseye, FaBrain, FaUsers } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";

const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const features = [
    { title: "Personalized Learning Paths", description: "AI-driven customization based on your learning style", icon: <FaBullseye /> },
    { title: "Real-time Progress Tracking", description: "Monitor achievements and growth with detailed analytics", icon: <FaChartLine /> },
    { title: "Interactive Content", description: "Engage with multimedia lessons and activities", icon: <FaGamepad /> },
    { title: "Expert Support", description: "Access to qualified educators and mentors", icon: <FaChalkboardTeacher /> },
    { title: "AI-Powered Insights", description: "Get deep learning insights based on your progress", icon: <FaBrain /> },
    { title: "Community Learning", description: "Engage with a learning community and peer support", icon: <FaUsers /> }
  ];

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError((error as Error).message);
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Header />
      <FeaturesContainer>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Title>Platform Features</Title>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureText>
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                </FeatureText>
              </FeatureCard>
            ))}
          </FeatureGrid>
          <LoginSection>
            <p>Sign in to unlock more features!</p>
            <GoogleLoginButton onClick={handleGoogleLogin}>
              Sign in with Google
            </GoogleLoginButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </LoginSection>
        </motion.div>
      </FeaturesContainer>
    </>
  );
};

// Styled Components
const FeaturesContainer = styled.div`
  max-width: 1100px;
  margin: 80px auto 0;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  justify-items: center; // Ensures even alignment
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const FeatureText = styled.div`
  h2 {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
  }
`;

const LoginSection = styled.div`
  margin-top: 3rem;
  text-align: center;
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

export default Features;
