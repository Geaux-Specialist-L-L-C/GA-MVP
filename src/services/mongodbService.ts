// File: /src/services/mongodbService.ts
// Description: Service for MongoDB operations replacing Firestore functionality
// Created: 2025-02-25

import { connectToDatabase } from '../config/dbConfig';

// Connect to MongoDB when the service is imported
connectToDatabase()
  .then(() => console.log('MongoDB service initialized'))
  .catch(err => console.error('Failed to initialize MongoDB service:', err));

// Generic get document function
export async function getData<T>(model: any, id: string): Promise<T | null> {
  try {
    const document = await model.findOne({ uid: id }).lean();
    return document as T | null;
  } catch (error) {
    console.error(`Error getting document with ID ${id}:`, error);
    throw error;
  }
}

// Generic get documents function
export async function getDocuments<T>(model: any, filter = {}): Promise<T[]> {
  try {
    const documents = await model.find(filter).lean();
    return documents as T[];
  } catch (error) {
    console.error(`Error getting documents:`, error);
    throw error;
  }
}

// Generic set document function
export async function setData<T>(model: any, id: string, data: Partial<T>): Promise<T> {
  try {
    const update = { ...data };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    
    const document = await model.findOneAndUpdate(
      { uid: id }, 
      update, 
      options
    ).lean();
    
    return document as T;
  } catch (error) {
    console.error(`Error setting document with ID ${id}:`, error);
    throw error;
  }
}

// Generic create document function
export async function createData<T>(model: any, data: T): Promise<T> {
  try {
    const newDocument = new model(data);
    await newDocument.save();
    return newDocument.toObject() as T;
  } catch (error) {
    console.error(`Error creating document:`, error);
    throw error;
  }
}

// Generic update document function
export async function updateData<T>(model: any, id: string, data: Partial<T>): Promise<T | null> {
  try {
    const updatedDocument = await model.findOneAndUpdate(
      { uid: id }, 
      { $set: { ...data, updatedAt: new Date() } }, 
      { new: true }
    ).lean();
    
    return updatedDocument as T | null;
  } catch (error) {
    console.error(`Error updating document with ID ${id}:`, error);
    throw error;
  }
}

// Generic delete document function
export async function deleteData(model: any, id: string): Promise<boolean> {
  try {
    const result = await model.deleteOne({ uid: id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting document with ID ${id}:`, error);
    throw error;
  }
}