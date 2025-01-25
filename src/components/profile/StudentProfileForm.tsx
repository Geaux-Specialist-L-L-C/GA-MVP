
import React, { useState } from 'react';
import { addStudentToParent } from '../../services/profileService';

export const StudentProfileForm = ({ parentId }: { parentId: string }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    grade: '',
    dateOfBirth: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addStudentToParent(parentId, {
      ...formData,
      uid: crypto.randomUUID(),
      dateOfBirth: new Date(formData.dateOfBirth)
    });
  };

  return (
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
  );
};