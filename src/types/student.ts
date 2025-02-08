export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  learningStyle?: string;
  hasTakenAssessment: boolean;
  progress?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
  recommendedActivities?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId: string;
}