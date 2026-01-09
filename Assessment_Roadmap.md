# Assessment Roadmap
Status (Jan 1, 2026): ✅ Implemented in `ga-assessment-service` under `/server` (Issue #138).

This file documents the assessment backend plan that has now been completed. Use it as a reference for setup, deployment, and follow-up wiring.

## Update (Jan 2026): BeeAI VARK Orchestration
- VARK assessment now routes through `POST /api/assessment/chat` with mode=vark.
- ga-assessment-service is the gateway and forwards VARK turns to the BeeAI orchestration service (Cloud Run).
- Orchestration responses are normalized to a stable camelCase contract.
- Firestore student records are finalized only when VARK status is complete, and `vark_profile` is persisted.

## Deployment Checklist (When You Come Back)
- [ ] Set Cloud Run env vars for ga-assessment-service:
  - `BEEAI_ORCHESTRATION_URL=https://beeai-orchestration-145629211979.us-central1.run.app`
  - `ORCHESTRATION_TIMEOUT_MS=20000`
  - `FIREBASE_PROJECT_ID`, `GOOGLE_CLOUD_PROJECT`
- [ ] Smoke test VARK start/respond:
  - Start: `POST /api/assessment/chat` with mode=vark, messages=[]
  - Respond: `POST /api/assessment/chat` with mode=vark, sessionId, messages=[...]
- [ ] Confirm Firestore writes:
  - `students/{studentId}.assessmentStatus` transitions to completed on completion
  - `students/{studentId}.vark_profile` exists after completion
- [ ] Confirm ownership checks:
  - parentId derived from auth uid
  - mismatch returns error
- [ ] Confirm BeeAI orchestration service health endpoint (if exposed)

## Completed Today (Jan 1, 2026)
- Cloud Run-friendly TypeScript/Express service scaffolded in `/server`
- Firebase ID token auth middleware + ownership checks (401/403/404 cases)
- Endpoints:
  - `POST /api/learning-style/assess`
  - `POST /api/assessment/chat`
- Firestore updates to `students/{studentId}` and best-effort writes to `assessments`
- Vertex AI provider with stub fallback
- Minimal tests for `/healthz` and missing-auth assessment request

---

## Summary Assessment (Legacy/Optional)

## 1) GCP Setup Checklist (Console work)

### 1.1 Confirm project + region
- Pick a region for Vertex AI and Cloud Run (common: us-central1).
- Write these down:
  - GOOGLE_CLOUD_PROJECT = <your-project-id>
  - VERTEX_REGION = us-central1

### 1.2 Enable required APIs
Enable:
- Vertex AI API
- Cloud Run API
- Artifact Registry API
- Secret Manager API

### 1.3 Create a Cloud Run service account
Example:
- geaux-academy-api-sa

Grant roles:
- Vertex AI User (or least privilege equivalent)
- Firestore access as needed (Cloud Datastore User is common)
- Secret Manager Secret Accessor (if using secrets)

### 1.4 Decide Vertex AI model
Pick a Gemini model available in Vertex AI.
Record:
- VERTEX_MODEL = <model-name-identifier>

---

## 2) Repo Changes (Code work)

### 2.1 Create backend folder
Add:
- /server/package.json
- /server/src/index.ts (Express app)
- /server/src/middleware/auth.ts (Firebase token verification)
- /server/src/routes/learningStyle.ts
- /server/src/services/vertex.ts
- /server/src/services/firestore.ts (optional helper)
- /server/Dockerfile for Cloud Run

### 2.2 Auth middleware
Goal:
- Require Authorization: Bearer <Firebase ID token>
- Verify with Firebase Admin SDK
- Set req.user = { uid, email }

### 2.3 Ownership enforcement
Before any student write:
- Load students/{studentId}
- Assert: student.parentId === req.user.uid
- If not, return 403

---

## 3) API Contract

### 3.1 Endpoint
POST /api/learning-style/assess

Body:
{
  "studentId": "string",
  "messages": [{ "role": "user"|"assistant", "content": "string" }]
}

Response:
{
  "learningStyle": "Visual|Auditory|Reading/Writing|Kinesthetic|Mixed",
  "confidence": 0.0-1.0,
  "rationale": "string",
  "recommendations": ["string"]
}

### 3.2 Firestore writes
Update students/{studentId}:
- learningStyle
- assessmentResults: { confidence, rationale, recommendations }
- hasTakenAssessment = true
- assessmentStatus = "completed"
- updatedAt

Optional:
Create assessments/{assessmentId}:
- studentId
- parentId
- messages
- result
- model
- createdAt

---

## 4) Vertex AI Prompting Strategy

### 4.1 System instruction
- Tell the model it must return ONLY valid JSON.
- Provide a strict JSON schema.
- Tell it to choose from the allowed enum list.
- Keep rationale short and parent-friendly.

### 4.2 Validation
- Parse JSON
- Validate keys and types
- Clamp confidence to 0..1
- If invalid, return a safe error and do NOT write to Firestore.

---

## 5) Frontend Wiring

### 5.1 learningStyleService.ts
- Get Firebase ID token: auth.currentUser.getIdToken()
- Call fetch('/api/learning-style/assess', { headers: Authorization Bearer ... })

### 5.2 LearningStyleChat integration
- When user completes enough messages (or hits “Finish Assessment”), submit transcript to backend.
- Show a “Generating results” state.
- On success:
  - Update UI to show learningStyle + recommendations
  - StudentDashboard should detect hasTakenAssessment and stop showing the chat by default.

### 5.3 Parent Dashboard display
- When parent loads profile, show student cards:
  - Assessment: Completed/Pending
  - Learning Style (if available)

---

## 6) Cloud Run Deploy Steps

### 6.1 Local smoke test
- Run server locally
- Verify:
  - missing token returns 401
  - wrong parentId returns 403
  - correct owner returns 200 and writes to Firestore

### 6.2 Deploy
- Build container from /server
- Deploy to Cloud Run
- Set environment variables:
  - GOOGLE_CLOUD_PROJECT
  - VERTEX_REGION
  - VERTEX_MODEL
  - FIREBASE_PROJECT_ID
- Attach service account:
  - geaux-academy-api-sa

### 6.3 Update frontend config
- In production, point /api calls to Cloud Run URL (or use same-domain routing if behind a gateway).

---

## 7) Smoke Tests and Troubleshooting Notes

### Smoke tests
- Create student from Parent Dashboard.
- Complete assessment to verify:
  - students/{studentId}.learningStyle set
  - students/{studentId}.assessmentStatus = completed
  - assessments/{assessmentId} created (if enabled)

### “Missing or insufficient permissions”
- Confirm Firestore rules include parents and students access patterns.
- Confirm students document includes parentId.
- Confirm request.auth.uid matches.

### Token verification fails
- Ensure Firebase Admin is initialized with correct project.
- Ensure frontend is sending Authorization header.

### Vertex calls fail
- Confirm service account has Vertex AI permissions.
- Confirm Vertex API is enabled.
- Confirm region matches the model availability.

---

## Tomorrow’s “first 3 wins”
1) Create /server, verify Firebase token middleware works.
2) Implement /api/learning-style/assess with ownership checks and mocked response first.
3) Swap mock for Vertex call and write results to Firestore.
