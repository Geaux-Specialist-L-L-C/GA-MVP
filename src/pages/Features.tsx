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

// ... existing styled components ...

export default Features;