import json

with open('math_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'window.MATH_DATA = '
idx = text.find(prefix)
data = json.loads(text[idx + len(prefix):].rstrip(';\n '))

qb = data.get('questionBank', [])
for g in [7, 8, 9, 10]:
    g_qb = [q for q in qb if q.get('grade') == g]
    print(f"Grade {g} in questionBank: {len(g_qb)} questions")
    # check chapters
    ch_map = {}
    for q in g_qb:
        ch = q.get('chapter', 'Unknown')
        ch_map[ch] = ch_map.get(ch, 0) + 1
    print(f"  Chapters count: {len(ch_map)}")
    for ch, count in list(ch_map.items())[:3]:
        print(f"    - {ch}: {count}")
