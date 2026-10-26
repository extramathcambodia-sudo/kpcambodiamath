# -*- coding: utf-8 -*-
"""
Compile full index.html with:
1. Question Bank matching Screenshot 1 (Pills, Chapter sidebar, Select Bar)
2. Instant Exam Modal matching Screenshot 2
3. Exam Studio matching Screenshot 3, 4, 5 (NGS exam, OMR sheet, Ruled answer sheet)
4. Lessons & Curriculum for Grade 7, 8, 9, 10
"""

import json

# Read math_data.js structure
with open("math_data.js", "r", encoding="utf-8") as f:
    raw = f.read()

data = json.loads(raw.split("window.MATH_DATA = ")[1].rstrip(";\n "))

# Let's inspect index.html to build the full modern interface
with open("index.html", "r", encoding="utf-8") as f:
    orig_html = f.read()

print("Original index.html loaded successfully.")
