// src/pages/LearningStyles.jsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LearningStyles = () => {
  const styles = [
    {
      type: "Visual",
      description: "Learn best through images, diagrams, and spatial understanding",
      characteristics: ["Prefer diagrams", "Remember visual details", "Enjoy videos"],
      icon: "👁️"
    },
    {
      type: "Auditory",
      description: "Process information effectively through listening and discussion",
      characteristics: ["Learn by hearing", "Enjoy discussions", "Remember spoken information"],
      icon: "👂"
    },
    {
      type: "Kinesthetic",
      description: "Learn through hands-on experience and physical activity",
      characteristics: ["Learn by doing", "Prefer active participation", "Remember physical activities"],
      icon: "✋"
    },
    {
      type: "Reading/Writing",
      description: "Excel through written words and text-based input",
      characteristics: ["Enjoy reading", "Take detailed notes", "Prefer written instructions"],
      icon: "📚"
    }
  ];

  return (
    <StylesContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Understanding Learning Styles</h1>
          <p>Discover how you learn best and optimize your educational journey</p>
        </Header>

        <StylesGrid>
          {styles.map((style, index) => (
            <StyleCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IconWrapper>{style.icon}</IconWrapper>
              <h3>{style.type}</h3>
              <p>{style.description}</p>
              <CharacteristicsList>
                {style.characteristics.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </CharacteristicsList>
            </StyleCard>
          ))}
        </StylesGrid>

        <AssessmentSection>
          <h2>Find Your Learning Style</h2>
          <p>Take our comprehensive assessment to discover your unique learning profile</p>
          <AssessmentButton>Take Assessment</AssessmentButton>
        </AssessmentSection>
      </motion.div>
    </StylesContainer>
  );
};

const StylesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StyleCard = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
`;

const AssessmentSection = styled.section`
  text-align: center;
  padding: 3rem;
  background: var(--light-bg);
  border-radius: 8px;
`;

const AssessmentButton = styled.button`
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: var(--secondary-color);
  }
`;

export default LearningStyles;