// File: /src/models/Parent.ts
// Description: MongoDB schema model for parents
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IParent extends Document {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  students: string[]; // References to student IDs
}

const ParentSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    students: [{ type: String, ref: 'Student' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Parent || mongoose.model<IParent>('Parent', ParentSchema);