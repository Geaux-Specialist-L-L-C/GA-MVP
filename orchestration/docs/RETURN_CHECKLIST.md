# Return Checklist

## What was removed

- Template/demo agent sources and telemetry helpers.
- OpenTelemetry/OpenInference instrumentation dependencies.
- Unused logging and dotenv dependencies.

## What remains

- VARK assessment API runtime (`src/server.ts`, `src/beeai/*`, `src/storage/*`).
- VARK session storage via Firestore or memory fallback.

## What to verify when Daniel returns

- Cloud Run service account has Vertex AI + Firestore access.
- `LLM_CHAT_MODEL_NAME` points to the correct Vertex model.
- Firestore collection `vark_sessions` contains active sessions (if Firestore enabled).
- `/probe/llm` returns `ok: true`.

## Cloud Run env vars to set

- `PORT`
- `LLM_CHAT_MODEL_NAME`
- `VERTEX_REGION` or `VERTEX_LOCATION`
- `GOOGLE_CLOUD_PROJECT` (or `FIREBASE_PROJECT_ID`)

## Quick curl commands to validate the service

```
curl http://localhost:8080/health
```

```
curl http://localhost:8080/probe/llm
```

```
curl -X POST http://localhost:8080/api/assessment/vark/start \
  -H "content-type: application/json" \
  -d '{"studentId":"demo-123","gradeBand":"6-8"}'
```

```
curl -X POST http://localhost:8080/api/assessment/vark/respond \
  -H "content-type: application/json" \
  -d '{"sessionId":"<session-id>","answer":"A"}'
```
