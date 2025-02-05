import React from 'react';
import styled from 'styled-components';
import InfoCard from '../common/InfoCard'; // Fixed path
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './LearningStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEar, faBook, faRunning } from '@fortawesome/free-solid-svg-icons';

const LearningStyles = () => {
  const styles = [
    {
      title: 'Visual Learning',
      description: 'Learn through seeing and watching demonstrations',
      icon: faEye
    },
    {
      title: 'Auditory Learning',
      description: 'Learn through listening and discussion',
      icon: faEar
    },
    {
      title: 'Reading/Writing',
      description: 'Learn through reading and taking notes',
      icon: faBook
    },
    {
      title: 'Kinesthetic',
      description: 'Learn through doing and practicing',
      icon: faRunning
    }
  ];

  return (
    <section className="learning-styles-section">
      <div className="styles-grid">
        {styles.map((style, index) => (
          <Card key={index} className="style-card" icon={style.icon}>
            <div className="style-icon"><FontAwesomeIcon icon={style.icon} /></div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningStyles;
