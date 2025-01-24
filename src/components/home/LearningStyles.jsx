// src/components/home/LearningStyles.jsx
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './LearningStyles.css';

const LearningStyles = () => {
  const styles = [
    {
      title: 'Visual Learning',
      description: 'Learn through seeing and watching demonstrations',
      icon: '👁️'
    },
    {
      title: 'Auditory Learning',
      description: 'Learn through listening and discussion',
      icon: '👂'
    },
    {
      title: 'Reading/Writing',
      description: 'Learn through reading and taking notes',
      icon: '📚'
    },
    {
      title: 'Kinesthetic',
      description: 'Learn through doing and practicing',
      icon: '🤸'
    }
  ];

  return (
    <section className="learning-styles-section">
      <div className="styles-grid">
        {styles.map((style, index) => (
          <Card key={index} className="style-card">
            <div className="style-icon">{style.icon}</div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningStyles;