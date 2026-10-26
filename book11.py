# -*- coding: utf-8 -*-
"""
Grade 11 lessons from the Ministry textbooks (PDF only, folder ថ្នាក់ទី១១).

The PDFs use a legacy (non-Unicode) Khmer font, so their text cannot be
extracted. Each lesson is therefore shown as the textbook pages themselves:
every page is rendered to lesson/g11/pages/<book>-<page>.webp and the lesson
JSON (book/g11/L<nn>.json) lists them, in the same format as book2web.py.

Lessons and page numbers come from each book's table of contents.
Needs pdftoppm (poppler) and Pillow.

Run:  python book11.py
"""
import concurrent.futures as cf
import glob
import json
import os
import re
import subprocess
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "ថ្នាក់ទី១១")
OUT = os.path.join(ROOT, "book", "g11")
PAGES = os.path.join(ROOT, "lesson", "g11", "pages")
TEXDIR = os.path.join(ROOT, "ថ្នាក់ទី១១-latex")
WIDTH = 1100
QUALITY = 62
KHNUM = "០១២៣៤៥៦៧៨៩"


def kh(n):
    return "".join(KHNUM[int(c)] if c.isdigit() else c for c in str(n))


# key, file, track, PDF page of book page 1, crop box (fractions of the page) or None,
# chapters: (number, title, [(lesson title, first book page)]), last book page of the lessons
BOOKS = [
    ("sc1", "Math G11 Sc(Part1).pdf", "ថ្នាក់វិទ្យាសាស្ត្រ", 6, None, [
        (1, "ស៊ីតនិងអនុមានរួមគណិតវិទ្យា", [("ស៊ីតចំនួនពិត", 2), ("ស៊ីតនព្វន្ត", 8), ("ស៊ីតធរណីមាត្រ", 14),
                                          ("ផលបូកតួនៃស៊ីតផ្សេងៗ", 24), ("ទំនាក់ទំនងតួនៃស៊ីត", 36), ("វិចារអនុមានរួមគណិតវិទ្យា", 44)]),
        (2, "អនុគមន៍អិចស្ប៉ូណង់ស្យែលនិងអនុគមន៍លោការីត", [("អនុគមន៍អិចស្ប៉ូណង់ស្យែល", 58), ("អនុគមន៍លោការីត", 72)]),
        (3, "អនុគមន៍ត្រីកោណមាត្រ", [("អនុគមន៍ត្រីកោណមាត្រ", 90), ("រូបមន្តត្រីកោណមាត្រ", 110),
                                  ("អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ", 120), ("សមីការនិងវិសមីការត្រីកោណមាត្រ", 128),
                                  ("សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត", 142)]),
        (4, "ម៉ាទ្រីស ដេទែរមីណង់ និងបម្លែងលីនេអ៊ែរ", [("ម៉ាទ្រីស", 162), ("ដេទែរមីណង់", 180), ("ការបំប្លែងលីនេអ៊ែរ", 188)]),
    ], 217),
    ("sc2", "Math G11 Sc(Part2).pdf", "ថ្នាក់វិទ្យាសាស្ត្រ", 6, (48 / 595.22, 67 / 842, 547.5 / 595.22, 775 / 842), [
        (5, "លីមីតនិងដេរីវេ", [("លីមីតនិងដេរីវេ", 2), ("អនុវត្តន៍នៃដេរីវេ", 22), ("អថេរភាពនិងក្រាបនៃអនុគមន៍", 36),
                             ("អនុវត្តន៍ដេរីវេចំពោះសមីការនិងវិសមីការ", 54)]),
        (6, "ចម្លាស់ បន្សំ និងប្រូបាប", [("ចម្លាស់", 78), ("បន្សំ", 92), ("ប្រូបាប", 102)]),
        (7, "ស្ថិតិ", [("រង្វាស់ទីតាំងនៃទិន្នន័យ", 136), ("រង្វាស់នៃគម្លាត", 144)]),
        (8, "ធរណីមាត្រក្នុងលំហ", [("រូបធរណីមាត្រក្នុងលំហ", 160), ("បន្ទាត់និងប្លង់ស្របក្នុងលំហ", 170),
                                ("ភាពអរតូកូណាល់ក្នុងលំហ", 178)]),
    ], 200),
    ("ss", "Math G11 Ss.pdf", "ថ្នាក់វិទ្យាសាស្ត្រសង្គម", 6, None, [
        (1, "ស៊ីត", [("ស៊ីតចំនួនពិត", 2), ("ស៊ីតនព្វន្ត", 8), ("ស៊ីតធរណីមាត្រ", 14)]),
        (2, "អនុគមន៍អិចស្ប៉ូណង់ស្យែលនិងអនុគមន៍លោការីត", [("អនុគមន៍អិចស្ប៉ូណង់ស្យែល", 28), ("អនុគមន៍លោការីត", 48)]),
        (3, "អនុគមន៍ត្រីកោណមាត្រ", [("អនុគមន៍ត្រីកោណមាត្រ", 70), ("រូបមន្តត្រីកោណមាត្រ", 90),
                                  ("អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ", 100), ("សមីការនិងវិសមីការត្រីកោណមាត្រ", 108)]),
        (4, "ម៉ាទ្រីសនិងដេទែរមីណង់", [("ម៉ាទ្រីស", 126), ("ដេទែរមីណង់", 144)]),
        (5, "លីមីតនិងដេរីវេ", [("លីមីតនិងដេរីវេ", 154), ("អនុវត្តន៍នៃដេរីវេ", 174), ("អថេរភាពនិងក្រាបនៃអនុគមន៍", 188)]),
        (6, "ចម្លាស់ បន្សំ និងប្រូបាប", [("ចម្លាស់", 214), ("បន្សំ", 228), ("ប្រូបាប", 238)]),
        (7, "ស្ថិតិ", [("រង្វាស់ទីតាំងនៃទិន្នន័យ", 268), ("រង្វាស់នៃគម្លាត", 276)]),
        (8, "ធរណីមាត្រក្នុងលំហ", [("រូបធរណីមាត្រក្នុងលំហ", 290), ("បន្ទាត់និងប្លង់ស្របក្នុងលំហ", 300),
                                ("ភាពអរតូកូណាល់ក្នុងលំហ", 308)]),
    ], 329),
]


