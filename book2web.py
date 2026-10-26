# -*- coding: utf-8 -*-
"""
Convert the LaTeX books (Mathematics for grade 7/8/9/10 2027) into lesson data
for the website.

For every lesson (\\chapter) it writes book/g<grade>/L<nn>.json with:
  title, part (grade 10), html (theory, examples, practice), toc,
  mcq (50 questions with answers from the solutions file),
  exercises (50 exercises with worked solutions).
TikZ figures are rendered to SVG in lesson/fig/<hash>.svg with XeLaTeX
(needs xelatex, pdftocairo and pandoc).

Run:  python book2web.py            (all grades)
      python book2web.py 7 9        (some grades)
"""
import concurrent.futures as cf
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

from bs4 import BeautifulSoup, NavigableString

ROOT = os.path.dirname(os.path.abspath(__file__))
BOOK = os.path.join(ROOT, "Mathematics for grade {g} 2027")
OUT = os.path.join(ROOT, "book")
FIGDIR = os.path.join(ROOT, "lesson", "fig")
FIG_PREAMBLE = os.environ.get("KP_FIG_PREAMBLE", os.path.join(ROOT, "fig_preamble.tex"))
KHNUM = "០១២៣៤៥៦៧៨៩"
KALPH = "កខគឃងចឆជឈញដឋឌឍណតថទធនបផពភមយរលវសហឡអ"


def kh2int(s):
    s = "".join(str(KHNUM.index(c)) if c in KHNUM else c for c in s)
    m = re.search(r"\d+", s)
    return int(m.group()) if m else None


# ---------------------------------------------------------------- helpers
def strip_comments(t):
    out = []
    for line in t.split("\n"):
        m = re.search(r"(?<!\\)%", line)
        if m:
            line = line[:m.start()]
            if not line.strip():
                continue
        out.append(line)
    return "\n".join(out)


def group(t, i, open_="{", close="}"):
    """t[i] == open_; return index after the matching close."""
    depth = 0
    j = i
    while j < len(t):
        c = t[j]
        if c == "\\":
            j += 2
            continue
        if c == open_:
            depth += 1
        elif c == close:
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    return len(t)


def find_env(t, name, start=0):
    """Return (begin_start, body_start, body_end, end_stop) of the next \\begin{name}."""
    b = t.find("\\begin{" + name + "}", start)
    if b < 0:
        return None
    pat = re.compile(r"\\(begin|end)\{" + re.escape(name) + r"\}")
    depth = 0
    for m in pat.finditer(t, b):
        depth += 1 if m.group(1) == "begin" else -1
        if depth == 0:
            return b, b + len("\\begin{" + name + "}"), m.start(), m.end()
    return b, b + len("\\begin{" + name + "}"), len(t), len(t)


def take_args(t, i, opt=True, braces=0):
    """Read [opt] and up to `braces` {..} groups starting at t[i]. Returns (opt, [args], new_i)."""
    o = None
    j = i
    while j < len(t) and t[j] in " \t":
        j += 1
    if opt and j < len(t) and t[j] == "[":
        e = group(t, j, "[", "]")
        o = t[j + 1:e - 1]
        i = j = e
    args = []
    for _ in range(braces):
        k = j
        while k < len(t) and t[k] in " \t":
            k += 1
        if k < len(t) and t[k] == "{":
            e = group(t, k)
            args.append(t[k + 1:e - 1])
            i = j = e
        else:
            break
    return o, args, i


def map_env(t, name, fn, opt=True, braces=0):
    """Replace every \\begin{name}..\\end{name} (outermost first) by fn(opt, args, body)."""
    pos = 0
    while True:
        r = find_env(t, name, pos)
        if not r:
            return t
        b, bs, be, ee = r
        o, args, bs2 = take_args(t, bs, opt, braces)
        body = map_env(t[bs2:be], name, fn, opt, braces)   # inner ones first
        new = fn(o, args, body)
        t = t[:b] + new + t[ee:]
        pos = b + len(new)


# ------------------------------------------------------------- figures
FIG_JOBS = {}


def fig_key(code):
    return hashlib.sha1(code.encode("utf-8")).hexdigest()[:16]


def extract_figures(t):
    def sub(m):
        code = m.group(0)
        k = fig_key(code)
        FIG_JOBS[k] = code
        return "\\includegraphics{FIG-" + k + "}"
    t = re.sub(r"\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}", sub, t, flags=re.S)
    t = re.sub(r"\\tikz\b\s*(\[[^\]]*\])?\s*\{", lambda m: "\\kptikz{", t)   # inline \tikz{...}: dropped
    return t


