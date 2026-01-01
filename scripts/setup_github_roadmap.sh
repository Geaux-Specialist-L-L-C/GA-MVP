#!/usr/bin/env bash
set -euo pipefail

print_plan() {
  cat <<'PLAN'
Execution plan:
1) Verify gh auth + repo remote
2) Ensure labels + milestones
3) Create project (if allowed), issues, and attach
PLAN
}

print_plan

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is not installed." >&2
  exit 1
fi

gh auth status

repo_url=$(git remote get-url origin 2>/dev/null || true)
if [[ -z "${repo_url:-}" ]]; then
  echo "Error: git remote 'origin' is not set. Unable to detect repo owner/name." >&2
  exit 1
fi

extract_owner_repo() {
  local url="$1"
  url=${url%.git}
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

if ! repo_full_name=$(extract_owner_repo "$repo_url"); then
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

# ---------------------------
# Labels
# ---------------------------
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

label_exists() {
  local name="$1"
  local found=""
  found=$(gh label list --limit 500 --json name --jq ".[] | select(.name == \"$name\") | .name" | head -n 1 || true)
  [[ -n "$found" ]]
}

ensure_label() {
  local name="$1"
  if label_exists "$name"; then
    return 0
  fi
  gh label create "$name" --color "${label_colors[$name]}" --description "${label_desc[$name]}"
}

echo "Ensuring labels..."
for label in "${labels[@]}"; do
  ensure_label "$label"
done

# ---------------------------
# Milestones
# ---------------------------
milestones=(
  "Phase 1 Foundation"
  "Phase 2 Parent + Student Dashboards"
  "Phase 3 Learning Style Assessment (Backend + Storage)"
  "Phase 4 Curriculum Generation (CrewAI workflow + Parent Approval)"
  "Phase 5 Progress Tracking + Insights"
  "Phase 6 Deployment + Monitoring Hardening"
)

milestone_exists() {
  local title="$1"
  local found=""
  found=$(gh api "repos/$repo_full_name/milestones?state=all&per_page=100" --paginate \
    --jq ".[] | select(.title == \"$title\") | .title" | head -n 1 || true)
  [[ -n "$found" ]]
}

ensure_milestone() {
  local title="$1"
  if milestone_exists "$title"; then
    return 0
  fi
  gh api --method POST "repos/$repo_full_name/milestones" -f title="$title" -f state="open" >/dev/null
}

echo "Ensuring milestones..."
for ms in "${milestones[@]}"; do
  ensure_milestone "$ms"
done

# ---------------------------
# Project (ProjectV2)
# ---------------------------
project_title="GA-MVP Roadmap"
project_id=""
project_url=""

get_org_id() {
  gh api graphql -f query='query($org:String!){organization(login:$org){id}}' -f org="$1" --jq '.data.organization.id'
}

get_project_by_title() {
  gh api graphql -f query='query($org:String!){organization(login:$org){projectsV2(first:100){nodes{id title url}}}}' \
    -f org="$1" --jq ".data.organization.projectsV2.nodes[] | select(.title == \"$project_title\") | [.id, .url] | @tsv"
}

create_project() {
  gh api graphql -f query='mutation($org:ID!, $title:String!){createProjectV2(input:{ownerId:$org, title:$title}){projectV2{id url}}}' \
    -f org="$1" -f title="$project_title" --jq '.data.createProjectV2.projectV2 | [.id, .url] | @tsv'
}

ensure_project_fields() {
  local project="$1"

  local fields_json
  fields_json=$(gh api graphql \
    -f query='query($id:ID!){node(id:$id){... on ProjectV2{fields(first:100){nodes{... on ProjectV2FieldCommon{name id dataType}}}}}}' \
    -f id="$project")

  field_exists() {
    local name="$1"
    echo "$fields_json" | python3 -c '
import json,sys
name=sys.argv[1]
data=json.load(sys.stdin)
fields=data["data"]["node"]["fields"]["nodes"]
print(any((f.get("name")==name) for f in fields))
' "$name"
  }

  create_single_select_field() {
    local name="$1"
    shift
    local options=()
    for opt in "$@"; do
      options+=("{name:\"$opt\"}")
    done
    local opts
    opts="$(IFS=,; echo "${options[*]}")"

    # IMPORTANT: Escape $id in GraphQL so bash doesn't expand it under set -u
    local gql
    gql="mutation(\$id:ID!, \$name:String!){createProjectV2Field(input:{projectId:\$id, name:\$name, dataType:SINGLE_SELECT, singleSelectOptions:[${opts}]}){projectV2Field{id}}}"

    gh api graphql -f query="$gql" -f id="$project" -f name="$name" >/dev/null
  }

  create_text_field() {
    local name="$1"
    gh api graphql \
      -f query='mutation($id:ID!, $name:String!){createProjectV2Field(input:{projectId:$id, name:$name, dataType:TEXT}){projectV2Field{id}}}' \
      -f id="$project" -f name="$name" >/dev/null
  }

  create_date_field() {
    local name="$1"
    gh api graphql \
      -f query='mutation($id:ID!, $name:String!){createProjectV2Field(input:{projectId:$id, name:$name, dataType:DATE}){projectV2Field{id}}}' \
      -f id="$project" -f name="$name" >/dev/null
  }

  if [[ "$(field_exists "Status")" != "True" ]]; then
    create_single_select_field "Status" "Todo" "In Progress" "Blocked" "Done"
  fi
  if [[ "$(field_exists "Priority")" != "True" ]]; then
    create_single_select_field "Priority" "P0" "P1" "P2"
  fi
  if [[ "$(field_exists "Area")" != "True" ]]; then
    create_single_select_field "Area" "Auth" "Parent Dashboard" "Student Dashboard" "Assessment" "Backend" "Vertex AI" "CrewAI" "Firestore" "Deployment" "Docs"
  fi
  if [[ "$(field_exists "Effort")" != "True" ]]; then
    create_single_select_field "Effort" "S" "M" "L"
  fi
  if [[ "$(field_exists "Target Date")" != "True" ]]; then
    create_date_field "Target Date"
  fi
  if [[ "$(field_exists "Sprint")" != "True" ]]; then
    create_text_field "Sprint"
  fi
}

ensure_project_views() {
  local project="$1"
  set +e
  gh api graphql -f query='mutation($id:ID!, $name:String!){createProjectV2View(input:{projectId:$id, name:$name, layout:BOARD}){projectV2View{id}}}' \
    -f id="$project" -f name="Board by Status" >/dev/null
  gh api graphql -f query='mutation($id:ID!, $name:String!){createProjectV2View(input:{projectId:$id, name:$name, layout:TABLE}){projectV2View{id}}}' \
    -f id="$project" -f name="Table by Area" >/dev/null
  set -e
}

echo "Ensuring project..."
org_name=${repo_full_name%%/*}

project_info=$(get_project_by_title "$org_name" || true)
if [[ -n "${project_info:-}" ]]; then
  project_id=$(cut -f1 <<<"$project_info")
  project_url=$(cut -f2 <<<"$project_info")
else
  org_id=$(get_org_id "$org_name")
  if project_info=$(create_project "$org_id" 2>/dev/null); then
    project_id=$(cut -f1 <<<"$project_info")
    project_url=$(cut -f2 <<<"$project_info")
  else
    echo "Warning: Unable to create project. You may not have permissions." >&2
  fi
fi

if [[ -n "${project_id:-}" ]]; then
  ensure_project_fields "$project_id"
  ensure_project_views "$project_id"
fi

# ---------------------------
# Issues
# ---------------------------
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

create_or_update_issue() {
  local title="$1"
  local milestone="$2"
  local labels_csv="$3"
  local priority_label="$4"

  local existing=""
  existing=$(gh issue list --search "in:title \"$title\"" --state all --json number,title --jq ".[] | select(.title == \"$title\") | .number" | head -n 1 || true)

  if [[ -n "${existing:-}" ]]; then
    gh issue edit "$existing" --milestone "$milestone" --add-label "$labels_csv" --add-label "$priority_label" >/dev/null
    echo "$existing"
    return 0
  fi

  local body
  body=$(issue_body_template)
  gh issue create \
    --title "$title" \
    --body "$body" \
    --milestone "$milestone" \
    --label "$labels_csv" \
    --label "$priority_label" \
    --label "type:feature" \
    --json number --jq '.number'
}

issues=()

create_issue_and_store() {
  local title="$1"
  local milestone="$2"
  local area_label="$3"
  local priority="$4"

  local labels="$area_label"
  local issue_number
  issue_number=$(create_or_update_issue "$title" "$milestone" "$labels" "$priority")
  issues+=("$issue_number:$title:$milestone:$area_label:$priority")
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

# ---------------------------
# Add issues to ProjectV2 (if available)
# ---------------------------
if [[ -n "${project_id:-}" ]]; then
  echo "Adding issues to project..."

  fields_json=$(gh api graphql \
    -f query='query($id:ID!){node(id:$id){... on ProjectV2{fields(first:100){nodes{... on ProjectV2FieldCommon{name id dataType}}}}}}' \
    -f id="$project_id")

  field_id() {
    local name="$1"
    echo "$fields_json" | python3 -c '
import json,sys
name=sys.argv[1]
data=json.load(sys.stdin)
fields=data["data"]["node"]["fields"]["nodes"]
print(next((f.get("id","") for f in fields if f.get("name")==name), ""))
' "$name"
  }

  status_field=$(field_id "Status")
  priority_field=$(field_id "Priority")
  area_field=$(field_id "Area")
  effort_field=$(field_id "Effort")

  get_single_select_option_id() {
    local fid="$1"
    local option_name="$2"
    gh api graphql \
      -f query='query($id:ID!){node(id:$id){... on ProjectV2SingleSelectField{options{id name}}}}' \
      -f id="$fid" --jq ".data.node.options[] | select(.name==\"$option_name\") | .id" | head -n 1
  }

  status_todo=$(get_single_select_option_id "$status_field" "Todo")

  repo_name="${repo_full_name##*/}"

  for issue_entry in "${issues[@]}"; do
    IFS=':' read -r issue_number title milestone area_label priority_label <<<"$issue_entry"

    issue_node_id=$(gh api graphql \
      -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){issue(number:$number){id}}}' \
      -f owner="$org_name" -f repo="$repo_name" -f number="$issue_number" --jq '.data.repository.issue.id')

    item_id=$(gh api graphql \
      -f query='mutation($project:ID!,$content:ID!){addProjectV2ItemById(input:{projectId:$project, contentId:$content}){item{id}}}' \
      -f project="$project_id" -f content="$issue_node_id" --jq '.data.addProjectV2ItemById.item.id')

    gh api graphql \
      -f query='mutation($project:ID!,$item:ID!,$field:ID!,$value:String!){updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$value}}){projectV2Item{id}}}' \
      -f project="$project_id" -f item="$item_id" -f field="$status_field" -f value="$status_todo" >/dev/null

    case "$priority_label" in
      priority:p0) priority_value="P0" ;;
      priority:p1) priority_value="P1" ;;
      *) priority_value="P2" ;;
    esac

    priority_option=$(get_single_select_option_id "$priority_field" "$priority_value")
    if [[ -n "${priority_option:-}" ]]; then
      gh api graphql \
        -f query='mutation($project:ID!,$item:ID!,$field:ID!,$value:String!){updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$value}}){projectV2Item{id}}}' \
        -f project="$project_id" -f item="$item_id" -f field="$priority_field" -f value="$priority_option" >/dev/null
    fi

    area_value="${area_label#area:}"
    area_value=${area_value//-/ }
    area_value=$(python3 - <<PY
import string
val = "$area_value"
print(string.capwords(val))
PY
)

    area_option=$(get_single_select_option_id "$area_field" "$area_value")
    if [[ -n "${area_option:-}" ]]; then
      gh api graphql \
        -f query='mutation($project:ID!,$item:ID!,$field:ID!,$value:String!){updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$value}}){projectV2Item{id}}}' \
        -f project="$project_id" -f item="$item_id" -f field="$area_field" -f value="$area_option" >/dev/null
    fi

    effort_option=$(get_single_select_option_id "$effort_field" "M")
    if [[ -n "${effort_option:-}" ]]; then
      gh api graphql \
        -f query='mutation($project:ID!,$item:ID!,$field:ID!,$value:String!){updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$value}}){projectV2Item{id}}}' \
        -f project="$project_id" -f item="$item_id" -f field="$effort_field" -f value="$effort_option" >/dev/null
    fi
  done
fi

cat <<SUMMARY

Milestones:
$(printf '%s\n' "${milestones[@]}")

Labels:
$(printf '%s\n' "${labels[@]}")

Project URL:
${project_url:-"(not created)"}

Issues:
$(printf '%s\n' "${issues[@]}")
SUMMARY
