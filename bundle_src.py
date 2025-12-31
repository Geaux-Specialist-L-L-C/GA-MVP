#!/usr/bin/env python3
"""
bundle_src.py

Outputs everything under ./src into a single UTF-8 text file.

Features:
- Includes file headers with relative path + byte size
- Skips common junk dirs (node_modules, dist, .git, etc.)
- Skips binaries/very large files safely
- Optional include/exclude patterns
- Writes a deterministic, readable bundle you can upload
"""

from __future__ import annotations

import argparse
import fnmatch
import hashlib
import os
from pathlib import Path
from typing import Iterable


DEFAULT_EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".turbo",
    ".vite",
    ".cache",
    "__pycache__",
}

DEFAULT_EXCLUDE_GLOBS = [
    "*.png", "*.jpg", "*.jpeg", "*.gif", "*.bmp", "*.tiff", "*.webp",
    "*.ico", "*.pdf", "*.zip", "*.gz", "*.tar", "*.7z",
    "*.mp4", "*.mov", "*.mp3", "*.wav",
    "*.lock",  # optional: remove if you want lockfiles
]

TEXT_EXT_ALLOWLIST = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".css", ".scss", ".sass", ".less",
    ".html", ".htm",
    ".json", ".yaml", ".yml",
    ".md", ".txt",
    ".env", ".example",
    ".graphql", ".gql",
    ".py", ".sh",
}


def is_probably_binary(data: bytes) -> bool:
    if not data:
        return False
    # If there are NUL bytes, it’s almost certainly binary
    if b"\x00" in data:
        return True
    # Heuristic: lots of non-text bytes early in file
    sample = data[:2048]
    nontext = sum(b < 9 or (13 < b < 32) for b in sample)
    return nontext / max(1, len(sample)) > 0.15


def matches_any_glob(path: str, globs: Iterable[str]) -> bool:
    return any(fnmatch.fnmatch(path, g) for g in globs)


def should_include_file(
    file_path: Path,
    rel_posix: str,
    include_globs: list[str] | None,
    exclude_globs: list[str],
    max_bytes: int,
) -> tuple[bool, str]:
    # Exclude by glob patterns
    if matches_any_glob(rel_posix, exclude_globs) or matches_any_glob(file_path.name, exclude_globs):
        return False, "excluded_by_glob"

    # If include globs provided, file must match at least one
    if include_globs and not (matches_any_glob(rel_posix, include_globs) or matches_any_glob(file_path.name, include_globs)):
        return False, "not_included_by_glob"

    try:
        size = file_path.stat().st_size
    except OSError:
        return False, "stat_failed"

    if size > max_bytes:
        return False, f"too_large>{max_bytes}"

    # If it has a known text extension, allow
    if file_path.suffix.lower() in TEXT_EXT_ALLOWLIST:
        return True, "ok_ext"

    # If no extension, still try (many configs)
    if file_path.suffix == "":
        return True, "ok_no_ext"

    # Otherwise: attempt read + binary check
    return True, "ok_probe"


def iter_files(root: Path, exclude_dirs: set[str]) -> list[Path]:
    files: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune directories
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        for name in filenames:
            files.append(Path(dirpath) / name)
    # deterministic order
    files.sort(key=lambda p: str(p).lower())
    return files


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    ap = argparse.ArgumentParser(description="Bundle ./src into one text file.")
    ap.add_argument("--root", default=".", help="Project root (default: .)")
    ap.add_argument("--src", default="src", help="Source directory relative to root (default: src)")
    ap.add_argument("--out", default="src_bundle.txt", help="Output file path (default: src_bundle.txt)")
    ap.add_argument("--max-bytes", type=int, default=750_000, help="Max bytes per file (default: 750000)")
    ap.add_argument("--include", action="append", help="Include glob (repeatable). If set, only matching files are included.")
    ap.add_argument("--exclude", action="append", help="Exclude glob (repeatable).")
    ap.add_argument("--no-default-excludes", action="store_true", help="Do not apply default exclude globs.")
    ap.add_argument("--no-default-exclude-dirs", action="store_true", help="Do not prune default exclude dirs.")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    src_dir = (root / args.src).resolve()
    out_path = (root / args.out).resolve()

    if not src_dir.exists() or not src_dir.is_dir():
        raise SystemExit(f"src directory not found: {src_dir}")

    exclude_dirs = set() if args.no_default_exclude_dirs else set(DEFAULT_EXCLUDE_DIRS)
    exclude_globs = [] if args.no_default_excludes else list(DEFAULT_EXCLUDE_GLOBS)
    if args.exclude:
        exclude_globs.extend(args.exclude)

    include_globs = args.include if args.include else None

    files = iter_files(src_dir, exclude_dirs)

    included = []
    skipped = []

    with out_path.open("w", encoding="utf-8", newline="\n") as out:
        header = [
            "Geaux Academy SRC Bundle",
            f"Root: {root}",
            f"Src:  {src_dir}",
            f"Generated: {__import__('datetime').datetime.now().isoformat(timespec='seconds')}",
            f"Max bytes per file: {args.max_bytes}",
            "",
        ]
        out.write("\n".join(header))

        for fp in files:
            rel = fp.relative_to(root)
            rel_posix = rel.as_posix()

            ok, reason = should_include_file(fp, rel_posix, include_globs, exclude_globs, args.max_bytes)
            if not ok:
                skipped.append((rel_posix, reason))
                continue

            try:
                data = fp.read_bytes()
            except OSError:
                skipped.append((rel_posix, "read_failed"))
                continue

            if is_probably_binary(data):
                skipped.append((rel_posix, "binary_detected"))
                continue

            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                # fallback: still include as best-effort
                text = data.decode("utf-8", errors="replace")

            included.append(rel_posix)

            out.write("\n" + "=" * 100 + "\n")
            out.write(f"FILE: {rel_posix}\n")
            out.write(f"ABS:  {fp}\n")
            out.write(f"SIZE: {len(data)} bytes\n")
            out.write(f"SHA256: {sha256_hex(data)}\n")
            out.write("=" * 100 + "\n")
            out.write(text)
            if not text.endswith("\n"):
                out.write("\n")

        out.write("\n" + "=" * 100 + "\n")
        out.write(f"Included files: {len(included)}\n")
        out.write(f"Skipped files:  {len(skipped)}\n\n")

        if skipped:
            out.write("Skipped list:\n")
            for path, reason in skipped:
                out.write(f" - {path} ({reason})\n")

    print(f"✅ Wrote bundle: {out_path}")
    print(f"   Included: {len(included)}  Skipped: {len(skipped)}")
    if skipped:
        print("   (Some files skipped due to size/binary/excludes.)")


if __name__ == "__main__":
    main()
