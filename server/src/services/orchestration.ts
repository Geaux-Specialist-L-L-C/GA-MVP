export interface OrchestrationQuestionOption {
  key?: string;
  text: string;
}

export interface OrchestrationQuestion {
  id?: string;
  text: string;
  options?: OrchestrationQuestionOption[];
  target?: string;
}

export interface OrchestrationRespondResult {
  scores: {
    v: number;
    a: number;
    r: number;
    k: number;
  };
  primary: string;
  summary: string;
  recommendations: string[];
}

export interface OrchestrationGatewaySuccess {
  ok: true;
  sessionId: string;
  status: 'in_progress' | 'complete';
  question?: OrchestrationQuestion;
  result?: OrchestrationRespondResult;
}

export interface OrchestrationGatewayError {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type OrchestrationGatewayResponse =
  | OrchestrationGatewaySuccess
  | OrchestrationGatewayError;

const DEFAULT_TIMEOUT_MS = 20000;

const resolveOrchestrationBaseUrl = (): string => {
  const base =
    process.env.BEEAI_ORCHESTRATION_URL ??
    process.env.BEEAI_ORCHESTRATION_BASE_URL ??
    process.env.ORCHESTRATION_API_URL;
  if (!base) {
    throw new Error('Orchestration API URL is not configured');
  }
  return base.replace(/\/+$/, '');
};

const resolveTimeoutMs = () => {
  const raw = process.env.ORCHESTRATION_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : DEFAULT_TIMEOUT_MS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const isRetryableError = (error: unknown) => {
  const err = error as { code?: string; name?: string; message?: string };
  const code = err?.code ?? err?.name ?? '';
  if (code === 'ECONNRESET' || code === 'ETIMEDOUT') {
    return true;
  }
  const message = (err?.message ?? '').toLowerCase();
  return message.includes('timeout') || message.includes('socket hang up');
};

const normalizeQuestion = (input: unknown): OrchestrationQuestion | undefined => {
  if (!input) return undefined;
  if (typeof input === 'string') {
    return { text: input };
  }
  if (typeof input === 'object') {
    const candidate = input as Record<string, unknown>;
    const text = typeof candidate.text === 'string' ? candidate.text : undefined;
    if (!text) {
      return undefined;
    }
    return {
      id: typeof candidate.id === 'string' ? candidate.id : undefined,
      text,
      options: Array.isArray(candidate.options)
        ? candidate.options
            .filter((option) => option && typeof option === 'object')
            .map((option) => ({
              key: typeof (option as { key?: unknown }).key === 'string'
                ? (option as { key?: string }).key
                : undefined,
              text: String((option as { text?: unknown }).text ?? '')
            }))
            .filter((option) => option.text)
        : undefined,
      target: typeof candidate.target === 'string' ? candidate.target : undefined
    };
  }
  return undefined;
};

const normalizeResponse = (raw: Record<string, unknown>): OrchestrationGatewaySuccess => {
  const sessionId =
    typeof raw.sessionId === 'string'
      ? raw.sessionId
      : typeof raw.session_id === 'string'
        ? raw.session_id
        : '';
  const done = Boolean(raw.done) || raw.status === 'complete';
  const question =
    normalizeQuestion(raw.question ?? raw.next_question ?? raw.nextQuestion);
  const result =
    (raw.result as OrchestrationRespondResult | undefined) ??
    (raw.final_report as OrchestrationRespondResult | undefined);

  return {
    ok: true,
    sessionId,
    status: done ? 'complete' : 'in_progress',
    question,
    result
  };
};

const postJson = async (
  path: string,
  payload: unknown,
  context: { studentId?: string; sessionId?: string; step: 'start' | 'respond' }
): Promise<OrchestrationGatewayResponse> => {
  const baseUrl = resolveOrchestrationBaseUrl();
  const timeoutMs = resolveTimeoutMs();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.info('[ga-assessment-service] orchestration_request', {
        step: context.step,
        studentId: context.studentId,
        sessionId: context.sessionId,
        attempt: attempt + 1
      });

      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        if (response.status >= 500 && response.status < 600 && attempt === 0) {
          await sleep(200);
          continue;
        }
        const message =
          response.status >= 500
            ? `Orchestration request failed (${response.status})`
            : text || `Orchestration request failed (${response.status})`;
        return {
          ok: false,
          error: {
            code: 'ORCHESTRATION_HTTP_ERROR',
            message,
            details: { status: response.status }
          }
        };
      }

      const data = (await response.json()) as Record<string, unknown>;
      const normalized = normalizeResponse(data);
      if (!normalized.sessionId) {
        return {
          ok: false,
          error: {
            code: 'ORCHESTRATION_BAD_RESPONSE',
            message: 'Missing sessionId in orchestration response'
          }
        };
      }
      return normalized;
    } catch (error) {
      clearTimeout(timeoutId);
      if (attempt === 0 && isRetryableError(error)) {
        await sleep(200);
        continue;
      }
      const err = error as { name?: string; message?: string; code?: string };
      const code = err?.name === 'AbortError' ? 'ORCHESTRATION_TIMEOUT' : 'ORCHESTRATION_ERROR';
      return {
        ok: false,
        error: {
          code,
          message: err?.message ?? 'Orchestration request failed',
          details: err?.code ? { code: err.code } : undefined
        }
      };
    }
  }

  return {
    ok: false,
    error: {
      code: 'ORCHESTRATION_ERROR',
      message: 'Orchestration request failed'
    }
  };
};

export const startVarkSession = async (input: {
  studentId: string;
  gradeBand?: string;
}): Promise<OrchestrationGatewayResponse> =>
  postJson('/api/assessment/vark/start', input, {
    studentId: input.studentId,
    step: 'start'
  });

export const sendVarkAnswer = async (input: {
  sessionId: string;
  answer: string;
  studentId?: string;
}): Promise<OrchestrationGatewayResponse> =>
  postJson('/api/assessment/vark/respond', input, {
    studentId: input.studentId,
    sessionId: input.sessionId,
    step: 'respond'
  });
