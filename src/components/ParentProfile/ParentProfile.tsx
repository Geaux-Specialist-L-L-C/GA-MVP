
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../store/slices/profileSlice';
import { Student } from '../../types/profiles';

export const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name,
        age: newStudent.age || 0,
        progress: [],
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
  };

  return (
    <div className="parent-profile">
      <h2>Parent Profile</h2>
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
          {parent?.students.map(student => (
            <div key={student.id} className="student-card">
              <h4>{student.name}</h4>
              <p>Age: {student.age}</p>
              <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
              <div className="progress-summary">
                {student.progress.map(p => (
                  <div key={p.moduleId}>
                    <span>Module {p.moduleId}</span>
                    <span>{p.completion}% complete</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};