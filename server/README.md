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
- Enable APIs: Cloud Run, Artifact Registry, Vertex AI, Secret Manager.
- Service account `ga-assessment-runner@geaux-academy.iam.gserviceaccount.com` needs:
  - Vertex AI User (or least-privilege equivalent)
  - Cloud Datastore User (Firestore access)
  - Secret Manager Secret Accessor (if using secrets)

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
