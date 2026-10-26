import re
import os

tex_path = r"Mathematics for grade 9 2027\chapter 2.tex"
sol_path = r"Mathematics for grade 9 2027\solutions\chapter_02_sol.tex"

with open(tex_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

answers = []
if os.path.exists(sol_path):
    with open(sol_path, 'r', encoding='utf-8', errors='ignore') as sf:
        sol_content = sf.read()
        answers = re.findall(r'\\ansbadge\{([^}]+)\}', sol_content)

print(f"Found {len(answers)} answers in solution file.")

# Extract MCQ section
mcq_section = ""
if r'\section{សំណួរពហុជ្រើសរើស' in content:
    mcq_section = content.split(r'\section{សំណួរពហុជ្រើសរើស')[1]
    if r'\section{' in mcq_section:
        mcq_section = mcq_section.split(r'\section{')[0]

print(f"MCQ section length: {len(mcq_section)} chars")

# Match items
items = re.findall(r'\\item\s+(.*?)\s*\\begin\{ktasks\}\(\d+\)\s*(.*?)\\end\{ktasks\}', mcq_section, re.DOTALL)
print(f"Matched {len(items)} items with ktasks!")

keys = ['ក', 'ខ', 'គ', 'ឃ']
extracted_questions = []

for idx, (q_raw, tasks_raw) in enumerate(items):
    # Take clean question text
    q_text = q_raw.split(r'\item')[-1].strip()
    q_text = re.sub(r'\s+', ' ', q_text)
    
    # Options
    raw_opts = [re.sub(r'\s+', ' ', opt.strip()) for opt in re.split(r'\\task\s+', tasks_raw) if opt.strip()]
    if len(raw_opts) == 4:
        opts = [{"key": keys[i], "text": raw_opts[i]} for i in range(4)]
        ans = answers[idx] if idx < len(answers) else "ក"
        diff = "ងាយ" if idx < 20 else ("មធ្យម" if idx < 40 else "លំបាក")
        pts = 1
        q_id = f"q_g9_c02_{idx+1:03d}"
        extracted_questions.append({
            "id": q_id,
            "grade": 9,
            "chapter": "មេរៀនទី ២ សមាមាត្រ",
            "category": "ពីជគណិត",
            "type": "mcq",
            "difficulty": diff,
            "points": pts,
            "question": q_text,
            "options": opts,
            "answer": ans,
            "explanation": f"ចម្លើយត្រឹមត្រូវគឺជម្រើស ({ans}) ផ្អែកតាមទ្រឹស្តី និងរូបមន្តនៃ មេរៀនទី ២ សមាមាត្រ។"
        })

print(f"Successfully compiled {len(extracted_questions)} Grade 9 Chapter 2 questions!")
print("Sample Question 1:", extracted_questions[0]['question'])
print("Sample Options:", extracted_questions[0]['options'])
print("Sample Answer:", extracted_questions[0]['answer'])
print("Sample Question 50:", extracted_questions[-1]['question'])
