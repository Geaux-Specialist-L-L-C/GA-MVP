# Assessment Service (Cloud Run)

TypeScript/Express service for the learning-style assessment chat endpoint.

## Local development

```bash
cd server
npm install
npm run dev
```

Create a `.env` file (see `.env.example`) with at least:
- `FIREBASE_PROJECT_ID`
- `GOOGLE_CLOUD_PROJECT`
Plus any Vertex settings you want to test locally. Dotenv is loaded in dev so the service will read `.env` from the server directory.

### Orchestration gateway (VARK)
- VARK chat is routed through the BeeAI orchestration service (Cloud Run).
- Configure the base URL via `BEEAI_ORCHESTRATION_URL` (no trailing slash recommended).
- Configure request timeout via `ORCHESTRATION_TIMEOUT_MS` (default recommendation: 20000).
- Do not send parentId from the client; the service derives it from the auth token.
- Orchestration service endpoints: `/health`, `/probe/llm`, `/api/assessment/vark/start`, `/api/assessment/vark/respond`.
- Orchestration session storage uses Firestore when `FIREBASE_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT` is set, otherwise falls back to in-memory storage.

### Summary learning-style inference (Vertex, optional/legacy)
- `POST /api/learning-style/assess` uses Vertex when configured, otherwise falls back to the stub.

## Cloud Run deployment (repeatable)

```bash
cd server
npm run deploy:cloudrun
```

### Example request (VARK start)

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

### Example request (VARK respond)

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

### Orchestration response contract (stable camelCase)
```json
{
  "ok": true,
  "sessionId": "string",
  "status": "in_progress|complete",
  "question": { "text": "string" },
  "result": { "summary": "string", "recommendations": ["string"] }
}
```

Error response shape:
```json
{
  "ok": false,
  "error": { "code": "string", "message": "string" }
}
```

### FAQ
Q: What does `/probe/llm` verify?
A: It checks the LLM connection and expects an "OK" response from the configured model.

Q: Why does orchestration need `LLM_CHAT_MODEL_NAME`?
A: The orchestration service uses BeeAI `ChatModel.fromName` and requires a model name to run the VARK classifier.

## Cloud Run deploy

```bash
gcloud run deploy ga-assessment-service \
  --source . \
  --region us-central1 \
  --service-account ga-assessment-runner@geaux-academy.iam.gserviceaccount.com \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=geaux-academy,FIREBASE_PROJECT_ID=geaux-academy,VERTEX_REGION=us-central1,VERTEX_MODEL=gemini-2.0-flash-001" \
  --allow-unauthenticated=false
```

### Verification
```bash
curl -s https://<cloud-run-url>/healthz
```

```bash
curl -i -X POST https://<cloud-run-url>/api/assessment/chat \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"student_456","mode":"vark","messages":[]}'
```

### IAM + API prerequisites (GCP project: geaux-academy)
- Enable APIs:
  - run.googleapis.com
  - cloudbuild.googleapis.com
  - artifactregistry.googleapis.com
  - aiplatform.googleapis.com
  - firestore.googleapis.com
  - iamcredentials.googleapis.com
  - serviceusage.googleapis.com
- Service account `ga-assessment-runner@geaux-academy.iam.gserviceaccount.com` needs:
  - Vertex AI User (or least-privilege equivalent)
  - Cloud Datastore User (Firestore access)
  - Secret Manager Secret Accessor (if using secrets)

Required IAM roles for runtime service account:
- `roles/datastore.user`
- `roles/aiplatform.user` (or `roles/aiplatform.developer` if needed)
- `roles/serviceusage.serviceUsageConsumer`

### Required environment variables

- `GOOGLE_CLOUD_PROJECT`
- `FIREBASE_PROJECT_ID` (preferred for Firebase Admin token verification; falls back to `GOOGLE_CLOUD_PROJECT`)
- `BEEAI_ORCHESTRATION_URL` (BeeAI orchestration service base URL)
- `ORCHESTRATION_TIMEOUT_MS` (default recommendation: 20000)
- `VERTEX_REGION` (or `VERTEX_LOCATION`)
- `VERTEX_MODEL` (defaults to `gemini-2.0-flash-001`)

Optional Vertex tuning:
- `VERTEX_TEMPERATURE`
- `VERTEX_MAX_TOKENS`
- `VERTEX_TIMEOUT_MS`

### Auth notes

Cloud Run uses Application Default Credentials (ADC) from the service account attached to the service. For local development, set `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON file.
Ensure `FIREBASE_PROJECT_ID` matches the Firebase project that issued the ID tokens (e.g., `geaux-academy`) to avoid `Invalid token` responses.

### Troubleshooting verifyIdToken failures
If you see `verifyIdToken failed; check FIREBASE_PROJECT_ID vs token aud`:
- Confirm token issuer/audience is `geaux-academy`.
- Confirm Cloud Run env includes `FIREBASE_PROJECT_ID=geaux-academy`.
- Confirm frontend Firebase config uses the same project.
