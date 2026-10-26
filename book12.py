# -*- coding: utf-8 -*-
"""
Convert the grade 12 LaTeX books (folder ថ្នាក់ទី១២, one book per topic) into
lesson data for the website, in the same format as book2web.py:

  book/g12/L<nn>.json   title, part (topic book), html (theory + exercises
                        + worked solutions), toc, mcq (with answers), exercises

Each topic book becomes a "part" (ជំពូក) and each of its lessons a page.
MCQ answer keys are read from the answer tables in the solution files.
TikZ figures are rendered to lesson/fig/<hash>.svg (xelatex + pdftocairo).

Run:  python book12.py
"""
import concurrent.futures as cf
import json
import os
import re
import sys

import book2web as B
from bs4 import BeautifulSoup

ROOT = B.ROOT
SRC = os.path.join(ROOT, "ថ្នាក់ទី១២")
OUT = os.path.join(ROOT, "book", "g12")
G = 12
KH_ANS = "កខគឃង"

# (folder, part title, lessons, solutions)
#   lessons:   list of (tex file, title or None = the \chapter title)
#   solutions: "split:<file>:<regex>"  one chunk per lesson (MCQ key + worked solutions)
#              or list of files (one per lesson; None = no solutions)
BOOKS = [
    ("Book Complex Number Grade 12", "ចំនួនកុំផ្លិច",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None), ("chapter 4.tex", None)],
     "complex"),
    ("Book Limit Grade 12", "លីមីត",
     [("limit_chapter1.tex", "មេរៀនសង្ខេប លីមីតនៃអនុគមន៍"), ("limit_chapter2.tex", "វិធីសាស្ត្រគណនាលីមីត"),
      ("limit_chapter3.tex", "លំហាត់ និងដំណោះស្រាយ លីមីត"), ("limit_chapter4.tex", "លំហាត់ប្រតិបត្តិ លីមីត")],
     [None, None, None, "limit_chapter5.tex"]),
    ("Book Derivative Grade 12", "ដេរីវេ",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None)],
     r"split:chapter 4.tex:\\subsection\*\{ក\.\s*ចម្លើយសំណួរពហុជ្រើសរើស"),
    ("Book function Grade 12", "អនុគមន៍",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None)],
     r"split:chapter 4.tex:\\subsection\*\{ក\.\s*ចម្លើយសំណួរពហុជ្រើសរើស"),
    ("Book Intergation Grade 12", "អាំងតេក្រាល",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None), ("chapter 4.tex", None)],
     ["solutions_chapter1.tex", "solutions_chapter2.tex", "solutions_chapter3.tex", "solutions_chapter4.tex"]),
    ("Book Differetial equation Grade 12", "សមីការឌីផេរ៉ង់ស្យែល",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None), ("bacii.tex", None)],
     r"split:solutions.tex:តារាងចម្លើយសំណួរពហុជ្រើសរើស"),
    ("Book probabilities Grade 12", "ប្រូបាប",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None), ("bacii.tex", None)],
     [["ans_key_ch1.tex", "sol_chapter1.tex"], ["ans_key_ch2.tex", "sol_chapter2.tex"],
      ["ans_key_ch3.tex", "sol_chapter3.tex"], ["sol_bacii.tex"]]),
    ("Book Conic Grade 12", "កោនិក",
     [("intro_conic.tex", None), ("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None)],
     [None, "solutions_ch1.tex", "solutions_ch2.tex", "solutions_ch3.tex"]),
    ("Book Geometry Grade 12", "វ៉ិចទ័រ និងធរណីមាត្រក្នុងលំហ",
     [("chapter 1.tex", None), ("chapter 2.tex", None), ("chapter 3.tex", None)],
     r"split:solutions.tex:តារាងចម្លើយសំណួរពហុជ្រើសរើស \(MCQ 100\) — មេរៀនទី"),
]

# extra boxes used by the grade 12 books (added to book2web's list)
B.BOXES.update({
    "remark": ("bx-green", "សម្គាល់", 0),
    "noteBox": ("bx-green", "សម្គាល់", 0),
    "property": ("bx-amber", "លក្ខណៈ", 0),
    "myproposition": ("bx-amber", "សំណើ", 0),
    "answerBox": ("bx-green", "ចម្លើយ", 0),
    "shortAnsBox": ("bx-green", "ចម្លើយខ្លី", 0),
    "solutionBox": ("bx-green", "ដំណោះស្រាយ", 0),
    "solution": ("bx-green", "ដំណោះស្រាយ", 0),
    "solExerciseBox": ("bx-try", "លំហាត់", 0),
    "problembox": ("bx-try", "លំហាត់", 0),
    "problem": ("bx-try", "លំហាត់", 0),
    "problems": ("bx-try", "លំហាត់", 0),
    "exercises": ("bx-try", "លំហាត់", 0),
    "exampBox": ("bx-gray bx-ex", "ឧទាហរណ៍", 0),
    "imageTwoBox": ("bx-rule", "រូបមន្តសំខាន់ៗ", 0),
    "appBox": ("bx-white", "", 0),
    "marker": ("bx-white", "", 0),
})


_pandoc = B.pandoc


def safe_pandoc(latex):
    """book2web.pandoc, but a stray brace that stops pandoc is dropped and the run retried."""
    nmac = len(B.PANDOC_MACROS.split("\n"))
    for _ in range(40):
        try:
            return _pandoc(latex)
        except RuntimeError as e:
            m = re.search(r"line (\d+), column (\d+)", str(e))
            if not m:
                raise
            ln, col = int(m.group(1)) - 1 - nmac, int(m.group(2)) - 1
            lines = latex.split("\n")
            if not (0 <= ln < len(lines)) or col >= len(lines[ln]) + 1:
                raise
            s = lines[ln]
            lines[ln] = s[:col] + s[col + 1:] if col < len(s) else s[:-1]
            latex = "\n".join(lines)
    return _pandoc(latex)


B.pandoc = safe_pandoc


# ------------------------------------------------------------- reading
def read(book, name):
    p = os.path.join(SRC, book, name)
    t = open(p, encoding="utf-8", errors="replace").read()
    return t


def expand_inputs(book, t, depth=0):
    t = B.strip_comments(t)
    if depth > 4:
        return t

    def sub(m):
        name = m.group(1).strip('"')
        if not name.endswith(".tex"):
            name += ".tex"
        p = os.path.join(SRC, book, name)
        if not os.path.exists(p):
            return ""
        return "\n" + expand_inputs(book, read(book, name), depth + 1) + "\n"
    return re.sub(r'\\(?:input|include)\{([^}]*)\}', sub, t)


NOISE = [
    r"\\(phantomsection|newpage|clearpage|cleardoublepage|thispagestyle\{[^}]*\}|pagestyle\{[^}]*\})",
    r"\\addcontentsline\{[^}]*\}\{[^}]*\}\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}",
    r"\\markright\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}",
    r"\\markboth\{(?:[^{}]|\{[^{}]*\})*\}\{(?:[^{}]|\{[^{}]*\})*\}",
    r"\\fancyhead\[[^\]]*\]\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}",
    r"\\fancyfoot\[[^\]]*\]\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}",
    r"\\[Nn]eedspace\*?\{[^}]*\}",
    r"\\(setcounter|addtocounter)\{[^}]*\}\{[^}]*\}",
    r"\\label\{[^}]*\}",
    r"\\protect\b",
    r"\\kml\b",
    r"\\khmerM\b",
    r"\\(bfseries|itshape|mdseries|normalfont)\b",
]


def denoise(t):
    for p in NOISE:
        t = re.sub(p, " ", t)
    # \tikz[...]\node[...]{ក}; (letter badges) -> the letter
    t = re.sub(r"\\tikz\s*(\[[^\]]*\])?\s*\\node\s*(\[[^\]]*\])?\s*\{([^{}]*)\}\s*;", r"\3", t)
    return t


# ------------------------------------------------------ answer keys
def clean_cell(c):
    c = re.sub(r"\\(cellcolor|rowcolor|color)(\[[^\]]*\])?\{[^}]*\}", "", c)
    c = re.sub(r"\\textcolor\{[^}]*\}", "", c)
    c = re.sub(r"\\multicolumn\{\d+\}\{[^}]*\}", "", c)
    c = re.sub(r"\\[a-zA-Z]+\*?", "", c)
    c = re.sub(r"[{}$~]", "", c)
    return c.strip()


def is_num(c):
    return bool(c) and all(ch.isdigit() for ch in c)


def parse_keys(t):
    """All (number -> letter index) pairs found in the tabulars of t."""
    keys = {}
    pos = 0
    while True:
        r = B.find_env(t, "tabular", pos)
        if not r:
            break
        b, bs, be, ee = r
        pos = ee
        _, _, bs2 = B.take_args(t, bs, True, 1)
        body = t[bs2:be]
        rows = [[clean_cell(c) for c in row.split("&")] for row in re.split(r"\\\\", body.replace("\\hline", ""))]
        rows = [r_ for r_ in rows if any(r_)]
        i = 0
        while i < len(rows):
            row = rows[i]
            pairs = [(row[k], row[k + 1]) for k in range(0, len(row) - 1, 2)]
            if pairs and all(is_num(a) and len(bb) == 1 and bb in KH_ANS for a, bb in pairs if a or bb):
                for a, bb in pairs:
                    if a and bb:
                        keys[B.kh2int(a)] = KH_ANS.index(bb)
                i += 1
                continue
            if all(is_num(c) for c in row if c) and i + 1 < len(rows):
                nxt = rows[i + 1]
                if all((len(c) == 1 and c in KH_ANS) for c in nxt if c) and any(nxt):
                    for a, bb in zip(row, nxt):
                        if a and bb:
                            keys[B.kh2int(a)] = KH_ANS.index(bb)
                    i += 2
                    continue
            i += 1
    return keys


# ------------------------------------------------------------ MCQ
MCQ_MARK = re.compile(r"ពហុជ្រើសរើស|\\mcqsectionheader")


def take_mcq(t):
    """Find the MCQ block of a lesson. Returns (text without it, list of {stem, options})."""
    m = None
    for x in MCQ_MARK.finditer(t):
        line_s = t.rfind("\n", 0, x.start()) + 1
        line = t[line_s:t.find("\n", x.end()) if t.find("\n", x.end()) > 0 else len(t)]
        if re.search(r"\\(section|subsection|chapter|textbf|Large|large|mcqsectionheader)", line) or "{\\Large" in line:
            m = x
            break
    if not m:
        return t, []
    start = t.rfind("\n", 0, m.start()) + 1
    # include an opening \begin{center} / \section a few lines up
    back = t[max(0, start - 400):start]
    cm = list(re.finditer(r"\\begin\{center\}", back))
    if cm and "\\end{center}" not in back[cm[-1].end():]:
        start = start - len(back) + cm[-1].start()
    rest = t[m.end():]
    qs = []
    if "\\mcqq{" in rest[:20000]:
        parts = re.split(r"\\mcqq\{[^}]*\}", rest)
        end_rel = len(rest)
        for p in parts[1:]:
            mm = re.search(r"\\mcq(four|two|one)\b", p)
            if not mm:
                continue
            k = mm.start()
            stem = re.sub(r"\\noindent", "", p[:k]).strip()
            _, args, e = B.take_args(p, mm.end(), False, 4)
            qs.append({"stem": stem, "options": [a.strip() for a in args]})
        # stop the block at the next \section / \chapter after the questions
        last = max(rest.rfind("\\mcqfour"), rest.rfind("\\mcqtwo"), rest.rfind("\\mcqone"))
        nx = re.search(r"\\(section|chapter)\*?\{", rest[last:])
        end = m.end() + (last + nx.start() if nx else len(rest))
        return t[:start] + "\n\n" + t[end:], qs
    r = B.find_env(rest, "enumerate")
    if not r or r[0] > 6000:
        return t, []
    b, bs, be, ee = r
    qs = B.parse_mcq(rest[b:ee])
    qs = [q for q in qs if len(q["options"]) >= 2]
    end = m.end() + ee
    return t[:start] + "\n\n" + t[end:], qs


# ------------------------------------------------------ solutions
def top_env_start(t, i):
    """Start of the outermost environment that contains position i (or i itself)."""
    depth, starts = 0, []
    for m in re.finditer(r"\\(begin|end)\{([^}]*)\}", t[:i]):
        if m.group(1) == "begin":
            starts.append(m.start())
        elif starts:
            starts.pop()
    return starts[0] if starts else t.rfind("\n", 0, i) + 1


def split_chunks(t, regex):
    pos = [top_env_start(t, m.start()) for m in re.finditer(regex, t)]
    out = []
    for k, s in enumerate(pos):
        e = pos[k + 1] if k + 1 < len(pos) else len(t)
        out.append(t[s:e])
    return out


def book_solutions(folder, spec, n):
    """Return n chunks of LaTeX (or None) with the MCQ key + worked solutions of each lesson."""
    if spec == "complex":
        t = expand_inputs(folder, read(folder, "chapter 5.tex"))
        secs = split_chunks(t, r"\\section\{")
        keysec = secs[0] if secs else ""
        keys = split_chunks(keysec, r"\\subsection\*\{តារាងចម្លើយ")
        sols = secs[1:]
        out = []
        for i in range(n):
            ch = (keys[i] if i < len(keys) else "")
            if i < 3:
                ch += "\n\n" + (sols[i] if i < len(sols) else "")
            else:
                ch += "\n\n" + "\n\n".join(sols[3:])
            out.append(ch)
        return out
    if isinstance(spec, str) and spec.startswith("split:"):
        _, f, rx = spec.split(":", 2)
        t = expand_inputs(folder, read(folder, f))
        ch = split_chunks(t, rx)
        if len(ch) > n:
            ch = ch[:n - 1] + ["\n\n".join(ch[n - 1:])]
        return ch + [None] * (n - len(ch))
    out = []
    for s in spec:
        if s is None:
            out.append(None)
        elif isinstance(s, list):
            out.append("\n\n".join(expand_inputs(folder, read(folder, x)) for x in s))
        else:
            out.append(expand_inputs(folder, read(folder, s)))
    return out + [None] * (n - len(out))


def prep_solutions(t):
    t = denoise(t)
    t = re.sub(r"\\ans\{([^{}]*)\}", r"\\textbf{\1}", t)
    t = re.sub(r"\\(chapter)\*?\{(?:[^{}]|\{[^{}]*\})*\}", "", t)
    # \section -> \subsection etc. so headings stay below the lesson's own headings
    t = re.sub(r"\\subsubsection(\*?)\{", r"\\paragraph\1{", t)
    t = re.sub(r"\\subsection(\*?)\{", r"\\subsubsection\1{", t)
    t = re.sub(r"\\section(\*?)\{", r"\\subsection\1{", t)
    return t


# ------------------------------------------------------------ lessons
def chapter_title(t):
    m = re.search(r"\\chapter\*?(\[[^\]]*\])?\{", t)
    if not m:
        return None, t
    e = B.group(t, m.end() - 1)
    title = t[m.end():e - 1]
    return title, t[:m.start()] + t[e:]


def clean_title(s):
    s = re.sub(r"\$([^$]*)\$", r"\1", s)
    s = re.sub(r"\\text\{([^{}]*)\}", r"(\1)", s)
    s = re.sub(r"\\(kml|khmerM|protect|newline|\\)", " ", s)
    s = re.sub(r"^\s*មេរៀនទី\s*[០-៩0-9]+\s*", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("( (", "(").replace(") )", ")")
    return s


def plan():
    lessons = []
    for part_no, (folder, part, files, solspec) in enumerate(BOOKS, 1):
        sols = book_solutions(folder, solspec, len(files))
        for k, (f, title) in enumerate(files):
            t = expand_inputs(folder, read(folder, f))
            ct, t = chapter_title(t)
            t = denoise(t)
            lessons.append({"folder": folder, "part": part, "part_no": part_no,
                            "title": title or clean_title(ct or part),
                            "body": t, "sol": sols[k] if k < len(sols) else None})
    return lessons


def demote(html):
    soup = BeautifulSoup(html, "html.parser")
    for h in soup.find_all(["h3", "h4", "h5"]):
        h.name = {"h3": "h4", "h4": "h5", "h5": "h5"}[h.name]
    return str(soup)


def build(n, L):
    figprefix = "../fig/"
    body, qs = take_mcq(L["body"])
    keys = parse_keys(L["sol"]) if L["sol"] else {}
    html = B.convert_many([body], figprefix)[0]
    html = B.structure_examples(html)

    mcq = []
    if qs:
        frags = []
        for q in qs:
            frags.append(q["stem"])
            frags.extend(q["options"])
        conv = B.convert_many([denoise(f) for f in frags], figprefix)
        k = 0
        for i, q in enumerate(qs):
            stem = B.strip_p(conv[k]); k += 1
            opts = [B.strip_p(conv[k + j]) for j in range(len(q["options"]))]
            k += len(q["options"])
            ans = keys.get(i + 1)
            mcq.append({"stem": stem, "options": opts, "answer": ans if ans is not None and ans < len(opts) else None})

    if L["sol"]:
        sh = B.convert_many([prep_solutions(L["sol"])], figprefix)[0]
        sh = B.structure_examples(sh)
        html += ('<h3>ចម្លើយ និងដំណោះស្រាយ</h3><details class="ans sol-all"><summary>បើកមើលចម្លើយ និងដំណោះស្រាយលម្អិត</summary>'
                 + demote(sh) + "</details>")

    soup = BeautifulSoup(html, "html.parser")
    toc = []
    for u, h in enumerate(soup.find_all("h3"), 1):
        h["id"] = f"u{u}"
        toc.append({"id": f"u{u}", "html": h.decode_contents()})
    data = {"grade": G, "num": n, "title": L["title"], "part": L["part"], "part_no": L["part_no"],
            "html": str(soup), "toc": toc, "mcq": mcq, "exercises": []}
    os.makedirs(OUT, exist_ok=True)
    json.dump(data, open(os.path.join(OUT, f"L{n:02d}.json"), "w", encoding="utf-8"), ensure_ascii=False)
    return data


def main():
    ls = plan()
    for L in ls:                      # pass 1: collect figures
        B.pre_latex(take_mcq(L["body"])[0])
        if L["sol"]:
            B.pre_latex(prep_solutions(L["sol"]))
    bad = B.render_all_figures()
    if os.path.isdir(OUT):
        for f in os.listdir(OUT):
            if re.fullmatch(r"L\d+\.json", f):
                os.remove(os.path.join(OUT, f))
    with cf.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        futs = {ex.submit(build, i + 1, L): i + 1 for i, L in enumerate(ls)}
        for f in cf.as_completed(futs):
            n = futs[f]
            try:
                d = f.result()
                na = sum(q["answer"] is not None for q in d["mcq"])
                print(f"G12 L{n:02d} {d['part'][:12]} | {d['title'][:40]}  mcq={len(d['mcq'])} (key {na}) toc={len(d['toc'])}")
            except Exception as e:
                print(f"G12 L{n:02d} FAILED: {e!r}"[:400])
    if bad:
        json.dump(bad, open(os.path.join(ROOT, "book", "failed_figures_g12.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
