// src/pages/About.jsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

const About = () => {
  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>About Geaux Academy</h1>
          <p>Empowering personalized education through innovative learning solutions</p>
        </Header>

        <Section>
          <h2>Our Mission</h2>
          <p>At Geaux Academy, we believe every student has a unique way of learning. Our mission is to provide personalized educational experiences that adapt to individual learning styles, ensuring better understanding and retention.</p>
        </Section>

        <Section>
          <h2>Our Approach</h2>
          <Grid>
            <Card>
              <h3>Assessment First</h3>
              <p>We begin by understanding your learning style through comprehensive assessment.</p>
            </Card>
            <Card>
              <h3>Personalized Learning</h3>
              <p>Create customized learning paths based on your individual needs.</p>
            </Card>
            <Card>
              <h3>Continuous Support</h3>
              <p>Provide ongoing guidance and adaptable content to ensure success.</p>
            </Card>
          </Grid>
        </Section>

        <Section>
          <h2>Our Team</h2>
          <p>Composed of experienced educators, learning specialists, and technology experts dedicated to transforming education.</p>
        </Section>
      </motion.div>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
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

const Section = styled.section`
  margin-bottom: 4rem;

  h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  p {
    line-height: 1.6;
    color: var(--text-color);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
  }
`;

export default About;