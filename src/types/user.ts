// File: /src/types/user.ts
// Description: Type definitions for user profile and related data
// Author: evopimp
// Created: 2025-03-03 08:31:52

import { LearningStyle } from "./chat";

export interface UserPreferences {
  emailNotifications: boolean;
  contentRecommendations: boolean;
  studyReminders: boolean;
  publicProfile: boolean;
  colorMode: "light" | "dark";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  occupation?: string;
  education?: string;
  website?: string;
  role: "student" | "instructor" | "admin";
  joinDate: string | Date;
  preferences: UserPreferences;
  learningStyle?: LearningStyle;
  lastActive?: string | Date;
}

export interface LearningStyleResult {
  primaryStyle: string;
  scores: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
  recommendations: string[];
}