import { describe, expect, it, vi } from 'vitest';
import { healthHandler } from '../app.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../types.js';

describe('assessment service', () => {
  it('returns ok for healthz', async () => {
    const res = createMockResponse();
    await healthHandler({}, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('returns 401 when auth header is missing', async () => {
    const req = { headers: {} } as AuthenticatedRequest;
    const res = createMockResponse();
    const next = vi.fn();

    await authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
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
