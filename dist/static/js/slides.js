/* KP Slides — PowerPoint-style teaching slide maker for studio.html (#view-slides).
   Decks are kept in localStorage; slides are 1280×720 stages with absolutely positioned
   text / image / shape elements. Text supports $…$, $$…$$, \(…\), \[…\] (KaTeX) and **bold**. */
(function () {
  'use strict';

  var W = 1280, H = 720, KEY = 'kp-slides-v1';

  var THEMES = {
    ocean:  { name: 'មហាសមុទ្រ', bg: 'linear-gradient(135deg,#0b3d91 0%,#1971c2 60%,#4dabf7 100%)', title: '#ffffff', text: '#e7f5ff', accent: '#ffd43b', card: 'rgba(255,255,255,0.14)' },
    paper:  { name: 'ក្រដាសស', bg: '#ffffff', title: '#1864ab', text: '#212529', accent: '#e8590c', card: '#e7f5ff',
              deco: '<div class="sl-deco" style="left:0;top:0;width:100%;height:14px;background:#1971c2"></div>' },
    chalk:  { name: 'ក្តារខៀន', bg: 'radial-gradient(circle at 30% 20%,#2f5d46,#1b3a2b 70%)', title: '#fff3bf', text: '#f1f3f5', accent: '#ffd43b', card: 'rgba(255,255,255,0.10)',
              deco: '<div class="sl-deco" style="inset:12px;border:10px solid #8d6e4a;border-radius:6px"></div>' },
    khmer:  { name: 'ក្បាច់ខ្មែរ', bg: '#fdf6e3', title: '#8b1e1e', text: '#3b2f2f', accent: '#b8860b', card: '#f6e7c1',
              deco: '<div class="sl-deco" style="inset:18px;border:5px double #b8860b;border-radius:10px"></div>' },
    sunset: { name: 'ថ្ងៃលិច', bg: 'linear-gradient(135deg,#e8590c,#f59f00)', title: '#ffffff', text: '#fff9db', accent: '#1864ab', card: 'rgba(255,255,255,0.2)' },
    night:  { name: 'យប់', bg: '#101828', title: '#63e6be', text: '#e9ecef', accent: '#74c0fc', card: 'rgba(255,255,255,0.08)',
              deco: '<div class="sl-deco" style="left:60px;bottom:40px;width:160px;height:8px;border-radius:4px;background:#63e6be"></div>' },
    // classroom style: school name header, page badge, navy footer with the teacher's name
    school: { name: 'គំរូសាលា', bg: '#f8f9fb', title: '#002060', text: '#002060', accent: '#c00000', brand: '#f68c1f', head: '#8b0000', card: '#ffffff', math: '#7f0000',
              titleFont: true, bodyFont: "'Battambang', 'Kantumruy Pro', sans-serif", deco: schoolDeco,
              // artwork taken from the sample deck; slide.kind picks one, header/footer text is drawn on top
              images: { content: 'bg-content', cover: 'bg-cover', toc: 'bg-content', goal: 'bg-goal', thanks: 'bg-thanks' } }
  };

  var SCHOOL_IMG = 'static/img/slides/school/';
  // positions follow the sample deck (1440×810 scaled to 1280×720)
  function schoolDeco(deck, sl, idx) {
    var kind = sl.kind || 'content';
    if (sl.plain || kind === 'cover') return '';
    var n = idx + 1, left = (kind === 'content' || kind === 'toc') ? 23 : kind === 'thanks' ? 28 : 48, top = kind === 'thanks' ? 3 : -9;
    return (kind === 'goal' && deck.grade !== '11' ? bookCover(deck.grade) : '') +
      '<div class="sl-deco sl-hdr" style="left:' + left + 'px;top:' + top + 'px">' + schoolName(deck) + '</div>' +
      (kind === 'thanks' ? '' : '<div class="sl-deco sl-badge">' + (n < 10 ? '0' : '') + n + '</div>') +
      '<div class="sl-deco sl-ftr">' + esc(deck.teacher || '') + '</div>';
  }
  // bg-goal.jpg has the grade 11 textbook baked in; other grades get bg-goal-blank.jpg plus a cover drawn for their grade
  var BOOK_COLORS = { '7': ['#fde68a', '#f59e0b'], '8': ['#bfdbfe', '#3b82f6'], '9': ['#fecaca', '#ef4444'], '10': ['#ddd6fe', '#8b5cf6'] };
  function goalImage(deck) { return deck.grade === '11' ? 'bg-goal' : 'bg-goal-blank'; }
  function bookCover(grade) {
    var c = BOOK_COLORS[grade] || ['#bbf7d0', '#22c55e'];
    return '<div class="sl-deco sl-book" style="background:linear-gradient(160deg,' + c[0] + ',#ffffff 55%,' + c[0] + ')">' +
      '<div class="sl-book-min">ក្រសួងអប់រំ យុវជន និងកីឡា</div>' +
      '<div class="sl-book-title">គណិតវិទ្យា</div>' +
      (grade ? '<div class="sl-book-grade" style="border-color:' + c[1] + '">ថ្នាក់ទី<b style="color:' + c[1] + '">' + kh(grade) + '</b></div>' : '') +
      '<svg class="sl-book-art" viewBox="0 0 200 120"><path d="M10 100H190M30 115V8" stroke="#334155" stroke-width="2"/>' +
      '<path d="M30 100Q80 10 120 60T190 20" fill="none" stroke="' + c[1] + '" stroke-width="3"/>' +
      '<path d="M30 90L180 30" stroke="#64748b" stroke-width="2" stroke-dasharray="5 4"/></svg>' +
      '<div class="sl-book-foot">គ្រឹះស្ថានបោះពុម្ព និងចែកផ្សាយ</div></div>';
  }
  function schoolName(d) {
    return '<span style="color:#002060">' + esc(d.school || '') + '</span> <span style="color:#f68c1f">' + esc(d.school2 || '') + '</span>' +
      (d.school3 ? ' <span class="sl-latin" style="color:#002060">' + esc(d.school3) + '</span>' : '');
  }

  var S = { store: null, deck: null, cur: 0, sel: null, edit: null, undo: [], redo: [], undoKey: '', undoT: 0,
            scale: 1, clip: null, show: null, built: false, tab: 'home' };
  var root, stage, holder, wrap, thumbs, ribbon, notes, statusEl;

  /* ---------------- helpers ---------------- */
  function uid() { return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function kh(n) { return String(n).replace(/\d/g, function (d) { return '០១២៣៤៥៦៧៨៩'[d]; }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function th() { return THEMES[S.deck.theme] || THEMES.ocean; }
  function slide() { return S.deck.slides[S.cur]; }
  function selEl() { if (!S.sel) return null; var s = slide(); for (var i = 0; i < s.els.length; i++) if (s.els[i].id === S.sel) return s.els[i]; return null; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function T(x, y, w, h, text, o) {
    var e = { id: uid(), type: 'text', x: x, y: y, w: w, h: h, text: text, size: 30, color: null, bold: false, italic: false,
              align: 'left', valign: 'top', role: 'body', fill: null, radius: 0 };
    for (var k in o) e[k] = o[k];
    return e;
  }
  function newSlide(els) { return { id: uid(), bg: null, notes: '', els: els || [] }; }

  function roleColor(role) {
    var t = th();
    return role === 'title' ? t.title : (role === 'sub' || role === 'ans') ? t.accent : t.text;
  }
  // colour tokens follow the theme: card / accent / brand / title / text
  function resolveFill(f) {
    var t = th();
    return f === 'card' ? t.card : f === 'accent' ? t.accent : f === 'brand' ? (t.brand || t.accent) : f === 'title' ? t.title : f === 'text' ? t.text :
           f === 'head' ? (t.head || t.accent) : f;
  }
  var DISPLAY_FONT = "'Koulen', 'Kantumruy Pro', sans-serif";
  function hexOr(c, d) { return /^#[0-9a-f]{6}$/i.test(c || '') ? c : d; }

  /* ---------------- text formatting (KaTeX + **bold**) ---------------- */
  var MATH_RE = /(\\begin\{([a-zA-Z]+\*?)\}[\s\S]+?\\end\{\2\}|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$]+?\$)/g;
  var MACROS = { '\\Am': '\\textbf{\\color{blue}✍️ ដំណោះស្រាយ៖}', '\\ans': '\\textbf{\\color{blue}✍️ ដំណោះស្រាយ៖}' };
  function tex(src, display) {
    if (!window.katex) return esc(src);
    try { return katex.renderToString(src, { displayMode: display, throwOnError: false, macros: clone(MACROS) }); }
    catch (e) { return esc(src); }
  }
  function inline(s) {
    return s
      .replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>')
      .replace(/^\s*\*\*\s*$/gm, '')
      .replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>')
      .replace(/__(.+?)__/g, '<u>$1</u>')
      .replace(/!!(.+?)!!/g, '<span class="sl-c-accent">$1</span>')
      .replace(/==(.+?)==/g, '<span class="sl-c-brand">$1</span>')
      .replace(/\\q?quad\b/g, '&emsp;');
  }
  // markdown-style "| a | b |" tables (with a "| :--- | :---: |" row) and ``` code blocks become real blocks
  var ROW_RE = /^\s*\|.*\|\s*$/, SEP_RE = /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/, FENCE_RE = /^\s*(\\?`){3}\s*$/;
  function cells(line) { return line.trim().replace(/^\||\|$/g, '').split('|'); }
  function table(rows) {
    var al = cells(rows[1]).map(function (c) { c = c.trim(); return /^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : 'left'; });
    var tr = function (line, tag) {
      return '<tr>' + cells(line).map(function (c, i) { return '<' + tag + ' style="text-align:' + (al[i] || 'left') + '">' + inline(c.trim()) + '</' + tag + '>'; }).join('') + '</tr>';
    };
    return '<table class="sl-md-table"><thead>' + tr(rows[0], 'th') + '</thead><tbody>' +
      rows.slice(2).map(function (r) { return tr(r, 'td'); }).join('') + '</tbody></table>';
  }
  function plain(s) {
    var lines = esc(s).split('\n'), out = [], text = [], i = 0;
    var flush = function () { if (text.length) out.push(inline(text.join('\n')).replace(/\n/g, '<br>')); text = []; };
    while (i < lines.length) {
      if (FENCE_RE.test(lines[i])) {
        var j = i + 1;
        while (j < lines.length && !FENCE_RE.test(lines[j])) j++;
        if (j < lines.length) { flush(); out.push('<pre class="sl-md-pre">' + lines.slice(i + 1, j).join('\n') + '</pre>'); i = j + 1; continue; }
      }
      if (/^\s*-{3,}\s*$/.test(lines[i])) { flush(); out.push('<hr class="sl-md-hr">'); i++; if (i < lines.length && !lines[i].trim()) i++; continue; }
      if (ROW_RE.test(lines[i]) && i + 1 < lines.length && SEP_RE.test(lines[i + 1])) {
        var k = i + 2;
        while (k < lines.length && ROW_RE.test(lines[k])) k++;
        flush(); out.push(table(lines.slice(i, k))); i = k;
        if (i < lines.length && !lines[i].trim()) i++;   // the blank line after a table is the table's own margin
        continue;
      }
      text.push(lines[i]); i++;
    }
    flush();
    return out.join('');
  }
  // maths is swapped for placeholders first so **bold** / !!colour!! may wrap formulas
  function fmt(text) {
    var maths = [];
    var src = String(text || '').replace(MATH_RE, function (m) {
      var h;
      if (m.slice(0, 6) === '\\begin') h = tex(m, true);
      else if (m.slice(0, 2) === '$$' || m.slice(0, 2) === '\\[') h = tex(m.slice(2, -2), true);
      else if (m.slice(0, 2) === '\\(') h = tex(m.slice(2, -2), false);
      else h = tex(m.slice(1, -1), false);
      maths.push(h);
      return '\u0000' + (maths.length - 1) + '\u0000';
    });
    return plain(src).replace(/\u0000(\d+)\u0000/g, function (m, i) { return maths[+i]; });
  }

  /* ---------------- painting ---------------- */
  function shapeSVG(el) {
    if (el.svg) return el.svg;
    var w = el.w, h = el.h, sw = el.sw != null ? el.sw : 0, t = th();
    var fill = el.shape === 'line' || el.shape === 'arrow' ? 'none' : (resolveFill(el.fill) || t.accent);
    var stroke = resolveFill(el.stroke) || (el.shape === 'line' || el.shape === 'arrow' ? t.accent : 'none');
    if ((el.shape === 'line' || el.shape === 'arrow') && !sw) sw = 6;
    var a = 'fill="' + esc(fill) + '" stroke="' + esc(stroke) + '" stroke-width="' + sw + '"', b = sw / 2, body;
    switch (el.shape) {
      case 'ellipse': body = '<ellipse cx="' + w / 2 + '" cy="' + h / 2 + '" rx="' + Math.max(1, w / 2 - b) + '" ry="' + Math.max(1, h / 2 - b) + '" ' + a + '/>'; break;
      case 'triangle': body = '<polygon points="' + w / 2 + ',' + b + ' ' + (w - b) + ',' + (h - b) + ' ' + b + ',' + (h - b) + '" ' + a + ' stroke-linejoin="round"/>'; break;
      case 'line': body = '<line x1="0" y1="' + h / 2 + '" x2="' + w + '" y2="' + h / 2 + '" ' + a + ' stroke-linecap="round"/>'; break;
      case 'arrow':
        var hl = Math.min(w * 0.5, Math.max(18, sw * 4));
        body = '<line x1="0" y1="' + h / 2 + '" x2="' + (w - hl * 0.8) + '" y2="' + h / 2 + '" ' + a + ' stroke-linecap="round"/>' +
               '<polygon points="' + w + ',' + h / 2 + ' ' + (w - hl) + ',' + (h / 2 - hl * 0.6) + ' ' + (w - hl) + ',' + (h / 2 + hl * 0.6) + '" fill="' + esc(stroke) + '"/>';
        break;
      default:
        var rx = el.shape === 'round' ? Math.min(28, w / 4, h / 4) : 0;
        body = '<rect x="' + b + '" y="' + b + '" width="' + Math.max(1, w - sw) + '" height="' + Math.max(1, h - sw) + '" rx="' + rx + '" ' + a + '/>';
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' + body + '</svg>';
  }

  function buildEl(el) {
    var d = document.createElement('div');
    d.className = 'sl-el sl-' + el.type; d.dataset.id = el.id;
    place(d, el);
    if (el.op != null && el.op < 1) d.style.opacity = el.op;
    if (el.type === 'text') {
      var box = document.createElement('div'), inner = document.createElement('div');
      box.className = 'sl-txt';
      var display = el.font === 'display' || (el.font == null && el.role === 'title' && th().titleFont);
      var fs = el.size || 28;
      if (fs <= 20) fs = 22;
      else if (fs <= 22) fs = 24;
      else if (fs <= 24) fs = 26;
      else if (fs <= 26) fs = 28;
      else if (fs <= 28) fs = 30;
      else if (fs <= 32) fs = 33;
      else if (fs <= 36) fs = 36;
      box.style.fontSize = fs + 'px';
      box.style.color = el.color ? resolveFill(el.color) : roleColor(el.role);
      if (el.color) box.style.setProperty('--sl-math', resolveFill(el.color));
      box.style.fontWeight = (el.bold === false) ? '400' : '700';
      box.style.fontStyle = el.italic ? 'italic' : 'normal';
      box.style.textAlign = el.align;
      box.style.justifyContent = el.valign === 'middle' ? 'center' : el.valign === 'bottom' ? 'flex-end' : 'flex-start';
      box.style.lineHeight = el.lh || '1.25';
      if (display) { box.style.fontFamily = DISPLAY_FONT; box.style.lineHeight = el.lh || '1.25'; }
      if (el.shadow) box.style.textShadow = '2px 3px 3px rgba(0,0,0,.35)';
      if (el.fill) { box.style.background = resolveFill(el.fill); box.style.padding = '14px 22px'; }
      if (el.border) { box.style.border = (el.bw || 3) + 'px solid ' + resolveFill(el.border); box.style.padding = '6px 20px'; }
      if (el.radius) box.style.borderRadius = el.radius + 'px';
      inner.innerHTML = fmt(el.text);
      box.appendChild(inner); d.appendChild(box);
    } else if (el.type === 'image') {
      var img = document.createElement('img'); img.src = el.src; img.alt = ''; img.draggable = false;
      d.appendChild(img);
    } else if (el.type === 'timer') {
      d.innerHTML = '<div class="sl-clock" style="font-size:' + Math.round(el.h * 0.55) + 'px"><span>' + clock(el.sec) + '</span></div>';
    } else {
      d.innerHTML = shapeSVG(el);
    }
    return d;
  }
  function clock(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
  function place(d, el) {
    d.style.left = el.x + 'px'; d.style.top = el.y + 'px'; d.style.width = el.w + 'px'; d.style.height = el.h + 'px';
    d.style.transform = el.rot ? 'rotate(' + el.rot + 'deg)' : '';
  }
  // shrink text that overflows its box (display only — el.size is kept)
  function fit(scope) {
    scope.querySelectorAll('.sl-txt').forEach(function (b) {
      var inner = b.firstChild, fs = parseFloat(b.style.fontSize), n = 0;
      var avail = function () { var cs = getComputedStyle(b); return b.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom); };
      var minFs = 19;
      while (inner.offsetHeight > avail() + 1 && fs > minFs && n++ < 80) { fs -= fs > 30 ? 1.5 : 1; b.style.fontSize = fs + 'px'; }
    });
  }
  function paint(sl, st, mode, idx) {
    var t = th();
    st.innerHTML = '';
    st.style.background = sl.bg || t.bg;
    if (t.images && !sl.bg && !sl.plain) st.style.background = 'url("' + SCHOOL_IMG + (sl.kind === 'goal' ? goalImage(S.deck) : t.images[sl.kind] || t.images.content) + '.jpg") center / 100% 100% no-repeat, ' + t.bg;
    st.style.fontFamily = t.bodyFont || '';
    st.style.setProperty('--sl-accent', t.accent);
    st.style.setProperty('--sl-brand', t.brand || t.accent);
    if (t.math) st.style.setProperty('--sl-math', t.math); else st.style.removeProperty('--sl-math');
    var deco = typeof t.deco === 'function' ? t.deco(S.deck, sl, idx || 0) : t.deco;
    if (deco) st.insertAdjacentHTML('beforeend', deco);
    sl.els.forEach(function (el) {
      var d = buildEl(el);
      if (el.anim && mode !== 'print') d.classList.add(mode === 'show' ? 'sl-hidden' : 'sl-anim-mark');
      // anim set to a name (not just true) groups elements that appear on the same click
      if (el.anim && el.anim !== true) d.dataset.grp = el.anim;
      st.appendChild(d);
    });
    fit(st);
  }

  /* ---------------- persistence & undo ---------------- */
  var saveTimer;
  function save() {
    S.deck.updated = Date.now();
    clearTimeout(saveTimer);
    status('… កំពុងរក្សាទុក');
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(S.store)); status('✓ បានរក្សាទុកក្នុងកម្មវិធីរុករក'); }
      catch (e) { status('⚠ ទំហំផ្ទុកពេញ — សូមរក្សាទុកជាឯកសារ .json (ផ្ទាំង ឯកសារ)'); }
    }, 350);
  }
  function status(t) { if (statusEl) statusEl.textContent = t; }

  function pushUndoRaw(snap) {
    S.undo.push(snap); if (S.undo.length > 60) S.undo.shift(); S.redo = []; S.undoKey = '';
  }
  // key: coalesce rapid edits of the same property (colour sliders, typing a size)
  function pushUndo(key) {
    var now = Date.now();
    if (key && key === S.undoKey && now - S.undoT < 1200) { S.undoT = now; return; }
    pushUndoRaw(JSON.stringify({ deck: S.deck, cur: S.cur }));
    S.undoKey = key || ''; S.undoT = now;
  }
  function restore(snap) {
    var o = JSON.parse(snap);
    S.deck = o.deck; S.store.decks[S.deck.id] = S.deck;
    S.cur = Math.min(o.cur, S.deck.slides.length - 1); S.sel = null;
    renderAll(); save();
  }
  function undo() { if (!S.undo.length) return; commitEdit(); S.redo.push(JSON.stringify({ deck: S.deck, cur: S.cur })); restore(S.undo.pop()); S.undoKey = ''; }
  function redo() { if (!S.redo.length) return; commitEdit(); S.undo.push(JSON.stringify({ deck: S.deck, cur: S.cur })); restore(S.redo.pop()); S.undoKey = ''; }
  function change(fn, key) { commitEdit(); pushUndo(key); fn(); renderStage(); renderThumb(S.cur); syncRibbon(); save(); }

  function load() {
    var v1 = null, v2 = null;
    try { v1 = JSON.parse(localStorage.getItem('kp-slides-v1')); } catch (e) {}
    try { v2 = JSON.parse(localStorage.getItem('kp-slides-v2')); } catch (e) {}
    // Seamless recovery: keep all user decks from v1 and merge any from v2
    S.store = v1 || v2 || { current: null, decks: {} };
    if (!S.store.decks) S.store.decks = {};
    if (v1 && v2 && v2.decks) {
      Object.keys(v2.decks).forEach(function (k) {
        if (!S.store.decks[k]) S.store.decks[k] = v2.decks[k];
      });
    }
    if (!Object.keys(S.store.decks).length) addDeck(sampleDeck());
    seedTemplates();
    var linked = openLinkedDeck();
    // a deck opened from a lesson page wins over the studio's default grade (window.currentGrade = 10)
    if (linked) S.activeGrade = getDeckGrade(S.deck) || 'all';
    var initG = linked ? 'all' : getActiveGrade();
    if (initG && initG !== 'all') {
      var matchGKey = Object.keys(S.store.decks).find(function (k) { return getDeckGrade(S.store.decks[k]) === initG; });
      if (matchGKey) S.store.current = matchGKey;
    }
    S.deck = S.store.decks[S.store.current] || S.store.decks[Object.keys(S.store.decks)[0]];
    Object.keys(S.store.decks).forEach(function (k) { deckDefaults(S.store.decks[k]); });
    S.store.current = S.deck.id;
  }
  // templates with an id/ver open by themselves once per version; an older copy is replaced only if never edited
  function seedTemplates() {
    var seeded = S.store.seeded || (S.store.seeded = {}), first = null;
    var tpls = window.KPSlideTemplates || [];

    // Clean up legacy deprecated templates and ensure Chapter 5 is strictly sc2
    Object.keys(S.store.decks).forEach(function (k) {
      var d = S.store.decks[k];
      if (!d) return;
      if (d.tpl === 'g11-trig') {
        delete S.store.decks[k];
        return;
      }
      if ((d.grade === '11' || (d.id && d.id.indexOf('g11') === 0)) && d.chapterNum === 5 && d.part !== 'ss') {
        d.part = 'sc2';
        d.track = 'science';
        d.trackName = 'វិទ្យាសាស្ត្រភាគ២';
        d.chapter = 'វិទ្យាសាស្ត្រភាគ២ · ជំពូកទី 5 ៖ លីមីតនិងដេរីវេ';
        if (d.name && d.name.indexOf('វិទ្យាសាស្ត្រភាគ១') !== -1) {
          d.name = d.name.replace('វិទ្យាសាស្ត្រភាគ១', 'វិទ្យាសាស្ត្រភាគ២');
        }
      }
    });

    tpls.forEach(function (t) {
      if (!t.id) return;
      var hasDeck = Object.keys(S.store.decks).some(function (k) { return S.store.decks[k].tpl === t.id; });
      if (hasDeck) {
        // ALWAYS update chapter, part, track, lesson, name on existing decks to guarantee
        // that localStorage stays 100% in sync with the official textbook curriculum!
        Object.keys(S.store.decks).forEach(function (k) {
          var o = S.store.decks[k];
          if (o.tpl === t.id) {
            if (t.grade) o.grade = t.grade;
            if (t.chapter) o.chapter = t.chapter;
            if (t.chapterNum != null) o.chapterNum = t.chapterNum;
            if (t.lesson) o.lesson = t.lesson;
            if (t.lessonNum != null) o.lessonNum = t.lessonNum;
            if (t.track) o.track = t.track;
            if (t.part) o.part = t.part;
            if (t.trackName) o.trackName = t.trackName;
            if (t.name) o.name = t.name;
            if (t.sections) o.sections = t.sections;
          }
        });
      }
      if (hasDeck && seeded[t.id] === t.ver) return;
      Object.keys(S.store.decks).forEach(function (k) {
        var o = S.store.decks[k];
        // Only replace unedited template copies or when version is refreshed
        if (o.tpl === t.id && (seeded[t.id] !== t.ver || o.updated === o.seededAt)) delete S.store.decks[k];
      });
      var d = t.build(window.KPSlides.api);
      d.id = uid(); d.tpl = t.id; d.updated = d.seededAt = Date.now();
      if (t.grade) d.grade = t.grade;
      if (t.chapter) d.chapter = t.chapter;
      if (t.chapterNum != null) d.chapterNum = t.chapterNum;
      if (t.lesson) d.lesson = t.lesson;
      if (t.lessonNum != null) d.lessonNum = t.lessonNum;
      if (t.sections) d.sections = t.sections;
      if (t.track) d.track = t.track;
      if (t.part) d.part = t.part;
      if (t.trackName) d.trackName = t.trackName;
      if (t.name) d.name = t.name;
      deckDefaults(d);
      S.store.decks[d.id] = d;
      seeded[t.id] = t.ver;
      if (!first) first = d;
    });
    if (!S.store.current || !S.store.decks[S.store.current]) {
      if (first) S.store.current = first.id;
    }
    try { localStorage.setItem(KEY, JSON.stringify(S.store)); } catch (e) {}
  }
  function reloadTemplates() {
    if (!S.store) return;
    S.store.seeded = {};
    seedTemplates();
    if (root) syncRibbon();
    renderAll();
    status('✓ បានផ្ទុកមេរៀនឡើងវិញទាំងអស់រួចរាល់');
  }
  // studio.html?deck=<template id> (the lesson page's «ស្លាយបង្រៀន» button) opens the newest copy of that deck
  function openLinkedDeck() {
    var want = new URLSearchParams(location.search).get('deck'), best = null;
    if (!want) return false;
    Object.keys(S.store.decks).forEach(function (k) {
      var d = S.store.decks[k];
      if (d.tpl === want && (!best || (d.seededAt || d.updated || 0) >= (best.seededAt || best.updated || 0))) best = d;
    });
    if (best) { S.store.current = best.id; S.deck = best; return true; }
    (window.KPSlideTemplates || []).forEach(function (t) {
      if (t.id !== want || best) return;
      best = t.build(window.KPSlides.api);
      best.id = uid(); best.tpl = t.id; best.updated = best.seededAt = Date.now();
      if (t.chapter) best.chapter = t.chapter;
      if (t.chapterNum != null) best.chapterNum = t.chapterNum;
      if (t.lesson) best.lesson = t.lesson;
      if (t.lessonNum != null) best.lessonNum = t.lessonNum;
      if (t.sections) best.sections = t.sections;
      deckDefaults(best);
      S.store.decks[best.id] = best;
      S.store.current = best.id;
      S.deck = best;
      try { localStorage.setItem(KEY, JSON.stringify(S.store)); } catch (e) {}
    });
    return !!best;
  }

  function parseKhmerNum(s) {
    if (!s) return 0;
    var kh = '០១២៣៤៥៦៧៨៩';
    var res = 0, found = false;
    for (var i = 0; i < s.length; i++) {
      var idx = kh.indexOf(s[i]);
      if (idx >= 0) { res = res * 10 + idx; found = true; }
      else if (!isNaN(parseInt(s[i])) && s[i] >= '0' && s[i] <= '9') { res = res * 10 + parseInt(s[i]); found = true; }
    }
    return found ? res : 0;
  }

  function getDeckSections(deck) {
    if (!deck || !deck.slides) return [];
    if (deck.sections && deck.sections.length) return deck.sections;
    var secs = [];
    deck.slides.forEach(function (sl, idx) {
      if (idx === 0) {
        secs.push({ title: 'ក្របមេរៀន (Cover)', slide: 0 });
        return;
      }
      var found = '';
      (sl.els || []).forEach(function (el) {
        if (found || el.type !== 'text' || !el.text) return;
        var t = el.text.trim();
        var m = t.match(/^([១២៣៤៥៦៧៨៩០\d]+(\.[១២៣៤៥៦៧៨៩០\d]+)*\s*[\.៖:-]?\s*[^\n]+)/);
        if (m && m[1].length < 60) {
          found = m[1].replace(/\n/g, ' ').trim();
        } else if (/^(វត្ថុបំណង|មាតិកា|កិច្ចការផ្ទះ|សង្ខេប|រំលឹកមេរៀន|សំណួរនាំចូល|ពង្រឹងពុទ្ធិ)/.test(t)) {
          found = t.split('\n')[0].substring(0, 50).trim();
        }
      });
      if (found) {
        if (!secs.length || secs[secs.length - 1].title !== found) {
          secs.push({ title: found, slide: idx });
        }
      }
    });
    return secs;
  }

  // header / footer text used by the «គំរូសាលា» theme
  function deckDefaults(d) {
    if (d.school == null) d.school = 'KP';
    if (d.school2 == null) d.school2 = 'Cambodian Mathematics';
    if (d.teacher == null) d.teacher = 'បង្រៀនដោយ លោកគ្រូ ...';
    if (d.school3 == null) d.school3 = '';
    if (!d.grade && d.name) {
      var gm = d.name.match(/ថ្នាក់ទី\s*([១២៣៤៥៦៧៨៩០\d]+)/);
      if (gm) d.grade = String(parseKhmerNum(gm[1]));
    }
    // Auto-detect Chapter and Lesson if not specified
    if (!d.chapter) {
      var n = d.name || '';
      if (n.indexOf('ស៊ីត') >= 0) {
        d.chapter = 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា';
        d.chapterNum = 1;
      } else if (n.indexOf('អិចស្ប៉ូណង់') >= 0 || n.indexOf('លោការីត') >= 0) {
        d.chapter = 'ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងលោការីត';
        d.chapterNum = 2;
      } else if (n.indexOf('ត្រីកោណ') >= 0) {
        d.chapter = 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ';
        d.chapterNum = 3;
      } else if (n.indexOf('ម៉ាទ្រីស') >= 0 || n.indexOf('ដេទែរមីណង់') >= 0) {
        d.chapter = 'ជំពូកទី ៤ ៖ ម៉ាទ្រីស និងដេទែរមីណង់';
        d.chapterNum = 4;
      } else if (n.indexOf('លីមីត') >= 0 || n.indexOf('ដេរីវេ') >= 0) {
        d.chapter = 'ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ';
        d.chapterNum = 5;
      } else {
        d.chapter = 'បទបង្ហាញផ្សេងៗ';
        d.chapterNum = 99;
      }
    }
    if (d.lessonNum == null && d.name) {
      var lm = d.name.match(/មេរៀនទី\s*([១២៣៤៥៦៧៨៩០\d]+)/);
      if (lm) d.lessonNum = parseKhmerNum(lm[1]);
    }
    return d;
  }

  function getDeckGrade(d) {
    if (!d) return '';
    if (d.grade != null && String(d.grade).trim() !== '') return String(d.grade).trim();
    var tpl = d.tpl || '';
    var m = tpl.match(/^g(\d+)/i);
    if (m) return m[1];
    var n = (d.name || '') + ' ' + (d.chapter || '');
    if (/ថ្នាក់ទី\s*១០|ថ្នាក់ទី\s*10/i.test(n)) return '10';
    if (/ថ្នាក់ទី\s*១១|ថ្នាក់ទី\s*11/i.test(n)) return '11';
    if (/ថ្នាក់ទី\s*១២|ថ្នាក់ទី\s*12/i.test(n)) return '12';
    if (/ថ្នាក់ទី\s*៩|ថ្នាក់ទី\s*9/i.test(n)) return '9';
    if (/ថ្នាក់ទី\s*៨|ថ្នាក់ទី\s*8/i.test(n)) return '8';
    if (/ថ្នាក់ទី\s*៧|ថ្នាក់ទី\s*7/i.test(n)) return '7';
    return '';
  }

  function getActiveGrade() {
    if (S.activeGrade && S.activeGrade !== 'all') return String(S.activeGrade);
    if (S.activeGrade === 'all') return 'all';
    if (window.currentGrade && window.currentGrade !== 'all') return String(window.currentGrade);
    if (window.currentGrade === 'all') return 'all';
    if (S.deck) {
      var g = getDeckGrade(S.deck);
      if (g) return g;
    }
    return 'all';
  }

  function addDeck(d) { deckDefaults(d); S.store.decks[d.id] = d; S.store.current = d.id; S.deck = d; S.cur = 0; S.sel = null; S.undo = []; S.redo = []; }

  /* ---------------- layouts & sample ---------------- */
  var LAYOUTS = {
    title:    { name: '🏷 ស្លាយចំណងជើង', make: function () { return [
                T(100, 200, 1080, 160, 'ចំណងជើងមេរៀន', { size: 64, bold: true, align: 'center', valign: 'middle', role: 'title' }),
                T(100, 385, 1080, 80, 'ថ្នាក់ទី ... · គ្រូបង្រៀន ...', { size: 30, align: 'center', role: 'sub' })]; } },
    content:  { name: '📝 ចំណងជើង + ខ្លឹមសារ', make: function () { return [
                T(60, 40, 1160, 100, 'ចំណងជើង', { size: 46, bold: true, valign: 'middle', role: 'title' }),
                T(60, 160, 1160, 500, '• ចំណុចទី ១\n• ចំណុចទី ២ ដែលមានរូបមន្ត $a^2 + b^2 = c^2$\n• ចំណុចទី ៣', { size: 32 })]; } },
    two:      { name: '◫ ពីរជួរឈរ', make: function () { return [
                T(60, 40, 1160, 100, 'ប្រៀបធៀប', { size: 46, bold: true, valign: 'middle', role: 'title' }),
                T(60, 170, 560, 490, '**ផ្នែកទី ១**\n• ...', { size: 30, fill: 'card', radius: 18 }),
                T(660, 170, 560, 490, '**ផ្នែកទី ២**\n• ...', { size: 30, fill: 'card', radius: 18 })]; } },
    formula:  { name: '∑ រូបមន្ត', make: function () { return [
                T(60, 40, 1160, 100, 'រូបមន្តសំខាន់', { size: 46, bold: true, valign: 'middle', role: 'title' }),
                T(140, 190, 1000, 300, '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$', { size: 44, align: 'center', valign: 'middle', fill: 'card', radius: 24 }),
                T(140, 520, 1000, 120, 'ដែល $a \\neq 0$ និង $\\Delta = b^2 - 4ac \\geq 0$', { size: 28, align: 'center', role: 'sub' })]; } },
    question: { name: '❓ សំណួរ + ចម្លើយ', make: function () { return questionEls('សំណួរ', 'គណនា $2 + 3 \\times 4$ ។', ['$20$', '$14$', '$24$', '$9$'], 'ខ', ''); } },
    blank:    { name: '⬜ ទទេ', make: function () { return []; } },
    // classroom layouts — designed for the «គំរូសាលា» theme (header 0–105, footer 656–720)
    s_cover:  { name: '🏫 គម្រប (Cover)', slide: function () { return SCHOOL.cover('==គណិតវិទ្យា== ថ្នាក់ទី..', '==ជំពូកទី១==      មេរៀនទី១', 'ចំណងជើងមេរៀន'); } },
    s_toc:    { name: '🏫 មាតិកា', slide: function () { return SCHOOL.toc(['==១. ផ្នែកទី១==', '២. ផ្នែកទី២']); } },
    s_goal:   { name: '🏫 វត្ថុបំណង', slide: function () { return SCHOOL.objective(['បំណងទី ១ ...', 'បំណងទី ២ ...']); } },
    s_def:    { name: '🏫 និយមន័យ (ប្រអប់ក្រហម)', slide: function () { return SCHOOL.page([
                SCHOOL.heading('១. ចំណងជើងផ្នែក'),
                SCHOOL.box(50, 215, 1180, 150, '!!__និយមន័យ ៖__!! សរសេរនិយមន័យនៅទីនេះ $a_n$ ...'),
                T(60, 390, 1160, 250, 'ពន្យល់បន្ថែម ...', { size: 30 })]); } },
    s_ex:     { name: '🏫 លំហាត់ + ដំណោះស្រាយ', slide: function () { return SCHOOL.page([
                T(40, 115, 1200, 70, '!!__លំហាត់ ៖__!!  គេមានអនុគមន៍ $f(x) = 2x - 1$ ចូររកតម្លៃនៃ $f(1)$', { size: 32 }),
                T(80, 190, 300, 60, '!!__ដំណោះស្រាយ__!!', { size: 32 }),
                T(110, 260, 900, 70, '$\\Rightarrow f(1) = 2(1) - 1 = 1$', { size: 34, anim: true })].concat(SCHOOL.conclude(560, '$f(1) = 1$'))); } },
    s_quiz:   { name: '🏫 ពង្រឹងពុទ្ធិ (Quiz + ⏱)', slide: function () { return SCHOOL.quiz('១. សំណួរ ...', ['$a_n = 2n$', '$a_n = 4n - 2$', '$a_n = 3n - 1$', '$a_n = n + 1$'], 0); } },
    s_home:   { name: '🏫 កិច្ចការផ្ទះ', slide: function () { return SCHOOL.homework('កំណត់តួទី !!$n$!! នៃស៊ីតខាងក្រោម ៖\nក. $5, 7, 9, 11, \\ldots$'); } },
    s_thanks: { name: '🏫 សូមអរគុណ', slide: function () { return SCHOOL.thanks(); } }
  };

  /* builders for the classroom style; also used by templates (KPSlides.api) */
  function shp(shape, x, y, w, h, o) {
    var e = { id: uid(), type: 'shape', shape: shape, x: x, y: y, w: w, h: h, fill: null, stroke: null, sw: 0 };
    for (var k in o) e[k] = o[k];
    return e;
  }
  function timerEl(x, y, w, h, sec) { return { id: uid(), type: 'timer', x: x, y: y, w: w, h: h, sec: sec || 30 }; }
  var SCHOOL = {
    page: function (els, o) { var s = newSlide(els); for (var k in o) s[k] = o[k]; return s; },
    heading: function (text, y) { return T(40, y || 112, 1200, 90, text, { size: 50, font: 'display', color: 'head', shadow: true }); },
    kids: function (x, y, w) { w = w || 160; return { id: uid(), type: 'image', src: SCHOOL_IMG + 'students.png', x: x == null ? 961 : x, y: y == null ? 526 : y, w: w, h: Math.round(w * 414 / 560) }; },
    box: function (x, y, w, h, text, o) {
      var e = T(x, y, w, h, text, { size: 32, border: 'accent', fill: 'card', radius: 12, valign: 'middle' });
      for (var k in o) e[k] = o[k];
      return e;
    },
    conclude: function (y, text, x) {
      x = x || 40;
      var g = uid();
      return [T(x, y, 190, 80, '!!ដូចនេះ ៖!!', { size: 36, valign: 'middle', anim: g }),
              SCHOOL.box(x + 190, y - 5, 1060 - x, 90, text, { size: 34, anim: g })];
    },
    cover: function (sub, chapter, title, info) {
      var d = info || S.deck || {};
      return SCHOOL.page([
        T(75, 0, 820, 120, (d.school || '') + ' ==' + (d.school2 || '') + '==' + (d.school3 ? ' ' + d.school3 : ''), { size: 59, font: 'display', color: 'title' }),
        T(60, 175, 700, 60, sub, { size: 29, font: 'display', color: 'title' }),
        T(58, 222, 720, 95, chapter, { size: 48, font: 'display', color: '#003382' }),
        T(170, 335, 720, 210, title, { size: 102, font: 'display', color: 'brand', valign: 'middle' })
      ], { kind: 'cover' });
    },
    toc: function (items) {
      var isLong = items.length > 2;
      return SCHOOL.page([
        T(40, 110, 1200, 76, 'មាតិកាមេរៀន', { size: 50, font: 'display', color: 'head', shadow: true }),
        T(80, 205, 1120, 430, items.join('\n'), { size: isLong ? (items.length > 3 ? 36 : 40) : 48, font: 'display', color: '#00398e', lh: isLong ? '1.5' : '1.7' })
      ], { kind: 'toc' });
    },
    objective: function (items, note) {
      var els = [T(30, 100, 420, 100, 'វត្ថុបំណង', { size: 48, font: 'display', color: '#003893' }),
                 T(30, 205, 780, 90, 'ក្រោយពីសិក្សាមេរៀននេះចប់សិស្សទទួល', { size: 43, font: 'display', color: '#ff8200' }),
                 T(667, 98, 506, 71, note || 'ប្អូនៗ អាចសិក្សាបន្ថែម នៅក្នុងសៀវភៅ', { size: !note || note.length <= 40 ? 30 : note.length <= 75 ? 22 : 17, font: 'display', color: '#ffffff', align: 'center', valign: 'middle' })];
      // the artwork has room for two lines; longer lists go into one white panel so no objective is dropped
      if (items.length > 2) els.push(T(100, 300, 690, 300, items.map(function (it) { return '• ' + it; }).join('\n'),
        { size: items.length > 3 ? 22 : 25, font: 'display', color: '#002c5b', valign: 'middle', fill: '#ffffff', radius: 18 }));
      else items.forEach(function (it, i) { els.push(T(184, 322 + i * 78, 640, 70, it, { size: 30, font: 'display', color: '#002c5b', valign: 'middle' })); });
      return SCHOOL.page(els, { kind: 'goal' });
    },
    quiz: function (q, opts, ans, sec, title) {
      var keys = ['ក', 'ខ', 'គ', 'ឃ'], els = [
        T(170, 115, 600, 90, title || 'ពង្រឹងពុទ្ធិ', { size: 50, font: 'display', color: 'head', align: 'center', shadow: true }),
        T(30, 200, 720, 60, '!!ចូរគូសរង្វង់ ◯ ខាងមុខចម្លើយដែលត្រឹមត្រូវ ៖!!', { size: 30, align: 'center' }),
        T(30, 275, 740, 130, q, { size: 30 }),
        timerEl(774, 157, 439, 242, sec || 30),
        SCHOOL.kids()];
      opts.forEach(function (o, i) {
        var x = 50 + (i % 2) * 350, y = 420 + Math.floor(i / 2) * 90;
        els.push(T(x, y, 370, 76, '!!' + keys[i] + '.!!  ' + o, { size: 32, valign: 'middle' }));
        if (i === ans) els.push(shp('ellipse', x - 10, y + 8, 54, 60, { fill: 'none', stroke: 'title', sw: 3, anim: true }));
      });
      return SCHOOL.page(els);
    },
    // body: text, or a list of exercises (one per line); note: optional hint shown under the list
    homework: function (body, note) {
      var long = Array.isArray(body) || !!note;
      var text = Array.isArray(body) ? body.join('\n') : body;
      if (note) text += '\n\n💡 ' + note;
      return SCHOOL.page([T(390, 200, 500, 100, 'កិច្ចការផ្ទះ', { size: 64, font: 'display', color: 'head', align: 'center', shadow: true }),
                          SCHOOL.box(117, 290, 964, long ? 340 : 300, text, { radius: 40, size: long ? 24 : 36, bw: 3 }),
                          SCHOOL.kids(1110, 84, 150)]);
    },
    thanks: function () { return SCHOOL.page([], { kind: 'thanks' }); }
  };
  function layoutSlide(k) {
    var L = LAYOUTS[k] || LAYOUTS.content;
    return L.slide ? L.slide() : newSlide(L.make());
  }

  function questionEls(title, q, opts, ans, ansText) {
    var keys = ['ក', 'ខ', 'គ', 'ឃ', 'ង'], els = [
      T(60, 30, 1160, 90, title, { size: 42, bold: true, valign: 'middle', role: 'title' }),
      T(60, 130, 1160, 170, q, { size: 32 })];
    opts.slice(0, 4).forEach(function (o, i) {
      els.push(T(60 + (i % 2) * 590, 315 + Math.floor(i / 2) * 135, 570, 115, '**' + keys[i] + '.** ' + o,
        { size: 30, valign: 'middle', fill: 'card', radius: 16, role: 'opt' }));
    });
    var ai = keys.indexOf(ans);
    els.push(T(60, 600, 1160, 90, '✅ ចម្លើយ៖ **(' + ans + ')** ' + (ansText || (ai >= 0 && opts[ai]) || ''),
      { size: 30, bold: false, valign: 'middle', fill: 'card', radius: 16, role: 'ans', anim: true }));
    return els;
  }

  function sampleDeck() {
    var d = { id: uid(), name: 'គំរូ — ទ្រឹស្តីបទពីតាគ័រ', theme: 'ocean', updated: Date.now(), slides: [
      newSlide([T(100, 190, 1080, 170, 'ទ្រឹស្តីបទពីតាគ័រ', { size: 72, bold: true, align: 'center', valign: 'middle', role: 'title' }),
                T(100, 380, 1080, 80, 'គណិតវិទ្យា ថ្នាក់ទី ៨ · ស្លាយគំរូ', { size: 32, align: 'center', role: 'sub' }),
                T(240, 520, 800, 80, 'ចុចពីរដងលើអក្សរ ដើម្បីកែ · អូសដើម្បីផ្លាស់ទី', { size: 22, align: 'center', italic: true })]),
      newSlide([T(60, 40, 1160, 100, 'ខ្លឹមសារមេរៀន', { size: 46, bold: true, valign: 'middle', role: 'title' }),
                T(60, 160, 700, 500, '• ក្នុងត្រីកោណកែង ការេនៃអ៊ីប៉ូតេនុស ស្មើនឹងផលបូកការេនៃជ្រុងជាប់មុំកែងទាំងពីរ។\n\n$$c^2 = a^2 + b^2$$\n• ឧទាហរណ៍៖ $a = 3,\\ b = 4 \\Rightarrow c = 5$', { size: 30 }),
                { id: uid(), type: 'shape', shape: 'triangle', x: 820, y: 220, w: 360, h: 300, fill: 'card', stroke: '#ffd43b', sw: 6 },
                T(800, 540, 400, 60, '✨ ចុចដើម្បីបង្ហាញ', { size: 26, align: 'center', role: 'sub', anim: true })]),
      newSlide(questionEls('សំណួរទី ១', 'ត្រីកោណកែងមួយមានជ្រុងជាប់មុំកែង $6$ cm និង $8$ cm ។ រកអ៊ីប៉ូតេនុស។', ['$12$ cm', '$10$ cm', '$14$ cm', '$7$ cm'], 'ខ', '$10$ cm'))
    ] };
    return d;
  }

  /* ---------------- lesson import ---------------- */
  function chunks(text, max) {
    var lines = String(text || '').split('\n'), blocks = [], cur = '';
    var open = function (s) {
      return (s.split('\\[').length - s.split('\\]').length) > 0 || (s.split('$$').length - 1) % 2 === 1 ||
             (s.match(/\\begin\{/g) || []).length > (s.match(/\\end\{/g) || []).length;
    };
    lines.forEach(function (ln) { cur = cur ? cur + '\n' + ln : ln; if (!open(cur)) { blocks.push(cur); cur = ''; } });
    if (cur) blocks.push(cur);
    // display maths and line breaks take far more room than their character count
    var cost = function (b) { return b.length + 90 * (b.match(/\$\$|\\\[|\\begin\{/g) || []).length + 25 * (b.match(/\n/g) || []).length; };
    var out = [], acc = '', used = 0;
    blocks.forEach(function (b) {
      var c = cost(b) + 25;
      if (acc && used + c > max) { out.push(acc); acc = b; used = c; } else { acc = acc ? acc + '\n' + b : b; used += c; }
    });
    if (acc) out.push(acc);
    return out.map(function (s) { return s.replace(/^\s+|\s+$/g, ''); }).filter(Boolean);
  }
  function contentSlide(title, body) {
    return newSlide([T(60, 36, 1160, 100, title, { size: 44, bold: true, valign: 'middle', role: 'title' }),
                     T(60, 150, 1160, 530, body, { size: 30 })]);
  }
  function part(title, i, n) { return n > 1 ? title + ' (' + kh(i + 1) + '/' + kh(n) + ')' : title; }

  function lessonSlides(g, L, o) {
    var out = [], gname = 'ថ្នាក់ទី ' + kh(g);
    out.push(newSlide([T(100, 170, 1080, 200, 'មេរៀនទី ' + kh(L.num) + '\n' + L.title, { size: 62, bold: true, align: 'center', valign: 'middle', role: 'title' }),
                       T(100, 395, 1080, 80, gname + (L.category ? ' · ' + L.category : ''), { size: 32, align: 'center', role: 'sub' })]));
    if (o.theory) {
      var secs = L.theorySections || [];
      if (secs.length) secs.forEach(function (s) {
        var c = chunks(s.content, 640); c.forEach(function (b, i) { out.push(contentSlide(part(s.title, i, c.length), b)); });
      });
      else if (L.summary) { var c = chunks(L.summary, 640); c.forEach(function (b, i) { out.push(contentSlide(part('សេចក្តីសង្ខេប', i, c.length), b)); }); }
    }
    if (o.formulas && L.formulas && L.formulas.length) {
      for (var i = 0; i < L.formulas.length; i += 3) {
        var els = [T(60, 30, 1160, 90, part('រូបមន្តសំខាន់', i / 3, Math.ceil(L.formulas.length / 3)), { size: 42, bold: true, valign: 'middle', role: 'title' })];
        L.formulas.slice(i, i + 3).forEach(function (f, j) {
          els.push(T(60, 135 + j * 190, 1160, 175, '**' + (f.name || '') + '**\n' + (f.math || '') + (f.desc ? '\n' + f.desc : ''),
            { size: 26, align: 'center', valign: 'middle', fill: 'card', radius: 18 }));
        });
        out.push(newSlide(els));
      }
    }
    if (o.examples) (L.examples || []).forEach(function (ex, i) {
      out.push(contentSlide(ex.title || 'ឧទាហរណ៍ទី ' + kh(i + 1), ex.question || ''));
      var c = chunks(ex.solution, 640);
      c.forEach(function (b, j) { out.push(contentSlide(part('✍️ ដំណោះស្រាយ', j, c.length), b)); });
    });
    if (o.q > 0) {
      var bank = (window.MATH_DATA && MATH_DATA.questionBank) || [];
      var pre = 'q_g' + (g < 10 ? '0' : '') + g + '_c' + (L.num < 10 ? '0' : '') + L.num + '_';
      var qs = bank.filter(function (q) { return q.options && q.options.length >= 2 && q.id && q.id.indexOf(pre) === 0; });
      if (!qs.length) qs = bank.filter(function (q) { return q.options && q.grade == g && String(q.chapter || '').indexOf(L.title) >= 0; });
      qs.slice(0, o.q).forEach(function (q, k) {
        var opt = q.options.map(function (x) { return x.text; }), ai = -1;
        q.options.forEach(function (x, j) { if (x.key === q.answer) ai = j; });
        out.push(newSlide(questionEls('សំណួរទី ' + kh(k + 1), q.question, opt, q.answer, ai >= 0 ? opt[ai] : '')));
      });
    }
    out.push(newSlide([T(100, 230, 1080, 150, 'សូមអរគុណ! 🙏', { size: 72, bold: true, align: 'center', valign: 'middle', role: 'title' }),
                       T(100, 400, 1080, 80, 'មានសំណួរ ឬចម្ងល់ទេ?', { size: 34, align: 'center', role: 'sub' })]));
    return out;
  }

  function openLessonDialog() {
    var D = window.MATH_DATA;
    if (!D || !D.lessons) { alert('រកមិនឃើញទិន្នន័យមេរៀន (math_data.js)'); return; }
    var grades = Object.keys(D.lessons).sort(function (a, b) { return a - b; });
    var bg = document.createElement('div');
    bg.className = 'sl-modal-bg';
    bg.innerHTML = '<div class="sl-modal"><h3>📚 បង្កើតស្លាយពីមេរៀន</h3>' +
      '<label>ថ្នាក់<select id="sl-li-g">' + grades.map(function (g) { return '<option value="' + g + '">ថ្នាក់ទី ' + kh(g) + '</option>'; }).join('') + '</select></label>' +
      '<label>មេរៀន<select id="sl-li-l"></select></label>' +
      '<div class="sl-checks"><label><input type="checkbox" id="sl-li-t" checked> ទ្រឹស្តី</label>' +
      '<label><input type="checkbox" id="sl-li-f" checked> រូបមន្ត</label>' +
      '<label><input type="checkbox" id="sl-li-e" checked> ឧទាហរណ៍ + ដំណោះស្រាយ</label>' +
      '<label>សំណួរ MCQ <input type="number" id="sl-li-q" value="5" min="0" max="30" style="width:60px"></label></div>' +
      '<div class="sl-checks"><label><input type="radio" name="sl-li-m" value="new" checked> ឯកសារថ្មី</label>' +
      '<label><input type="radio" name="sl-li-m" value="append"> បន្ថែមក្រោយស្លាយបច្ចុប្បន្ន</label></div>' +
      '<div class="sl-modal-foot"><button class="sl-btn" data-x="cancel">បោះបង់</button><button class="sl-btn sl-primary" data-x="ok">បង្កើតស្លាយ ➔</button></div></div>';
    document.body.appendChild(bg);
    var gs = bg.querySelector('#sl-li-g'), ls = bg.querySelector('#sl-li-l');
    var fill = function () {
      ls.innerHTML = (D.lessons[gs.value] || []).map(function (L, i) { return '<option value="' + i + '">មេរៀនទី ' + kh(L.num) + ' · ' + esc(L.title) + '</option>'; }).join('');
    };
    var cg = typeof currentGrade !== 'undefined' ? currentGrade : null; // studio.html global
    if (cg && D.lessons[cg]) gs.value = String(cg);
    fill(); gs.onchange = fill;
    bg.addEventListener('click', function (e) {
      var x = e.target.getAttribute('data-x');
      if (e.target === bg || x === 'cancel') { bg.remove(); return; }
      if (x !== 'ok') return;
      var g = +gs.value, L = D.lessons[gs.value][+ls.value];
      if (!L) return;
      var made = lessonSlides(g, L, { theory: bg.querySelector('#sl-li-t').checked, formulas: bg.querySelector('#sl-li-f').checked,
                                      examples: bg.querySelector('#sl-li-e').checked, q: Math.max(0, +bg.querySelector('#sl-li-q').value || 0) });
      var mode = bg.querySelector('input[name="sl-li-m"]:checked').value;
      bg.remove(); commitEdit();
      if (mode === 'new') addDeck({ id: uid(), name: 'ថ្នាក់ទី ' + kh(g) + ' · មេរៀនទី ' + kh(L.num) + ' ' + L.title, theme: S.deck ? S.deck.theme : 'ocean', updated: Date.now(), slides: made });
      else { pushUndo(); Array.prototype.splice.apply(S.deck.slides, [S.cur + 1, 0].concat(made)); S.cur++; S.sel = null; }
      renderAll(); save();
      status('✓ បានបង្កើត ' + kh(made.length) + ' ស្លាយ');
    });
  }

  /* ---------------- UI build ---------------- */
  function b(act, ic, label, o) {
    o = o || {};
    return '<button class="sl-btn' + (o.big ? ' big' : '') + (o.cls ? ' ' + o.cls : '') + '" data-act="' + act + '"' + (o.v ? ' data-v="' + o.v + '"' : '') +
           ' title="' + esc(o.title || label) + '"><span class="ic">' + ic + '</span>' + (label ? '<span>' + label + '</span>' : '') + '</button>';
  }
  function grp(label, body, ctx) { return '<div class="sl-grp' + (ctx ? ' sl-ctx' : '') + '"><div class="sl-grp-body">' + body + '</div><div class="sl-grp-label">' + label + '</div></div>'; }
  function colorIn(prop, title) { return '<label class="sl-color" title="' + title + '"><input type="color" data-prop="' + prop + '"><span>' + title + '</span></label>'; }

  var PANELS = {
    home: function () {
      return grp('ស្លាយ', b('new', '➕', 'ស្លាយថ្មី ▾', { big: true }) + '<div class="sl-col">' + b('dup-slide', '📑', 'ចម្លង') + b('del-slide', '🗑', 'លុប') + '</div>') +
        grp('អក្សរ', b('size-dn', 'A−', '', { title: 'បន្ថយទំហំ' }) + '<input class="sl-num" type="number" min="8" max="200" data-prop="size" title="ទំហំអក្សរ">' +
          b('size-up', 'A+', '', { title: 'បង្កើនទំហំ' }) + b('bold', '<b>B</b>', '', { title: 'ដិត (Ctrl+B)' }) + b('italic', '<i>I</i>', '', { title: 'ទ្រេត (Ctrl+I)' }) +
          colorIn('color', 'ពណ៌អក្សរ'), true) +
        grp('តម្រឹម', b('align', '⇤', '', { v: 'left', title: 'ឆ្វេង' }) + b('align', '↔', '', { v: 'center', title: 'កណ្តាល' }) + b('align', '⇥', '', { v: 'right', title: 'ស្តាំ' }) +
          '<span class="sl-sep"></span>' + b('valign', '⤒', '', { v: 'top', title: 'ខាងលើ' }) + b('valign', '⇕', '', { v: 'middle', title: 'កណ្តាលបញ្ឈរ' }) + b('valign', '⤓', '', { v: 'bottom', title: 'ខាងក្រោម' }), true) +
        grp('រូបរាង', colorIn('fill', 'ផ្ទៃ') + b('nofill', '⊘', '', { title: 'គ្មានផ្ទៃ' }) + b('border', '▢', 'ស៊ុម', { title: 'ស៊ុមក្រហមជុំវិញប្រអប់អក្សរ' }) + colorIn('stroke', 'បន្ទាត់') +
          '<select class="sl-sel-in" data-prop="sw" title="កម្រាស់បន្ទាត់"><option value="0">0</option><option value="2">2</option><option value="4">4</option><option value="6">6</option><option value="10">10</option><option value="16">16</option></select>' +
          '<input class="sl-num" type="number" step="15" data-prop="rot" title="បង្វិល (ដឺក្រេ)" placeholder="°">', true) +
        grp('ចលនា', b('anim', '✨', 'បង្ហាញពេលចុច', { title: 'ធាតុនេះលាក់ ហើយបង្ហាញនៅពេលចុចក្នុងពេលបញ្ចាំង' }), true) +
        grp('រៀបចំ', b('front', '⬆', 'មុខ', { title: 'នាំមកមុខ' }) + b('back', '⬇', 'ក្រោយ', { title: 'បញ្ជូនទៅក្រោយ' }) +
          b('dup-el', '⧉', 'ចម្លង', { title: 'ចម្លងធាតុ (Ctrl+D)' }) + b('del-el', '✕', 'លុប', { title: 'លុបធាតុ (Delete)' }), true) +
        grp('កែ', b('undo', '↶', '', { title: 'ថយក្រោយ (Ctrl+Z)' }) + b('redo', '↷', '', { title: 'ធ្វើវិញ (Ctrl+Y)' }));
    },
    insert: function () {
      return grp('អត្ថបទ', b('ins-text', '🅣', 'ប្រអប់អក្សរ', { big: true }) + b('ins-title', '🔠', 'ចំណងជើង', { big: true }) + b('ins-math', '∑', 'រូបមន្ត', { big: true })) +
        grp('រូបភាព', b('ins-img', '🖼', 'រូបភាព', { big: true, title: 'បញ្ចូលរូបភាព (ឬ Ctrl+V បិទភ្ជាប់)' })) +
        grp('រាង', b('ins-shape', '▭', '', { v: 'rect', title: 'ចតុកោណ' }) + b('ins-shape', '▢', '', { v: 'round', title: 'ចតុកោណជ្រុងមូល' }) +
          b('ins-shape', '◯', '', { v: 'ellipse', title: 'រង្វង់ / អេលីប' }) + b('ins-shape', '△', '', { v: 'triangle', title: 'ត្រីកោណ' }) +
          b('ins-shape', '─', '', { v: 'line', title: 'បន្ទាត់' }) + b('ins-shape', '➜', '', { v: 'arrow', title: 'ព្រួញ' })) +
        grp('ឧបករណ៍', b('ins-timer', '⏱', 'នាឡិការាប់ថយ', { big: true, title: 'នាឡិការាប់ថយក្រោយ — ចុចលើវាពេលបញ្ចាំងដើម្បីចាប់ផ្តើម (ចុចពីរដងដើម្បីប្តូរវិនាទី)' })) +
        grp('មេរៀន', b('tpl', '🏫', 'គំរូមេរៀន ▾', { big: true, title: 'បទបង្ហាញគំរូដែលរៀបចំរួច' }) + b('lesson', '📚', 'បង្កើតពីមេរៀន', { big: true, title: 'បង្កើតស្លាយដោយស្វ័យប្រវត្តិពីមេរៀន និងធនាគារសំណួរ' }) +
          b('add-layout', '❓', 'ស្លាយសំណួរ', { big: true, v: 'question' }) + b('add-layout', '∑', 'ស្លាយរូបមន្ត', { big: true, v: 'formula' }));
    },
    design: function () {
      var cards = Object.keys(THEMES).map(function (k) {
        var t = THEMES[k];
        return '<button class="sl-theme" data-act="theme" data-v="' + k + '" title="' + t.name + '"><span class="sl-theme-sw" style="background:' + t.bg + '">' +
               '<b style="color:' + t.title + '">Aa</b><i style="background:' + t.accent + '"></i></span><span>' + t.name + '</span></button>';
      }).join('');
      return grp('ប្រធានបទ (Theme)', cards) +
        grp('ផ្ទៃស្លាយ', colorIn('bg', 'ពណ៌ផ្ទៃ') + '<div class="sl-col">' + b('bg-all', '🎨', 'អនុវត្តគ្រប់ស្លាយ') + b('bg-reset', '↺', 'តាមប្រធានបទ') + '</div>') +
        grp('ក្បាល / ជើងស្លាយ (គំរូសាលា)', '<div class="sl-col"><input class="sl-name" data-prop="school" placeholder="ឈ្មោះសាលា (ពណ៌ខៀវ)">' +
          '<input class="sl-name" data-prop="school2" placeholder="ឈ្មោះសាលា (ពណ៌ទឹកក្រូច)"><input class="sl-name" data-prop="school3" placeholder="ឧ. (NGS)"></div><div class="sl-col"><input class="sl-name" data-prop="teacher" placeholder="បង្រៀនដោយ លោកគ្រូ ...">' +
          b('plain', '🚫', 'លាក់ក្បាល/ជើងស្លាយនេះ') + '</div>');
    },
    show: function () {
      return grp('ចាប់ផ្តើម', b('show-start', '▶', 'ពីដើម (F5)', { big: true }) + b('show-cur', '▷', 'ពីស្លាយនេះ', { big: true, title: 'Shift+F5' })) +
        grp('គន្លឹះពេលបញ្ចាំង', '<div class="sl-tips">→ / Space / ចុច៖ បន្ទាប់ · ←៖ ថយក្រោយ<br>P៖ ប៊ិចគូស · E៖ លុបគំនូរ · B៖ អេក្រង់ខ្មៅ · Esc៖ ចេញ</div>');
    },
    file: function () {
      return grp('បទបង្ហាញ', '<select class="sl-sel-in sl-deck" data-prop="deck" title="ជ្រើសឯកសារ"></select>' +
          '<input class="sl-name" data-prop="deckname" placeholder="ឈ្មោះបទបង្ហាញ">' + b('new-deck', '🆕', 'ថ្មី') + b('del-deck', '🗑', 'លុប')) +
        grp('នាំចេញ / នាំចូល', b('export', '💾', 'រក្សាទុក .json', { big: true, title: 'ទាញយកជាឯកសារ ដើម្បីរក្សាទុក ឬចែករំលែក' }) +
          b('import', '📂', 'បើក .json', { big: true }) + b('print', '🖨', 'បោះពុម្ព / PDF', { big: true, title: 'ជ្រើស «Save as PDF» ក្នុងប្រអប់បោះពុម្ព' }));
    }
  };

  function build() {
    root = document.getElementById('view-slides');
    root.innerHTML =
      '<div class="sl-app">' +
        '<div class="sl-tabs">' +
          ['home:ទំព័រដើម', 'insert:បញ្ចូល', 'design:រចនា', 'show:បញ្ចាំង', 'file:ឯកសារ'].map(function (s) {
            s = s.split(':'); return '<button class="sl-tab" data-tab="' + s[0] + '">' + s[1] + '</button>';
          }).join('') +
          '<div class="sl-tabs-r">' +
          '<label class="sl-track-label" id="sl-track-wrap" style="display:none;align-items:center;gap:6px;color:#fff;font-size:12px;font-weight:600;">' +
          '<span style="white-space:nowrap">📚 ផ្នែក៖</span>' +
          '<select class="sl-sel-in sl-top-track" title="ជ្រើសរើសផ្នែក" style="background:#ffffff;color:#002060;font-weight:700;font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid #ced4da;cursor:pointer;outline:none;">' +
          '<option value="all">ទាំងអស់</option>' +
          '<option value="sc1">វិទ្យាសាស្ត្រភាគ១</option>' +
          '<option value="sc2">វិទ្យាសាស្ត្រភាគ២</option>' +
          '<option value="ss">វិទ្យាសាស្ត្រសង្គម</option>' +
          '</select>' +
          '</label>' +
          '<label class="sl-deck-picker-label" style="display:inline-flex;align-items:center;gap:6px;color:#fff;font-size:12px;font-weight:600;">' +
          '<span style="white-space:nowrap">📖 មេរៀន៖</span>' +
          '<select class="sl-sel-in sl-top-deck" data-prop="deck" title="ជ្រើសរើសជំពូក និងមេរៀន" style="background:#ffffff;color:#002060;font-weight:700;font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid #ced4da;max-width:320px;cursor:pointer;outline:none;"></select>' +
          '</label>' +
          '<label class="sl-section-picker-label" style="display:inline-flex;align-items:center;gap:6px;color:#fff;font-size:12px;font-weight:600;">' +
          '<span style="white-space:nowrap">📑 ចំណុច៖</span>' +
          '<select class="sl-sel-in sl-top-section" title="រំលងទៅចំណុចតូចក្នុងមេរៀន" style="background:#ffffff;color:#002060;font-weight:700;font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid #ced4da;max-width:280px;cursor:pointer;outline:none;"></select>' +
          '</label>' +
          '<button class="sl-btn-reload" data-act="reload-tpl" title="ផ្ទុកមេរៀនទាំងអស់ឡើងវិញ (Reload all lesson decks)" style="background:#495057;color:#fff;font-weight:700;font-size:12px;padding:4px 10px;border-radius:8px;border:none;cursor:pointer;white-space:nowrap;">🔄 ផ្ទុកមេរៀន</button>' +
          '<span class="sl-title" style="display:none"></span>' +
          '<button class="sl-dl" data-act="download" title="ទាញយកមេរៀននេះជា PowerPoint, LaTeX Beamer ឬ PDF" style="display:none">⬇ ទាញយក</button>' +
          '<button class="sl-play" data-act="show-cur" title="បញ្ចាំងពីស្លាយនេះ">▶ បញ្ចាំង</button></div>' +
        '</div>' +
        '<div class="sl-ribbon"></div>' +
        '<div class="sl-body">' +
          '<div class="sl-thumbs"></div>' +
          '<div class="sl-center"><div class="sl-wrap"><div class="sl-holder"><div class="sl-stage sl-edit-stage"></div></div></div>' +
            '<textarea class="sl-notes" placeholder="កំណត់ចំណាំគ្រូ (Speaker notes) — មិនបង្ហាញពេលបញ្ចាំង"></textarea>' +
            '<div class="sl-status"><span class="sl-count"></span><span class="sl-st"></span></div></div>' +
        '</div>' +
        '<input type="file" accept="image/*" class="sl-f-img" hidden><input type="file" accept=".json,application/json" class="sl-f-json" hidden>' +
      '</div>';
    stage = root.querySelector('.sl-edit-stage'); holder = root.querySelector('.sl-holder'); wrap = root.querySelector('.sl-wrap');
    thumbs = root.querySelector('.sl-thumbs'); ribbon = root.querySelector('.sl-ribbon'); notes = root.querySelector('.sl-notes');
    statusEl = root.querySelector('.sl-st');

    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);
    stage.addEventListener('pointerdown', onStageDown);
    stage.addEventListener('dblclick', function (e) {
      if (e.target.closest('textarea')) return;
      var d = e.target.closest('.sl-el'); if (!d) return;
      if (d.classList.contains('sl-timer')) {
        var el = selEl(), v = el && prompt('ចំនួនវិនាទី', el.sec);
        if (v && +v > 0) setProp('sec', Math.round(+v));
        return;
      }
      startEdit(d.dataset.id);
    });
    notes.addEventListener('input', function () { pushUndo('notes'); slide().notes = notes.value; save(); });
    root.querySelector('.sl-f-img').addEventListener('change', function (e) { if (e.target.files[0]) addImageFile(e.target.files[0]); e.target.value = ''; });
    root.querySelector('.sl-f-json').addEventListener('change', function (e) { if (e.target.files[0]) importJSON(e.target.files[0]); e.target.value = ''; });
    thumbs.addEventListener('click', function (e) {
      var badge = e.target.closest('.sl-th-sec-badge');
      if (badge && badge.dataset.jump) { goSlide(+badge.dataset.jump); return; }
      var t = e.target.closest('.sl-th');
      if (t) goSlide(+t.dataset.i);
    });
    thumbs.addEventListener('dragstart', function (e) { var t = e.target.closest('.sl-th'); if (t) { e.dataTransfer.setData('text/plain', t.dataset.i); e.dataTransfer.effectAllowed = 'move'; } });
    thumbs.addEventListener('dragover', function (e) { if (e.target.closest('.sl-th')) e.preventDefault(); });
    thumbs.addEventListener('drop', function (e) {
      var t = e.target.closest('.sl-th'); if (!t) return; e.preventDefault();
      var from = +e.dataTransfer.getData('text/plain'), to = +t.dataset.i;
      if (isNaN(from) || from === to) return;
      commitEdit(); pushUndo();
      var s = S.deck.slides.splice(from, 1)[0]; S.deck.slides.splice(to, 0, s); S.cur = to; S.sel = null;
      renderAll(); save();
    });
    document.addEventListener('keydown', onKey);
    document.addEventListener('paste', onPaste);
    document.addEventListener('pointerdown', function (e) { if (!e.target.closest('.sl-menu') && !e.target.closest('[data-act="new"],[data-act="tpl"]')) closeMenu(); });
    if (window.ResizeObserver) new ResizeObserver(fitStage).observe(wrap); else window.addEventListener('resize', fitStage);
    S.built = true;
  }

  function setTab(t) {
    S.tab = t;
    root.querySelectorAll('.sl-tab').forEach(function (x) { x.classList.toggle('on', x.dataset.tab === t); });
    ribbon.innerHTML = PANELS[t]();
    syncRibbon();
  }

  function fitStage() {
    if (!wrap || !wrap.clientWidth) return;
    var s = Math.max(0.1, Math.min((wrap.clientWidth - 40) / W, (wrap.clientHeight - 40) / H));
    S.scale = s;
    holder.style.width = W * s + 'px'; holder.style.height = H * s + 'px';
    stage.style.transform = 'scale(' + s + ')';
    stage.style.setProperty('--hs', (13 / s) + 'px');
  }

  /* ---------------- rendering ---------------- */
  function renderAll() { renderThumbs(); renderStage(); syncRibbon(); }
  function renderThumbs() {
    var sections = getDeckSections(S.deck);
    var secMap = {};
    sections.forEach(function (sec) { secMap[sec.slide] = sec.title; });

    var html = '';
    S.deck.slides.forEach(function (s, i) {
      if (secMap[i] && i > 0) {
        html += '<div class="sl-th-sec-badge" data-jump="' + i + '" title="រំលងទៅ ' + esc(secMap[i]) + '">' +
                '<span class="sl-sec-icon">📑</span><span class="sl-sec-txt">' + esc(secMap[i]) + '</span></div>';
      }
      html += '<div class="sl-th' + (i === S.cur ? ' on' : '') + '" data-i="' + i + '" draggable="true"><span class="sl-th-n">' + kh(i + 1) + '</span>' +
             '<div class="sl-th-box"><div class="sl-stage"></div></div></div>';
    });
    thumbs.innerHTML = html;
    thumbs.querySelectorAll('.sl-th').forEach(function (t, i) { paint(S.deck.slides[i], t.querySelector('.sl-stage'), 'thumb', i); });
  }
  function renderThumb(i) {
    var t = thumbs.querySelector('.sl-th[data-i="' + i + '"]');
    if (t && S.deck.slides[i]) paint(S.deck.slides[i], t.querySelector('.sl-stage'), 'thumb', i);
  }
  function renderStage() {
    var sl = slide();
    paint(sl, stage, 'edit', S.cur);
    drawSel();
    if (document.activeElement !== notes) notes.value = sl.notes || '';
    root.querySelector('.sl-count').textContent = 'ស្លាយ ' + kh(S.cur + 1) + ' / ' + kh(S.deck.slides.length);
    root.querySelector('.sl-title').textContent = S.deck.name;
  }
  function drawSel() {
    stage.querySelectorAll('.sl-sel').forEach(function (x) { x.remove(); });
    var el = selEl(); if (!el) return;
    var box = document.createElement('div');
    box.className = 'sl-sel';
    box.innerHTML = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(function (d) { return '<i class="sl-h sl-h-' + d + '" data-dir="' + d + '"></i>'; }).join('');
    place(box, el);
    stage.appendChild(box);
  }
  function goSlide(i) {
    commitEdit();
    S.cur = Math.max(0, Math.min(S.deck.slides.length - 1, i)); S.sel = null;
    thumbs.querySelectorAll('.sl-th').forEach(function (t) { t.classList.toggle('on', +t.dataset.i === S.cur); });
    var on = thumbs.querySelector('.sl-th.on'); if (on) on.scrollIntoView({ block: 'nearest' });
    renderStage(); syncRibbon();
  }

  function syncRibbon() {
    var dl = root && root.querySelector('.sl-dl');
    if (dl) dl.style.display = canDownload(S.deck) ? '' : 'none';
    if (!ribbon) return;
    var el = selEl();
    ribbon.classList.toggle('sl-nosel', !el);
    var q = function (s) { return ribbon.querySelector(s); };
    ribbon.querySelectorAll('[data-act="align"],[data-act="valign"]').forEach(function (x) { x.classList.toggle('on', !!el && el[x.dataset.act] === x.dataset.v); });
    ribbon.querySelectorAll('[data-act="theme"]').forEach(function (x) { x.classList.toggle('on', x.dataset.v === S.deck.theme); });
    var tog = function (a, v) { var x = q('[data-act="' + a + '"]'); if (x) x.classList.toggle('on', !!v); };
    tog('bold', el && el.bold); tog('italic', el && el.italic); tog('anim', el && el.anim); tog('border', el && el.border); tog('plain', slide().plain);
    var set = function (p, v) { var x = q('[data-prop="' + p + '"]'); if (x && document.activeElement !== x) x.value = v; };
    if (el) {
      set('size', el.size || '');
      set('color', hexOr(el.color || roleColor(el.role), '#000000'));
      set('fill', hexOr(resolveFill(el.fill) || (el.type === 'shape' ? th().accent : ''), '#ffffff'));
      set('stroke', hexOr(el.stroke || th().accent, '#000000'));
      set('sw', String(el.sw != null ? el.sw : (el.shape === 'line' || el.shape === 'arrow' ? 6 : 0)));
      set('rot', el.rot || 0);
    }
    set('bg', hexOr(slide().bg, '#ffffff'));
    set('school', S.deck.school || ''); set('school2', S.deck.school2 || ''); set('school3', S.deck.school3 || ''); set('teacher', S.deck.teacher || '');
    var activeG = getActiveGrade();
    var trackWrap = root ? (root.querySelector('#sl-track-wrap') || root.querySelector('#sl-g11-track-wrap')) : null;
    if (trackWrap) {
      if (activeG === '11' || activeG === '12') {
        trackWrap.style.display = 'inline-flex';
        var trkSel = trackWrap.querySelector('.sl-top-track, .sl-top-g11-track');
        var curPart = (activeG === '11') ? (S.activeG11Part || 'all') : (S.activeG12Part || 'all');
        if (trkSel) trkSel.value = curPart;
      } else {
        trackWrap.style.display = 'none';
      }
    }

    var dsList = root ? root.querySelectorAll('[data-prop="deck"]') : [];
    if (dsList.length) {
      var allDeckKeys = Object.keys(S.store.decks);
      var deckKeys = allDeckKeys;
      if (activeG && activeG !== 'all') {
        var filteredKeys = allDeckKeys.filter(function (k) {
          var d = S.store.decks[k];
          if (getDeckGrade(d) !== activeG) return false;
          if (activeG === '11' && S.activeG11Part && S.activeG11Part !== 'all') {
            return d.part === S.activeG11Part;
          }
          if (activeG === '12' && S.activeG12Part && S.activeG12Part !== 'all') {
            return d.part === S.activeG12Part;
          }
          return true;
        });
        if (filteredKeys.length > 0) {
          deckKeys = filteredKeys;
        }
      }

      // If active deck does not match current grade/track filter, auto-switch to first valid deck!
      if (S.deck && deckKeys.indexOf(S.deck.id) === -1) {
        if (deckKeys.length > 0) {
          S.deck = S.store.decks[deckKeys[0]];
          S.store.current = S.deck.id;
          S.cur = 0;
          renderAll();
          return;
        } else {
          deckKeys.unshift(S.deck.id);
        }
      }

      function getPartWeight(d) {
        var part = d.part || '';
        if (part === 'sc1') return 1000;
        if (part === 'sc2') return 2000;
        if (part === 'ss') return 3000;
        var s = (d.chapter || '') + ' ' + (d.name || '');
        if (s.indexOf('វិទ្យាសាស្ត្រភាគ១') !== -1 || s.indexOf('ភាគ១') !== -1 || s.indexOf('ភាគ 1') !== -1) return 1000;
        if (s.indexOf('វិទ្យាសាស្ត្រភាគ២') !== -1 || s.indexOf('ភាគ២') !== -1 || s.indexOf('ភាគ 2') !== -1) return 2000;
        if (s.indexOf('វិទ្យាសាស្ត្រសង្គម') !== -1 || s.indexOf('សង្គម') !== -1) return 3000;
        return 4000;
      }

      function getCleanLessonTitle(d) {
        var s = d.lessonTitle || '';
        if (!s && d.lesson) {
          var parts = d.lesson.split('៖');
          if (parts.length > 1) s = parts.slice(1).join('៖').trim();
          else s = d.lesson.trim();
        }
        if (!s && d.name) {
          s = d.name;
          s = s.replace(/\s*\([\d០-៩]+\s*ស្លាយ\)/, '');
          s = s.replace(/^ថ្នាក់ទី\s*[\d០-៩]+(?:\s*\([^)]+\))?\s*[·:\-]?\s*/, '');
          s = s.replace(/^ជំពូក\s*[\d០-៩]+\s*[·:\-]?\s*/, '');
          s = s.replace(/^មេរៀនទី\s*[\d០-៩]+\s*[·:\-]?\s*/, '');
          s = s.trim();
        }
        return s || d.name || 'មេរៀន';
      }

      function getSlideCount(d) {
        if (d.slides && d.slides.length) return d.slides.length;
        if (d.name) {
          var m = d.name.match(/\(([\d០-៩]+)\s*ស្លាយ\)/);
          if (m) return m[1];
        }
        return 0;
      }

      var groups = {};
      var chapterKeys = [];
      deckKeys.forEach(function (k) {
        var d = S.store.decks[k];
        deckDefaults(d);
        var pWeight = getPartWeight(d);
        var chNum = (d.chapterNum != null ? d.chapterNum : 99);
        var ch = d.chapter || 'បទបង្ហាញផ្សេងៗ';
        // Unique group key: book weight + chapter
        var grpId = pWeight + '___' + ch;

        if (!groups[grpId]) {
          var grpOrder = pWeight + chNum;
          var label = ch;

          if (activeG === '11') {
            var prefix = '';
            if (pWeight === 1000) prefix = '📗 វិទ្យាសាស្ត្រភាគ១ · ';
            else if (pWeight === 2000) prefix = '📘 វិទ្យាសាស្ត្រភាគ២ · ';
            else if (pWeight === 3000) prefix = '📙 វិទ្យាសាស្ត្រសង្គម · ';

            var chClean = ch.replace(/^វិទ្យាសាស្ត្រភាគ[១២12]\s*·\s*/, '')
                            .replace(/^វិទ្យាសាស្ត្រសង្គម\s*·\s*/, '');
            if (S.activeG11Part && S.activeG11Part !== 'all') {
              label = chClean;
            } else {
              label = prefix + chClean;
            }
          }

          groups[grpId] = {
            id: grpId,
            name: label,
            order: grpOrder,
            decks: []
          };
          chapterKeys.push(grpId);
        }
        groups[grpId].decks.push(d);
      });

      chapterKeys.sort(function (a, b) {
        if (groups[a].order !== groups[b].order) return groups[a].order - groups[b].order;
        return groups[a].name.localeCompare(groups[b].name, 'km');
      });

      var opts = '';
      chapterKeys.forEach(function (grpId) {
        var grp = groups[grpId];
        grp.decks.sort(function (a, b) {
          if (a.lessonNum != null && b.lessonNum != null && a.lessonNum !== b.lessonNum) {
            return a.lessonNum - b.lessonNum;
          }
          return (a.name || '').localeCompare(b.name || '', 'km');
        });

        opts += '<optgroup label="' + esc(grp.name) + '">';
        grp.decks.forEach(function (d) {
          var sel = (d.id === S.deck.id ? ' selected' : '');
          var cTitle = getCleanLessonTitle(d);
          var sCount = getSlideCount(d);
          var countStr = sCount ? ' (' + kh(sCount) + ' ស្លាយ)' : '';

          var optText = '';
          if (activeG === '11') {
            var pw = getPartWeight(d);
            var bTag = '';
            if (!S.activeG11Part || S.activeG11Part === 'all') {
              if (pw === 1000) bTag = '[ភាគ១] ';
              else if (pw === 2000) bTag = '[ភាគ២] ';
              else if (pw === 3000) bTag = '[សង្គម] ';
            }
            var chTag = (d.chapterNum != null) ? 'ជំពូក' + kh(d.chapterNum) + ' · ' : '';
            var lesTag = (d.lessonNum != null) ? 'មេរៀនទី' + kh(d.lessonNum) + ' ៖ ' : '';
            optText = bTag + chTag + lesTag + cTitle + countStr;
          } else {
            optText = d.name;
          }
          opts += '<option value="' + d.id + '"' + sel + '>' + esc(optText) + '</option>';
        });
        opts += '</optgroup>';
      });

      dsList.forEach(function (ds) { ds.innerHTML = opts; ds.value = S.deck.id; });
      set('deckname', S.deck.name);
    }

    var secList = root ? root.querySelectorAll('.sl-top-section') : [];
    if (secList.length) {
      var sections = getDeckSections(S.deck);
      var curSecSlide = 0;
      var secOpts = '';
      if (!sections.length) {
        secOpts = '<option value="0">ស្លាយ ១</option>';
      } else {
        for (var sIdx = 0; sIdx < sections.length; sIdx++) {
          if (S.cur >= sections[sIdx].slide) curSecSlide = sections[sIdx].slide;
        }
        secOpts = sections.map(function (sec) {
          var sel = (sec.slide === curSecSlide) ? ' selected' : '';
          return '<option value="' + sec.slide + '"' + sel + '>' + esc(sec.title) + ' (ស្លាយ ' + kh(sec.slide + 1) + ')</option>';
        }).join('');
      }
      secList.forEach(function (slSel) {
        slSel.innerHTML = secOpts;
        slSel.value = String(curSecSlide);
      });
    }
  }

  /* ---------------- menus ---------------- */
  function closeMenu() { var m = document.querySelector('.sl-menu'); if (m) m.remove(); }
  function layoutMenu(btn) {
    if (document.querySelector('.sl-menu')) { closeMenu(); return; }
    var m = document.createElement('div'); m.className = 'sl-menu';
    m.innerHTML = Object.keys(LAYOUTS).map(function (k) { return '<button data-act="add-layout" data-v="' + k + '">' + LAYOUTS[k].name + '</button>'; }).join('');
    var r = btn.getBoundingClientRect();
    m.style.left = r.left + 'px'; m.style.top = r.bottom + 4 + 'px';
    m.addEventListener('click', function (e) { var x = e.target.closest('[data-act]'); if (x) { addSlide(x.dataset.v); closeMenu(); } });
    document.body.appendChild(m);
  }

  // downloads are switched on grade by grade, once that grade's decks have been reviewed
  var DOWNLOAD_GRADES = ['7', '8'];
  function canDownload(d) { return !!d && DOWNLOAD_GRADES.indexOf(getDeckGrade(d)) >= 0; }
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      if (document.querySelector('script[data-src="' + src + '"]')) return ok();
      var s = document.createElement('script'); s.src = src; s.dataset.src = src;
      s.onload = ok; s.onerror = function () { fail(new Error('មិនអាចផ្ទុក ' + src)); };
      document.head.appendChild(s);
    });
  }
  function downloadMenu(btn) {
    if (document.querySelector('.sl-menu')) { closeMenu(); return; }
    var m = document.createElement('div'); m.className = 'sl-menu';
    m.innerHTML = '<button data-v="pptx">📊 PowerPoint (.pptx) — អក្សរកែបាន</button>' +
      '<button data-v="beamer">📄 LaTeX Beamer (.zip) — XeLaTeX</button>' +
      '<button data-v="pdf">🖨 PDF — ជ្រើស «Save as PDF»</button>';
    var r = btn.getBoundingClientRect();
    m.style.left = Math.max(8, r.right - 300) + 'px'; m.style.top = r.bottom + 4 + 'px';
    m.addEventListener('click', function (e) {
      var x = e.target.closest('[data-v]'); if (!x) return;
      closeMenu(); commitEdit();
      if (x.dataset.v === 'pdf') { printDeck(); return; }
      loadScript('static/js/slides_export.js?v=1').then(function () {
        return window.KPSlidesExport[x.dataset.v](S.deck, { paint: paint, W: W, H: H, status: status });
      }).catch(function (err) { alert('ទាញយកមិនបានទេ ៖ ' + err.message); });
    });
    document.body.appendChild(m);
  }

  function templateMenu(btn) {
    if (document.querySelector('.sl-menu')) { closeMenu(); return; }
    var list = window.KPSlideTemplates || [];
    var m = document.createElement('div'); m.className = 'sl-menu';
    m.style.maxHeight = '420px';
    m.style.display = 'flex';
    m.style.flexDirection = 'column';

    var curG = getActiveGrade();
    var defaultFilter = 'all';
    if (curG === '11') {
      var curP = S.activeG11Part || 'all';
      defaultFilter = curP !== 'all' ? ('11-' + curP) : '11-all';
    } else if (curG === '12') {
      var curP = S.activeG12Part || 'all';
      defaultFilter = curP !== 'all' ? ('12-' + curP) : '12-all';
    } else if (curG && curG !== 'all') {
      defaultFilter = curG;
    }

    var filterHeader = document.createElement('div');
    filterHeader.style.padding = '6px 10px';
    filterHeader.style.borderBottom = '1px solid #e9ecef';
    filterHeader.style.background = '#f8f9fa';
    filterHeader.innerHTML = '<select class="sl-tpl-filter" style="width:100%;font-size:12px;font-weight:700;padding:4px 8px;border-radius:6px;border:1px solid #ced4da;color:#002060;outline:none;cursor:pointer;">' +
      '<option value="all">គ្រប់គំរូទាំងអស់ (' + kh(list.length) + ' គំរូ)</option>' +
      '<option value="7">ថ្នាក់ទី ៧</option>' +
      '<option value="8">ថ្នាក់ទី ៨</option>' +
      '<option value="9">ថ្នាក់ទី ៩</option>' +
      '<option value="10">ថ្នាក់ទី ១០</option>' +
      '<option value="11-all">ថ្នាក់ទី ១១ ទាំងអស់</option>' +
      '<option value="11-sc1">ថ្នាក់ទី ១១ · វិទ្យាសាស្ត្រភាគ១</option>' +
      '<option value="11-sc2">ថ្នាក់ទី ១១ · វិទ្យាសាស្ត្រភាគ២</option>' +
      '<option value="11-ss">ថ្នាក់ទី ១១ · វិទ្យាសាស្ត្រសង្គម</option>' +
      '<option value="12-all">ថ្នាក់ទី ១២ ទាំងអស់</option>' +
      '<option value="12-sc1">ថ្នាក់ទី ១២ · វិទ្យាសាស្ត្រភាគ១</option>' +
      '<option value="12-sc2">ថ្នាក់ទី ១២ · វិទ្យាសាស្ត្រភាគ២</option>' +
      '<option value="12-ss">ថ្នាក់ទី ១២ · វិទ្យាសាស្ត្រសង្គម</option>' +
    '</select>';

    var itemsWrap = document.createElement('div');
    itemsWrap.style.overflowY = 'auto';
    itemsWrap.style.flex = '1';

    function renderTplItems(val) {
      var filtered = list.map(function (t, i) { return { t: t, i: i }; });
      if (val !== 'all') {
        if (val.indexOf('11-') === 0 || val.indexOf('12-') === 0) {
          var targetGrade = val.substring(0, 2);
          var p = val.substring(3);
          filtered = filtered.filter(function (item) {
            var g = String(item.t.grade || '');
            if (g !== targetGrade) return false;
            if (p === 'all') return true;
            return item.t.part === p;
          });
        } else {
          filtered = filtered.filter(function (item) {
            return String(item.t.grade || '') === val;
          });
        }
      }
      if (!filtered.length) {
        itemsWrap.innerHTML = '<div style="padding:10px 14px;font-size:12px;color:#6c757d">មិនមានគំរូក្នុងផ្នែកនេះទេ</div>';
      } else {
        itemsWrap.innerHTML = filtered.map(function (item) {
          return '<button data-i="' + item.i + '">' + esc(item.t.name) + '</button>';
        }).join('');
      }
    }

    m.appendChild(filterHeader);
    m.appendChild(itemsWrap);

    var sel = filterHeader.querySelector('select');
    sel.value = defaultFilter;
    renderTplItems(defaultFilter);

    sel.addEventListener('change', function () {
      renderTplItems(sel.value);
    });

    var r = btn.getBoundingClientRect();
    m.style.left = r.left + 'px'; m.style.top = r.bottom + 4 + 'px';
    m.addEventListener('click', function (e) {
      var x = e.target.closest('[data-i]'); if (!x) return;
      closeMenu(); commitEdit();
      var t = list[+x.dataset.i];
      var d = t.build(window.KPSlides.api);
      d.id = uid(); d.updated = Date.now();
      if (t.grade) d.grade = t.grade;
      if (t.chapter) d.chapter = t.chapter;
      if (t.chapterNum != null) d.chapterNum = t.chapterNum;
      if (t.lesson) d.lesson = t.lesson;
      if (t.lessonNum != null) d.lessonNum = t.lessonNum;
      if (t.sections) d.sections = t.sections;
      if (t.track) d.track = t.track;
      if (t.part) d.part = t.part;
      if (t.trackName) d.trackName = t.trackName;
      deckDefaults(d);
      addDeck(d); renderAll(); save(); status('✓ បានបង្កើត «' + d.name + '» (' + kh(d.slides.length) + ' ស្លាយ)');
    });
    document.body.appendChild(m);
  }

  /* ---------------- actions ---------------- */
  function addSlide(layout) {
    commitEdit(); pushUndo();
    S.deck.slides.splice(S.cur + 1, 0, layoutSlide(layout));
    S.cur++; S.sel = null; renderAll(); save();
  }
  function addEl(el, edit) {
    change(function () { slide().els.push(el); S.sel = el.id; });
    if (edit) startEdit(el.id);
  }
  function setProp(p, v, key) { var el = selEl(); if (!el) return; change(function () { el[p] = v; }, key); }

  function onClick(e) {
    var t = e.target.closest('[data-tab]');
    if (t) { setTab(t.dataset.tab); return; }
    var a = e.target.closest('[data-act]'); if (!a || a.closest('.sl-menu')) return;
    var act = a.dataset.act, v = a.dataset.v, el = selEl(), s = slide();
    switch (act) {
      case 'new': layoutMenu(a); break;
      case 'add-layout': addSlide(v); break;
      case 'dup-slide': dupSlide(); break;
      case 'del-slide':
        if (S.deck.slides.length < 2) { alert('ត្រូវមានយ៉ាងហោចណាស់មួយស្លាយ'); break; }
        commitEdit(); pushUndo(); S.deck.slides.splice(S.cur, 1); S.cur = Math.min(S.cur, S.deck.slides.length - 1); S.sel = null; renderAll(); save(); break;
      case 'size-dn': if (el && el.type === 'text') setProp('size', Math.max(8, el.size - 2), 'size'); break;
      case 'size-up': if (el && el.type === 'text') setProp('size', Math.min(200, el.size + 2), 'size'); break;
      case 'bold': if (el) setProp('bold', !el.bold); break;
      case 'italic': if (el) setProp('italic', !el.italic); break;
      case 'align': case 'valign': if (el) setProp(act, v); break;
      case 'nofill': if (el) setProp('fill', el.type === 'shape' ? 'none' : null); break;
      case 'border': if (el && el.type === 'text') setProp('border', el.border ? null : 'accent'); break;
      case 'plain': change(function () { s.plain = !s.plain; }); break;
      case 'ins-timer': addEl(timerEl(880, 170, 360, 230, 30)); break;
      case 'tpl': templateMenu(a); break;
      case 'anim': if (el) setProp('anim', !el.anim); break;
      case 'front': if (el) change(function () { s.els.splice(s.els.indexOf(el), 1); s.els.push(el); }); break;
      case 'back': if (el) change(function () { s.els.splice(s.els.indexOf(el), 1); s.els.unshift(el); }); break;
      case 'dup-el': dupEl(); break;
      case 'del-el': delEl(); break;
      case 'undo': undo(); break;
      case 'redo': redo(); break;
      case 'ins-text': addEl(T(340, 300, 600, 120, 'អត្ថបទថ្មី', { size: 32 }), true); break;
      case 'ins-title': addEl(T(60, 40, 1160, 100, 'ចំណងជើង', { size: 46, bold: true, valign: 'middle', role: 'title' }), true); break;
      case 'ins-math': addEl(T(290, 260, 700, 200, '$$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$$', { size: 40, align: 'center', valign: 'middle' }), true); break;
      case 'ins-img': root.querySelector('.sl-f-img').click(); break;
      case 'ins-shape':
        var line = v === 'line' || v === 'arrow';
        addEl({ id: uid(), type: 'shape', shape: v, x: line ? 440 : 490, y: line ? 340 : 210, w: line ? 400 : 300, h: line ? 40 : 300, fill: null, stroke: null, sw: line ? 6 : 0 });
        break;
      case 'lesson': openLessonDialog(); break;
      case 'theme': change(function () { S.deck.theme = v; }); renderThumbs(); break;
      case 'bg-all': change(function () { var bg = s.bg; S.deck.slides.forEach(function (x) { x.bg = bg; }); }); renderThumbs(); break;
      case 'bg-reset': change(function () { s.bg = null; }); break;
      case 'show-start': present(0); break;
      case 'reload-tpl': reloadTemplates(); break;
      case 'show-cur': present(S.cur); break;
      case 'new-deck': commitEdit(); var actG = getActiveGrade(); var newGrade = (actG && actG !== 'all') ? actG : (S.deck && S.deck.grade ? S.deck.grade : undefined); addDeck({ id: uid(), name: 'បទបង្ហាញថ្មី', grade: newGrade, theme: S.deck.theme, updated: Date.now(), slides: [layoutSlide(S.deck && S.deck.theme === 'school' ? 's_cover' : 'title')] }); renderAll(); save(); break;
      case 'del-deck':
        if (!confirm('លុបបទបង្ហាញ «' + S.deck.name + '» ? (មិនអាចត្រឡប់វិញបានទេ)')) break;
        delete S.store.decks[S.deck.id];
        if (!Object.keys(S.store.decks).length) addDeck({ id: uid(), name: 'បទបង្ហាញថ្មី', theme: 'ocean', updated: Date.now(), slides: [layoutSlide(S.deck && S.deck.theme === 'school' ? 's_cover' : 'title')] });
        else switchDeck(Object.keys(S.store.decks)[0]);
        renderAll(); save(); break;
      case 'export': exportJSON(); break;
      case 'import': root.querySelector('.sl-f-json').click(); break;
      case 'print': printDeck(); break;
      case 'download': downloadMenu(a); break;
    }
  }

  function setG11Track(part) {
    S.activeG11Part = part || 'all';
    window.currentG11Track = S.activeG11Part;
    var btnText = document.getElementById('g11-btn-text');
    if (btnText) {
      if (part === 'sc1') btnText.textContent = '១១ · វិទ្យាសាស្ត្រភាគ១';
      else if (part === 'sc2') btnText.textContent = '១១ · វិទ្យាសាស្ត្រភាគ២';
      else if (part === 'ss') btnText.textContent = '១១ · វិទ្យាសាស្ត្រសង្គម';
      else btnText.textContent = 'ថ្នាក់ទី ១១';
    }
    var activeG = getActiveGrade();
    if (activeG === '11' && part && part !== 'all') {
      var curPart = S.deck ? S.deck.part : '';
      if (curPart !== part) {
        var match = null;
        var keys = Object.keys(S.store.decks);
        for (var i = 0; i < keys.length; i++) {
          var d = S.store.decks[keys[i]];
          if (getDeckGrade(d) === '11' && d.part === part) {
            match = d;
            break;
          }
        }
        if (!match && window.KPSlideTemplates) {
          for (var j = 0; j < window.KPSlideTemplates.length; j++) {
            var t = window.KPSlideTemplates[j];
            if (String(t.grade) === '11' && t.part === part) {
              var newD = t.build(window.KPSlides.api);
              newD.id = uid(); newD.tpl = t.id; newD.updated = newD.seededAt = Date.now();
              if (t.grade) newD.grade = t.grade;
              if (t.chapter) newD.chapter = t.chapter;
              if (t.chapterNum != null) newD.chapterNum = t.chapterNum;
              if (t.lesson) newD.lesson = t.lesson;
              if (t.lessonNum != null) newD.lessonNum = t.lessonNum;
              if (t.sections) newD.sections = t.sections;
              if (t.track) newD.track = t.track;
              if (t.part) newD.part = t.part;
              if (t.trackName) newD.trackName = t.trackName;
              deckDefaults(newD);
              S.store.decks[newD.id] = newD;
              if (S.store.seeded) S.store.seeded[t.id] = t.ver;
              match = newD;
              break;
            }
          }
        }
        if (match) {
          switchDeck(match.id);
          renderAll();
          return;
        }
      }
    }
    syncRibbon();
  }

  function setG12Track(part) {
    S.activeG12Part = part || 'all';
    var activeG = getActiveGrade();
    if (activeG === '12' && part && part !== 'all') {
      var curPart = S.deck ? S.deck.part : '';
      if (curPart !== part) {
        var match = null;
        var keys = Object.keys(S.store.decks);
        for (var i = 0; i < keys.length; i++) {
          var d = S.store.decks[keys[i]];
          if (getDeckGrade(d) === '12' && d.part === part) {
            match = d;
            break;
          }
        }
        if (!match && window.KPSlideTemplates) {
          for (var j = 0; j < window.KPSlideTemplates.length; j++) {
            var t = window.KPSlideTemplates[j];
            if (String(t.grade) === '12' && t.part === part) {
              var newD = t.build(window.KPSlides.api);
              newD.id = uid(); newD.tpl = t.id; newD.updated = newD.seededAt = Date.now();
              if (t.grade) newD.grade = t.grade;
              if (t.chapter) newD.chapter = t.chapter;
              if (t.chapterNum != null) newD.chapterNum = t.chapterNum;
              if (t.lesson) newD.lesson = t.lesson;
              if (t.lessonNum != null) newD.lessonNum = t.lessonNum;
              if (t.sections) newD.sections = t.sections;
              if (t.track) newD.track = t.track;
              if (t.part) newD.part = t.part;
              if (t.trackName) newD.trackName = t.trackName;
              deckDefaults(newD);
              S.store.decks[newD.id] = newD;
              if (S.store.seeded) S.store.seeded[t.id] = t.ver;
              match = newD;
              break;
            }
          }
        }
        if (match) {
          switchDeck(match.id);
          renderAll();
          return;
        }
      }
    }
    syncRibbon();
  }

  function onInput(e) {
    if (e.target.classList.contains('sl-top-track') || e.target.classList.contains('sl-top-g11-track')) {
      if (e.type === 'change') {
        var actG = getActiveGrade();
        if (actG === '12') setG12Track(e.target.value);
        else setG11Track(e.target.value);
      }
      return;
    }
    if (e.target.classList.contains('sl-top-section')) {
      if (e.type === 'change') {
        var slIdx = +e.target.value;
        if (!isNaN(slIdx) && slIdx >= 0) goSlide(slIdx);
      }
      return;
    }
    var p = e.target.dataset.prop; if (!p) return;
    var v = e.target.value, el = selEl();
    if (p === 'deck') { if (e.type === 'change') { switchDeck(v); renderAll(); } return; }
    if (p === 'school' || p === 'school2' || p === 'school3' || p === 'teacher') { S.deck[p] = v; renderStage(); clearTimeout(S.thumbT); S.thumbT = setTimeout(renderThumbs, 400); save(); return; }
    if (p === 'deckname') { S.deck.name = v || 'គ្មានចំណងជើង'; root.querySelector('.sl-title').textContent = S.deck.name; save(); return; }
    if (p === 'bg') { var s = slide(); change(function () { s.bg = v; }, 'bg' + s.id); return; }
    if (!el) return;
    if (p === 'size') { var n = +v; if (n >= 8 && n <= 200) setProp('size', n, 'size' + el.id); return; }
    if (p === 'rot') { setProp('rot', ((+v || 0) % 360 + 360) % 360, 'rot' + el.id); return; }
    if (p === 'sw') { setProp('sw', +v, 'sw' + el.id); return; }
    setProp(p, v, p + el.id);
  }

  function switchDeck(id) {
    if (!S.store.decks[id]) return;
    commitEdit(); S.deck = S.store.decks[id]; S.store.current = id; S.cur = 0; S.sel = null; S.undo = []; S.redo = [];
  }
  function dupSlide() {
    commitEdit(); pushUndo();
    var c = clone(slide()); c.id = uid(); c.els.forEach(function (x) { x.id = uid(); });
    S.deck.slides.splice(S.cur + 1, 0, c); S.cur++; S.sel = null; renderAll(); save();
  }
  function dupEl() {
    var el = selEl(); if (!el) return;
    var c = clone(el); c.id = uid(); c.x += 24; c.y += 24;
    addEl(c);
  }
  function delEl() {
    var el = selEl(); if (!el) return; var s = slide();
    change(function () { s.els.splice(s.els.indexOf(el), 1); S.sel = null; });
  }

  /* ---------------- stage interaction ---------------- */
  function onStageDown(e) {
    if (e.button !== 0 || e.target.closest('textarea')) return;
    var ae = document.activeElement;
    if (ae && ae !== document.body && !stage.contains(ae) && ae.blur) ae.blur();
    var h = e.target.closest('.sl-h'), d = e.target.closest('.sl-el');
    commitEdit();
    if (h) { startDrag(e, h.dataset.dir); return; }
    if (d) {
      if (S.sel !== d.dataset.id) { S.sel = d.dataset.id; drawSel(); syncRibbon(); }
      startDrag(e, null); return;
    }
    if (S.sel) { S.sel = null; drawSel(); syncRibbon(); }
  }

  function startDrag(e, dir) {
    var el = selEl(); if (!el) return;
    e.preventDefault();
    var sx = e.clientX, sy = e.clientY, o = { x: el.x, y: el.y, w: el.w, h: el.h }, ratio = o.w / o.h;
    var snap = JSON.stringify({ deck: S.deck, cur: S.cur }), moved = false;
    var dEl = stage.querySelector('.sl-el[data-id="' + el.id + '"]'), box = stage.querySelector('.sl-sel');
    var gv = guide('v'), gh = guide('h');
    function mv(ev) {
      var dx = (ev.clientX - sx) / S.scale, dy = (ev.clientY - sy) / S.scale;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
      if (!moved) { moved = true; pushUndoRaw(snap); }
      if (!dir) {
        var x = o.x + dx, y = o.y + dy, cx = x + el.w / 2, cy = y + el.h / 2;
        var snx = !ev.altKey && Math.abs(cx - W / 2) < 8, sny = !ev.altKey && Math.abs(cy - H / 2) < 8;
        if (snx) x = W / 2 - el.w / 2;
        if (sny) y = H / 2 - el.h / 2;
        gv.style.display = snx ? 'block' : 'none'; gh.style.display = sny ? 'block' : 'none';
        el.x = Math.round(x); el.y = Math.round(y);
      } else {
        var X = o.x, Y = o.y, w = o.w, h = o.h;
        if (dir.indexOf('e') >= 0) w = o.w + dx;
        if (dir.indexOf('w') >= 0) { w = o.w - dx; X = o.x + dx; }
        if (dir.indexOf('s') >= 0) h = o.h + dy;
        if (dir.indexOf('n') >= 0) { h = o.h - dy; Y = o.y + dy; }
        if (dir.length === 2 && (ev.shiftKey || el.type === 'image')) {
          if (w / h > ratio) w = h * ratio; else h = w / ratio;
          if (dir.indexOf('w') >= 0) X = o.x + o.w - w;
          if (dir.indexOf('n') >= 0) Y = o.y + o.h - h;
        }
        el.w = Math.round(Math.max(20, w)); el.h = Math.round(Math.max(el.type === 'shape' ? 8 : 20, h));
        el.x = Math.round(X); el.y = Math.round(Y);
        if (el.type === 'shape' && dEl) dEl.innerHTML = shapeSVG(el);
      }
      if (dEl) place(dEl, el);
      if (box) place(box, el);
    }
    function up() {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      gv.remove(); gh.remove();
      if (moved) { renderStage(); renderThumb(S.cur); save(); }
    }
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  }
  function guide(k) {
    var g = document.createElement('div'); g.className = 'sl-guide sl-guide-' + k; g.style.display = 'none';
    stage.appendChild(g); return g;
  }

  function startEdit(id) {
    var s = slide(), el = null;
    s.els.forEach(function (x) { if (x.id === id) el = x; });
    if (!el || el.type !== 'text') return;
    commitEdit();
    S.sel = id; drawSel(); syncRibbon();
    var d = stage.querySelector('.sl-el[data-id="' + id + '"]'); if (!d) return;
    var ta = document.createElement('textarea');
    ta.className = 'sl-edit'; ta.value = el.text; ta.spellcheck = false;
    ta.style.fontSize = Math.max(16, el.size) + 'px'; ta.style.fontWeight = el.bold ? '700' : '400'; ta.style.textAlign = el.align;
    d.innerHTML = ''; d.appendChild(ta);
    S.edit = { ta: ta, el: el, before: JSON.stringify({ deck: S.deck, cur: S.cur }) };
    ta.addEventListener('keydown', function (ev) { ev.stopPropagation(); if (ev.key === 'Escape') { ev.preventDefault(); commitEdit(); } });
    ta.addEventListener('blur', commitEdit);
    ta.focus(); ta.select();
  }
  function commitEdit() {
    var ed = S.edit; if (!ed) return;
    S.edit = null;
    if (ed.ta.value !== ed.el.text) { pushUndoRaw(ed.before); ed.el.text = ed.ta.value; save(); }
    renderStage(); renderThumb(S.cur);
  }

  /* ---------------- keyboard / paste ---------------- */
  function active() { return S.built && !S.show && root.offsetParent !== null; }
  function typing(e) { var t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); }

  function onKey(e) {
    if (!active() || typing(e) || document.querySelector('.sl-modal-bg')) return;
    var k = e.key, ctrl = e.ctrlKey || e.metaKey, el = selEl();
    if (k === 'F5') { e.preventDefault(); present(e.shiftKey ? S.cur : 0); return; }
    if (ctrl && (k === 'z' || k === 'Z')) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (ctrl && (k === 'y' || k === 'Y')) { e.preventDefault(); redo(); return; }
    if (ctrl && (k === 'd' || k === 'D')) { e.preventDefault(); if (el) dupEl(); else dupSlide(); return; }
    if (ctrl && (k === 'c' || k === 'C') && el) { S.clip = clone(el); return; }
    if (ctrl && (k === 'b' || k === 'B') && el) { e.preventDefault(); setProp('bold', !el.bold); return; }
    if (ctrl && (k === 'i' || k === 'I') && el) { e.preventDefault(); setProp('italic', !el.italic); return; }
    if (ctrl && (k === 'm' || k === 'M')) { e.preventDefault(); addSlide('content'); return; }
    if ((k === 'Delete' || k === 'Backspace') && el) { e.preventDefault(); delEl(); return; }
    if (k === 'Enter' && el && el.type === 'text') { e.preventDefault(); startEdit(el.id); return; }
    if (k === 'Escape' && el) { S.sel = null; drawSel(); syncRibbon(); return; }
    if (k.indexOf('Arrow') === 0) {
      e.preventDefault();
      if (el) {
        var st = e.shiftKey ? 10 : 1, dx = k === 'ArrowLeft' ? -st : k === 'ArrowRight' ? st : 0, dy = k === 'ArrowUp' ? -st : k === 'ArrowDown' ? st : 0;
        change(function () { el.x += dx; el.y += dy; }, 'nudge' + el.id);
      } else if (k === 'ArrowUp' || k === 'ArrowLeft') goSlide(S.cur - 1);
      else goSlide(S.cur + 1);
      return;
    }
    if (k === 'PageUp') { e.preventDefault(); goSlide(S.cur - 1); }
    if (k === 'PageDown') { e.preventDefault(); goSlide(S.cur + 1); }
  }

  function onPaste(e) {
    if (!active() || typing(e)) return;
    var items = (e.clipboardData && e.clipboardData.items) || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') === 0) { e.preventDefault(); addImageFile(items[i].getAsFile()); return; }
    }
    if (S.clip) { e.preventDefault(); var c = clone(S.clip); c.id = uid(); c.x += 24; c.y += 24; S.clip = clone(c); addEl(c); }
  }

  /* ---------------- images ---------------- */
  function addImageFile(file) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1600, k = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        var src = cv.toDataURL('image/png');
        if (src.length > 700000) src = cv.toDataURL('image/jpeg', 0.85);
        var f = Math.min(1, 640 / cv.width, 480 / cv.height), w = Math.round(cv.width * f), h = Math.round(cv.height * f);
        addEl({ id: uid(), type: 'image', src: src, x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w: w, h: h });
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  /* ---------------- file ---------------- */
  function exportJSON() {
    var blob = new Blob([JSON.stringify({ kpSlides: 1, deck: S.deck })], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (S.deck.name || 'slides').replace(/[\\/:*?"<>|]+/g, '_') + '.kpslides.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  function importJSON(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result), d = o.deck || o;
        if (!d.slides || !d.slides.length) throw new Error('no slides');
        d.id = uid(); d.updated = Date.now(); d.theme = THEMES[d.theme] ? d.theme : 'ocean';
        commitEdit(); addDeck(d); renderAll(); save(); status('✓ បានបើក «' + d.name + '»');
      } catch (err) { alert('ឯកសារមិនត្រឹមត្រូវ (ត្រូវតែជា .kpslides.json)'); }
    };
    r.readAsText(file);
  }
  function printDeck() {
    commitEdit();
    var box = document.createElement('div'); box.id = 'sl-print';
    document.body.appendChild(box);
    S.deck.slides.forEach(function (s, i) { var p = document.createElement('div'); p.className = 'sl-stage sl-page'; box.appendChild(p); paint(s, p, 'print', i); });
    var st = document.createElement('style'); st.textContent = '@page{size:1280px 720px;margin:0}';
    document.head.appendChild(st); document.body.classList.add('sl-printing');
    var done = function () { box.remove(); st.remove(); document.body.classList.remove('sl-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(function () { window.print(); }, 300);
  }

  /* ---------------- slide show ---------------- */
  function present(from) {
    if (S.show) return;
    commitEdit();
    var ov = document.createElement('div');
    ov.id = 'sl-show';
    ov.innerHTML = '<div class="sl-show-holder"><div class="sl-stage"></div></div><canvas class="sl-pen"></canvas>' +
      '<div class="sl-show-bar"><button data-s="prev" title="ថយក្រោយ">◀</button><span class="sl-show-n"></span><button data-s="next" title="បន្ទាប់">▶</button>' +
      '<button data-s="pen" title="ប៊ិចគូស (P)">✏️</button><button data-s="clear" title="លុបគំនូរ (E)">🧽</button><button data-s="black" title="អេក្រង់ខ្មៅ (B)">⬛</button><button data-s="exit" title="ចេញ (Esc)">✕</button></div>';
    document.body.appendChild(ov);
    var sh = S.show = { ov: ov, st: ov.querySelector('.sl-stage'), hold: ov.querySelector('.sl-show-holder'), cv: ov.querySelector('.sl-pen'), i: from, pen: false, fs: false, t: 0 };
    sh.key = function (e) {
      var k = e.key; e.stopPropagation();
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n', 'N'].indexOf(k) >= 0) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].indexOf(k) >= 0) { e.preventDefault(); prev(); }
      else if (k === 'Home') showSlide(0); else if (k === 'End') showSlide(S.deck.slides.length - 1, true);
      else if (k === 'Escape') { e.preventDefault(); endShow(); }
      else if (k === 'b' || k === 'B' || k === '.') ov.classList.toggle('black');
      else if (k === 'p' || k === 'P') togglePen();
      else if (k === 'e' || k === 'E') clearPen();
      else if (k === 't' || k === 'T') { var c = sh.st.querySelector('.sl-clock'); if (c) toggleClock(c); }
    };
    sh.resize = function () { layoutShow(); };
    sh.fsch = function () { if (document.fullscreenElement) sh.fs = true; else if (sh.fs) endShow(); };
    sh.move = function () { ov.classList.add('mouse'); clearTimeout(sh.t); sh.t = setTimeout(function () { ov.classList.remove('mouse'); }, 2200); };
    document.addEventListener('keydown', sh.key, true);
    window.addEventListener('resize', sh.resize);
    document.addEventListener('fullscreenchange', sh.fsch);
    ov.addEventListener('mousemove', sh.move);
    ov.addEventListener('click', function (e) {
      var bt = e.target.closest('[data-s]');
      if (bt) { var s = bt.dataset.s; if (s === 'prev') prev(); else if (s === 'next') next(); else if (s === 'pen') togglePen(); else if (s === 'clear') clearPen(); else if (s === 'black') ov.classList.toggle('black'); else endShow(); return; }
      var ck = e.target.closest('.sl-clock');
      if (ck && !sh.pen) { toggleClock(ck); return; }
      if (!sh.pen) next();
    });
    ov.addEventListener('contextmenu', function (e) { e.preventDefault(); prev(); });
    penSetup(sh);
    if (ov.requestFullscreen) ov.requestFullscreen().catch(function () {});
    layoutShow(); showSlide(from);
  }
  function layoutShow() {
    var sh = S.show; if (!sh) return;
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    sh.hold.style.width = W * s + 'px'; sh.hold.style.height = H * s + 'px';
    sh.st.style.transform = 'scale(' + s + ')';
    var dpr = window.devicePixelRatio || 1;
    sh.cv.width = window.innerWidth * dpr; sh.cv.height = window.innerHeight * dpr;
  }
  function showSlide(i, revealAll) {
    var sh = S.show; sh.i = Math.max(0, Math.min(S.deck.slides.length - 1, i));
    sh.ov.classList.remove('end');
    stopClocks();
    paint(S.deck.slides[sh.i], sh.st, 'show', sh.i);
    if (revealAll) sh.st.querySelectorAll('.sl-hidden').forEach(function (x) { x.classList.remove('sl-hidden'); });
    sh.st.classList.remove('sl-fade'); void sh.st.offsetWidth; sh.st.classList.add('sl-fade');
    sh.ov.querySelector('.sl-show-n').textContent = kh(sh.i + 1) + ' / ' + kh(S.deck.slides.length);
    clearPen();
  }
  function next() {
    var sh = S.show, h = sh.st.querySelector('.sl-hidden');
    if (h) {
      var all = h.dataset.grp ? sh.st.querySelectorAll('.sl-hidden[data-grp="' + h.dataset.grp + '"]') : [h];
      Array.prototype.forEach.call(all, function (x) { x.classList.remove('sl-hidden'); x.classList.add('sl-reveal'); });
      return;
    }
    if (sh.i < S.deck.slides.length - 1) showSlide(sh.i + 1);
    else if (sh.ov.classList.contains('end')) endShow();
    else { sh.ov.classList.add('end'); sh.st.innerHTML = '<div class="sl-endmsg">ចប់ការបញ្ចាំង — ចុចម្តងទៀតដើម្បីចេញ</div>'; sh.st.style.background = '#000'; }
  }
  function prev() {
    var sh = S.show;
    if (sh.ov.classList.contains('end')) { sh.ov.classList.remove('end'); showSlide(sh.i, true); return; }
    if (sh.i > 0) showSlide(sh.i - 1, true);
  }
  // countdown timers: click (or T) starts / pauses, a finished timer restarts
  var clocks = [];
  function toggleClock(c) {
    var id = c.closest('.sl-el').dataset.id, el = null;
    S.deck.slides[S.show.i].els.forEach(function (x) { if (x.id === id) el = x; });
    if (!el) return;
    if (c._run) { clearInterval(c._run); c._run = null; c.classList.remove('run'); return; }
    if (c._left == null || c._left <= 0) { c._left = el.sec; c.classList.remove('done'); }
    c.classList.add('run');
    c._run = setInterval(function () {
      c._left--; c.firstChild.textContent = clock(c._left);
      if (c._left <= 0) { clearInterval(c._run); c._run = null; c.classList.remove('run'); c.classList.add('done'); beep(); }
    }, 1000);
    clocks.push(c);
  }
  function stopClocks() { clocks.forEach(function (c) { clearInterval(c._run); }); clocks = []; }
  function beep() {
    try {
      var A = new (window.AudioContext || window.webkitAudioContext)(), o = A.createOscillator(), g = A.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(A.destination); g.gain.setValueAtTime(0.25, A.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, A.currentTime + 1.2); o.start(); o.stop(A.currentTime + 1.2);
    } catch (e) {}
  }
  function endShow() {
    var sh = S.show; if (!sh) return;
    stopClocks();
    S.show = null;
    document.removeEventListener('keydown', sh.key, true);
    window.removeEventListener('resize', sh.resize);
    document.removeEventListener('fullscreenchange', sh.fsch);
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    sh.ov.remove();
    goSlide(sh.i);
  }
  function penSetup(sh) {
    var ctx = sh.cv.getContext('2d'), drawing = false;
    sh.cv.addEventListener('pointerdown', function (e) {
      if (!sh.pen) return; drawing = true; var d = window.devicePixelRatio || 1;
      ctx.strokeStyle = '#ff3b3b'; ctx.lineWidth = 5 * d; ctx.lineCap = ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(e.clientX * d, e.clientY * d); sh.cv.setPointerCapture(e.pointerId);
    });
    sh.cv.addEventListener('pointermove', function (e) { if (!drawing) return; var d = window.devicePixelRatio || 1; ctx.lineTo(e.clientX * d, e.clientY * d); ctx.stroke(); });
    sh.cv.addEventListener('pointerup', function () { drawing = false; });
  }
  function togglePen() { var sh = S.show; sh.pen = !sh.pen; sh.ov.classList.toggle('pen-on', sh.pen); }
  function clearPen() { var sh = S.show; if (sh) sh.cv.getContext('2d').clearRect(0, 0, sh.cv.width, sh.cv.height); }

  /* ---------------- public ---------------- */
  window.KPSlides = {
    // building blocks for template decks (static/js/slides_templates.js)
    api: { T: T, shape: shp, timer: timerEl, slide: SCHOOL.page, school: SCHOOL, kh: kh, uid: uid },
    paint: paint,
    getDeck: function () { return S.deck; },
    getStore: function () { return S.store; },
    reloadTemplates: reloadTemplates,
    filterGrade: function (g, part) {
      if (!S.store || !S.store.decks) load();
      if (window.history && history.replaceState && location.search) {
        try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
      }
      var gStr = (g == null || g === '' || g === 'all') ? 'all' : String(g);
      S.activeGrade = gStr;
      if (gStr === '11' && part !== undefined) S.activeG11Part = part;
      if (gStr === '12' && part !== undefined) S.activeG12Part = part;

      if (gStr === 'all') {
        if (root) syncRibbon();
        return;
      }

      var curGrade = S.deck ? getDeckGrade(S.deck) : '';
      var curPart = S.deck ? S.deck.part : '';
      var partMatch = true;
      if (gStr === '11' && S.activeG11Part && S.activeG11Part !== 'all') partMatch = (curPart === S.activeG11Part);
      if (gStr === '12' && S.activeG12Part && S.activeG12Part !== 'all') partMatch = (curPart === S.activeG12Part);
      if (curGrade === gStr && partMatch) {
        if (root) syncRibbon();
        return;
      }

      var match = null;
      var keys = Object.keys(S.store.decks);
      for (var i = 0; i < keys.length; i++) {
        var d = S.store.decks[keys[i]];
        if (getDeckGrade(d) === gStr) {
          if (gStr === '11' && S.activeG11Part && S.activeG11Part !== 'all') {
            if (d.part === S.activeG11Part) { match = d; break; }
          } else if (gStr === '12' && S.activeG12Part && S.activeG12Part !== 'all') {
            if (d.part === S.activeG12Part) { match = d; break; }
          } else {
            match = d;
            break;
          }
        }
      }

      if (!match && window.KPSlideTemplates) {
        for (var j = 0; j < window.KPSlideTemplates.length; j++) {
          var t = window.KPSlideTemplates[j];
          if (String(t.grade) === gStr || (t.id && t.id.indexOf('g' + gStr) === 0)) {
            if (gStr === '11' && S.activeG11Part && S.activeG11Part !== 'all') {
              if (t.part !== S.activeG11Part) continue;
            }
            if (gStr === '12' && S.activeG12Part && S.activeG12Part !== 'all') {
              if (t.part !== S.activeG12Part) continue;
            }
            var newD = t.build(window.KPSlides.api);
            newD.id = uid(); newD.tpl = t.id; newD.updated = newD.seededAt = Date.now();
            if (t.grade) newD.grade = t.grade;
            if (t.chapter) newD.chapter = t.chapter;
            if (t.chapterNum != null) newD.chapterNum = t.chapterNum;
            if (t.lesson) newD.lesson = t.lesson;
            if (t.lessonNum != null) newD.lessonNum = t.lessonNum;
            if (t.sections) newD.sections = t.sections;
            if (t.track) newD.track = t.track;
            if (t.part) newD.part = t.part;
            if (t.trackName) newD.trackName = t.trackName;
            deckDefaults(newD);
            S.store.decks[newD.id] = newD;
            if (S.store.seeded) S.store.seeded[t.id] = t.ver;
            match = newD;
            break;
          }
        }
      }

      if (match) {
        switchDeck(match.id);
        if (root) syncRibbon();
        renderAll();
      } else {
        if (root) syncRibbon();
      }
    },
    setG11Track: function (part) {
      setG11Track(part);
    },
    setG12Track: function (part) {
      setG12Track(part);
    },
    open: function (optG) {
      // opened from a lesson page (studio.html?deck=...): keep that deck's grade, not the studio default
      var linked = !S.built && new URLSearchParams(location.search).get('deck');
      if (!S.built) { load(); build(); setTab('home'); }
      var g = linked ? S.activeGrade : (optG || window.currentGrade || S.activeGrade);
      if (g && g !== 'all') S.activeGrade = String(g);
      var activeTrack = (g === '11' || g === 11) ? (window.currentG11Track || S.activeG11Part) : ((g === '12' || g === 12) ? (window.currentG12Track || S.activeG12Part) : undefined);
      if (g) {
        window.KPSlides.filterGrade(g, activeTrack);
      }
      requestAnimationFrame(function () { fitStage(); renderAll(); });
    }
  };
})();
