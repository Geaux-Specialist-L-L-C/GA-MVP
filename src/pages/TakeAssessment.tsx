import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signup");
      return;
    }

    const fetchStudent = async (): Promise<void> => {
      if (!studentId) return;
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          navigate("/parent-dashboard");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id // ensure id is definitely assigned
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        navigate("/parent-dashboard");
      }
    };

    fetchStudent();
  }, [currentUser, studentId, navigate]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) return;
    await updateStudentAssessmentStatus(studentId, "completed");
    navigate(`/student-dashboard/${studentId}`);
  };

  if (!student) return null;

  return (
    <div>
      <h1>Learning Style Assessment for {student.name}</h1>
      <p>Answer the questions below to determine the best learning style.</p>
      <button onClick={handleAssessmentCompletion}>Complete Assessment</button>
    </div>
  );
};

export default TakeAssessment;
