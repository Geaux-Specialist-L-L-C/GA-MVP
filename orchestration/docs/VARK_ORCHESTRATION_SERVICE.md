# VARK Orchestration Service

This service powers the VARK assessment API for Geaux Academy. It is a minimal HTTP service that:

- Starts new VARK assessment sessions.
- Records student responses.
- Computes the VARK profile summary after the final question.
- Stores sessions in Firestore when configured, or uses in-memory storage for local development.

## Runtime overview

Core runtime files:

- `src/server.ts` – HTTP server and routes.
- `src/beeai/llm.ts` – LLM probe + classifier.
- `src/beeai/vark.ts` – VARK questions, scoring, and summaries.
- `src/storage/sessionStore.ts` – session persistence (Firestore or memory fallback).

## Endpoints

### `GET /health`

Returns `ok` for readiness checks.

### `GET /probe/llm`

Validates LLM connectivity. Returns `200` with `{ ok: true, provider, model, text }` on success, or `500` with `{ ok: false, error }` on failure.

### `POST /api/assessment/vark/start`

Body:

```json
{
  "studentId": "student-123",
  "gradeBand": "6-8"
}
```

Response:

```json
{
  "sessionId": "<uuid>",
  "question": {
    "id": "Q1",
    "text": "...",
    "options": [{ "key": "A", "text": "...", "mapsTo": "V" }],
    "target": "V"
  }
}
```

### `POST /api/assessment/vark/respond`

Body:

```json
{
  "sessionId": "<uuid>",
  "answer": "A"
}
```

Response (mid-session):

```json
{
  "sessionId": "<uuid>",
  "question": {
    "id": "Q2",
    "text": "...",
    "options": [{ "key": "A", "text": "...", "mapsTo": "V" }],
    "target": "A"
  }
}
```

Response (final):

```json
{
  "done": true,
  "result": {
    "scores": { "v": 2, "a": 1, "r": 1, "k": 2 },
    "primary": "Multi",
    "summary": "...",
    "recommendations": ["..."]
  }
}
```

## Environment variables

Required:

- `PORT` (default 8080)
- `LLM_CHAT_MODEL_NAME` (used by `src/beeai/llm.ts`)
- `VERTEX_REGION` or `VERTEX_LOCATION`
- `GOOGLE_CLOUD_PROJECT` (or `FIREBASE_PROJECT_ID` for Firestore-only)

Optional:

- `FIREBASE_PROJECT_ID` (forces Firestore without `GOOGLE_CLOUD_PROJECT`)

> Note: Cloud Run must have Application Default Credentials with Vertex AI and Firestore permissions.

## Example curl commands

Start a session:

```
curl -X POST http://localhost:8080/api/assessment/vark/start \
  -H "content-type: application/json" \
  -d '{"studentId":"demo-123","gradeBand":"6-8"}'
```

Respond:

```
curl -X POST http://localhost:8080/api/assessment/vark/respond \
  -H "content-type: application/json" \
  -d '{"sessionId":"<session-id>","answer":"A"}'
```

Probe LLM:

```
curl http://localhost:8080/probe/llm
```

## Troubleshooting

### LLM probe failed

- Check `LLM_CHAT_MODEL_NAME`, `VERTEX_REGION`/`VERTEX_LOCATION`, and `GOOGLE_CLOUD_PROJECT`.
- Confirm Vertex AI APIs are enabled and the Cloud Run service account has access.
- Confirm ADC credentials are present.

### Session not found

- Verify the client is sending the latest `sessionId` from the `/start` response.
- If Firestore is enabled, check for permissions and network access.
- If using in-memory storage, ensure you are talking to the same instance.

### Missing env vars

- The service returns 500 errors if required env vars are missing.
- Review the Cloud Run environment variable configuration.

## Build & run

```
npm ci --legacy-peer-deps
npm run build
PORT=8080 npm start
```

## Smoke test

```
npm run build
npm test
```
