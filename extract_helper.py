# -*- coding: utf-8 -*-
"""
Builder script to extract authentic questions from LaTeX files and compile
a comprehensive data store for Grade 7, 8, 10 into math_data.js.
"""

import os
import glob
import re
import json

def clean_latex(text):
    if not text:
        return ""
    # Remove comments
    text = re.sub(r'%.*$', '', text, flags=re.MULTILINE)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_chapter_mcqs(tex_path, sol_path, grade_num, ch_num, ch_title, category):
    questions = []
    if not os.path.exists(tex_path):
        return questions

    with open(tex_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Get answers from solutions if exists
    answers = []
    if os.path.exists(sol_path):
        with open(sol_path, 'r', encoding='utf-8', errors='ignore') as sf:
            sol_content = sf.read()
            answers = re.findall(r'\\ansbadge\{([^}]+)\}', sol_content)

    # Match items with tasks/ktasks
    pattern = r'\\item\s+(.*?)\s*\\begin\{(?:ktasks|tasks)\}(?:\[.*?\])?(?:\(\d+\))?\s*(.*?)\\end\{(?:ktasks|tasks)\}'
    matches = re.findall(pattern, content, re.DOTALL)

    keys = ['ក', 'ខ', 'គ', 'ឃ']
    for idx, (q_raw, tasks_raw) in enumerate(matches):
        q_text = clean_latex(q_raw)
        # Filter out noise
        if len(q_text) < 5 or 'ពហុជ្រើសរើស' in q_text[:25]:
            continue
        
        # Extract options
        raw_opts = [clean_latex(t) for t in re.split(r'\\task\s+', tasks_raw) if clean_latex(t)]
        if len(raw_opts) != 4:
            continue

        options = [{"key": keys[i], "text": raw_opts[i]} for i in range(4)]
        ans = answers[idx] if idx < len(answers) else "ក"
        
        diff = "ងាយ" if idx < 15 else ("មធ្យម" if idx < 35 else "លំបាក")
        pts = 1 if diff == "ងាយ" else (2 if diff == "មធ្យម" else 3)

        q_id = f"q_g{grade_num}_c{ch_num:02d}_{idx+1:03d}"
        questions.append({
            "id": q_id,
            "grade": grade_num,
            "chapter": f"មេរៀនទី {ch_num} {ch_title}" if grade_num != 10 else f"ជំពូកទី {ch_num} {ch_title}",
            "category": category,
            "type": "mcq",
            "difficulty": diff,
            "points": pts,
            "question": q_text,
            "options": options,
            "answer": ans,
            "explanation": f"ចម្លើយត្រឹមត្រូវគឺជម្រើស ({ans}) ផ្អែកតាមទ្រឹស្តី និងរូបមន្តនៃ {ch_title}។"
        })

    return questions

print("Helper defined.")
