// src/pages/Features.jsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Features = () => {
  const features = [
    {
      title: "Personalized Learning Paths",
      description: "AI-driven customization based on your learning style",
      icon: "🎯"
    },
    {
      title: "Real-time Progress Tracking",
      description: "Monitor achievements and growth with detailed analytics",
      icon: "📊"
    },
    {
      title: "Interactive Content",
      description: "Engage with multimedia lessons and activities",
      icon: "🎮"
    },
    {
      title: "Expert Support",
      description: "Access to qualified educators and mentors",
      icon: "👩‍🏫"
    }
  ];

  return (
    <FeaturesContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Platform Features</h1>
          <p>Discover the tools that make learning personalized and effective</p>
        </Header>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </motion.div>
    </FeaturesContainer>
  );
};

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  
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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h3 {
    color: var(--primary-color);
    margin: 1rem 0;
  }
  
  p {
    color: var(--text-color);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export default Features;