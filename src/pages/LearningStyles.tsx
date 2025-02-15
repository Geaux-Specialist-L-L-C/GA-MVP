// File: /src/pages/LearningStyles.tsx
// Description: Learning Styles page component explaining different learning styles.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { FaHeadphones, FaBook, FaRunning, FaBrain, FaUsers, FaEye } from 'react-icons/fa';
import Card from '../components/common/Card';

const LearningStyles: React.FC = () => {
  const learningStyles = [
    { title: "Visual", description: "Learn through seeing and watching demonstrations", icon: <FaEye /> },
    { title: "Auditory", description: "Learn through listening and speaking", icon: <FaHeadphones /> },
    { title: "Reading/Writing", description: "Learn through reading and writing text", icon: <FaBook /> },
    { title: "Kinesthetic", description: "Learn through doing and moving", icon: <FaRunning /> },
    { title: "Logical", description: "Learn through reasoning and problem-solving", icon: <FaBrain /> },
    { title: "Social", description: "Learn through group interaction and collaboration", icon: <FaUsers /> }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Learning Styles</h1>
      <p className="mt-4">Discover your preferred learning style and how Geaux Academy can help you learn more effectively.</p>

      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StylesGrid>
          {learningStyles.map((style, index) => (
            <StyleCard 
              key={index} 
              as={m.div}
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>{style.icon}</IconWrapper>
              <h3>{style.title}</h3>
              <p>{style.description}</p>
            </StyleCard>
          ))}
        </StylesGrid>

        <CTASection>
          <h2>Want to know your learning style?</h2>
          <Button to='/take-assessment' $variant="primary">
            Take the Assessment
          </Button>
        </CTASection>
      </m.div>
    </div>
  );
};

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m(Card))`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const CTASection = styled.div`
  text-align: center;
  margin: 4rem 0;

  h2 {
    margin-bottom: 2rem;
  }
`;
interface ButtonProps {
  $variant?: 'primary' | 'secondary';
}

const Button = styled(m(Link))<ButtonProps>`
  display: inline-block;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.palette.primary.main};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    background: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export default LearningStyles;