def render_figure(k, code, preamble):
    svg = os.path.join(FIGDIR, k + ".svg")
    if os.path.exists(svg):
        return k, True, ""
    with tempfile.TemporaryDirectory() as d:
        open(os.path.join(d, "f.tex"), "w", encoding="utf-8").write(preamble + "\\begin{document}\n" + code + "\n\\end{document}\n")
        r = subprocess.run(["xelatex", "-interaction=nonstopmode", "-halt-on-error", "f.tex"], cwd=d, capture_output=True, timeout=180)
        pdf = os.path.join(d, "f.pdf")
        if not os.path.exists(pdf):
            log = open(os.path.join(d, "f.log"), encoding="utf-8", errors="replace").read() if os.path.exists(os.path.join(d, "f.log")) else ""
            err = "\n".join(l for l in log.split("\n") if l.startswith("!"))[:300]
            return k, False, err
        subprocess.run(["pdftocairo", "-svg", pdf, svg], check=True)
    return k, True, ""


def render_all_figures():
    os.makedirs(FIGDIR, exist_ok=True)
    pre = open(FIG_PREAMBLE, encoding="utf-8").read()
    todo = {k: c for k, c in FIG_JOBS.items() if not os.path.exists(os.path.join(FIGDIR, k + ".svg"))}
    print(f"figures: {len(FIG_JOBS)} total, {len(todo)} to render")
    bad = {}
    with cf.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        for k, ok, err in ex.map(lambda kv: render_figure(kv[0], kv[1], pre), todo.items()):
            if not ok:
                bad[k] = err
    if bad:
        print(f"  {len(bad)} figures failed")
    return bad


# ---------------------------------------------------- LaTeX preprocessing
BOXES = {
    # env: (css class, default title, brace args)
    "historyBox": ("bx-white bx-hist", "ប្រវត្តិ", 0),
    "prereqBox": ("bx-white", "មុនចូលមេរៀននេះ ត្រូវចេះអ្វីខ្លះ?", 0),
    "definition": ("bx-teal", "និយមន័យ", 0),
    "dfi": ("bx-teal", "និយមន័យ", 2),
    "theorem": ("bx-amber", "ទ្រឹស្តីបទ", 0),
    "general": ("bx-rule", "ជាទូទៅ", 2),
    "formulaBox": ("bx-rule", "រូបមន្ត", 0),
    "summaryBox": ("bx-rule", "សេចក្ដីសង្ខេប", 0),
    "conclusionBox": ("bx-teal", "សន្និដ្ឋាន", 0),
    "example": ("bx-gray bx-ex", "ឧទាហរណ៍", 0),
    "examplebox": ("bx-gray bx-ex", "ឧទាហរណ៍", 0),
    "pro": ("bx-try", "ប្រតិបត្តិ", 0),
    "practice": ("bx-try", "ប្រតិបត្តិ", 0),
    "pracBox": ("bx-try", "ប្រតិបត្តិ", 0),
    "exercise": ("bx-try", "លំហាត់", 0),
    "hintBox": ("bx-green", "គន្លឹះ", 0),
    "note": ("bx-green", "សម្គាល់", 0),
    "mistakeBox": ("bx-coral", "កំហុសដែលគួរជៀសវាង", 0),
    "tcolorbox": ("bx-white", "", 0),
}

LIST_KIND = {"a": "olka", "1": "olnum", "1a": "olnum", "IC": "olroman", "i": "olroman", "A": "olka"}

MACROS = r"""
\newcommand{\kt}{}\newcommand{\kv}{}\newcommand{\kom}{}\newcommand{\kep}{}\newcommand{\khmerM}{}
\newcommand{\khM}{}\newcommand{\en}{}\newcommand{\ang}{}\newcommand{\lmodern}{}\newcommand{\khmernormal}{}
\newcommand{\kml}[1]{#1}\newcommand{\kbk}{}\newcommand{\khmer}{}
\newcommand{\cirkalph}[1]{\textbf{#1.}~}\newcommand{\cirknum}[1]{\textbf{#1.}~}
\newcommand{\kptikz}[1]{}
\newcommand{\fbox}[1]{⟦FB⟧#1⟦/FB⟧}\newcommand{\framebox}[1]{⟦FB⟧#1⟦/FB⟧}
\newcommand{\textcolor}[2]{#2}\newcommand{\colorbox}[2]{#2}
\newcommand{\resizebox}[3]{#3}\newcommand{\scalebox}[2]{#2}\newcommand{\rotatebox}[2]{#2}
\newcommand{\adjustbox}[2]{#2}
\newcommand{\phantom}[1]{}\newcommand{\newpage}{}\newcommand{\clearpage}{}\newcommand{\pagebreak}{}
\newcommand{\Am}{\par⟦ANS⟧\par}\newcommand{\ans}{\par⟦ANS⟧\par}\newcommand{\answer}{\par⟦ANS⟧\par}
\newcommand{\mylimhat}{\par⟦EX⟧\par}
\newcommand{\toKhmerNum}[1]{#1}
"""


