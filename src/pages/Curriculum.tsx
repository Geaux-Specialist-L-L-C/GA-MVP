// File: /src/pages/Curriculum.tsx
// Description: Curriculum page component outlining the learning curriculum.
// Author: GitHub Copilot
// Created: 2023-10-10

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import CourseCard from "../components/CourseCard";
import styled from "styled-components";
import LoadingSpinner from "../components/common/LoadingSpinner";

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
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner data-testid="loading-spinner" />
      </LoadingContainer>
    );
  }

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
  ];

  return (
    <Container>
      <h1 className="text-4xl font-bold">Curriculum</h1>
      <p className="mt-4">Our curriculum is designed to adapt to your learning style and pace.</p>

      <GradeSelector>
        <GradeButton 
          $active={selectedGrade === 'elementary'} 
          onClick={() => setSelectedGrade('elementary')}
        >
          Elementary School
        </GradeButton>
        <GradeButton 
          $active={selectedGrade === 'middle'} 
          onClick={() => setSelectedGrade('middle')}
        >
          Middle School
        </GradeButton>
        <GradeButton 
          $active={selectedGrade === 'high'} 
          onClick={() => setSelectedGrade('high')}
        >
          High School
        </GradeButton>
      </GradeSelector>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CourseGrid>
        {subjects.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </CourseGrid>

      <CTASection>
        <h2>Ready to Start Learning?</h2>
        <p>Join our platform to access the full curriculum and personalized learning paths.</p>
        <GoogleButton 
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          aria-label={loading ? 'Signing in...' : 'Sign in with Google'}
        >
          <FcGoogle />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </GoogleButton>
      </CTASection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const GradeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const GradeButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : '#ddd'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'var(--primary-color)' : '#f5f5f5'};
  }
`;

const CourseGrid = styled.div`
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
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 0.75rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.875rem;
`;

export default Curriculum;
