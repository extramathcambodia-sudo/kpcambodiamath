# -*- coding: utf-8 -*-
"""
Build the KPCambodianmathematics website following khmermath-starter-demo.

Output (next to static/ and math_data.js):
  index.html                    home page (KPCambodianmathematics.html redirects here)
  practice.html teachers.html about.html privacy.html sitemap.html 404.html
  sitemap.xml robots.txt manifest.webmanifest
  grade-7.html ... grade-10.html grade pages (list of lessons + tests)
  lesson/g7/L01.html ...         one page per lesson (theory, formulas,
                                 exercises with answers, self-check quiz)
  exam.html?id=ct_g07_c01        timed exam player (chapter tests)
  monthly.html?id=mt_g7_m01      printable monthly test paper

Run:  python build_site_from_template.py
The old Exam Studio lives in studio.html (build_khmermath_portal.py).
"""
import html
import sys
import json
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(ROOT, "khmermath-starter-demo", "lesson-g7-l01.html")
SITE = "KPCambodianmathematics"
# public address of the site (used in sitemap.xml / robots.txt) — change it after you choose a domain
SITE_URL = "https://kpcmath.netlify.app"
KH = "០១២៣៤៥៦៧៨៩"
# (grade, lesson number) -> teaching slide deck id in static/js/slides_templates.js
SLIDE_DECKS = {(11, 1): "g11-sequences", (11, 2): "g11-arith", (11, 3): "g11-geom", (11, 4): "g11-sums", (11, 5): "g11-recur"}


def kh(n):
    return "".join(KH[int(c)] if c.isdigit() else c for c in str(n))


def esc(s):
    return html.escape(str(s), quote=True)


# ----------------------------------------------------------------- data
EXTRA_GRADES = [
    # grades whose lessons come only from book/g<id>/Lnn.json (book12.py, book11.py)
    {"id": 11, "name": "ថ្នាក់ទី ១១", "code": "G11",
     "desc": "គណិតវិទ្យាថ្នាក់ទី ១១ តាមសៀវភៅពុម្ព ថ្នាក់វិទ្យាសាស្ត្រ និងថ្នាក់វិទ្យាសាស្ត្រសង្គម"},
    {"id": 12, "name": "ថ្នាក់ទី ១២", "code": "G12",
     "desc": "គណិតវិទ្យាថ្នាក់ទី ១២ ត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)"},
]
RANGE = "៧–១០"
RANGE_TO = "៧ ដល់ទី ១០"


def load_data():
    global RANGE, RANGE_TO
    raw = open(os.path.join(ROOT, "math_data.js"), encoding="utf-8").read()
    data = json.loads(raw.split("window.MATH_DATA = ", 1)[1].strip().rstrip(";"))
    have = {g["id"] for g in data["grades"]}
    for g in EXTRA_GRADES:
        d = os.path.join(ROOT, "book", f"g{g['id']}")
        n = len([f for f in os.listdir(d) if re.fullmatch(r"L\d+\.json", f)]) if os.path.isdir(d) else 0
        if g["id"] not in have and n:
            data["grades"].append(dict(g, count=n, chaptersCount=n, desc=f"{g['desc']} ({kh(n)} មេរៀន)"))
    ids = sorted(g["id"] for g in data["grades"])
    RANGE = f"{kh(ids[0])}–{kh(ids[-1])}"
    RANGE_TO = f"{kh(ids[0])} ដល់ទី {kh(ids[-1])}"
    bt = book_tests(data)
    data["chapterTests"] += bt
    js = "window.MATH_DATA=window.MATH_DATA||{};window.MATH_DATA.chapterTests=(window.MATH_DATA.chapterTests||[]).concat(" + \
        json.dumps(bt, ensure_ascii=False).replace("</", "<\\/") + ");\n"
    os.makedirs(os.path.join(ROOT, "static", "js"), exist_ok=True)
    with open(os.path.join(ROOT, "static", "js", "book_tests.js"), "w", encoding="utf-8", newline="\n") as f:
        f.write(js)
    return data


def icon_sprite():
    h = open(TEMPLATE, encoding="utf-8").read()
    m = re.search(r'<svg xmlns="http://www.w3.org/2000/svg" style="display:none">.*?</svg>\s*(?=<a class="skip")', h, re.S)
    return m.group(0).strip() if m else ""


SPRITE = ""


