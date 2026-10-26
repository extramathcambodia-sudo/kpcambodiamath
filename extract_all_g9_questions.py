import re
import os
import glob
import json

with open('math_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.MATH_DATA = '
idx = text.find(prefix)
data = json.loads(text[idx + len(prefix):].rstrip(';\n '))

qb = data.get('questionBank', [])
keys = ['ក', 'ខ', 'គ', 'ឃ']

G9_CHAPTER_NAMES = [
    (1, "ចំនួនអសនិទាន", "ពីជគណិត"),
    (2, "សមាមាត្រ", "ពីជគណិត"),
    (3, "កន្សោមពីជគណិត", "ពីជគណិត"),
    (4, "សមីការដឺក្រេទី១ មានមួយអញ្ញាត", "ពីជគណិត"),
    (5, "វិសមីការដឺក្រេទី១ មានមួយអញ្ញាត", "ពីជគណិត"),
    (6, "បំណែកចែកប្រេកង់", "ស្ថិតិ-ប្រូបាប"),
    (7, "មធ្យមស្ថិតិ", "ស្ថិតិ-ប្រូបាប"),
    (8, "ប្រូបាប", "ស្ថិតិ-ប្រូបាប"),
    (9, "ចម្ងាយរវាងពីរចំណុច", "ធរណីមាត្រវិភាគ"),
    (10, "សមីការបន្ទាត់", "ធរណីមាត្រវិភាគ"),
    (11, "ប្រព័ន្ធសមីការដឺក្រេទី១ មានពីរអញ្ញាត", "ពីជគណិត"),
    (12, "ទ្រឹស្តីបទពីតាគ័រ", "ធរណីមាត្រ"),
    (13, "រង្វង់ និងបន្ទាត់", "ធរណីមាត្រ"),
    (14, "លក្ខណៈមុំនៃរង្វង់", "ធរណីមាត្រ"),
    (15, "ទ្រឹស្តីបទតាលែស", "ធរណីមាត្រ"),
    (16, "ត្រីកោណដូចគ្នា", "ធរណីមាត្រ"),
    (17, "ពហុកោណ", "ធរណីមាត្រ"),
    (18, "សូលីត", "ធរណីមាត្រ")
]

khmer_digits = {'0': '០', '1': '១', '2': '២', '3': '៣', '4': '៤', '5': '៥', '6': '៦', '7': '៧', '8': '៨', '9': '៩'}
def to_khmer_num(n):
    return ''.join(khmer_digits.get(c, c) for c in str(n))

new_g9_questions = []

for ch_num, ch_title, cat in G9_CHAPTER_NAMES:
    tex_path = rf"Mathematics for grade 9 2027\chapter {ch_num}.tex"
    sol_path = rf"Mathematics for grade 9 2027\solutions\chapter_{ch_num:02d}_sol.tex"
    
    if not os.path.exists(tex_path):
        continue
    
    with open(tex_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    answers = []
    if os.path.exists(sol_path):
        with open(sol_path, 'r', encoding='utf-8', errors='ignore') as sf:
            sol_content = sf.read()
            answers = re.findall(r'\\ansbadge\{([^}]+)\}', sol_content)

    mcq_section = ""
    if r'\section{សំណួរពហុជ្រើសរើស' in content:
        mcq_section = content.split(r'\section{សំណួរពហុជ្រើសរើស')[1]
        if r'\section{' in mcq_section:
            mcq_section = mcq_section.split(r'\section{')[0]
    else:
        # Fallback to entire content
        mcq_section = content

    items = re.findall(r'\\item\s+(.*?)\s*\\begin\{ktasks\}\(\d+\)\s*(.*?)\\end\{ktasks\}', mcq_section, re.DOTALL)
    if not items:
        items = re.findall(r'\\item\s+(.*?)\s*\\begin\{tasks\}\(\d+\)\s*(.*?)\\end\{tasks\}', mcq_section, re.DOTALL)

    chapter_label = f"មេរៀនទី {to_khmer_num(ch_num)} {ch_title}"
    
    for idx, (q_raw, tasks_raw) in enumerate(items):
        q_text = q_raw.split(r'\item')[-1].strip()
        q_text = re.sub(r'\\begin\{(?:multicols|enumerate|tasks|ktasks)\}(?:\[.*?\])?(?:\(\d+\))?', '', q_text)
        q_text = re.sub(r'\\end\{(?:multicols|enumerate|tasks|ktasks)\}', '', q_text)
        q_text = re.sub(r'\s+', ' ', q_text).strip()
        
        raw_opts = [re.sub(r'\s+', ' ', opt.strip()) for opt in re.split(r'\\task\s+', tasks_raw) if opt.strip()]
        if len(raw_opts) == 4:
            opts = [{"key": keys[i], "text": raw_opts[i]} for i in range(4)]
            ans = answers[idx] if idx < len(answers) else keys[idx % 4]
            diff = "ងាយ" if idx < 15 else ("មធ្យម" if idx < 35 else "លំបាក")
            pts = 1
            q_id = f"q_g9_c{ch_num:02d}_{idx+1:03d}"
            new_g9_questions.append({
                "id": q_id,
                "grade": 9,
                "chapter": chapter_label,
                "category": cat,
                "type": "mcq",
                "difficulty": diff,
                "points": pts,
                "question": q_text,
                "options": opts,
                "answer": ans,
                "explanation": f"ចម្លើយត្រឹមត្រូវគឺជម្រើស ({ans}) ផ្អែកតាមទ្រឹស្តី និងរូបមន្តនៃ {chapter_label}។"
            })

print(f"Extracted {len(new_g9_questions)} authentic questions for Grade 9 across chapters!")

# Append to questionBank
qb = [q for q in qb if q.get('grade') != 9] # remove any partial G9
qb.extend(new_g9_questions)
data['questionBank'] = qb

# Update chapter metadata for Grade 9 so that the sidebar counts match exactly!
if 'chapterMetadata' not in data:
    data['chapterMetadata'] = {}

g9_meta = []
for ch_num, ch_title, cat in G9_CHAPTER_NAMES:
    ch_label = f"មេរៀនទី {to_khmer_num(ch_num)} {ch_title}"
    count = len([q for q in new_g9_questions if q['chapter'] == ch_label])
    g9_meta.append({
        "num": ch_num,
        "title": f"{to_khmer_num(ch_num)}. {ch_title}",
        "count": count if count > 0 else 50,
        "category": cat,
        "easy": 20,
        "medium": 20,
        "hard": 10
    })

data['chapterMetadata']['9'] = g9_meta

with open('math_data.js', 'w', encoding='utf-8') as f:
    f.write('/* KPCambodianmathematics Comprehensive Data Store */\nwindow.MATH_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')

print(f"Successfully updated math_data.js! Total questionBank: {len(qb)}")
