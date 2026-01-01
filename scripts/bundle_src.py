#!/usr/bin/env bash
set -euo pipefail

# Export the most relevant GA-MVP frontend context for:
# Parent -> Student -> Learning Style Assessment -> (future) Vertex backend integration

ROOT="${1:-.}"
OUT_DIR="${2:-./exports}"
TS="$(date +%Y%m%d_%H%M%S)"
OUT_FILE="${OUT_DIR}/ga_mvp_assessment_context_${TS}.txt"

mkdir -p "$OUT_DIR"

# Helper: safe print file with headers
print_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    echo "" >> "$OUT_FILE"
    echo "================================================================================" >> "$OUT_FILE"
    echo "FILE: $file" >> "$OUT_FILE"
    echo "================================================================================" >> "$OUT_FILE"
    sed -n '1,5000p' "$file" >> "$OUT_FILE"
  fi
}

# Collect files by glob patterns (only if they exist)
collect_matches() {
  local pattern="$1"
  # shellcheck disable=SC2086
  for f in $pattern; do
    [[ -f "$f" ]] && echo "$f"
  done
}

# De-dupe while preserving order
dedupe() {
  awk '!seen[$0]++'
}

cd "$ROOT"

echo "Creating export: $OUT_FILE"
: > "$OUT_FILE"

{
  echo "GA-MVP Assessment Context Export"
  echo "Generated: $(date -Is)"
  echo "Repo root: $(pwd)"
  echo ""
  echo "Goal: Parent can add students -> student completes learning-style assessment -> backend integration (Vertex) -> Firestore persistence."
  echo ""
  echo "---- RELEVANT TREE (filtered) ----"
} >> "$OUT_FILE"

# Print a filtered tree-like listing (no dependency on `tree`)
# Only show important directories and key file types
find src \
  \( -path "src/pages/profile/ParentProfile/*" -o -path "src/pages/profile/StudentProfile/*" -o -path "src/components/chat/*" -o -path "src/contexts/*" -o -path "src/services/*" -o -path "src/config/*" -o -path "src/firebase/*" -o -path "src/types/*" -o -path "src/models/*" \) \
  -type f \
  | sed 's|^| - |' >> "$OUT_FILE" || true

echo "" >> "$OUT_FILE"
echo "---- FILE CONTENTS ----" >> "$OUT_FILE"

# Build file list in priority order
FILE_LIST="$(
  {
    # App + routing/auth gate (often where student routes are protected)
    collect_matches "src/App.tsx"
    collect_matches "src/main.tsx"
    collect_matches "src/index.tsx"
    collect_matches "src/components/PrivateRoute.tsx"
    collect_matches "src/components/auth/AuthRoute.tsx"

    # Auth context
    collect_matches "src/contexts/AuthContext.tsx"
    collect_matches "src/contexts/ProfileContext.tsx"

    # Parent dashboard + create student flow
    collect_matches "src/pages/profile/ParentProfile/ParentDashboard.tsx"
    collect_matches "src/pages/profile/ParentProfile/CreateStudent.tsx"
    collect_matches "src/pages/profile/ParentProfile/ParentProfile.tsx"
    collect_matches "src/pages/profile/ParentProfile/ParentProfileForm.tsx"
    collect_matches "src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx"
    collect_matches "src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx"
    collect_matches "src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx"
    collect_matches "src/components/student/StudentCard.tsx"

    # Student dashboard + assessment UI
    collect_matches "src/pages/profile/StudentProfile/StudentDashboard.tsx"
    collect_matches "src/pages/profile/StudentProfile/StudentProfile.tsx"
    collect_matches "src/pages/profile/StudentProfile/StudentProfileForm.tsx"

    # Assessment chat components
    collect_matches "src/components/chat/LearningStyleChat.tsx"
    collect_matches "src/components/chat/ChatUI.tsx"
    collect_matches "src/components/chat/TestChat.tsx"
    collect_matches "src/hooks/useVARKAssessment.ts"
    collect_matches "src/components/VARKAssessment/ChatContainer.tsx"
    collect_matches "src/components/VARKAssessment/ChatInput.tsx"
    collect_matches "src/components/VARKAssessment/ChatMessage.tsx"
    collect_matches "src/components/VARKAssessment/VARKResults.tsx"

    # Services that matter for moving Cheshire/OpenAI -> Vertex backend
    collect_matches "src/services/profileService.ts"
    collect_matches "src/services/firestore.ts"
    collect_matches "src/services/firebaseService.ts"
    collect_matches "src/services/api.js"
    collect_matches "src/services/varkService.ts"
    collect_matches "src/services/cheshireService.ts"
    collect_matches "src/services/openai.js"

    # Firebase config + messaging if it touches auth or SW
    collect_matches "src/config/firebase.ts"
    collect_matches "src/firebase/auth-service.ts"
    collect_matches "src/firebase/messaging-utils.ts"
    collect_matches "src/firebase/firebase-messaging-sw.ts"
    collect_matches "src/firebase/auth-service-worker.ts"

    # Types/models referenced by dashboards/services
    collect_matches "src/types/auth.ts"
    collect_matches "src/types/profiles.ts"
    collect_matches "src/types/student.ts"
    collect_matches "src/models/Student.ts"
    collect_matches "src/models/Parent.ts"
    collect_matches "src/models/Assessment.ts"

    # Common UI pieces used in dashboards
    collect_matches "src/components/common/LoadingSpinner.tsx"
    collect_matches "src/components/common/Modal.tsx"
    collect_matches "src/components/common/Toast.tsx"
    collect_matches "src/components/common/Button.tsx"
  } | dedupe
)"

# Print each file
while IFS= read -r f; do
  print_file "$f"
done <<< "$FILE_LIST"

echo "" >> "$OUT_FILE"
echo "---- END OF EXPORT ----" >> "$OUT_FILE"

echo "✅ Export created: $OUT_FILE"
echo "Tip: share this file with ChatGPT for auditing and Vertex-backend wiring."