def pre_latex(t):
    t = strip_comments(t)
    t = re.sub(r"\\AffQuadrillage(\[[^\]]*\])?(<[^>]*>)?", "", t)
    t = re.sub(r"\\(vspace|hspace)\*?\{[^}]*\}", " ", t)
    t = re.sub(r"\\par\b", "\n\n", t)
    t = re.sub(r"\\(q?quad)\b(?!\{)", r"\\\1{}", t)          # pandoc eats the next token after \quad
    t = re.sub(r"\\newline\b", r"\\\\", t)
    t = re.sub(r"\\(noindent|centering|raggedright|raggedleft|smallskip|medskip|bigskip|hfill|normalcolor|indent)\b", " ", t)
    t = re.sub(r"\\(small|footnotesize|scriptsize|tiny|large|Large|LARGE|normalsize)\b", "", t)
    t = re.sub(r"\\color\{[^}]*\}", "", t)
    t = re.sub(r"\\(rowcolor|cellcolor)(\[[^\]]*\])?\{[^}]*\}", "", t)
    t = re.sub(r"\\cline\{[^}]*\}", "", t)
    t = re.sub(r"\\(renewcommand|setlength)\{?\\[a-zA-Z]+\}?\{[^}]*\}", "", t)
    t = t.replace("\\arraybackslash", "")
    t = extract_figures(t)
    # \fbox{$..$}: \boxed in maths, $\boxed{..}$ in text
    def fbox_math(t):
        out, i = [], 0
        for m in re.finditer(r"\\fbox\{\$([^$]*)\$\}", t):
            before = t[:m.start()]
            toks = re.findall(r"(?<!\\)\$\$|(?<!\\)\$", before)
            in_math = toks.count("$$") % 2 == 1 or toks.count("$") % 2 == 1 or before.rfind("\\[") > before.rfind("\\]")
            out.append(t[i:m.start()])
            out.append(("\\boxed{%s}" if in_math else "$\\boxed{%s}$") % m.group(1))
            i = m.end()
        out.append(t[i:])
        return "".join(out)
    t = fbox_math(t)
    t = re.sub(r"\$\$.*?\$\$|\\\[.*?\\\]|\$[^$]+\$", lambda m: m.group(0).replace("\\fbox", "\\boxed"), t, flags=re.S)

    # boxes
    for env, (cls, dflt, nb) in BOXES.items():
        def box(o, args, body, cls=cls, dflt=dflt, env=env):
            title = (args[0] if args else None) or o or dflt
            title = re.sub(r"^[a-z]+=.*$", "", title) if o and "=" in (o or "") and not args else title
            return f"\n\n\\begin{{kpbox}}\\kptitle{{{cls}}}{{{title}}}\n{body}\n\\end{{kpbox}}\n\n"
        t = map_env(t, env, box, opt=True, braces=nb)

    # tasks -> enumerate
    def tasks(o, args, body, kind="olka"):
        n = re.match(r"\s*\((\d)\)", body)
        cols = n.group(1) if n else "1"
        body = re.sub(r"^\s*\(\d\)", "", body)
        body = re.sub(r"\\task\s*(\*|!)?\s*(\(\d+\))?", r"\\item ", body)
        return f"\n\n\\begin{{kplist}}\\kplistkind{{{kind} cols{cols}}}\n\\begin{{kpenum}}{body}\\end{{kpenum}}\n\\end{{kplist}}\n\n"
    t = map_env(t, "ktasks", tasks, opt=False)
    t = map_env(t, "tasks", tasks, opt=False)

    # multicols: remember column count on the list it wraps, else drop
    t = map_env(t, "multicols", lambda o, a, b: "⟦COLS" + (a[0] if a else "2") + "⟧" + b, opt=False, braces=1)

    def enum(o, args, body):
        kind = LIST_KIND.get((o or "").strip(), "")
        m = re.match(r"\s*⟦COLS(\d)⟧", body)
        cols = m.group(1) if m else "1"
        body = re.sub(r"⟦COLS\d⟧", "", body)
        return f"\n\n\\begin{{kplist}}\\kplistkind{{{kind or 'oldef'} cols{cols}}}\n\\begin{{kpenum}}{body}\\end{{kpenum}}\n\\end{{kplist}}\n\n"
    t = map_env(t, "enumerate", enum, opt=True)
    t = t.replace("\\begin{kpenum}", "\\begin{enumerate}").replace("\\end{kpenum}", "\\end{enumerate}")
    t = re.sub(r"⟦COLS\d⟧", "", t)

    # minipage / center wrappers
    t = map_env(t, "minipage", lambda o, a, b: "\n\n" + b + "\n\n", opt=True, braces=1)
    t = map_env(t, "flushright", lambda o, a, b: b, opt=False)
    t = map_env(t, "adjustwidth", lambda o, a, b: b, opt=False, braces=2)
    t = map_env(t, "adjustbox", lambda o, a, b: b, opt=False, braces=1)
    t = map_env(t, "varwidth", lambda o, a, b: b, opt=False, braces=1)

    # tabularx -> tabular, simplified column specs
    def tab(o, args, body, x=False):
        spec = args[-1] if args else "l"
        spec = re.sub(r"[><@!]\{[^{}]*(\{[^{}]*\}[^{}]*)*\}", "", spec)
        spec = re.sub(r"[pmb]\{[^}]*\}", "l", spec).replace("X", "l").replace("@{}", "")
        spec = re.sub(r"\*\{(\d+)\}\{([^}]*)\}", lambda m: m.group(2) * int(m.group(1)), spec)
        body = re.sub(r"\\multicolumn\{(\d+)\}\{(?:[^{}]|\{[^{}]*\})*\}\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}", r"\2", body)
        body = body.replace("\\tabularnewline", "\\\\")
        if len(re.sub(r"[^lcrp]", "", spec)) <= 1 and "&" not in body:   # one-column box: just its lines
            return " " + re.sub(r"\\\\(\[[^\]]*\])?|\\hline", " ", body) + " "
        return "\\begin{tabular}{" + spec + "}" + body + "\\end{tabular}"
    t = map_env(t, "tabularx", tab, opt=False, braces=2)
    t = map_env(t, "tabular", tab, opt=True, braces=1)
    t = t.replace("\\begin{kptabular}", "\\begin{tabular}")
    return t


