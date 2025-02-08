import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FaGraduationCap, FaChartLine, FaLightbulb } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Button from '../components/common/Button'; // ✅ Make sure this path is correct!

// ✅ Flip Card Component
const FlipCard = ({ icon, title, description }) => {
  return (
    <FlipContainer>
      <FlipInner className="flip">
        <FlipFront>
          <IconWrapper>{icon}</IconWrapper>
          <h3>{title}</h3>
        </FlipFront>
        <FlipBack>
          <p>{description}</p>
        </FlipBack>
      </FlipInner>
    </FlipContainer>
  );
};

// Features Data
const features = [
  { icon: <FaGraduationCap />, title: "Expert Instruction", description: "Learn from industry professionals." },
  { icon: <FaChartLine />, title: "Track Progress", description: "Monitor your growth with analytics." },
  { icon: <FaLightbulb />, title: "Interactive Learning", description: "Engage with hands-on exercises." },
];

const Home = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <h1>Welcome to Geaux Academy</h1>
          <p>Your Journey to Learning Excellence Starts Here</p>
          <HeroImage src="/images/hero_img.svg" alt="Hero" />
        </HeroContent>
      </HeroSection>

      {/* Features Section with Flip Effect */}
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FlipCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </FeaturesGrid>

      <CallToAction>
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join Geaux Academy today and discover your unique learning style.</p>
        <Link to="/signup">
          <Button variant="primary">Get Started</Button>
        </Link>
      </CallToAction>

      <GoogleLoginSection>
        <GoogleLoginButton onClick={handleGoogleLogin}>
          <FcGoogle /> Sign in with Google
        </GoogleLoginButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

export default memo(Home);

/* 🖌️ Styled Components */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  
  h1 {
    font-size: 3rem;
    color: var(--primary-color);
  }
  
  p {
    font-size: 1.5rem;
    color: var(--text-color);
  }
`;

const HeroImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 2rem;
`;

const FeaturesGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FlipContainer = styled.div`
  perspective: 1000px;
  width: 280px;
  height: 280px;
`;

const FlipInner = styled.div`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  
  &:hover {
    transform: rotateY(180deg);
  }
`;

const FlipFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  text-align: center;
`;

const FlipBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);   
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  text-align: center;
  transform: rotateY(180deg);
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
`;

const CallToAction = styled.section`
  text-align: center;
  margin-top: 4rem;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleLoginButton = styled.button`
  background: #4285F4;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

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
