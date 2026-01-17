import http from "node:http";
import { randomUUID } from "node:crypto";
import { probeLLM, logLlmProbeError, classifyVarkResponse } from "./beeai/llm.js";
import {
  GRADE_BANDS,
  MAX_QUESTIONS,
  addScores,
  buildClarifyingQuestion,
  buildQuestion,
  clampScores,
  createEmptyScores,
  mapOptionToScore,
  pickWeakestModality,
  summarizeProfile,
  type VarkQuestion,
  type VarkScores,
  type VarkSession,
} from "./beeai/vark.js";
import { getSessionStore } from "./storage/sessionStore.js";

const port = Number(process.env.PORT ?? 8080);
const sessionStore = getSessionStore();

const MAX_BODY_BYTES = 1024 * 1024;

function sendJson(res: http.ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

function sendText(res: http.ServerResponse, status: number, payload: string): void {
  res.writeHead(status, { "content-type": "text/plain" });
  res.end(payload);
}

async function readJson(req: http.IncomingMessage): Promise<any> {
  const body = await new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > MAX_BODY_BYTES) {
        const err = new Error("payload too large") as Error & { statusCode?: number };
        err.statusCode = 413;
        reject(err);
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", (err) => reject(err));
  });

  if (!body) {
    return {};
  }
  try {
    return JSON.parse(body);
  } catch {
    const err = new Error("invalid json") as Error & { statusCode?: number };
    err.statusCode = 400;
    throw err;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeAnswer(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function recordQuestionAsked(session: VarkSession, question: VarkQuestion): void {
  session.questionHistory.push({ id: question.id, target: question.target });
  session.askedCounts = addScores(session.askedCounts, mapOptionToScore(question.target));
  session.currentQuestion = question;
  session.updatedAt = nowIso();
}

function markQuestionAnswered(session: VarkSession): void {
  const last = session.questionHistory[session.questionHistory.length - 1];
  if (last) {
    last.answeredAt = nowIso();
  }
  session.updatedAt = nowIso();
}

async function handleProbe(res: http.ServerResponse): Promise<void> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const region = process.env.VERTEX_REGION ?? process.env.VERTEX_LOCATION;
  const model = process.env.LLM_CHAT_MODEL_NAME;

  if (!model || !projectId || !region) {
    sendJson(res, 500, {
      ok: false,
      error: "Missing Vertex configuration",
    });
    return;
  }

  try {
    const result = await probeLLM();
    sendJson(res, 200, { ok: true, provider: result.provider, model, text: result.text });
  } catch (error) {
    logLlmProbeError(error, { model, projectId, region });
    sendJson(res, 500, { ok: false, error: "LLM probe failed" });
  }
}

async function handleStart(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  try {
    const payload = await readJson(req);
    const studentId = normalizeAnswer(payload?.studentId);
    if (!studentId) {
      sendJson(res, 400, { error: "studentId is required" });
      return;
    }

    const gradeBand = normalizeAnswer(payload?.gradeBand);
    if (gradeBand && !GRADE_BANDS.includes(gradeBand as any)) {
      sendJson(res, 400, { error: "gradeBand is invalid" });
      return;
    }

    const sessionId = randomUUID();
    const question = buildQuestion(1);
    const now = nowIso();
    const session: VarkSession = {
      sessionId,
      studentId,
      gradeBand: gradeBand ? (gradeBand as any) : undefined,
      status: "in_progress",
      step: 1,
      scores: createEmptyScores(),
      askedCounts: createEmptyScores(),
      questionHistory: [],
      currentQuestion: null,
      createdAt: now,
      updatedAt: now,
    };

    recordQuestionAsked(session, question);
    await sessionStore.saveSession(session);
    sendJson(res, 200, { sessionId, question });
  } catch (error: any) {
    const status = typeof error?.statusCode === "number" ? error.statusCode : 500;
    sendJson(res, status, { error: error?.message ?? "failed to start session" });
  }
}

async function applyResponseScores(
  question: VarkQuestion,
  answer: string,
): Promise<{ delta: VarkScores; confidence: number }> {
  const direct = answer.toUpperCase();
  if (direct === "A" || direct === "B" || direct === "C" || direct === "D") {
    const option = question.options.find((opt) => opt.key === direct);
    if (!option) {
      throw new Error("answer does not match available options");
    }
    return { delta: mapOptionToScore(option.mapsTo), confidence: 1 };
  }

  if (!answer) {
    throw new Error("answer is required");
  }

  const classification = await classifyVarkResponse(answer);
  const delta = clampScores({
    v: classification.scores.v,
    a: classification.scores.a,
    r: classification.scores.r,
    k: classification.scores.k,
  });

  return { delta, confidence: classification.confidence };
}

async function handleRespond(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  try {
    const payload = await readJson(req);
    const sessionId = normalizeAnswer(payload?.sessionId);
    const answer = normalizeAnswer(payload?.answer);
    if (!sessionId) {
      sendJson(res, 400, { error: "sessionId is required" });
      return;
    }

    const session = await sessionStore.getSession(sessionId);
    if (!session) {
      sendJson(res, 404, { error: "session not found" });
      return;
    }

    if (session.status !== "in_progress" || !session.currentQuestion) {
      sendJson(res, 409, { error: "session is not active" });
      return;
    }

    const { delta, confidence } = await applyResponseScores(session.currentQuestion, answer);
    session.scores = addScores(session.scores, delta);
    markQuestionAnswered(session);

    if (session.step >= MAX_QUESTIONS) {
      const result = summarizeProfile(session.scores);
      session.status = "complete";
      session.currentQuestion = null;
      session.updatedAt = nowIso();
      await sessionStore.saveSession(session);
      sendJson(res, 200, {
        done: true,
        result: {
          scores: session.scores,
          primary: result.primary,
          summary: result.summary,
          recommendations: result.recommendations,
        },
      });
      return;
    }

    const target = pickWeakestModality(session.askedCounts, session.scores);
    const nextQuestion =
      confidence < 0.6
        ? buildClarifyingQuestion(session.step + 1)
        : buildQuestion(session.step + 1, target);
    session.step += 1;
    recordQuestionAsked(session, nextQuestion);
    await sessionStore.saveSession(session);
    sendJson(res, 200, { sessionId, question: nextQuestion });
  } catch (error: any) {
    const status = typeof error?.statusCode === "number" ? error.statusCode : 500;
    sendJson(res, status, { error: error?.message ?? "failed to record response" });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname;

  if (req.method === "GET" && path === "/health") {
    sendText(res, 200, "ok");
    return;
  }

  if (req.method === "GET" && path === "/probe/llm") {
    await handleProbe(res);
    return;
  }

  if (req.method === "POST" && path === "/api/assessment/vark/start") {
    await handleStart(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/assessment/vark/respond") {
    await handleRespond(req, res);
    return;
  }

  sendText(res, 404, "not found");
});

server.listen(port, () => console.log(`listening on :${port}`));
