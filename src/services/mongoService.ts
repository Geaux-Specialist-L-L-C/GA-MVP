import axios from 'axios';
import { firebaseService } from './firebaseService';
import { apiBaseUrl } from './api';

// Create axios instance
const apiClient = axios.create({
  baseURL: apiBaseUrl || undefined,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }
  const token = await firebaseService.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mongoService = {
  // User profile operations
  getUserProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUserProfile: async (userId: string, profileData: any) => {
    const response = await apiClient.put(`/users/${userId}`, profileData);
    return response.data;
  },
  
  // Learning style operations
  saveLearningStyle: async (userId: string, learningStyle: string, assessmentResults: any) => {
    const response = await apiClient.post(`/users/${userId}/learning-style`, {
      style: learningStyle,
      results: assessmentResults
    });
    return response.data;
  },
  
  getLearningStyle: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/learning-style`);
    return response.data;
  },
  
  // Curriculum operations
  saveCurriculum: async (userId: string, curriculum: any) => {
    const response = await apiClient.post(`/users/${userId}/curriculum`, curriculum);
    return response.data;
  },
  
  getCurriculumList: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/curriculum`);
    return response.data;
  },
  
  getCurriculumById: async (userId: string, curriculumId: string) => {
    const response = await apiClient.get(`/users/${userId}/curriculum/${curriculumId}`);
    return response.data;
  }
};