def plan():
    lessons = []
    for key, f, track, off, crop, chapters, last in BOOKS:
        flat = []
        for no, ctitle, ls in chapters:
            for k, (t, p) in enumerate(ls):
                start = p - 1 if k == 0 else p          # the chapter's opening page goes with its first lesson
                flat.append({"key": key, "file": f, "track": track, "off": off, "crop": crop,
                             "chapter": no, "ctitle": ctitle, "lno": k + 1, "title": t, "start": start})
        for i, L in enumerate(flat):
            L["end"] = flat[i + 1]["start"] - 1 if i + 1 < len(flat) else last
        lessons += flat
    return lessons


def page_name(key, p):
    return f"{key}-p{p:03d}.webp"


def render_range(job):
    key, f, off, crop, a, b = job
    todo = [p for p in range(a, b + 1) if not os.path.exists(os.path.join(PAGES, page_name(key, p)))]
    if not todo:
        return 0
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(["pdftoppm", "-r", "170", "-png", "-f", str(todo[0] + off), "-l", str(todo[-1] + off),
                        os.path.join(SRC, f), os.path.join(d, "p")], check=True)
        for png in sorted(glob.glob(os.path.join(d, "p-*.png"))):
            p = int(re.search(r"-(\d+)\.png$", png).group(1)) - off
            if p not in todo:
                continue
            im = Image.open(png).convert("RGB")
            if crop:
                w, h = im.size
                im = im.crop((round(crop[0] * w), round(crop[1] * h), round(crop[2] * w), round(crop[3] * h)))
            im = im.resize((WIDTH, round(im.size[1] * WIDTH / im.size[0])), Image.LANCZOS)
            im.save(os.path.join(PAGES, page_name(key, p)), "WEBP", quality=QUALITY, method=6)
    return len(todo)


# multiple-choice questions written for the website: ថ្នាក់ទី១១-latex/mcq/<sc|ss>/Lnn.json
# items {"q": stem, "o": [options], "a": index of the answer, "e": explanation} with $...$ math.
# Social-science lessons that are the same as a science lesson reuse its questions.
SS_SAME_AS_SC = {1: 1, 2: 2, 3: 3, 6: 9, 7: 10, 8: 11, 9: 12, 10: 14, 11: 15, 12: 17, 13: 18, 14: 19,
                 15: 21, 16: 22, 17: 23, 18: 24, 19: 25, 20: 26, 21: 27, 22: 28}


def _mq_html(t):
    t = re.sub(r"\$\$(.+?)\$\$", lambda m: '<span class="mi">\\(\\displaystyle ' + m.group(1) + '\\)</span>', t, flags=re.S)
    return re.sub(r"\$(.+?)\$", lambda m: '<span class="mi">\\(' + m.group(1) + '\\)</span>', t, flags=re.S)


def load_mcq(track, n):
    p = os.path.join(TEXDIR, "mcq", track, f"L{n:02d}.json")
    if not os.path.exists(p) and track == "ss" and n in SS_SAME_AS_SC:
        p = os.path.join(TEXDIR, "mcq", "sc", f"L{SS_SAME_AS_SC[n]:02d}.json")
    if not os.path.exists(p):
        return []
    out = []
    for q in json.load(open(p, encoding="utf-8")):
        out.append({"stem": _mq_html(q["q"]), "options": [_mq_html(o) for o in q["o"]], "answer": q["a"],
                    "sol": _mq_html(q.get("e", ""))})
    return out


