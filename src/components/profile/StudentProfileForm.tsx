import React, { useState } from 'react';
import { addStudentToParent } from '../../services/profileService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';

export const StudentProfileForm = ({ parentId }: { parentId: string }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    displayName: '',
    grade: '',
    dateOfBirth: ''
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addStudentToParent(parentId, {
      ...formData,
      uid: crypto.randomUUID(),
      dateOfBirth: new Date(formData.dateOfBirth)
    });
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>Student Profile Form</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student Name"
            value={formData.displayName}
            onChange={(e) => setFormData({
              ...formData,
              displayName: e.target.value
            })}
          />
          <input
            type="text"
            placeholder="Grade"
            value={formData.grade}
            onChange={(e) => setFormData({
              ...formData,
              grade: e.target.value
            })}
          />
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({
              ...formData,
              dateOfBirth: e.target.value
            })}
          />
          <button type="submit">Add Student</button>
        </form>
      </FormBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
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
