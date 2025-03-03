// File: /src/services/profileService.ts
// Description: Service for managing user profiles
// Author: evopimp
// Created: 2025-03-03 08:31:52

import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile, UserPreferences } from "@/types/user";

/**
 * Get a user's profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    return {
      id: userDoc.id,
      ...userData,
      joinDate: userData.joinDate?.toDate() || new Date(),
      lastActive: userData.lastActive?.toDate() || new Date(),
    } as UserProfile;
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    throw new Error("Failed to retrieve user profile");
  }
};

/**
 * Update a user's profile information
 */
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

/**
 * Update a user's preferences
 */
export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Get current user data
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const currentPreferences = userData.preferences || {};
    
    // Update preferences
    await updateDoc(userRef, {
      preferences: {
        ...currentPreferences,
        ...preferences,
      },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw new Error("Failed to update user preferences");
  }
};

/**
 * Create a new user profile (called after registration)
 */
export const createUserProfile = async (
  userId: string, 
  userData: { name: string; email: string }
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    
    const defaultProfile: Partial<UserProfile> = {
      name: userData.name,
      email: userData.email,
      role: "student",
      preferences: {
        emailNotifications: true,
        contentRecommendations: true,
        studyReminders: true,
        publicProfile: false,
        colorMode: "light"
      },
      joinDate: serverTimestamp() as any,
      lastActive: serverTimestamp() as any,
    };
    
    await setDoc(userRef, defaultProfile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create user profile");
  }
};