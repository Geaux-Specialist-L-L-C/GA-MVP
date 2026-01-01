#!/usr/bin/env python3
"""
GA-MVP Codex Context Exporter (Issue #138)
Collect the most relevant repo files for:
"Backend: Node/Express Cloud Run scaffold for assessment chat endpoint"

Usage:
  python3 scripts/export_codex_context_issue_138.py
  python3 scripts/export_codex_context_issue_138.py --out issue_138_context.txt --max-files 30 --max-lines 260
"""

from __future__ import annotations

import argparse
import os
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from string import Template
from typing import Iterable, List, Tuple


DEFAULT_KEYWORDS = [
    # Node/Express + HTTP
    "express", "app.get", "app.post", "router", "req,", "res.", "cors", "helmet",
    "bodyparser", "json(", "listen(", "http", "https", "fetch(", "axios", "supertest",

    # API naming + endpoints
    "api", "/api", "endpoint", "route", "routes", "controller", "middleware",

    # assessment/chat/vark
    "assessment", "vark", "learning style", "learning-style", "chat", "messages",
    "prompt", "completion", "stream", "sse", "websocket",

    # OpenAI/Vertex/Google Cloud
    "openai", "vertex", "vertexai", "gemini", "google", "gcp", "cloud run", "cloudrun",
    "run.googleapis.com", "service account", "iam", "adc", "application default credentials",

    # Deployment / container
    "dockerfile", "cloudbuild", "buildpacks", "artifact registry", "gcloud", "deploy",
    "port", "process.env", "dotenv", ".env", "runtime",
]

PIN_PATH_HINTS = [
    "package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
    "tsconfig.json",
    "server", "routes", "services", "api",
    "openai", "vertex", "gemini",
    "vark", "assessment",
    "firebase", "config",
    "dockerfile", "cloudbuild", "app.yaml", "readme", "development", ".github/workflows",
]

ALLOWED_EXT = {
    ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
    ".json", ".yml", ".yaml",
    ".md", ".txt",
    ".py",
    ".env", ".example",
    "",  # for Dockerfile (no extension)
}

EXCLUDE_DIRS = {
    "node_modules", ".git", "dist", "build", ".next", ".cache", ".turbo",
    "coverage", ".venv", "venv", "__pycache__", ".pytest_cache",
}

MAX_BYTES_PER_FILE = 220_000


@dataclass
class ScoredFile:
    path: Path
    score: int
    reasons: List[str]


def run_git(cmd: List[str], cwd: Path) -> str:
    try:
        out = subprocess.check_output(cmd, cwd=str(cwd), stderr=subprocess.DEVNULL)
        return out.decode("utf-8", errors="replace").strip()
    except Exception:
        return ""


def detect_repo_root(start: Path) -> Path:
    root = run_git(["git", "rev-parse", "--show-toplevel"], start)
    return Path(root) if root else start.resolve()


def is_allowed_file(p: Path) -> bool:
    if p.is_dir():
        return False
    if any(part in EXCLUDE_DIRS for part in p.parts):
        return False

    name = p.name
    ext = p.suffix.lower()

    if name == "Dockerfile" or name.startswith("Dockerfile."):
        return True
    if name in {"cloudbuild.yaml", "cloudbuild.yml", "app.yaml", "app.yml"}:
        return True
    if name.startswith(".env"):
        return True
    if ext in ALLOWED_EXT:
        return True
    return False


def read_text_safely(p: Path) -> str:
    try:
        data = p.read_bytes()
        if len(data) > MAX_BYTES_PER_FILE:
            data = data[:MAX_BYTES_PER_FILE]
        return data.decode("utf-8", errors="replace")
    except Exception:
        return ""


def score_file(p: Path, text: str, keywords: List[str]) -> ScoredFile:
    score = 0
    reasons: List[str] = []
    low = text.lower()
    sp = str(p).lower()

    hit_count = 0
    for kw in keywords:
        k = kw.lower()
        if k in low:
            weight = 3 if (" " in k or "/" in k) else 2
            if k in {"express", "cloud run", "cloudrun", "vertex", "vertexai", "gemini"}:
                weight += 3
            score += weight
            hit_count += 1

    if hit_count:
        reasons.append(f"keyword_hits={hit_count}")

    for hint in PIN_PATH_HINTS:
        if hint.lower() in sp:
            score += 6
            reasons.append(f"path_hint:{hint}")
            break

    if p.name in {"package.json", "Dockerfile", "cloudbuild.yaml", "cloudbuild.yml"}:
        score += 25
        reasons.append("pinned_core_file")

    if ("routes" in sp) or ("server" in sp):
        score += 8
        reasons.append("server_or_routes")

    if "services" in sp and any(x in low for x in ["openai", "vertex", "chat", "assessment", "gemini"]):
        score += 10
        reasons.append("service_with_ai_or_chat")

    return ScoredFile(path=p, score=score, reasons=reasons)


