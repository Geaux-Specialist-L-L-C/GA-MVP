import React from "react";
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 80px auto 0; // Added top margin to account for fixed header
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