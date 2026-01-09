# Geaux Academy

An interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.

## Quick Start

### Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation
1. Clone and install:
   ```bash
   git clone <repository-url>
   cd GA-MVP
   npm install
   ```

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Replace placeholder values with your Firebase configuration
   - IMPORTANT: Never commit `.env` file with real credentials
   - For production, use GitHub Secrets and CI/CD environment variables

3. Start development:
   ```bash
   npm run dev    # Start dev server
   ```

Visit `http://localhost:5173` for development.

## Security Best Practices

### Firebase Configuration
- Store Firebase credentials in environment variables
- Use different Firebase projects for development/staging/production
- Enable secure authentication methods in Firebase Console
- Implement proper Firestore security rules
- Use App Check in production to prevent abuse

For detailed security guidelines, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).

## Key Features
- AI-powered learning style assessment through interactive chat
- Personalized learning paths based on VARK model
- Real-time progress tracking
- Google authentication
- Interactive dashboard for students and educators

## Documentation
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Detailed setup, architecture, and development roadmap
- [Development Plan](./Developmentplan.md) - Phased roadmap and delivery milestones
- [Assessment Roadmap](./Assessment_Roadmap.md) - Assessment backend and deployment checklist
- [Component Structure](./src/components/README.md) - UI component documentation
- [API Documentation](./backend/README.md) - Backend API reference

> Additional roadmap notes live in the Development Plan and Assessment Roadmap linked above.

## Assessment Architecture (Current)
- ga-assessment-service acts as the gateway for assessment chat and routing decisions.
- VARK assessment traffic is routed to the BeeAI orchestration service (Cloud Run) via `/api/assessment/chat`.
- Summary learning-style inference (transcript-based) can still use the Vertex provider path via `/api/learning-style/assess`.
- The gateway enforces auth-derived parentId, explicit mode routing, stable orchestration response normalization, and Firestore writes only on completion (persisting `vark_profile`).

## Status / Progress
- ✅ Issue #135 (ParentDashboard real student data)
  - ParentDashboard now renders student cards using Firestore student documents for name/grade.
- ✅ Issue #136 (ParentDashboard profile fetch consistency)
  - Student profiles are resolved via `getParentProfile(user.uid)` → `getStudentsByIds(profile.students || [])` with safe fallbacks.
- ✅ Issue #137 (StudentDashboard robustness)
  - StudentDashboard handles missing/invalid student IDs and missing docs, with setup CTAs and test coverage.
- ✅ Issue #138 (Backend assessment service scaffold)
  - Added the ga-assessment-service in `/server` with auth, ownership checks, endpoints, and baseline tests.

