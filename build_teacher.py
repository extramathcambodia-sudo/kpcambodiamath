# -*- coding: utf-8 -*-
"""
Teacher tools for KPCambodianmathematics
  * static/bank/g<N>.json  question banks (MCQ + written exercises) for grades 7-12,
                            built from the lesson books in book/g<N>/Lnn.json
  * exam-builder.html      exam paper studio (lesson / chapter / monthly / semester papers,
                            export to PDF, LaTeX and Word)
  * classroom.html         class management and gradebook (monthly / semester / yearly averages)
  * student.html           student portal (join a class, take assigned exams online)
Run after build_site_from_template.py (it is also called from there).
"""
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))


def _fix_src(h):
    # figures are stored relative to lesson/g<N>/ -> make them relative to the site root;
    # a figure whose file is missing is dropped (only solutions keep such items, see _figs_ok)
    h = h.replace('src="../fig/', 'src="lesson/fig/')
    return re.sub(r'<img[^>]*src="lesson/fig/([0-9a-f]+\.svg)"[^>]*>',
                  lambda m: m.group(0) if os.path.exists(os.path.join(ROOT, "lesson", "fig", m.group(1))) else "", h)


def _categories():
    """chapter-like groups for the grades whose books have no chapters (7-9): lesson category"""
    try:
        raw = open(os.path.join(ROOT, "math_data.js"), encoding="utf-8").read()
        d = json.loads(raw.split("window.MATH_DATA = ", 1)[1].strip().rstrip(";"))
        return {(int(g), l["num"]): l.get("category") or "" for g, ls in d["lessons"].items() for l in ls}
    except Exception:
        return {}


_FIG = re.compile(r'src="lesson/fig/([0-9a-f]+\.svg)"')


def _figs_ok(*parts):
    """False when an item points at a figure file that is not in lesson/fig (it would print as a broken image)"""
    for h in parts:
        for f in _FIG.findall(h or ""):
            if not os.path.exists(os.path.join(ROOT, "lesson", "fig", f)):
                return False
    return True


def _embed(txt):
    """lesson/fig/x.svg -> data: URI (keeps the file name in data-fig for the LaTeX export)"""
    from urllib.parse import quote

    def sub(m):
        name = m.group(1)
        svg = open(os.path.join(ROOT, "lesson", "fig", name + ".svg"), encoding="utf-8").read()
        svg = re.sub(r"(\d+\.\d{2})\d+", r"\1", svg)
        svg = re.sub(r">\s+<", "><", svg)
        uri = "data:image/svg+xml;charset=utf-8," + quote(svg, safe=" /:=;,()-.!*_")
        return 'data-fig=\\"' + name + '\\" src=\\"' + uri.replace('"', '%22') + '\\"'
    return re.sub(r'src=\\"lesson/fig/([0-9a-f]{16})\.svg\\"', sub, txt)


