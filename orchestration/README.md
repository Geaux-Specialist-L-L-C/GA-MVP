# VARK Assessment Orchestration Service

This service runs the VARK assessment API for Geaux Academy. It provides a minimal HTTP API for starting a session, collecting responses, and returning the VARK profile summary. The service is designed for Cloud Run deployments.

## What this service does

- Orchestrates VARK assessment sessions.
- Probes the configured LLM to ensure Vertex configuration is healthy.
- Stores sessions in Firestore when a project is configured, or falls back to in-memory storage for local development.

## Endpoints

- `GET /health`
- `GET /probe/llm`
- `POST /api/assessment/vark/start`
- `POST /api/assessment/vark/respond`

## Environment variables

Required:

- `PORT` (default 8080)
- `LLM_CHAT_MODEL_NAME` (Vertex model name used by `src/beeai/llm.ts`)
- `VERTEX_REGION` or `VERTEX_LOCATION`
- `GOOGLE_CLOUD_PROJECT` (or `FIREBASE_PROJECT_ID` if using Firestore only)

Optional:

- `FIREBASE_PROJECT_ID` (if you want to force Firestore usage without `GOOGLE_CLOUD_PROJECT`)

You must also configure application default credentials for Vertex/Firestore in Cloud Run.

## Local build/run

```
npm ci --legacy-peer-deps
npm run build
PORT=8080 npm start
```

## Example requests

Start a session:

```
curl -X POST http://localhost:8080/api/assessment/vark/start \
  -H "content-type: application/json" \
  -d '{"studentId":"demo-123","gradeBand":"6-8"}'
```

Respond to a question:

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

- **LLM probe failed**: Verify `LLM_CHAT_MODEL_NAME`, `VERTEX_REGION`/`VERTEX_LOCATION`, and the project ID env var. Make sure Cloud Run has Vertex permissions.
- **Session not found**: Ensure you are sending the latest `sessionId` from `/start` and that Firestore connectivity is healthy.
- **Missing env vars**: The service returns 500 errors when required env vars are absent. Check Cloud Run service configuration.

## More documentation

See `docs/VARK_ORCHESTRATION_SERVICE.md` for detailed operational notes and troubleshooting steps.
