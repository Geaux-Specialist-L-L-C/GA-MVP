# Development Plan

## Project Overview
Geaux Academy provides personalized learning for K-12 students through a parent-led workflow:
1) Parent creates a Student Profile.
2) Student completes an AI-guided Learning Style Assessment.
3) The platform generates grade-appropriate curriculum and activities aligned to the student’s learning style.
4) Parent approves curriculum before it reaches the student.
5) Student progress is tracked and surfaced to the parent with insights and interventions.

## Core Goals
1) Personalized Learning Paths
- Generate learning paths based on grade + learning style + progress signals.

2) Interactive Learning Experience
- Keep lessons engaging and approachable with multi-modal activities.

3) Parent Oversight
- Parents approve curriculum, see progress, and get actionable intervention guidance.

4) Scalable Architecture
- Cloud Run backend for AI and core APIs; Firestore for rapid iteration.

5) Security and Privacy
- Strong access controls, least-privilege IAM, no AI keys on the client.

---

## Phased Roadmap

### Phase 1: Foundation and Identity (Mostly Done)
- [x] React + Vite + Firebase Auth setup
- [x] Email/password login flow stable
- [x] Parent Dashboard route gating
- [x] Student creation from Parent Dashboard
- [x] Student Dashboard loads and begins assessment UI

Deliverable:
- Parent can create student and reach student dashboard reliably.

### Phase 2: Assessment Backend and Persistence
- [ ] Node/Express backend scaffold in `/server`
- [ ] Firebase Admin token verification middleware
- [ ] Vertex AI integration wrapper (Gemini on Vertex)
- [ ] POST /api/learning-style/assess endpoint
- [ ] Save results to Firestore students/{studentId}
- [ ] Assessment results UI (student view + parent view)

Deliverable:
- Assessment produces stored learning style + recommendations with confidence and rationale.

### Phase 3: Curriculum Generation and Parent Approval (CrewAI)
- [ ] Curriculum generation service (CrewAI or equivalent orchestration)
- [ ] “Generate Curriculum” trigger only after assessment completion
- [ ] Parent Approval workflow:
  - approve/reject/edit
  - versioning and history
- [ ] Store curriculum artifacts per student and per term

Deliverable:
- Parent receives a proposed curriculum aligned to grade + learning style and can approve it.

### Phase 4: Progress Tracking and Insights
- [ ] Assignment/task model (daily/weekly lessons)
- [ ] Student completion tracking
- [ ] Parent insights:
  - progress summaries
  - struggle areas
  - suggested interventions and pacing adjustments
- [ ] Basic analytics (completion rates, topic mastery signals)

Deliverable:
- Parent dashboard shows progress and meaningful “what to do next” guidance.

### Phase 5: Hardening and Scale
- [ ] Security review (rules, IAM, token handling, logging)
- [ ] Performance improvements and caching
- [ ] Cost controls for model usage
- [ ] Observability (Sentry, structured logs, alerts)
- [ ] CI checks and deployment workflows

Deliverable:
- Stable, secure, cost-aware system ready for broader rollout.

---

## Key Risks and Mitigations
- AI output reliability: enforce strict JSON schema and validation.
- Cost creep: rate limit, cache, and keep inference server-side.
- Access control: double-enforce in Firestore rules and backend checks.
