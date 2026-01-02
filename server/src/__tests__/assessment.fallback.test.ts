import { describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest } from '../types.js';
import { handleAssessment } from '../routes/assessment.js';

const update = vi.fn().mockResolvedValue(undefined);
const add = vi.fn().mockResolvedValue(undefined);
const get = vi.fn().mockResolvedValue({
  exists: true,
  data: () => ({ parentId: 'parent' })
});

vi.mock('../services/firestore.js', () => {
  return {
    db: {
      collection: (name: string) => {
        if (name === 'students') {
          return {
            doc: () => ({
              get,
              update
            })
          };
        }
        return {
          add
        };
      }
    }
  };
});

vi.mock('../middleware/auth.js', () => ({
  authenticate: (_req: unknown, _res: unknown, next: () => void) => {
    // @ts-expect-error partial request user injection for tests
    _req.user = { uid: 'parent' };
    next();
  }
}));

vi.mock('../services/vertex.js', () => ({
  getAssessmentProvider: () => ({
    generateAssessment: vi.fn().mockRejectedValue(new Error('timeout'))
  })
}));

describe('assessment route fallback', () => {
  it('returns a safe fallback result when provider fails', async () => {
    const res = createMockResponse();
    const req = {
      body: {
        parentId: 'parent',
        studentId: 'student',
        messages: [{ role: 'user', content: 'hello' }]
      },
      user: { uid: 'parent' }
    } as unknown as AuthenticatedRequest;

    await handleAssessment(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.learningStyle).toBe('Multimodal');
    expect(res.body.model).toBe('unavailable');
    expect(Array.isArray(res.body.nextSteps)).toBe(true);
    expect(typeof res.body.createdAt).toBe('string');
  });
});

const createMockResponse = () => {
  const res: any = {};
  res.statusCode = 200;
  res.body = null;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.body = payload;
    return res;
  };
  return res;
};
