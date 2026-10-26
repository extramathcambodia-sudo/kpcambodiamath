# -*- coding: utf-8 -*-
"""
Grade 9 exam papers (Mathematics for grade 9 2027/part2_exams.tex -> Test2026/...)
-> exams9/index.html and one page per exam with its answer key.

Run after book2web.py (it reuses its converter):  python exams2web.py
"""
import os
import re

from bs4 import BeautifulSoup

import book2web as B
import build_site_from_template as S

ROOT = os.path.dirname(os.path.abspath(__file__))
G9 = os.path.join(ROOT, "Mathematics for grade 9 2027")
OUTDIR = "exams9"
ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

EXAM_MACROS = r"""
\newcommand{\newsect}[2]{\par⟦SECT:#1⟧ #2\par}
\newcommand{\qq}[2]{\par⟦Q:#1⟧ #2\par}
\newcommand{\q}[2]{\par⟦Q:#1⟧ #2\par}
\newcommand{\cont}[1]{#1\par}
\newcommand{\choicesfour}[8]{\par⟦CH⟧\textbf{#1.} $#2$ ⟦CS⟧\textbf{#3.} $#4$ ⟦CS⟧\textbf{#5.} $#6$ ⟦CS⟧\textbf{#7.} $#8$\par}
\newcommand{\choicesthree}[6]{\par⟦CH⟧\textbf{#1.} $#2$ ⟦CS⟧\textbf{#3.} $#4$ ⟦CS⟧\textbf{#5.} $#6$\par}
\newcommand{\anssect}[1]{\par⟦ASECT:#1⟧ }
\newcommand{\subans}[1]{\par⟦Q:#1⟧ }
\newcommand{\finalans}[1]{\par\textbf{ដូចនេះ ៖} ⟦FB⟧$\displaystyle #1$⟦/FB⟧\par}
\newcommand{\examtitle}[2]{}
\newcommand{\khtitle}[1]{#1}\newcommand{\kh}[1]{#1}\newcommand{\score}[1]{(#1ពិន្ទុ)}
\newcommand{\tick}{✓}\newcommand{\checkmark}{✓}
"""


def read(rel):
    p = os.path.join(G9, rel if rel.endswith(".tex") else rel + ".tex")
    return open(p, encoding="utf-8").read()


def plan():
    t = B.strip_comments(read("part2_exams.tex"))
    groups, cur = [], None
    for m in re.finditer(r"\\subpartdivider\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}|\\addcontentsline\{toc\}\{section\}\{([^}]*)\}\s*\\input\{([^}]*)\}", t):
        if m.group(1):
            cur = {"label": m.group(1), "title": m.group(2), "desc": m.group(3), "exams": []}
            groups.append(cur)
            continue
        title, path = m.group(4), m.group(5)
        slug = os.path.basename(path).replace(".tex", "")
        if title.startswith("អត្រាកំណែ"):
            if cur and cur["exams"]:
                cur["exams"][-1]["ans"] = path
            continue
        if cur is None:
            continue
        cur["exams"].append({"title": title, "src": path, "slug": slug, "ans": None})
    return groups


def pre_exam(t):
    t = B.strip_comments(t)
    # drop local re-definitions (\renewcommand{\examtitle}[2]{...})
    while True:
        m = re.search(r"\\renewcommand\{\\[a-zA-Z]+\}(\[\d\])?\{", t)
        if not m:
            break
        e = B.group(t, m.end() - 1)
        t = t[:m.start()] + t[e:]
    date = re.search(r"\\examtitle\{([^}]*)\}", t)
    t = re.sub(r"\\(linespread\{[^}]*\}|selectfont|raggedcolumns)", "", t)
    t = re.sub(r"\\setlength\{\\[a-zA-Z]+\}\{[^}]*\}", "", t)
    t = re.sub(r"\\setcounter\{[^}]*\}\{[^}]*\}", "", t)
    return t, (date.group(1) if date else "")


def post_exam(html):
    soup = BeautifulSoup(html, "html.parser")
    n_sect = 0
    for p in soup.find_all("p"):
        inner = p.decode_contents().strip()
        m = re.match(r"⟦SECT:(.*?)⟧\s*(.*)$", inner, re.S)
        if m:
            n_sect += 1
            h = BeautifulSoup(f'<h3 id="x{n_sect}"><span class="ex-roman">{ROMAN[n_sect - 1] if n_sect <= 10 else n_sect}.</span> <span class="ex-pts">({m.group(1)} ពិន្ទុ)</span></h3>'
                              + (f"<p>{m.group(2)}</p>" if m.group(2).strip() else ""), "html.parser")
            p.replace_with(h)
            continue
        m = re.match(r"⟦ASECT:(.*?)⟧\s*(.*)$", inner, re.S)
        if m:
            p.replace_with(BeautifulSoup(f'<h4 class="ans-sect">លំហាត់ {m.group(1)} <span class="ex-pts">{m.group(2)}</span></h4>', "html.parser"))
            continue
        m = re.match(r"⟦Q:(.*?)⟧\s*(.*)$", inner, re.S)
        if m:
            p.replace_with(BeautifulSoup(f'<p class="ex-q"><span class="ex-badge">{m.group(1)}</span> {m.group(2)}</p>', "html.parser"))
            continue
        if inner.startswith("⟦CH⟧"):
            parts = [x.strip() for x in inner[len("⟦CH⟧"):].split("⟦CS⟧")]
            p.replace_with(BeautifulSoup('<div class="ex-ch">' + "".join(f"<span>☐ {x}</span>" for x in parts) + "</div>", "html.parser"))
    return str(soup)


