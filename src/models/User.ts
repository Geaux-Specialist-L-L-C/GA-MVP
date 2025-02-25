// File: /src/models/User.ts
// Description: MongoDB schema model for users
// Created: 2025-02-25

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'admin' | 'parent' | 'student' | 'teacher';
}

const UserSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    photoURL: { type: String },
    role: { 
      type: String, 
      enum: ['admin', 'parent', 'student', 'teacher'],
      default: 'parent'
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);