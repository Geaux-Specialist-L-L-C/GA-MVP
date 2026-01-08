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

### Provider selection (Vertex vs BeeAI)
- `ASSESSMENT_PROVIDER=vertex` (default) uses Vertex AI when configured, otherwise falls back to the stub.
- `ASSESSMENT_PROVIDER=beeai` enables the BeeAI orchestrator adapter (see `src/beeai/` and `src/beeai/workflows/vark.yaml`).
- `ASSESSMENT_PROVIDER=stub` forces the built-in stub provider.

BeeAI config:
- `BEEAI_API_KEY` (required for BeeAI)
- `BEEAI_API_URL` (optional; defaults to `https://api.beeai.dev`)
- `BEEAI_WORKFLOW_ID` (preferred) or `BEEAI_WORKFLOW_PATH` for a local YAML workflow id/path

## Cloud Run deployment (repeatable)

```bash
cd server
npm run deploy:cloudrun
```

### Example request

```bash
curl -X POST http://localhost:8080/api/learning-style/assess \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": "parent_123",
    "studentId": "student_456",
    "messages": [
      { "role": "user", "content": "My child likes pictures and videos." }
    ]
  }'
```

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
curl -i -X POST https://<cloud-run-url>/api/learning-style/assess \
  -H "Content-Type: application/json" \
  -d '{"parentId":"parent_123","studentId":"student_456","messages":[{"role":"user","content":"hello"}]}'
```

```bash
curl -X POST https://<cloud-run-url>/api/learning-style/assess \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": "parent_123",
    "studentId": "student_456",
    "messages": [
      { "role": "user", "content": "My child learns best with pictures." }
    ]
  }'
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
