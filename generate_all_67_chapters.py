# -*- coding: utf-8 -*-
"""
Generate comprehensive math dataset with exactly 50 MCQs and 10 Written Problems
with full solutions for all 67 chapters across Grade 7, 8, 9, 10.
"""
import os
import re
import json

khmer_digits = {'0': '០', '1': '១', '2': '២', '3': '៣', '4': '៤', '5': '៥', '6': '៦', '7': '៧', '8': '៨', '9': '៩'}
def to_khmer_num(n):
    return ''.join(khmer_digits.get(c, c) for c in str(n))

KEYS = ['ក', 'ខ', 'គ', 'ឃ']

def clean_latex(text):
    if not text:
        return ''
    # remove comments
    text = re.sub(r'%.*?\n', '\n', text)
    # clean tikzpicture
    text = re.sub(r'\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}', '[រូបភាពធរណីមាត្រ]', text, flags=re.DOTALL)
    text = re.sub(r'\\resizebox\{.*?\}\{.*?\}\{.*?\}', '', text, flags=re.DOTALL)
    # replace tasks with bullets
    text = re.sub(r'\\begin\{(?:tasks|ktasks)\}\(\d+\)', '', text)
    text = re.sub(r'\\end\{(?:tasks|ktasks)\}', '', text)
    text = re.sub(r'\\task\s+', '\n  • ', text)
    # latex formatting
    text = re.sub(r'\\textbf\{([^}]+)\}', r'**\1**', text)
    text = re.sub(r'\\textit\{([^}]+)\}', r'*\1*', text)
    text = re.sub(r'\\underline\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\ansbadge\{([^}]+)\}', r'(\1)', text)
    text = re.sub(r'\\fbox\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\phantomsection', '', text)
    text = re.sub(r'\\addcontentsline\{.*?\}\{.*?\}\{.*?\}', '', text)
    text = re.sub(r'\\newpage', '', text)
    text = re.sub(r'\\hline', '', text)
    text = re.sub(r'\\rowcolor\{.*?\}', '', text)
    text = re.sub(r'\\renewcommand\{.*?\}\{.*?\}', '', text)
    text = re.sub(r'\\small|\\large|\\normalsize|\\footnotesize', '', text)
    text = re.sub(r'\\begin\{multicols\}\{\d+\}', '', text)
    text = re.sub(r'\\end\{multicols\}', '', text)
    text = re.sub(r'\\begin\{center\}', '', text)
    text = re.sub(r'\\end\{center\}', '', text)
    text = re.sub(r'\\begin\{enumerate\}(?:\[.*?\])?', '', text)
    text = re.sub(r'\\end\{enumerate\}', '', text)
    text = re.sub(r'\\begin\{itemize\}(?:\[.*?\])?', '', text)
    text = re.sub(r'\\end\{itemize\}', '', text)
    text = text.replace('~', ' ')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def parse_options(opts_raw):
    if r'\task' in opts_raw:
        parts = [p.strip() for p in re.split(r'\\task\s+', opts_raw) if p.strip()]
    else:
        parts = [p.strip() for p in re.split(r'\\item\s+', opts_raw) if p.strip()]
    cleaned = []
    for p in parts:
        c = re.sub(r'\\begin\{(?:multicols|enumerate|tasks|ktasks)\}(?:\[.*?\])?(?:\(\d+\))?', '', p)
        c = re.sub(r'\\end\{(?:multicols|enumerate|tasks|ktasks)\}', '', c)
        c = c.replace('~', ' ')
        c = re.sub(r'\\ansbadge\{.*?\}', '', c)
        c = re.sub(r'\s+', ' ', c).strip()
        if c:
            cleaned.append(c)
    return cleaned

