#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="geaux-academy"
REGION="us-central1"
SERVICE_NAME="ga-assessment-service"
SERVICE_ACCOUNT="ga-assessment-runner@geaux-academy.iam.gserviceaccount.com"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd gcloud

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  echo "No active gcloud account. Run: gcloud auth login" >&2
  exit 1
fi

gcloud config set project "$PROJECT_ID" >/dev/null

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  iamcredentials.googleapis.com \
  serviceusage.googleapis.com

ENV_VARS="GOOGLE_CLOUD_PROJECT=${PROJECT_ID},FIREBASE_PROJECT_ID=${PROJECT_ID},VERTEX_REGION=${REGION},VERTEX_MODEL=gemini-2.0-flash-001"

if [[ -n "${VERTEX_TEMPERATURE:-}" ]]; then
  ENV_VARS="${ENV_VARS},VERTEX_TEMPERATURE=${VERTEX_TEMPERATURE}"
fi
if [[ -n "${VERTEX_MAX_TOKENS:-}" ]]; then
  ENV_VARS="${ENV_VARS},VERTEX_MAX_TOKENS=${VERTEX_MAX_TOKENS}"
fi
if [[ -n "${VERTEX_TIMEOUT_MS:-}" ]]; then
  ENV_VARS="${ENV_VARS},VERTEX_TIMEOUT_MS=${VERTEX_TIMEOUT_MS}"
fi

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --service-account "$SERVICE_ACCOUNT" \
  --set-env-vars "$ENV_VARS" \
  --allow-unauthenticated=false

SERVICE_URL="$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format="value(status.url)")"
echo "Cloud Run service URL: ${SERVICE_URL}"