PANDOC_MACROS = MACROS + r"""
\newcommand{\kptitle}[2]{⟦BOX:#1|#2⟧}\newcommand{\kplistkind}[1]{⟦LIST:#1⟧}
"""


def pandoc(latex):
    src = PANDOC_MACROS + "\n" + latex.replace("\\begin{kpbox}", "\\begin{kpbox}").replace("\\begin{kplist}", "\\begin{kplist}")
    r = subprocess.run(["pandoc", "-f", "latex", "-t", "html", "--mathjax", "--wrap=none"],
                       input=src.encode("utf-8"), capture_output=True, timeout=600)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode("utf-8", "replace")[:500])
    return r.stdout.decode("utf-8")


# ------------------------------------------------------ HTML post-process
def kh(n):
    return "".join(KHNUM[int(c)] if c.isdigit() else c for c in str(n))


def post_html(html, figprefix):
    soup = BeautifulSoup(html, "html.parser")

    # boxes
    for div in soup.find_all("div", class_="kpbox"):
        cls, title = "bx-white", ""
        par = div.find("p")
        if par is not None and "⟦BOX:" in par.decode_contents():
            inner = par.decode_contents()
            m = re.search(r"⟦BOX:([^|]*)\|(.*?)⟧", inner, re.S)
            if m:
                cls, title = m.group(1), m.group(2).strip()
                rest = (inner[:m.start()] + inner[m.end():]).strip()
                if rest:
                    par.clear()
                    par.append(BeautifulSoup(rest, "html.parser"))
                else:
                    par.decompose()
        sec = soup.new_tag("section", attrs={"class": "bx " + cls})
        hd = soup.new_tag("header", attrs={"class": "bx-h"})
        if title:
            b = soup.new_tag("b")
            b.append(BeautifulSoup(title, "html.parser"))
            hd.append(b)
            sec.append(hd)
        body = soup.new_tag("div", attrs={"class": "bx-b"})
        for c in list(div.contents):
            body.append(c.extract())
        sec.append(body)
        div.replace_with(sec)

    # lists
    for div in soup.find_all("div", class_="kplist"):
        mark = div.find(string=re.compile("⟦LIST:"))
        kind = "oldef cols1"
        if mark:
            m = re.search(r"⟦LIST:(.*?)⟧", str(mark))
            kind = m.group(1) if m else kind
            p = mark.parent
            mark.replace_with(NavigableString(re.sub(r"⟦LIST:.*?⟧", "", str(mark))))
            if p.name == "p" and not p.get_text(strip=True):
                p.decompose()
        ol = div.find(["ol", "ul"])
        if ol:
            ol["class"] = ["list"] + kind.split()
            ol.attrs.pop("type", None)
            div.replace_with(ol.extract())
        else:
            div.unwrap()

    # unknown pandoc divs: unwrap
    for div in soup.find_all("div"):
        if not div.get("class") or set(div["class"]) & {"center", "cases", "flushleft", "quote", "kpbox", "kplist"}:
            div.unwrap()

    # headings: h1 (section) -> h3, h2 (subsection) -> h4, h3 -> h5
    for h in soup.find_all(["h1", "h2", "h3", "h4"]):
        h.name = {"h1": "h3", "h2": "h4", "h3": "h5", "h4": "h5"}[h.name]
        h.attrs = {}

    # figures
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src.startswith("FIG-"):
            k = src[4:]
            if os.path.exists(os.path.join(FIGDIR, k + ".svg")):
                img.attrs = {"class": "fig", "src": f"{figprefix}{k}.svg", "alt": "", "loading": "lazy"}
                wrap = soup.new_tag("div", attrs={"class": "center"})
                img.wrap(wrap)
            else:
                img.replace_with(BeautifulSoup('<span class="fig-ph">រូបភាព (មើលក្នុងសៀវភៅ)</span>', "html.parser"))
        else:
            img.decompose()

    # tables
    for tb in soup.find_all("table"):
        tb["class"] = ["booktabs"]
        if not (tb.parent and tb.parent.name == "div" and "tbl" in (tb.parent.get("class") or [])):
            tb.wrap(soup.new_tag("div", attrs={"class": "tbl"}))
        for x in tb.find_all(["th", "td", "tr"]):
            x.attrs.pop("style", None)
            x.attrs.pop("class", None)

    # math spans -> template classes
    for sp in soup.find_all("span", class_="math"):
        disp = "display" in sp["class"]
        if disp:
            sp.name = "div"
            sp.attrs = {"class": "md"}
        else:
            sp.attrs = {"class": "mi"}

    # practice boxes end with an empty "ដំណោះស្រាយ ៖" label (space for writing in the book)
    for sec in soup.find_all("section", class_="bx-try"):
        body = sec.find("div", class_="bx-b")
        if body is None:
            continue
        ps = [c for c in body.find_all(recursive=False)]
        while ps and ps[-1].name == "p" and re.fullmatch(r"\s*ដំណោះស្រាយ\s*[៖:]?\s*", ps[-1].get_text()):
            ps.pop().decompose()

    # answers inside a practice box -> "មើលចម្លើយ"
    for sec in soup.find_all("section", class_="bx-try"):
        body = sec.find("div", class_="bx-b")
        mk = body.find(lambda x: x.name == "p" and x.get_text(strip=True) == "⟦ANS⟧", recursive=False) if body else None
        if mk is not None:
            det = soup.new_tag("details", attrs={"class": "ans"})
            sm = soup.new_tag("summary"); sm.string = "មើលចម្លើយ"; det.append(sm)
            for x in list(mk.find_next_siblings()):
                det.append(x.extract())
            mk.replace_with(det)

    # KaTeX does not know @{...} in array column specs
    for el in soup.find_all(["span", "div"], class_=["mi", "md"]):
        t = el.string
        if t and re.search(r"\\begin\{array\}\[[tbc]\]", t):
            t = re.sub(r"\\begin\{array\}\[[tbc]\]", r"\\begin{array}", t)
            el.string = t
        if t and "@{" in t:
            el.string = re.sub(r"(\\begin\{array\}\{)([^{}]*(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}[^{}]*)*)\}",
                               lambda m: m.group(1) + re.sub(r"@\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", "", m.group(2)) + "}", t)

    # Khmer words inside inline maths (\text{...}) -> ordinary text (KaTeX has no Khmer font)
    for el in soup.find_all("span", class_="mi"):
        t = el.string
        if t and re.search(r"\\(text|mbox|textbf|mathrm)\{[^{}]*[\u1780-\u17ff]", t):
            new = split_khmer_math(t)
            if new:
                el.replace_with(BeautifulSoup(new, "html.parser"))

    out = str(soup)
    out = out.replace("⟦FB⟧", '<span class="kfbox">').replace("⟦/FB⟧", "</span>")
    out = re.sub(r"<p>\s*</p>", "", out)
    return out


