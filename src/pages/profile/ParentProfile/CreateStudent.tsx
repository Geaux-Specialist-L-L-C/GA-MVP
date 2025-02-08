import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import type { CreateStudentInput } from '../../../types/profiles';

const CreateStudent = () => {
  const [studentName, setStudentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: CreateStudentInput = { 
        name: studentName, 
        grade: gradeLevel, 
        parentId: user.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(user.uid, newStudent);
      // Clear form
      setStudentName('');
      setGradeLevel('');
      // Force refresh of parent dashboard
      window.location.reload();
    } catch (err) {
      console.error('Failed to create student:', err);
      setError('Failed to create student profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Student Name:</Label>
          <Input 
            type="text" 
            value={studentName} 
            onChange={(e) => setStudentName(e.target.value)} 
            placeholder="Enter student's name"
            required 
          />
        </FormGroup>

        <FormGroup>
          <Label>Grade Level:</Label>
          <Select 
            value={gradeLevel} 
            onChange={(e) => setGradeLevel(e.target.value)} 
            required
          >
            <option value="">Select Grade</option>
            <option value="K">Kindergarten</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
          </Select>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add Student'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default CreateStudent;
