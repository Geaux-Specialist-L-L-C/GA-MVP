
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const StudentProfileForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    grade: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = auth.currentUser?.uid;
    
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        parentId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
      />
      <input
        type="number"
        placeholder="Age"
        onChange={(e) => setFormData({...formData, age: e.target.value})}
      />
      <input
        type="text"
        placeholder="Grade"
        onChange={(e) => setFormData({...formData, grade: e.target.value})}
      />
      <button type="submit">Add Student</button>
    </form>
  );
};