import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-3 max-w-[100px] bg-white rounded-xl shadow-md mb-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [-2, 2, -2] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="w-2 h-2 bg-blue-600 rounded-full"
        />
      ))}
    </div>
  );
};

export default TypingIndicator;