// File: /src/services/userService.ts
// Description: MongoDB service for user operations
// Created: 2025-02-25

import User, { IUser } from '../models/User';
import { getData, getDocuments, setData, updateData, deleteData } from './mongodbService';
import { auth } from '../firebase/config'; // Keep Firebase Auth

// Get user by Firebase Auth UID
export const getUserById = async (uid: string): Promise<IUser | null> => {
  return await getData<IUser>(User, uid);
};

// Get users by role
export const getUsersByRole = async (role: string): Promise<IUser[]> => {
  return await getDocuments<IUser>(User, { role });
};

// Create or update user
export const createOrUpdateUser = async (userData: Partial<IUser>): Promise<IUser> => {
  if (!userData.uid) {
    throw new Error('User ID is required');
  }
  
  return await setData<IUser>(User, userData.uid, userData);
};

// Update user profile
export const updateUserProfile = async (uid: string, userData: Partial<IUser>): Promise<IUser | null> => {
  return await updateData<IUser>(User, uid, userData);
};

// Delete user
export const deleteUser = async (uid: string): Promise<boolean> => {
  return await deleteData(User, uid);
};

// Create user profile from Firebase Auth user
export const createUserFromAuth = async (firebaseUser: any): Promise<IUser> => {
  const userData: Partial<IUser> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    role: 'parent', // Default role
  };
  
  return await createOrUpdateUser(userData);
};