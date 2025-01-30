import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEye, FaHeadphones, FaHandPaper, FaBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LearningStyles = () => {
  const styles = [
    {
      title: "Visual Learning",
      description: [
        'Learn best through images, diagrams, and spatial understanding',
        'Prefer visual aids and demonstrations',
        'Remember visual details easily',
        'Excel with charts and graphs'
      ],
      icon: <FaEye />
    },
    {
      title: "Auditory Learning",
      description: [
        'Process information effectively through listening',
        'Learn through discussions and lectures',
        'Remember spoken information well',
        'Benefit from audio materials'
      ],
      icon: <FaHeadphones />
    },
    {
      title: "Kinesthetic Learning",
      description: [
        'Learn through hands-on experience',
        'Prefer active participation',
        'Remember physical activities',
        'Excel in practical exercises'
      ],
      icon: <FaHandPaper />
    },
    {
      title: "Reading/Writing Learning",
      description: [
        'Excel through written content',
        'Take detailed notes',
        'Prefer text-based learning',
        'Learn best by writing'
      ],
      icon: <FaBook />
    }
  ];

  return (
    <Container>
      <Header>
        <h1>Learning Styles</h1>
      </Header>
      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h3>{style.title}</h3>
            <Description>
              {style.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </Description>
          </StyleCard>
        ))}
      </StylesGrid>
      <CTASection>
        <p>Discover your learning style by taking the assessment.</p>
        <Button to="/assessment">Take the Assessment</Button>
      </CTASection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-size: 2.8rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.3rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
`;

const StyleCard = styled.div`
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  h3 {
    color: var(--primary-color);
    margin: 1.2rem 0;
    font-size: 1.6rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;

  p {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }
`;

const Button = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: var(--secondary-color);
    transform: scale(1.05);
    color: white;
  }
`;

const Description = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  
  li {
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    
    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

export default LearningStyles;