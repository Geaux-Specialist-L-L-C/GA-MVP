#!/usr/bin/env python3

import os
from pathlib import Path
import datetime

def should_include(path):
    """Check if the file is relevant to the React application."""
    relevant_extensions = {
        '.tsx', '.ts', '.jsx', '.js', '.css', '.scss',
        '.json', '.md', '.html', '.env', '.eslintrc',
        '.prettierrc', '.babelrc', '.config.js'
    }
    
    relevant_paths = {
        'src', 'public', 'components', 'pages',
        'hooks', 'contexts', 'services', 'utils',
        'styles', 'theme', 'types', 'config',
        '.github', 'firebase'
    }
    
    path_str = str(path)
    
    # Check if path contains relevant directories
    if any(f'/{d}/' in path_str for d in relevant_paths):
        return True
        
    # Check file extension
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
    """Export repository content to a markdown file."""
    repo_path = Path(repo_path).resolve()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        # Write header
        f.write(f'# React Application Structure and Content\n\n')
        f.write(f'Generated on: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
        
        # Keep track of file count
        file_count = 0
        
        # Walk through the repository
        for root, dirs, files in os.walk(repo_path):
            # Skip ignored directories
            dirs[:] = [d for d in dirs if not should_ignore(Path(root) / d)]
            
            # Process each file
            for file in sorted(files):
                file_path = Path(root) / file
                
                # Skip if file should be ignored or is not relevant
                if should_ignore(file_path) or not should_include(file_path):
                    continue
                
                try:
                    # Try to read the file
                    with open(file_path, 'r', encoding='utf-8') as source_file:
                        content = source_file.read()
                        
                        # Get relative path from repo root
                        relative_file_path = file_path.relative_to(repo_path)
                        
                        # Update count
                        file_count += 1
                        
                        # Write file information
                        f.write(f'## /{relative_file_path}\n\n')
                        
                        # Get the language for syntax highlighting
                        language = get_file_language(file)
                        
                        # Write the file content with proper markdown code fence
                        f.write(f'```{language}\n')
                        f.write(content.strip())
                        f.write('\n```\n\n')
                        
                        # Add a separator
                        f.write('---\n\n')
                        
                except (UnicodeDecodeError, IOError):
                    # Skip files that can't be read as text
                    continue

        # Write summary
        f.write(f'# Summary\n\n')
        f.write(f'Total React-related files processed: {file_count:,}\n')

if __name__ == '__main__':
    # Get the current working directory
    current_dir = os.getcwd()
    
    # Define the output file path
    output_file = os.path.join(current_dir, 'react_codebase.md')
    
    print(f"Starting React codebase export...")
    print(f"Repository path: {current_dir}")
    print(f"Output file: {output_file}")
    
    # Export the content
    export_repo_content(current_dir, output_file)
    
    print(f"\nExport completed successfully!")
    print(f"Content has been exported to: {output_file}")