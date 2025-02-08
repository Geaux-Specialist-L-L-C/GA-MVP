import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import useAuth from '../../../contexts/AuthContext';

interface NewStudent {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

const CreateStudent: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: NewStudent = { 
        name: studentName, 
        grade, 
        parentId: currentUser.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(currentUser.uid, newStudent);
      setStudentName('');
      setGrade('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create student profile. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Student Name:
            <Input
              type="text"
              value={studentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              required
            />
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            Grade Level:
            <Select 
              value={grade} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
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