// src/pages/LearningStyles.jsx
import { motion } from 'framer-motion';
import HomeLearningStyles from '../components/home/LearningStyles';

const LearningStyles = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <h1>Learning Styles</h1>
        <HomeLearningStyles />
      </div>
    </motion.div>
  );
};

export default LearningStyles;