def split_khmer_math(t):
    """'\\(a \\text{ខ្មែរ} b\\)' -> math, text, math pieces (only top-level \\text with Khmer)."""
    m = re.fullmatch(r"\s*\\\((.*)\\\)\s*", t, re.S)
    if not m:
        return None
    body = m.group(1)
    if "\\begin{" in body or "\\\\" in body:     # environments / line breaks: leave as is
        return None
    pieces, i, depth, last = [], 0, 0, 0
    while i < len(body):
        c = body[i]
        if c == "\\":
            mm = re.match(r"\\(text|mbox|textbf|mathrm)\s*\{", body[i:])
            if mm and depth == 0:
                e = group(body, i + mm.end() - 1)
                inner = body[i + mm.end():e - 1]
                if re.search(r"[\u1780-\u17ff]", inner) and "{" not in inner and "\\" not in inner:
                    pieces.append(("m", body[last:i]))
                    pieces.append(("t", inner, mm.group(1) == "textbf"))
                    last = i = e
                    continue
            i += 2
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        i += 1
    pieces.append(("m", body[last:]))
    if depth != 0 or not any(p[0] == "t" for p in pieces):
        return None
    ds = "\\displaystyle " if re.match(r"\s*\\displaystyle", body) else ""
    out = ""
    for p in pieces:
        if p[0] == "m":
            core = re.sub(r"\\(displaystyle|quad|qquad|,|;|:|!)|~|\{\}", "", p[1]).strip()
            if core:
                if ds and not p[1].lstrip().startswith("\\displaystyle"):
                    p = ("m", ds + p[1])
                out += '<span class="mi">\\(' + p[1].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;") + "\\)</span>"
        else:
            txt = p[1].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            out += (" <b>" + txt.strip() + "</b> ") if p[2] else (" " + txt.strip() + " ")
    return out


