import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  learningStyle?: string;
  grade?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {