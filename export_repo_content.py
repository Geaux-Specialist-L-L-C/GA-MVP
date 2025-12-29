#!/usr/bin/env python3

import os
from pathlib import Path
import datetime
import math

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

def write_chunk(chunk_number, content, base_path):
    """Write a chunk of content to a file."""
    output_file = f"{base_path}_part{chunk_number}.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f'# React Application Structure and Content - Part {chunk_number}\n\n')
        f.write(f'Generated on: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
        f.write(content)
    return output_file

def export_repo_content(repo_path, output_base):
    """Export repository content to multiple markdown files of ~500KB each."""
    repo_path = Path(repo_path).resolve()
    
    # Initialize variables
    current_chunk = []
    current_chunk_size = 0
    chunk_number = 1
    max_chunk_size = 512 * 1024  # 500KB in bytes
    files_processed = 0
    generated_files = []
    
    # Collect all file paths first and sort them
    all_files = []
    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if not should_ignore(Path(root) / d)]
        for file in sorted(files):
            file_path = Path(root) / file
            if not should_ignore(file_path) and should_include(file_path):
                all_files.append(file_path)

    # Process files
    for file_path in all_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as source_file:
                content = source_file.read()
                
                relative_file_path = file_path.relative_to(repo_path)
                language = get_file_language(file_path)
                
                # Create file content block
                file_block = f'## /{relative_file_path}\n\n'
                file_block += f'```{language}\n{content.strip()}\n```\n\n---\n\n'
                
                # Calculate size of this block
                block_size = len(file_block.encode('utf-8'))
                
                # If this single block is larger than max chunk size, split it into smaller pieces
                if block_size > max_chunk_size:
                    # Write current chunk if it exists
                    if current_chunk:
                        chunk_content = ''.join(current_chunk)
                        output_file = write_chunk(chunk_number, chunk_content, output_base)
                        generated_files.append(output_file)
                        chunk_number += 1
                        current_chunk = []
                        current_chunk_size = 0
                    
                    # Split large file into multiple chunks
                    content_lines = content.splitlines()
                    sub_chunk = []
                    sub_chunk_size = 0
                    
                    for line in content_lines:
                        line_block = f"{line}\n"
                        line_size = len(line_block.encode('utf-8'))
                        
                        if sub_chunk_size + line_size > max_chunk_size:
                            # Write current sub-chunk
                            sub_content = f'## /{relative_file_path} (continued)\n\n```{language}\n{"".join(sub_chunk)}```\n\n---\n\n'
                            output_file = write_chunk(chunk_number, sub_content, output_base)
                            generated_files.append(output_file)
                            chunk_number += 1
                            sub_chunk = []
                            sub_chunk_size = 0
                        
                        sub_chunk.append(line_block)
                        sub_chunk_size += line_size
                    
                    # Write remaining sub-chunk if it exists
                    if sub_chunk:
                        sub_content = f'## /{relative_file_path} (continued)\n\n```{language}\n{"".join(sub_chunk)}```\n\n---\n\n'
                        output_file = write_chunk(chunk_number, sub_content, output_base)
                        generated_files.append(output_file)
                        chunk_number += 1
                
                # If adding this block would exceed chunk size, write current chunk
                elif current_chunk_size + block_size > max_chunk_size and current_chunk:
                    chunk_content = ''.join(current_chunk)
                    output_file = write_chunk(chunk_number, chunk_content, output_base)
                    generated_files.append(output_file)
                    chunk_number += 1
                    current_chunk = []
                    current_chunk_size = 0
                    current_chunk.append(file_block)
                    current_chunk_size = block_size
                else:
                    # Add block to current chunk
                    current_chunk.append(file_block)
                    current_chunk_size += block_size
                
                files_processed += 1
                
        except (UnicodeDecodeError, IOError):
            continue
    
    # Write remaining content
    if current_chunk:
        chunk_content = ''.join(current_chunk)
        output_file = write_chunk(chunk_number, chunk_content, output_base)
        generated_files.append(output_file)
    
    # Write summary to a separate file
    summary_file = f"{output_base}_summary.md"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write(f'# React Codebase Export Summary\n\n')
        f.write(f'Generated on: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n\n')
        f.write(f'Total files processed: {files_processed:,}\n')
        f.write(f'Total parts generated: {len(generated_files):,}\n\n')
        f.write('## Generated Files:\n')
        for file in generated_files:
            f.write(f'- {os.path.basename(file)}\n')
    
    return generated_files, summary_file

if __name__ == '__main__':
    # Get the current working directory
    current_dir = os.getcwd()
    
    # Define the base output file path (without extension)
    output_base = os.path.join(current_dir, 'react_codebase')
    
    print(f"Starting React codebase export...")
    print(f"Repository path: {current_dir}")
    
    # Export the content
    generated_files, summary_file = export_repo_content(current_dir, output_base)
    
    print(f"\nExport completed successfully!")
    print(f"Generated {len(generated_files)} files:")
    for file in generated_files:
        print(f"- {os.path.basename(file)}")
    print(f"\nSummary file: {os.path.basename(summary_file)}")