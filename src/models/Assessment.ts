// File: /src/models/Assessment.ts
// Description: MongoDB schema model for assessments
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  studentId: string;
  assessmentType: string;
  score: number;
  details?: any;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    studentId: { type: String, required: true, ref: 'Student' },
    assessmentType: { type: String, required: true },
    score: { type: Number, required: true },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries by student and assessment type
AssessmentSchema.index({ studentId: 1, assessmentType: 1 });

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);