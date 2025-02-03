import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Curriculum = () => {
  const [selectedGrade, setSelectedGrade] = useState('middle');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    }
  };

  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      courses: ['Algebra', 'Geometry', 'Calculus']
    },
    { id: 2, name: 'Science', courses: ['Biology', 'Chemistry', 'Physics'] },
    { id: 3, name: 'Languages', courses: ['English', 'Spanish', 'French'] }
  ];

  const gradeLevels = ['elementary', 'middle', 'high'];

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
          <FcGoogle className="text-xl" />
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
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  
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

const SubjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const SubjectCard = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
`;

const CourseList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CourseItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

const CourseListing = styled.div`
  margin-top: 3rem;
`;

const GradeLevels = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const GradeButton = styled.button`
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

const CourseDetails = styled.div`
  text-align: center;
`;

const LoginSection = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Curriculum;
