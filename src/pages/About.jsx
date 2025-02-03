// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import { MdPersonalVideo } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const CTAButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 2rem auto;
  display: block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Section>
          <SectionHeader>
            <FaGraduationCap size={50} />
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
          <CTAButton onClick={() => navigate('/signup')}>
            Start Your Learning Journey
          </CTAButton>
        </MissionSection>

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

        <FlipSection>
          <div>
            <SectionHeader>
              <h2>Why Choose Us</h2>
            </SectionHeader>
            <FlipCardsGrid>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Personalized Learning</h3>
                    <p>Click to learn more</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Custom-tailored curriculum designed to match your unique learning style and pace.</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Flexible Schedule</h3>
                    <p>Click to learn more</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Learn at your own pace with 24/7 access to educational resources.</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Expert Support</h3>
                    <p>Click to learn more</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Access to qualified instructors and mentors throughout your learning journey.</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Proven Results</h3>
                    <p>Click to learn more</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Track record of student success and measurable learning outcomes.</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
            </FlipCardsGrid>
            <CTAButton onClick={() => navigate('/signup')}>
              Join Geaux Academy Today
            </CTAButton>
          </div>

          <div>
            <SectionHeader>
              <h2>Our Family</h2>
            </SectionHeader>
            <MissionText style={{ marginBottom: '2rem' }}>
              Meet the dedicated specialists at Geaux Academy who are passionate about transforming education through personalized learning.
            </MissionText>
            <FlipCardsGrid>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Daniel Hopkins</h3>
                    <p>CEO</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Visionary leader with 15+ years in educational technology</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Samantha Gordon</h3>
                    <p>CMO</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Marketing strategist with expertise in educational outreach</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Sean Hopkins</h3>
                    <p>CTO</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Tech innovator specializing in educational platforms</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
              <FlipCard>
                <FlipCardInner>
                  <FlipCardFront>
                    <h3>Cathy Smith</h3>
                    <p>CFO</p>
                  </FlipCardFront>
                  <FlipCardBack>
                    <p>Financial expert with focus on educational investments</p>
                  </FlipCardBack>
                </FlipCardInner>
              </FlipCard>
            </FlipCardsGrid>
            <CTAButton onClick={() => navigate('/signup')}>
              Become Part of Our Family
            </CTAButton>
          </div>
        </FlipSection>
      </motion.div>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
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
  justify-content: center;  // Add this line
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--background-alt);
  text-align: center;  // Add this line

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

const FlipSection = styled(Section)`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 4rem; // increased from 2rem for more separation between sections
`;

const FlipCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FlipCard = styled.div`
  background-color: transparent;
  width: 100%;
  height: 200px; // reduced from 300px
  perspective: 1000px;
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;

  ${FlipCard}:hover & {
    transform: rotateY(180deg);
  }
`;

const FlipCardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const FlipCardFront = styled(FlipCardSide)`
  background: white;
`;

const FlipCardBack = styled(FlipCardSide)`
  background: var(--background-alt);
  transform: rotateY(180deg);
`;

export default About;