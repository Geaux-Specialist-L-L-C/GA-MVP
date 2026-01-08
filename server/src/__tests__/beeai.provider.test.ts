import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BeeAIClient, type BeeAIConfig } from '../beeai/client.js';
import { BeeAIAssessmentProvider } from '../beeai/provider.js';
import { createDefaultMemory, loadSessionMemory } from '../beeai/sessionStore.js';
import type { Message } from '../types.js';

const mockFetch = vi.fn();
const ResponseCtor = Response;

describe('BeeAI integration', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('BeeAIClient posts workflow run and normalizes response', async () => {
    const config: BeeAIConfig = {
      apiKey: 'test-key',
      apiUrl: 'https://beeai.test',
      workflowId: 'wf1'
    };

    const payload = {
      trace_id: 'trace-123',
      output: {
        final_report: {
          learningStyle: 'Visual',
          confidence: 0.82,
          explanation: 'Prefers visuals',
          nextSteps: ['Use diagrams', 'Try short videos'],
          model: 'beeai-model',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        memory: createDefaultMemory()
      }
    };

    mockFetch.mockResolvedValue(
      new ResponseCtor(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const client = new BeeAIClient(config);
    const runResult = await client.runWorkflow({
      messages: [{ role: 'user', content: 'I love diagrams' } as Message],
      memory: createDefaultMemory(),
      parentId: 'parent1',
      studentId: 'student1'
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://beeai.test/v1/workflows/wf1/run',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key'
        })
      })
    );
    expect(runResult.report?.learningStyle).toBe('Visual');
    expect(runResult.traceId).toBe('trace-123');
    expect(runResult.memory).not.toBeNull();
  });

  it('BeeAIAssessmentProvider saves session state', async () => {
    const config: BeeAIConfig = {
      apiKey: 'test-key',
      apiUrl: 'https://beeai.test',
      workflowId: 'wf-session'
    };

    const updatedMemory = {
      ...createDefaultMemory(),
      session_status: 'complete' as const,
      focus_modality: 'Visual',
      final_report: null
    };

    const payload = {
      output: {
        final_report: {
          learningStyle: 'Visual',
          confidence: 0.75,
          explanation: 'Visual leaning detected',
          nextSteps: ['Use diagrams'],
          model: 'beeai-model',
          createdAt: '2024-01-02T00:00:00.000Z'
        },
        memory: updatedMemory
      }
    };

    mockFetch.mockResolvedValue(
      new ResponseCtor(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const provider = new BeeAIAssessmentProvider(new BeeAIClient(config));
    const result = await provider.generateAssessment(
      [{ role: 'user', content: 'I like seeing pictures' } as Message],
      { parentId: 'parentA', studentId: 'studentA' }
    );

    const saved = await loadSessionMemory('parentA', 'studentA');

    expect(result.raw).toBeDefined();
    expect(saved).not.toBeNull();
    expect(saved?.session_status).toBe('complete');
    expect(saved?.focus_modality).toBe('Visual');
  });
});
