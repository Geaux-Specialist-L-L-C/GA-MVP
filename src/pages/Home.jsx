// src/pages/Home.jsx
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import LearningStyles from '../components/home/LearningStyles';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Features />
      <LearningStyles />
    </motion.div>
  );
};

export default Home;