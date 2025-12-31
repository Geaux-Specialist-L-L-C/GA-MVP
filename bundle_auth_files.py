#!/usr/bin/env python3
"""
bundle_auth_files.py
Collects likely authentication + routing + firebase-related files into ONE text file.

Usage:
  python3 bundle_auth_files.py --root . --out auth_bundle.txt
  python3 bundle_auth_files.py --root . --out auth_bundle.txt --no-redact
  python3 bundle_auth_files.py --root . --out auth_bundle.txt --extra "vite.config.ts" "index.html"

Notes:
- Excludes node_modules, dist, build, .git by default
- Tries to auto-include common auth/router/firebase files
- Redacts common secrets unless --no-redact
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import re
from pathlib import Path
from typing import Iterable, List, Tuple

DEFAULT_EXCLUDE_DIRS = {
    "node_modules", "dist", "build", ".git", ".next", ".turbo", ".vercel",
    ".cache", ".vite", "coverage", "out"
}

# Common files that often matter for auth/routing
CANDIDATE_PATH_HINTS = [
    "src/contexts/AuthContext.tsx",
    "src/contexts/AuthContext.ts",
    "src/context/AuthContext.tsx",
    "src/config/firebase.ts",
    "src/config/firebase.tsx",
    "src/firebase.ts",
    "src/services/firebaseService.ts",
    "src/services/firebaseService.tsx",
    "src/components/PrivateRoute.tsx",
    "src/components/PrivateRoute.ts",
    "src/components/auth/AuthRoute.tsx",
    "src/components/auth/AuthRoute.ts",
    "src/pages/Login.tsx",
    "src/pages/Signup.tsx",
    "src/components/auth/LoginForm.tsx",
    "src/components/auth/SignUp.tsx",
    "src/App.tsx",
    "src/main.tsx",
    "index.html",
    "vite.config.ts",
    "vite.config.js",
    "package.json",
    "scripts/generate-certs.js",
    "scripts/generate-certs.ts",
]

# Regex to detect "auth-ish" files even if paths differ
AUTH_RE = re.compile(
    r"(auth|firebase|firestore|login|signup|sign-in|sign_in|private(route)?|guard|navigate|router|route)",
    re.IGNORECASE
)

# Basic redactions for “oops” safety
REDACTIONS: List[Tuple[re.Pattern, str]] = [
    # .env style
    (re.compile(r"(?im)^(VITE_.*?=).+$"), r"\1<REDACTED>"),
    (re.compile(r"(?im)^(FIREBASE_.*?=).+$"), r"\1<REDACTED>"),
    (re.compile(r"(?im)^(GOOGLE_.*?=).+$"), r"\1<REDACTED>"),
    (re.compile(r"(?im)^(API_?KEY.*?=).+$"), r"\1<REDACTED>"),
    (re.compile(r"(?im)^(SECRET.*?=).+$"), r"\1<REDACTED>"),
    (re.compile(r"(?im)^(TOKEN.*?=).+$"), r"\1<REDACTED>"),

    # JS/TS object keys
    (re.compile(r'(?i)("apiKey"\s*:\s*)".+?"'), r'\1"<REDACTED>"'),
    (re.compile(r"(?i)('apiKey'\s*:\s*)'.+?'"), r"\1'<REDACTED>'"),
    (re.compile(r'(?i)("measurementId"\s*:\s*)".+?"'), r'\1"<REDACTED>"'),
    (re.compile(r'(?i)("messagingSenderId"\s*:\s*)".+?"'), r'\1"<REDACTED>"'),
    (re.compile(r'(?i)("appId"\s*:\s*)".+?"'), r'\1"<REDACTED>"'),
    (re.compile(r'(?i)("vapidKey"\s*:\s*)".+?"'), r'\1"<REDACTED>"'),

    # Generic JWT-ish / long tokens in URLs
    (re.compile(r"(?i)(token=)[A-Za-z0-9_\-\.~%]+"), r"\1<REDACTED>"),
    (re.compile(r"(?i)(Bearer\s+)[A-Za-z0-9_\-\.=]+"), r"\1<REDACTED>"),
]


def should_exclude_dir(path: Path, exclude_dirs: set[str]) -> bool:
    parts = set(path.parts)
    return any(d in parts for d in exclude_dirs)


def is_text_file(path: Path) -> bool:
    # Keep it simple; focus on web source files and config.
    return path.suffix.lower() in {
        ".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".css", ".md", ".txt", ".yml", ".yaml"
    }


def safe_read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"<<FAILED TO READ FILE: {e}>>"


def redact(text: str) -> str:
    out = text
    for pat, rep in REDACTIONS:
        out = pat.sub(rep, out)
    return out


def find_candidates(root: Path, exclude_dirs: set[str]) -> List[Path]:
    candidates: List[Path] = []
    # 1) Include any files explicitly hinted
    for hint in CANDIDATE_PATH_HINTS:
        p = root / hint
        if p.exists() and p.is_file():
            candidates.append(p)

    # 2) Walk src and pick auth-ish files
    src_dir = root / "src"
    if src_dir.exists():
        for p in src_dir.rglob("*"):
            if p.is_dir():
                continue
            if should_exclude_dir(p, exclude_dirs):
                continue
            if not is_text_file(p):
                continue
            rel = str(p.relative_to(root))
            if AUTH_RE.search(rel) or AUTH_RE.search(p.name):
                candidates.append(p)

    # 3) De-dupe while preserving order
    seen = set()
    uniq: List[Path] = []
    for p in candidates:
        rp = p.resolve()
        if rp not in seen:
            seen.add(rp)
            uniq.append(p)
    return uniq


def format_header(path: Path, root: Path) -> str:
    rel = path.relative_to(root)
    stat = path.stat()
    mtime = dt.datetime.fromtimestamp(stat.st_mtime).isoformat(sep=" ", timespec="seconds")
    size = stat.st_size
    return (
        "\n"
        + "=" * 90
        + "\n"
        + f"FILE: {rel}\n"
        + f"ABS:  {path.resolve()}\n"
        + f"MOD:  {mtime}\n"
        + f"SIZE: {size} bytes\n"
        + "=" * 90
        + "\n"
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".", help="Repo root (where package.json lives)")
    ap.add_argument("--out", default="auth_bundle.txt", help="Output text file")
    ap.add_argument("--no-redact", action="store_true", help="Do NOT redact secrets")
    ap.add_argument("--extra", nargs="*", default=[], help="Extra file paths to include (relative to root)")
    ap.add_argument("--exclude-dir", nargs="*", default=[], help="Additional directories to exclude")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    out_path = Path(args.out).resolve()

    exclude_dirs = set(DEFAULT_EXCLUDE_DIRS)
    exclude_dirs.update(args.exclude_dir)

    if not root.exists():
        print(f"Root does not exist: {root}")
        return 2

    # Collect candidates
    files = find_candidates(root, exclude_dirs)

    # Add explicit extras
    for rel in args.extra:
        p = (root / rel).resolve()
        if p.exists() and p.is_file():
            files.append(p)

    # De-dupe again after extras
    seen = set()
    uniq: List[Path] = []
    for p in files:
        rp = p.resolve()
        if rp not in seen:
            seen.add(rp)
            uniq.append(p)

    # Write bundle
    lines: List[str] = []
    lines.append("Geaux Academy Auth Bundle\n")
    lines.append(f"Generated: {dt.datetime.now().isoformat(sep=' ', timespec='seconds')}\n")
    lines.append(f"Root: {root}\n")
    lines.append(f"Included files: {len(uniq)}\n")

    # Quick index
    lines.append("\nIncluded file list:\n")
    for p in uniq:
        try:
            rel = p.relative_to(root)
        except Exception:
            rel = p
        lines.append(f" - {rel}\n")

    for p in uniq:
        try:
            rel = p.relative_to(root)
        except Exception:
            rel = p
        content = safe_read(p)
        if not args.no_redact:
            content = redact(content)
        lines.append(format_header(p, root))
        lines.append(content)
        if not content.endswith("\n"):
            lines.append("\n")

    out_path.write_text("".join(lines), encoding="utf-8", errors="replace")
    print(f"✅ Wrote: {out_path}")
    print(f"   Files included: {len(uniq)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