def main():
    os.makedirs(PAGES, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    ls = plan()
    jobs = []
    for L in ls:                        # ~10 pages per job
        for a in range(L["start"], L["end"] + 1, 10):
            jobs.append((L["key"], L["file"], L["off"], L["crop"], a, min(a + 9, L["end"])))
    with cf.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        n = sum(ex.map(render_range, jobs))
    print(f"rendered {n} pages")
    for f in glob.glob(os.path.join(OUT, "L*.json")):
        os.remove(f)
    # lessons already typed in LaTeX (ថ្នាក់ទី១១-latex/sc/Lnn.tex, ss/Lnn.tex) become real text lessons
    track_no, texs, track_no_of = {}, {}, {}
    for i, L in enumerate(ls, 1):
        t = "ss" if L["key"] == "ss" else "sc"
        track_no[t] = track_no.get(t, 0) + 1
        track_no_of[i] = track_no[t]
        p = os.path.join(TEXDIR, t, f"L{track_no[t]:02d}.tex")
        if os.path.exists(p):
            texs[i] = p
    if texs:
        import book2web as B
        B.BOXES.setdefault("objBox", ("bx-white", "វត្ថុបំណង", 0))
        for p in texs.values():
            B.pre_latex(open(p, encoding="utf-8").read())
        B.render_all_figures()
    part_no, last = 0, None
    for i, L in enumerate(ls, 1):
        part = f"{L['track']} · ជំពូកទី {kh(L['chapter'])} {L['ctitle']}"
        if part != last:
            part_no, last = part_no + 1, part
        pages = list(range(L["start"], L["end"] + 1))
        toc = []
        html = (f'<div class="pdf-note">មេរៀននេះបង្ហាញជាទំព័រពីសៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី ១១ ({L["track"]}) '
                f'ទំព័រ {kh(pages[0])}–{kh(pages[-1])}។</div>')
        for p in pages:
            pid = f"p{p}"
            toc.append({"id": pid, "html": f"ទំព័រ {kh(p)}"})
            html += (f'<figure class="bk-page" id="{pid}"><img src="pages/{page_name(L["key"], p)}" '
                     f'alt="ទំព័រ {kh(p)}" loading="lazy" width="{WIDTH}"><figcaption>ទំព័រ {kh(p)}</figcaption></figure>')
        data = {"grade": 11, "num": i, "title": L["title"], "part": L["ctitle"], "part_head": part,
                "part_no": part_no, "html": html, "toc": toc, "mcq": [], "exercises": [],
                "track": L["track"], "pages": [pages[0], pages[-1]]}
        if i in texs:
            src = B.strip_comments(open(texs[i], encoding="utf-8").read())
            src = re.sub(r"\\chapter\*?\{[^}]*\}", "", src, count=1)
            sol = None
            m_ex = re.search(r"\\section\*?\{\s*លំហាត់អនុវត្ត[^}]*\}", src)
            if m_ex and "\\ans" in src[m_ex.end():]:
                # answers written as "\ans ..." at the end of an exercise item -> hidden solutions
                items, _ = B.parse_exercises(src[m_ex.end():])
                sols, ex_tail = {}, src[m_ex.end():]
                for k, it in enumerate(items, 1):
                    mm = re.search(r"\n\s*\\ans\b", it)
                    if mm:
                        sols[k] = it[mm.end():].strip()
                        ex_tail = ex_tail.replace(it, it[:mm.start()], 1)
                src = src[:m_ex.end()] + ex_tail
                sol = {"mcq": [], "sols": sols}
            d = B.build_lesson(11, i, {"title": L["title"], "body": src, "part": None, "part_no": None}, sol)
            data.update(html=d["html"] + '<h3>ទំព័រសៀវភៅដើម</h3><details class="ans sol-all"><summary>បើកមើលទំព័រសៀវភៅពុម្ព</summary>' + html + "</details>",
                        toc=d["toc"] + [{"id": "", "html": "ទំព័រសៀវភៅដើម"}], mcq=d["mcq"], exercises=d["exercises"], typed=True)
            n_h3 = len(d["toc"]) + 1
            data["html"] = data["html"].replace("<h3>ទំព័រសៀវភៅដើម</h3>", f'<h3 id="u{n_h3}">ទំព័រសៀវភៅដើម</h3>')
            data["toc"][-1]["id"] = f"u{n_h3}"
        t = "ss" if L["key"] == "ss" else "sc"
        mq = load_mcq(t, track_no_of[i])
        if mq:
            data["mcq"] = mq
        json.dump(data, open(os.path.join(OUT, f"L{i:02d}.json"), "w", encoding="utf-8"), ensure_ascii=False)
        print(f"G11 L{i:02d} {L['key']} p{pages[0]}-{pages[-1]} {L['title']}")


if __name__ == "__main__":
    main()
