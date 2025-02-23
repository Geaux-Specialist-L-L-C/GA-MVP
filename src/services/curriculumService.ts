import { apiClient } from '@/lib/apiClient';

export interface CurriculumResponse {
  studentId: string;
  assessmentId: string;
  curriculum: string[];
  resources: string[];
}

export const generateCurriculum = async (assessmentId: string): Promise<CurriculumResponse> => {
  const response = await apiClient.post<CurriculumResponse>('/api/curriculum/generate', {
    assessmentId
  });
  return response.data;
};
