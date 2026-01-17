#!/usr/bin/env python3
"""
Export all files under a given BeeAI orchestration folder into one TXT file,
excluding node_modules (and a few other common junk dirs).

Usage:
  python export_orchestration.py /path/to/GA-MVP/orchestration

Output:
  orchestration_export.txt (in current working directory)
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
from datetime import datetime

EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    ".venv",
    "venv",
    "__pycache__",
    "dist",
    "build",
    ".next",
    ".turbo",
    ".cache",
    "coverage",
}

EXCLUDE_FILES = {
    ".DS_Store",
}

# If you want to restrict file types, add allowed suffixes here (e.g. {".ts", ".js", ".json", ".yaml", ".md"})
ALLOWED_SUFFIXES = None  # None = include all file types


def is_excluded_dir(dir_name: str) -> bool:
    return dir_name in EXCLUDE_DIRS


def is_excluded_file(file_name: str) -> bool:
    return file_name in EXCLUDE_FILES


def should_include_file(path: Path) -> bool:
    if is_excluded_file(path.name):
        return False
    if ALLOWED_SUFFIXES is not None and path.suffix.lower() not in ALLOWED_SUFFIXES:
        return False
    return True


def safe_read_text(path: Path) -> str:
    """
    Read file as text with a few fallbacks. If it's binary or unreadable,
    return a short placeholder.
    """
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return "<UNREADABLE: binary or encoding error>"
    except Exception as e:
        return f"<UNREADABLE: {type(e).__name__}: {e}>"


def export_tree_to_txt(root: Path, out_path: Path) -> int:
    root = root.resolve()
    if not root.exists() or not root.is_dir():
        raise FileNotFoundError(f"Root folder not found or not a directory: {root}")

    files_written = 0
    now = datetime.now().isoformat(timespec="seconds")

    with out_path.open("w", encoding="utf-8") as out:
        out.write("### Geaux Academy BeeAI Orchestration Export\n")
        out.write(f"Root: {root}\n")
        out.write(f"Generated: {now}\n")
        out.write(f"Excluded dirs: {sorted(EXCLUDE_DIRS)}\n")
        out.write("\n---\n\n")

        for dirpath, dirnames, filenames in os.walk(root):
            # Exclude directories in-place so os.walk doesn't descend
            dirnames[:] = [d for d in dirnames if not is_excluded_dir(d)]

            current_dir = Path(dirpath)

            for fname in sorted(filenames):
                fpath = current_dir / fname

                # Skip excluded files
                if not should_include_file(fpath):
                    continue

                # Skip very large files (optional). Uncomment to enforce a max size.
                # max_bytes = 2_000_000  # 2MB
                # if fpath.stat().st_size > max_bytes:
                #     continue

                rel = fpath.relative_to(root).as_posix()
                content = safe_read_text(fpath)

                out.write(f"## FILE: {rel}\n")
                out.write(f"## SIZE: {fpath.stat().st_size} bytes\n")
                out.write("## BEGIN\n")
                out.write(content)
                if not content.endswith("\n"):
                    out.write("\n")
                out.write("## END\n\n")
                out.write("---\n\n")

                files_written += 1

    return files_written


def main() -> None:
    parser = argparse.ArgumentParser(description="Export orchestration folder to a single TXT, excluding node_modules.")
    parser.add_argument("root", type=str, help="Path to orchestration folder (e.g., GA-MVP/orchestration)")
    parser.add_argument(
        "--out",
        type=str,
        default="orchestration_export.txt",
        help="Output txt file path (default: orchestration_export.txt)",
    )
    args = parser.parse_args()

    root = Path(args.root)
    out_path = Path(args.out)

    count = export_tree_to_txt(root, out_path)
    print(f"✅ Export complete: {out_path.resolve()}")
    print(f"Files included: {count}")


if __name__ == "__main__":
    main()