def title_html(t):
    """A short LaTeX title -> inline HTML."""
    t = re.sub(r"\$(.+?)\$", lambda m: '<span class="mi">\\(' + m.group(1).replace("<", "&lt;") + "\\)</span>", t)
    t = re.sub(r"\\textbf\{([^{}]*)\}", r"\1", t)
    t = re.sub(r"\\[a-zA-Z]+\s*", "", t) if "\\(" not in t else t
    return t


def structure_examples(html):
    """⟦ANS⟧ after an example box -> worked solution inside the box; ⟦EX⟧ starts a worked example."""
    soup = BeautifulSoup("<article>" + html + "</article>", "html.parser")
    art = soup.article

    def is_marker(el, m):
        return getattr(el, "name", None) == "p" and el.get_text(strip=True) == m

    def boundary(el):
        if not getattr(el, "name", None):
            return False
        if el.name in ("h3", "h4", "h5", "section", "hr"):
            return True
        return is_marker(el, "⟦EX⟧") or is_marker(el, "⟦ANS⟧")

    n_ex = 0
    kids = list(art.children)
    i = 0
    while i < len(kids):
        el = kids[i]
        if is_marker(el, "⟦EX⟧"):
            n_ex += 1
            sec = soup.new_tag("section", attrs={"class": "bx bx-gray bx-ex"})
            sec.append(BeautifulSoup(f'<header class="bx-h"><span class="pill">{kh(n_ex)}</span><b>លំហាត់គំរូ {kh(n_ex)}</b></header>', "html.parser"))
            body = soup.new_tag("div", attrs={"class": "bx-b"})
            sec.append(body)
            el.replace_with(sec)
            j = i + 1
            while j < len(kids) and not boundary(kids[j]):
                body.append(kids[j].extract())
                j += 1
            if j < len(kids) and is_marker(kids[j], "⟦ANS⟧"):
                kids[j].extract()
                body.append(BeautifulSoup('<div class="ans-h">ដំណោះស្រាយ</div>', "html.parser"))
                j += 1
                while j < len(kids) and not boundary(kids[j]):
                    body.append(kids[j].extract())
                    j += 1
            i = j
            continue
        if is_marker(el, "⟦ANS⟧"):
            prev = el.find_previous_sibling()
            if prev is not None and prev.name == "section" and "bx-ex" in (prev.get("class") or []):
                body = prev.find("div", class_="bx-b")
                body.append(BeautifulSoup('<div class="ans-h">ដំណោះស្រាយ</div>', "html.parser"))
                el.extract()
                j = i + 1
                while j < len(kids) and not boundary(kids[j]):
                    body.append(kids[j].extract())
                    j += 1
                i = j
                continue
            el.decompose()
        i += 1
    # leftover markers inside boxes
    out = "".join(str(c) for c in art.contents)
    out = out.replace("<p>⟦ANS⟧</p>", '<div class="ans-h">ដំណោះស្រាយ</div>').replace("<p>⟦EX⟧</p>", "")
    out = out.replace("⟦ANS⟧", "").replace("⟦EX⟧", "")
    return out


