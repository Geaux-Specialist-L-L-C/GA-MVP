// src/pages/Contact.jsx
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Contact Us</h1>
      {/* Add your contact page content here */}
    </motion.div>
  );
};

export default Contact;