import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest } from '../types.js';
import { handleAssessmentChat } from '../routes/assessment.js';

const update = vi.fn().mockResolvedValue(undefined);
const add = vi.fn().mockResolvedValue(undefined);
const get = vi.fn();
const mockFetch = vi.fn();
const ResponseCtor = Response;

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

describe('assessment vark chat integration', () => {
  beforeEach(() => {
    process.env.BEEAI_ORCHESTRATION_URL =
      'https://beeai-orchestration-145629211979.us-central1.run.app';
    process.env.ORCHESTRATION_TIMEOUT_MS = '20000';
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    update.mockClear();
    add.mockClear();
    get.mockReset();
    get.mockResolvedValue({
      exists: true,
      data: () => ({ parentId: 'parent-1' })
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts, continues, and completes a vark session with gated writes', async () => {
    mockFetch
      .mockResolvedValueOnce(
        new ResponseCtor(
          JSON.stringify({
            session_id: 'sess-1',
            question: { text: 'Question 1' }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
      .mockResolvedValueOnce(
        new ResponseCtor(
          JSON.stringify({
            session_id: 'sess-1',
            next_question: { text: 'Question 2' }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
      .mockResolvedValueOnce(
        new ResponseCtor(
          JSON.stringify({
            session_id: 'sess-1',
            status: 'complete',
            final_report: {
              scores: { v: 3, a: 1, r: 0, k: 0 },
              primary: 'V',
              summary: 'Visual summary',
              recommendations: ['Use diagrams', 'Try videos']
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

    const startReq = {
      body: {
        parentId: 'parent-1',
        studentId: 'student-1',
        gradeBand: '6-8',
        messages: [],
        mode: 'vark'
      },
      user: { uid: 'parent-1' }
    } as unknown as AuthenticatedRequest;
    const startRes = createMockResponse();

    await handleAssessmentChat(startReq, startRes);

    expect(startRes.statusCode).toBe(200);
    expect(startRes.body.ok).toBe(true);
    expect(startRes.body.sessionId).toBe('sess-1');
    expect(startRes.body.status).toBe('in_progress');
    expect(startRes.body.question?.text).toBe('Question 1');
    expect(update).toHaveBeenCalledTimes(1);
    expect(update.mock.calls[0][0]).toMatchObject({ assessmentStatus: 'in_progress' });
    expect(update.mock.calls[0][0]).not.toHaveProperty('learningStyle');

    const respondReq = {
      body: {
        studentId: 'student-1',
        sessionId: 'sess-1',
        messages: [{ role: 'user', content: 'A' }],
        mode: 'vark'
      },
      user: { uid: 'parent-1' }
    } as unknown as AuthenticatedRequest;
    const respondRes = createMockResponse();

    await handleAssessmentChat(respondReq, respondRes);

    expect(respondRes.statusCode).toBe(200);
    expect(respondRes.body.ok).toBe(true);
    expect(respondRes.body.status).toBe('in_progress');
    expect(respondRes.body.question?.text).toBe('Question 2');
    expect(update).toHaveBeenCalledTimes(2);
    expect(update.mock.calls[1][0]).toMatchObject({ assessmentStatus: 'in_progress' });
    expect(update.mock.calls[1][0]).not.toHaveProperty('learningStyle');

    const completeReq = {
      body: {
        studentId: 'student-1',
        sessionId: 'sess-1',
        messages: [{ role: 'user', content: 'B' }],
        mode: 'vark'
      },
      user: { uid: 'parent-1' }
    } as unknown as AuthenticatedRequest;
    const completeRes = createMockResponse();

    await handleAssessmentChat(completeReq, completeRes);

    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.body.ok).toBe(true);
    expect(completeRes.body.status).toBe('complete');
    expect(completeRes.body.result?.primary).toBe('V');
    expect(update).toHaveBeenCalledTimes(3);
    expect(update.mock.calls[2][0]).toMatchObject({
      hasTakenAssessment: true,
      assessmentStatus: 'completed',
      learningStyle: 'Visual'
    });
    expect(update.mock.calls[2][0]).toHaveProperty('vark_profile');
  });

  it('rejects mismatched parentId in request body', async () => {
    mockFetch.mockResolvedValueOnce(
      new ResponseCtor(JSON.stringify({ session_id: 'sess-1', question: { text: 'Question 1' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const req = {
      body: {
        parentId: 'other-parent',
        studentId: 'student-1',
        messages: [],
        mode: 'vark'
      },
      user: { uid: 'parent-1' }
    } as unknown as AuthenticatedRequest;
    const res = createMockResponse();

    await handleAssessmentChat(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error?.code).toBe('CLIENT_PARENT_MISMATCH');
  });
});
