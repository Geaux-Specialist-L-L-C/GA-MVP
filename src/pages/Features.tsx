// File: /src/pages/Features.tsx
// Description: Features page component highlighting the key features of Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';
import { FaChartLine, FaLightbulb, FaRobot, FaUserFriends } from 'react-icons/fa';

const featureSections = [
  {
    title: 'AI-powered learning style assessment',
    description: 'Identify the learning signals that matter most for each student.',
    icon: <FaRobot />
  },
  {
    title: 'Personalized learning paths',
    description: 'Auto-generated plans that adapt with every milestone.',
    icon: <FaLightbulb />
  },
  {
    title: 'Real-time progress tracking',
    description: 'Dashboards that illuminate growth, mastery, and momentum.',
    icon: <FaChartLine />
  },
  {
    title: 'Interactive dashboard',
    description: 'A unified command center for students, parents, and educators.',
    icon: <FaUserFriends />
  }
];

const Features: React.FC = () => {
  return (
    <Page>
      <Hero>
        <span className="badge">Platform Features</span>
        <h1>Built for modern learning teams.</h1>
        <p>
          Every feature is crafted to make learning feel intuitive, engaging, and future-ready.
        </p>
      </Hero>

      <FeatureGrid>
        {featureSections.map((feature) => (
          <FeatureCard className="glass-card" key={feature.title}>
            <div className="icon">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </FeatureCard>
        ))}
      </FeatureGrid>
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

const FeatureGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const FeatureCard = styled.div`
  padding: 1.75rem;
  display: grid;
  gap: 0.75rem;

  .icon {
    font-size: 1.8rem;
    color: var(--primary-color);
  }

  p {
    color: var(--text-secondary);
  }
`;

export default Features;
