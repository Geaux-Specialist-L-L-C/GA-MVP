# File: /scripts/index_repo.py
# Description: Script to generate and print the repository file tree structure.
# Author: GitHub Copilot
# Created: February 19, 2025

import os

def print_tree(root, prefix=""):
    # List only non-hidden entries
    entries = [entry for entry in os.listdir(root) if not entry.startswith(".")]
    entries.sort()
    for i, entry in enumerate(entries):
        path = os.path.join(root, entry)
        connector = "└── " if i == len(entries) - 1 else "├── "
        print(prefix + connector + entry)
        if os.path.isdir(path):
            extension = "    " if i == len(entries) - 1 else "│   "
            print_tree(path, prefix + extension)

if __name__ == "__main__":
    # Set the root directory to the repository root
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    print("Repository Root:", root_dir)
    print_tree(root_dir)