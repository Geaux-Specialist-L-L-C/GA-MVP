// src/pages/Home.jsx
import { motion } from 'framer-motion';
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
          <Button to="/signup">Get Started</Button>
        </CallToAction>
      </motion.div>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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

const Button = styled.button`
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }
`;

export default Home;