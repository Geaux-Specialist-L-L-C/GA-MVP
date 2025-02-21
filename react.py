import os
import shutil
import math
import sys

# Define the root directory of your React app
ROOT_DIR = "."  # Current directory
OUTPUT_DIR = "./output_docs"
NUM_OUTPUT_FILES = 10  # Number of consolidated markdown files

# Allowed file extensions
ALLOWED_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss", ".md", ".env"}
ALLOWED_FILES = {"package.json", "package-lock.json", "yarn.lock", "vite.config.js", "webpack.config.js"}

# Directories and patterns to EXCLUDE
EXCLUDE_DIRS = {"node_modules", "dist", "build", ".git", ".next", ".vercel", ".cache"}
EXCLUDE_PATTERNS = {"node_modules", "package-lock.json", "yarn.lock"}

def is_valid_file(file_name):
    """Check if the file is valid based on its extension or name."""
    return file_name in ALLOWED_FILES or os.path.splitext(file_name)[1] in ALLOWED_EXTENSIONS

def should_include_content(content):
    """Check if the content should be included based on patterns."""
    return not any(pattern in content for pattern in EXCLUDE_PATTERNS)

def extract_files(root_dir):
    """Extracts files from the project, excluding unwanted content."""
    extracted_files = []

    for root, dirs, files in os.walk(root_dir, topdown=True):
        # Exclude unwanted directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            if is_valid_file(file):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                
                # Skip files that match exclude patterns
                if any(pattern in rel_path for pattern in EXCLUDE_PATTERNS):
                    continue

                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    if should_include_content(content):
                        extracted_files.append((rel_path, content))

                except Exception as e:
                    print(f"⚠️ Skipped {rel_path}: {e}")

    return extracted_files

def consolidate_files(extracted_files, output_dir, num_files):
    """Distributes extracted content into exactly `num_files` markdown files."""
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)  # Clean the output directory
    os.makedirs(output_dir)

    total_files = len(extracted_files)
    if total_files == 0:
        print("❌ No valid files found in the project!")
        return

    files_per_md = math.ceil(total_files / num_files)

    for i in range(num_files):
        output_file_path = os.path.join(output_dir, f"consolidated_part_{i+1}.md")
        start_idx = i * files_per_md
        end_idx = min((i + 1) * files_per_md, total_files)
        chunk = extracted_files[start_idx:end_idx]

        if not chunk:
            break  # Stop if there are no more files to process

        with open(output_file_path, "w", encoding="utf-8") as f_out:
            f_out.write(f"# Consolidated Files (Part {i+1})\n\n")
            for file_name, content in chunk:
                f_out.write(f"## {file_name}\n\n```\n{content}\n```\n\n")

        print(f"✅ Generated: {output_file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ROOT_DIR = sys.argv[1]
        print(f"📂 Root directory set to: {ROOT_DIR}")
    else:
        print(f"📂 Using default root directory: {ROOT_DIR}")

    extracted_files = extract_files(ROOT_DIR)
    consolidate_files(extracted_files, OUTPUT_DIR, NUM_OUTPUT_FILES)
    print(f"\n✅ Extraction complete! Markdown files are stored in '{OUTPUT_DIR}'")
