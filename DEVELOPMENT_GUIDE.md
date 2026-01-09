# Development Guide

## Architecture Overview

Geaux Academy is a parent-led, student-focused learning platform:
- Parents create and manage Student Profiles.
- Students complete a Learning Style Assessment via chat.
- The platform stores learning style + recommendations in Firestore.
- Next: a curriculum generation pipeline (CrewAI) produces grade-appropriate curriculum that parents approve.
- Progress tracking feeds back into parent insights and interventions.

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Firebase SDK for Authentication
- Context API (and optionally Redux) for state management
- Styled Components & CSS Modules

### Backend (Current Direction)
- Node.js + Express API
- Deployed to Google Cloud Run
- Firebase Admin SDK for verifying Firebase ID tokens
- Firestore for data persistence
- BeeAI orchestration service (Cloud Run) for VARK assessment chat flow
- Vertex AI (Gemini on Vertex) for summary learning-style inference (optional/legacy)
- Service name: ga-assessment-service
- Optional future services:
  - CrewAI pipeline service for curriculum generation and validation
  - Background job runner (Cloud Tasks / PubSub) for async workloads

---

## Current Status

### Working
- ✅ Firebase Auth (email/password) login works
- ✅ Parent Dashboard loads for authenticated users
- ✅ Parent can create a student (Firestore permissions resolved)
- ✅ ParentDashboard shows student cards with Firestore-backed name/grade data (Issues #135, #136 closed)
- ✅ Student Dashboard loads, begins the assessment chat UI, and handles missing/invalid student IDs with setup CTAs and tests (Issue #137 closed)
- ✅ ga-assessment-service scaffold in `/server` with auth, ownership checks, and baseline tests (Issue #138 closed)

### In Progress
- ⏳ Confirm VARK chat uses `/api/assessment/chat` with mode routing
- ⏳ Display VARK results (`vark_profile`) in Student Dashboard
- ⏳ Surface assessment status + learning style in Parent Dashboard
- ⏳ Connect “Generate Curriculum” flow (CrewAI) after assessment completion

---

## Recent Changes (Jan 1, 2026)
- ParentDashboard now renders real student names/grades from Firestore with consistent `getParentProfile` → `getStudentsByIds` fetch path and safe fallbacks (Issues #135, #136).
- StudentDashboard setup UX handles missing/invalid student IDs with Back/Login/Add Student/Retry CTAs; added test coverage and dev logging fix in AuthContext (Issue #137).
- Backend ga-assessment-service scaffolded in `/server` with Firebase ID token auth, ownership checks, `/api/learning-style/assess` and `/api/assessment/chat` endpoints, Firestore writes, and baseline vitest + supertest coverage (Issue #138).

## Next Up
- Next roadmap issue: #139

---

## Data Model (Firestore)

### parents/{parentUid}
Recommended fields:
- uid: string
- email: string
- displayName: string
- students: string[] (array of student document IDs)
- createdAt: ISO string
- updatedAt: ISO string

### students/{studentId}
Recommended fields:
- parentId: string (must match parent UID)
- name: string
- grade: string
- hasTakenAssessment: boolean
- learningStyle: "Visual" | "Auditory" | "Reading/Writing" | "Kinesthetic" | "Mixed" (optional)
- assessmentStatus: "not_started" | "in_progress" | "completed" | "error" (optional)
- assessmentResults: {
    confidence: number,
    rationale: string,
    recommendations: string[]
  } (optional)
- vark_profile: {
    model: "vark",
    scores: { visual, auditory, read_write, kinesthetic },
    primary: string,
    secondary: string,
    confidence: number,
    summary: string,
    recommendations: string[],
    assessedAt: ISO string,
    sessionId: string
  } (optional, VARK complete only)
- createdAt: ISO string
- updatedAt: ISO string

### assessments/{assessmentId} (optional but recommended)
Use this to store the full transcript + model outputs for audits and iteration:
- studentId: string
- parentId: string
- messages: { role: "user"|"assistant", content: string }[]
- result: { learningStyle, confidence, rationale, recommendations }
- model: string
- createdAt: ISO string

---

## Learning Style Assessment Architecture

There are now two assessment modes:
1) VARK chat mode (BeeAI orchestration service)
2) Summary learning-style inference (Vertex provider, optional/legacy)

1) Student interacts with the chat UI (frontend)
- The UI collects conversation messages.
- The UI submits them to the backend, not directly to any model provider.

2) Backend endpoint performs security checks
- Verify Firebase ID token (Authorization: Bearer <token>)
- Load students/{studentId}
- Enforce ownership: student.parentId must equal request.auth.uid

3) Backend routes based on mode
- VARK mode: route to BeeAI orchestration service via ga-assessment-service.
- Summary mode: call Vertex AI (Gemini on Vertex) to infer a learning style from transcript.

4) Backend persists results only on completion
- VARK: write `vark_profile` when status is complete.
- Summary: write learning style fields if using legacy summary flow.
- Optionally create assessments/{assessmentId} with transcript + result.

