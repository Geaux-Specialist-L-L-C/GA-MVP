
export interface BaseProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends BaseProfile {
  role: 'parent';
  phone?: string;
  students: StudentProfile[];
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  parentId: string;
  grade: string;
  dateOfBirth: Date;
}