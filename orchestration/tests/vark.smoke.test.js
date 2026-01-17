import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";

const PORT = 8090;
const BASE_URL = `http://localhost:${PORT}`;
let serverProcess;

async function waitForHealth() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // ignore until next attempt
    }
    await delay(200);
  }
  throw new Error("server did not become ready");
}

before(async () => {
  serverProcess = spawn("node", ["dist/server.js"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  await waitForHealth();
});

after(async () => {
  if (!serverProcess) {
    return;
  }
  serverProcess.kill();
  await once(serverProcess, "exit");
});

test("VARK assessment start/respond flow returns session and question", async () => {
  const startResponse = await fetch(`${BASE_URL}/api/assessment/vark/start`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ studentId: "smoke-test", gradeBand: "6-8" }),
  });

  assert.equal(startResponse.status, 200);
  const startPayload = await startResponse.json();
  assert.ok(startPayload.sessionId);
  assert.ok(startPayload.question);

  const respondResponse = await fetch(`${BASE_URL}/api/assessment/vark/respond`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId: startPayload.sessionId, answer: "A" }),
  });

  assert.equal(respondResponse.status, 200);
  const respondPayload = await respondResponse.json();
  assert.ok(respondPayload.question || respondPayload.result);
});
