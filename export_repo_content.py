#!/usr/bin/env python3
# File: /home/wicked/geauxai/GA-MVP/scripts/export_repo_content.py
# Description: Exports all relevant repository text to a single Markdown file.
# Author: [Your Name]
# Created: [2025-02-20]

import os
from pathlib import Path
import datetime

def should_include(path):
    """Check if the file is relevant to the repository."""
    relevant_extensions = {
        '.tsx', '.ts', '.jsx', '.js', '.css', '.scss',
        '.json', '.md', '.html', '.env', '.eslintrc',
        '.prettierrc', '.babelrc', '.config.js', '.yml', '.txt'
    }
    
    relevant_paths = {
        'src', 'public', 'components', 'pages',
        'hooks', 'contexts', 'services', 'utils',
        'styles', 'theme', 'types', 'config',
        '.github', 'firebase', 'backend', 'supabase', 'Artifacts'
    }
    
    path_str = str(path)
    
    if any(f'/{d}/' in path_str for d in relevant_paths):
        return True
        
    return Path(path).suffix.lower() in relevant_extensions

def should_ignore(path):
    """Check if the path should be ignored."""
    ignore_dirs = {
        '.git',
        'node_modules',
        '__pycache__',
        '.pytest_cache',
        'dist',
        'build',
        '.next',
        'venv',
        '.venv',
        'backend',
        'docs',
        'scripts'
    }
    
    path_str = str(path)
    return any(f'/{d}/' in path_str or path_str.endswith(f'/{d}') for d in ignore_dirs)

def get_file_language(file_path):
    """Determine the language based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    language_map = {
        '.js': 'javascript',
        '.jsx': 'jsx',
        '.ts': 'typescript',
        '.tsx': 'tsx',
        '.css': 'css',
        '.scss': 'scss',
        '.json': 'json',
        '.html': 'html',
        '.md': 'markdown',
        '.env': 'plaintext',
        '': 'plaintext'
    }
    return language_map.get(ext, 'plaintext')

def export_repo_content(repo_path, output_file):
    """Export repository content into a single Markdown file."""
    repo_path = Path(repo_path).resolve()
    
    content_blocks = []
    files_processed = 0

    # Header for the markdown file
    header = (
        f"# Geaux Academy Repository Content Export\n\n"
        f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    )
    content_blocks.append(header)
    
    # Traverse the repository to collect all relevant files while excluding ignored directories
    for root, dirs, files in os.walk(repo_path):
        # Exclude ignored directories from further traversal
        dirs[:] = [d for d in dirs if not should_ignore(Path(root) / d)]
        for file in sorted(files):
            file_path = Path(root) / file
            if not should_ignore(file_path) and should_include(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as source_file:
                        file_content = source_file.read().strip()
                    relative_file_path = file_path.relative_to(repo_path)
                    language = get_file_language(file_path)
                    
                    file_block = (
                        f"## /{relative_file_path}\n\n"
                        f"```{language}\n{file_content}\n```\n\n---\n\n"
                    )
                    content_blocks.append(file_block)
                    files_processed += 1
                except (UnicodeDecodeError, IOError):
                    continue
    
    full_content = ''.join(content_blocks)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    # Write a summary at the end of the file
    summary = (
        f"\n\n# Export Summary\n\n"
        f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        f"Total files processed: {files_processed}\n"
    )
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(summary)
        
    return output_file

if __name__ == '__main__':
    # Get the current working directory
    current_dir = os.getcwd()
    
    # Define the output file path (single Markdown file)
    output_file = os.path.join(current_dir, 'react_codebase.md')
    
    print("Starting repository content export...")
    print(f"Repository path: {current_dir}")
    
    result_file = export_repo_content(current_dir, output_file)
    
    print("\nExport completed successfully!")
    print(f"Exported content to: {result_file}")