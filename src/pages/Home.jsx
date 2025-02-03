// src/pages/Home.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import React, { memo } from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import LearningStyles from '../components/home/LearningStyles';
import styled from 'styled-components';
import { containerVariants } from '../utils/animations';

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

const Home = () => {
  const prefersReducedMotion = useReducedMotion();
  const currentVariants = prefersReducedMotion ? reducedMotionVariant : containerVariants;

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
    </HomeContainer>
  );
};

export default memo(Home);

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 4rem 0;
  background: var(--light-bg);
  margin: 2rem 0;
  border-radius: 8px;

  h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    margin-bottom: 2rem;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
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