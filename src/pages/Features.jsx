import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaChartLine, FaChalkboardTeacher, FaGamepad, FaBullseye } from "react-icons/fa";

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      title: "Personalized Learning Paths",
      description: "AI-driven customization based on your learning style",
      details: "Detailed information about Personalized Learning Paths",
      icon: <FaBullseye />
    },
    { title: "Real-time Progress Tracking", description: "Monitor achievements and growth with detailed analytics", details: "Detailed information about Real-time Progress Tracking", icon: <FaChartLine /> },
    { title: "Interactive Content", description: "Engage with multimedia lessons and activities", details: "Detailed information about Interactive Content", icon: <FaGamepad /> },
    { title: "Expert Support", description: "Access to qualified educators and mentors", details: "Detailed information about Expert Support", icon: <FaChalkboardTeacher /> }
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
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              onClick={() => setSelectedFeature(feature)}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
        {selectedFeature && (
          <div className="feature-modal">
            <h2>{selectedFeature.title}</h2>
            <p>{selectedFeature.details}</p>
            <button onClick={() => setSelectedFeature(null)}>Close</button>
          </div>
        )}
      </motion.div>
    </FeaturesContainer>
  );
};

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 60px auto 0; // Add top margin to match header height
  padding: 2rem;
  min-height: calc(100vh - 60px); // Ensure full viewport height minus header
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

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1em;
    height: 1em;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

export default Features;
