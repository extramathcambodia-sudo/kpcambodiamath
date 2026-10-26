# -*- coding: utf-8 -*-
"""
KPCambodianmathematics - Database & LaTeX Cleaner
Cleans all raw LaTeX macros, fixes missing \\ line separators in array/align/cases,
converts tabularx to clean markdown tables/lists, and enriches math rendering.
"""

import re
import json

def fix_latex_text(text):
    if not text or not isinstance(text, str):
        return text

    s = text

    # 1. Clean \Am and \ans
    s = re.sub(r'\\Am\b', '\n\n✍️ **ដំណោះស្រាយ ៖**\n\n', s)
    s = re.sub(r'\\ans\b', '\n\n✍️ **ដំណោះស្រាយ ៖**\n\n', s)

    # 2. Clean \mylimhat
    s = re.sub(r'\\mylimhat\s*(\\quad|\\hspace\{[^}]*\})?', '✍️ **លំហាត់អនុវត្ត ៖** ', s)

    # 3. Clean \cirkalph and \cirknum
    s = re.sub(r'\\cirkalph\{([^{}]+)\}', r'**(\1)** ', s)
    s = re.sub(r'\\cirknum\{([^{}]+)\}', r'**(\1)** ', s)

    # 4. Clean formatting commands
    s = re.sub(r'\\nx\b', '\n', s)
    s = re.sub(r'\\nskip\b', '\n', s)
    s = re.sub(r'\\noindent\b', '', s)
    s = re.sub(r'\\linewidth\b', '', s)
    s = re.sub(r'\\par\b', '\n\n', s)
    s = re.sub(r'\\phantom\{[^{}]*\}', r'\\quad ', s)
    s = re.sub(r'\\shortstack\{([^{}\n]*)\\\\([^{}\n]*)\}', r'\1 \2', s)

    # Clean adjustbox, minipage, multicols
    s = re.sub(r'\\begin\{adjustbox\}\{[^}]*\}\s*(\\setlength\{[^}]*\}\{[^}]*\})?\s*(\\scriptsize)?', '', s)
    s = re.sub(r'\\end\{adjustbox\}', '', s)
    s = re.sub(r'\\begin\{minipage\}\{[^}]*\}', '', s)
    s = re.sub(r'\\end\{minipage\}', '', s)
    s = re.sub(r'\\begin\{multicols\}\{[^}]*\}', '', s)
    s = re.sub(r'\\end\{multicols\}', '', s)
    s = re.sub(r'\\begin\{enumerate\}', '', s)
    s = re.sub(r'\\end\{enumerate\}', '', s)
    s = re.sub(r'\\item\b', '• ', s)

    # 5. Fix \begin{array} blocks (add \\ to each row)
    def repl_array(m):
        col_spec = m.group(1)
        body = m.group(2).strip()
        lines = [line.strip() for line in body.split('\n') if line.strip()]
        new_lines = []
        for i, line in enumerate(lines):
            if line == r'\hline':
                new_lines.append(line)
            elif line.endswith(r'\\'):
                new_lines.append(line)
            elif i < len(lines) - 1:
                new_lines.append(line + r' \\')
            else:
                new_lines.append(line)
        return r'\begin{array}{' + col_spec + '}\n' + '\n'.join(new_lines) + '\n\\end{array}'

    s = re.sub(r'\\begin\{array\}\{((?:[^{}]|\{[^{}]*\})*)\}(.*?)\\end\{array\}', repl_array, s, flags=re.DOTALL)

    # 6. Fix \begin{align*} and \begin{align} blocks
    def repl_align(m):
        env = m.group(1)
        body = m.group(2).strip()
        lines = [line.strip() for line in body.split('\n') if line.strip()]
        new_lines = []
        for i, line in enumerate(lines):
            if line.endswith(r'\\'):
                new_lines.append(line)
            elif i < len(lines) - 1:
                new_lines.append(line + r' \\')
            else:
                new_lines.append(line)
        return r'\begin{' + env + '}\n' + '\n'.join(new_lines) + '\n\\end{' + env + '}'

    s = re.sub(r'\\begin\{(align\*?)\}(.*?)\\end\{\1\}', repl_align, s, flags=re.DOTALL)

    # 7. Fix \begin{cases} blocks
    def repl_cases(m):
        body = m.group(1).strip()
        lines = [line.strip() for line in body.split('\n') if line.strip()]
        new_lines = []
        for i, line in enumerate(lines):
            if line.endswith(r'\\'):
                new_lines.append(line)
            elif i < len(lines) - 1:
                new_lines.append(line + r' \\')
            else:
                new_lines.append(line)
        return r'\begin{cases}\n' + '\n'.join(new_lines) + '\n\\end{cases}'

    s = re.sub(r'\\begin\{cases\}(.*?)\\end\{cases\}', repl_cases, s, flags=re.DOTALL)

    # 8. Convert \begin{tabularx} to markdown tables or lists
    def repl_tab(m):
        col_spec = m.group(1)
        body = m.group(2).strip()
        
        # If exercise grid
        if '**(' in body or r'\cirkalph' in body or ('|' not in col_spec and '&' in body):
            body = re.sub(r'\\multicolumn\{[0-9]+\}\{[^}]*\}\{([^}]*)\}', r'\1', body)
            items = []
            rows = re.split(r'\\\\|\n', body)
            for row in rows:
                cells = row.split('&')
                for c in cells:
                    c = c.strip()
                    if c:
                        c = re.sub(r'^[•\-\*]\s*', '', c)
                        items.append(f"• {c}")
            return '\n\n' + '\n'.join(items) + '\n\n'
        
        # Otherwise standard table
        lines = [l.strip() for l in body.split('\n') if l.strip()]
        if not lines:
            return ''
        
        table_rows = []
        max_cols = 0
        for l in lines:
            l = re.sub(r'\\\\$', '', l).strip()
            cells = [c.strip() for c in l.split('&')]
            if any(cells):
                table_rows.append(cells)
                max_cols = max(max_cols, len(cells))
        
        if not table_rows:
            return ''
        
        for row in table_rows:
            while len(row) < max_cols:
                row.append('')
        
        md = []
        header = '| ' + ' | '.join(table_rows[0]) + ' |'
        separator = '| ' + ' | '.join([':---:'] + [':---'] * (max_cols - 1)) + ' |'
        md.append(header)
        md.append(separator)
        for row in table_rows[1:]:
            md.append('| ' + ' | '.join(row) + ' |')
        
        return '\n\n' + '\n'.join(md) + '\n\n'

    s = re.sub(r'\\begin\{tabularx\}\{[^}]*\}\{((?:[^{}]|\{[^{}]*\})*)\}(.*?)\\end\{tabularx\}', repl_tab, s, flags=re.DOTALL)

    # 9. Clean orphaned ** markers
    s = re.sub(r'\n\s*\*\*\s*\n', '\n\n', s)
    s = re.sub(r'\n{3,}', '\n\n', s)

    return s

def clean_data_structure(obj):
    if isinstance(obj, str):
        return fix_latex_text(obj)
    elif isinstance(obj, list):
        return [clean_data_structure(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_data_structure(v) for k, v in obj.items()}
    return obj

def main():
    print("Loading math_data.js...")
    with open("math_data.js", "r", encoding="utf-8") as f:
        raw = f.read()

    prefix = "window.MATH_DATA = "
    if raw.startswith(prefix):
        json_str = raw[len(prefix):].rstrip(";\n ")
    else:
        json_str = raw

    data = json.loads(json_str)
    print("Loaded JSON successfully! Cleaning LaTeX across all grades, chapters, and question banks...")

    cleaned_data = clean_data_structure(data)

    print("Saving cleaned math_data.js...")
    new_raw = prefix + json.dumps(cleaned_data, ensure_ascii=False, indent=2) + ";\n"
    with open("math_data.js", "w", encoding="utf-8") as f:
        f.write(new_raw)

    print(f"COMPLETE! math_data.js cleaned successfully. Size: {len(new_raw):,} bytes.")

if __name__ == "__main__":
    main()
