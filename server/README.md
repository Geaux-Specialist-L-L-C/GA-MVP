# Assessment Service (Cloud Run)

TypeScript/Express service for the learning-style assessment chat endpoint.

## Local development

```bash
npm install
npm run dev
```

Create a `.env` file (see `.env.example`) if you want to point at Vertex AI or Firebase credentials locally.

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
  --set-env-vars "GOOGLE_CLOUD_PROJECT=YOUR_PROJECT,FIREBASE_PROJECT_ID=YOUR_PROJECT,VERTEX_REGION=us-central1,VERTEX_MODEL=gemini-2.0-flash-001" \
  --allow-unauthenticated=false
```

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
