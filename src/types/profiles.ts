// Base Types
export interface BaseProfile {
    uid: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}

// Parent Profile Types
export interface Parent extends BaseProfile {
    phone?: string;
    students: string[];
}

// Student Profile Types
export interface Student {
    id: string;
    parentId: string;
    name: string;
    grade: string;
    learningStyle?: LearningStyle;
    hasTakenAssessment: boolean;
    assessmentStatus?: string;
    createdAt: string;
    updatedAt: string;
    recommendedActivities?: string[];
    progress?: StudentProgress[];
    assessmentResults?: AssessmentResult[];
}

// Progress Types
export interface StudentProgress {
    courseId: string;
    completed: number;
    total: number;
    lastAccessed: string;
}

// Assessment Types
export interface AssessmentResult {
    date: string;
    score: number;
    subject: string;
    details: Record<string, unknown>;
}

// Learning Style Types
export interface LearningStyle {
    type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
    strengths: string[];
    recommendations: string[];
}