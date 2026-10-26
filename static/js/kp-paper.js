/* KPCambodianmathematics — exam paper engine
 * question banks, paper generation, HTML rendering, LaTeX / Word (.docx) export.
 * No external libraries: KaTeX (already in static/katex) gives MathML, converted here to Word equations (OMML).
 */
(function (G) {
  'use strict';
  var KP = G.KP = G.KP || {};
  var KHD = '០១២៣៤៥៦៧៨៩';
  var KLET = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច', 'ឆ', 'ជ', 'ឈ', 'ញ', 'ដ', 'ឋ', 'ឌ', 'ឍ', 'ណ', 'ត', 'ថ', 'ទ', 'ធ', 'ន'];
  var kh = KP.kh = function (n) { return String(n).replace(/\d/g, function (d) { return KHD[d]; }); };
  KP.KLET = KLET;
  var esc = KP.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  KP.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); };

  /* ------------------------------------------------------------------ kinds of papers */
  KP.MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  KP.KINDS = {
    lesson:   { name: 'តេស្តតាមមេរៀន',        mcq: 10, written: 3, total: 20,  duration: 45,  mcqPts: 1 },
    chapter:  { name: 'តេស្តតាមជំពូក',         mcq: 20, written: 5, total: 50,  duration: 90,  mcqPts: 1 },
    monthly:  { name: 'វិញ្ញាសាប្រឡងប្រចាំខែ',   mcq: 20, written: 5, total: 50,  duration: 90,  mcqPts: 1 },
    semester: { name: 'វិញ្ញាសាប្រឡងប្រចាំឆមាស', mcq: 30, written: 6, total: 100, duration: 150, mcqPts: 2 },
    custom:   { name: 'វិញ្ញាសាប្រឡង',           mcq: 15, written: 4, total: 50,  duration: 60,  mcqPts: 1 }
  };
  KP.paperTitle = function (m) {
    var k = KP.KINDS[m.kind] || KP.KINDS.custom, t = k.name;
    if (m.kind === 'monthly' && m.month) t += ' ខែ' + m.month;
    if (m.kind === 'semester' && m.semester) t += ' ទី' + kh(m.semester);
    if (m.kind === 'lesson' && m.scope) t += ' ៖ ' + m.scope;
    if (m.kind === 'chapter' && m.scope) t += ' ៖ ' + m.scope;
    return t;
  };

  /* ------------------------------------------------------------------ banks */
  var banks = {};
  KP.bankBase = KP.bankBase || '';
  /* banks are plain <script> files (static/bank/g<N>.js) so this also works from file:// */
  KP.loadBank = function (g) {
    if (!banks[g]) banks[g] = new Promise(function (res, rej) {
      var B = G.KP_BANKS || {};
      if (B[g]) return res(B[g]);
      var sc = document.createElement('script');
      sc.src = KP.bankBase + 'static/bank/g' + g + '.js';
      sc.onload = function () { var b = (G.KP_BANKS || {})[g]; if (b) res(b); else rej(new Error('bank ' + g)); };
      sc.onerror = function () { delete banks[g]; rej(new Error('bank ' + g)); };
      document.head.appendChild(sc);
    });
    return banks[g];
  };
  KP.trackKey = function (t) { return /សង្គម/.test(t || '') ? 'ss' : (/វិទ្យាសាស្ត្រ/.test(t || '') ? 'sc' : ''); };
  KP.lessonsOf = function (bank, track) {
    return bank.lessons.filter(function (l) { return !track || KP.trackKey(l.track) === track; });
  };
  KP.chaptersOf = function (lessons) {
    var out = [], idx = {};
    lessons.forEach(function (l) {
      var key = l.part || '—';
      if (!(key in idx)) { idx[key] = out.length; out.push({ title: l.part, lessons: [] }); }
      out[idx[key]].lessons.push(l);
    });
    return out;
  };

  /* ------------------------------------------------------------------ random */
  function rng(seed) {
    var a = 0; for (var i = 0; i < String(seed).length; i++) a = (a * 31 + String(seed).charCodeAt(i)) | 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function shuffle(arr, r) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  KP.shuffle = shuffle; KP.rng = rng;
  var hasFig = function (h) { return /<img|<svg/i.test(h || ''); };
  var plain = KP.plain = function (h) { return String(h || '').replace(/<[^>]+>/g, ' ').replace(/\\\(|\\\)|\\\[|\\\]/g, '').replace(/\s+/g, ' ').trim(); };

  /* pick n items spread evenly over the chosen lessons */
  function pick(lessons, kind, n, r, used, allowFig) {
    var pools = lessons.map(function (l) {
      var arr = (kind === 'mcq' ? l.mcq : l.ex).map(function (it, i) { return { it: it, src: l.num, i: i }; })
        .filter(function (x) { return !used[x.src + ':' + kind + ':' + x.i] && (allowFig || !hasFig(kind === 'mcq' ? x.it.s + x.it.o.join('') : x.it.q)); });
      return shuffle(arr, r);
    });
    var out = [], k = 0, guard = 0;
    while (out.length < n && guard < 100000) {
      guard++;
      var live = pools.filter(function (p) { return p.length; });
      if (!live.length) break;
      var p = pools[k % pools.length]; k++;
      if (!p.length) continue;
      var x = p.shift(); used[x.src + ':' + kind + ':' + x.i] = 1; out.push(x);
    }
    return out;
  }

  /* when a book has too few written exercises (grade 12), open-ended MCQ stems become written exercises */
  var CHOICE_RE = /មួយណា|ណាមួយ|ខាងក្រោម|ត្រឹមត្រូវ|មិនពិត|ពិតឬ|សំណើណា/;
  KP.openStem = function (q) { return !CHOICE_RE.test(plain(q.s)) && plain(q.s).length > 12; };
  function mcqAsWritten(lessons, n, r, used, allowFig) {
    var ls = lessons.map(function (l) {
      return { num: l.num, ex: [], mcq: l.mcq.map(function (q, i) { return KP.openStem(q) ? q : null; }) };
    });
    var pools = ls.map(function (l) {
      return shuffle(l.mcq.map(function (q, i) { return q && { it: q, src: l.num, i: i }; }).filter(function (x) {
        return x && !used[x.src + ':mcq:' + x.i] && (allowFig || !hasFig(x.it.s));
      }), r);
    });
    var out = [], k = 0;
    while (out.length < n && pools.some(function (p) { return p.length; })) {
      var p = pools[k++ % pools.length]; if (!p.length) continue;
      var x = p.shift(); used[x.src + ':mcq:' + x.i] = 1;
      out.push({ q: x.it.s, s: '<p><b>ចម្លើយ ៖</b> ' + x.it.o[x.it.a] + '</p>' + (x.it.e || ''), src: x.src, i: 'm' + x.i, pts: 0, fromMcq: true });
    }
    return out;
  }
  KP.availability = function (bank, nums, allowFig) {
    var lessons = bank.lessons.filter(function (l) { return nums.indexOf(l.num) >= 0; }), m = 0, w = 0, o = 0;
    lessons.forEach(function (l) {
      l.mcq.forEach(function (q) { if (allowFig || !hasFig(q.s + q.o.join(''))) { m++; if (KP.openStem(q)) o++; } });
      l.ex.forEach(function (e) { if (allowFig || !hasFig(e.q)) w++; });
    });
    return { mcq: m, written: w, open: o };
  };
  /* opts: {grade, track, lessons:[num], kind, nMcq, nWritten, mcqPts, total, seed, allowFig, meta} */
  KP.generate = function (bank, opts) {
    var r = rng(opts.seed || Date.now()), used = {};
    var lessons = bank.lessons.filter(function (l) { return opts.lessons.indexOf(l.num) >= 0; });
    var mcq = pick(lessons, 'mcq', opts.nMcq, r, used, opts.allowFig).map(function (x) {
      return { s: x.it.s, o: x.it.o.slice(), a: x.it.a, e: x.it.e || '', src: x.src, i: x.i };
    });
    var wr = pick(lessons, 'ex', opts.nWritten, r, used, opts.allowFig).map(function (x) {
      return { q: x.it.q, s: x.it.s || '', src: x.src, i: x.i, pts: 0 };
    });
    if (wr.length < opts.nWritten) wr = wr.concat(mcqAsWritten(lessons, opts.nWritten - wr.length, r, used, opts.allowFig));
    var paper = { id: KP.uid(), created: Date.now(), meta: Object.assign({}, opts.meta || {}), grade: opts.grade, track: opts.track || '',
      lessons: opts.lessons.slice(), mcqPts: +opts.mcqPts || 1, mcq: mcq, written: wr, used: used };
    KP.spreadPoints(paper, +opts.total || 0);
    return paper;
  };
  KP.spreadPoints = function (paper, total) {
    var rest = Math.max(0, total - paper.mcq.length * paper.mcqPts), n = paper.written.length;
    if (!n) return;
    var base = Math.floor(rest / n), extra = rest - base * n;
    paper.written.forEach(function (w, i) { w.pts = base + (i >= n - extra ? 1 : 0); });
  };
  KP.total = function (paper) {
    return paper.mcq.length * paper.mcqPts + paper.written.reduce(function (s, w) { return s + (+w.pts || 0); }, 0);
  };
  /* replace one item by another one from the same lesson */
  KP.swap = function (bank, paper, kind, idx, allowFig) {
    var list = kind === 'mcq' ? paper.mcq : paper.written, cur = list[idx];
    var l = bank.lessons.filter(function (x) { return x.num === cur.src; })[0]; if (!l) return false;
    var key = kind === 'mcq' ? 'mcq' : 'ex', used = paper.used || (paper.used = {});
    var cand = (kind === 'mcq' ? l.mcq : l.ex).map(function (it, i) { return { it: it, i: i }; }).filter(function (x) {
      return !used[l.num + ':' + key + ':' + x.i] && (allowFig || !hasFig(kind === 'mcq' ? x.it.s + x.it.o.join('') : x.it.q));
    });
    if (!cand.length && kind !== 'mcq') {
      var alt = mcqAsWritten([l], 1, Math.random, used, allowFig);
      if (!alt.length) return false;
      if (cur.fromMcq) delete used[l.num + ':mcq:' + String(cur.i).slice(1)];
      alt[0].pts = cur.pts; list[idx] = alt[0]; return true;
    }
    if (!cand.length) return false;
    var x = cand[Math.floor(Math.random() * cand.length)];
    used[l.num + ':' + key + ':' + x.i] = 1; delete used[l.num + ':' + key + ':' + cur.i];
    list[idx] = kind === 'mcq' ? { s: x.it.s, o: x.it.o.slice(), a: x.it.a, e: x.it.e || '', src: l.num, i: x.i }
      : { q: x.it.q, s: x.it.s || '', src: l.num, i: x.i, pts: cur.pts };
    return true;
  };
  /* version k (0 = original): shuffled question order and options */
  KP.variant = function (paper, k) {
    if (!k) return paper;
    var r = rng(paper.id + '#' + k);
    var mcq = shuffle(paper.mcq, r).map(function (q) {
      var ord = shuffle(q.o.map(function (_, i) { return i; }), r);
      return Object.assign({}, q, { o: ord.map(function (i) { return q.o[i]; }), a: ord.indexOf(q.a) });
    });
    return Object.assign({}, paper, { mcq: mcq, version: k });
  };
  KP.versionLabel = function (k) { return 'វិញ្ញាសា ' + KLET[k]; };

  /* ------------------------------------------------------------------ HTML rendering */
  function optCols(opts) {
    var m = 0; opts.forEach(function (o) { m = Math.max(m, plain(o).length + (/<img|class="md"/.test(o) ? 40 : 0)); });
    return m <= 16 ? 4 : (m <= 38 ? 2 : 1);
  }
  KP.optCols = optCols;
  function headerHtml(paper) {
    var m = paper.meta || {}, t = KP.total(paper);
    var h = '<div class="kp-head">';
    if (m.kingdom !== false) h += '<div class="kp-kingdom"><b>ព្រះរាជាណាចក្រកម្ពុជា</b><b>ជាតិ សាសនា ព្រះមហាក្សត្រ</b><span class="kp-orn">❧❧❧</span></div>';
    h += '<div class="kp-org">' + (m.office ? '<div>' + esc(m.office) + '</div>' : '') + (m.school ? '<div><b>' + esc(m.school) + '</b></div>' : '') + '</div>';
    h += '<h1 class="kp-title">' + esc(m.title || KP.paperTitle(m)) + (paper.version ? ' <span class="kp-ver">(' + KP.versionLabel(paper.version) + ')</span>' : '') + '</h1>';
    var line = [];
    if (m.year) line.push('ឆ្នាំសិក្សា ៖ ' + esc(m.year));
    line.push('វិញ្ញាសា ៖ ' + esc(m.subject || 'គណិតវិទ្យា'));
    line.push('ថ្នាក់ទី ' + kh(paper.grade) + (paper.track === 'ss' ? ' (វិទ្យាសាស្ត្រសង្គម)' : paper.track === 'sc' ? ' (វិទ្យាសាស្ត្រ)' : ''));
    h += '<div class="kp-info">' + line.join(' &nbsp;·&nbsp; ') + '</div>';
    h += '<div class="kp-info">រយៈពេល ៖ ' + kh(m.duration || 60) + ' នាទី &nbsp;·&nbsp; ពិន្ទុ ៖ ' + kh(t) + (m.date ? ' &nbsp;·&nbsp; ថ្ងៃប្រឡង ៖ ' + esc(m.date) : '') + '</div>';
    if (m.studentLine !== false) h += '<div class="kp-student"><span>ឈ្មោះសិស្ស ៖ ..................................................</span><span>ថ្នាក់ ៖ ............</span><span>លេខតុ ៖ ..........</span></div>';
    h += '</div>';
    return h;
  }
  KP.renderPaper = function (paper, o) {
    o = o || {};
    var m = paper.meta || {}, h = '<div class="kp-paper ls-paper">' + headerHtml(paper);
    if (m.instructions) h += '<div class="kp-instr"><b>សេចក្ដីណែនាំ ៖</b> ' + esc(m.instructions) + '</div>';
    var part = 0;
    if (paper.mcq.length) {
      part++;
      h += '<h2 class="kp-sec">ផ្នែកទី ' + kh(part) + ' ៖ សំណួរពហុជ្រើសរើស (' + kh(paper.mcq.length) + ' សំណួរ × ' + kh(paper.mcqPts) + ' ពិន្ទុ = ' + kh(paper.mcq.length * paper.mcqPts) + ' ពិន្ទុ)</h2>';
      h += '<p class="kp-note">ជ្រើសរើសចម្លើយត្រឹមត្រូវតែមួយគត់ ។</p><ol class="kp-mcq">';
      paper.mcq.forEach(function (q, i) {
        var c = optCols(q.o);
        h += '<li class="kp-q" data-i="' + i + '"><span class="kp-qn">' + kh(i + 1) + '.</span><div class="kp-qb"><div class="kp-stem">' + q.s + '</div><div class="kp-opts c' + c + '">';
        q.o.forEach(function (op, j) {
          var right = o.answers && j === q.a;
          h += '<div class="kp-opt' + (right ? ' right' : '') + '"><span class="kp-ok">' + KLET[j] + '.</span> ' + op + '</div>';
        });
        h += '</div>' + (o.tools ? '<div class="kp-tools no-print"><button type="button" data-swap="mcq" data-i="' + i + '">⟳ ប្ដូរសំណួរ</button><button type="button" data-del="mcq" data-i="' + i + '">✕ លុប</button><small>មេរៀនទី ' + kh(q.src) + '</small></div>' : '') + '</div></li>';
      });
      h += '</ol>';
      if (m.answerGrid) h += answerGrid(paper);
    }
    if (paper.written.length) {
      part++;
      var wt = paper.written.reduce(function (s, w) { return s + (+w.pts || 0); }, 0);
      h += '<h2 class="kp-sec">ផ្នែកទី ' + kh(part) + ' ៖ លំហាត់សរសេរ (' + kh(wt) + ' ពិន្ទុ)</h2><ol class="kp-wr">';
      paper.written.forEach(function (w, i) {
        h += '<li class="kp-w" data-i="' + i + '"><div class="kp-wh"><b>លំហាត់ទី ' + kh(i + 1) + '</b> <span class="kp-pts">(' + kh(w.pts) + ' ពិន្ទុ)</span>' +
          (o.tools ? '<span class="kp-tools no-print"><label>ពិន្ទុ <input type="number" min="0" step="0.5" value="' + w.pts + '" data-pts="' + i + '"></label><button type="button" data-swap="wr" data-i="' + i + '">⟳ ប្ដូរ</button><button type="button" data-del="wr" data-i="' + i + '">✕ លុប</button><small>មេរៀនទី ' + kh(w.src) + '</small></span>' : '') +
          '</div><div class="kp-wq">' + w.q + '</div>' + (o.answers && w.s ? '<div class="kp-sol"><b>ដំណោះស្រាយ ៖</b>' + w.s + '</div>' : '') + '</li>';
      });
      h += '</ol>';
    }
    h += '<p class="kp-end">— ចប់ —</p></div>';
    return h;
  };
  function answerGrid(paper) {
    var n = paper.mcq.length, cols = Math.min(4, Math.ceil(n / 10)), per = Math.ceil(n / cols), h = '<div class="kp-grid"><b>តារាងចម្លើយ (គូសរង្វង់ជុំវិញចម្លើយដែលត្រឹមត្រូវ)</b><div class="kp-grid-cols">';
    for (var c = 0; c < cols; c++) {
      h += '<table>';
      for (var i = c * per; i < Math.min(n, (c + 1) * per); i++) {
        h += '<tr><td class="n">' + kh(i + 1) + '</td>' + paper.mcq[i].o.map(function (_, j) { return '<td><span class="bub">' + KLET[j] + '</span></td>'; }).join('') + '</tr>';
      }
      h += '</table>';
    }
    return h + '</div></div>';
  }
  KP.renderKey = function (paper) {
    var m = paper.meta || {}, h = '<div class="kp-paper kp-key ls-paper"><h1 class="kp-title">អត្រាកំណែ ៖ ' + esc(m.title || KP.paperTitle(m)) + (paper.version ? ' (' + KP.versionLabel(paper.version) + ')' : '') + '</h1>';
    if (paper.mcq.length) {
      h += '<h2 class="kp-sec">ចម្លើយសំណួរពហុជ្រើសរើស</h2><table class="kp-keytab"><tr>';
      paper.mcq.forEach(function (q, i) { h += '<td><b>' + kh(i + 1) + '</b> ' + KLET[q.a] + '</td>' + ((i + 1) % 10 === 0 && i + 1 < paper.mcq.length ? '</tr><tr>' : ''); });
      h += '</tr></table>';
    }
    if (paper.written.length) {
      h += '<h2 class="kp-sec">ដំណោះស្រាយលំហាត់សរសេរ</h2><ol class="kp-wr">';
      paper.written.forEach(function (w, i) { h += '<li class="kp-w"><div class="kp-wh"><b>លំហាត់ទី ' + kh(i + 1) + '</b> <span class="kp-pts">(' + kh(w.pts) + ' ពិន្ទុ)</span></div>' + (w.s || '<p class="kp-note">(សៀវភៅមិនមានដំណោះស្រាយលម្អិតទេ)</p>') + '</li>'; });
      h += '</ol>';
    }
    return h + '</div>';
  };
  KP.typeset = function (el) {
    if (G.renderMathInElement) G.renderMathInElement(el, { delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false, strict: 'ignore' });
  };

  /* ------------------------------------------------------------------ HTML -> LaTeX */
  function texEsc(s) {
    return s.replace(/\\/g, '\\textbackslash{}').replace(/([#$%&_{}])/g, '\\$1').replace(/~/g, '\\textasciitilde{}').replace(/\^/g, '\\textasciicircum{}').replace(/\u00a0/g, '~');
  }
  function parse(html) { return new DOMParser().parseFromString('<div id="r">' + html + '</div>', 'text/html').getElementById('r'); }
  function htmlToTex(html, ctx) {
    ctx = ctx || { images: [] };
    function walk(n) {
      if (n.nodeType === 3) return texEsc(n.nodeValue.replace(/\s+/g, ' '));
      if (n.nodeType !== 1) return '';
      var tag = n.tagName.toLowerCase(), cls = n.className || '', kids = function () { return Array.prototype.map.call(n.childNodes, walk).join(''); };
      if (tag === 'span' && /\bmi\b/.test(cls)) return '$' + n.textContent.replace(/^\s*\\\(/, '').replace(/\\\)\s*$/, '') + '$';
      if (tag === 'div' && /\bmd\b/.test(cls)) return '\n\\[' + n.textContent.replace(/^\s*\\\[/, '').replace(/\\\]\s*$/, '') + '\\]\n';
      if (tag === 'p') return kids().trim() + '\n\n';
      if (tag === 'br') return '\\\\\n';
      if (tag === 'strong' || tag === 'b') return '\\textbf{' + kids() + '}';
      if (tag === 'em' || tag === 'i') return '\\emph{' + kids() + '}';
      if (tag === 'ol' || tag === 'ul') {
        var items = Array.prototype.filter.call(n.children, function (c) { return c.tagName === 'LI'; });
        var body = items.map(function (li) { return walk(li).trim(); });
        var m = /cols(\d)/.exec(cls), cols = m ? +m[1] : 1;
        if (tag === 'ol' && /olka/.test(cls)) return '\n\\begin{tasks}(' + cols + ')\n' + body.map(function (b) { return '  \\task ' + b.replace(/\n\n+/g, ' \\par ').trim(); }).join('\n') + '\n\\end{tasks}\n';
        if (tag === 'ol') return '\n\\begin{enumerate}\n' + body.map(function (b) { return '  \\item ' + b; }).join('\n') + '\n\\end{enumerate}\n';
        return '\n\\begin{itemize}\n' + body.map(function (b) { return '  \\item ' + b; }).join('\n') + '\n\\end{itemize}\n';
      }
      if (tag === 'li') return kids();
      if (tag === 'table') {
        var rows = n.querySelectorAll('tr'), nc = 0;
        Array.prototype.forEach.call(rows, function (r) { nc = Math.max(nc, r.children.length); });
        var t = '\n\\begin{center}\\begin{tabular}{|' + new Array(nc + 1).join('c|') + '}\\hline\n';
        Array.prototype.forEach.call(rows, function (r) {
          t += Array.prototype.map.call(r.children, function (c) { return walk(c).replace(/\n+/g, ' ').trim(); }).join(' & ') + ' \\\\ \\hline\n';
        });
        return t + '\\end{tabular}\\end{center}\n';
      }
      if (tag === 'img') {
        var src = n.getAttribute('src') || '', name = 'fig/' + (n.getAttribute('data-fig') || src.split('/').pop().replace(/\.svg$/i, '')).replace(/[^\w-]/g, '').slice(0, 40) + '.png';
        ctx.images.push({ src: src, name: name });
        return '\n\\begin{center}\\includegraphics[width=0.45\\linewidth]{' + name + '}\\end{center}\n';
      }
      return kids();
    }
    return walk(parse(html)).replace(/\n{3,}/g, '\n\n').trim();
  }
  KP.htmlToTex = htmlToTex;
  KP.FONTS = ['Khmer OS Siemreap', 'Khmer OS Battambang', 'Khmer OS', 'Kantumruy Pro', 'Hanuman'];
  KP.toLatex = function (paper, o) {
    o = o || {}; var m = paper.meta || {}, ctx = { images: [] }, font = o.font || 'Khmer OS Siemreap';
    var L = [];
    L.push('% ' + (m.title || KP.paperTitle(m)) + ' — បង្កើតដោយ KPCambodianmathematics');
    L.push('% Compile with XeLaTeX (TeX Live / MiKTeX). Font: ' + font);
    L.push('\\documentclass[12pt,a4paper]{article}');
    L.push('\\usepackage[top=1.6cm,bottom=1.8cm,left=1.8cm,right=1.8cm]{geometry}');
    L.push('\\usepackage{amsmath,amssymb,mathtools}');
    L.push('\\usepackage{fontspec}');
    L.push('\\setmainfont{' + font + '}[Script=Khmer,BoldFeatures={FakeBold=2.5}]');
    L.push('\\XeTeXlinebreaklocale "km"\\XeTeXlinebreakskip=0pt plus 1pt');
    L.push('\\usepackage{graphicx,array,enumitem,tasks,fancyhdr,lastpage,xcolor}');
    L.push('\\newcommand{\\kmletter}[1]{\\ifcase#1\\or ក\\or ខ\\or គ\\or ឃ\\or ង\\or ច\\or ឆ\\or ជ\\or ឈ\\or ញ\\or ដ\\or ឋ\\fi}');
    L.push('\\settasks{label=\\kmletter{\\value{task}}.,label-format=\\bfseries,label-width=1.4em,item-indent=1.9em,column-sep=1em,before-skip=2pt,after-skip=2pt}');
    L.push('\\setlength{\\parindent}{0pt}\\setlength{\\parskip}{3pt}');
    L.push('\\pagestyle{fancy}\\fancyhf{}\\renewcommand{\\headrulewidth}{0pt}\\cfoot{\\small ទំព័រ \\thepage/\\pageref{LastPage}}');
    L.push('\\begin{document}');
    if (m.kingdom !== false) L.push('\\begin{center}{\\large\\bfseries ព្រះរាជាណាចក្រកម្ពុជា}\\\\[2pt]{\\large\\bfseries ជាតិ សាសនា ព្រះមហាក្សត្រ}\\\\[-2pt]{\\large ❧❧❧}\\end{center}');
    if (m.office || m.school) L.push('\\vspace{-6pt}' + (m.office ? texEsc(m.office) + '\\\\' : '') + (m.school ? '\\textbf{' + texEsc(m.school) + '}' : '') + '\n');
    L.push('\\begin{center}{\\Large\\bfseries ' + texEsc(m.title || KP.paperTitle(m)) + (paper.version ? ' (' + KP.versionLabel(paper.version) + ')' : '') + '}\\\\[4pt]');
    var info = [];
    if (m.year) info.push('ឆ្នាំសិក្សា ៖ ' + texEsc(m.year));
    info.push('វិញ្ញាសា ៖ ' + texEsc(m.subject || 'គណិតវិទ្យា'));
    info.push('ថ្នាក់ទី ' + kh(paper.grade) + (paper.track === 'ss' ? ' (វិទ្យាសាស្ត្រសង្គម)' : paper.track === 'sc' ? ' (វិទ្យាសាស្ត្រ)' : ''));
    L.push(info.join('\\quad ') + '\\\\');
    L.push('រយៈពេល ៖ ' + kh(m.duration || 60) + ' នាទី\\quad ពិន្ទុ ៖ ' + kh(KP.total(paper)) + (m.date ? '\\quad ថ្ងៃប្រឡង ៖ ' + texEsc(m.date) : '') + '\\end{center}');
    if (m.studentLine !== false) L.push('ឈ្មោះសិស្ស ៖ \\makebox[7cm]{\\dotfill}\\quad ថ្នាក់ ៖ \\makebox[2cm]{\\dotfill}\\quad លេខតុ ៖ \\makebox[2cm]{\\dotfill}\\par\\noindent\\rule{\\linewidth}{0.6pt}');
    if (m.instructions) L.push('\\textbf{សេចក្ដីណែនាំ ៖} ' + texEsc(m.instructions) + '\n');
    var part = 0;
    if (paper.mcq.length) {
      part++;
      L.push('\\section*{ផ្នែកទី ' + kh(part) + ' ៖ សំណួរពហុជ្រើសរើស (' + kh(paper.mcq.length) + ' × ' + kh(paper.mcqPts) + ' = ' + kh(paper.mcq.length * paper.mcqPts) + ' ពិន្ទុ)}');
      L.push('\\begin{enumerate}[label=\\arabic*.,leftmargin=*,itemsep=6pt]');
      paper.mcq.forEach(function (q) {
        L.push('\\item ' + htmlToTex(q.s, ctx));
        L.push('\\begin{tasks}(' + optCols(q.o) + ')');
        q.o.forEach(function (op) { L.push('  \\task ' + htmlToTex(op, ctx).replace(/\n\n+/g, ' ')); });
        L.push('\\end{tasks}');
      });
      L.push('\\end{enumerate}');
    }
    if (paper.written.length) {
      part++;
      L.push('\\section*{ផ្នែកទី ' + kh(part) + ' ៖ លំហាត់សរសេរ (' + kh(paper.written.reduce(function (s, w) { return s + (+w.pts || 0); }, 0)) + ' ពិន្ទុ)}');
      paper.written.forEach(function (w, i) {
        L.push('\\paragraph{លំហាត់ទី ' + kh(i + 1) + ' (' + kh(w.pts) + ' ពិន្ទុ)}\\mbox{}\\\\');
        L.push(htmlToTex(w.q, ctx) + '\n');
      });
    }
    L.push('\\begin{center}--- ចប់ ---\\end{center}');
    if (o.key) {
      L.push('\\newpage\\begin{center}{\\Large\\bfseries អត្រាកំណែ}\\end{center}');
      if (paper.mcq.length) {
        L.push('\\textbf{ចម្លើយសំណួរពហុជ្រើសរើស ៖}\\par');
        L.push('\\begin{tabular}{|' + new Array(Math.min(10, paper.mcq.length) + 1).join('c|') + '}\\hline');
        for (var s = 0; s < paper.mcq.length; s += 10) {
          var row = paper.mcq.slice(s, s + 10).map(function (q, j) { return kh(s + j + 1) + '. ' + KLET[q.a]; });
          while (row.length < Math.min(10, paper.mcq.length)) row.push('');
          L.push(row.join(' & ') + '\\\\\\hline');
        }
        L.push('\\end{tabular}\\par\\medskip');
      }
      paper.written.forEach(function (w, i) {
        L.push('\\paragraph{ដំណោះស្រាយលំហាត់ទី ' + kh(i + 1) + '}\\mbox{}\\\\');
        L.push((w.s ? htmlToTex(w.s, ctx) : '(សៀវភៅមិនមានដំណោះស្រាយលម្អិតទេ)') + '\n');
      });
    }
    L.push('\\end{document}');
    return { tex: L.join('\n') + '\n', images: ctx.images };
  };

  /* ------------------------------------------------------------------ zip (stored) */
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { var c = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  var enc = new TextEncoder();
  KP.zip = function (files) {
    var parts = [], central = [], off = 0;
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    files.forEach(function (f) {
      var data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, name = enc.encode(f.name), crc = crc32(data);
      var head = [].concat([0x50, 0x4b, 3, 4], u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0));
      parts.push(new Uint8Array(head), name, data);
      central.push(new Uint8Array([].concat([0x50, 0x4b, 1, 2], u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off))), name);
      off += head.length + name.length + data.length;
    });
    var csize = central.reduce(function (s, a) { return s + a.length; }, 0);
    var end = new Uint8Array([].concat([0x50, 0x4b, 5, 6], u16(0), u16(0), u16(files.length), u16(files.length), u32(csize), u32(off), u16(0)));
    return new Blob(parts.concat(central, [end]), { type: 'application/zip' });
  };

  /* ------------------------------------------------------------------ images: svg -> png */
  KP.svgToPng = function (src, maxW) {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth || 300, h = img.naturalHeight || 200, sc = Math.min(1, (maxW || 440) / w), k = 3;
        var c = document.createElement('canvas'); c.width = Math.round(w * sc * k); c.height = Math.round(h * sc * k);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        try { c.toBlob(function (b) {
          if (!b) return res(null);
          b.arrayBuffer().then(function (ab) { res({ data: new Uint8Array(ab), w: Math.round(w * sc), h: Math.round(h * sc) }); });
        }, 'image/png'); } catch (e) { res(null); }
      };
      img.onerror = function () { res(null); };
      img.src = src;
    });
  };

  /* ------------------------------------------------------------------ MathML -> OMML (Word equations) */
  var xe = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var NARY = '∑∏∐∫∬∭∮⋃⋂⋁⋀';
  function mr(text, plainStyle, font) {
    if (text === '') return '';
    var rp = '';
    if (plainStyle === 'nor') rp = '<m:rPr><m:nor/></m:rPr>';
    else if (plainStyle) rp = '<m:rPr><m:sty m:val="p"/></m:rPr>';
    var wr = font ? '<w:rPr><w:rFonts w:ascii="' + font + '" w:hAnsi="' + font + '" w:cs="' + font + '"/></w:rPr>' : '<w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr>';
    return '<m:r>' + rp + wr + '<m:t xml:space="preserve">' + xe(text) + '</m:t></m:r>';
  }
  function kids(n) { return Array.prototype.filter.call(n.childNodes, function (c) { return c.nodeType === 1; }); }
  function mmlToOmml(node, font) {
    function conv(n) {
      var t = n.localName || n.nodeName.toLowerCase(), k = kids(n);
      switch (t) {
        case 'math': case 'semantics': case 'mstyle': case 'mpadded': case 'menclose': case 'none':
          return seq(k);
        case 'annotation': case 'annotation-xml': case 'mphantom': return '';
        case 'mrow': return row(n, k);
        case 'mi': { var s = n.textContent; return mr(s, s.length > 1 || n.getAttribute('mathvariant') === 'normal'); }
        case 'mn': return mr(n.textContent, true);
        case 'mo': return mr(n.textContent, true);
        case 'mtext': return mr(n.textContent, 'nor', font);
        case 'ms': return mr(n.textContent, 'nor', font);
        case 'mspace': return mr('\u2009', true);
        case 'mfrac': return '<m:f>' + (n.getAttribute('linethickness') === '0px' || n.getAttribute('linethickness') === '0' ? '<m:fPr><m:type m:val="noBar"/></m:fPr>' : '') + '<m:num>' + conv(k[0]) + '</m:num><m:den>' + conv(k[1]) + '</m:den></m:f>';
        case 'msqrt': return '<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>' + seq(k) + '</m:e></m:rad>';
        case 'mroot': return '<m:rad><m:deg>' + conv(k[1]) + '</m:deg><m:e>' + conv(k[0]) + '</m:e></m:rad>';
        case 'msup': return '<m:sSup><m:e>' + conv(k[0]) + '</m:e><m:sup>' + conv(k[1]) + '</m:sup></m:sSup>';
        case 'msub': return '<m:sSub><m:e>' + conv(k[0]) + '</m:e><m:sub>' + conv(k[1]) + '</m:sub></m:sSub>';
        case 'msubsup': return '<m:sSubSup><m:e>' + conv(k[0]) + '</m:e><m:sub>' + conv(k[1]) + '</m:sub><m:sup>' + conv(k[2]) + '</m:sup></m:sSubSup>';
        case 'mover': {
          var acc = k[1] && (k[1].localName === 'mo') ? k[1].textContent.trim() : '';
          if (acc === '‾' || acc === '¯' || acc === '\u0305') return '<m:bar><m:barPr><m:pos m:val="top"/></m:barPr><m:e>' + conv(k[0]) + '</m:e></m:bar>';
          var AMAP = { 'ˉ': '\u0304', '→': '\u20D7', '⃗': '\u20D7', '^': '\u0302', 'ˆ': '\u0302', '~': '\u0303', '˜': '\u0303', '˙': '\u0307', '¨': '\u0308', 'ˇ': '\u030C', '←': '\u20D6', '↔': '\u20E1', '´': '\u0301', '`': '\u0300' };
          if (acc && (AMAP[acc] || n.getAttribute('accent') === 'true'))
            return '<m:acc><m:accPr><m:chr m:val="' + xe(AMAP[acc] || acc) + '"/></m:accPr><m:e>' + conv(k[0]) + '</m:e></m:acc>';
          if (k[0].localName === 'mo' && NARY.indexOf(k[0].textContent) >= 0) return nary(k[0].textContent, '', conv(k[1]));
          return '<m:limUpp><m:e>' + conv(k[0]) + '</m:e><m:lim>' + conv(k[1]) + '</m:lim></m:limUpp>';
        }
        case 'munder':
          if (k[1] && k[1].localName === 'mo' && /^[‾_\u0332]$/.test(k[1].textContent.trim())) return '<m:bar><m:barPr><m:pos m:val="bot"/></m:barPr><m:e>' + conv(k[0]) + '</m:e></m:bar>';
          if (k[0].localName === 'mo' && NARY.indexOf(k[0].textContent) >= 0) return nary(k[0].textContent, conv(k[1]), '');
          return '<m:limLow><m:e>' + conv(k[0]) + '</m:e><m:lim>' + conv(k[1]) + '</m:lim></m:limLow>';
        case 'munderover':
          if (k[0].localName === 'mo' && NARY.indexOf(k[0].textContent) >= 0) return nary(k[0].textContent, conv(k[1]), conv(k[2]));
          return '<m:limUpp><m:e><m:limLow><m:e>' + conv(k[0]) + '</m:e><m:lim>' + conv(k[1]) + '</m:lim></m:limLow></m:e><m:lim>' + conv(k[2]) + '</m:lim></m:limUpp>';
        case 'mtable': return table(n, false);
        case 'mtr': case 'mlabeledtr': return seq(k);
        case 'mtd': return seq(k);
        default: return seq(k);
      }
    }
    function nary(chr, sub, sup) {
      return '<m:nary><m:naryPr><m:chr m:val="' + xe(chr) + '"/><m:limLoc m:val="undOvr"/>' + (sub ? '' : '<m:subHide m:val="1"/>') + (sup ? '' : '<m:supHide m:val="1"/>') + '</m:naryPr><m:sub>' + sub + '</m:sub><m:sup>' + sup + '</m:sup><m:e/></m:nary>';
    }
    function seq(k) { return k.map(conv).join(''); }
    function table(n, matrix) {
      var rows = kids(n).filter(function (r) { return /mtr/.test(r.localName); });
      if (matrix) return '<m:m>' + rows.map(function (r) { return '<m:mr>' + kids(r).map(function (c) { return '<m:e>' + conv(c) + '</m:e>'; }).join('') + '</m:mr>'; }).join('') + '</m:m>';
      return '<m:eqArr>' + rows.map(function (r) { return '<m:e>' + kids(r).map(conv).join('') + '</m:e>'; }).join('') + '</m:eqArr>';
    }
    function isFence(e) { return e && e.localName === 'mo' && e.getAttribute('fence') === 'true'; }
    function row(n, k) {
      // \left( ... \right) and matrices: fence ... fence -> delimiter object
      if (k.length >= 2 && isFence(k[0]) && isFence(k[k.length - 1])) {
        var inner = k.slice(1, -1), beg = k[0].textContent, end = k[k.length - 1].textContent;
        var body = inner.length === 1 && inner[0].localName === 'mtable' ? table(inner[0], beg !== '{' && beg !== '') : seq(inner);
        return '<m:d><m:dPr><m:begChr m:val="' + xe(beg) + '"/><m:endChr m:val="' + xe(end) + '"/></m:dPr><m:e>' + body + '</m:e></m:d>';
      }
      if (k.length >= 2 && isFence(k[0]) && k[1].localName === 'mtable')
        return '<m:d><m:dPr><m:begChr m:val="' + xe(k[0].textContent) + '"/><m:endChr m:val=""/></m:dPr><m:e>' + table(k[1], false) + '</m:e></m:d>' + seq(k.slice(2));
      return seq(k);
    }
    return conv(node);
  }
  KP.texToOmml = function (tex, display, font) {
    var html;
    try { html = G.katex.renderToString(tex, { output: 'mathml', throwOnError: true, displayMode: !!display, strict: 'ignore' }); }
    catch (e) { return null; }
    var doc = new DOMParser().parseFromString(html.replace(/^<span[^>]*>/, '').replace(/<\/span>$/, ''), 'application/xml');
    var math = doc.getElementsByTagName('math')[0];
    if (!math || doc.getElementsByTagName('parsererror').length) return null;
    var body = mmlToOmml(math, font);
    return display ? '<m:oMathPara><m:oMath>' + body + '</m:oMath></m:oMathPara>' : '<m:oMath>' + body + '</m:oMath>';
  };

  /* ------------------------------------------------------------------ HTML -> WordprocessingML */
  function Docx(font) {
    this.font = font; this.media = []; this.pending = [];
  }
  Docx.prototype.rPr = function (o) {
    o = o || {}; var f = this.font, sz = o.sz || 24;
    return '<w:rPr><w:rFonts w:ascii="' + f + '" w:hAnsi="' + f + '" w:cs="' + f + '" w:eastAsia="' + f + '"/>' + (o.b ? '<w:b/><w:bCs/>' : '') + (o.i ? '<w:i/><w:iCs/>' : '') + (o.color ? '<w:color w:val="' + o.color + '"/>' : '') + '<w:sz w:val="' + sz + '"/><w:szCs w:val="' + sz + '"/></w:rPr>';
  };
  Docx.prototype.run = function (text, o) {
    if (!text) return '';
    return '<w:r>' + this.rPr(o) + '<w:t xml:space="preserve">' + xe(text) + '</w:t></w:r>';
  };
  Docx.prototype.p = function (inner, o) {
    o = o || {};
    var pp = '<w:pPr>' + (o.style ? '<w:pStyle w:val="' + o.style + '"/>' : '') + (o.keep ? '<w:keepNext/>' : '') + '<w:spacing w:before="' + (o.before || 0) + '" w:after="' + (o.after == null ? 60 : o.after) + '" w:line="' + (o.line || 300) + '" w:lineRule="auto"/>' + (o.ind ? '<w:ind w:left="' + o.ind + '" w:hanging="' + (o.hang || 0) + '"/>' : '') + (o.jc ? '<w:jc w:val="' + o.jc + '"/>' : '') + '</w:pPr>';
    return '<w:p>' + pp + inner + '</w:p>';
  };
  /* inline content of an element -> runs */
  Docx.prototype.inline = function (node, st) {
    var self = this, out = '';
    st = st || {};
    Array.prototype.forEach.call(node.childNodes, function (n) {
      if (n.nodeType === 3) { out += self.run(n.nodeValue.replace(/\s+/g, ' '), st); return; }
      if (n.nodeType !== 1) return;
      var tag = n.tagName.toLowerCase(), cls = n.className || '';
      if (tag === 'span' && /\bmi\b/.test(cls)) {
        var tex = n.textContent.replace(/^\s*\\\(/, '').replace(/\\\)\s*$/, '');
        out += KP.texToOmml(tex, false, self.font) || self.run(tex, { i: true });
      } else if (tag === 'strong' || tag === 'b') out += self.inline(n, Object.assign({}, st, { b: true }));
      else if (tag === 'em' || tag === 'i') out += self.inline(n, Object.assign({}, st, { i: true }));
      else if (tag === 'br') out += '<w:r><w:br/></w:r>';
      else if (tag === 'img') out += self.image(n.getAttribute('src'));
      else out += self.inline(n, st);
    });
    return out;
  };
  Docx.prototype.image = function (src) {
    var id = 'rIdImg' + (this.media.length + 1), name = 'image' + (this.media.length + 1) + '.png', ph = '@@IMG' + this.media.length + '@@';
    this.media.push({ id: id, name: name, src: src, ph: ph });
    return ph;
  };
  Docx.prototype.drawing = function (m, w, h) {
    var cx = Math.round(w * 9525), cy = Math.round(h * 9525), n = this.media.indexOf(m) + 1;
    return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + cx + '" cy="' + cy + '"/><wp:docPr id="' + n + '" name="Picture ' + n + '"/>' +
      '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      '<pic:nvPicPr><pic:cNvPr id="' + n + '" name="' + m.name + '"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="' + m.id + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
  };
  /* block content of an html fragment -> paragraphs */
  Docx.prototype.blocks = function (html, o) {
    o = o || {}; var self = this, out = [], ind = o.ind || 0;
    function flushInline(buf) { if (buf.trim()) out.push(self.p(buf, { ind: ind })); }
    function walk(node, lead) {
      var buf = lead || '';
      Array.prototype.forEach.call(node.childNodes, function (n) {
        if (n.nodeType === 3) { buf += self.run(n.nodeValue.replace(/\s+/g, ' ')); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName.toLowerCase(), cls = n.className || '';
        if (tag === 'p') { flushInline(buf + self.inline(n)); buf = ''; }
        else if (tag === 'div' && /\bmd\b/.test(cls)) {
          flushInline(buf); buf = '';
          var tex = n.textContent.replace(/^\s*\\\[/, '').replace(/\\\]\s*$/, '');
          out.push(self.p(KP.texToOmml(tex, true, self.font) || self.run(tex), { ind: ind, jc: 'center' }));
        } else if (tag === 'ol' || tag === 'ul') {
          flushInline(buf); buf = '';
          var items = Array.prototype.filter.call(n.children, function (c) { return c.tagName === 'LI'; });
          var m = /cols(\d)/.exec(cls), cols = m ? +m[1] : 1, ka = tag === 'ol' && /olka/.test(cls);
          var lab = function (i) { return ka ? KLET[i] + '. ' : (tag === 'ol' ? kh(i + 1) + '. ' : '• '); };
          if (cols > 1) out.push(self.grid(items.map(function (li, i) { return self.run(lab(i)) + self.inline(li); }), cols, ind));
          else items.forEach(function (li, i) {
            var sub = new Docx(self.font); sub.media = self.media;
            var lead = self.run(lab(i));
            var hasBlock = li.querySelector('ol,ul,div.md,table');
            if (!hasBlock) out.push(self.p(lead + self.inline(li), { ind: ind + 360, hang: 300 }));
            else { var r = self.blocks(li.innerHTML, { ind: ind + 360 }); if (r.length) r[0] = r[0].replace('<w:pPr>', '<w:pPr>').replace(/(<w:pPr>.*?<\/w:pPr>)/, '$1' + lead); out.push.apply(out, r); }
          });
        } else if (tag === 'table') { flushInline(buf); buf = ''; out.push(self.table(n, ind)); }
        else if (tag === 'div' || tag === 'li' || tag === 'section') { flushInline(buf); buf = ''; walk(n); }
        else buf += self.inline({ childNodes: [n] });
      });
      flushInline(buf);
    }
    walk(parse(html), o.lead);
    if (o.lead && out.length && out[0].indexOf(o.lead) < 0) out[0] = out[0].replace(/(<w:pPr>.*?<\/w:pPr>)/, '$1' + o.lead);
    return out;
  };
  Docx.prototype.grid = function (cells, cols, ind) {
    var w = Math.floor((9800 - (ind || 0)) / cols), rows = [];
    for (var i = 0; i < cells.length; i += cols) rows.push(cells.slice(i, i + cols));
    var tbl = '<w:tbl><w:tblPr><w:tblW w:w="' + (w * cols) + '" w:type="dxa"/><w:tblInd w:w="' + ((ind || 0) + 200) + '" w:type="dxa"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="40" w:type="dxa"/><w:right w:w="40" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' + new Array(cols + 1).join('<w:gridCol w:w="' + w + '"/>') + '</w:tblGrid>';
    var self = this;
    rows.forEach(function (r) {
      tbl += '<w:tr>';
      for (var c = 0; c < cols; c++) tbl += '<w:tc><w:tcPr><w:tcW w:w="' + w + '" w:type="dxa"/></w:tcPr>' + self.p(r[c] || '', { after: 20 }) + '</w:tc>';
      tbl += '</w:tr>';
    });
    return tbl + '</w:tbl>';
  };
  Docx.prototype.table = function (t, ind) {
    var self = this, rows = t.querySelectorAll('tr'), nc = 0;
    Array.prototype.forEach.call(rows, function (r) { nc = Math.max(nc, r.children.length); });
    var b = '<w:tblBorders><w:top w:val="single" w:sz="6"/><w:left w:val="single" w:sz="6"/><w:bottom w:val="single" w:sz="6"/><w:right w:val="single" w:sz="6"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders>';
    var x = '<w:tbl><w:tblPr><w:tblInd w:w="' + ((ind || 0) + 200) + '" w:type="dxa"/>' + b + '</w:tblPr><w:tblGrid>' + new Array(nc + 1).join('<w:gridCol/>') + '</w:tblGrid>';
    Array.prototype.forEach.call(rows, function (r) {
      x += '<w:tr>';
      Array.prototype.forEach.call(r.children, function (c) { x += '<w:tc>' + self.p(self.inline(c, { b: c.tagName === 'TH' }), { jc: 'center', after: 20 }) + '</w:tc>'; });
      x += '</w:tr>';
    });
    return x + '</w:tbl>';
  };

  KP.toDocx = function (paper, o) {
    o = o || {};
    var m = paper.meta || {}, font = o.font || 'Khmer OS Siemreap', d = new Docx(font), B = [];
    var P = function (inner, opt) { B.push(d.p(inner, opt)); };
    if (m.kingdom !== false) {
      P(d.run('ព្រះរាជាណាចក្រកម្ពុជា', { b: true, sz: 28 }), { jc: 'center', after: 0 });
      P(d.run('ជាតិ សាសនា ព្រះមហាក្សត្រ', { b: true, sz: 28 }), { jc: 'center', after: 0 });
      P(d.run('❧❧❧', { sz: 24 }), { jc: 'center', after: 60 });
    }
    if (m.office) P(d.run(m.office), { after: 0 });
    if (m.school) P(d.run(m.school, { b: true }), { after: 120 });
    P(d.run((m.title || KP.paperTitle(m)) + (paper.version ? ' (' + KP.versionLabel(paper.version) + ')' : ''), { b: true, sz: 32 }), { jc: 'center', before: 120, after: 60 });
    var info = [];
    if (m.year) info.push('ឆ្នាំសិក្សា ៖ ' + m.year);
    info.push('វិញ្ញាសា ៖ ' + (m.subject || 'គណិតវិទ្យា'));
    info.push('ថ្នាក់ទី ' + kh(paper.grade) + (paper.track === 'ss' ? ' (វិទ្យាសាស្ត្រសង្គម)' : paper.track === 'sc' ? ' (វិទ្យាសាស្ត្រ)' : ''));
    P(d.run(info.join('   ·   ')), { jc: 'center', after: 0 });
    P(d.run('រយៈពេល ៖ ' + kh(m.duration || 60) + ' នាទី   ·   ពិន្ទុ ៖ ' + kh(KP.total(paper)) + (m.date ? '   ·   ថ្ងៃប្រឡង ៖ ' + m.date : '')), { jc: 'center', after: 120 });
    if (m.studentLine !== false) B.push('<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="000000"/></w:pBdr><w:spacing w:after="160"/></w:pPr>' + d.run('ឈ្មោះសិស្ស ៖ ....................................................   ថ្នាក់ ៖ ...............   លេខតុ ៖ ...............') + '</w:p>');
    if (m.instructions) P(d.run('សេចក្ដីណែនាំ ៖ ', { b: true }) + d.run(m.instructions), { after: 120 });
    var part = 0;
    if (paper.mcq.length) {
      part++;
      P(d.run('ផ្នែកទី ' + kh(part) + ' ៖ សំណួរពហុជ្រើសរើស (' + kh(paper.mcq.length) + ' × ' + kh(paper.mcqPts) + ' = ' + kh(paper.mcq.length * paper.mcqPts) + ' ពិន្ទុ)', { b: true, sz: 26 }), { before: 160, after: 80, keep: true });
      paper.mcq.forEach(function (q, i) {
        B.push.apply(B, d.blocks(q.s, { lead: d.run(kh(i + 1) + '. ', { b: true }), ind: 0 }));
        var cells = q.o.map(function (op, j) { return d.run(KLET[j] + '. ') + d.inline(parse(op)); });
        B.push(d.grid(cells, KP.optCols(q.o), 300));
        P('', { after: 40 });
      });
    }
    if (paper.written.length) {
      part++;
      P(d.run('ផ្នែកទី ' + kh(part) + ' ៖ លំហាត់សរសេរ (' + kh(paper.written.reduce(function (s, w) { return s + (+w.pts || 0); }, 0)) + ' ពិន្ទុ)', { b: true, sz: 26 }), { before: 200, after: 80, keep: true });
      paper.written.forEach(function (w, i) {
        P(d.run('លំហាត់ទី ' + kh(i + 1) + ' ', { b: true }) + d.run('(' + kh(w.pts) + ' ពិន្ទុ)', { i: true }), { before: 100, after: 40, keep: true });
        B.push.apply(B, d.blocks(w.q, { ind: 200 }));
      });
    }
    P(d.run('— ចប់ —', { b: true }), { jc: 'center', before: 200 });
    if (o.key) {
      B.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
      P(d.run('អត្រាកំណែ', { b: true, sz: 32 }), { jc: 'center', after: 120 });
      if (paper.mcq.length) {
        P(d.run('ចម្លើយសំណួរពហុជ្រើសរើស ៖', { b: true }));
        B.push(d.grid(paper.mcq.map(function (q, i) { return d.run(kh(i + 1) + '. ' + KLET[q.a]); }), 10, 0));
      }
      paper.written.forEach(function (w, i) {
        P(d.run('ដំណោះស្រាយលំហាត់ទី ' + kh(i + 1), { b: true }), { before: 160, keep: true });
        if (w.s) B.push.apply(B, d.blocks(w.s, { ind: 200 })); else P(d.run('(សៀវភៅមិនមានដំណោះស្រាយលម្អិតទេ)', { i: true }));
      });
    }
    // images
    return Promise.all(d.media.map(function (mm) { return KP.svgToPng(mm.src, 380); })).then(function (pngs) {
      var body = B.join('');
      d.media.forEach(function (mm, i) {
        var pg = pngs[i];
        body = body.split(mm.ph).join(pg ? d.drawing(mm, pg.w, pg.h) : d.run('[រូប]'));
      });
      var sect = '<w:sectPr><w:footerReference w:type="default" r:id="rIdFtr"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1000" w:right="1000" w:bottom="1000" w:left="1100" w:header="500" w:footer="500" w:gutter="0"/></w:sectPr>';
      var NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
      var doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ' + NS + '><w:body>' + body + sect + '</w:body></w:document>';
      var footer = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr ' + NS + '><w:p><w:pPr><w:jc w:val="center"/></w:pPr>' + d.run('ទំព័រ ', { sz: 18 }) + '<w:r>' + d.rPr({ sz: 18 }) + '<w:fldChar w:fldCharType="begin"/></w:r><w:r>' + d.rPr({ sz: 18 }) + '<w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r>' + d.rPr({ sz: 18 }) + '<w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>';
      var styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="' + font + '" w:hAnsi="' + font + '" w:cs="' + font + '" w:eastAsia="' + font + '"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:bidi="km-KH"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="60" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>';
      var rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdFtr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' +
        d.media.map(function (mm, i) { return pngs[i] ? '<Relationship Id="' + mm.id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/' + mm.name + '"/>' : ''; }).join('') + '</Relationships>';
      var ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>';
      var root = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>';
      var core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>' + xe(m.title || KP.paperTitle(m)) + '</dc:title><dc:creator>KPCambodianmathematics</dc:creator></cp:coreProperties>';
      var files = [{ name: '[Content_Types].xml', data: ct }, { name: '_rels/.rels', data: root }, { name: 'docProps/core.xml', data: core },
        { name: 'word/document.xml', data: doc }, { name: 'word/styles.xml', data: styles }, { name: 'word/footer1.xml', data: footer }, { name: 'word/_rels/document.xml.rels', data: rels }];
      d.media.forEach(function (mm, i) { if (pngs[i]) files.push({ name: 'word/media/' + mm.name, data: pngs[i].data }); });
      var z = KP.zip(files);
      return new Blob([z], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    });
  };

  KP.download = function (blob, name) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  };
  KP.latexZip = function (paper, o) {
    var r = KP.toLatex(paper, o), seen = {}, imgs = r.images.filter(function (x) { if (seen[x.name]) return false; seen[x.name] = 1; return true; });
    return Promise.all(imgs.map(function (x) { return KP.svgToPng(x.src, 600); })).then(function (pngs) {
      var tex = r.tex;
      imgs.forEach(function (x, i) { if (!pngs[i]) tex = tex.split('\\includegraphics[width=0.45\\linewidth]{' + x.name + '}').join('[រូប]'); });
      var files = [{ name: (o && o.base || 'exam') + '.tex', data: tex }];
      imgs.forEach(function (x, i) { if (pngs[i]) files.push({ name: x.name, data: pngs[i].data }); });
      return { tex: tex, zip: KP.zip(files), hasImages: files.length > 1 };
    });
  };
})(window);
