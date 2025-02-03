import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const [parentProfile, setParentProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  const value = {
    parentProfile,
    setParentProfile,
    studentProfile,
    setStudentProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
