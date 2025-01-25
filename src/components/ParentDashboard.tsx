
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { StudentProfile } from '../types/types';

export const ParentDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    const parentId = auth.currentUser?.uid;
    const q = query(
      collection(db, 'students'),
      where('parentId', '==', parentId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentProfile[];
      setStudents(studentData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>My Students</h2>
      {students.map(student => (
        <div key={student.id}>
          <h3>{student.firstName} {student.lastName}</h3>
          <p>Grade: {student.grade}</p>
          {student.learningStyle && (
            <p>Learning Style: {student.learningStyle.type}</p>
          )}
          {/* Add progress visualization */}
        </div>
      ))}
    </div>
  );
};