// File: /src/services/__tests__/aiService.test.ts
// Description: Unit tests for the AI service
// Author: GitHub Copilot
// Created: 2023-11-13

import axios from 'axios';
import { aiService } from '../aiService';
import { getAuth } from 'firebase/auth';

// Mock dependencies
jest.mock('axios');
jest.mock('firebase/auth');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetAuth = getAuth as jest.MockedFunction<typeof getAuth>;

describe('aiService', () => {
  const mockToken = 'test-token-123';
  const mockUser = { getIdToken: jest.fn().mockResolvedValue(mockToken) };
  const mockAuth = { currentUser: mockUser };
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAuth.mockReturnValue(mockAuth as any);
  });

  describe('sendMessage', () => {
    it('should send a message and return the response', async () => {
      // Arrange
      const message = 'Hello AI';
      const expectedResponse = { message: 'Hello human' };
      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });

      // Act
      const result = await aiService.sendMessage(message);

      // Assert
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/assistant/chat',
        { content: message },
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should include context ID when provided', async () => {
      // Arrange
      const message = 'Hello AI';
      const contextId = 'course-123';
      const expectedResponse = { message: 'Hello human' };
      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });

      // Act
      await aiService.sendMessage(message, contextId);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/assistant/chat',
        { content: `[Context: ${contextId}] ${message}` },
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
    });

    it('should throw an error when user is not authenticated', async () => {
      // Arrange
      mockedGetAuth.mockReturnValueOnce({ currentUser: null } as any);
      
      // Act & Assert
      await expect(aiService.sendMessage('test')).rejects.toThrow('Authentication required');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });

  describe('uploadMaterial', () => {
    it('should upload a file with required parameters', async () => {
      // Arrange
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const courseId = 'course-123';
      const expectedResponse = { success: true, documentId: 'doc-123' };
      mockedAxios.post.mockResolvedValueOnce({ data: expectedResponse });

      // Act
      const result = await aiService.uploadMaterial(file, courseId);

      // Assert
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
      
      // Verify FormData was created correctly
      const calledFormData = mockedAxios.post.mock.calls[0][1];
      expect(calledFormData instanceof FormData).toBeTruthy();
    });

    it('should include optional parameters when provided', async () => {
      // Arrange
      const file = new File(['content'], 'test.pdf');
      const courseId = 'course-123';
      const lessonId = 'lesson-456';
      const title = 'Test Document';
      const description = 'This is a test document';
      
      mockedAxios.post.mockImplementationOnce((url, formData) => {
        // Mock to inspect FormData contents
        return Promise.resolve({ 
          data: {
            success: true,
            documentId: 'doc-123',
            receivedData: {
              title,
              description,
              lessonId,
              courseId
            }
          }
        });
      });

      // Act
      await aiService.uploadMaterial(file, courseId, lessonId, title, description);

      // Assert
      const formData = mockedAxios.post.mock.calls[0][1];
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/assistant/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${mockToken}`
          })
        })
      );
    });
  });

  describe('analyzeLearningStyle', () => {
    it('should fetch learning style analysis', async () => {
      // Arrange
      const expectedResponse = { 
        style: 'visual',
        confidence: 0.85,
        recommendations: ['Use diagrams', 'Watch videos']
      };
      mockedAxios.get.mockResolvedValueOnce({ data: expectedResponse });

      // Act
      const result = await aiService.analyzeLearningStyle();

      // Assert
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/assistant/learning-style',
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from the API', async () => {
      // Arrange
      const errorMessage = 'Not enough data to analyze learning style';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      // Act & Assert
      await expect(aiService.analyzeLearningStyle()).rejects.toThrow();
    });
  });
});
