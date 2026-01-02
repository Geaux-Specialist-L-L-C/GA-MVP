import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest, Message } from '../types.js';
import { handleAssessment, countEvidence, isLowSignal } from '../routes/assessment.js';

const update = vi.fn().mockResolvedValue(undefined);
const add = vi.fn().mockResolvedValue(undefined);
const get = vi.fn();

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

vi.mock('../services/vertex.js', () => ({
  getAssessmentProvider: () => ({
    generateAssessment: vi.fn().mockResolvedValue({
      raw: JSON.stringify({
        learningStyle: 'Visual',
        confidence: 0.8,
        explanation: 'Example explanation.',
        nextSteps: ['Step 1', 'Step 2', 'Step 3'],
        model: 'test-model',
        createdAt: '2026-01-01T00:00:00.000Z',
        decision: 'final'
      }),
      model: 'test-model'
    })
  })
}));

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

beforeEach(() => {
  update.mockClear();
  add.mockClear();
  get.mockReset();
});

describe('assessment evidence gating', () => {
  it('returns needs_more_data for low-signal input and does not set learningStyle', async () => {
    get.mockResolvedValue({
      exists: true,
      data: () => ({ parentId: 'parent' })
    });

    const req = {
      body: {
        parentId: 'parent',
        studentId: 'student',
        messages: [{ role: 'user', content: 'maybe' }]
      },
      user: { uid: 'parent' }
    } as unknown as AuthenticatedRequest;
    const res = createMockResponse();

    await handleAssessment(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.decision).toBe('needs_more_data');
    expect(res.body.evidenceCount).toBe(0);
    expect(res.body.questions?.length).toBeGreaterThan(0);
    expect(update).toHaveBeenCalledTimes(1);
    const updatePayload = update.mock.calls[0][0] as Record<string, unknown>;
    expect(updatePayload).not.toHaveProperty('learningStyle');
    expect(updatePayload.assessmentStatus).toBe('in_progress');
  });

  it('finalizes when evidence threshold met', async () => {
    get.mockResolvedValue({
      exists: true,
      data: () => ({ parentId: 'parent' })
    });

    const messages: Message[] = [
      { role: 'user', content: 'I learn best with pictures and charts.' },
      { role: 'user', content: 'I remember things after drawing them.' },
      { role: 'user', content: 'Seeing videos helps me understand quickly.' },
      { role: 'user', content: 'I like diagrams in my notes.' }
    ];
    const req = {
      body: {
        parentId: 'parent',
        studentId: 'student',
        messages
      },
      user: { uid: 'parent' }
    } as unknown as AuthenticatedRequest;
    const res = createMockResponse();

    await handleAssessment(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.decision).toBe('final');
    expect(update).toHaveBeenCalledTimes(1);
    const updatePayload = update.mock.calls[0][0] as Record<string, unknown>;
    expect(updatePayload.learningStyle).toBeDefined();
    expect(updatePayload.assessmentStatus).toBe('completed');
  });

  it('does not overwrite completed status on low evidence', async () => {
    get.mockResolvedValue({
      exists: true,
      data: () => ({ parentId: 'parent', assessmentStatus: 'completed', learningStyle: 'Visual' })
    });

    const req = {
      body: {
        parentId: 'parent',
        studentId: 'student',
        messages: [{ role: 'user', content: 'maybe' }]
      },
      user: { uid: 'parent' }
    } as unknown as AuthenticatedRequest;
    const res = createMockResponse();

    await handleAssessment(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.decision).toBe('needs_more_data');
    expect(update).not.toHaveBeenCalled();
  });
});

describe('evidence helpers', () => {
  it('detects low-signal content', () => {
    expect(isLowSignal('maybe')).toBe(true);
    expect(isLowSignal('ok')).toBe(true);
    expect(isLowSignal('I like diagrams and charts')).toBe(false);
  });

  it('counts evidence based on user messages', () => {
    const messages: Message[] = [
      { role: 'user', content: 'maybe' },
      { role: 'assistant', content: 'Tell me more.' },
      { role: 'user', content: 'I like diagrams and charts.' }
    ];
    expect(countEvidence(messages)).toBe(1);
  });
});