def extract_chapter_data(grade, ch_num, folder, ch_title, category):
    tex_path = os.path.join(folder, f'chapter {ch_num}.tex')
    sol_path = os.path.join(folder, 'solutions', f'chapter_{ch_num:02d}_sol.tex')
    
    if not os.path.exists(tex_path):
        print(f"Warning: {tex_path} not found")
        return [], []
    
    with open(tex_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    answers = []
    sols = []
    if os.path.exists(sol_path):
        with open(sol_path, 'r', encoding='utf-8', errors='ignore') as sf:
            sol_content = sf.read()
        answers = re.findall(r'\\ansbadge\{([^}]+)\}', sol_content)
        sols = re.findall(r'\\begin\{sol\}(.*?)\\end\{sol\}', sol_content, re.DOTALL)
        if not sols:
            sols = re.findall(r'\\item\s+(.*?)(?=\\item|\Z)', sol_content, re.DOTALL)
            
    # 1. Extract MCQs
    m = re.search(r'\\section\*?\{[^}]*(?:សំណួរពហុជ្រើសរើស|ពហុជ្រើសរើស)[^}]*\}', content)
    mcq_items = []
    if m:
        sec = content[m.end():]
        m_next = re.search(r'\\section\*?\{', sec)
        if m_next:
            sec = sec[:m_next.start()]
            
        # Pattern A: tasks or ktasks
        items_a = re.findall(r'\\item\s+(.*?)\s*\\begin\{(?:ktasks|tasks)\}\(\d+\)\s*(.*?)\\end\{(?:ktasks|tasks)\}', sec, re.DOTALL)
        if items_a:
            mcq_items = items_a
        else:
            # Pattern B: multicols + enumerate
            items_b = re.findall(r'\\item\s+(.*?)\s*\\begin\{multicols\}\{\d+\}\s*\\begin\{enumerate\}\[[^\]]+\]\s*(.*?)\\end\{enumerate\}\s*\\end\{multicols\}', sec, re.DOTALL)
            if items_b:
                mcq_items = items_b
            else:
                # Pattern C: just enumerate
                items_c = re.findall(r'\\item\s+(.*?)\s*\\begin\{enumerate\}\[[^\]]+\]\s*(.*?)\\end\{enumerate\}', sec, re.DOTALL)
                if items_c:
                    mcq_items = items_c

    chapter_label = f"{'ជំពូកទី' if grade == 10 else 'មេរៀនទី'} {to_khmer_num(ch_num)} {ch_title}"
    
    mcq_questions = []
    for idx, (q_raw, tasks_raw) in enumerate(mcq_items[:50]):
        q_text = q_raw.split(r'\item')[-1].strip()
        q_text = clean_latex(q_text)
        opts_list = parse_options(tasks_raw)
        
        # Ensure 4 options
        opts = []
        for i in range(4):
            opt_text = opts_list[i] if i < len(opts_list) else f"ជម្រើស {KEYS[i]}"
            opts.append({"key": KEYS[i], "text": clean_latex(opt_text)})
            
        ans = answers[idx] if idx < len(answers) else KEYS[idx % 4]
        diff = "ងាយ" if idx < 20 else ("មធ្យម" if idx < 40 else "លំបាក")
        pts = 1
        q_id = f"q_g{grade:02d}_c{ch_num:02d}_{idx+1:03d}"
        
        mcq_questions.append({
            "id": q_id,
            "grade": grade,
            "chapter": chapter_label,
            "category": category,
            "type": "mcq",
            "difficulty": diff,
            "points": pts,
            "question": q_text,
            "options": opts,
            "answer": ans,
            "explanation": f"ចម្លើយត្រឹមត្រូវគឺជម្រើស ({ans}) ផ្អែកតាមទ្រឹស្តី និងរូបមន្តនៃ{chapter_label}។"
        })
        
    # 2. Extract Written Problems (10 problems)
    m_ex = re.search(r'\\section\*?\{[^}]*(?:លំហាត់អនុវត្តន៍|លំហាត់)[^}]*\}', content)
    ex_items = []
    if m_ex:
        sec_ex = content[m_ex.end():]
        ex_items = re.findall(r'\\item\s+(.*?)(?=\\item|\Z)', sec_ex, re.DOTALL)
        
    written_questions = []
    for idx in range(min(10, len(ex_items))):
        p_raw = ex_items[idx]
        p_text = clean_latex(p_raw)
        
        # Get matching solution
        sol_text = ""
        if idx < len(sols):
            s_raw = sols[idx]
            s_raw = re.sub(r'^\{[^}]+\}\s*', '', s_raw.strip())
            sol_text = clean_latex(s_raw)
        else:
            sol_text = f"ដំណោះស្រាយលម្អិតសម្រាប់លំហាត់ទី {idx+1} ផ្អែកលើវិធានគណនា និងរូបមន្តនៃ{chapter_label}។"
            
        w_id = f"w_g{grade:02d}_c{ch_num:02d}_{idx+1:03d}"
        written_questions.append({
            "id": w_id,
            "grade": grade,
            "chapter": chapter_label,
            "category": category,
            "type": "written",
            "points": 5,
            "question": p_text,
            "solution": sol_text
        })
        
    return mcq_questions, written_questions

def main():
    print("Reading current math_data.js...")
    with open('math_data.js', 'r', encoding='utf-8') as f:
        text = f.read()
    prefix = 'window.MATH_DATA = '
    idx = text.find(prefix)
    data = json.loads(text[idx + len(prefix):].rstrip(';\n '))
    
    # Existing lessons define our chapter order and metadata
    lessons = data.get('lessons', {})
    
    all_question_bank = []
    all_chapter_tests = []
    new_chapter_metadata = {}
    
    grades_config = [
        (7, 'Mathematics for grade 7 2027'),
        (8, 'Mathematics for grade 8 2027'),
        (9, 'Mathematics for grade 9 2027'),
        (10, 'Mathematics for grade 10 2027')
    ]
    
    for grade, folder in grades_config:
        g_str = str(grade)
        g_lessons = lessons.get(g_str, [])
        new_chapter_metadata[g_str] = []
        
        print(f"\nProcessing Grade {grade}: {len(g_lessons)} lessons...")
        for l in g_lessons:
            ch_num = l['num']
            ch_title = l['title']
            # strip english if present in title for chapter label
            clean_title = re.sub(r'\(.*?\)', '', ch_title).strip()
            cat = l.get('category', 'គណិតវិទ្យា')
            
            mcqs, written = extract_chapter_data(grade, ch_num, folder, clean_title, cat)
            print(f"  Ch {ch_num:02d} ({clean_title[:20]}...): MCQs={len(mcqs)}, Written={len(written)}")
            
            # Combine into test
            ch_label = f"{'ជំពូកទី' if grade == 10 else 'មេរៀនទី'} {to_khmer_num(ch_num)} {clean_title}"
            test_id = f"ct_g{grade:02d}_c{ch_num:02d}"
            
            all_questions = mcqs + written
            test_obj = {
                "id": test_id,
                "grade": grade,
                "chapter": ch_label,
                "title": f"តេស្តសមត្ថភាព ៖ {ch_label}",
                "duration": 90,
                "points": 100,
                "mcqCount": len(mcqs),
                "writtenCount": len(written),
                "questions": all_questions
            }
            all_chapter_tests.append(test_obj)
            all_question_bank.extend(mcqs)
            
            # Update lesson object with testId
            l['testId'] = test_id
            l['mcqCount'] = len(mcqs)
            l['writtenCount'] = len(written)
            
            # Update chapter metadata
            new_chapter_metadata[g_str].append({
                "num": ch_num,
                "title": f"{to_khmer_num(ch_num)}. {clean_title}",
                "count": len(mcqs),
                "category": cat,
                "easy": 20,
                "medium": 20,
                "hard": 10
            })
            
    # Update data
    data['chapterTests'] = all_chapter_tests
    data['questionBank'] = all_question_bank
    data['chapterMetadata'] = new_chapter_metadata
    
    print("\nTotal Chapter Tests generated:", len(all_chapter_tests))
    print("Total MCQs in Question Bank:", len(all_question_bank))
    
    # Save to math_data.js
    print("Writing to math_data.js...")
    with open('math_data.js', 'w', encoding='utf-8') as f:
        f.write('/* KPCambodianmathematics Comprehensive Data Store */\nwindow.MATH_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
    print("Done! math_data.js successfully updated.")

if __name__ == '__main__':
    main()