# ------------------------------------------------------------ the book
def split_lessons(g):
    folder = BOOK.format(g=g)
    main = strip_comments(open(os.path.join(folder, f"Mathematics for grade {g} 2027.tex"), encoding="utf-8").read())
    lessons = []
    part = None
    part_no = 0
    for m in re.finditer(r'\\part\{([^}]*)\}|\\input\{"?(chapter \d+)(?:\.tex)?"?\}', main):
        if m.group(1):
            part = m.group(1)
            continue
        part_no += 1
        src = open(os.path.join(folder, m.group(2) + ".tex"), encoding="utf-8").read()
        src = strip_comments(src)
        idx = [x.start() for x in re.finditer(r"\\chapter\*?\{", src)]
        for k, s in enumerate(idx):
            e = idx[k + 1] if k + 1 < len(idx) else len(src)
            chunk = src[s:e]
            te = group(chunk, chunk.index("{"))
            title = chunk[chunk.index("{") + 1:te - 1]
            lessons.append({"title": title, "body": chunk[te:], "part": part if g == 10 else None,
                            "part_no": part_no if g == 10 else None, "file_no": part_no, "in_file": k})
    return lessons


def solutions(g):
    """Return list (in lesson order) of {mcq: [...], sols: {n: latex}}."""
    folder = BOOK.format(g=g)
    out = []
    for f in sorted(os.listdir(os.path.join(folder, "solutions"))):
        if not re.fullmatch(r"chapter_\d+_sol\.tex", f):
            continue
        t = strip_comments(open(os.path.join(folder, "solutions", f), encoding="utf-8").read())
        parts = re.split(r"\\subsection\*\{មេរៀនទី", t) if g == 10 else [t]
        if g == 10:
            parts = parts[1:] if len(parts) > 1 else parts
        for p in parts:
            mcq = re.findall(r"\\ansbadge\{([^}]*)\}", p)
            sols = {}
            pos = 0
            while True:
                r = find_env(p, "sol", pos)
                if not r:
                    break
                b, bs, be, ee = r
                o, args, bs2 = take_args(p, bs, False, 1)
                n = kh2int(args[0]) if args else None
                if n:
                    sols[n] = p[bs2:be]
                pos = ee
            out.append({"mcq": mcq, "sols": sols, "file": f})
    return out


def top_items(body):
    """Split the body of a list into its top-level \\item chunks."""
    items, depth, last = [], 0, None
    for m in re.finditer(r"\\(begin|end)\{(enumerate|itemize|tasks|ktasks|kpenum)\}|\\item\b", body):
        tok = m.group(0)
        if tok.startswith("\\begin"):
            depth += 1
        elif tok.startswith("\\end"):
            depth -= 1
        elif depth == 0:
            if last is not None:
                items.append(body[last:m.start()])
            last = m.end()
    if last is not None:
        items.append(body[last:])
    return items


def parse_mcq(sec):
    r = find_env(sec, "enumerate")
    if not r:
        return []
    b, bs, be, ee = r
    o, a, bs2 = take_args(sec, bs, True, 0)
    qs = []
    for it in top_items(sec[bs2:be]):
        rr = find_env(it, "enumerate")
        rt = find_env(it, "ktasks") or find_env(it, "tasks")
        if rr and (not rt or rr[0] < rt[0]):
            ob, obs, obe, oee = rr
            _, _, obs2 = take_args(it, obs, True, 0)
            opts = [x.strip() for x in top_items(it[obs2:obe])]
            stem = it[:ob]
        elif rt:
            ob, obs, obe, oee = rt
            inner = re.sub(r"^\s*\(\d\)", "", it[obs:obe])
            opts = [x.strip() for x in re.split(r"\\task\s*(?:\*|!)?\s*(?:\(\d+\))?", inner)[1:]]
            stem = it[:ob]
        else:
            stem, opts = it, []
        stem = re.sub(r"\\(begin|end)\{multicols\}(\{\d\})?", "", stem).strip()
        opts = [re.sub(r"\\(begin|end)\{multicols\}(\{\d\})?", "", x).strip() for x in opts]
        qs.append({"stem": stem, "options": opts})
    return qs


def parse_exercises(sec):
    """Top-level exercises of the "លំហាត់អនុវត្តន៍" section."""
    r = find_env(sec, "enumerate")
    if not r:
        return [], sec
    b, bs, be, ee = r
    o, a, bs2 = take_args(sec, bs, True, 0)
    intro = sec[:b]
    return [x.strip() for x in top_items(sec[bs2:be])], intro


SEP = "\n\n⟦SEP⟧\n\n"


