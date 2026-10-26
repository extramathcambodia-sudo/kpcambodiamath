with open(r'Mathematics for grade 9 2027\chapter 2.tex', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'MCQ' in l or 'ពហុជ្រើសរើស' in l or 'ktasks' in l:
        print(f"Line {i+1}: {l.strip()[:100]}")
