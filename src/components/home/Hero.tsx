/src/components/home/Hero.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Hero from '../../../public/JSX/Hero';

interface HeroProps {
  // Add any props if needed
}

const Hero: React.FC<HeroProps> = () => {
  return (
    <HeroSection>
      <HeroContent>
        <h1>Discover Your Learning Style</h1>
        <p>Personalized education tailored to how you learn best</p>
        <HeroButtons>
          <StyledLink to="/assessment">Take Assessment</StyledLink>
          <StyledLink to="/about" $secondary>Learn More</StyledLink>
        </HeroButtons>
      </HeroContent>
      <HeroImage>
        <img src="/images/hero-learning.svg" alt="Learning illustration" />
      </HeroImage>
    </HeroSection>
  );
};

const HeroSection = styled.section`
  // Add styles
`;

const HeroContent = styled.div`
  // Add styles
`;

const HeroButtons = styled.div`
  // Add styles
`;

const StyledLink = styled(Link)<{ $secondary?: boolean }>`
  // Add styles
`;

const HeroImage = styled.div`
  // Add styles
`;

export default Hero;