def convert_many(fragments, figprefix):
    """Convert several LaTeX fragments with one pandoc run."""
    pre = [pre_latex(f) for f in fragments]
    html = pandoc(SEP.join(pre))
    parts = re.split(r"<p>\s*⟦SEP⟧\s*</p>", html)
    if len(parts) != len(fragments):  # fall back to one by one
        parts = [pandoc(p) for p in pre]
    return [post_html(p, figprefix) for p in parts]


def strip_p(h):
    h = h.strip()
    m = re.fullmatch(r"<p>(.*)</p>", h, re.S)
    return m.group(1) if m and "<p>" not in m.group(1) else h


def build_lesson(g, n, L, sol):
    body = L["body"]
    figprefix = "../fig/"
    m_mcq = re.search(r"\\section\*?\{[^}]*(Multiple Choice|ពហុជ្រើសរើស)[^}]*\}", body)
    m_ex = re.search(r"\\section\*?\{\s*លំហាត់អនុវត្ត[^}]*\}", body)
    cut = min([x.start() for x in (m_mcq, m_ex) if x] or [len(body)])
    theory = body[:cut]
    mcq_src = body[m_mcq.end():(m_ex.start() if m_ex and m_ex.start() > m_mcq.start() else len(body))] if m_mcq else ""
    ex_src = body[m_ex.end():] if m_ex else ""

    # theory
    html = convert_many([theory], figprefix)[0]
    html = structure_examples(html)
    soup = BeautifulSoup(html, "html.parser")
    toc = []
    u = 0
    for h in soup.find_all("h3"):
        u += 1
        h["id"] = f"u{u}"
        toc.append({"id": f"u{u}", "html": h.decode_contents()})
    html = str(soup)

    # MCQ
    mcq = []
    qs = parse_mcq(mcq_src) if mcq_src else []
    if qs:
        frags = []
        for q in qs:
            frags.append(q["stem"])
            frags.extend(q["options"])
        conv = convert_many(frags, figprefix)
        k = 0
        answers = sol["mcq"] if sol else []
        for i, q in enumerate(qs):
            stem = strip_p(conv[k]); k += 1
            opts = [strip_p(conv[k + j]) for j in range(len(q["options"]))]
            k += len(q["options"])
            ans = answers[i].strip() if i < len(answers) else None
            ai = KALPH.index(ans) if ans and ans in KALPH else None
            mcq.append({"stem": stem, "options": opts, "answer": ai})

    # exercises + solutions
    exercises = []
    items, intro = parse_exercises(ex_src) if ex_src else ([], "")
    if items:
        sols = sol["sols"] if sol else {}
        frags = items + [sols.get(i + 1, "") for i in range(len(items))]
        conv = convert_many(frags, figprefix)
        for i in range(len(items)):
            exercises.append({"q": conv[i], "sol": conv[len(items) + i] if sols.get(i + 1) else ""})

    data = {"grade": g, "num": n, "title": L["title"], "part": L["part"], "part_no": L["part_no"],
            "html": html, "toc": toc, "mcq": mcq, "exercises": exercises}
    os.makedirs(os.path.join(OUT, f"g{g}"), exist_ok=True)
    json.dump(data, open(os.path.join(OUT, f"g{g}", f"L{n:02d}.json"), "w", encoding="utf-8"), ensure_ascii=False)
    return data


def main(grades):
    plan = []
    for g in grades:
        ls = split_lessons(g)
        ss = solutions(g)
        if len(ss) != len(ls):
            print(f"G{g}: {len(ls)} lessons but {len(ss)} solution blocks")
        for i, L in enumerate(ls):
            plan.append((g, i + 1, L, ss[i] if i < len(ss) else None))
    # pass 1: collect figures (pre_latex registers them)
    for g, n, L, s in plan:
        pre_latex(L["body"])
        if s:
            for v in s["sols"].values():
                pre_latex(v)
    bad = render_all_figures()
    # pass 2: convert
    with cf.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        futs = {ex.submit(build_lesson, g, n, L, s): (g, n) for g, n, L, s in plan}
        for f in cf.as_completed(futs):
            g, n = futs[f]
            try:
                d = f.result()
                print(f"G{g} L{n:02d} {d['title'][:30]}  mcq={len(d['mcq'])} ex={len(d['exercises'])} toc={len(d['toc'])}")
            except Exception as e:
                print(f"G{g} L{n:02d} FAILED: {e!r}"[:400])
    if bad:
        json.dump(bad, open(os.path.join(OUT, "failed_figures.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main([int(x) for x in sys.argv[1:]] or [7, 8, 9, 10])
