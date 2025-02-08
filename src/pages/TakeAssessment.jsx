import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStudentProfile } from '../services/profileService';
import { updateStudentAssessmentStatus } from '../services/profileService';

const TakeAssessment = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/signup'); // Redirect if not authenticated
    } else {
      const fetchStudent = async () => {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile) {
          navigate('/parent-dashboard'); // Redirect if no student found
        } else {
          setStudent(studentProfile);
        }
      };
      fetchStudent();
    }
  }, [currentUser, studentId, navigate]);

  const handleAssessmentCompletion = async () => {
    await updateStudentAssessmentStatus(studentId, true);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <div>
      {student && (
        <>
          <h1>Learning Style Assessment for {student.name}</h1>
          <p>Answer the questions below to determine the best learning style.</p>
          <button onClick={handleAssessmentCompletion}>Complete Assessment</button>
        </>
      )}
    </div>
  );
};

export default TakeAssessment;
