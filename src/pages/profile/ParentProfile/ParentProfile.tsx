import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../../store/slices/profileSlice';
import { RootState } from '../../../store';
import type { Student } from '../../../types/student';
import useAuth from '../../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';

const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name || '',
        age: newStudent.age || 0,
        grade: newStudent.grade || '',
        hasTakenAssessment: false,
        parentId: parent?.id || '',
        progress: [],
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
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
      <ProfileBox>
        <Title>Parent Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <div className="students-section">
          <h3>My Students</h3>
          <button onClick={() => setShowAddStudent(true)}>Add Student</button>

          {showAddStudent && (
            <div className="add-student-form">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="number"
                placeholder="Age"
                value={newStudent.age || ''}
                onChange={(e) => setNewStudent({...newStudent, age: Number(e.target.value)})}
              />
              <button onClick={handleAddStudent}>Save</button>
              <button onClick={() => setShowAddStudent(false)}>Cancel</button>
            </div>
          )}

          <div className="students-list">
            {parent?.students?.map((studentId: string) => {
              const student = parent.studentProfiles?.[studentId] as Student;
              if (!student) return null;
              return (
                <div key={student.id} className="student-card">
                  <h4>{student.name}</h4>
                  {student.age && <p>Age: {student.age}</p>}
                  <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
                  <div className="progress-summary">
                    {student.progress?.map((p, index) => (
                      <div key={index} className="progress-item">
                        {p.type}: {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ProfileBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default ParentProfile;
