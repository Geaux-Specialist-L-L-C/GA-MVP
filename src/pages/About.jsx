// src/pages/About.jsx
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>About Geaux Academy</h1>
      {/* Add your about page content here */}
    </motion.div>
  );
};

export default About;