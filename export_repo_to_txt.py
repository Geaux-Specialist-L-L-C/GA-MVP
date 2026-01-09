#!/usr/bin/env python3
"""
export_repo_to_txt.py

Exports selected repository file contents into a single text file for review.

Default = targeted export for Geaux Academy assessment + BeeAI integration
Optional = full export (still excludes node_modules/dist/.git and binaries)

Usage:
  python3 export_repo_to_txt.py
  python3 export_repo_to_txt.py --mode targeted
  python3 export_repo_to_txt.py --mode full
  python3 export_repo_to_txt.py --out GA_MVP_export.txt
  python3 export_repo_to_txt.py --max-kb 400
"""

from __future__ import annotations

import argparse
import os
import sys
import time
from pathlib import Path
from typing import Iterable, List, Tuple


# Folders to always skip (fast + avoids junk)
SKIP_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".turbo",
    ".vercel",
    ".firebase",
    ".cache",
    "coverage",
    "__pycache__",
    ".pytest_cache",
    ".idea",
    ".vscode",
    "tmp",
    "temp",
    "venv",
    ".venv",
}

# File extensions to skip (binary / huge / not useful)
SKIP_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp",
    ".ico", ".pdf", ".zip", ".gz", ".tar", ".7z",
    ".mp3", ".mp4", ".wav", ".mov",
    ".woff", ".woff2", ".ttf", ".eot",
    ".exe", ".dll", ".so", ".dylib",
    ".map",  # can be huge, usually not helpful
}

# File basenames to skip
SKIP_NAMES = {
    "package-lock.json",  # can be massive; include if you want
    "pnpm-lock.yaml",
    "yarn.lock",
}

# Targeted paths (high signal for your current work)
TARGETED_PATH_PREFIXES = [
    "server/src/",
    "server/README.md",
    "server/package.json",
    "server/Dockerfile",
    "server/.env.example",
    "orchestration/src/",
    "src/components/chat/",
    "src/components/VARKAssessment/",
    "src/hooks/useVARKAssessment.ts",
    "src/services/assessmentService.ts",
    "src/services/varkService.ts",
    "src/pages/TakeAssessment.tsx",
    "src/pages/profile/StudentProfile/StudentDashboard.tsx",
    "src/pages/profile/components/LearningStyleInsights.tsx",
]

# Common text-like extensions to include
INCLUDE_EXTS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".json", ".md", ".yml", ".yaml",
    ".css", ".scss",
    ".html",
    ".py",
    ".env", ".example",
    ".txt",
}


def is_probably_binary(data: bytes) -> bool:
    # Heuristic: presence of null byte suggests binary.
    return b"\x00" in data


def should_skip_path(path: Path) -> bool:
    name = path.name
    if name in SKIP_NAMES:
        return True
    if path.suffix.lower() in SKIP_EXTS:
        return True
    return False


def path_is_in_targeted_set(rel_posix: str) -> bool:
    return any(rel_posix.startswith(prefix) for prefix in TARGETED_PATH_PREFIXES)


def iter_files(repo_root: Path, mode: str) -> Iterable[Path]:
    for root, dirs, files in os.walk(repo_root):
        # prune dirs in-place
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        root_path = Path(root)
        for fname in files:
            fpath = root_path / fname
            rel = fpath.relative_to(repo_root).as_posix()

            # targeted mode: only include listed prefixes
            if mode == "targeted" and not path_is_in_targeted_set(rel):
                continue

            if should_skip_path(fpath):
                continue

            # Only include likely text files, unless targeted explicitly
            if mode == "full":
                # In full mode, allow more, but still avoid unknown binaries
                pass
            else:
                # targeted mode: include anything under targeted prefixes, but still skip obvious binaries above
                pass

            # If extension is known text, include; if no extension, include cautiously
            if fpath.suffix.lower() not in INCLUDE_EXTS and fpath.suffix != "":
                # unknown extension: skip in targeted mode unless explicitly in targeted prefixes
                if mode == "full":
                    # still allow in full mode if small and readable
                    pass
                else:
                    continue

            yield fpath


def read_text_safely(path: Path, max_kb: int) -> Tuple[str, str]:
    """
    Returns (status, content_or_reason)
    status: "ok" | "skipped"
    """
    try:
        size = path.stat().st_size
    except OSError as e:
        return ("skipped", f"Could not stat file: {e}")

    if size > max_kb * 1024:
        return ("skipped", f"File too large ({size/1024:.1f} KB) > max {max_kb} KB")

    try:
        data = path.read_bytes()
    except OSError as e:
        return ("skipped", f"Could not read file: {e}")

    if is_probably_binary(data):
        return ("skipped", "Binary file (null byte detected)")

    # Try utf-8 first, fallback to latin-1 to preserve as much as possible
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = data.decode("latin-1")
        except Exception as e:
            return ("skipped", f"Decode failed: {e}")

    return ("ok", text)


def write_export(repo_root: Path, out_path: Path, mode: str, max_kb: int) -> None:
    started = time.strftime("%Y-%m-%d %H:%M:%S")
    files = sorted(set(iter_files(repo_root, mode)), key=lambda p: p.as_posix())

    included = 0
    skipped = 0

    with out_path.open("w", encoding="utf-8") as out:
        out.write(f"GEAUX ACADEMY REPO EXPORT\n")
        out.write(f"Repo root: {repo_root.resolve()}\n")
        out.write(f"Mode: {mode}\n")
        out.write(f"Max file size: {max_kb} KB\n")
        out.write(f"Generated: {started}\n")
        out.write("=" * 80 + "\n\n")

        for fpath in files:
            rel = fpath.relative_to(repo_root).as_posix()
            status, content = read_text_safely(fpath, max_kb=max_kb)

            out.write("\n" + "#" * 80 + "\n")
            out.write(f"# FILE: {rel}\n")
            try:
                out.write(f"# SIZE: {fpath.stat().st_size} bytes\n")
            except OSError:
                out.write(f"# SIZE: (unknown)\n")
            out.write("#" * 80 + "\n\n")

            if status == "ok":
                out.write(content)
                if not content.endswith("\n"):
                    out.write("\n")
                included += 1
            else:
                out.write(f"<<SKIPPED>> {content}\n")
                skipped += 1

        out.write("\n" + "=" * 80 + "\n")
        out.write(f"SUMMARY: included={included}, skipped={skipped}, total={len(files)}\n")

    print(f"[ok] Wrote export: {out_path} (included={included}, skipped={skipped}, total={len(files)})")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["targeted", "full"], default="targeted",
                        help="targeted exports assessment + BeeAI + VARK-related files; full exports most text files.")
    parser.add_argument("--out", default="GA_MVP_repo_export.txt",
                        help="Output text file name")
    parser.add_argument("--max-kb", type=int, default=300,
                        help="Skip files larger than this (KB). Increase if needed.")
    args = parser.parse_args()

    repo_root = Path.cwd()
    out_path = repo_root / args.out

    write_export(repo_root=repo_root, out_path=out_path, mode=args.mode, max_kb=args.max_kb)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
