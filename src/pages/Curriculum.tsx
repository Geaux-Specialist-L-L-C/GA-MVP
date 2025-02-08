import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

interface Subject {
  id: number;
  name: string;
  courses: string[];
}

type GradeLevel = 'elementary' | 'middle' | 'high';

const Curriculum: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('middle');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
    }
  };

  const subjects: Subject[] = [
    {
      id: 1,
      name: 'Mathematics',
      courses: ['Algebra', 'Geometry', 'Calculus']
    },
    { id: 2, name: 'Science', courses: ['Biology', 'Chemistry', 'Physics'] },
    { id: 3, name: 'Languages', courses: ['English', 'Spanish', 'French'] }
  ];

  const gradeLevels: GradeLevel[] = ['elementary', 'middle', 'high'];

  return (
    <CurriculumContainer>
      <Header />
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Curriculum
      </motion.h1>
      <SubjectGrid
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {subjects.map((subject) => (
          <SubjectCard key={subject.id}>
            <h2>{subject.name}</h2>
            <CourseList>
              {subject.courses.map((course, index) => (
                <CourseItem key={index}>{course}</CourseItem>
              ))}
            </CourseList>
          </SubjectCard>
        ))}
      </SubjectGrid>

      <CourseListing>
        <h2>Courses by Grade Level</h2>
        <GradeLevels>
          {gradeLevels.map((grade) => (
            <GradeButton 
              key={grade}
              isSelected={selectedGrade === grade}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade.charAt(0).toUpperCase() + grade.slice(1)}
            </GradeButton>
          ))}
        </GradeLevels>
        <CourseDetails>
          <h3>{selectedGrade.charAt(0).toUpperCase() + selectedGrade.slice(1)} School</h3>
          {/* Course details based on selected grade */}
        </CourseDetails>
      </CourseListing>

      <LoginSection>
        <h2>Login to Access More Features</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
      </LoginSection>
    </CurriculumContainer>
  );
};

const CurriculumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const SubjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const SubjectCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }
`;

const CourseList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CourseItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--background-alt);
  color: var(--text-color);

  &:last-child {
    border-bottom: none;
  }
`;

const CourseListing = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const GradeLevels = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CourseDetails = styled.div`
  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
`;

const LoginSection = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
`;

const GradeButton = styled.button<{ isSelected: boolean }>`
  background: ${(props) => (props.isSelected ? '#007bff' : '#f8f9fa')};
  color: ${(props) => (props.isSelected ? '#fff' : '#000')};
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #007bff;
    color: #fff;
  }
`;

export default Curriculum;