## What we finished today (Jan 1, 2026)
- ParentDashboard improvements (Issues #135, #136)
  - Student cards now show real names/grades from Firestore with safe fallbacks and stable navigation.
  - Student profiles are fetched via `getParentProfile(user.uid)` → `getStudentsByIds(profile.students || [])`.
- StudentDashboard robustness (Issue #137)
  - Setup CTA UI for missing/invalid student IDs: Back to Parent Dashboard/Login, Add Student (authed only), Retry.
  - Added test coverage for missing parameter/setup UI and CTA navigation.
  - AuthContext dev logging updated to avoid Jest `import.meta` issues.
- Backend service scaffold (Issue #138)
  - New Cloud Run-ready TypeScript/Express service in `/server` with Firebase ID token auth middleware.
  - Ownership checks for parent/student; 401 missing/invalid auth, 403 mismatch, 404 missing student.
  - Endpoints: `/api/learning-style/assess` and `/api/assessment/chat`.
  - Firestore student doc updates: `learningStyle`, `hasTakenAssessment=true`, `assessmentStatus='completed'`.
  - Best-effort writes to `assessments` collection.
  - Vertex AI provider when env vars present, stub provider fallback otherwise.
  - Minimal vitest + supertest coverage for `/healthz` and missing-auth assessment request.
- Assessment gateway + VARK orchestration hardening
  - `/api/assessment/chat` routes VARK chat to the BeeAI orchestration service (Cloud Run) with explicit mode routing.
  - parentId derived from auth only; request mismatch returns `CLIENT_PARENT_MISMATCH`.
  - Orchestration responses normalized to a stable camelCase contract.
  - Firestore writes finalize only when VARK status is complete (store `vark_profile`).
  - Added an integration-style test for the VARK chat flow.

### Today’s Changes (files)
**A) ParentDashboard + students**
- `src/pages/profile/ParentProfile/ParentDashboard.tsx`
- `src/services/profileService.ts`

**B) StudentDashboard + tests**
- `src/contexts/AuthContext.tsx`
- `src/pages/profile/StudentProfile/StudentDashboard.tsx`
- `src/pages/__tests__/StudentDashboard.test.tsx`

**C) Backend service scaffold**
- `server/.env.example`
- `server/Dockerfile`
- `server/README.md`
- `server/package.json`
- `server/tsconfig.json`
- `server/vitest.config.ts`
- `server/src/index.ts`
- `server/src/app.ts`
- `server/src/middleware/auth.ts`
- `server/src/routes/assessment.ts`
- `server/src/services/firestore.ts`
- `server/src/services/vertex.ts`
- `server/src/types.ts`
- `server/src/__tests__/app.test.ts`

## Backend: ga-assessment-service
**Location:** `/server`

**Local run**
```bash
cd server
npm install
npm run dev
```

**Cloud Run deploy (high level)**
```bash
gcloud run deploy ga-assessment-service \
  --source . \
  --region $VERTEX_REGION \
  --project $GOOGLE_CLOUD_PROJECT \
  --set-env-vars FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID,VERTEX_REGION=$VERTEX_REGION,VERTEX_MODEL=$VERTEX_MODEL
```

**Endpoints + auth expectations**
- `POST /api/learning-style/assess` (requires `Authorization: Bearer <Firebase ID token>`)
- `POST /api/assessment/chat` (requires `Authorization: Bearer <Firebase ID token>`)
- Missing/invalid token → 401
- Student ownership mismatch → 403
- Missing student doc → 404

## Verification (VARK)
Env reminders:
- `BEEAI_ORCHESTRATION_URL=https://beeai-orchestration-145629211979.us-central1.run.app`
- `ORCHESTRATION_TIMEOUT_MS=20000`

Start a VARK session:
```bash
curl -X POST http://localhost:8080/api/assessment/chat \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student_456",
    "gradeBand": "3-5",
    "mode": "vark",
    "messages": []
  }'
```

Respond to the VARK session:
```bash
curl -X POST http://localhost:8080/api/assessment/chat \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student_456",
    "sessionId": "<sessionId>",
    "mode": "vark",
    "messages": [{ "role": "user", "content": "I like diagrams and pictures." }]
  }'
```

## FAQ
Q: Which service owns VARK sessions?
A: The BeeAI orchestration service owns the session state; the gateway stores only the final `vark_profile` on completion.

Q: What endpoints does the orchestration service expose?
A: `/health`, `/probe/llm`, `/api/assessment/vark/start`, `/api/assessment/vark/respond`.

Q: What orchestration env vars matter most?
A: `LLM_CHAT_MODEL_NAME`, `GOOGLE_CLOUD_PROJECT`, `VERTEX_REGION` or `VERTEX_LOCATION`, and `FIREBASE_PROJECT_ID` for Firestore-backed sessions.

Q: Why is `@ai-sdk/google-vertex` a production dependency?
A: BeeAI loads it at runtime in Cloud Run, so it must be installed in the production layer.

## Next up
- Next roadmap issue: #139
- Set Cloud Run env vars for ga-assessment-service and verify BeeAI orchestration connectivity.

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run deploy   # Deploy to Firebase
```

## Contributing
See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for detailed development instructions and roadmap.

## License
[MIT License](LICENSE)
