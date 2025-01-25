
export interface Student {
  id: string;
  name: string;
  age: number;
  learningStyle?: string;
  assessmentResults?: {
    date: string;
    score: number;
    style: string;
  }[];
  progress: {
    moduleId: string;
    completion: number;
    lastAccessed: string;
  }[];
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  students: Student[];
}