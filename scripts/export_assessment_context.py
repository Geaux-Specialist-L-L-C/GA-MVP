#!/usr/bin/env python3
"""
Export the most relevant GA-MVP frontend code (Parent -> Student -> Assessment -> Backend wiring)
into a single .txt file for review.

Usage (from repo root):
  python3 scripts/export_assessment_context.py
  python3 scripts/export_assessment_context.py --root . --out-dir ./exports
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, List, Set


@dataclass(frozen=True)
class ExportPlan:
    # Ordered “must have” files (highest signal for the dashboard + assessment work)
    priority_files: List[str]
    # Glob patterns to include (used to catch related files without dumping all of src/)
    include_globs: List[str]
    # Tree filter directories (for a readable listing at top)
    tree_dirs: List[str]


PLAN = ExportPlan(
    priority_files=[
        # App + routing/auth gate
        "src/App.tsx",
        "src/main.tsx",
        "src/index.tsx",
        "src/components/PrivateRoute.tsx",
        "src/components/auth/AuthRoute.tsx",
        "src/components/auth/LoginForm.tsx",
        "src/components/auth/SignUp.tsx",

        # Contexts
        "src/contexts/AuthContext.tsx",
        "src/contexts/ProfileContext.tsx",

        # Parent dashboard + student creation
        "src/pages/profile/ParentProfile/ParentDashboard.tsx",
        "src/pages/profile/ParentProfile/CreateStudent.tsx",
        "src/pages/profile/ParentProfile/ParentProfile.tsx",
        "src/pages/profile/ParentProfile/ParentProfileForm.tsx",
        "src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx",
        "src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx",
        "src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx",

        # Student dashboard
        "src/pages/profile/StudentProfile/StudentDashboard.tsx",
        "src/pages/profile/StudentProfile/StudentProfile.tsx",
        "src/pages/profile/StudentProfile/StudentProfileForm.tsx",

        # Assessment UI
        "src/components/chat/LearningStyleChat.tsx",
        "src/components/chat/ChatUI.tsx",
        "src/hooks/useVARKAssessment.ts",
        "src/components/VARKAssessment/ChatContainer.tsx",
        "src/components/VARKAssessment/ChatInput.tsx",
        "src/components/VARKAssessment/ChatMessage.tsx",
        "src/components/VARKAssessment/VARKResults.tsx",

        # Services (profile/firestore + old Cheshire/OpenAI hooks to replace with Vertex backend)
        "src/services/profileService.ts",
        "src/services/firestore.ts",
        "src/services/firebaseService.ts",
        "src/services/api.js",
        "src/services/varkService.ts",
        "src/services/cheshireService.ts",
        "src/services/openai.js",

        # Firebase config + auth/messaging utilities
        "src/config/firebase.ts",
        "src/firebase/auth-service.ts",
        "src/firebase/messaging-utils.ts",
        "src/firebase/firebase-messaging-sw.ts",
        "src/firebase/auth-service-worker.ts",

        # Types/models used by the above
        "src/types/auth.ts",
        "src/types/profiles.ts",
        "src/types/student.ts",
        "src/models/Student.ts",
        "src/models/Parent.ts",
        "src/models/Assessment.ts",

        # Common UI pieces used by dashboards
        "src/components/common/LoadingSpinner.tsx",
        "src/components/common/Modal.tsx",
        "src/components/common/Toast.tsx",
        "src/components/common/Button.tsx",
    ],
    include_globs=[
        # Catch additional files that might be referenced by imports
        "src/pages/profile/ParentProfile/**/*.ts",
        "src/pages/profile/ParentProfile/**/*.tsx",
        "src/pages/profile/StudentProfile/**/*.ts",
        "src/pages/profile/StudentProfile/**/*.tsx",
        "src/components/chat/**/*.ts",
        "src/components/chat/**/*.tsx",
        "src/components/VARKAssessment/**/*.ts",
        "src/components/VARKAssessment/**/*.tsx",
        "src/contexts/**/*.ts",
        "src/contexts/**/*.tsx",
        "src/services/**/*.ts",
        "src/services/**/*.tsx",
        "src/services/**/*.js",
        "src/config/**/*.ts",
        "src/config/**/*.tsx",
        "src/firebase/**/*.ts",
        "src/firebase/**/*.tsx",
        "src/types/**/*.ts",
        "src/models/**/*.ts",
        "src/components/common/**/*.ts",
        "src/components/common/**/*.tsx",
    ],
    tree_dirs=[
        "src/pages/profile/ParentProfile",
        "src/pages/profile/StudentProfile",
        "src/components/chat",
        "src/components/VARKAssessment",
        "src/contexts",
        "src/services",
        "src/config",
        "src/firebase",
        "src/types",
        "src/models",
        "src/components/common",
    ],
)


def _read_text(path: Path) -> str:
    # Robust read (handles odd encodings without crashing)
    return path.read_text(encoding="utf-8", errors="replace")


def _write_header(out: Path, lines: List[str]) -> None:
    with out.open("a", encoding="utf-8") as f:
        for line in lines:
            f.write(line + "\n")


def _write_file_block(out: Path, file_path: Path, root: Path) -> None:
    rel = file_path.relative_to(root).as_posix()
    content = _read_text(file_path)

    divider = "=" * 88
    with out.open("a", encoding="utf-8") as f:
        f.write("\n")
        f.write(divider + "\n")
        f.write(f"FILE: {rel}\n")
        f.write(divider + "\n")
        f.write(content)
        if not content.endswith("\n"):
            f.write("\n")


def _gather_files(root: Path, plan: ExportPlan) -> List[Path]:
    found: List[Path] = []
    seen: Set[Path] = set()

    # 1) Add priority files in order
    for rel in plan.priority_files:
        p = root / rel
        if p.is_file():
            rp = p.resolve()
            if rp not in seen:
                found.append(rp)
                seen.add(rp)

    # 2) Add glob-matched files (sorted for stable output), but preserve previously added order
    glob_matches: List[Path] = []
    for pattern in plan.include_globs:
        glob_matches.extend((root / ".").glob(pattern))

    for p in sorted({m.resolve() for m in glob_matches if m.is_file()}, key=lambda x: x.as_posix()):
        if p not in seen:
            found.append(p)
            seen.add(p)

    return found


def _render_filtered_tree(root: Path, plan: ExportPlan) -> List[str]:
    lines: List[str] = []
    for d in plan.tree_dirs:
        base = root / d
        if not base.exists():
            continue
        # Include only files, shallow-ish view, but still useful
        for p in sorted(base.rglob("*"), key=lambda x: x.as_posix()):
            if p.is_file():
                lines.append(f"- {p.relative_to(root).as_posix()}")
    return lines


def main() -> int:
    parser = argparse.ArgumentParser(description="Export GA-MVP dashboard + assessment context to a single .txt file.")
    parser.add_argument("--root", default=".", help="Repo root (default: current directory)")
    parser.add_argument("--out-dir", default="./exports", help="Directory to write export file into")
    parser.add_argument("--out-name", default="", help="Optional output filename (otherwise timestamped)")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_dir = (root / args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_name = args.out_name.strip() or f"ga_mvp_assessment_context_{ts}.txt"
    out_file = out_dir / out_name

    # Start fresh
    out_file.write_text("", encoding="utf-8")

    header = [
        "GA-MVP Assessment Context Export",
        f"Generated: {datetime.now().isoformat()}",
        f"Repo root: {root.as_posix()}",
        "",
        "Focus: Parent -> Add Student -> Student Learning Style Assessment -> Backend (Vertex) wiring",
        "",
        "---- FILTERED TREE (relevant areas) ----",
    ]
    _write_header(out_file, header)
    tree_lines = _render_filtered_tree(root, PLAN)
    _write_header(out_file, tree_lines if tree_lines else ["(No matching directories found under src/ with this plan)"])
    _write_header(out_file, ["", "---- FILE CONTENTS ----"])

    files = _gather_files(root, PLAN)
    if not files:
        _write_header(out_file, ["No files found. Are you running this from the repo root?"])
        print(f"⚠️ Export created but no files matched: {out_file.as_posix()}")
        return 1

    for fp in files:
        # Keep paths readable and stable relative to repo root
        _write_file_block(out_file, fp, root)

    _write_header(out_file, ["", "---- END OF EXPORT ----", ""])
    print(f"✅ Export created: {out_file.as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
