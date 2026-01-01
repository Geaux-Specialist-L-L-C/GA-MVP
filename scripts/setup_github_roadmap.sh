#!/usr/bin/env bash
set -euo pipefail

print_plan() {
  cat <<'PLAN'
Execution plan:
1) Verify gh auth + repo remote
2) Ensure labels + milestones
3) Ensure Project (Projects V2) best-effort (no GraphQL)
4) Create/update roadmap issues
5) Add issues to the project (best-effort)
PLAN
}

print_plan

########################################
# Preconditions
########################################
if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is not installed." >&2
  exit 1
fi

gh auth status

repo_url="$(git remote get-url origin 2>/dev/null || true)"
if [[ -z "${repo_url}" ]]; then
  echo "Error: git remote 'origin' is not set. Unable to detect repo owner/name." >&2
  exit 1
fi

extract_owner_repo() {
  local url="$1"
  url="${url%.git}"
  if [[ "$url" =~ ^git@github.com:([^/]+)/(.+)$ ]]; then
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    return 0
  fi
  if [[ "$url" =~ ^https://github.com/([^/]+)/(.+)$ ]]; then
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    return 0
  fi
  return 1
}

repo_full_name="$(extract_owner_repo "$repo_url" || true)"
if [[ -z "${repo_full_name}" ]]; then
  echo "Error: Unable to parse repo from remote URL: $repo_url" >&2
  exit 1
fi

expected_repo="Geaux-Specialist-L-L-C/GA-MVP"
if [[ "$repo_full_name" != "$expected_repo" ]]; then
  echo "Error: Remote repo mismatch. Expected $expected_repo but found $repo_full_name" >&2
  exit 1
fi

echo "Detected repo: $repo_full_name"
export GH_REPO="$repo_full_name"

org_name="${repo_full_name%%/*}"
repo_name="${repo_full_name##*/}"

########################################
# Labels
########################################
labels=(
  "area:auth"
  "area:parent-dashboard"
  "area:student-dashboard"
  "area:assessment"
  "area:backend"
  "area:vertex-ai"
  "area:crew-ai"
  "area:firestore"
  "area:deployment"
  "type:bug"
  "type:chore"
  "type:feature"
  "type:docs"
  "priority:p0"
  "priority:p1"
  "priority:p2"
  "status:blocked"
)

declare -A label_colors=(
  ["area:auth"]="1d76db"
  ["area:parent-dashboard"]="1d76db"
  ["area:student-dashboard"]="1d76db"
  ["area:assessment"]="1d76db"
  ["area:backend"]="1d76db"
  ["area:vertex-ai"]="1d76db"
  ["area:crew-ai"]="1d76db"
  ["area:firestore"]="1d76db"
  ["area:deployment"]="1d76db"
  ["type:bug"]="d73a4a"
  ["type:chore"]="cfd3d7"
  ["type:feature"]="a2eeef"
  ["type:docs"]="0075ca"
  ["priority:p0"]="b60205"
  ["priority:p1"]="d93f0b"
  ["priority:p2"]="fbca04"
  ["status:blocked"]="6a737d"
)

declare -A label_desc=(
  ["area:auth"]="Authentication and authorization"
  ["area:parent-dashboard"]="Parent dashboard UI"
  ["area:student-dashboard"]="Student dashboard UI"
  ["area:assessment"]="Learning style assessment"
  ["area:backend"]="Backend services"
  ["area:vertex-ai"]="Vertex AI integration"
  ["area:crew-ai"]="CrewAI workflows"
  ["area:firestore"]="Firestore data storage"
  ["area:deployment"]="Deployment and ops"
  ["type:bug"]="Bug fix"
  ["type:chore"]="Chore or maintenance"
  ["type:feature"]="Feature work"
  ["type:docs"]="Documentation"
  ["priority:p0"]="Critical priority"
  ["priority:p1"]="High priority"
  ["priority:p2"]="Normal priority"
  ["status:blocked"]="Work blocked"
)

ensure_label() {
  local name="$1"
  # list -> grep (more compatible than jq filters across gh versions)
  if gh label list --json name -q '.[].name' 2>/dev/null | grep -Fxq "$name"; then
    return 0
  fi
  gh label create "$name" \
    --color "${label_colors[$name]}" \
    --description "${label_desc[$name]}" >/dev/null
}

echo "Ensuring labels..."
for label in "${labels[@]}"; do
  ensure_label "$label"
done

########################################
# Milestones
########################################
milestones=(
  "Phase 1 Foundation"
  "Phase 2 Parent + Student Dashboards"
  "Phase 3 Learning Style Assessment (Backend + Storage)"
  "Phase 4 Curriculum Generation (CrewAI workflow + Parent Approval)"
  "Phase 5 Progress Tracking + Insights"
  "Phase 6 Deployment + Monitoring Hardening"
)

ensure_milestone() {
  local title="$1"
  if gh api "repos/$repo_full_name/milestones" --paginate -q '.[].title' 2>/dev/null | grep -Fxq "$title"; then
    return 0
  fi
  gh api --method POST "repos/$repo_full_name/milestones" \
    -f title="$title" \
    -f state="open" >/dev/null
}

echo "Ensuring milestones..."
for ms in "${milestones[@]}"; do
  ensure_milestone "$ms"
done

########################################
# Project (Projects V2) best-effort
# NOTE: we avoid GraphQL entirely for compatibility.
########################################
project_title="GA-MVP Roadmap"
project_number=""
project_url=""
projects_supported="false"

if gh project list --owner "$org_name" >/dev/null 2>&1; then
  projects_supported="true"
else
  echo "Warning: gh cannot access Projects for org '$org_name' (missing access). Skipping project setup." >&2
fi

get_project_number_by_title() {
  local out
  out="$(gh project list --owner "$org_name" --limit 100 2>/dev/null || true)"
  # Expect first column to be number; match the title anywhere on the line.
  echo "$out" | awk -v t="$project_title" '$0 ~ t {print $1; exit}'
}

ensure_project() {
  echo "Ensuring project..."
  project_number="$(get_project_number_by_title)"

  if [[ -z "${project_number}" ]]; then
    echo "Project not found. Creating: ${project_title}"
    # Create is best-effort; org policies may block it.
    gh project create --owner "$org_name" --title "$project_title" >/dev/null 2>&1 || true
    project_number="$(get_project_number_by_title)"
  fi

  if [[ -n "${project_number}" ]]; then
    project_url="https://github.com/orgs/${org_name}/projects/${project_number}"
    echo "Project number: ${project_number}"
    echo "Project URL: ${project_url}"
  else
    echo "Warning: Unable to create or detect project. Skipping project fields/attachments." >&2
  fi
}

if [[ "${projects_supported}" == "true" ]]; then
  ensure_project
fi

########################################
# Issues
########################################
issue_body_template() {
  cat <<'BODY'
## Context
Describe the business goal and any background context.

## Checklist
- [ ] Implementation plan documented
- [ ] UI/UX validated (if applicable)
- [ ] Tests or validation steps captured

## Acceptance Criteria
- [ ] Requirements satisfied
- [ ] No regressions introduced

## Relevant Files (if known)
- N/A (no existing files located yet)
BODY
}

# Create issue via gh issue create (no --json; older gh compatibility)
# Parse the created URL to get the issue number.
create_issue_and_get_number() {
  local title="$1"
  local milestone="$2"
  local area_label="$3"
  local priority_label="$4"
  local body="$5"

  local out url number

  out="$(gh issue create \
    --title "$title" \
    --body "$body" \
    --milestone "$milestone" \
    --label "$area_label" \
    --label "$priority_label" \
    --label "type:feature" 2>/dev/null || true)"

  # gh usually prints the URL; grab the last URL-ish token
  url="$(echo "$out" | grep -Eo 'https://github\.com/[^ ]+/issues/[0-9]+' | tail -n1 || true)"
  if [[ -z "${url}" ]]; then
    # Fallback: if output is just a URL on a line
    url="$(echo "$out" | tail -n1 | tr -d '\r' || true)"
  fi

  if [[ "${url}" =~ /issues/([0-9]+)$ ]]; then
    number="${BASH_REMATCH[1]}"
    echo "$number"
    return 0
  fi

  echo ""
  return 0
}

create_or_update_issue() {
  local title="$1"
  local milestone="$2"
  local area_label="$3"
  local priority_label="$4"

  local existing=""
  existing="$(gh issue list \
    --search "in:title \"$title\"" \
    --state all \
    --json number,title \
    -q ".[] | select(.title == \"$title\") | .number" 2>/dev/null || true)"

  if [[ -n "${existing}" ]]; then
    gh issue edit "$existing" \
      --milestone "$milestone" \
      --add-label "$area_label" \
      --add-label "$priority_label" \
      --add-label "type:feature" >/dev/null
    echo "$existing"
    return 0
  fi

  local body issue_number
  body="$(issue_body_template)"
  issue_number="$(create_issue_and_get_number "$title" "$milestone" "$area_label" "$priority_label" "$body")"

  if [[ -z "${issue_number}" ]]; then
    echo "Error: Failed to create issue for title: $title" >&2
    exit 1
  fi

  echo "$issue_number"
}

issues_meta=()     # number<TAB>title<TAB>milestone<TAB>area_label<TAB>priority_label
issue_numbers=()

create_issue_and_store() {
  local title="$1"
  local milestone="$2"
  local area_label="$3"
  local priority_label="$4"

  local issue_number
  issue_number="$(create_or_update_issue "$title" "$milestone" "$area_label" "$priority_label")"
  issues_meta+=("${issue_number}"$'\t'"${title}"$'\t'"${milestone}"$'\t'"${area_label}"$'\t'"${priority_label}")
  issue_numbers+=("$issue_number")
}

create_issue_and_store "ParentDashboard: Add Student button wired to addStudentProfile + UI modal" "Phase 2 Parent + Student Dashboards" "area:parent-dashboard" "priority:p1"
create_issue_and_store "ParentDashboard: Render student cards with real names/grade from student documents" "Phase 2 Parent + Student Dashboards" "area:parent-dashboard" "priority:p1"
create_issue_and_store "StudentDashboard: Handle missing student profile gracefully + setup CTA" "Phase 2 Parent + Student Dashboards" "area:student-dashboard" "priority:p1"

create_issue_and_store "Backend: Node/Express Cloud Run scaffold for assessment chat endpoint" "Phase 3 Learning Style Assessment (Backend + Storage)" "area:backend" "priority:p0"
create_issue_and_store "Vertex AI: Create provider wrapper + env config + basic prompt" "Phase 3 Learning Style Assessment (Backend + Storage)" "area:vertex-ai" "priority:p0"
create_issue_and_store "Firestore: Persist assessment transcript + derived learningStyle on student doc" "Phase 3 Learning Style Assessment (Backend + Storage)" "area:firestore" "priority:p0"
create_issue_and_store "Frontend: Connect LearningStyleChat to backend endpoint + loading/error states" "Phase 3 Learning Style Assessment (Backend + Storage)" "area:assessment" "priority:p1"

create_issue_and_store "CrewAI: Define curriculum generation pipeline inputs/outputs + stub runner" "Phase 4 Curriculum Generation (CrewAI workflow + Parent Approval)" "area:crew-ai" "priority:p1"
create_issue_and_store "Backend: Curriculum generation endpoint + Firestore storage" "Phase 4 Curriculum Generation (CrewAI workflow + Parent Approval)" "area:backend" "priority:p1"
create_issue_and_store "ParentDashboard: Curriculum approval queue UI" "Phase 4 Curriculum Generation (CrewAI workflow + Parent Approval)" "area:parent-dashboard" "priority:p1"

create_issue_and_store "Data model: assignments, submissions, mastery metrics" "Phase 5 Progress Tracking + Insights" "area:backend" "priority:p1"
create_issue_and_store "Student: assignment list + completion" "Phase 5 Progress Tracking + Insights" "area:student-dashboard" "priority:p1"
create_issue_and_store "Parent: progress insights + struggling indicators" "Phase 5 Progress Tracking + Insights" "area:parent-dashboard" "priority:p1"

create_issue_and_store "Netlify: lock node version + build checks" "Phase 6 Deployment + Monitoring Hardening" "area:deployment" "priority:p2"
create_issue_and_store "CI: GitHub Actions build/typecheck" "Phase 6 Deployment + Monitoring Hardening" "area:deployment" "priority:p2"
create_issue_and_store "Logging: structured backend logs + error tracking hooks" "Phase 6 Deployment + Monitoring Hardening" "area:backend" "priority:p2"

########################################
# Add issues to Project V2 (best-effort)
########################################
if [[ "${projects_supported}" == "true" && -n "${project_number}" ]]; then
  echo "Adding issues to project (best-effort)..."
  for meta in "${issues_meta[@]}"; do
    IFS=$'\t' read -r issue_number title milestone area_label priority_label <<<"$meta"
    issue_url="https://github.com/${repo_full_name}/issues/${issue_number}"
    gh project item-add "${project_number}" --owner "$org_name" --url "${issue_url}" >/dev/null 2>&1 || true
  done
fi

cat <<SUMMARY

✅ Roadmap bootstrap complete.

Milestones:
$(printf '%s\n' "${milestones[@]}")

Labels:
$(printf '%s\n' "${labels[@]}")

Project:
Title: ${project_title}
Number: ${project_number:-"(skipped/not created)"}
URL: ${project_url:-"(skipped/not created)"}

Issues (numbers):
$(printf '%s\n' "${issue_numbers[@]}")
SUMMARY
