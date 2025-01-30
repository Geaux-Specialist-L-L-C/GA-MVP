// src/pages/Home.jsx
import React from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaLightbulb, FaRocket } from 'react-icons/fa';
import heroImage from "/public/images/hero-learning.svg";

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

const Home = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <HomeContainer
      as={motion.div}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HeroSection>
        <HeroContent>
          <motion.h1 variants={itemVariants}>
            Welcome to Geaux Academy
          </motion.h1>
          <motion.p variants={itemVariants}>
            Your journey to excellence starts here
          </motion.p>
          <ButtonGroup>
            <PrimaryButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket /> Get Started
            </PrimaryButton>
            <SecondaryButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </SecondaryButton>
          </ButtonGroup>
        </HeroContent>
        <HeroImage src={heroImage} alt="Learning illustration" />
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
    </HomeContainer>
  );
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

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PrimaryButton = styled(Button)`
  background: var(--primary-color);
  color: white;
  border: none;
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
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

export default Home;