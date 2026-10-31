/* Download a slide deck as PowerPoint (.pptx) or LaTeX Beamer (.zip).
   Loaded on demand by slides.js (Studio → ⬇ ទាញយក); the libraries in static/js/vendor/ are only loaded here.
   PowerPoint: each slide is painted off-screen exactly like the Studio, the artwork (background, shapes, figures)
   becomes one picture, plain lines of text become editable text boxes, and lines that hold maths or tables
   become pictures at the same place. Beamer: the deck data is converted to XeLaTeX source + figure PNGs. */
(function () {
  'use strict';
  var VENDOR = 'static/js/vendor/';
  var PX = 96;                                   // 1280 px = 13.333 in, PowerPoint's 16:9 slide
  var BODY_FONT = 'Khmer OS Battambang', HEAD_FONT = 'Khmer OS Muol Light';

  function load(src) {
    return new Promise(function (ok, fail) {
      if (document.querySelector('script[data-src="' + VENDOR + src + '"]')) return ok();
      var s = document.createElement('script'); s.src = VENDOR + src; s.dataset.src = VENDOR + src;
      s.onload = ok; s.onerror = function () { fail(new Error('មិនអាចផ្ទុក ' + src)); };
      document.head.appendChild(s);
    });
  }
  function busy() {
    var o = document.createElement('div'); o.className = 'kpx-busy'; o.innerHTML = '<div>⏳ កំពុងរៀបចំ…</div>';
    document.body.appendChild(o);
    return { set: function (t) { o.firstChild.textContent = '⏳ ' + t; }, done: function () { o.remove(); } };
  }
  function fileName(deck, ext) { return String(deck.name || 'slides').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim() + '.' + ext; }
  function save(blob, name) {
    api.last = { blob: blob, name: name };
    if (api.noSave) return;
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  }
  function nextFrame() { return new Promise(function (r) { setTimeout(r, 30); }); }

  // an off-screen 1280×720 stage the Studio's own paint() draws into
  function makeStage() {
    var host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;width:1280px;height:720px;z-index:-1;pointer-events:none;overflow:hidden';
    var st = document.createElement('div'); st.className = 'sl-stage';
    host.appendChild(st); document.body.appendChild(host);
    return { host: host, st: st };
  }
  function shot(node, scale, bg) {
    return window.html2canvas(node, { scale: scale, backgroundColor: bg, useCORS: true, logging: false });
  }
  // Draw a node with the browser's own layout engine: the node + the page's CSS (fonts embedded as data URLs)
  // inside an SVG <foreignObject>. Both html2canvas and html-to-image misplace KaTeX fractions; this does not.
  var FONT_FAMILIES = /KaTeX|Battambang|Kantumruy|Koulen|Montserrat/;
  var cssPromise;
  function dataURL(url) {
    return fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
      return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { ok(fr.result); }; fr.readAsDataURL(b); });
    }).catch(function () { return null; });
  }
  function pageCSS() {
    if (cssPromise) return cssPromise;
    var texts = Array.prototype.map.call(document.styleSheets, function (sh) {
      var base = sh.href || location.href;
      var rules = null;
      try { rules = sh.cssRules; } catch (e) { rules = null; }      // cross-origin sheet (Google Fonts): fetch it
      var got = rules ? Promise.resolve(Array.prototype.map.call(rules, function (r) { return r.cssText; }).join('\n'))
                      : fetch(sh.href).then(function (r) { return r.text(); }).catch(function () { return ''; });
      return got.then(function (css) {
        return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, function (m, q, u) {
          return /^(data:|#)/.test(u) ? m : 'url("' + new URL(u, base).href + '")';
        });
      });
    });
    cssPromise = Promise.all(texts).then(function (parts) {
      var css = parts.join('\n'), jobs = [];
      // keep only the @font-face blocks the slides use, with their files inlined
      css = css.replace(/@font-face\s*\{[^}]*\}/g, function (block) {
        if (!FONT_FAMILIES.test(block)) return '';
        var key = '\u0001' + jobs.length + '\u0001';
        var u = /url\("([^"]+\.(?:woff2|woff|ttf|otf)[^"]*)"\)/.exec(block) || /url\("([^"]+)"\)/.exec(block);
        jobs.push(u ? dataURL(u[1]).then(function (d) {
          return d ? block.split(u[1]).join(d).replace(/,?\s*url\("(?!data:)[^"]*"\)\s*(format\([^)]*\))?/g, '') : '';
        }) : Promise.resolve(block));
        return key;
      });
      return Promise.all(jobs).then(function (done) {
        return css.replace(/\u0001(\d+)\u0001/g, function (m, k) { return done[+k]; })
                  .replace(/url\("(?!data:)[^"]*"\)/g, 'none');              // other pictures are not needed in maths passes
      });
    });
    return cssPromise;
  }
  function drawDom(node, w, h, scale) {
    return pageCSS().then(function (css) {
      var html = new XMLSerializer().serializeToString(node);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * scale + '" height="' + h * scale + '">' +
        '<foreignObject x="0" y="0" width="' + w + '" height="' + h + '" transform="scale(' + scale + ')">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="width:' + w + 'px;height:' + h + 'px"><style><![CDATA[' + css.replace(/\]\]>/g, '') + ']]></style>' +
        html + '</div></foreignObject></svg>';
      var img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      return img.decode().then(function () {
        var c = document.createElement('canvas'); c.width = w * scale; c.height = h * scale;
        c.getContext('2d').drawImage(img, 0, 0);
        return c;
      });
    });
  }
  function rectIn(node, st) {
    var a = node.getBoundingClientRect(), b = st.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  }

  /* ---------------- PowerPoint ---------------- */
  // split a rendered text box into one block per visual line group (<br>, tables, display maths)
  function splitLines(inner) {
    var lines = [], cur = [];
    var push = function (list, block) {
      var d = document.createElement('div'); d.className = 'kpx-line';
      list.forEach(function (n) { d.appendChild(n); });
      if (!block && !d.textContent.trim() && !d.querySelector('img,svg')) d.appendChild(document.createTextNode('\u00a0'));
      lines.push(d);
    };
    Array.prototype.slice.call(inner.childNodes).forEach(function (n) {
      var block = /^(TABLE|PRE|DIV)$/.test(n.nodeName) || (n.classList && n.classList.contains('katex-display'));
      if (n.nodeName === 'BR') { push(cur); cur = []; }
      else if (block) { if (cur.length) push(cur); cur = []; push([n], true); }
      else cur.push(n);
    });
    if (cur.length) push(cur);
    inner.innerHTML = '';
    lines.forEach(function (d) { inner.appendChild(d); });
    return lines;
  }
  function hex(c) {
    var m = String(c).match(/\d+(\.\d+)?/g) || [0, 0, 0];
    return m.slice(0, 3).map(function (v) { return ('0' + Math.round(+v).toString(16)).slice(-2); }).join('').toUpperCase();
  }
  // text runs with the colour / weight the browser actually used
  function runs(line) {
    var out = [], w = document.createTreeWalker(line, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      var t = n.nodeValue.replace(/\u2003/g, '    ');
      if (!t) continue;
      var p = n.parentNode, cs = getComputedStyle(p);
      var o = { bold: +cs.fontWeight >= 600, italic: cs.fontStyle === 'italic', color: hex(cs.color) };
      if (p.closest('u')) o.underline = { style: 'sng' };
      var last = out[out.length - 1];
      if (last && last.options.bold === o.bold && last.options.italic === o.italic && last.options.color === o.color && !!last.options.underline === !!o.underline) last.text += t;
      else out.push({ text: t, options: o });
    }
    return out;
  }
  var RICH = '.katex, table, pre, img, svg';

  function pptx(deck, ctx) {
    var b = busy();
    return load('pptxgen.bundle.js').then(function () { return load('html2canvas.min.js'); }).then(function () {
      return document.fonts ? document.fonts.ready : null;
    }).then(function () {
      var P = new window.PptxGenJS();
      P.layout = 'LAYOUT_WIDE'; P.title = deck.name || ''; P.author = deck.teacher || ''; P.company = 'KP Cambodian Mathematics';
      var stg = makeStage(), st = stg.st, slides = deck.slides, i = 0;
      var step = function () {
        if (i >= slides.length) return null;
        var sl = slides[i];
        b.set('PowerPoint ៖ ស្លាយ ' + (i + 1) + ' / ' + slides.length);
        ctx.paint(sl, st, 'print', i);
        st.querySelectorAll('.sl-hidden').forEach(function (x) { x.classList.remove('sl-hidden'); });
        var items = [];
        st.querySelectorAll('.sl-el.sl-text').forEach(function (d) {
          var box = d.querySelector('.sl-txt'), inner = box && box.firstChild;
          if (!inner) return;
          splitLines(inner).forEach(function (ln) { items.push({ node: ln, rich: !!ln.querySelector(RICH), head: /Koulen/.test(getComputedStyle(box).fontFamily) }); });
        });
        var decoText = st.querySelectorAll('.sl-hdr, .sl-ftr, .sl-badge');
        decoText.forEach(function (d) { items.push({ node: d, rich: false, head: true, deco: true }); });
        var slide = P.addSlide(), hide = function (list, v) { list.forEach(function (x) { x.style.visibility = v; }); };
        var lines = items.map(function (it) { return it.node; });
        // 1. artwork: background, cover, shapes, figures, box fills — no text
        hide(lines, 'hidden');
        return nextFrame().then(function () { return shot(st, 1.5, '#ffffff'); }).then(function (cv) {
          slide.background = { data: cv.toDataURL('image/jpeg', 0.88).replace(/^data:/, '') };
          // 2. lines with maths / tables only, on a transparent stage, cut out one by one
          var rich = items.filter(function (it) { return it.rich; });
          if (!rich.length) return null;
          hide(rich.map(function (it) { return it.node; }), 'visible');
          var saved = { bg: st.style.background, els: [] };
          st.style.background = 'transparent';
          st.querySelectorAll('.sl-el:not(.sl-text), .sl-deco').forEach(function (x) { saved.els.push([x, x.style.visibility]); x.style.visibility = 'hidden'; });
          st.querySelectorAll('.sl-txt').forEach(function (x) { saved.els.push([x, x.style.cssText]); x.style.background = 'transparent'; x.style.borderColor = 'transparent'; x.style.textShadow = 'none'; });
          return drawDom(st, 1280, 720, 2).then(function (cv2) {
            rich.forEach(function (it) {
              // fractions, underbraces and roots reach outside the line box; a neighbouring formula caught in the
              // margin is cut from the same picture at the same place, so the overlap is invisible
              var r = rectIn(it.node, st), pad = 4, vpad = Math.max(8, r.h * 0.18);
              var x = Math.max(0, r.x - pad), y = Math.max(0, r.y - vpad), w = Math.min(1280 - x, r.w + 2 * pad), h = Math.min(720 - y, r.h + 2 * vpad);
              if (w < 2 || h < 2) return;
              var c = document.createElement('canvas'); c.width = Math.round(w * 2); c.height = Math.round(h * 2);
              c.getContext('2d').drawImage(cv2, x * 2, y * 2, w * 2, h * 2, 0, 0, c.width, c.height);
              slide.addImage({ data: c.toDataURL('image/png').replace(/^data:/, ''), x: x / PX, y: y / PX, w: w / PX, h: h / PX });
            });
            st.style.background = saved.bg;
            saved.els.forEach(function (p) { if (p[0].classList.contains('sl-txt')) p[0].style.cssText = p[1]; else p[0].style.visibility = p[1]; });
          });
        }).then(function () {
          // 3. editable text boxes for plain lines
          hide(lines, 'visible');
          items.forEach(function (it) {
            if (it.rich) return;
            var rs = runs(it.node);
            if (!rs.some(function (r) { return r.text.replace(/\u00a0/g, ' ').trim(); })) return;
            var r = rectIn(it.node, st), cs = getComputedStyle(it.node);
            var fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) || fs * 1.25;
            // Khmer OS fonts run wider than the web fonts: a line that fits on screen must not wrap into the next one
            var oneLine = r.h < lh * 1.5, align = /center/.test(cs.textAlign) ? 'center' : /right|end/.test(cs.textAlign) ? 'right' : 'left';
            var x = r.x, w = Math.min(1280 - r.x, r.w * 1.08 + 10);
            if (it.node.classList.contains('sl-ftr')) { w = 640; x = r.x + r.w - w; align = 'right'; }
            else if (it.deco) w = Math.max(w, 1280 - r.x - 140);
            else if (align === 'center' && oneLine) { x = Math.max(0, r.x - r.w * 0.1); w = Math.min(1280 - x, r.w * 1.2); }
            slide.addText(rs, {
              x: x / PX, y: (r.y + lh * 0.08) / PX, w: w / PX, h: Math.max(r.h, lh) / PX, margin: 0, valign: 'top', align: align,
              fontFace: it.head ? HEAD_FONT : BODY_FONT, fontSize: Math.round(fs * 0.75 * (it.head ? 0.86 : 0.93) * 2) / 2,
              lineSpacing: Math.round(lh * 0.75), wrap: !oneLine, fit: 'none'
            });
          });
          if (sl.notes) slide.addNotes(sl.notes);
          i++;
          return step();
        });
      };
      return Promise.resolve(step()).then(function () {
        stg.host.remove();
        b.set('PowerPoint ៖ កំពុងបង្កើតឯកសារ…');
        return P.write({ outputType: 'blob' });
      }).then(function (blob) { save(blob, fileName(deck, 'pptx')); b.done(); return blob; },
               function (e) { stg.host.remove(); throw e; });
    }).catch(function (e) { b.done(); throw e; });
  }

  /* ---------------- LaTeX Beamer ---------------- */
  var MATH_RE = /(\\begin\{([a-zA-Z]+\*?)\}[\s\S]+?\\end\{\2\}|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$]+?\$)/g;
  var ROW_RE = /^\s*\|.*\|\s*$/, SEP_RE = /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/, FENCE_RE = /^\s*(\\?`){3}\s*$/;
  var EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu;
  var UNI = { '×': '\\times', '÷': '\\div', '°': '^{\\circ}', '≤': '\\le', '≥': '\\ge', '≠': '\\ne', '≈': '\\approx', '±': '\\pm',
    'π': '\\pi', '∞': '\\infty', '→': '\\to', '⇒': '\\Rightarrow', '⟹': '\\Longrightarrow', '⇔': '\\Leftrightarrow', '·': '\\cdot',
    '∈': '\\in', '∉': '\\notin', '⊂': '\\subset', '⊆': '\\subseteq', '∪': '\\cup', '∩': '\\cap', '∅': '\\emptyset', '√': '\\surd',
    '−': '-', '…': '\\dots', 'Δ': '\\Delta', 'α': '\\alpha', 'β': '\\beta', 'θ': '\\theta', 'ρ': '\\rho', 'σ': '\\sigma',
    '∠': '\\angle', '⊥': '\\perp', '∥': '\\parallel', '≅': '\\cong', '∼': '\\sim', '△': '\\triangle', '∑': '\\sum', '∛': '\\sqrt[3]{}' };
  var SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };
  var UNI_RE = new RegExp('[' + Object.keys(UNI).join('').replace(/[\]\\^-]/g, '\\$&') + ']', 'g');
  var SUP_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g;
  var KHMER = /[\u1780-\u17FF\u19E0-\u19FF]/;

  // KaTeX accepts Khmer letters straight inside maths; LaTeX needs them in \text{}
  function wrapKhmer(m) {
    var out = '', i = 0, keep = /^\\(text|textbf|textrm|mathrm|mbox|operatorname|mathbf)\s*\{/;
    while (i < m.length) {
      var k = keep.exec(m.slice(i, i + 20));
      if (k) {
        var j = i + k[0].length, d = 1;
        while (j < m.length && d) { if (m[j] === '\\') j++; else if (m[j] === '{') d++; else if (m[j] === '}') d--; j++; }
        out += m.slice(i, j); i = j; continue;
      }
      if (KHMER.test(m[i])) {
        var e = i; while (e < m.length && (KHMER.test(m[e]) || (m[e] === ' ' && KHMER.test(m[e + 1] || '')))) e++;
        out += '\\text{' + m.slice(i, e) + '}'; i = e; continue;
      }
      out += m[i]; i++;
    }
    return out;
  }
  function mathTex(m) {
    m = m.replace(/\\overgroup\s*\{([^{}]*)\}/g, '\\overset{\\frown}{$1}')
         .replace(SUP_RE, function (s) { return '^{' + s.split('').map(function (c) { return SUP[c]; }).join('') + '}'; })
         .replace(UNI_RE, function (c) { return UNI[c] + ' '; });
    return wrapKhmer(m);
  }
  function mathOut(m) {
    if (m.slice(0, 6) === '\\begin') return /^\\begin\{(align|equation|gather|multline)/.test(m) ? '\n' + mathTex(m) + '\n' : '\n\\[' + mathTex(m) + '\\]\n';
    if (m.slice(0, 2) === '$$' || m.slice(0, 2) === '\\[') return '\n\\[' + mathTex(m.slice(2, -2)) + '\\]\n';
    return '$' + mathTex(m.slice(m[0] === '$' ? 1 : 2, m[0] === '$' ? -1 : -2)) + '$';
  }
  // plain slide text (outside maths) → LaTeX; \u0000n\u0000 marks a formula
  function inlineTex(s) {
    s = s.replace(EMOJI, '').replace(/\\q?quad\b/g, '\u0001');
    s = s.replace(/__(.+?)__/g, '\u0002$1\u0003');
    s = s.replace(/[\\{}&%#_~^$]/g, function (c) {
      return { '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '&': '\\&', '%': '\\%', '#': '\\#', '_': '\\_', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}', '$': '\\$' }[c];
    });
    s = s.replace(SUP_RE, function (x) { return '\\textsuperscript{' + x.split('').map(function (c) { return SUP[c]; }).join('') + '}'; })
         .replace(UNI_RE, function (c) { return '$' + UNI[c] + '$'; })
         .replace(/^#{1,4}\s*(.+)$/, '\\textbf{$1}')
         .replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}')
         .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1\\emph{$2}')
         .replace(/!!(.+?)!!/g, '\\textcolor{kpred}{$1}')
         .replace(/==(.+?)==/g, '\\textcolor{kporange}{$1}')
         .replace(/\u0002/g, '\\underline{').replace(/\u0003/g, '}')
         .replace(/\u0001/g, '\\quad{}').replace(/\*\*/g, '');
    return s;
  }
  // same rule as the renderer: "|" inside $...$ belongs to the maths, not the table
  function cellsOf(line) {
    var s = line.trim().replace(/^\||\|$/g, ''), out = [], cur = '', math = false;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (ch === '$' && s.charAt(i - 1) !== '\\') math = !math;
      if (ch === '|' && !math) { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur);
    return out;
  }
  function textTex(text) {
    var maths = [];
    var src = String(text || '').replace(MATH_RE, function (m) { maths.push(mathOut(m)); return '\u0000' + (maths.length - 1) + '\u0000'; });
    var put = function (s) { return s.replace(/\u0000(\d+)\u0000/g, function (m, k) { return maths[+k]; }); };
    var lines = src.split('\n'), out = [], list = [], i = 0, para = [];
    var flush = function () { if (para.length) out.push(para.join(' \\\\\n')); para = []; };
    var closeLists = function (lvl) { while (list.length > lvl) { out.push('\\end{itemize}'); list.pop(); } };
    while (i < lines.length) {
      var ln = lines[i];
      if (FENCE_RE.test(ln)) {
        var j = i + 1; while (j < lines.length && !FENCE_RE.test(lines[j])) j++;
        flush(); closeLists(0);
        out.push('{\\ttfamily\\small ' + lines.slice(i + 1, j).map(function (x) { return inlineTex(x).replace(/ /g, '~'); }).join('\\\\\n') + '}');
        i = j + 1; continue;
      }
      if (ROW_RE.test(ln) && i + 1 < lines.length && SEP_RE.test(lines[i + 1])) {
        var k = i + 2; while (k < lines.length && ROW_RE.test(lines[k])) k++;
        flush(); closeLists(0);
        var al = cellsOf(lines[i + 1]).map(function (c) { c = c.trim(); return /^:-+:$/.test(c) ? 'c' : /-:$/.test(c) ? 'r' : 'l'; });
        var row = function (l) { return cellsOf(l).map(function (c) { return put(inlineTex(c.trim())); }).join(' & ') + ' \\\\ \\hline'; };
        out.push('\\begin{center}\\adjustbox{max width=\\linewidth}{\\begin{tabular}{|' + al.join('|') + '|}\\hline\n' +
          row(lines[i]) + '\n' + lines.slice(i + 2, k).map(row).join('\n') + '\n\\end{tabular}}\\end{center}');
        i = k; continue;
      }
      if (/^\s*-{3,}\s*$/.test(ln)) { flush(); closeLists(0); out.push('\\par\\noindent\\rule{\\linewidth}{0.4pt}\\par'); i++; continue; }
      // a whole line in colour markers (table of contents "==១. …==") is still a numbered item
      var wrapped = /^(\s*)(==|!!)(.+)\2\s*$/.exec(ln), probe = wrapped ? wrapped[1] + wrapped[3] : ln;
      var bm = /^(\s*)(•|-|\*|[0-9០-៩]+[.)]|[ក-ឃ][.)])\s+(.*)$/.exec(probe);
      if (bm && !/^\*\*/.test(probe.trim())) {
        flush();
        var lvl = bm[1].length >= 2 && list.length ? 2 : 1;
        if (list.length > lvl) closeLists(lvl);
        while (list.length < lvl) { out.push('\\begin{itemize}'); list.push(lvl); }
        var lab = /^[•\-*]$/.test(bm[2]) ? '' : '[' + inlineTex(bm[2]) + ']';
        var body = put(inlineTex(bm[3]));
        if (wrapped) body = '\\textcolor{' + (wrapped[2] === '==' ? 'kporange' : 'kpred') + '}{' + body + '}';
        out.push('\\item' + lab + ' ' + body);
        i++; continue;
      }
      if (!ln.trim()) { flush(); if (!list.length) out.push(''); i++; continue; }
      // an indented line under a bullet (often a display formula) belongs to that bullet
      if (list.length && /^\s+\S/.test(ln)) { out.push(put(inlineTex(ln.trim()))); i++; continue; }
      closeLists(0);
      para.push(put(inlineTex(ln)));
      i++;
    }
    flush(); closeLists(0);
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  function plainTitle(t) { return inlineTex(String(t || '').replace(MATH_RE, function (m) { return m; }).replace(/\n+/g, ' ')).replace(/\\textcolor\{\w+\}\{(.*?)\}/g, '$1'); }
  function titleTex(t) {
    var maths = [];
    var src = String(t || '').replace(/\n+/g, ' ').replace(MATH_RE, function (m) { maths.push(mathOut(m).trim()); return '\u0000' + (maths.length - 1) + '\u0000'; });
    return inlineTex(src).replace(/\\textcolor\{\w+\}\{(.*?)\}/g, '$1').replace(/\u0000(\d+)\u0000/g, function (m, k) { return maths[+k]; });
  }
  function cardTex(el) {
    var t = String(el.text || ''), m = /^!!__([\s\S]+?)__!!\s*\n+/.exec(t);
    if (m) return '\\begin{block}{' + titleTex(m[1]) + '}\n' + textTex(t.slice(m[0].length)) + '\n\\end{block}';
    if (el.fill || el.border) return '\\begin{block}{}\n' + textTex(t) + '\n\\end{block}';
    return textTex(t);
  }

  var PREAMBLE = [
    '% !TEX program = xelatex',
    '% KP Cambodian Mathematics — Beamer export. Compile with XeLaTeX (Overleaf: Menu → Compiler → XeLaTeX).',
    '\\documentclass[aspectratio=169,11pt]{beamer}',
    '\\usefonttheme[onlymath]{serif}',
    '\\usepackage{fontspec}',
    '\\usepackage{amsmath,amssymb,mathtools,cancel,bm,graphicx,xcolor,array,adjustbox}',
    '\\IfFontExistsTF{Khmer OS Battambang}{\\setsansfont{Khmer OS Battambang}[Script=Khmer,AutoFakeBold=2]\\setmainfont{Khmer OS Battambang}[Script=Khmer,AutoFakeBold=2]}',
    '  {\\setsansfont{Noto Sans Khmer}[Script=Khmer]\\setmainfont{Noto Sans Khmer}[Script=Khmer]}',
    '\\definecolor{kpnavy}{HTML}{002060}\\definecolor{kpred}{HTML}{C00000}\\definecolor{kporange}{HTML}{E8590C}',
    '\\setbeamercolor{normal text}{fg=kpnavy}\\setbeamercolor{frametitle}{fg=kporange}',
    '\\setbeamercolor{block title}{fg=kpred,bg=kpnavy!8}\\setbeamercolor{block body}{bg=kpnavy!3}',
    '\\setbeamercolor{itemize item}{fg=kporange}\\setbeamertemplate{itemize items}[circle]',
    '\\setbeamertemplate{navigation symbols}{}',
    '\\setbeamertemplate{footline}{\\hfill\\scriptsize\\textcolor{kpnavy!70}{\\insertshortauthor\\quad\\insertframenumber}\\hspace*{1em}\\vspace*{0.6em}}',
    '\\providecommand{\\R}{\\mathbb{R}}\\providecommand{\\N}{\\mathbb{N}}\\providecommand{\\Z}{\\mathbb{Z}}\\providecommand{\\Q}{\\mathbb{Q}}',
    '\\newcommand{\\Am}{\\textbf{\\color{blue}ដំណោះស្រាយ៖}}\\newcommand{\\ans}{\\Am}',
    '\\setlength{\\parskip}{0.3em}'
  ].join('\n');

  function beamer(deck, ctx) {
    var b = busy();
    return load('jszip.min.js').then(function () { return load('html2canvas.min.js'); }).then(function () {
      return document.fonts ? document.fonts.ready : null;
    }).then(function () {
      var zip = new window.JSZip(), figs = zip.folder('figures');
      var stg = makeStage(), st = stg.st, frames = [], i = 0;
      var step = function () {
        if (i >= deck.slides.length) return null;
        var sl = deck.slides[i], n = i + 1;
        b.set('Beamer ៖ ស្លាយ ' + n + ' / ' + deck.slides.length);
        var texts = sl.els.filter(function (e) { return e.type === 'text' && String(e.text || '').trim(); });
        var art = sl.els.filter(function (e) { return (e.type === 'shape' && e.svg) || e.type === 'image'; });
        // frame title: the display-font heading at the top of the slide
        var head = texts.filter(function (e) { return e.font === 'display' && e.y <= 160 && !e.fill && !e.border; })
                        .sort(function (a, c) { return (c.size || 28) - (a.size || 28) || a.y - c.y; })[0];
        var body = texts.filter(function (e) { return e !== head && (e.size || 28) >= 14; });
        var pics = {};
        var draw = art.length ? (function () {
          ctx.paint(sl, st, 'print', i);
          return nextFrame().then(function () {
            return art.reduce(function (p, e, k) {
              return p.then(function () {
                var node = st.querySelector('.sl-el[data-id="' + e.id + '"]');
                if (!node) return;
                return shot(node, 2, '#ffffff').then(function (cv) {
                  var name = 'slide' + n + '-' + (k + 1) + '.png';
                  figs.file(name, cv.toDataURL('image/png').split(',')[1], { base64: true });
                  pics[e.id] = name;
                });
              });
            }, Promise.resolve());
          });
        })() : Promise.resolve();
        return draw.then(function () {
          var items = body.concat(art.filter(function (e) { return pics[e.id]; }));
          var tex = function (e) {
            if (e.type !== 'text') return '\\begin{center}\\includegraphics[width=\\linewidth,height=0.62\\textheight,keepaspectratio]{figures/' + pics[e.id] + '}\\end{center}';
            return cardTex(e);
          };
          var byY = function (a, c) { return a.y - c.y || a.x - c.x; };
          var left = items.filter(function (e) { return e.x < 600 && e.x + e.w <= 700; }).sort(byY);
          var right = items.filter(function (e) { return e.x >= 600; }).sort(byY);
          var full = items.filter(function (e) { return left.indexOf(e) < 0 && right.indexOf(e) < 0; }).sort(byY);
          var parts = [];
          if (left.length && right.length) {
            var top = Math.min(left[0].y, right[0].y);
            full.filter(function (e) { return e.y < top; }).forEach(function (e) { parts.push(tex(e)); });
            parts.push('\\begin{columns}[T]\n\\begin{column}{0.49\\textwidth}\n' + left.map(tex).join('\n\n') +
              '\n\\end{column}\n\\begin{column}{0.49\\textwidth}\n' + right.map(tex).join('\n\n') + '\n\\end{column}\n\\end{columns}');
            full.filter(function (e) { return e.y >= top; }).forEach(function (e) { parts.push(tex(e)); });
          } else {
            items.slice().sort(byY).forEach(function (e) { parts.push(tex(e)); });
          }
          if (!parts.length && !head) parts.push('\\vfill\\centering{\\Huge\\textcolor{kporange}{សូមអរគុណ!}}\\vfill');
          frames.push('% ---- slide ' + n + ' ----\n\\begin{frame}[t,shrink=5]' + (head ? '{' + titleTex(head.text) + '}' : '') + '\n' +
            parts.join('\n\n') + (sl.notes ? '\n\\note{' + inlineTex(sl.notes) + '}' : '') + '\n\\end{frame}');
          i++;
          return step();
        });
      };
      return Promise.resolve(step()).then(function () {
        stg.host.remove();
        var doc = PREAMBLE + '\n\\title{' + plainTitle(deck.name) + '}\n\\author[' + plainTitle(deck.teacher || '') + ']{' + plainTitle(deck.teacher || '') + '}\n' +
          '\\institute{' + plainTitle([deck.school, deck.school2, deck.school3].filter(Boolean).join(' ')) + '}\n\\date{}\n\n\\begin{document}\n\n' +
          frames.join('\n\n') + '\n\n\\end{document}\n';
        zip.file('main.tex', doc);
        zip.file('README.txt', [
          'KP Cambodian Mathematics — LaTeX Beamer',
          '',
          'ខ្មែរ ៖ បើក main.tex ហើយ Compile ជាមួយ XeLaTeX (មិនមែន pdfLaTeX)។',
          'ត្រូវមានពុម្ពអក្សរ Khmer OS Battambang ឬ Noto Sans Khmer ក្នុងម៉ាស៊ីន។',
          'Overleaf ៖ Upload ឯកសារ .zip ទាំងមូល → Menu → Compiler → XeLaTeX។',
          '',
          'English: compile main.tex with XeLaTeX. Needs the font "Khmer OS Battambang" (or "Noto Sans Khmer").',
          'Figures are in figures/. Each slide is one \\begin{frame}; edit the text freely.'
        ].join('\r\n'));
        b.set('Beamer ៖ កំពុងបង្កើតឯកសារ…');
        return zip.generateAsync({ type: 'blob' });
      }).then(function (blob) { save(blob, fileName(deck, 'zip')); b.done(); return blob; },
               function (e) { stg.host.remove(); throw e; });
    }).catch(function (e) { b.done(); throw e; });
  }

  var api = window.KPSlidesExport = { pptx: pptx, beamer: beamer, textTex: textTex, splitLines: splitLines };
})();
