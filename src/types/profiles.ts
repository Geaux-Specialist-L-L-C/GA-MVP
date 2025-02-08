export interface CreateStudentInput {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

export interface Student {
  id?: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt?: string;
  updatedAt?: string;
  assessmentStatus?: string;
}

export interface Parent {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  students: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type UserProfile = {
  name: string;
  lastLogin: string;
};