def convert(t):
    t, date = pre_exam(t)
    latex = B.pre_latex(t)
    try:
        raw = B.pandoc(EXAM_MACROS + latex)
    except RuntimeError:
        # unbalanced braces in the source: balance them and try again
        bal = len(re.findall(r"(?<!\\)\{", latex)) - len(re.findall(r"(?<!\\)\}", latex))
        latex = latex + "}" * bal if bal > 0 else re.sub(r"\}\s*$", "", latex.rstrip(), count=-bal)
        raw = B.pandoc(EXAM_MACROS + latex)
    html = B.post_html(raw, "../lesson/fig/")
    return post_exam(html), date


EXAM_CSS = """<style>
.ex-q{position:relative;padding-left:2.1em}
.ex-badge{position:absolute;left:0;top:.2em;display:grid;place-items:center;width:1.5em;height:1.5em;border-radius:50%;background:#1c7ed6;color:#fff;font-weight:700;font-size:.85em}
.ex-ch{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px 16px;margin:4px 0 12px 2.1em}
@media(max-width:640px){.ex-ch{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ex-pts{font-weight:500;color:var(--ink-3);font-size:.85em}
.ex-roman{color:#d6336c}
.ls-paper h3{margin-top:26px}
.ans-sect{margin-top:22px;color:#c2255c}
.ex-head{text-align:center;margin-bottom:18px}
.ex-head b{display:block;font-size:20px}
.ex-ans{margin-top:34px;border-top:2px dashed #e99bba;padding-top:10px}
.ex-ans>summary{cursor:pointer;font-weight:700;font-size:18px;color:#c2255c;list-style:none;padding:10px 0}
.ex-ans>summary::-webkit-details-marker{display:none}
.ex-ans>summary::before{content:'▸ '}.ex-ans[open]>summary::before{content:'▾ '}
.ls-paper img.fig{max-width:100%;height:auto}
.ls-toc a.on{font-weight:700}
@media print{.site-header,.site-footer,.ls-side,.ls-pager,.no-print{display:none!important}.ex-ans{display:none}}
</style>
"""


def page_shell(title, desc, body, base="../"):
    data = S.load_data()
    grades = data["grades"]
    page = S.head(title, desc, base, f'<link rel="stylesheet" href="{base}static/css/lesson.css">\n' + S.BOOK_CSS + EXAM_CSS)
    scripts = (f'<script src="{base}static/katex/katex.min.js" defer></script>\n'
               f'<script src="{base}static/katex/contrib/auto-render.min.js" defer></script>\n'
               f'<script src="{base}static/js/lesson.js" defer></script>\n')
    return S.header(base, grades, "exam") + body + S.footer(base, grades, scripts), page


