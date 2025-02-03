// src/utils/animations.js
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};