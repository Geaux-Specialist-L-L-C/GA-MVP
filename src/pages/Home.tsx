import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FaGraduationCap, FaChartLine, FaLightbulb } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  h1 {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const HeroImage = styled.img`
  max-width: 100%;
  height: auto;
  margin: 2rem auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
`;

const FlipContainer = styled.div`
  perspective: 1000px;
  height: 200px;
`;

const FlipInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;

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
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FlipBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: var(--primary-color);
  color: white;
  transform: rotateY(180deg);
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  margin: 2rem 0;

  h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;

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

interface FlipCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ icon, title, description }) => {
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

const features: Feature[] = [
  { icon: <FaGraduationCap />, title: "Expert Instruction", description: "Learn from industry professionals." },
  { icon: <FaChartLine />, title: "Track Progress", description: "Monitor your growth with analytics." },
  { icon: <FaLightbulb />, title: "Interactive Learning", description: "Engage with hands-on exercises." },
];

const Home: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    try {
      setError("");
      const email = "user@example.com"; // Replace with actual email
      const password = "password123"; // Replace with actual password
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Login error:", error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <h1>Welcome to Geaux Academy</h1>
          <p>Empowering Personalized Learning through AI</p>
          <HeroImage src="/images/hero-learning.svg" alt="Learning illustration" />
        </HeroContent>
      </HeroSection>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FlipCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </FeaturesGrid>

      <CallToAction>
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join Geaux Academy today and unlock your full potential.</p>
        <GoogleLoginSection>
          <p>Sign in with Google to get started</p>
          <GoogleLoginButton onClick={handleLogin}>
            <img src="/google-icon.svg" alt="Google" width="24" height="24" />
            Sign in with Google
          </GoogleLoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </GoogleLoginSection>
      </CallToAction>
    </Container>
  );
};

export default memo(Home);