def iter_files(root: Path) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fn in filenames:
            p = Path(dirpath) / fn
            if is_allowed_file(p):
                yield p


def add_line_numbers(s: str) -> str:
    lines = s.splitlines()
    width = len(str(len(lines))) or 1
    return "\n".join(f"{str(i+1).rjust(width)}: {line}" for i, line in enumerate(lines))


def truncate_lines(s: str, max_lines: int) -> Tuple[str, bool]:
    lines = s.splitlines()
    if len(lines) <= max_lines:
        return s, False
    return "\n".join(lines[:max_lines]) + "\n\n<<TRUNCATED>>", True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="issue_138_codex_context.txt")
    ap.add_argument("--max-files", type=int, default=28)
    ap.add_argument("--max-lines", type=int, default=260)
    ap.add_argument("--root", default=".")
    ap.add_argument("--extra-keyword", action="append", default=[])
    args = ap.parse_args()

    start = Path(args.root).resolve()
    repo_root = detect_repo_root(start)

    keywords = DEFAULT_KEYWORDS + [k for k in args.extra_keyword if k.strip()]
    keywords = list(dict.fromkeys(keywords))

    scored: List[ScoredFile] = []
    for p in iter_files(repo_root):
        text = read_text_safely(p)
        if not text:
            continue
        scored.append(score_file(p, text, keywords))

    scored.sort(key=lambda x: (-x.score, str(x.path)))

    pinned = []
    for pin in ["package.json", "Dockerfile", "cloudbuild.yaml", "cloudbuild.yml", "app.yaml", "app.yml"]:
        candidate = repo_root / pin
        if candidate.exists() and is_allowed_file(candidate):
            pinned.append(candidate)

    selected_paths: List[Path] = []
    for p in pinned:
        if p not in selected_paths:
            selected_paths.append(p)

    for sf in scored:
        if len(selected_paths) >= args.max_files:
            break
        if sf.score <= 0:
            continue
        if sf.path not in selected_paths:
            selected_paths.append(sf.path)

    out_path = (repo_root / args.out).resolve()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    header_tpl = Template(
        """GA-MVP | Issue #138 Codex Context Bundle
Generated: $now
Repo root: $repo_root

Intent:
Provide ONLY the most relevant backend + deployment context so Codex can implement:
"Backend: Node/Express Cloud Run scaffold for assessment chat endpoint"

===============================================================================
CODEx TASK PROMPT (Issue #138)

You are working in repo: Geaux-Specialist-L-L-C/GA-MVP.

Goal: Fix GitHub issue #138:
"Backend: Node/Express Cloud Run scaffold for assessment chat endpoint"

What to build (target):
- Add a minimal Node/Express backend scaffold suitable for Cloud Run deployment:
  - Express app with health route: GET /healthz -> 200 OK
  - Assessment chat route (non-streaming is fine first): POST /api/assessment/chat
    - Accept JSON body example:
      {"studentId":"abc123","messages":[{"role":"user","content":"Hi"}],"metadata":{}}
    - Return JSON example:
      {"reply":"...","raw":{}}
- Use env-based PORT (Cloud Run expects process.env.PORT)
- CORS enabled for local dev (Vite) and configurable allowed origins
- Add local dev instructions + Cloud Run deploy notes (Dockerfile or buildpacks)
- Prefer Vertex AI (Gemini) as the model provider if wrappers exist; otherwise stub provider cleanly.

Constraints:
- Keep changes surgical, don’t break frontend.
- Provide a quick verification checklist at the end.

Selected files below are the most relevant context from the repo.

===============================================================================

"""
    )

    with out_path.open("w", encoding="utf-8") as f:
        f.write(header_tpl.substitute(now=now, repo_root=str(repo_root)))

        f.write("FILES INCLUDED (ordered):\n")
        for i, p in enumerate(selected_paths, start=1):
            rel = p.relative_to(repo_root)
            sf = next((x for x in scored if x.path == p), None)
            reason = ""
            if sf:
                reason = f" (score={sf.score}; {', '.join(sf.reasons)})"
            f.write(f"{i:02d}) {rel}{reason}\n")
        f.write("\n===============================================================================\n\n")

        for p in selected_paths:
            rel = p.relative_to(repo_root)
            raw = read_text_safely(p)
            numbered = add_line_numbers(raw)
            truncated, _ = truncate_lines(numbered, args.max_lines)

            f.write(f"### {rel}\nPATH: {rel}\n-------------------------------------------------------------------------------\n")
            f.write(truncated)
            f.write("\n\n")

    print(f"✅ Wrote Codex context bundle to: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