def ic(name, cls="ic"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'


# ------------------------------------------------- text -> HTML (with math)
MATH_PAT = re.compile(
    r"\$\$(.+?)\$\$"            # $$ display $$
    r"|\\\[(.+?)\\\]"           # \[ display \]
    r"|(\\begin\{(align\*?|aligned|gather\*?|eqnarray\*?|array|cases|[vpbB]?matrix)\}.*?\\end\{\4\})"  # bare environment
    r"|\\\((.+?)\\\)"           # \( inline \)
    r"|(?<![\\$])\$(?!\$)([^$\n]+?)(?<!\\)\$",  # $ inline $ (single line)
    re.S,
)
DOLLAR = "\x01"   # an escaped \$ (a real dollar sign) while maths is being found


def repair(text):
    """Fix common slips in the source data before looking for maths."""
    t = str(text)
    # "\%" was lost with the rest of its line (LaTeX comment): "x 100\" -> "x 100\%"
    fixed = []
    for line in t.split("\n"):
        if re.search(r"(?<!\\)\\\s*$", line):
            line = re.sub(r"\\\s*$", r"\\%", line)
            if line.rfind("\\[") > line.rfind("\\]"):
                line += " \\]"
            if len(re.findall(r"(?<!\\)\$", line)) % 2 == 1:
                line += "$"
        fixed.append(line)
    t = "\n".join(fixed)
    t = t.replace("\\$", DOLLAR)
    t = re.sub(r"\$\s*\\\[(.*?)\\\]\s*\$", r"\\[\1\\]", t, flags=re.S)   # "$\[...\]$"
    # "$\begin{cases} ... \end{cases}$" over several lines -> display maths
    t = re.sub(r"\$\s*([^$\n]*?(?:\\left[.(\[|]\s*)?\\begin\{([a-z*]+)\}.*?\\end\{\2\}(?:\s*\\right(?:\\\}|[.)\]|]))?[^$\n]*?)\s*\$",
               r"\\[\1\\]", t, flags=re.S)
    # "$\bar{x\n$)}"  ->  "$\bar{x}$)"
    t = re.sub(r"\$([^$\n]*\{[^{}$\n]*)\n\$\)\}", r"$\1}$)", t)
    # "$a \implies $b$$"  ->  "$a \implies b$"
    t = re.sub(r"\$([^$\n]+?) \$([^$\n]+?)\$\$", r"$\1 \2$", t)
    # closing $ typed inside a brace: "$x = 5\text{ cm$}"  ->  "$x = 5\text{ cm}$"
    for _ in range(3):
        t = re.sub(r"\$([^$\n]*?)\$\}",
                   lambda m: f"${m.group(1)}}}$" if m.group(1).count("{") - m.group(1).count("}") == 1 else m.group(0), t)
    # a literal "\n" typed after a row break or \begin{cases}
    t = re.sub(r"(\\\\|\\begin\{[a-z*]+\})\\n(?=[A-Za-z0-9(\-])", r"\1 ", t)
    return t


def clean_tex(body):
    body = body.replace(DOLLAR, "\\$")
    body = re.sub(r"\\text\{([^{}]*?)\^(\d)\}", r"\\text{\1}^\2", body)          # \text{ cm^2}
    body = re.sub(r"\\(d?frac)\{([0-9A-Za-z.\- ]+)\{([0-9A-Za-z.\- ]+)\}\}", r"\\\1{\2}{\3}", body)  # \dfrac{7{26}}
    # KaTeX does not know @{...} in array column specs
    body = re.sub(r"(\\begin\{array\}\{)([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}",
                  lambda m: m.group(1) + re.sub(r"@\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", "", m.group(2)) + "}", body)
    return body


def protect_math(text):
    """Replace maths by placeholders; return (text, list of html pieces)."""
    store = []

    def sub(m):
        if m.group(1) is not None or m.group(2) is not None or m.group(3) is not None:
            body = next(g for g in (m.group(1), m.group(2), m.group(3)) if g is not None).strip()
            if "$" in body:            # a "display" block that really holds text + inline maths
                inner, st2 = protect_math(body)
                base = len(store)
                store.extend(st2)
                return re.sub(r"\x00(\d+)\x00", lambda x: f"\x00{int(x.group(1)) + base}\x00", inner)
            store.append(("d", clean_tex(body)))
        else:
            body = (m.group(5) if m.group(5) is not None else m.group(6)).strip()
            store.append(("i", clean_tex(body)))
        return f"\x00{len(store) - 1}\x00"

    return MATH_PAT.sub(sub, repair(text)), store


def restore_math(s, store):
    s = s.replace(DOLLAR, "$")

    def sub(m):
        kind, body = store[int(m.group(1))]
        if kind == "d":
            return '<div class="md">\\[' + esc(body) + "\\]</div>"
        return '<span class="mi">\\(' + esc(body) + "\\)</span>"

    return re.sub(r"\x00(\d+)\x00", sub, s)


def inline(s):
    """Inline markup on text that already has math protected."""
    s = esc(s)
    s = re.sub(r"\\hspace\*?\{[^}]*\}", " ", s)
    s = re.sub(r"\\textbullet\s*", "• ", s)
    s = s.replace("\\qquad", "\u2003\u2003").replace("\\quad", "\u2003")
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", s)
    s = s.replace("**", "")
    return s.strip()


def text_html(text):
    """Short text (question, option) -> HTML with \\( \\) maths."""
    t, store = protect_math(str(text))
    t = inline(t).replace("\n", "<br>")
    out = restore_math(t, store)
    out = re.sub(r'<div class="md">\\\[(.*?)\\\]</div>',
                 lambda m: '<span class="mi">\\(\\displaystyle ' + m.group(1) + '\\)</span>', out, flags=re.S)
    return out


def plain(text):
    """Title text for menus: maths markers removed."""
    t = repair(text).replace(DOLLAR, "$")
    t = re.sub(r"\\(bar|overline)\{([^{}]*)\}?", lambda m: m.group(2) + "\u0304", t)
    t = re.sub(r"\\[a-zA-Z]+", "", t).replace("$", "").replace("{", "").replace("}", "")
    return esc(re.sub(r"\s+", " ", t).strip())


FIG = "[រូបភាពធរណីមាត្រ / ប្លង់ក្រាប]"

LABELS = [
    # (prefix, css class, title used when the line has no bold title)
    ("📌", "bx-teal", "និយមន័យ"),
    ("📐", "bx-amber", "ទ្រឹស្តីបទ"),
    ("💡", "bx-green", "លក្ខណៈ"),
    ("✍️", "bx-gray", "ឧទាហរណ៍"),
    ("📝", "bx-try", "លំហាត់អនុវត្ត"),
]


def rich_html(text):
    """Lesson content (markdown-like, with maths) -> HTML blocks."""
    t, store = protect_math(str(text))
    lines = t.split("\n")
    out = []          # finished html pieces
    para = []         # current paragraph lines
    ul = []           # current bullet list
    table = []        # current markdown table rows
    box = None        # dict(kind, title, body list, sol list, in_sol)

    def target():
        if box is None:
            return out
        return box["sol"] if box["in_sol"] else box["body"]

    def flush_para():
        nonlocal para
        if para:
            target().append("<p>" + "<br>".join(inline(x) for x in para) + "</p>")
            para = []

    def flush_ul():
        nonlocal ul
        if ul:
            target().append('<ul class="list">' + "".join(f"<li>{inline(x)}</li>" for x in ul) + "</ul>")
            ul = []

    def flush_table():
        nonlocal table
        if table:
            rows = [r for r in table if not re.fullmatch(r"\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?", r.strip())]
            body = ""
            for i, r in enumerate(rows):
                cells = [c.strip() for c in r.strip().strip("|").split("|")]
                tag = "th" if i == 0 else "td"
                body += "<tr>" + "".join(f"<{tag}>{inline(c)}</{tag}>" for c in cells) + "</tr>"
            target().append(f'<div class="tbl"><table class="booktabs">{body}</table></div>')
            table = []

    def flush_all():
        flush_para(); flush_ul(); flush_table()

    def close_box():
        nonlocal box
        flush_all()
        if box is None:
            return
        b = box
        box = None
        head = f'<header class="bx-h"><b>{b["title"]}</b>{b["sub"]}</header>'
        body = "".join(b["body"])
        if b["sol"]:
            sol = "".join(b["sol"])
            if b["kind"] == "bx-try":
                body += f'<details class="ans"><summary>មើលចម្លើយ</summary>{sol}</details>'
            else:
                body += f'<div class="ans-h">ដំណោះស្រាយ</div>{sol}'
        out.append(f'<section class="bx {b["kind"]}">{head}<div class="bx-b">{body}</div></section>')

    for raw in lines:
        line = raw.strip()
        if not line:
            flush_all()
            continue
        if line == FIG or line.startswith("[រូបភាព"):
            flush_all()
            target().append('<div class="fig-ph">រូបភាព (មើលក្នុងសៀវភៅ)</div>')
            continue
        if line.startswith("###"):
            close_box()
            out.append("<h4>" + inline(line.lstrip("#").strip()) + "</h4>")
            continue
        lab = next((L for L in LABELS if line.startswith(L[0])), None)
        if lab:
            rest = line[len(lab[0]):].strip()
            is_sol = "ដំណោះស្រាយ" in rest[:40]
            if is_sol and box is not None:
                flush_all()
                box["in_sol"] = True
                continue
            close_box()
            m = re.match(r"\*\*(.+?)\*\*\s*(\((.*?)\))?\s*[៖:]?\s*(.*)$", rest)
            if m:
                title = inline(m.group(1))
                sub = f' <span class="bx-note">({inline(m.group(3))})</span>' if m.group(3) else ""
                tail = m.group(4)
            else:
                title, sub, tail = lab[2], "", rest
            box = {"kind": lab[1], "title": title, "sub": sub, "body": [], "sol": [], "in_sol": False}
            if tail.strip():
                para.append(tail)
            continue
        if line.startswith("|"):
            flush_para(); flush_ul()
            table.append(line)
            continue
        flush_table()
        if line.startswith("•") or line.startswith("\\textbullet") or re.match(r"^[-–]\s", line):
            flush_para()
            ul.append(re.sub(r"^(•|\\textbullet|[-–])\s*", "", line))
            continue
        if re.fullmatch(r"\x00\d+\x00[\s។.,]*", line):
            flush_all()
            target().append(line)
            continue
        flush_ul()
        para.append(line)
    close_box()
    return restore_math("".join(out), store)


# ------------------------------------------------------------ page shell
SITE_DESC = "មេរៀន លំហាត់ តេស្ត និងវិញ្ញាសាគណិតវិទ្យាជាភាសាខ្មែរ តាមកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា"
TELEGRAM = "https://t.me/KHEMPUTHY"
AUTHOR = "ខែម ពុទ្ធី"


PHOTOS = {  # real photographs: drop a file into static/img/photos/ and rebuild; missing files are simply not used
    "hero": ".home-hero", "footer": ".site-footer", "page": ".page-hero, .tp-hero"}


def photo_css(base):
    css = ""
    for name, sel in PHOTOS.items():
        for ext in ("webp", "jpg", "jpeg", "png"):
            if os.path.exists(os.path.join(ROOT, "static", "img", "photos", f"{name}.{ext}")):
                css += f"{sel}{{--photo:url({base}static/img/photos/{name}.{ext})}}"
                break
    return f"<style>{css}</style>\n" if css else ""


def head(title, desc, base, extra_css="", jsonld=""):
    return f"""<!doctype html>
<html lang="km">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="author" content="{AUTHOR}">
<meta name="theme-color" content="#2a1659">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{base}static/img/icon-512.png">
<meta property="og:locale" content="km_KH">
<link rel="icon" href="{base}static/img/logo-96.png" type="image/png">
<link rel="apple-touch-icon" href="{base}static/img/icon-192.png">
<link rel="manifest" href="{base}manifest.webmanifest">
<link rel="preload" href="{base}static/fonts/kantumruy-pro-khmer.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}static/fonts/kantumruy-pro.css">
<link rel="stylesheet" href="{base}static/css/site.css">
<link rel="stylesheet" href="{base}static/css/khmer-art.css">
<script>try{{var t=localStorage.getItem('km-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<link rel="stylesheet" href="{base}static/katex/katex.min.css">
{extra_css}{photo_css(base)}<style>
.fig-ph{{margin:10px 0;padding:10px 14px;border:1px dashed #c9d6d4;border-radius:10px;color:#7b8a89;font-size:14px;text-align:center}}
.bx-note{{font-weight:600;opacity:.8}}
.ls-toc .km-done{{display:none}}
.ls-paper .md{{overflow-x:auto;overflow-y:hidden;max-width:100%}}
.ls-paper .tbl{{overflow-x:auto}}
.sol-all{{margin:12px 0 24px}}.sol-all>summary{{font-weight:700}}
</style>
{jsonld}</head>
<body>
{SPRITE}
<a class="skip" href="#content">រំលងទៅខ្លឹមសារ</a>
"""


def header(base, grades, current=""):
    gl = "".join(
        f'<a href="{base}grade-{g["id"]}.html" class="g{g["id"]}"><span class="grade-num">{kh(g["id"])}</span>'
        f'<span><span class="mt">{esc(g["name"])}</span><span class="md">{kh(g["chaptersCount"])} មេរៀន</span></span></a>'
        for g in grades
    )
    cur = lambda k: " current" if current == k else ""
    return f"""<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="{base}index.html" aria-label="{SITE} — ទំព័រដើម">
      <img src="{base}static/img/logo-96.png" alt="" width="40" height="40">
      <span class="brand-text"><b>{SITE}</b><small>គណិតវិទ្យា ថ្នាក់ទី {RANGE}</small></span>
    </a>
    <nav class="main-nav" id="main-nav" aria-label="ម៉ឺនុយមេ">
      <ul class="nav-list">
        <li class="nav-item has-menu{cur('grades')}"><button class="nav-link" type="button" aria-expanded="false" aria-controls="menu-grades">រៀន {ic('chev', 'ic chev')}</button>
          <div class="menu menu-grades" id="menu-grades">{gl}</div></li>
        <li class="nav-item{cur('practice')}"><a class="nav-link" href="{base}practice.html">តេស្ត និងវិញ្ញាសា</a></li>
        <li class="nav-item has-menu{cur('teach')}"><button class="nav-link" type="button" aria-expanded="false" aria-controls="menu-teach">សម្រាប់គ្រូ {ic('chev', 'ic chev')}</button>
          <div class="menu" id="menu-teach">
            <a href="{base}exam-builder.html"><span class="mi">{ic('pencil')}</span><span><span class="mt">បង្កើតវិញ្ញាសា</span><span class="md">ជ្រើសចំនួន MCQ និងលំហាត់សរសេរ ទាញយក PDF LaTeX Word</span></span></a>
            <a href="{base}classroom.html"><span class="mi">{ic('users')}</span><span><span class="mt">ថ្នាក់រៀនរបស់ខ្ញុំ</span><span class="md">សិស្ស ពិន្ទុ មធ្យមភាគប្រចាំខែ ឆមាស និងឆ្នាំ</span></span></a>
            <a href="{base}studio.html"><span class="mi">{ic('layers')}</span><span><span class="mt">Exam Studio</span><span class="md">ធនាគារសំណួរ OMR កង់ចាប់ឈ្មោះ និងហ្គេមក្នុងថ្នាក់</span></span></a>
            <a href="{base}geometry-angle-bisector.html"><span class="mi">{ic('target')}</span><span><span class="mt">សំណង់ធរណីមាត្រ</span><span class="md">សង់ដោយបន្ទាត់ និងកំពាស មួយជំហានម្ដងៗ</span></span></a>
            <a href="{base}admin.html"><span class="mi">{ic('flag')}</span><span><span class="mt">Admin</span><span class="md">គ្រប់គ្រងថ្នាក់ គ្រូ ពាក្យសម្ងាត់ និងទិន្នន័យ</span></span></a>
            <a href="{base}teachers.html" class="menu-all">ឧបករណ៍គ្រូទាំងអស់</a>
          </div></li>
        <li class="nav-item{cur('books')}"><a class="nav-link" href="{base}books.html">សៀវភៅ</a></li>
        <li class="nav-item{cur('about')}"><a class="nav-link" href="{base}about.html">អំពីយើង</a></li>
      </ul>
      <div class="nav-mobile-cta"><a class="btn btn-gold" href="{base}student.html">សិស្សចូលប្រឡង</a></div>
    </nav>
    <div class="header-actions">
      <button class="icon-btn theme-toggle" type="button" aria-label="ប្ដូរផ្ទៃភ្លឺ ឬងងឹត" title="ប្ដូរផ្ទៃភ្លឺ ឬងងឹត">{ic('sun', 'ic i-sun')}{ic('moon', 'ic i-moon')}</button>
      <a class="btn btn-gold btn-sm hide-sm" href="{base}student.html">សិស្សចូលប្រឡង</a>
      <button class="icon-btn menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="ម៉ឺនុយ">{ic('menu', 'ic i-menu')}{ic('close', 'ic i-close')}</button>
    </div>
  </div>
</header>
"""


def footer(base, grades, scripts=""):
    gl = "".join(f'<li><a href="{base}grade-{g["id"]}.html">{esc(g["name"])}</a></li>' for g in grades)
    ex9 = f'<li><a href="{base}exams9/index.html">ត្រៀមប្រឡងថ្នាក់ទី ៩</a></li>' if os.path.exists(os.path.join(ROOT, "exams9", "index.html")) else ""
    return f"""<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="{base}index.html"><img src="{base}static/img/logo-96.png" alt="" width="40" height="40"><span class="brand-text"><b>{SITE}</b><small>គណិតវិទ្យាខ្មែរ</small></span></a>
        <p>មេរៀន លំហាត់ និងតេស្តគណិតវិទ្យាជាភាសាខ្មែរ សម្រាប់សិស្ស និងគ្រូ ថ្នាក់ទី {RANGE_TO} ។ ប្រើបានដោយឥតគិតថ្លៃ ទាំងលើកុំព្យូទ័រ និងទូរស័ព្ទ ។</p>
        <a class="tg-link" href="{TELEGRAM}" target="_blank" rel="noopener">{ic('send')} Telegram @KHEMPUTHY</a>
      </div>
      <div class="footer-col"><h4>រៀន</h4><ul>{gl}</ul></div>
      <div class="footer-col"><h4>តេស្ត និងវិញ្ញាសា</h4><ul><li><a href="{base}practice.html">តេស្តតាមមេរៀន</a></li><li><a href="{base}practice.html#monthly">វិញ្ញាសាប្រចាំខែ</a></li>{ex9}<li><a href="{base}student.html">សិស្សចូលប្រឡង</a></li></ul></div>
      <div class="footer-col"><h4>សម្រាប់គ្រូ</h4><ul><li><a href="{base}exam-builder.html">បង្កើតវិញ្ញាសា</a></li><li><a href="{base}classroom.html">ថ្នាក់រៀនរបស់ខ្ញុំ</a></li><li><a href="{base}studio.html">Exam Studio</a></li><li><a href="{base}geometry-angle-bisector.html">សំណង់ធរណីមាត្រ</a></li></ul></div>
      <div class="footer-col"><h4>អំពី</h4><ul><li><a href="{base}about.html">អំពីយើង</a></li><li><a href="{base}about.html#contact">ទំនាក់ទំនង</a></li><li><a href="{base}privacy.html">គោលការណ៍ឯកជនភាព</a></li><li><a href="{base}admin.html">Admin</a></li><li><a href="{base}sitemap.html">ផែនទីគេហទំព័រ</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <p>© ២០២៦ {SITE} · រៀបរៀងដោយ {AUTHOR}</p>
      <p>ខ្លឹមសារតាមកម្មវិធីសិក្សាគណិតវិទ្យា ថ្នាក់ទី {RANGE}</p>
    </div>
  </div>
</footer>
<script src="{base}static/js/site.js" defer></script>
{scripts}</body>
</html>
"""


def page_hero(crumbs, title, lead="", extra=""):
    """inner-page title band; crumbs = [(href or None, label)]"""
    cr = "".join(f'<li><a href="{h}">{esc(t)}</a></li>' if h else f'<li aria-current="page">{esc(t)}</li>' for h, t in crumbs)
    return (f'<section class="page-hero"><div class="wrap"><ol class="crumbs">{cr}</ol><h1>{esc(title)}</h1>'
            + (f'<p class="lead">{lead}</p>' if lead else "") + extra + '</div></section>\n')


# ---------------------------------------------------------------- pages
def book_lessons(data, g):
    """Lessons converted from the LaTeX book (book/g<g>/Lnn.json), or None."""
    d = os.path.join(ROOT, "book", f"g{g}")
    if not os.path.isdir(d):
        return None
    files = sorted(f for f in os.listdir(d) if re.fullmatch(r"L\d+\.json", f))
    if not files:
        return None
    md = sorted(data["lessons"].get(str(g), []), key=lambda l: l["num"])
    out = []
    for f in files:
        b = json.load(open(os.path.join(d, f), encoding="utf-8"))
        ref = None
        if g >= 11:
            ref = None
        elif g == 10 and b.get("part_no"):
            ref = md[b["part_no"] - 1] if b["part_no"] - 1 < len(md) else None
        elif b["num"] - 1 < len(md):
            ref = md[b["num"] - 1]
        tid = (ref or {}).get("testId")
        if g >= 11 and len(valid_mcq(b)) >= 10:
            tid = f"bk_g{g}_L{b['num']:02d}"
        out.append({"num": b["num"], "title": b["title"], "category": b.get("part") or (ref or {}).get("category", ""),
                    "testId": tid, "theorySections": b["toc"], "book": b})
    return out


# ---------------------------------------------------------------- tests built from book MCQs (grades 11-12)
TEST_SIZE = 50


def valid_mcq(b):
    return [q for q in b.get("mcq", []) if q.get("answer") is not None and 0 <= q["answer"] < len(q["options"]) <= 6]


def html2tx(h):
    """lesson-page MCQ html -> the $...$ text format used by the exam player"""
    h = re.sub(r'<div class="md">\\\[(.*?)\\\]</div>', lambda m: "$$" + m.group(1).replace("\n", " ") + "$$", h, flags=re.S)
    h = re.sub(r'<span class="mi">\\\((.*?)\\\)</span>', lambda m: "$" + m.group(1).replace("\n", " ") + "$", h, flags=re.S)
    h = re.sub(r"</?(strong|b)>", "**", h)
    h = re.sub(r"<br\s*/?>", "\n", h)
    h = re.sub(r"<[^>]+>", "", h)
    return html.unescape(h).strip()


def book_tests(data):
    tests = []
    for g in data["grades"]:
        if g["id"] < 11:
            continue
        for l in book_lessons(data, g["id"]) or []:
            if not (l["testId"] or "").startswith("bk_"):
                continue
            b = l["book"]
            qs = valid_mcq(b)
            if len(qs) > TEST_SIZE:
                step = len(qs) / TEST_SIZE
                qs = [qs[int(i * step)] for i in range(TEST_SIZE)]
            track = f" ({b['track'].replace('ថ្នាក់', '')})" if b.get("track") else ""
            name = f"មេរៀនទី {kh(b['num'])} {b['title']}{track}"
            keys = "កខគឃងច"
            questions = []
            for k, q in enumerate(qs, 1):
                questions.append({
                    "id": f"{l['testId']}_{k:03d}", "grade": g["id"], "chapter": name, "type": "mcq",
                    "difficulty": q.get("level", "មធ្យម"), "points": 1,
                    "question": html2tx(q["stem"]),
                    "options": [{"key": keys[i], "text": html2tx(o)} for i, o in enumerate(q["options"])],
                    "answer": keys[q["answer"]],
                    "explanation": html2tx(q["sol"]) if q.get("sol") else f"ចម្លើយត្រឹមត្រូវគឺជម្រើស ({keys[q['answer']]})។"})
            n = len(questions)
            tests.append({"id": l["testId"], "grade": g["id"], "chapter": name, "title": f"តេស្តសមត្ថភាព ៖ {name}",
                          "duration": max(20, round(n * 1.8 / 5) * 5), "points": n, "mcqCount": n, "writtenCount": 0,
                          "questions": questions})
    return tests


def grade_lessons(data, g):
    bl = book_lessons(data, g)
    if bl:
        return bl
    return sorted(data["lessons"][str(g)], key=lambda l: l["num"])


def tests_by_id(data):
    return {t["id"]: t for t in data["chapterTests"]}


def lesson_url(g, num):
    return f"lesson/g{g}/L{num:02d}.html"


def lesson_index(data):
    """small search index for the lesson finder: [title, grade, lesson no, url, chapter]"""
    out = []
    for g in data["grades"]:
        for l in grade_lessons(data, g["id"]):
            part = (l.get("book") or {}).get("part") or l.get("category") or ""
            tr = (l.get("book") or {}).get("track") or ""
            out.append([l["title"], g["id"], l["num"], lesson_url(g["id"], l["num"]), part + (" · " + tr if tr else "")])
    return out


FINDER_JS = r"""<script>
(function(){
  var KH='០១២៣៤៥៦៧៨៩';function kh(n){return String(n).replace(/\d/g,function(d){return KH[d]})}
  var D=JSON.parse(document.getElementById('lesson-index').textContent),inp=document.getElementById('finder'),box=document.getElementById('finder-list');
  function norm(s){return String(s).toLowerCase().replace(/[​\s]+/g,' ').trim()}
  D.forEach(function(r){r.k=norm(r[0]+' '+r[4]+' ថ្នាក់ទី '+r[1]+' '+kh(r[1])+' មេរៀនទី '+r[2]+' '+kh(r[2]))});
  var sel=-1;
  function show(){
    var q=norm(inp.value);sel=-1;
    if(!q){box.hidden=true;inp.setAttribute('aria-expanded','false');return}
    var ws=q.split(' '),hits=D.filter(function(r){return ws.every(function(w){return r.k.indexOf(w)>=0})}).slice(0,8);
    box.innerHTML=hits.length?hits.map(function(r,i){return '<li role="option" id="fo'+i+'"><a href="'+r[3]+'"><span class="fg g'+r[1]+'">'+kh(r[1])+'</span><span><b>'+r[0].replace(/</g,'&lt;')+'</b><small>មេរៀនទី '+kh(r[2])+(r[4]?' · '+r[4].replace(/</g,'&lt;'):'')+'</small></span></a></li>'}).join(''):'<li class="none">រកមិនឃើញមេរៀនទេ ។ សាកពាក្យផ្សេង ឬជ្រើសថ្នាក់ខាងក្រោម ។</li>';
    box.hidden=false;inp.setAttribute('aria-expanded','true');
  }
  inp.addEventListener('input',show);
  inp.addEventListener('keydown',function(e){
    var a=box.querySelectorAll('a');if(!a.length)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+a.length)%a.length;a.forEach(function(x,i){x.classList.toggle('on',i===sel)});inp.setAttribute('aria-activedescendant','fo'+sel)}
    else if(e.key==='Enter'){e.preventDefault();location.href=a[Math.max(sel,0)].getAttribute('href')}
    else if(e.key==='Escape'){box.hidden=true}
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.finder'))box.hidden=true});
})();
</script>
"""


def build_home(data):
    grades = data["grades"]
    all_ls = [l for g in grades for l in grade_lessons(data, g["id"])]
    n_lessons = len(all_ls)
    n_q = sum(len(l["book"]["mcq"]) + len(l["book"]["exercises"]) for l in all_ls if "book" in l)
    n_tests = len(data["chapterTests"]) + len(data["monthlyTests"])
    ruler = "".join(
        f'<a class="rule-cell g{g["id"]}" href="grade-{g["id"]}.html"><span class="rule-num">{kh(g["id"])}</span>'
        f'<span class="rule-lbl">ថ្នាក់ទី {kh(g["id"])}</span><span class="rule-sub">{kh(len(grade_lessons(data, g["id"])))} មេរៀន</span></a>'
        for g in grades
    )
    # newest tests per grade (two each) for the practice preview
    prev = ""
    for g in grades:
        ts = [t for t in data["chapterTests"] if t["grade"] == g["id"]][:2]
        prev += "".join(
            f'<li><a href="exam.html?id={t["id"]}"><span class="fg g{g["id"]}">{kh(g["id"])}</span><span><b>{esc(t["chapter"])}</b>'
            f'<small>{kh(t["mcqCount"])} សំណួរ · {kh(t["duration"])} នាទី</small></span></a></li>' for t in ts)
    idx = json.dumps(lesson_index(data), ensure_ascii=False).replace("</", "<\\/")
    jsonld = ('<script type="application/ld+json">' + json.dumps({
        "@context": "https://schema.org", "@type": "EducationalOrganization", "name": SITE,
        "description": SITE_DESC, "inLanguage": "km", "founder": AUTHOR, "sameAs": [TELEGRAM]}, ensure_ascii=False) + '</script>\n')
    body = f"""<main id="content">
<section class="home-hero">
  <div class="wrap">
    <h1>រៀនគណិតវិទ្យា <span class="nowrap">ថ្នាក់ទី {RANGE}</span></h1>
    <p class="lead">មេរៀនជាភាសាខ្មែរ តាមសៀវភៅពុម្ពរបស់ក្រសួង ឧទាហរណ៍មានដំណោះស្រាយ លំហាត់ពិនិត្យខ្លួនឯង និងតេស្តមាននាឡិកាកំណត់ម៉ោង ។</p>
    <div class="finder" role="search">
      <label class="sr-only" for="finder">ស្វែងរកមេរៀន</label>
      {ic('search', 'ic finder-ic')}
      <input id="finder" type="search" autocomplete="off" placeholder="ស្វែងរកមេរៀន ឧ. សមីការ ប្រូបាប ដេរីវេ…" role="combobox" aria-expanded="false" aria-controls="finder-list" aria-autocomplete="list">
      <ul id="finder-list" class="finder-list" role="listbox" hidden></ul>
    </div>
    <nav class="ruler" id="grades-pick" aria-label="ជ្រើសរើសថ្នាក់">{ruler}</nav>
    <p class="hero-facts">{kh(n_lessons)} មេរៀន, {kh(n_q)} លំហាត់ និងសំណួរ, {kh(n_tests)} តេស្ត និងវិញ្ញាសា ។ ឥតគិតថ្លៃ ។</p>
  </div>
</section>

<section class="section portal-sec" id="start">
  <div class="wrap">
    <div class="lotus-rule" aria-hidden="true"><i></i></div>
    <div class="section-head"><h2><span class="lotus-mark" aria-hidden="true"></span>ចូលប្រើគេហទំព័រ</h2><p>ជ្រើសតួនាទីរបស់អ្នក ។</p></div>
    <div class="portal">
      <div class="portal-users">
        <h3 class="portal-t">អ្នកប្រើប្រាស់</h3>
        <div class="portal-pair">
          <div class="role role-student">
            <span class="role-i">{ic('user')}</span>
            <h4>សិស្ស</h4>
            <p>រៀនមេរៀន ធ្វើលំហាត់ និងប្រឡងតាមកូដថ្នាក់ដែលគ្រូផ្ដល់ឱ្យ ។</p>
            <ul class="role-links">
              <li><a href="#grades-pick">រៀនមេរៀនតាមថ្នាក់</a></li>
              <li><a href="practice.html">ធ្វើតេស្តតាមមេរៀន</a></li>
            </ul>
            <a class="btn btn-gold" href="student.html">ចូលប្រឡងដោយកូដថ្នាក់</a>
          </div>
          <div class="role role-teacher">
            <span class="role-i">{ic('users')}</span>
            <h4>គ្រូ</h4>
            <p>រៀបចំវិញ្ញាសា គ្រប់គ្រងសិស្ស ពិន្ទុ និងមធ្យមភាគរបស់ថ្នាក់ ។</p>
            <ul class="role-links">
              <li><a href="exam-builder.html">បង្កើតវិញ្ញាសា</a></li>
              <li><a href="studio.html">Exam Studio</a></li>
            </ul>
            <a class="btn btn-primary" href="classroom.html">ចូលថ្នាក់រៀនរបស់ខ្ញុំ</a>
          </div>
        </div>
      </div>
      <div class="portal-admin">
        <h3 class="portal-t">Admin</h3>
        <span class="role-i">{ic('layers')}</span>
        <h4>អ្នកគ្រប់គ្រង</h4>
        <p>មើលថ្នាក់ និងគ្រូទាំងអស់ កំណត់ពាក្យសម្ងាត់ការពារទំព័រគ្រូ និងបម្រុងទុកទិន្នន័យ ។</p>
        <a class="btn btn-gold" href="admin.html">ចូលជា Admin</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split-2">
    <div>
      <h2><span class="lotus-mark" aria-hidden="true"></span>អ្វីដែលមានក្នុងមេរៀននីមួយៗ</h2>
      <p class="sub">មេរៀនរៀបតាមលំដាប់នៃសៀវភៅពុម្ព ដើម្បីឱ្យសិស្សរៀនតាមថ្នាក់ និងរំលឹកមេរៀននៅផ្ទះបាន ។</p>
    </div>
    <ul class="feature-list">
      <li>{ic('book')}<div><b>ទ្រឹស្តី និងរូបមន្ត</b><span>និយមន័យ ទ្រឹស្តីបទ និងរូបមន្តសំខាន់ៗ សរសេរជាគណិតវិទ្យាច្បាស់ៗ ។</span></div></li>
      <li>{ic('pencil')}<div><b>ឧទាហរណ៍ និងលំហាត់</b><span>ឧទាហរណ៍មានដំណោះស្រាយមួយជំហានម្ដងៗ និងលំហាត់មានចម្លើយ ។</span></div></li>
      <li>{ic('check')}<div><b>សំណួរពិនិត្យខ្លួនឯង</b><span>សំណួរពហុជ្រើសរើសនៅចុងមេរៀន ប្រាប់ចម្លើយត្រូវភ្លាមៗ ។</span></div></li>
      <li>{ic('clock')}<div><b>តេស្តមានម៉ោង</b><span>តេស្តតាមមេរៀន និងវិញ្ញាសាប្រចាំខែ កែពិន្ទុដោយស្វ័យប្រវត្តិ ។</span></div></li>
    </ul>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head left"><h2><span class="lotus-mark" aria-hidden="true"></span>តេស្តតាមមេរៀន</h2><p>តេស្តពហុជ្រើសរើសមាននាឡិកា ។ ពេលប្រគល់ ប្រព័ន្ធបង្ហាញពិន្ទុ និងចម្លើយត្រឹមត្រូវ ។</p></div>
    <ul class="link-list cols-2">{prev}</ul>
    <p class="more"><a class="btn btn-ghost" href="practice.html">មើលតេស្ត និងវិញ្ញាសាទាំងអស់</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head left"><h2><span class="lotus-mark" aria-hidden="true"></span>សម្រាប់លោកគ្រូ អ្នកគ្រូ</h2><p>ឧបករណ៍សម្រាប់រៀបចំវិញ្ញាសា និងគ្រប់គ្រងពិន្ទុរបស់ថ្នាក់ ។</p></div>
    <div class="tools">
      <a class="tool" href="exam-builder.html"><span class="tool-i">{ic('pencil')}</span><b>បង្កើតវិញ្ញាសា</b><span>ដាក់ចំនួន MCQ និងលំហាត់សរសេរ ប្រព័ន្ធទាញពីធនាគារសំណួរតាមថ្នាក់ ។ ទាញយកជា PDF LaTeX ឬ Word ។</span></a>
      <a class="tool" href="classroom.html"><span class="tool-i">{ic('users')}</span><b>ថ្នាក់រៀនរបស់ខ្ញុំ</b><span>បញ្ជីសិស្ស ពិន្ទុ មធ្យមភាគ ចំណាត់ថ្នាក់ប្រចាំខែ ឆមាស និងឆ្នាំ ព្រមទាំងព្រឹត្តិបត្រពិន្ទុ ។</span></a>
      <a class="tool" href="student.html"><span class="tool-i">{ic('user')}</span><b>សិស្សចូលប្រឡង</b><span>សិស្សប្រឡងដោយកូដថ្នាក់ និង PIN ហើយពិន្ទុចូលតារាងពិន្ទុរបស់គ្រូ ។</span></a>
    </div>
    <p class="more"><a class="text-link" href="teachers.html">ឧបករណ៍គ្រូទាំងអស់</a></p>
  </div>
</section>

<section class="section section-tight">
  <div class="wrap">
    <div class="contact-band">
      <div><h2>មានសំណួរ ឬឃើញកំហុសក្នុងមេរៀន?</h2><p>ផ្ញើសារមកកាន់អ្នករៀបរៀងតាម Telegram ។ យើងកែលម្អមេរៀនជាប្រចាំតាមមតិរបស់សិស្ស និងគ្រូ ។</p></div>
      <a class="btn btn-gold" href="{TELEGRAM}" target="_blank" rel="noopener">{ic('send')} Telegram @KHEMPUTHY</a>
    </div>
  </div>
</section>
</main>
<script type="application/json" id="lesson-index">{idx}</script>
"""
    page = head(f"{SITE} — រៀនគណិតវិទ្យា ថ្នាក់ទី {RANGE} ជាភាសាខ្មែរ", SITE_DESC, "", "", jsonld)
    page += header("", grades) + body + footer("", grades, FINDER_JS)
    return page


def build_practice(data):
    grades = data["grades"]
    tabs, panels = "", ""
    for i, g in enumerate(grades):
        ts = [t for t in data["chapterTests"] if t["grade"] == g["id"]]
        ms = [m for m in data["monthlyTests"] if m["grade"] == g["id"]]
        if not ts and not ms:
            continue
        tabs += f'<a class="gtab g{g["id"]}" href="#p{g["id"]}"><span class="fg g{g["id"]}">{kh(g["id"])}</span>{esc(g["name"])}</a>'
        rows = "".join(
            f'<li><a href="exam.html?id={t["id"]}"><span class="n">{kh(j + 1)}</span><span><b>{esc(t["chapter"])}</b>'
            f'<small>{kh(t["mcqCount"])} សំណួរ · {kh(t["duration"])} នាទី</small></span></a></li>' for j, t in enumerate(ts))
        mrows = "".join(
            f'<li><a href="monthly.html?id={m["id"]}"><span class="n">{ic("plan", "ic ic-sm")}</span><span><b>{esc(m["title"])}</b>'
            f'<small>{esc(m["month"])} · {kh(m["duration"])} នាទី · {kh(m["totalPoints"])} ពិន្ទុ</small></span></a></li>' for m in ms)
        ex9 = ""
        if g["id"] == 9 and os.path.exists(os.path.join(ROOT, "exams9", "index.html")):
            ex9 = (f'<li><a href="exams9/index.html"><span class="n">{ic("clipboard", "ic ic-sm")}</span><span><b>វិញ្ញាសាត្រៀមប្រឡងសញ្ញាបត្រ ៣០ ឈុត</b>'
                   '<small>វិញ្ញាសាប្រឡង ២០២១–២០២៥ ត្រៀមប្រឡង និងព្យាករណ៍ ព្រមទាំងអត្រាកំណែ</small></span></a></li>')
        panels += (f'<section class="pgrade g{g["id"]}" id="p{g["id"]}"><h2><span class="fg g{g["id"]}">{kh(g["id"])}</span>{esc(g["name"])}</h2>'
                   + (f'<h3>តេស្តតាមមេរៀន ({kh(len(ts))})</h3><ol class="link-list cols-3">{rows}</ol>' if ts else "")
                   + (f'<h3 id="monthly{"" if i else ""}">វិញ្ញាសាប្រចាំខែ និងត្រៀមប្រឡង</h3><ul class="link-list cols-3">{ex9}{mrows}</ul>' if (ms or ex9) else "")
                   + '</section>')
    body = '<main id="content">' + page_hero([("index.html", "ទំព័រដើម"), (None, "តេស្ត និងវិញ្ញាសា")], "តេស្ត និងវិញ្ញាសា",
                                            "តេស្តពហុជ្រើសរើសមាននាឡិកា កែពិន្ទុដោយស្វ័យប្រវត្តិ និងវិញ្ញាសាប្រចាំខែសម្រាប់បោះពុម្ព ។",
                                            f'<nav class="gtabs" aria-label="ថ្នាក់">{tabs}</nav>')
    body += f'<div class="wrap section-tight" id="monthly">{panels}</div></main>\n'
    page = head(f"តេស្ត និងវិញ្ញាសា — {SITE}", "តេស្តគណិតវិទ្យាតាមមេរៀន និងវិញ្ញាសាប្រចាំខែ ថ្នាក់ទី " + RANGE_TO, "")
    return page + header("", grades, "practice") + body + footer("", grades)


def build_teachers(data):
    grades = data["grades"]
    tools = [
        ("exam-builder.html", "pencil", "បង្កើតវិញ្ញាសា", "ជ្រើសថ្នាក់ ប្រភេទវិញ្ញាសា (តាមមេរៀន ជំពូក ប្រចាំខែ ឆមាស) និងចំនួនសំណួរ ។ ទាញយកជា PDF កូដ LaTeX ឬ Microsoft Word មានអត្រាកំណែ ។"),
        ("classroom.html", "users", "ថ្នាក់រៀនរបស់ខ្ញុំ", "បង្កើតថ្នាក់ បញ្ចូលសិស្ស និងពិន្ទុ ។ គណនាមធ្យមភាគ ចំណាត់ថ្នាក់ និងនិទ្ទេសប្រចាំខែ ឆមាស ឆ្នាំ តាមរបៀបរបស់ក្រសួង ។"),
        ("student.html", "user", "សិស្សចូលប្រឡង", "សិស្សបញ្ចូលកូដថ្នាក់ និង PIN ដើម្បីប្រឡងអនឡាញ និងមើលពិន្ទុរបស់ខ្លួន ។"),
        ("studio.html", "layers", "Exam Studio", "ធនាគារសំណួរ សន្លឹកចម្លើយ OMR កំណត់ពេលប្រឡង កង់ចាប់ឈ្មោះ និងហ្គេមក្រុមសម្រាប់ថ្នាក់រៀន ។"),
        ("geometry-angle-bisector.html", "target", "សំណង់ធរណីមាត្រ", "បង្ហាញការសង់កន្លះបន្ទាត់ពុះមុំ ដោយបន្ទាត់ និងកំពាស មួយជំហានម្ដងៗ ។"),
    ]
    cards = "".join(f'<a class="tool" href="{u}"><span class="tool-i">{ic(i)}</span><b>{t}</b><span>{d}</span></a>' for u, i, t, d in tools)
    steps = [
        ("បង្កើតថ្នាក់", "នៅ «ថ្នាក់រៀនរបស់ខ្ញុំ» បង្កើតថ្នាក់ ហើយបិទភ្ជាប់បញ្ជីឈ្មោះសិស្ស ។ ប្រព័ន្ធផ្ដល់ PIN ឱ្យសិស្សម្នាក់ៗ ។"),
        ("បង្កើតវិញ្ញាសា", "ជ្រើសមេរៀន និងចំនួនសំណួរ ហើយបោះពុម្ព ឬចុច «ដាក់ឱ្យថ្នាក់ប្រឡង» សម្រាប់ប្រឡងអនឡាញ ។"),
        ("បញ្ចូលពិន្ទុ", "ពិន្ទុពហុជ្រើសរើសចូលដោយស្វ័យប្រវត្តិ ។ ពិន្ទុលំហាត់សរសេរ ឬប្រឡងលើក្រដាស បញ្ចូលដោយដៃ ឬបិទភ្ជាប់ពី Excel ។"),
        ("មើលលទ្ធផល", "មធ្យមភាគប្រចាំខែ ឆមាស និងឆ្នាំ ចំណាត់ថ្នាក់ និទ្ទេស ព្រឹត្តិបត្រពិន្ទុ និងឯកសារ CSV ។"),
    ]
    st = "".join(f'<li><b>{t}</b><span>{d}</span></li>' for t, d in steps)
    body = '<main id="content">' + page_hero([("index.html", "ទំព័រដើម"), (None, "សម្រាប់គ្រូ")], "សម្រាប់លោកគ្រូ អ្នកគ្រូ",
                                            "ឧបករណ៍ឥតគិតថ្លៃសម្រាប់រៀបចំវិញ្ញាសា ប្រឡង និងគ្រប់គ្រងពិន្ទុរបស់ថ្នាក់ ។")
    body += f"""<section class="section section-tight"><div class="wrap"><div class="tools">{cards}</div></div></section>
<section class="section section-alt"><div class="wrap"><div class="section-head left"><h2>ការប្រើប្រាស់ក្នុងមួយឆមាស</h2></div><ol class="steps-line">{st}</ol></div></section>
</main>
"""
    page = head(f"សម្រាប់គ្រូ — {SITE}", "ឧបករណ៍បង្កើតវិញ្ញាសា និងគ្រប់គ្រងពិន្ទុថ្នាក់រៀន សម្រាប់គ្រូគណិតវិទ្យា", "")
    return page + header("", grades, "teach") + body + footer("", grades)


ABOUT_IMG = "static/img/about/"
ABOUT_DOCS = [  # (group title, [(file stem, title, issuer, year)])
    ("សញ្ញាបត្រ", [
        ("its-master-en", "សញ្ញាបត្រអនុបណ្ឌិតស្ថិតិ (Master of Statistics)", "Institut Teknologi Sepuluh Nopember (ITS) ឥណ្ឌូនេស៊ី", "២០២៤"),
        ("its-master-id", "Ijazah — Magister Statistika (M.Stat.)", "Institut Teknologi Sepuluh Nopember (ITS) ឥណ្ឌូនេស៊ី", "២០២៤"),
        ("its-transcript", "ព្រឹត្តិប័ត្រពិន្ទុថ្នាក់អនុបណ្ឌិត (GPA 3.54)", "ITS · មហាវិទ្យាល័យវិទ្យាសាស្ត្រ និងវិភាគទិន្នន័យ", "២០២៤"),
        ("nie-teacher-higher-ed", "សញ្ញាបត្រគ្រូបង្រៀនកម្រិតឧត្តម ឯកទេសគណិតវិទ្យា–បច្ចេកវិទ្យា ICT", "វិទ្យាស្ថានជាតិអប់រំ · ក្រសួងអប់រំ យុវជន និងកីឡា", "២០១០"),
        ("rupp-bsc-math", "បរិញ្ញាបត្រវិទ្យាសាស្ត្រ ឯកទេសគណិតវិទ្យា", "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ · ក្រសួងអប់រំ យុវជន និងកីឡា", "២០០៩"),
        ("cms-kampot-2015", "លិខិតតែងតាំងសមាជិកគណៈកម្មការប្រតិបត្តិ សាខាខេត្តកំពត", "សហគមន៍អ្នកគណិតវិទ្យាកម្ពុជា", "២០១៥"),
    ]),
    ("វិទ្យាសាស្ត្រទិន្នន័យ និងកម្មវិធីកុំព្យូទ័រ", [
        ("udemy-ml-az", "Machine Learning A-Z: AI, Python & R (៤២.៥ ម៉ោង)", "Udemy", "២០២៤"),
        ("udemy-python-ds-ml", "Python for Data Science and Machine Learning Bootcamp (២៥ ម៉ោង)", "Udemy", "២០២៣"),
        ("cs-ds-intermediate", "Data Science Intermediate", "Coding Studio", "២០២៣"),
        ("cs-ds-fundamental", "Fundamental Data Science", "Coding Studio", "២០២៣"),
        ("cs-python", "Fundamental Python", "Coding Studio", "២០២៣"),
        ("cs-excel", "Fundamental Excel", "Coding Studio", "២០២៣"),
        ("skillup-excel-analytics", "Business Analytics with Excel", "SkillUp by Simplilearn", "២០២៣"),
        ("skillup-r", "Data Science with R Programming", "SkillUp by Simplilearn", "២០២៣"),
        ("its-matlab", "MATLAB Software Training (និទ្ទេស A)", "ITS Global Engagement", "២០២២"),
        ("its-python", "Python Software Training", "ITS Global Engagement", "២០២២"),
        ("rupp-math-finance", "វគ្គគណិតវិទ្យាហិរញ្ញវត្ថុ", "ដេប៉ាតឺម៉ង់គណិតវិទ្យា សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ", "២០០៩"),
        ("nie-khmer-unicode", "Khmer Unicode និង OpenOffice", "វិទ្យាស្ថានជាតិអប់រំ និងវិទ្យាស្ថានបើកទូលាយ", "២០១០"),
        ("it-word-excel", "Ms. Word និង Excel", "IT Center · មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានីភ្នំពេញ", "២០០៦"),
    ]),
    ("សន្និសីទ សិក្ខាសាលា និងភាសា", [
        ("seameo-recsam-2024", "Webinar ៖ Backward Design និងការសរសេរអត្ថបទស្រាវជ្រាវ", "SEAMEO RECSAM ម៉ាឡេស៊ី", "២០២៤"),
        ("ayf-2023", "ASEAN Youth Forum · ASEAN Higher Education Conference", "ទីក្រុងបាន់ដុង ឥណ្ឌូនេស៊ី", "២០២៣"),
        ("its-wcp-2023", "Statistical Learnings for Spatio-Temporal Point Processes (World Class Professor)", "ដេប៉ាតឺម៉ង់ស្ថិតិ ITS", "២០២៣"),
        ("its-bipa", "ភាសាឥណ្ឌូនេស៊ីសម្រាប់ការសិក្សា (BIPA) ៣ កម្រិត · Outstanding", "Global Language Center, ITS", "២០២២"),
    ]),
]
ABOUT_TIMELINE = [  # (years, title, place)
    ("២០២២ – ២០២៤", "អនុបណ្ឌិតស្ថិតិ (Magister Statistika, M.Stat.) និទ្ទេស Very Satisfactory", "Institut Teknologi Sepuluh Nopember (ITS) ទីក្រុងសុរ៉ាបាយ៉ា ឥណ្ឌូនេស៊ី · វគ្គ Python, MATLAB, R, Machine Learning · ASEAN Youth Forum 2023"),
    ("២០១៥", "សមាជិកគណៈកម្មការប្រតិបត្តិ សហគមន៍អ្នកគណិតវិទ្យាកម្ពុជា សាខាខេត្តកំពត", "អាណត្តិ ២០១៥ – ២០១៧"),
    ("២០១៣ – ២០១៥", "សិក្សាថ្នាក់អនុបណ្ឌិតគណិតវិទ្យា", "CUS ភ្នំពេញ"),
    ("ចាប់ពី ២០១០", "គ្រូបង្រៀនគណិតវិទ្យា ថ្នាក់ទី ១០ ដល់ទី ១២ និងអនុប្រធានក្រុមបច្ចេកទេសគណិតវិទ្យា", "វិទ្យាល័យកន្សោមអក ខេត្តកំពត · ចូលរួមកែវិញ្ញាសាប្រឡងបាក់ឌុបរៀងរាល់ឆ្នាំ"),
    ("២០០៩ – ២០១០", "សញ្ញាបត្រគ្រូបង្រៀនកម្រិតឧត្តម ឯកទេសគណិតវិទ្យា–បច្ចេកវិទ្យា ICT", "វិទ្យាស្ថានជាតិអប់រំ ភ្នំពេញ"),
    ("២០០៥ – ២០០៩", "បរិញ្ញាបត្រវិទ្យាសាស្ត្រ ឯកទេសគណិតវិទ្យា (អាហារូបករណ៍)", "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ · រួមទាំងវគ្គពិសេសគណិតវិទ្យាហិរញ្ញវត្ថុ"),
    ("២០០២ – ២០០៥", "មធ្យមសិក្សាទុតិយភូមិ", "វិទ្យាល័យទូកមាស ខេត្តកំពត"),
]


def build_about(data):
    grades = data["grades"]
    body = '<main id="content">' + page_hero([("index.html", "ទំព័រដើម"), (None, "អំពីយើង")], "អំពី " + SITE,
                                            "គេហទំព័ររៀនគណិតវិទ្យាជាភាសាខ្មែរ រៀបរៀងដោយលោកគ្រូ " + AUTHOR + " សម្រាប់សិស្សមធ្យមសិក្សា និងលោកគ្រូ អ្នកគ្រូ ។")
    tl = "".join(f'<li><span class="tl-year">{y}</span><b>{t}</b><small>{p}</small></li>' for y, t, p in ABOUT_TIMELINE)
    def card(f, t, i, y):
        return (f'<figure class="doc-card"><a href="{ABOUT_IMG}{f}.jpg" data-lb="{esc(t)}" target="_blank" rel="noopener">'
                f'<img src="{ABOUT_IMG}{f}-sm.jpg" alt="{esc(t)}" loading="lazy" decoding="async"></a>'
                f'<figcaption><b>{t}</b><small>{i}</small><span class="doc-year">{y}</span></figcaption></figure>')
    docs = "".join(f'<h3 class="doc-group">{g} <span>{kh(len(items))}</span></h3><div class="doc-grid">' + "".join(card(*x) for x in items) + '</div>'
                   for g, items in ABOUT_DOCS)
    ndocs = sum(len(x[1]) for x in ABOUT_DOCS)
    body += f"""<section class="section section-tight"><div class="wrap">
<article class="bio-card">
  <a class="bio-photo" href="{ABOUT_IMG}portrait-full.jpg" data-lb="លោកគ្រូ {AUTHOR}" target="_blank" rel="noopener"><img src="{ABOUT_IMG}portrait.jpg" alt="រូបថតលោកគ្រូ {AUTHOR}" width="600" height="750"></a>
  <div class="bio-text">
    <p class="eyebrow">អ្នករៀបរៀង</p>
    <h2>{AUTHOR} <span class="bio-latin">Khem Puthy</span></h2>
    <p class="bio-role">គ្រូបង្រៀនគណិតវិទ្យា មធ្យមសិក្សាទុតិយភូមិ · អនុបណ្ឌិតស្ថិតិ (M.Stat.)</p>
    <p>លោកគ្រូ {AUTHOR} កើតនៅខេត្តកំពត ។ លោកបានបញ្ចប់បរិញ្ញាបត្រវិទ្យាសាស្ត្រ ឯកទេសគណិតវិទ្យា នៅសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ ក្រោមកម្មវិធីអាហារូបករណ៍ ឆ្នាំ ២០០៩ និងសញ្ញាបត្រគ្រូបង្រៀនកម្រិតឧត្តម ឯកទេសគណិតវិទ្យា–បច្ចេកវិទ្យា ICT នៅវិទ្យាស្ថានជាតិអប់រំ ឆ្នាំ ២០១០ ។</p>
    <p>ចាប់ពីឆ្នាំ ២០១០ លោកបង្រៀនគណិតវិទ្យាថ្នាក់ទី ១០ ដល់ទី ១២ នៅវិទ្យាល័យកន្សោមអក ខេត្តកំពត ជាអនុប្រធានក្រុមបច្ចេកទេសគណិតវិទ្យា និងចូលរួមកែវិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិរៀងរាល់ឆ្នាំ ។ ឆ្នាំ ២០១៥ លោកត្រូវបានតែងតាំងជាសមាជិកគណៈកម្មការប្រតិបត្តិ សហគមន៍អ្នកគណិតវិទ្យាកម្ពុជា សាខាខេត្តកំពត ។</p>
    <p>ឆ្នាំ ២០២៤ លោកបានបញ្ចប់ថ្នាក់អនុបណ្ឌិតស្ថិតិ (Magister Statistika) នៅ Institut Teknologi Sepuluh Nopember (ITS) ទីក្រុងសុរ៉ាបាយ៉ា ប្រទេសឥណ្ឌូនេស៊ី ដោយទទួលបាន GPA 3.54 ។ សារណារបស់លោកវិភាគទំនាក់ទំនងរវាងទីផ្សារភាគហ៊ុនបណ្ដាប្រទេសអាស៊ាន ដោយប្រើវិធី Cointegration ។ ក្នុងរយៈពេលសិក្សា លោកបានបញ្ចប់វគ្គ Python, R, MATLAB, Excel, វិទ្យាសាស្ត្រទិន្នន័យ និង Machine Learning ព្រមទាំងបានចូលរួម ASEAN Youth Forum 2023 និងសិក្ខាសាលាអន្តរជាតិជាច្រើន ។</p>
    <ul class="bio-facts">
      <li><b>ឯកទេស</b><span>គណិតវិទ្យា · ស្ថិតិ · វិទ្យាសាស្ត្រទិន្នន័យ</span></li>
      <li><b>បទពិសោធន៍</b><span>បង្រៀនជាង ១៥ ឆ្នាំ</span></li>
      <li><b>ភាសា</b><span>ខ្មែរ · អង់គ្លេស · ឥណ្ឌូនេស៊ី</span></li>
    </ul>
    <p class="bio-skills">{"".join(f"<span>{t}</span>" for t in ("Python", "R", "MATLAB", "Excel", "Machine Learning", "LaTeX"))}</p>
    <p><a class="btn btn-gold" href="{TELEGRAM}" target="_blank" rel="noopener">{ic('send')} Telegram @KHEMPUTHY</a>
       <a class="btn btn-ghost" href="#documents">{ic('layers')} មើលឯកសារ</a></p>
  </div>
</article>
</div></section>
<section class="section section-tight"><div class="wrap">
  <h2 class="section-title">ប្រវត្តិការសិក្សា និងការងារ</h2>
  <ol class="timeline">{tl}</ol>
</div></section>
<section class="section section-tight" id="documents"><div class="wrap">
  <h2 class="section-title">សញ្ញាបត្រ និងវិញ្ញាបនបត្រ ({kh(ndocs)})</h2>
  <p class="muted">ចុចលើរូប ដើម្បីមើលទំហំធំ ។ លេខលិខិតឆ្លងដែនត្រូវបានបិទ ដើម្បីការពារព័ត៌មានផ្ទាល់ខ្លួន ។</p>
  {docs}
  <p><a class="btn btn-ghost" href="{ABOUT_IMG}Khem-Puthy-Master-ITS-2024.pdf" target="_blank" rel="noopener">{ic('book')} ទាញយកសញ្ញាបត្រអនុបណ្ឌិត (PDF)</a></p>
</div></section>
<section class="section section-tight"><div class="wrap"><div class="prose">
<h2>គោលបំណងនៃគេហទំព័រ</h2>
<p>{SITE} ផ្ដល់មេរៀន លំហាត់ និងតេស្តគណិតវិទ្យា ថ្នាក់ទី {RANGE_TO} ដោយឥតគិតថ្លៃ ។ ខ្លឹមសាររៀបតាមកម្មវិធីសិក្សា និងសៀវភៅពុម្ពរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ដើម្បីឱ្យសិស្សរៀនរំលឹកនៅផ្ទះ និងឱ្យគ្រូប្រើក្នុងថ្នាក់បាន ។</p>
<h2>ខ្លឹមសារ</h2>
<ul>
<li>មេរៀនតាមថ្នាក់ និងជំពូក មានទ្រឹស្តី រូបមន្ត ឧទាហរណ៍ និងលំហាត់មានចម្លើយ ។</li>
<li>តេស្តពហុជ្រើសរើសមាននាឡិកា និងវិញ្ញាសាប្រចាំខែ ។</li>
<li>ឧបករណ៍គ្រូ ៖ បង្កើតវិញ្ញាសា (PDF LaTeX Word) និងប្រព័ន្ធគ្រប់គ្រងថ្នាក់ និងពិន្ទុ ។</li>
</ul>
<h2 id="contact">ទំនាក់ទំនង</h2>
<p>សម្រាប់សំណួរ ការរាយការណ៍កំហុសក្នុងមេរៀន ឬសំណើកែលម្អ សូមផ្ញើសារតាម Telegram ។ សូមប្រាប់ថ្នាក់ មេរៀន និងទំព័រដែលមានបញ្ហា ដើម្បីឱ្យយើងកែបានលឿន ។</p>
<p><a class="btn btn-gold" href="{TELEGRAM}" target="_blank" rel="noopener">{ic('send')} Telegram @KHEMPUTHY</a></p>
<h2>ការប្រើប្រាស់ខ្លឹមសារ</h2>
<p>សិស្ស និងគ្រូអាចប្រើ បោះពុម្ព និងចែករំលែកខ្លឹមសារសម្រាប់ការសិក្សា និងការបង្រៀនដោយឥតគិតថ្លៃ ។ សូមកុំយកទៅលក់ ។ ពេលចែករំលែក សូមដាក់ឈ្មោះ {SITE} ។</p>
</div></div></section></main>
<dialog class="lightbox" id="lightbox"><button class="lb-close" type="button" aria-label="បិទ">{ic('close')}</button><img alt=""><p class="lb-cap"></p></dialog>
<script>(function(){{var d=document.getElementById('lightbox');if(!d||!d.showModal)return;var im=d.querySelector('img'),cp=d.querySelector('.lb-cap');
document.addEventListener('click',function(e){{var a=e.target.closest('[data-lb]');if(!a)return;e.preventDefault();im.src=a.getAttribute('href');im.alt=cp.textContent=a.dataset.lb;d.showModal();}});
d.addEventListener('click',function(e){{if(e.target===d||e.target.closest('.lb-close'))d.close();}});}})();</script>
"""
    jsonld = ('<script type="application/ld+json">' + json.dumps({
        "@context": "https://schema.org", "@type": "Person", "name": "Khem Puthy", "alternateName": AUTHOR,
        "jobTitle": "Mathematics teacher", "image": SITE_URL + "/" + ABOUT_IMG + "portrait.jpg", "sameAs": [TELEGRAM],
        "alumniOf": [{"@type": "CollegeOrUniversity", "name": "Royal University of Phnom Penh"},
                     {"@type": "CollegeOrUniversity", "name": "National Institute of Education, Cambodia"},
                     {"@type": "CollegeOrUniversity", "name": "Institut Teknologi Sepuluh Nopember"}],
        "knowsAbout": ["Mathematics", "Statistics"]}, ensure_ascii=False) + '</script>\n')
    page = head(f"អំពីយើង — {SITE}", "ជីវប្រវត្តិលោកគ្រូ " + AUTHOR + " អ្នករៀបរៀង " + SITE + " សញ្ញាបត្រ និងទំនាក់ទំនង", "", "", jsonld)
    return page + header("", grades, "about") + body + footer("", grades)


PAY_QR = [("aba", "ABA Bank", "PUTHY KHEM"), ("acleda", "ACLEDA Bank", "KHEM PUTHY"), ("khqr", "KHQR", "Khem Puthy")]


def load_books():
    p = os.path.join(ROOT, "static", "books", "books.js")
    if not os.path.exists(p):
        return []
    t = open(p, encoding="utf-8").read()
    return json.loads(t[t.index("["): t.rindex("]") + 1])


def build_books(data):
    grades = data["grades"]
    books = load_books()
    money = lambda n: kh(f"{n:,}")
    cards = ""
    for b in books:
        pts = "".join(f"<li>{ic('check')} {esc(x)}</li>" for x in b.get("points", []))
        cards += f"""<article class="book-card">
  <a class="book-cover" href="static/books/{b['id']}-sample.pdf" target="_blank" rel="noopener" title="អានសាកល្បង">
    <img src="static/books/{b['id']}-cover.jpg" alt="ក្របសៀវភៅ {esc(b['title'])}" width="440" height="570"><span class="book-badge">PDF</span></a>
  <div class="book-info">
    <p class="eyebrow">ថ្នាក់ទី {kh(b['grade'])} · {esc(b['code'])}</p>
    <h2>{esc(b['title'])}</h2>
    <p class="book-en">{esc(b['title_en'])}</p>
    <p>{esc(b['desc'])}</p>
    <ul class="book-points">{pts}</ul>
    <dl class="book-meta"><div><dt>ចំនួនទំព័រ</dt><dd>{kh(b['pages'])}</dd></div><div><dt>ទំហំ</dt><dd>{kh(round(b['size'] / 1048576, 1))} MB</dd></div>
      <div><dt>អ្នករៀបរៀង</dt><dd>{AUTHOR}</dd></div><div><dt>បោះពុម្ព</dt><dd>{esc(b.get('year', ''))}</dd></div></dl>
    <div class="book-buy"><p class="book-price">{money(b['price_khr'])} ៛ <small>ឬ ${b['price_usd']}</small></p>
      <button class="btn btn-gold" type="button" data-buy="{b['id']}">{ic('send')} ទិញសៀវភៅ</button>
      <a class="btn btn-ghost" href="static/books/{b['id']}-sample.pdf" target="_blank" rel="noopener">{ic('book')} អានសាកល្បង {kh(b['sample_pages'])} ទំព័រ</a></div>
  </div>
</article>"""
    if not cards:
        cards = '<div class="empty">មិនទាន់មានសៀវភៅ ។</div>'
    steps = [("ជ្រើសសៀវភៅ", "ចុច «ទិញសៀវភៅ» ហើយវាយឈ្មោះ និងលេខទូរស័ព្ទ ។ អ្នកនឹងទទួលបានលេខបញ្ជាទិញ ។"),
             ("ស្កេន QR បង់ប្រាក់", "ស្កេន KHQR ដោយកម្មវិធីធនាគារណាមួយ (ABA ACLEDA Wing …) ។ សរសេរលេខបញ្ជាទិញក្នុងចំណាំ (Remark) ។"),
             ("ផ្ញើវិក្កយបត្រ", "ផ្ញើរូបវិក្កយបត្រ និងលេខបញ្ជាទិញ ទៅ Telegram @KHEMPUTHY ។"),
             ("ទទួលកូដ ទាញយក", "លោកគ្រូផ្ញើកូដទាញយកមកវិញ ។ ចុចតំណ ឬបិទភ្ជាប់កូដខាងក្រោម នោះសៀវភៅ PDF ទាញយកភ្លាម ។")]
    st = "".join(f'<li><span class="step-n">{kh(i + 1)}</span><b>{t}</b><p>{d}</p></li>' for i, (t, d) in enumerate(steps))
    tabs = "".join(f'<button type="button" role="tab" data-qr="{k}" class="{"on" if i == 0 else ""}" aria-selected="{"true" if i == 0 else "false"}">{n}</button>'
                   for i, (k, n, _) in enumerate(PAY_QR))
    panes = "".join(f'<figure class="qr-pane" data-qr="{k}"{"" if i == 0 else " hidden"}><img src="static/img/pay/{k}.png" alt="KHQR {n} — {who}"><figcaption>{n} · {who}</figcaption></figure>'
                    for i, (k, n, who) in enumerate(PAY_QR))
    body = '<main id="content">' + page_hero([("index.html", "ទំព័រដើម"), (None, "សៀវភៅ")], "សៀវភៅ PDF",
                                            "សៀវភៅគណិតវិទ្យារបស់លោកគ្រូ " + AUTHOR + " ជាឯកសារ PDF ។ បង់ប្រាក់តាម KHQR ហើយទទួលកូដទាញយកភ្លាមៗ ។")
    body += f"""<section class="section section-tight" id="book-shop" data-tg="{TELEGRAM}"><div class="wrap">
{cards}
</div></section>
<section class="section section-tight"><div class="wrap">
  <h2 class="section-title">របៀបទិញ</h2>
  <ol class="buy-steps">{st}</ol>
</div></section>
<section class="section section-tight" id="redeem"><div class="wrap">
  <div class="redeem-box" id="redeem-box">
    <h2>{ic('check')} មានកូដទាញយករួចហើយ?</h2>
    <p class="muted">បិទភ្ជាប់កូដ (ចាប់ផ្ដើមដោយ <code>KPB1.</code>) ដែលលោកគ្រូផ្ញើតាម Telegram ។ សៀវភៅនឹងមានឈ្មោះរបស់អ្នកនៅបាតទំព័រ ។</p>
    <form class="rd-form"><textarea id="rd-code" rows="3" spellcheck="false" autocomplete="off" placeholder="KPB1.xxxxxxxx…"></textarea>
      <button class="btn btn-primary" id="rd-go">{ic('book')} ទាញយកសៀវភៅ</button></form>
    <p class="rd-msg" id="rd-msg" role="status" aria-live="polite"></p>
  </div>
</div></section>
<section class="section section-tight"><div class="wrap"><div class="prose">
  <h2>សំណួរញឹកញាប់</h2>
  <p><b>ក្រោយបង់ប្រាក់ ចាំយូរប៉ុណ្ណា?</b> លោកគ្រូពិនិត្យការបង់ប្រាក់ ហើយផ្ញើកូដមកវិញ ជាធម្មតាក្នុងថ្ងៃតែមួយ ។</p>
  <p><b>ទាញយកបានប៉ុន្មានដង?</b> រក្សាកូដទុក អ្នកអាចទាញយកម្ដងទៀតបាន ពេលប្ដូរទូរស័ព្ទ ឬកុំព្យូទ័រ ។</p>
  <p><b>ហេតុអ្វីមានឈ្មោះខ្ញុំលើសៀវភៅ?</b> ដើម្បីការពារសិទ្ធិអ្នកនិពន្ធ ។ សូមកុំចែករំលែកកូដ ឬឯកសារ PDF ទៅអ្នកផ្សេង ។</p>
  <p><b>មានបញ្ហា?</b> ផ្ញើសារតាម <a href="{TELEGRAM}" target="_blank" rel="noopener">Telegram @KHEMPUTHY</a> ជាមួយលេខបញ្ជាទិញ ។</p>
</div></div></section></main>
<dialog class="order-dlg" id="order-dlg" aria-labelledby="od-book">
  <button class="lb-close dlg-x" type="button" data-close aria-label="បិទ">{ic('close')}</button>
  <p class="eyebrow">បញ្ជាទិញសៀវភៅ PDF</p><h2 id="od-book"></h2><p class="book-price" id="od-price"></p>
  <form id="od-step1">
    <label class="fld"><span>ឈ្មោះ (អក្សរឡាតាំង ឧ. Sok Dara)</span><input id="od-name" autocomplete="name" maxlength="40"></label>
    <label class="fld"><span>លេខទូរស័ព្ទ ឬ Telegram</span><input id="od-phone" autocomplete="tel" maxlength="40" placeholder="012 345 678 ឬ @username"></label>
    <p class="rd-msg bad" id="od-msg"></p>
    <button class="btn btn-gold" id="od-next">បន្ទាប់ ៖ បង់ប្រាក់</button>
  </form>
  <div id="od-step2" hidden>
    <div class="od-oid">លេខបញ្ជាទិញ <b id="od-oid"></b> <button class="btn btn-ghost btn-xs" type="button" id="od-copy-oid">ចម្លង</button></div>
    <p>ស្កេន QR ខាងក្រោម ហើយបង់ <b id="od-amount"></b> ។ សរសេរលេខបញ្ជាទិញក្នុង <b>Remark</b> ។</p>
    <div class="qr-tabs" role="tablist">{tabs}</div>
    <div class="qr-box">{panes}</div>
    <p>បង់រួច ចុចប៊ូតុងខាងក្រោម ៖ សារត្រូវបានចម្លងរួច ។ បិទភ្ជាប់ (Paste) ក្នុង Telegram ហើយភ្ជាប់រូបវិក្កយបត្រ ។</p>
    <textarea id="od-tg-text" rows="6" readonly></textarea>
    <p><a class="btn btn-gold" id="od-tg" href="{TELEGRAM}" target="_blank" rel="noopener">{ic('send')} ផ្ញើវិក្កយបត្រតាម Telegram</a></p>
  </div>
</dialog>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<script src="static/books/books.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js" defer></script>
<script src="static/js/kp-books.js" defer></script>
"""
    page = head(f"សៀវភៅ PDF — {SITE}", "ទិញសៀវភៅគណិតវិទ្យា PDF របស់លោកគ្រូ " + AUTHOR + " បង់ប្រាក់តាម KHQR", "",
                '<link rel="stylesheet" href="static/css/kp-teacher.css">\n')
    return page + header("", grades, "books") + body + footer("", grades)


def build_privacy(data):
    grades = data["grades"]
    body = '<main id="content">' + page_hero([("index.html", "ទំព័រដើម"), (None, "គោលការណ៍ឯកជនភាព")], "គោលការណ៍ឯកជនភាព")
    body += f"""<section class="section section-tight"><div class="wrap"><div class="prose">
<p>យើងប្រមូលព័ត៌មានតែប៉ុណ្ណោះដែលចាំបាច់សម្រាប់ឱ្យគេហទំព័រដំណើរការ ។</p>
<h2>ទិន្នន័យក្នុងកម្មវិធីរុករករបស់អ្នក</h2>
<p>វឌ្ឍនភាពនៃការរៀន ផ្ទៃភ្លឺ ឬងងឹត និងទិន្នន័យថ្នាក់រៀនក្នុងរបៀប Local ត្រូវបានរក្សាទុកក្នុង localStorage នៃកម្មវិធីរុករក (browser) របស់អ្នកប៉ុណ្ណោះ ។ យើងមិនបានទទួលទិន្នន័យទាំងនេះទេ ។ អ្នកអាចលុបវាបានដោយលុបទិន្នន័យគេហទំព័រក្នុងកម្មវិធីរុករក ។</p>
<h2>ប្រព័ន្ធថ្នាក់រៀនអនឡាញ</h2>
<p>បើសាលាបើកប្រើប្រព័ន្ធអនឡាញ (Firebase) ឈ្មោះសិស្ស ពិន្ទុ និងអ៊ីមែលរបស់គ្រូ ត្រូវបានរក្សាទុកលើ Google Firebase ។ មានតែគ្រូដែលបង្កើតថ្នាក់ និង Admin សាលាប៉ុណ្ណោះដែលមើលពិន្ទុរបស់ថ្នាក់បាន ។ សិស្សមើលឃើញតែពិន្ទុរបស់ខ្លួន ។</p>
<h2>ការផ្សាយពាណិជ្ជកម្ម</h2>
<p>គេហទំព័រនេះមិនមានការផ្សាយពាណិជ្ជកម្ម និងមិនលក់ទិន្នន័យទេ ។</p>
<h2>ទំនាក់ទំនង</h2>
<p>សំណួរអំពីឯកជនភាព សូមផ្ញើសារតាម <a href="{TELEGRAM}" target="_blank" rel="noopener">Telegram @KHEMPUTHY</a> ។</p>
</div></div></section></main>
"""
    page = head(f"គោលការណ៍ឯកជនភាព — {SITE}", "របៀបដែល " + SITE + " រក្សាទុក និងប្រើទិន្នន័យ", "")
    return page + header("", grades) + body + footer("", grades)


def build_sitemap_page(data, pages):
    grades = data["grades"]
    cols = ""
    for g in grades:
        ls = grade_lessons(data, g["id"])
        cols += (f'<section><h2><a href="grade-{g["id"]}.html">{esc(g["name"])}</a></h2><ol>'
                 + "".join(f'<li><a href="{lesson_url(g["id"], l["num"])}">{esc(l["title"])}</a></li>' for l in ls) + '</ol></section>')
    other = "".join(f'<li><a href="{u}">{esc(t)}</a></li>' for u, t in pages)
    body = '<main id="content">' + page_hero([("index.html", "ទំព័រដើម"), (None, "ផែនទីគេហទំព័រ")], "ផែនទីគេហទំព័រ")
    body += f'<section class="section section-tight"><div class="wrap"><ul class="link-plain">{other}</ul><div class="sitemap-cols">{cols}</div></div></section></main>\n'
    page = head(f"ផែនទីគេហទំព័រ — {SITE}", "បញ្ជីទំព័រ និងមេរៀនទាំងអស់", "")
    return page + header("", grades) + body + footer("", grades)


def build_404(data):
    grades = data["grades"]
    links = "".join(f'<a class="rule-cell g{g["id"]}" href="/grade-{g["id"]}.html"><span class="rule-num">{kh(g["id"])}</span><span class="rule-lbl">ថ្នាក់ទី {kh(g["id"])}</span></a>' for g in grades)
    body = f"""<main id="content"><section class="section"><div class="wrap center-block">
<p class="big-404">៤០៤</p><h1>រកមិនឃើញទំព័រនេះទេ</h1>
<p class="lead">តំណអាចខុស ឬទំព័រត្រូវបានផ្លាស់ទី ។ ជ្រើសថ្នាក់ខាងក្រោម ឬត្រឡប់ទៅទំព័រដើម ។</p>
<nav class="ruler small" aria-label="ថ្នាក់">{links}</nav>
<p><a class="btn btn-primary" href="/index.html">ទៅទំព័រដើម</a></p>
</div></section></main>
"""
    # absolute paths: the 404 page is served for any missing URL, at any depth
    page = head(f"រកមិនឃើញទំព័រ — {SITE}", "រកមិនឃើញទំព័រ", "/")
    return page + header("/", grades) + body + footer("/", grades)


def build_redirect(target, title):
    return f"""<!doctype html>
<html lang="km"><head><meta charset="utf-8"><title>{esc(title)}</title>
<meta http-equiv="refresh" content="0; url={target}"><link rel="canonical" href="{target}">
<script>location.replace('{target}'+location.hash)</script></head>
<body><p><a href="{target}">{esc(title)}</a></p></body></html>
"""


def wrap_legacy(data, src_path, title, desc, crumb, keep_css=(), keep_js=()):
    """put the <main> of an older hand-made page inside the site template"""
    if not os.path.exists(src_path):
        return None
    s = open(src_path, encoding="utf-8").read()
    m = re.search(r"<main[^>]*>.*?</main>", s, re.S)
    if not m:
        return None
    main = m.group(0)
    main = re.sub(r'href="\.\./[^"]*"', 'href="index.html"', main)
    # links to pages that do not exist on this site go to the teachers' tools page
    main = re.sub(r'href="([\w-]+\.html)"', lambda x: x.group(0) if os.path.exists(os.path.join(ROOT, x.group(1))) else 'href="teachers.html"', main)
    main = re.sub(r'<section class="page-hero[^"]*">\s*<div class="wrap">\s*<ol class="crumbs">.*?</ol>',
                  lambda x: x.group(0).split('<ol class="crumbs">')[0] + f'<ol class="crumbs"><li><a href="index.html">ទំព័រដើម</a></li><li><a href="teachers.html">សម្រាប់គ្រូ</a></li><li aria-current="page">{esc(crumb)}</li></ol>',
                  main, count=1, flags=re.S)
    css = "".join(f'<link rel="stylesheet" href="{c}">\n' for c in keep_css)
    js = "".join(f'<script src="{j}" defer></script>\n' for j in keep_js)
    return head(title, desc, "", css) + header("", data["grades"], "teach") + main + "\n" + footer("", data["grades"], js)


def write_seo(pages):
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "".join(f"  <url><loc>{SITE_URL}/{p}</loc></url>\n" for p in pages) + "</urlset>\n"
    write("sitemap.xml", xml)
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap.xml\n")
    write("manifest.webmanifest", json.dumps({
        "name": SITE, "short_name": "KPMath", "lang": "km", "start_url": "index.html", "display": "standalone",
        "background_color": "#f6f5fb", "theme_color": "#2a1659",
        "icons": [{"src": "static/img/icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": "static/img/icon-512.png", "sizes": "512x512", "type": "image/png"}]}, ensure_ascii=False, indent=1))


def build_grade(data, g):
    grades = data["grades"]
    ls = grade_lessons(data, g["id"])
    tmap = tests_by_id(data)
    items = ""
    last_part = None
    for l in ls:
        part = (l.get("book") or {}).get("part")
        if part and part != last_part:
            pn = l["book"].get("part_no")
            ph = l["book"].get("part_head") or f"ជំពូកទី {kh(pn)} ៖ {part}"
            items += f'</div><h3 class="level-label" style="margin-top:26px">{esc(ph)}</h3><div class="chapters">'
            last_part = part
        t = tmap.get(l.get("testId"))
        meta = f'{esc(l.get("category", ""))} · {kh(len(l.get("theorySections", [])))} ផ្នែក'
        if (l.get("book") or {}).get("pages"):
            pg = l["book"]["pages"]
            meta = f'សៀវភៅទំព័រ {kh(pg[0])}–{kh(pg[1])} · {kh(pg[1] - pg[0] + 1)} ទំព័រ'
        items += f'<a class="chapter" href="{lesson_url(g["id"], l["num"])}"><span class="n">{kh(l["num"])}</span><span><b>{esc(l["title"])}</b><small>{meta}</small></span></a>'
    tests = "".join(
        f'<a class="chapter" href="exam.html?id={t["id"]}"><span class="n">{kh(i + 1)}</span><span><b>{esc(t["chapter"])}</b><small>{kh(t["mcqCount"])} សំណួរ · {kh(t["duration"])} នាទី</small></span></a>'
        for i, t in enumerate(x for x in data["chapterTests"] if x["grade"] == g["id"])
    )
    months = "".join(
        f'<a class="card" href="monthly.html?id={m["id"]}"><span class="ci">{ic("plan")}</span><h3>{esc(m["month"])}</h3><p>{kh(m["duration"])} នាទី · {kh(m["totalPoints"])} ពិន្ទុ</p></a>'
        for m in data["monthlyTests"] if m["grade"] == g["id"]
    )
    month_sec = f'<h2 style="margin:40px 0 16px">វិញ្ញាសាប្រចាំខែ</h2><div class="cards">{months}</div>' if months else ""
    if g["id"] == 9 and os.path.exists(os.path.join(ROOT, "exams9", "index.html")):
        month_sec = (f'<h2 style="margin:40px 0 16px">វិញ្ញាសាត្រៀមប្រឡងសញ្ញាបត្រ</h2><div class="cards"><a class="card" href="exams9/index.html"><span class="ci">{ic("clipboard")}</span>'
                     '<h3>វិញ្ញាសាត្រៀមប្រឡង ៣០ ឈុត</h3><p>វិញ្ញាសាប្រឡងឆ្នាំ ២០២១–២០២៥ វិញ្ញាសាត្រៀមប្រឡង ២០ ឈុត និងវិញ្ញាសាព្យាករណ៍ ២០២៦ ព្រមទាំងអត្រាកំណែលម្អិត។</p></a></div>') + month_sec
    body = f"""<main id="content">
<section class="page-hero">
  <div class="wrap">
    <ol class="crumbs"><li><a href="index.html">ទំព័រដើម</a></li><li aria-current="page">{esc(g['name'])}</li></ol>
    <div class="grade-hero g{g['id']}">
      <span class="grade-badge">{kh(g['id'])}</span>
      <div><span class="level">គណិតវិទ្យា</span><h1>{esc(g['name'])}</h1><p class="lead">{esc(g['desc'])}</p></div>
    </div>
    <nav class="gtabs" aria-label="ថ្នាក់ផ្សេងទៀត">{"".join(f'<a class="gtab g{x["id"]}" href="grade-{x["id"]}.html"{' aria-current="page"' if x["id"] == g["id"] else ''}><span class="fg g{x["id"]}">{kh(x["id"])}</span>{esc(x["name"])}</a>' for x in grades)}</nav>
  </div>
</section>
<section class="section section-tight g{g['id']}">
  <div class="wrap">
    <h2 style="margin:0 0 16px">មេរៀនទាំងអស់ ({kh(len(ls))})</h2>
    <div class="chapters">{items}</div>
    {f'<h2 style="margin:40px 0 16px">តេស្តតាមមេរៀន</h2><div class="chapters">{tests}</div>' if tests else ''}
    {month_sec}
  </div>
</section>
</main>
"""
    page = head(f"{g['name']} — {SITE}", g["desc"], "")
    page += header("", grades, "grades") + body + footer("", grades, '<script src="static/js/progress.js" defer></script>\n')
    return page


LEVEL = {"ងាយ": "easy", "មធ្យម": "medium", "ពិបាក": "hard"}


def quiz_items(test):
    out = []
    for q in test["questions"]:
        if q["type"] != "mcq":
            continue
        keys = [o["key"] for o in q["options"]]
        if q["answer"] not in keys:
            continue
        out.append({
            "no": len(out) + 1,
            "sec": "q-" + LEVEL.get(q.get("difficulty"), "medium"),
            "type": "mcq",
            "level": LEVEL.get(q.get("difficulty"), "medium"),
            "stem": text_html(q["question"]),
            "options": [text_html(o["text"]) for o in q["options"]],
            "answer": keys.index(q["answer"]),
            "hint": "អានមេរៀនឡើងវិញ ហើយពិនិត្យជម្រើសនីមួយៗ។",
            "sol": text_html(q.get("explanation") or ""),
        })
    return out


def build_lesson(data, g, idx, ls):
    if "book" in ls[idx]:
        return build_lesson_book(data, g, idx, ls)
    grades = data["grades"]
    l = ls[idx]
    base = "../../"
    test = tests_by_id(data).get(l.get("testId"))
    secs = l.get("theorySections", [])
    toc, paper = [], []

    if l.get("formulas"):
        toc.append('<li><a href="#f">រូបមន្តសំខាន់ៗ</a></li>')
        lis = "".join(
            f'<li><b>{text_html(f.get("name", ""))}</b>{rich_html(f.get("math", ""))}'
            + (f'<p>{text_html(f["desc"])}</p>' if f.get("desc") else "") + "</li>"
            for f in l["formulas"]
        )
        paper.append(f'<section class="bx bx-rule" id="f"><header class="bx-h"><b>រូបមន្តសំខាន់ៗ</b></header><div class="bx-b"><ol class="list">{lis}</ol></div></section>')

    for i, s in enumerate(secs, 1):
        s = dict(s)
        if s["title"].count("$") % 2 and re.match(r"\s*\$\)\}", s.get("content", "")):   # title cut in two
            s["title"] += "}$)"
            s["content"] = re.sub(r"^\s*\$\)\}", "", s["content"])
        toc.append(f'<li class="sub"><a href="#u{i}">{i}. {plain(s["title"])}</a></li>')
        paper.append(f'<h3 id="u{i}">{i}. {text_html(s["title"])}</h3>' + rich_html(s.get("content", "")))

    written = [q for q in (test or {}).get("questions", []) if q["type"] == "written"]
    if written:
        toc.append('<li><a href="#s1">លំហាត់</a></li>')
        ex = ""
        for i, q in enumerate(written, 1):
            sol = rich_html(q.get("solution", "")) if q.get("solution") else ""
            ans = f'<details class="ans"><summary>មើលចម្លើយ</summary>{sol}</details>' if sol else ""
            ex += f'<section class="bx bx-try"><header class="bx-h"><span class="pill">{kh(i)}</span><b>លំហាត់ទី {kh(i)}</b> <span class="bx-note">({kh(q.get("points", ""))} ពិន្ទុ)</span></header><div class="bx-b">{rich_html(q["question"])}{ans}</div></section>'
        paper.append(f'<h3 id="s1">លំហាត់</h3>{ex}')

    qz = quiz_items(test) if test else []
    qz_json = ""
    if qz:
        toc.append('<li><a href="#qz">ពិនិត្យខ្លួនឯង</a></li>')
        boxes = ""
        for lv, name in (("easy", "កម្រិតងាយ"), ("medium", "កម្រិតមធ្យម"), ("hard", "កម្រិតពិបាក")):
            n = sum(1 for q in qz if q["level"] == lv)
            if n:
                boxes += f'<section class="qz" data-sec="q-{lv}"><div class="qz-head"><h3 class="qz-title">✎ ពិនិត្យខ្លួនឯង៖ {name} <small>({kh(n)} សំណួរ)</small></h3><span class="qz-score"></span></div><p class="qz-intro">ជ្រើសរើសចម្លើយ រួចចុច «ពិនិត្យ»។ ចម្លើយរបស់អ្នកត្រូវបានរក្សាទុកក្នុងកុំព្យូទ័រនេះ។</p><div class="qz-list"></div><div class="qz-foot"><button type="button" class="qz-reset">លុបចម្លើយ ធ្វើឡើងវិញ</button></div></section>'
        paper.append(f'<h3 id="qz">ពិនិត្យខ្លួនឯង</h3>{boxes}')
        qz_json = '<script type="application/json" id="qz-data">' + json.dumps(qz, ensure_ascii=False).replace("</", "<\\/") + "</script>"

    if test:
        paper.append(f'<div class="callout"><div><p><b>{esc(test["title"])}</b> — {kh(test["mcqCount"])} សំណួរ · {kh(test["duration"])} នាទី · {kh(test["points"])} ពិន្ទុ</p></div><a class="btn btn-primary btn-sm" href="{base}exam.html?id={test["id"]}">ចាប់ផ្ដើមតេស្ត</a></div>')

    pager = '<nav class="ls-pager">'
    if idx > 0:
        p = ls[idx - 1]
        pager += f'<a class="prev" href="L{p["num"]:02d}.html"><small>← មេរៀនមុន</small><b>{esc(p["title"])}</b></a>'
    if idx < len(ls) - 1:
        n = ls[idx + 1]
        pager += f'<a class="next" href="L{n["num"]:02d}.html"><small>មេរៀនបន្ទាប់ →</small><b>{esc(n["title"])}</b></a>'
    pager += "</nav>"

    chips = f'<span class="chip chip-soon">{esc(l.get("category", ""))}</span><span class="chip chip-soon">{kh(len(secs))} ផ្នែក</span>'
    if qz:
        chips += f'<span class="chip chip-soon">សំណួរពិនិត្យខ្លួនឯង {kh(len(qz))}</span>'
    if written:
        chips += f'<span class="chip chip-soon">លំហាត់ {kh(len(written))}</span>'

    body = f"""<main id="content">
<section class="page-hero ls-hero g{g['id']}">
  <div class="wrap">
    <ol class="crumbs"><li><a href="{base}index.html">ទំព័រដើម</a></li><li><a href="{base}grade-{g['id']}.html">{esc(g['name'])}</a></li><li aria-current="page">មេរៀនទី {kh(l['num'])}</li></ol>
    <div class="ls-head">
      <span class="ls-badge">{kh(l['num'])}</span>
      <div><span class="ls-kicker">មេរៀនទី {kh(l['num'])} · គណិតវិទ្យា{esc(g['name'])}</span><h1>{esc(l['title'])}</h1><div class="ls-chips">{chips}</div></div>
    </div>
  </div>
</section>
<section class="ls">
  <div class="wrap ls-layout">
    <aside class="ls-side">
      <div class="ls-side-box">
        <div class="ls-side-t">ក្នុងមេរៀននេះ</div>
        <ol class="ls-toc">{''.join(toc)}</ol>
        <a class="ls-fx" href="{base}grade-{g['id']}.html">{ic('grid', 'ic ic-sm')} មេរៀនទាំងអស់</a>
      </div>
    </aside>
    <article class="ls-paper">
{''.join(paper)}
{pager}
    </article>
  </div>
</section>
</main>
{qz_json}
"""
    title = f"មេរៀនទី {kh(l['num'])} : {l['title']} — គណិតវិទ្យា{g['name']} — {SITE}"
    page = head(title, f"មេរៀនទី {kh(l['num'])} «{l['title']}» គណិតវិទ្យា{g['name']}៖ ទ្រឹស្តី រូបមន្ត លំហាត់ និងសំណួរពិនិត្យខ្លួនឯង។", base,
                f'<link rel="stylesheet" href="{base}static/css/lesson.css">\n')
    scripts = (f'<script src="{base}static/js/progress.js" defer></script>\n'
               f'<script src="{base}static/katex/katex.min.js" defer></script>\n'
               f'<script src="{base}static/katex/contrib/auto-render.min.js" defer></script>\n'
               f'<script src="{base}static/js/lesson.js" defer></script>\n'
               f'<script src="{base}static/js/quiz.js" defer></script>\n')
    page += header(base, grades, "grades") + body + footer(base, grades, scripts)
    return page


EXAM_CSS = """<style>
.ex-bar{position:sticky;top:0;z-index:40;background:var(--surface);border-bottom:1px solid var(--line)}
.ex-bar .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:10px;padding-bottom:10px}
.ex-title{font-weight:700;line-height:1.4}.ex-title small{display:block;color:var(--ink-3);font-weight:500}
.ex-timer{font-weight:700;padding:5px 14px;border-radius:999px;background:var(--amber-soft);color:var(--amber);white-space:nowrap}
.ex-layout{display:grid;grid-template-columns:260px 1fr;gap:24px;padding:24px 0 60px}
@media(max-width:820px){.ex-layout{grid-template-columns:1fr}}
.ex-side,.ex-box{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px}
.ex-side{height:fit-content}
.ex-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin:10px 0 14px}
.ex-nb{aspect-ratio:1;min-width:0;padding:0;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;font:inherit;font-weight:600;cursor:pointer}
.ex-nb.done{background:var(--teal-soft);color:var(--teal);border-color:var(--teal-soft)}
.ex-nb.on{background:var(--teal);color:#fff;border-color:var(--teal)}
.ex-nb.ok{background:#d3f9d8;color:#2b8a3e;border-color:#8ce99a}.ex-nb.bad{background:#ffe3e3;color:#c92a2a;border-color:#ffa8a8}
.ex-meta{display:flex;justify-content:space-between;gap:8px;margin-bottom:12px;color:var(--ink-3);font-size:14px}
.ex-stem{font-size:18px;font-weight:600;line-height:1.8;margin-bottom:18px}
.ex-opt{display:flex;gap:12px;align-items:center;padding:12px 16px;border:1px solid var(--line);border-radius:12px;margin-bottom:10px;cursor:pointer}
.ex-opt:hover{border-color:var(--teal)}.ex-opt.sel{border-color:var(--teal);background:var(--teal-soft)}
.ex-opt.right{border-color:#2b8a3e;background:#ebfbee}.ex-opt.wrong{border-color:#c92a2a;background:#fff5f5}
.ex-key{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--bg,#f1f3f5);font-weight:700;flex:none}
.ex-nav{display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding-top:16px;margin-top:18px}
.ex-sol{margin-top:12px;padding:12px 14px;border-radius:10px;background:var(--teal-soft);font-size:15.5px}
.ex-score{text-align:center;padding:18px;border-radius:var(--radius);background:var(--teal-soft);margin-bottom:18px}
.ex-score b{font-size:40px;color:var(--teal)}
.ex-written{margin-top:28px}.ex-written details{border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin-bottom:10px}
.ex-written summary{cursor:pointer;font-weight:600}
</style>
"""

EXAM_JS = r"""<script>
(function(){
  'use strict';
  var KH='០១២៣៤៥៦៧៨៩';function kh(n){return String(n).replace(/\d/g,function(d){return KH[d]})}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function tx(s){return esc(s).replace(/\$\$([\s\S]+?)\$\$/g,'\\[$1\\]').replace(/\$([^$\n]+?)\$/g,'\\($1\\)').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')}
  function math(el){if(window.renderMathInElement)renderMathInElement(el,{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false,strict:'ignore'})}
  var D=window.MATH_DATA||{},id=new URLSearchParams(location.search).get('id');
  var T=(D.chapterTests||[]).filter(function(t){return t.id===id})[0];
  var box=document.getElementById('ex-box');
  if(!T){box.innerHTML='<p>រកមិនឃើញតេស្តនេះទេ។ <a href="practice.html">ត្រឡប់ទៅបញ្ជីតេស្ត</a></p>';return}
  document.title=T.title+' — KPCambodianmathematics';
  document.getElementById('ex-title').innerHTML=esc(T.title)+'<small>ថ្នាក់ទី '+kh(T.grade)+' · '+kh(T.duration)+' នាទី</small>';
  var Q=T.questions.filter(function(q){return q.type==='mcq'}),W=T.questions.filter(function(q){return q.type!=='mcq'});
  var cur=0,ans={},done=false,left=T.duration*60,timer;
  var KEY='exam:'+T.id;try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.ans&&!s.done){ans=s.ans;left=s.left||left}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify({ans:ans,left:left,done:done}))}catch(e){}}
  function nav(){var g=document.getElementById('ex-grid');g.innerHTML='';Q.forEach(function(q,i){var b=document.createElement('button');b.type='button';b.textContent=kh(i+1);
    b.className='ex-nb'+(i===cur?' on':'')+(done?(ans[i]===q.answer?' ok':' bad'):(ans[i]!=null?' done':''));b.onclick=function(){cur=i;show()};g.appendChild(b)});
    document.getElementById('ex-count').textContent='បានឆ្លើយ '+kh(Object.keys(ans).length)+' / '+kh(Q.length)}
  function show(){var q=Q[cur];var h='<div class="ex-meta"><span>សំណួរទី '+kh(cur+1)+' / '+kh(Q.length)+'</span><span>'+esc(q.difficulty||'')+' · '+kh(q.points||1)+' ពិន្ទុ</span></div>';
    h+='<div class="ex-stem">'+tx(q.question)+'</div>';
    q.options.forEach(function(o){var c='ex-opt';if(ans[cur]===o.key)c+=' sel';if(done){if(o.key===q.answer)c+=' right';else if(ans[cur]===o.key)c+=' wrong'}
      h+='<label class="'+c+'" data-k="'+esc(o.key)+'"><span class="ex-key">'+esc(o.key)+'</span><span>'+tx(o.text)+'</span></label>'});
    if(done&&q.explanation)h+='<div class="ex-sol"><b>ចម្លើយ៖ ('+esc(q.answer)+')</b> '+tx(q.explanation)+'</div>';
    h+='<div class="ex-nav"><button class="btn btn-ghost btn-sm" type="button" id="ex-prev"'+(cur?'':' disabled')+'>← មុន</button><button class="btn btn-ghost btn-sm" type="button" id="ex-next"'+(cur<Q.length-1?'':' disabled')+'>បន្ទាប់ →</button></div>';
    box.innerHTML=h;
    box.querySelectorAll('.ex-opt').forEach(function(l){l.onclick=function(){if(done)return;ans[cur]=l.getAttribute('data-k');save();show()}});
    document.getElementById('ex-prev').onclick=function(){if(cur){cur--;show()}};
    document.getElementById('ex-next').onclick=function(){if(cur<Q.length-1){cur++;show()}};
    nav();math(box)}
  function tick(){if(done)return;left--;if(left<=0){left=0;submit(true)}var m=Math.floor(left/60),s=left%60;document.getElementById('ex-timer').textContent='⏱ '+kh((m<10?'0':'')+m+':'+(s<10?'0':'')+s);if(left%10===0)save()}
  function submit(auto){if(done)return;if(!auto&&Object.keys(ans).length<Q.length&&!confirmBox())return;done=true;clearInterval(timer);save();
    var ok=0,pts=0,tot=0;Q.forEach(function(q,i){tot+=q.points||1;if(ans[i]===q.answer){ok++;pts+=q.points||1}});
    document.getElementById('ex-result').innerHTML='<div class="ex-score"><div>លទ្ធផល</div><b>'+kh(ok)+' / '+kh(Q.length)+'</b><div>ត្រឹមត្រូវ '+kh(Math.round(ok*100/Q.length))+'% · ចុចលេខសំណួរដើម្បីមើលចម្លើយ</div><p style="margin-top:12px"><button class="btn btn-primary btn-sm" type="button" id="ex-again">ធ្វើម្ដងទៀត</button></p></div>';
    document.getElementById('ex-again').onclick=function(){try{localStorage.removeItem(KEY)}catch(e){}location.reload()};
    var sb=document.getElementById('ex-submit');sb.disabled=true;sb.textContent='បានប្រគល់';cur=0;show();window.scrollTo(0,0)}
  function confirmBox(){var b=document.getElementById('ex-submit');if(b.getAttribute('data-sure')){return true}b.setAttribute('data-sure','1');b.textContent='ចុចម្ដងទៀតដើម្បីប្រគល់';return false}
  document.getElementById('ex-submit').onclick=function(){submit(false)};
  if(W.length){var w='<h2>ផ្នែកលំហាត់សរសេរ</h2><p>ធ្វើលើក្រដាស រួចបើកមើលចម្លើយ។</p>';W.forEach(function(q,i){w+='<details><summary>លំហាត់ទី '+kh(i+1)+' ('+kh(q.points||'')+' ពិន្ទុ)៖ '+tx(q.question)+'</summary><div class="ex-sol">'+tx(q.solution||'')+'</div></details>'});
    var we=document.getElementById('ex-written');we.innerHTML=w;math(we)}
  show();tick();timer=setInterval(tick,1000);
})();
</script>
"""


def build_exam(data):
    grades = data["grades"]
    body = """<main id="content">
<div class="ex-bar"><div class="wrap"><div class="ex-title" id="ex-title">កំពុងផ្ទុក…</div>
<div style="display:flex;gap:10px;align-items:center"><span class="ex-timer" id="ex-timer">⏱</span><button class="btn btn-primary btn-sm" type="button" id="ex-submit">ប្រគល់វិញ្ញាសា</button></div></div></div>
<div class="wrap">
  <div class="ex-layout">
    <aside class="ex-side"><b>បញ្ជីសំណួរ</b><div class="ex-grid" id="ex-grid"></div><small id="ex-count"></small></aside>
    <div><div id="ex-result"></div><section class="ex-box" id="ex-box"><p>កំពុងផ្ទុកសំណួរ…</p></section><section class="ex-written" id="ex-written"></section></div>
  </div>
</div>
</main>
"""
    scripts = ('<script src="static/katex/katex.min.js"></script>\n'
               '<script src="static/katex/contrib/auto-render.min.js"></script>\n'
               '<script src="math_data.js"></script>\n<script src="static/js/book_tests.js"></script>\n' + EXAM_JS)
    page = head(f"តេស្ត — {SITE}", "តេស្តពហុជ្រើសរើសមាននាឡិកា និងកែពិន្ទុស្វ័យប្រវត្តិ", "", EXAM_CSS)
    page += header("", grades, "exam") + body + footer("", grades, scripts)
    return page


MONTHLY_JS = r"""<script>
(function(){
  'use strict';
  var KH='០១២៣៤៥៦៧៨៩';function kh(n){return String(n).replace(/\d/g,function(d){return KH[d]})}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function tx(s){return esc(s).replace(/\$\$([\s\S]+?)\$\$/g,'\\[$1\\]').replace(/\$([^$\n]+?)\$/g,'\\($1\\)').replace(/\n/g,'<br>')}
  var D=window.MATH_DATA||{},id=new URLSearchParams(location.search).get('id');
  var M=(D.monthlyTests||[]).filter(function(t){return t.id===id})[0];var el=document.getElementById('mt');
  if(!M){el.innerHTML='<p>រកមិនឃើញវិញ្ញាសានេះទេ។</p>';return}
  document.title=M.title+' — KPCambodianmathematics';
  var h='<ol class="crumbs no-print"><li><a href="index.html">ទំព័រដើម</a></li><li><a href="grade-'+M.grade+'.html">ថ្នាក់ទី '+kh(M.grade)+'</a></li><li>'+esc(M.month)+'</li></ol>';
  h+='<h1>'+esc(M.title)+'</h1><p class="mt-meta">រយៈពេល '+kh(M.duration)+' នាទី · ពិន្ទុសរុប '+kh(M.totalPoints)+' · មេរៀន៖ '+esc(M.lessonsCovered||'')+'</p>';
  h+='<p class="no-print"><button class="btn btn-primary btn-sm" type="button" onclick="window.print()">បោះពុម្ព</button></p>';
  (M.sections||[]).forEach(function(s){h+='<section class="mt-sec"><h2>'+esc(s.title)+'</h2>';(s.questions||[]).forEach(function(q){h+='<p>'+tx(q)+'</p>'});h+='</section>'});
  if(M.solutions)h+='<details class="mt-sol"><summary>មើលចម្លើយ</summary><p>'+tx(M.solutions).replace(/ \| /g,'<br>')+'</p></details>';
  el.innerHTML=h;
  if(window.renderMathInElement)renderMathInElement(el,{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false,strict:'ignore'});
})();
</script>
"""


def build_monthly(data):
    grades = data["grades"]
    css = """<style>
.mt-paper{max-width:860px;margin:28px auto 60px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:32px 36px;line-height:1.9}
.mt-paper h1{font-size:26px}.mt-meta{color:var(--ink-3)}.mt-sec{margin-top:22px}.mt-sec h2{font-size:19px;border-bottom:2px solid var(--teal);padding-bottom:4px}
.mt-sol{margin-top:26px;padding:14px 18px;border-radius:12px;background:var(--teal-soft)}.mt-sol summary{cursor:pointer;font-weight:700}
@media print{.site-header,.site-footer,.no-print{display:none!important}.mt-paper{border:0;margin:0;padding:0}.mt-sol{display:none}}
</style>
"""
    body = '<main id="content"><div class="wrap"><article class="mt-paper" id="mt"><p>កំពុងផ្ទុក…</p></article></div></main>\n'
    scripts = ('<script src="static/katex/katex.min.js"></script>\n'
               '<script src="static/katex/contrib/auto-render.min.js"></script>\n'
               '<script src="math_data.js"></script>\n' + MONTHLY_JS)
    page = head(f"វិញ្ញាសាប្រចាំខែ — {SITE}", "វិញ្ញាសាប្រឡងប្រចាំខែ គណិតវិទ្យា", "", css)
    page += header("", grades, "exam") + body + footer("", grades, scripts)
    return page


BOOK_CSS = """<style>
.ls-paper .katex-display{overflow-x:auto;overflow-y:hidden;padding:3px 0;max-width:100%}
.ls-paper ol.list.olka{list-style:none;padding-left:0;counter-reset:kpa}
.ls-paper ol.list.olka>li{counter-increment:kpa;position:relative;padding-left:2.1em}
.ls-paper ol.list.olka>li::before{content:counter(kpa,kp-khmer-alpha);position:absolute;left:0;top:.15em;display:grid;place-items:center;width:1.45em;height:1.45em;border-radius:50%;background:#d6336c;color:#fff;font-weight:700;font-size:.82em}
.ls-paper ol.list.olnum{list-style:none;padding-left:0;counter-reset:kpn}
.ls-paper ol.list.olnum>li{counter-increment:kpn;position:relative;padding-left:2.1em}
.ls-paper ol.list.olnum>li::before{content:counter(kpn,khmer);position:absolute;left:0;top:.15em;display:grid;place-items:center;width:1.45em;height:1.45em;border-radius:50%;background:#1c7ed6;color:#fff;font-weight:700;font-size:.82em}
.ls-paper ol.list.olroman{list-style:upper-roman}
@counter-style kp-khmer-alpha{system:alphabetic;symbols:"ក" "ខ" "គ" "ឃ" "ង" "ច" "ឆ" "ជ" "ឈ" "ញ" "ដ" "ឋ" "ឌ" "ឍ" "ណ" "ត" "ថ" "ទ" "ធ" "ន";}
@media(min-width:640px){.ls-paper ol.list.cols2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:22px}
.ls-paper ol.list.cols3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:18px}
.ls-paper ol.list.cols4,.ls-paper ol.list.cols5{display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5em,1fr));column-gap:14px}}
.ls-paper img.fig{max-width:100%;height:auto}
.ls-paper .kfbox{display:inline-block;border:1px solid currentColor;padding:0 6px;border-radius:4px}
.bx-hist{border-left:3px solid #a9762a}
.qz-lv{display:none}
.ex-list .bx{margin:14px 0}
.bk-page{margin:0 0 22px;text-align:center}.bk-page img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:10px;background:#fff}
.bk-page figcaption{font-size:13px;color:var(--ink-3);margin-top:6px}
.pdf-note{margin:0 0 18px;padding:10px 14px;border-radius:10px;background:var(--teal-soft);font-size:15px}
</style>
"""


def build_lesson_book(data, g, idx, ls):
    grades = data["grades"]
    l = ls[idx]
    b = l["book"]
    base = "../../"
    test = tests_by_id(data).get(l.get("testId"))
    toc = [f'<li class="sub"><a href="#{t["id"]}">{kh(i)}. {t["html"]}</a></li>' for i, t in enumerate(b["toc"], 1)]
    paper = [b["html"]]

    if b["exercises"]:
        toc.append('<li><a href="#s1">លំហាត់អនុវត្តន៍</a></li>')
        ex = ""
        for i, e in enumerate(b["exercises"], 1):
            ans = f'<details class="ans"><summary>មើលដំណោះស្រាយ</summary>{e["sol"]}</details>' if e["sol"] else ""
            ex += f'<section class="bx bx-try" id="ex{i}"><header class="bx-h"><span class="pill">{kh(i)}</span><b>លំហាត់ទី {kh(i)}</b></header><div class="bx-b">{e["q"]}{ans}</div></section>'
        paper.append(f'<h3 id="s1">លំហាត់អនុវត្តន៍</h3><div class="ex-list">{ex}</div>')

    def inl(h):
        return re.sub(r'<div class="md">\\\[(.*?)\\\]</div>', lambda m: '<span class="mi">\\(\\displaystyle ' + m.group(1) + '\\)</span>', h, flags=re.S)
    qz = []
    for q in b["mcq"]:
        q = dict(q, stem=inl(q["stem"]), options=[inl(o) for o in q["options"]])
        if q["answer"] is None or q["answer"] >= len(q["options"]):
            continue
        no = len(qz) + 1
        qz.append({"no": no, "sec": f"q{(no - 1) // 10 + 1}", "type": "mcq", "level": "medium",
                   "stem": q["stem"], "options": q["options"], "answer": q["answer"],
                   "hint": "អានមេរៀនខាងលើឡើងវិញ ហើយលុបជម្រើសដែលមិនត្រឹមត្រូវចោល។",
                   "sol": q.get("sol") or ("ចម្លើយត្រឹមត្រូវគឺជម្រើស (" + "កខគឃងច"[q["answer"]] + ")។")})
    qz_json = ""
    if qz:
        toc.append('<li><a href="#qz">សំណួរពហុជ្រើសរើស</a></li>')
        boxes = ""
        nsec = (len(qz) + 9) // 10
        for k in range(1, nsec + 1):
            n = sum(1 for q in qz if q["sec"] == f"q{k}")
            a, z = (k - 1) * 10 + 1, (k - 1) * 10 + n
            boxes += f'<section class="qz" data-sec="q{k}"><div class="qz-head"><h3 class="qz-title">✎ សំណួរទី {kh(a)}–{kh(z)}</h3><span class="qz-score"></span></div><div class="qz-list"></div><div class="qz-foot"><button type="button" class="qz-reset">លុបចម្លើយ ធ្វើឡើងវិញ</button></div></section>'
        paper.append(f'<h3 id="qz">សំណួរពហុជ្រើសរើស</h3><p class="qz-intro">ជ្រើសរើសចម្លើយត្រឹមត្រូវតែមួយ រួចចុច «ពិនិត្យ»។ ចម្លើយរបស់អ្នកត្រូវបានរក្សាទុកក្នុងកុំព្យូទ័រនេះ។</p>{boxes}')
        qz_json = '<script type="application/json" id="qz-data">' + json.dumps(qz, ensure_ascii=False).replace("</", "<\\/") + "</script>"

    if test:
        paper.append(f'<div class="callout"><div><p><b>{esc(test["title"])}</b> — {kh(test["mcqCount"])} សំណួរ · {kh(test["duration"])} នាទី</p></div><a class="btn btn-primary btn-sm" href="{base}exam.html?id={test["id"]}">ចាប់ផ្ដើមតេស្ត</a></div>')

    pager = '<nav class="ls-pager">'
    if idx > 0:
        p = ls[idx - 1]
        pager += f'<a class="prev" href="L{p["num"]:02d}.html"><small>← មេរៀនមុន</small><b>{esc(p["title"])}</b></a>'
    if idx < len(ls) - 1:
        n = ls[idx + 1]
        pager += f'<a class="next" href="L{n["num"]:02d}.html"><small>មេរៀនបន្ទាប់ →</small><b>{esc(n["title"])}</b></a>'
    pager += "</nav>"

    chips = f'<span class="chip chip-soon">{esc(l.get("category", ""))}</span><span class="chip chip-soon">{kh(len(b["toc"]))} ផ្នែក</span>'
    if b["exercises"]:
        chips += f'<span class="chip chip-soon">លំហាត់ {kh(len(b["exercises"]))}</span>'
    if qz:
        chips += f'<span class="chip chip-soon">សំណួរពហុជ្រើសរើស {kh(len(qz))}</span>'
    if b.get("pages"):
        chips = f'<span class="chip chip-soon">{esc(b.get("track", ""))}</span><span class="chip chip-soon">ទំព័រ {kh(b["pages"][0])}–{kh(b["pages"][1])}</span>'
    deck = SLIDE_DECKS.get((int(g["id"]), int(l["num"])))
    if deck:
        chips += f'<a class="chip chip-live" href="{base}studio.html?deck={deck}#slides">▶ ស្លាយបង្រៀន</a>'
    kicker = f"មេរៀនទី {kh(l['num'])} · គណិតវិទ្យា{esc(g['name'])}"
    if b.get("part_head"):
        kicker = f"{esc(b['part_head'])} · " + kicker
    elif b.get("part"):
        kicker = f"ជំពូកទី {kh(b['part_no'])} {esc(b['part'])} · " + kicker

    body = f"""<main id="content">
<section class="page-hero ls-hero g{g['id']}">
  <div class="wrap">
    <ol class="crumbs"><li><a href="{base}index.html">ទំព័រដើម</a></li><li><a href="{base}grade-{g['id']}.html">{esc(g['name'])}</a></li><li aria-current="page">មេរៀនទី {kh(l['num'])}</li></ol>
    <div class="ls-head">
      <span class="ls-badge">{kh(l['num'])}</span>
      <div><span class="ls-kicker">{kicker}</span><h1>{esc(l['title'])}</h1><div class="ls-chips">{chips}</div></div>
    </div>
  </div>
</section>
<section class="ls">
  <div class="wrap ls-layout">
    <aside class="ls-side">
      <div class="ls-side-box">
        <div class="ls-side-t">ក្នុងមេរៀននេះ</div>
        <ol class="ls-toc">{''.join(toc)}</ol>
        <a class="ls-fx" href="{base}grade-{g['id']}.html">{ic('grid', 'ic ic-sm')} មេរៀនទាំងអស់</a>
      </div>
    </aside>
    <article class="ls-paper">
{''.join(paper)}
{pager}
    </article>
  </div>
</section>
</main>
{qz_json}
"""
    title = f"មេរៀនទី {kh(l['num'])} : {l['title']} — គណិតវិទ្យា{g['name']} — {SITE}"
    page = head(title, f"មេរៀនទី {kh(l['num'])} «{l['title']}» គណិតវិទ្យា{g['name']}៖ ទ្រឹស្តី ឧទាហរណ៍ លំហាត់មានដំណោះស្រាយ និងសំណួរពហុជ្រើសរើស។", base,
                f'<link rel="stylesheet" href="{base}static/css/lesson.css">\n' + BOOK_CSS)
    scripts = (f'<script src="{base}static/js/progress.js" defer></script>\n'
               f'<script src="{base}static/katex/katex.min.js" defer></script>\n'
               f'<script src="{base}static/katex/contrib/auto-render.min.js" defer></script>\n'
               f'<script src="{base}static/js/lesson.js" defer></script>\n'
               f'<script src="{base}static/js/quiz.js" defer></script>\n')
    page += header(base, grades, "grades") + body + footer(base, grades, scripts)
    return embed_figures(page)


_FIG_CACHE = {}


def embed_figures(page):
    """Put each lesson figure into the page as a data: URI, so a lesson is one self-contained file."""
    from urllib.parse import quote

    def sub(m):
        k = m.group(1)
        if k not in _FIG_CACHE:
            path = os.path.join(ROOT, "lesson", "fig", k + ".svg")
            if not os.path.exists(path):
                return m.group(0)
            svg = open(path, encoding="utf-8").read()
            svg = re.sub(r"(\d+\.\d{2})\d+", r"\1", svg)
            svg = re.sub(r">\s+<", "><", svg)
            _FIG_CACHE[k] = "data:image/svg+xml;charset=utf-8," + quote(svg, safe=" /:=;,'()-.!*_")
        return 'src="' + _FIG_CACHE[k] + '"'
    page = re.sub(r'src="(?:\.\./)?fig/([0-9a-f]{16})\.svg"', sub, page)
    # a figure whose drawing has not been made yet: a quiet placeholder instead of a broken image
    return re.sub(r'<img[^>]*src="(?:\.\./)?fig/[0-9a-f]{16}\.svg"[^>]*>', '<span class="fig-ph">រូបភាពនេះកំពុងរៀបចំ</span>', page)


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    return rel


def main():
    global SPRITE
    SPRITE = icon_sprite()
    data = load_data()
    files = [write("index.html", build_home(data)),
             write(f"{SITE}.html", build_redirect("index.html", SITE)),
             write("practice.html", build_practice(data)),
             write("teachers.html", build_teachers(data)),
             write("about.html", build_about(data)),
             write("books.html", build_books(data)),
             write("privacy.html", build_privacy(data)),
             write("404.html", build_404(data))]
    geo = wrap_legacy(data, os.path.join(ROOT, "_legacy", "geometry-angle-bisector.html"), f"សំណង់ធរណីមាត្រ — {SITE}",
                      "សង់កន្លះបន្ទាត់ពុះមុំដោយបន្ទាត់ និងកំពាស មួយជំហានម្ដងៗ", "សំណង់ធរណីមាត្រ",
                      ["static/css/construct.css"], ["static/js/construct.js", "static/js/km-sound.js"])
    if geo:
        files.append(write("geometry-angle-bisector.html", geo))
    for g in data["grades"]:
        files.append(write(f"grade-{g['id']}.html", build_grade(data, g)))
        ls = grade_lessons(data, g["id"])
        for i, l in enumerate(ls):
            files.append(write(lesson_url(g["id"], l["num"]), build_lesson(data, g, i, ls)))
    files.append(write("exam.html", build_exam(data)))
    files.append(write("monthly.html", build_monthly(data)))
    try:
        import build_teacher
        build_teacher.build_banks()
        files += build_teacher.build_pages(sys.modules[__name__], data)
    except Exception as e:  # the teacher tools must never break the main site build
        print("teacher tools:", e)
    main_pages = [("index.html", "ទំព័រដើម"), ("practice.html", "តេស្ត និងវិញ្ញាសា"), ("teachers.html", "សម្រាប់គ្រូ"),
                  ("exam-builder.html", "បង្កើតវិញ្ញាសា"), ("classroom.html", "ថ្នាក់រៀនរបស់ខ្ញុំ"), ("student.html", "សិស្សចូលប្រឡង"),
                  ("studio.html", "Exam Studio"), ("geometry-angle-bisector.html", "សំណង់ធរណីមាត្រ"),
                  ("admin.html", "Admin"), ("books.html", "សៀវភៅ PDF"), ("about.html", "អំពីយើង"), ("privacy.html", "គោលការណ៍ឯកជនភាព")]
    files.append(write("sitemap.html", build_sitemap_page(data, main_pages)))
    write_seo([u for u, _ in main_pages] + [f"grade-{g['id']}.html" for g in data["grades"]] +
              [lesson_url(g["id"], l["num"]) for g in data["grades"] for l in grade_lessons(data, g["id"])])
    print(f"Built {len(files)} pages.")
    return files


if __name__ == "__main__":
    main()
