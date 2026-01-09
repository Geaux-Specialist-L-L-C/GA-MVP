# VARK Assessment Status

## What we implemented
- ga-assessment-service routes VARK chat to the BeeAI orchestration service (Cloud Run).
- Explicit mode routing for `/api/assessment/chat` (vark vs summary).
- Auth-derived parentId only; mismatch returns `CLIENT_PARENT_MISMATCH`.
- Orchestration response normalization to a stable camelCase contract.
- Orchestration timeouts + safe retry handling with structured logging.
- Firestore finalization only on completion; persist `vark_profile`.
- Integration-style VARK chat test with orchestration mocks.

## Implementation Reference (code)
- `server/src/routes/assessment.ts`
- `server/src/services/orchestration.ts`
- `server/src/types.ts`
- `server/src/__tests__/assessment.vark.integration.test.ts`
- `server/.env.example`

## Current Cloud Run URLs
- ga-assessment-service: <set Cloud Run URL here>
- BeeAI orchestration service: https://beeai-orchestration-145629211979.us-central1.run.app

## Orchestration Service Notes
- Health check: `/health`
- LLM probe: `/probe/llm`
- VARK endpoints: `/api/assessment/vark/start`, `/api/assessment/vark/respond`
- Session storage: Firestore when `FIREBASE_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT` is set, otherwise in-memory.

## When I return
1) Pull latest and install deps
- [ ] `git pull`
- [ ] `npm install` (root)
- [ ] `cd server && npm install`

2) Ensure env vars are set
- [ ] `BEEAI_ORCHESTRATION_URL=https://beeai-orchestration-145629211979.us-central1.run.app`
- [ ] `ORCHESTRATION_TIMEOUT_MS=20000`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `GOOGLE_CLOUD_PROJECT`

3) Run server tests
- [ ] `cd server && npm run test`

4) Run VARK integration test
- [ ] `cd server && npm run test -- assessment.vark.integration.test.ts`

5) Local smoke tests with curl
- [ ] Start: `POST /api/assessment/chat` with mode=vark and messages=[]
- [ ] Respond: `POST /api/assessment/chat` with mode=vark, sessionId, messages=[...]

6) Deploy ga-assessment-service to Cloud Run with env vars
- [ ] Set env vars in Cloud Run
- [ ] Deploy service

7) Verify in UI
- [ ] Take assessment → completes
- [ ] Writes `vark_profile` to student
- [ ] Results visible in student/parent views

## Known Failure Modes
- 401: Missing/invalid token
- 403: Ownership mismatch (student parentId != auth uid)
- 400: `CLIENT_PARENT_MISMATCH` when body parentId mismatches auth uid
- 500: Orchestration timeout or upstream failure
- ok:false response not handled in UI

## Definition of Done
- [ ] VARK chat start/respond works locally and in Cloud Run
- [ ] Orchestration calls return stable camelCase responses
- [ ] Firestore writes only finalize on completion
- [ ] `vark_profile` persisted with scores, summary, recommendations
- [ ] Integration test passes in CI
- [ ] UI shows assessment results after completion
