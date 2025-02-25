// File: /src/models/Student.ts
// Description: MongoDB schema model for students
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  uid: string;
  firstName: string;
  lastName: string;
  grade: string;
  parentId: string;
  learningStyle?: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
    primary: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  };
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    grade: { type: String, required: true },
    parentId: { type: String, required: true, ref: 'Parent' },
    learningStyle: {
      visual: { type: Number, min: 0, max: 100, default: 0 },
      auditory: { type: Number, min: 0, max: 100, default: 0 },
      reading: { type: Number, min: 0, max: 100, default: 0 },
      kinesthetic: { type: Number, min: 0, max: 100, default: 0 },
      primary: { 
        type: String, 
        enum: ['visual', 'auditory', 'reading', 'kinesthetic'],
      }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);