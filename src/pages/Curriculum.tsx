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
      <Header>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Curriculum
        </motion.h1>
      </Header>

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

// ... existing styled components with added TypeScript props ...

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

// ... rest of the styled components ...

export default Curriculum;