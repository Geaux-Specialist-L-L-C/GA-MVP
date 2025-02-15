// File: /types/types.ts
// Description: Core type definitions for user profiles, assessments, and course progress
// Author: Geaux Academy Team
// Created: 2024
export interface ParentProfile {
  uid: string;
  email: string;
  displayName: string;
  students: StudentProfile[];
}

export interface StudentProfile {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: string;
  learningStyle?: LearningStyle;
  assessmentResults?: AssessmentResult[];
  progress?: CourseProgress[];
}

export interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  strengths: string[];
  recommendations: string[];
}

export interface AssessmentResult {
  date: string;
  score: number;
  subject: string;
  details: Record<string, unknown>;
}

export interface CourseProgress {
  courseId: string;
  completed: number;
  total: number;
  lastAccessed: string;
}