// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import { MdPersonalVideo } from 'react-icons/md';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hero>
          <FaGraduationCap size={50} color="var(--primary-color)" />
          <h1>About Geaux Academy</h1>
          <p>Empowering personalized education through innovative learning solutions</p>
        </Hero>

        <Section>
          <SectionHeader>
            <FaUsers size={30} />
            <h2>Core Values</h2>
          </SectionHeader>
          <ValuesList>
            <ValueItem to="/values/integrity">
              <span>Integrity</span>
            </ValueItem>
            <ValueItem to="/values/excellence">
              <span>Excellence</span>
            </ValueItem>
            <ValueItem to="/values/innovation">
              <span>Innovation</span>
            </ValueItem>
            <ValueItem to="/values/collaboration">
              <span>Collaboration</span>
            </ValueItem>
          </ValuesList>
        </Section>

        <MissionSection>
          <SectionHeader>
            <FaLightbulb size={30} />
            <h2>Our Mission</h2>
          </SectionHeader>
          <MissionText>
            At Geaux Academy, we believe in tailoring education to each student's unique learning style, 
            ensuring better comprehension and retention through personalized approaches.
          </MissionText>
        </MissionSection>

        <Section>
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {/* Team member cards */}
          </div>
        </Section>

        <Section>
          <h2>Why Choose Us</h2>
          <div className="benefits-grid">
            {/* Feature/benefit cards */}
          </div>
        </Section>

        <Grid>
          <FeatureCard>
            <BiTargetLock size={40} />
            <h3>Assessment First</h3>
            <p>Understanding your learning style through comprehensive evaluation</p>
          </FeatureCard>
          <FeatureCard>
            <MdPersonalVideo size={40} />
            <h3>Personalized Learning</h3>
            <p>Custom learning paths based on your individual needs</p>
          </FeatureCard>
          <FeatureCard>
            <FaChartLine size={40} />
            <h3>Progress Tracking</h3>
            <p>Monitor your educational journey with detailed analytics</p>
          </FeatureCard>
        </Grid>
      </motion.div>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 60px auto 0; // Add top margin to match header height
  padding: 2rem;
  min-height: calc(100vh - 60px); // Ensure full viewport height minus header
`;

const Hero = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
  background: linear-gradient(to right, var(--background-alt), white);
  border-radius: 12px;

  h1 {
    font-size: 3rem;
    color: var(--primary-color);
    margin: 1rem 0;
    font-weight: bold;
  }

  p {
    font-size: 1.4rem;
    color: var(--text-color);
    max-width: 800px;
    margin: 0 auto;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-alt);

  h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin: 0;
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValuesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 0;
`;

const ValueItem = styled(Link)`
  padding: 1.5rem;
  background: var(--background-alt);
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: var(--primary-color);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const MissionSection = styled(Section)`
  text-align: center;
  max-width: 800px;
  margin: 4rem auto;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-color);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: var(--text-color);
  }
`;

export default About;