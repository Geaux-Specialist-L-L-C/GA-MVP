// src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import LearningStyles from '../components/home/LearningStyles';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <Features />
        <LearningStyles />
        
        <CallToAction>
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>Join Geaux Academy today and discover your unique learning style</p>
          <CTAButton to="/signup">Get Started Now</CTAButton>
        </CallToAction>
      </motion.div>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--background-alt);
  border-radius: 8px;
  margin: 4rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 2rem;
    line-height: 1.5;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: var(--text-light);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: var(--hover-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export default Home;