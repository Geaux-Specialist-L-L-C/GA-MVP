// File: /src/pages/LearningStyles.tsx
// Description: Learning Styles page component explaining different learning styles.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeadphones, FaBook, FaRunning, FaBrain, FaUsers, FaEye } from 'react-icons/fa';

const learningStyles = [
  { title: 'Visual', description: 'Learn through seeing and watching demonstrations.', icon: <FaEye /> },
  { title: 'Auditory', description: 'Learn through listening, speaking, and dialogue.', icon: <FaHeadphones /> },
  { title: 'Reading/Writing', description: 'Learn through reading text and writing notes.', icon: <FaBook /> },
  { title: 'Kinesthetic', description: 'Learn through doing, moving, and hands-on work.', icon: <FaRunning /> },
  { title: 'Logical', description: 'Learn through reasoning, data, and problem-solving.', icon: <FaBrain /> },
  { title: 'Social', description: 'Learn through collaboration and peer interaction.', icon: <FaUsers /> }
];

const LearningStyles: React.FC = () => {
  return (
    <Page>
      <Hero>
        <span className="badge">Learning Styles</span>
        <h1>Discover how you learn best.</h1>
        <p>
          Knowing your learning style unlocks better strategies, stronger confidence, and faster growth.
        </p>
      </Hero>

      <StylesGrid>
        {learningStyles.map((style) => (
          <StyleCard className="glass-card" key={style.title}>
            <div className="icon">{style.icon}</div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection className="glass-card">
        <div>
          <h2>Want to know your learning style?</h2>
          <p>Start the quick assessment and get personalized insights.</p>
        </div>
        <Link to="/login" className="btn btn-primary">Take the Assessment</Link>
      </CTASection>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Hero = styled.section`
  display: grid;
  gap: 1rem;

  h1 {
    font-size: clamp(2.4rem, 3vw, 3.2rem);
  }

  p {
    max-width: 720px;
    color: var(--text-secondary);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const StyleCard = styled.div`
  padding: 1.75rem;
  display: grid;
  gap: 0.75rem;
  text-align: center;

  .icon {
    font-size: 2rem;
    color: var(--primary-color);
  }

  p {
    color: var(--text-secondary);
  }
`;

const CTASection = styled.section`
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;

  p {
    color: var(--text-secondary);
  }
`;

export default LearningStyles;
