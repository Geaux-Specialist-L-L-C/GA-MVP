import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEye, FaHeadphones, FaBookReader, FaRunning } from 'react-icons/fa';
import useAuth from '../contexts/AuthContext';

interface LearningStyle {
  icon: JSX.Element;
  title: string;
  description: string;
  characteristics: string[];
}

const VarkStyles: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  const styles: LearningStyle[] = [
    {
      icon: <FaEye />,
      title: "Visual Learning",
      description: "Learn through seeing and observing",
      characteristics: [
        "Prefer diagrams and charts",
        "Remember visual details",
        "Benefit from visual aids",
        "Excel with graphic organizers"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Auditory Learning",
      description: "Learn through listening and speaking",
      characteristics: [
        "Excel in discussions",
        "Remember spoken information",
        "Benefit from lectures",
        "Learn through verbal repetition"
      ]
    },
    {
      icon: <FaBookReader />,
      title: "Read/Write Learning",
      description: "Learn through written words",
      characteristics: [
        "Enjoy reading materials",
        "Take detailed notes",
        "Prefer written instructions",
        "Learn through writing summaries"
      ]
    },
    {
      icon: <FaRunning />,
      title: "Kinesthetic Learning",
      description: "Learn through doing and experiencing",
      characteristics: [
        "Learn by doing",
        "Prefer hands-on activities",
        "Remember through practice",
        "Benefit from role-playing"
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your VARK Learning Style
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Understanding how you learn best is the first step to academic success
        </motion.p>
      </Header>

      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h2>{style.title}</h2>
            <p>{style.description}</p>
            <CharacteristicsList>
              {style.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </CharacteristicsList>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection>
        <h2>Ready to optimize your learning journey?</h2>
        <p>Take our assessment to discover your learning style and get personalized recommendations.</p>
        <ButtonGroup>
          <PrimaryButton to="/signup">Get Started Now</PrimaryButton>
          <SecondaryButton to="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </CTASection>

      <GoogleLoginSection>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
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
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StyleCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: var(--background-alt);
  border-radius: 12px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default VarkStyles;
