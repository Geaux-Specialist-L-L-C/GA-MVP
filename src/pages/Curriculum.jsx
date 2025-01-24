// src/pages/Curriculum.jsx
import { motion } from 'framer-motion';

const Curriculum = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Curriculum</h1>
      {/* Add your curriculum page content here */}
    </motion.div>
  );
};

export default Curriculum;