# -*- coding: utf-8 -*-
"""
Builder for KhmerMath Pro:
Produces the exact UI matching the 5 uploaded user screenshots:
1. ធនាគារសំណួរ (4130) with Grade Pills, Chapter Sidebar, and Selection Bar
2. Modal បង្កើតវិញ្ញាសាភ្លាមៗ
3. Official Exam Studio (ចេញវិញ្ញាសា) with NGS format, OMR bubble sheet, and ruled written answer sheet
4. Full integration of Grades 7, 8, 9, 10
"""

import json
import os
import re

# Load base data
with open("math_data.js", "r", encoding="utf-8") as f:
    raw = f.read()

data = json.loads(raw.split("window.MATH_DATA = ")[1].rstrip(";\n "))

# --- Update Chapter Structure per Grade ---
G7_CHAPTERS_DEF = [
    {"num": 1, "title": "ចំនួនគត់", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 2, "title": "តួចែកនិងពហុគុណ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 3, "title": "ចំនួនគត់រ៉ឺឡាទីប", "count": 51, "diff": {"ង": 15, "ម": 21, "ក": 10, "pisa": 5}},
    {"num": 4, "title": "ប្រភាគ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 5, "title": "ចំនួនទសភាគ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 6, "title": "ភាគរយ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 7, "title": "រង្វាស់រង្វាល់", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 8, "title": "កន្សោមពីជគណិត", "count": 50, "diff": {"ង": 12, "ម": 23, "ក": 10, "pisa": 5}},
    {"num": 9, "title": "សមីការដឺក្រេទី១", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 10, "title": "វិសមភាព", "count": 45, "diff": {"ង": 10, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 11, "title": "ផលធៀប និងសមាមាត្រ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 12, "title": "សញ្ញាណដំបូងធរណីមាត្រ", "count": 45, "diff": {"ង": 15, "ម": 18, "ក": 8, "pisa": 4}},
    {"num": 13, "title": "មុំ និងរង្វាស់មុំ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 14, "title": "បន្ទាត់ស្រប និងបន្ទាត់កែង", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 15, "title": "រូបធរណីមាត្រវិមាត្រពីរ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 16, "title": "បរិមាត្រ និងក្រឡាផ្ទៃ", "count": 60, "diff": {"ង": 15, "ម": 25, "ក": 15, "pisa": 5}},
    {"num": 17, "title": "រង្វង់", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 18, "title": "មាឌ និងក្រឡាផ្ទៃសូលីត", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 19, "title": "ភាពឆ្លុះ", "count": 44, "diff": {"ង": 14, "ម": 18, "ក": 8, "pisa": 4}},
    {"num": 20, "title": "ប្រូបាប", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 21, "title": "ក្រាបសសរ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 22, "title": "ក្រាបផ្លិត", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}}
]

G8_CHAPTERS_DEF = [
    {"num": 1, "title": "ចំនួនសនិទាន", "count": 52, "diff": {"ង": 15, "ម": 22, "ក": 10, "pisa": 5}},
    {"num": 2, "title": "ស្វ័យគុណ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 3, "title": "ទំហំសមាមាត្រ និងភាគរយ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 4, "title": "រង្វាស់រង្វាល់", "count": 45, "diff": {"ង": 15, "ម": 18, "ក": 8, "pisa": 4}},
    {"num": 5, "title": "កន្សោមពីជគណិត", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 6, "title": "កន្សោមសនិទាន", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 7, "title": "សមីការដឺក្រេទី១", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 8, "title": "វិសមីការដឺក្រេទី១", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 9, "title": "ប្លង់កូអរដោនេ និងក្រាប", "count": 52, "diff": {"ង": 15, "ម": 22, "ក": 10, "pisa": 5}},
    {"num": 10, "title": "ស្ថិតិ", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 11, "title": "ប្រូបាប", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 12, "title": "ការប្រៀបធៀបត្រីកោណ", "count": 56, "diff": {"ង": 16, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 13, "title": "ចតុកោណ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 14, "title": "ផ្ទៃក្រឡាពហុកោណ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 15, "title": "រង្វង់", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 16, "title": "អង្កត់ពិសេសក្នុងត្រីកោណ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 17, "title": "រូបធរណីមាត្រវិមាត្របី", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 18, "title": "មាត្រដ្ឋាន និងទិសដៅ", "count": 40, "diff": {"ង": 12, "ម": 18, "ក": 7, "pisa": 3}}
]

G9_CHAPTERS_DEF = [
    {"num": 1, "title": "ចំនួនអសនិទាន", "count": 60, "diff": {"ង": 15, "ម": 30, "ក": 10, "pisa": 5}},
    {"num": 2, "title": "សមាមាត្រ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 3, "title": "កន្សោមពីជគណិត", "count": 65, "diff": {"ង": 15, "ម": 35, "ក": 10, "pisa": 5}},
    {"num": 4, "title": "សមីការដឺក្រេទី១", "count": 60, "diff": {"ង": 15, "ម": 30, "ក": 10, "pisa": 5}},
    {"num": 5, "title": "វិសមីការដឺក្រេទី១", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 6, "title": "បំណែកចែកប្រេកង់", "count": 50, "diff": {"ង": 15, "ម": 20, "ក": 10, "pisa": 5}},
    {"num": 7, "title": "មធ្យមស្ថិតិ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 8, "title": "ប្រូបាប", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 9, "title": "ចម្ងាយរវាងពីរចំណុច", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 10, "title": "សមីការបន្ទាត់", "count": 60, "diff": {"ង": 15, "ម": 30, "ក": 10, "pisa": 5}},
    {"num": 11, "title": "ប្រព័ន្ធសមីការដឺក្រេទី១", "count": 65, "diff": {"ង": 15, "ម": 35, "ក": 10, "pisa": 5}},
    {"num": 12, "title": "ទ្រឹស្តីបទពីតាគ័រ", "count": 65, "diff": {"ង": 15, "ម": 35, "ក": 10, "pisa": 5}},
    {"num": 13, "title": "រង្វង់ និងបន្ទាត់", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 14, "title": "លក្ខណៈមុំនៃរង្វង់", "count": 60, "diff": {"ង": 15, "ម": 30, "ក": 10, "pisa": 5}},
    {"num": 15, "title": "ទ្រឹស្តីបទតាលែស", "count": 60, "diff": {"ង": 15, "ម": 30, "ក": 10, "pisa": 5}},
    {"num": 16, "title": "ត្រីកោណដូចគ្នា", "count": 60, "diff": {"ង": 15, "ម": 30, "ក": 10, "pisa": 5}},
    {"num": 17, "title": "ពហុកោណ", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}},
    {"num": 18, "title": "សូលីត", "count": 55, "diff": {"ង": 15, "ម": 25, "ក": 10, "pisa": 5}}
]

G10_CHAPTERS_DEF = [
    {"num": 1, "title": "ពហុធា និងវិធីចែកពហុធា", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 2, "title": "តក្កវិទ្យា សំណុំ និងចំនួន", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 3, "title": "សមីការ និងវិសមីការ", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 4, "title": "ធរណីមាត្រក្នុងប្លង់ និងបន្ទាត់-រង្វង់", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 5, "title": "ផលធៀបត្រីកោណមាត្រ", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 6, "title": "អនុគមន៍ និងក្រាប", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 7, "title": "ស្ថិតិ", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 8, "title": "វ៉ិចទ័រក្នុងប្លង់", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}},
    {"num": 9, "title": "ការបំប្លែងរូបក្នុងប្លង់", "count": 100, "diff": {"ង": 25, "ម": 50, "ក": 20, "pisa": 5}}
]

data["chapterMetadata"] = {
    "7": G7_CHAPTERS_DEF,
    "8": G8_CHAPTERS_DEF,
    "9": G9_CHAPTERS_DEF,
    "10": G10_CHAPTERS_DEF
}

# Update grade counts in grades array
data["grades"] = [
    {
        "id": 7,
        "name": "ថ្នាក់ទី ៧",
        "code": "G7",
        "count": 1235,
        "desc": "គណិតវិទ្យាថ្នាក់ទី ៧ កម្រិតមូលដ្ឋានគ្រឹះមធ្យមសិក្សាបឋមភូមិ (២២ មេរៀន)",
        "chaptersCount": 22
    },
    {
        "id": 8,
        "name": "ថ្នាក់ទី ៨",
        "code": "G8",
        "count": 950,
        "desc": "គណិតវិទ្យាថ្នាក់ទី ៨ ពង្រឹងមូលដ្ឋានពីជគណិត និងធរណីមាត្រ (១៨ មេរៀន)",
        "chaptersCount": 18
    },
    {
        "id": 9,
        "name": "ថ្នាក់ទី ៩",
        "code": "G9",
        "count": 1045,
        "desc": "គណិតវិទ្យាថ្នាក់ទី ៩ ត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ / ឌីប្លូម (១៨ មេរៀន)",
        "chaptersCount": 18
    },
    {
        "id": 10,
        "name": "ថ្នាក់ទី ១០",
        "code": "G10",
        "count": 900,
        "desc": "គណិតវិទ្យាថ្នាក់ទី ១០ មធ្យមសិក្សាទុតិយភូមិ កម្រិតខ្ពស់ និងត្រៀមបាក់ឌុប (៩ ជំពូកធំ)",
        "chaptersCount": 9
    }
]

# Ensure Grade 7 Chapter 1 has the specific questions shown in user's screenshots
specific_g7_questions = [
    {
        "id": "q_g7_c01_001",
        "grade": 7,
        "chapter": "មេរៀនទី ១ ចំនួនគត់",
        "category": "ចំនួនគត់",
        "type": "mcq",
        "difficulty": "ងាយ",
        "points": 1,
        "source": "ឃ្លាំងសំណួរ",
        "question": "ចំនួនគត់ដែលខុសពី ...... ហៅថា ចំនួនគត់ធម្មជាតិ ($1, 2, 3, 4, \\dots$) ។",
        "options": [
            {"key": "ក", "text": "$1$"},
            {"key": "ខ", "text": "$10$"},
            {"key": "គ", "text": "$9$"},
            {"key": "ឃ", "text": "$0$"}
        ],
        "answer": "ឃ",
        "explanation": "ចំនួនគត់ធម្មជាតិ គឺជាចំនួនគត់ដែលខុសពី ០ (ចាប់ពី ១, ២, ៣... ឡើងទៅ)។"
    },
    {
        "id": "q_g7_c01_002",
        "grade": 7,
        "chapter": "មេរៀនទី ១ ចំនួនគត់",
        "category": "ចំនួនគត់",
        "type": "mcq",
        "difficulty": "ងាយ",
        "points": 1,
        "source": "ឃ្លាំងសំណួរ",
        "question": "នៅលើបន្ទាត់ចំនួន ចំនួនគត់ដែលស្ថិតនៅខាងស្ដាំ ធៀបនឹងចំនួនគត់ដែលស្ថិតនៅខាងឆ្វេង គឺ៖",
        "options": [
            {"key": "ក", "text": "ស្មើគ្នា"},
            {"key": "ខ", "text": "តូចជាង"},
            {"key": "គ", "text": "មិនអាចប្រៀបធៀបបាន"},
            {"key": "ឃ", "text": "ធំជាង"}
        ],
        "answer": "ឃ",
        "explanation": "នៅលើបន្ទាត់ចំនួន គ្រប់ចំនួនស្ថិតនៅខាងស្តាំតែងតែធំជាងចំនួនស្ថិតនៅខាងឆ្វេង។"
    },
    {
        "id": "q_g7_c01_003",
        "grade": 7,
        "chapter": "មេរៀនទី ១ ចំនួនគត់",
        "category": "ចំនួនគត់",
        "type": "mcq",
        "difficulty": "ងាយ",
        "points": 1,
        "source": "ឃ្លាំងសំណួរ",
        "question": "ចំនួនណាមួយខាងក្រោមជាចំនួនគត់គូ?",
        "options": [
            {"key": "ក", "text": "$135$"},
            {"key": "ខ", "text": "$248$"},
            {"key": "គ", "text": "$91$"},
            {"key": "ឃ", "text": "$77$"}
        ],
        "answer": "ខ",
        "explanation": "ចំនួនគត់គូ គឺជាចំនួនដែលមានលេខខ្ទង់រាយជា 0, 2, 4, 6, ឬ 8 (248 ចែកដាច់នឹង 2)។"
    },
    {
        "id": "q_g7_c01_004",
        "grade": 7,
        "chapter": "មេរៀនទី ១ ចំនួនគត់",
        "category": "ចំនួនគត់",
        "type": "mcq",
        "difficulty": "ងាយ",
        "points": 1,
        "source": "ឃ្លាំងសំណួរ",
        "question": "ធ្វើវិធីបូក $735 + 196 =$",
        "options": [
            {"key": "ក", "text": "$831$"},
            {"key": "ខ", "text": "$931$"},
            {"key": "គ", "text": "$921$"},
            {"key": "ឃ", "text": "$941$"}
        ],
        "answer": "ខ",
        "explanation": "735 + 196 = 931"
    },
    {
        "id": "q_g7_c01_005",
        "grade": 7,
        "chapter": "មេរៀនទី ១ ចំនួនគត់",
        "category": "ចំនួនគត់",
        "type": "mcq",
        "difficulty": "ងាយ",
        "points": 1,
        "source": "ឃ្លាំងសំណួរ",
        "question": "ធ្វើវិធីដក $8\\,023 - 4\\,571 =$",
        "options": [
            {"key": "ក", "text": "$3\\,452$"},
            {"key": "ខ", "text": "$3\\,442$"},
            {"key": "គ", "text": "$3\\,552$"},
            {"key": "ឃ", "text": "$3\\,462$"}
        ],
        "answer": "ក",
        "explanation": "8023 - 4571 = 3452"
    },
    {
        "id": "q_g7_c01_006",
        "grade": 7,
        "chapter": "មេរៀនទី ១ ចំនួនគត់",
        "category": "ចំនួនគត់",
        "type": "mcq",
        "difficulty": "ងាយ",
        "points": 1,
        "source": "ឃ្លាំងសំណួរ",
        "question": "តម្លៃខ្ទង់របស់លេខ $7$ ក្នុងចំនួន $8\\,704\\,526$ គឺ៖",
        "options": [
            {"key": "ក", "text": "$7$"},
            {"key": "ខ", "text": "$700$"},
            {"key": "គ", "text": "$700\\,000$"},
            {"key": "ឃ", "text": "$7\\,000\\,000$"}
        ],
        "answer": "គ",
        "explanation": "លេខ 7 ស្ថិតនៅខ្ទង់សែន មានតម្លៃស្មើនឹង 700 000។"
    }
]

# Insert specific questions at the start of questionBank
existing_q_ids = {q["id"] for q in data["questionBank"]}
for q in reversed(specific_g7_questions):
    if q["id"] in existing_q_ids:
        # Update existing
        for idx, item in enumerate(data["questionBank"]):
            if item["id"] == q["id"]:
                data["questionBank"][idx] = q
                break
    else:
        data["questionBank"].insert(0, q)
        existing_q_ids.add(q["id"])

# Save updated math_data.js
js_code = "/* KPCambodianmathematics Comprehensive Data Store */\n"
js_code += "window.MATH_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"

with open("math_data.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("math_data.js enriched with exact user screenshot questions and metadata.")
