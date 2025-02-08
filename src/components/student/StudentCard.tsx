import React, { useState, useEffect } from 'react';
import { getStudentProfile } from '../../services/profileService';
import styles from '../shared/shared.module.css';
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

  if (loading) return <Card className={styles['student-card']}>Loading student data...</Card>;
  if (error) return <Card className={styles['student-card']}>Error: {error}</Card>;
  if (!student) return null;

  return (
    <Card 
      className={styles['student-card']}
      onClick={onClick}
    >
      <h3 className={styles['student-name']}>{student.name}</h3>
      <div className={styles['student-info']}>Grade: {student.grade}</div>
      <div className={`${styles['assessment-status']} ${student.hasTakenAssessment ? styles['status-complete'] : styles['status-pending']}`}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </div>
    </Card>
  );
};

export default StudentCard;