### Mode Routing Contract
- `/api/assessment/chat` defaults to VARK mode.
- `mode: "vark"` uses session-based start/respond:
  - Start: messages = [], gradeBand optional, sessionId omitted
  - Respond: sessionId present, messages contain user response
- `mode: "summary"` uses transcript-based inference (if enabled).
- `/api/learning-style/assess` remains the summary/transcript endpoint.

### Orchestration Service Notes
- Health check: `/health`
- LLM probe: `/probe/llm` (expects "OK" from the configured model)
- VARK endpoints: `/api/assessment/vark/start` and `/api/assessment/vark/respond`
- Session storage: Firestore when `FIREBASE_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT` is set, otherwise in-memory.

### Operational Safety
- parentId is derived from auth uid only.
- If a client sends parentId that mismatches auth uid, return `CLIENT_PARENT_MISMATCH`.
- Firestore student writes are finalized only when VARK status is complete.

### Observability / Logging
- Log request context: studentId, sessionId, mode, and step (start/respond).
- Log orchestration failures without leaking stack traces to clients.

---

## Firestore Security Rules (Recommended Baseline)

Note: these rules must match how the app reads/writes data.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    // Parents can read/write their own profile.
    match /parents/{parentId} {
      allow read, write: if isSignedIn() && request.auth.uid == parentId;
    }

    // Students are owned by a parentId field.
    match /students/{studentId} {
      allow read: if isSignedIn() && request.auth.uid == resource.data.parentId;

      // Create: parent creates a student and sets parentId to themselves
      allow create: if isSignedIn()
        && request.resource.data.parentId == request.auth.uid;

      // Update/Delete: only the owning parent
      allow update, delete: if isSignedIn()
        && request.auth.uid == resource.data.parentId;
    }

    // Optional assessments collection
    match /assessments/{assessmentId} {
      allow read: if isSignedIn() && request.auth.uid == resource.data.parentId;
      allow create: if isSignedIn() && request.resource.data.parentId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

---

## Code Organization

```
src/
├── components/
├── pages/
├── contexts/
├── services/
├── utils/
└── types/

server/                      # ga-assessment-service backend (Cloud Run)
├── src/
│   ├── index.ts
│   ├── routes/
│   ├── middleware/
│   └── services/
├── package.json
└── Dockerfile
```

---

## Local Development

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

### Vite Proxy (/api)
Proxy `/api` to the local server so the frontend can call:

```
/api/learning-style/assess
```

Example `vite.config.ts` snippet:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

---

## Environment Variables

### Frontend Firebase (required)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

Optional assessment API base (overrides relative `/api` calls):
```
VITE_ASSESSMENT_API_BASE
```

### Backend (Cloud Run + Vertex AI)
Use Secret Manager for sensitive values.

```
GOOGLE_CLOUD_PROJECT
VERTEX_REGION
VERTEX_MODEL
FIREBASE_PROJECT_ID
```

Important:
- Do NOT put model provider keys in VITE_ variables.
- All model calls must go through the backend.

---

## Deployment Notes

### Cloud Run
- Build and deploy the Express backend to Cloud Run.
- Run Cloud Run as a service account with Vertex AI permissions.
- Use Secret Manager for config and rotate as needed.
- Rely on Application Default Credentials (ADC) for service authentication.

---

## Monitoring
- Cloud Run logs for backend
- Firebase logs for client events (optional)
- Add Sentry later for client error tracking
- Add structured backend request IDs for traceability

---

## Testing Strategy
- Unit tests for services (profileService, learningStyleService)
- Integration tests for:
  - Auth middleware
  - Assessment endpoint authorization checks
  - Firestore write behavior
- E2E tests later for:
  - Parent creates student
  - Student completes assessment
  - Parent sees result
