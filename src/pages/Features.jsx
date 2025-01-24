// src/pages/Features.jsx
import { motion } from 'framer-motion';

const Features = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Features</h1>
      {/* Add your features page content here */}
    </motion.div>
  );
};

export default Features;