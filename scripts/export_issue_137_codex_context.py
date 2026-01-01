#!/usr/bin/env python3
"""
export_issue_137_codex_context.py

Purpose:
  Create a surgical, Codex-ready context bundle for GitHub Issue #137:
  "StudentDashboard: Handle missing student profile gracefully + setup CTA"

What it does:
  - Finds and extracts ONLY the most relevant files/sections:
    * src/App.tsx (routes)
    * StudentDashboard.tsx (full file)
    * profileService.ts (getStudentProfile + getStudentsByIds + related)
    * ParentDashboard.tsx (where navigation happens)
    * CreateStudent.tsx (CTA destination + post-create navigation)
    * AuthContext.tsx + Login.tsx (auth/login routing context)
  - Writes a single .txt file you can paste directly into Codex.
  - Also prints the output path.

Run:
  python3 scripts/export_issue_137_codex_context.py
  (or run it from repo root: python3 export_issue_137_codex_context.py)

Output:
  ./issue_137_codex_context.txt
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Optional, Tuple


# -----------------------------
# Helpers
# -----------------------------

@dataclass
class Snippet:
    title: str
    path: Path
    content: str


def find_repo_root(start: Path) -> Path:
    """Walk up until we find a folder containing 'src'."""
    cur = start.resolve()
    for _ in range(10):
        if (cur / "src").is_dir():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    raise FileNotFoundError("Could not locate repo root (folder containing 'src'). Run this from inside the repo.")


def safe_read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except FileNotFoundError:
        return ""
    except Exception as e:
        return f"<<ERROR reading {path}: {e}>>"


def clamp_lines(text: str, max_lines: int = 450) -> str:
    lines = text.splitlines()
    if len(lines) <= max_lines:
        return text
    kept = lines[:max_lines]
    kept.append("")
    kept.append(f"<<TRUNCATED: showing first {max_lines} of {len(lines)} lines>>")
    return "\n".join(kept)


def extract_function_block(ts: str, func_name: str) -> Optional[str]:
    """
    Rough extraction for TS/JS function blocks.
    Matches:
      export const funcName = async (...) => { ... }
      const funcName = (...) => { ... }
      function funcName(...) { ... }
    """
    patterns = [
        rf"(export\s+const\s+{re.escape(func_name)}\s*=\s*async\s*\(.*?\)\s*:\s*.*?\s*=>\s*\{{)",
        rf"(export\s+const\s+{re.escape(func_name)}\s*=\s*\(.*?\)\s*=>\s*\{{)",
        rf"(const\s+{re.escape(func_name)}\s*=\s*async\s*\(.*?\)\s*=>\s*\{{)",
        rf"(const\s+{re.escape(func_name)}\s*=\s*\(.*?\)\s*=>\s*\{{)",
        rf"(function\s+{re.escape(func_name)}\s*\(.*?\)\s*\{{)",
    ]

    start_idx = None
    start_m = None
    for pat in patterns:
        m = re.search(pat, ts, flags=re.DOTALL)
        if m:
            start_idx = m.start(1)
            start_m = m.group(1)
            break
    if start_idx is None:
        return None

    # naive brace matching from first "{"
    brace_pos = ts.find("{", start_idx)
    if brace_pos == -1:
        return None

    depth = 0
    end_pos = None
    for i in range(brace_pos, len(ts)):
        ch = ts[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end_pos = i + 1
                break

    if end_pos is None:
        return None

    return ts[start_idx:end_pos].strip()


def extract_route_relevant_lines(app_tsx: str) -> str:
    """
    Extract only the route-ish lines from App.tsx to keep Codex context lean.
    Looks for common path strings and Route definitions.
    """
    key_terms = [
        "Route", "Routes", "createBrowserRouter", "RouterProvider", "BrowserRouter",
        "student-dashboard", "student", "parent", "create-student", "login", "signup",
        "takeassessment", "take-assessment", "dashboard", "notfound", "*"
    ]
    lines = app_tsx.splitlines()
    out = []
    for idx, line in enumerate(lines, start=1):
        if any(term.lower() in line.lower() for term in key_terms):
            out.append(f"{idx:>4}: {line}")
    if not out:
        return "<<No obvious route lines found in App.tsx>>"
    return "\n".join(out)


def detect_route_paths(app_tsx: str) -> list[str]:
    """
    Try to detect route paths (React Router v6 style).
    """
    paths = set()

    # path="/foo" or path='/foo'
    for m in re.finditer(r'path\s*=\s*["\']([^"\']+)["\']', app_tsx):
        paths.add(m.group(1).strip())

    # { path: "/foo", ... }
    for m in re.finditer(r'path\s*:\s*["\']([^"\']+)["\']', app_tsx):
        paths.add(m.group(1).strip())

    # navigate('/foo')
    for m in re.finditer(r"navigate\(\s*['\"]([^'\"]+)['\"]\s*\)", app_tsx):
        paths.add(m.group(1).strip())

    # common hardcoded strings
    for s in ["student-dashboard", "create-student", "parent-dashboard", "login", "signup"]:
        if s in app_tsx:
            paths.add(f"<<contains:{s}>>")

    return sorted(paths)


def find_first_existing(repo_root: Path, candidates: Iterable[str]) -> Optional[Path]:
    for rel in candidates:
        p = repo_root / rel
        if p.exists():
            return p
    return None


def find_student_dashboard(repo_root: Path) -> Optional[Path]:
    # best guess
    direct = repo_root / "src/pages/profile/StudentProfile/StudentDashboard.tsx"
    if direct.exists():
        return direct

    # fallback search
    hits = list((repo_root / "src").rglob("StudentDashboard.tsx"))
    return hits[0] if hits else None


def find_parent_dashboard(repo_root: Path) -> Optional[Path]:
    direct = repo_root / "src/pages/profile/ParentProfile/ParentDashboard.tsx"
    if direct.exists():
        return direct
    hits = list((repo_root / "src").rglob("ParentDashboard.tsx"))
    return hits[0] if hits else None


def find_create_student(repo_root: Path) -> Optional[Path]:
    direct = repo_root / "src/pages/profile/ParentProfile/CreateStudent.tsx"
    if direct.exists():
        return direct
    hits = list((repo_root / "src").rglob("CreateStudent.tsx"))
    return hits[0] if hits else None


def find_app_tsx(repo_root: Path) -> Optional[Path]:
    p = repo_root / "src/App.tsx"
    if p.exists():
        return p
    hits = list((repo_root / "src").rglob("App.tsx"))
    return hits[0] if hits else None


def find_auth_context(repo_root: Path) -> Optional[Path]:
    p = repo_root / "src/contexts/AuthContext.tsx"
    if p.exists():
        return p
    hits = list((repo_root / "src").rglob("AuthContext.tsx"))
    return hits[0] if hits else None


def find_profile_service(repo_root: Path) -> Optional[Path]:
    p = repo_root / "src/services/profileService.ts"
    if p.exists():
        return p
    hits = list((repo_root / "src").rglob("profileService.ts"))
    return hits[0] if hits else None


def find_login_page(repo_root: Path) -> Optional[Path]:
    p = repo_root / "src/pages/Login.tsx"
    if p.exists():
        return p
    hits = list((repo_root / "src").rglob("Login.tsx"))
    return hits[0] if hits else None


def extract_parent_navigation_bits(parent_dashboard_tsx: str) -> str:
    """
    Pull only the parts that matter for Issue #137:
      - navigate() usage
      - route strings
      - student card click handling
    """
    lines = parent_dashboard_tsx.splitlines()
    keep = []
    keys = ["navigate(", "/student-dashboard", "student-dashboard", "create-student", "handleProfileSwitch", "Student Profiles"]
    for idx, line in enumerate(lines, start=1):
        if any(k.lower() in line.lower() for k in keys):
            keep.append(f"{idx:>4}: {line}")
    return "\n".join(keep) if keep else "<<No navigation-related lines found in ParentDashboard.tsx>>"


def extract_create_student_bits(create_student_tsx: str) -> str:
    lines = create_student_tsx.splitlines()
    keep = []
    keys = ["navigate(", "addStudentProfile", "grade", "student", "parent", "set", "/student-dashboard"]
    for idx, line in enumerate(lines, start=1):
        if any(k.lower() in line.lower() for k in keys):
            keep.append(f"{idx:>4}: {line}")
    return "\n".join(keep) if keep else "<<No navigation/creation-related lines found in CreateStudent.tsx>>"


def make_codex_prompt(paths_detected: list[str], student_dashboard_path: Optional[Path]) -> str:
    sd_path = str(student_dashboard_path) if student_dashboard_path else "src/pages/profile/StudentProfile/StudentDashboard.tsx (expected)"
    route_hint = "\n".join(f"- {p}" for p in paths_detected[:40]) if paths_detected else "- (none detected)"
    return f"""CODEx TASK PROMPT (Issue #137)

You are working in repo: Geaux-Specialist-L-L-C/GA-MVP.

Goal: Fix GitHub issue #137:
"StudentDashboard: Handle missing student profile gracefully + setup CTA"

Key constraints:
- StudentDashboard must NOT crash if:
  - route param studentId is missing/undefined
  - Firestore student doc doesn't exist
  - getStudentProfile throws
- Show clear, friendly setup state with CTAs:
  - Primary: Back to Parent Dashboard (use actual route from App.tsx if available)
  - Secondary: Add Student (ParentDashboard uses navigate('/create-student'), so prefer that)
  - Retry button for transient errors
- Preserve TypeScript correctness and existing styling approach.
- If tests exist in this repo, add a small test for the missing-student scenario (mock getStudentProfile).

Detected route/path hints (from App.tsx scan):
{route_hint}

Primary file to update:
- {sd_path}

Secondary references:
- src/services/profileService.ts (getStudentProfile)
- src/App.tsx (routing)
- ParentDashboard.tsx and CreateStudent.tsx (CTA destinations)

Deliverable:
- Implement robust missing-student handling.
- Provide a short verification checklist in the final response (steps + expected behavior).
"""


# -----------------------------
# Main
# -----------------------------

def main() -> int:
    start = Path.cwd()
    repo_root = find_repo_root(start)

    # Locate files
    app_path = find_app_tsx(repo_root)
    sd_path = find_student_dashboard(repo_root)
    ps_path = find_profile_service(repo_root)
    pd_path = find_parent_dashboard(repo_root)
    cs_path = find_create_student(repo_root)
    auth_path = find_auth_context(repo_root)
    login_path = find_login_page(repo_root)

    snippets: list[Snippet] = []

    # App.tsx (routes)
    if app_path:
        app_text = safe_read_text(app_path)
        route_lines = extract_route_relevant_lines(app_text)
        paths = detect_route_paths(app_text)
        snippets.append(Snippet(
            title="App.tsx (route-related lines only)",
            path=app_path,
            content=route_lines
        ))
    else:
        paths = []
        snippets.append(Snippet(
            title="App.tsx (MISSING)",
            path=repo_root / "src/App.tsx",
            content="<<App.tsx not found. Codex should locate routes in your router entry file.>>"
        ))

    # StudentDashboard.tsx (full)
    if sd_path:
        sd_text = safe_read_text(sd_path)
        snippets.append(Snippet(
            title="StudentDashboard.tsx (full file)",
            path=sd_path,
            content=clamp_lines(sd_text, max_lines=650)
        ))
    else:
        snippets.append(Snippet(
            title="StudentDashboard.tsx (MISSING)",
            path=repo_root / "src/pages/profile/StudentProfile/StudentDashboard.tsx",
            content="<<StudentDashboard.tsx not found. Search under src/pages/**/StudentDashboard.tsx>>"
        ))

    # profileService.ts (only the relevant functions)
    if ps_path:
        ps_text = safe_read_text(ps_path)
        blocks = []
        for fn in ["getStudentProfile", "getStudentsByIds", "invalidateStudentCache", "invalidateProfileCache"]:
            b = extract_function_block(ps_text, fn)
            if b:
                blocks.append(f"// ---- {fn} ----\n{b}\n")
        if not blocks:
            blocks.append("<<Could not extract getStudentProfile/getStudentsByIds blocks. Including first 220 lines instead.>>\n")
            blocks.append("\n".join(ps_text.splitlines()[:220]))

        snippets.append(Snippet(
            title="profileService.ts (extracted relevant functions)",
            path=ps_path,
            content="\n".join(blocks).strip()
        ))
    else:
        snippets.append(Snippet(
            title="profileService.ts (MISSING)",
            path=repo_root / "src/services/profileService.ts",
            content="<<profileService.ts not found. StudentDashboard likely calls getStudentProfile somewhere else.>>"
        ))

    # ParentDashboard.tsx (navigation bits)
    if pd_path:
        pd_text = safe_read_text(pd_path)
        snippets.append(Snippet(
            title="ParentDashboard.tsx (navigation + route usage excerpts)",
            path=pd_path,
            content=extract_parent_navigation_bits(pd_text)
        ))

    # CreateStudent.tsx (creation + navigation bits)
    if cs_path:
        cs_text = safe_read_text(cs_path)
        snippets.append(Snippet(
            title="CreateStudent.tsx (creation + navigation excerpts)",
            path=cs_path,
            content=extract_create_student_bits(cs_text)
        ))

    # AuthContext.tsx (first ~220 lines is usually enough)
    if auth_path:
        auth_text = safe_read_text(auth_path)
        snippets.append(Snippet(
            title="AuthContext.tsx (top excerpt)",
            path=auth_path,
            content=clamp_lines(auth_text, max_lines=220)
        ))

    # Login.tsx (top excerpt)
    if login_path:
        login_text = safe_read_text(login_path)
        snippets.append(Snippet(
            title="Login.tsx (top excerpt)",
            path=login_path,
            content=clamp_lines(login_text, max_lines=220)
        ))

    # Build output file
    out_path = repo_root / "issue_137_codex_context.txt"

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header = f"""GA-MVP | Issue #137 Codex Context Bundle
Generated: {now}
Repo root: {repo_root}

Intent:
Provide ONLY the most relevant routing + StudentDashboard + profileService context so Codex can implement:
"StudentDashboard: Handle missing student profile gracefully + setup CTA"

===============================================================================
"""

    prompt = make_codex_prompt(paths_detected=paths, student_dashboard_path=sd_path)

    parts = [header, prompt, "\n\n===============================================================================\n"]

    for snip in snippets:
        parts.append(f"\n### {snip.title}\nPATH: {snip.path.relative_to(repo_root) if snip.path.exists() else snip.path}\n")
        parts.append("-" * 79 + "\n")
        parts.append(snip.content.rstrip() + "\n")
        parts.append("\n")

    out_path.write_text("".join(parts), encoding="utf-8")
    print(f"✅ Wrote Codex context bundle: {out_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"❌ Failed: {e}", file=sys.stderr)
        raise
