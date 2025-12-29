// File: /src/pages/About.tsx
// Description: About page component providing information about Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';

const About: React.FC = () => {
  return (
    <Page>
      <Hero>
        <span className="badge">Our Mission</span>
        <h1>About Geaux Academy</h1>
        <p>
          Geaux Academy is an education platform that blends AI insights with human-centered
          instruction, helping every learner unlock confidence and clarity.
        </p>
      </Hero>

      <CardGrid>
        <InfoCard className="glass-card">
          <h2>Mission</h2>
          <p>Empower learners with personalized journeys that celebrate curiosity and growth.</p>
        </InfoCard>
        <InfoCard className="glass-card">
          <h2>Values</h2>
          <ul>
            <li>Equitable access to learning for every student.</li>
            <li>Evidence-based strategies grounded in research.</li>
            <li>Partnerships with families and educators.</li>
          </ul>
        </InfoCard>
        <InfoCard className="glass-card">
          <h2>Approach</h2>
          <p>
            We combine adaptive assessments, dynamic learning plans, and progress coaching
            to create a supportive, futuristic learning lab.
          </p>
        </InfoCard>
      </CardGrid>
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

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const InfoCard = styled.div`
  padding: 1.75rem;
  display: grid;
  gap: 0.75rem;

  ul {
    padding-left: 1.2rem;
    color: var(--text-secondary);
  }
`;

export default About;
