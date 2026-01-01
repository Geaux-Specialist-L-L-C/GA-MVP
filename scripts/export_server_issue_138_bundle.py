#!/usr/bin/env python3
"""
Export selected /server scaffold files into one text bundle for review.

Usage (from repo root):
  python3 scripts/export_server_issue_138_bundle.py

Optional:
  python3 scripts/export_server_issue_138_bundle.py --repo-root . --out export_issue_138_server_bundle.txt
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
from pathlib import Path
from typing import List, Tuple


FILES: List[str] = [
    "server/.env.example",
    "server/Dockerfile",
    "server/README.md",
    "server/package.json",
    "server/src/__tests__/app.test.ts",
    "server/src/app.ts",
    "server/src/index.ts",
    "server/src/middleware/auth.ts",
    "server/src/routes/assessment.ts",
    "server/src/services/firestore.ts",
    "server/src/services/vertex.ts",
    "server/src/types.ts",
    "server/tsconfig.json",
    "server/vitest.config.ts",
]


def read_text_file(path: Path) -> Tuple[bool, str]:
    """
    Returns (ok, content_or_error).
    Tries UTF-8 first, then falls back to latin-1 to avoid crashing.
    """
    if not path.exists():
        return False, f"[MISSING] File not found: {path}"

    if path.is_dir():
        return False, f"[SKIP] Path is a directory, expected file: {path}"

    try:
        data = path.read_bytes()
    except Exception as e:
        return False, f"[ERROR] Could not read bytes: {path}\n{e}"

    # Guard against accidentally bundling huge binaries (shouldn't happen in this list)
    # If you want to remove this safety, delete this block.
    max_bytes = 2_000_000  # 2MB per file
    if len(data) > max_bytes:
        return False, f"[SKIP] File too large ({len(data)} bytes): {path}"

    # Try UTF-8 decode, then latin-1 fallback.
    try:
        return True, data.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return True, data.decode("latin-1")
        except Exception as e:
            return False, f"[ERROR] Could not decode text: {path}\n{e}"


def build_bundle(repo_root: Path, out_path: Path) -> None:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    repo_root = repo_root.resolve()

    lines: List[str] = []
    lines.append("GA-MVP | Issue #138 Server Scaffold Bundle")
    lines.append(f"Generated: {now}")
    lines.append(f"Repo root: {repo_root}")
    lines.append("")
    lines.append("Files included:")
    for f in FILES:
        lines.append(f"- {f}")
    lines.append("")
    lines.append("=" * 79)
    lines.append("")

    included = 0
    skipped = 0

    for rel in FILES:
        abs_path = repo_root / rel
        ok, content = read_text_file(abs_path)

        lines.append(f"### {rel}")
        lines.append(f"PATH: {abs_path}")
        lines.append("-" * 79)

        if ok:
            included += 1
            # Normalize line endings for bundle readability
            content = content.replace("\r\n", "\n").replace("\r", "\n")
            lines.append(content.rstrip("\n"))
            lines.append("")  # spacer newline
        else:
            skipped += 1
            lines.append(content)
            lines.append("")

        lines.append("=" * 79)
        lines.append("")

    lines.append("Summary:")
    lines.append(f"- Included: {included}")
    lines.append(f"- Skipped/Missing/Errors: {skipped}")
    lines.append("")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Export Issue #138 /server files into a single .txt bundle.")
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Path to repository root (default: current directory).",
    )
    parser.add_argument(
        "--out",
        default="export_issue_138_server_bundle.txt",
        help="Output bundle filename/path (default: export_issue_138_server_bundle.txt).",
    )
    args = parser.parse_args()

    repo_root = Path(args.repo_root)
    out_path = Path(args.out)

    build_bundle(repo_root=repo_root, out_path=out_path)
    print(f"✅ Bundle written to: {out_path.resolve()}")


if __name__ == "__main__":
    main()
