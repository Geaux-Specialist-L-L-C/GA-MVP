import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';

const CreateStudent = () => {
  const [studentName, setStudentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const newStudent = { 
      name: studentName, 
      grade: gradeLevel, 
      parentId: user.uid,
      hasTakenAssessment: false
    };

    await addStudentProfile(user.uid, newStudent);
    navigate('/parent-dashboard');
  };

  return (
    <Container>
      <h1>Add a New Student</h1>
      <form onSubmit={handleSubmit}>
        <label>Student Name:</label>
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />

        <label>Grade Level:</label>
        <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} required>
          <option value="">Select Grade</option>
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
        </select>

        <button type="submit">Save Profile</button>
      </form>
    </Container>
  );
};

export default CreateStudent;

const Container = styled.div`
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
