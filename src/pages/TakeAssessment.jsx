import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";

const TakeAssessment = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signup");
      return;
    }

    const fetchStudent = async () => {
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile) {
          navigate("/parent-dashboard");
        } else {
          setStudent(studentProfile);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        navigate("/parent-dashboard");
      }
    };

    fetchStudent();
  }, [currentUser, studentId, navigate]);

  const handleAssessmentCompletion = async () => {
    if (!studentId) return;
    await updateStudentAssessmentStatus(studentId, "completed");
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
