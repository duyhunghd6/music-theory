import os
import re
import json
import sys

def extract_beads_ids(directory):
    # Regex matching: <!-- beads-id: br-prd01-s1 -->
    # Regex matching: <!-- beads-id: br-plan-01 | satisfies: br-prd02-s1 -->
    pattern_simple = re.compile(r'<!--\s*beads-id:\s*([a-zA-Z0-9_-]+)\s*-->')
    pattern_complex = re.compile(r'<!--\s*beads-id:\s*([a-zA-Z0-9_-]+)\s*\|\s*satisfies:\s*([a-zA-Z0-9_,-]+)\s*-->')
    
    results = []

    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith('.md'):
                continue
                
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            for line_idx, line in enumerate(lines):
                # Check complex pattern first (with satisfies)
                match_complex = pattern_complex.search(line)
                if match_complex:
                    beads_id = match_complex.group(1).strip()
                    satisfies = [s.strip() for s in match_complex.group(2).split(',')]
                    results.append({
                        "id": beads_id,
                        "file": filepath,
                        "line": line_idx + 1,
                        "satisfies": satisfies,
                        "type": "complex"
                    })
                    continue
                
                # Fallback to simple pattern (just ID)
                match_simple = pattern_simple.search(line)
                if match_simple:
                    beads_id = match_simple.group(1).strip()
                    results.append({
                        "id": beads_id,
                        "file": filepath,
                        "line": line_idx + 1,
                        "satisfies": [],
                        "type": "simple"
                    })
                    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_ids.py <target_directory_or_file>")
        sys.exit(1)
        
    target_path = sys.argv[1]
    
    if not os.path.exists(target_path):
        print(f"Error: Path {target_path} does not exist.")
        sys.exit(1)
        
    if os.path.isfile(target_path):
        target_dir = os.path.dirname(target_path)
    else:
        target_dir = target_path
        
    extracted = extract_beads_ids(target_dir)
    print(json.dumps(extracted, indent=2))
