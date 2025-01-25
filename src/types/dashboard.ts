
export interface StudentProgress {
  completionRate: number;
  timeSpent: number;
  accuracy: number;
  subjectProgress: {
    [subject: string]: {
      completed: number;
      total: number;
    };
  };
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
  recommendations: string[];
}

export interface DashboardState {
  activeTab: 'overview' | 'progress' | 'learning-styles' | 'curriculum';
  studentData: {
    progress: StudentProgress;
    learningStyle: LearningStyle;
  } | null;
}