def build_banks():
    out = {}
    cats = _categories()
    for g in range(7, 13):
        files = sorted(glob.glob(os.path.join(ROOT, "book", f"g{g}", "L*.json")))
        if not files:
            continue
        lessons = []
        for f in files:
            b = json.load(open(f, encoding="utf-8"))
            mcq = []
            for q in b.get("mcq", []):
                a = q.get("answer")
                if a is None or not (0 <= a < len(q["options"])):
                    continue
                if not _figs_ok(*[x.replace('src="../fig/', 'src="lesson/fig/') for x in [q["stem"]] + q["options"]]):
                    continue
                it = {"s": _fix_src(q["stem"]), "o": [_fix_src(o) for o in q["options"]], "a": a,
                      "e": _fix_src(q.get("sol") or "")}
                if True:
                    mcq.append(it)
            ex = []
            for e in b.get("exercises", []):
                if not _figs_ok(e["q"].replace('src="../fig/', 'src="lesson/fig/')):
                    continue
                it = {"q": _fix_src(e["q"]), "s": _fix_src(e.get("sol") or "")}
                if True:
                    ex.append(it)
            part = b.get("part") or cats.get((g, b["num"]), "")
            lessons.append({"num": b["num"], "title": b["title"], "part": part,
                            "part_no": b.get("part_no") or 0, "track": b.get("track") or "",
                            "mcq": mcq, "ex": ex})
        bank = {"grade": g, "lessons": lessons}
        os.makedirs(os.path.join(ROOT, "static", "bank"), exist_ok=True)
        # a <script> file (not .json) so the exam studio also works when opened straight from disk (file://);
        # figures are embedded as data: URIs for the same reason
        txt = _embed(json.dumps(bank, ensure_ascii=False, separators=(",", ":")))
        p = os.path.join(ROOT, "static", "bank", f"g{g}.js")
        with open(p, "w", encoding="utf-8", newline="\n") as fh:
            fh.write("window.KP_BANKS=window.KP_BANKS||{};window.KP_BANKS[%d]=" % g + txt.replace("</", "<\\/") + ";\n")
        old_json = os.path.join(ROOT, "static", "bank", f"g{g}.json")
        if os.path.exists(old_json):
            os.remove(old_json)
        out[g] = (len(lessons), sum(len(l["mcq"]) for l in lessons), sum(len(l["ex"]) for l in lessons),
                  os.path.getsize(p) // 1024)
    return out


# ------------------------------------------------------------------ pages
KATEX = ('<script src="static/katex/katex.min.js"></script>\n'
         '<script src="static/katex/contrib/auto-render.min.js"></script>\n')
CSS = ('<link rel="stylesheet" href="static/css/lesson.css">\n'
       '<link rel="stylesheet" href="static/css/kp-teacher.css">\n')
CORE = ('<script src="static/js/kp-config.js"></script>\n<script src="static/js/kp-paper.js"></script>\n'
        '<script src="static/js/kp-store.js"></script>\n')


def _shell(T, data, title, desc, cur, body, scripts):
    grades = data["grades"]
    page = T.head(f"{title} — {T.SITE}", desc, "", CSS)
    page += T.header("", grades, cur) + body + '<div id="toast" class="toast" role="status" aria-live="polite"></div>\n<div id="print-area"></div>\n'
    page += T.footer("", grades, KATEX + CORE + scripts)
    return page


def _hero(T, crumb, h1, p):
    return (f'<section class="tp-hero no-print"><div class="wrap"><ol class="crumbs"><li><a href="index.html">ទំព័រដើម</a></li><li>{crumb}</li></ol>'
            f'<h1>{h1}</h1><p>{p}</p></div></section>\n')


def build_builder(T, data):
    kinds = [("lesson", "តាមមេរៀន"), ("chapter", "តាមជំពូក"), ("monthly", "ប្រចាំខែ"), ("semester", "ប្រចាំឆមាស"), ("custom", "ផ្ទាល់ខ្លួន")]
    gopts = "".join(f'<option value="{g}"{" selected" if g == 9 else ""}>ថ្នាក់ទី {T.kh(g)}</option>' for g in range(7, 13))
    kbtn = "".join(f'<button type="button" data-kind="{k}">{n}</button>' for k, n in kinds)
    body = _hero(T, "បង្កើតវិញ្ញាសា", "បង្កើតវិញ្ញាសាប្រឡង",
                 "បង្កើតវិញ្ញាសាតាមមេរៀន តាមជំពូក ប្រចាំខែ និងប្រចាំឆមាស ពីកម្រងសំណួររបស់សៀវភៅថ្នាក់ទី ៧ ដល់ទី ១២ ។ "
                 "កំណត់ចំនួនសំណួរពហុជ្រើសរើស និងលំហាត់សរសេរបានតាមចិត្ត ហើយទាញយកជា PDF, LaTeX ឬ Microsoft Word ។")
    body += f"""<main id="content" class="tp-main no-print"><div class="wrap tp-layout">
<aside class="tp-side">
 <div class="card-p">
  <h2>១. ជ្រើសរើសខ្លឹមសារ</h2>
  <div class="row2"><label class="fld"><span>កម្រិតថ្នាក់</span><select id="b-grade">{gopts}</select></label>
  <label class="fld" id="f-track" hidden><span>ផ្នែក</span><select id="b-track"><option value="sc">វិទ្យាសាស្ត្រ</option><option value="ss">វិទ្យាសាស្ត្រសង្គម</option></select></label></div>
  <div class="fld"><span>ប្រភេទវិញ្ញាសា</span><div class="seg" id="b-kind">{kbtn}</div></div>
  <div class="row2"><label class="fld" id="f-month"><span>ខែ</span><select id="b-month"></select></label>
  <label class="fld" id="f-sem" hidden><span>ឆមាស</span><select id="b-sem"><option value="1">ឆមាសទី ១</option><option value="2">ឆមាសទី ២</option></select></label></div>
  <div class="fld"><span>មេរៀន <small class="muted" id="b-scope-hint"></small></span>
   <div class="lesson-pick" id="b-lessons"></div>
   <div class="btns" style="margin-top:6px"><button type="button" class="btn btn-ghost btn-xs" id="b-all">ជ្រើសទាំងអស់</button><button type="button" class="btn btn-ghost btn-xs" id="b-none">មិនជ្រើស</button></div>
  </div>
 </div>
 <div class="card-p">
  <h2>២. ចំនួនសំណួរ និងពិន្ទុ</h2>
  <div class="row2">
   <label class="fld"><span>ពហុជ្រើសរើស (MCQ)</span><input id="b-nmcq" type="number" min="0" max="100"></label>
   <label class="fld"><span>ពិន្ទុ/សំណួរ</span><input id="b-mcqpts" type="number" min="0.25" step="0.25"></label>
   <label class="fld"><span>លំហាត់សរសេរ</span><input id="b-nwr" type="number" min="0" max="40"></label>
   <label class="fld"><span>ពិន្ទុសរុប</span><input id="b-total" type="number" min="1"></label>
   <label class="fld"><span>រយៈពេល (នាទី)</span><input id="b-duration" type="number" min="5" step="5"></label>
   <label class="fld"><span>ចំនួនវិញ្ញាសា (ក ខ គ ឃ)</span><select id="b-versions"><option value="1">១</option><option value="2">២</option><option value="3">៣</option><option value="4">៤</option></select></label>
  </div>
  <p class="muted" id="b-split"></p><p class="muted" id="b-avail"></p>
  <label class="chk"><input type="checkbox" id="b-fig" checked> ដាក់សំណួរដែលមានរូបភាព</label>
 </div>
 <div class="card-p">
  <details><summary><b>៣. ក្បាលវិញ្ញាសា និងជម្រើស</b></summary>
  <label class="fld" style="margin-top:10px"><span>មន្ទីរ / ការិយាល័យអប់រំ</span><input id="b-office" placeholder="មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត..."></label>
  <label class="fld"><span>សាលារៀន</span><input id="b-school" placeholder="វិទ្យាល័យ..."></label>
  <div class="row2"><label class="fld"><span>ឆ្នាំសិក្សា</span><input id="b-year"></label><label class="fld"><span>ថ្ងៃប្រឡង</span><input id="b-date" placeholder="ឧ. ២៥ វិច្ឆិកា ២០២៦"></label></div>
  <div class="row2"><label class="fld"><span>វិញ្ញាសា</span><input id="b-subject" value="គណិតវិទ្យា"></label><label class="fld"><span>ពុម្ពអក្សរ (Word/LaTeX)</span><select id="b-font"></select></label></div>
  <label class="fld"><span>ចំណងជើង (ទុកទទេ = ស្វ័យប្រវត្តិ)</span><input id="b-title"></label>
  <label class="fld"><span>សេចក្ដីណែនាំ</span><textarea id="b-instr" placeholder="ឧ. មិនអនុញ្ញាតឱ្យប្រើម៉ាស៊ីនគិតលេខ ។"></textarea></label>
  <label class="chk"><input type="checkbox" id="b-kingdom" checked> ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ</label>
  <label class="chk"><input type="checkbox" id="b-student" checked> បន្ទាត់ឈ្មោះសិស្ស ថ្នាក់ លេខតុ</label>
  <label class="chk"><input type="checkbox" id="b-grid"> តារាងគូសចម្លើយ</label>
  </details>
 </div>
 <button type="button" class="btn btn-primary" id="b-gen" style="width:100%;margin-top:14px">បង្កើតវិញ្ញាសា</button>
 <p class="muted" id="mode-note" style="margin-top:8px"></p>
</aside>
<section>
 <div class="pv-bar" id="pv-tools" hidden>
  <span class="seg" id="pv-view"><button type="button" data-v="paper" class="on">វិញ្ញាសា</button><button type="button" data-v="both">មានចម្លើយ</button><button type="button" data-v="key">អត្រាកំណែ</button></span>
  <label id="pv-ver-wrap" hidden><select class="inp" id="pv-ver" style="width:auto"></select></label>
  <span class="muted" id="pv-sum"></span>
 </div>
 <div class="card-p no-print" id="x-bar" style="margin-bottom:14px">
  <div class="btns" style="margin:0">
   <button type="button" class="btn btn-primary btn-sm" id="x-pdf">PDF / បោះពុម្ព</button>
   <button type="button" class="btn btn-ghost btn-sm" id="x-docx">Microsoft Word</button>
   <button type="button" class="btn btn-ghost btn-sm" id="x-tex">LaTeX</button>
   <button type="button" class="btn btn-ghost btn-sm" id="x-texshow">មើលកូដ LaTeX</button>
   <button type="button" class="btn btn-ghost btn-sm" id="x-save">រក្សាទុក</button>
   <button type="button" class="btn btn-amber btn-sm" id="x-assign">ដាក់ឱ្យថ្នាក់ប្រឡង</button>
  </div>
  <div class="btns"><label class="chk"><input type="checkbox" id="x-key" checked> ភ្ជាប់អត្រាកំណែ</label><label class="chk"><input type="checkbox" id="x-allver" checked> បោះពុម្ពគ្រប់វិញ្ញាសា (ក ខ …)</label></div>
  <p class="muted" style="margin:6px 0 0">PDF ៖ ចុច «PDF / បោះពុម្ព» ហើយជ្រើស <b>Save as PDF</b> ។ LaTeX ៖ compile ដោយ <b>XeLaTeX</b> ។</p>
 </div>
 <div class="kp-sheet-wrap" id="pv"></div>
 <div class="card-p"><h3>វិញ្ញាសាដែលបានរក្សាទុក</h3><div id="saved"></div></div>
</section>
</div></main>
<dialog id="dlg-tex" class="card-p" style="width:min(900px,94vw)"><h3>កូដ LaTeX (XeLaTeX)</h3><textarea class="inp" id="tex-code" rows="22" style="font-family:ui-monospace,Consolas,monospace;font-size:12.5px" readonly></textarea>
<div class="btns"><button type="button" class="btn btn-primary btn-sm" id="tex-copy">ចម្លង</button><button type="button" class="btn btn-ghost btn-sm" data-close>បិទ</button></div></dialog>
<dialog id="dlg-assign" class="card-p" style="width:min(520px,94vw)"><form method="dialog"><h3>ដាក់វិញ្ញាសាឱ្យថ្នាក់</h3>
<label class="fld"><span>ថ្នាក់</span><select id="a-class"></select></label>
<div class="row2"><label class="fld"><span>មុខវិជ្ជា</span><select id="a-subject"></select></label>
<label class="fld"><span>ប្រភេទ</span><select id="a-type"><option value="lesson">តេស្តមេរៀន</option><option value="chapter">តេស្តជំពូក</option><option value="monthly">ប្រឡងប្រចាំខែ</option><option value="semester">ប្រឡងឆមាស</option></select></label>
<label class="fld" id="a-f-month"><span>ខែ</span><select id="a-month"></select></label>
<label class="fld" id="a-f-sem" hidden><span>ឆមាស</span><select id="a-sem"><option value="1">ឆមាសទី ១</option><option value="2">ឆមាសទី ២</option></select></label></div>
<label class="fld"><span>ចំណងជើង</span><input id="a-title"></label>
<label class="chk"><input type="checkbox" id="a-open" checked> បើកឱ្យសិស្សប្រឡងអនឡាញឥឡូវនេះ</label>
<p class="muted">ពិន្ទុពហុជ្រើសរើសរបស់សិស្សដែលប្រឡងអនឡាញ នឹងចូលតារាងពិន្ទុដោយស្វ័យប្រវត្តិ ។ ពិន្ទុលំហាត់សរសេរ បញ្ចូលនៅទំព័រ «ថ្នាក់រៀនរបស់ខ្ញុំ» ។</p>
<div class="btns"><button class="btn btn-primary btn-sm" id="a-ok">ដាក់ឱ្យប្រឡង</button><button type="button" class="btn btn-ghost btn-sm" data-close>បោះបង់</button></div></form></dialog>
<style>.sv-row{{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)}}.warn-t{{color:var(--rose)!important}}dialog::backdrop{{background:rgba(10,20,30,.45)}}dialog{{border:1px solid var(--line);color:var(--ink)}}</style>
"""
    return _shell(T, data, "បង្កើតវិញ្ញាសាប្រឡង", "បង្កើតវិញ្ញាសាប្រឡងគណិតវិទ្យា ថ្នាក់ទី ៧–១២ ទាញយកជា PDF LaTeX Word",
                  "teach", body, '<script src="static/js/kp-builder.js"></script>\n')


def build_classroom(T, data):
    gopts = "".join(f'<option value="{g}">ថ្នាក់ទី {T.kh(g)}</option>' for g in range(7, 13))
    body = _hero(T, "ថ្នាក់រៀនរបស់ខ្ញុំ", "ថ្នាក់រៀនរបស់ខ្ញុំ",
                 "គ្រប់គ្រងថ្នាក់ សិស្ស ការប្រឡង និងពិន្ទុ ។ ពិន្ទុរត់ចូលតេស្តមេរៀន ប្រចាំខែ ប្រចាំឆមាស ហើយគណនាមធ្យមភាគ ចំណាត់ថ្នាក់ និងនិទ្ទេស ប្រចាំខែ ឆមាស និងឆ្នាំ ដោយស្វ័យប្រវត្តិ ។")
    body += f"""<main id="content" class="tp-main no-print"><div class="wrap">
<p class="muted" id="mode" style="margin:0 0 14px"></p>
<div id="auth" class="card-p" hidden style="max-width:460px"><h2>ចូលគណនីគ្រូ</h2>
 <form><label class="fld"><span>អ៊ីមែល</span><input id="au-email" type="email" autocomplete="username"></label>
 <label class="fld"><span>ពាក្យសម្ងាត់</span><input id="au-pw" type="password" autocomplete="current-password"></label>
 <label class="fld"><span>ឈ្មោះគ្រូ (សម្រាប់ចុះឈ្មោះថ្មីប៉ុណ្ណោះ)</span><input id="au-name"></label>
 <div class="btns"><button class="btn btn-primary btn-sm" id="auth-in">ចូល</button><button class="btn btn-ghost btn-sm" id="auth-up">ចុះឈ្មោះថ្មី</button><button class="btn btn-ghost btn-xs" id="auth-reset">ភ្លេចពាក្យសម្ងាត់</button></div>
 <p class="muted" id="auth-msg"></p></form></div>
<div id="app" hidden><div class="tp-layout" style="grid-template-columns:260px minmax(0,1fr)">
 <aside class="tp-side"><div class="card-p"><div class="muted" id="who" style="margin-bottom:8px"></div><h3>ថ្នាក់របស់ខ្ញុំ</h3><ul class="cls-list" id="cls-list"></ul>
  <button type="button" class="btn btn-primary btn-sm" id="new-cls" style="width:100%">+ បង្កើតថ្នាក់ថ្មី</button>
  <p class="muted" style="margin-top:12px">សិស្សចូលប្រឡងតាម <a href="student.html">student.html</a> ដោយប្រើកូដថ្នាក់ និងលេខ PIN ។</p>
  <a class="btn btn-ghost btn-sm" href="exam-builder.html" style="width:100%;margin-top:6px">បង្កើតវិញ្ញាសា →</a></div>
  <div class="card-p" id="admin-box"></div></aside>
 <section id="main"></section>
</div></div>
</main>
<dialog id="dlg-new" class="card-p" style="width:min(520px,94vw)"><form method="dialog"><h3>បង្កើតថ្នាក់ថ្មី</h3>
<div class="row2"><label class="fld"><span>ឈ្មោះថ្នាក់</span><input id="n-name" placeholder="ឧ. ៩ក"></label><label class="fld"><span>កម្រិតថ្នាក់</span><select id="n-grade">{gopts}</select></label>
<label class="fld"><span>ឆ្នាំសិក្សា</span><input id="n-year"></label><label class="fld"><span>គ្រូប្រចាំថ្នាក់</span><input id="n-teacher"></label></div>
<label class="fld"><span>សាលារៀន</span><input id="n-school"></label>
<label class="fld"><span>មុខវិជ្ជា</span><select id="n-subjects"><option value="math">គណិតវិទ្យាតែមួយ (គ្រូគណិតវិទ្យា)</option><option value="all">គ្រប់មុខវិជ្ជា (គ្រូប្រចាំថ្នាក់)</option></select></label>
<p class="muted">អាចកែមុខវិជ្ជា ពិន្ទុពេញ មេគុណ និងខែនៃឆមាស នៅផ្ទាំង «ការកំណត់» ។</p>
<div class="btns"><button class="btn btn-primary btn-sm" id="n-ok">បង្កើត</button><button type="button" class="btn btn-ghost btn-sm" data-close>បោះបង់</button></div></form></dialog>
<dialog id="dlg-admin" class="card-p" style="width:min(440px,94vw)"><form method="dialog"><h3>ពាក្យសម្ងាត់ Admin</h3>
<label class="fld"><span>ឈ្មោះ Admin (គ្រូ)</span><input id="ad-name"></label>
<label class="fld"><span>ពាក្យសម្ងាត់ថ្មី</span><input id="ad-pw" type="password" autocomplete="new-password"></label>
<label class="fld"><span>វាយម្ដងទៀត</span><input id="ad-pw2" type="password" autocomplete="new-password"></label>
<p class="muted">ពាក្យសម្ងាត់នេះការពារទំព័រ «ថ្នាក់រៀនរបស់ខ្ញុំ» និង «បង្កើតវិញ្ញាសា» នៅលើកុំព្យូទ័រនេះ ។ សូមចងចាំវាឱ្យបាន ។</p><p class="muted" id="ad-msg"></p>
<div class="btns"><button class="btn btn-primary btn-sm" id="ad-ok">រក្សាទុក</button><button type="button" class="btn btn-ghost btn-sm" data-close>បោះបង់</button></div></form></dialog>
<style>dialog::backdrop{{background:rgba(10,20,30,.45)}}dialog{{border:1px solid var(--line);color:var(--ink)}}</style>
"""
    return _shell(T, data, "ថ្នាក់រៀនរបស់ខ្ញុំ", "ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀន ពិន្ទុ និងមធ្យមភាគ ប្រចាំខែ ឆមាស ឆ្នាំ",
                  "teach", body, '<script src="static/js/kp-grading.js"></script>\n<script src="static/js/kp-class.js"></script>\n')


def build_student(T, data):
    body = _hero(T, "សិស្សចូលប្រឡង", "សិស្សចូលប្រឡង", "បញ្ចូលកូដថ្នាក់ដែលលោកគ្រូ អ្នកគ្រូផ្ដល់ឱ្យ ជ្រើសរើសឈ្មោះ និងលេខ PIN ដើម្បីប្រឡង និងមើលពិន្ទុរបស់អ្នក ។")
    body += """<main id="content" class="tp-main"><div class="wrap" style="max-width:860px">
<div id="s-code" class="card-p" hidden style="max-width:460px"><h2>កូដថ្នាក់</h2><form>
 <label class="fld"><span>វាយកូដថ្នាក់ (៦ តួ)</span><input id="c-code" autocomplete="off" style="text-transform:uppercase;letter-spacing:3px;font-size:20px" maxlength="8"></label>
 <button class="btn btn-primary btn-sm" id="c-go">បន្ត</button><p class="muted" id="c-msg"></p></form></div>
<div id="s-login" class="card-p" hidden style="max-width:460px"><h2>ចូលប្រព័ន្ធ</h2><p class="muted" id="l-class"></p><form>
 <label class="fld"><span>ឈ្មោះរបស់អ្នក</span><select id="l-name"></select></label>
 <label class="fld"><span>លេខ PIN</span><input id="l-pin" inputmode="numeric" autocomplete="off" maxlength="8"></label>
 <div class="btns"><button class="btn btn-primary btn-sm" id="l-go">ចូល</button><button type="button" class="btn btn-ghost btn-sm" id="l-back">ត្រឡប់</button></div><p class="muted" id="l-msg"></p></form></div>
<div id="s-home" hidden>
 <div class="pv-bar"><b id="h-who"></b><button type="button" class="btn btn-ghost btn-xs" id="h-out">ចាកចេញ</button></div>
 <div id="h-msg"></div>
 <div class="card-p"><h2>ការប្រឡងដែលកំពុងបើក</h2><div id="h-open"></div></div>
 <div class="card-p"><h2>ពិន្ទុរបស់ខ្ញុំ</h2><div id="h-scores"></div></div>
</div>
<div id="s-exam" hidden>
 <div class="st-bar"><b id="e-title"></b><span class="muted" id="e-count"></span><span class="st-timer" id="e-timer"></span><button type="button" class="btn btn-primary btn-sm" id="e-submit">ប្រគល់វិញ្ញាសា</button></div>
 <div id="e-body"></div>
</div>
</div></main>
<style>.sv-row{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}</style>
"""
    return _shell(T, data, "សិស្សចូលប្រឡង", "សិស្សប្រឡងអនឡាញ និងមើលពិន្ទុ", "teach", body, '<script src="static/js/kp-grading.js"></script>\n<script src="static/js/kp-student.js"></script>\n')


# ------------------------------------------------------------------ Exam Studio: grades 11 and 12
KH_LET = ["ក", "ខ", "គ", "ឃ", "ង", "ច"]


def build_studio_extra(T, data):
    """static/js/studio_extra.js: grades 11–12 for studio.html in the math_data.js format
    (lesson list linking to the lesson pages, and the book MCQs as a question bank)"""
    grades, lessons, qbank = [], {}, []
    for g in (11, 12):
        files = sorted(glob.glob(os.path.join(ROOT, "book", f"g{g}", "L*.json")))
        if not files:
            continue
        ls = []
        for f in files:
            b = json.load(open(f, encoding="utf-8"))
            n = b["num"]
            tr = (b.get("track") or "").replace("ថ្នាក់", "")
            cat = (b.get("part") or "") + (f" ({tr})" if tr else "")
            chapter = f"មេរៀនទី {T.kh(n)} {b['title']}"
            toc = [T.html2tx(t["html"]) for t in b.get("toc", []) if "ទំព័រសៀវភៅ" not in t["html"]]
            mcq = [q for q in b.get("mcq", []) if q.get("answer") is not None and 0 <= q["answer"] < len(q["options"]) and "<img" not in q["stem"] + "".join(q["options"])]
            for i, q in enumerate(mcq):
                qbank.append({"id": f"q_g{g}_L{n:02d}_{i + 1:03d}", "grade": g, "chapter": chapter, "category": cat, "type": "mcq",
                              "difficulty": "មធ្យម", "points": 1, "question": T.html2tx(q["stem"]),
                              "options": [{"key": KH_LET[j], "text": T.html2tx(o)} for j, o in enumerate(q["options"][:6])],
                              "answer": KH_LET[q["answer"]], "explanation": T.html2tx(q.get("sol") or "")})
            ls.append({"id": f"g{g}_L{n:02d}", "num": str(n), "title": b["title"], "category": cat,
                       "summary": "ខ្លឹមសារ ៖ " + " · ".join(toc) if toc else "", "url": T.lesson_url(g, n),
                       "toc": toc, "mcqCount": len(mcq), "writtenCount": len(b.get("exercises", [])),
                       "testId": f"bk_g{g}_L{n:02d}", "pages": b.get("pages"), "theorySections": [], "examples": [], "formulas": []})
        lessons[str(g)] = ls
        grades.append({"id": g, "name": f"ថ្នាក់ទី {T.kh(g)}", "code": f"G{g}", "count": sum(1 for q in qbank if q["grade"] == g),
                       "chaptersCount": len(ls), "desc": f"គណិតវិទ្យាថ្នាក់ទី {T.kh(g)} ({T.kh(len(ls))} មេរៀន)"})
    js = ("(function(D){if(!D)return;var X=" + json.dumps({"grades": grades, "lessons": lessons, "questionBank": qbank}, ensure_ascii=False).replace("</", "<\\/") +
          ";X.grades.forEach(function(g){if(!D.grades.some(function(x){return x.id===g.id}))D.grades.push(g)});"
          "Object.keys(X.lessons).forEach(function(k){D.lessons[k]=X.lessons[k]});"
          "D.questionBank=(D.questionBank||[]).concat(X.questionBank);})(window.MATH_DATA);\n")
    T.write("static/js/studio_extra.js", js)
    return len(qbank)


def build_admin(T, data):
    body = _hero(T, "Admin", "Admin", "គ្រប់គ្រងគណនី Admin ថ្នាក់រៀនទាំងអស់ គ្រូ និងទិន្នន័យបម្រុងទុក ។")
    body += """<main id="content" class="tp-main"><div class="wrap">
<p class="muted" id="ad-mode" style="margin:0 0 14px"></p>
<div id="ad-setup" class="card-p" hidden style="max-width:460px"><h2>បង្កើតគណនី Admin</h2>
 <p class="muted">កុំព្យូទ័រនេះមិនទាន់មាន Admin ។ កំណត់ឈ្មោះ និងពាក្យសម្ងាត់ ដើម្បីការពារទំព័រគ្រូ (ថ្នាក់រៀន ពិន្ទុ និងបង្កើតវិញ្ញាសា) ពីសិស្ស ។</p>
 <form><label class="fld"><span>ឈ្មោះ Admin</span><input id="as-name" autocomplete="name"></label>
 <label class="fld"><span>ពាក្យសម្ងាត់</span><input id="as-pw" type="password" autocomplete="new-password"></label>
 <label class="fld"><span>វាយម្ដងទៀត</span><input id="as-pw2" type="password" autocomplete="new-password"></label>
 <button class="btn btn-primary btn-sm" id="as-ok">បង្កើតគណនី Admin</button><p class="muted" id="as-msg"></p></form></div>
<div id="ad-login" class="card-p" hidden style="max-width:460px"><h2>ចូលជា Admin</h2><form>
 <label class="fld"><span>អ៊ីមែល</span><input id="al-email" type="email" autocomplete="username"></label>
 <label class="fld"><span>ពាក្យសម្ងាត់</span><input id="al-pw" type="password" autocomplete="current-password"></label>
 <button class="btn btn-primary btn-sm" id="al-ok">ចូល</button><p class="muted" id="al-msg"></p></form></div>
<div id="ad-denied" class="card-p" hidden style="max-width:560px"><h2>គណនីនេះមិនមែនជា Admin ទេ</h2>
 <p class="muted">គណនីគ្រូនេះមិនទាន់មានសិទ្ធិ Admin ។ ម្ចាស់ Firebase ត្រូវបន្ថែម UID របស់គណនីនេះក្នុង collection <code>admins</code> (មើល FIREBASE_SETUP.md ផ្នែកទី ៦) ។</p>
 <p><a class="btn btn-ghost btn-sm" href="classroom.html">ទៅថ្នាក់រៀនរបស់ខ្ញុំ</a></p></div>
<div id="ad-dash" hidden>
 <div class="pv-bar"><b id="ad-who"></b><span class="btns" style="margin:0"><a class="btn btn-ghost btn-xs" href="classroom.html">ថ្នាក់រៀន</a><a class="btn btn-ghost btn-xs" href="exam-builder.html">បង្កើតវិញ្ញាសា</a><button class="btn btn-ghost btn-xs" id="ad-lock">🔒 ចាកចេញ</button></span></div>
 <div class="stat-row" id="ad-stats"></div>
 <div class="card-p"><h3>ថ្នាក់ទាំងអស់</h3><div id="ad-classes"></div></div>
 <div class="card-p" id="ad-teachers-box" hidden><h3>គ្រូ</h3><div id="ad-teachers"></div></div>
 <div class="card-p" id="ad-books"><h3>លក់សៀវភៅ PDF ៖ បង្កើតកូដទាញយក</h3>
  <div id="bk-nokey"><p class="muted">ជំហានម្ដងគត់ ៖ នាំចូលឯកសារ <code>books_private/keys.json</code> ពីកុំព្យូទ័ររបស់លោកគ្រូ ។ កូនសោនេះរក្សាទុកតែក្នុង browser នេះ ។ កុំដាក់ថត books_private លើអ៊ីនធឺណិត ។</p>
   <label class="btn btn-primary btn-sm" style="cursor:pointer">នាំចូល keys.json<input type="file" id="bk-keyfile" accept=".json" hidden></label></div>
  <form id="bk-form" hidden class="bk-form">
   <label class="fld"><span>សៀវភៅ</span><select id="bk-book"></select></label>
   <label class="fld"><span>លេខបញ្ជាទិញ (ពីសាររបស់អ្នកទិញ)</span><input id="bk-oid" placeholder="KP012-261026-1234"></label>
   <label class="fld"><span>ឈ្មោះអ្នកទិញ (ឡាតាំង — បោះពុម្ពលើសៀវភៅ)</span><input id="bk-name" placeholder="Sok Dara"></label>
   <label class="fld"><span>ទូរស័ព្ទ / Telegram</span><input id="bk-contact"></label>
   <label class="fld"><span>ចំនួនទឹកប្រាក់ដែលបានទទួល</span><input id="bk-paid" placeholder="20000 ៛"></label>
   <div class="btns" style="align-self:end"><button class="btn btn-gold btn-sm" id="bk-make">បង្កើតកូដ</button></div>
  </form>
  <div id="bk-out" hidden class="bk-out"><p><b>សារសម្រាប់ផ្ញើទៅអ្នកទិញ ៖</b></p><textarea id="bk-msg" rows="7" readonly></textarea>
   <div class="btns"><button class="btn btn-primary btn-sm" id="bk-copy">ចម្លងសារ</button><a class="btn btn-ghost btn-sm" id="bk-test" target="_blank" rel="noopener">សាកល្បងតំណ</a></div></div>
  <div id="bk-sales"></div>
  <div class="btns" id="bk-tools" hidden><button class="btn btn-ghost btn-xs" id="bk-csv">ទាញយកបញ្ជីលក់ (CSV)</button><button class="btn btn-ghost btn-xs" id="bk-forget">លុបកូនសោពី browser នេះ</button></div>
 </div>
 <div class="card-p" id="ad-local-box"><h3>សុវត្ថិភាព និងទិន្នន័យ</h3>
  <p class="muted">ទិន្នន័យថ្នាក់ និងពិន្ទុក្នុងរបៀប Local ស្ថិតតែក្នុង browser នេះ ។ ទាញយកឯកសារបម្រុងទុកជាប្រចាំ ។</p>
  <div class="btns"><button class="btn btn-ghost btn-sm" id="ad-chpw">ប្ដូរពាក្យសម្ងាត់ Admin</button><button class="btn btn-ghost btn-sm" id="ad-backup">ទាញយកឯកសារបម្រុងទុក</button>
  <label class="btn btn-ghost btn-sm" style="cursor:pointer">នាំចូលឯកសារបម្រុងទុក<input type="file" id="ad-import" accept=".json" hidden></label></div></div>
</div>
</div></main>
"""
    return _shell(T, data, "Admin", "ទំព័រ Admin គ្រប់គ្រងថ្នាក់រៀន និងគ្រូ", "", body,
                  '<script src="static/js/kp-grading.js"></script>\n<script src="static/js/kp-admin.js"></script>\n'
                  '<script src="static/books/books.js"></script>\n<script src="static/js/kp-books.js"></script>\n<script src="static/js/kp-books-admin.js"></script>\n')


def build_pages(T=None, data=None):
    if T is None:
        import build_site_from_template as T
        T.SPRITE = T.icon_sprite()
    if data is None:
        data = T.load_data()
    files = [T.write("exam-builder.html", build_builder(T, data)),
             T.write("classroom.html", build_classroom(T, data)),
             T.write("student.html", build_student(T, data)),
             T.write("admin.html", build_admin(T, data))]
    build_studio_extra(T, data)
    return files


if __name__ == "__main__":
    import sys
    sys.path.insert(0, ROOT)
    for g, (n, m, e, kb) in build_banks().items():
        print(f"g{g}: {n} lessons, {m} mcq, {e} written, {kb} KB")
    print(build_pages())
