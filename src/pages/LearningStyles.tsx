import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeadphones, FaBook, FaRunning, FaBrain, FaUsers, FaEye } from 'react-icons/fa';
import { Header } from '../components/layout/Header';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import Card from '../components/common/Card';

const LearningStyles = () => {
  const learningStyles = [
    { title: "Visual", description: "Learn through seeing and watching demonstrations", icon: <FaEye /> },
    { title: "Auditory", description: "Learn through listening and speaking", icon: <FaHeadphones /> },
    { title: "Reading/Writing", description: "Learn through reading and writing text", icon: <FaBook /> },
    { title: "Kinesthetic", description: "Learn through doing and moving", icon: <FaRunning /> },
    { title: "Logical", description: "Learn through reasoning and problem-solving", icon: <FaBrain /> },
    { title: "Social", description: "Learn through group interaction and collaboration", icon: <FaUsers /> }
  ];

  return (
    <Container>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Title>Learning Styles</Title>
        <Subtitle>Discover how you learn best</Subtitle>

        <StylesGrid>
          {learningStyles.map((style, index) => (
            <StyleCard 
              key={index} 
              as={motion.div}
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
      </motion.div>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(Card)`
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

const Button = styled(motion.a)`
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