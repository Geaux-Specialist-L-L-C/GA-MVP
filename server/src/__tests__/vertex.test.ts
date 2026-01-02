import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn().mockReturnValue({ generateContent: mockGenerateContent });

vi.mock('@google-cloud/vertexai', () => {
  const VertexAI = vi.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel
  }));
  return { VertexAI };
});

const resetEnv = () => {
  delete process.env.GOOGLE_CLOUD_PROJECT;
  delete process.env.VERTEX_REGION;
  delete process.env.VERTEX_LOCATION;
  delete process.env.VERTEX_MODEL;
  delete process.env.VERTEX_TEMPERATURE;
  delete process.env.VERTEX_MAX_TOKENS;
  delete process.env.VERTEX_TIMEOUT_MS;
};

beforeEach(() => {
  vi.resetModules();
  mockGenerateContent.mockReset();
  mockGetGenerativeModel.mockClear();
  resetEnv();
});

describe('vertex provider config', () => {
  it('falls back to stub provider when env is missing', async () => {
    const { getAssessmentProvider } = await import('../services/vertex.js');
    const provider = getAssessmentProvider();
    const result = await provider.generateAssessment([{ role: 'user', content: 'likes diagrams' }]);

    expect(result.model).toBe('stub');
  });

  it('uses vertex provider when env is present', async () => {
    process.env.GOOGLE_CLOUD_PROJECT = 'project-id';
    process.env.VERTEX_REGION = 'us-central1';
    process.env.VERTEX_MODEL = 'my-model';

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    learningStyle: 'Visual',
                    confidence: 0.9,
                    explanation: 'short',
                    nextSteps: ['a', 'b', 'c'],
                    model: 'my-model',
                    createdAt: '2026-01-01T00:00:00.000Z'
                  })
                }
              ]
            }
          }
        ]
      }
    });

    const { getAssessmentProvider } = await import('../services/vertex.js');
    const provider = getAssessmentProvider();
    const result = await provider.generateAssessment([{ role: 'user', content: 'hello' }]);

    expect(result.model).toBe('my-model');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'my-model' });
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('buildPrompt emphasizes strict JSON and allowed learning styles', async () => {
    const { buildPrompt } = await import('../services/vertex.js');

    const prompt = buildPrompt([{ role: 'user', content: 'prefers pictures' }]);

    expect(prompt).toContain('STRICT JSON');
    expect(prompt).toContain('learningStyle": "Visual|Auditory|Read/Write|Kinesthetic|Multimodal"');
    expect(prompt).toContain('Do not include markdown fences');
    expect(prompt).toContain('ISO 8601 timestamp');
  });
});
