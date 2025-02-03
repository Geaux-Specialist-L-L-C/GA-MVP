import React, { useState, memo } from "react";
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import styled from 'styled-components';
import { containerVariants } from '../utils/animations';
import { FaGraduationCap, FaChartLine, FaLightbulb, FaRocket } from 'react-icons/fa';
import heroImage from "/public/images/hero-learning.svg";
import { FcGoogle } from "react-icons/fc";

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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, y: -20 }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};

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
    <HomeContainer role="main">
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
          <StyledLink 
            to="/signup" 
            aria-label="Get Started with Geaux Academy"
          >
            Get Started
          </StyledLink>
        </CallToAction>
      </motion.div>
    <HomeContainer
      as={motion.div}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroContent>
            <h1>Welcome to Geaux Academy</h1>
            <p>Personalized learning paths for every student</p>
            <CTAButton 
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </CTAButton>
          </HeroContent>
        </motion.div>
        <HeroImage 
          src={heroImage} 
          alt="Learning illustration"
          as={motion.img}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </HeroSection>

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

      <ButtonGroup>
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ButtonGroup>
    </HomeContainer>
  );
};

export default memo(Home);

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 80px auto 0; // Added top margin to account for fixed header
  padding: 2rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  min-height: 80vh;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-weight: bold;
  }

  p {
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
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
  border: none;
`;

const HeroImage = styled(motion.img)`
  width: 100%;
  max-width: 500px;
  height: auto;
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

export default Home;
