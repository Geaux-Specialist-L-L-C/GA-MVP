import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../../services/profileService';
import Card from '../common/Card';

interface Student {
  name: string;
  grade: string;
  hasTakenAssessment: boolean;
}

interface StudentCardProps {
  studentId: string;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ studentId, onClick }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentProfile(studentId);
        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Could not load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <StyledCard onClick={onClick}>Loading student data...</StyledCard>;
  if (error) return <StyledCard onClick={onClick}>Error: {error}</StyledCard>;
  if (!student) return null;

  return (
    <StyledCard onClick={onClick}>
      <StudentName>{student.name}</StudentName>
      <StudentInfo>Grade: {student.grade}</StudentInfo>
      <AssessmentStatus $isComplete={student.hasTakenAssessment}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </AssessmentStatus>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentName = styled.h3`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StudentInfo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AssessmentStatus = styled.div<{ $isComplete: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background-color: ${({ theme, $isComplete }) => 
    $isComplete ? theme.palette.success?.main || '#2ECC71' : theme.palette.warning?.main || '#F1C40F'};
  color: white;
  font-size: 0.875rem;
  text-align: center;
`;

export default StudentCard;