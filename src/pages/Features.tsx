import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FaChartLine, FaChalkboardTeacher, FaGamepad, FaBullseye, FaBrain, FaUsers } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const features: Feature[] = [
    { title: "Personalized Learning Paths", description: "AI-driven customization based on your learning style", icon: <FaBullseye /> },
    { title: "Real-time Progress Tracking", description: "Monitor achievements and growth with detailed analytics", icon: <FaChartLine /> },
    { title: "Interactive Content", description: "Engage with multimedia lessons and activities", icon: <FaGamepad /> },
    { title: "Expert Support", description: "Access to qualified educators and mentors", icon: <FaChalkboardTeacher /> },
    { title: "AI-Powered Insights", description: "Get deep learning insights based on your progress", icon: <FaBrain /> },
    { title: "Community Learning", description: "Engage with a learning community and peer support", icon: <FaUsers /> }
  ];

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
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
              <FeatureCard 
                key={index} 
                whileHover={{ scale: 1.05 }} 
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedFeature(index)}
              >
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

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const FeatureText = styled.div`
  text-align: center;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const LoginSection = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);

  p {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
`;

export default Features;