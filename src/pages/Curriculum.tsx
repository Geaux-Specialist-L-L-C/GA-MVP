import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";
import CourseCard from "../components/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
  image?: string;
}

const Curriculum: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<'elementary' | 'middle' | 'high'>('middle');
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
    }
  };

  const subjects: Course[] = [
    {
      id: '1',
      title: 'Mathematics',
      description: 'Core mathematics curriculum covering algebra, geometry, and more.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'math'
    },
    {
      id: '2',
      title: 'Science',
      description: 'Comprehensive science program including biology, chemistry, and physics.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'science'
    }
    // Add more courses as needed
  ];

  return (
    <CurriculumContainer>
      <Header>
        <h1>Curriculum</h1>
        <p>Explore our comprehensive learning programs tailored to each grade level.</p>
      </Header>

      <GradeSelectorContainer>
        <GradeButton 
          active={selectedGrade === 'elementary'} 
          onClick={() => setSelectedGrade('elementary')}
        >
          Elementary School
        </GradeButton>
        <GradeButton 
          active={selectedGrade === 'middle'} 
          onClick={() => setSelectedGrade('middle')}
        >
          Middle School
        </GradeButton>
        <GradeButton 
          active={selectedGrade === 'high'} 
          onClick={() => setSelectedGrade('high')}
        >
          High School
        </GradeButton>
      </GradeSelectorContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CoursesGrid>
        {subjects.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </CoursesGrid>

      <CTASection>
        <h2>Ready to Start Learning?</h2>
        <p>Join our platform to access the full curriculum and personalized learning paths.</p>
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle />
          <span>Sign in with Google to Get Started</span>
        </GoogleButton>
      </CTASection>
    </CurriculumContainer>
  );
};

const CurriculumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    font-size: 1.1rem;
  }
`;

const GradeSelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

interface GradeButtonProps {
  active: boolean;
}

const GradeButton = styled.button<GradeButtonProps>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f8f8f8'};
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    margin-bottom: 1.5rem;
  }
`;

const GoogleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
  text-align: center;
`;

export default Curriculum;