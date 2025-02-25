// File: /src/models/LearningPlan.ts
// Description: MongoDB schema model for learning plans
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject {
  name: string;
  topics: {
    name: string;
    activities: {
      title: string;
      description: string;
      type: string;
      duration: string;
      resources?: string[];
    }[];
  }[];
}

export interface ILearningPlan extends Document {
  studentId: string;
  grade: string;
  learningStyle: string;
  subjects: ISubject[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const LearningPlanSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true, ref: 'Student' },
    grade: { type: String, required: true },
    learningStyle: { type: String, required: true },
    subjects: [{
      name: { type: String, required: true },
      topics: [{
        name: { type: String, required: true },
        activities: [{
          title: { type: String, required: true },
          description: { type: String, required: true },
          type: { type: String, required: true },
          duration: { type: String, required: true },
          resources: [{ type: String }]
        }]
      }]
    }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { 
      type: String,
      enum: ['active', 'completed', 'pending'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.LearningPlan || mongoose.model<ILearningPlan>('LearningPlan', LearningPlanSchema);