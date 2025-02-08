import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';
import styled from 'styled-components';
import LearningStyleChat from '../components/chat/LearningStyleChat';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async (): Promise<void> => {
      if (!studentId || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          setError("Student profile not found");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [currentUser, studentId]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) {
      setError("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      await updateStudentAssessmentStatus(studentId, "completed");
      setStudent(prev => prev ? { ...prev, hasTakenAssessment: true } : null);
    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading assessment...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!student) {
    return <ErrorContainer>No student found</ErrorContainer>;
  }

  return (
    <AssessmentContainer>
      <Header>
        <h1>Learning Style Assessment</h1>
        <StudentName>for {student.name}</StudentName>
      </Header>

      <ContentSection>
        <p>Chat with our AI assistant to help determine your learning style. The assistant will ask you questions and analyze your responses to identify the learning style that best suits you.</p>
        <LearningStyleChat />
      </ContentSection>

      <ActionSection>
        <CompleteButton 
          onClick={handleAssessmentCompletion}
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete Assessment"}
        </CompleteButton>
      </ActionSection>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const StudentName = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const CompleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

export default TakeAssessment;