def build():
    S.SPRITE = S.icon_sprite()
    groups = plan()
    # pass 1: figures
    for g in groups:
        for e in g["exams"]:
            for k in ("src", "ans"):
                if e[k]:
                    B.pre_latex(pre_exam(read(e[k]))[0])
    B.FIG_PREAMBLE = os.environ.get("KP_FIG_PREAMBLE", B.FIG_PREAMBLE)
    bad = B.render_all_figures()
    if bad:
        print("failed figures:", len(bad))

    flat = [(g, e) for g in groups for e in g["exams"]]
    os.makedirs(os.path.join(ROOT, OUTDIR), exist_ok=True)
    for i, (g, e) in enumerate(flat):
        qhtml, date = convert(read(e["src"]))
        ahtml = convert(read(e["ans"]))[0] if e["ans"] else ""
        e["date"] = date
        side = ""
        for gg in groups:
            side += f'<li><b>{S.esc(gg["label"])} ៖ {S.esc(gg["title"])}</b></li>'
            for ee in gg["exams"]:
                on = ' class="on"' if ee is e else ""
                side += f'<li class="sub"><a{on} href="{ee["slug"]}.html">{S.esc(short(ee["title"]))}</a></li>'
        pager = '<nav class="ls-pager">'
        if i > 0:
            pe = flat[i - 1][1]
            pager += f'<a class="prev" href="{pe["slug"]}.html"><small>← វិញ្ញាសាមុន</small><b>{S.esc(short(pe["title"]))}</b></a>'
        if i < len(flat) - 1:
            ne = flat[i + 1][1]
            pager += f'<a class="next" href="{ne["slug"]}.html"><small>វិញ្ញាសាបន្ទាប់ →</small><b>{S.esc(short(ne["title"]))}</b></a>'
        pager += "</nav>"
        ans = (f'<details class="ex-ans"><summary>មើលអត្រាកំណែ (ចម្លើយលម្អិត)</summary>{ahtml}</details>' if ahtml else "")
        body = f"""<main id="content">
<section class="page-hero ls-hero">
  <div class="wrap">
    <ol class="crumbs"><li><a href="../{S.SITE}.html">ទំព័រដើម</a></li><li><a href="../grade-9.html">ថ្នាក់ទី ៩</a></li><li><a href="index.html">វិញ្ញាសាត្រៀមប្រឡង</a></li><li aria-current="page">{S.esc(short(e["title"]))}</li></ol>
    <div class="ls-head">
      <span class="ls-badge">{S.kh(i + 1)}</span>
      <div><span class="ls-kicker">{S.esc(g["label"])} · {S.esc(g["title"])}</span><h1>{S.esc(e["title"])}</h1>
      <div class="ls-chips"><span class="chip chip-soon">វិញ្ញាសា គណិតវិទ្យា</span>{f'<span class="chip chip-soon">{S.esc(date)}</span>' if date else ''}<span class="chip chip-soon">ពិន្ទុសរុប ១០០</span></div></div>
    </div>
  </div>
</section>
<section class="ls">
  <div class="wrap ls-layout">
    <aside class="ls-side"><div class="ls-side-box"><div class="ls-side-t">វិញ្ញាសាទាំងអស់</div><ol class="ls-toc">{side}</ol></div></aside>
    <article class="ls-paper">
<p class="no-print"><button class="btn btn-ghost btn-sm" type="button" onclick="window.print()">បោះពុម្ពវិញ្ញាសា</button></p>
<div class="ex-head"><b>វិញ្ញាសា គណិតវិទ្យា</b>{S.esc(('សម័យប្រឡង ' + date) if date else '')}</div>
{qhtml}
{ans}
{pager}
    </article>
  </div>
</section>
</main>
"""
        body, page = page_shell(f"{e['title']} — {S.SITE}", f"{e['title']} និងអត្រាកំណែលម្អិត", body)
        S.write(f"{OUTDIR}/{e['slug']}.html", S.embed_figures(page + body))
        print("exam", e["slug"])

    # index
    secs = ""
    for g in groups:
        cards = "".join(
            f'<a class="chapter" href="{e["slug"]}.html"><span class="n">{S.kh(j + 1)}</span><span><b>{S.esc(short(e["title"]))}</b><small>{S.esc(e.get("date") or "មានអត្រាកំណែលម្អិត")}</small></span></a>'
            for j, e in enumerate(g["exams"]))
        secs += f'<h2 style="margin:36px 0 6px">{S.esc(g["label"])} ៖ {S.esc(g["title"])}</h2><p style="margin:0 0 14px;color:var(--ink-3)">{S.esc(g["desc"])}</p><div class="chapters">{cards}</div>'
    body = f"""<main id="content">
<section class="page-hero"><div class="wrap">
  <ol class="crumbs"><li><a href="../{S.SITE}.html">ទំព័រដើម</a></li><li><a href="../grade-9.html">ថ្នាក់ទី ៩</a></li><li aria-current="page">វិញ្ញាសាត្រៀមប្រឡង</li></ol>
  <h1>វិញ្ញាសាត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ</h1>
  <p class="lead">វិញ្ញាសា {S.kh(len(flat))} ឈុត ព្រមទាំងអត្រាកំណែលម្អិត ៖ វិញ្ញាសាប្រឡងឆ្នាំចាស់ៗ វិញ្ញាសាត្រៀមប្រឡង និងវិញ្ញាសាព្យាករណ៍។</p>
</div></section>
<section class="section section-tight"><div class="wrap">{secs}</div></section>
</main>
"""
    body, page = page_shell(f"វិញ្ញាសាត្រៀមប្រឡង ថ្នាក់ទី ៩ — {S.SITE}", "វិញ្ញាសាត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ និងអត្រាកំណែ", body)
    S.write(f"{OUTDIR}/index.html", page + body)
    return groups


def short(t):
    t = t.replace("វិញ្ញាសាប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ ", "").replace("វិញ្ញាសាត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ ", "វិញ្ញាសាត្រៀម ")
    t = t.replace("វិញ្ញាសាព្យាករណ៍សញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ ", "វិញ្ញាសាព្យាករណ៍ ")
    return t


if __name__ == "__main__":
    build()
