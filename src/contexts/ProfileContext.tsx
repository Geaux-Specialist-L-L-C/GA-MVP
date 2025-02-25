import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mongoService } from '../services/mongoService';
import { useAuth } from './AuthContext';

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
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const userProfile = await mongoService.getUserProfile(currentUser.uid);
        setProfile(userProfile);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const updateProfile = async (newProfile: Profile) => {
    if (currentUser) {
      const updatedProfile = await mongoService.updateUserProfile(currentUser.uid, newProfile);
      setProfile(updatedProfile);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
