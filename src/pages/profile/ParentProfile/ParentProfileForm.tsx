
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createParentProfile } from '../../../services/profileService';

export const ParentProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createParentProfile({
      uid: user.uid,
      email: user.email!,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.displayName}
        onChange={(e) => setFormData({
          ...formData,
          displayName: e.target.value
        })}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({
          ...formData,
          phone: e.target.value
        })}
      />
      <button type="submit">Create Parent Profile</button>
    </form>
  );
};