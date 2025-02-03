import React, { useState, memo } from "react";
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import styled from 'styled-components';
import { containerVariants, itemVariants } from '../utils/animations';
import { FaGraduationCap, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import Header from '../components/layout/Header';  // Updated import path

// Component definitions first
const Features = () => (
  <FeaturesGrid>
    {features.map((feature, index) => (
      <FeatureCard
        key={index}
        as={motion.div}
        variants={itemVariants}
        whileHover="hover"
      >
        <IconWrapper>{feature.icon}</IconWrapper>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </FeatureCard>
    ))}
  </FeaturesGrid>
);

const LearningStyles = () => (
  <section>
    {/* Add your learning styles content here */}
  </section>
);

const Hero = () => {
  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle>Welcome to Geaux Academy</HeroTitle>
        <HeroSubtitle>Your Journey to Learning Excellence Starts Here</HeroSubtitle>
        <HeroImage src="/images/hero-learning.svg" alt="hero" />
      </HeroContent>
    </HeroSection>
  );
};

// Memoization after component definitions
const MemoizedHero = memo(Hero);
const MemoizedFeatures = memo(Features);
const MemoizedLearningStyles = memo(LearningStyles);

const reducedMotionVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.1 }
  }
};

// Remove duplicate itemVariants definition since we're importing it
// Remove duplicate pageVariants since we're using containerVariants

const features = [
  {
    icon: <FaGraduationCap />,
    title: "Expert Instruction",
    description: "Learn from industry professionals"
  },
  {
    icon: <FaChartLine />,
    title: "Track Progress",
    description: "Monitor your growth with analytics"
  },
  {
    icon: <FaLightbulb />,
    title: "Interactive Learning",
    description: "Engage with hands-on exercises"
  }
];

const Home = () => {
  const prefersReducedMotion = useReducedMotion();
  const currentVariants = prefersReducedMotion ? reducedMotionVariant : containerVariants;
  const { currentUser, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
    <Container
      as={motion.div}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Header />  {/* Add header component */}
      <motion.div
        variants={currentVariants}
        initial="hidden"
        animate="show"
      >
        <MemoizedHero />
        <MemoizedFeatures />
        <MemoizedLearningStyles />
        
        <CallToAction>
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>Join Geaux Academy today and discover your unique learning style</p>
          <StyledLink to="/signup">
            Get Started
          </StyledLink>
        </CallToAction>

        <ButtonGroup>
          <GoogleButton onClick={handleGoogleLogin}>
            <FcGoogle className="text-xl" />
            Sign in with Google
          </GoogleButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ButtonGroup>
      </motion.div>
    </Container>
  );
};

export default memo(Home);

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
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
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.primary};
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
`;

const HeroImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 2rem;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const FeatureCard = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: var(--primary-color);
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
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

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const styles = {
  container: {
    padding: '0 0.5rem', // Ensure this line is correct
    // Other styles...
  },
  // Other style objects...
};
