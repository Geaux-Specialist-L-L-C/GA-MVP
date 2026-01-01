import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../app.js';

describe('assessment service', () => {
  it('returns ok for healthz', async () => {
    const response = await request(app).get('/healthz');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it('returns 401 when auth header is missing', async () => {
    const response = await request(app)
      .post('/api/learning-style/assess')
      .send({ parentId: 'parent', studentId: 'student', messages: [] });

    expect(response.status).toBe(401);
  });
});
