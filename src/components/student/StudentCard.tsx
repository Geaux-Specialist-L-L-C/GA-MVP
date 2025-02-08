import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../../services/profileService';

interface Student {
  name: string;
  grade: string;
  hasTakenAssessment: boolean;
}

interface StudentCardProps {
  studentId: string;
}

const StudentCard = ({ studentId }: StudentCardProps) => {
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

  if (loading) return <CardContainer>Loading student data...</CardContainer>;
  if (error) return <CardContainer>Error: {error}</CardContainer>;
  if (!student) return null;

  return (
    <CardContainer>
      <StudentInfo>
        <StudentName>{student.name}</StudentName>
        <GradeLabel>Grade {student.grade}</GradeLabel>
      </StudentInfo>
      <StatusBadge hasTaken={student.hasTakenAssessment}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </StatusBadge>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: white;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StudentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StudentName = styled.h4`
  margin: 0;
  color: var(--primary-color);
  font-size: 1.1rem;
`;

const GradeLabel = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ hasTaken: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  background: ${props => props.hasTaken ? '#d1fae5' : '#fee2e2'};
  color: ${props => props.hasTaken ? '#059669' : '#dc2626'};
`;

export default StudentCard;