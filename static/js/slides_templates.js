/* Ready-made decks for the slide maker (studio.html › ស្លាយបង្រៀន › បញ្ចូល › គំរូមេរៀន).
   Each entry builds a deck with KPSlides.api. Text markup: $…$ maths, **bold**, __underline__,
   !!red!!, ==orange==; elements with anim:true appear one click at a time in the slide show. */
(function () {
  var R = String.raw;

  // building blocks shared by the grade 11 school-style decks
  function kit(A) {
    var T = A.T, shape = A.shape, S = A.school, K = { T: T, shape: shape, page: A.slide, S: S };
    // header / footer as in the sample deck — change them in រចនា › ក្បាល / ជើងស្លាយ
    K.info = { school: 'វិទ្យាល័យ', school2: 'ព្រះស៊ីសុវត្ថិ', school3: '(NGS)', teacher: 'បង្រៀនដោយ លោកគ្រូ ខែម ពុទ្ធី' };
    K.kids = function (x, y, w) { return S.kids(x, y, w); };
    // one line of text; step() is the same but appears on click
    K.line = function (x, y, w, text, o) {
      var e = T(x, y, w, 64, text, { size: 32, valign: 'middle' });
      for (var k in o) e[k] = o[k];
      return e;
    };
    K.step = function (x, y, w, text, o) { var e = K.line(x, y, w, text, o); e.anim = e.anim || true; return e; };
    // number line with a dot + label per term; open=true ends in "… →" (infinite sequence)
    K.numberLine = function (x, y, vals, color, open) {
      var gap = 50, w = open ? vals.length * gap + 90 : (vals.length - 1) * gap + 30, els = [
        shape(open ? 'arrow' : 'line', x, y - 10, w, 20, { stroke: color, sw: 3 }),
        shape('rect', x, y - 12, 3, 24, { fill: color })];
      if (!open) els.push(shape('rect', x + w - 3, y - 12, 3, 24, { fill: color }));
      else els.push(T(x + 5 + vals.length * gap, y - 34, 60, 30, '. . .', { size: 20, color: color }));
      vals.forEach(function (v, i) {
        var cx = x + 15 + i * gap;
        els.push(shape('ellipse', cx - 7, y - 7, 14, 14, { fill: color }));
        els.push(T(cx - 25, y + 10, 50, 32, '$' + v + '$', { size: 20, color: color, align: 'center' }));
      });
      return els;
    };
    // small a_n–n graph card: five dots rising (up) or falling, with axes
    K.dotChart = function (x, y, up, color, label) {
      var ox = x + 28, oy = y + 160, els = [
        shape('rect', x, y, 170, 215, { fill: '#ffffff', stroke: '#dee2e6', sw: 2 }),
        shape('rect', ox, y + 14, 2, oy - y - 14, { fill: '#868e96' }),
        shape('arrow', ox, oy - 6, 130, 12, { stroke: '#868e96', sw: 2 }),
        T(ox + 6, y + 4, 40, 28, '$a_n$', { size: 16, color: '#495057' }),
        T(ox + 112, oy + 2, 30, 28, '$n$', { size: 16, color: '#495057' }),
        T(x, y + 172, 170, 36, label, { size: 21, color: color, bold: true, align: 'center' })];
      for (var i = 0; i < 5; i++) {
        var cx = ox + 22 + i * 23, cy = up ? oy - 22 - i * 25 : oy - 122 + i * 25;
        els.push(shape('ellipse', cx - 8, cy - 8, 16, 16, { fill: color }));
      }
      return els;
    };
    // SVG exponential graph: inc (y=2^x), dec (y=(1/2)^x), both (comparison)
    K.expGraph = function (x, y, w, h, gtype) {
      w = w || 460; h = h || 370;
      var x0 = Math.round(w * 0.44), y0 = Math.round(h * 0.80);
      var sx = (w - 70) / 7.5;
      var sy = (h - 70) / 10.0;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';
      for (var xi = -3; xi <= 3; xi++) {
        var gx = x0 + xi * sx;
        s += '<line x1="' + gx.toFixed(1) + '" y1="25" x2="' + gx.toFixed(1) + '" y2="' + (h - 25) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
      }
      var yTicks = [1, 2, 4, 8];
      for (var yi = 0; yi < yTicks.length; yi++) {
        var gy = y0 - yTicks[yi] * sy;
        s += '<line x1="25" y1="' + gy.toFixed(1) + '" x2="' + (w - 25) + '" y2="' + gy.toFixed(1) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
      }
      s += '<line x1="18" y1="' + y0 + '" x2="' + (w - 16) + '" y2="' + y0 + '" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + (w - 10) + ',' + y0 + ' ' + (w - 20) + ',' + (y0 - 5) + ' ' + (w - 20) + ',' + (y0 + 5) + '" fill="#495057"/>';
      s += '<text x="' + (w - 14) + '" y="' + (y0 + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

      s += '<line x1="' + x0 + '" y1="' + (h - 18) + '" x2="' + x0 + '" y2="18" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + x0 + ',10 ' + (x0 - 5) + ',20 ' + (x0 + 5) + ',20" fill="#495057"/>';
      s += '<text x="' + (x0 - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
      s += '<text x="' + (x0 - 14) + '" y="' + (y0 + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

      for (var xi = -3; xi <= 3; xi++) {
        if (xi === 0) continue;
        var gx = x0 + xi * sx;
        s += '<line x1="' + gx.toFixed(1) + '" y1="' + (y0 - 4) + '" x2="' + gx.toFixed(1) + '" y2="' + (y0 + 4) + '" stroke="#495057" stroke-width="1.5"/>';
        s += '<text x="' + gx.toFixed(1) + '" y="' + (y0 + 18) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="middle">' + xi + '</text>';
      }
      for (var yi = 0; yi < yTicks.length; yi++) {
        var gy = y0 - yTicks[yi] * sy;
        s += '<line x1="' + (x0 - 4) + '" y1="' + gy.toFixed(1) + '" x2="' + (x0 + 4) + '" y2="' + gy.toFixed(1) + '" stroke="#495057" stroke-width="1.5"/>';
        s += '<text x="' + (x0 - 8) + '" y="' + (gy + 4).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">' + yTicks[yi] + '</text>';
      }

      if (gtype === 'inc' || gtype === 'both') {
        var pts = [];
        for (var i = 0; i <= 80; i++) {
          var xv = -3.5 + i * (3.12 - (-3.5)) / 80.0;
          var yv = Math.pow(2, xv);
          pts.push((x0 + xv * sx).toFixed(1) + ',' + (y0 - yv * sy).toFixed(1));
        }
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#1971c2" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (x0 + 2.8 * sx).toFixed(1) + '" y="' + (y0 - 8.3 * sy).toFixed(1) + '" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1971c2">y = 2ˣ</text>';

        [1, 2, 3].forEach(function (v) {
          var px = x0 + v * sx, py = y0 - Math.pow(2, v) * sy;
          s += '<line x1="' + px.toFixed(1) + '" y1="' + y0 + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#1971c2" stroke-width="1" stroke-dasharray="3,3"/>';
          s += '<line x1="' + x0 + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#1971c2" stroke-width="1" stroke-dasharray="3,3"/>';
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="#1971c2"/>';
        });
      }

      if (gtype === 'dec' || gtype === 'both') {
        var pts = [];
        for (var i = 0; i <= 80; i++) {
          var xv = -3.12 + i * (3.5 - (-3.12)) / 80.0;
          var yv = Math.pow(0.5, xv);
          pts.push((x0 + xv * sx).toFixed(1) + ',' + (y0 - yv * sy).toFixed(1));
        }
        var strokeC = gtype === 'dec' ? '#e03131' : '#f08c00';
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="' + strokeC + '" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (x0 - 3.2 * sx - 60).toFixed(1) + '" y="' + (y0 - 8.3 * sy).toFixed(1) + '" font-family="sans-serif" font-size="15" font-weight="bold" fill="' + strokeC + '">y = (1/2)ˣ</text>';

        [-3, -2, -1].forEach(function (v) {
          var px = x0 + v * sx, py = y0 - Math.pow(0.5, v) * sy;
          if (gtype === 'dec') {
            s += '<line x1="' + px.toFixed(1) + '" y1="' + y0 + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + strokeC + '" stroke-width="1" stroke-dasharray="3,3"/>';
            s += '<line x1="' + x0 + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + strokeC + '" stroke-width="1" stroke-dasharray="3,3"/>';
          }
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="' + strokeC + '"/>';
        });
      }

      var py1 = y0 - 1.0 * sy;
      s += '<circle cx="' + x0 + '" cy="' + py1.toFixed(1) + '" r="5.5" fill="#e03131"/>';
      s += '<text x="' + (x0 + 8) + '" y="' + (py1 - 4).toFixed(1) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131">(0, 1)</text>';
      s += '<text x="25" y="' + (h - 10) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#868e96">អាស៊ីមតូតដេក y = 0</text>';
      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    // SVG logarithm graph: inc (y=log2 x), dec (y=log1/2 x), both
    K.logGraph = function (x, y, w, h, gtype) {
      w = w || 460; h = h || 370;
      var x0 = Math.round(w * 0.22), y0 = Math.round(h * 0.50);
      var sx = (w - 70) / 9.0;
      var sy = (h - 70) / 7.0;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';
      var xTicks = [1, 2, 4, 8];
      for (var xi = 0; xi < xTicks.length; xi++) {
        var gx = x0 + xTicks[xi] * sx;
        s += '<line x1="' + gx.toFixed(1) + '" y1="25" x2="' + gx.toFixed(1) + '" y2="' + (h - 25) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
      }
      for (var yi = -3; yi <= 3; yi++) {
        if (yi === 0) continue;
        var gy = y0 - yi * sy;
        s += '<line x1="25" y1="' + gy.toFixed(1) + '" x2="' + (w - 25) + '" y2="' + gy.toFixed(1) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
      }
      s += '<line x1="18" y1="' + y0 + '" x2="' + (w - 16) + '" y2="' + y0 + '" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + (w - 10) + ',' + y0 + ' ' + (w - 20) + ',' + (y0 - 5) + ' ' + (w - 20) + ',' + (y0 + 5) + '" fill="#495057"/>';
      s += '<text x="' + (w - 16) + '" y="' + (y0 + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

      s += '<line x1="' + x0 + '" y1="' + (h - 18) + '" x2="' + x0 + '" y2="18" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + x0 + ',10 ' + (x0 - 5) + ',20 ' + (x0 + 5) + ',20" fill="#495057"/>';
      s += '<text x="' + (x0 - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
      s += '<text x="' + (x0 - 14) + '" y="' + (y0 + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

      for (var xi = 0; xi < xTicks.length; xi++) {
        var gx = x0 + xTicks[xi] * sx;
        s += '<line x1="' + gx.toFixed(1) + '" y1="' + (y0 - 4) + '" x2="' + gx.toFixed(1) + '" y2="' + (y0 + 4) + '" stroke="#495057" stroke-width="1.5"/>';
        s += '<text x="' + gx.toFixed(1) + '" y="' + (y0 + 18) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="middle">' + xTicks[xi] + '</text>';
      }
      for (var yi = -3; yi <= 3; yi++) {
        if (yi === 0) continue;
        var gy = y0 - yi * sy;
        s += '<line x1="' + (x0 - 4) + '" y1="' + gy.toFixed(1) + '" x2="' + (x0 + 4) + '" y2="' + gy.toFixed(1) + '" stroke="#495057" stroke-width="1.5"/>';
        s += '<text x="' + (x0 - 8) + '" y="' + (gy + 4).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">' + yi + '</text>';
      }

      if (gtype === 'inc' || gtype === 'both') {
        var pts = [];
        for (var i = 1; i <= 80; i++) {
          var xv = 0.12 + i * (8.5 - 0.12) / 80.0;
          var yv = Math.log2(xv);
          pts.push((x0 + xv * sx).toFixed(1) + ',' + (y0 - yv * sy).toFixed(1));
        }
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#099268" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (x0 + 7.5 * sx).toFixed(1) + '" y="' + (y0 - 3.2 * sy).toFixed(1) + '" font-family="sans-serif" font-size="15" font-weight="bold" fill="#099268">y = log₂ x</text>';

        [2, 4, 8].forEach(function (v) {
          var px = x0 + v * sx, py = y0 - Math.log2(v) * sy;
          s += '<line x1="' + px.toFixed(1) + '" y1="' + y0 + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#099268" stroke-width="1" stroke-dasharray="3,3"/>';
          s += '<line x1="' + x0 + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#099268" stroke-width="1" stroke-dasharray="3,3"/>';
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="#099268"/>';
        });
      }

      if (gtype === 'dec' || gtype === 'both') {
        var pts = [];
        for (var i = 1; i <= 80; i++) {
          var xv = 0.12 + i * (8.5 - 0.12) / 80.0;
          var yv = -Math.log2(xv);
          pts.push((x0 + xv * sx).toFixed(1) + ',' + (y0 - yv * sy).toFixed(1));
        }
        var strokeC = gtype === 'dec' ? '#7048e8' : '#e03131';
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="' + strokeC + '" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (x0 + 7.5 * sx).toFixed(1) + '" y="' + (y0 + 3.4 * sy + 16).toFixed(1) + '" font-family="sans-serif" font-size="15" font-weight="bold" fill="' + strokeC + '">y = log₁/₂ x</text>';

        [2, 4, 8].forEach(function (v) {
          var px = x0 + v * sx, py = y0 - (-Math.log2(v)) * sy;
          if (gtype === 'dec') {
            s += '<line x1="' + px.toFixed(1) + '" y1="' + y0 + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + strokeC + '" stroke-width="1" stroke-dasharray="3,3"/>';
            s += '<line x1="' + x0 + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + strokeC + '" stroke-width="1" stroke-dasharray="3,3"/>';
          }
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="' + strokeC + '"/>';
        });
      }

      var px1 = x0 + 1.0 * sx;
      s += '<circle cx="' + px1.toFixed(1) + '" cy="' + y0 + '" r="5.5" fill="#e03131"/>';
      s += '<text x="' + px1.toFixed(1) + '" y="' + (y0 - 8) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131" text-anchor="middle">(1, 0)</text>';
      s += '<text x="25" y="' + (h - 10) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#868e96">អាស៊ីមតូតឈរ x = 0</text>';
      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };
    K.solTitle = function (x, y) { return T(x || 440, y || 112, 400, 64, '!!__ដំណោះស្រាយ__!!', { size: 34, align: 'center' }); };
    // section title: centred, or left-aligned at x when given
    K.title = function (text, o) {
      o = o || {};
      return T(o.x == null ? 0 : o.x, o.y || 100, o.w || (o.x == null ? 1280 : 1000), 60, text,
               { size: o.size || 38, font: 'display', color: o.color || 'head', shadow: true, align: o.x == null ? 'center' : 'left', valign: 'middle' });
    };
    // hide els until the click named key (steps with anim: key appear together with them)
    K.at = function (key, els) { els.forEach(function (e) { e.anim = key; }); return els; };
    // table of contents with a smaller font, for long section names
    K.toc = function (items, size) { var s = S.toc(items); s.els[1].size = size; s.els[1].lh = '1.4'; return s; };
    // white label on a filled rounded bar
    K.pill = function (x, y, w, h, text, fill, size) {
      return [shape('round', x, y, w, h, { fill: fill }),
              T(x, y, w, h, text, { size: size || 20, bold: true, color: '#ffffff', align: 'center', valign: 'middle' })];
    };
    K.tip = function (x, y, w, h, text, o) {
      var e = T(x, y, w, h, text, { size: 28, fill: '#fff4e6', border: '#f68c1f', bw: 2, radius: 14, valign: 'middle' });
      for (var k in o) e[k] = o[k];
      return e;
    };
    K.card = function (x, y, w, h, text, o, extra) {
      if (typeof o === 'string') {
        if (/^[A-Dក-ឃ]$/.test(String(text).trim())) {
          text = '!!' + String(text).trim() + '.!!   ' + o;
        } else {
          text = (text ? '!!__' + text + '__!!\n\n' : '') + o;
        }
        o = extra || {};
      }
      var sz = (o && o.size) ? o.size : 26;
      var clr = (o && o.color) ? o.color : '#002060';
      var e = T(x, y, w, h, text, { size: sz, fill: '#f5f8fc', border: '#c5d3e8', bw: 2, radius: 16, color: clr, valign: (o && o.valign) || 'top' });
      for (var k in o) e[k] = o[k];
      e.size = (o && o.size) ? o.size : sz;
      if (!e.color) e.color = clr;
      return e;
    };
    // terms in circles (or rounded boxes with o.box = {w, h}) joined by arrows labelled o.op;
    // '…' is drawn as plain dots, o.hl lists highlighted terms, o.sub puts a caption under each term
    K.chain = function (x, y, labels, o) {
      o = o || {};
      var gap = o.gap || 150, r = o.r || 36, els = [], n = labels.length, ops = o.ops == null ? n - 1 : o.ops;
      var half = function (i) { return labels[i] === '…' ? 22 : o.box ? o.box.w / 2 : r; };
      labels.forEach(function (lab, i) {
        var cx = x + i * gap, hw = half(i), hh = o.box ? o.box.h / 2 : r, hl = (o.hl || []).indexOf(i) >= 0;
        if (lab === '…') els.push(T(cx - 40, y - 25, 80, 50, '…', { size: 32, bold: true, color: 'title', align: 'center', valign: 'middle' }));
        else {
          var st = { fill: hl ? '#fff3e6' : '#e7f0fb', stroke: hl ? 'brand' : 'title', sw: 3 };
          els.push(o.box ? shape('round', cx - hw, y - hh, 2 * hw, 2 * hh, st) : shape('ellipse', cx - r, y - r, 2 * r, 2 * r, st));
          els.push(T(cx - hw - 12, y - hh, 2 * hw + 24, 2 * hh, lab, { size: o.size || 26, bold: true, color: 'title', align: 'center', valign: 'middle' }));
        }
        if (o.sub && o.sub[i]) els.push(T(cx - 55, y + hh + 2, 110, 30, o.sub[i], { size: 18, color: '#495057', align: 'center' }));
        if (o.op && i < ops) {
          var a = cx + hw + 6, len = gap - hw - half(i + 1) - 12;
          els.push(shape('arrow', a, y - 8, len, 16, { stroke: 'brand', sw: 3 }));
          els.push(T(a - 20, y - 42, len + 40, 32, o.op, { size: 22, bold: true, color: 'brand', align: 'center' }));
        }
      });
      return els;
    };
    // dots on a grey line with hop arrows labelled op above the first o.ops gaps
    K.hops = function (x, y, vals, op, gap, o) {
      o = o || {};
      var n = vals.length, ops = o.ops == null ? n - 1 : o.ops, els = [shape('rect', x - 30, y - 1, (n - 1) * gap + 60, 3, { fill: '#868e96' })];
      vals.forEach(function (v, i) {
        var cx = x + i * gap;
        if (v === '…') { els.push(T(cx - 30, y + 8, 60, 34, '…', { size: 24, color: 'title', align: 'center' })); return; }
        els.push(shape('ellipse', cx - 9, y - 9, 18, 18, { fill: i === o.hl ? 'brand' : 'title' }));
        els.push(T(cx - 45, y + 12, 90, 36, v, { size: o.size || 26, color: i === o.hl ? 'brand' : 'title', align: 'center' }));
        if (op && i < ops) {
          els.push(shape('arrow', cx + 12, y - 36, gap - 24, 14, { stroke: 'brand', sw: 2.5 }));
          els.push(T(cx, y - 74, gap, 32, op, { size: 22, color: 'brand', align: 'center' }));
        }
      });
      return els;
    };
    // ⊔-shaped bracket under x1..x2
    K.bracket = function (x1, x2, y, depth, color) {
      return [shape('rect', x1, y, 3, depth, { fill: color }), shape('rect', x2, y, 3, depth, { fill: color }),
              shape('rect', x1, y + depth, x2 - x1 + 3, 3, { fill: color })];
    };
    // bar chart; negative values hang below the baseline; o.texts replaces the value captions
    K.bars = function (x, y, w, h, vals, o) {
      o = o || {};
      var n = vals.length, slot = w / n, bw = slot * 0.62, max = 0, els = [], top = o.values === false ? 0 : 24;
      vals.forEach(function (v) { max = Math.max(max, Math.abs(v)); });
      els.push(shape('rect', x, y + h, w, 2, { fill: '#adb5bd' }));
      vals.forEach(function (v, i) {
        var bh = Math.max(4, Math.abs(v) / max * (h - top)), bx = x + i * slot + (slot - bw) / 2;
        els.push(shape('rect', bx, v < 0 ? y + h + 2 : y + h - bh, bw, bh, { fill: i === o.hl ? '#f68c1f' : '#1f4e9c' }));
        if (o.values !== false) els.push(T(x + i * slot - 6, y + h - bh - 26, slot + 12, 26, o.texts ? o.texts[i] : String(v), { size: o.vs || 16, color: '#002060', align: 'center' }));
        if (o.labels) els.push(T(x + i * slot - 6, y + h + 4, slot + 12, 26, o.labels[i], { size: o.ls || 15, color: '#002060', align: 'center' }));
      });
      return els;
    };
    // numbered exercise rows; with item.a an answer chip appears on click, with o.anim the rows do
    K.rows = function (items, o) {
      o = Object.assign({ x: 50, y: 170, w: 860, h: 62, gap: 82, size: 24, ansSize: 20, ansX: 995, ansW: 270 }, o);
      var els = [];
      items.forEach(function (it, i) {
        var y = o.y + i * o.gap, rGrp = o.anim ? 'row' + i : null;
        els.push(shape('ellipse', o.x, y + o.h / 2 - 28, 56, 56, { fill: i % 2 ? '#f68c1f' : '#002f6c', anim: rGrp }));
        els.push(T(o.x, y + o.h / 2 - 28, 56, 56, String(i + 1), { size: 24, bold: true, color: '#ffffff', align: 'center', valign: 'middle', anim: rGrp }));
        els.push(T(o.x + 76, y, o.w, o.h, it.q || it, { size: o.size, fill: '#f5f8fc', border: '#c5d3e8', bw: 2, radius: 12, valign: 'middle', anim: rGrp || (it.a ? false : !!o.anim) }));
        if (it.a) els.push(T(o.ansX, y, o.ansW, o.h, 'ចម្លើយ ៖ ' + it.a, { size: o.ansSize, fill: '#ebfbee', border: '#2f9e44', bw: 2, radius: 12, align: 'center', valign: 'middle', anim: true }));
      });
      return els;
    };
    // several multiple-choice questions on one slide; the right option gets a green ring on click
    K.mcq = function (items, o) {
      o = Object.assign({ x: 50, y: 160, w: 900, gap: 120 }, o);
      var keys = ['ក', 'ខ', 'គ', 'ឃ'], els = [];
      items.forEach(function (it, i) {
        var y = o.y + i * o.gap, bx = o.x + 66;
        els.push(shape('round', bx, y, o.w, 108, { fill: i % 2 ? '#fff8f0' : '#f5f8fc', stroke: i % 2 ? '#f6c48f' : '#c5d3e8', sw: 2 }));
        els.push(shape('ellipse', o.x, y + 26, 54, 54, { fill: i % 2 ? '#f68c1f' : '#002f6c' }));
        els.push(T(o.x, y + 26, 54, 54, String(i + 1), { size: 24, bold: true, color: '#ffffff', align: 'center', valign: 'middle' }));
        els.push(T(bx + 14, y + 4, o.w - 28, 48, it.q, { size: 24, valign: 'middle' }));
        it.opts.forEach(function (op, k) {
          var ox = bx + 24 + k * (o.w - 40) / 4;
          els.push(T(ox, y + 54, (o.w - 40) / 4 - 10, 46, '!!' + keys[k] + '.!!  ' + op, { size: 24, valign: 'middle' }));
          if (k === it.ans) els.push(shape('round', ox - 10, y + 52, 170, 50, { fill: 'none', stroke: '#2f9e44', sw: 3, anim: true }));
        });
      });
      return els;
    };
    
    // SVG Trigonometric Unit Circle: circle, axes (cos, sin), angle theta, point P, projections, quadrants
    K.trigCircle = function (x, y, w, h, opts) {
      w = w || 480; h = h || 380;
      opts = opts || {};
      var cx = Math.round(w / 2), cy = Math.round(h / 2);
      var r = opts.r || Math.min(cx, cy) - 45;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Axes cos (horizontal) and sin (vertical)
      s += '<line x1="20" y1="' + cy + '" x2="' + (w - 18) + '" y2="' + cy + '" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + (w - 10) + ',' + cy + ' ' + (w - 20) + ',' + (cy - 5) + ' ' + (w - 20) + ',' + (cy + 5) + '" fill="#495057"/>';
      s += '<text x="' + (w - 16) + '" y="' + (cy + 22) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">cos</text>';

      s += '<line x1="' + cx + '" y1="' + (h - 20) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + cx + ',10 ' + (cx - 5) + ',20 ' + (cx + 5) + ',20" fill="#495057"/>';
      s += '<text x="' + (cx + 12) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131">sin</text>';
      s += '<text x="' + (cx - 15) + '" y="' + (cy + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

      // Unit Circle
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#2b8a3e" stroke-width="2.5"/>';

      // Axis labels: 1, -1, 1, -1
      s += '<text x="' + (cx + r + 4) + '" y="' + (cy - 6) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057">1</text>';
      s += '<text x="' + (cx - r - 14) + '" y="' + (cy - 6) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057">-1</text>';
      s += '<text x="' + (cx - 14) + '" y="' + (cy - r + 14) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057">1</text>';
      s += '<text x="' + (cx - 18) + '" y="' + (cy + r - 6) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057">-1</text>';

      // Quadrants labels
      s += '<text x="' + (cx + r * 0.55) + '" y="' + (cy - r * 0.55) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#868e96">កាដ្រង់ I (+,+)</text>';
      s += '<text x="' + (cx - r * 0.95) + '" y="' + (cy - r * 0.55) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#868e96">កាដ្រង់ II (-,+)</text>';
      s += '<text x="' + (cx - r * 0.95) + '" y="' + (cy + r * 0.65) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#868e96">កាដ្រង់ III (-,-)</text>';
      s += '<text x="' + (cx + r * 0.55) + '" y="' + (cy + r * 0.65) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#868e96">កាដ្រង់ IV (+,-)</text>';

      // Angle ray and point P if requested (default 45 deg or angle in rad)
      var angDeg = opts.deg != null ? opts.deg : 45;
      var angRad = angDeg * Math.PI / 180;
      var px = cx + r * Math.cos(angRad);
      var py = cy - r * Math.sin(angRad);

      // Arc for angle
      var arcR = 30;
      var largeArc = (angDeg > 180) ? 1 : 0;
      var sweep = 0; // counter-clockwise in SVG coordinates
      s += '<path d="M ' + (cx + arcR) + ',' + cy + ' A ' + arcR + ' ' + arcR + ' 0 ' + largeArc + ' ' + sweep + ' ' + (cx + arcR * Math.cos(angRad)).toFixed(1) + ',' + (cy - arcR * Math.sin(angRad)).toFixed(1) + '" fill="none" stroke="#f08c00" stroke-width="2"/>';
      s += '<text x="' + (cx + arcR + 4) + '" y="' + (cy - 8) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f08c00">θ</text>';

      // Ray OP
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="#2b8a3e" stroke-width="2.5"/>';

      // Projections
      s += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + cy + '" stroke="#e03131" stroke-width="1.5" stroke-dasharray="3,3"/>';
      s += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + cx + '" y2="' + py.toFixed(1) + '" stroke="#1971c2" stroke-width="1.5" stroke-dasharray="3,3"/>';

      // Cos and Sin segments
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + cy + '" stroke="#1971c2" stroke-width="3"/>';
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + py.toFixed(1) + '" stroke="#e03131" stroke-width="3"/>';

      s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="#2b8a3e"/>';
      s += '<text x="' + (px + 6).toFixed(1) + '" y="' + (py - 6).toFixed(1) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2b8a3e">M(cos θ, sin θ)</text>';

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    // SVG Trigonometric wave graph: sin, cos, both
    K.trigGraph = function (x, y, w, h, gtype) {
      w = w || 480; h = h || 370;
      gtype = gtype || 'sin';
      var cx = Math.round(w * 0.38), cy = Math.round(h * 0.50);
      var sx = (w - 60) / 7.2;
      var sy = (h - 80) / 2.6;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Horizontal grid lines: 1, 0, -1
      [-1, 0, 1].forEach(function (v) {
        var gy = cy - v * sy;
        s += '<line x1="25" y1="' + gy.toFixed(1) + '" x2="' + (w - 25) + '" y2="' + gy.toFixed(1) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
      });

      // Axis Ox
      s += '<line x1="18" y1="' + cy + '" x2="' + (w - 16) + '" y2="' + cy + '" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + (w - 10) + ',' + cy + ' ' + (w - 20) + ',' + (cy - 5) + ' ' + (w - 20) + ',' + (cy + 5) + '" fill="#495057"/>';
      s += '<text x="' + (w - 14) + '" y="' + (cy + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

      // Axis Oy
      s += '<line x1="' + cx + '" y1="' + (h - 18) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + cx + ',10 ' + (cx - 5) + ',20 ' + (cx + 5) + ',20" fill="#495057"/>';
      s += '<text x="' + (cx - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
      s += '<text x="' + (cx - 14) + '" y="' + (cy + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

      var ticks = [
        { v: -Math.PI, label: '-π' },
        { v: -Math.PI / 2, label: '-π/2' },
        { v: Math.PI / 2, label: 'π/2' },
        { v: Math.PI, label: 'π' },
        { v: 3 * Math.PI / 2, label: '3π/2' },
        { v: 2 * Math.PI, label: '2π' }
      ];
      var xStep = sx / (Math.PI / 2);

      ticks.forEach(function (tk) {
        var gx = cx + tk.v * xStep;
        if (gx > 20 && gx < w - 20) {
          s += '<line x1="' + gx.toFixed(1) + '" y1="' + (cy - 4) + '" x2="' + gx.toFixed(1) + '" y2="' + (cy + 4) + '" stroke="#495057" stroke-width="1.5"/>';
          s += '<text x="' + gx.toFixed(1) + '" y="' + (cy + 18) + '" font-family="sans-serif" font-size="11" font-weight="bold" fill="#495057" text-anchor="middle">' + tk.label + '</text>';
        }
      });

      s += '<text x="' + (cx - 8) + '" y="' + (cy - sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">1</text>';
      s += '<text x="' + (cx - 8) + '" y="' + (cy + sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">-1</text>';

      if (gtype === 'sin' || gtype === 'both') {
        var pts = [];
        for (var i = 0; i <= 100; i++) {
          var xv = -Math.PI * 1.1 + i * (2.2 * Math.PI - (-Math.PI * 1.1)) / 100.0;
          var yv = Math.sin(xv);
          pts.push((cx + xv * xStep).toFixed(1) + ',' + (cy - yv * sy).toFixed(1));
        }
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#1971c2" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (cx + 2 * Math.PI * xStep - 10).toFixed(1) + '" y="' + (cy - 1.15 * sy).toFixed(1) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">y = sin x</text>';

        [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI].forEach(function (v) {
          var px = cx + v * xStep, py = cy - Math.sin(v) * sy;
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="#1971c2"/>';
        });
      }

      if (gtype === 'cos' || gtype === 'both') {
        var pts = [];
        for (var i = 0; i <= 100; i++) {
          var xv = -Math.PI * 1.1 + i * (2.2 * Math.PI - (-Math.PI * 1.1)) / 100.0;
          var yv = Math.cos(xv);
          pts.push((cx + xv * xStep).toFixed(1) + ',' + (cy - yv * sy).toFixed(1));
        }
        var strokeC = gtype === 'cos' ? '#e03131' : '#f08c00';
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="' + strokeC + '" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (cx + 2 * Math.PI * xStep - 10).toFixed(1) + '" y="' + (cy - 0.2 * sy).toFixed(1) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="' + strokeC + '">y = cos x</text>';

        [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI].forEach(function (v) {
          var px = cx + v * xStep, py = cy - Math.cos(v) * sy;
          s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.5" fill="' + strokeC + '"/>';
        });
      }

      var pStart = cx, pEnd = cx + 2 * Math.PI * xStep;
      s += '<line x1="' + pStart.toFixed(1) + '" y1="' + (h - 26) + '" x2="' + pEnd.toFixed(1) + '" y2="' + (h - 26) + '" stroke="#2b8a3e" stroke-width="1.8"/>';
      s += '<line x1="' + pStart.toFixed(1) + '" y1="' + (h - 32) + '" x2="' + pStart.toFixed(1) + '" y2="' + (h - 20) + '" stroke="#2b8a3e" stroke-width="1.8"/>';
      s += '<line x1="' + pEnd.toFixed(1) + '" y1="' + (h - 32) + '" x2="' + pEnd.toFixed(1) + '" y2="' + (h - 20) + '" stroke="#2b8a3e" stroke-width="1.8"/>';
      s += '<text x="' + ((pStart + pEnd) / 2).toFixed(1) + '" y="' + (h - 10) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2b8a3e" text-anchor="middle">ខួប T = 2π</text>';

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };



    // SVG Inverse Trigonometric graphs: asin, acos, atan
    K.invTrigGraph = function (x, y, w, h, gtype) {
      w = w || 480; h = h || 370;
      gtype = gtype || 'asin';
      var cx = Math.round(w * 0.50), cy = Math.round(h * 0.50);
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      if (gtype === 'asin') {
        var sx = (w - 100) / 2.2; // domain [-1, 1]
        var sy = (h - 80) / (Math.PI * 1.15); // range [-pi/2, pi/2]

        // Grid lines for -pi/2, 0, pi/2
        [-Math.PI / 2, 0, Math.PI / 2].forEach(function (v) {
          var gy = cy - v * sy;
          s += '<line x1="25" y1="' + gy.toFixed(1) + '" x2="' + (w - 25) + '" y2="' + gy.toFixed(1) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
        });

        // Axes
        s += '<line x1="20" y1="' + cy + '" x2="' + (w - 18) + '" y2="' + cy + '" stroke="#495057" stroke-width="2"/>';
        s += '<polygon points="' + (w - 10) + ',' + cy + ' ' + (w - 20) + ',' + (cy - 5) + ' ' + (w - 20) + ',' + (cy + 5) + '" fill="#495057"/>';
        s += '<text x="' + (w - 14) + '" y="' + (cy + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

        s += '<line x1="' + cx + '" y1="' + (h - 18) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
        s += '<polygon points="' + cx + ',10 ' + (cx - 5) + ',20 ' + (cx + 5) + ',20" fill="#495057"/>';
        s += '<text x="' + (cx - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
        s += '<text x="' + (cx - 14) + '" y="' + (cy + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

        // X labels: -1, 1
        s += '<text x="' + (cx + sx) + '" y="' + (cy + 18) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="middle">1</text>';
        s += '<text x="' + (cx - sx) + '" y="' + (cy + 18) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="middle">-1</text>';

        // Y labels: pi/2, -pi/2
        s += '<text x="' + (cx - 10) + '" y="' + (cy - Math.PI / 2 * sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">π/2</text>';
        s += '<text x="' + (cx - 10) + '" y="' + (cy + Math.PI / 2 * sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">-π/2</text>';

        var pts = [];
        for (var i = 0; i <= 80; i++) {
          var xv = -1.0 + i * 2.0 / 80.0;
          var yv = Math.asin(xv);
          pts.push((cx + xv * sx).toFixed(1) + ',' + (cy - yv * sy).toFixed(1));
        }
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#1971c2" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (cx + sx + 10).toFixed(1) + '" y="' + (cy - Math.PI / 2 * sy + 15).toFixed(1) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">y = arcsin x</text>';
        s += '<circle cx="' + (cx + sx).toFixed(1) + '" cy="' + (cy - Math.PI / 2 * sy).toFixed(1) + '" r="5" fill="#1971c2"/>';
        s += '<circle cx="' + (cx - sx).toFixed(1) + '" cy="' + (cy + Math.PI / 2 * sy).toFixed(1) + '" r="5" fill="#1971c2"/>';
      } else if (gtype === 'acos') {
        var sx = (w - 100) / 2.2;
        var sy = (h - 80) / (Math.PI * 1.15);
        var cy0 = Math.round(h * 0.82);

        [0, Math.PI / 2, Math.PI].forEach(function (v) {
          var gy = cy0 - v * sy;
          s += '<line x1="25" y1="' + gy.toFixed(1) + '" x2="' + (w - 25) + '" y2="' + gy.toFixed(1) + '" stroke="#edf2f7" stroke-width="1.2" stroke-dasharray="3,3"/>';
        });

        s += '<line x1="20" y1="' + cy0 + '" x2="' + (w - 18) + '" y2="' + cy0 + '" stroke="#495057" stroke-width="2"/>';
        s += '<polygon points="' + (w - 10) + ',' + cy0 + ' ' + (w - 20) + ',' + (cy0 - 5) + ' ' + (w - 20) + ',' + (cy0 + 5) + '" fill="#495057"/>';
        s += '<text x="' + (w - 14) + '" y="' + (cy0 + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

        s += '<line x1="' + cx + '" y1="' + (h - 18) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
        s += '<polygon points="' + cx + ',10 ' + (cx - 5) + ',20 ' + (cx + 5) + ',20" fill="#495057"/>';
        s += '<text x="' + (cx - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
        s += '<text x="' + (cx - 14) + '" y="' + (cy0 + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

        s += '<text x="' + (cx + sx) + '" y="' + (cy0 + 18) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="middle">1</text>';
        s += '<text x="' + (cx - sx) + '" y="' + (cy0 + 18) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="middle">-1</text>';
        s += '<text x="' + (cx - 10) + '" y="' + (cy0 - Math.PI / 2 * sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">π/2</text>';
        s += '<text x="' + (cx - 10) + '" y="' + (cy0 - Math.PI * sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#495057" text-anchor="end">π</text>';

        var pts = [];
        for (var i = 0; i <= 80; i++) {
          var xv = -1.0 + i * 2.0 / 80.0;
          var yv = Math.acos(xv);
          pts.push((cx + xv * sx).toFixed(1) + ',' + (cy0 - yv * sy).toFixed(1));
        }
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#e03131" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (cx + sx + 10).toFixed(1) + '" y="' + (cy0 - Math.PI * sy + 25).toFixed(1) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131">y = arccos x</text>';
        s += '<circle cx="' + (cx + sx).toFixed(1) + '" cy="' + cy0 + '" r="5" fill="#e03131"/>';
        s += '<circle cx="' + (cx - sx).toFixed(1) + '" cy="' + (cy0 - Math.PI * sy).toFixed(1) + '" r="5" fill="#e03131"/>';
      } else if (gtype === 'atan') {
        var sx = (w - 100) / 6.0;
        var sy = (h - 80) / (Math.PI * 1.15);

        [-Math.PI / 2, 0, Math.PI / 2].forEach(function (v) {
          var gy = cy - v * sy;
          s += '<line x1="25" y1="' + gy.toFixed(1) + '" x2="' + (w - 25) + '" y2="' + gy.toFixed(1) + '" stroke="#e03131" stroke-width="1.2" stroke-dasharray="4,4"/>';
        });

        s += '<line x1="20" y1="' + cy + '" x2="' + (w - 18) + '" y2="' + cy + '" stroke="#495057" stroke-width="2"/>';
        s += '<polygon points="' + (w - 10) + ',' + cy + ' ' + (w - 20) + ',' + (cy - 5) + ' ' + (w - 20) + ',' + (cy + 5) + '" fill="#495057"/>';
        s += '<text x="' + (w - 14) + '" y="' + (cy + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

        s += '<line x1="' + cx + '" y1="' + (h - 18) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
        s += '<polygon points="' + cx + ',10 ' + (cx - 5) + ',20 ' + (cx + 5) + ',20" fill="#495057"/>';
        s += '<text x="' + (cx - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
        s += '<text x="' + (cx - 14) + '" y="' + (cy + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

        s += '<text x="' + (cx - 10) + '" y="' + (cy - Math.PI / 2 * sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e03131" text-anchor="end">y = π/2</text>';
        s += '<text x="' + (cx - 10) + '" y="' + (cy + Math.PI / 2 * sy + 5).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e03131" text-anchor="end">y = -π/2</text>';

        var pts = [];
        for (var i = 0; i <= 80; i++) {
          var xv = -3.5 + i * 7.0 / 80.0;
          var yv = Math.atan(xv);
          pts.push((cx + xv * sx).toFixed(1) + ',' + (cy - yv * sy).toFixed(1));
        }
        s += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#2b8a3e" stroke-width="3.5" stroke-linecap="round"/>';
        s += '<text x="' + (w - 120) + '" y="' + (cy - Math.PI / 2 * sy + 25).toFixed(1) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2b8a3e">y = arctan x</text>';
      }

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    // SVG Unit circle for equations & inequalities (with solution points and marked angles)
    K.trigEqCircle = function (x, y, w, h, opts) {
      w = w || 480; h = h || 380;
      opts = opts || {};
      var cx = Math.round(w / 2), cy = Math.round(h / 2);
      var r = opts.r || Math.min(cx, cy) - 45;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Axes
      s += '<line x1="20" y1="' + cy + '" x2="' + (w - 18) + '" y2="' + cy + '" stroke="#495057" stroke-width="2"/>';
      s += '<text x="' + (w - 16) + '" y="' + (cy + 22) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">cos</text>';

      s += '<line x1="' + cx + '" y1="' + (h - 20) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
      s += '<text x="' + (cx + 12) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131">sin</text>';
      s += '<text x="' + (cx - 15) + '" y="' + (cy + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#adb5bd" stroke-width="2"/>';

      // Horizontal reference line for sin x = val
      if (opts.sinVal != null) {
        var ly = cy - opts.sinVal * r;
        s += '<line x1="30" y1="' + ly.toFixed(1) + '" x2="' + (w - 30) + '" y2="' + ly.toFixed(1) + '" stroke="#e03131" stroke-width="2" stroke-dasharray="4,4"/>';
        s += '<text x="35" y="' + (ly - 6).toFixed(1) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#e03131">y = ' + opts.sinLabel + '</text>';
      }

      // Vertical reference line for cos x = val
      if (opts.cosVal != null) {
        var lx = cx + opts.cosVal * r;
        s += '<line x1="' + lx.toFixed(1) + '" y1="30" x2="' + lx.toFixed(1) + '" y2="' + (h - 30) + '" stroke="#1971c2" stroke-width="2" stroke-dasharray="4,4"/>';
        s += '<text x="' + (lx + 6).toFixed(1) + '" y="40" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1971c2">x = ' + opts.cosLabel + '</text>';
      }

      // Solution angles (array of {deg: 30, label: 'π/6', color: '#2b8a3e'})
      (opts.angles || []).forEach(function (ag) {
        var rad = ag.deg * Math.PI / 180;
        var px = cx + r * Math.cos(rad);
        var py = cy - r * Math.sin(rad);
        var clr = ag.color || '#2b8a3e';
        s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + clr + '" stroke-width="2"/>';
        s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="6" fill="' + clr + '"/>';
        var tx = px + (px > cx ? 10 : -45);
        var ty = py + (py > cy ? 15 : -8);
        s += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="' + clr + '">' + ag.label + '</text>';
      });

      // Highlighted arc for inequalities
      if (opts.arc) {
        var a1 = opts.arc.from * Math.PI / 180;
        var a2 = opts.arc.to * Math.PI / 180;
        var p1x = cx + r * Math.cos(a1), p1y = cy - r * Math.sin(a1);
        var p2x = cx + r * Math.cos(a2), p2y = cy - r * Math.sin(a2);
        var large = (opts.arc.to - opts.arc.from > 180) ? 1 : 0;
        s += '<path d="M ' + p1x.toFixed(1) + ',' + p1y.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + p2x.toFixed(1) + ',' + p2y.toFixed(1) + '" fill="none" stroke="#f08c00" stroke-width="5"/>';
      }

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    
    // SVG Matrix Structure Diagram (shows rows, columns, dimension m x n, and elements)
    K.matrixDiagram = function (x, y, w, h, opts) {
      w = w || 480; h = h || 370;
      opts = opts || {};
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Title badge
      s += '<rect x="20" y="16" width="' + (w - 40) + '" height="36" rx="8" fill="#f1f3f5"/>';
      s += '<text x="' + (w / 2) + '" y="40" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1971c2" text-anchor="middle">ទម្រង់ទូទៅនៃម៉ាទ្រីស A មានលំដាប់ m × n</text>';

      // Left bracket
      s += '<path d="M 100 80 L 75 80 L 75 280 L 100 280" fill="none" stroke="#212529" stroke-width="3.5" stroke-linecap="round"/>';
      // Right bracket
      s += '<path d="M 380 80 L 405 80 L 405 280 L 380 280" fill="none" stroke="#212529" stroke-width="3.5" stroke-linecap="round"/>';

      // Elements table
      var cols = [125, 205, 280, 355];
      var rows = [115, 165, 215, 255];

      // Row indicator arrows on the left
      s += '<text x="60" y="122" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131" text-anchor="end">ជួរដេក ១ →</text>';
      s += '<text x="60" y="172" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131" text-anchor="end">ជួរដេក ២ →</text>';
      s += '<text x="60" y="260" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131" text-anchor="end">ជួរដេក m →</text>';

      // Column indicator arrows on the top
      s += '<text x="125" y="72" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2f9e44" text-anchor="middle">↓ ឈរ ១</text>';
      s += '<text x="205" y="72" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2f9e44" text-anchor="middle">↓ ឈរ ២</text>';
      s += '<text x="355" y="72" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2f9e44" text-anchor="middle">↓ ឈរ n</text>';

      // Highlight main diagonal or element a11
      s += '<rect x="105" y="98" width="42" height="30" rx="6" fill="#e7f5ff" stroke="#339af0" stroke-width="1.5"/>';
      s += '<text x="126" y="120" font-family="serif" font-size="17" font-weight="bold" fill="#1864ab" text-anchor="middle">a₁₁</text>';
      s += '<text x="205" y="120" font-family="serif" font-size="17" fill="#495057" text-anchor="middle">a₁₂</text>';
      s += '<text x="280" y="118" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">···</text>';
      s += '<text x="355" y="120" font-family="serif" font-size="17" fill="#495057" text-anchor="middle">a₁ₙ</text>';

      // Row 2
      s += '<text x="125" y="170" font-family="serif" font-size="17" fill="#495057" text-anchor="middle">a₂₁</text>';
      s += '<rect x="185" y="148" width="42" height="30" rx="6" fill="#e7f5ff" stroke="#339af0" stroke-width="1.5"/>';
      s += '<text x="206" y="170" font-family="serif" font-size="17" font-weight="bold" fill="#1864ab" text-anchor="middle">a₂₂</text>';
      s += '<text x="280" y="168" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">···</text>';
      s += '<text x="355" y="170" font-family="serif" font-size="17" fill="#495057" text-anchor="middle">a₂ₙ</text>';

      // Row dots
      s += '<text x="125" y="215" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">⋮</text>';
      s += '<text x="205" y="215" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">⋮</text>';
      s += '<text x="280" y="215" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">⋱</text>';
      s += '<text x="355" y="215" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">⋮</text>';

      // Row m
      s += '<text x="125" y="258" font-family="serif" font-size="17" fill="#495057" text-anchor="middle">aₘ₁</text>';
      s += '<text x="205" y="258" font-family="serif" font-size="17" fill="#495057" text-anchor="middle">aₘ₂</text>';
      s += '<text x="280" y="256" font-family="sans-serif" font-size="15" fill="#868e96" text-anchor="middle">···</text>';
      s += '<rect x="335" y="236" width="42" height="30" rx="6" fill="#e7f5ff" stroke="#339af0" stroke-width="1.5"/>';
      s += '<text x="356" y="258" font-family="serif" font-size="17" font-weight="bold" fill="#1864ab" text-anchor="middle">aₘₙ</text>';

      // Bottom explanation
      s += '<rect x="30" y="298" width="' + (w - 60) + '" height="54" rx="8" fill="#f8f9fa" stroke="#e9ecef"/>';
      s += '<text x="' + (w / 2) + '" y="320" font-family="sans-serif" font-size="13" font-weight="bold" fill="#343a40" text-anchor="middle">• ធាតុ aᵢⱼ ៖ ស្ថិតនៅជួរដេកទី i និងជួរឈរទី j</text>';
      s += '<text x="' + (w / 2) + '" y="340" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1971c2" text-anchor="middle">• បន្ទះពណ៌ខៀវបង្ហាញ អង្កត់ទ្រូងពិសេស (Main Diagonal)</text>';

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    // SVG Matrix Multiplication Diagram (Row x Column)
    K.matrixMultDiagram = function (x, y, w, h, opts) {
      w = w || 520; h = h || 370;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Header
      s += '<rect x="20" y="14" width="' + (w - 40) + '" height="34" rx="8" fill="#f3f0ff"/>';
      s += '<text x="' + (w / 2) + '" y="37" font-family="sans-serif" font-size="15" font-weight="bold" fill="#6741d9" text-anchor="middle">ក្បួនគុណម៉ាទ្រីស ៖ ជួរដេក i គុណនឹង ជួរឈរ j ស្មើ ធាតុ cᵢⱼ</text>';

      // Matrix A (Row i highlighted)
      var ax = 30, ay = 65, aw = 130, ah = 130;
      s += '<text x="' + (ax + aw / 2) + '" y="' + (ay - 8) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2" text-anchor="middle">ម៉ាទ្រីស A (m × p)</text>';
      s += '<rect x="' + ax + '" y="' + ay + '" width="' + aw + '" height="' + ah + '" rx="8" fill="#f8f9fa" stroke="#adb5bd" stroke-width="1.5"/>';
      // Highlight row i
      s += '<rect x="' + (ax + 6) + '" y="' + (ay + 48) + '" width="' + (aw - 12) + '" height="32" rx="6" fill="#d0ebff" stroke="#228be6" stroke-width="2"/>';
      s += '<text x="' + (ax + aw / 2) + '" y="' + (ay + 70) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1864ab" text-anchor="middle">[ aᵢ₁  aᵢ₂  ···  aᵢₚ ]</text>';
      s += '<text x="' + (ax + aw / 2) + '" y="' + (ay + 30) + '" font-family="sans-serif" font-size="12" fill="#868e96" text-anchor="middle">ជួរដេក ១</text>';
      s += '<text x="' + (ax + aw / 2) + '" y="' + (ay + 110) + '" font-family="sans-serif" font-size="12" fill="#868e96" text-anchor="middle">ជួរដេក m</text>';

      // Mult symbol
      s += '<text x="185" y="138" font-family="sans-serif" font-size="24" font-weight="bold" fill="#495057" text-anchor="middle">×</text>';

      // Matrix B (Column j highlighted)
      var bx = 208, by = 65, bw = 130, bh = 130;
      s += '<text x="' + (bx + bw / 2) + '" y="' + (by - 8) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131" text-anchor="middle">ម៉ាទ្រីស B (p × n)</text>';
      s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="8" fill="#f8f9fa" stroke="#adb5bd" stroke-width="1.5"/>';
      // Highlight col j
      s += '<rect x="' + (bx + 42) + '" y="' + (by + 6) + '" width="46" height="' + (bh - 12) + '" rx="6" fill="#ffe3e3" stroke="#fa5252" stroke-width="2"/>';
      s += '<text x="' + (bx + 65) + '" y="' + (by + 32) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#c92a2a" text-anchor="middle">b₁ⱼ</text>';
      s += '<text x="' + (bx + 65) + '" y="' + (by + 60) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#c92a2a" text-anchor="middle">b₂ⱼ</text>';
      s += '<text x="' + (bx + 65) + '" y="' + (by + 86) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#c92a2a" text-anchor="middle">⋮</text>';
      s += '<text x="' + (bx + 65) + '" y="' + (by + 114) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#c92a2a" text-anchor="middle">bₚⱼ</text>';

      // Equal symbol
      s += '<text x="365" y="138" font-family="sans-serif" font-size="24" font-weight="bold" fill="#495057" text-anchor="middle">=</text>';

      // Matrix C (Element cij highlighted)
      var cx = 390, cy = 65, cw = 110, ch = 130;
      s += '<text x="' + (cx + cw / 2) + '" y="' + (cy - 8) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2b8a3e" text-anchor="middle">ផលគុណ C (m × n)</text>';
      s += '<rect x="' + cx + '" y="' + cy + '" width="' + cw + '" height="' + ch + '" rx="8" fill="#f8f9fa" stroke="#adb5bd" stroke-width="1.5"/>';
      // Cell cij
      s += '<rect x="' + (cx + 34) + '" y="' + (cy + 48) + '" width="42" height="32" rx="6" fill="#d3f9d8" stroke="#2b8a3e" stroke-width="2"/>';
      s += '<text x="' + (cx + 55) + '" y="' + (cy + 70) + '" font-family="serif" font-size="15" font-weight="bold" fill="#2b8a3e" text-anchor="middle">cᵢⱼ</text>';

      // Formula breakdown card
      s += '<rect x="25" y="215" width="' + (w - 50) + '" height="138" rx="10" fill="#f8f9fa" stroke="#dee2e6"/>';
      s += '<text x="40" y="242" font-family="sans-serif" font-size="14" font-weight="bold" fill="#212529">រូបមន្តគណនាធាតុនីមួយៗ ៖</text>';
      s += '<text x="40" y="272" font-family="serif" font-size="16" font-weight="bold" fill="#1864ab">cᵢⱼ = aᵢ₁b₁ⱼ + aᵢ₂b₂ⱼ + ··· + aᵢₚbₚⱼ = ∑ₖ aᵢₖ bₖⱼ</text>';
      s += '<line x1="40" y1="288" x2="' + (w - 40) + '" y2="288" stroke="#ced4da" stroke-width="1"/>';
      s += '<text x="40" y="312" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131">!!លក្ខខណ្ឌចាំបាច់!! ៖ ចំនួន ជួរឈរនៃ A (p) ត្រូវតែស្មើនឹងចំនួន ជួរដេកនៃ B (p)</text>';
      s += '<text x="40" y="334" font-family="sans-serif" font-size="13" font-weight="bold" fill="#495057">ទំហំនៃម៉ាទ្រីសលទ្ធផល ៖ [ m × p ] × [ p × n ] = [ m × n ]</text>';

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    // SVG Sarrus Rule Diagram for 3x3 Determinant
    K.sarrusDiagram = function (x, y, w, h, opts) {
      w = w || 500; h = h || 370;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Header
      s += '<rect x="20" y="14" width="' + (w - 40) + '" height="34" rx="8" fill="#e7f5ff"/>';
      s += '<text x="' + (w / 2) + '" y="37" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1971c2" text-anchor="middle">វិធានសារុស (Sarrus Rule) សម្រាប់ដេទែរមីណង់លំដាប់ ៣</text>';

      // Columns coordinates
      var xs = [80, 150, 220, 310, 380];
      var ys = [95, 155, 215];

      // Left bar of det
      s += '<line x1="45" y1="75" x2="45" y2="235" stroke="#212529" stroke-width="3"/>';
      // Right bar of det
      s += '<line x1="255" y1="75" x2="255" y2="235" stroke="#212529" stroke-width="3"/>';
      // Dashed extension line
      s += '<line x1="265" y1="75" x2="265" y2="235" stroke="#868e96" stroke-width="1.5" stroke-dasharray="4,4"/>';

      // Text labels for 5 columns
      var grid = [
        ['a₁', 'b₁', 'c₁', 'a₁', 'b₁'],
        ['a₂', 'b₂', 'c₂', 'a₂', 'b₂'],
        ['a₃', 'b₃', 'c₃', 'a₃', 'b₃']
      ];

      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 5; c++) {
          var isOrig = c < 3;
          s += '<text x="' + xs[c] + '" y="' + (ys[r] + 6) + '" font-family="serif" font-size="20" font-weight="bold" fill="' + (isOrig ? '#212529' : '#868e96') + '" text-anchor="middle">' + grid[r][c] + '</text>';
        }
      }

      // 3 Downward diagonal arrows (Blue, +)
      var dColors = ['#1971c2', '#228be6', '#339af0'];
      for (var k = 0; k < 3; k++) {
        var x1 = xs[k] - 15, y1 = ys[0] - 15;
        var x2 = xs[k + 2] + 20, y2 = ys[2] + 20;
        s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + dColors[k] + '" stroke-width="2.5" stroke-linecap="round"/>';
        s += '<polygon points="' + x2 + ',' + y2 + ' ' + (x2 - 10) + ',' + (y2 - 2) + ' ' + (x2 - 2) + ',' + (y2 - 10) + '" fill="' + dColors[k] + '"/>';
        s += '<circle cx="' + (x2 + 8) + '" cy="' + (y2 + 8) + '" r="9" fill="' + dColors[k] + '"/>';
        s += '<text x="' + (x2 + 8) + '" y="' + (y2 + 12) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text>';
      }

      // 3 Upward diagonal arrows (Red, -)
      var uColors = ['#e03131', '#f03e3e', '#fa5252'];
      for (var k = 0; k < 3; k++) {
        var x1 = xs[k] - 15, y1 = ys[2] + 15;
        var x2 = xs[k + 2] + 20, y2 = ys[0] - 20;
        s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + uColors[k] + '" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5,3"/>';
        s += '<polygon points="' + x2 + ',' + y2 + ' ' + (x2 - 10) + ',' + (y2 + 2) + ' ' + (x2 - 2) + ',' + (y2 + 10) + '" fill="' + uColors[k] + '"/>';
        s += '<circle cx="' + (x2 + 8) + '" cy="' + (y2 - 8) + '" r="9" fill="' + uColors[k] + '"/>';
        s += '<text x="' + (x2 + 8) + '" y="' + (y2 - 4) + '" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">−</text>';
      }

      // Bottom formula container
      s += '<rect x="20" y="260" width="' + (w - 40) + '" height="95" rx="10" fill="#f8f9fa" stroke="#dee2e6"/>';
      s += '<text x="' + (w / 2) + '" y="286" font-family="serif" font-size="15" font-weight="bold" fill="#1864ab" text-anchor="middle">ផលបូកអង្កត់ទ្រូងចុះ (+) ៖ a₁b₂c₃ + b₁c₂a₃ + c₁a₂b₃</text>';
      s += '<text x="' + (w / 2) + '" y="312" font-family="serif" font-size="15" font-weight="bold" fill="#c92a2a" text-anchor="middle">ផលបូកអង្កត់ទ្រូងឡើង (−) ៖ a₃b₂c₁ + b₃c₂a₁ + c₃a₂b₁</text>';
      s += '<text x="' + (w / 2) + '" y="340" font-family="sans-serif" font-size="13" font-weight="bold" fill="#212529" text-anchor="middle">⇒ det A = (ផលបូកអង្កត់ទ្រូងចុះ) − (ផលបូកអង្កត់ទ្រូងឡើង)</text>';

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    // SVG Geometric Linear Transformation Diagram (Reflections, Rotation, Projection)
    K.geomTransSvg = function (x, y, w, h, type, opts) {
      w = w || 480; h = h || 370;
      type = type || 'refl-x';
      opts = opts || {};
      var cx = Math.round(w / 2), cy = Math.round(h / 2);
      var scale = 40;
      var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      s += '<rect width="' + w + '" height="' + h + '" rx="16" fill="#ffffff" stroke="#c5d3e8" stroke-width="2"/>';

      // Grid
      for (var xi = -5; xi <= 5; xi++) {
        var gx = cx + xi * scale;
        s += '<line x1="' + gx + '" y1="25" x2="' + gx + '" y2="' + (h - 25) + '" stroke="#f1f3f5" stroke-width="1.2"/>';
      }
      for (var yi = -4; yi <= 4; yi++) {
        var gy = cy - yi * scale;
        s += '<line x1="25" y1="' + gy + '" x2="' + (w - 25) + '" y2="' + gy + '" stroke="#f1f3f5" stroke-width="1.2"/>';
      }

      // Main Axes
      s += '<line x1="20" y1="' + cy + '" x2="' + (w - 18) + '" y2="' + cy + '" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + (w - 10) + ',' + cy + ' ' + (w - 20) + ',' + (cy - 5) + ' ' + (w - 20) + ',' + (cy + 5) + '" fill="#495057"/>';
      s += '<text x="' + (w - 14) + '" y="' + (cy + 20) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">x</text>';

      s += '<line x1="' + cx + '" y1="' + (h - 18) + '" x2="' + cx + '" y2="18" stroke="#495057" stroke-width="2"/>';
      s += '<polygon points="' + cx + ',10 ' + (cx - 5) + ',20 ' + (cx + 5) + ',20" fill="#495057"/>';
      s += '<text x="' + (cx - 18) + '" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#495057">y</text>';
      s += '<text x="' + (cx - 14) + '" y="' + (cy + 16) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#868e96">O</text>';

      if (type === 'refl-x') {
        var mx = cx + 3 * scale, my = cy - 2.5 * scale;
        var mpx = cx + 3 * scale, mpy = cy + 2.5 * scale;
        // Connecting line
        s += '<line x1="' + mx + '" y1="' + my + '" x2="' + mpx + '" y2="' + mpy + '" stroke="#868e96" stroke-width="1.8" stroke-dasharray="4,4"/>';
        // Right angle mark on axis
        s += '<rect x="' + mx + '" y="' + (cy - 12) + '" width="12" height="12" fill="none" stroke="#495057" stroke-width="1.5"/>';
        // Points
        s += '<circle cx="' + mx + '" cy="' + my + '" r="6" fill="#1971c2"/>';
        s += '<text x="' + (mx + 10) + '" y="' + (my - 6) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">M(x, y)</text>';
        s += '<circle cx="' + mpx + '" cy="' + mpy + '" r="6" fill="#e03131"/>';
        s += '<text x="' + (mpx + 10) + '" y="' + (mpy + 18) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131">M\'(x, −y)</text>';
        // Header
        s += '<rect x="25" y="16" width="220" height="34" rx="8" fill="#e7f5ff"/>';
        s += '<text x="135" y="38" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1971c2" text-anchor="middle">ឆ្លុះធៀបនឹងអ័ក្ស x\'x (Sx\'x)</text>';
      } else if (type === 'refl-y') {
        var mx = cx + 3 * scale, my = cy - 2 * scale;
        var mpx = cx - 3 * scale, mpy = cy - 2 * scale;
        s += '<line x1="' + mx + '" y1="' + my + '" x2="' + mpx + '" y2="' + mpy + '" stroke="#868e96" stroke-width="1.8" stroke-dasharray="4,4"/>';
        s += '<circle cx="' + mx + '" cy="' + my + '" r="6" fill="#1971c2"/>';
        s += '<text x="' + (mx + 10) + '" y="' + (my - 6) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">M(x, y)</text>';
        s += '<circle cx="' + mpx + '" cy="' + mpy + '" r="6" fill="#e03131"/>';
        s += '<text x="' + (mpx - 10) + '" y="' + (mpy - 6) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131" text-anchor="end">M\'(−x, y)</text>';
        s += '<rect x="25" y="16" width="220" height="34" rx="8" fill="#ffe3e3"/>';
        s += '<text x="135" y="38" font-family="sans-serif" font-size="13" font-weight="bold" fill="#e03131" text-anchor="middle">ឆ្លុះធៀបនឹងអ័ក្ស y\'y (Sy\'y)</text>';
      } else if (type === 'refl-diag') {
        // Line y = x
        s += '<line x1="' + (cx - 4 * scale) + '" y1="' + (cy + 4 * scale) + '" x2="' + (cx + 4 * scale) + '" y2="' + (cy - 4 * scale) + '" stroke="#f59f00" stroke-width="2" stroke-dasharray="6,4"/>';
        s += '<text x="' + (cx + 3.6 * scale) + '" y="' + (cy - 3.8 * scale) + '" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f59f00">y = x</text>';
        var mx = cx + 1 * scale, my = cy - 3 * scale; // (1, 3)
        var mpx = cx + 3 * scale, mpy = cy - 1 * scale; // (3, 1)
        s += '<line x1="' + mx + '" y1="' + my + '" x2="' + mpx + '" y2="' + mpy + '" stroke="#868e96" stroke-width="1.8" stroke-dasharray="4,4"/>';
        s += '<circle cx="' + mx + '" cy="' + my + '" r="6" fill="#1971c2"/>';
        s += '<text x="' + (mx - 8) + '" y="' + (my - 8) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">M(x, y)</text>';
        s += '<circle cx="' + mpx + '" cy="' + mpy + '" r="6" fill="#e03131"/>';
        s += '<text x="' + (mpx + 10) + '" y="' + (mpy + 16) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131">M\'(y, x)</text>';
        s += '<rect x="25" y="16" width="220" height="34" rx="8" fill="#fff9db"/>';
        s += '<text x="135" y="38" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f59f00" text-anchor="middle">ឆ្លុះធៀបនឹងបន្ទាត់ y = x</text>';
      } else if (type === 'rot') {
        var r = 3.5 * scale;
        var a1 = 25 * Math.PI / 180;
        var a2 = 70 * Math.PI / 180;
        var mx = cx + r * Math.cos(a1), my = cy - r * Math.sin(a1);
        var mpx = cx + r * Math.cos(a2), mpy = cy - r * Math.sin(a2);

        // Vector OM
        s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + mx + '" y2="' + my + '" stroke="#1971c2" stroke-width="2.5"/>';
        // Vector OM'
        s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + mpx + '" y2="' + mpy + '" stroke="#e03131" stroke-width="2.5"/>';
        // Arc
        s += '<path d="M ' + (cx + 50 * Math.cos(a1)) + ' ' + (cy - 50 * Math.sin(a1)) + ' A 50 50 0 0 0 ' + (cx + 50 * Math.cos(a2)) + ' ' + (cy - 50 * Math.sin(a2)) + '" fill="none" stroke="#2b8a3e" stroke-width="2.5"/>';
        s += '<text x="' + (cx + 64 * Math.cos((a1 + a2) / 2)) + '" y="' + (cy - 64 * Math.sin((a1 + a2) / 2)) + '" font-family="serif" font-size="16" font-weight="bold" fill="#2b8a3e">α</text>';

        s += '<circle cx="' + mx + '" cy="' + my + '" r="6" fill="#1971c2"/>';
        s += '<text x="' + (mx + 10) + '" y="' + (my - 6) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1971c2">M(x, y)</text>';
        s += '<circle cx="' + mpx + '" cy="' + mpy + '" r="6" fill="#e03131"/>';
        s += '<text x="' + (mpx + 6) + '" y="' + (mpy - 10) + '" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e03131">M\'(x\', y\')</text>';

        s += '<rect x="25" y="16" width="220" height="34" rx="8" fill="#ebfbee"/>';
        s += '<text x="135" y="38" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2b8a3e" text-anchor="middle">ការបំប្លែងវិល R(O, α)</text>';
      }

      s += '</svg>';
      return shape('custom', x, y, w, h, { svg: s });
    };

    return K;
  }

  function sequences(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, info = K.info, kids = K.kids, line = K.line,
        step = K.step, numberLine = K.numberLine, dotChart = K.dotChart, solTitle = K.solTitle;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី១==        មេរៀនទី១', 'ស៊ីតចំនួនពិត', info),
      /* 2 */ S.toc([
        '==១. សញ្ញាណស៊ីត== (ស៊ីតរាប់អស់ និងស៊ីតអនន្តតួ)',
        R`==២. តួទី $n$ នៃស៊ីត== (ការសង្កេតលំនាំគំរូ)`,
        '==៣. អថេរភាពនៃស៊ីត== (ស៊ីតកើន ស៊ីតចុះ និងស៊ីតម៉ូណូតូន)'
      ]),
      /* 3 */ S.objective([
        'បង្ហាញសញ្ញាណស៊ីតចំនួនពិត ស៊ីតរាប់អស់ និងស៊ីតអនន្តតួ',
        R`សរសេរតួនៃស៊ីត និងកំណត់តួទី $n$ នៃស៊ីតតាមលំនាំគំរូ`,
        'បង្ហាញថាស៊ីតមួយជាស៊ីតកើន ឬជាស៊ីតចុះ',
        'សិក្សា និងបង្ហាញថាស៊ីតមួយជាស៊ីតម៉ូណូតូន'
      ]),

      /* 4 warm-up */ page([
        line(40, 115, 1200, R`!!__លំហាត់ ៖__!!  គេមានអនុគមន៍ $f(x) = 2x - 1$  ចូររកតម្លៃនៃ  $f(1),\ f(2),\ f(3),\ f(4)$`, { size: 30 }),
        line(110, 185, 1000, R`!!__ដំណោះស្រាយ__!!      គេមានអនុគមន៍  $f(x) = 2x - 1$`),
        step(100, 260, 700, R`$\Rightarrow f(1) = 2(1) - 1 = 1$`, { size: 36 }),
        step(140, 335, 700, R`$f(2) = 2(2) - 1 = 3$`, { size: 36 }),
        step(140, 410, 700, R`$f(3) = 2(3) - 1 = 5$`, { size: 36 }),
        step(140, 485, 700, R`$f(4) = 2(4) - 1 = 7$`, { size: 36 })
      ].concat(S.conclude(565, R`$f(1) = 1,\ \ f(2) = 3,\ \ f(3) = 5,\ \ f(4) = 7$`))),

      /* 5 motivation */ page([
        line(40, 130, 800, R`បើគេតម្រៀបចំនួន តាមលំដាប់ ចំពោះ`),
        line(520, 190, 600, R`$x = 1,\ 2,\ 3,\ 4,\ \ldots$`, { size: 40 }),
        line(390, 265, 700, R`គេបាន ៖    $1,\ 3,\ 5,\ 7,\ \ldots$`, { size: 36 }),
        step(200, 370, 900, '!!តើចំនួនដែលរៀបតាមលំដាប់បែបនេះ គេហៅថាអ្វី?!!', { size: 36, align: 'center' }),
        step(560, 460, 600, '!!- ហៅថា ស៊ីតចំនួនពិត ។!!', { size: 38 }),
        kids()
      ]),

      /* 6 section 1 + example 1 */ page([
        T(40, 108, 900, 70, 'មេរៀនទី ១ ៖   ស៊ីតចំនួនពិត', { size: 46, font: 'display', color: 'title', shadow: true }),
        T(40, 175, 700, 70, '១. សញ្ញាណស៊ីត', { size: 46, font: 'display', color: 'head', shadow: true }),
        line(80, 250, 1180, R`!!__ឧទាហរណ៍ ១ ៖__!!  - គេមានអនុគមន៍  $f : \mathbb{N} \to \mathbb{R},\ \ n \mapsto f(n) = 2n + 1$`, { size: 30 }),
        step(60, 320, 700, R`បើ $n = 1$ នោះ $f(1) = 2 \times 1 + 1 = 3$   តួទី១`, { size: 28, anim: 'r1' }),
        step(60, 385, 700, R`បើ $n = 2$ នោះ $f(2) = 2 \times 2 + 1 = 5$   តួទី២`, { size: 28, anim: 'r2' }),
        step(60, 450, 700, R`បើ $n = 3$ នោះ $f(3) = 2 \times 3 + 1 = 7$   តួទី៣`, { size: 28, anim: 'r3' }),
        step(60, 515, 700, R`បើ $n = 4$ នោះ $f(4) = 2 \times 4 + 1 = 9$   តួទី៤`, { size: 28, anim: 'r4' }),
        step(60, 580, 600, '..........................................', { size: 28 }),
        step(770, 320, 500, R`គេបាន ចំនួនរៀបតាមលំដាប់គឺ $3,\ 5,\ 7,\ 9,\ \ldots$`, { size: 26 }),
        step(770, 385, 500, 'បង្កើតបានជា !!ស៊ីតនៃចំនួនពិត!!។', { size: 28 }),
        T(820, 440, 160, 40, R`$n \in \mathbb{N}$`, { size: 24, align: 'center' }),
        T(1050, 440, 200, 40, R`$f(n) = 2n + 1$`, { size: 24, align: 'center' }),
        shape('ellipse', 840, 480, 120, 170, { fill: '#e7f0fb', stroke: 'title', sw: 3 }),
        shape('ellipse', 1090, 480, 120, 170, { fill: '#fff3e6', stroke: 'brand', sw: 3 }),
      ].concat([1, 2, 3, 4].reduce(function (els, n) {
        var y = 461 + 36 * n, key = 'r' + n;
        return els.concat([
          T(840, y - 18, 120, 36, String(n), { size: 30, bold: true, color: 'title', align: 'center', valign: 'middle', anim: key }),
          shape('arrow', 920, y - 8, 190, 16, { stroke: 'accent', sw: 3, anim: key }),
          T(1090, y - 18, 120, 36, String(2 * n + 1), { size: 30, bold: true, color: 'accent', align: 'center', valign: 'middle', anim: key })]);
      }, []))),

      /* 7 definition */ page([
        S.box(40, 118, 1100, 96, R`!!ជាទូទៅ ៖!!  ស៊ីតចំនួនពិតគឺជាអនុគមន៍!!លេខ!!ដែលកំណត់ពី $\mathbb{N}$ ទៅ $\mathbb{R}$ ។`, { size: 34 }),
        T(50, 225, 1180, 420, R`គេកំណត់សរសេរឈ្មោះ !!ស៊ីតចំនួនពិត!! តាងដោយ  $(a_n),\ (b_n),\ (c_n),\ \ldots$
    ហើយ  $a_1,\ a_2,\ a_3,\ \ldots,\ a_n$  តាងឱ្យតួនៃស៊ីតនីមួយៗ
          $a_1$ ជា តួទី ១ ,  $a_2$ ជា តួទី ២ , ..... ,  $a_n$ ជា តួទី $n$
          ដែល  $n \in \mathbb{N}^*,\ \ \mathbb{N}^* = \{1, 2, 3, \ldots\}$
ករណីដែលគេឱ្យចំនួនគត់  $n = 0,\ 1,\ 2,\ 3,\ \ldots$
នោះ ស៊ីត $(a_n)$ ផ្តើមពីតួ  $a_0,\ a_1,\ a_2,\ \ldots,\ a_n$ ។`, { size: 34, w: 960 }),
        kids(1020, 430, 240)
      ]),

      /* 8 example 2: finite / infinite */ page([
        line(40, 115, 500, '!!__ឧទាហរណ៍ ២ ៖__!!', { size: 34 }),
        line(40, 180, 1000, R`- បើគេមានស៊ីតនៃចំនួនពិត   $1,\ 3,\ 5,\ 7,\ 9,\ 11,\ 13,\ 15$`, { size: 32 }),
        T(380, 240, 900, 90, R`និង  $1,\ \dfrac{1}{2},\ \dfrac{1}{3},\ \ldots,\ \dfrac{1}{20}$   នោះ ស៊ីតនេះជា !!ស៊ីតរាប់អស់!! ។`, { size: 32, valign: 'middle' }),
        S.box(30, 335, 700, 76, '☞  !!ស៊ីតរាប់អស់!! គឺជាស៊ីតដែលគេរាប់ចំនួនតួបាន ។', { size: 28, anim: 'box1' }),
        step(40, 425, 800, R`- បើគេមានស៊ីតនៃចំនួនពិត  $1,\ 2,\ 3,\ 4,\ \ldots$`, { size: 32, anim: 'inf' }),
        step(110, 495, 900, 'នោះ ស៊ីតនេះជា !!ស៊ីតរាប់មិនអស់ (ស៊ីតអនន្តតួ)!! ។', { size: 32, anim: 'inf' }),
        S.box(100, 545, 1070, 68, '☞  !!ស៊ីតអនន្តតួ!! គឺជាស៊ីតដែលគេមិនអាចរាប់ចំនួនតួបាន ។', { size: 28, anim: true }),
      ].concat(K.at('box1', numberLine(860, 365, [1, 3, 5, 7, 9, 11, 13, 15], 'title', false)),
               K.at('inf', numberLine(860, 455, [1, 2, 3, 4, 5, 6], 'accent', true)))),

      /* 9 practice 1 */ page([
        line(180, 150, 1000, '!!__លំហាត់គំរូ ១ ៖__!!    ចូរបំពេញតួនៃស៊ីតខាងក្រោមនេះ ឱ្យបានបីតួទៀត', { size: 34 }),
        line(320, 260, 330, R`!!ក.!!  $1,\ 5,\ 9,$`, { size: 40 }),
        step(650, 260, 400, R`$13,\ 17,\ 21$`, { size: 40, color: 'title' }),
        line(320, 380, 330, R`!!ខ.!!  $1,\ 8,\ 27,$`, { size: 40 }),
        step(650, 380, 400, R`$64,\ 125,\ 216$`, { size: 40, color: 'title' }),
        line(320, 500, 500, R`!!គ.!!  $1,\ 5,\ 14,\ 30,\ 55,$`, { size: 40 }),
        step(820, 500, 400, R`$91,\ 140,\ 204$`, { size: 40, color: 'title' }),
        kids(1110, 530, 150)
      ]),

      /* 10 practice 2 */ page([
        line(360, 180, 600, '!!__លំហាត់គំរូ ២ ៖__!!', { size: 36 }),
        T(360, 260, 880, 110, R`!!១.!!  សរសេរតួនៃស៊ីត $(a_n)$ កំណត់ដោយ  $a_n = \dfrac{1}{n+2}$  ដែល  $1 \le n \le 4$ ។`, { size: 32, valign: 'middle' }),
        T(360, 410, 880, 110, R`!!២.!!  សរសេរតួនៃស៊ីតតាមលំដាប់តគ្នា  $a_n = 2 + \dfrac{1}{2^n}$  ដែល  $n \in \mathbb{N}$ ។`, { size: 32, valign: 'middle' }),
        kids(1110, 530, 150)
      ]),

      /* 11 solution 1 */ page([
        line(80, 110, 400, '!!__ដំណោះស្រាយ__!!', { size: 34 }),
        T(80, 170, 1100, 80, R`!!១.!!  សរសេរតួនៃស៊ីត $(a_n)$ កំណត់ដោយ  $a_n = \dfrac{1}{n+2}$  ដែល  $1 \le n \le 4$`, { size: 28, valign: 'middle' }),
        step(100, 255, 660, R`ចំពោះ $n = 1$ នោះ  $a_1 = \dfrac{1}{1+2} = \dfrac{1}{3}$`, { size: 28, h: 80 }),
        step(100, 335, 660, R`ចំពោះ $n = 2$ នោះ  $a_2 = \dfrac{1}{2+2} = \dfrac{1}{4}$`, { size: 28, h: 80 }),
        step(100, 415, 660, R`ចំពោះ $n = 3$ នោះ  $a_3 = \dfrac{1}{3+2} = \dfrac{1}{5}$`, { size: 28, h: 80 }),
        step(100, 495, 660, R`ចំពោះ $n = 4$ នោះ  $a_4 = \dfrac{1}{4+2} = \dfrac{1}{6}$`, { size: 28, h: 80 }),
        step(100, 575, 700, R`គេបាន តួនៃស៊ីត  $(a_n)_{1 \le n \le 4} :\ \dfrac{1}{3},\ \dfrac{1}{4},\ \dfrac{1}{5},\ \dfrac{1}{6}$`, { size: 28, h: 76 }),
        step(800, 260, 200, '!!ដូចនេះ!!', { size: 32, anim: 'ans' }),
        S.box(780, 330, 480, 110, R`ស៊ីត $(a_n)_{1 \le n \le 4} :\ \dfrac{1}{3},\ \dfrac{1}{4},\ \dfrac{1}{5},\ \dfrac{1}{6}$`, { size: 26, anim: 'ans', align: 'center' })
      ]),

      /* 12 solution 2 */ page([
        T(80, 110, 1100, 80, R`!!២.!!  សរសេរតួនៃស៊ីតតាមលំដាប់តគ្នា  $a_n = 2 + \dfrac{1}{2^n}$  ដែល  $n \in \mathbb{N}$`, { size: 30, valign: 'middle' }),
        step(180, 200, 760, R`ចំពោះ $n = 1$ នោះ  $a_1 = 2 + \dfrac{1}{2} = \dfrac{5}{2}$`, { size: 30, h: 85 }),
        step(180, 285, 760, R`ចំពោះ $n = 2$ នោះ  $a_2 = 2 + \dfrac{1}{2^2} = \dfrac{9}{4}$`, { size: 30, h: 85 }),
        step(180, 370, 760, R`ចំពោះ $n = 3$ នោះ  $a_3 = 2 + \dfrac{1}{2^3} = \dfrac{17}{8}$`, { size: 30, h: 85 }),
        step(160, 460, 820, R`គេបាន តួនៃស៊ីត  $(a_n)_{n \in \mathbb{N}} :\ \dfrac{5}{2},\ \dfrac{9}{4},\ \dfrac{17}{8},\ \ldots$`, { size: 30, h: 85 })
      ].concat(S.conclude(560, R`ស៊ីត  $(a_n)_{n \in \mathbb{N}} :\ \dfrac{5}{2},\ \dfrac{9}{4},\ \dfrac{17}{8},\ \ldots$`, 120))),

      /* 13 section 2 */ page([
        T(50, 108, 700, 70, R`២. តួទី $n$ នៃស៊ីត`, { size: 46, font: 'display', color: 'head', shadow: true }),
        line(40, 185, 1200, R`!!__ឧទាហរណ៍ ៖__!!    កំណត់តួទី $n$ នៃស៊ីត  $3,\ 5,\ 7,\ 9,\ 11,\ \ldots$   ចំពោះ  $\forall n \in \mathbb{N}^*$`, { size: 30 }),
        T(80, 270, 1100, 160, R`$$3\;\overset{+2}{\frown}\;5\;\overset{+2}{\frown}\;7\;\overset{+2}{\frown}\;9\;\overset{+2}{\frown}\;11,\ \ldots \quad\longrightarrow\quad 2n + (3 - 2) = 2n + 1$$`, { size: 34, anim: true }),
        step(160, 470, 900, R`គេបាន តួទី !!$n$!! នៃស៊ីតគឺ  $a_n = 2n + 1,\ \ \forall n \in \mathbb{N}^*$`, { size: 32 })
      ]),

      /* 14 observing the pattern */ page([
        line(60, 115, 1200, R`!!__ឧទាហរណ៍ ៖__!!   កំណត់តួទី $n$ នៃស៊ីត  $3,\ 5,\ 7,\ 9,\ 11,\ \ldots$   ចំពោះ  $\forall n \in \mathbb{N}^*$`, { size: 30 }),
        line(40, 200, 360, 'គេសង្កេតឃើញ ៖'),
        step(440, 200, 500, R`$a_1 = 3 = 2 \times 1 + 1$`, { size: 36 }),
        step(440, 270, 500, R`$a_2 = 5 = 2 \times 2 + 1$`, { size: 36 }),
        step(440, 340, 500, R`$a_3 = 7 = 2 \times 3 + 1$`, { size: 36 }),
        step(440, 410, 500, R`$a_4 = 9 = 2 \times 4 + 1$`, { size: 36 }),
        step(440, 470, 400, '...........................', { size: 32 }),
        step(50, 560, 650, R`តាមលំនាំគំរូ គេបាន ៖   $a_n = 2 \times n + 1$`, { size: 32 }),
        step(680, 560, 140, '!!ដូចនេះ ៖!!', { size: 32, anim: 'ans' }),
        S.box(820, 550, 440, 84, R`$a_n = 2n + 1,\ \forall n \in \mathbb{N}^*$`, { size: 32, anim: 'ans', align: 'center' })
      ]),

      /* 15 method + exercise */ page([
        T(110, 120, 1080, 150, R`ដើម្បីសរសេររូបមន្តតួទី !!$n$!! នៃស៊ីត គេពិនិត្យមើលតួនីមួយៗនៃស៊ីត រួចរកមើលលំនាំគំរូរបស់វា ។ តួនីមួយៗនៃស៊ីតជាអនុគមន៍នៃចំនួនតួ ។`, { size: 34, valign: 'middle' }),
        line(40, 320, 1200, R`!!__លំហាត់ ៖__!!     កំណត់តួទី !!$n$!! ចំពោះ $\forall n \in \mathbb{N}^*$  នៃស៊ីតខាងក្រោម ៖`, { size: 32 }),
        T(270, 420, 520, 140, R`ក.  $\dfrac{2}{3},\ \dfrac{3}{4},\ \dfrac{4}{5},\ \dfrac{5}{6},\ \ldots$`, { size: 38, valign: 'middle' }),
        T(840, 420, 420, 140, R`ខ.  $-1,\ 2,\ 7,\ 14,\ 23,\ \ldots$`, { size: 34, valign: 'middle' }),
        kids(1110, 530, 150)
      ]),

      /* 16 solution a */ page([
        line(40, 115, 600, R`!!ក.!!  $\dfrac{2}{3},\ \dfrac{3}{4},\ \dfrac{4}{5},\ \dfrac{5}{6},\ \ldots$`, { size: 34, h: 90 }),
        step(40, 215, 640, R`ភាគយក ៖  $2,\ 3,\ 4,\ 5,\ \ldots \to n + 1$`, { size: 30 }),
        step(40, 285, 640, R`ភាគបែង ៖  $3,\ 4,\ 5,\ 6,\ \ldots \to n + 2$`, { size: 30 }),
        step(40, 370, 300, 'គេសង្កេតឃើញ ៖', { anim: 'obs' }),
        step(330, 360, 340, R`$a_1 = \dfrac{2}{3} = \dfrac{1+1}{1+2}$`, { size: 28, h: 80, anim: 'obs' }),
        step(330, 440, 340, R`$a_2 = \dfrac{3}{4} = \dfrac{2+1}{2+2}$`, { size: 28, h: 80 }),
        step(690, 360, 340, R`$a_3 = \dfrac{4}{5} = \dfrac{3+1}{3+2}$`, { size: 28, h: 80 }),
        step(690, 440, 340, R`$a_4 = \dfrac{5}{6} = \dfrac{4+1}{4+2}$`, { size: 28, h: 80 })
      ].concat(S.conclude(555, R`$a_n = \dfrac{n+1}{n+2},\ \ \forall n \in \mathbb{N}^*$`))),

      /* 17 solution b */ page([
        line(40, 115, 700, R`!!ខ.!!  $-1,\ 2,\ 7,\ 14,\ 23,\ \ldots$`, { size: 34 }),
        step(40, 190, 700, R`ផលដកជាប់គ្នា ៖  $3,\ 5,\ 7,\ 9$  (ពាក់កណ្តាល)`, { size: 28 }),
        step(40, 255, 700, R`ផលដកលើកទី២ ៖  $2,\ 2,\ 2 \ \to\ 1n^2$`, { size: 28 }),
        step(40, 320, 700, R`$n^2 :\ 1,\ 4,\ 9,\ 16,\ 25,\ \ldots$`, { size: 30 }),
        step(40, 385, 700, R`$a_n - n^2 :\ -2,\ -2,\ -2,\ -2,\ \ldots \ \to\ -2$`, { size: 30 }),
        step(720, 190, 520, R`គេសង្កេតឃើញ ៖  $a_1 = -1 = 1^2 - 2$`, { size: 28 }),
        step(890, 255, 360, R`$a_2 = 2 = 2^2 - 2$`, { size: 28 }),
        step(890, 320, 360, R`$a_3 = 7 = 3^2 - 2$`, { size: 28 }),
        step(40, 470, 900, R`តាមលំនាំគំរូ គេបាន ៖  $a_n = n^2 - 2$`, { size: 30 })
      ].concat(S.conclude(560, R`$a_n = n^2 - 2,\ \ \forall n \in \mathbb{N}^*$`))),

      /* 18 textbook model problem: bouncing ball */ page([
        T(40, 105, 1200, 60, '!!__លំហាត់គំរូ ២ ៖ បាល់ធ្លាក់ពីកម្ពស់ (សៀវភៅពុម្ពទំព័រ ៤)__!!', { size: 30, color: 'head' }),
        T(40, 160, 1180, 80, R`បាល់មួយត្រូវបានទម្លាក់ពីកម្ពស់ $6\text{ m}$ ។ ដោយដឹងថា បាល់នោះធ្លាក់ដល់ដីតែងតែលោតឡើងលើវិញបាន $\dfrac{2}{3}$ នៃកម្ពស់ដែលបាល់នោះធ្លាក់ចុះ ។ ចូរកំណត់កម្ពស់នៃបាល់ជាបន្តបន្ទាប់ដោយសរសេរជាស៊ីតមួយ រួចកំណត់តួទី $n$ នៃស៊ីតនេះ ។`, { size: 26, valign: 'middle' }),
        T(60, 245, 300, 40, '!!__ដំណោះស្រាយ__!!', { size: 28 }),
        step(60, 290, 800, R`• លើកដំបូង បាល់ធ្លាក់ពីកម្ពស់ ៖  $a_1 = 6\text{ m}$`, { size: 26 }),
        step(60, 340, 800, R`• លើកទី ១ បាល់លោតឡើងបាន ៖  $a_2 = 6 \times \dfrac{2}{3} = 4\text{ m}$`, { size: 26 }),
        step(60, 390, 800, R`• លើកទី ២ បាល់លោតឡើងបាន ៖  $a_3 = 6 \times \left(\dfrac{2}{3}\right)^2 = \dfrac{8}{3}\text{ m}$`, { size: 26 }),
        step(60, 440, 800, R`• លើកទី ៣ បាល់លោតឡើងបាន ៖  $a_4 = 6 \times \left(\dfrac{2}{3}\right)^3 = \dfrac{16}{9}\text{ m}$`, { size: 26 }),
        step(60, 495, 850, R`តាមលំនាំគំរូ កម្ពស់បាល់ជាបន្តបន្ទាប់គឺ  $6\left(\dfrac{2}{3}\right)^1,\ 6\left(\dfrac{2}{3}\right)^2,\ 6\left(\dfrac{2}{3}\right)^3,\ \ldots$`, { size: 26 }),
        S.box(60, 545, 960, 68, R`!!ដូចនេះ!!  តួទី $n$ នៃកម្ពស់បាល់គឺ  $a_n = 6 \times \left(\dfrac{2}{3}\right)^{n-1}\text{ (m)}$`, { size: 28, anim: true, align: 'center' }),
        kids(1060, 380, 180)
      ]),

      /* 19-21 quizzes */
      S.quiz(R`!!១.!! កំណត់តួទី $n$ ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស៊ីតខាងក្រោម ៖
$2,\ 4,\ 6,\ 8,\ 10,\ \ldots$`, [R`$a_n = 2n$`, R`$a_n = 4n - 2$`, R`$a_n = 3n - 1$`, R`$a_n = n + 1$`], 0),
      S.quiz(R`!!២.!! កំណត់តួទី $n$ ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស៊ីតខាងក្រោម ៖
$1,\ 5,\ 9,\ 13,\ 17,\ \ldots$`, [R`$a_n = 2n + 1$`, R`$a_n = 4n - 3$`, R`$a_n = 3n - 1$`, R`$a_n = n + 1$`], 1),
      S.quiz(R`!!៣.!! កំណត់តួទី $n$ ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស៊ីតខាងក្រោម ៖
$1,\ 4,\ 9,\ 16,\ 25,\ \ldots$`, [R`$a_n = 2n$`, R`$a_n = 2n^2$`, R`$a_n = n^2$`, R`$a_n = n^3$`], 2),

      /* 22 homework 1 */ S.homework(R`កំណត់តួទី !!$n$!! ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស៊ីតខាងក្រោម ៖
ក.   $5,\ 7,\ 9,\ 11,\ 13,\ \ldots$
ខ.   $-3,\ -1,\ 1,\ 3,\ 5,\ \ldots$`),

      /* ===== part 2 ===== */
      /* 23 */ S.toc(['==៣.អថេរភាពនៃស៊ីត==', '៣.១.ស៊ីតកើន-ស៊ីតចុះ', '៣.២.ស៊ីតម៉ូណូតូន']),
      /* 24 */ S.objective(['បង្ហាញថាស៊ីតមួយ ជាស៊ីតកើន ឬ ស៊ីតចុះ', 'បង្ហាញថាស៊ីតមួយជាស៊ីតម៉ូណូតូន']),

      /* 25 homework answers */ page([
        T(440, 110, 400, 60, '!!__ដំណោះស្រាយកិច្ចការផ្ទះ__!!', { size: 32, align: 'center' }),
        line(40, 180, 600, R`!!ក.!!  $5,\ 7,\ 9,\ 11,\ 13,\ \ldots$`),
        step(40, 250, 600, R`ផលដកថេរ $2 \to 2n$ ;  $5 - 2 = 3$`, { size: 28 }),
        step(60, 315, 560, R`$a_1 = 5 = 2 \times 1 + 3$`, { size: 30 }),
        step(60, 375, 560, R`$a_2 = 7 = 2 \times 2 + 3$`, { size: 30 }),
        S.box(60, 455, 520, 84, R`$a_n = 2n + 3,\ \forall n \in \mathbb{N}^*$`, { anim: true, align: 'center', size: 32 }),
        line(660, 180, 600, R`!!ខ.!!  $-3,\ -1,\ 1,\ 3,\ 5,\ \ldots$`),
        step(660, 250, 600, R`ផលដកថេរ $2 \to 2n$ ;  $-3 - 2 = -5$`, { size: 28 }),
        step(680, 315, 560, R`$a_1 = -3 = 2 \times (1) - 5$`, { size: 30 }),
        step(680, 375, 560, R`$a_2 = -1 = 2 \times (2) - 5$`, { size: 30 }),
        S.box(680, 455, 520, 84, R`$a_n = 2n - 5,\ \forall n \in \mathbb{N}^*$`, { anim: true, align: 'center', size: 32 })
      ]),

      /* 26 increasing / decreasing */ page([
        T(40, 108, 560, 70, '៣. អថេរភាពនៃស៊ីត', { size: 46, font: 'display', color: 'head', shadow: true }),
        T(660, 112, 560, 64, '!!__៣.១ ស៊ីតកើន - ស៊ីតចុះ__!!', { size: 38 }),
        S.box(440, 190, 800, 230, R`!!__និយមន័យ ៖__!!
❶ ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស៊ីតកើន!! លុះត្រាតែ $a_{n+1} > a_n$ ឬ $a_{n+1} - a_n > 0$
❷ ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស៊ីតចុះ!! លុះត្រាតែ $a_{n+1} < a_n$ ឬ $a_{n+1} - a_n < 0$`, { size: 24, valign: 'top' })
      ].concat(dotChart(50, 195, true, 'title', 'ស៊ីតកើន'), dotChart(235, 195, false, 'accent', '!!ស៊ីតចុះ!!'), [
        line(40, 440, 500, '!!__លំហាត់គំរូ ១ ៖__!!', { size: 32 }),
        line(110, 510, 1000, R`!!ក.!! បង្ហាញថា ស៊ីត $(a_n)$ ដែល  $a_n = 3n + 1$  ជា ស៊ីតកើន ។`, { size: 30 }),
        line(110, 580, 1000, R`!!ខ.!! បង្ហាញថា ស៊ីត $(a_n)$ ដែល  $a_n = 12 - 2n$  ជា ស៊ីតចុះ ។`, { size: 30 })
      ])),

      /* 27 solution a */ page([
        solTitle(),
        line(40, 180, 1000, R`!!ក.!! បង្ហាញថា ស៊ីត $(a_n)$ ដែល  $a_n = 3n + 1$  ជា ស៊ីតកើន`, { size: 30 }),
        line(40, 255, 800, R`គេមាន  $a_n = 3n + 1$`, { size: 32 }),
        step(40, 320, 800, R`$\Rightarrow a_{n+1} = 3(n+1) + 1 = 3n + 4$`, { size: 32 }),
        step(40, 390, 900, R`គេបាន   $a_{n+1} - a_n = (3n + 4) - (3n + 1) = 3 > 0$`, { size: 32 }),
        step(40, 460, 800, R`នោះ   $a_{n+1} > a_n,\ \forall n \in \mathbb{N}$`, { size: 32 })
      ].concat(S.conclude(560, R`ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតកើន`))),

      /* 28 solution b */ page([
        line(40, 120, 1000, R`!!ខ.!! បង្ហាញថា ស៊ីត $(a_n)$ ដែល  $a_n = 12 - 2n$  ជា ស៊ីតចុះ`, { size: 30 }),
        line(60, 200, 800, R`គេមាន  $a_n = 12 - 2n$`, { size: 32 }),
        step(130, 270, 900, R`$\Rightarrow a_{n+1} = 12 - 2(n+1) = -2n + 10$`, { size: 32 }),
        step(40, 345, 1000, R`គេបាន   $a_{n+1} - a_n = (-2n + 10) - (12 - 2n) = -2 < 0$`, { size: 32 }),
        step(40, 420, 800, R`នោះ   $a_{n+1} < a_n,\ \forall n \in \mathbb{N}$`, { size: 32 })
      ].concat(S.conclude(560, R`ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតចុះ`))),

      /* 29 ratio test */ page([
        line(40, 120, 800, R`❖ ចំពោះ  $a_n > 0,\ \ \forall n \in \mathbb{N}$`, { size: 34 }),
        S.box(220, 200, 1030, 280, R`❸ ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស៊ីតកើន!! លុះត្រាតែ  $a_{n+1} > a_n$  ឬ  $\dfrac{a_{n+1}}{a_n} > 1$

❹ ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស៊ីតចុះ!! លុះត្រាតែ  $a_{n+1} < a_n$  ឬ  $\dfrac{a_{n+1}}{a_n} < 1$`, { size: 33 })
      ]),

      /* 30 practice 2 */ page([
        line(160, 130, 600, '!!__លំហាត់គំរូ ២ ៖__!!', { size: 36 }),
        line(160, 220, 1000, 'តើស៊ីតខាងក្រោម មួយណាជាស៊ីតកើន មួយណាជាស៊ីតចុះ ។', { size: 36 }),
        line(160, 330, 900, R`!!ក.!! ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = 2^{n-1}$`, { size: 36 }),
        T(160, 440, 900, 120, R`!!ខ.!! ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \left(\dfrac{2}{3}\right)^{n+1}$`, { size: 36, valign: 'middle' }),
        kids()
      ]),

      /* 31 solution a */ page([
        solTitle(),
        line(40, 180, 900, R`!!ក.!! ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = 2^{n-1}$`, { size: 32 }),
        step(40, 255, 1000, R`គេមាន  $a_n = 2^{n-1} \ \Rightarrow\ a_{n+1} = 2^{(n+1)-1} = 2^n$`, { size: 32 }),
        step(40, 335, 1000, R`គេបាន  $\dfrac{a_{n+1}}{a_n} = \dfrac{2^n}{2^{n-1}} = \dfrac{2^n}{2^n \cdot 2^{-1}} = 2 > 1$`, { size: 32, h: 100 }),
        step(40, 450, 800, R`នោះ  $a_{n+1} > a_n,\ \forall n \in \mathbb{N}$`, { size: 32 })
      ].concat(S.conclude(560, R`ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតកើន`))),

      /* 32 solution b */ page([
        T(40, 112, 900, 100, R`!!ខ.!! ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \left(\dfrac{2}{3}\right)^{n+1}$`, { size: 30, valign: 'middle' }),
        step(40, 215, 1100, R`គេមាន  $a_n = \left(\dfrac{2}{3}\right)^{n+1} \Rightarrow a_{n+1} = \left(\dfrac{2}{3}\right)^{(n+1)+1} = \left(\dfrac{2}{3}\right)^{n+2}$`, { size: 30, h: 100 }),
        step(40, 325, 1100, R`គេបាន  $\dfrac{a_{n+1}}{a_n} = \dfrac{\left(\frac{2}{3}\right)^{n+2}}{\left(\frac{2}{3}\right)^{n+1}} = \dfrac{\left(\frac{2}{3}\right)^{n+1} \cdot \frac{2}{3}}{\left(\frac{2}{3}\right)^{n+1}} = \dfrac{2}{3} < 1$`, { size: 30, h: 130 }),
        step(40, 470, 800, R`នោះ  $a_{n+1} < a_n,\ \forall n \in \mathbb{N}$`, { size: 30 })
      ].concat(S.conclude(565, R`ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតចុះ`))),

      /* 33 monotone */ page([
        T(40, 112, 360, 60, '!!__៣.២ ស៊ីតម៉ូណូតូន__!!', { size: 32 }),
        S.box(420, 110, 820, 230, R`!!និយមន័យ ៖!!  ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស៊ីតម៉ូណូតូន!! លុះត្រាតែ ៖
       $a_1 < a_2 < a_3 < a_4 < \ldots < a_n < a_{n+1} < \ldots$
ឬ    $a_1 > a_2 > a_3 > a_4 > \ldots > a_n > a_{n+1} > \ldots$`, { size: 32, valign: 'top' }),
        T(60, 380, 1100, 64, R`❖ !!__សំគាល់__!!    ស៊ីតកើន ឬ ស៊ីតចុះ ជា !!ស៊ីតម៉ូណូតូន!! ។`, { size: 34, anim: true }),
        T(160, 480, 300, 60, 'ស៊ីតកើន', { size: 28, bold: true, fill: '#e7f0fb', border: 'title', bw: 2, radius: 10, align: 'center', valign: 'middle', color: 'title', anim: true }),
        T(160, 565, 300, 60, '!!ស៊ីតចុះ!!', { size: 28, bold: true, fill: '#fff0f0', bw: 2, border: 'accent', radius: 10, align: 'center', valign: 'middle', anim: true }),
        shape('arrow', 470, 520, 300, 24, { stroke: 'title', sw: 3, rot: 8, anim: 'mono' }),
        shape('arrow', 470, 570, 300, 24, { stroke: 'accent', sw: 3, rot: -8, anim: 'mono' }),
        T(790, 515, 360, 76, 'ស៊ីតម៉ូណូតូន', { size: 30, bold: true, fill: 'title', color: '#ffffff', radius: 14, align: 'center', valign: 'middle', anim: 'mono' })
      ]),

      /* 34 exercise 1 */ page([
        line(40, 120, 500, '!!__លំហាត់ ១ ៖__!!', { size: 34 }),
        line(40, 200, 1000, 'តើស៊ីតខាងក្រោម មួយណាជាស៊ីតម៉ូណូតូន ។', { size: 36 }),
        T(40, 280, 1100, 100, R`!!ក.!!   $1,\ \dfrac{1}{2},\ \dfrac{1}{3},\ \dfrac{1}{4},\ \dfrac{1}{5},\ \ldots,\ \dfrac{1}{n},\ \ldots$`, { size: 34, valign: 'middle' }),
        T(40, 400, 500, 100, R`!!ខ.!!   $a_n = \dfrac{2^n}{n},\ \ n \ge 1$`, { size: 34, valign: 'middle' }),
        T(540, 400, 700, 100, R`!!គ.!!   $1,\ -\dfrac{1}{2},\ \dfrac{1}{3},\ -\dfrac{1}{4},\ \ldots,\ (-1)^{n+1}\dfrac{1}{n},\ \ldots$`, { size: 30, valign: 'middle' })
      ]),

      /* 35 solutions a, b */ page([
        T(240, 108, 300, 56, '!!__ដំណោះស្រាយ__!!', { size: 30, align: 'center' }),
        T(30, 165, 620, 90, R`!!ក.!!  $1,\ \dfrac{1}{2},\ \dfrac{1}{3},\ \dfrac{1}{4},\ \ldots,\ \dfrac{1}{n},\ \ldots$`, { size: 28, valign: 'middle' }),
        T(30, 265, 640, 90, R`ដោយ  $1 > \dfrac{1}{2} > \dfrac{1}{3} > \dfrac{1}{4} > \ldots > \dfrac{1}{n} > \ldots$`, { size: 28, valign: 'middle', anim: true }),
        T(30, 365, 640, 90, R`នាំឱ្យ ស៊ីតនេះជា !!ស៊ីតចុះ!! ដូចនេះជា !!ស៊ីតម៉ូណូតូន!!`, { size: 28, valign: 'middle', anim: true }),
        T(700, 165, 540, 90, R`!!ខ.!!  $a_n = \dfrac{2^n}{n},\ n \ge 1$`, { size: 28, valign: 'middle' }),
        T(700, 255, 540, 80, R`$n = 1 \Rightarrow a_1 = \dfrac{2^1}{1} = 2$`, { size: 26, valign: 'middle', anim: true }),
        T(700, 335, 540, 80, R`$n = 2 \Rightarrow a_2 = \dfrac{2^2}{2} = 2$`, { size: 26, valign: 'middle', anim: true }),
        T(700, 415, 540, 80, R`$n = 3 \Rightarrow a_3 = \dfrac{2^3}{3} = \dfrac{8}{3}$`, { size: 26, valign: 'middle', anim: true }),
        T(700, 495, 540, 60, R`ដោយ  $a_1 = 2 = a_2 < a_3 < a_4 < \ldots$`, { size: 26, valign: 'middle', anim: true }),
        S.box(140, 540, 1000, 68, R`!!ដូចនេះ!!  ស៊ីត $a_n = \dfrac{2^n}{n}$ មិនមែនជា ស៊ីតម៉ូណូតូន`, { size: 28, anim: true })
      ]),

      /* 35 solution c */ page([
        T(40, 120, 1000, 100, R`!!គ.!!  $1,\ -\dfrac{1}{2},\ \dfrac{1}{3},\ -\dfrac{1}{4},\ \ldots,\ (-1)^{n+1}\dfrac{1}{n},\ \ldots$`, { size: 34, valign: 'middle' }),
        T(80, 250, 1000, 100, R`ដោយ  $1 > -\dfrac{1}{2}\ ,\ \ -\dfrac{1}{2} < \dfrac{1}{3}\ ,\ \ \dfrac{1}{3} > -\dfrac{1}{4}\ ,\ \ldots$`, { size: 34, valign: 'middle', anim: true }),
        S.box(40, 400, 1180, 110, R`!!ដូចនេះ!!   $1,\ -\dfrac{1}{2},\ \dfrac{1}{3},\ -\dfrac{1}{4},\ \ldots,\ (-1)^{n+1}\dfrac{1}{n},\ \ldots$  មិនមែនជា ស៊ីតម៉ូណូតូន`, { size: 30, anim: true })
      ]),

      /* 36 exercise 2 */ page([
        line(80, 220, 500, '!!__លំហាត់ ២ ៖__!!', { size: 36 }),
        line(80, 300, 1000, 'សិក្សាភាពម៉ូណូតូននៃស៊ីតដែលកំណត់ដូចខាងក្រោម ៖', { size: 36 }),
        T(80, 390, 900, 110, R`!!ក.!!  ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \dfrac{1}{n}$`, { size: 36, valign: 'middle' }),
        T(80, 510, 900, 110, R`!!ខ.!!  ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \dfrac{2n + 1}{n + 3}$`, { size: 36, valign: 'middle' }),
        kids(920, 330, 340)
      ]),

      /* 37 solution a */ page([
        T(40, 112, 900, 100, R`!!ក.!!  គេមាន  $a_n = \dfrac{1}{n} \ \Rightarrow\ a_{n+1} = \dfrac{1}{n+1}$`, { size: 34, valign: 'middle' }),
        T(40, 225, 1200, 110, R`គេបាន  $a_{n+1} - a_n = \dfrac{1}{n+1} - \dfrac{1}{n} = \dfrac{n - n - 1}{n(n+1)} = -\dfrac{1}{n(n+1)} < 0,\ \forall n \in \mathbb{N}$`, { size: 32, valign: 'middle', anim: true }),
        step(120, 360, 600, R`នាំឱ្យ   $a_{n+1} < a_n$`, { size: 32 }),
        step(120, 440, 900, R`គេបាន  ស៊ីត $(a_n)_{n \in \mathbb{N}}$  ជា ស៊ីតចុះ`, { size: 32 })
      ].concat(S.conclude(560, R`ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតម៉ូណូតូន`))),

      /* 38 solution b */ page([
        T(40, 108, 1200, 100, R`!!ខ.!!  គេមាន  $a_n = \dfrac{2n+1}{n+3} \ \Rightarrow\ a_{n+1} = \dfrac{2(n+1)+1}{(n+1)+3} = \dfrac{2n+3}{n+4}$`, { size: 30, valign: 'middle' }),
        T(40, 210, 1200, 110, R`គេបាន  $a_{n+1} - a_n = \dfrac{2n+3}{n+4} - \dfrac{2n+1}{n+3} = \dfrac{(2n+3)(n+3) - (2n+1)(n+4)}{(n+4)(n+3)}$`, { size: 30, valign: 'middle', anim: true }),
        T(40, 320, 1200, 100, R`$= \dfrac{2n^2 + 6n + 3n + 9 - 2n^2 - 8n - n - 4}{(n+4)(n+3)} = \dfrac{5}{(n+4)(n+3)} > 0,\ \forall n \in \mathbb{N}$`, { size: 30, valign: 'middle', anim: true }),
        step(40, 430, 1000, R`នាំឱ្យ  $a_{n+1} > a_n$   គេបាន ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតកើន`, { size: 30 })
      ].concat(S.conclude(555, R`ស៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស៊ីតម៉ូណូតូន`))),

      /* 39-41 quizzes */
      S.quiz(R`!!១.!! តើបណ្តាស៊ីត $(a_n)_{n \in \mathbb{N}}$ ខាងក្រោម មួយណាជាស៊ីតកើន?`,
        [R`$a_n = 3n - 4$`, R`$a_n = -n - 4$`, R`$a_n = -5 - 2n$`, R`$a_n = (-1)^n \cdot 2^{n+1}$`], 0),
      S.quiz(R`!!២.!! តើបណ្តាស៊ីត $(a_n)_{n \in \mathbb{N}}$ ខាងក្រោម មួយណាជាស៊ីតចុះ?`,
        [R`$a_n = -n + 2$`, R`$a_n = 2n - 4$`, R`$a_n = 4^n - 2$`, R`$a_n = \left(\frac{3}{2}\right)^n$`], 0),
      S.quiz(R`!!៣.!! តើបណ្តាស៊ីត $(a_n)_{n \in \mathbb{N}}$ ខាងក្រោម មួយណាជាស៊ីតកើន?`,
        [R`$a_n = \left(\frac{2}{3}\right)^n$`, R`$a_n = \left(\frac{1}{2}\right)^n$`, R`$a_n = \frac{n}{n+1}$`, R`$a_n = (0.12)^{n+1}$`], 2),

      /* 42 homework 2 */ S.homework(R`សិក្សាភាពម៉ូណូតូននៃស៊ីតដែលកំណត់ដូចខាងក្រោម ៖
!!ក.!!  ស៊ីត $(a_n)$ ដែល  $a_n = n^2 - 4n - 5$
!!ខ.!!  ស៊ីត $(a_n)$ ដែល  $a_{n+1} = a_n^{\,2}$  និង  $a_0 = 2$`),

      /* 43 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី១ ស៊ីតចំនួនពិត', theme: 'school', school: info.school, school2: info.school2, school3: info.school3,
             teacher: info.teacher, slides: slides };
  }

  // ថ្នាក់ទី១១ ជំពូកទី១ មេរៀនទី២ ស៊ីតនព្វន្ត — follows the teacher's sample deck page by page
  function arithmetic(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, chain = K.chain, hops = K.hops, bars = K.bars, rows = K.rows;
    var hot = { size: 22, fill: '#fff4e6', border: '#f68c1f', bw: 2, radius: 12, align: 'center', valign: 'middle' };
    // seat rows on slide 12 (a stage on top, each row wider than the one before)
    var seats = K.pill(210, 245, 240, 44, 'ឆាក', '#6b0000');
    [20, 23, 26, 29].forEach(function (v, i) {
      seats = seats.concat(K.pill(200 - i * 25, 300 + i * 56, 260 + i * 50, 46, 'ជួរទី ' + (i + 1) + ' ៖ ' + v + ' កៅអី', '#1f4e9c'));
    });
    seats = seats.concat(K.pill(80, 568, 500, 48, 'ជួរទី 15 ៖ ? កៅអី', '#f68c1f'),
                         [T(310, 520, 40, 40, '⋮', { size: 28, color: 'title', align: 'center' }),
                          T(470, 300, 190, 40, '+3 ក្នុងមួយជួរ', { size: 18, color: 'brand' })]);
    // pages ending in 5 on slide 10
    var pages = [];
    [5, 15, 25, 35, 45, 55, 65, 75, 85, 95].forEach(function (v, i) {
      pages.push(T(880 + (i % 5) * 76, 225 + Math.floor(i / 5) * 66, 68, 56, String(v), { size: 22, fill: '#ffffff', border: '#1f4e9c', bw: 2, align: 'center', valign: 'middle', color: v === 5 || v === 95 ? 'accent' : 'title' }));
    });
    // Gauss staircase on slide 28: 5 × 6 grid, row r has r + 1 blue cells
    var gauss = [];
    for (var r = 0; r < 5; r++) for (var c = 0; c < 6; c++) gauss.push(shape('rect', 1085 + c * 30, 200 + r * 30, 28, 28, { fill: c <= r ? '#1f4e9c' : '#f68c1f' }));
    // stadium rows on slide 32
    var stands = [T(1070, 160, 200, 28, 'ជួរទី 18', { size: 18, color: 'title', align: 'center' })];
    [[31, 200, 1], [30, 190, 1], [16, 150, 0], [15, 145, 0], [14, 140, 0]].forEach(function (s, i) {
      stands = stands.concat(K.pill(1170 - s[1] / 2, 192 + i * 38 + (i > 1 ? 30 : 0), s[1], 32, String(s[0]), s[2] ? '#1f4e9c' : '#f68c1f', 18));
    });
    stands = stands.concat(K.pill(1095, 420, 150, 50, 'ទីលាន', '#2f9e44', 22),
                           [T(1150, 268, 40, 34, '⋮', { size: 22, color: 'title', align: 'center' }),
                            T(1060, 476, 210, 30, 'ជួរទី 1 នៅជិតទីលាន', { size: 16, color: 'brand', align: 'center' })]);
    var bonus = [];
    for (var y = 0; y < 13; y++) bonus.push(138 + 16 * y);
    var desc = [];
    for (var m = 1; m <= 14; m++) desc.push(55 - 4 * m);

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី១==        មេរៀនទី២', 'ស៊ីតនព្វន្ត', K.info),
      /* 2 */ K.toc([
        '==១. និយមន័យនៃស៊ីតនព្វន្ត និងផលសងរួម d==',
        R`==២. តួទី $n$ នៃស៊ីតនព្វន្ត== ($a_n = a_1 + (n - 1)d$)`,
        R`==៣. ផលបូក $n$ តួដំបូងនៃស៊ីតនព្វន្ត== ($S_n$)`
      ], 42),
      /* 3 */ S.objective([
        R`កំណត់និយមន័យ និងផលសងរួម $d$ នៃស៊ីតនព្វន្ត`,
        R`សរសេរតួ និងកំណត់តួទី $n$ នៃស៊ីតនព្វន្ត ($a_n$)`,
        'បង្ហាញផលបូកតួស្មើចម្ងាយពីតួចុង និងមធ្យមនព្វន្ត',
        R`ទាញរូបមន្ត និងគណនាផលបូក $n$ តួដំបូង $S_n$`
      ]),

      /* 4 example: common difference */ page([
        title('១. និយមន័យនៃស៊ីតនព្វន្ត'),
        line(40, 165, 800, R`!!__ឧទាហរណ៍ ៖__!!   គេមានស៊ីតចំនួនពិត  $(a_n):\ 2,\ 4,\ 6,\ 8,\ \ldots$`, { size: 28 }),
        step(200, 225, 560, R`$a_1 = 2$`, { size: 28, h: 52 }),
        step(200, 277, 560, R`$a_2 = 4 = 2 + 2 = a_1 + 2$`, { size: 28, h: 52 }),
        step(200, 329, 560, R`$a_3 = 6 = 4 + 2 = a_2 + 2$`, { size: 28, h: 52 }),
        step(200, 381, 560, '..........................................', { size: 24, h: 40 }),
        step(200, 421, 560, R`$a_n = a_{n-1} + 2$`, { size: 28, h: 52 }),
        step(200, 473, 600, 'ចំនួន $2$ ហៅថា ផលសងរួមនៃស៊ីត ។', { size: 28, h: 52, anim: 'd2' }),
        T(40, 535, 770, 100, R`គេថាស៊ីតចំនួនពិត  $(a_n):\ 2,\ 4,\ 6,\ 8,\ \ldots$  ជា !!ស៊ីតនព្វន្ត!! មានផលសងរួមស្មើ $2$`, { size: 28, valign: 'middle', anim: true }),
        T(860, 160, 380, 36, '!!តំណាងលើបន្ទាត់ចំនួន!!', { size: 22, align: 'center', anim: 'd2' }),
        T(930, 330, 260, 52, R`ផលសងរួម !!$d = 2$!!`, Object.assign({ anim: 'd2' }, hot)),
        S.box(820, 400, 440, 230, R`!!__ជាទូទៅ ៖__!!  ផលសងរួមនៃស៊ីតនព្វន្ត តាងដោយ $d$ កំណត់ដោយ
$$d = a_2 - a_1 = a_3 - a_2 = \ldots = a_n - a_{n-1}$$`, { size: 20, anim: true })
      ].concat(K.at('d2', hops(900, 270, ['2', '4', '6', '8', '…'], '+2', 80, { ops: 3 })))),

      /* 5 definition */ page([
        S.box(90, 120, 1000, 190, R`!!__និយមន័យ ៖__!!
!!ស៊ីតនព្វន្ត!! គឺជាស៊ីតនៃចំនួនពិតដែលមានតួនីមួយៗ (ក្រៅពីតួទី១) ស្មើនឹងតួមុនបន្ទាប់បូកចំនួនថេរ $d$ មួយ ហៅថា !!ផលសងរួម!! ។`, { size: 32, valign: 'middle' }),
        T(90, 340, 700, 50, R`!!ដ្យាក្រាម ៖  តួនីមួយៗ = តួមុន + $d$!!`, { size: 28 }),
        T(130, 540, 640, 70, R`ទំនាក់ទំនងកំណើន ៖   $a_{n+1} = a_n + d$`, { size: 30, fill: '#fff4e6', border: '#f68c1f', bw: 2, radius: 14, align: 'center', valign: 'middle', anim: true }),
        kids()
      ].concat(chain(170, 450, ['$a_1$', '$a_2$', '$a_3$', '…', '$a_n$'], { box: { w: 120, h: 70 }, gap: 200, op: '$+d$', hl: [4] }))),

      /* 6 n-th term */ page([
        title(R`២. តួទី $n$ នៃស៊ីតនព្វន្ត`),
        line(120, 165, 900, R`!!__ឧទាហរណ៍ ៖__!!   គេមានស៊ីតនព្វន្ត  $(a_n):\ 1,\ 4,\ 7,\ 10,\ \ldots$`, { size: 28 }),
        line(330, 215, 640, R`មានតួទី 1   $a_1 = 1$  និង  $d = 3$`, { size: 28, h: 52 }),
        step(60, 265, 940, R`តួទី 2     $a_2 = 4 = 1 + 3 = a_1 + d$`, { size: 26, h: 50 }),
        step(60, 315, 940, R`តួទី 3     $a_3 = 7 = 4 + 3 = (1 + 3) + 3 = 1 + 2 \times 3 = a_1 + 2d$`, { size: 26, h: 50 }),
        step(60, 365, 940, R`តួទី 4     $a_4 = 10 = 7 + 3 = (1 + 2 \times 3) + 3 = 1 + 3 \times 3 = a_1 + 3d$`, { size: 26, h: 50 }),
        step(60, 412, 600, '.................................................', { size: 24, h: 36 }),
        step(60, 450, 700, R`តួទី $n$     $a_n = a_1 + (n - 1)d$`, { size: 28, h: 52 }),
        S.box(100, 515, 900, 130, R`!!__ជាទូទៅ ៖__!!   $(a_n)$ ជា !!ស៊ីតនព្វន្ត!! ដែលមានតួទីមួយ $a_1$ និង ផលសងរួម $d$ ។
តួទី $n$ នៃស៊ីតនព្វន្ត កំណត់ដោយ ៖   $a_n = a_1 + (n - 1)d$`, { size: 26, anim: true }),
        T(1030, 310, 240, 32, '!!ជណ្តើរកើន +3!!', { size: 22, align: 'center' })
      ].concat(bars(1040, 350, 220, 270, [1, 4, 7, 10], { labels: ['a₁', 'a₂', 'a₃', 'a₄'], hl: 3, vs: 20, ls: 18 }))),

      /* 7 bar chart + formula */ page([
        title('ស៊ីតនព្វន្ត'),
        line(40, 160, 900, R`តម្លៃតួនីមួយៗនៃស៊ីត  $2,\ 5,\ 8,\ 11,\ 14,\ 17\ \ (d = 3)$`, { size: 26 }),
        shape('rect', 705, 340, 560, 10, { fill: 'brand', anim: 'f' }),
        T(705, 356, 560, 36, R`ពី $a_1$ ទៅ $a_n$ បូក $d$ ចំនួន $(n - 1)$ ដង`, { size: 22, align: 'center', anim: 'f' }),
        S.box(780, 410, 460, 84, R`$a_n = a_1 + (n - 1)d$`, { size: 36, align: 'center', anim: 'f' }),
        T(760, 512, 500, 130, R`• !!$d > 0$!! ៖ ស៊ីតកើនជានិច្ច
• !!$d < 0$!! ៖ ស៊ីតចុះជានិច្ច
• !!$d = 0$!! ៖ ស៊ីតថេរ`, { size: 24, anim: true })
      ].concat(bars(60, 240, 600, 360, [2, 5, 8, 11, 14, 17], { labels: ['n = 1', 'n = 2', 'n = 3', 'n = 4', 'n = 5', 'n = 6'], hl: 5, vs: 20 }),
               chain(755, 280, ['$a_1$', '$a_2$', '$a_3$', '…', '$a_n$'], { box: { w: 90, h: 64 }, gap: 116, op: '$+d$', ops: 2, hl: [4], size: 24 }))),

      /* 8 remark + practice 1 */ page([
        T(80, 110, 900, 60, R`!!__សំគាល់ ៖__!!   $(a_n)$ ជាស៊ីតនព្វន្ត ដែលមានតួទីមួយ $a_0$ និង ផលសងរួម $d$ ។`, { size: 28, valign: 'middle' }),
        T(200, 180, 800, 56, R`តួទី $n + 1$  នៃស៊ីតនព្វន្ត កំណត់ដោយ   $a_n = a_0 + nd$`, { size: 28, valign: 'middle' }),
        T(200, 240, 800, 56, R`តួទី $n$  នៃស៊ីតនព្វន្ត កំណត់ដោយ   $a_{n-1} = a_0 + (n - 1)d$`, { size: 28, valign: 'middle' }),
        kids(1010, 110, 250),
        line(40, 370, 900, R`!!__លំហាត់គំរូ ១ ៖__!!   គេមានស៊ីតនព្វន្ត   $2,\ 8,\ 14,\ 20,\ \ldots$`, { size: 30 }),
        line(260, 440, 700, R`!!ក.!!  គណនាតួទី $20$`, { size: 30 }),
        line(260, 505, 700, R`!!ខ.!!  តើចំនួន $236$ ជាតួទីប៉ុន្មាន?`, { size: 30 })
      ]),

      /* 9 solution 1 */ page([
        K.solTitle(240, 100),
        line(40, 165, 780, R`!!ក.!!  គេមាន  $a_1 = 2$  និង  $d = a_2 - a_1 = 8 - 2 = 6$`, { size: 26, h: 52 }),
        step(40, 217, 780, R`តាមរូបមន្ត  $a_n = a_1 + (n - 1)d = 2 + (n - 1) \times 6 = 6n - 4$`, { size: 26, h: 52 }),
        step(40, 269, 780, R`ចំពោះ  $n = 20 \Rightarrow a_{20} = 6 \times 20 - 4 = 116$`, { size: 26, h: 52, anim: 'a20' }),
        S.box(60, 330, 520, 64, R`!!ដូចនេះ!!  តួទី 20 ៖  $a_{20} = 116$`, { size: 28, anim: true }),
        step(40, 420, 780, R`!!ខ.!!  តើចំនួន $236$ ជាតួទីប៉ុន្មាន?  គេមាន  $a_n = 6n - 4$`, { size: 26, h: 52 }),
        step(40, 472, 780, R`ដោយ  $a_n = 236 \Rightarrow 6n - 4 = 236 \Rightarrow 6n = 240 \Rightarrow n = 40$`, { size: 26, h: 52 }),
        S.box(60, 540, 520, 64, R`!!ដូចនេះ!!  $236$ ជាតួទី  $n = 40$`, { size: 28, anim: true }),
        T(860, 160, 380, 36, '!!តំណាងលើបន្ទាត់ចំនួន!!', { size: 22, align: 'center' }),
        T(880, 345, 370, 56, R`$a_{20} = 2 + 19 \times 6 = 116$`, Object.assign({ anim: 'a20' }, hot)),
        kids(1080, 470, 190)
      ].concat(hops(890, 280, ['2', '8', '14', '20', '…'], '+6', 70, { ops: 3, size: 22 }),
               K.at('a20', hops(1240, 280, ['116'], '', 70, { hl: 0, size: 22 }).slice(1)))),

      /* 10 practice 2: page numbers */ page([
        T(40, 100, 1220, 64, R`!!__លំហាត់គំរូ ២ ៖__!!   សៀវភៅមួយក្បាល $100$ ទំព័រ ចុះលេខទំព័រពី $1$ ដល់ $100$ ។ រកចំនួនទំព័រដែលមានលេខខាងចុង $5$ ។`, { size: 25, valign: 'middle' }),
        T(240, 168, 400, 46, '!!__ដំណោះស្រាយ__!!', { size: 30, align: 'center' }),
        step(40, 220, 800, 'លេខទំព័រដែលមានលេខខាងចុង $5$ បង្កើតបានស៊ីតនព្វន្ត ៖', { size: 26, h: 52 }),
        step(140, 272, 600, R`$5,\ 15,\ 25,\ \ldots,\ 95$`, { size: 32, h: 56, anim: 'list' }),
        step(40, 330, 820, R`គេបាន  $a_1 = 5,\ \ a_n = 95$  និង  $d = a_2 - a_1 = 15 - 5 = 10$`, { size: 26, h: 52 }),
        step(40, 382, 820, R`តាមរូបមន្ត  $a_n = a_1 + (n - 1)d \Rightarrow 95 = 5 + (n - 1) \times 10$`, { size: 26, h: 52 }),
        step(40, 434, 820, R`$\Rightarrow 95 = 10n - 5 \Rightarrow n = 10$`, { size: 26, h: 52 }),
        S.box(40, 520, 800, 72, R`!!ដូចនេះ!!  ទំព័រដែលមានលេខខាងចុង $5$ មាន $10$ ទំព័រ`, { size: 28, anim: 'p10' }),
        T(880, 180, 376, 36, '!!ទំព័រដែលមានលេខខាងចុង 5!!', { size: 20, align: 'center' }),
        T(880, 362, 376, 50, 'សរុប !!10!! ទំព័រ', Object.assign({ anim: 'p10' }, hot)),
        kids(1080, 470, 180)
      ].concat(K.at('list', pages))),

      /* 11 practice 3: two terms given */ page([
        T(40, 100, 1220, 56, R`!!__លំហាត់គំរូ ៣ ៖__!!   គេឱ្យស៊ីតនព្វន្ត $(a_n)$ ដែល  $a_5 = 17$  និង  $a_{12} = 45$ ។`, { size: 28, valign: 'middle' }),
        T(120, 156, 1100, 50, R`!!ក.!! រកតួទីមួយ $a_1$ និងផលសងរួម $d$ ។          !!ខ.!! សរសេរតួទូទៅ $a_n$ រួចគណនា $a_{30}$ ។`, { size: 25, valign: 'middle' }),
        T(440, 205, 400, 46, '!!__ដំណោះស្រាយ__!!', { size: 28, align: 'center' }),
        step(40, 255, 600, R`!!ក.!!  តាមរូបមន្ត  $a_n = a_1 + (n - 1)d$`, { size: 25, h: 48 }),
        step(80, 303, 560, R`$a_5 = a_1 + 4d = 17 \qquad (1)$`, { size: 25, h: 48 }),
        step(80, 351, 560, R`$a_{12} = a_1 + 11d = 45 \qquad (2)$`, { size: 25, h: 48 }),
        step(40, 399, 600, R`$(2) - (1)$ ៖   $7d = 28 \Rightarrow d = 4$`, { size: 25, h: 48, anim: 'd7' }),
        step(40, 447, 600, R`តាម $(1)$ ៖   $a_1 = 17 - 4 \times 4 = 1$`, { size: 25, h: 48 }),
        S.box(80, 492, 480, 54, R`!!ដូចនេះ!!   $a_1 = 1,\ \ d = 4$`, { size: 26, anim: true, align: 'center' }),
        step(660, 255, 410, R`!!ខ.!!  តួទូទៅនៃស៊ីត ៖`, { size: 25, h: 48 }),
        step(680, 303, 400, R`$a_n = 1 + (n - 1) \times 4 = 4n - 3$`, { size: 25, h: 48 }),
        step(660, 351, 410, R`ចំពោះ  $n = 30$ ៖`, { size: 25, h: 48 }),
        step(680, 399, 400, R`$a_{30} = 4 \times 30 - 3 = 117$`, { size: 25, h: 48 }),
        S.box(640, 492, 430, 54, R`!!ដូចនេះ!!  $a_n = 4n - 3,\ \ a_{30} = 117$`, { size: 24, anim: true, align: 'center' }),
        T(1080, 255, 190, 34, R`$7d = 45 - 17 = 28$`, { size: 18, align: 'center', anim: 'd7' }),
        T(1100, 295, 160, 52, R`$a_5 = 17$`, { size: 22, fill: '#e7f0fb', border: '#1f4e9c', bw: 2, radius: 10, align: 'center', valign: 'middle', anim: 'd7' }),
        shape('arrow', 1155, 370, 50, 16, { stroke: 'brand', sw: 4, rot: 90, anim: 'd7' }),
        T(1200, 362, 70, 32, R`$+7d$`, { size: 18, anim: 'd7' }),
        T(1100, 412, 160, 52, R`$a_{12} = 45$`, { size: 22, fill: '#fff4e6', border: '#f68c1f', bw: 2, radius: 10, align: 'center', valign: 'middle', anim: 'd7' }),
        tip(40, 555, 1030, 62, R`!!គន្លឹះ ៖!! ស៊ីតនព្វន្តមាន $a_m - a_k = (m - k)d$  ឧ. $a_{12} - a_5 = 7d$  ដូច្នេះ អាចរក $d$ បានភ្លាមៗ ដោយមិនចាំបាច់រក $a_1$ មុន ។`, { anim: true })
      ]),

      /* 12 practice 4: seats */ page([
        T(40, 100, 1220, 80, R`!!__លំហាត់គំរូ ៤ ៖__!!   សាលប្រជុំមួយមាន $15$ ជួរកៅអី ។ ជួរទី $1$ មានកៅអី $20$ ហើយជួរនីមួយៗបន្ទាប់ មានកៅអីច្រើនជាងជួរមុន $3$ ។`, { size: 25, valign: 'middle' }),
        T(120, 182, 1100, 48, R`!!ក.!! តើជួរទី $15$ មានកៅអីប៉ុន្មាន?          !!ខ.!! តើជួរទីប៉ុន្មានមានកៅអី $50$ ?`, { size: 25, valign: 'middle' }),
        T(650, 240, 300, 46, '!!__ដំណោះស្រាយ__!!', { size: 28 }),
        step(650, 288, 600, 'ចំនួនកៅអីតាមជួរ ជាស៊ីតនព្វន្ត ៖', { size: 25, h: 46 }),
        step(690, 334, 560, R`$a_1 = 20,\ \ d = 3$`, { size: 25, h: 46 }),
        step(690, 380, 560, R`$a_n = 20 + (n - 1) \times 3 = 3n + 17$`, { size: 25, h: 46 }),
        step(650, 426, 600, R`!!ក.!!  $a_{15} = 3 \times 15 + 17 = 62$`, { size: 25, h: 46 }),
        step(650, 472, 600, R`!!ខ.!!  $3n + 17 = 50 \Rightarrow 3n = 33 \Rightarrow n = 11$`, { size: 25, h: 46 }),
        S.box(650, 528, 420, 116, R`!!ដូចនេះ!!
ជួរទី $15$ មាន !!$62$!! កៅអី
ជួរទី $11$ មានកៅអី $50$`, { size: 24, anim: true }),
        kids(1100, 526, 160)
      ].concat(seats)),

      /* 13 practice exercises */ page([
        title('លំហាត់អនុវត្ត'),
        T(130, 588, 820, 40, 'ចម្លើយនៅស្លាយបន្ទាប់ — សូមព្យាយាមដោះស្រាយដោយខ្លួនឯងជាមុនសិន ។', { size: 20, color: '#868e96' }),
        card(1000, 230, 260, 290, R`!!ប្រអប់រូបមន្ត!!
$d = a_2 - a_1$
$a_n = a_1 + (n - 1)d$
$a_n = a_m + (n - m)d$
បីតួជាប់គ្នា $a, b, c$ ៖
$2b = a + c$`, { size: 20, fill: '#fff4e6', border: '#f68c1f', align: 'center', radius: 24 })
      ].concat(rows([
        R`គេឱ្យស៊ីតនព្វន្ត $7,\ 11,\ 15,\ 19,\ \ldots$ ។ រក $d$ , $a_n$ និង $a_{25}$ ។`,
        R`តើ $100$ ជាតួមួយនៃស៊ីតនព្វន្ត $4,\ 9,\ 14,\ \ldots$ ដែរឬទេ? ព្រោះអ្វី?`,
        R`ស៊ីតនព្វន្តមួយមាន $a_3 = 10$ និង $a_8 = -5$ ។ រក $a_1$ , $d$ និង $a_{20}$ ។`,
        R`តើពី $1$ ដល់ $200$ មានពហុគុណនៃ $7$ ចំនួនប៉ុន្មាន?`,
        R`រក $x$ ដើម្បីឱ្យ $x - 1,\ 2x + 1,\ 4x - 1$ ជាតួបន្តគ្នានៃស៊ីតនព្វន្ត ។`
      ], { w: 840 }))),

      /* 14 answers */ page([
        title('ចម្លើយលំហាត់អនុវត្ត'),
        T(130, 590, 1000, 40, R`!!គន្លឹះ ៖!! បើ $a, b, c$ ជាតួបន្តគ្នានៃស៊ីតនព្វន្ត លុះត្រាតែ $2b = a + c$`, { size: 22 })
      ].concat(rows([
        R`$d = 11 - 7 = 4,\ \ a_n = 7 + (n - 1) \times 4 = 4n + 3,\ \ a_{25} = 103$`,
        R`$a_n = 5n - 1$ ៖  $5n - 1 = 100 \Rightarrow n = 20.2$  មិនមែនចំនួនគត់  $\Rightarrow 100$ មិនមែនជាតួ`,
        R`$5d = a_8 - a_3 = -15 \Rightarrow d = -3,\ \ a_1 = a_3 - 2d = 16,\ \ a_{20} = 16 - 57 = -41$`,
        R`$7,\ 14,\ \ldots,\ 196$ ៖  $196 = 7 + (n - 1) \times 7 \Rightarrow n = 28 \Rightarrow$ មាន $28$ ចំនួន`,
        R`$2(2x + 1) = (x - 1) + (4x - 1) \Rightarrow x = 4$   (តួ ៖ $3,\ 9,\ 15$ ,  $d = 6$)`
      ], { w: 1100, anim: true }))),

      /* 15-17 quizzes */
      S.quiz(R`!!១.!! ចូរសរសេររូបមន្តតួទី $n$ នៃស៊ីតនព្វន្ត
$5,\ 1,\ -3,\ -7,\ -11,\ \ldots$`, [R`$a_n = 3n - 4$`, R`$a_n = -n - 4$`, R`$a_n = -5 - 2n$`, R`$a_n = -4n + 9$`], 3),
      S.quiz(R`!!២.!! កំណត់ចំនួនតួនៃស៊ីតនព្វន្ត
$18,\ 13,\ 8,\ \ldots,\ -102$`, [R`$n = 25$`, R`$n = 24$`, R`$n = 20$`, R`$n = 100$`], 0),
      S.quiz(R`!!៣.!! គេឱ្យ $(u_n)_{n \in \mathbb{N}}$ ជាស៊ីតនព្វន្ត បើគេដឹងថា $u_{35} = 9,\ u_{45} = 17$ ។ គណនា $u_{40}$ ។`,
        [R`$u_{40} = \frac{91}{5}$`, R`$u_{40} = 13$`, R`$u_{40} = -\frac{136}{5}$`, R`$u_{40} = -13$`], 1),

      /* 18-19 homework */
      S.homework(R`គេមាន ស៊ីតនព្វន្ត  $-8,\ -3,\ 2,\ 7,\ \ldots$ ។
!!ក.!!  គណនា  $u_{17}$  និង  $u_{43}$
!!ខ.!!  តើតួទីប៉ុន្មាននៃស៊ីតស្មើនឹង $232$ ។`),
      S.homework(R`!!១.!! គេឱ្យស៊ីតនព្វន្ត $12,\ 9,\ 6,\ 3,\ \ldots$ ។ សរសេរ $a_n$ រួចគណនា $a_{40}$ ។
!!២.!! ស៊ីតនព្វន្តមួយមាន $a_4 = 14$ និង $a_{10} = 32$ ។ រក $a_1$ , $d$ និង $a_n$ ។
!!៣.!! តើចំនួនគត់មានបីខ្ទង់ ដែលចែកដាច់នឹង $5$ មានប៉ុន្មាន?
!!៤.!! កម្មករម្នាក់ទទួលប្រាក់ខែដំបូង $300$ ដុល្លារ ហើយប្រាក់ខែកើន $15$ ដុល្លារ រៀងរាល់ខែ ។ តើខែទី $12$ គាត់ទទួលបានប្រាក់ខែប៉ុន្មាន?`),

      /* ===== part 2: sum of the first n terms ===== */
      /* 20 */ K.toc([R`==ផ្នែកទី ២ ៖ ៣. ផលបូក $n$ តួដំបូង==`, '៣.១. ផលបូកតួស្មើចម្ងាយពីតួចុង', '៣.២. មធ្យមនព្វន្ត', R`៣.៣. រូបមន្តផលបូក $S_n$`], 38),
      /* 21 */ S.objective(['គណនាផលបូកតួស្មើចម្ងាយពីតួចុង និងមធ្យមនព្វន្ត', R`គណនាផលបូក $n$ តួដំបូង និងដោះស្រាយបញ្ហាជាក់ស្តែង`]),

      /* 22 terms equidistant from the ends */ page([
        title('៣.១ ផលបូកតួស្មើចម្ងាយពីតួចុង'),
        line(40, 165, 700, R`ឧបមាថា $(a_n)$ ជាស៊ីតនព្វន្តមាន ៦ តួ ៖`, { size: 28 }),
        card(940, 175, 320, 200, R`$a_1 + a_6 = 2a_1 + 5d$
$a_2 + a_5 = 2a_1 + 5d$
$a_3 + a_4 = 2a_1 + 5d$
!!ផលបូកស្មើគ្នា!!`, { size: 22, align: 'center', anim: true }),
        S.box(50, 440, 1020, 88, R`!!__លក្ខណៈ ៖__!! ក្នុងស៊ីតនព្វន្ត $a_1, a_2, \ldots, a_n$ ផលបូកតួពីរដែលស្មើចម្ងាយពីតួចុង ស្មើនឹងផលបូកតួចុង ៖   $a_1 + a_n = a_2 + a_{n-1} = a_3 + a_{n-2} = \ldots$`, { size: 22, anim: true }),
        tip(50, 540, 1020, 75, R`!!__ឧទាហរណ៍ ៖__!! បើ $a_1 + a_{20} = 50$ នោះ $a_4 + a_{17} = 50$  ព្រោះ $4 + 17 = 1 + 20 = 21$
ជាទូទៅ ៖ បើ $p + q = r + s$ នោះ $a_p + a_q = a_r + a_s$`, { anim: true }),
        kids(1095, 470, 170)
      ].concat(chain(140, 280, ['$a_1$', '$a_2$', '$a_3$', '$a_4$', '$a_5$', '$a_6$'], { box: { w: 100, h: 60 }, gap: 140, hl: [1, 4] }),
               K.bracket(140, 840, 312, 92, '#1f4e9c'), K.bracket(280, 700, 312, 64, '#f68c1f'), K.bracket(420, 560, 312, 36, '#868e96'))),

      /* 23 worked examples */ page([
        title('លំហាត់គំរូ', { x: 40 }),
        tip(40, 160, 1000, 46, R`!!__រំលឹក ៖__!!  បើ $p + q = r + s$ នោះ $a_p + a_q = a_r + a_s$`, { size: 24 }),
        line(40, 214, 1000, R`!!__ឧទាហរណ៍ ៖__!!  បើ $a_1 + a_{27} = 467$ គណនា $a_{13} + a_{15}$`, { size: 25, h: 46 }),
        step(90, 260, 950, R`ដោយ $13 + 15 = 28 = 1 + 27$  នោះ  $a_{13} + a_{15} = 467$`, { size: 25, h: 46 }),
        line(40, 312, 1000, R`!!__លំហាត់គំរូ ១ ៖__!!  បើ $a_3 + a_{18} = 50$ ។ គណនា $S_{20}$`, { size: 25, h: 46 }),
        step(90, 358, 950, R`ដោយ $3 + 18 = 1 + 20 \Rightarrow a_1 + a_{20} = a_3 + a_{18} = 50$`, { size: 25, h: 46 }),
        S.box(260, 406, 600, 66, R`$S_{20} = \dfrac{20}{2}(a_1 + a_{20}) = 10 \times 50 = 500$`, { size: 25, align: 'center', anim: true }),
        step(40, 482, 1000, R`!!__លំហាត់គំរូ ២ ៖__!!  គណនា $S_{19}$ បើ $a_4 + a_8 + a_{12} + a_{16} = 224$`, { size: 25, h: 46, anim: 'ex2' }),
        step(90, 528, 950, R`ដោយ $4 + 16 = 8 + 12 = 1 + 19 \Rightarrow 2(a_1 + a_{19}) = 224 \Rightarrow a_1 + a_{19} = 112$`, { size: 24, h: 46 }),
        S.box(260, 578, 600, 66, R`$S_{19} = \dfrac{19}{2} \times 112 = 1064$`, { size: 25, align: 'center', anim: true }),
        T(1060, 250, 210, 30, '!!គូសន្ទស្សន៍ស្មើចម្ងាយ!!', { size: 17, align: 'center', anim: 'ex2' }),
        T(1060, 400, 210, 30, '1+19 = 4+16 = 8+12 = 20', { size: 15, color: 'title', align: 'center', anim: 'ex2' })
      ].concat(K.at('ex2', chain(1080, 310, ['a₁', 'a₄', 'a₈', 'a₁₂', 'a₁₆', 'a₁₉'], { r: 15, gap: 34, size: 12 })),
               K.at('ex2', K.bracket(1080, 1250, 328, 52, '#1f4e9c')),
               K.at('ex2', K.bracket(1114, 1216, 328, 36, '#f68c1f')),
               K.at('ex2', K.bracket(1148, 1182, 328, 20, '#c00000')))),

      /* 24 exercises with answers */ page([
        title('លំហាត់អនុវត្ត'),
        tip(130, 586, 880, 72, R`!!គន្លឹះ ៖!! រកគូសន្ទស្សន៍ដែលមានផលបូកស្មើគ្នា $(p + q = 1 + n)$ រួចប្រើ $a_p + a_q = a_1 + a_n$ និង $S_n = \dfrac{n(a_1 + a_n)}{2}$`, { size: 20 })
      ].concat(rows([
        { q: R`បើ $a_1 + a_{33} = 362$ គណនា $a_4 + a_{30}$`, a: '$362$' },
        { q: R`បើ $a_1 + a_{40} = 133$ គណនា $a_{16} + a_{25}$`, a: '$133$' },
        { q: R`បើ $a_5 + a_{16} = 46$ គណនា $S_{20}$`, a: '$S_{20} = 460$' },
        { q: R`បើ $a_7 + a_{10} = 37$ គណនា $a_1 + a_{16}$ និង $S_{16}$`, a: '$37$ ; $S_{16} = 296$' },
        { q: R`បើ $a_2 + a_9 + a_{14} + a_{21} = 120$ គណនា $S_{22}$`, a: '$S_{22} = 660$' }
      ]))),

      /* 25 arithmetic mean */ page([
        title('៣.២ មធ្យមនព្វន្ត'),
        S.box(50, 165, 1180, 100, R`!!__និយមន័យ ៖__!! បើ $a, b, c$ ជាបីតួតគ្នានៃស៊ីតនព្វន្ត នោះ $b$ ហៅថា !!មធ្យមនព្វន្ត!! នៃ $a$ និង $c$ ៖     $2b = a + c \iff b = \dfrac{a + c}{2}$`, { size: 26 }),
        T(150, 432, 600, 36, R`$b$ ស្ថិតនៅចំកណ្តាល $a$ និង $c$`, { size: 22, align: 'center' }),
        tip(900, 290, 330, 170, R`!!__ឧទាហរណ៍ ៖__!!   $4,\ b,\ 10$
$b = \dfrac{4 + 10}{2} = 7$
ស៊ីត ៖  $4,\ 7,\ 10$`, { size: 24, align: 'center', anim: true }),
        line(50, 485, 1000, R`!!__លំហាត់គំរូ ៖__!!  រក $x$ ដើម្បីឱ្យ $2x - 1,\ 3x + 2,\ 5x - 1$ ជាស៊ីតនព្វន្ត ។`, { size: 26 }),
        step(50, 540, 1000, R`$2(3x + 2) = (2x - 1) + (5x - 1) \Rightarrow 6x + 4 = 7x - 2 \Rightarrow x = 6$`, { size: 26, h: 52 }),
        S.box(50, 596, 960, 60, R`!!ដូចនេះ!!  $x = 6$  ហើយស៊ីតគឺ  $11,\ 20,\ 29$  (ផលសងរួម $d = 9$)`, { size: 25, anim: true }),
        kids(1095, 490, 170)
      ].concat(hops(170, 380, ['a', 'b', 'c'], '+d', 280, { hl: 1, size: 30 }))),

      /* 26 worked examples */ page([
        title('លំហាត់គំរូ', { x: 40 }),
        tip(40, 160, 1000, 46, R`!!__រំលឹក ៖__!!  $a, b, c$ ជាស៊ីតនព្វន្ត $\iff 2b = a + c$`, { size: 24 }),
        line(40, 212, 1010, R`!!__ឧទាហរណ៍ ៖__!!  មធ្យមនព្វន្តនៃ $7$ និង $19$ គឺ  $b = \dfrac{7 + 19}{2} = 13$`, { size: 25, h: 60 }),
        line(40, 274, 1010, R`!!__លំហាត់គំរូ ១ ៖__!!  បង្ហាញថា $(a - b)^2,\ a^2 + b^2,\ (a + b)^2$ ជាស៊ីតនព្វន្ត`, { size: 25, h: 46 }),
        step(90, 320, 960, R`$(a - b)^2 + (a + b)^2 = 2a^2 + 2b^2 = 2(a^2 + b^2)$`, { size: 25, h: 46 }),
        step(90, 366, 960, '⇒ តួកណ្តាលជាមធ្យមនព្វន្តនៃតួសងខាង ដូចនេះវាជាស៊ីតនព្វន្ត ✓', { size: 25, h: 46, color: '#2f9e44' }),
        line(40, 418, 1010, R`!!__លំហាត់គំរូ ២ ៖__!!  រក $x, y, z$ (ស៊ីតនព្វន្ត) បើ $x + y + z = 21$ និង $x^2 + y^2 + z^2 = 165$`, { size: 24, h: 46 }),
        step(90, 464, 960, R`តាង $x = 7 - d,\ z = 7 + d$   (ព្រោះ $3y = 21 \Rightarrow y = 7$)`, { size: 25, h: 46 }),
        step(90, 510, 960, R`$(7 - d)^2 + 49 + (7 + d)^2 = 165 \Rightarrow 2d^2 = 18 \Rightarrow d = \pm 3$`, { size: 25, h: 46 }),
        S.box(260, 570, 560, 62, R`$x, y, z = 4,\ 7,\ 10$   ឬ   $10,\ 7,\ 4$`, { size: 26, align: 'center', anim: true }),
        card(1060, 160, 205, 150, R`!!__លំហាត់គំរូ ៣ ៖__!!
បញ្ចូលមធ្យមនព្វន្ត ៣ ចំនួន រវាង $3$ និង $19$`, { size: 19 }),
        step(1060, 318, 205, R`$a_1 = 3,\ a_5 = 19$`, { size: 19, h: 40 }),
        step(1060, 358, 205, R`$4d = 16 \Rightarrow d = 4$`, { size: 19, h: 40 }),
        step(1060, 398, 205, R`$3,\ $!!$7,\ 11,\ 15$!!$,\ 19$`, { size: 21, h: 44 }),
        T(1060, 446, 205, 64, R`មធ្យមនព្វន្ត ៖ $7,\ 11,\ 15$`, { size: 19, color: 'brand', anim: true })
      ]),

      /* 27 exercises with answers */ page([
        title('លំហាត់អនុវត្ត'),
        tip(130, 586, 880, 72, R`!!គន្លឹះ ៖!! $a, b, c$ ជាស៊ីតនព្វន្ត $\iff 2b = a + c$ ។ បើស្គាល់ផលបូកបីតួ តាងបីតួជា $a - d,\ a,\ a + d$`, { size: 21 })
      ].concat(rows([
        { q: R`រកមធ្យមនព្វន្តនៃ $-5$ និង $17$`, a: '$b = 6$' },
        { q: R`កំណត់ $x$ ដើម្បីឱ្យ $x^2 - 1,\ 2x^2 + 1,\ 4x^2 - 2$ ជាស៊ីតនព្វន្ត`, a: R`$x = \pm\sqrt{5}$` },
        { q: R`កំណត់ $x$ ដើម្បីឱ្យ $(2 - x)^2,\ 2x,\ 2 + x$ ជាស៊ីតនព្វន្ត`, a: '$x = 1$ ឬ $x = 6$' },
        { q: R`រកបីចំនួនជាស៊ីតនព្វន្ត ដែលផលបូក $36$ និងផលគុណ $1428$`, a: R`$7,\ 12,\ 17$` },
        { q: R`បញ្ចូលមធ្យមនព្វន្ត ៤ ចំនួន រវាង $2$ និង $27$`, a: R`$7,\ 12,\ 17,\ 22$` }
      ]))),

      /* 28 sum formula */ page([
        title(R`៣.៣ រូបមន្តផលបូក $n$ តួដំបូង`),
        T(50, 160, 600, 40, '!!__ការទាញរករូបមន្ត ៖__!!', { size: 26 }),
        step(110, 202, 760, R`$S_n = a_1 + a_2 + \ldots + a_{n-1} + a_n$`, { size: 25, h: 44 }),
        step(60, 246, 810, R`$+\ \ S_n = a_n + a_{n-1} + \ldots + a_2 + a_1$`, { size: 25, h: 44 }),
        shape('rect', 60, 294, 800, 3, { fill: 'title', anim: 'add' }),
        step(90, 302, 900, R`$2S_n = (a_1 + a_n) + (a_1 + a_n) + \ldots + (a_1 + a_n)$`, { size: 25, h: 44, anim: 'add' }),
        step(90, 346, 900, R`$2S_n = n(a_1 + a_n)$    (មាន $n$ ដង)`, { size: 25, h: 44 }),
        S.box(50, 400, 1000, 124, R`!!__រូបមន្ត ៖__!!
$S_n = \dfrac{n}{2}(a_1 + a_n) \qquad$ ឬ $\qquad S_n = \dfrac{n}{2}[2a_1 + (n - 1)d]$`, { size: 28, align: 'center', anim: true }),
        tip(50, 536, 1000, 116, R`!!__ចំណាំ ៖__!!
ស្គាល់ $a_1$ និង $a_n \to$ ប្រើរូបមន្តទី១ ;  ស្គាល់ $a_1$ និង $d \to$ ប្រើរូបមន្តទី២
ចំនួនតួ ៖  $n = \dfrac{a_n - a_1}{d} + 1$`, { size: 21, valign: 'top', anim: true }),
        T(1070, 160, 200, 32, '!!រូបភាពរបស់ Gauss!!', { size: 20, align: 'center' }),
        T(1070, 360, 200, 96, '2(1+2+3+4+5)\n= 5 × 6 = 30\n!!S₅ = 15!!', { size: 18, color: 'title', align: 'center' })
      ].concat(gauss)),

      /* 29 worked examples */ page([
        title('លំហាត់គំរូ', { x: 40 }),
        tip(40, 158, 1220, 62, R`!!__រំលឹក ៖__!!  $S_n = \dfrac{n(a_1 + a_n)}{2} = \dfrac{n[2a_1 + (n - 1)d]}{2}$   ;   ចំនួនតួ  $n = \dfrac{a_n - a_1}{d} + 1$`, { size: 21 }),
        line(40, 226, 1000, R`!!__ឧទាហរណ៍ ៖__!!  គណនា  $5 + 10 + 15 + \ldots + 500$`, { size: 24, h: 44 }),
        step(80, 270, 960, R`$n = \dfrac{500 - 5}{5} + 1 = 100 \Rightarrow S = \dfrac{100(5 + 500)}{2} = 25\,250$`, { size: 23, h: 58 }),
        line(40, 330, 1000, R`!!__លំហាត់គំរូ ១ ៖__!!  គណនា  $100 + 95 + 90 + \ldots + (-20)$`, { size: 24, h: 44 }),
        step(80, 374, 960, R`$d = -5,\ n = \dfrac{-20 - 100}{-5} + 1 = 25 \Rightarrow S = \dfrac{25(100 - 20)}{2} = 1000$`, { size: 23, h: 58 }),
        line(40, 434, 1000, R`!!__លំហាត់គំរូ ២ ៖__!!  បើ $S_{10} = 210$ និង $S_{15} = 465$ ។ គណនា $S_{20}$`, { size: 24, h: 44 }),
        step(80, 478, 960, R`$5(2a_1 + 9d) = 210 \Rightarrow 2a_1 + 9d = 42$ ;  $\dfrac{15}{2}(2a_1 + 14d) = 465 \Rightarrow a_1 + 7d = 31$`, { size: 22, h: 58 }),
        step(80, 536, 960, R`$\Rightarrow 5d = 20 \Rightarrow d = 4,\ \ a_1 = 3$`, { size: 23, h: 44 }),
        S.box(250, 586, 620, 60, R`$S_{20} = 10(2 \times 3 + 19 \times 4) = 820$`, { size: 25, align: 'center', anim: true }),
        card(1060, 226, 205, 150, R`!!__លំហាត់គំរូ ៣ ៖__!!
រក $S_n$ អតិបរមា នៃស៊ីត $39,\ 37,\ 35,\ \ldots$`, { size: 19 }),
        step(1060, 384, 205, R`$a_1 = 39,\ d = -2$`, { size: 19, h: 40 }),
        step(1060, 424, 205, R`$S_n = 40n - n^2$`, { size: 19, h: 40 }),
        step(1060, 464, 205, R`$= 400 - (n - 20)^2 \le 400$`, { size: 18, h: 40 }),
        S.box(1060, 516, 205, 64, R`$S_{max} = S_{20} = 400$`, { size: 18, align: 'center', anim: true })
      ]),

      /* 30 exercises with answers */ page([
        title('លំហាត់អនុវត្ត'),
        tip(130, 586, 880, 72, R`!!គន្លឹះ ៖!! រកចំនួនតួ $n = \dfrac{a_n - a_1}{d} + 1$ មុនសិន រួចប្រើ $S_n = \dfrac{n(a_1 + a_n)}{2}$ ។ $S_n$ អតិបរមា ពេលតួនៅតែ $\ge 0$`, { size: 20 })
      ].concat(rows([
        { q: R`គណនា  $3 + 7 + 11 + \ldots + 399$`, a: R`$20\,100$` },
        { q: R`គណនា  $1 + 4 + 7 + \ldots + 301$`, a: R`$15\,251$` },
        { q: R`គណនា  $(-50) + (-45) + (-40) + \ldots + 100$`, a: '$775$' },
        { q: R`រក $S_n$ នៃ  $15 + 17 + 19 + \ldots$`, a: '$S_n = n(n + 14)$' },
        { q: R`រក $S_n$ អតិបរមា នៃស៊ីត  $45,\ 40,\ 35,\ 30,\ \ldots$`, a: '$S_9 = S_{10} = 225$' }
      ]))),

      /* 31 practice 1: positive terms */ page([
        title('លំហាត់គំរូ ១'),
        card(50, 160, 1000, 90, R`ស៊ីតនព្វន្ត $(a_n)$ មាន $a_1 = 51$ និង $d = -4$ ។   !!ក.!! គណនាតួទូទៅ $a_n$ ។
!!ខ.!! តើស៊ីតមានតួវិជ្ជមានប៉ុន្មាន? គណនាផលបូកតួវិជ្ជមានទាំងនោះ ។`, { size: 24, border: '#1f4e9c' }),
        T(50, 258, 300, 40, '!!__ដំណោះស្រាយ__!!', { size: 26 }),
        step(50, 300, 1000, R`!!ក.!!  $a_n = a_1 + (n - 1)d = 51 + (n - 1)(-4)$`, { size: 25, h: 46 }),
        S.box(560, 348, 380, 56, R`$a_n = 55 - 4n$`, { size: 28, align: 'center', anim: true }),
        step(50, 412, 1000, R`!!ខ.!!  $a_n > 0 \iff 55 - 4n > 0 \iff n < 13.75 \Rightarrow n = 1, 2, \ldots, 13$`, { size: 25, h: 46 }),
        step(90, 458, 960, R`មាន !!13 តួវិជ្ជមាន!! ព្រោះ  $a_{13} = 3 > 0$  និង  $a_{14} = -1 < 0$`, { size: 25, h: 46, anim: 'pos' }),
        step(250, 504, 700, R`$S_{13} = \dfrac{13}{2}(a_1 + a_{13}) = \dfrac{13}{2}(51 + 3)$`, { size: 25, h: 58 }),
        S.box(300, 570, 520, 60, R`!!ដូចនេះ!!   $S_{13} = 351$`, { size: 28, align: 'center', anim: true }),
        T(1060, 160, 120, 28, R`$a_1 = 51$`, { size: 16 }),
        T(1160, 380, 110, 28, R`$a_{14} = -1$`, { size: 16, anim: 'pos' }),
        T(1065, 420, 200, 30, 'តួវិជ្ជមាន 13 តួ', { size: 18, color: 'title', align: 'center', anim: 'pos' }),
        tip(1065, 470, 200, 150, R`!!គន្លឹះ ៖!! ពេល $d < 0$ ផលបូក $S_n$ ធំបំផុត ពេលបូកតែតួវិជ្ជមាន`, { size: 16, anim: true })
      ].concat(bars(1065, 190, 200, 180, desc, { values: false, hl: 13 }))),

      /* 32 practice 2: stadium */ page([
        title('លំហាត់គំរូ ២'),
        card(50, 160, 1000, 92, R`ពហុកីឡដ្ឋានមួយមាន $18$ ជួរកៅអី ។ ជួរទី $1$ មាន $14$ កៅអី ជួរទី $18$ មាន $31$ កៅអី ហើយចំនួនកៅអីកើនដូចៗគ្នាពីជួរមួយទៅជួរមួយ ។ តើពហុកីឡដ្ឋាននេះមានកៅអីសរុបប៉ុន្មាន?`, { size: 23, border: '#1f4e9c' }),
        T(50, 258, 300, 40, '!!__ដំណោះស្រាយ__!!', { size: 26 }),
        step(50, 300, 1000, R`ចំនួនកៅអីតាមជួរ ជាស៊ីតនព្វន្តដែល  $a_1 = 14,\ a_{18} = 31,\ n = 18$`, { size: 25, h: 46 }),
        step(50, 348, 1000, R`ផលសងរួម ៖  $d = \dfrac{a_{18} - a_1}{17} = \dfrac{31 - 14}{17} = 1$`, { size: 25, h: 60 }),
        step(50, 410, 1000, R`កៅអីសរុប ៖  $S_{18} = \dfrac{18}{2}(a_1 + a_{18}) = 9 \times (14 + 31) = 9 \times 45$`, { size: 25, h: 60 }),
        S.box(280, 476, 560, 56, R`!!ដូចនេះ!!  ពហុកីឡដ្ឋានមាន !!405!! កៅអី`, { size: 27, align: 'center', anim: true }),
        tip(50, 545, 1000, 108, R`!!__គន្លឹះ ៖__!!  បើស្គាល់តួទីមួយ និងតួចុងក្រោយ មិនចាំបាច់រក $d$ ទេ ៖   $S_n = \dfrac{n}{2}(a_1 + a_n)$
(ការរក $d = 1$ គ្រាន់តែជួយពិនិត្យថាស៊ីតត្រឹមត្រូវ)`, { anim: true })
      ].concat(stands)),

      /* 33 practice 3: three terms */ page([
        title('លំហាត់គំរូ ៣'),
        card(50, 160, 1000, 80, R`រកបីចំនួនដែលជាតួតគ្នានៃស៊ីតនព្វន្ត ដោយដឹងថាផលបូកបីចំនួននេះស្មើ $24$ និងផលគុណស្មើ $440$ ។`, { size: 24, border: '#1f4e9c' }),
        T(50, 250, 300, 40, '!!__ដំណោះស្រាយ__!!', { size: 26 }),
        step(50, 292, 1000, R`តាងបីចំនួននោះដោយ   $a - d,\ \ a,\ \ a + d$`, { size: 25, h: 46 }),
        step(50, 338, 1000, R`ផលបូក ៖  $(a - d) + a + (a + d) = 3a = 24 \Rightarrow a = 8$`, { size: 25, h: 46 }),
        step(50, 384, 1000, R`ផលគុណ ៖  $(8 - d) \cdot 8 \cdot (8 + d) = 440 \Rightarrow 64 - d^2 = 55$`, { size: 25, h: 46 }),
        step(50, 430, 1000, R`$\Rightarrow d^2 = 9 \Rightarrow d = 3$  ឬ  $d = -3$`, { size: 25, h: 46 }),
        S.box(200, 484, 660, 56, R`!!ដូចនេះ!!  បីចំនួននោះគឺ  $5,\ 8,\ 11$  ឬ  $11,\ 8,\ 5$`, { size: 26, align: 'center', anim: 'three' }),
        tip(50, 552, 1000, 100, R`!!__គន្លឹះ ៖__!!  ចំពោះបីតួតគ្នា តាងដោយ $a - d,\ a,\ a + d$ ព្រោះពេលបូក $d$ លុបគ្នាអស់ ហើយ $a$ ជាមធ្យមនព្វន្ត ។
ផ្ទៀងផ្ទាត់ ៖  $5 + 8 + 11 = 24,\ \ 5 \times 8 \times 11 = 440$`, { size: 21, anim: true }),
        T(1060, 410, 210, 70, R`$d = 3$
បូក = 24 , គុណ = 440`, { size: 18, align: 'center', anim: 'three' })
      ].concat(K.at('three', chain(1095, 330, ['5', '8', '11'], { r: 30, gap: 72, op: '$+d$', hl: [1], size: 22, sub: ['a − d', 'a', 'a + d'] })))),

      /* 34 practice 4: bonus */ page([
        title('លំហាត់គំរូ ៤'),
        card(50, 155, 1000, 104, R`ក្រុមហ៊ុនមួយផ្តល់ប្រាក់រង្វាន់ប្រចាំឆ្នាំដល់បុគ្គលិក ឆ្នាំទី $1$ ចំនួន $138$ ដុល្លារ ហើយដំឡើង $16$ ដុល្លារ ជារៀងរាល់ឆ្នាំ ។
!!ក.!! តើឆ្នាំទី $13$ ទទួលបានប៉ុន្មាន?      !!ខ.!! គិតត្រឹមឆ្នាំទី $13$ ទទួលបានសរុបប៉ុន្មាន?`, { size: 23, border: '#1f4e9c' }),
        step(50, 266, 1000, R`!!__ដំណោះស្រាយ__!!   ប្រាក់រង្វាន់តាមឆ្នាំជាស៊ីតនព្វន្ត  $a_1 = 138,\ d = 16$`, { size: 25, h: 46 }),
        step(50, 314, 1000, R`!!ក.!!  $a_{13} = a_1 + 12d = 138 + 12 \times 16 = 330$`, { size: 25, h: 46 }),
        S.box(560, 364, 440, 52, 'ឆ្នាំទី $13$ ទទួលបាន !!$330$ ដុល្លារ!!', { size: 24, align: 'center', anim: true }),
        step(50, 424, 1000, R`!!ខ.!!  $S_{13} = \dfrac{13}{2}(a_1 + a_{13}) = \dfrac{13}{2}(138 + 330) = 13 \times 234$`, { size: 25, h: 60 }),
        S.box(560, 488, 440, 52, 'សរុបទទួលបាន !!$3\\,042$ ដុល្លារ!!', { size: 24, align: 'center', anim: true }),
        tip(50, 550, 1000, 104, R`!!__ជំហានដោះស្រាយបញ្ហាជាក់ស្តែង ៖__!!
① កំណត់ $a_1$ និង $d$      ② រកតួ $a_n = a_1 + (n - 1)d$
③ រកផលបូក $S_n = \dfrac{n}{2}(a_1 + a_n)$      ④ សរសេរចម្លើយមានឯកតា`, { size: 19, valign: 'top', anim: true }),
        T(1060, 540, 210, 56, 'ប្រាក់រង្វាន់ឆ្នាំទី 1 → 13\n(+16 ដុល្លារ / ឆ្នាំ)', { size: 15, color: 'title', align: 'center' })
      ].concat(bars(1065, 190, 200, 330, bonus, { values: false, hl: 12 }))),

      /* 35 practice exercises */ page([
        title('លំហាត់អនុវត្ត'),
        card(1000, 160, 262, 410, R`!!__រូបមន្តជំនួយ__!!
$p + q = r + s \Rightarrow$
$a_p + a_q = a_r + a_s$
$2b = a + c$
$n = \dfrac{a_n - a_1}{d} + 1$
$S_n = \dfrac{n}{2}(a_1 + a_n)$
$S_n = \dfrac{n}{2}[2a_1 + (n - 1)d]$`, { size: 18, border: '#adb5bd', align: 'center' }),
        tip(50, 545, 930, 64, R`!!__ណែនាំ ៖__!! សិស្សធ្វើជាក្រុម ២ នាក់ រយៈពេល ១០ នាទី ។ លំហាត់ទី ៣ និងទី ៤ ត្រូវរកចំនួនតួ $n$ ជាមុនសិន ។`, { size: 20 })
      ].concat(rows([
        R`ស៊ីតនព្វន្តមួយមាន $a_1 + a_{30} = 72$ ។ គណនា $a_5 + a_{26}$ ។`,
        R`រក $x$ ដើម្បីឱ្យ $(1 + x)^2,\ (3 + x)^2,\ (9 + x)^2$ ជាស៊ីតនព្វន្ត ។`,
        R`គណនាផលបូក  $(-6) + (-1) + 4 + 9 + \ldots + 64$ ។`,
        R`គណនាផលបូក  $2 + 4 + 6 + \ldots + 146$ ។`,
        R`ស៊ីតនព្វន្តមួយមាន $a_2 = 7$ និង $a_{12} = 22$ ។ គណនា $S_{30}$ ។`
      ], { w: 840 }))),

      /* 36 answers */ page([
        title('ចម្លើយលំហាត់អនុវត្ត'),
        tip(130, 545, 1000, 60, R`!!ចំណាំ ៖!! ចំនួនតួ $n = \dfrac{a_n - a_1}{d} + 1$ ត្រូវតែជាចំនួនគត់វិជ្ជមាន ។ បើមិនមែន ចំនួននោះមិនមែនជាតួនៃស៊ីតទេ ។`, { size: 19 })
      ].concat(rows([
        R`$5 + 26 = 1 + 30 = 31 \Rightarrow a_5 + a_{26} = a_1 + a_{30} \Rightarrow a_5 + a_{26} = 72$`,
        R`$2(3 + x)^2 = (1 + x)^2 + (9 + x)^2 \Rightarrow 18 + 12x = 82 + 20x \Rightarrow x = -8$  (ស៊ីត $49,\ 25,\ 1$)`,
        R`$d = 5,\ n = \dfrac{64 + 6}{5} + 1 = 15,\ S_{15} = \dfrac{15}{2}(-6 + 64) \Rightarrow S_{15} = 435$`,
        R`$d = 2,\ n = \dfrac{146 - 2}{2} + 1 = 73,\ S_{73} = \dfrac{73}{2}(2 + 146) \Rightarrow S_{73} = 5\,402$`,
        R`$d = \dfrac{22 - 7}{10} = 1.5,\ a_1 = 5.5,\ S_{30} = 15(11 + 29 \times 1.5) \Rightarrow S_{30} = 817.5$`
      ], { w: 1110, h: 70, gap: 84, anim: true }))),

      /* 37 multiple choice */ page([
        title('ពង្រឹងពុទ្ធិ (សំណួរពហុជ្រើសរើស)'),
        card(1060, 170, 205, 300, R`!!__របៀបលេង__!!
① អានសំណួរ
② គណនាលើក្រដាសព្រាង
③ លើកដៃជ្រើស ក ខ គ ឃ
④ ចុចបង្ហាញចម្លើយ ✔`, { size: 18, border: '#adb5bd' })
      ].concat(K.mcq([
        { q: R`តួទី $22$ នៃស៊ីតនព្វន្តដែលមាន $a_1 = -7$ និង $d = 9$ គឺ ៖`, opts: ['$183$', '$182$', '$173$', '$191$'], ans: 1 },
        { q: R`ផលបូក $20$ តួដំបូងនៃស៊ីតនព្វន្តដែលមាន $a_1 = 2$ និង $d = 5$ គឺ ៖`, opts: ['$985$', '$991$', '$990$', '$995$'], ans: 2 },
        { q: R`ចំនួន $237$ ជាតួទីប៉ុន្មាននៃស៊ីតនព្វន្ត $15,\ 21,\ 27,\ \ldots$ ?`, opts: ['$39$', '$44$', '$38$', '$32$'], ans: 2 },
        { q: R`ផលបូក $18$ តួដំបូងនៃស៊ីតនព្វន្តដែលមាន $a_1 = 5$ និង $d = 3$ គឺ ៖`, opts: ['$549$', '$546$', '$550$', '$552$'], ans: 0 }
      ]))),

      /* 38 homework */ page([
        title('កិច្ចការផ្ទះ'),
        tip(130, 545, 1000, 60, R`!!លំហាត់បន្ថែម ៖!! ឯកសារលំហាត់ស៊ីតនព្វន្ត ៖ លំហាត់ទី ៤ (ផលបូកតួស្មើចម្ងាយ) លំហាត់ទី ៥ (ផលបូក $n$ តួ) លំហាត់ទី ៦ (PISA) និងសំណួរ MCQ ។`, { size: 19 })
      ].concat(rows([
        R`កសិករដាំកូនឈើ ជួរទី $1$ មាន $203$ ដើម ហើយជួរបន្ទាប់ៗកើន $16$ ដើម ។ បើដាំបាន $13$ ជួរ តើដាំបានសរុបប៉ុន្មានដើម?`,
        R`កីឡាកររត់ថ្ងៃទី $1$ បាន $243\text{ m}$ ហើយរត់បន្ថែម $20\text{ m}$ ជារៀងរាល់ថ្ងៃ ។ ថ្ងៃទី $22$ រត់បានប៉ុន្មាន? ចម្ងាយសរុបប៉ុន្មាន?`,
        R`ជញ្ជាំងឥដ្ឋ $14$ ជួរ ជួរក្រោមបង្អស់មាន $109$ ដុំ ហើយជួរបន្ទាប់ៗថយ $5$ ដុំ ។ ជួរលើបង្អស់មានប៉ុន្មានដុំ? ប្រើឥដ្ឋសរុបប៉ុន្មាន?`,
        R`រកបីចំនួនតួតគ្នានៃស៊ីតនព្វន្ត ដែលផលបូកស្មើ $15$ និងផលបូកការ៉េស្មើ $83$ ។`,
        R`ស៊ីតនព្វន្តមួយមាន $S_9 = 162$ និង $S_{12} = 288$ ។ គណនា $a_1,\ d$ និង $S_{30}$ ។`
      ], { w: 1110, h: 70, gap: 84, size: 22 }))),

      /* 39 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី២ ស៊ីតនព្វន្ត', theme: 'school', school: K.info.school, school2: K.info.school2, school3: K.info.school3,
             teacher: K.info.teacher, slides: slides };
  }

  // ថ្នាក់ទី១១ ជំពូកទី១ មេរៀនទី៣ ស៊ីតធរណីមាត្រ — follows the teacher's sample deck page by page
  function geometric(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, chain = K.chain, bars = K.bars;
    var sec = function (text, y) { return title(text, { x: 80, y: y, size: 34, color: 'brand' }); };
    var s26 = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 26, h: 48 }); for (var k in o) e[k] = o[k]; return e; };
    var l26 = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 26, h: 48 }); for (var k in o) e[k] = o[k]; return e; };
    // 8 × 8 chessboard for the rice problem, first row's four squares framed in red
    var board = [];
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) board.push(shape('rect', 90 + c * 18, 500 + r * 18, 18, 18, { fill: (r + c) % 2 ? '#b5895a' : '#f3dcb2' }));
    board.push(shape('rect', 90, 500, 72, 18, { fill: 'none', stroke: '#c00000', sw: 2 }));
    var people = [], ptxt = [];
    for (var y = 0; y < 10; y++) { people.push(2 * Math.pow(1.04, y)); ptxt.push((2 * Math.pow(1.04, y)).toFixed(2)); }

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី១==        មេរៀនទី៣', 'ស៊ីតធរណីមាត្រ', K.info),
      /* 2 */ S.toc([
        '==១. និយមន័យស៊ីតធរណីមាត្រ និងផលធៀបរួម q==',
        R`==២. តួទី $n$ នៃស៊ីតធរណីមាត្រ== ($a_n = a_1 q^{n-1}$)`,
        '==៣. ផលគុណតួស្មើចម្ងាយពីតួចុង និងមធ្យមធរណីមាត្រ==',
        R`==៤. ផលបូក $n$ តួដំបូងនៃស៊ីតធរណីមាត្រ== ($S_n$)`,
        R`==៥. ស៊ីតធរណីមាត្រអនន្តតួ== ($S_\infty = \dfrac{a_1}{1 - q}$)`
      ]),
      /* 3 */ S.objective([
        R`កំណត់និយមន័យ និងផលធៀបរួម $q$ នៃស៊ីតធរណីមាត្រ`,
        R`កំណត់តួទី $n$ ($a_n$) និងមធ្យមធរណីមាត្រ $b = \sqrt{ac}$`,
        R`គណនាផលបូក $n$ តួដំបូង $S_n$ នៃស៊ីតធរណីមាត្រ`,
        R`គណនាផលបូកនៃស៊ីតធរណីមាត្រអនន្តតួ $S_\infty$ ($|q| < 1$)`
      ]),

      /* 4 review: arithmetic sequence */ page([
        sec('រំលឹកមេរៀនចាស់'),
        line(60, 165, 1000, R`!!__លំហាត់ ៖__!!   គេមានស៊ីតនព្វន្ត  $3,\ 7,\ 11,\ 15,\ \ldots$`, { size: 30 }),
        line(220, 222, 900, R`ចូររកតួទី $n$ នៃស៊ីតនេះ រួចគណនា  $a_{10}$ ។`, { size: 30 }),
        line(60, 300, 400, '!!__ដំណោះស្រាយ__!!', { size: 30 }),
        step(60, 355, 1000, R`គេមាន  $a_1 = 3$   និង ផលសងរួម  $d = 7 - 3 = 4$`, { size: 28 }),
        step(60, 410, 1000, R`តាមរូបមន្ត  $a_n = a_1 + (n - 1)d = 3 + (n - 1) \times 4 = 4n - 1$`, { size: 28 }),
        step(60, 465, 1000, R`ចំពោះ  $n = 10$  នោះ  $a_{10} = 4 \times 10 - 1 = 39$`, { size: 28 }),
        S.box(150, 548, 800, 66, R`!!ដូចនេះ!!   $a_n = 4n - 1$    និង    $a_{10} = 39$`, { size: 30, anim: true }),
        kids()
      ]),

      /* 5 warm-up question */ page([
        sec('សំណួរនាំចូល'),
        line(60, 162, 900, 'គេមានចំនួនដែលតម្រៀបតាមលំដាប់ ៖', { size: 30 }),
        line(470, 215, 600, R`$2,\ 6,\ 18,\ 54,\ 162,\ \ldots$`, { size: 38 }),
        line(60, 272, 900, 'តើតួនីមួយៗ ទាក់ទងនឹងតួមុនរបស់វាដូចម្តេច ?', { size: 30 }),
        kids(1095, 500, 170)
      ].concat(K.at('x3', chain(190, 385, ['2', '6', '18', '54', '162', '…'], { r: 42, gap: 175, op: '×3', ops: 4, size: 28 })), [
        S.box(110, 470, 960, 150, R`!!ចម្លើយ ៖!!  តួនីមួយៗ ស្មើនឹងតួមុន គុណនឹង $3$
$6 = 2 \times 3,\ \ 18 = 6 \times 3,\ \ 54 = 18 \times 3,\ \ 162 = 54 \times 3$
ស៊ីតបែបនេះ ហៅថា !!ស៊ីតធរណីមាត្រ!! ។`, { size: 28, anim: true })])),

      /* 6 definition */ page([
        title('មេរៀនទី ៣ ៖ ស៊ីតធរណីមាត្រ', { x: 80, size: 38, color: 'title' }),
        sec('១. និយមន័យស៊ីតធរណីមាត្រ', 152),
        line(80, 215, 1000, R`!!__ឧទាហរណ៍ ១ ៖__!!   គេមានស៊ីត  $2,\ 6,\ 18,\ 54,\ 162,\ \ldots$`, { size: 28 }),
        step(200, 268, 480, R`$a_1 = 2$`, { size: 26, h: 44 }),
        step(200, 312, 480, R`$a_2 = 6 = 2 \times 3 = a_1 \times 3$`, { size: 26, h: 44 }),
        step(200, 356, 480, R`$a_3 = 18 = 6 \times 3 = a_2 \times 3$`, { size: 26, h: 44 }),
        step(720, 290, 520, R`$a_4 = 54 = 18 \times 3 = a_3 \times 3$`, { size: 26, h: 44 }),
        step(720, 334, 520, R`$a_5 = 162 = 54 \times 3 = a_4 \times 3$`, { size: 26, h: 44 }),
        step(80, 405, 1000, 'តួនីមួយៗ (ក្រៅពីតួទី១) ស្មើនឹងតួមុនរបស់វា គុណនឹងចំនួនថេរ !!$3$!! ។', { size: 27, h: 52 }),
        S.box(80, 465, 990, 186, R`!!និយមន័យ ៖!!  ស៊ីតធរណីមាត្រ គឺជាស៊ីតដែលតួនីមួយៗ (ក្រៅពីតួទី១) ស្មើនឹងតួមុនរបស់វា គុណនឹងចំនួនថេរ $q \neq 0$ ហៅថា !!ផលធៀបរួម!! ។
$$q = \dfrac{a_2}{a_1} = \dfrac{a_3}{a_2} = \cdots = \dfrac{a_{n+1}}{a_n}$$`, { size: 26, anim: true }),
        kids(1095, 500, 170)
      ]),

      /* 7 n-th term */ page([
        sec(R`២. តួទី $n$ នៃស៊ីតធរណីមាត្រ`),
        line(80, 160, 1000, R`!!__ឧទាហរណ៍ ២ ៖__!!   ពីស៊ីត  $2,\ 6,\ 18,\ 54,\ 162,\ \ldots$  គេមាន ៖`, { size: 28 }),
        step(180, 212, 520, R`$a_1 = 2$`, { size: 26, h: 44 }),
        step(180, 256, 520, R`$a_2 = 2 \times 3 = 2 \times 3^{2-1}$`, { size: 26, h: 44 }),
        step(180, 300, 520, R`$a_3 = 2 \times 3 \times 3 = 2 \times 3^{3-1}$`, { size: 26, h: 44 }),
        step(720, 212, 540, R`$a_4 = 2 \times 3 \times 3 \times 3 = 2 \times 3^{4-1}$`, { size: 26, h: 44 }),
        step(720, 256, 540, R`$a_5 = 2 \times 3^4 = 2 \times 3^{5-1}$`, { size: 26, h: 44 }),
        step(720, 300, 540, '.....................................', { size: 24, h: 40 }),
        step(80, 362, 640, R`តាមលំនាំគំរូ គេបាន ៖   $a_n = 2 \times 3^{n-1}$`, { size: 30 }),
        shape('rect', 770, 470, 448, 3, { fill: 'title', anim: 'diag' }),
        T(740, 476, 520, 32, R`គុណនឹង $q$ ចំនួន $(n - 1)$ ដង`, { size: 20, align: 'center', anim: 'diag' }),
        S.box(80, 525, 990, 126, R`!!រូបមន្ត ៖!!  តួទី $n$ នៃស៊ីតធរណីមាត្រ ដែលមានតួទី១ $a_1$ និងផលធៀបរួម $q$ គឺ ៖
$$a_n = a_1 \times q^{n-1}$$`, { size: 27, anim: true }),
        kids(1095, 510, 165)
      ].concat(K.at('diag', chain(770, 425, ['$a_1$', '$a_2$', '$a_3$', '…', '$a_n$'], { r: 32, gap: 112, op: '×q', size: 22 })))),

      /* 8 remark: from the k-th term */ page([
        sec(R`២. តួទី $n$ នៃស៊ីតធរណីមាត្រ`),
        S.box(80, 160, 1010, 110, R`!!__សំគាល់ ៖__!!  បើគេស្គាល់តួទី $k$ នោះតួទី $n$ គឺ ៖
$a_n = a_k \times q^{n-k}$         ឧ.  $a_6 = a_3 \times q^3$`, { size: 28 }),
        T(80, 285, 1180, 80, R`!!__ឧទាហរណ៍ ៖__!!  ស៊ីតធរណីមាត្រមួយមាន $a_3 = 12$ និង $a_6 = 96$ ។ រកផលធៀបរួម $q$ តួទីមួយ $a_1$ និងតួទី $n$ ។`, { size: 26, valign: 'middle' }),
        line(80, 372, 400, '!!__ដំណោះស្រាយ__!!', { size: 28 }),
        step(80, 428, 790, R`គេមាន  $a_6 = a_3 \times q^3 \Rightarrow 96 = 12 \times q^3 \Rightarrow q^3 = 8 \Rightarrow q = 2$`, { size: 25, anim: 'q3' }),
        step(80, 482, 790, R`ដោយ  $a_3 = a_1 \times q^2 \Rightarrow 12 = a_1 \times 4 \Rightarrow a_1 = 3$`, { size: 25 }),
        S.box(80, 562, 820, 64, R`!!ដូចនេះ!!   $q = 2,\ a_1 = 3,\ a_n = 3 \times 2^{n-1}$`, { size: 28, anim: true }),
        T(905, 530, 324, 32, '× q³', { size: 22, bold: true, color: 'accent', align: 'center', anim: 'q3' })
      ].concat(K.at('q3', chain(905, 445, ['$a_3$', '$a_4$', '$a_5$', '$a_6$'], { r: 32, gap: 108, op: '×q', size: 22, sub: ['12', '', '', '96'] })),
               K.at('q3', K.bracket(905, 1229, 512, 14, '#1f4e9c')))),

      /* 9 practice 1 */ page([
        line(200, 140, 1000, R`!!__លំហាត់គំរូ ១ ៖__!!   គេមានស៊ីតធរណីមាត្រ  $6,\ 12,\ 24,\ 48,\ \ldots$`, { size: 32 }),
        line(330, 230, 800, R`ក. ចូរគណនាតួទី $14$ នៃស៊ីតនេះ ។`, { size: 32 }),
        line(330, 300, 800, R`ខ. តើចំនួន $384$ ជាតួទីប៉ុន្មាននៃស៊ីតនេះ ?`, { size: 32 }),
        kids(1120, 540, 150)
      ].concat(chain(380, 500, ['6', '12', '24', '48', '…'], { r: 45, gap: 180, op: '×2', ops: 3, size: 28, sub: ['$a_1$', '$a_2$', '$a_3$', '$a_4$'] }))),

      /* 10 solution 1 */ page([
        K.solTitle(440, 100),
        step(80, 160, 560, R`!!ក.!!  គេមាន  $a_1 = 6$  និង  $q = \dfrac{12}{6} = 2$`, { size: 26, h: 60 }),
        s26(80, 222, 560, R`តាមរូបមន្ត  $a_n = a_1 \times q^{n-1}$`),
        s26(240, 270, 420, R`$a_n = 6 \times 2^{n-1}$`),
        s26(80, 318, 560, R`ចំពោះ  $n = 14$  នោះ`),
        s26(110, 366, 560, R`$a_{14} = 6 \times 2^{13} = 6 \times 8192 = 49152$`),
        S.box(100, 440, 500, 62, R`!!ដូចនេះ!!   $a_{14} = 49152$`, { size: 28, anim: true }),
        s26(680, 160, 560, R`!!ខ.!!  គេមាន  $a_n = 384$`),
        s26(840, 208, 400, R`$6 \times 2^{n-1} = 384$`),
        s26(840, 256, 400, R`$2^{n-1} = 64 = 2^6$`),
        s26(840, 304, 400, R`$n - 1 = 6 \Rightarrow n = 7$`),
        S.box(700, 380, 380, 62, R`!!ដូចនេះ!!   $384$ ជាតួទី $7$`, { size: 28, anim: true }),
        kids()
      ]),

      /* 11 practice 2: population growth */ page([
        T(80, 98, 1180, 80, R`!!__លំហាត់គំរូ ២ ៖__!!  នៅឆ្នាំ $2000$ ក្រុងមួយមានប្រជាជន $2$ លាននាក់ ហើយកើនឡើង $4\%$ ក្នុងមួយឆ្នាំ ។ តើនៅឆ្នាំ $2009$ ក្រុងនោះមានប្រជាជនប៉ុន្មាន ?`, { size: 25, valign: 'middle' }),
        T(80, 178, 400, 44, '!!__ដំណោះស្រាយ__!!', { size: 27 }),
        step(80, 222, 1150, R`តាង $a_n$ ជាចំនួនប្រជាជន (លាននាក់) នៅឆ្នាំទី $n$ ដោយឆ្នាំ $2000$ ជាឆ្នាំទី១ ៖   $a_1 = 2$`, { size: 25, h: 46 }),
        step(130, 268, 900, R`ឆ្នាំ $2001$ ៖   $a_2 = 2 + 2 \times 0.04 = 2 \times 1.04$`, { size: 25, h: 46 }),
        step(130, 314, 900, R`ឆ្នាំ $2002$ ៖   $a_3 = 2 \times 1.04 \times 1.04 = 2 \times 1.04^2$`, { size: 25, h: 46 }),
        step(80, 360, 1150, R`ចំនួនប្រជាជនបង្កើតបានជាស៊ីតធរណីមាត្រ ដែលមាន  $a_1 = 2$  និង  $q = 1.04$`, { size: 25, h: 46 }),
        step(80, 406, 1150, R`ឆ្នាំ $2009$ ជាឆ្នាំទី $10$ ៖   $a_{10} = 2 \times 1.04^9 \approx 2.85$`, { size: 25, h: 46 }),
        S.box(100, 458, 950, 56, R`!!ដូចនេះ!!  នៅឆ្នាំ $2009$ ក្រុងនោះមានប្រជាជនប្រហែល $2.85$ លាននាក់ ។`, { size: 25, anim: 'pop' }),
        kids(1095, 500, 170)
      ].concat(K.at('pop', bars(100, 524, 950, 104, people, { texts: ptxt, hl: 9, labels: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009'] })))),

      /* 12 geometric mean */ page([
        sec('៣. មធ្យមធរណីមាត្រ'),
        line(80, 155, 1180, R`!!__ឧទាហរណ៍ ៣ ៖__!!  ស៊ីតធរណីមាត្រ $a_1, a_2, a_3, a_4, a_5, a_6$ តាម $a_n = a_1 q^{n-1}$ គេបាន ៖`, { size: 25, h: 50 }),
        step(380, 205, 560, R`$a_1 \times a_6 = a_1 \times a_1 q^5 = a_1^2 q^5$`, { size: 25, h: 46 }),
        step(380, 251, 560, R`$a_2 \times a_5 = a_1 q \times a_1 q^4 = a_1^2 q^5$`, { size: 25, h: 46 }),
        step(380, 297, 560, R`$a_3 \times a_4 = a_1 q^2 \times a_1 q^3 = a_1^2 q^5$`, { size: 25, h: 46 }),
        step(80, 343, 1150, R`ដូចនេះ   $a_1 \times a_6 = a_2 \times a_5 = a_3 \times a_4$   (តួដែលនៅឆ្ងាយស្មើពីតួចុងទាំងពីរ)`, { size: 25, h: 46, anim: 'pair' }),
        T(770, 400, 480, 80, R`$a_1 \times a_6 = a_2 \times a_5 = a_3 \times a_4$
តួនៅឆ្ងាយស្មើពីចុងទាំងពីរ`, { size: 22, anim: 'pair' }),
        S.box(80, 515, 990, 136, R`!!លក្ខណៈ ៖!!   $a_p \times a_{n-p+1} = a_1 \times a_n$
បើ $a, b, c$ ជាស៊ីតធរណីមាត្រ នោះ $b^2 = a \times c$ ហើយ $b$ ហៅថា !!មធ្យមធរណីមាត្រ!! នៃ $a$ និង $c$ ។`, { size: 26, anim: true }),
        kids(1095, 500, 170)
      ].concat(K.at('pair', chain(230, 425, ['$a_1$', '$a_2$', '$a_3$', '$a_4$', '$a_5$', '$a_6$'], { r: 26, gap: 92, size: 20 }).concat(
               K.bracket(230, 690, 453, 46, '#1f4e9c'), K.bracket(322, 598, 453, 32, '#c00000'), K.bracket(414, 506, 453, 18, '#f68c1f'))))),

      /* 13 practice 3 */ page([
        line(80, 100, 400, '!!__លំហាត់គំរូ ៣ ៖__!!', { size: 28, h: 50 }),
        line(130, 150, 1000, R`ក. រកមធ្យមធរណីមាត្រវិជ្ជមាន នៃចំនួន  $4$  និង  $9$ ។`, { size: 28, h: 50 }),
        line(130, 200, 1000, R`ខ. ស៊ីតធរណីមាត្រមួយមាន  $a_3 = 4$  និង  $a_5 = 36$ ។ រក  $q$  និង  $a_1$ ។`, { size: 28, h: 50 }),
        K.solTitle(440, 252),
        s26(80, 312, 520, R`!!ក.!!  តាង $x$ ជាមធ្យមធរណីមាត្រ`),
        s26(220, 362, 400, R`$x^2 = 4 \times 9 = 36$`),
        s26(120, 412, 500, R`$x = 6$   (ព្រោះ $x > 0$)`),
        S.box(100, 482, 460, 62, R`!!ដូចនេះ!!   $x = 6$`, { size: 28, anim: true }),
        s26(660, 312, 560, R`!!ខ.!!  គេមាន  $a_5 = a_3 \times q^2$`),
        s26(740, 362, 500, R`$36 = 4q^2 \Rightarrow q^2 = 9 \Rightarrow q = \pm 3$`),
        s26(860, 412, 300, R`$a_1 = \dfrac{a_3}{q^2} = \dfrac{4}{9}$`, { h: 66 }),
        S.box(680, 496, 400, 120, R`!!ដូចនេះ!!   $q = \pm 3$
$a_1 = \dfrac{4}{9}$`, { size: 28, anim: true }),
        kids(1100, 526, 160)
      ]),

      /* 14 inserting geometric means */ page([
        sec('៣. មធ្យមធរណីមាត្រ'),
        S.box(80, 150, 1180, 100, R`!!__សំគាល់ ៖__!!  ការបញ្ចូលមធ្យមធរណីមាត្រ $k$ ចំនួន រវាង $a$ និង $b$ គឺបង្កើតស៊ីតធរណីមាត្រ $k + 2$ តួ ដែល $a_1 = a$ និង $a_{k+2} = b$ ។`, { size: 26 }),
        line(80, 266, 1000, R`!!__លំហាត់គំរូបន្ថែម ៖__!!  ចូរបញ្ចូលមធ្យមធរណីមាត្រ ៣ ចំនួន រវាង $2$ និង $162$ ។`, { size: 26, h: 50 }),
        line(80, 318, 400, '!!__ដំណោះស្រាយ__!!', { size: 26, h: 50 }),
        s26(80, 370, 780, R`គេបានស៊ីតមាន ៥ តួ ដែល   $a_1 = 2,\ a_5 = 162$`),
        s26(80, 418, 780, R`$a_5 = a_1 \times q^4 \Rightarrow 162 = 2 \times q^4 \Rightarrow q^4 = 81 \Rightarrow q = \pm 3$`),
        s26(80, 466, 780, R`• បើ $q = 3$ ៖   $2,\ 6,\ 18,\ 54,\ 162$`),
        s26(80, 514, 780, R`• បើ $q = -3$ ៖   $2,\ -6,\ 18,\ -54,\ 162$`),
        S.box(80, 578, 860, 62, R`!!ដូចនេះ!!  មធ្យមធរណីមាត្រគឺ   $6,\ 18,\ 54$   ឬ   $-6,\ 18,\ -54$`, { size: 26, anim: true }),
        T(930, 506, 300, 30, 'មធ្យមធរណីមាត្រ ៣ ចំនួន', { size: 18, bold: true, color: 'brand', align: 'center' })
      ].concat(chain(885, 430, ['2', '?', '?', '?', '162'], { r: 30, gap: 88, op: '×q', hl: [1, 2, 3], size: 22, sub: ['$a_1$', '', '', '', '$a_5$'] }),
               K.bracket(943, 1149, 470, 30, '#f68c1f'))),

      /* 15 three numbers */ page([
        T(80, 100, 1180, 80, R`!!__លំហាត់គំរូបន្ថែម ៖__!!  រកចំនួនបី ដែលជាស៊ីតធរណីមាត្រ ដោយដឹងថា ផលគុណរបស់វាស្មើ $216$ និងផលបូកស្មើ $26$ ។`, { size: 26, valign: 'middle' }),
        line(80, 190, 400, '!!__ដំណោះស្រាយ__!!', { size: 28, h: 50 }),
        step(80, 248, 1000, R`តាងចំនួនទាំងបីគឺ   $\dfrac{b}{q},\ b,\ bq$`, { size: 28, h: 72 }),
        step(80, 328, 1000, R`ផលគុណ ៖   $\dfrac{b}{q} \times b \times bq = b^3 = 216 \Rightarrow b = 6$`, { size: 28, h: 72 }),
        step(80, 408, 1000, R`ផលបូក ៖   $\dfrac{6}{q} + 6 + 6q = 26 \Rightarrow 3q^2 - 10q + 3 = 0$`, { size: 28, h: 72 }),
        step(130, 488, 900, R`គេបាន   $q = 3$   ឬ   $q = \dfrac{1}{3}$`, { size: 28, h: 72 }),
        S.box(80, 572, 900, 64, R`!!ដូចនេះ!!  ចំនួនទាំងបីគឺ   $2,\ 6,\ 18$   ឬ   $18,\ 6,\ 2$`, { size: 28, anim: true }),
        kids()
      ]),

      /* 16 practice exercises 1-2 */ page([
        sec('លំហាត់អនុវត្ត'),
        line(80, 160, 1000, R`!!__លំហាត់ ១ ៖__!!   គេមានស៊ីតធរណីមាត្រ  $3,\ 12,\ 48,\ \ldots$`, { size: 28 }),
        line(180, 216, 800, R`ក. គណនាតួទី $9$ ។`, { size: 28, h: 52 }),
        line(180, 268, 900, R`ខ. តើចំនួន $12288$ ជាតួទីប៉ុន្មាននៃស៊ីតនេះ ?`, { size: 28, h: 52 }),
        T(80, 345, 1180, 90, R`!!__លំហាត់ ២ ៖__!!   គេដាក់ប្រាក់ $100\,000$ រៀល ក្នុងធនាគារដែលផ្តល់ការប្រាក់ $6\%$ ក្នុងមួយឆ្នាំ (ការប្រាក់បូកចូលដើមរៀងរាល់ឆ្នាំ) ។`, { size: 28, valign: 'middle' }),
        line(180, 440, 900, R`ក. គណនាប្រាក់សរុបនៅចុងឆ្នាំទី  $1,\ 2,\ 3$  និង  $4$ ។`, { size: 28, h: 52 }),
        line(180, 492, 900, R`ខ. គណនាប្រាក់សរុបនៅចុងឆ្នាំទី $n$ និងចុងឆ្នាំទី $21$ ។`, { size: 28, h: 52 }),
        kids()
      ]),

      /* 17 answers 1-2 */ page([
        sec('ចម្លើយ លំហាត់អនុវត្ត'),
        l26(80, 160, 560, '!!__លំហាត់ ១ ៖__!!'),
        s26(80, 206, 560, R`គេមាន  $a_1 = 3,\ q = 4$`),
        s26(240, 252, 400, R`$a_n = 3 \times 4^{n-1}$`),
        s26(80, 298, 560, R`!!ក.!!   $a_9 = 3 \times 4^8 = 196608$`),
        s26(80, 344, 560, R`!!ខ.!!   $3 \times 4^{n-1} = 12288$`),
        s26(150, 390, 500, R`$4^{n-1} = 4096 = 4^6 \Rightarrow n = 7$`),
        S.box(80, 452, 520, 60, R`!!ដូចនេះ!!   $12288$ ជាតួទី $7$ ។`, { size: 26, anim: true }),
        l26(680, 160, 560, '!!__លំហាត់ ២ ៖__!!'),
        s26(680, 206, 560, R`ផលធៀបរួម   $q = 1 + 0.06 = 1.06$`),
        s26(680, 252, 560, R`!!ក.!!   $a_1 = 106\,000$`),
        s26(760, 298, 420, R`$a_2 = 112\,360$`),
        s26(760, 344, 420, R`$a_3 = 119\,101.6$`),
        s26(760, 390, 420, R`$a_4 = 126\,247.696$`),
        s26(680, 436, 560, R`!!ខ.!!   $a_n = 100\,000 \times 1.06^n$`),
        S.box(700, 500, 380, 60, R`$a_{21} \approx 339\,956.36$ រៀល`, { size: 26, anim: true, align: 'center' }),
        kids(1100, 526, 160)
      ]),

      /* 18 practice exercises 3-5 */ page([
        sec('លំហាត់អនុវត្ត'),
        line(80, 165, 1100, R`!!__លំហាត់ ៣ ៖__!!   ស៊ីតធរណីមាត្រមួយមាន  $a_4 = 24$  និង  $a_7 = 192$ ។`, { size: 28 }),
        line(150, 222, 900, R`ក. រកផលធៀបរួម $q$ និងតួទីមួយ $a_1$ ។`, { size: 28, h: 52 }),
        line(150, 274, 900, R`ខ. សរសេរតួទី $n$ ហើយគណនា $a_{10}$ ។`, { size: 28, h: 52 }),
        line(80, 355, 1100, R`!!__លំហាត់ ៤ ៖__!!   រកចំនួន $x$ ដើម្បីឱ្យ  $x - 1,\ x + 2,\ x + 8$  ជាស៊ីតធរណីមាត្រ ។`, { size: 28 }),
        line(80, 440, 1100, R`!!__លំហាត់ ៥ ៖__!!   រកមធ្យមធរណីមាត្រវិជ្ជមាន នៃចំនួន  $5$  និង  $45$ ។`, { size: 28 }),
        kids()
      ]),

      /* 19 answers 3-5 */ page([
        sec('ចម្លើយ លំហាត់អនុវត្ត'),
        l26(80, 160, 560, '!!__លំហាត់ ៣ ៖__!!'),
        s26(80, 206, 560, R`!!ក.!!   $a_7 = a_4 \times q^3 \Rightarrow 192 = 24q^3$`),
        s26(150, 252, 500, R`$q^3 = 8 \Rightarrow q = 2$`),
        s26(150, 298, 500, R`$a_1 = \dfrac{a_4}{q^3} = \dfrac{24}{8} = 3$`, { h: 66 }),
        s26(80, 366, 560, R`!!ខ.!!   $a_n = 3 \times 2^{n-1}$`),
        s26(150, 412, 500, R`$a_{10} = 3 \times 2^9 = 1536$`),
        l26(700, 160, 540, '!!__លំហាត់ ៤ ៖__!!'),
        s26(700, 206, 540, R`$(x + 2)^2 = (x - 1)(x + 8)$`),
        s26(700, 252, 540, R`$x^2 + 4x + 4 = x^2 + 7x - 8$`),
        s26(700, 298, 540, R`$3x = 12 \Rightarrow x = 4$`),
        s26(700, 344, 540, R`ស៊ីតគឺ   $3,\ 6,\ 12$`),
        l26(700, 410, 540, '!!__លំហាត់ ៥ ៖__!!'),
        s26(700, 456, 380, R`$b^2 = 5 \times 45 = 225$`),
        s26(700, 502, 380, R`$b = 15$   (ព្រោះ $b > 0$)`),
        kids(1100, 526, 160)
      ]),

      /* 20 quiz */
      S.quiz(R`!!១.!! កំណត់តួទី $n$ នៃស៊ីតធរណីមាត្រខាងក្រោម ៖
$5,\ 10,\ 20,\ 40,\ \ldots$`, [R`$a_n = 5 \times 2^n$`, R`$a_n = 5 \times 2^{n-1}$`, R`$a_n = 2 \times 5^{n-1}$`, R`$a_n = 5n$`], 1),

      /* 21-22 homework */
      S.homework(R`!!១.!! គេមានស៊ីតធរណីមាត្រ  $2,\ 6,\ 18,\ 54,\ \ldots$
\quad ក. គណនាតួទី $7$ ។
\quad ខ. តើចំនួន $39366$ ជាតួទីប៉ុន្មាននៃស៊ីតនេះ ?
!!២.!! រកចំនួន $x$ ដើម្បីឱ្យ  $3,\ x,\ 27$  ជាស៊ីតធរណីមាត្រ ។`),
      S.homework(R`!!៣.!! ស៊ីតធរណីមាត្រមួយមាន $a_2 = -6$ និង $a_5 = 48$ ។ រក $q$ , $a_1$ និង $a_{10}$ ។
!!៤.!! ចូរបញ្ចូលមធ្យមធរណីមាត្រ ២ ចំនួន រវាង $5$ និង $135$ ។
!!៥.!! រកចំនួនបីដែលជាស៊ីតធរណីមាត្រ ដោយដឹងថា ផលគុណស្មើ $1000$ និងផលបូកស្មើ $35$ ។`),

      /* ===== part 2: sums ===== */
      /* 23 */ K.toc([
        R`==៤. ផលបូក $n$ តួដំបូងនៃស៊ីតធរណីមាត្រ== ($S_n$)`,
        R`==៥. ស៊ីតធរណីមាត្រអនន្តតួ== ($S_\infty = \dfrac{a_1}{1 - q}$)`
      ], 50),

      /* 24 homework answers 1-2 */ page([
        sec('កំណែកិច្ចការផ្ទះ'),
        step(80, 160, 560, R`!!១.!!  គេមាន  $a_1 = 2,\ q = \dfrac{6}{2} = 3$`, { size: 26, h: 62 }),
        s26(240, 222, 400, R`$a_n = 2 \times 3^{n-1}$`),
        s26(80, 270, 560, R`!!ក.!!   $a_7 = 2 \times 3^6 = 2 \times 729 = 1458$`),
        s26(80, 318, 560, R`!!ខ.!!   $2 \times 3^{n-1} = 39366$`),
        s26(200, 366, 440, R`$3^{n-1} = 19683 = 3^9$`),
        s26(200, 414, 440, R`$n - 1 = 9 \Rightarrow n = 10$`),
        S.box(80, 480, 560, 60, R`!!ដូចនេះ!!   $a_7 = 1458$ ,  $39366$ ជាតួទី $10$`, { size: 25, anim: true }),
        s26(680, 160, 560, R`!!២.!!  $3,\ x,\ 27$  ជាស៊ីតធរណីមាត្រ`),
        s26(680, 208, 560, 'តាមលក្ខណៈមធ្យមធរណីមាត្រ ៖'),
        s26(820, 256, 400, R`$x^2 = 3 \times 27 = 81$`),
        s26(880, 304, 300, R`$x = \pm 9$`),
        S.box(700, 380, 400, 60, R`!!ដូចនេះ!!   $x = 9$  ឬ  $x = -9$`, { size: 25, anim: true }),
        kids()
      ]),

      /* 25 homework answers 3-5 */ page([
        sec('កំណែកិច្ចការផ្ទះ'),
        s26(80, 160, 600, R`!!៣.!!   $a_5 = a_2 \times q^3 \Rightarrow 48 = -6q^3$`),
        s26(130, 208, 540, R`$q^3 = -8 \Rightarrow q = -2$`),
        s26(130, 256, 540, R`$a_1 = a_2 \div q = -6 \div (-2) = 3$`),
        s26(130, 304, 540, R`$a_{10} = 3 \times (-2)^9 = -1536$`),
        s26(80, 364, 600, R`!!៤.!!   $a_4 = a_1 \times q^3 \Rightarrow 135 = 5q^3$`),
        s26(130, 412, 540, R`$q^3 = 27 \Rightarrow q = 3$`),
        s26(130, 460, 540, R`ស៊ីត ៖   $5,\ 15,\ 45,\ 135$`),
        step(720, 160, 520, R`!!៥.!!  តាងចំនួនទាំងបី   $\dfrac{b}{q},\ b,\ bq$`, { size: 26, h: 64 }),
        s26(770, 226, 340, R`$b^3 = 1000 \Rightarrow b = 10$`),
        s26(770, 274, 340, R`$\dfrac{10}{q} + 10 + 10q = 35$`, { h: 64 }),
        s26(770, 340, 340, R`$\Rightarrow 2q^2 - 5q + 2 = 0$`),
        s26(770, 388, 340, R`$q = 2$  ឬ  $q = \dfrac{1}{2}$`, { h: 64 }),
        s26(770, 454, 340, 'ចំនួនទាំងបី ៖'),
        s26(770, 502, 320, R`$5,\ 10,\ 20$  ឬ  $20,\ 10,\ 5$`),
        kids(1100, 526, 160)
      ]),

      /* 26 sum of n terms */ page([
        sec(R`៤. ផលបូក $n$ តួដំបូងនៃស៊ីតធរណីមាត្រ`),
        line(80, 160, 1000, R`!!__ឧទាហរណ៍ ៤ ៖__!!   គណនា   $S = 1 + 2 + 4 + 8 + 16 + 32 + 64$`, { size: 27 }),
        step(380, 215, 650, R`$S = 1 + 2 + 4 + 8 + 16 + 32 + 64 \qquad (1)$`, { size: 26, h: 50 }),
        step(80, 265, 600, R`គុណ $(1)$ នឹង $2$ ៖`, { size: 26, h: 50 }),
        step(330, 315, 700, R`$2S = 2 + 4 + 8 + 16 + 32 + 64 + 128 \qquad (2)$`, { size: 26, h: 50 }),
        step(80, 365, 950, R`យក $(2) - (1)$ ៖   $2S - S = 128 - 1 \Rightarrow S = 127$`, { size: 26, h: 50 }),
        S.box(80, 440, 990, 200, R`!!រូបមន្ត ៖!!  ផលបូក $n$ តួដំបូងនៃស៊ីតធរណីមាត្រ ដែលមានតួទី១ $a_1$ និង $q \neq 1$ គឺ ៖
$$S_n = a_1 + a_2 + \cdots + a_n = \dfrac{a_1(q^n - 1)}{q - 1}$$`, { size: 27, anim: true })
      ].concat(bars(1080, 150, 190, 270, [1, 2, 4, 8, 16, 32, 64], { labels: ['a₁', 'a₂', 'a₃', 'a₄', 'a₅', 'a₆', 'a₇'], hl: 6, vs: 14, ls: 14 }))),

      /* 27 practice 4 */ page([
        line(200, 130, 600, '!!__លំហាត់គំរូ ៤ ៖__!!', { size: 32 }),
        line(300, 205, 850, R`ក. គណនាផលបូក $7$ តួដំបូងនៃស៊ីតធរណីមាត្រ ៖`, { size: 30 }),
        line(620, 262, 500, R`$5 + 10 + 20 + 40 + \cdots$`, { size: 32 }),
        line(300, 330, 900, R`ខ. គណនាផលបូក ៖   $2 + 6 + 18 + \cdots + 1458$`, { size: 30 }),
        T(330, 588, 735, 36, R`$S_7 = ?$`, { size: 26, bold: true, color: 'accent', align: 'center' }),
        kids(1100, 526, 160)
      ].concat(chain(370, 505, ['5', '10', '20', '40', '…', '$a_7$'], { r: 42, gap: 130, op: '×2', ops: 3, hl: [5], size: 26 }),
               K.bracket(330, 1062, 556, 26, '#f68c1f'))),

      /* 28 solution 4 */ page([
        K.solTitle(440, 100),
        s26(80, 160, 540, R`!!ក.!!  គេមាន  $a_1 = 5,\ q = 2,\ n = 7$`),
        s26(80, 212, 540, R`តាមរូបមន្ត   $S_n = \dfrac{a_1(q^n - 1)}{q - 1}$`, { h: 64 }),
        s26(240, 282, 400, R`$S_7 = \dfrac{5(2^7 - 1)}{2 - 1}$`, { h: 64 }),
        s26(240, 352, 400, R`$S_7 = 5 \times 127 = 635$`),
        S.box(100, 420, 460, 60, R`!!ដូចនេះ!!   $S_7 = 635$`, { size: 27, anim: true }),
        s26(680, 160, 580, R`!!ខ.!!  គេមាន  $a_1 = 2,\ q = 3,\ a_n = 1458$`),
        s26(700, 212, 560, R`$2 \times 3^{n-1} = 1458 \Rightarrow 3^{n-1} = 729 = 3^6$`),
        s26(820, 260, 400, R`$n - 1 = 6 \Rightarrow n = 7$`),
        s26(820, 308, 400, R`$S_7 = \dfrac{2(3^7 - 1)}{3 - 1}$`, { h: 64 }),
        s26(820, 378, 400, R`$S_7 = 2187 - 1 = 2186$`),
        S.box(700, 440, 380, 60, R`!!ដូចនេះ!!   $S_7 = 2186$`, { size: 27, anim: true }),
        kids()
      ]),

      /* 29 practice 5: rice on a chessboard */ page([
        T(80, 96, 1180, 96, R`!!__លំហាត់គំរូ ៥ ៖__!!  គេដាក់គ្រាប់ស្រូវលើក្តារអុកដែលមាន $64$ ប្រអប់ ៖ ប្រអប់ទី១ ដាក់ $1$ គ្រាប់ ប្រអប់ទី២ ដាក់ $2$ គ្រាប់ ប្រអប់ទី៣ ដាក់ $4$ គ្រាប់ … ប្រអប់បន្ទាប់ដាក់ទ្វេដងនៃប្រអប់មុន ។ តើគ្រាប់ស្រូវសរុបលើក្តារអុកមានប៉ុន្មាន ?`, { size: 23, valign: 'middle' }),
        T(80, 194, 400, 44, '!!__ដំណោះស្រាយ__!!', { size: 26 }),
        step(80, 238, 1150, R`ចំនួនគ្រាប់ស្រូវ  $1,\ 2,\ 4,\ 8,\ \ldots$  ជាស៊ីតធរណីមាត្រ ដែល  $a_1 = 1,\ q = 2,\ n = 64$`, { size: 25, h: 48 }),
        step(80, 288, 1100, R`តាមរូបមន្ត ៖   $S_{64} = \dfrac{1 \times (2^{64} - 1)}{2 - 1} = 2^{64} - 1$`, { size: 25, h: 64 }),
        step(370, 354, 800, R`$S_{64} = 18\,446\,744\,073\,709\,551\,615$`, { size: 26, h: 50 }),
        S.box(80, 414, 1010, 60, R`!!ដូចនេះ!!  គ្រាប់ស្រូវសរុបមាន   $18\,446\,744\,073\,709\,551\,615$   គ្រាប់`, { size: 25, anim: true }),
        kids(1100, 526, 160)
      ].concat(board, chain(300, 572, ['1', '2', '4', '8', '16', '…', '2⁶³'], { box: { w: 76, h: 50 }, gap: 110, op: '×2', hl: [6], size: 24, sub: ['ទី១', 'ទី២', 'ទី៣', 'ទី៤', 'ទី៥', '', 'ទី៦៤'] }))),

      /* 30 remark + example */ page([
        sec(R`៤. ផលបូក $n$ តួដំបូង`),
        S.box(80, 155, 1180, 150, R`!!__សំគាល់ ៖__!!
• បើ $q = 1$ នោះស៊ីតមានតួស្មើៗគ្នា ហើយ   $S_n = n \times a_1$
• ដោយ $a_n = a_1 q^{n-1}$ គេអាចសរសេរ   $S_n = \dfrac{a_n q - a_1}{q - 1},\ \ q \neq 1$`, { size: 26 }),
        line(80, 322, 1100, R`!!__លំហាត់គំរូបន្ថែម ៖__!!   គណនាផលបូក   $S = 3 + 6 + 12 + \cdots + 768$`, { size: 28 }),
        line(80, 380, 400, '!!__ដំណោះស្រាយ__!!', { size: 28 }),
        step(80, 432, 800, R`គេមាន   $a_1 = 3,\ q = 2,\ a_n = 768$`, { size: 27, h: 54 }),
        step(80, 488, 900, R`$S = \dfrac{a_n q - a_1}{q - 1} = \dfrac{768 \times 2 - 3}{2 - 1} = 1533$`, { size: 27, h: 70 }),
        S.box(80, 572, 440, 62, R`!!ដូចនេះ!!   $S = 1533$`, { size: 28, anim: true }),
        kids()
      ]),

      /* 31 more examples */ page([
        line(80, 100, 600, '!!__លំហាត់គំរូបន្ថែម ៖__!!', { size: 28, h: 50 }),
        line(130, 152, 1100, R`ក. ស៊ីតធរណីមាត្រមួយមាន  $a_1 = 4,\ q = 3$  និង  $S_n = 484$ ។ រក $n$ ។`, { size: 28, h: 50 }),
        line(130, 202, 1100, R`ខ. ស៊ីតធរណីមាត្រមួយមាន  $q = 3$  និង  $S_3 = 26$ ។ រកតួទីមួយ $a_1$ ។`, { size: 28, h: 50 }),
        line(80, 262, 400, '!!__ដំណោះស្រាយ__!!', { size: 28, h: 50 }),
        s26(80, 318, 560, R`!!ក.!!   $S_n = \dfrac{a_1(q^n - 1)}{q - 1}$`, { h: 66 }),
        s26(130, 390, 500, R`$484 = \dfrac{4(3^n - 1)}{3 - 1}$`, { h: 66 }),
        s26(130, 462, 540, R`$3^n - 1 = 242 \Rightarrow 3^n = 243 = 3^5$`),
        S.box(80, 532, 440, 62, R`!!ដូចនេះ!!   $n = 5$`, { size: 28, anim: true }),
        s26(700, 318, 560, R`!!ខ.!!   $S_3 = \dfrac{a_1(3^3 - 1)}{3 - 1} = 13a_1$`, { h: 66 }),
        s26(760, 390, 480, R`$13a_1 = 26 \Rightarrow a_1 = 2$`),
        S.box(720, 532, 360, 62, R`!!ដូចនេះ!!   $a_1 = 2$`, { size: 28, anim: true }),
        kids(1100, 526, 160)
      ]),

      /* 32 infinite geometric series */ page([
        sec('៥. ស៊ីតធរណីមាត្រអនន្តតួ'),
        line(80, 155, 1180, R`!!__ឧទាហរណ៍ ៥ ៖__!!  ពិនិត្យផលបូក   $18 + 1.8 + 0.18 + 0.018 + \cdots$   ដែល   $a_1 = 18,\ q = \dfrac{1}{10}$`, { size: 25, h: 62 }),
        step(260, 222, 260, R`$S_1 = 18$`, { size: 26, h: 44 }),
        step(260, 266, 260, R`$S_2 = 19.8$`, { size: 26, h: 44 }),
        step(260, 310, 260, R`$S_3 = 19.98$`, { size: 26, h: 44 }),
        step(260, 354, 260, R`$S_4 = 19.998$`, { size: 26, h: 44 }),
        step(560, 222, 680, R`កាលណា $n$ កាន់តែធំ $S_n$ កាន់តែខិតជិត $20$`, { size: 26, h: 46, anim: 'lim' }),
        step(640, 270, 560, R`$S_n \to 20$   កាលណា   $n \to +\infty$`, { size: 26, h: 46, anim: 'lim' }),
        shape('arrow', 620, 372, 620, 14, { stroke: 'title', sw: 2 , anim: 'lim' }),
        shape('rect', 900, 368, 2, 22, { fill: 'title' , anim: 'lim' }),
        shape('ellipse', 691, 370, 18, 18, { fill: 'brand' , anim: 'lim' }),
        shape('ellipse', 1051, 370, 18, 18, { fill: 'brand' , anim: 'lim' }),
        shape('ellipse', 1087, 370, 18, 18, { fill: 'brand' , anim: 'lim' }),
        T(670, 326, 60, 36, 'S₁', { size: 22, bold: true, color: 'brand', align: 'center' , anim: 'lim' }),
        T(1022, 326, 50, 36, 'S₂', { size: 22, bold: true, color: 'brand', align: 'center' , anim: 'lim' }),
        T(1076, 326, 50, 36, 'S₃', { size: 22, bold: true, color: 'brand', align: 'center' , anim: 'lim' }),
        T(670, 394, 60, 32, '18', { size: 22, color: 'title', align: 'center' , anim: 'lim' }),
        T(870, 394, 60, 32, '19', { size: 22, color: 'title', align: 'center' , anim: 'lim' }),
        T(1070, 394, 60, 32, '20', { size: 22, bold: true, color: 'accent', align: 'center' , anim: 'lim' }),
        step(80, 432, 1150, R`ដោយ   $S_n = \dfrac{a_1(1 - q^n)}{1 - q}$   ហើយបើ $|q| < 1$ នោះ $q^n \to 0$ កាលណា $n \to +\infty$`, { size: 25, h: 62 }),
        S.box(80, 504, 990, 148, R`!!រូបមន្ត ៖!!  ផលបូកនៃស៊ីតធរណីមាត្រអនន្តតួ ដែល $|q| < 1$ គឺ ៖
$$S = a_1 + a_1 q + a_1 q^2 + \cdots = \dfrac{a_1}{1 - q}$$`, { size: 26, anim: true }),
        kids(1095, 500, 170)
      ]),

      /* 33 practice 6 */ page([
        line(80, 100, 1000, R`!!__លំហាត់គំរូ ៦ ៖__!!    ក. គណនា   $6 + 2 + \dfrac{2}{3} + \dfrac{2}{9} + \cdots$`, { size: 28, h: 66 }),
        line(330, 166, 800, R`ខ. សរសេរ   $4.575757\ldots$   ជាប្រភាគ   $\dfrac{a}{b}$`, { size: 28, h: 66 }),
        K.solTitle(440, 228),
        s26(80, 288, 520, R`!!ក.!!   $a_1 = 6,\ q = \dfrac{2}{6} = \dfrac{1}{3}$`, { h: 64 }),
        s26(130, 354, 480, R`ដោយ   $|q| < 1$   នោះ`),
        s26(130, 404, 500, R`$S = \dfrac{a_1}{1 - q} = \dfrac{6}{1 - \frac{1}{3}} = \dfrac{6}{\frac{2}{3}} = 9$`, { h: 72 }),
        S.box(80, 500, 440, 60, R`!!ដូចនេះ!!   $S = 9$`, { size: 28, anim: true }),
        s26(640, 288, 600, R`!!ខ.!!   $4.5757\ldots = 4 + 0.57 + 0.0057 + \cdots$`),
        s26(680, 338, 560, R`$a_1 = 0.57,\ q = 0.01$   $(|q| < 1)$`),
        s26(680, 388, 560, R`$0.57 + 0.0057 + \cdots = \dfrac{0.57}{0.99} = \dfrac{57}{99}$`, { h: 64 }),
        s26(680, 454, 560, R`$4.5757\ldots = 4 + \dfrac{57}{99} = \dfrac{453}{99} = \dfrac{151}{33}$`, { h: 64 }),
        S.box(660, 540, 400, 72, R`!!ដូចនេះ!!   $4.5757\ldots = \dfrac{151}{33}$`, { size: 26, anim: true }),
        kids(1100, 540, 150)
      ]),

      /* 34 remark + examples */ page([
        sec('៥. ស៊ីតធរណីមាត្រអនន្តតួ'),
        S.box(80, 155, 1180, 84, R`!!__សំគាល់ ៖__!!  រូបមន្ត $S = \dfrac{a_1}{1 - q}$ ប្រើបានតែពេល $|q| < 1$ ។ បើ $|q| \ge 1$ នោះផលបូកមិនមានលីមីតកំណត់ទេ ។`, { size: 24 }),
        line(80, 250, 1100, R`!!__លំហាត់គំរូបន្ថែម ៖__!!    ក. គណនា   $S = 1 - \dfrac{1}{2} + \dfrac{1}{4} - \dfrac{1}{8} + \cdots$`, { size: 26, h: 64 }),
        line(130, 316, 1000, R`ខ. ស៊ីតធរណីមាត្រអនន្តតួមួយមាន  $a_1 = 8$  និង  $S = 12$ ។ រក $q$ ។`, { size: 26, h: 50 }),
        s26(80, 370, 560, R`!!ក.!!   $a_1 = 1,\ q = -\dfrac{1}{2},\ \ |q| < 1$`, { h: 56 }),
        s26(130, 432, 480, R`$S = \dfrac{1}{1 + \frac{1}{2}} = \dfrac{1}{\frac{3}{2}} = \dfrac{2}{3}$`, { h: 66 }),
        S.box(80, 535, 400, 65, R`!!ដូចនេះ!!   $S = \dfrac{2}{3}$`, { size: 28, anim: true }),
        s26(700, 370, 380, R`!!ខ.!!   $12 = \dfrac{8}{1 - q}$`, { h: 56 }),
        s26(760, 432, 320, R`$1 - q = \dfrac{8}{12} = \dfrac{2}{3}$`, { h: 56 }),
        s26(760, 488, 320, R`$q = 1 - \dfrac{2}{3} = \dfrac{1}{3}$`, { h: 56 }),
        S.box(700, 545, 360, 65, R`!!ដូចនេះ!!   $q = \dfrac{1}{3}$`, { size: 28, anim: true }),
        kids(1100, 526, 160)
      ]),

      /* 35 practice exercises */ page([
        sec('លំហាត់អនុវត្ត'),
        line(80, 165, 1100, R`!!__លំហាត់ ១ ៖__!!   គណនាផលបូក $8$ តួដំបូង នៃស៊ីតធរណីមាត្រ   $2,\ 4,\ 8,\ \cdots$`, { size: 28 }),
        line(80, 250, 1100, R`!!__លំហាត់ ២ ៖__!!   គណនាផលបូក   $S = 1 + \dfrac{1}{3} + \dfrac{1}{9} + \cdots$`, { size: 28, h: 70 }),
        line(80, 340, 1100, R`!!__លំហាត់ ៣ ៖__!!   សរសេរ   $0.777\cdots$   ជាប្រភាគ   $\dfrac{a}{b}$ ។`, { size: 28, h: 70 }),
        line(80, 430, 1100, R`!!__លំហាត់ ៤ ៖__!!   ស៊ីតធរណីមាត្រអនន្តតួមួយមាន  $a_1 = 5$  និង  $S = 15$ ។ រកផលធៀបរួម $q$ ។`, { size: 28 }),
        kids()
      ]),

      /* 36 answers */ page([
        sec('ចម្លើយ លំហាត់អនុវត្ត'),
        s26(80, 160, 560, R`!!__លំហាត់ ១ ៖__!!   $a_1 = 2,\ q = 2,\ n = 8$`),
        s26(130, 210, 500, R`$S_8 = \dfrac{2(2^8 - 1)}{2 - 1} = 510$`, { h: 66 }),
        s26(80, 290, 560, R`!!__លំហាត់ ២ ៖__!!   $a_1 = 1,\ q = \dfrac{1}{3}$`, { h: 64 }),
        s26(130, 358, 500, R`$S = \dfrac{1}{1 - \frac{1}{3}} = \dfrac{3}{2}$`, { h: 72 }),
        s26(700, 160, 540, '!!__លំហាត់ ៣ ៖__!!', { anim: 'ex3' }),
        s26(700, 208, 560, R`$0.777\cdots = 0.7 + 0.07 + 0.007 + \cdots$`, { anim: 'ex3' }),
        s26(700, 256, 560, R`$a_1 = 0.7,\ q = 0.1$`),
        s26(700, 304, 560, R`$S = \dfrac{0.7}{1 - 0.1} = \dfrac{0.7}{0.9} = \dfrac{7}{9}$`, { h: 70 }),
        s26(80, 470, 940, R`!!__លំហាត់ ៤ ៖__!!   $15 = \dfrac{5}{1 - q} \Rightarrow 1 - q = \dfrac{1}{3} \Rightarrow q = \dfrac{2}{3}$`, { h: 70 }),
        kids()
      ]),

      /* 37 quiz */
      S.quiz(R`!!១.!! គណនាផលបូកនៃស៊ីតធរណីមាត្រអនន្តតួ ៖
$16 + 8 + 4 + 2 + \ldots$`, [R`$S = 30$`, R`$S = 32$`, R`$S = 34$`, R`$S = 64$`], 1),

      /* 38-39 homework */
      S.homework(R`!!១.!! គណនាផលបូក $10$ តួដំបូងនៃស៊ីតធរណីមាត្រ  $3,\ 6,\ 12,\ \ldots$
!!២.!! គណនាផលបូក ៖   $16 + 12 + 9 + \cdots$
!!៣.!! សរសេរ  $0.235235\ldots$  ជាប្រភាគ  $\dfrac{a}{b}$ ។`),
      S.homework(R`!!៤.!! គណនាផលបូក $6$ តួដំបូង នៃស៊ីតធរណីមាត្រ  $1,\ -3,\ 9,\ \cdots$
!!៥.!! គណនាផលបូក   $S = 2 + \dfrac{2}{3} + \dfrac{2}{9} + \cdots$
!!៦.!! សរសេរ  $0.4545\cdots$  ជាប្រភាគ  $\dfrac{a}{b}$ ។
!!៧.!! ស៊ីតធរណីមាត្រមួយមាន  $a_1 = 3,\ q = 2$  និង  $S_n = 381$ ។ រក $n$ ។`),

      /* 40 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី៣ ស៊ីតធរណីមាត្រ', theme: 'school', school: K.info.school, school2: K.info.school2, school3: K.info.school3,
             teacher: K.info.teacher, slides: slides };
  }

  // ថ្នាក់ទី១១ ជំពូកទី១ មេរៀនទី៤ ផលបូកតួនៃស៊ីតផ្សេងៗ — content from the lesson page (book pages 24–35)
  function sums(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, rows = K.rows;
    var sec = function (text, y) { return title(text, { x: 60, y: y, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var head = function (x, y, text) { return line(x, y, 500, '!!__' + text + '__!!', { size: 26, h: 44 }); };
    // difference table: one row per sequence; a lower row sits between the cells above it
    var diffTable = function (x, y, rowsIn, o) {
      o = o || {};
      var gap = o.gap || 92, cw = 74, ch = 42, lw = o.lw || 250, els = [];
      rowsIn.forEach(function (r, ri) {
        var ry = y + ri * 58, shift = (r.depth || 0) * gap / 2, a = r.anim;
        els.push(T(x, ry, lw, ch, r.label, { size: 20, bold: true, color: ri ? 'brand' : 'title', valign: 'middle', anim: a }));
        r.vals.forEach(function (v, i) {
          els.push(T(x + lw + shift + i * gap, ry, cw, ch, '$' + v + '$', { size: 22, align: 'center', valign: 'middle', radius: 8,
            fill: ri === 0 ? '#e7f0fb' : ri === 1 ? '#fff4e6' : '#ebfbee', border: ri === 0 ? '#1f4e9c' : ri === 1 ? '#f68c1f' : '#2f9e44', bw: 2, anim: a }));
        });
      });
      return els;
    };
    // 4 × 4 square split into L-shaped layers 1, 3, 5, 7 (1 + 3 + 5 + 7 = 4²)
    var oddSquare = function (x, y, key) {
      var cols = ['#1f4e9c', '#f68c1f', '#2f9e44', '#c00000'], els = [];
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++)
        els.push(shape('rect', x + c * 46, y + r * 46, 44, 44, { fill: cols[Math.max(r, c)], anim: 'L' + Math.max(r, c) }));
      els.push(T(x - 20, y + 192, 224, 34, '$1 + 3 + 5 + 7 = 4^2$', { size: 20, align: 'center', anim: key }));
      return els;
    };

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី១==        មេរៀនទី៤', 'ផលបូកតួនៃស៊ីតផ្សេងៗ', K.info),
      /* 2 */ K.toc([
        '==១. របៀបគណនាផលបូក== (វិធី Telescoping)',
        '==២. ផលបូកតាមលំនាំគំរូ==',
        R`==៣. និមិត្តសញ្ញា $\Sigma$ និងលក្ខណៈនៃស៊ិចម៉ា==`,
        R`==៤. កំណត់តួទី $n$ តាមផលសងតួលំដាប់ទី ១ និងទី ២==`
      ], 42),
      /* 3 */ S.objective([
        R`គណនាផលបូកតួនៃស៊ីតដោយប្រើវិធី Telescoping និងលំនាំគំរូ`,
        R`ប្រើនិមិត្តសញ្ញា $\Sigma$ និងលក្ខណៈរបស់វាដើម្បីគណនាផលបូក`,
        R`កំណត់តួទី $n$ តាមផលសងតួលំដាប់ទី ១ និងទី ២ នៃស៊ីត`
      ]),

      /* 4 review + motivation */ page([
        sec('រំលឹកមេរៀនចាស់'),
        l(60, 165, 1000, R`!!__លំហាត់ ៖__!!  គណនា  $S = 1 + 2 + 3 + \ldots + 100$`, { size: 28 }),
        s(100, 220, 900, R`ជាស៊ីតនព្វន្ត  $a_1 = 1,\ d = 1,\ n = 100$`),
        s(100, 268, 900, R`$S = \dfrac{n(a_1 + a_n)}{2} = \dfrac{100(1 + 100)}{2} = 5050$`, { h: 62 }),
        s(60, 360, 1000, R`!!__សំណួរ ៖__!!  ចុះផលបូក  $1^2 + 2^2 + 3^2 + \ldots + n^2$  វិញ?`, { size: 28 }),
        s(100, 418, 960, R`$1,\ 4,\ 9,\ 16,\ \ldots$  មិនមែនជា !!ស៊ីតនព្វន្ត!! (ផលសង $3, 5, 7$ មិនថេរ)`),
        s(100, 466, 960, R`ក៏មិនមែនជា !!ស៊ីតធរណីមាត្រ!! (ផលធៀប $4, \frac{9}{4}, \ldots$ មិនថេរ)`),
        S.box(100, 530, 900, 96, 'ត្រូវរកវិធីផ្សេងទៀត ដើម្បីគណនាផលបូក → !!មេរៀនទី៤ ៖ ផលបូកតួនៃស៊ីតផ្សេងៗ!!', { size: 26, anim: true }),
        kids()
      ]),

      /* 5 section 1 + example 1 setup */ page([
        sec('១. របៀបគណនាផលបូក'),
        tip(60, 160, 1180, 90, 'ចំពោះស៊ីតផ្សេងៗ គេពុំអាចប្រើរូបមន្តផលបូកនៃស៊ីតនព្វន្ត ឬស៊ីតធរណីមាត្របានឡើយ ។ ត្រូវប្រើវិធីផ្សេងៗទៅតាមទម្រង់នៃស៊ីត ។', { size: 24 }),
        l(60, 265, 1100, R`!!__ឧទាហរណ៍ ១ ៖__!!  គណនា  $S = 1^2 + 2^2 + 3^2 + \ldots + n^2$`, { size: 27 }),
        s(60, 318, 1100, R`ប្រើសមភាព   $(k + 1)^3 - k^3 = 3k^2 + 3k + 1$   ដោយឱ្យ $k$ យកតម្លៃពី $1$ ដល់ $n$ ៖`),
        s(200, 372, 800, R`$k = 1$ ៖    $2^3 - 1^3 = 3 \times 1^2 + 3 \times 1 + 1$`),
        s(200, 418, 800, R`$k = 2$ ៖    $3^3 - 2^3 = 3 \times 2^2 + 3 \times 2 + 1$`),
        s(200, 464, 800, R`$k = 3$ ៖    $4^3 - 3^3 = 3 \times 3^2 + 3 \times 3 + 1$`),
        s(200, 506, 800, '..............................................................', { h: 34 }),
        s(200, 542, 800, R`$k = n$ ៖    $(n + 1)^3 - n^3 = 3 \times n^2 + 3 \times n + 1$`),
        T(1000, 400, 260, 120, R`!!គន្លឹះ ៖!! តួ $2^3, 3^3, \ldots, n^3$ លុបគ្នាពេលបូក`, { size: 20, fill: '#fff4e6', border: '#f68c1f', bw: 2, radius: 14, valign: 'middle', anim: true })
      ]),

      /* 6 example 1 result */ page([
        sec('ឧទាហរណ៍ ១ (ត)'),
        l(60, 160, 1100, 'បូកអង្គ និងអង្គនៃសមភាពទាំងអស់ (តួ $2^3, 3^3, \\ldots, n^3$ លុបគ្នា) គេបាន ៖', { size: 25 }),
        s(80, 214, 1100, R`$(n + 1)^3 - 1^3 = 3(1^2 + 2^2 + \ldots + n^2) + 3(1 + 2 + \ldots + n) + (1 + 1 + \ldots + 1)$`, { size: 24 }),
        s(250, 266, 900, R`$= 3S + 3 \times \dfrac{n(n + 1)}{2} + n$`, { h: 62 }),
        s(80, 336, 1100, R`$\Rightarrow 3S = (n + 1)^3 - 1 - \dfrac{3n(n + 1)}{2} - n = \dfrac{n(n + 1)(2n + 1)}{2}$`, { h: 66 }),
        S.box(150, 440, 900, 100, R`!!ដូចនេះ!!     $1^2 + 2^2 + 3^2 + \ldots + n^2 = \dfrac{n(n + 1)(2n + 1)}{6}$`, { size: 30, align: 'center', anim: true }),
        tip(150, 560, 900, 70, R`!!ផ្ទៀងផ្ទាត់ ៖!!  $n = 3$ ៖  $1 + 4 + 9 = 14$  និង  $\dfrac{3 \times 4 \times 7}{6} = 14$ ✓`, { size: 22, anim: true }),
        kids()
      ]),

      /* 7 example 2: telescoping fractions */ page([
        l(60, 100, 1180, R`!!__ឧទាហរណ៍ ២ ៖__!!  គណនា  $S = \dfrac{1}{1 \cdot 2} + \dfrac{1}{2 \cdot 3} + \dfrac{1}{3 \cdot 4} + \ldots + \dfrac{1}{n(n + 1)}$`, { size: 26, h: 66 }),
        s(60, 170, 1100, R`ប្រើសមភាព   $\dfrac{1}{k(k + 1)} = \dfrac{1}{k} - \dfrac{1}{k + 1}$   ដោយឱ្យ $k$ យកតម្លៃពី $1$ ដល់ $n$ ៖`, { h: 64 }),
        s(160, 240, 460, R`$\dfrac{1}{1 \cdot 2} = \dfrac{1}{1} - \dfrac{1}{2}$`, { h: 62 }),
        s(160, 302, 460, R`$\dfrac{1}{2 \cdot 3} = \dfrac{1}{2} - \dfrac{1}{3}$`, { h: 62 }),
        s(160, 364, 460, R`$\dfrac{1}{3 \cdot 4} = \dfrac{1}{3} - \dfrac{1}{4}$`, { h: 62 }),
        s(160, 424, 460, '..........................................', { h: 34 }),
        s(160, 458, 460, R`$\dfrac{1}{n(n + 1)} = \dfrac{1}{n} - \dfrac{1}{n + 1}$`, { h: 62 }),
        s(660, 300, 600, 'បូកអង្គ និងអង្គ (តួកណ្តាលលុបគ្នាអស់) គេបាន ៖', { size: 24 }),
        s(720, 352, 500, R`$S = 1 - \dfrac{1}{n + 1} = \dfrac{n}{n + 1}$`, { size: 28, h: 66 }),
        S.box(100, 545, 1000, 96, R`!!ដូចនេះ!!   $\dfrac{1}{1 \cdot 2} + \dfrac{1}{2 \cdot 3} + \ldots + \dfrac{1}{n(n + 1)} = \dfrac{n}{n + 1}$`, { size: 28, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 8 worked example: sum of cubes */ page([
        l(60, 100, 1180, R`!!__លំហាត់គំរូ ៖__!!  គណនាផលបូក  $S = 1^3 + 2^3 + 3^3 + \ldots + n^3$`, { size: 28, h: 54 }),
        K.solTitle(440, 158),
        s(60, 220, 1180, R`ប្រើសមភាព   $(k + 1)^4 - k^4 = 4k^3 + 6k^2 + 4k + 1$   ដោយឱ្យ $k$ យកតម្លៃពី $1$ ដល់ $n$ ៖`),
        s(160, 272, 1000, R`$2^4 - 1^4 = 4 \times 1^3 + 6 \times 1^2 + 4 \times 1 + 1$`),
        s(160, 318, 1000, R`$3^4 - 2^4 = 4 \times 2^3 + 6 \times 2^2 + 4 \times 2 + 1$`),
        s(160, 360, 1000, '..............................................................', { h: 34 }),
        s(160, 396, 1000, R`$(n + 1)^4 - n^4 = 4 \times n^3 + 6 \times n^2 + 4 \times n + 1$`),
        s(60, 456, 1180, R`បូកអង្គ និងអង្គ ៖   $(n + 1)^4 - 1 = 4S + 6 \times \dfrac{n(n + 1)(2n + 1)}{6} + 4 \times \dfrac{n(n + 1)}{2} + n$`, { size: 24, h: 64 }),
        S.box(100, 540, 1000, 100, R`!!ដូចនេះ!!   $1^3 + 2^3 + \ldots + n^3 = \dfrac{n^2(n + 1)^2}{4} = \left[\dfrac{n(n + 1)}{2}\right]^2$`, { size: 28, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 9 practice */ page([
        sec('ប្រតិបត្តិ'),

      ].concat(rows([
        { q: R`គណនា  $S = 12^3 + 13^3 + 14^3 + \ldots + 50^3$`, a: '$S = 1621269$' },
        { q: R`គណនា  $S = \dfrac{1}{1 \cdot 2 \cdot 3} + \dfrac{1}{2 \cdot 3 \cdot 4} + \ldots + \dfrac{1}{n(n+1)(n+2)}$`, a: R`$\dfrac{1}{2}\left(\dfrac{1}{2} - \dfrac{1}{(n+1)(n+2)}\right)$` }
      ], { y: 180, h: 110, gap: 150, size: 25, ansSize: 21, ansW: 270 }), [
        tip(60, 590, 1000, 56, R`!!គន្លឹះ ៖!! ក. $S = \sum_{k=1}^{50} k^3 - \sum_{k=1}^{11} k^3$      ខ. $\dfrac{1}{k(k+1)(k+2)} = \dfrac{1}{2}\left[\dfrac{1}{k(k+1)} - \dfrac{1}{(k+1)(k+2)}\right]$`, { size: 19, anim: true })
      ])),

      /* 10 section 2: patterns */ page([
        sec('២. គណនាផលបូកតាមលំនាំគំរូ'),
        tip(60, 160, 1180, 60, 'ចំពោះស៊ីតដែលមានតួជាចំនួនគត់ គេអាចគណនាផលបូកវាតាមការសង្កេតលំនាំគំរូ ។', { size: 24 }),
        l(60, 236, 800, '!!__ឧទាហរណ៍ ៖__!!  ផលបូកចំនួនសេសតគ្នា', { size: 27 }),
        s(200, 290, 520, R`$1 = 1 = 1^2$`, { anim: 'L0' }),
        s(200, 338, 520, R`$1 + 3 = 4 = 2^2$`, { anim: 'L1' }),
        s(200, 386, 520, R`$1 + 3 + 5 = 9 = 3^2$`, { anim: 'L2' }),
        s(200, 434, 520, R`$1 + 3 + 5 + 7 = 16 = 4^2$`, { anim: 'L3' }),
        S.box(100, 520, 760, 80, R`!!ដូចនេះ!!   $1 + 3 + 5 + \ldots + (2n - 1) = n^2$`, { size: 30, align: 'center', anim: true })
      ].concat(oddSquare(940, 270, 'L3'))),

      /* 11 worked example + practice */ page([
        l(60, 100, 1180, R`!!__លំហាត់គំរូ ៖__!!  គណនាផលបូក $n$ តួនៃចំនួនគូ   $S = 2 + 4 + 6 + \ldots + 2n$`, { size: 26 }),
        s(140, 156, 520, R`$2 = 2 = 1 \times 2$`),
        s(140, 200, 520, R`$2 + 4 = 6 = 2 \times 3$`),
        s(140, 244, 520, R`$2 + 4 + 6 = 12 = 3 \times 4$`),
        s(140, 288, 520, R`$2 + 4 + 6 + 8 = 20 = 4 \times 5$`),
        S.box(660, 200, 560, 76, R`!!ដូចនេះ!!   $2 + 4 + \ldots + 2n = n(n + 1)$`, { size: 26, align: 'center', anim: true }),
        l(60, 360, 700, '!!__ប្រតិបត្តិ ៖__!!  គេឱ្យលំនាំគំរូនៃស៊ីតខាងក្រោម ៖', { size: 26 }),
        T(140, 412, 520, 230, R`$1 = 1$
$1 + 7 = 8$
$1 + 7 + 19 = 27$
$1 + 7 + 19 + 37 = 64$
$1 + 7 + 19 + 37 + 61 = 125$`, { size: 24 }),
        l(660, 420, 600, R`គណនាផលបូកនៃស៊ីតនេះដែលមាន $10$ តួ ។`, { size: 25 }),
        s(680, 480, 560, R`ផលបូក $n$ តួ $= n^3$   ($1,\ 8,\ 27,\ 64,\ 125$)`),
        S.box(700, 540, 400, 64, R`$S_{10} = 10^3 = 1000$`, { size: 28, align: 'center', anim: true })
      ]),

      /* 12 sigma notation */ page([
        sec(R`៣. និមិត្តសញ្ញា $\Sigma$ សម្រាប់ផលបូកនៃស៊ីត`),
        S.box(60, 160, 720, 170, R`!!__សញ្ញាណ $\Sigma$ ៖__!!  ផលបូកតួនៃស៊ីត $a_1, a_2, \ldots, a_n$ សរសេរដោយប្រើនិមិត្តសញ្ញា $\Sigma$ (អានថា !!ស៊ិចម៉ា!!) ៖
$$\sum_{k=1}^{n} a_k = a_1 + a_2 + a_3 + \ldots + a_n$$`, { size: 24 }),
        T(60, 336, 720, 40, R`ក្នុងនោះ $k$ យកតម្លៃពី $1, 2, 3, \ldots$ រហូតដល់ $n$ ។`, { size: 22 }),
        T(900, 200, 180, 170, R`$$\sum_{k=1}^{n} a_k$$`, { size: 56, align: 'center', valign: 'middle' }),
        T(1080, 180, 190, 40, '← តួចុងក្រោយ $n$', { size: 18, color: 'brand', anim: 'parts' }),
        T(1080, 262, 190, 40, '← តួទូទៅ $a_k$', { size: 18, color: 'brand', anim: 'parts' }),
        T(1080, 336, 190, 40, '← ចាប់ពី $k = 1$', { size: 18, color: 'brand', anim: 'parts' }),
        l(60, 392, 600, '!!__ឧទាហរណ៍ ៖__!!', { size: 26 }),
        s(100, 440, 1100, R`$1 + 2 + 3 + \ldots + n = \displaystyle\sum_{k=1}^{n} k = \dfrac{n(n + 1)}{2}$`, { size: 26, h: 70 }),
        s(100, 516, 1100, R`$1^2 + 2^2 + 3^2 + \ldots + n^2 = \displaystyle\sum_{k=1}^{n} k^2 = \dfrac{n(n + 1)(2n + 1)}{6}$`, { size: 26, h: 70 }),
        s(100, 592, 1100, R`$1^3 + 2^3 + 3^3 + \ldots + n^3 = \displaystyle\sum_{k=1}^{n} k^3 = \left[\dfrac{n(n + 1)}{2}\right]^2$`, { size: 26, h: 70 })
      ]),

      /* 13 worked example 1: write with sigma */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ១ ៖__!!  សរសេរផលបូកខាងក្រោមដោយប្រើនិមិត្តសញ្ញា $\Sigma$ ៖`, { size: 27 }),
        l(140, 150, 1100, R`ក. $1^3 + 2^3 + \ldots + n^3$      ខ. $2 + 4 + 6 + \ldots + 100$      គ. $\dfrac{1}{2} - \dfrac{1}{3} + \dfrac{1}{4} - \dfrac{1}{5} + \ldots + \dfrac{1}{50}$`, { size: 25, h: 62 }),
        K.solTitle(440, 220),
        s(60, 280, 1180, R`!!ក.!!   $1^3 + 2^3 + \ldots + n^3 = \displaystyle\sum_{k=1}^{n} k^3$`, { h: 70 }),
        s(60, 356, 1180, R`!!ខ.!!   $2 + 4 + \ldots + 100 = 2 \times 1 + 2 \times 2 + \ldots + 2 \times 50$  មានតួទូទៅ $2n$ ដែល $n$ ពី $1$ ដល់ $50$`),
        s(120, 404, 1100, R`$\Rightarrow\ 2 + 4 + 6 + \ldots + 100 = \displaystyle\sum_{n=1}^{50} 2n$`, { h: 70 }),
        s(60, 480, 1180, R`!!គ.!!   តួទូទៅ $\dfrac{(-1)^n}{n}$ ដែល $n$ ពី $2$ ដល់ $50$`, { h: 62 }),
        s(120, 548, 1100, R`$\Rightarrow\ \dfrac{1}{2} - \dfrac{1}{3} + \dfrac{1}{4} - \ldots + \dfrac{1}{50} = \displaystyle\sum_{n=2}^{50} \dfrac{(-1)^n}{n}$`, { h: 80 })
      ]),

      /* 14 worked example 2: expand */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ២ ៖__!!  សរសេរគ្រប់តួទាំងអស់នៃផលបូក ដោយមិនប្រើនិមិត្តសញ្ញា $\Sigma$ ៖`, { size: 27 }),
        l(140, 156, 1100, R`ក. $\displaystyle\sum_{k=1}^{6} 2$          ខ. $\displaystyle\sum_{n=2}^{5} (2n + 1)$          គ. $\displaystyle\sum_{j=1}^{5} j(j + 1)$`, { size: 26, h: 80 }),
        K.solTitle(440, 250),
        s(100, 316, 1100, R`!!ក.!!   $\displaystyle\sum_{k=1}^{6} 2 = 2 + 2 + 2 + 2 + 2 + 2$   $(= 12)$`, { h: 76 }),
        s(100, 402, 1100, R`!!ខ.!!   $\displaystyle\sum_{n=2}^{5} (2n + 1) = 5 + 7 + 9 + 11$   $(= 32)$`, { h: 76 }),
        s(100, 488, 1100, R`!!គ.!!   $\displaystyle\sum_{j=1}^{5} j(j + 1) = 2 + 6 + 12 + 20 + 30$   $(= 70)$`, { h: 76 }),
        tip(100, 580, 900, 56, R`!!ចំណាំ ៖!! អក្សរ $k, n, j$ ជាអថេររាប់ — ប្តូរឈ្មោះបាន ដោយមិនប្រែប្រួលផលបូក ។`, { size: 21, anim: true }),
        kids()
      ]),

      /* 15 practice: write with sigma */ page([
        sec(R`ប្រតិបត្តិ — សរសេរដោយប្រើ $\Sigma$`)
      ].concat(rows([
        { q: R`$2 + 5 + 8 + \ldots + (3n - 1)$`, a: R`$\displaystyle\sum_{k=1}^{n} (3k - 1)$` },
        { q: R`$3 + 6 + 12 + \ldots + 3(2)^{n-1}$`, a: R`$\displaystyle\sum_{k=1}^{n} 3 \times 2^{k-1}$` },
        { q: R`$1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \ldots + \frac{1}{100}$`, a: R`$\displaystyle\sum_{k=1}^{100} \frac{1}{k}$` }
      ], { y: 190, h: 96, gap: 130, size: 26, ansSize: 22 }))),

      /* 16 sigma properties */ page([
        sec('លក្ខណៈនៃស៊ិចម៉ា'),
        S.box(60, 160, 1000, 380, R`!!__លក្ខណៈ ៖__!!
!!១.!!  $\displaystyle\sum_{k=1}^{n} c = nc$   ($c$ ជាចំនួនថេរ)
!!២.!!  $\displaystyle\sum_{k=1}^{n} c\,a_k = c\sum_{k=1}^{n} a_k$
!!៣.!!  $\displaystyle\sum_{k=1}^{n} (a_k + b_k) = \sum_{k=1}^{n} a_k + \sum_{k=1}^{n} b_k$
!!៤.!!  $\displaystyle\sum_{k=1}^{n} (a_k - b_k) = \sum_{k=1}^{n} a_k - \sum_{k=1}^{n} b_k$
!!៥.!!  $\displaystyle\sum_{k=1}^{n} (a_k + b_k)^2 = \sum_{k=1}^{n} a_k^2 + 2\sum_{k=1}^{n} a_k b_k + \sum_{k=1}^{n} b_k^2$`, { size: 25, lh: '1.55' }),
        tip(60, 560, 1000, 76, R`!!ប្រយ័ត្ន ៖!!  $\displaystyle\sum a_k b_k \neq \sum a_k \cdot \sum b_k$   និង   $\displaystyle\sum a_k^2 \neq \left(\sum a_k\right)^2$`, { size: 22, anim: true }),
        kids(1095, 380, 170)
      ]),

      /* 17 proofs */ page([
        sec('សម្រាយបញ្ជាក់'),
        s(60, 160, 1180, R`!!១.!!   $\displaystyle\sum_{k=1}^{n} c = \underbrace{c + c + \ldots + c}_{n \text{ តួ}} = nc$`, { h: 82 }),
        s(60, 252, 1180, R`!!២.!!   $\displaystyle\sum_{k=1}^{n} c\,a_k = c a_1 + c a_2 + \ldots + c a_n = c(a_1 + a_2 + \ldots + a_n) = c\sum_{k=1}^{n} a_k$`, { h: 76 }),
        s(60, 338, 1180, R`!!៣.!!   $\displaystyle\sum_{k=1}^{n} (a_k + b_k) = (a_1 + b_1) + \ldots + (a_n + b_n) = (a_1 + \ldots + a_n) + (b_1 + \ldots + b_n)$`, { h: 76, size: 23 }),
        s(60, 424, 1180, R`!!៤.!!   ស្រដៀងនឹង !!៣.!! ដោយប្តូរសញ្ញា $+$ ទៅ $-$`),
        s(60, 480, 1180, R`!!៥.!!   $\displaystyle\sum_{k=1}^{n} (a_k + b_k)^2 = \sum_{k=1}^{n} (a_k^2 + 2a_k b_k + b_k^2) = \sum_{k=1}^{n} a_k^2 + 2\sum_{k=1}^{n} a_k b_k + \sum_{k=1}^{n} b_k^2$`, { h: 76, size: 23 }),
        kids(1100, 560, 120)
      ]),

      /* 18 worked example: compute sums */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ៖__!!  គណនា    ក. $\displaystyle\sum_{k=1}^{15} (4k + 3)$          ខ. $\displaystyle\sum_{k=1}^{20} (k + 3)k$`, { size: 27, h: 80 }),
        K.solTitle(440, 186),
        s(60, 246, 560, R`!!ក.!!  $\displaystyle\sum_{k=1}^{15} (4k + 3) = 4\sum_{k=1}^{15} k + \sum_{k=1}^{15} 3$`, { h: 76 }),
        s(120, 326, 500, R`$= 4 \times \dfrac{15 \times 16}{2} + 15 \times 3$`, { h: 64 }),
        s(120, 394, 500, R`$= 480 + 45 = 525$`),
        S.box(80, 462, 440, 60, R`!!ដូចនេះ!!   $\displaystyle\sum_{k=1}^{15} (4k + 3) = 525$`, { size: 24, align: 'center', anim: true, h: 76 }),
        s(660, 246, 600, R`!!ខ.!!  $\displaystyle\sum_{k=1}^{20} (k + 3)k = \sum_{k=1}^{20} k^2 + 3\sum_{k=1}^{20} k$`, { h: 76 }),
        s(720, 326, 540, R`$= \dfrac{20 \times 21 \times 41}{6} + 3 \times \dfrac{20 \times 21}{2}$`, { h: 64 }),
        s(720, 394, 540, R`$= 2870 + 630 = 3500$`),
        S.box(680, 462, 480, 76, R`!!ដូចនេះ!!   $\displaystyle\sum_{k=1}^{20} (k + 3)k = 3500$`, { size: 24, align: 'center', anim: true }),
        tip(80, 570, 1080, 66, R`!!គន្លឹះ ៖!! បំបែកជាផលបូកនៃ $\sum k^2,\ \sum k,\ \sum c$ រួចប្រើរូបមន្តដែលស្គាល់ ។`, { size: 22, anim: true })
      ]),

      /* 19 practice: compute */ page([
        sec('ប្រតិបត្តិ — គណនា')
      ].concat(rows([
        { q: R`$\displaystyle\sum_{k=1}^{20} (3k + 1)$`, a: '$650$' },
        { q: R`$\displaystyle\sum_{k=1}^{7} 2^k$`, a: '$254$' },
        { q: R`$\displaystyle\sum_{k=4}^{14} (4k - 3)$`, a: '$363$' },
        { q: R`$\displaystyle\sum_{k=1}^{n} (3 + k)^2$`, a: R`$\dfrac{n}{6}(2n^2 + 21n + 73)$` },
        { q: R`$\displaystyle\sum_{k=1}^{30} k(k + 1)$`, a: '$9920$' }
      ], { y: 160, h: 82, gap: 96, w: 620, size: 24, ansX: 790, ansW: 420, ansSize: 22 }))),

      /* 20-22 quizzes */
      S.quiz(R`!!១.!! $\displaystyle\sum_{k=1}^{n} k$  ស្មើ ៖`, [R`$\frac{n(n - 1)}{2}$`, R`$\frac{n(n + 1)}{2}$`, R`$\frac{n(n+1)(2n+1)}{6}$`, '$n^2$'], 1),
      S.quiz(R`!!២.!! $\displaystyle\sum_{k=1}^{5} k^2$  ស្មើ ៖`, ['$15$', '$55$', '$25$', '$30$'], 1),
      S.quiz(R`!!៣.!! $\dfrac{1}{1 \cdot 2} + \dfrac{1}{2 \cdot 3} + \ldots + \dfrac{1}{9 \cdot 10}$  ស្មើ ៖`, [R`$\frac{1}{10}$`, '$1$', R`$\frac{9}{10}$`, R`$\frac{10}{11}$`], 2),

      /* 23 homework 1 */ S.homework(R`!!១.!! សរសេរដោយប្រើ $\Sigma$ ៖  $1 + 4 + 9 + \ldots + 484$  និង  $1 \times 3 + 2 \times 4 + \ldots + 20 \times 22$
!!២.!! គណនា  $\displaystyle\sum_{k=1}^{11} k^2,\ \ \sum_{k=1}^{24} k^2,\ \ \sum_{k=12}^{24} k^2$
!!៣.!! គណនា  $\displaystyle\sum_{k=1}^{24} k^3,\ \ \sum_{k=1}^{15} k^3,\ \ \sum_{k=16}^{24} k^3$`),

      /* ===== part 2: n-th term from differences ===== */
      /* 24 */ K.toc([
        R`==៤. កំណត់តួទី $n$ តាមផលសងតួនៃស៊ីត==`,
        '៤.១ ផលសងតួលំដាប់ទី ១ នៃស៊ីត',
        '៤.២ ផលសងតួលំដាប់ទី ២ នៃស៊ីត'
      ], 46),
      /* 25 */ S.objective([
        'កំណត់ផលសងតួលំដាប់ទី ១ និងទី ២ នៃស៊ីត',
        R`កំណត់តួទី $n$ និងគណនាផលបូក $n$ តួដំបូងនៃស៊ីត`
      ]),

      /* 26 homework answers */ page([
        sec('កំណែកិច្ចការផ្ទះ'),
        s(60, 160, 1180, R`!!១.!!   $1 + 4 + \ldots + 484 = \displaystyle\sum_{k=1}^{22} k^2$  ;   $1 \times 3 + 2 \times 4 + \ldots + 20 \times 22 = \displaystyle\sum_{k=1}^{20} k(k + 2)$`, { h: 76, size: 23 }),
        s(60, 250, 1180, R`!!២.!!   $\displaystyle\sum_{k=1}^{11} k^2 = \dfrac{11 \times 12 \times 23}{6} = 506$  ;   $\displaystyle\sum_{k=1}^{24} k^2 = \dfrac{24 \times 25 \times 49}{6} = 4900$`, { h: 76, size: 23 }),
        s(120, 334, 1100, R`$\displaystyle\sum_{k=12}^{24} k^2 = \sum_{k=1}^{24} k^2 - \sum_{k=1}^{11} k^2 = 4900 - 506 = 4394$`, { h: 76, size: 23 }),
        s(60, 424, 1180, R`!!៣.!!   $\displaystyle\sum_{k=1}^{24} k^3 = \left(\dfrac{24 \times 25}{2}\right)^2 = 90000$  ;   $\displaystyle\sum_{k=1}^{15} k^3 = \left(\dfrac{15 \times 16}{2}\right)^2 = 14400$`, { h: 76, size: 23 }),
        s(120, 508, 1100, R`$\displaystyle\sum_{k=16}^{24} k^3 = 90000 - 14400 = 75600$`, { h: 76, size: 23 }),
        kids(1100, 540, 140)
      ]),

      /* 27 first differences: table */ page([
        sec(R`៤. របៀបកំណត់តួទី $n$ តាមផលសងតួនៃស៊ីត`),
        tip(60, 155, 1180, 60, R`គេអាចកំណត់តួទី $n$ របស់ស៊ីតដែលពុំមែនជាស៊ីតនព្វន្ត ឬស៊ីតធរណីមាត្រ តាមរបៀបខាងក្រោម ៖`, { size: 23 }),
        title('៤.១ ផលសងតួលំដាប់ទី ១ នៃស៊ីត', { x: 60, y: 222, size: 28, color: 'head' }),
        l(60, 282, 1100, R`!!__ឧទាហរណ៍ ១ ៖__!!  កំណត់តួទី $n$ នៃស៊ីត   $1,\ 3,\ 7,\ 13,\ 21,\ 31,\ \ldots$`, { size: 26 }),
        l(60, 334, 1180, 'ស៊ីតនេះមិនមែនជាស៊ីតនព្វន្ត ក៏មិនមែនជាស៊ីតធរណីមាត្រ ។ គេធ្វើផលសងនៃតួតគ្នា ៖', { size: 24 }),

      ].concat(diffTable(60, 400, [
        { label: R`$n$`, vals: ['1', '2', '3', '4', '5', '6'] },
        { label: R`ស៊ីត $(a_n)$`, vals: ['1', '3', '7', '13', '21', '31'] },
        { label: 'ផលសងលំដាប់ទី ១', vals: ['2', '4', '6', '8', '10'], depth: 1, anim: 'd1' }
      ], { gap: 86, lw: 230 }), [
        S.box(860, 520, 380, 110, R`ផលសងតួ $2, 4, 6, 8, \ldots$ ជា !!ស៊ីតនព្វន្ត!! ងាយរក`, { size: 22, anim: true })
      ])),

      /* 28 first differences: derivation */ page([
        l(60, 100, 1100, R`!!__ឧទាហរណ៍ ១ (ត) ៖__!!  ស៊ីត  $1,\ 3,\ 7,\ 13,\ 21,\ 31,\ \ldots$`, { size: 26 }),
        s(140, 156, 520, R`$a_2 - a_1 = 3 - 1 = 2 \times 1$`),
        s(140, 202, 520, R`$a_3 - a_2 = 7 - 3 = 2 \times 2$`),
        s(140, 248, 520, R`$a_4 - a_3 = 13 - 7 = 2 \times 3$`),
        s(140, 290, 520, '...........................................', { h: 34 }),
        s(140, 326, 520, R`$a_n - a_{n-1} = 2 \times (n - 1)$`),
        s(60, 384, 1180, R`បូកអង្គ និងអង្គ ៖   $a_n - 1 = 2[1 + 2 + 3 + \ldots + (n - 1)] = 2 \times \dfrac{n(n - 1)}{2}$`, { h: 64 }),
        s(140, 456, 1000, R`$\Rightarrow\ a_n = n(n - 1) + 1 = n^2 - n + 1$`),
        S.box(100, 530, 1000, 76, R`!!ដូចនេះ!!   តួទី $n$ នៃស៊ីត $1, 3, 7, 13, 21, 31, \ldots$ គឺ   $a_n = n^2 - n + 1$`, { size: 26, align: 'center', anim: true }),
        tip(700, 156, 540, 120, R`!!ផ្ទៀងផ្ទាត់ ៖!!  $a_4 = 16 - 4 + 1 = 13$ ✓
$a_6 = 36 - 6 + 1 = 31$ ✓`, { size: 22, anim: true })
      ]),

      /* 29 general rule */ page([
        title('ជាទូទៅ', { x: 60, size: 34, color: 'head' }),
        S.box(60, 160, 1180, 130, R`គេមានស៊ីត $(a_n)$ និង   $b_1 = a_2 - a_1,\ b_2 = a_3 - a_2,\ \ldots,\ b_{n-1} = a_n - a_{n-1}$ ។
ស៊ីត $(b_n)$ ៖ $b_1, b_2, \ldots, b_{n-1}$ ហៅថា !!ផលសងតួលំដាប់ទី ១!! នៃស៊ីត $(a_n)$ ។`, { size: 24 }),
        l(60, 306, 1100, R`!!__ឧទាហរណ៍ ២ ៖__!!  បង្ហាញថា  $a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k$   ចំពោះ $n \ge 2$`, { size: 26, h: 70 }),
        s(100, 380, 1100, R`បូកអង្គ និងអង្គនៃ  $a_2 - a_1 = b_1,\ a_3 - a_2 = b_2,\ \ldots,\ a_n - a_{n-1} = b_{n-1}$  ៖`, { size: 24 }),
        s(160, 430, 1000, R`$a_n - a_1 = b_1 + b_2 + \ldots + b_{n-1}\ \Rightarrow\ a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k$`, { h: 70 }),
        S.box(60, 520, 1180, 110, R`!!__រូបមន្ត ៖__!!  បើ  $b_n = a_{n+1} - a_n,\ n = 1, 2, 3, \ldots$  នោះ    $a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k$   ចំពោះ $n \ge 2$`, { size: 26, align: 'center', anim: true })
      ]),

      /* 30 worked example 1 */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ១ ៖__!!  កំណត់តួទី $n$ នៃស៊ីត   $2,\ 4,\ 8,\ 14,\ 22,\ 32,\ \ldots$`, { size: 27 }),
        K.solTitle(440, 156),
        s(60, 216, 1180, R`តាង $b_n = a_{n+1} - a_n$ ៖   ស៊ីត $(b_n)$ ៖  $2,\ 4,\ 6,\ 8,\ \ldots$   ជាស៊ីតនព្វន្ត  $b_1 = 2,\ d = 2$`),
        s(140, 264, 1000, R`$\Rightarrow\ b_n = 2 + 2(n - 1) = 2n$`),
        s(60, 316, 1180, R`ចំពោះ $n \ge 2$ ៖   $a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k = 2 + \sum_{k=1}^{n-1} 2k = 2 + 2 \times \dfrac{n(n - 1)}{2}$`, { h: 72 }),
        s(240, 394, 900, R`$= n^2 - n + 2$`),
        s(60, 446, 1180, R`ចំពោះ $n = 1$ ៖   $a_1 = 1 - 1 + 2 = 2$  ពិត ។`),
        S.box(160, 520, 860, 76, R`!!ដូចនេះ!!   $a_n = n^2 - n + 2$`, { size: 30, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 31 worked example 2: n-th term */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ២ ៖__!!  ស៊ីត   $1,\ 2,\ 5,\ 10,\ 17,\ \ldots$`, { size: 27 }),
        l(140, 150, 1100, R`ក. កំណត់តួទី $n$ នៃស៊ីតនេះ ។      ខ. គណនាផលបូក $n$ តួដំបូងនៃស៊ីតនេះ ។`, { size: 25 }),
        K.solTitle(440, 206),
        s(60, 264, 1180, R`!!ក.!!  ស៊ីត $(b_n)$ ៖  $1,\ 3,\ 5,\ 7,\ \ldots$   ជាស៊ីតនព្វន្ត  $b_1 = 1,\ d = 2\ \Rightarrow\ b_n = 2n - 1$`),
        s(60, 316, 1180, R`ចំពោះ $n \ge 2$ ៖   $a_n = 1 + \displaystyle\sum_{k=1}^{n-1} (2k - 1) = 1 + 2 \times \dfrac{n(n - 1)}{2} - (n - 1)$`, { h: 72 }),
        s(240, 394, 900, R`$= 1 + n^2 - n - n + 1 = n^2 - 2n + 2$`),
        s(60, 446, 1180, R`ចំពោះ $n = 1$ ៖   $a_1 = 1 - 2 + 2 = 1$  ពិត ។`),
        S.box(160, 520, 860, 76, R`!!ដូចនេះ!!   $a_n = n^2 - 2n + 2$`, { size: 30, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 32 worked example 2: sum */ page([
        l(60, 100, 1100, R`!!ខ.!!  គណនាផលបូក $n$ តួដំបូងនៃស៊ីត $(a_n)$ ដែល  $a_n = n^2 - 2n + 2$`, { size: 27 }),
        s(60, 160, 1180, R`$S_n = \displaystyle\sum_{k=1}^{n} (k^2 - 2k + 2) = \sum_{k=1}^{n} k^2 - 2\sum_{k=1}^{n} k + 2n$`, { h: 76 }),
        s(160, 244, 1000, R`$= \dfrac{n(n + 1)(2n + 1)}{6} - n(n + 1) + 2n$`, { h: 66 }),
        s(160, 318, 1000, R`$= \dfrac{n}{6}\left[(n + 1)(2n + 1) - 6(n + 1) + 12\right] = \dfrac{n}{6}(2n^2 - 3n + 7)$`, { h: 66 }),
        S.box(160, 410, 860, 90, R`!!ដូចនេះ!!   $S_n = \dfrac{1}{6}n(2n^2 - 3n + 7)$`, { size: 30, align: 'center', anim: true }),
        tip(160, 520, 860, 66, R`!!ផ្ទៀងផ្ទាត់ ៖!!  $S_3 = 1 + 2 + 5 = 8$  និង  $\dfrac{3(18 - 9 + 7)}{6} = 8$ ✓`, { size: 22, anim: true }),
        kids()
      ]),

      /* 33 practice */ page([
        sec('ប្រតិបត្តិ'),
        l(60, 160, 1160, R`!!__លំហាត់ ១ ៖__!!  ក. កំណត់តួទី $n$ នៃស៊ីត  $4,\ 5,\ 7,\ 10,\ 14,\ \ldots$ \quad ខ. គណនាផលបូក $n$ តួដំបូង`, { size: 25 }),
        S.box(100, 222, 1080, 80, R`!!ចម្លើយ ១ ៖!!   $a_n = \dfrac{n^2 - n + 8}{2}$ \qquad និង \qquad $S_n = \dfrac{n(n^2 + 23)}{6}$`, { size: 24, anim: true }),
        l(60, 345, 1160, R`!!__លំហាត់ ២ ៖__!!  ក. កំណត់តួទី $n$ នៃស៊ីត  $3,\ 5,\ 8,\ 12,\ 17,\ 23,\ \ldots$ \quad ខ. គណនាផលបូក $n$ តួដំបូង`, { size: 25 }),
        S.box(100, 407, 1080, 80, R`!!ចម្លើយ ២ ៖!!   $a_n = \dfrac{n^2 + n + 4}{2}$ \qquad និង \qquad $S_n = \dfrac{n}{6}(n^2 + 3n + 14)$`, { size: 24, anim: true }),
        kids()
      ]),

      /* 34 second differences */ page([
        title('៤.២ ផលសងតួលំដាប់ទី ២ នៃស៊ីត', { x: 60, size: 30, color: 'head' }),
        tip(60, 160, 1180, 86, R`បើស៊ីត $(b_n)$ នៅតែមិនអាចកំណត់តួទី $n$ នៃ $(a_n)$ បាន គេធ្វើផលសងតួនៃស៊ីត $(b_n)$ បន្តទៀត ហៅថា !!ផលសងតួលំដាប់ទី ២!! នៃស៊ីត $(a_n)$ ។`, { size: 23 }),
        l(60, 262, 1100, R`!!__ឧទាហរណ៍ ៖__!!  កំណត់តួទី $n$ នៃស៊ីត $(a_n)$ ៖   $1,\ 2,\ 6,\ 15,\ 31,\ 56,\ \ldots$`, { size: 26 }),

      ].concat(diffTable(60, 330, [
        { label: R`$n$`, vals: ['1', '2', '3', '4', '5', '6'] },
        { label: R`ស៊ីត $(a_n)$`, vals: ['1', '2', '6', '15', '31', '56'] },
        { label: R`លំដាប់ទី ១  $(b_n)$`, vals: ['1', '4', '9', '16', '25'], depth: 1, anim: 'd1' },
        { label: R`លំដាប់ទី ២  $(c_n)$`, vals: ['3', '5', '7', '9'], depth: 2, anim: 'd2' }
      ], { gap: 86, lw: 230 }), [
        S.box(800, 540, 440, 68, R`$c_n$ ៖ $3, 5, 7, 9, \ldots$ ជា !!ស៊ីតនព្វន្ត!!`, { size: 22, align: 'center', anim: 'd2' })
      ])),

      /* 35 second differences: solution */ page([
        l(60, 100, 1100, R`!!__ឧទាហរណ៍ (ត) ៖__!!  ស៊ីត  $1,\ 2,\ 6,\ 15,\ 31,\ 56,\ \ldots$`, { size: 26 }),
        s(60, 156, 1180, R`ផលសងលំដាប់ទី ២ ៖  $c_n = 3 + 2(n - 1) = 2n + 1$`),
        s(60, 206, 1180, R`$b_n = b_1 + \displaystyle\sum_{k=1}^{n-1} c_k = 1 + \sum_{k=1}^{n-1} (2k + 1) = 1 + n(n - 1) + (n - 1) = n^2$`, { h: 72 }),
        s(60, 286, 1180, R`$a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k = 1 + \sum_{k=1}^{n-1} k^2 = 1 + \dfrac{(n - 1)n(2n - 1)}{6}$`, { h: 72 }),
        s(60, 366, 1180, R`ចំពោះ $n = 1$ ៖  $a_1 = 1$  ពិត ។`),
        S.box(160, 430, 860, 90, R`!!ដូចនេះ!!   $a_n = \dfrac{1}{6}(2n - 1)(n - 1)n + 1$`, { size: 30, align: 'center', anim: true }),
        S.box(60, 532, 1180, 88, R`!!__ជាទូទៅ ៖__!!  $c_n = b_{n+1} - b_n$ ជា !!ផលសងតួលំដាប់ទី ២!! ៖   $b_n = b_1 + \displaystyle\sum_{k=1}^{n-1} c_k$   រួច   $a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k$   $(n \ge 2)$`, { size: 23, anim: true })
      ]),

      /* 36 worked example: n-th term */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ៖__!!  ស៊ីត   $4,\ 18,\ 48,\ 100,\ 180,\ 294,\ \ldots$`, { size: 27 }),
        l(140, 150, 1100, R`ក. កំណត់តួទី $n$ នៃស៊ីតនេះ ។      ខ. គណនាផលបូក $n$ តួដំបូង ។`, { size: 25 }),
        s(60, 210, 1180, R`!!ក.!!  $(b_n)$ ៖ $14,\ 30,\ 52,\ 80,\ 114,\ \ldots$     $(c_n)$ ៖ $16,\ 22,\ 28,\ 34,\ \ldots$  ជាស៊ីតនព្វន្ត  $d = 6$`),
        s(120, 258, 1100, R`$c_n = 16 + 6(n - 1) = 6n + 10$`),
        s(120, 306, 1100, R`$b_n = 14 + \displaystyle\sum_{k=1}^{n-1} (6k + 10) = 14 + 3n(n - 1) + 10(n - 1) = 3n^2 + 7n + 4$`, { h: 72 }),
        s(120, 386, 1100, R`$a_n = 4 + \displaystyle\sum_{k=1}^{n-1} (3k^2 + 7k + 4) = 4 + \dfrac{(n - 1)n(2n - 1)}{2} + \dfrac{7(n - 1)n}{2} + 4(n - 1)$`, { h: 72, size: 23 }),
        s(400, 464, 800, R`$= n^3 + 2n^2 + n = n(n + 1)^2$`),
        S.box(160, 530, 860, 80, R`!!ដូចនេះ!!   $a_n = n^3 + 2n^2 + n$`, { size: 30, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 37 worked example: sum */ page([
        l(60, 100, 1100, R`!!ខ.!!  គណនាផលបូក $n$ តួដំបូងនៃស៊ីត  $a_n = n^3 + 2n^2 + n$`, { size: 27 }),
        s(60, 160, 1180, R`$S_n = \displaystyle\sum_{k=1}^{n} k^3 + 2\sum_{k=1}^{n} k^2 + \sum_{k=1}^{n} k$`, { h: 76 }),
        s(160, 244, 1080, R`$= \dfrac{n^2(n + 1)^2}{4} + \dfrac{n(n + 1)(2n + 1)}{3} + \dfrac{n(n + 1)}{2}$`, { h: 66 }),
        s(160, 318, 1080, R`$= \dfrac{n(n + 1)}{12}\left[3n(n + 1) + 4(2n + 1) + 6\right] = \dfrac{n(n + 1)(3n^2 + 11n + 10)}{12}$`, { h: 66 }),
        S.box(160, 410, 860, 90, R`!!ដូចនេះ!!   $S_n = \dfrac{1}{12}n(n + 1)(3n^2 + 11n + 10)$`, { size: 30, align: 'center', anim: true }),
        tip(160, 520, 860, 66, R`!!ផ្ទៀងផ្ទាត់ ៖!!  $S_1 = \dfrac{1 \times 2 \times 24}{12} = 4 = a_1$ ✓`, { size: 22, anim: true }),
        kids()
      ]),

      /* 38 practice */ page([
        sec('ប្រតិបត្តិ'),
        l(80, 200, 1100, R`កំណត់តួទី $n$ នៃស៊ីត   $1,\ 2,\ 5,\ 12,\ 27,\ 58,\ 121,\ \ldots$`, { size: 30 }),
        s(120, 290, 1100, R`ផលសងលំដាប់ទី ១ ៖  $1,\ 3,\ 7,\ 15,\ 31,\ 63,\ \ldots$   $(= 2^n - 1)$`, { size: 26 }),
        s(120, 350, 1100, R`$a_n = 1 + \displaystyle\sum_{k=1}^{n-1} (2^k - 1) = 1 + (2^n - 2) - (n - 1)$`, { size: 26, h: 72 }),
        S.box(300, 450, 600, 80, R`!!ចម្លើយ ៖!!   $a_n = 2^n - n$`, { size: 32, align: 'center', anim: true }),
        kids()
      ]),

      /* 39-41 quizzes */
      S.quiz(R`!!១.!! ស៊ីត $1,\ 2,\ 4,\ 7,\ 11,\ \ldots$ មានផលសងតួលំដាប់ទី ១ គឺ ៖`, [R`$2, 4, 8, \ldots$`, R`$1, 2, 3, 4, \ldots$`, R`$1, 1, 1, \ldots$`, R`$1, 3, 5, \ldots$`], 1),
      S.quiz(R`!!២.!! ស៊ីត $2,\ 5,\ 10,\ 17,\ 26,\ \ldots$ មានតួទូទៅ ៖`, [R`$a_n = 3n - 1$`, R`$a_n = 2n^2$`, R`$a_n = n^2 + 1$`, R`$a_n = n^2 + 2$`], 2),
      S.quiz(R`!!៣.!! បើ $b_k = a_{k+1} - a_k$ នោះ $a_n$ ស្មើ ៖`, [R`$\sum_{k=1}^{n} b_k$`, R`$a_1 + \sum_{k=1}^{n} b_k$`, R`$a_1 \sum_{k=1}^{n-1} b_k$`, R`$a_1 + \sum_{k=1}^{n-1} b_k$`], 3),

      /* 42 homework 2 */ S.homework(R`!!១.!! សម្រួល $\displaystyle\sum_{k=1}^{n} k(k+1)$ រួចគណនា  $1 \times 2 + 2 \times 3 + \ldots + 28 \times 29$
!!២.!! កំណត់តួទី $n$ និងផលបូក $n$ តួដំបូងនៃស៊ីត  $1,\ 5,\ 14,\ 30,\ 55,\ 91,\ \ldots$
!!៣.!! កំណត់តួទី $n$ នៃស៊ីត $(a_n)$ ៖  $p,\ q,\ p,\ q,\ p,\ q,\ \ldots$`),

      /* 43 solutions to homework 2 */ page([
        sec('កំណែកិច្ចការផ្ទះ ២'),
        s(60, 160, 1180, R`!!១.!!   $\displaystyle\sum_{k=1}^{n} k(k+1) = \sum_{k=1}^{n} (k^2+k) = \dfrac{n(n+1)(2n+1)}{6} + \dfrac{n(n+1)}{2} = \dfrac{n(n+1)(n+2)}{3}$`, { h: 76, size: 23 }),
        s(120, 244, 1100, R`ជំនួស $n = 28$ ៖   $S = \dfrac{28 \times 29 \times 30}{3} = 28 \times 29 \times 10 = 8120$`, { h: 60, size: 24 }),
        s(60, 316, 1180, R`!!២.!!   $(a_n)$ ៖ $1,\ 5,\ 14,\ 30,\ 55,\ \ldots$  មានផលសង  $b_k = (k+1)^2$  $\Rightarrow\ a_n = \displaystyle\sum_{j=1}^{n} j^2 = \dfrac{n(n+1)(2n+1)}{6}$`, { h: 72, size: 22 }),
        s(120, 394, 1100, R`ផលបូក ៖   $S_n = \displaystyle\sum_{k=1}^{n} a_k = \dfrac{n(n+1)^2(n+2)}{12}$`, { h: 64, size: 24 }),
        s(60, 466, 1180, R`!!៣.!!   $p,\ q,\ p,\ q,\ \ldots$  ៖   $a_n = \dfrac{p + q}{2} + \dfrac{p - q}{2}(-1)^{n-1}$   (ឬ $a_n = p$ បើ $n$ សេស, $q$ បើ $n$ គូ)`, { h: 66, size: 22 }),
        kids(1100, 526, 150)
      ]),

      /* 44 textbook exercise 6 */ page([
        sec('លំហាត់អនុវត្តន៍ទី ៦'),
        l(60, 155, 1180, R`!!ក.!! សម្រួលកន្សោម  $\displaystyle\sum_{k=1}^{n} k(k+1)(k+2)$      !!ខ.!! គណនា  $1 \cdot 2 \cdot 3 + 2 \cdot 3 \cdot 4 + \ldots + 20 \cdot 21 \cdot 22$`, { size: 25, h: 60 }),
        K.solTitle(440, 224),
        s(60, 290, 1180, R`ប្រើសមភាព ៖   $k(k+1)(k+2) = \dfrac{k(k+1)(k+2)(k+3) - (k-1)k(k+1)(k+2)}{4}$`),
        s(60, 350, 1180, R`បូកតួទាំងអស់លុបគ្នាអស់ សល់តួចុងក្រោយ ៖   $\displaystyle\sum_{k=1}^{n} k(k+1)(k+2) = \dfrac{n(n+1)(n+2)(n+3)}{4}$`, { h: 72, size: 24 }),
        s(60, 436, 1180, R`!!ខ.!! ចំពោះ $n = 20$ ៖   $S = \dfrac{20 \times 21 \times 22 \times 23}{4} = 5 \times 21 \times 22 \times 23$`, { h: 66, size: 25 }),
        S.box(200, 516, 800, 76, R`!!ដូចនេះ!!   $S = 53130$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 45 textbook exercise 8 */ page([
        sec('លំហាត់អនុវត្តន៍ទី ៨'),
        l(60, 155, 1180, R`កំណត់តួទី $n$ និងផលបូក $n$ តួដំបូងនៃស៊ីត   $1,\ 5,\ 14,\ 30,\ 55,\ 91,\ \ldots$`, { size: 26, h: 50 }),
        s(60, 215, 1180, R`ផលសងលំដាប់ទី ១ ៖  $4,\ 9,\ 16,\ 25,\ 36,\ \ldots$  មានតួទូទៅ  $b_k = (k+1)^2$`),
        s(60, 268, 1180, R`$a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} (k+1)^2 = 1 + \left(\sum_{j=1}^{n} j^2 - 1\right) = \sum_{j=1}^{n} j^2 = \dfrac{n(n+1)(2n+1)}{6}$`, { h: 72, size: 23 }),
        s(60, 352, 1180, R`ផលបូក $S_n = \displaystyle\sum_{k=1}^{n} \dfrac{k(k+1)(2k+1)}{6} = \dfrac{1}{6}\sum_{k=1}^{n} (2k^3 + 3k^2 + k)$`, { h: 72, size: 23 }),
        s(140, 432, 1000, R`$= \dfrac{1}{6}\left[2 \times \dfrac{n^2(n+1)^2}{4} + 3 \times \dfrac{n(n+1)(2n+1)}{6} + \dfrac{n(n+1)}{2}\right]$`, { h: 72, size: 23 }),
        S.box(160, 520, 860, 80, R`!!ដូចនេះ!!   $a_n = \dfrac{n(n+1)(2n+1)}{6}$   ;   $S_n = \dfrac{n(n+1)^2(n+2)}{12}$`, { size: 26, align: 'center', anim: true }),
        kids()
      ]),

      /* 46 summary */ page([
        sec('សង្ខេបរូបមន្តសំខាន់ៗនៃមេរៀនទី ៤'),
        S.box(60, 160, 1180, 420, R`!!__១. រូបមន្តផលបូកគ្រឹះ ៖__!!
• $\displaystyle\sum_{k=1}^{n} k = 1 + 2 + \ldots + n = \dfrac{n(n+1)}{2}$
• $\displaystyle\sum_{k=1}^{n} k^2 = 1^2 + 2^2 + \ldots + n^2 = \dfrac{n(n+1)(2n+1)}{6}$
• $\displaystyle\sum_{k=1}^{n} k^3 = 1^3 + 2^3 + \ldots + n^3 = \left[\dfrac{n(n+1)}{2}\right]^2$
• $\displaystyle\sum_{k=1}^{n} c = nc$   ;   $\displaystyle\sum_{k=1}^{n} c\,a_k = c\sum_{k=1}^{n} a_k$
!!__២. កំណត់តួទី $n$ តាមផលសងតួ ៖__!!
• ផលសងលំដាប់ទី ១ ៖   $a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} b_k$   ($b_k = a_{k+1} - a_k$)
• ផលសងលំដាប់ទី ២ ៖   $b_n = b_1 + \displaystyle\sum_{k=1}^{n-1} c_k$   រួចរក $a_n$`, { size: 23, lh: '1.5' }),
        kids(1100, 526, 150)
      ]),

      /* 47 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី៤ ផលបូកតួនៃស៊ីតផ្សេងៗ', theme: 'school', school: K.info.school, school2: K.info.school2, school3: K.info.school3,
             teacher: K.info.teacher, slides: slides };
  }

  // ថ្នាក់ទី១១ ជំពូកទី១ មេរៀនទី៥ ទំនាក់ទំនងតួនៃស៊ីត — book pages 36–43
  function recurrence(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, rows = K.rows;
    var sec = function (text, y) { return title(text, { x: 60, y: y, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី១==        មេរៀនទី៥', 'ទំនាក់ទំនងតួនៃស៊ីត', K.info),
      /* 2 */ K.toc(['==១.កំណត់តួទី n ដោយប្រើស៊ីតជំនួយ==', '២.ទំនាក់ទំនងរវាង an និង Sn', R`៣.ទម្រង់ $a_{n+2} + pa_{n+1} + qa_n = 0$`], 46),
      /* 3 */ S.objective([R`កំណត់តួទី $n$ ដោយប្រើស៊ីតជំនួយ $(r_n)$`, R`កំណត់តួទី $n$ តាមទំនាក់ទំនងរវាង $a_n$ និង $S_n$`, R`ដោះស្រាយសមីការសម្គាល់នៃទំនាក់ទំនងលំដាប់ ២`]),

      /* 4 review */ page([
        sec('រំលឹកមេរៀនចាស់'),
        l(60, 165, 1100, '!!__ទំនាក់ទំនងតួដែលបានរៀន ៖__!!', { size: 28 }),
        s(100, 226, 1000, R`• !!ស៊ីតនព្វន្ត ៖!!   $a_{n+1} = a_n + d$   ($d$ ជាផលសងរួម)`),
        s(100, 280, 1000, R`• !!ស៊ីតធរណីមាត្រ ៖!!   $a_{n+1} = a_n \times q$   ($q$ ជាផលធៀបរួម)`),
        s(60, 356, 1100, R`!!__សំណួរ ៖__!!  ចុះបើ  $a_{n+1} = 1 + 4a_n$  ឬ  $a_{n+1} = 2a_n - n + 1$  វិញ?`, { size: 28 }),
        s(100, 416, 1000, 'មិនមែនជានព្វន្តសុទ្ធ ក៏មិនមែនជាធរណីមាត្រសុទ្ធ → ហៅថា !!ទំនាក់ទំនងកំណើននៃស៊ីត!!'),
        S.box(100, 490, 1000, 96, 'គោលដៅ ៖ រកវិធីបំប្លែងទំនាក់ទំនងកំណើន ឱ្យទៅជាស៊ីតធរណីមាត្រ ឬស៊ីតនព្វន្ត ដើម្បីរកតួទី $n$ ។', { size: 26, anim: true }),
        kids()
      ]),

      /* 5 section 1 setup */ page([
        sec('១. កំណត់តួទី n ដោយប្រើស៊ីតជំនួយ'),
        tip(60, 160, 1180, 70, R`ចំពោះទំនាក់ទំនងកំណើនទម្រង់  $a_{n+1} = p a_n + q$  គេអាចរកតួទី $n$ តាម ៣ របៀប ៖`, { size: 24 }),
        l(60, 250, 1100, R`!!__លំហាត់គំរូ ១ ៖__!!  កំណត់តួទូទៅនៃ $(a_n)$ ដោយ  $a_1 = 1,\ a_{n+1} = 1 + 4a_n$`, { size: 27 }),
        title('របៀបទី ១ ៖ ពិនិត្យលំនាំគំរូតួដំបូងៗ', { x: 80, y: 310, size: 25, color: 'head' }),
        s(120, 360, 1000, R`$a_1 = 1$`),
        s(120, 404, 1000, R`$a_2 = 1 + 4a_1 = 1 + 4$`),
        s(120, 448, 1000, R`$a_3 = 1 + 4a_2 = 1 + 4(1 + 4) = 1 + 4 + 4^2$`),
        s(120, 492, 1000, R`$a_4 = 1 + 4a_3 = 1 + 4 + 4^2 + 4^3$`),
        s(120, 540, 1000, R`$\Rightarrow\ a_n = 1 + 4 + 4^2 + \ldots + 4^{n-1} = \dfrac{1(4^n - 1)}{4 - 1} = \dfrac{4^n - 1}{3}$`, { h: 64 }),
        S.box(780, 380, 440, 110, R`ផលបូក $n$ តួនៃ !!ស៊ីតធរណីមាត្រ!!  $a_1 = 1,\ q = 4$`, { size: 22, anim: true })
      ]),

      /* 6 example 1: method 2 */ page([
        sec('លំហាត់គំរូ ១ (ត) — របៀបទី ២'),
        title('របៀបទី ២ ៖ ប្រើផលសងលំដាប់ទី ១', { x: 80, y: 160, size: 26, color: 'head' }),
        l(80, 215, 1100, R`គេមាន  $a_{n+1} = 1 + 4a_n$  និង  $a_n = 1 + 4a_{n-1}$   ($n \ge 2$) ៖`, { size: 25 }),
        s(120, 270, 1000, R`ដកសមីការទាំងពីរ ៖   $a_{n+1} - a_n = 4(a_n - a_{n-1})$`),
        s(120, 324, 1000, R`តាង $b_n = a_{n+1} - a_n \Rightarrow b_n = 4b_{n-1}$  ជាស៊ីតធរណីមាត្រ  $q = 4$`),
        s(120, 376, 1000, R`$b_1 = a_2 - a_1 = 5 - 1 = 4 \Rightarrow b_n = 4 \times 4^{n-1} = 4^n$`),
        s(80, 436, 1100, R`តាមរូបមន្តផលសង ៖   $a_n = a_1 + \displaystyle\sum_{k=1}^{n-1} 4^k = 1 + \dfrac{4(4^{n-1} - 1)}{4 - 1} = \dfrac{4^n - 1}{3}$`, { h: 72 }),
        S.box(200, 530, 800, 80, R`!!ដូចនេះ!!   $a_n = \dfrac{4^n - 1}{3}$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 7 example 1: method 3 (auxiliary) */ page([
        sec('លំហាត់គំរូ ១ (ត) — របៀបទី ៣'),
        title('របៀបទី ៣ ៖ ប្រើស៊ីតជំនួយ (Auxiliary Sequence)', { x: 80, y: 160, size: 26, color: 'head' }),
        l(80, 215, 1100, R`តាងចំនួនថេរ $c$ ដែល  $a_{n+1} - c = 4(a_n - c) \iff a_{n+1} = 4a_n - 3c$`, { size: 25 }),
        s(120, 270, 1000, R`ផ្ទឹមនឹង  $a_{n+1} = 4a_n + 1 \Rightarrow -3c = 1 \Rightarrow c = -\dfrac{1}{3}$`),
        s(120, 330, 1000, R`គេបាន ៖   $a_{n+1} + \dfrac{1}{3} = 4\left(a_n + \dfrac{1}{3}\right)$`),
        s(120, 386, 1000, R`តាង  $V_n = a_n + \dfrac{1}{3} \Rightarrow V_{n+1} = 4V_n$  ជាស៊ីតធរណីមាត្រ  $q = 4$`),
        s(120, 442, 1000, R`$V_1 = a_1 + \dfrac{1}{3} = 1 + \dfrac{1}{3} = \dfrac{4}{3} \Rightarrow V_n = \dfrac{4}{3} \times 4^{n-1} = \dfrac{4^n}{3}$`),
        S.box(160, 520, 860, 80, R`$\Rightarrow\ a_n = V_n - \dfrac{1}{3} = \dfrac{4^n - 1}{3}$`, { size: 30, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 8 general note for auxiliary sequence */ page([
        title('ជាទូទៅ — របៀបរកស៊ីតជំនួយ', { x: 60, size: 32, color: 'head' }),
        S.box(60, 160, 1180, 240, R`!!__១. ទម្រង់ $a_{n+1} = p a_n + q$  ($p \ne 1$) ៖__!!
តាងចំនួនថេរ $c$ ដែល  $a_{n+1} - c = p(a_n - c)$  នោះ  $c = \dfrac{q}{1 - p}$ ។
ស៊ីតជំនួយ $V_n = a_n - c$ ជាស៊ីតធរណីមាត្រមានផលធៀបរួម $p$ ៖  $V_n = V_1 \cdot p^{n-1}$ ។

!!__២. ទម្រង់ $a_{n+1} = p a_n + f(n)$  (មានកន្សោមអថេរ $n$) ៖__!!
គេតាងស៊ីតជំនួយ $r_n = \alpha n + \beta$ រួចជំនួសចូលសមីការដើម្បីរក $\alpha, \beta$ ។`, { size: 23, lh: '1.5' }),
        tip(60, 430, 1180, 90, R`!!គន្លឹះ ៖!! គោលបំណងនៃស៊ីតជំនួយ គឺបំប្លែងសមីការកំណើនទៅជាទម្រង់ស៊ីតធរណីមាត្រ  $V_{n+1} = p\,V_n$  ដែលងាយស្រួលរកតួទី $n$ ។`, { size: 23, anim: true }),
        kids()
      ]),

      /* 9 worked example 2: linear f(n) */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ២ ៖__!!  គេឱ្យស៊ីត $(a_n)$ ដោយ  $a_1 = 3,\ a_{n+1} = 2a_n - n + 1$ ។ រក $a_n$ ។`, { size: 27 }),
        K.solTitle(440, 160),
        s(60, 226, 1180, R`តាងស៊ីតជំនួយ  $r_n = \alpha n + \beta$  ផ្ទៀងផ្ទាត់  $r_{n+1} = 2r_n - n + 1$ ៖`),
        s(100, 276, 1080, R`$\alpha(n+1) + \beta = 2(\alpha n + \beta) - n + 1 \iff (\alpha - 1)n + (\beta - \alpha + 1) = 0$`),
        s(100, 332, 1080, R`$\Rightarrow\ \begin{cases} \alpha - 1 = 0\\ \beta - \alpha + 1 = 0 \end{cases} \iff \alpha = 1,\ \beta = 0 \Rightarrow r_n = n$`),
        s(60, 400, 1180, R`ដកសមីការ ៖   $a_{n+1} - (n+1) = 2(a_n - n)$`),
        s(100, 452, 1080, R`តាង  $V_n = a_n - n \Rightarrow V_{n+1} = 2V_n$  ជាស៊ីតធរណីមាត្រ  $V_1 = a_1 - 1 = 2 \Rightarrow V_n = 2^n$`),
        S.box(200, 526, 800, 80, R`!!ដូចនេះ!!   $a_n = V_n + n = 2^n + n$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 10 practice */ page([
        sec('ប្រតិបត្តិ'),
        l(80, 190, 1100, R`កំណត់តួទី $n$ នៃស៊ីត $(a_n)$ កំណត់ដោយ  $a_1 = 5,\ a_n = 2a_{n-1} - n$  ($n \ge 2$)`, { size: 28 }),
        s(120, 280, 1100, R`តាង  $r_n = \alpha n + \beta \Rightarrow \alpha n + \beta = 2[\alpha(n-1) + \beta] - n$`, { size: 25 }),
        s(120, 340, 1100, R`$\Rightarrow\ \alpha = 1,\ \beta = 2 \Rightarrow r_n = n + 2$`),
        s(120, 400, 1100, R`$a_n + n + 2 = 2[a_{n-1} + (n-1) + 2] \Rightarrow V_n = a_n + n + 2$  មាន  $V_1 = 5 + 3 = 8$`),
        S.box(260, 480, 680, 80, R`!!ចម្លើយ ៖!!   $a_n = 2^n + (n + 2)$`, { size: 32, align: 'center', anim: true }),
        kids()
      ]),

      /* 11 section 2 */ page([
        sec(R`២. ទំនាក់ទំនងរវាង $a_n$ និង $S_n$`),
        tip(60, 160, 1180, 86, R`ផលបូក $n$ តួដំបូងគឺ  $S_n = a_1 + a_2 + \ldots + a_{n-1} + a_n$  និង  $S_{n-1} = a_1 + a_2 + \ldots + a_{n-1}$ ។`, { size: 24 }),
        S.box(60, 270, 1180, 130, R`!!__រូបមន្តគ្រឹះ ៖__!!
$$a_n = S_n - S_{n-1} \quad (n \ge 2) \qquad \text{និង} \qquad a_1 = S_1$$`, { size: 28, align: 'center' }),
        l(60, 424, 1100, R`!!__ឧទាហរណ៍ ៖__!!  គេមាន  $S_n = n^2 + n$ ។ រកតួទី $n$ នៃស៊ីត $(a_n)$ ៖`, { size: 26 }),
        s(120, 480, 650, R`$S_{n-1} = (n - 1)^2 + (n - 1) = n^2 - n$`),
        s(120, 536, 650, R`$a_n = S_n - S_{n-1} = (n^2 + n) - (n^2 - n) = 2n$`),
        s(120, 588, 650, R`(ផ្ទៀងផ្ទាត់  $a_1 = S_1 = 1^2 + 1 = 2$  ពិត)`),
        S.box(800, 510, 420, 76, R`$a_n = 2n$   (ស៊ីតចំនួនគូ)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 12 worked example Sn */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ៖__!!  គេមាន  $S_n = n^3 + 2n$ ។ កំណត់តួទី $n$ នៃស៊ីត $(a_n)$ ៖`, { size: 27 }),
        K.solTitle(440, 160),
        s(60, 226, 1180, R`ចំពោះ $n \ge 2$ ៖   $S_{n-1} = (n - 1)^3 + 2(n - 1) = n^3 - 3n^2 + 5n - 3$`),
        s(60, 290, 1180, R`$a_n = S_n - S_{n-1} = (n^3 + 2n) - (n^3 - 3n^2 + 5n - 3)$`),
        s(160, 350, 1000, R`$= 3n^2 - 3n + 3$`),
        s(60, 420, 1180, R`ចំពោះ $n = 1$ ៖   $a_1 = 3(1)^2 - 3(1) + 3 = 3$  ហើយ  $S_1 = 1^3 + 2(1) = 3$  (ពិត)`),
        S.box(160, 500, 860, 80, R`!!ដូចនេះ!!   $a_n = 3n^2 - 3n + 3$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 13 practice Sn */ page([
        sec('ប្រតិបត្តិ — ទំនាក់ទំនង Sn'),
        l(60, 160, 1180, R`គេមាន  $S_n = 4 - a_n - \dfrac{1}{2^{n-2}}$  ជាផលបូក $n$ តួដំបូងនៃ $(a_n)$ ៖`, { size: 25 }),
        s(60, 226, 1180, R`!!ក.!!  $S_n - S_{n-1} = a_n \iff (4 - a_n - 2^{2-n}) - (4 - a_{n-1} - 2^{3-n}) = a_n$`),
        s(120, 280, 1060, R`$\iff 2a_n = a_{n-1} + 2^{2-n} \Rightarrow 2a_{n+1} = a_n + \dfrac{1}{2^{n-1}}$`, { h: 60 }),
        s(60, 360, 1180, R`!!ខ.!!  គុណនឹង $2^n$ ៖   $2^{n+1} a_{n+1} = 2^n a_n + 2$`),
        s(120, 416, 1060, R`តាង $U_n = 2^n a_n \Rightarrow U_{n+1} = U_n + 2$  ជាស៊ីតនព្វន្ត  $d = 2,\ U_1 = 2a_1 = 2$`),
        s(120, 474, 1060, R`$U_n = 2 + 2(n - 1) = 2n \Rightarrow 2^n a_n = 2n$`),
        S.box(260, 536, 680, 76, R`!!ចម្លើយ ៖!!   $a_n = \dfrac{2n}{2^n} = \dfrac{n}{2^{n-1}}$`, { size: 28, align: 'center', anim: true }),
        kids()
      ]),

      /* 14-16 quizzes */
      S.quiz(R`!!១.!! បើ $a_1 = 1,\ a_{n+1} = 2a_n + 1$ នោះតួទី $n$ គឺ ៖`, [R`$a_n = 2^n$`, R`$a_n = 2^n - 1$`, R`$a_n = 2^{n-1}$`, R`$a_n = 2n + 1$`], 1),
      S.quiz(R`!!២.!! ទំនាក់ទំនងរវាង $a_n$ និង $S_n$ គឺ ៖`, [R`$a_n = S_n + S_{n-1}$`, R`$a_n = S_n \times S_{n-1}$`, R`$a_n = S_n - S_{n-1}$`, R`$a_n = \frac{S_n}{n}$`], 2),
      S.quiz(R`!!៣.!! បើ $S_n = 3n^2$ នោះតួទី $n$ គឺ ៖`, [R`$a_n = 6n - 3$`, R`$a_n = 6n$`, R`$a_n = 3n$`, R`$a_n = 6n + 3$`], 0),

      /* 17 homework 1 */ S.homework(R`!!១.!! ស៊ីត $(a_n)$ ៖ $a_1 = 3,\ a_{n+1} = 2a_n - 4$ ។ គណនាតួទី $4$ ។
!!២.!! គេមាន $S_n = 2n^2 + 5n$ ។ រកតួទី $n$ នៃស៊ីត $(a_n)$ ។
!!៣.!! រកតួទូទៅនៃស៊ីត $a_1 = 1,\ 3a_{n+1} = 2a_n + 3$ ។`),

      /* ===== part 2: second order recurrences ===== */
      /* 18 */ K.toc([R`==៣.ទម្រង់ $a_{n+2} + pa_{n+1} + qa_n = 0$==`, '៣.១.សមីការសម្គាល់', '៣.២.លំហាត់អនុវត្តន៍'], 46),
      /* 19 */ S.objective(['កំណត់សមីការសម្គាល់នៃទំនាក់ទំនងលំដាប់ ២', 'ដោះស្រាយរកតួទី n នៃស៊ីតតាមឫសនៃសមីការសម្គាល់']),

      /* 20 homework 1 answers */ page([
        sec('កំណែកិច្ចការផ្ទះ ១'),
        s(60, 160, 1180, R`!!១.!!  $a_1 = 3 \Rightarrow a_2 = 2(3) - 4 = 2 \Rightarrow a_3 = 2(2) - 4 = 0 \Rightarrow a_4 = 2(0) - 4 = -4$`),
        s(60, 240, 1180, R`!!២.!!  $S_n = 2n^2 + 5n \Rightarrow a_n = S_n - S_{n-1} = (2n^2 + 5n) - [2(n-1)^2 + 5(n-1)] = 4n + 3$`),
        s(60, 320, 1180, R`!!៣.!!  $a_{n+1} = \dfrac{2}{3}a_n + 1 \Rightarrow c = \dfrac{1}{1 - 2/3} = 3 \Rightarrow a_{n+1} - 3 = \dfrac{2}{3}(a_n - 3)$`),
        s(120, 390, 1000, R`$V_n = a_n - 3 \Rightarrow V_n = (a_1 - 3)\left(\dfrac{2}{3}\right)^{n-1} = -2\left(\dfrac{2}{3}\right)^{n-1}$`),
        S.box(200, 480, 800, 80, R`!!ចម្លើយ ៖!!   $a_n = 3 - 2\left(\dfrac{2}{3}\right)^{n-1}$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 21 section 3 setup */ page([
        sec(R`៣. ទំនាក់ទំនងតួ $a_{n+2} + pa_{n+1} + qa_n = 0$`),
        tip(60, 155, 1180, 70, R`នេះជាទំនាក់ទំនងលីនេអ៊ែរលំដាប់ ២ អូម៉ូសែន មានមេគុណថេរ $p, q$ ។`, { size: 24 }),
        l(60, 250, 1100, R`!!__ឧទាហរណ៍ ៖__!!  គេមាន  $a_1 = 1,\ a_2 = 3,\ a_{n+2} = 3a_{n+1} - 2a_n$`, { size: 26 }),
        s(100, 310, 1000, R`$a_3 = 3(3) - 2(1) = 7$`),
        s(100, 360, 1000, R`$a_4 = 3(7) - 2(3) = 15$`),
        s(100, 410, 1000, R`$a_5 = 3(15) - 2(7) = 31$`),
        s(100, 460, 1000, R`$a_6 = 3(31) - 2(15) = 63$`),
        s(60, 520, 1180, R`ផលសង ៖  $a_2 - a_1 = 2,\ a_3 - a_2 = 4,\ a_4 - a_3 = 8,\ \ldots\ \Rightarrow\ a_n = 2^n - 1$`),
        kids(1100, 526, 150)
      ]),

      /* 22 characteristic equation method */ page([
        title('សមីការសម្គាល់ (Characteristic Equation)', { x: 60, size: 30, color: 'head' }),
        S.box(60, 160, 1180, 280, R`ចំពោះទំនាក់ទំនង  $a_{n+2} + pa_{n+1} + qa_n = 0$ ៖
សមីការដឺក្រេទី ២  !!$x^2 + px + q = 0$!!  ហៅថា !!សមីការសម្គាល់!! ។
បើ $\alpha$ និង $\beta$ ជាឫសទាំងពីរនៃសមីការ នោះ $\alpha + \beta = -p$ និង $\alpha\beta = q$ ។
គេអាចសរសេរជា ២ ប្រព័ន្ធស៊ីតធរណីមាត្រ ៖
$$\begin{cases} a_{n+2} - \alpha a_{n+1} = \beta(a_{n+1} - \alpha a_n)\\ a_{n+2} - \beta a_{n+1} = \alpha(a_{n+1} - \beta a_n) \end{cases}$$`, { size: 24, lh: '1.5' }),
        tip(60, 470, 1180, 80, R`!!គន្លឹះ ៖!! តាមរយៈសមីការទាំងពីរ យើងទទួលបាន ២ ស៊ីតធរណីមាត្រ រួចធ្វើផលដកដើម្បីបំបាត់ $a_{n+1}$ និងទាញរក $a_n$ !`, { size: 22, anim: true }),
        kids()
      ]),

      /* 23 worked example: 2 distinct roots */ page([
        l(60, 100, 1100, R`!!__លំហាត់គំរូ ៖__!!  $a_1 = 1,\ a_2 = 13,\ a_{n+2} = a_{n+1} + 6a_n$ ។ កំណត់តួទី $n$ ។`, { size: 27 }),
        K.solTitle(440, 160),
        s(60, 226, 1180, R`សរសេរជា ៖   $a_{n+2} - a_{n+1} - 6a_n = 0$`),
        s(60, 280, 1180, R`សមីការសម្គាល់ ៖   $x^2 - x - 6 = 0 \iff (x - 3)(x + 2) = 0 \iff \alpha = 3,\ \beta = -2$`),
        s(60, 350, 1180, R`គេបាន ២ ស៊ីតធរណីមាត្រ ៖`),
        s(100, 400, 1000, R`$(1)\ a_{n+1} + 2a_n = 3(a_n + 2a_{n-1}) \Rightarrow a_{n+1} + 2a_n = (a_2 + 2a_1) \cdot 3^{n-1} = 15 \cdot 3^{n-1}$`),
        s(100, 460, 1000, R`$(2)\ a_{n+1} - 3a_n = -2(a_n - 3a_{n-1}) \Rightarrow a_{n+1} - 3a_n = (a_2 - 3a_1) \cdot (-2)^{n-1} = 10 \cdot (-2)^{n-1}$`),
        kids(1100, 526, 150)
      ]),

      /* 24 worked example: solving an */ page([
        sec('លំហាត់គំរូ (ត) — រកតួ an'),
        l(80, 160, 1100, R`យកសមីការ $(1)$ ដកសមីការ $(2)$ ៖`, { size: 26 }),
        s(120, 220, 1000, R`$(a_{n+1} + 2a_n) - (a_{n+1} - 3a_n) = 15 \cdot 3^{n-1} - 10 \cdot (-2)^{n-1}$`),
        s(120, 280, 1000, R`$5a_n = 5 \times 3 \cdot 3^{n-1} + 5 \times 2 \cdot (-2) \cdot (-2)^{n-2}$`),
        s(120, 340, 1000, R`$5a_n = 5 \cdot 3^n - 5 \cdot (-2) \cdot (-2)^{n-1} = 5 \cdot 3^n + 5 \cdot (-2)^n$`),
        s(120, 410, 1000, R`ចែកនឹង $5$ ៖   $a_n = 3^n + (-2)^n$`),
        S.box(160, 490, 860, 80, R`!!ដូចនេះ!!   $a_n = 3^n + (-2)^n$`, { size: 30, align: 'center', anim: true }),
        tip(160, 590, 860, 60, R`!!ផ្ទៀងផ្ទាត់ ៖!!  $a_1 = 3 - 2 = 1$ ✓  ;  $a_2 = 9 + 4 = 13$ ✓`, { size: 22, anim: true })
      ]),

      /* 25 practice characteristic */ page([
        sec('ប្រតិបត្តិ'),
        l(80, 190, 1100, R`ស៊ីត $(a_n)$ កំណត់ដោយ  $a_1 = 0,\ a_2 = 3,\ a_{n+2} = 4a_{n+1} - 3a_n$ ។ កំណត់តួទី $n$ ។`, { size: 27 }),
        s(120, 270, 1000, R`សមីការសម្គាល់ ៖  $x^2 - 4x + 3 = 0 \iff x = 1$  ឬ  $x = 3$`),
        s(120, 330, 1000, R`$a_{n+1} - a_n = 3(a_n - a_{n-1}) \Rightarrow a_{n+1} - a_n = (3 - 0) \cdot 3^{n-1} = 3^n$`),
        s(120, 390, 1000, R`$a_{n+1} - 3a_n = 1 \cdot (a_n - 3a_{n-1}) = a_2 - 3a_1 = 3$`),
        s(120, 450, 1000, R`ដកសមីការទាំងពីរ ៖   $2a_n = 3^n - 3 \Rightarrow a_n = \dfrac{3^n - 3}{2}$`),
        S.box(260, 520, 680, 80, R`!!ចម្លើយ ៖!!   $a_n = \dfrac{3^n - 3}{2}$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 26 textbook exercise 2: fibonacci */ page([
        sec('លំហាត់អនុវត្តន៍ទី ២ — ស៊ីត ហ្វីបូណាស៊ី'),
        l(60, 160, 1180, R`ស៊ីត $(a_n)$ កំណត់ដោយ  $a_1 = 1,\ a_2 = 2,\ a_{n+2} = a_{n+1} + a_n$ ។ កំណត់តួទី $7$ ។`, { size: 26 }),
        s(100, 230, 1000, R`$a_3 = a_2 + a_1 = 2 + 1 = 3$`),
        s(100, 280, 1000, R`$a_4 = a_3 + a_2 = 3 + 2 = 5$`),
        s(100, 330, 1000, R`$a_5 = a_4 + a_3 = 5 + 3 = 8$`),
        s(100, 380, 1000, R`$a_6 = a_5 + a_4 = 8 + 5 = 13$`),
        s(100, 430, 1000, R`$a_7 = a_6 + a_5 = 13 + 8 = 21$`),
        S.box(260, 500, 680, 80, R`!!ដូចនេះ!!   $a_7 = 21$`, { size: 32, align: 'center', anim: true }),
        kids()
      ]),

      /* 27 textbook exercise 4 */ page([
        sec('លំហាត់អនុវត្តន៍ទី ៤'),
      ].concat(rows([
        { q: R`ក. $a_1 = 1,\ 3a_{n+1} = 2a_n + 3$`, a: R`$a_n = 3 - 2\left(\frac{2}{3}\right)^{n-1}$` },
        { q: R`ខ. $a_1 = 1,\ 3a_{n+1} = 3a_n + 4 \iff a_{n+1} - a_n = \frac{4}{3}$`, a: R`$a_n = 1 + \frac{4}{3}(n-1) = \frac{4n-1}{3}$` },
        { q: R`គ. $a_1 = 1,\ a_{n+1} = a_n + n$ (ផលសងជានព្វន្ត)`, a: R`$a_n = 1 + \frac{n(n-1)}{2} = \frac{n^2-n+2}{2}$` }
      ], { y: 180, h: 96, gap: 130, size: 24, ansSize: 22 }))),

      /* 28 textbook exercise 5: fraction */ page([
        sec('លំហាត់អនុវត្តន៍ទី ៥ — ស៊ីតប្រភាគ'),
        l(60, 150, 1180, R`គេមាន  $a_1 = 4,\ a_{n+1} = \dfrac{4a_n - 9}{a_n - 2}$ ។ តាង  $b_n = \dfrac{1}{a_n - 3}$ ៖`, { size: 25 }),
        s(60, 220, 1180, R`$a_{n+1} - 3 = \dfrac{4a_n - 9 - 3(a_n - 2)}{a_n - 2} = \dfrac{a_n - 3}{a_n - 2}$`),
        s(60, 290, 1180, R`$\Rightarrow\ b_{n+1} = \dfrac{1}{a_{n+1} - 3} = \dfrac{a_n - 2}{a_n - 3} = \dfrac{a_n - 3 + 1}{a_n - 3} = 1 + b_n$`),
        s(60, 360, 1180, R`$\Rightarrow\ b_{n+1} - b_n = 1$  ជាស៊ីតនព្វន្ត  $d = 1,\ b_1 = \dfrac{1}{4 - 3} = 1 \Rightarrow b_n = n$`),
        s(60, 430, 1180, R`$\Rightarrow\ a_n - 3 = \dfrac{1}{b_n} = \dfrac{1}{n} \Rightarrow a_n = 3 + \dfrac{1}{n} = \dfrac{3n + 1}{n}$`),
        S.box(260, 510, 680, 80, R`!!ដូចនេះ!!   $a_n = \dfrac{3n + 1}{n}$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 29 textbook exercise 9: inversion */ page([
        sec('លំហាត់អនុវត្តន៍ទី ៩ — ចម្រាសនៃស៊ីត'),
        l(60, 150, 1180, R`គេមាន  $a_1 = 2,\ a_{n+1} = \dfrac{a_n}{a_n + 3}$ ។ តាង  $b_n = \dfrac{1}{a_n}$ ៖`, { size: 25 }),
        s(60, 220, 1180, R`$b_{n+1} = \dfrac{1}{a_{n+1}} = \dfrac{a_n + 3}{a_n} = 1 + \dfrac{3}{a_n} = 3b_n + 1$`),
        s(60, 290, 1180, R`$b_{n+1} + \dfrac{1}{2} = 3\left(b_n + \dfrac{1}{2}\right) \Rightarrow V_n = b_n + \dfrac{1}{2}$  ជាស៊ីតធរណីមាត្រ  $q = 3$`),
        s(60, 360, 1180, R`$V_1 = b_1 + \dfrac{1}{2} = \dfrac{1}{2} + \dfrac{1}{2} = 1 \Rightarrow V_n = 3^{n-1} \Rightarrow b_n = 3^{n-1} - \dfrac{1}{2} = \dfrac{2 \cdot 3^{n-1} - 1}{2}$`),
        S.box(260, 480, 680, 80, R`!!ដូចនេះ!!   $a_n = \dfrac{1}{b_n} = \dfrac{2}{2 \cdot 3^{n-1} - 1}$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 30 summary */ page([
        sec('សង្ខេបមេរៀនទី ៥ — ទំនាក់ទំនងតួនៃស៊ីត'),
        S.box(60, 160, 1180, 430, R`!!__១. ទំនាក់ទំនងលំដាប់ ១__ ៖
• $a_{n+1} = p a_n + q \Rightarrow a_{n+1} - c = p(a_n - c)$  ដោយ  $c = \dfrac{q}{1 - p}$
• $a_{n+1} = p a_n + \alpha n + \beta \Rightarrow$ ប្រើស៊ីតជំនួយ $r_n = A n + B$
!!__២. ទំនាក់ទំនងរវាង $a_n$ និង $S_n$__ ៖
• $a_n = S_n - S_{n-1}$  ($n \ge 2$)  និង  $a_1 = S_1$
!!__៣. ទំនាក់ទំនងលំដាប់ ២__ ៖
• $a_{n+2} + pa_{n+1} + qa_n = 0 \Rightarrow$ ដោះស្រាយសមីការសម្គាល់ $x^2 + px + q = 0$
  ឫស $\alpha, \beta \Rightarrow \begin{cases} a_{n+1} - \alpha a_n = (a_2 - \alpha a_1)\beta^{n-1}\\ a_{n+1} - \beta a_n = (a_2 - \beta a_1)\alpha^{n-1} \end{cases}$ រួចដកសមីការរក $a_n$ ។`, { size: 22, lh: '1.5' }),
        kids(1100, 526, 150)
      ]),

      /* 31 homework 2 */ S.homework(R`!!១.!! ដោះស្រាយទំនាក់ទំនង $a_1 = 1,\ a_2 = 5,\ a_{n+2} = 5a_{n+1} - 6a_n$ ។
!!២.!! គេមាន $S_n = 3n^2 - n$ ។ កំណត់តួទី $n$ នៃស៊ីត $(a_n)$ ។
!!៣.!! គេមាន $a_1 = 1,\ a_{n+1} = \dfrac{2a_n}{a_n + 2}$ ។ រកតួទី $n$ នៃស៊ីត $(a_n)$ ។`),

      /* 32 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · មេរៀនទី៥ ទំនាក់ទំនងតួនៃស៊ីត',
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 5,
      lesson: 'មេរៀនទី ៥ ៖ ទំនាក់ទំនងតួនៃស៊ីត',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 2 },
        { title: '១. ទំនាក់ទំនងលំដាប់ ១', slide: 4 },
        { title: '២. ទំនាក់ទំនងរវាង an និង Sn', slide: 9 },
        { title: '៣. ទំនាក់ទំនងលំដាប់ ២ (សមីការសម្គាល់)', slide: 19 },
        { title: '៤. លំហាត់សៀវភៅពុម្ព & កិច្ចការផ្ទះ', slide: 24 }
      ],
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      slides: slides
    };
  }

  // ថ្នាក់ទី១១ ជំពូកទី១ មេរៀនទី៦ វិចារអនុមានរួមគណិតវិទ្យា — book pages 44–56
  function induction(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, expGraph = K.expGraph, logGraph = K.logGraph;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី១==        មេរៀនទី៦', 'វិចារអនុមានរួមគណិតវិទ្យា', K.info),

      /* 2 */ K.toc([
        '==១.គោលការណ៍នៃវិចារអនុមានរួម==',
        '២.ស្រាយបញ្ជាក់សមភាពផលបូក',
        '៣.ស្រាយបញ្ជាក់វិសមភាព',
        '៤.ស្រាយបញ្ជាក់ភាពចែកដាច់',
        '==៥.ត្រីកោណប៉ាស្កាល់ & ទ្វេធាញូតុន==',
        '៦.លំហាត់អនុវត្តន៍ & កិច្ចការផ្ទះ'
      ], 38),

      /* 3 */ S.objective([
        R`យល់ច្បាស់ពីគោលការណ៍ ៣ ជំហាននៃវិចារអនុមានរួមគណិតវិទ្យា`,
        R`ចេះស្រាយបញ្ជាក់សមភាពផលបូក វិសមភាព និងភាពចែកដាច់ចំពោះគ្រប់ $n \in \mathbb{N}$`,
        R`ចេះប្រើត្រីកោណប៉ាស្កាល់ និងទ្រឹស្តីបទទ្វេធាញូតុនក្នុងការពន្លាតកន្សោម $(x+y)^n$ និងរកតួទី $r+1$`
      ]),

      /* 4 intro discovery */ page([
        sec('១. សេចក្តីផ្តើម — ស្វែងយល់លំនាំគំរូ'),
        l(60, 160, 1180, 'ពិនិត្យផលបូកនៃចំនួនគត់សេសបន្តបន្ទាប់គ្នា ៖', { size: 28 }),
        s(100, 220, 1000, R`• ផលបូក ១ តួ ៖   $P(1) = 1 = 1^2$`),
        s(100, 275, 1000, R`• ផលបូក ២ តួ ៖   $P(2) = 1 + 3 = 4 = 2^2$`),
        s(100, 330, 1000, R`• ផលបូក ៣ តួ ៖   $P(3) = 1 + 3 + 5 = 9 = 3^2$`),
        s(100, 385, 1000, R`• ផលបូក ៤ តួ ៖   $P(4) = 1 + 3 + 5 + 7 = 16 = 4^2$`),
        s(60, 455, 1180, R`!!__ការទាញសន្និដ្ឋាន__ ៖  តើផលបូក $n$ តួសេសដំបូងគឺ   $1 + 3 + 5 + \ldots + (2n - 1) = n^2$   ពិតគ្រប់ $n$ ឬទេ?`, { size: 26, color: 'head' }),
        S.box(60, 525, 880, 85, R`ដើម្បីបញ្ជាក់ថារូបមន្តនេះពិតចំពោះគ្រប់ $n \in \mathbb{N}$ គេត្រូវប្រើ «វិចារអនុមានរួមគណិតវិទ្យា» ។`, { size: 25, align: 'center', anim: true }),
        kids()
      ]),

      /* 5 domino analogy */ page([
        sec('១. គំរូប្រៀបធៀបបន្ទះដូមីណូ (Domino Effect)'),
        tip(60, 160, 1180, 80, 'វិចារអនុមានរួម ដូចគ្នានឹងការដួលរលំនៃបន្ទះដូមីណូជាបន្តបន្ទាប់គ្មានទីបញ្ចប់ ៖', { size: 25 }),
        s(100, 265, 1080, R`!!ជំហានទី ១ (ផ្ដើមទម្លាក់) ៖!!  បន្ទះទី ១ ត្រូវបានរុញឲ្យដួល ($P(1)$ ពិត)`),
        s(100, 335, 1080, R`!!ជំហានទី ២ (សន្មត) ៖!!  ឧបមាថាបន្ទះទី $k$ ណាមួយដួល ($P(k)$ ពិត)`),
        s(100, 405, 1080, R`!!ជំហានទី ៣ (បញ្ជាក់ការបន្ត) ៖!!  បន្ទះទី $k$ ដួល នឹងទៅរុញបន្ទះបន្ទាប់ទី $k+1$ ឲ្យដួល ($P(k+1)$ ពិត)`),
        S.box(100, 490, 1080, 110, R`!!__សន្និដ្ឋាន__ ៖  ដោយសារបន្ទះទី ១ ដួល ហើយគ្រប់បន្ទះដែលដួលតែងតែរុញបន្ទះបន្ទាប់ឲ្យដួល
$\Rightarrow$ បន្ទះដូមីណូទាំងអស់នឹងត្រូវដួលរលំតៗគ្នារហូតគ្មានទីបញ្ចប់! (ពិតចំពោះគ្រប់ $n \in \mathbb{N}$)`, { size: 23, anim: true })
      ]),

      /* 6 formal principle */ page([
        sec('១. គោលការណ៍នៃវិចារអនុមានរួមគណិតវិទ្យា'),
        l(60, 155, 1180, R`ដើម្បីស្រាយបញ្ជាក់ថាសំណើ $P(n)$ ពិតចំពោះគ្រប់ចំនួនគត់ $n \ge 1$ គេត្រូវអនុវត្ត ៣ ជំហាន ៖`, { size: 26 }),
        card(80, 220, 340, 270, 'ជំហានទី ១ ៖ ផ្ទៀងផ្ទាត់', R`ផ្ទៀងផ្ទាត់ថាសំណើ $P(n)$
ពិតចំពោះ $n = 1$
(ឬតម្លៃដំបូងបំផុត $n_0$) ៖
$P(1)$ ពិត`, { size: 22 }),
        card(470, 220, 340, 270, 'ជំហានទី ២ ៖ សន្មត', R`ឧបមាថាសំណើ $P(n)$
ពិតចំពោះតម្លៃ $n = k$
(សម្មតិកម្មអនុមានរួម) ៖
$P(k)$ ពិត`, { size: 22 }),
        card(860, 220, 340, 270, 'ជំហានទី ៣ ៖ បញ្ជាក់', R`ស្រាយបញ្ជាក់ថា
$P(k)$ ពិត នាំឲ្យបាន
$P(k+1)$ ក៏ពិតដែរ
(បង្ហាញ $P(k+1)$ ពិត)`, { size: 22 }),
        S.box(140, 520, 1000, 80, R`!!សន្និដ្ឋាន!! ៖  សំណើ $P(n)$ ពិតចំពោះគ្រប់ចំនួនគត់ធម្មជាតិ $n \in \mathbb{N}$ ។`, { size: 27, align: 'center', anim: true })
      ]),

      /* 7 sample proof intro problem */ page([
        sec('លំហាត់គំរូ ៖ ស្រាយបញ្ជាក់ផលបូកចំនួនសេស'),
        l(60, 150, 1180, R`ស្រាយបញ្ជាក់ថា  $1 + 3 + 5 + \ldots + (2n - 1) = n^2$   ពិតចំពោះគ្រប់ $n \in \mathbb{N}$ ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`!!• ជំហាន ១ ៖!! ចំពោះ $n = 1$ ៖ អង្គឆ្វេង $= 1$, អង្គស្ដាំ $= 1^2 = 1 \Rightarrow$ សមភាពពិត`),
        s(60, 315, 1180, R`!!• ជំហាន ២ ៖!! ឧបមាថាសមភាពពិតចំពោះ $n = k$ ៖  $1 + 3 + \ldots + (2k - 1) = k^2$`),
        s(60, 370, 1180, R`!!• ជំហាន ៣ ៖!! ស្រាយថាសមភាពពិតចំពោះ $n = k + 1$ ៖  ត្រូវបង្ហាញថា  $\text{LHS} = (k + 1)^2$`),
        s(120, 425, 1060, R`អង្គឆ្វេង $= [1 + 3 + \ldots + (2k - 1)] + [2(k + 1) - 1] = k^2 + (2k + 1) = (k + 1)^2$  ពិត!`),
        S.box(160, 510, 880, 80, R`!!ដូចនេះ!!   $1 + 3 + 5 + \ldots + (2n - 1) = n^2$   ពិតចំពោះគ្រប់ $n \in \mathbb{N}$ ។`, { size: 27, align: 'center', anim: true }),
        kids()
      ]),

      /* 8 section 2: summation proofs */ page([
        sec('២. ការស្រាយបញ្ជាក់សមភាពផលបូក'),
        tip(60, 160, 1180, 80, 'វិធីសាស្ត្រទូទៅ ៖ ក្នុងការបង្ហាញ $P(k+1)$ គេត្រូវបំបែកផលបូក $(k+1)$ តួ ជាផលបូក $k$ តួ បូកនឹងតួទី $k+1$ ៖', { size: 24 }),
        S.box(140, 260, 1000, 90, R`$S_{k+1} = \underbrace{u_1 + u_2 + \ldots + u_k}_{S_k \text{ ជំនួសដោយសម្មតិកម្ម}} + u_{k+1}$`, { size: 28, align: 'center' }),
        l(60, 380, 1180, R`!!__លំហាត់គំរូ ១ (សៀវភៅពុម្ពទំព័រ ៤៥) ៖__!!`, { size: 26 }),
        s(80, 430, 1120, R`ស្រាយបញ្ជាក់ថា   $1 \times 2 + 2 \times 3 + 3 \times 4 + \ldots + n(n + 1) = \dfrac{1}{3}n(n + 1)(n + 2)$`),
        s(80, 485, 1120, R`ពិតចំពោះគ្រប់ $n \in \mathbb{N}$ ដោយប្រើវិចារអនុមានរួមគណិតវិទ្យា ។`, { size: 25 })
      ]),

      /* 9 ex 1 solution part 1 */ page([
        sec('ដំណោះស្រាយលំហាត់គំរូ ១'),
        s(60, 160, 1180, R`!!ជំហានទី ១ ៖!! ផ្ទៀងផ្ទាត់ចំពោះ $n = 1$ ៖`),
        s(120, 215, 1060, R`• អង្គខាងឆ្វេង ៖  $1 \times (1 + 1) = 1 \times 2 = 2$`),
        s(120, 270, 1060, R`• អង្គខាងស្ដាំ ៖  $\dfrac{1}{3} \times 1 \times (1 + 1)(1 + 2) = \dfrac{1 \times 2 \times 3}{3} = 2$`),
        s(120, 325, 1060, R`អង្គខាងឆ្វេង $=$ អង្គខាងស្ដាំ  $\Rightarrow$  សមភាពពិតចំពោះ $n = 1$ ។`),
        s(60, 390, 1180, R`!!ជំហានទី ២ ៖!! ឧបមាថាសមភាពពិតចំពោះ $n = k$ ($k \ge 1$) គឺ ៖`),
        s(120, 445, 1060, R`$1 \times 2 + 2 \times 3 + \ldots + k(k + 1) = \dfrac{1}{3}k(k + 1)(k + 2)$  (សម្មតិកម្មអនុមានរួម)`),
        kids(1100, 526, 150)
      ]),

      /* 10 ex 1 solution part 2 */ page([
        sec('ដំណោះស្រាយលំហាត់គំរូ ១ (ត)'),
        s(60, 150, 1180, R`!!ជំហានទី ៣ ៖!! ស្រាយបញ្ជាក់ថាសមភាពពិតដល់ $n = k + 1$ គឺត្រូវបង្ហាញថា ៖`),
        s(120, 205, 1060, R`$1 \times 2 + \ldots + k(k + 1) + (k + 1)(k + 2) = \dfrac{1}{3}(k + 1)(k + 2)(k + 3)$`),
        s(60, 265, 1180, R`ថែម $(k + 1)(k + 2)$ លើអង្គទាំងពីរនៃសម្មតិកម្ម ៖`),
        s(100, 320, 1080, R`អង្គឆ្វេង $= \dfrac{1}{3}k(k + 1)(k + 2) + (k + 1)(k + 2)$`),
        s(180, 375, 1000, R`$= (k + 1)(k + 2)\left(\dfrac{1}{3}k + 1\right) = (k + 1)(k + 2)\left(\dfrac{k + 3}{3}\right)$`),
        s(180, 435, 1000, R`$= \dfrac{1}{3}(k + 1)(k + 2)(k + 3)$   (ពិត!)`),
        S.box(100, 510, 1080, 80, R`!!ដូចនេះ!!  $1 \times 2 + 2 \times 3 + \ldots + n(n + 1) = \dfrac{1}{3}n(n + 1)(n + 2)$  ពិតគ្រប់ $n \in \mathbb{N}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 11 sum of squares */ page([
        sec('លំហាត់គំរូ ២ ៖ ផលបូកការេនៃចំនួនគត់ធម្មជាតិ'),
        l(60, 150, 1180, R`ស្រាយបញ្ជាក់ថា  $1^2 + 2^2 + 3^2 + \ldots + n^2 = \dfrac{n(n + 1)(2n + 1)}{6}$  ពិតចំពោះគ្រប់ $n \in \mathbb{N}$ ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`!!• ចំពោះ $n = 1$ ៖!!  LHS $= 1^2 = 1$  ;  RHS $= \dfrac{1(1 + 1)(2(1) + 1)}{6} = \dfrac{1 \times 2 \times 3}{6} = 1$  (ពិត)`),
        s(60, 335, 1180, R`!!• ឧបមាថាពិតចំពោះ $n = k$ ៖!!   $1^2 + 2^2 + \ldots + k^2 = \dfrac{k(k + 1)(2k + 1)}{6}$`),
        s(60, 405, 1180, R`!!• ស្រាយថាសមភាពពិតចំពោះ $n = k + 1$ ៖!!  ត្រូវបង្ហាញថា ៖`),
        s(120, 465, 1060, R`$1^2 + 2^2 + \ldots + k^2 + (k + 1)^2 = \dfrac{(k + 1)(k + 2)(2k + 3)}{6}$`),
        kids()
      ]),

      /* 12 sum of squares proof */ page([
        sec('ដំណោះស្រាយលំហាត់គំរូ ២ (ត)'),
        s(60, 155, 1180, R`យើងមានអង្គខាងឆ្វេងចំពោះ $n = k + 1$ ៖`),
        s(120, 215, 1060, R`$\text{LHS} = [1^2 + 2^2 + \ldots + k^2] + (k + 1)^2 = \dfrac{k(k + 1)(2k + 1)}{6} + (k + 1)^2$`),
        s(120, 280, 1060, R`$= (k + 1)\left[ \dfrac{k(2k + 1)}{6} + (k + 1) \right] = (k + 1)\left[ \dfrac{2k^2 + k + 6k + 6}{6} \right]$`),
        s(120, 350, 1060, R`$= (k + 1)\left[ \dfrac{2k^2 + 7k + 6}{6} \right] = \dfrac{(k + 1)(k + 2)(2k + 3)}{6}$  (ពិត!)`),
        S.box(100, 480, 1080, 90, R`!!ដូចនេះ!!   $1^2 + 2^2 + 3^2 + \ldots + n^2 = \dfrac{n(n + 1)(2n + 1)}{6}$
ពិតចំពោះគ្រប់ចំនួនគត់ធម្មជាតិ $n \in \mathbb{N}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 13 sum of powers of 2 */ page([
        sec('លំហាត់គំរូ ៣ ៖ ផលបូកស្វ័យគុណនៃ ២'),
        l(60, 150, 1180, R`ដោយប្រើវិចារអនុមានរួម ស្រាយបញ្ជាក់ថា  $\displaystyle\sum_{k=1}^{n} 2^{k-1} = 1 + 2 + 2^2 + \ldots + 2^{n-1} = 2^n - 1$ ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`!!• ចំពោះ $n = 1$ ៖!!  LHS $= 2^{1-1} = 2^0 = 1$  ;  RHS $= 2^1 - 1 = 1 \Rightarrow$ ពិត`),
        s(60, 335, 1180, R`!!• ឧបមាថាពិតចំពោះ $n = m$ ៖!!   $1 + 2 + 2^2 + \ldots + 2^{m-1} = 2^m - 1$`),
        s(60, 405, 1180, R`!!• ស្រាយថាសមភាពពិតចំពោះ $n = m + 1$ ៖!!`),
        s(120, 465, 1060, R`$\text{LHS} = (1 + 2 + \ldots + 2^{m-1}) + 2^m = (2^m - 1) + 2^m = 2 \cdot 2^m - 1 = 2^{m+1} - 1$  (ពិត!)`),
        S.box(160, 530, 880, 70, R`!!ដូចនេះ!!  $\displaystyle\sum_{k=1}^{n} 2^{k-1} = 2^n - 1$  ពិតចំពោះគ្រប់ $n \in \mathbb{N}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 14 section 3: inequalities */ page([
        sec('៣. ការស្រាយបញ្ជាក់វិសមភាព'),
        tip(60, 160, 1180, 80, R`ចំណាំ ៖ ពេលបង្ហាញ $P(k+1)$ ក្នុងវិសមភាព គេច្រើនប្រើលក្ខណៈឆ្លង ៖ បើ $A > B$ និង $B \ge C$ នោះនាំឲ្យ $A > C$ ។`, { size: 24 }),
        l(60, 260, 1180, R`!!__លំហាត់គំរូ ៤ (វិសមភាពប៊ែរនូយី Bernoulli) ៖__!!`, { size: 26 }),
        s(80, 315, 1120, R`ចំពោះ $h > 0$ និងចំនួនគត់ធម្មជាតិ $n \ge 2$ ស្រាយបញ្ជាក់ថា ៖`),
        S.box(280, 380, 640, 80, R`$(1 + h)^n > 1 + nh$`, { size: 30, align: 'center' }),
        s(80, 480, 1120, R`ដោយប្រើវិចារអនុមានរួមគណិតវិទ្យា (សៀវភៅពុម្ពទំព័រ ៤៥) ។`, { size: 25 })
      ]),

      /* 15 Bernoulli proof */ page([
        sec('ដំណោះស្រាយវិសមភាពប៊ែរនូយី'),
        s(60, 155, 1180, R`!!• ចំពោះ $n = 2$ ៖!!  $(1 + h)^2 = 1 + 2h + h^2 > 1 + 2h$   (ព្រោះ $h > 0 \Rightarrow h^2 > 0$)  ពិត!`),
        s(60, 220, 1180, R`!!• ឧបមាថាវិសមភាពពិតចំពោះ $n = k$ ($k \ge 2$) ៖!!   $(1 + h)^k > 1 + kh$`),
        s(60, 285, 1180, R`!!• បង្ហាញថាពិតដល់ $n = k + 1$ គឺត្រូវស្រាយថា ៖!!   $(1 + h)^{k+1} > 1 + (k + 1)h$`),
        s(80, 345, 1120, R`ដោយ $h > 0 \Rightarrow 1 + h > 0$ ។ គុណអង្គទាំងពីរនៃសម្មតិកម្មនឹង $(1 + h)$ ៖`),
        s(140, 400, 1040, R`$(1 + h)^k (1 + h) > (1 + kh)(1 + h)$`),
        s(140, 455, 1040, R`$(1 + h)^{k+1} > 1 + kh + h + kh^2 = 1 + (k + 1)h + kh^2 > 1 + (k + 1)h$  (ព្រោះ $kh^2 > 0$)`),
        S.box(100, 525, 1080, 76, R`!!ដូចនេះ!!   $(1 + h)^n > 1 + nh$   ពិតចំពោះគ្រប់ $n \ge 2$ និង $h > 0$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 16 inequality 2^n > n */ page([
        sec('លំហាត់គំរូ ៥ ៖ វិសមភាពស្វ័យគុណ'),
        l(60, 150, 1180, R`ស្រាយបញ្ជាក់ថា  $2^n > n$   ពិតចំពោះគ្រប់ចំនួនគត់ធម្មជាតិ $n \ge 1$ ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`!!• ចំពោះ $n = 1$ ៖!!   LHS $= 2^1 = 2 > 1 = $ RHS  (ពិត)`),
        s(60, 330, 1180, R`!!• ឧបមាថាពិតចំពោះ $n = k$ ($k \ge 1$) ៖!!   $2^k > k$`),
        s(60, 395, 1180, R`!!• បង្ហាញថាពិតចំពោះ $n = k + 1$ ៖!!  ត្រូវបង្ហាញថា  $2^{k+1} > k + 1$`),
        s(120, 455, 1060, R`យើងមាន  $2^{k+1} = 2 \cdot 2^k > 2k = k + k \ge k + 1$   (ព្រោះ $k \ge 1$)  ពិត!`),
        S.box(160, 525, 880, 76, R`!!ដូចនេះ!!   $2^n > n$   ពិតចំពោះគ្រប់ $n \in \mathbb{N}$ ។`, { size: 28, align: 'center', anim: true }),
        kids()
      ]),

      /* 17 section 4: divisibility */ page([
        sec('៤. ការស្រាយបញ្ជាក់ភាពចែកដាច់'),
        tip(60, 160, 1180, 80, R`និយមន័យ ៖ $A$ ជាពហុគុណនៃ $m$ (ចែកដាច់នឹង $m$) លុះត្រាតែមានចំនួនគត់ $q$ ដែល $A = m \times q$ ។`, { size: 24 }),
        l(60, 260, 1180, R`!!__លំហាត់គំរូ ៦ (សៀវភៅពុម្ពទំព័រ ៤៦) ៖__!!`, { size: 26 }),
        s(80, 315, 1120, R`ស្រាយបញ្ជាក់ថា  $n^3 + 2n$  ជាពហុគុណនៃ $3$ ចំពោះគ្រប់ចំនួនគត់ $n \ge 1$ ។`, { size: 26 }),
        K.solTitle(440, 380),
        s(60, 440, 1180, R`!!• ចំពោះ $n = 1$ ៖!!  $1^3 + 2(1) = 1 + 2 = 3 = 3 \times 1$  (ចែកដាច់នឹង ៣ ពិត)`),
        s(60, 500, 1180, R`!!• ឧបមាថាពិតចំពោះ $n = k$ ៖!!   $k^3 + 2k = 3q$   ($q$ ជាចំនួនគត់)`),
        kids()
      ]),

      /* 18 divisibility proof 1 */ page([
        sec('ដំណោះស្រាយលំហាត់គំរូ ៦ (ត)'),
        s(60, 155, 1180, R`!!• បង្ហាញថាពិតដល់ $n = k + 1$ ៖!!  ត្រូវបង្ហាញថា  $(k + 1)^3 + 2(k + 1)$  ចែកដាច់នឹង $3$ ។`),
        s(80, 215, 1120, R`យើងមាន ៖`),
        s(120, 270, 1060, R`$(k + 1)^3 + 2(k + 1) = (k^3 + 3k^2 + 3k + 1) + (2k + 2)$`),
        s(220, 330, 960, R`$= (k^3 + 2k) + (3k^2 + 3k + 3)$`),
        s(220, 390, 960, R`$= 3q + 3(k^2 + k + 1)$`),
        s(220, 450, 960, R`$= 3(q + k^2 + k + 1)$  (ជាពហុគុណនៃ ៣ ពិត!)`),
        S.box(100, 520, 1080, 76, R`!!ដូចនេះ!!   $n^3 + 2n$   ជាពហុគុណនៃ $3$ ចំពោះគ្រប់ចំនួនគត់ធម្មជាតិ $n$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 19 divisibility proof 2 */ page([
        sec('លំហាត់គំរូ ៧ (ប្រតិបត្តិសៀវភៅពុម្ពទំព័រ ៤៦)'),
        l(60, 150, 1180, R`ស្រាយបញ្ជាក់ថា  $2^{n+1} + 3^{2n-1}$  ជាពហុគុណនៃ $7$ ចំពោះគ្រប់ $n \in \mathbb{N}$ ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`!!• ចំពោះ $n = 1$ ៖!!  $2^{1+1} + 3^{2(1)-1} = 2^2 + 3^1 = 4 + 3 = 7 = 7 \times 1$  (ពិត)`),
        s(60, 330, 1180, R`!!• ឧបមាថាពិតចំពោះ $n = k$ ៖!!   $2^{k+1} + 3^{2k-1} = 7M$   ($M \in \mathbb{Z}$)`),
        s(60, 395, 1180, R`!!• បង្ហាញថាពិតចំពោះ $n = k + 1$ ៖!!  គណនា  $2^{(k+1)+1} + 3^{2(k+1)-1} = 2^{k+2} + 3^{2k+1}$ ៖`),
        s(120, 455, 1060, R`$= 2 \cdot 2^{k+1} + 3^2 \cdot 3^{2k-1} = 2 \cdot 2^{k+1} + 9 \cdot 3^{2k-1}$`),
        s(120, 510, 1060, R`$= 2(2^{k+1} + 3^{2k-1}) + 7 \cdot 3^{2k-1} = 2(7M) + 7 \cdot 3^{2k-1} = 7(2M + 3^{2k-1})$  (ចែកដាច់នឹង ៧!)`),
        kids()
      ]),

      /* 20 section 5: Pascal\'s triangle intro */ page([
        sec("៥. ត្រីកោណប៉ាស្កាល់ (Pascal\'s Triangle)"),
        l(60, 150, 1180, 'ពិនិត្យពន្លាតនៃស្វ័យគុណទ្វេធា $(x + y)^n$ ចំពោះតម្លៃតូចៗនៃ $n$ ៖', { size: 26 }),
        s(100, 205, 1000, R`$(x + y)^0 = 1$`),
        s(100, 250, 1000, R`$(x + y)^1 = 1x + 1y$`),
        s(100, 295, 1000, R`$(x + y)^2 = 1x^2 + 2xy + 1y^2$`),
        s(100, 340, 1000, R`$(x + y)^3 = 1x^3 + 3x^2y + 3xy^2 + 1y^3$`),
        s(100, 385, 1000, R`$(x + y)^4 = 1x^4 + 4x^3y + 6x^2y^2 + 4xy^3 + 1y^4$`),
        s(100, 430, 1000, R`$(x + y)^5 = 1x^5 + 5x^4y + 10x^3y^2 + 10x^2y^3 + 5xy^4 + 1y^5$`),
        S.box(60, 495, 1180, 110, R`!!__លក្ខណៈសម្គាល់__ ៖
១. ពន្លាតមាន $(n + 1)$ តួ  ;  ស្វ័យគុណនៃ $x$ ថយចុះ ឯ $y$ កើនឡើង  ;  ផលបូកស្វ័យគុណក្នុងតួនីមួយៗស្មើ $n$
២. លេខមេគុណខាងចុងសងខាងគឺ $1$ ហើយមេគុណកណ្ដាលស្មើផលបូកមេគុណ ២ តួលើវា!`, { size: 21, anim: true })
      ]),

      /* 21 Pascal pyramid view */ page([
        sec('រាងត្រីកោណប៉ាស្កាល់ និងមេគុណទ្វេធា'),
        S.box(200, 150, 880, 300, R`$$
\begin{array}{ccccccccccc}
n = 0: & & & & & 1 & & & & & \\
n = 1: & & & & 1 & & 1 & & & & \\
n = 2: & & & 1 & & 2 & & 1 & & & \\
n = 3: & & 1 & & 3 & & 3 & & 1 & & \\
n = 4: & 1 & & 4 & & 6 & & 4 & & 1 & \\
n = 5: & 1 & 5 & 10 & & 10 & 5 & 1 & & & 
\end{array}
$$`, { size: 24, align: 'center' }),
        s(80, 465, 1120, R`!!• ទំនាក់ទំនងទៅនឹងបន្ទំ ៖!!   មេគុណនីមួយៗគឺ  $ {}_nC_r = \dbinom{n}{r} = \dfrac{n!}{(n - r)!\,r!}$`),
        s(80, 520, 1120, R`• ជួរទី $5$ ៖  $ {}_5C_0 = 1,\ {}_5C_1 = 5,\ {}_5C_2 = 10,\ {}_5C_3 = 10,\ {}_5C_4 = 5,\ {}_5C_5 = 1$`, { color: 'brand' }),
        kids()
      ]),

      /* 22 binomial theorem formula */ page([
        sec('៥. ទ្រឹស្តីបទទ្វេធាញូតុន (Binomial Theorem)'),
        S.box(80, 160, 1120, 160, R`!!__ទ្រឹស្តីបទទ្វេធាញូតុន ៖__!!
$$(x + y)^n = \sum_{r=0}^{n} {}_nC_r\,x^{n-r}y^r = {}_nC_0\,x^n + {}_nC_1\,x^{n-1}y + {}_nC_2\,x^{n-2}y^2 + \ldots + {}_nC_n\,y^n$$`, { size: 25, align: 'center' }),
        card(80, 345, 540, 240, 'រូបមន្តតួទូទៅ (General Term)', R`តួទី $r + 1$ នៃពន្លាតទ្វេធាកំណត់ដោយ ៖
$$T_{r+1} = {}_nC_r\,x^{n-r}y^r$$
(ចំណាំ ៖ តួទី ១ ត្រូវនឹង $r = 0$, តួទី ២ ត្រូវនឹង $r = 1$, តួទី $k$ ត្រូវនឹង $r = k - 1$)`, { size: 21 }),
        card(660, 345, 540, 240, 'មេគុណបន្ទំ (Combinations)', R`$$ {}_nC_r = \frac{n!}{(n - r)!\,r!}$$
លក្ខណៈឆ្លុះ ៖ $ {}_nC_r = {}_nC_{n-r}$
ផលបូកមេគុណ ៖ $\sum_{r=0}^n {}_nC_r = 2^n$`, { size: 21 })
      ]),

      /* 23 expansion example 1 */ page([
        sec('លំហាត់គំរូ ៨ ៖ ពន្លាតកន្សោម (1 + 3x)⁴'),
        l(60, 150, 1180, R`ដោយប្រើទ្រឹស្តីបទទ្វេធាចូរពន្លាតកន្សោម  $(1 + 3x)^4$  (សៀវភៅពុម្ពទំព័រ ៤៨) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`អនុវត្តរូបមន្ត $(x + y)^n$ ដោយយក $x = 1,\ y = 3x,\ n = 4$ ៖`),
        s(80, 315, 1120, R`$(1 + 3x)^4 = {}_4C_0(1)^4 + {}_4C_1(1)^3(3x) + {}_4C_2(1)^2(3x)^2 + {}_4C_3(1)(3x)^3 + {}_4C_4(3x)^4$`),
        s(80, 385, 1120, R`គណនាមេគុណ ៖  $ {}_4C_0 = 1,\ {}_4C_1 = 4,\ {}_4C_2 = 6,\ {}_4C_3 = 4,\ {}_4C_4 = 1$`),
        s(80, 445, 1120, R`$= 1 + 4(3x) + 6(9x^2) + 4(27x^3) + 1(81x^4)$`),
        S.box(120, 515, 1040, 76, R`!!ដូចនេះ!!   $(1 + 3x)^4 = 1 + 12x + 54x^2 + 108x^3 + 81x^4$`, { size: 27, align: 'center', anim: true }),
        kids()
      ]),

      /* 24 expansion example 2 */ page([
        sec('លំហាត់គំរូ ៩ ៖ ពន្លាតកន្សោម (2x - y)⁵'),
        l(60, 150, 1180, R`ពន្លាតកន្សោម  $(2x - y)^5$  (សៀវភៅពុម្ពទំព័រ ៤៨) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`យក $a = 2x,\ b = -y,\ n = 5$ ៖  មេគុណជួរទី ៥ នៃត្រីកោណប៉ាស្កាល់គឺ  $1, 5, 10, 10, 5, 1$`),
        s(80, 320, 1120, R`$(2x - y)^5 = (2x)^5 + 5(2x)^4(-y) + 10(2x)^3(-y)^2 + 10(2x)^2(-y)^3 + 5(2x)(-y)^4 + (-y)^5$`),
        s(80, 395, 1120, R`$= 32x^5 - 5(16x^4)y + 10(8x^3)y^2 - 10(4x^2)y^3 + 5(2x)y^4 - y^5$`),
        S.box(100, 480, 1080, 86, R`!!ដូចនេះ!!   $(2x - y)^5 = 32x^5 - 80x^4y + 80x^3y^2 - 40x^2y^3 + 10xy^4 - y^5$`, { size: 26, align: 'center', anim: true }),
        kids(1100, 526, 150)
      ]),

      /* 25 finding specific term 1 */ page([
        sec('លំហាត់គំរូ ១០ ៖ កំណត់តួជាក់លាក់ណាមួយ'),
        l(60, 150, 1180, R`កំណត់តួទី $4$ នៃពន្លាតទ្វេធា  $(x + y)^{13}$  (សៀវភៅពុម្ពទំព័រ ៤៩) ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`រូបមន្តតួទូទៅ ៖  $T_{r+1} = {}_nC_r\,x^{n-r}y^r$`),
        s(80, 320, 1120, R`នៅទីនេះ $n = 13$ ។ ដើម្បីរក !!តួទី ៤!! ($T_4$) គេត្រូវយក $r + 1 = 4 \Rightarrow r = 3$ ៖`),
        s(120, 380, 1040, R`$T_4 = {}_{13}C_3\,x^{13-3}y^3 = {}_{13}C_3\,x^{10}y^3$`),
        s(120, 440, 1040, R`គណនា $ {}_{13}C_3 = \dfrac{13 \times 12 \times 11}{3 \times 2 \times 1} = 13 \times 2 \times 11 = 286$`),
        S.box(160, 515, 880, 76, R`!!ដូចនេះ!!   តួទី ៤ គឺ   $T_4 = 286x^{10}y^3$`, { size: 30, align: 'center', anim: true })
      ]),

      /* 26 finding specific term 2 */ page([
        sec('លំហាត់គំរូ ១១ ៖ កំណត់តួទី ៦ នៃ (x² - 2y)⁷'),
        l(60, 150, 1180, R`កំណត់តួទី $6$ នៃពន្លាតកន្សោម  $(x^2 - 2y)^7$  (លំហាត់ ២៦ ទំព័រ ៥២) ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`យើងមាន $n = 7$ ។ តួទី $6 \Rightarrow r + 1 = 6 \Rightarrow r = 5$ ៖`),
        s(120, 325, 1040, R`$T_6 = {}_7C_5\,(x^2)^{7-5}(-2y)^5 = {}_7C_5\,(x^2)^2(-32y^5)$`),
        s(120, 395, 1040, R`គណនា $ {}_7C_5 = {}_7C_2 = \dfrac{7 \times 6}{2 \times 1} = 21$`),
        s(120, 455, 1040, R`$\Rightarrow\ T_6 = 21 \times x^4 \times (-32y^5) = -672 x^4 y^5$`),
        S.box(160, 520, 880, 76, R`!!ដូចនេះ!!   តួទី ៦ គឺ   $T_6 = -672 x^4 y^5$`, { size: 30, align: 'center', anim: true }),
        kids()
      ]),

      /* 27 properties of binomial coefficients */ page([
        sec('លក្ខណៈពិសេសនៃមេគុណទ្វេធា'),
        l(60, 150, 1180, R`ពិនិត្យពន្លាត  $(1 + x)^n = {}_nC_0 + {}_nC_1 x + {}_nC_2 x^2 + \ldots + {}_nC_n x^n$ ៖`, { size: 26 }),
        card(80, 220, 540, 260, '១. ផលបូកមេគុណទាំងអស់', R`យក $x = 1$ ជំនួសក្នុងពន្លាត ៖
$$(1 + 1)^n = {}_nC_0 + {}_nC_1 + {}_nC_2 + \ldots + {}_nC_n$$
$$\Rightarrow {}_nC_0 + {}_nC_1 + {}_nC_2 + \ldots + {}_nC_n = 2^n$$
ផលបូកមេគុណទាំងអស់ស្មើ $2^n$ !`, { size: 21 }),
        card(660, 220, 540, 260, '២. ផលបូកមេគុណសេស និងគូ', R`យក $x = -1$ ជំនួសក្នុងពន្លាត ៖
$$(1 - 1)^n = {}_nC_0 - {}_nC_1 + {}_nC_2 - {}_nC_3 + \ldots = 0$$
$$\Rightarrow \text{ផលបូកតួគូ} = \text{ផលបូកតួសេស} = 2^{n-1}$$
(លំហាត់ ២៧–២៨ ទំព័រ ៥២)`, { size: 21 }),
        S.box(100, 505, 1080, 80, R`ឧទាហរណ៍ចំពោះ $n = 5$ ៖  $1 + 5 + 10 + 10 + 5 + 1 = 32 = 2^5$ ✓`, { size: 25, align: 'center', anim: true })
      ]),

      /* 28 chapter 1 summary */ page([
        sec('សង្ខេបមេរៀនទី ៦ — វិចារអនុមានរួម & ទ្វេធាញូតុន'),
        S.box(60, 155, 1180, 440, R`!!__១. វិចារអនុមានរួមគណិតវិទ្យា__ ៖
• ជំហាន ១ ៖ ផ្ទៀងផ្ទាត់ $P(1)$ ពិត
• ជំហាន ២ ៖ ឧបមា $P(k)$ ពិត
• ជំហាន ៣ ៖ ស្រាយបញ្ជាក់ថា $P(k+1)$ ពិត $\Rightarrow$ សន្និដ្ឋាន $P(n)$ ពិតគ្រប់ $n \in \mathbb{N}$
• អនុវត្តលើ ៖ សមភាពផលបូក, វិសមភាព, និងភាពចែកដាច់
!!__២. ទ្រឹស្តីបទទ្វេធាញូតុន__ ៖
• $(x + y)^n = \sum_{r=0}^n {}_nC_r x^{n-r}y^r$  មាន $(n + 1)$ តួ
• តួទី $r + 1$ ៖  $T_{r+1} = {}_nC_r x^{n-r}y^r$
• ផលបូកមេគុណទ្វេធា ៖  $\sum_{r=0}^n {}_nC_r = 2^n$`, { size: 22, lh: '1.5' }),
        kids(1100, 526, 150)
      ]),

      /* 29 quick quiz 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`តើពន្លាតទ្វេធា $(2a + b)^8$ មានចំនួនប៉ុន្មានតួ?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', '៧ តួ', { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', '៨ តួ', { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', '៩ តួ', { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', '១៦ តួ', { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ C!! (ព្រោះពន្លាត $(x+y)^n$ តែងមាន $(n + 1)$ តួ គឺ $8 + 1 = 9$ តួ)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 30 quick quiz 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`ដើម្បីកំណត់ «តួទី ៥» នៃពន្លាត $(x + y)^{10}$ តើតម្លៃ $r$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$r = 5$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$r = 4$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$r = 6$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$r = 10$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះតួទី $k$ ត្រូវនឹង $r = k - 1$ ដូច្នេះតួទី ៥ ត្រូវនឹង $r = 4$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 31 homework */ S.homework(R`!!១.!! ដោយប្រើវិចារអនុមានរួម ស្រាយបញ្ជាក់ថា  $1^3 + 2^3 + \ldots + n^3 = \left[\dfrac{n(n + 1)}{2}\right]^2$  គ្រប់ $n \in \mathbb{N}$ ។
!!២.!! ស្រាយបញ្ជាក់ថា  $n(n^2 + 5)$  ចែកដាច់នឹង $6$ ចំពោះគ្រប់ចំនួនគត់ធម្មជាតិ $n$ ។
!!៣.!! រកតួទី $៥$ និងតួដែលគ្មាន $x$ នៃពន្លាតកន្សោម  $\left(x + \dfrac{1}{x}\right)^{10}$ ។`),

      /* 32 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · មេរៀនទី៦ វិចារអនុមានរួមគណិតវិទ្យា',
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 6,
      lesson: 'មេរៀនទី ៦ ៖ វិចារអនុមានរួមគណិតវិទ្យា',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. គោលការណ៍នៃវិចារអនុមានរួម', slide: 3 },
        { title: '២. ស្រាយបញ្ជាក់សមភាពផលបូក', slide: 7 },
        { title: '៣. ស្រាយបញ្ជាក់វិសមភាព', slide: 13 },
        { title: '៤. ស្រាយបញ្ជាក់ភាពចែកដាច់', slide: 16 },
        { title: '៥. ត្រីកោណប៉ាស្កាល់ & ទ្វេធាញូតុន', slide: 19 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 27 }
      ],
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      slides: slides
    };
  }

  
  // =========================================================================
  // ថ្នាក់ទី១១ ជំពូកទី៣ មេរៀនទី១ ៖ អនុគមន៍ត្រីកោណមាត្រ — book pages 90–113
  // =========================================================================
  function trigFunctions(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, trigCircle = K.trigCircle, trigGraph = K.trigGraph, expGraph = K.expGraph, logGraph = K.logGraph;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៣==        មេរៀនទី១', 'អនុគមន៍ត្រីកោណមាត្រ', K.info),

      /* 2 */ K.toc([
        '==១. រង្វាស់មុំ & រង្វង់ត្រីកោណមាត្រ==',
        '២. និយមន័យអនុគមន៍ & តារាងមុំពិសេស',
        '==៣. ទំនាក់ទំនងគ្រឹះ & មុំផ្តុំ==',
        '៤. អថេរភាព និងក្រាបរលក sin, cos, tan',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`ប្តូររង្វាស់មុំពីដឺក្រេទៅជារ៉ាដ្យង់ និងពីរ៉ាដ្យង់ទៅជាដឺក្រេ ($1\text{ rad} = \frac{180^\circ}{\pi}$)`,
        R`កំណត់ចំណុច និងសញ្ញានៃអនុគមន៍ត្រីកោណមាត្រតាមកាដ្រង់លើរង្វង់ត្រីកោណមាត្រ`,
        R`ប្រើប្រាស់ទំនាក់ទំនងគ្រឹះ $\sin^2 x + \cos^2 x = 1$ និងរូបមន្តមុំផ្តុំក្នុងការសម្រួលកន្សោម`,
        R`យល់ដឹងពីខួប ភាពគូ-សេស និងសង់ក្រាបរលកនៃអនុគមន៍ $y = \sin x, y = \cos x, y = \tan x$`
      ]),

      /* 4 */ page([
        sec('១.១ រង្វាស់មុំគិតជាដឺក្រេ និងរ៉ាដ្យង់'),
        card(60, 160, 560, 360, 'និយមន័យ & រូបមន្តបម្លែងរង្វាស់មុំ', R`• **រ៉ាដ្យង់ (Radian)** ៖ ជារង្វាស់មុំផ្ចិតដែលស្កាត់ធ្នូមានប្រវែងស្មើនឹងកាំរង្វង់ ($r$) ។
• **ទំនាក់ទំនងដឺក្រេ & រ៉ាដ្យង់** ៖
$$\pi \text{ rad} = 180^\circ \iff 1\text{ rad} = \frac{180^\circ}{\pi} \approx 57^\circ 17'45''$$
$$1^\circ = \frac{\pi}{180} \text{ rad} \approx 0.0175 \text{ rad}$$
• **ប្រវែងធ្នូរង្វង់** ៖ $\ell = r \cdot \theta$ (ដែល $\theta$ គិតជារ៉ាដ្យង់)`, { size: 24 }),
        card(660, 160, 560, 360, 'តារាងបម្លែងមុំសំខាន់ៗដែលជួបញឹកញាប់', R`$$\begin{array}{|c|c|c|c|c|c|c|}
\hline
\text{ដឺក្រេ} & 0^\circ & 30^\circ & 45^\circ & 60^\circ & 90^\circ & 180^\circ \\
\hline
\text{រ៉ាដ្យង់} & 0 & \frac{\pi}{6} & \frac{\pi}{4} & \frac{\pi}{3} & \frac{\pi}{2} & \pi \\
\hline
\end{array}$$
• $120^\circ = \dfrac{2\pi}{3}, \quad 135^\circ = \dfrac{3\pi}{4}, \quad 150^\circ = \dfrac{5\pi}{6}$
• $270^\circ = \dfrac{3\pi}{2}, \quad 360^\circ = 2\pi$ (មួយជុំពេញ)`, { size: 24 }),
        S.box(60, 545, 1160, 75, R`!!ក្បួនចងចាំ!! ៖ ប្តូរពីដឺក្រេ $\to$ រ៉ាដ្យង់ គុណនឹង $\dfrac{\pi}{180}$ ; ប្តូរពីរ៉ាដ្យង់ $\to$ ដឺក្រេ ជំនួស $\pi = 180^\circ$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ ការប្តូររង្វាស់មុំ និងប្រវែងធ្នូ'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ១ ៖!!  ក. ប្តូរ $150^\circ$ និង $225^\circ$ ជារ៉ាដ្យង់ ។  ខ. ប្តូរ $\dfrac{5\pi}{3}\text{ rad}$ ជាដឺក្រេ ។`, { size: 27 }),
        s(100, 220, 1080, R`• $150^\circ = 150 \times \dfrac{\pi}{180} = \dfrac{150\pi}{180} = \dfrac{5\pi}{6}\text{ rad}$`),
        s(100, 275, 1080, R`• $225^\circ = 225 \times \dfrac{\pi}{180} = \dfrac{225\pi}{180} = \dfrac{5\pi}{4}\text{ rad}$`),
        s(100, 330, 1080, R`• $\dfrac{5\pi}{3}\text{ rad} = \dfrac{5 \times 180^\circ}{3} = 5 \times 60^\circ = 300^\circ$`),
        l(60, 395, 1180, R`!!លំហាត់គំរូ ២ ៖!!  រង្វង់មួយមានកាំ $r = 6\text{ cm}$ ។ គណនាប្រវែងធ្នូ $\ell$ ស្កាត់ដោយមុំផ្ចិត $\theta = \dfrac{2\pi}{3}$ ។`, { size: 26 }),
        s(100, 455, 1080, R`គេមានរូបមន្ត $\ell = r \cdot \theta = 6 \times \dfrac{2\pi}{3} = 4\pi \approx 12.57\text{ cm}$`),
        S.box(60, 535, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  ប្រវែងធ្នូរង្វង់ $\ell = 4\pi\text{ cm} \approx 12.57\text{ cm}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('១.២ រង្វង់ត្រីកោណមាត្រ (Trigonometric Unit Circle)'),
        card(60, 155, 640, 375, 'និយមន័យរង្វង់ត្រីកោណមាត្រ', R`• **និយមន័យ** ៖ ជារង្វង់ដែលមានផ្ចិតត្រង់គល់ $O(0, 0)$ និងមានកាំ $R = 1$ ។
• **ទិសដៅវិល** ៖
  - **ទិសដៅវិជ្ជមាន (+)** ៖ ច្រាសទ្រនិចនាឡិកា
  - **ទិសដៅអវិជ្ជមាន (−)** ៖ ស្របទ្រនិចនាឡិកា
• **អ័ក្សកូអ័រដោនេ** ៖
  - អ័ក្សដេក $(Ox)$ ហៅថា **អ័ក្សកូស៊ីនុស (cos)**
  - អ័ក្សឈរ $(Oy)$ ហៅថា **អ័ក្សស៊ីនុស (sin)**
• ចំណុច $M$ លើរង្វង់ត្រូវគ្នានឹងមុំ $\theta$ មានកូអ័រដោនេ $M(\cos\theta, \sin\theta)$`, { size: 23 }),
        trigCircle(720, 155, 500, 375, { deg: 45 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំ!! ៖  គ្រប់មុំ $\theta$ ចំណុច $M(\cos\theta, \sin\theta)$ តែងស្ថិតលើរង្វង់ឯកតា នាំឱ្យ $-1 \le \cos\theta \le 1$ និង $-1 \le \sin\theta \le 1$ ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.១ និយមន័យនៃអនុគមន៍ត្រីកោណមាត្រទាំង ៤'),
        card(60, 160, 560, 360, 'អនុគមន៍ស៊ីនុស (sin) និងកូស៊ីនុស (cos)', R`បើ $M(x, y)$ ជាចំណុចចុងនៃធ្នូ $\theta$ លើរង្វង់ឯកតា ៖
• **កូស៊ីនុស** ៖ $\cos\theta = x$ (អាប់ស៊ីសនៃចំណុច $M$)
  - ដែនកំណត់ ៖ $D = \mathbb{R}$
  - សំណុំតម្លៃ ៖ $-1 \le \cos\theta \le 1$
• **ស៊ីនុស** ៖ $\sin\theta = y$ (អរដោនេនៃចំណុច $M$)
  - ដែនកំណត់ ៖ $D = \mathbb{R}$
  - សំណុំតម្លៃ ៖ $-1 \le \sin\theta \le 1$`, { size: 24 }),
        card(660, 160, 560, 360, 'អនុគមន៍តង់សង់ (tan) និងកូតង់សង់ (cot)', R`• **តង់សង់** ៖ $\tan\theta = \dfrac{\sin\theta}{\cos\theta} = \dfrac{y}{x} \quad (\cos\theta \neq 0)$
  - ដែនកំណត់ ៖ $\theta \neq \dfrac{\pi}{2} + k\pi \ (k \in \mathbb{Z})$
  - សំណុំតម្លៃ ៖ $\mathbb{R}$ (គ្មានព្រំដែន)
• **កូតង់សង់** ៖ $\cot\theta = \dfrac{\cos\theta}{\sin\theta} = \dfrac{x}{y} \quad (\sin\theta \neq 0)$
  - ដែនកំណត់ ៖ $\theta \neq k\pi \ (k \in \mathbb{Z})$
  - សំណុំតម្លៃ ៖ $\mathbb{R}$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ទំនាក់ទំនងបញ្ច្រាស!! ៖  $\tan\theta \cdot \cot\theta = 1 \iff \cot\theta = \dfrac{1}{\tan\theta}$ ចំពោះគ្រប់មុំដែលកំណត់ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('២.២ សញ្ញានៃអនុគមន៍ត្រីកោណមាត្រតាមកាដ្រង់'),
        card(60, 155, 640, 375, 'តារាងសញ្ញាតាមកាដ្រង់ទាំង ៤', R`$$\begin{array}{|c|c|c|c|c|}
\hline
\text{កាដ្រង់} & \text{កាដ្រង់ I} & \text{កាដ្រង់ II} & \text{កាដ្រង់ III} & \text{កាដ្រង់ IV} \\
\text{ចន្លោះមុំ} & (0, \frac{\pi}{2}) & (\frac{\pi}{2}, \pi) & (\pi, \frac{3\pi}{2}) & (\frac{3\pi}{2}, 2\pi) \\
\hline
\sin\theta & + & + & - & - \\
\hline
\cos\theta & + & - & - & + \\
\hline
\tan\theta & + & - & + & - \\
\hline
\cot\theta & + & - & + & - \\
\hline
\end{array}$$
• **កាដ្រង់ I** ៖ វិជ្ជមានទាំងអស់ (All positive)
• **កាដ្រង់ II** ៖ មានតែ $\sin$ វិជ្ជមាន
• **កាដ្រង់ III** ៖ មានតែ $\tan, \cot$ វិជ្ជមាន
• **កាដ្រង់ IV** ៖ មានតែ $\cos$ វិជ្ជមាន`, { size: 22 }),
        trigCircle(720, 155, 500, 375, { deg: 135 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ (ASTC)!! ៖  **A**ll $\to$ **S**in $\to$ **T**an $\to$ **C**os វិជ្ជមានតាមលំដាប់កាដ្រង់ I, II, III, IV ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('២.៣ តារាងតម្លៃនៃមុំពិសេស'),
        card(60, 160, 1160, 360, 'តារាងតម្លៃត្រីកោណមាត្រនៃមុំពិសេសសំខាន់ៗ', R`$$\begin{array}{|c|c|c|c|c|c|c|c|c|}
\hline
\theta\ (\text{ដឺក្រេ}) & 0^\circ & 30^\circ & 45^\circ & 60^\circ & 90^\circ & 180^\circ & 270^\circ & 360^\circ \\
\hline
\theta\ (\text{រ៉ាដ្យង់}) & 0 & \frac{\pi}{6} & \frac{\pi}{4} & \frac{\pi}{3} & \frac{\pi}{2} & \pi & \frac{3\pi}{2} & 2\pi \\
\hline
\sin\theta & 0 & \frac{1}{2} & \frac{\sqrt{2}}{2} & \frac{\sqrt{3}}{2} & 1 & 0 & -1 & 0 \\
\hline
\cos\theta & 1 & \frac{\sqrt{3}}{2} & \frac{\sqrt{2}}{2} & \frac{1}{2} & 0 & -1 & 0 & 1 \\
\hline
\tan\theta & 0 & \frac{\sqrt{3}}{3} & 1 & \sqrt{3} & \text{គ្មាន} & 0 & \text{គ្មាន} & 0 \\
\hline
\cot\theta & \text{គ្មាន} & \sqrt{3} & 1 & \frac{\sqrt{3}}{3} & 0 & \text{គ្មាន} & 0 & \text{គ្មាន} \\
\hline
\end{array}$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំតម្លៃស៊ីនុស!! ៖  $\sin\theta = \dfrac{\sqrt{0}}{2}, \dfrac{\sqrt{1}}{2}, \dfrac{\sqrt{2}}{2}, \dfrac{\sqrt{3}}{2}, \dfrac{\sqrt{4}}{2}$ ចំពោះមុំ $0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៣.១ ទំនាក់ទំនងគ្រឹះរវាងអនុគមន៍ត្រីកោណមាត្រ'),
        card(60, 160, 560, 360, 'រូបមន្តគ្រឹះទាំង ៤', R`ពីសមីការរង្វង់ឯកតា $x^2 + y^2 = 1$ យើងទាញបាន ៖
❶ **រូបមន្តគ្រឹះចម្បង** ៖
$$\sin^2 x + \cos^2 x = 1$$
❷ **ទំនាក់ទំនងរវាង tan និង cos** ៖
$$1 + \tan^2 x = \frac{1}{\cos^2 x} \quad (x \neq \frac{\pi}{2} + k\pi)$$
❸ **ទំនាក់ទំនងរវាង cot និង sin** ៖
$$1 + \cot^2 x = \frac{1}{\sin^2 x} \quad (x \neq k\pi)$$
❹ **ទំនាក់ទំនងរវាង tan និង cot** ៖
$$\tan x \cdot \cot x = 1$$`, { size: 24 }),
        card(660, 160, 560, 360, 'រូបមន្តទាញចេញសម្រាប់គណនា', R`• ទាញរក $\sin x$ និង $\cos x$ ៖
  $$\sin x = \pm\sqrt{1 - \cos^2 x}$$
  $$\cos x = \pm\sqrt{1 - \sin^2 x}$$
  *(សញ្ញា $\pm$ កំណត់តាមកាដ្រង់នៃមុំ $x$)*
• ទាញរក $\cos^2 x$ និង $\sin^2 x$ តាម $\tan x$ ៖
  $$\cos^2 x = \frac{1}{1 + \tan^2 x}$$
  $$\sin^2 x = \frac{\tan^2 x}{1 + \tan^2 x}$$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖  ពេលស្គាល់តម្លៃមួយនៃអនុគមន៍ត្រីកោណមាត្រ និងកាដ្រង់ យើងអាចគណនាតម្លៃ ៣ ទៀតបានជានិច្ច!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ គណនាតម្លៃអនុគមន៍ត្រីកោណមាត្រ'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  គេឱ្យ $\sin \alpha = \dfrac{3}{5}$ និង $\dfrac{\pi}{2} < \alpha < \pi$ (កាដ្រង់ទី II) ។ គណនា $\cos\alpha, \tan\alpha, \cot\alpha$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• តាមរូបមន្តគ្រឹះ $\sin^2\alpha + \cos^2\alpha = 1 \implies \cos^2\alpha = 1 - \sin^2\alpha = 1 - \left(\dfrac{3}{5}\right)^2 = \dfrac{16}{25}$`),
        s(100, 290, 1080, R`• ដោយ $\dfrac{\pi}{2} < \alpha < \pi$ ($\alpha$ នៅកាដ្រង់ទី II) នោះនាំឱ្យ $\cos\alpha < 0$ ៖  $\cos\alpha = -\sqrt{\dfrac{16}{25}} = -\dfrac{4}{5}$`),
        s(100, 355, 1080, R`• គណនា $\tan\alpha = \dfrac{\sin\alpha}{\cos\alpha} = \dfrac{3/5}{-4/5} = -\dfrac{3}{4}$`),
        s(100, 420, 1080, R`• គណនា $\cot\alpha = \dfrac{1}{\tan\alpha} = -\dfrac{4}{3}$`),
        S.box(60, 505, 1160, 105, R`!!ចម្លើយ!! ៖  $\cos\alpha = -\dfrac{4}{5}, \quad \tan\alpha = -\dfrac{3}{4}, \quad \cot\alpha = -\dfrac{4}{3}$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('៣.២ រូបមន្តមុំផ្តុំ (Associated Angles)'),
        card(60, 160, 560, 360, 'មុំផ្ទុយ (−x) និងមុំបន្ថែម (π − x)', R`• **មុំផ្ទុយ ($-x$)** ៖
  - $\cos(-x) = \cos x$
  - $\sin(-x) = -\sin x$
  - $\tan(-x) = -\tan x, \quad \cot(-x) = -\cot x$
• **មុំបន្ថែម ($\pi - x$)** ៖
  - $\sin(\pi - x) = \sin x$
  - $\cos(\pi - x) = -\cos x$
  - $\tan(\pi - x) = -\tan x, \quad \cot(\pi - x) = -\cot x$`, { size: 24 }),
        card(660, 160, 560, 360, 'មុំលើសកន្លះរង្វង់ (π + x) និងមុំបំពេញ (π/2 − x)', R`• **មុំលើសកន្លះរង្វង់ ($\pi + x$)** ៖
  - $\sin(\pi + x) = -\sin x, \quad \cos(\pi + x) = -\cos x$
  - $\tan(\pi + x) = \tan x, \quad \cot(\pi + x) = \cot x$
• **មុំបំពេញ ($\frac{\pi}{2} - x$)** ៖
  - $\sin\left(\frac{\pi}{2} - x\right) = \cos x, \quad \cos\left(\frac{\pi}{2} - x\right) = \sin x$
  - $\tan\left(\frac{\pi}{2} - x\right) = \cot x, \quad \cot\left(\frac{\pi}{2} - x\right) = \tan x$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនទន្ទេញ!! ៖  «កូស៊ីនុសផ្ទុយ ស៊ីនុសបន្ថែម តង់សង់កូតង់សង់លើសកន្លះរង្វង់ មុំបំពេញប្តូរឈ្មោះ» ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 13 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ ការសម្រួលកន្សោមដោយប្រើមុំផ្តុំ'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  សម្រួលកន្សោម $A = \sin(\pi - x) + \cos\left(\dfrac{\pi}{2} - x\right) - \sin(-x) + \cos(\pi + x)$ ។`, { size: 27 }),
        s(100, 230, 1080, R`• តាមរូបមន្តមុំបន្ថែម ៖  $\sin(\pi - x) = \sin x$`),
        s(100, 290, 1080, R`• តាមរូបមន្តមុំបំពេញ ៖  $\cos\left(\dfrac{\pi}{2} - x\right) = \sin x$`),
        s(100, 350, 1080, R`• តាមរូបមន្តមុំផ្ទុយ ៖  $-\sin(-x) = -(-\sin x) = \sin x$`),
        s(100, 410, 1080, R`• តាមរូបមន្តមុំលើសកន្លះរង្វង់ ៖  $\cos(\pi + x) = -\cos x$`),
        S.box(60, 495, 1160, 115, R`!!ដំណោះស្រាយ!! ៖  $A = \sin x + \sin x + \sin x - \cos x = 3\sin x - \cos x$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('៤.១ ដែនកំណត់ ខួប និងភាពគូ-សេស'),
        card(60, 160, 560, 360, 'ខួបនៃអនុគមន៍ត្រីកោណមាត្រ (Period T)', R`• អនុគមន៍ $f$ មានខួប $T$ បើ $f(x + T) = f(x)$ ចំពោះគ្រប់ $x$ ។
• **ខួបនៃ sin និង cos** ៖
  $$y = \sin x, \ y = \cos x \implies T = 2\pi$$
  $$y = \sin(ax), \ y = \cos(ax) \implies T = \frac{2\pi}{|a|}$$
• **ខួបនៃ tan និង cot** ៖
  $$y = \tan x, \ y = \cot x \implies T = \pi$$
  $$y = \tan(ax), \ y = \cot(ax) \implies T = \frac{\pi}{|a|}$$`, { size: 24 }),
        card(660, 160, 560, 360, 'ភាពគូ-សេស និងស៊ីមេទ្រីក្រាប', R`• **អនុគមន៍គូ** ៖ $f(-x) = f(x)$
  - $y = \cos x$ ជាអនុគមន៍គូ
  - ក្រាបរបស់វាឆ្លុះធៀបនឹង **អ័ក្សអរដោនេ $(Oy)$**
• **អនុគមន៍សេស** ៖ $f(-x) = -f(x)$
  - $y = \sin x, \ y = \tan x, \ y = \cot x$ ជាអនុគមន៍សេស
  - ក្រាបរបស់វាឆ្លុះធៀបនឹង **គល់កូអ័រដោនេ $O(0, 0)$**`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ឧទាហរណ៍!! ៖  $y = \sin(3x)$ មានខួប $T = \dfrac{2\pi}{3}$ ; $y = \tan(2x)$ មានខួប $T = \dfrac{\pi}{2}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('៤.២ អថេរភាព និងក្រាបនៃអនុគមន៍ y = sin x'),
        card(60, 155, 640, 375, 'លក្ខណៈនៃអនុគមន៍ y = sin x', R`• **ដែនកំណត់** ៖ $D = \mathbb{R}$
• **សំណុំតម្លៃ** ៖ $[-1, 1]$ (តម្លៃអតិបរមា $1$, អប្បបរមា $-1$)
• **ខួប** ៖ $T = 2\pi$ (សង់លើចន្លោះ $[-\pi, \pi]$ រួចរំកិលតាម $2\pi$)
• **ភាពសេស** ៖ $\sin(-x) = -\sin x$ (ក្រាបឆ្លុះធៀបនឹងគល់ $O$)
• **ចំណុចពិសេស** ៖
  - កាត់អ័ក្ស $Ox$ ត្រង់ $x = k\pi \ (k \in \mathbb{Z})$
  - អតិបរមា $y = 1$ ត្រង់ $x = \dfrac{\pi}{2} + 2k\pi$
  - អប្បបរមា $y = -1$ ត្រង់ $x = -\dfrac{\pi}{2} + 2k\pi$`, { size: 23 }),
        trigGraph(720, 155, 500, 375, 'sin'),
        S.box(60, 545, 1160, 80, R`!!រូបរាងក្រាប!! ៖  ក្រាបនៃអនុគមន៍ $y = \sin x$ ហៅថា **ខ្សែរលកស៊ីនុយសូអ៊ីត (Sinusoid)** រត់រលកគ្មានទីបញ្ចប់ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 16 */ page([
        sec('៤.៣ អថេរភាព និងក្រាបនៃអនុគមន៍ y = cos x'),
        card(60, 155, 640, 375, 'លក្ខណៈនៃអនុគមន៍ y = cos x', R`• **ដែនកំណត់** ៖ $D = \mathbb{R}$
• **សំណុំតម្លៃ** ៖ $[-1, 1]$ (តម្លៃអតិបរមា $1$, អប្បបរមា $-1$)
• **ខួប** ៖ $T = 2\pi$ (ក្រាបដដែលៗរៀងរាល់ចន្លោះប្រវែង $2\pi$)
• **ភាពគូ** ៖ $\cos(-x) = \cos x$ (ក្រាបឆ្លុះធៀបនឹងអ័ក្ស $Oy$)
• **ចំណុចពិសេស** ៖
  - កាត់អ័ក្ស $Ox$ ត្រង់ $x = \dfrac{\pi}{2} + k\pi \ (k \in \mathbb{Z})$
  - អតិបរមា $y = 1$ ត្រង់ $x = 2k\pi$ (រួមទាំង $x = 0$)
  - អប្បបរមា $y = -1$ ត្រង់ $x = \pi + 2k\pi$`, { size: 23 }),
        trigGraph(720, 155, 500, 375, 'cos'),
        S.box(60, 545, 1160, 80, R`!!សម្គាល់!! ៖  ក្រាប $y = \cos x$ កាត់អ័ក្ស $Oy$ ត្រង់ $(0, 1)$ ខណៈដែលក្រាប $y = \sin x$ កាត់ត្រង់គល់ $O(0, 0)$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 17 */ page([
        sec('៤.៤ ប្រៀបធៀបក្រាបនៃ y = sin x និង y = cos x'),
        card(60, 155, 640, 375, 'ទំនាក់ទំនងរំកិលរវាង sin x និង cos x', R`• តាមរូបមន្តមុំបំពេញ ៖
$$\cos x = \sin\left(x + \frac{\pi}{2}\right)$$
• **ការបកស្រាយធរណីមាត្រ** ៖
  - ក្រាបនៃ $y = \cos x$ (បន្ទាត់ក្រហម) គឺបានមកពីការរំកិលក្រាបនៃ $y = \sin x$ (បន្ទាត់ខៀវ) ទៅឆ្វេងចម្ងាយ $\dfrac{\pi}{2}$ ។
  - ក្រាបទាំងពីរសុទ្ធសឹងជាខ្សែរលកដែលមាន **អំព្លីទុត $A = 1$** និង **ខួប $T = 2\pi$** ដូចគ្នា ។`, { size: 24 }),
        trigGraph(720, 155, 500, 375, 'both'),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  អនុគមន៍ $\cos x$ នាំមុខអនុគមន៍ $\sin x$ នូវមុំផាស $\dfrac{\pi}{2}$ (Phase difference $\pi/2$) ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 18 */ page([
        sec('៤.៥ អថេរភាព និងក្រាបនៃ y = tan x & y = cot x'),
        card(60, 160, 560, 360, 'អនុគមន៍ y = tan x', R`• **ដែនកំណត់** ៖ $D = \mathbb{R} \setminus \{\frac{\pi}{2} + k\pi\}$
• **សំណុំតម្លៃ** ៖ $\mathbb{R}$
• **ខួប** ៖ $T = \pi$
• **អថេរភាព** ៖ ជាអនុគមន៍កើនដាច់ខាតលើចន្លោះនីមួយៗ $(-\frac{\pi}{2} + k\pi, \frac{\pi}{2} + k\pi)$
• **អាស៊ីមតូតឈរ** ៖ បន្ទាត់ $x = \frac{\pi}{2} + k\pi$
• **ចំណុចពិសេស** ៖ កាត់ $Ox$ ត្រង់ $x = k\pi$`, { size: 23 }),
        card(660, 160, 560, 360, 'អនុគមន៍ y = cot x', R`• **ដែនកំណត់** ៖ $D = \mathbb{R} \setminus \{k\pi\}$
• **សំណុំតម្លៃ** ៖ $\mathbb{R}$
• **ខួប** ៖ $T = \pi$
• **អថេរភាព** ៖ ជាអនុគមន៍ចុះដាច់ខាតលើចន្លោះនីមួយៗ $(k\pi, (k+1)\pi)$
• **អាស៊ីមតូតឈរ** ៖ បន្ទាត់ $x = k\pi$
• **ចំណុចពិសេស** ៖ កាត់ $Ox$ ត្រង់ $x = \frac{\pi}{2} + k\pi$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖  $y = \tan x$ តែងតែកើនជានិច្ច ឯ $y = \cot x$ តែងតែចុះជានិច្ចលើចន្លោះដែនកំណត់របស់វា!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 19 */ page([
        sec('សង្ខេបជំពូកទី ៣ មេរៀនទី ១ ៖ រូបមន្តគន្លឹះ'),
        card(60, 160, 560, 360, '១. រូបមន្តគ្រឹះ & ខួប', R`• $\pi\text{ rad} = 180^\circ \iff \ell = r\theta$
• $\sin^2 x + \cos^2 x = 1$
• $1 + \tan^2 x = \dfrac{1}{\cos^2 x}, \quad 1 + \cot^2 x = \dfrac{1}{\sin^2 x}$
• $\tan x \cdot \cot x = 1$
• **ខួប** ៖ $\sin(ax), \cos(ax) \to T = \dfrac{2\pi}{|a|}$ ; $\tan(ax), \cot(ax) \to T = \dfrac{\pi}{|a|}$`, { size: 23 }),
        card(660, 160, 560, 360, '២. មុំផ្តុំ & លក្ខណៈក្រាប', R`• **មុំផ្ទុយ** ៖ $\cos(-x) = \cos x, \ \sin(-x) = -\sin x$
• **មុំបន្ថែម** ៖ $\sin(\pi - x) = \sin x, \ \cos(\pi - x) = -\cos x$
• **មុំលើសកន្លះរង្វង់** ៖ $\tan(\pi + x) = \tan x$
• **មុំបំពេញ** ៖ $\sin(\frac{\pi}{2} - x) = \cos x, \ \cos(\frac{\pi}{2} - x) = \sin x$
• **ក្រាប** ៖ $\sin x, \cos x$ មានអំព្លីទុត $1$, ខួប $2\pi$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 20 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`ប្តូររង្វាស់មុំ $150^\circ$ ជារ៉ាដ្យង់ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{2\pi}{3}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{5\pi}{6}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{3\pi}{4}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{7\pi}{6}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $150^\circ = 150 \times \dfrac{\pi}{180} = \dfrac{5\pi}{6}\text{ rad}$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 21 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`តើអនុគមន៍ $y = 3\sin(4x)$ មានខួប $T$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$T = 2\pi$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$T = \pi$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$T = \dfrac{\pi}{2}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$T = 4\pi$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ C!! (ព្រោះតាមរូបមន្ត $T = \dfrac{2\pi}{|a|} = \dfrac{2\pi}{4} = \dfrac{\pi}{2}$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 22 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`គណនាតម្លៃនៃកន្សោម $\cos\left(-\dfrac{5\pi}{3}\right)$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$-\dfrac{1}{2}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{1}{2}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{\sqrt{3}}{2}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$-\dfrac{\sqrt{3}}{2}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\cos(-\frac{5\pi}{3}) = \cos(\frac{5\pi}{3}) = \cos(2\pi - \frac{\pi}{3}) = \cos\frac{\pi}{3} = \frac{1}{2}$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 23 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ១០៨–១១៣)'),
        S.box(80, 160, 1120, 350, R`!!១.!! ប្តូរមុំពីរ៉ាដ្យង់ទៅជាដឺក្រេ និងពីដឺក្រេទៅជារ៉ាដ្យង់ ៖
    ក. $75^\circ, \ 135^\circ, \ 315^\circ$
    ខ. $\dfrac{7\pi}{6}, \ \dfrac{4\pi}{3}, \ -\dfrac{3\pi}{4}$
!!២.!! គណនាតម្លៃនៃអនុគមន៍ត្រីកោណមាត្រ ៖
    ក. $\cos\alpha$ និង $\tan\alpha$ បើ $\sin\alpha = -\dfrac{5}{13}$ និង $\pi < \alpha < \dfrac{3\pi}{2}$
    ខ. $\sin x$ និង $\cos x$ បើ $\tan x = 2$ និង $0 < x < \dfrac{\pi}{2}$
!!៣.!! សម្រួលកន្សោម $B = \sin(\pi + x) + \cos\left(\dfrac{\pi}{2} + x\right) + \sin(-x) + \cos\left(\dfrac{3\pi}{2} - x\right)$`, { size: 24, lh: '1.6' })
      ]),

      /* 24 */ S.homework(R`!!១.!! រង្វង់មួយមានកាំ $r = 10\text{ cm}$ ។ គណនាប្រវែងធ្នូដែលស្កាត់ដោយមុំផ្ចិត $\theta = 72^\circ$ ។
!!២.!! គេឱ្យ $\cos\alpha = -\dfrac{3}{5}$ និង $\dfrac{\pi}{2} < \alpha < \pi$ ។ គណនា $\sin\alpha, \ \tan\alpha, \ \cot\alpha$ ។
!!៣.!! សិក្សាអថេរភាព និងសង់ក្រាបនៃអនុគមន៍ $y = 2\sin x$ លើចន្លោះ $[0, 2\pi]$ ។`),

      /* 25 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី១ អនុគមន៍ត្រីកោណមាត្រ (២៥ ស្លាយ)',
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. រង្វាស់មុំ & រង្វង់ត្រីកោណមាត្រ', slide: 3 },
        { title: '២. អនុគមន៍ត្រីកោណមាត្រ & តារាងមុំពិសេស', slide: 6 },
        { title: '៣. ទំនាក់ទំនងគ្រឹះ & មុំផ្តុំ', slide: 9 },
        { title: '៤. អថេរភាព និងក្រាបរលក sin, cos, tan', slide: 13 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 18 }
      ],
      theme: 'school',
      slides: slides
    };
  }



  // =========================================================================
  // ថ្នាក់ទី១១ ជំពូកទី៣ មេរៀនទី២ ៖ រូបមន្តត្រីកោណមាត្រ — book pages 114–135
  // =========================================================================
  function trigFormulas(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, trigCircle = K.trigCircle, trigGraph = K.trigGraph, expGraph = K.expGraph, logGraph = K.logGraph;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៣==        មេរៀនទី២', 'រូបមន្តត្រីកោណមាត្រ', K.info),

      /* 2 */ K.toc([
        '==១. រូបមន្តផលបូក និងផលដក==',
        '២. រូបមន្តមុំឌុប & មុំ ៣ គុណ',
        '==៣. រូបមន្តកន្លះមុំ & បន្ថយដឺក្រេ==',
        '៤. បម្លែងផលគុណ ↔ ផលបូក',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`ចងចាំ និងចេះប្រើរូបមន្តផលបូក ផលដកនៃអនុគមន៍ស៊ីនុស កូស៊ីនុស និងតង់សង់`,
        R`គណនាតម្លៃត្រីកោណមាត្រនៃមុំពិសេស $15^\circ, 75^\circ, 105^\circ, \frac{\pi}{12}, \frac{5\pi}{12}$`,
        R`អនុវត្តរូបមន្តមុំឌុប $2a$ និងរូបមន្តកន្លះមុំ $\frac{a}{2}$ ព្រមទាំងរូបមន្តអថេរជំនួយ $t = \tan \frac{a}{2}$`,
        R`បម្លែងកន្សោមត្រីកោណមាត្រពីផលគុណទៅជាផលបូក និងពីផលបូកទៅជាផលគុណយ៉ាងស្ទាត់ជំនាញ`
      ]),

      /* 4 */ page([
        sec('១.១ រូបមន្តផលបូក និងផលដកកូស៊ីនុស'),
        card(60, 160, 560, 360, 'រូបមន្តផលបូក និងផលដកកូស៊ីនុស', R`ចំពោះគ្រប់មុំ $a$ និង $b$ គេបាន ៖
❶ **រូបមន្តផលដកកូស៊ីនុស** ៖
$$\cos(a - b) = \cos a \cos b + \sin a \sin b$$
❷ **រូបមន្តផលបូកកូស៊ីនុស** ៖
$$\cos(a + b) = \cos a \cos b - \sin a \sin b$$

• **ក្បួនចំណាំ** ៖
  - កូស៊ីនុសនៃផលបូក ឬផលដក ប្រើ $\cos \cos$ និង $\sin \sin$
  - សញ្ញាប្តូរផ្ទុយ ៖ បើក្នុងវង់ក្រចកជា $+$ នោះខាងក្រៅជា $-$ ; បើក្នុងវង់ក្រចកជា $-$ ខាងក្រៅជា $+$ ។`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍អនុវត្ត ៖ គណនា cos 15° និង cos 75°', R`• គណនា $\cos 15^\circ = \cos(45^\circ - 30^\circ)$ ៖
$$\begin{aligned}
\cos 15^\circ &= \cos 45^\circ \cos 30^\circ + \sin 45^\circ \sin 30^\circ \\
&= \frac{\sqrt{2}}{2} \cdot \frac{\sqrt{3}}{2} + \frac{\sqrt{2}}{2} \cdot \frac{1}{2} = \frac{\sqrt{6} + \sqrt{2}}{4}
\end{aligned}$$
• គណនា $\cos 75^\circ = \cos(45^\circ + 30^\circ)$ ៖
$$\begin{aligned}
\cos 75^\circ &= \cos 45^\circ \cos 30^\circ - \sin 45^\circ \sin 30^\circ \\
&= \frac{\sqrt{6} - \sqrt{2}}{4}
\end{aligned}$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!លទ្ធផលសំខាន់!! ៖  $\cos 15^\circ = \dfrac{\sqrt{6} + \sqrt{2}}{4}$ និង $\cos 75^\circ = \dfrac{\sqrt{6} - \sqrt{2}}{4}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('១.២ រូបមន្តផលបូក និងផលដកស៊ីនុស'),
        card(60, 160, 560, 360, 'រូបមន្តផលបូក និងផលដកស៊ីនុស', R`ចំពោះគ្រប់មុំ $a$ និង $b$ គេបាន ៖
❸ **រូបមន្តផលបូកស៊ីនុស** ៖
$$\sin(a + b) = \sin a \cos b + \sin b \cos a$$
❹ **រូបមន្តផលដកស៊ីនុស** ៖
$$\sin(a - b) = \sin a \cos b - \sin b \cos a$$

• **ក្បួនចំណាំ** ៖
  - ស៊ីនុសនៃផលបូក ឬផលដក ប្រើឆ្លាស់គ្នារវាង $\sin$ និង $\cos$
  - សញ្ញារក្សាដដែល ៖ បើ $+$ នៅតែ $+$ ; បើ $-$ នៅតែ $-$ ។`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍អនុវត្ត ៖ គណនា sin 75° និង sin 15°', R`• គណនា $\sin 75^\circ = \sin(45^\circ + 30^\circ)$ ៖
$$\begin{aligned}
\sin 75^\circ &= \sin 45^\circ \cos 30^\circ + \cos 45^\circ \sin 30^\circ \\
&= \frac{\sqrt{2}}{2} \cdot \frac{\sqrt{3}}{2} + \frac{\sqrt{2}}{2} \cdot \frac{1}{2} = \frac{\sqrt{6} + \sqrt{2}}{4}
\end{aligned}$$
• គណនា $\sin 15^\circ = \sin(45^\circ - 30^\circ)$ ៖
$$\sin 15^\circ = \frac{\sqrt{6} - \sqrt{2}}{4}$$
• សម្គាល់ ៖ $\sin 75^\circ = \cos 15^\circ$ និង $\sin 15^\circ = \cos 75^\circ$ (មុំបំពេញ)`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ទំនាក់ទំនងមុំបំពេញ!! ៖  $\sin 75^\circ = \cos 15^\circ = \dfrac{\sqrt{6} + \sqrt{2}}{4}$ ព្រោះ $75^\circ + 15^\circ = 90^\circ$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('១.៣ រូបមន្តផលបូក និងផលដកតង់សង់'),
        card(60, 160, 560, 360, 'រូបមន្តផលបូក និងផលដកតង់សង់', R`❺ **ផលបូកតង់សង់** ៖
$$\tan(a + b) = \frac{\tan a + \tan b}{1 - \tan a \tan b}$$
❻ **ផលដកតង់សង់** ៖
$$\tan(a - b) = \frac{\tan a - \tan b}{1 + \tan a \tan b}$$

*(លក្ខខណ្ឌ ៖ គ្រប់មុំដែលធ្វើឱ្យកន្សោមមានន័យ)*
• ភាគយកមានសញ្ញាដូចវង់ក្រចក
• ភាគបែងមានសញ្ញាផ្ទុយពីវង់ក្រចក`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ ៖ គណនា tan 105° និង tan 15°', R`• គណនា $\tan 105^\circ = \tan(60^\circ + 45^\circ)$ ៖
$$\begin{aligned}
\tan 105^\circ &= \frac{\tan 60^\circ + \tan 45^\circ}{1 - \tan 60^\circ \tan 45^\circ} = \frac{\sqrt{3} + 1}{1 - \sqrt{3}} \\
&= \frac{(\sqrt{3} + 1)^2}{1 - 3} = -(2 + \sqrt{3})
\end{aligned}$$
• គណនា $\tan 15^\circ = \tan(45^\circ - 30^\circ)$ ៖
$$\tan 15^\circ = \frac{1 - \frac{\sqrt{3}}{3}}{1 + \frac{\sqrt{3}}{3}} = 2 - \sqrt{3}$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  $\tan 15^\circ = 2 - \sqrt{3}$ និង $\tan 105^\circ = -(2 + \sqrt{3})$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.១ រូបមន្តមុំឌុប (Double-Angle Formulas)'),
        card(60, 160, 560, 360, 'រូបមន្តមុំឌុបទាំង ៣', R`ជំនួស $b = a$ ក្នុងរូបមន្តផលបូក យើងទាញបាន ៖
❶ **ស៊ីនុសមុំឌុប** ៖
$$\sin 2a = 2\sin a \cos a$$
❷ **កូស៊ីនុសមុំឌុប (មាន ៣ ទម្រង់)** ៖
$$\begin{aligned}
\cos 2a &= \cos^2 a - \sin^2 a \\
&= 2\cos^2 a - 1 \\
&= 1 - 2\sin^2 a
\end{aligned}$$
❸ **តង់សង់មុំឌុប** ៖
$$\tan 2a = \frac{2\tan a}{1 - \tan^2 a}$$`, { size: 24 }),
        card(660, 160, 560, 360, 'រូបមន្តបន្ថយដឺក្រេ (Power-Reduction)', R`ទាញចេញពី $\cos 2a$ ៖
• **បន្ថយដឺក្រេស៊ីនុស** ៖
$$\sin^2 a = \frac{1 - \cos 2a}{2}$$
• **បន្ថយដឺក្រេកូស៊ីនុស** ៖
$$\cos^2 a = \frac{1 + \cos 2a}{2}$$
• **បន្ថយដឺក្រេតង់សង់** ៖
$$\tan^2 a = \frac{1 - \cos 2a}{1 + \cos 2a}$$
*(រូបមន្តនេះមានប្រយោជន៍ខ្លាំងក្នុងការគណនាអាំងតេក្រាល និងដោះស្រាយសមីការ)*`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖  $\sin^2 a$ មានសញ្ញាដក ($-$) ; $\cos^2 a$ មានសញ្ញាបូក ($+$) ធៀបនឹង $\cos 2a$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ អនុវត្តរូបមន្តមុំឌុប'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  គេឱ្យ $\cos a = -\dfrac{4}{5}$ និង $\dfrac{\pi}{2} < a < \pi$ (កាដ្រង់ទី II) ។ គណនា $\sin 2a, \ \cos 2a, \ \tan 2a$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• ក្នុងកាដ្រង់ទី II នាំឱ្យ $\sin a > 0$ ៖  $\sin a = \sqrt{1 - \cos^2 a} = \sqrt{1 - \left(-\dfrac{4}{5}\right)^2} = \dfrac{3}{5}$`),
        s(100, 290, 1080, R`• គណនា $\sin 2a = 2\sin a \cos a = 2 \left(\dfrac{3}{5}\right)\left(-\dfrac{4}{5}\right) = -\dfrac{24}{25}$`),
        s(100, 355, 1080, R`• គណនា $\cos 2a = 2\cos^2 a - 1 = 2\left(-\dfrac{4}{5}\right)^2 - 1 = 2\left(\dfrac{16}{25}\right) - 1 = \dfrac{7}{25}$`),
        s(100, 420, 1080, R`• គណនា $\tan 2a = \dfrac{\sin 2a}{\cos 2a} = \dfrac{-24/25}{7/25} = -\dfrac{24}{7}$`),
        S.box(60, 505, 1160, 105, R`!!ចម្លើយ!! ៖  $\sin 2a = -\dfrac{24}{25}, \quad \cos 2a = \dfrac{7}{25}, \quad \tan 2a = -\dfrac{24}{7}$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('២.២ រូបមន្តមុំ ៣ គុណ (Triple-Angle Formulas)'),
        card(60, 160, 560, 360, 'រូបមន្ត sin 3a និង cos 3a', R`ដោយសរសេរ $3a = 2a + a$ យើងទាញបាន ៖
❶ **ស៊ីនុសមុំ ៣ គុណ** ៖
$$\sin 3a = 3\sin a - 4\sin^3 a$$
❷ **កូស៊ីនុសមុំ ៣ គុណ** ៖
$$\cos 3a = 4\cos^3 a - 3\cos a$$
❸ **តង់សង់មុំ ៣ គុណ** ៖
$$\tan 3a = \frac{3\tan a - \tan^3 a}{1 - 3\tan^2 a}$$`, { size: 24 }),
        card(660, 160, 560, 360, 'ក្បួនចងចាំលេខមេគុណ (34 & 43)', R`• **ចំពោះ sin 3a** ៖
  - លេខមេគុណគឺ **3 - 4**
  - $\sin 3a = \mathbf{3}\sin a - \mathbf{4}\sin^3 a$
• **ចំពោះ cos 3a** ៖
  - លេខមេគុណគឺ **4 - 3**
  - $\cos 3a = \mathbf{4}\cos^3 a - \mathbf{3}\cos a$

• រូបមន្តទាញចេញ ៖
  $$\sin^3 a = \frac{3\sin a - \sin 3a}{4}$$
  $$\cos^3 a = \frac{3\cos a + \cos 3a}{4}$$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖  «ស៊ីនុស ៣៤, កូស៊ីនុស ៤៣» (ស្វ័យគុណ ៣ នៅជាប់នឹងមេគុណ ៤ ជានិច្ច)!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៣.១ រូបមន្តកន្លះមុំ (Half-Angle Formulas)'),
        card(60, 160, 560, 360, 'រូបមន្តកន្លះមុំ a/2', R`ជំនួស $a$ ដោយ $\dfrac{a}{2}$ ក្នុងរូបមន្តបន្ថយដឺក្រេ ៖
❶ **កូស៊ីនុសកន្លះមុំ** ៖
$$\cos^2\frac{a}{2} = \frac{1 + \cos a}{2} \iff \cos\frac{a}{2} = \pm\sqrt{\frac{1 + \cos a}{2}}$$
❷ **ស៊ីនុសកន្លះមុំ** ៖
$$\sin^2\frac{a}{2} = \frac{1 - \cos a}{2} \iff \sin\frac{a}{2} = \pm\sqrt{\frac{1 - \cos a}{2}}$$
❸ **តង់សង់កន្លះមុំ** ៖
$$\tan\frac{a}{2} = \frac{\sin a}{1 + \cos a} = \frac{1 - \cos a}{\sin a}$$`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ ៖ គណនា sin 22°30\' និង cos 22°30\'', R`ដោយ $22^\circ 30' = \dfrac{45^\circ}{2}$ នៅក្នុងកាដ្រង់ទី I ($\sin, \cos > 0$) ៖
• $\cos 22^\circ 30' = \sqrt{\dfrac{1 + \cos 45^\circ}{2}} = \sqrt{\dfrac{1 + \frac{\sqrt{2}}{2}}{2}} = \dfrac{\sqrt{2 + \sqrt{2}}}{2}$
• $\sin 22^\circ 30' = \sqrt{\dfrac{1 - \cos 45^\circ}{2}} = \dfrac{\sqrt{2 - \sqrt{2}}}{2}$
• $\tan 22^\circ 30' = \dfrac{1 - \cos 45^\circ}{\sin 45^\circ} = \dfrac{1 - \frac{\sqrt{2}}{2}}{\frac{\sqrt{2}}{2}} = \sqrt{2} - 1$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  $\tan 22^\circ 30' = \sqrt{2} - 1 \approx 0.4142$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('៣.២ រូបមន្តអថេរជំនួយ t = tan(a/2)'),
        card(60, 160, 560, 360, 'កន្សោមត្រីកោណមាត្រជាអនុគមន៍នៃ t', R`តាង $t = \tan\dfrac{a}{2}$ យើងអាចសរសេរអនុគមន៍ទាំងអស់តាម $t$ ៖
❶ **ស៊ីនុស** ៖
$$\sin a = \frac{2t}{1 + t^2}$$
❷ **កូស៊ីនុស** ៖
$$\cos a = \frac{1 - t^2}{1 + t^2}$$
❸ **តង់សង់** ៖
$$\tan a = \frac{2t}{1 - t^2}$$`, { size: 24 }),
        card(660, 160, 560, 360, 'សារៈសំខាន់នៃរូបមន្ត t', R`• **ប្តូរអនុគមន៍ត្រីកោណមាត្រទៅជាប្រភាគសនិទាន** នៃអថេរពីជគណិត $t$ ។
• ជួយសម្រួលយ៉ាងខ្លាំងក្នុងការ ៖
  - ដោះស្រាយសមីការត្រីកោណមាត្រលីនេអ៊ែរ $a\sin x + b\cos x = c$
  - គណនាអាំងតេក្រាលត្រីកោណមាត្រ (Weierstrass Substitution)
  - ស្រាយបញ្ជាក់សមភាពស្មុគស្មាញ`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!រូបមន្តសំខាន់!! ៖  $\sin a = \dfrac{2t}{1+t^2}, \quad \cos a = \dfrac{1-t^2}{1+t^2}, \quad \tan a = \dfrac{2t}{1-t^2}$ ចំពោះ $t = \tan\dfrac{a}{2}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('៤.១ រូបមន្តបម្លែងពីផលគុណទៅជាផលបូក'),
        card(60, 160, 560, 360, 'រូបមន្តទាំង ៣', R`បូក ឬដករូបមន្តផលបូក និងផលដក យើងបាន ៖
❶ **ផលគុណកូស៊ីនុស** ៖
$$\cos a \cos b = \frac{1}{2}[\cos(a + b) + \cos(a - b)]$$
❷ **ផលគុណស៊ីនុស** ៖
$$\sin a \sin b = \frac{1}{2}[\cos(a - b) - \cos(a + b)]$$
❸ **ផលគុណស៊ីនុស និងកូស៊ីនុស** ៖
$$\sin a \cos b = \frac{1}{2}[\sin(a + b) + \sin(a - b)]$$`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍អនុវត្ត', R`• គណនា $A = \cos 75^\circ \cos 15^\circ$ ៖
$$\begin{aligned}
A &= \frac{1}{2}[\cos(75^\circ + 15^\circ) + \cos(75^\circ - 15^\circ)] \\
&= \frac{1}{2}[\cos 90^\circ + \cos 60^\circ] \\
&= \frac{1}{2}\left[0 + \frac{1}{2}\right] = \frac{1}{4}
\end{aligned}$$
• គណនា $B = \sin\dfrac{5\pi}{12}\sin\dfrac{\pi}{12}$ ៖
$$B = \frac{1}{2}\left[\cos\frac{\pi}{3} - \cos\frac{\pi}{2}\right] = \frac{1}{2}\left[\frac{1}{2} - 0\right] = \frac{1}{4}$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  $\cos 75^\circ \cos 15^\circ = \dfrac{1}{4}$ និង $\sin\dfrac{5\pi}{12}\sin\dfrac{\pi}{12} = \dfrac{1}{4}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 13 */ page([
        sec('៤.២ រូបមន្តបម្លែងពីផលបូកទៅជាផលគុណ'),
        card(60, 160, 560, 360, 'រូបមន្តបម្លែងផលបូក ↔ ផលគុណ', R`តាង $p = a + b$ និង $q = a - b$ យើងទាញបាន ៖
❶ **ផលបូកកូស៊ីនុស** ៖
$$\cos p + \cos q = 2\cos\frac{p + q}{2}\cos\frac{p - q}{2}$$
❷ **ផលដกกូស៊ីនុស** ៖
$$\cos p - \cos q = -2\sin\frac{p + q}{2}\sin\frac{p - q}{2}$$
❸ **ផលបូកស៊ីនុស** ៖
$$\sin p + \sin q = 2\sin\frac{p + q}{2}\cos\frac{p - q}{2}$$
❹ **ផលដកស៊ីនុស** ៖
$$\sin p - \sin q = 2\cos\frac{p + q}{2}\sin\frac{p - q}{2}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍អនុវត្ត', R`• គណនា $A = \sin 105^\circ + \sin 15^\circ$ ៖
$$\begin{aligned}
A &= 2\sin\frac{105^\circ + 15^\circ}{2}\cos\frac{105^\circ - 15^\circ}{2} \\
&= 2\sin 60^\circ \cos 45^\circ \\
&= 2 \cdot \frac{\sqrt{3}}{2} \cdot \frac{\sqrt{2}}{2} = \frac{\sqrt{6}}{2}
\end{aligned}$$
• គណនា $B = \cos 50^\circ + \cos 70^\circ - \cos 10^\circ$ ៖
$$\cos 50^\circ + \cos 70^\circ = 2\cos 60^\circ \cos 10^\circ = \cos 10^\circ$$
$\implies B = \cos 10^\circ - \cos 10^\circ = 0$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!លទ្ធផលស្រស់ស្អាត!! ៖  $\cos 50^\circ + \cos 70^\circ - \cos 10^\circ = 0$ !`, { size: 26, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('៥. ឧទាហរណ៍គំរូ ៖ ត្រីកោណមាត្រក្នុងត្រីកោណ ABC'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  គេមាន $A, B, C$ ជាមុំក្នុងត្រីកោណមួយ ($A + B + C = \pi$) ។
បង្ហាញថា  $\sin A + \sin B + \sin C = 4\cos\dfrac{A}{2}\cos\dfrac{B}{2}\cos\dfrac{C}{2}$ ។`, { size: 26 }),
        s(100, 230, 1080, R`• បម្លែង $\sin A + \sin B = 2\sin\dfrac{A+B}{2}\cos\dfrac{A-B}{2} = 2\cos\dfrac{C}{2}\cos\dfrac{A-B}{2}$ (ព្រោះ $\dfrac{A+B}{2} = \dfrac{\pi}{2} - \dfrac{C}{2}$)`),
        s(100, 300, 1080, R`• បម្លែង $\sin C = 2\sin\dfrac{C}{2}\cos\dfrac{C}{2}$`),
        s(100, 370, 1080, R`• ដាក់ជាកត្តារួម $2\cos\dfrac{C}{2}$ ៖
$$\sin A + \sin B + \sin C = 2\cos\frac{C}{2}\left[\cos\frac{A-B}{2} + \sin\frac{C}{2}\right] = 2\cos\frac{C}{2}\left[\cos\frac{A-B}{2} + \cos\frac{A+B}{2}\right]$$`),
        s(100, 450, 1080, R`• អនុវត្តរូបមន្តផលបូកកូស៊ីនុស ៖  $\cos\dfrac{A-B}{2} + \cos\dfrac{A+B}{2} = 2\cos\dfrac{A}{2}\cos\dfrac{B}{2}$`),
        S.box(60, 525, 1160, 90, R`!!ដូចនេះ!!  $\sin A + \sin B + \sin C = 4\cos\dfrac{A}{2}\cos\dfrac{B}{2}\cos\dfrac{C}{2}$  ពិត (ស.បញ្ជាក់រួច) ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('សង្ខេបជំពូកទី ៣ មេរៀនទី ២ ៖ តារាងរូបមន្តគន្លឹះ'),
        card(60, 160, 560, 360, 'រូបមន្តផលបូក-ផលដក & មុំឌុប', R`• $\cos(a \pm b) = \cos a \cos b \mp \sin a \sin b$
• $\sin(a \pm b) = \sin a \cos b \pm \sin b \cos a$
• $\tan(a \pm b) = \dfrac{\tan a \pm \tan b}{1 \mp \tan a \tan b}$
• $\sin 2a = 2\sin a \cos a$
• $\cos 2a = 2\cos^2 a - 1 = 1 - 2\sin^2 a$
• $\tan 2a = \dfrac{2\tan a}{1 - \tan^2 a}$`, { size: 23 }),
        card(660, 160, 560, 360, 'រូបមន្តកន្លះមុំ & បម្លែងផល', R`• $\cos^2\dfrac{a}{2} = \dfrac{1 + \cos a}{2}, \ \sin^2\dfrac{a}{2} = \dfrac{1 - \cos a}{2}$
• $\cos a \cos b = \dfrac{1}{2}[\cos(a+b) + \cos(a-b)]$
• $\sin a \sin b = \dfrac{1}{2}[\cos(a-b) - \cos(a+b)]$
• $\cos p + \cos q = 2\cos\dfrac{p+q}{2}\cos\dfrac{p-q}{2}$
• $\sin p + \sin q = 2\sin\dfrac{p+q}{2}\cos\dfrac{p-q}{2}$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 16 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`គណនាតម្លៃពិតប្រាកដនៃ $\cos 75^\circ$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{\sqrt{6} + \sqrt{2}}{4}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{\sqrt{6} - \sqrt{2}}{4}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{\sqrt{3} - 1}{2}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{\sqrt{2}}{4}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\cos 75^\circ = \cos(45^\circ + 30^\circ) = \dfrac{\sqrt{6} - \sqrt{2}}{4}$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 17 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`បើ $\sin a = \dfrac{3}{5}$ និង $0 < a < \dfrac{\pi}{2}$ នោះ $\sin 2a$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{6}{5}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{12}{25}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{24}{25}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{7}{25}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ C!! (ព្រោះ $\cos a = \frac{4}{5} \implies \sin 2a = 2\sin a \cos a = 2 \cdot \frac{3}{5} \cdot \frac{4}{5} = \frac{24}{25}$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 18 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`គណនាតម្លៃនៃកន្សោម $\sin 105^\circ + \sin 15^\circ$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{\sqrt{6}}{2}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{\sqrt{2}}{2}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{\sqrt{3}}{2}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\sqrt{6}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\sin 105^\circ + \sin 15^\circ = 2\sin 60^\circ \cos 45^\circ = 2 \cdot \frac{\sqrt{3}}{2} \cdot \frac{\sqrt{2}}{2} = \frac{\sqrt{6}}{2}$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 19 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ១២៨–១៣៥)'),
        S.box(80, 160, 1120, 350, R`!!១.!! គណនាតម្លៃពិតប្រាកដនៃ ៖
    ក. $\sin 105^\circ, \quad \cos 105^\circ, \quad \tan 15^\circ$
    ខ. $\sin\dfrac{7\pi}{12}, \quad \cos\dfrac{\pi}{12}, \quad \tan\dfrac{5\pi}{12}$
!!២.!! គេឱ្យ $\sin x = \dfrac{1}{3}$ និង $0 < x < \dfrac{\pi}{2}$ ។ គណនា $\sin 2x, \ \cos 2x, \ \sin 3x$ ។
!!៣.!! សម្រួលកន្សោម ៖
    ក. $A = \dfrac{\sin 3x - \sin x}{\cos 3x + \cos x}$
    ខ. $B = \cos 20^\circ \cos 40^\circ \cos 80^\circ$`, { size: 24, lh: '1.6' })
      ]),

      /* 20 */ S.homework(R`!!១.!! គណនាតម្លៃនៃកន្សោម  $A = \cos\dfrac{\pi}{7}\cos\dfrac{2\pi}{7}\cos\dfrac{4\pi}{7}$  ។
!!២.!! បង្ហាញថា  $\dfrac{\sin 2a + \sin 4a}{\cos 2a + \cos 4a} = \tan 3a$  ។
!!៣.!! គេមាន $A, B, C$ ជាមុំក្នុងត្រីកោណ $ABC$ ។ បង្ហាញថា $\cos A + \cos B + \cos C = 1 + 4\sin\dfrac{A}{2}\sin\dfrac{B}{2}\sin\dfrac{C}{2}$ ។`),

      /* 21 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី២ រូបមន្តត្រីកោណមាត្រ (២១ ស្លាយ)',
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ រូបមន្តត្រីកោណមាត្រ',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. រូបមន្តផលបូក និងផលដក', slide: 3 },
        { title: '២. រូបមន្តមុំឌុប & មុំ ៣ គុណ', slide: 6 },
        { title: '៣. រូបមន្តកន្លះមុំ & អថេរ t', slide: 9 },
        { title: '៤. បម្លែងផលគុណ ↔ ផលបូក', slide: 11 },
        { title: '៥. អនុវត្តក្នុងត្រីកោណ ABC', slide: 13 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 14 }
      ],
      theme: 'school',
      slides: slides
    };
  }



  // =========================================================================
  // ថ្នាក់ទី១១ ជំពូកទី៣ មេរៀនទី៣ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រ — book pages 136–165
  // =========================================================================

  // =========================================================================
  // ថ្នាក់ទី១១ ជំពូកទី៣ មេរៀនទី៣ ៖ អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ — book pages 120–135
  // =========================================================================
  function trigInverse(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, trigCircle = K.trigCircle, trigGraph = K.trigGraph, invTrigGraph = K.invTrigGraph, trigEqCircle = K.trigEqCircle;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៣==        មេរៀនទី៣', 'អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ', K.info),

      /* 2 */ K.toc([
        '==១. សញ្ញាណនៃអនុគមន៍ច្រាស==',
        '២. អនុគមន៍ arcsin, arccos, arctan',
        '==៣. លក្ខណៈ & ក្រាបនៃអនុគមន៍ច្រាស==',
        '៤. ឧទាហរណ៍គំរូ & អនុវត្តជាក់ស្តែង',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`យល់ដឹងពីនិយមន័យនៃអនុគមន៍ច្រាសត្រីកោណមាត្រ $y = \arcsin x, \ \arccos x, \ \arctan x$`,
        R`កំណត់ដែនកំណត់ និងសំណុំតម្លៃ (Principal Value Range) នៃអនុគមន៍ច្រាសនីមួយៗ`,
        R`គណនាតម្លៃពិតនៃអនុគមន៍ច្រាសត្រីកោណមាត្រដោយមិនបាច់ប្រើម៉ាស៊ីនគិតលេខ`,
        R`យល់ដឹងពីលក្ខណៈស៊ីមេទ្រីក្រាបឆ្លុះធៀបនឹងបន្ទាត់ពុះ $y = x$`
      ]),

      /* 4 */ page([
        sec('១.១ សញ្ញាណនៃអនុគមន៍ច្រាសត្រីកោណមាត្រ'),
        card(60, 160, 560, 360, 'ហេតុអ្វីត្រូវកម្រិតដែនកំណត់?', R`• អនុគមន៍ត្រីកោណមាត្រជាអនុគមន៍ខួប នាំឱ្យតម្លៃមួយរបស់ $y$ ត្រូវគ្នានឹងតម្លៃ $x$ ច្រើនរាប់មិនអស់ (មិនមែនជាអនុគមន៍មួយទល់មួយទេ) ។
• ដើម្បីឱ្យវាមាន **អនុគមន៍ច្រាស** គេត្រូវកម្រិតដែនកំណត់របស់វា ៖
  - **ស៊ីនុស** ៖ កម្រិតលើ $\left[-\dfrac{\pi}{2}, \ \dfrac{\pi}{2}\right]$
  - **កូស៊ីនុស** ៖ កម្រិតលើ $[0, \ \pi]$
  - **តង់សង់** ៖ កម្រិតលើ $\left(-\dfrac{\pi}{2}, \ \dfrac{\pi}{2}\right)$`, { size: 24 }),
        card(660, 160, 560, 360, 'ការកំណត់សរសេរ & ការប្រុងប្រយ័ត្ន', R`• **និមិត្តសញ្ញា** ៖
  - $y = \arcsin x$ ឬ $y = \sin^{-1} x$
  - $y = \arccos x$ ឬ $y = \cos^{-1} x$
  - $y = \arctan x$ ឬ $y = \tan^{-1} x$

> **⚠️ ចូរប្រយ័ត្ន** ៖
> និមិត្តសញ្ញា $\sin^{-1} x$ **មិនមែន** ជា $\dfrac{1}{\sin x}$ ទេ!
> $$\sin^{-1} x = \arcsin x \ne (\sin x)^{-1} = \frac{1}{\sin x} = \csc x$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!និយមន័យ!! ៖  $y = \arcsin x \iff \sin y = x$  ដែល  $-1 \le x \le 1$  និង  $-\dfrac{\pi}{2} \le y \le \dfrac{\pi}{2}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('២.១ អនុគមន៍ y = arcsin x (sin⁻¹ x)'),
        card(60, 155, 640, 375, 'លក្ខណៈនៃអនុគមន៍ y = arcsin x', R`• **និយមន័យ** ៖ $y = \arcsin x \iff \sin y = x$
• **ដែនកំណត់** ៖ $D = [-1, \ 1]$
• **សំណុំតម្លៃ (Range)** ៖ $\left[-\dfrac{\pi}{2}, \ \dfrac{\pi}{2}\right]$
• **តម្លៃពិសេស** ៖
  - $\arcsin(0) = 0$
  - $\arcsin\left(\dfrac{1}{2}\right) = \dfrac{\pi}{6}$
  - $\arcsin\left(\dfrac{\sqrt{2}}{2}\right) = \dfrac{\pi}{4}, \quad \arcsin\left(\dfrac{\sqrt{3}}{2}\right) = \dfrac{\pi}{3}$
  - $\arcsin(1) = \dfrac{\pi}{2}, \quad \arcsin(-1) = -\dfrac{\pi}{2}$
• **ភាពសេស** ៖ $\arcsin(-x) = -\arcsin x$`, { size: 23 }),
        invTrigGraph(720, 155, 500, 375, 'asin'),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖  តម្លៃនៃ $\arcsin x$ តែងតែស្ថិតនៅក្នុងចន្លោះ $\left[-\dfrac{\pi}{2}, \dfrac{\pi}{2}\right]$ (កាដ្រង់ទី I និង IV) ជានិច្ច!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('២.២ អនុគមន៍ y = arccos x (cos⁻¹ x)'),
        card(60, 155, 640, 375, 'លក្ខណៈនៃអនុគមន៍ y = arccos x', R`• **និយមន័យ** ៖ $y = \arccos x \iff \cos y = x$
• **ដែនកំណត់** ៖ $D = [-1, \ 1]$
• **សំណុំតម្លៃ (Range)** ៖ $[0, \ \pi]$
• **តម្លៃពិសេស** ៖
  - $\arccos(1) = 0$
  - $\arccos\left(\dfrac{\sqrt{3}}{2}\right) = \dfrac{\pi}{6}, \quad \arccos\left(\dfrac{1}{2}\right) = \dfrac{\pi}{3}$
  - $\arccos(0) = \dfrac{\pi}{2}$
  - $\arccos(-1) = \pi$
• **រូបមន្តមុំផ្ទុយ** ៖ $\arccos(-x) = \pi - \arccos x$`, { size: 23 }),
        invTrigGraph(720, 155, 500, 375, 'acos'),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖  តម្លៃនៃ $\arccos x$ តែងតែស្ថិតនៅក្នុងចន្លោះ $[0, \pi]$ (កាដ្រង់ទី I និង II) ជានិច្ច!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.៣ អនុគមន៍ y = arctan x (tan⁻¹ x)'),
        card(60, 155, 640, 375, 'លក្ខណៈនៃអនុគមន៍ y = arctan x', R`• **និយមន័យ** ៖ $y = \arctan x \iff \tan y = x$
• **ដែនកំណត់** ៖ $D = \mathbb{R} = (-\infty, \ +\infty)$
• **សំណុំតម្លៃ (Range)** ៖ $\left(-\dfrac{\pi}{2}, \ \dfrac{\pi}{2}\right)$
• **អាស៊ីមតូតដេក** ៖ បន្ទាត់ $y = \dfrac{\pi}{2}$ និង $y = -\dfrac{\pi}{2}$
• **តម្លៃពិសេស** ៖
  - $\arctan(0) = 0$
  - $\arctan\left(\dfrac{\sqrt{3}}{3}\right) = \dfrac{\pi}{6}, \quad \arctan(1) = \dfrac{\pi}{4}, \quad \arctan(\sqrt{3}) = \dfrac{\pi}{3}$
• **ភាពសេស** ៖ $\arctan(-x) = -\arctan x$`, { size: 23 }),
        invTrigGraph(720, 155, 500, 375, 'atan'),
        S.box(60, 545, 1160, 80, R`!!លក្ខណៈពិសេស!! ៖  អនុគមន៍ $y = \arctan x$ កំណត់លើ $\mathbb{R}$ ទាំងមូល និងមានអាស៊ីមតូតដេកពីរគឺ $y = \pm\dfrac{\pi}{2}$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('៣.១ លក្ខណៈសមាសនៃអនុគមន៍ច្រាស'),
        card(60, 160, 560, 360, 'លក្ខណៈ f(f⁻¹(x)) = x', R`ចំពោះគ្រប់ $x$ ក្នុងដែនកំណត់ ៖
❶ **ស៊ីនុស** ៖
$$\sin(\arcsin x) = x \quad (-1 \le x \le 1)$$
❷ **កូស៊ីនុស** ៖
$$\cos(\arccos x) = x \quad (-1 \le x \le 1)$$
❸ **តង់សង់** ៖
$$\tan(\arctan x) = x \quad (\forall x \in \mathbb{R})$$

• ឧទាហរណ៍ ៖
  - $\sin(\arcsin 0.8) = 0.8$
  - $\cos(\arccos(-0.5)) = -0.5$
  - $\tan(\arctan 100) = 100$`, { size: 24 }),
        card(660, 160, 560, 360, 'លក្ខណៈ f⁻¹(f(x)) = x', R`ចំពោះគ្រប់ $x$ ក្នុងសំណុំតម្លៃចម្បង ៖
❶ **ស៊ីនុស** ៖
$$\arcsin(\sin x) = x \quad \left(-\frac{\pi}{2} \le x \le \frac{\pi}{2}\right)$$
❷ **កូស៊ីនុស** ៖
$$\arccos(\cos x) = x \quad (0 \le x \le \pi)$$
❸ **តង់សង់** ៖
$$\arctan(\tan x) = x \quad \left(-\frac{\pi}{2} < x < \frac{\pi}{2}\right)$$

• បើ $x$ ក្រៅចន្លោះនេះ ត្រូវបម្លែងមុំផ្តុំជាមុនសិន!`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ទំនាក់ទំនងបន្ថែម!! ៖  $\arcsin x + \arccos x = \dfrac{\pi}{2}$  ចំពោះគ្រប់ $x \in [-1, 1]$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ គណនាតម្លៃនៃកន្សោមច្រាស'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ១ ៖!!  គណនាតម្លៃនៃ  $A = \arcsin\left(-\dfrac{1}{2}\right) + \arccos\left(-\dfrac{\sqrt{2}}{2}\right) + \arctan(1)$  ។`, { size: 26 }),
        s(100, 230, 1080, R`• $\arcsin\left(-\dfrac{1}{2}\right) = -\arcsin\left(\dfrac{1}{2}\right) = -\dfrac{\pi}{6}$ (ព្រោះក្នុងចន្លោះ $[-\pi/2, \pi/2]$)`),
        s(100, 295, 1080, R`• $\arccos\left(-\dfrac{\sqrt{2}}{2}\right) = \pi - \arccos\left(\dfrac{\sqrt{2}}{2}\right) = \pi - \dfrac{\pi}{4} = \dfrac{3\pi}{4}$ (ព្រោះក្នុងចន្លោះ $[0, \pi]$)`),
        s(100, 360, 1080, R`• $\arctan(1) = \dfrac{\pi}{4}$`),
        s(100, 425, 1080, R`• បូកបញ្ចូលគ្នា ៖  $A = -\dfrac{\pi}{6} + \dfrac{3\pi}{4} + \dfrac{\pi}{4} = -\dfrac{\pi}{6} + \pi = \dfrac{5\pi}{6}$`),
        S.box(60, 505, 1160, 105, R`!!ចម្លើយ!! ៖  $A = \dfrac{5\pi}{6}$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ គណនាតម្លៃត្រីកោណមាត្រនៃមុំច្រាស'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ២ ៖!!  គណនាតម្លៃនៃ  $B = \cos\left(\arcsin\dfrac{3}{5}\right)$  និង  $C = \sin\left(2\arctan 2\right)$  ។`, { size: 26 }),
        s(100, 230, 1080, R`• ចំពោះ $B$ ៖ តាង $\theta = \arcsin\dfrac{3}{5} \implies \sin\theta = \dfrac{3}{5}$ ដែល $\theta \in \left(0, \dfrac{\pi}{2}\right)$
  $\implies \cos\theta = \sqrt{1 - \sin^2\theta} = \sqrt{1 - \left(\dfrac{3}{5}\right)^2} = \dfrac{4}{5} \implies B = \dfrac{4}{5}$`),
        s(100, 320, 1080, R`• ចំពោះ $C$ ៖ តាង $\alpha = \arctan 2 \implies \tan\alpha = 2$ នាំឱ្យ ៖
  $C = \sin(2\alpha) = \dfrac{2\tan\alpha}{1 + \tan^2\alpha} = \dfrac{2(2)}{1 + 2^2} = \dfrac{4}{5}$`),
        S.box(60, 495, 1160, 115, R`!!សន្និដ្ឋាន!! ៖  $B = \dfrac{4}{5}$  និង  $C = \dfrac{4}{5}$  (លទ្ធផលទាំងពីរស្មើគ្នា)!`, { size: 28, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('សង្ខេបជំពូកទី ៣ មេរៀនទី ៣ ៖ អនុគមន៍ច្រាស'),
        card(60, 160, 560, 360, 'តារាងដែនកំណត់ & សំណុំតម្លៃ', R`$$\begin{array}{|c|c|c|}
\hline
\text{អនុគមន៍} & \text{ដែនកំណត់ } D & \text{សំណុំតម្លៃ (Range)} \\
\hline
y = \arcsin x & [-1, 1] & [-\frac{\pi}{2}, \frac{\pi}{2}] \\
\hline
y = \arccos x & [-1, 1] & [0, \pi] \\
\hline
y = \arctan x & \mathbb{R} & (-\frac{\pi}{2}, \frac{\pi}{2}) \\
\hline
\end{array}$$
• $\arcsin(-x) = -\arcsin x$
• $\arccos(-x) = \pi - \arccos x$
• $\arctan(-x) = -\arctan x$`, { size: 23 }),
        card(660, 160, 560, 360, 'រូបមន្តសំខាន់ៗ', R`• $\arcsin x + \arccos x = \dfrac{\pi}{2}$
• $\cos(\arcsin x) = \sqrt{1 - x^2}$
• $\sin(\arccos x) = \sqrt{1 - x^2}$
• $\sin(2\arctan t) = \dfrac{2t}{1 + t^2}$
• $\cos(2\arctan t) = \dfrac{1 - t^2}{1 + t^2}$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 12 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`គណនាតម្លៃនៃ $\arccos\left(-\dfrac{1}{2}\right)$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$-\dfrac{\pi}{3}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{2\pi}{3}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{\pi}{3}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{4\pi}{3}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\arccos(-\frac{1}{2}) = \pi - \arccos(\frac{1}{2}) = \pi - \frac{\pi}{3} = \frac{2\pi}{3}$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 13 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`តើតម្លៃនៃកន្សោម $\sin\left(\arccos\dfrac{4}{5}\right)$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{3}{5}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{4}{5}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\dfrac{1}{5}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{\sqrt{3}}{2}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\sin(\arccos x) = \sqrt{1 - x^2} = \sqrt{1 - (4/5)^2} = \frac{3}{5}$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 14 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`គណនាតម្លៃនៃ $\arcsin\left(\sin\dfrac{5\pi}{6}\right)$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{5\pi}{6}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{\pi}{6}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$-\dfrac{\pi}{6}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{\pi}{3}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\sin\frac{5\pi}{6} = \frac{1}{2} \implies \arcsin(\frac{1}{2}) = \frac{\pi}{6}$ ស្ថិតក្នុងចន្លោះ $[-\pi/2, \pi/2]$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ១៣០–១៣៥)'),
        S.box(80, 160, 1120, 350, R`!!១.!! គណនាតម្លៃពិតប្រាកដនៃ ៖
    ក. $\arcsin\left(-\dfrac{\sqrt{3}}{2}\right), \quad \arccos\left(-\dfrac{1}{2}\right), \quad \arctan(-\sqrt{3})$
    ខ. $\arcsin\left(\sin\dfrac{2\pi}{3}\right), \quad \arccos\left(\cos\dfrac{7\pi}{6}\right), \quad \arctan\left(\tan\dfrac{3\pi}{4}\right)$
!!២.!! គណនាតម្លៃនៃកន្សោម ៖
    ក. $A = \tan\left(\arccos\dfrac{3}{5}\right)$
    ខ. $B = \sin\left(\arcsin\dfrac{1}{3} + \arccos\dfrac{1}{3}\right)$
!!៣.!! ដោះស្រាយសមីការ $\arcsin(2x) = \dfrac{\pi}{6}$`, { size: 24, lh: '1.6' })
      ]),

      /* 16 */ S.homework(R`!!១.!! គណនាតម្លៃនៃ  $A = \cos\left[2\arcsin\left(-\dfrac{1}{3}\right)\right]$  ។
!!២.!! បង្ហាញថា  $\arctan\left(\dfrac{1}{2}\right) + \arctan\left(\dfrac{1}{3}\right) = \dfrac{\pi}{4}$  ។
!!៣.!! ដោះស្រាយសមីការ  $\arcsin x + \arcsin(2x) = \dfrac{\pi}{3}$  ។`),

      /* 17 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី៣ អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ (១៧ ស្លាយ)',
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 3,
      lesson: 'មេរៀនទី ៣ ៖ អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណនៃអនុគមន៍ច្រាស', slide: 3 },
        { title: '២. អនុគមន៍ arcsin, arccos, arctan', slide: 4 },
        { title: '៣. លក្ខណៈ & ក្រាបនៃអនុគមន៍ច្រាស', slide: 7 },
        { title: '៤. ឧទាហរណ៍គំរូ & អនុវត្តជាក់ស្តែង', slide: 8 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 10 }
      ],
      theme: 'school',
      slides: slides
    };
  }



  // =========================================================================
  // ថ្នាក់ទី១១ ជំពូកទី៣ មេរៀនទី៤ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រ — book pages 136–150
  // =========================================================================
  function trigBasicEq(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, trigCircle = K.trigCircle, trigGraph = K.trigGraph, invTrigGraph = K.invTrigGraph, trigEqCircle = K.trigEqCircle;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៣==        មេរៀនទី៤', 'សមីការនិងវិសមីការត្រីកោណមាត្រ', K.info),

      /* 2 */ K.toc([
        '==១. សមីការស៊ីនុស sin x = a==',
        '២. សមីការកូស៊ីនុស cos x = a',
        '==៣. សមីការ tan x = a & cot x = a==',
        '៤. វិសមីការត្រីកោណមាត្រគ្រឹះ',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`ដោះស្រាយសមីការស៊ីនុស $\sin x = a$ និងកំណត់លក្ខខណ្ឌមានឫសលើរង្វង់ត្រីកោណមាត្រ`,
        R`ដោះស្រាយសមីការកូស៊ីនុស $\cos x = a$ និងករណីពិសេស ($0, 1, -1$)`,
        R`ដោះស្រាយសមីការតង់សង់ $\tan x = a$ និងកូតង់សង់ $\cot x = a$ ជាមួយខួប $+k\pi$`,
        R`ដោះស្រាយវិសមីការត្រីកោណមាត្រគ្រឹះ $\sin x > a, \cos x \le a$ ដោយកំណត់ធ្នូចម្លើយលើរង្វង់ឯកតា`
      ]),

      /* 4 */ page([
        sec('១.១ សមីការស៊ីនុស ៖ sin x = a'),
        card(60, 155, 640, 375, 'រូបមន្ត & ការបកស្រាយធរណីមាត្រ', R`• បើ $|a| > 1$ ៖ សមីការ**គ្មានឫស** (បន្ទាត់ $y = a$ មិនកាត់រង្វង់)
• បើ $|a| \le 1$ ៖ តាង $a = \sin\alpha$
$$\sin x = \sin\alpha \iff \begin{cases} x = \alpha + 2k\pi \\ x = \pi - \alpha + 2k\pi \end{cases} \quad (k \in \mathbb{Z})$$
• **ករណីពិសេស** ៖
  - $\sin x = 0 \iff x = k\pi$
  - $\sin x = 1 \iff x = \dfrac{\pi}{2} + 2k\pi$
  - $\sin x = -1 \iff x = -\dfrac{\pi}{2} + 2k\pi$`, { size: 23 }),
        trigEqCircle(720, 155, 500, 375, { sinVal: 0.5, sinLabel: '1/2', angles: [{deg: 30, label: 'π/6', color: '#2b8a3e'}, {deg: 150, label: '5π/6', color: '#2b8a3e'}] }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖  សមីការស៊ីនុស $\sin x = a$ ត្រូវគ្នានឹងបន្ទាត់ដេក $y = a$ កាត់រង្វង់ត្រង់ពីរចំណុច $\alpha$ និង $\pi - \alpha$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ សមីការស៊ីនុស'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  ដោះស្រាយសមីការ  $\sin\left(2x - \dfrac{\pi}{3}\right) = \dfrac{\sqrt{3}}{2}$  លើសំណុំ $\mathbb{R}$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• ជំនួស $\dfrac{\sqrt{3}}{2} = \sin\dfrac{\pi}{3}$ ៖  $\sin\left(2x - \dfrac{\pi}{3}\right) = \sin\dfrac{\pi}{3}$`),
        s(100, 290, 1080, R`• ករណី ១ ៖  $2x - \dfrac{\pi}{3} = \dfrac{\pi}{3} + 2k\pi \implies 2x = \dfrac{2\pi}{3} + 2k\pi \implies x = \dfrac{\pi}{3} + k\pi$`),
        s(100, 355, 1080, R`• ករណី ២ ៖  $2x - \dfrac{\pi}{3} = \pi - \dfrac{\pi}{3} + 2k\pi \implies 2x = \dfrac{2\pi}{3} + \dfrac{\pi}{3} + 2k\pi = \pi + 2k\pi \implies x = \dfrac{\pi}{2} + k\pi$`),
        S.box(60, 485, 1160, 125, R`!!ដូចនេះ!!  សំណុំឫសនៃសមីការគឺ ៖
$$x = \frac{\pi}{3} + k\pi \quad \text{ឬ} \quad x = \frac{\pi}{2} + k\pi \quad (k \in \mathbb{Z})$$`, { size: 26, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('២.១ សមីការកូស៊ីនុស ៖ cos x = a'),
        card(60, 155, 640, 375, 'រូបមន្ត & ការបកស្រាយធរណីមាត្រ', R`• បើ $|a| > 1$ ៖ សមីការ**គ្មានឫស** (បន្ទាត់ $x = a$ មិនកាត់រង្វង់)
• បើ $|a| \le 1$ ៖ តាង $a = \cos\alpha$
$$\cos x = \cos\alpha \iff x = \pm\alpha + 2k\pi \quad (k \in \mathbb{Z})$$
• **ករណីពិសេស** ៖
  - $\cos x = 0 \iff x = \dfrac{\pi}{2} + k\pi$
  - $\cos x = 1 \iff x = 2k\pi$
  - $\cos x = -1 \iff x = \pi + 2k\pi$`, { size: 23 }),
        trigEqCircle(720, 155, 500, 375, { cosVal: -0.707, cosLabel: '-√2/2', angles: [{deg: 135, label: '3π/4', color: '#1971c2'}, {deg: 225, label: '-3π/4', color: '#1971c2'}] }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖  សមីការកូស៊ីនុស $\cos x = a$ ត្រូវគ្នានឹងបន្ទាត់ឈរ $x = a$ កាត់រង្វង់ត្រង់ចំណុចស៊ីមេទ្រីគ្នា $\pm\alpha$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ សមីការកូស៊ីនុស'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  ដោះស្រាយសមីការ  $\cos 3x = \cos\left(x + \dfrac{\pi}{4}\right)$  លើ $\mathbb{R}$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• តាមរូបមន្ត $\cos A = \cos B \iff A = \pm B + 2k\pi$ ៖`),
        s(100, 290, 1080, R`• ករណី ១ ($+$) ៖  $3x = x + \dfrac{\pi}{4} + 2k\pi \implies 2x = \dfrac{\pi}{4} + 2k\pi \implies x = \dfrac{\pi}{8} + k\pi$`),
        s(100, 355, 1080, R`• ករណី ២ ($-$) ៖  $3x = -\left(x + \dfrac{\pi}{4}\right) + 2k\pi \implies 4x = -\dfrac{\pi}{4} + 2k\pi \implies x = -\dfrac{\pi}{16} + \dfrac{k\pi}{2}$`),
        S.box(60, 485, 1160, 125, R`!!ដូចនេះ!!  សំណុំឫសនៃសមីការគឺ ៖
$$x = \frac{\pi}{8} + k\pi \quad \text{ឬ} \quad x = -\frac{\pi}{16} + \frac{k\pi}{2} \quad (k \in \mathbb{Z})$$`, { size: 26, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('៣.១ សមីការតង់សង់ & កូតង់សង់'),
        card(60, 160, 560, 360, 'សមីការ tan x = a (តាង a = tan α)', R`$$\tan x = \tan\alpha \iff x = \alpha + k\pi \quad (k \in \mathbb{Z})$$
• **លក្ខខណ្ឌ** ៖ $x, \alpha \neq \dfrac{\pi}{2} + k\pi$
• **ខួប** ៖ ត្រឹមតែ $+k\pi$ (ព្រោះអនុគមន៍តង់សង់មានខួប $\pi$)
• **ឧទាហរណ៍** ៖
  $$\tan x = \sqrt{3} = \tan\frac{\pi}{3} \implies x = \frac{\pi}{3} + k\pi$$
  $$\tan x = -1 = \tan\left(-\frac{\pi}{4}\right) \implies x = -\frac{\pi}{4} + k\pi$$`, { size: 24 }),
        card(660, 160, 560, 360, 'សមីការ cot x = a (តាង a = cot α)', R`$$\cot x = \cot\alpha \iff x = \alpha + k\pi \quad (k \in \mathbb{Z})$$
• **លក្ខខណ្ឌ** ៖ $x, \alpha \neq k\pi$
• **ខួប** ៖ ត្រឹមតែ $+k\pi$
• **ឧទាហរណ៍** ៖
  $$\cot x = 1 = \cot\frac{\pi}{4} \implies x = \frac{\pi}{4} + k\pi$$
  $$\cot 2x = \frac{\sqrt{3}}{3} = \cot\frac{\pi}{3} \implies 2x = \frac{\pi}{3} + k\pi \implies x = \frac{\pi}{6} + \frac{k\pi}{2}$$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំ!! ៖  សមីការ $\tan x = a$ និង $\cot x = a$ តែងតែមានឫសជានិច្ចចំពោះគ្រប់តម្លៃចំនួនពិត $a \in \mathbb{R}$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('៤.១ វិសមីការត្រីកោណមាត្រគ្រឹះ'),
        card(60, 155, 640, 375, 'វិសមីការ sin x > a និង sin x < a', R`• **ជំហានដោះស្រាយ** ៖
  1. ដោះស្រាយសមីការ $\sin x = a$ រកឫស $\alpha$ និង $\pi - \alpha$ លើរង្វង់ឯកតា
  2. គូសបន្ទាត់ដេក $y = a$
  3. បើ $\sin x > a$ ៖ យកធ្នូផ្នែកខាងលើបន្ទាត់ $y = a$
  4. បើ $\sin x < a$ ៖ យកធ្នូផ្នែកខាងក្រោមបន្ទាត់ $y = a$
  5. សរសេរចន្លោះមុំ និងបូកបន្ថែមខួប $+2k\pi$ លើចុងសងខាង ។`, { size: 23 }),
        trigEqCircle(720, 155, 500, 375, { sinVal: 0.5, sinLabel: '1/2', angles: [{deg: 30, label: 'π/6'}, {deg: 150, label: '5π/6'}], arc: {from: 30, to: 150} }),
        S.box(60, 545, 1160, 80, R`!!ឧទាហរណ៍!! ៖  $\sin x > \dfrac{1}{2} \iff x \in \left(\dfrac{\pi}{6} + 2k\pi, \ \dfrac{5\pi}{6} + 2k\pi\right) \quad (k \in \mathbb{Z})$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៤.២ វិសមីការកូស៊ីនុសគ្រឹះ'),
        card(60, 155, 640, 375, 'វិសមីការ cos x > a និង cos x ≤ a', R`• **ជំហានដោះស្រាយ** ៖
  1. ដោះស្រាយសមីការ $\cos x = a$ រកឫស $\pm\alpha$ លើរង្វង់ឯកតា
  2. គូសបន្ទាត់ឈរ $x = a$
  3. បើ $\cos x > a$ ៖ យកធ្នូផ្នែកខាងស្តាំបន្ទាត់ $x = a$
  4. បើ $\cos x \le a$ ៖ យកធ្នូផ្នែកខាងឆ្វេងបន្ទាត់ $x = a$
  5. ឧទាហរណ៍ ៖ ចំពោះ $\cos x \le \dfrac{\sqrt{2}}{2}$ ធ្នូខាងឆ្វេងគឺពី $\dfrac{\pi}{4}$ ទៅដល់ $\dfrac{7\pi}{4}$ ។`, { size: 23 }),
        trigEqCircle(720, 155, 500, 375, { cosVal: 0.707, cosLabel: '√2/2', angles: [{deg: 45, label: 'π/4'}, {deg: 315, label: '7π/4'}], arc: {from: 45, to: 315} }),
        S.box(60, 545, 1160, 80, R`!!ដំណោះស្រាយ!! ៖  $\cos x \le \dfrac{\sqrt{2}}{2} \iff x \in \left[\dfrac{\pi}{4} + 2k\pi, \ \dfrac{7\pi}{4} + 2k\pi\right] \quad (k \in \mathbb{Z})$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('សង្ខេបជំពូកទី ៣ មេរៀនទី ៤ ៖ សមីការគ្រឹះ'),
        card(60, 160, 560, 360, 'រូបមន្តសមីការគ្រឹះទាំង ៤', R`• $\sin x = \sin\alpha \iff \begin{cases} x = \alpha + 2k\pi \\ x = \pi - \alpha + 2k\pi \end{cases}$
• $\cos x = \cos\alpha \iff x = \pm\alpha + 2k\pi$
• $\tan x = \tan\alpha \iff x = \alpha + k\pi$
• $\cot x = \cot\alpha \iff x = \alpha + k\pi$
• **លក្ខខណ្ឌមានឫស** ៖
  - $\sin x = a$ និង $\cos x = a$ មានឫស $\iff -1 \le a \le 1$
  - $\tan x = a$ និង $\cot x = a$ មានឫសចំពោះគ្រប់ $a \in \mathbb{R}$`, { size: 23 }),
        card(660, 160, 560, 360, 'ករណីពិសេស', R`• $\sin x = 0 \iff x = k\pi$
• $\sin x = 1 \iff x = \dfrac{\pi}{2} + 2k\pi$
• $\sin x = -1 \iff x = -\dfrac{\pi}{2} + 2k\pi$
• $\cos x = 0 \iff x = \dfrac{\pi}{2} + k\pi$
• $\cos x = 1 \iff x = 2k\pi$
• $\cos x = -1 \iff x = \pi + 2k\pi$`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 12 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`ដោះស្រាយសមីការ  $\cos x = -\dfrac{1}{2}$  លើចន្លោះ $[0, 2\pi)$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\left\{\dfrac{\pi}{3}, \ \dfrac{5\pi}{3}\right\}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\left\{\dfrac{2\pi}{3}, \ \dfrac{4\pi}{3}\right\}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\left\{\dfrac{5\pi}{6}, \ \dfrac{7\pi}{6}\right\}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\left\{\dfrac{3\pi}{4}, \ \dfrac{5\pi}{4}\right\}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\cos x = -\frac{1}{2} = \cos\frac{2\pi}{3} \implies x = \frac{2\pi}{3}$ និង $x = 2\pi - \frac{2\pi}{3} = \frac{4\pi}{3}$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 13 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`តើសមីការ $\sin x = \dfrac{m - 1}{2}$ មានឫសកាលណា $m$ ស្ថិតក្នុងចន្លោះណា?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$-1 \le m \le 3$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$-1 \le m \le 1$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$-2 \le m \le 2$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$0 \le m \le 3$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $-1 \le \frac{m-1}{2} \le 1 \iff -2 \le m - 1 \le 2 \iff -1 \le m \le 3$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 14 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`ដោះស្រាយវិសមីការ  $\sin x \ge \dfrac{\sqrt{3}}{2}$  លើចន្លោះ $[0, 2\pi]$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\left[0, \ \dfrac{\pi}{3}\right]$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\left[\dfrac{\pi}{3}, \ \dfrac{2\pi}{3}\right]$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\left[\dfrac{\pi}{6}, \ \dfrac{5\pi}{6}\right]$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\left[\dfrac{2\pi}{3}, \ \pi\right]$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\sin x = \frac{\sqrt{3}}{2} \implies x = \frac{\pi}{3}$ និង $x = \frac{2\pi}{3}$ ធ្នូខាងលើគឺ $[\frac{\pi}{3}, \frac{2\pi}{3}]$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ១៤៥–១៥០)'),
        S.box(80, 160, 1120, 350, R`!!១.!! ដោះស្រាយសមីការត្រីកោណមាត្រលើ $\mathbb{R}$ ៖
    ក. $2\sin 3x + \sqrt{2} = 0$
    ខ. $2\cos\left(2x - \dfrac{\pi}{4}\right) = -\sqrt{3}$
    គ. $\tan\left(3x + \dfrac{\pi}{6}\right) = \sqrt{3}$
    ឃ. $\cot\left(x - \dfrac{\pi}{3}\right) = -1$
!!២.!! ដោះស្រាយវិសមីការត្រីកោណមាត្រលើចន្លោះ $[0, 2\pi]$ ៖
    ក. $\cos x > -\dfrac{1}{2}$
    ខ. $\sin 2x \le \dfrac{\sqrt{2}}{2}$`, { size: 24, lh: '1.6' })
      ]),

      /* 16 */ S.homework(R`!!១.!! ដោះស្រាយសមីការ  $\sin\left(2x + \dfrac{\pi}{6}\right) = \cos x$  លើ $\mathbb{R}$ ។
!!២.!! ដោះស្រាយសមីការ  $\tan 2x \cdot \tan x = 1$  លើ $\mathbb{R}$ ។
!!៣.!! ដោះស្រាយវិសមីការ  $2\cos^2 x - 1 > 0$  លើចន្លោះ $[0, 2\pi]$ ។`),

      /* 17 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី៤ សមីការនិងវិសមីការត្រីកោណមាត្រ (១៧ ស្លាយ)',
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 4,
      lesson: 'មេរៀនទី ៤ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រ',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សមីការស៊ីនុស sin x = a', slide: 3 },
        { title: '២. សមីការកូស៊ីនុស cos x = a', slide: 5 },
        { title: '៣. សមីការ tan x = a & cot x = a', slide: 7 },
        { title: '៤. វិសមីការត្រីកោណមាត្រគ្រឹះ', slide: 8 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 10 }
      ],
      theme: 'school',
      slides: slides
    };
  }



  // =========================================================================
  // ថ្នាក់ទី១១ ជំពូកទី៣ មេរៀនទី៥ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត — book pages 151–175
  // =========================================================================
  function trigAdvancedEq(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, trigCircle = K.trigCircle, trigGraph = K.trigGraph, invTrigGraph = K.invTrigGraph, trigEqCircle = K.trigEqCircle;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៣==        មេរៀនទី៥', 'សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត', K.info),

      /* 2 */ K.toc([
        '==១. សមីការលីនេអ៊ែរ a sin x + b cos x = c==',
        '២. សមីការដឺក្រេទី ២ & សមីការអូម៉ូសែន',
        '==៣. ប្រព័ន្ធសមីការត្រីកោណមាត្រ==',
        '៤. វិសមីការត្រីកោណមាត្រកម្រិតខ្ពស់',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`ដោះស្រាយសមីការលីនេអ៊ែរ $a\sin x + b\cos x = c$ និងកំណត់តម្លៃប៉ារ៉ាម៉ែត្រ $m$ ឱ្យសមីការមានឫស`,
        R`ដោះស្រាយសមីការដឺក្រេទី ២ ធៀបនឹងអនុគមន៍ត្រីកោណមាត្រ និងសមីការអូម៉ូសែនដឺក្រេទី ២`,
        R`ដោះស្រាយប្រព័ន្ធសមីការត្រីកោណមាត្រដែលមានពីរអថេរ $x, y$ ដោយប្រើរូបមន្តបម្លែងផល`,
        R`ដោះស្រាយវិសមីការត្រីកោណមាត្រកម្រិតខ្ពស់ដោយវិធីសិក្សាសញ្ញាកត្តា`
      ]),

      /* 4 */ page([
        sec('១.១ សមីការលីនេអ៊ែរ ៖ a sin x + b cos x = c'),
        card(60, 160, 560, 360, 'លក្ខខណ្ឌមានឫស & វិធីដោះស្រាយ', R`ពិនិត្យសមីការ $a\sin x + b\cos x = c$ ($a^2 + b^2 \neq 0$) ៖
• **លក្ខខណ្ឌមានឫស** ៖
$$a^2 + b^2 \ge c^2$$
*(បើ $a^2 + b^2 < c^2$ សមីការគ្មានឫស)*

• **វិធីសាស្ត្រដោះស្រាយ** ៖
ចែកអង្គទាំងពីរនឹង $\sqrt{a^2 + b^2}$ ៖
$$\frac{a}{\sqrt{a^2+b^2}}\sin x + \frac{b}{\sqrt{a^2+b^2}}\cos x = \frac{c}{\sqrt{a^2+b^2}}$$
តាង $\cos\varphi = \frac{a}{\sqrt{a^2+b^2}}$ និង $\sin\varphi = \frac{b}{\sqrt{a^2+b^2}}$ ៖
$$\sin(x + \varphi) = \frac{c}{\sqrt{a^2+b^2}}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ ៖ √3 sin x + cos x = 1', R`• គណនា $\sqrt{a^2 + b^2} = \sqrt{(\sqrt{3})^2 + 1^2} = 2$
• ចែកអង្គទាំងពីរនឹង $2$ ៖
$$\frac{\sqrt{3}}{2}\sin x + \frac{1}{2}\cos x = \frac{1}{2}$$
• ជំនួស $\cos\frac{\pi}{6} = \frac{\sqrt{3}}{2}$ និង $\sin\frac{\pi}{6} = \frac{1}{2}$ ៖
$$\sin\left(x + \frac{\pi}{6}\right) = \sin\frac{\pi}{6}$$
$$\begin{cases} x + \frac{\pi}{6} = \frac{\pi}{6} + 2k\pi \Rightarrow x = 2k\pi \\ x + \frac{\pi}{6} = \pi - \frac{\pi}{6} + 2k\pi \Rightarrow x = \frac{2\pi}{3} + 2k\pi \end{cases}$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ដំណោះស្រាយ!! ៖  $x = 2k\pi$ ឬ $x = \dfrac{2\pi}{3} + 2k\pi \quad (k \in \mathbb{Z})$ ។`, { size: 27, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('១.២ សមីការលីនេអ៊ែរមានប៉ារ៉ាម៉ែត្រ m'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  រកតម្លៃ $m$ ដើម្បីឱ្យសមីការ  $(m - 1)\sin x + \sqrt{3}\cos x = m + 1$  មានឫសលើ $\mathbb{R}$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• សមីការមានរាង $a\sin x + b\cos x = c$ ដែល $a = m - 1, \ b = \sqrt{3}, \ c = m + 1$`),
        s(100, 290, 1080, R`• លក្ខខណ្ឌដើម្បីឱ្យសមីការមានឫសគឺ ៖  $a^2 + b^2 \ge c^2$`),
        s(100, 355, 1080, R`• ជំនួសចូល ៖  $(m - 1)^2 + (\sqrt{3})^2 \ge (m + 1)^2$
$$\iff m^2 - 2m + 1 + 3 \ge m^2 + 2m + 1 \iff 3 \ge 4m \iff m \le \frac{3}{4}$$`),
        S.box(60, 485, 1160, 125, R`!!សន្និដ្ឋាន!! ៖  សមីការមានឫសលុះត្រាតែ  $m \le \dfrac{3}{4}$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('២.១ សមីការដឺក្រេទី ២ ធៀបនឹងអនុគមន៍ត្រីកោណមាត្រ'),
        card(60, 160, 560, 360, 'ទម្រង់ទូទៅ & វិធីដោះស្រាយ', R`• **ទម្រង់សមីការ** ៖
$$A\sin^2 x + B\sin x + C = 0$$
$$A\cos^2 x + B\cos x + C = 0$$

• **វិធីសាស្ត្រដោះស្រាយ** ៖
  - តាងអថេរជំនួយ $t = \sin x$ ឬ $t = \cos x$ (លក្ខខណ្ឌ $-1 \le t \le 1$)
  - ដោះស្រាយសមីការដឺក្រេទី ២ រក $t$
  - យកតម្លៃ $t$ ដែលផ្ទៀងផ្ទាត់លក្ខខណ្ឌមកដោះស្រាយសមីការត្រីកោណមាត្រគ្រឹះ`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ ៖ 2 sin²x + 3 cos x − 3 = 0', R`• ជំនួស $\sin^2 x = 1 - \cos^2 x$ ៖
$$2(1 - \cos^2 x) + 3\cos x - 3 = 0$$
$$\iff -2\cos^2 x + 3\cos x - 1 = 0$$
$$\iff 2\cos^2 x - 3\cos x + 1 = 0$$
• ផលបូកមេគុណ $a + b + c = 2 - 3 + 1 = 0$ ៖
  - $\cos x = 1 \implies x = 2k\pi$
  - $\cos x = \frac{1}{2} \implies x = \pm\frac{\pi}{3} + 2k\pi$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ដំណោះស្រាយ!! ៖  $x = 2k\pi$ ឬ $x = \pm\dfrac{\pi}{3} + 2k\pi \quad (k \in \mathbb{Z})$ ។`, { size: 27, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.២ សមីការអូម៉ូសែន ៖ a sin²x + b sin x cos x + c cos²x = d'),
        card(60, 160, 560, 360, 'វិធីសាស្ត្រដោះស្រាយ', R`• **វិធីសាស្ត្រ** ៖
  1. សរសេរ $d = d(\sin^2 x + \cos^2 x)$
  2. ពិនិត្យករណី $\cos x = 0$
  3. បើ $\cos x \neq 0$ ចែកអង្គទាំងពីរនឹង $\cos^2 x$
  4. នាំទៅរកសមីការដឺក្រេទី ២ នៃ $\tan x$ ៖
$$(a - d)\tan^2 x + b\tan x + (c - d) = 0$$
  5. ដោះស្រាយរក $\tan x$ រួចទាញរក $x$ ។`, { size: 24 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ ៖ 3 sin²x + 2 sin x cos x = 2', R`• សរសេរ $2 = 2(\sin^2 x + \cos^2 x)$ ៖
$$3\sin^2 x + 2\sin x\cos x = 2\sin^2 x + 2\cos^2 x$$
$$\iff \sin^2 x + 2\sin x\cos x - 2\cos^2 x = 0$$
• ចែកនឹង $\cos^2 x \neq 0$ ៖
$$\tan^2 x + 2\tan x - 2 = 0$$
• $\Delta' = 1^2 - 1(-2) = 3$ ៖
$$\tan x = -1 \pm \sqrt{3}$$
$$\implies x = \arctan(-1 \pm \sqrt{3}) + k\pi$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ចម្លើយ!! ៖  $x = \arctan(-1 \pm \sqrt{3}) + k\pi \quad (k \in \mathbb{Z})$ ។`, { size: 27, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('៣.១ ប្រព័ន្ធសមីការត្រីកោណមាត្រ'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  ដោះស្រាយប្រព័ន្ធសមីការ  $\begin{cases} x + y = \dfrac{\pi}{3} \\ \sin x + \sin y = 1 \end{cases}$  លើ $\mathbb{R} \times \mathbb{R}$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• បម្លែង $\sin x + \sin y = 2\sin\left(\dfrac{x+y}{2}\right)\cos\left(\dfrac{x-y}{2}\right) = 1$`),
        s(100, 290, 1080, R`• ជំនួស $x + y = \dfrac{\pi}{3} \implies \dfrac{x+y}{2} = \dfrac{\pi}{6}$ ៖  $2\sin\dfrac{\pi}{6}\cos\left(\dfrac{x-y}{2}\right) = 1$`),
        s(100, 355, 1080, R`• ដោយ $\sin\dfrac{\pi}{6} = \dfrac{1}{2}$ នាំឱ្យ ៖  $2\left(\dfrac{1}{2}\right)\cos\left(\dfrac{x-y}{2}\right) = 1 \iff \cos\left(\dfrac{x-y}{2}\right) = 1 \implies \dfrac{x-y}{2} = 2k\pi \implies x - y = 4k\pi$`),
        s(100, 420, 1080, R`• ដោះស្រាយប្រព័ន្ធបូក-ដក ៖  $x = \dfrac{\pi}{6} + 2k\pi, \quad y = \dfrac{\pi}{6} - 2k\pi$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  សំណុំគូចម្លើយគឺ  $(x, y) = \left(\dfrac{\pi}{6} + 2k\pi, \ \dfrac{\pi}{6} - 2k\pi\right) \quad (k \in \mathbb{Z})$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('៤.១ វិសមីការត្រីកោណមាត្រកម្រិតខ្ពស់'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  ដោះស្រាយវិសមីការ  $\sin x - \cos x > 0$  លើចន្លោះ $[0, 2\pi]$ ។`, { size: 27 }),
        s(100, 225, 1080, R`• គុណនឹង $\dfrac{\sqrt{2}}{2}$ ៖  $\dfrac{\sqrt{2}}{2}\sin x - \dfrac{\sqrt{2}}{2}\cos x > 0 \iff \sin\left(x - \dfrac{\pi}{4}\right) > 0$`),
        s(100, 290, 1080, R`• ពិនិត្យលើរង្វង់ត្រីកោណមាត្រ ស៊ីនុសវិជ្ជមានក្នុងកាដ្រង់ទី I និង II ៖  $0 < x - \dfrac{\pi}{4} < \pi$`),
        s(100, 355, 1080, R`• បូកថែម $\dfrac{\pi}{4}$ គ្រប់អង្គ ៖  $\dfrac{\pi}{4} < x < \pi + \dfrac{\pi}{4} = \dfrac{5\pi}{4}$`),
        s(100, 420, 1080, R`• លើសំណុំ $\mathbb{R}$ ទាំងមូល ៖  $x \in \left(\dfrac{\pi}{4} + 2k\pi, \ \dfrac{5\pi}{4} + 2k\pi\right) \quad (k \in \mathbb{Z})$`),
        S.box(60, 495, 1160, 115, R`!!ចម្លើយ!! ៖  $x \in \left(\dfrac{\pi}{4} + 2k\pi, \ \dfrac{5\pi}{4} + 2k\pi\right) \quad (k \in \mathbb{Z})$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('សង្ខេបជំពូកទី ៣ មេរៀនទី ៥ ៖ វិធីសាស្ត្រដោះស្រាយ'),
        card(60, 160, 560, 360, 'សមីការទម្រង់ពិសេស', R`• **លីនេអ៊ែរ $a\sin x + b\cos x = c$** ៖
  - លក្ខខណ្ឌមានឫស ៖ $a^2 + b^2 \ge c^2$
  - ចែកនឹង $\sqrt{a^2+b^2} \to \sin(x+\varphi) = \frac{c}{\sqrt{a^2+b^2}}$
• **ដឺក្រេទី ២** ៖ តាង $t = \sin x$ ឬ $t = \cos x$ ($-1 \le t \le 1$)
• **អូម៉ូសែន** ៖ ចែកនឹង $\cos^2 x \to$ សមីការដឺក្រេទី ២ នៃ $\tan x$`, { size: 23 }),
        card(660, 160, 560, 360, 'ប្រព័ន្ធសមីការ & វិសមីការ', R`• **ប្រព័ន្ធសមីការ** ៖
  - ប្រើរូបមន្តបម្លែងផលបូកទៅជាផលគុណ
  - ជំនួសតម្លៃមុំ $x+y$ ឬ $x-y$
• **វិសមីការកម្រិតខ្ពស់** ៖
  - បម្លែងទៅជាផលគុណកត្តា ឬផលធៀប
  - សិក្សាសញ្ញាកត្តានីមួយៗលើរង្វង់ត្រីកោណមាត្រ`, { size: 24 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 11 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`តើសមីការ $\sin x + \cos x = \sqrt{3}$ មានឫសលើ $\mathbb{R}$ ឬទេ?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`មានឫសច្រើនរាប់មិនអស់`, { size: 24, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`គ្មានឫស`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`មានឫសតែមួយគត់`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`មានឫសពីរគត់`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $a^2 + b^2 = 1^2 + 1^2 = 2 < c^2 = (\sqrt{3})^2 = 3$ មិនផ្ទៀងផ្ទាត់លក្ខខណ្ឌមានឫស)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 12 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`ដោះស្រាយសមីការ  $\sin x + \cos x = 1$  លើចន្លោះ $[0, 2\pi)$ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\left\{0, \ \dfrac{\pi}{2}\right\}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\left\{\dfrac{\pi}{4}, \ \dfrac{3\pi}{4}\right\}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\left\{0, \ \pi\right\}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\left\{\dfrac{\pi}{2}, \ \pi\right\}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\sin(x + \frac{\pi}{4}) = \frac{\sqrt{2}}{2} \implies x + \frac{\pi}{4} = \frac{\pi}{4} \Rightarrow x = 0$ ឬ $x + \frac{\pi}{4} = \frac{3\pi}{4} \Rightarrow x = \frac{\pi}{2}$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 13 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`ដោះស្រាយសមីការអូម៉ូសែន  $\sin^2 x - 4\sin x\cos x + 3\cos^2 x = 0$  ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$x = \dfrac{\pi}{4} + k\pi$ ឬ $x = \arctan 3 + k\pi$`, { size: 24, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$x = \pm\dfrac{\pi}{4} + k\pi$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$x = \dfrac{\pi}{3} + k\pi$ ឬ $x = \dfrac{\pi}{6} + k\pi$`, { size: 24, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$x = k\pi$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះចែកនឹង $\cos^2 x \to \tan^2 x - 4\tan x + 3 = 0 \implies \tan x = 1$ ឬ $\tan x = 3$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ១៦៦–១៧៥)'),
        S.box(80, 160, 1120, 350, R`!!១.!! ដោះស្រាយសមីការលីនេអ៊ែរលើ $\mathbb{R}$ ៖
    ក. $\sqrt{3}\sin 2x + \cos 2x = \sqrt{2}$
    ខ. $\sin 3x - \sqrt{3}\cos 3x = 1$
!!២.!! ដោះស្រាយសមីការដឺក្រេទី ២ និងអូម៉ូសែន ៖
    ក. $4\cos^2 x - 4\cos x - 3 = 0$
    ខ. $2\sin^2 x + \sin x\cos x - \cos^2 x = 1$
!!៣.!! ដោះស្រាយប្រព័ន្ធសមីការ ៖
    $\begin{cases} x + y = \dfrac{2\pi}{3} \\ \cos x + \cos y = 1 \end{cases}$`, { size: 24, lh: '1.6' })
      ]),

      /* 15 */ S.homework(R`!!១.!! ដោះស្រាយសមីការ  $\sin x + \sqrt{3}\cos x = 2\sin 3x$  លើ $\mathbb{R}$ ។
!!២.!! ដោះស្រាយសមីការ  $2\sin^3 x + 4\cos^3 x = 3\sin x$  ។
!!៣.!! ដោះស្រាយវិសមីការ  $\sin 2x - \cos 2x \ge 0$  លើចន្លោះ $[0, \pi]$ ។`),

      /* 16 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី៥ សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត (១៦ ស្លាយ)',
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 5,
      lesson: 'មេរៀនទី ៥ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សមីការលីនេអ៊ែរ a sin x + b cos x = c', slide: 3 },
        { title: '២. សមីការដឺក្រេទី ២ & សមីការអូម៉ូសែន', slide: 5 },
        { title: '៣. ប្រព័ន្ធសមីការត្រីកោណមាត្រ', slide: 7 },
        { title: '៤. វិសមីការត្រីកោណមាត្រកម្រិតខ្ពស់', slide: 8 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 9 }
      ],
      theme: 'school',
      slides: slides
    };
  }



  function trigEquations(A) { return trigBasicEq(A); }

  function matrices(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, matrixDiagram = K.matrixDiagram, matrixMultDiagram = K.matrixMultDiagram;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៤==        មេរៀនទី១', 'ម៉ាទ្រីស', K.info),

      /* 2 */ K.toc([
        '==១. សញ្ញាណ & ប្រភេទនៃម៉ាទ្រីស==',
        '២. ម៉ាទ្រីសស្មើគ្នា',
        '==៣. ប្រមាណវិធីលើម៉ាទ្រីស (បូក ដក គុណ)==',
        '៤. ម៉ាទ្រីសច្រាសលំដាប់ ២ & សមីការម៉ាទ្រីស',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`យល់ដឹងពីសញ្ញាណ លំដាប់ $m \times n$ និងប្រភេទនៃម៉ាទ្រីស (ជួរដេក ជួរឈរ ការ៉េ សូន្យ ឯកតា ឆ្លាស់)`,
        R`កំណត់លក្ខខណ្ឌម៉ាទ្រីសស្មើគ្នា និងគណនាអថេរមិនស្គាល់ក្នុងសមភាពម៉ាទ្រីស`,
        R`អនុវត្តប្រមាណវិធីបូក ដក គុណស្កាលែ និងគុណពីរម៉ាទ្រីស ព្រមទាំងលក្ខណៈសំខាន់ៗរបស់វា`,
        R`គណនាម៉ាទ្រីសច្រាសលំដាប់ $2$ និងដោះស្រាយសមីការម៉ាទ្រីស $AX = B \iff X = A^{-1}B$`
      ]),

      /* 4 */ page([
        sec('១.១ សញ្ញាណ និងនិយមន័យនៃម៉ាទ្រីស'),
        card(60, 160, 560, 360, 'និយមន័យ & លំដាប់នៃម៉ាទ្រីស', R`• **និយមន័យ** ៖ ម៉ាទ្រីស គឺជាការរៀបចំនួនជាជួរដេក និងជួរឈរ ក្នុងរាងចតុកោណកែងដាក់ក្នុងវង់ក្រចក $[ \ ]$ ឬ $( \ )$ ។
• **ធាតុនៃម៉ាទ្រីស** ៖ ចំនួននីមួយៗក្នុងម៉ាទ្រីសហៅថា ធាតុ តាងដោយ $a_{ij}$ (ជួរដេកទី $i$, ជួរឈរទី $j$) ។
• **លំដាប់ $m \times n$** ៖ បើម៉ាទ្រីសមាន $m$ ជួរដេក និង $n$ ជួរឈរ គេថាម៉ាទ្រីសមាន **លំដាប់ $m \times n$** (អានថា $m$ គុណនឹង $n$) ។
• **និមិត្តសញ្ញា** ៖ $A = [a_{ij}]_{m \times n}$`, { size: 23 }),
        card(660, 160, 560, 360, 'ទម្រង់ទូទៅនៃម៉ាទ្រីស លំដាប់ m × n', R`$$A = \begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}$$
• $a_{11}, a_{12}, \dots, a_{1n}$ ជាធាតុនៃ **ជួរដេកទី ១**
• $a_{11}, a_{21}, \dots, a_{m1}$ ជាធាតុនៃ **ជួរឈរទី ១**
• ចំនួនធាតុសរុប ៖ $m \times n$ ធាតុ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំសំខាន់!! ៖ ក្នុងការសរសេរលំដាប់ម៉ាទ្រីស $m \times n$ ត្រូវចងចាំថា **ចំនួនជួរដេក ($m$) សរសេរមុន ចំនួនជួរឈរ ($n$) សរសេរក្រោយ** ជានិច្ច!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('ឧទាហរណ៍ជាក់ស្តែង ៖ ការតាងទិន្នន័យជាម៉ាទ្រីស'),
        card(60, 160, 560, 360, 'តារាងទិន្នន័យពិន្ទុ និងចំនួនសៀវភៅ', R`ហាងលក់សៀវភៅមួយកត់ត្រាការលក់ក្នុងរយៈពេល ២ ថ្ងៃ ៖
$$\begin{array}{|c|c|c|c|}
\hline
\textbf{ថ្ងៃ} & \text{គណិត} & \text{រូបវិទ្យា} & \text{គីមី} \\
\hline
\text{ថ្ងៃចន្ទ} & 120 & 85 & 64 \\
\hline
\text{ថ្ងៃអង្គារ} & 140 & 90 & 75 \\
\hline
\end{array}$$
• គេអាចតាងទិន្នន័យនេះជាម៉ាទ្រីស $A$ ទំហំ $2 \times 3$ ៖
$$A = \begin{bmatrix} 120 & 85 & 64 \\ 140 & 90 & 75 \end{bmatrix}$$`, { size: 22 }),
        card(660, 160, 560, 360, 'ការកំណត់ធាតុនីមួយៗនៃម៉ាទ្រីស A', R`ពីម៉ាទ្រីស $A = \begin{bmatrix} 120 & 85 & 64 \\ 140 & 90 & 75 \end{bmatrix}$ ខាងឆ្វេង ៖
• $a_{11} = 120$ (លក់សៀវភៅគណិតថ្ងៃចន្ទ)
• $a_{12} = 85$ (លក់សៀវភៅរូបវិទ្យាថ្ងៃចន្ទ)
• $a_{13} = 64$ (លក់សៀវភៅគីមីថ្ងៃចន្ទ)
• $a_{21} = 140$ (លក់សៀវភៅគណិតថ្ងៃអង្គារ)
• $a_{22} = 90$ (លក់សៀវភៅរូបវិទ្យាថ្ងៃអង្គារ)
• $a_{23} = 75$ (លក់សៀវភៅគីមីថ្ងៃអង្គារ)
• ចំនួនធាតុសរុប ៖ $2 \times 3 = 6$ ធាតុ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!សរុប!! ៖ ម៉ាទ្រីស $A$ មាន $2$ ជួរដេក និង $3$ ជួរឈរ $\implies$ លំដាប់ $2 \times 3$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('១.២ ប្រភេទនៃម៉ាទ្រីសពិសេសៗ'),
        card(60, 160, 560, 360, 'ម៉ាទ្រីសជួរដេក ជួរឈរ និងសូន្យ', R`• **ម៉ាទ្រីសជួរដេក** ៖ មានតែ $1$ ជួរដេក ($1 \times n$)
  - ឧទាហរណ៍ ៖ $R = \begin{bmatrix} 1 & -2 & 5 \end{bmatrix}_{1 \times 3}$
• **ម៉ាទ្រីសជួរឈរ** ៖ មានតែ $1$ ជួរឈរ ($m \times 1$)
  - ឧទាហរណ៍ ៖ $C = \begin{bmatrix} 4 \\ -1 \\ 3 \end{bmatrix}_{3 \times 1}$
• **ម៉ាទ្រីសសូន្យ ($O$)** ៖ គ្រប់ធាតុទាំងអស់ស្មើ $0$
  - ឧទាហរណ៍ ៖ $O_{2 \times 2} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$`, { size: 23 }),
        card(660, 160, 560, 360, 'ម៉ាទ្រីសការ៉េ និងម៉ាទ្រីសឯកតា', R`• **ម៉ាទ្រីសការ៉េ** ៖ ចំនួនជួរដេកស្មើចំនួនជួរឈរ ($n \times n$)
  - ឧទាហរណ៍ ៖ $S = \begin{bmatrix} 1 & 4 \\ -2 & 3 \end{bmatrix}_{2 \times 2}$
• **ម៉ាទ្រីសឯកតា ($I$)** ៖ ម៉ាទ្រីសការ៉េដែលមានធាតុលើអង្កត់ទ្រូងមេស្មើ $1$ ហើយធាតុផ្សេងទៀតស្មើ $0$ ៖
  $$I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}, \quad I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!លក្ខណៈពិសេសនៃ $I$!! ៖ ម៉ាទ្រីសឯកតា $I$ ដើរតួដូចលេខ $1$ ក្នុងវិធីគុណចំនួនពិត ៖ $A \cdot I = I \cdot A = A$ ចំពោះគ្រប់ម៉ាទ្រីសការ៉េ $A$ ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('១.៣ ម៉ាទ្រីសឆ្លាស់ (Transpose Matrix)'),
        card(60, 160, 560, 360, 'និយមន័យម៉ាទ្រីសឆ្លាស់', R`• **និយមន័យ** ៖ ម៉ាទ្រីសឆ្លាស់នៃម៉ាទ្រីស $A$ (តាងដោយ $A^T$ ឬ $A^t$) គឺបានមកពីការផ្លាស់ប្តូរ **ជួរដេកទៅជាជួរឈរ** និង **ជួរឈរទៅជាជួរដេក** ។
• បើ $A$ មានលំដាប់ $m \times n$ នោះ $A^T$ មានលំដាប់ $n \times m$ ។
• **ឧទាហរណ៍** ៖
$$A = \begin{bmatrix} 1 & 3 & 5 \\ 2 & 4 & 6 \end{bmatrix}_{2 \times 3} \implies A^T = \begin{bmatrix} 1 & 2 \\ 3 & 4 \\ 5 & 6 \end{bmatrix}_{3 \times 2}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'លក្ខណៈសំខាន់ៗនៃម៉ាទ្រីសឆ្លាស់', R`• $(A^T)^T = A$ (ឆ្លាស់ពីរដងបានដើមវិញ)
• $(A + B)^T = A^T + B^T$
• $(\alpha A)^T = \alpha A^T$ (ដែល $\alpha$ ជាចំនួនពិត)
• $(AB)^T = B^T A^T$ (!!ត្រូវប្តូរលំដាប់គុណ!!)
• **ម៉ាទ្រីសស៊ីមេទ្រី** ៖ បើ $A^T = A$ នោះ $A$ ហៅថាម៉ាទ្រីសស៊ីមេទ្រី ។
• **ម៉ាទ្រីសឆ្លាស់ស៊ីមេទ្រី** ៖ បើ $A^T = -A$ នោះ $A$ ហៅថាម៉ាទ្រីសឆ្លាស់ស៊ីមេទ្រី ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖ ជួរដេកទី $1$ នៃ $A$ ក្លាយជាជួរឈរទី $1$ នៃ $A^T$ ; ជួរដេកទី $2$ នៃ $A$ ក្លាយជាជួរឈរទី $2$ នៃ $A^T$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('២. ម៉ាទ្រីសស្មើគ្នា (Equality of Matrices)'),
        card(60, 160, 560, 360, 'លក្ខខណ្ឌម៉ាទ្រីសពីរស្មើគ្នា', R`• **លក្ខខណ្ឌ** ៖ ម៉ាទ្រីសពីរ $A$ និង $B$ ស្មើគ្នា ($A = B$) លុះត្រាតែ ៖
  1. ម៉ាទ្រីសទាំងពីរមាន **លំដាប់ដូចគ្នា** ($m \times n$) ។
  2. ធាតុដែលត្រូវគ្នា **ស្មើគ្នារៀងៗខ្លួន** ៖
  $$a_{ij} = b_{ij} \quad (\forall i, j)$$
• **ឧទាហរណ៍** ៖ បើ $\begin{bmatrix} x & 2 \\ -1 & y \end{bmatrix} = \begin{bmatrix} 5 & 2 \\ -1 & -3 \end{bmatrix}$
  នោះនាំឱ្យ $x = 5$ និង $y = -3$ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ករណីមិនអាចស្មើគ្នា', R`• **លំដាប់ខុសគ្នា** ៖
  $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}_{2 \times 2} \neq \begin{bmatrix} 1 & 2 & 0 \\ 3 & 4 & 0 \end{bmatrix}_{2 \times 3}$
  (ទោះបីធាតុភាគច្រើនដូចគ្នាក៏ដោយ)
• **ធាតុត្រូវគ្នាមិនស្មើគ្នា** ៖
  $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \neq \begin{bmatrix} 1 & 2 \\ 5 & 4 \end{bmatrix}$ ព្រោះ $3 \neq 5$ ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖ ម៉ាទ្រីសពីរស្មើគ្នា លុះត្រាតែមានទំហំដូចគ្នា និងគ្រប់ធាតុត្រូវគ្នាទាំងអស់ស្មើគ្នាទាំងស្រុង ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('២.១ លំហាត់គំរូ ៖ ម៉ាទ្រីសស្មើគ្នា'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  រកតម្លៃនៃ $x, y, z$ ដោយដឹងថា $\begin{bmatrix} 2x - 1 & y + 3 \\ 4 & z - 2 \end{bmatrix} = \begin{bmatrix} 5 & 2y \\ 4 & 1 \end{bmatrix}$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• តាមលក្ខខណ្ឌម៉ាទ្រីសពីរស្មើគ្នា ធាតុត្រូវគ្នាត្រូវតែស្មើគ្នា ៖`),
        s(100, 285, 1080, R`1. ធាតុទីតាំង $(1, 1)$ ៖  $2x - 1 = 5 \implies 2x = 6 \implies x = 3$`),
        s(100, 345, 1080, R`2. ធាតុទីតាំង $(1, 2)$ ៖  $y + 3 = 2y \implies 2y - y = 3 \implies y = 3$`),
        s(100, 405, 1080, R`3. ធាតុទីតាំង $(2, 2)$ ៖  $z - 2 = 1 \implies z = 1 + 2 \implies z = 3$`),
        S.box(60, 495, 1160, 115, R`!!ចម្លើយ!! ៖  $x = 3, \quad y = 3, \quad z = 3$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៣.១ វិធីបូក និងវិធីដកនៃម៉ាទ្រីស'),
        card(60, 160, 560, 360, 'និយមន័យវិធីបូក និងដក', R`• **លក្ខខណ្ឌ** ៖ ម៉ាទ្រីសពីរអាចបូក ឬដកគ្នាបាន លុះត្រាតែវាមាន **លំដាប់ដូចគ្នា** ($m \times n$) ។
• **ក្បួនគណនា** ៖ យកធាតុដែលត្រូវគ្នាបូក ឬដកគ្នា ៖
  $$A \pm B = [a_{ij} \pm b_{ij}]$$
• **ឧទាហរណ៍** ៖
$$\begin{bmatrix} 2 & 3 \\ -1 & 5 \end{bmatrix} + \begin{bmatrix} 4 & -1 \\ 2 & 3 \end{bmatrix} = \begin{bmatrix} 2+4 & 3+(-1) \\ -1+2 & 5+3 \end{bmatrix} = \begin{bmatrix} 6 & 2 \\ 1 & 8 \end{bmatrix}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'លក្ខណៈនៃវិធីបូកម៉ាទ្រីស', R`ចំពោះម៉ាទ្រីស $A, B, C$ មានលំដាប់ដូចគ្នា ៖
• **លក្ខណៈត្រឡប់** ៖ $A + B = B + A$
• **លក្ខណៈផ្តុំ** ៖ $(A + B) + C = A + (B + C)$
• **ធាតុណឺត ($O$)** ៖ $A + O = O + A = A$
• **ធាតុផ្ទុយ ($-A$)** ៖ $A + (-A) = O$
• **ចំណាំ** ៖ បើ $A$ និង $B$ មានលំដាប់ខុសគ្នា នោះ $A + B$ និង $A - B$ **គ្មានន័យ (មិនអាចគណនាបាន)** ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖ បូក/ដកម៉ាទ្រីស គឺបូក/ដកធាតុត្រូវគ្នា! ម៉ាទ្រីសលទ្ធផលមានលំដាប់ដដែលដូចម៉ាទ្រីសដើម ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('៣.២ ផលគុណមួយចំនួនពិតនឹងម៉ាទ្រីស (Scalar Multiplication)'),
        card(60, 160, 560, 360, 'និយមន័យផលគុណស្កាលែ', R`• **និយមន័យ** ៖ ផលគុណនៃចំនួនពិត $k \in \mathbb{R}$ នឹងម៉ាទ្រីស $A$ គឺបានមកពីការយកចំនួនពិត $k$ ទៅគុណនឹង **គ្រប់ធាតុទាំងអស់** នៃម៉ាទ្រីស $A$ ៖
$$k A = k [a_{ij}] = [k \cdot a_{ij}]$$
• **ឧទាហរណ៍** ៖ គេឱ្យ $A = \begin{bmatrix} 2 & -3 \\ 1 & 4 \end{bmatrix}$ ៖
$$3 A = 3 \begin{bmatrix} 2 & -3 \\ 1 & 4 \end{bmatrix} = \begin{bmatrix} 3(2) & 3(-3) \\ 3(1) & 3(4) \end{bmatrix} = \begin{bmatrix} 6 & -9 \\ 3 & 12 \end{bmatrix}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'លក្ខណៈនៃផលគុណស្កាលែ', R`ចំពោះគ្រប់ចំនួនពិត $k, p \in \mathbb{R}$ និងម៉ាទ្រីស $A, B$ ៖
• $k(A + B) = k A + k B$
• $(k + p)A = k A + p A$
• $(kp)A = k(p A)$
• $1 \cdot A = A$ និង $(-1) \cdot A = -A$
• $0 \cdot A = O$ (ម៉ាទ្រីសសូន្យ)
• $(kA)^T = k A^T$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!លំហាត់ហ្វឹកហាត់!! ៖ បើ $A = \begin{bmatrix} 1 & -2 \\ 3 & 0 \end{bmatrix}$ និង $B = \begin{bmatrix} 4 & 1 \\ -2 & 5 \end{bmatrix}$ គណនា $2A - 3B = \begin{bmatrix} -10 & -7 \\ 12 & -15 \end{bmatrix}$ ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('៣.៣ វិធីគុណនៃពីរម៉ាទ្រីស (Matrix Multiplication)'),
        card(60, 160, 560, 360, 'លក្ខខណ្ឌគុណ & លំដាប់ផលគុណ', R`• **លក្ខខណ្ឌគុណកើត** ៖ ម៉ាទ្រីស $A$ អាចគុណនឹង $B$ បាន លុះត្រាតែ ៖
  $$\textbf{ចំនួនជួរឈរនៃ } A = \textbf{ចំនួនជួរដេកនៃ } B$$
• **លំដាប់នៃផលគុណ** ៖
  $$[m \times \mathbf{p}] \times [\mathbf{p} \times n] = [m \times n]$$
• **ក្បួនគណនា** ៖ ធាតុ $c_{ij}$ នៃ $C = AB$ បានមកពីផលបូកនៃផលគុណរវាងជួរដេកទី $i$ នៃ $A$ ជាមួយជួរឈរទី $j$ នៃ $B$ ៖
  $$c_{ij} = \sum_{k=1}^p a_{ik} b_{kj}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'លក្ខណៈនៃវិធីគុណម៉ាទ្រីស', R`• **គ្មានលក្ខណៈត្រឡប់ទូទៅ** ៖
  $$AB \neq BA \quad (\text{ភាគច្រើន})$$
• **លក្ខណៈផ្តុំ** ៖ $(AB)C = A(BC)$
• **លក្ខណៈបំបែក** ៖
  $A(B + C) = AB + AC$
  $(A + B)C = AC + BC$
• **ម៉ាទ្រីសឯកតា $I$** ៖ $AI = IA = A$
• **ចំណាំ** ៖ $AB = O$ មិនប្រាកដថា $A=O$ ឬ $B=O$ នោះទេ!`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនទន្ទេញ!! ៖ **«ជួរដេកគុណនឹងជួរឈរ»** (Row $\times$ Column) — យកធាតុទី ១ គុណទី ១ + ទី ២ គុណទី ២ + ... បូកបញ្ចូលគ្នា!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 13 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ វិធីគុណម៉ាទ្រីស $2 \times 2$ លម្អិតមួយជំហានម្តង'),
        l(60, 150, 1180, R`!!គណនា $A \times B$!! ដោយដឹងថា $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ និង $B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$ ៖`, { size: 27 }),
        s(80, 225, 1100, R`• ធាតុ $c_{11}$ (ដេក ១ $\times$ ឈរ ១) ៖ $c_{11} = (1)(5) + (2)(7) = 5 + 14 = 19$`),
        s(80, 285, 1100, R`• ធាតុ $c_{12}$ (ដេក ១ $\times$ ឈរ ២) ៖ $c_{12} = (1)(6) + (2)(8) = 6 + 16 = 22$`),
        s(80, 345, 1100, R`• ធាតុ $c_{21}$ (ដេក ២ $\times$ ឈរ ១) ៖ $c_{21} = (3)(5) + (4)(7) = 15 + 28 = 43$`),
        s(80, 405, 1100, R`• ធាតុ $c_{22}$ (ដេក ២ $\times$ ឈរ ២) ៖ $c_{22} = (3)(6) + (4)(8) = 18 + 32 = 50$`),
        S.box(60, 490, 1160, 125, R`$$AB = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix} = \begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}$$
!!តើ $BA$ ស្មើប៉ុន្មាន?!! $BA = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 23 & 34 \\ 31 & 46 \end{bmatrix} \neq AB$ (គ្មានលក្ខណៈត្រឡប់!)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('៣.៤ ស្វ័យគុណនៃម៉ាទ្រីសការ៉េ (Matrix Powers)'),
        card(60, 160, 560, 360, 'និយមន័យស្វ័យគុណ', R`ចំពោះម៉ាទ្រីសការ៉េ $A$ ($n \times n$) ៖
• $A^1 = A$
• $A^2 = A \cdot A$
• $A^3 = A^2 \cdot A = A \cdot A^2$
• $A^k = A^{k-1} \cdot A \quad (k \ge 2)$
• $A^0 = I_n$ (ម៉ាទ្រីសឯកតា)
• **ចំណាំ** ៖ មានតែម៉ាទ្រីសការ៉េទេ ទើបអាចស្វ័យគុណបាន!`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ ៖ រក Aⁿ តាមលំនាំគំរូ', R`គេឱ្យ $A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ ។ គណនា $A^2, A^3$ រួចទាញរក $A^n$ ៖
• $A^2 = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 4 \\ 0 & 1 \end{bmatrix}$
• $A^3 = A^2 \cdot A = \begin{bmatrix} 1 & 4 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 6 \\ 0 & 1 \end{bmatrix}$
• តាមលំនាំ ៖ $A^n = \begin{bmatrix} 1 & 2n \\ 0 & 1 \end{bmatrix} \quad (\forall n \in \mathbb{N}^*)$ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!រូបមន្តទូទៅ!! ៖ $A^n = \begin{bmatrix} 1 & 2n \\ 0 & 1 \end{bmatrix}$ ចំពោះគ្រប់ចំនួនគត់វិជ្ជមាន $n$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('៤.១ ម៉ាទ្រីសច្រាសលំដាប់ ២ (Inverse Matrix)'),
        card(60, 160, 560, 360, 'និយមន័យ និងរូបមន្ត', R`• **និយមន័យ** ៖ ម៉ាទ្រីសច្រាសនៃម៉ាទ្រីសការ៉េ $A$ (តាងដោយ $A^{-1}$) ផ្ទៀងផ្ទាត់ ៖
  $$A \cdot A^{-1} = A^{-1} \cdot A = I$$
• **រូបមន្តម៉ាទ្រីសច្រាសលំដាប់ ២** ៖
  បើ $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ មានដេទែរមីណង់ $\det(A) = ad - bc \neq 0$ ៖
  $$A^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$$
• **លក្ខខណ្ឌមានច្រាស** ៖ $\det(A) = ad - bc \neq 0$ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ក្បួនចងចាំ និងករណីគ្មានច្រាស', R`• **ក្បួនអនុវត្ត** ៖
  1. គណនាដេទែរមីណង់ $\det(A) = ad - bc$
  2. ប្តូរទីតាំងធាតុលើអង្កត់ទ្រូងមេ ($a \leftrightarrow d$)
  3. ប្តូរសញ្ញាធាតុលើអង្កត់ទ្រូងរង ($-b$ និង $-c$)
  4. ចែកធាតុទាំងអស់នឹង $(ad - bc)$ ។
• **ម៉ាទ្រីសព្រ័ទ្ធ (Singular Matrix)** ៖
  បើ $ad - bc = 0$ ម៉ាទ្រីស $A$ **គ្មានម៉ាទ្រីសច្រាសទេ** ។
• **លក្ខណៈ** ៖ $(A^{-1})^{-1} = A$ , $(AB)^{-1} = B^{-1}A^{-1}$ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖ $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \implies A^{-1} = \dfrac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$ (លុះត្រាតែ $ad - bc \neq 0$) ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 16 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ គណនាម៉ាទ្រីសច្រាសលំដាប់ ២'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  រកម៉ាទ្រីសច្រាសនៃ  $A = \begin{bmatrix} 3 & 5 \\ 1 & 2 \end{bmatrix}$  និង  $B = \begin{bmatrix} 2 & 4 \\ 1 & 2 \end{bmatrix}$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• ចំពោះ $A$ ៖ គណនា $\det(A) = (3)(2) - (5)(1) = 6 - 5 = 1 \neq 0$ (មានច្រាស)`),
        s(100, 290, 1080, R`  $\implies A^{-1} = \frac{1}{1} \begin{bmatrix} 2 & -5 \\ -1 & 3 \end{bmatrix} = \begin{bmatrix} 2 & -5 \\ -1 & 3 \end{bmatrix}$`),
        s(100, 355, 1080, R`• ផ្ទៀងផ្ទាត់ ៖  $A \cdot A^{-1} = \begin{bmatrix} 3 & 5 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} 2 & -5 \\ -1 & 3 \end{bmatrix} = \begin{bmatrix} 6-5 & -15+15 \\ 2-2 & -5+6 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I$  (ពិត)`),
        s(100, 420, 1080, R`• ចំពោះ $B$ ៖ $\det(B) = (2)(2) - (4)(1) = 4 - 4 = 0 \implies B$ **គ្មានម៉ាទ្រីសច្រាសទេ**`),
        S.box(60, 495, 1160, 115, R`!!ចម្លើយ!! ៖  $A^{-1} = \begin{bmatrix} 2 & -5 \\ -1 & 3 \end{bmatrix}$  និង  ម៉ាទ្រីស $B$ គ្មានម៉ាទ្រីសច្រាស ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 17 */ page([
        sec('៤.២ សមីការម៉ាទ្រីស (Matrix Equations)'),
        card(60, 160, 560, 360, 'ទ្រឹស្តីបទសមីការម៉ាទ្រីស', R`ចំពោះម៉ាទ្រីសច្រាសបាន $A$ ($\det(A) \neq 0$) ៖
• **សមីការទម្រង់ $AX = B$** ៖
  គុណអង្គទាំងពីរនឹង $A^{-1}$ ពីខាងឆ្វេង ៖
  $$A^{-1}(AX) = A^{-1}B \implies (A^{-1}A)X = A^{-1}B$$
  $$IX = A^{-1}B \implies \mathbf{X = A^{-1}B}$$

• **សមីការទម្រង់ $XA = B$** ៖
  គុណអង្គទាំងពីរនឹង $A^{-1}$ ពីខាងស្តាំ ៖
  $$X = B A^{-1}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ប្រយ័ត្នប្រយែង ៖ លំដាប់គុណ!', R`• ដោយសារវិធីគុណម៉ាទ្រីស **គ្មានលក្ខណៈត្រឡប់ ($AB \neq BA$)** ៖
  - $AX = B \implies X = A^{-1}B$ (មិនមែន $BA^{-1}$ ទេ!)
  - $XA = B \implies X = BA^{-1}$ (មិនមែន $A^{-1}B$ ទេ!)
• **ប្រព័ន្ធសមីការលីនេអ៊ែរ $\to$ សមីការម៉ាទ្រីស** ៖
  $$\begin{cases} ax + by = e \\ cx + dy = f \end{cases} \iff \begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} e \\ f \end{bmatrix}$$
  $$\iff AX = B \implies X = A^{-1}B$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖ $A$ នៅខាងឆ្វេង $X \to$ គុណ $A^{-1}$ ពីឆ្វេង ; $A$ នៅខាងស្តាំ $X \to$ គុណ $A^{-1}$ ពីស្តាំ!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 18 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ ដោះស្រាយសមីការម៉ាទ្រីស'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  ដោះស្រាយសមីការម៉ាទ្រីស  $\begin{bmatrix} 2 & 1 \\ 5 & 3 \end{bmatrix} X = \begin{bmatrix} 4 \\ 1 \end{bmatrix}$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• សមីការមានទម្រង់ $AX = B$ ដែល $A = \begin{bmatrix} 2 & 1 \\ 5 & 3 \end{bmatrix}$ និង $B = \begin{bmatrix} 4 \\ 1 \end{bmatrix}$`),
        s(100, 290, 1080, R`• គណនា $\det(A) = (2)(3) - (1)(5) = 6 - 5 = 1 \neq 0$`),
        s(100, 355, 1080, R`• នាំឱ្យ $A^{-1} = \frac{1}{1} \begin{bmatrix} 3 & -1 \\ -5 & 2 \end{bmatrix} = \begin{bmatrix} 3 & -1 \\ -5 & 2 \end{bmatrix}$`),
        s(100, 420, 1080, R`• រក $X = A^{-1}B = \begin{bmatrix} 3 & -1 \\ -5 & 2 \end{bmatrix} \begin{bmatrix} 4 \\ 1 \end{bmatrix} = \begin{bmatrix} 3(4) + (-1)(1) \\ (-5)(4) + 2(1) \end{bmatrix} = \begin{bmatrix} 12 - 1 \\ -20 + 2 \end{bmatrix} = \begin{bmatrix} 11 \\ -18 \end{bmatrix}$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  ម៉ាទ្រីសចម្លើយគឺ  $X = \begin{bmatrix} 11 \\ -18 \end{bmatrix}$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 19 */ page([
        sec('សង្ខេបជំពូកទី ៤ មេរៀនទី ១ ៖ រូបមន្តគន្លឹះនៃម៉ាទ្រីស'),
        card(60, 160, 560, 360, 'ប្រមាណវិធី & ម៉ាទ្រីសឆ្លាស់', R`• **បូក/ដក** ៖ $A \pm B = [a_{ij} \pm b_{ij}]$ (លំដាប់ដូចគ្នា)
• **គុណស្កាលែ** ៖ $kA = [k \cdot a_{ij}]$
• **គុណពីរម៉ាទ្រីស** ៖ $(m \times p) \times (p \times n) = (m \times n)$
  *(ជួរឈរ $A$ ស្មើជួរដេក $B$)*
• **ម៉ាទ្រីសឆ្លាស់** ៖ $(A^T)^T = A$ , $(AB)^T = B^TA^T$
• **ម៉ាទ្រីសឯកតា** ៖ $AI = IA = A$`, { size: 23 }),
        card(660, 160, 560, 360, 'ម៉ាទ្រីសច្រាស & សមីការម៉ាទ្រីស', R`• **ម៉ាទ្រីសច្រាសលំដាប់ ២** ៖
  $$A^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix} \quad (\det(A) \neq 0)$$
• **សមីការម៉ាទ្រីស** ៖
  - $AX = B \implies X = A^{-1}B$
  - $XA = B \implies X = BA^{-1}$
• **លក្ខណៈច្រាស** ៖ $(AB)^{-1} = B^{-1}A^{-1}$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 20 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`គេឱ្យ $A = \begin{bmatrix} 2 & 3 \\ 1 & 4 \end{bmatrix}$ និង $B = \begin{bmatrix} 1 & -1 \\ 0 & 2 \end{bmatrix}$ ។ តើផលគុណ $AB$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\begin{bmatrix} 2 & 4 \\ 1 & 7 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\begin{bmatrix} 2 & -3 \\ 0 & 8 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\begin{bmatrix} 3 & 2 \\ 1 & 6 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\begin{bmatrix} 1 & 4 \\ 2 & 7 \end{bmatrix}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $c_{11}=2+0=2, \ c_{12}=-2+6=4, \ c_{21}=1+0=1, \ c_{22}=-1+8=7$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 21 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`រកម៉ាទ្រីសច្រាសនៃម៉ាទ្រីស  $A = \begin{bmatrix} 5 & 7 \\ 2 & 3 \end{bmatrix}$  ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\begin{bmatrix} 3 & -7 \\ -2 & 5 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\begin{bmatrix} -3 & 7 \\ 2 & -5 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\begin{bmatrix} 5 & -7 \\ -2 & 3 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\begin{bmatrix} 3 & 7 \\ 2 & 5 \end{bmatrix}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\det(A) = 15 - 14 = 1 \implies A^{-1} = \begin{bmatrix} 3 & -7 \\ -2 & 5 \end{bmatrix}$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 22 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`តម្លៃ $x$ ដែលធ្វើឱ្យម៉ាទ្រីស  $M = \begin{bmatrix} x & 6 \\ 2 & 3 \end{bmatrix}$  គ្មានម៉ាទ្រីសច្រាស គឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$x = 2$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$x = 4$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$x = -4$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$x = 0$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះគ្មានច្រាស $\iff \det(M) = 3x - 12 = 0 \implies 3x = 12 \implies x = 4$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 23 */ S.homework(R`!!១.!! គេឱ្យ $A = \begin{bmatrix} 2 & -1 \\ 3 & 4 \end{bmatrix}$ ។ គណនា $A^2 - 6A + 11I$ (ដែល $I$ ជាម៉ាទ្រីសឯកតា) ។
!!២.!! ដោះស្រាយសមីការម៉ាទ្រីស $\begin{bmatrix} 3 & 1 \\ 5 & 2 \end{bmatrix} X = \begin{bmatrix} 2 & -1 \\ 4 & 0 \end{bmatrix}$ ។
!!៣.!! រកតម្លៃ $m$ ដើម្បីឱ្យម៉ាទ្រីស $M = \begin{bmatrix} m-1 & 2 \\ 4 & m+1 \end{bmatrix}$ ជាម៉ាទ្រីសច្រាសបាន ។`),

      /* 24 */ S.thanks()
    ];
    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៤ មេរៀនទី១ ម៉ាទ្រីស (២៤ ស្លាយ)',
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណ & ប្រភេទនៃម៉ាទ្រីស', slide: 3 },
        { title: '២. ម៉ាទ្រីសស្មើគ្នា', slide: 7 },
        { title: '៣. ប្រមាណវិធីលើម៉ាទ្រីស (បូក ដក គុណ)', slide: 9 },
        { title: '៤. ម៉ាទ្រីសច្រាស & សមីការម៉ាទ្រីស', slide: 14 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 18 }
      ],
      slides: slides
    };
  }

  function determinants(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, sarrusDiagram = K.sarrusDiagram;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៤==        មេរៀនទី២', 'ដេទែរមីណង់', K.info),

      /* 2 */ K.toc([
        '==១. ដេទែរមីណង់លំដាប់ ២==',
        '==២. ដេទែរមីណង់លំដាប់ ៣ (ក្បួនសារុស)==',
        '==៣. ការពន្លាតតាមជួរដេក ឬជួរឈរ==',
        '==៤. លក្ខណៈសំខាន់ៗនៃដេទែរមីណង់==',
        '==៥. ច្បាប់ក្រាម័រ (Cramer\'s Rule)==',
        '==៦. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`យល់ដឹងពីនិយមន័យ និងចេះគណនាដេទែរមីណង់លំដាប់ $2$ ($ad - bc$)`,
        R`ចេះប្រើក្បួនសារុស (Sarrus) និងការពន្លាតតាមជួរដេក/ឈរ លើដេទែរមីណង់លំដាប់ $3$`,
        R`ក្តាប់បាននូវលក្ខណៈសំខាន់ៗទាំង ៧ នៃដេទែរមីណង់ដើម្បីសម្រួលការគណនា`,
        R`អនុវត្តដេទែរមីណង់ក្នុងការដោះស្រាយប្រព័ន្ធសមីការលីនេអ៊ែរតាមច្បាប់ក្រាម័រ`
      ]),

      /* 4 */ page([
        sec('១.១ ដេទែរមីណង់លំដាប់ ២ (Second-Order Determinant)'),
        card(60, 160, 560, 360, 'និយមន័យ និងរូបមន្ត', R`• **និយមន័យ** ៖ ចំពោះម៉ាទ្រីសការ៉េ $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ ដេទែរមីណង់នៃ $A$ តាងដោយ $\det(A)$ ឬ $|A|$ កំណត់ដោយ ៖
$$\det(A) = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$
• **និមិត្តសញ្ញា** ៖ ប្រើបន្ទាត់ឈរត្រង់ $|A| = \begin{vmatrix} a & b \\ c & d \end{vmatrix}$ (ខុសពីម៉ាទ្រីសដែលប្រើវង់ក្រចកធំ $[ \ ]$) ។
• **លទ្ធផល** ៖ ដេទែរមីណង់គឺជា **ចំនួនពិត** (Scalar) មិនមែនជាតារាងចំនួនទេ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ក្បួនទន្ទេញ និងឧទាហរណ៍', R`• **ក្បួនទន្ទេញ** ៖
  $$\det = (\text{ផលគុណអង្កត់ទ្រូងមេ}) - (\text{ផលគុណអង្កត់ទ្រូងរង})$$
  $$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$
• **ឧទាហរណ៍ ១** ៖
  $\begin{vmatrix} 3 & 4 \\ 2 & 5 \end{vmatrix} = (3)(5) - (4)(2) = 15 - 8 = 7$
• **ឧទាហរណ៍ ២** ៖
  $\begin{vmatrix} -2 & -1 \\ 4 & 3 \end{vmatrix} = (-2)(3) - (-1)(4) = -6 + 4 = -2$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖ គុណចុះក្រោមសញ្ញា $+$ គុណឡើងលើសញ្ញា $-$ ៖  $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('១.២ លំហាត់គំរូ ៖ គណនាដេទែរមីណង់លំដាប់ ២'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  គណនាដេទែរមីណង់ខាងក្រោម  ក. $D_1 = \begin{vmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{vmatrix}$  និង  ខ. $D_2 = \begin{vmatrix} \sqrt{3} & 1 \\ 2 & \sqrt{3} \end{vmatrix}$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• ចំពោះ $D_1$ ៖  $D_1 = (\cos\theta)(\cos\theta) - (-\sin\theta)(\sin\theta) = \cos^2\theta + \sin^2\theta = 1$`),
        s(100, 290, 1080, R`• ចំពោះ $D_2$ ៖  $D_2 = (\sqrt{3})(\sqrt{3}) - (1)(2) = 3 - 2 = 1$`),
        s(100, 355, 1080, R`• ករណីពិសេស ៖ ដេទែរមីណង់នៃម៉ាទ្រីសរង្វិលមុំ $\theta$ គឺតែងតែស្មើ $1$ ជានិច្ច!`),
        S.box(60, 495, 1160, 115, R`!!ចម្លើយ!! ៖  $D_1 = 1 \quad$ និង $\quad D_2 = 1$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('១.៣ លំហាត់គំរូ ៖ រកអថេរ x ក្នុងសមភាពដេទែរមីណង់'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  រកតម្លៃនៃ $x$ ដោយដឹងថា $\begin{vmatrix} x - 1 & 2 \\ 3 & x \end{vmatrix} = 0$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• ពន្លាតដេទែរមីណង់លំដាប់ ២ ៖  $(x - 1)(x) - (2)(3) = 0$`),
        s(100, 290, 1080, R`• គុណពន្លាត ៖  $x^2 - x - 6 = 0$`),
        s(100, 355, 1080, R`• ដាក់ជាផលគុណកត្តា ៖  $(x - 3)(x + 2) = 0$`),
        s(100, 420, 1080, R`• ទាញរកឫស ៖  $x - 3 = 0 \implies x = 3 \quad$ ឬ $\quad x + 2 = 0 \implies x = -2$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  តម្លៃនៃ $x$ គឺ  $x = 3 \quad$ ឬ $\quad x = -2$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.១ ដេទែរមីណង់លំដាប់ ៣ ៖ ក្បួនសារុស (Sarrus\' Rule)'),
        card(60, 160, 560, 360, 'ក្បួនសារុស (Sarrus)', R`ចំពោះម៉ាទ្រីស $3 \times 3$ ចម្លងជួរឈរទី ១ និងទី ២ ទៅខាងស្តាំ ៖
• **ផលគុណតាមអង្កត់ទ្រូងមេ (សញ្ញា $+$)** ៖
  $$P_1 = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32}$$
• **ផលគុណតាមអង្កត់ទ្រូងរង (សញ្ញា $-$)** ៖
  $$P_2 = a_{13}a_{22}a_{31} + a_{11}a_{23}a_{32} + a_{12}a_{21}a_{33}$$
• **រូបមន្ត** ៖  $$\det = P_1 - P_2$$
• **ចំណាំសំខាន់** ៖ ប្រើបានតែលើ **លំដាប់ ៣ ប៉ុណ្ណោះ**!`, { size: 22 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍គណនាតាមសារុស', R`គណនា $\det(A) = \begin{vmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 1 & 0 & 6 \end{vmatrix}$ ៖
• **អង្កត់ទ្រូងមេ ($+$)** ៖
  $(1)(4)(6) + (2)(5)(1) + (3)(0)(0)$
  $= 24 + 10 + 0 = \mathbf{34}$
• **អង្កត់ទ្រូងរង ($-$)** ៖
  $(3)(4)(1) + (1)(5)(0) + (2)(0)(6)$
  $= 12 + 0 + 0 = \mathbf{12}$
• $\implies \det(A) = 34 - 12 = \mathbf{22}$ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនទន្ទេញ!! ៖ បូក ៣ គូតាមអង្កត់ទ្រូងមេ ដក ៣ គូតាមអង្កត់ទ្រូងរង ៖ $\det = P_{\text{មេ}} - P_{\text{រង}}$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('២.២ ឧទាហរណ៍គំរូ ៖ គណនាតាមក្បួនសារុស'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  គណនា $\Delta = \begin{vmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 1 & 0 & 6 \end{vmatrix}$ តាមក្បួនសារុស ៖`, { size: 27 }),
        s(100, 225, 1080, R`• ចម្លងជួរឈរទី ១ និងទី ២ ទៅខាងស្តាំ ៖  $\begin{matrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 1 & 0 & 6 \end{matrix} \begin{matrix} 1 & 2 \\ 0 & 4 \\ 1 & 0 \end{matrix}$`),
        s(100, 290, 1080, R`• ផលគុណតាមអង្កត់ទ្រូងមេ ៖  $P_1 = (1)(4)(6) + (2)(5)(1) + (3)(0)(0) = 24 + 10 + 0 = 34$`),
        s(100, 355, 1080, R`• ផលគុណតាមអង្កត់ទ្រូងរង ៖  $P_2 = (1)(4)(3) + (0)(5)(1) + (6)(0)(2) = 12 + 0 + 0 = 12$`),
        s(100, 420, 1080, R`• នាំឱ្យ  $\Delta = P_1 - P_2 = 34 - 12 = 22$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  តម្លៃដេទែរមីណង់គឺ  $\Delta = 22$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('៣.១ ការពន្លាតតាមជួរដេក ឬជួរឈរ (Laplace Expansion)'),
        card(60, 160, 560, 360, 'រូបមន្តពន្លាតតាមជួរដេកទី ១', R`ពន្លាតដេទែរមីណង់លំដាប់ ៣ តាមជួរដេកទី ១ ៖
$$\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & k \end{vmatrix} = a \begin{vmatrix} e & f \\ h & k \end{vmatrix} - b \begin{vmatrix} d & f \\ g & k \end{vmatrix} + c \begin{vmatrix} d & e \\ g & h \end{vmatrix}$$
• $a, b, c$ ជាធាតុនៃជួរដេកទី ១
• ដេទែរមីណង់លំដាប់ ២ នីមួយៗបានពីការលុបជួរដេក និងជួរឈររបស់ធាតុនោះ (មីន័រ $M_{ij}$)
• សញ្ញាត្រូវឆ្លាស់គ្នា ៖ $+ \ , \ - \ , \ +$ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'តារាងសញ្ញា និងគន្លឹះគណនា', R`• **តារាងសញ្ញាកូហ្វាក់ទ័រ** ៖
  $$\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}$$
• **គន្លឹះជ្រើសរើសជួរដេក/ឈរ** ៖
  គួរជ្រើសរើសពន្លាតតាមជួរដេក ឬជួរឈរណាដែល **មានលេខ $0$ ច្រើនជាងគេ** ដើម្បីកាត់បន្ថយការគណនា!
• **ឧទាហរណ៍** ៖ $\begin{vmatrix} 2 & 0 & 0 \\ 4 & 5 & 1 \\ 3 & -2 & 6 \end{vmatrix} = 2 \begin{vmatrix} 5 & 1 \\ -2 & 6 \end{vmatrix} = 2(30 - (-2)) = 64$ ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!គន្លឹះ!! ៖ ជ្រើសរើសជួរណាដែលមានលេខ ០ ច្រើនបំផុត នោះតួពន្លាតនឹងស្មើ ០ ដោយមិនបាច់គណនានាំឱ្យខាតពេល!`, { size: 24, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៤.១ លក្ខណៈសំខាន់ៗនៃដេទែរមីណង់'),
        card(60, 160, 560, 360, 'លក្ខណៈទី ១ ដល់ ទី ៤', R`1. $\det(A^T) = \det(A)$ (ឆ្លាស់ដេទែរមីណង់មិនប្រែប្រួល)
2. ប្តូរពីរជួរដេក (ឬឈរ) នាំឱ្យដេទែរមីណង់ **ប្តូរសញ្ញា** ៖
   $\det(A') = -\det(A)$
3. បើមាន **ពីរជួរដូចគ្នា ឬសមាមាត្រគ្នា** នោះ $\det = 0$ ៖
   $\begin{vmatrix} 1 & 2 & 3 \\ 1 & 2 & 3 \\ 4 & 5 & 6 \end{vmatrix} = 0$
4. បើមាន **មួយជួរជាសូន្យទាំងអស់** នោះ $\det = 0$ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'លក្ខណៈទី ៥ ដល់ ទី ៧', R`5. $\det(AB) = \det(A) \cdot \det(B)$
   (ដេទែរមីណង់នៃផលគុណស្មើផលគុណដេទែរមីណង់)
6. ចំពោះម៉ាទ្រីសការ៉េលំដាប់ $n$ ៖
   $$\det(kA) = k^n \det(A) \quad (k \in \mathbb{R})$$
   *(លំដាប់ $2 \to k^2\det(A)$ ; លំដាប់ $3 \to k^3\det(A)$)*
7. $\det(A^{-1}) = \dfrac{1}{\det(A)}$ (ចំពោះ $\det(A) \neq 0$)
8. ម៉ាទ្រីសត្រីកោណ ៖ $\det$ ស្មើផលគុណធាតុអង្កត់ទ្រូងមេ!`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្តរហ័ស!! ៖ $\begin{vmatrix} 2 & 5 & 7 \\ 0 & 3 & 4 \\ 0 & 0 & 5 \end{vmatrix} = 2 \times 3 \times 5 = 30$ (ម៉ាទ្រីសត្រីកោណលើ) ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('៥.១ ច្បាប់ក្រាម័រ (Cramer\'s Rule) សម្រាប់ប្រព័ន្ធសមីការ'),
        card(60, 160, 560, 360, 'រូបមន្តច្បាប់ក្រាម័រលំដាប់ ២', R`ប្រព័ន្ធសមីការ $\begin{cases} a_1 x + b_1 y = c_1 \\ a_2 x + b_2 y = c_2 \end{cases}$ ៖
• គណនាដេទែរមីណង់មេ ៖  $D = \begin{vmatrix} a_1 & b_1 \\ a_2 & b_2 \end{vmatrix}$
• ដេទែរមីណង់ធៀប $x$ ៖  $D_x = \begin{vmatrix} c_1 & b_1 \\ c_2 & b_2 \end{vmatrix}$
• ដេទែរមីណង់ធៀប $y$ ៖  $D_y = \begin{vmatrix} a_1 & c_1 \\ a_2 & c_2 \end{vmatrix}$
• **ចម្លើយ (បើ $D \neq 0$)** ៖
  $$x = \frac{D_x}{D} \quad , \quad y = \frac{D_y}{D}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ការពិភាក្សាចម្លើយ', R`• **ករណីទី ១** ៖ បើ $D \neq 0$
  $\implies$ ប្រព័ន្ធសមីការមាន **គូចម្លើយតែមួយគត់** $(x, y) = \left(\frac{D_x}{D}, \ \frac{D_y}{D}\right)$ ។
• **ករណីទី ២** ៖ បើ $D = 0$
  - បើ $D_x \neq 0$ ឬ $D_y \neq 0 \implies$ ប្រព័ន្ធ **គ្មានចម្លើយ** ។
  - បើ $D = D_x = D_y = 0 \implies$ ប្រព័ន្ធមាន **ចម្លើយច្រើនរាប់មិនអស់** ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖ $D_x$ យកតួថេរ $c$ ជំនួសជួរឈរ $x$ ; $D_y$ យកតួថេរ $c$ ជំនួសជួរឈរ $y$ !`, { size: 25, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('៥.២ ឧទាហរណ៍គំរូ ៖ ដោះស្រាយតាមច្បាប់ក្រាម័រ'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  ដោះស្រាយប្រព័ន្ធសមីការ  $\begin{cases} 3x + 2y = 8 \\ 5x - y = 9 \end{cases}$  តាមច្បាប់ក្រាម័រ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• គណនា $D = \begin{vmatrix} 3 & 2 \\ 5 & -1 \end{vmatrix} = (3)(-1) - (2)(5) = -3 - 10 = -13 \neq 0$ (មានចម្លើយមួយគត់)`),
        s(100, 290, 1080, R`• គណនា $D_x = \begin{vmatrix} 8 & 2 \\ 9 & -1 \end{vmatrix} = (8)(-1) - (2)(9) = -8 - 18 = -26$`),
        s(100, 355, 1080, R`• គណនា $D_y = \begin{vmatrix} 3 & 8 \\ 5 & 9 \end{vmatrix} = (3)(9) - (8)(5) = 27 - 40 = -13$`),
        s(100, 420, 1080, R`• ទាញរកចម្លើយ ៖  $x = \frac{D_x}{D} = \frac{-26}{-13} = 2 \quad , \quad y = \frac{D_y}{D} = \frac{-13}{-13} = 1$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  ប្រព័ន្ធសមីការមានគូចម្លើយតែមួយគត់គឺ  $(x, y) = (2, 1)$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 13 */ page([
        sec('សង្ខេបជំពូកទី ៤ មេរៀនទី ២ ៖ រូបមន្តគន្លឹះនៃដេទែរមីណង់'),
        card(60, 160, 560, 360, 'ដេទែរមីណង់ & ក្បួនសារុស', R`• **លំដាប់ ២** ៖ $\det = ad - bc$
• **លំដាប់ ៣ (សារុស)** ៖ $\det = P_{\text{មេ}} - P_{\text{រង}}$
• **លក្ខណៈសំខាន់ៗ** ៖
  - $\det(A^T) = \det(A)$
  - ប្តូរពីរជួរ $\implies -\det$
  - ពីរជួរដូចគ្នា ឬជួរសូន្យ $\implies \det = 0$
  - $\det(AB) = \det(A)\det(B)$
  - $\det(kA) = k^n \det(A)$`, { size: 23 }),
        card(660, 160, 560, 360, 'ច្បាប់ក្រាម័រ & ការពន្លាត', R`• **ការពន្លាតតាមជួរដេកទី ១** ៖
  $\det = a M_{11} - b M_{12} + c M_{13}$
• **ច្បាប់ក្រាម័រ** ៖
  $$x = \frac{D_x}{D} \quad , \quad y = \frac{D_y}{D} \quad (D \neq 0)$$
• **ម៉ាទ្រីសច្រាស** ៖
  $A$ មានច្រាស $\iff \det(A) \neq 0$
  $\det(A^{-1}) = \frac{1}{\det(A)}$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 14 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`គណនាដេទែរមីណង់  $\Delta = \begin{vmatrix} 4 & -2 \\ 3 & 5 \end{vmatrix}$  ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$26$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$14$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$-26$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$20$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\Delta = (4)(5) - (-2)(3) = 20 - (-6) = 26$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 15 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`បើ $A$ ជាម៉ាទ្រីសការ៉េលំដាប់ $2$ ដែល $\det(A) = 3$ នោះ $\det(2A)$ ស្មើនឹង ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$6$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$12$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$18$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$8$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះម៉ាទ្រីសលំដាប់ $n=2 \implies \det(2A) = 2^2 \det(A) = 4 \times 3 = 12$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 16 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`តម្លៃ $x$ ដែលធ្វើឱ្យ $\begin{vmatrix} x & 2 \\ 8 & x \end{vmatrix} = 0$ គឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$x = 4$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$x = -4$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$x = \pm 4$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$x = 16$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ C!! (ព្រោះ $x^2 - 16 = 0 \iff x^2 = 16 \implies x = \pm 4$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 17 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព'),
        S.box(80, 160, 1120, 350, R`!!១.!! គណនាដេទែរមីណង់ខាងក្រោម ៖
    ក. $\begin{vmatrix} 5 & -2 \\ 3 & 4 \end{vmatrix} \qquad$ ខ. $\begin{vmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{vmatrix} \qquad$ គ. $\begin{vmatrix} 1 & -2 & 3 \\ 2 & 0 & 1 \\ 4 & -1 & 5 \end{vmatrix}$
!!២.!! រកតម្លៃ $x$ បើ $\begin{vmatrix} x & 3 \\ 12 & x \end{vmatrix} = 0$ ។
!!៣.!! ដោះស្រាយប្រព័ន្ធសមីការតាមច្បាប់ក្រាម័រ ៖
    $\begin{cases} 4x + 3y = 11 \\ 2x - 5y = -1 \end{cases}$`, { size: 24, lh: '1.6' })
      ]),

      /* 18 */ S.homework(R`!!១.!! រកតម្លៃនៃ $x$ បើ $\begin{vmatrix} x & 2 \\ 3 & x-1 \end{vmatrix} = 0$ ។
!!២.!! គណនាដេទែរមីណង់ $\Delta = \begin{vmatrix} 2 & 1 & 0 \\ 0 & 3 & 4 \\ 1 & -1 & 2 \end{vmatrix}$ តាមពីរបែប (ក្បួនសារុស និងការពន្លាត) ។
!!៣.!! ដោះស្រាយប្រព័ន្ធសមីការតាមច្បាប់ក្រាម័រ ៖ $\begin{cases} 2x - 3y = 7 \\ 3x + y = 5 \end{cases}$ ។`),

      /* 19 */ S.thanks()
    ];
    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៤ មេរៀនទី២ ដេទែរមីណង់ (១៩ ស្លាយ)',
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. ដេទែរមីណង់លំដាប់ ២', slide: 3 },
        { title: '២. ដេទែរមីណង់លំដាប់ ៣ (សារុស)', slide: 6 },
        { title: '៣. ការពន្លាតតាមជួរដេក/ឈរ', slide: 8 },
        { title: '៤. លក្ខណៈដេទែរមីណង់ & ក្រាម័រ', slide: 9 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 12 }
      ],
      slides: slides
    };
  }

  function linearTrans(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, geomTransSvg = K.geomTransSvg;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៤==        មេរៀនទី៣', 'ការបំប្លែងលីនេអ៊ែរ', K.info),

      /* 2 */ K.toc([
        '==១. សញ្ញាណនៃការបំប្លែងលីនេអ៊ែរ==',
        '==២. ម៉ាទ្រីសនៃការបំប្លែងធរណីមាត្រ (ឆ្លុះ & ចំណោល)==',
        '==៣. ការបំប្លែងវិល និងចំឡងតាមមាត្រដ្ឋាន==',
        '==៤. បន្សំនៃការបំប្លែងលីនេអ៊ែរ==',
        '==៥. សំណួរ MCQ & កិច្ចការផ្ទះ=='
      ]),

      /* 3 */ S.objective([
        R`យល់ដឹងពីសញ្ញាណ និងសមីការម៉ាទ្រីសនៃការបំប្លែងលីនេអ៊ែរ $X' = MX$`,
        R`កំណត់ម៉ាទ្រីសនៃការបំប្លែងឆ្លុះធៀបនឹងអ័ក្សកូអរដោនេ បន្ទាត់ $y=x$ និងចំណោលកែង`,
        R`កំណត់ និងអនុវត្តម៉ាទ្រីសនៃការបំប្លែងវិល $R_\alpha$ និងចំឡងតាមមាត្រដ្ឋាន $H_k$`,
        R`គណនាម៉ាទ្រីសនៃបន្សំការបំប្លែងលីនេអ៊ែរ $T_2 \circ T_1 \iff M = M_2 \cdot M_1$`
      ]),

      /* 4 */ page([
        sec('១.១ សញ្ញាណនៃការបំប្លែងលីនេអ៊ែរ'),
        card(60, 160, 600, 360, 'និយមន័យ និងសមីការម៉ាទ្រីស', R`• **និយមន័យ** ៖ ការបំប្លែងលីនេអ៊ែរ $T$ ក្នុងប្លង់ បំប្លែងចំណុច $M(x, y)$ ទៅជារូបភាព $M'(x', y')$ ដោយ ៖
  $$\begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} \iff \mathbf{X' = M X}$$
• ម៉ាទ្រីស $M = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ ហៅថា **ម៉ាទ្រីសតាងការបំប្លែង $T$** ។
• **សមីការកូអរដោនេ** ៖
  $$\begin{cases} x' = ax + by \\ y' = cx + dy \end{cases}$$
• **រូបភាពនៃគល់ $O$** ៖ $T(0, 0) = (0, 0)$ ជានិច្ច!`, { size: 23 }),
        geomTransSvg(680, 160, 540, 360, 'refl-x'),
        S.box(60, 545, 1160, 80, R`!!ចំណាំ!! ៖ ការបំប្លែងលីនេអ៊ែរបំប្លែងបន្ទាត់ត្រង់ទៅជាបន្ទាត់ត្រង់ និងរក្សាគល់តម្រុយនៅដដែល ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('១.២ ឧទាហរណ៍គំរូ ៖ រករូបភាពនៃចំណុច និងវ៉ិចទ័រ'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  គេឱ្យការបំប្លែង $T$ មានម៉ាទ្រីស $M = \begin{bmatrix} 2 & -1 \\ 3 & 4 \end{bmatrix}$ ។ រករូបភាពនៃចំណុច $A(3, 2)$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• តាង $A'(x', y')$ ជារូបភាពនៃ $A(3, 2)$ តាមការបំប្លែង $T$`),
        s(100, 290, 1080, R`• អនុវត្តរូបមន្តម៉ាទ្រីស $X' = MX$ ៖  $\begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} 2 & -1 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 3 \\ 2 \end{bmatrix}$`),
        s(100, 355, 1080, R`• គុណម៉ាទ្រីស ៖  $\begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} 2(3) + (-1)(2) \\ 3(3) + 4(2) \end{bmatrix} = \begin{bmatrix} 6 - 2 \\ 9 + 8 \end{bmatrix} = \begin{bmatrix} 4 \\ 17 \end{bmatrix}$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  រូបភាពនៃចំណុច $A(3, 2)$ គឺចំណុច  $A'(4, 17)$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('២.១ ម៉ាទ្រីសនៃការបំប្លែងឆ្លុះធៀបនឹងអ័ក្ស (Reflections)'),
        card(60, 160, 600, 360, 'រូបមន្តម៉ាទ្រីសឆ្លុះ', R`• **ឆ្លុះធៀបនឹងអ័ក្ស $Ox$ ($S_{Ox}$)** ៖ ($y \to -y$)
  $$\begin{cases} x' = x \\ y' = -y \end{cases} \implies \mathbf{S_{Ox} = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}}$$
• **ឆ្លុះធៀបនឹងអ័ក្ស $Oy$ ($S_{Oy}$)** ៖ ($x \to -x$)
  $$\begin{cases} x' = -x \\ y' = y \end{cases} \implies \mathbf{S_{Oy} = \begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}}$$
• **ឆ្លុះធៀបនឹងគល់ $O$ ($S_O$)** ៖ ($x \to -x, y \to -y$)
  $$\mathbf{S_O = \begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}}$$`, { size: 23 }),
        geomTransSvg(680, 160, 540, 360, 'refl-y'),
        S.box(60, 545, 1160, 80, R`!!លក្ខណៈ!! ៖ គ្រប់ម៉ាទ្រីសឆ្លុះសុទ្ធតែមាន $S^2 = I$ (ឆ្លុះពីរដងត្រឡប់មករូបដើមវិញ) និង $\det(S) = -1$ ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.២ ម៉ាទ្រីសឆ្លុះធៀបនឹងបន្ទាត់ y = x និងចំណោលកែង'),
        card(60, 160, 560, 360, 'ឆ្លុះធៀបនឹងបន្ទាត់ y = x', R`• **រូបមន្ត** ៖ ចំណុច $M(x, y)$ ប្តូរជា $M'(y, x)$ ៖
  $$\begin{cases} x' = y \\ y' = x \end{cases} \implies \mathbf{S_{y=x} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}}$$
• **ឧទាហរណ៍** ៖
  រូបភាពនៃចំណុច $A(3, 5)$ តាមការឆ្លុះធៀបបន្ទាត់ $y = x$ គឺ $A'(5, 3)$ ។
• **ឆ្លុះធៀបបន្ទាត់ $y = -x$** ៖
  $$\mathbf{S_{y=-x} = \begin{bmatrix} 0 & -1 \\ -1 & 0 \end{bmatrix}}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ចំណោលកែងលើអ័ក្សកូអរដោនេ', R`• **ចំណោលកែងលើអ័ក្ស $Ox$ ($P_{Ox}$)** ៖
  (រក្សា $x$, កម្ទេច $y \to 0$) ៖
  $$\mathbf{P_{Ox} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}}$$
• **ចំណោលកែងលើអ័ក្ស $Oy$ ($P_{Oy}$)** ៖
  (កម្ទេច $x \to 0$, រក្សា $y$) ៖
  $$\mathbf{P_{Oy} = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}}$$
• **លក្ខណៈពិសេស** ៖ $P^2 = P$ និង $\det(P) = 0$ (គ្មានម៉ាទ្រីសច្រាស) ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!សរុប!! ៖ ម៉ាទ្រីសឆ្លុះមាន $\det = \pm 1$ (រក្សាផ្ទៃ) ចំណែកម៉ាទ្រីសចំណោលមាន $\det = 0$ (បាត់បង់វិមាត្រ) ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('៣.១ ម៉ាទ្រីសនៃការបំប្លែងវិល (Rotations)'),
        card(60, 160, 600, 360, 'រូបមន្តម៉ាទ្រីសរង្វិល R_α', R`ការបំប្លែងវិលជុំវិញគល់ $O$ មុំ $\alpha$ (ទិសវិជ្ជមាន) ៖
$$\mathbf{R_\alpha = \begin{bmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{bmatrix}}$$
• **ករណីមុំពិសេសសំខាន់ៗ** ៖
  - $R_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \qquad (M(x, y) \to M'(-y, x))$
  - $R_{180^\circ} = \begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix} = S_O$
  - $R_{270^\circ} = R_{-90^\circ} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$
• **លក្ខណៈ** ៖ $\det(R_\alpha) = \cos^2\alpha + \sin^2\alpha = 1$ (រក្សាប្រវែង និងផ្ទៃ) ។`, { size: 23 }),
        geomTransSvg(680, 160, 540, 360, 'rot'),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖ ការបំប្លែងវិល $R_\alpha$ រក្សាប្រវែងអង្កត់ និងរង្វាស់មុំនៅដដែល (Isometry) ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('៣.២ ឧទាហរណ៍គំរូ ៖ ការបំប្លែងវិលជុំវិញគល់ O'),
        l(60, 155, 1180, R`!!លំហាត់គំរូ ៖!!  រករូបភាពនៃចំណុច $A(4, 2)$ តាមការបំប្លែងវិល $R_{90^\circ}$ និង $R_{60^\circ}$ ៖`, { size: 27 }),
        s(100, 225, 1080, R`• តាម $R_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ ៖   $\begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 4 \\ 2 \end{bmatrix} = \begin{bmatrix} -2 \\ 4 \end{bmatrix} \implies A_1'(-2, 4)$`),
        s(100, 290, 1080, R`• តាម $R_{60^\circ} = \begin{bmatrix} \cos 60^\circ & -\sin 60^\circ \\ \sin 60^\circ & \cos 60^\circ \end{bmatrix} = \begin{bmatrix} 1/2 & -\sqrt{3}/2 \\ \sqrt{3}/2 & 1/2 \end{bmatrix}$ ៖`),
        s(100, 355, 1080, R`  $\begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} 1/2 & -\sqrt{3}/2 \\ \sqrt{3}/2 & 1/2 \end{bmatrix} \begin{bmatrix} 4 \\ 2 \end{bmatrix} = \begin{bmatrix} 2 - \sqrt{3} \\ 2\sqrt{3} + 1 \end{bmatrix}$`),
        S.box(60, 495, 1160, 115, R`!!ដូចនេះ!!  រូបភាពគឺ  $A_1'(-2, 4) \quad$ និង $\quad A_2'(2 - \sqrt{3}, \ 2\sqrt{3} + 1)$ ។`, { size: 28, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៣.៣ ចំឡងតាមមាត្រដ្ឋាន (Scaling / Dilation)'),
        card(60, 160, 560, 360, 'និយមន័យ និងម៉ាទ្រីសចំឡង', R`• **ចំឡងស្មើទិសដោយមេគុណ $k$ (Homothety)** ៖
  ចំណុច $M(x, y) \to M'(kx, ky)$ ៖
  $$\mathbf{H_k = \begin{bmatrix} k & 0 \\ 0 & k \end{bmatrix}}$$
• **ពង្រីក/បង្រួមតាមទិសដេក $k_x$ និងឈរ $k_y$** ៖
  $$\mathbf{D = \begin{bmatrix} k_x & 0 \\ 0 & k_y \end{bmatrix}}$$
• **ឧទាហរណ៍** ៖ $H_3 = \begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix}$ បំប្លែង $M(2, 5) \to M'(6, 15)$ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ផលប៉ះពាល់លើប្រវែង និងផ្ទៃក្រឡា', R`• **ប្រវែង** ៖
  ប្រវែងអង្កត់ថ្មីស្មើ $|k|$ ដងនៃប្រវែងដើម ។
• **ផ្ទៃក្រឡា** ៖
  $$\det(H_k) = k^2$$
  ផ្ទៃក្រឡារូបភាពថ្មីស្មើ $k^2$ ដងនៃផ្ទៃក្រឡារូបដើម!
• **ករណី $k = -1$** ៖
  $H_{-1} = \begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix} = S_O$ (ឆ្លុះធៀបនឹងគល់ $O$) ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖ បើដេទែរមីណង់ស្មើ $\det(M)$ នោះផ្ទៃក្រឡារូបភាពស្មើ $|\det(M)|$ ដងនៃផ្ទៃរូបដើម!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('៤.១ បន្សំនៃការបំប្លែងលីនេអ៊ែរ (Composition)'),
        card(60, 160, 560, 360, 'ទ្រឹស្តីបទបន្សំការបំប្លែង', R`បើការបំប្លែង $T_1$ មានម៉ាទ្រីស $M_1$ ហើយ $T_2$ មានម៉ាទ្រីស $M_2$ ៖
• បន្សំ $T = T_2 \circ T_1$ (ធ្វើ $T_1$ មុន រួចធ្វើ $T_2$ តាមក្រោយ) មានម៉ាទ្រីសតាង ៖
  $$\mathbf{M = M_2 \cdot M_1}$$
• **ប្រយ័ត្នប្រយែងលំដាប់គុណ** ៖
  ម៉ាទ្រីសនៃការបំប្លែងដែល **ធ្វើមុន ត្រូវគុណនៅខាងស្តាំ** ជានិច្ច!
  $$X' = M_2(M_1 X) = (M_2 M_1)X$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍ជាក់ស្តែង ៖ ឆ្លុះរួចវិល', R`រកម៉ាទ្រីសនៃបន្សំឆ្លុះតាម $Ox$ រួចបន្តវិលមុំ $90^\circ$ ៖
• $M_1 = S_{Ox} = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ (ធ្វើមុន)
• $M_2 = R_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ (ធ្វើក្រោយ)
• ម៉ាទ្រីសបន្សំ $M = M_2 \cdot M_1$ ៖
$$M = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} = S_{y=x}$$
*(បន្សំនេះបង្កើតបានការឆ្លុះតាមបន្ទាត់ $y = x$!)*`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ច្បាប់គ្រឹះ!! ៖ $T_2 \circ T_1 \iff M = M_2 \cdot M_1$ — អនុវត្តមុនគុណស្តាំ អនុវត្តក្រោយគុណឆ្វេង!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('សង្ខេបជំពូកទី ៤ មេរៀនទី ៣ ៖ តារាងម៉ាទ្រីសនៃការបំប្លែង'),
        card(60, 160, 560, 360, 'ម៉ាទ្រីសឆ្លុះ & ចំណោល', R`• **ឆ្លុះអ័ក្ស $Ox$** ៖ $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$
• **ឆ្លុះអ័ក្ស $Oy$** ៖ $\begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$
• **ឆ្លុះគល់ $O$** ៖ $\begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}$
• **ឆ្លុះបន្ទាត់ $y=x$** ៖ $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$
• **ចំណោល $Ox$** ៖ $\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$
• **ចំណោល $Oy$** ៖ $\begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}$`, { size: 23 }),
        card(660, 160, 560, 360, 'ម៉ាទ្រីសវិល & មាត្រដ្ឋាន', R`• **វិលមុំ $\alpha$** ៖ $\begin{bmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{bmatrix}$
• **វិលមុំ $90^\circ$** ៖ $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$
• **ចំឡងមាត្រដ្ឋាន $k$** ៖ $\begin{bmatrix} k & 0 \\ 0 & k \end{bmatrix}$
• **បន្សំការបំប្លែង** ៖ $T_2 \circ T_1 \iff M = M_2 \cdot M_1$
• **ផ្ទៃក្រឡារូបភាព** ៖ $S' = |\det(M)| \cdot S$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!អនុវត្ត!! ៖  សូមបន្តឆ្លើយសំណួរ MCQ ៣ សំណួរខាងក្រោមដើម្បីវាស់ស្ទង់ការយល់ដឹង!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 13 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`ម៉ាទ្រីសតាងការបំប្លែងឆ្លុះធៀបនឹងអ័ក្ស $Oy$ គឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\begin{bmatrix} -1 & 0 \\ 0 & -1 \end{bmatrix}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះឆ្លុះអ័ក្ស $Oy \implies x' = -x$ និង $y' = y \implies S_{Oy} = \begin{bmatrix} -1 & 0 \\ 0 & 1 \end{bmatrix}$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 14 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`រូបភាពនៃចំណុច $(3, -2)$ តាមការបំប្លែងវិលជុំវិញគល់តម្រុយមុំ $90^\circ$ គឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$(2, 3)$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$(-2, -3)$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$(3, 2)$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$(-3, 2)$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 3 \\ -2 \end{bmatrix} = \begin{bmatrix} 2 \\ 3 \end{bmatrix}$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 15 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`គេឱ្យ $T(x, y) = (2x - y, \ x + 3y)$ ។ ម៉ាទ្រីសតាងការបំប្លែង $T$ គឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\begin{bmatrix} 2 & -1 \\ 1 & 3 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\begin{bmatrix} 2 & 1 \\ -1 & 3 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$\begin{bmatrix} 1 & 3 \\ 2 & -1 \end{bmatrix}$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\begin{bmatrix} 2 & 3 \\ -1 & 1 \end{bmatrix}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះជួរដេក ១ គឺមេគុណ $x, y$ នៃ $x'$ : $(2, -1)$ និងជួរដេក ២ នៃ $y'$ : $(1, 3)$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 16 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព'),
        S.box(80, 160, 1120, 350, R`!!១.!! រករូបភាពនៃចំណុច $P(2, -5)$ តាមការបំប្លែងឆ្លុះធៀបនឹងអ័ក្ស $Ox$ និងអ័ក្ស $Oy$ ។
!!២.!! កំណត់ម៉ាទ្រីស $M$ នៃការបំប្លែងដែលបំប្លែងចំណុច $(1, 0) \to (3, 2)$ និង $(0, 1) \to (-1, 4)$ ។
!!៣.!! រករូបភាពនៃត្រីកោណ $ABC$ ដែលមាន $A(0, 0), B(3, 1), C(1, 4)$ តាមការបំប្លែងវិល $R_{90^\circ}$ ។
!!៤.!! បង្ហាញថាក្នុងប្លង់ បន្សំនៃការឆ្លុះធៀបនឹងអ័ក្ស $Ox$ រួចបន្តឆ្លុះធៀបនឹងអ័ក្ស $Oy$ គឺជាការឆ្លុះធៀបនឹងគល់ $O$ ។`, { size: 24, lh: '1.6' })
      ]),

      /* 17 */ S.homework(R`!!១.!! កំណត់ម៉ាទ្រីស $M$ នៃការបំប្លែងដែលបំប្លែងចំណុច $(1, 0) \to (3, 2)$ និងចំណុច $(0, 1) \to (-1, 4)$ ។
!!២.!! រករូបភាពនៃត្រីកោណ $ABC$ ដែលមានកំពូល $A(0, 0), B(3, 1), C(1, 4)$ តាមការបំប្លែងវិលជុំវិញគល់តម្រុយមុំ $90^\circ$ ។
!!៣.!! បង្ហាញថាក្នុងប្លង់ បន្សំនៃការឆ្លុះធៀបនឹងអ័ក្ស $Ox$ រួចបន្តឆ្លុះធៀបនឹងអ័ក្ស $Oy$ គឺជាការបំប្លែងឆ្លុះធៀបនឹងគល់តម្រុយ $O$ (ឬការវិលមុំ $180^\circ$) ។`),

      /* 18 */ S.thanks()
    ];
    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក៤ មេរៀនទី៣ ការបំប្លែងលីនេអ៊ែរ (១៨ ស្លាយ)',
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណការបំប្លែងលីនេអ៊ែរ', slide: 3 },
        { title: '២. ម៉ាទ្រីសឆ្លុះ & ចំណោល', slide: 5 },
        { title: '៣. ម៉ាទ្រីសវិល & មាត្រដ្ឋាន', slide: 7 },
        { title: '៤. បន្សំនៃការបំប្លែង', slide: 10 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 11 }
      ],
      slides: slides
    };
  }


function limits(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, info = K.info, kids = K.kids, line = K.line,
        step = K.step, solTitle = K.solTitle, title = K.title;
    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៥==        មេរៀនទី១', 'លីមីតនៃអនុគមន៍'),
      /* 2 */ S.objective([
        'យល់ដឹងពីនិយមន័យ និងប្រមាណវិធីលើលីមីតនៃអនុគមន៍',
        R`ចេះគណនាលីមីតត្រង់ចំនួនកំណត់ និងត្រង់អនន្ត`,
        R`ចេះគណនាលីមីតរាងមិនកំណត់ $\dfrac{0}{0}$ និង $\dfrac{\infty}{\infty}$`
      ]),
      /* 3 */ page([
        title('១. លីមីតនៃអនុគមន៍ត្រង់ចំនួនកំណត់'),
        S.box(60, 180, 1160, 260, R`!!__និយមន័យ__!! ៖
អនុគមន៍ $f$ មានលីមីត $L$ កាលណា $x$ ខិតជិត $x_0$ សរសេរ ៖
$$\lim_{x \to x_0} f(x) = L$$
លុះត្រាតែលីមីតឆ្វេងស្មើនឹងលីមីតស្តាំ ៖
$$\lim_{x \to x_0^-} f(x) = \lim_{x \to x_0^+} f(x) = L$$`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 4 */ page([
        title('២. ប្រមាណវិធីលើលីមីត'),
        S.box(60, 180, 1160, 300, R`បើ $\lim_{x \to x_0} f(x) = L$ និង $\lim_{x \to x_0} g(x) = M$ នោះ ៖
• $\lim_{x \to x_0} [f(x) \pm g(x)] = L \pm M$
• $\lim_{x \to x_0} [k \cdot f(x)] = k \cdot L \quad (k \in \mathbb{R})$
• $\lim_{x \to x_0} [f(x) \cdot g(x)] = L \cdot M$
• $\lim_{x \to x_0} \dfrac{f(x)}{g(x)} = \dfrac{L}{M} \quad (M \neq 0)$`, { size: 26, lh: '1.6' })
      ]),
      /* 5 */ page([
        title(R`៣. លីមីតរាងមិនកំណត់ $\dfrac{0}{0}$`),
        S.box(60, 180, 1160, 280, R`!!__វិធីដោះស្រាយ__!! ៖
១. !!ករណីពហុធា!! ៖ ដាក់ភាគយក និងភាគបែងជាផលគុណកត្តាដោយទាញកត្តា $(x - x_0)$ រួចសម្រួលចោល ។
២. !!ករណីរ៉ាឌីកាល់!! ៖ គុណភាគយក និងភាគបែងនឹងកន្សោមឆ្លាស់ដើម្បីបំបាត់រ៉ាឌីកាល់ រួចសម្រួលកត្តា $(x - x_0)$ ចោល ។`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 6 */ page([
        title(R`ឧទាហរណ៍ ៖ រាងមិនកំណត់ $\dfrac{0}{0}$`),
        S.box(60, 170, 1160, 80, R`គណនា $A = \lim_{x \to 2} \dfrac{x^2 - 4}{x - 2}$ និង $B = \lim_{x \to 0} \dfrac{\sqrt{x + 1} - 1}{x}$ ។`, { size: 26 }),
        solTitle(440, 260),
        S.box(160, 330, 960, 280, R`• $A = \lim_{x \to 2} \dfrac{(x - 2)(x + 2)}{x - 2} = \lim_{x \to 2} (x + 2) = 2 + 2 = 4$
• $B = \lim_{x \to 0} \dfrac{(\sqrt{x+1}-1)(\sqrt{x+1}+1)}{x(\sqrt{x+1}+1)} = \lim_{x \to 0} \dfrac{x}{x(\sqrt{x+1}+1)} = \lim_{x \to 0} \dfrac{1}{\sqrt{x+1}+1} = \dfrac{1}{2}$
!!ដូចនេះ!!  $A = 4,\ B = \dfrac{1}{2}$`, { size: 25, lh: '1.6', align: 'center', anim: true })
      ]),
      /* 7 */ page([
        title(R`៤. លីមីតរាងមិនកំណត់ $\dfrac{\infty}{\infty}$`),
        S.box(60, 180, 1160, 280, R`!!__វិធីដោះស្រាយ__!! ៖
• ចំពោះអនុគមន៍សនិទានកាលណា $x \to \pm\infty$ ៖
  គេទាញស្វ័យគុណធំបំផុតនៃ $x$ នៅភាគយក និងភាគបែងជាកត្តា រួចសម្រួល ។
• រូបមន្តគ្រឹះ ៖ $\lim_{x \to \pm\infty} \dfrac{1}{x^n} = 0 \quad (n > 0)$ ។`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 8 */ page([
        title('លំហាត់អនុវត្ត'),
        S.box(60, 170, 1160, 320, R`គណនាលីមីតខាងក្រោម ៖
!!ក.!! $\lim_{x \to 1} \dfrac{x^3 - 1}{x - 1}$
!!ខ.!! $\lim_{x \to 3} \dfrac{x^2 - 5x + 6}{x - 3}$
!!គ.!! $\lim_{x \to 4} \dfrac{\sqrt{x} - 2}{x - 4}$
!!ឃ.!! $\lim_{x \to +\infty} \dfrac{3x^2 + 2x - 1}{x^2 + 5}$`, { size: 26, lh: '1.7' })
      ]),
      /* 9 */ S.homework(R`!!១.!! គណនា $\lim_{x \to 2} \dfrac{x^3 - 8}{x^2 - 4}$ ។
!!២.!! គណនា $\lim_{x \to 0} \dfrac{\sqrt{1 + 3x} - 1}{x}$ ។
!!៣.!! គណនា $\lim_{x \to +\infty} \dfrac{5x^3 - 2x + 1}{2x^3 + 7}$ ។`),
      /* 10 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី១ លីមីតនៃអនុគមន៍', theme: 'school', school: K.info.school, school2: K.info.school2, school3: K.info.school3,
             teacher: K.info.teacher, slides: slides };
  }

  function derivatives(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, info = K.info, kids = K.kids, line = K.line,
        step = K.step, solTitle = K.solTitle, title = K.title;
    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៥==        មេរៀនទី២', 'ដេរីវេនៃអនុគមន៍'),
      /* 2 */ S.objective([
        'គណនាដេរីវេត្រង់មួយចំណុចតាមនិយមន័យ',
        'ចេះប្រើប្រាស់រូបមន្តដេរីវេនៃអនុគមន៍ងាយៗ',
        'រកសមីការបន្ទាត់ប៉ះ និងសិក្សាទិសដៅអថេរភាព'
      ]),
      /* 3 */ page([
        title('១. ដេរីវេនៃអនុគមន៍ត្រង់មួយចំណុច'),
        S.box(60, 180, 1160, 260, R`!!__និយមន័យ__!! ៖
ដេរីវេនៃអនុគមន៍ $y = f(x)$ ត្រង់ចំណុច $x_0$ កំណត់ដោយ ៖
$$f'(x_0) = \lim_{x \to x_0} \dfrac{f(x) - f(x_0)}{x - x_0} = \lim_{h \to 0} \dfrac{f(x_0 + h) - f(x_0)}{h}$$
(ប្រសិនបើតម្លៃលីមីតនេះមានជាចំនួនពិតកំណត់) ។`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 4 */ page([
        title('២. រូបមន្តដេរីវេងាយៗ'),
        S.box(60, 180, 1160, 320, R`ចំពោះអនុគមន៍ $u$ និង $v$ មានដេរីវេ និង $c$ ជាថេរ ៖
• $(c)' = 0$
• $(x^n)' = n x^{n-1} \quad (n \in \mathbb{Q})$
• $(u \pm v)' = u' \pm v'$
• $(c \cdot u)' = c \cdot u'$
• $(u \cdot v)' = u'v + uv'$
• $\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2} \quad (v \neq 0)$`, { size: 24, lh: '1.5' })
      ]),
      /* 5 */ page([
        title('៣. សមីការបន្ទាត់ប៉ះក្រាប'),
        S.box(60, 180, 1160, 280, R`សមីការបន្ទាត់ប៉ះ $(T)$ ទៅនឹងក្រាប $(C)$ តាង $y = f(x)$ ត្រង់ចំណុច $M_0(x_0, y_0)$ គឺ ៖
$$y = f'(x_0)(x - x_0) + y_0$$
ដែល ៖
• $x_0$ ជាអាប់ស៊ីសនៃចំណុចប៉ះ
• $y_0 = f(x_0)$ ជាអរដោនេនៃចំណុចប៉ះ
• $f'(x_0)$ ជាមេគុណប្រាប់ទិសនៃបន្ទាត់ប៉ះ ។`, { size: 25, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 6 */ page([
        title('៤. ដេរីវេ និងទិសដៅអថេរភាព'),
        S.box(60, 180, 1160, 280, R`ឧបមាថា $f$ មានដេរីវេលើចន្លោះ $I$ ៖
• បើ $f'(x) > 0$ ចំពោះគ្រប់ $x \in I$ នោះ $f$ ជា!!អនុគមន៍កើន!!លើចន្លោះ $I$ ។
• បើ $f'(x) < 0$ ចំពោះគ្រប់ $x \in I$ នោះ $f$ ជា!!អនុគមន៍ចុះ!!លើចន្លោះ $I$ ។
• បើ $f'(x) = 0$ ចំពោះគ្រប់ $x \in I$ នោះ $f$ ជា!!អនុគមន៍ថេរ!!លើចន្លោះ $I$ ។`, { size: 25, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 7 */ page([
        title('លំហាត់អនុវត្ត'),
        S.box(60, 170, 1160, 320, R`!!១.!! គណនាដេរីវេនៃអនុគមន៍ខាងក្រោម ៖
    ក. $f(x) = 3x^4 - 5x^2 + 2x - 1$
    ខ. $g(x) = (2x - 1)(x^2 + 3)$
    គ. $h(x) = \dfrac{2x + 1}{x - 3}$
!!២.!! រកសមីការបន្ទាត់ប៉ះនឹងក្រាប $y = x^2 - 3x + 2$ ត្រង់ចំណុច $x_0 = 2$ ។`, { size: 25, lh: '1.6' })
      ]),
      /* 8 */ S.homework(R`!!១.!! គណនាដេរីវេនៃ $y = \dfrac{x^2 - 1}{x + 2}$ ។
!!២.!! រកសមីការបន្ទាត់ប៉ះនឹងក្រាប $y = x^3 - 3x$ ត្រង់ចំណុច $x_0 = 1$ ។
!!៣.!! សិក្សាទិសដៅអថេរភាពនៃអនុគមន៍ $y = x^3 - 3x^2 + 1$ លើ $\mathbb{R}$ ។`),
      /* 9 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី២ ដេរីវេនៃអនុគមន៍', theme: 'school', school: K.info.school, school2: K.info.school2, school3: K.info.school3,
             teacher: K.info.teacher, slides: slides };
  }

  
  // ថ្នាក់ទី១១ ជំពូកទី២ មេរៀនទី១ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល — book pages 58–71
  function exponential(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, expGraph = K.expGraph, logGraph = K.logGraph;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី២==        មេរៀនទី១', 'អនុគមន៍អិចស្ប៉ូណង់ស្យែល', K.info),

      /* 2 */ K.toc([
        '==១. និយមន័យអនុគមន៍អិចស្ប៉ូណង់ស្យែល==',
        '២. ក្រាប និងលក្ខណៈនៃអនុគមន៍',
        '==៣. សមីការអិចស្ប៉ូណង់ស្យែល==',
        '៤. វិសមីការអិចស្ប៉ូណង់ស្យែល',
        '==៥. ការអនុវត្តជាក់ស្តែង==',
        '៦. សង្ខេប MCQ & កិច្ចការផ្ទះ'
      ], 38),

      /* 3 */ S.objective([
        R`យល់ច្បាស់ពីនិយមន័យ ដែនកំណត់ និងសំណុំតម្លៃនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល $y = a^x$ ($a > 0,\ a \ne 1$)`,
        R`ចេះសង់ក្រាប និងវិភាគលក្ខណៈ (កើន ចុះ អាស៊ីមតូតដេក $y = 0$ ចំណុចកាត់ $(0, 1)$)`,
        R`ចេះដោះស្រាយសមីការ និងវិសមីការអិចស្ប៉ូណង់ស្យែលតាមវិធីសម្រួលគោល និងវិធីតាងអថេរជំនួយ`,
        R`ចេះអនុវត្តគណនាក្នុងជីវភាពជាក់ស្តែង ៖ កំណើនប្រជាជន ការប្រាក់សមាស និងការបំបែកវិទ្យុសកម្ម`
      ]),

      /* 4 */ page([
        sec('១.១ រំលឹកលក្ខណៈនៃស្វ័យគុណ (Properties of Exponents)'),
        l(60, 155, 1180, R`ចំពោះគ្រប់ $a, b > 0$ និងចំនួនពិត $x, y \in \mathbb{R}$ យើងមានរូបមន្តសំខាន់ៗ ៖`, { size: 26 }),
        card(80, 225, 340, 150, 'ផលគុណ & ផលចែក', R`• $a^x \cdot a^y = a^{x+y}$
• $\dfrac{a^x}{a^y} = a^{x-y}$`, { size: 24 }),
        card(470, 225, 340, 150, 'ស្វ័យគុណនៃស្វ័យគុណ', R`• $(a^x)^y = a^{xy}$
• $(ab)^x = a^x \cdot b^x$`, { size: 24 }),
        card(860, 225, 340, 150, 'និទស្សន្តអវិជ្ជមាន & សូន្យ', R`• $a^0 = 1$ ($a \ne 0$)
• $a^{-x} = \dfrac{1}{a^x}$`, { size: 24 }),
        S.box(120, 420, 1040, 95, R`!!__និទស្សន្តសនិទាន (ឫស)__ ៖!!   $a^{\frac{m}{n}} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m$   (ដែល $n \ge 2, n \in \mathbb{N}$)
ឧទាហរណ៍ ៖  $8^{\frac{2}{3}} = (\sqrt[3]{8})^2 = 2^2 = 4$  និង  $16^{-\frac{3}{4}} = \dfrac{1}{(\sqrt[4]{16})^3} = \dfrac{1}{8}$`, { size: 24 }),
        kids()
      ]),

      /* 5 */ page([
        sec('១.២ និយមន័យនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល'),
        S.box(80, 160, 1120, 165, R`!!__និយមន័យ ៖__!!
អនុគមន៍អិចស្ប៉ូណង់ស្យែល គឺជាអនុគមន៍ដែលកំណត់ដោយសមីការ ៖
$$f(x) = a^x \quad \text{ឬ} \quad y = a^x$$
ដែល $a$ ជាចំនួនថេរវិជ្ជមានខុសពី $1$ ($a > 0$ និង $a \ne 1$) ហើយអថេរ $x$ ជាចំនួនពិត ($x \in \mathbb{R}$) ។
ចំនួន $a$ ហៅថា !!គោល!! នៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល ។`, { size: 25, align: 'center' }),
        tip(80, 350, 1120, 105, R`!!ហេតុអ្វីចាំបាច់ត្រូវមានលក្ខខណ្ឌ $a > 0$ និង $a \ne 1$?!!
• បើ $a \le 0$ ៖ កន្សោម $a^x$ មិនអាចកំណត់បានគ្រប់ $x \in \mathbb{R}$ ទេ (ឧ. $(-4)^{\frac{1}{2}} = \sqrt{-4} \notin \mathbb{R}$) ។
• បើ $a = 1$ ៖ នោះ $f(x) = 1^x = 1$ គ្រប់ $x$ ក្លាយជាអនុគមន៍ថេរ (បន្ទាត់ដេក មិនមែនអិចស្ប៉ូណង់ស្យែលទេ) ។`, { size: 22 }),
        kids()
      ]),

      /* 6 */ page([
        sec('២.១ ក្រាបនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល — ករណី a > 1'),
        card(60, 155, 660, 375, 'តារាងតម្លៃ & លក្ខណៈក្រាប y = 2ˣ (a = 2 > 1)', R`$$\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
x & -3 & -2 & -1 & 0 & 1 & 2 & 3 \\
\hline
y = 2^x & \frac{1}{8} & \frac{1}{4} & \frac{1}{2} & 1 & 2 & 4 & 8 \\
\hline
\end{array}$$
• **ទិសដៅក្រាប** ៖ កើនឡើងពីឆ្វេងទៅស្តាំ (អនុគមន៍កើនដាច់ខាតលើ $\mathbb{R}$)
• **ចំណុចពិសេស** ៖ ក្រាបកាត់អ័ក្ស $(Oy)$ ត្រង់ចំណុច $(0, 1)$
• **អាស៊ីមតូត** ៖ អ័ក្សដេក $y = 0$ ជាអាស៊ីមតូតដេកខាងឆ្វេង ($x \to -\infty$)
• **សំណុំតម្លៃ** ៖ ក្រាបស្ថិតនៅខាងលើអ័ក្ស $Ox$ ជានិច្ច ($y > 0$)`, { size: 23 }),
        expGraph(740, 155, 480, 375, 'inc'),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  ចំពោះ $a > 1$ អនុគមន៍ $y = a^x$ ជា!!អនុគមន៍កើនដាច់ខាត!!លើ $\mathbb{R}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.២ ក្រាបនៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល — ករណី 0 < a < 1'),
        card(60, 155, 660, 375, 'តារាងតម្លៃ & លក្ខណៈក្រាប y = (1/2)ˣ (a = 1/2 < 1)', R`$$\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
x & -3 & -2 & -1 & 0 & 1 & 2 & 3 \\
\hline
y = (\frac{1}{2})^x & 8 & 4 & 2 & 1 & \frac{1}{2} & \frac{1}{4} & \frac{1}{8} \\
\hline
\end{array}$$
• **ទិសដៅក្រាប** ៖ ថយចុះពីឆ្វេងទៅស្តាំ (អនុគមន៍ចុះដាច់ខាតលើ $\mathbb{R}$)
• **ចំណុចពិសេស** ៖ ក្រាបកាត់អ័ក្ស $(Oy)$ ត្រង់ចំណុច $(0, 1)$
• **អាស៊ីមតូត** ៖ អ័ក្សដេក $y = 0$ ជាអាស៊ីមតូតដេកខាងស្តាំ ($x \to +\infty$)
• **ភាពឆ្លុះ** ៖ ក្រាប $y = (1/2)^x$ ឆ្លុះគ្នានឹងក្រាប $y = 2^x$ ធៀបនឹងអ័ក្ស $(Oy)$`, { size: 23 }),
        expGraph(740, 155, 480, 375, 'dec'),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  ចំពោះ $0 < a < 1$ អនុគមន៍ $y = a^x$ ជា!!អនុគមន៍ចុះដាច់ខាត!!លើ $\mathbb{R}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('២.៣ សង្ខេបលក្ខណៈទូទៅនៃអនុគមន៍ y = aˣ'),
        card(60, 155, 660, 375, 'លក្ខណៈគ្រឹះទាំង ៦ នៃអនុគមន៍ y = aˣ', R`• **ដែនកំណត់** ៖ $D = \mathbb{R} = (-\infty, +\infty)$
• **សំណុំតម្លៃ** ៖ $R_f = (0, +\infty)$ ($y > 0$ ជានិច្ច)
• **ចំណុចកាត់រួម** ៖ កាត់អ័ក្ស $(Oy)$ ត្រង់ចំណុច $(0, 1)$ (ព្រោះ $a^0 = 1$)
• **អាស៊ីមតូតដេក** ៖ បន្ទាត់ $y = 0$ (អ័ក្សដេក $Ox$)
• **ករណី $a > 1$** ៖ អនុគមន៍កើនដាច់ខាត (ក្រាបខៀវ $y = 2^x$ ↗)
• **ករណី $0 < a < 1$** ៖ អនុគមន៍ចុះដាច់ខាត (ក្រាបទឹកក្រូច $y = (1/2)^x$ ↘)`, { size: 23 }),
        expGraph(740, 155, 480, 375, 'both'),
        S.box(60, 545, 1160, 80, R`!!ចំណាំសំខាន់!! ៖  ក្រាបនៃ  $y = a^x$  និង  $y = \left(\dfrac{1}{a}\right)^x = a^{-x}$  ឆ្លុះគ្នាធៀបនឹងអ័ក្សអរដោនេ $(Oy)$ ជានិច្ច ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('លំហាត់គំរូ ១ ៖ សង់ក្រាប និងវិភាគលក្ខណៈ y = 2ˣ + 1'),
        l(60, 150, 1180, R`សង់ក្រាបនៃអនុគមន៍  $y = 2^x + 1$  និងប្រៀបធៀបជាមួយក្រាប  $y = 2^x$  (សៀវភៅពុម្ពទំព័រ ៦០) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`១. តារាងតម្លៃត្រូវគ្នា ៖  កាលណា $x = -1 \Rightarrow y = 1.5$ ; $x = 0 \Rightarrow y = 2$ ; $x = 1 \Rightarrow y = 3$ ; $x = 2 \Rightarrow y = 5$`),
        s(60, 320, 1180, R`២. បម្លែងក្រាប ៖  ក្រាប $y = 2^x + 1$ បានមកពីការរុញក្រាប $y = 2^x$ !!ឡើងលើ ១ ឯកតា!! ស្របនឹងអ័ក្ស $(Oy)$`),
        s(60, 380, 1180, R`៣. លក្ខណៈក្រាប ៖`),
        s(100, 435, 1080, R`• ដែនកំណត់ ៖  $D = \mathbb{R}$  ;  សំណុំតម្លៃ ៖  $R_f = (1, +\infty)$`),
        s(100, 490, 1080, R`• ចំណុចកាត់អ័ក្ស $(Oy)$ ត្រង់  $(0, 2)$  ;  អាស៊ីមតូតដេក ៖  បន្ទាត់  $y = 1$  (នៅពេល $x \to -\infty$)`),
        kids(1100, 526, 150)
      ]),

      /* 10 */ page([
        sec('លំហាត់គំរូ ២ ៖ បម្លែងក្រាបតាមទិសដេក y = 3ˣ⁻¹'),
        l(60, 150, 1180, R`សង់ក្រាបនៃអនុគមន៍  $y = 3^{x-1}$  និងប្រៀបធៀបជាមួយក្រាប  $y = 3^x$  (សៀវភៅពុម្ពទំព័រ ៦១) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`១. បម្លែងក្រាប ៖  កន្សោម $x - 1$ បង្ហាញថា ក្រាប $y = 3^{x-1}$ បានមកពីការរំកិលក្រាប $y = 3^x$ !!ទៅស្តាំ ១ ឯកតា!!`),
        s(60, 320, 1180, R`២. ផ្ទៀងផ្ទាត់ចំណុចពិសេស ៖`),
        s(100, 375, 1080, R`• ចំពោះ $x = 1 \Rightarrow y = 3^{1-1} = 3^0 = 1 \Rightarrow$ ចំណុច $(1, 1)$`),
        s(100, 430, 1080, R`• ចំពោះ $x = 0 \Rightarrow y = 3^{0-1} = 3^{-1} = \frac{1}{3} \Rightarrow$ ចំណុចកាត់អ័ក្ស $(Oy)$ ត្រង់ $(0, \frac{1}{3})$`),
        S.box(100, 495, 1080, 75, R`!!វិធានទូទៅ!! ៖  ក្រាប $y = a^{x-h} + k$ បានមកពីក្រាប $y = a^x$ ដោយរំកិល $h$ ឯកតាដេក និង $k$ ឯកតាឈរ ។`, { size: 24, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('៣.១ គោលការណ៍ដោះស្រាយសមីការអិចស្ប៉ូណង់ស្យែល'),
        S.box(80, 160, 1120, 140, R`!!__ទ្រឹស្តីបទគ្រឹះ__ ៖!!
បើ $a > 0$ និង $a \ne 1$ នោះសមីការ ៖
$$a^{f(x)} = a^{g(x)} \iff f(x) = g(x)$$
«កាលណាគោលទាំងពីរស្មើគ្នា នោះនិទស្សន្តទាំងពីរក៏ត្រូវតែស្មើគ្នាដែរ»`, { size: 26, align: 'center' }),
        card(80, 325, 540, 255, 'វិធីសាស្រ្តទី ១ ៖ សម្រួលគោលដូចគ្នា', R`• ជំហានទី ១ ៖ បំប្លែងអង្គសងខាងឱ្យមានគោល $a$ ដូចគ្នា
• ជំហានទី ២ ៖ ឲ្យនិទស្សន្ត $f(x) = g(x)$
• ជំហានទី ៣ ៖ ដោះស្រាយសមីការដឺក្រេទី ១ ឬ ២
ឧទាហរណ៍ ៖  $2^x = 16 \iff 2^x = 2^4 \iff x = 4$`, { size: 22 }),
        card(660, 325, 540, 255, 'វិធីសាស្រ្តទី ២ ៖ តាងអថេរជំនួយ', R`អនុវត្តចំពោះសមីការទម្រង់ ៖
$$A(a^x)^2 + B(a^x) + C = 0$$
• តាង $t = a^x$ ដោយមានលក្ខខណ្ឌ !!$t > 0$!!
• ដោះស្រាយរកតម្លៃ $t$ រួចទាញរកតម្លៃ $x$
• ច្រានចោលតម្លៃ $t \le 0$`, { size: 22 })
      ]),

      /* 12 */ page([
        sec('លំហាត់គំរូ ៣ ៖ សមីការសម្រួលគោលដូចគ្នា'),
        l(60, 150, 1180, R`ដោះស្រាយសមីការខាងក្រោម (សៀវភៅពុម្ពទំព័រ ៦២) ៖`, { size: 26 }),
        card(80, 210, 540, 370, 'ក. 2³ˣ⁻¹ = 32', R`• បំប្លែង $32$ ជាស្វ័យគុណគោល $2$ ៖  $32 = 2^5$
$$2^{3x-1} = 2^5$$
• ដោយគោល $2$ ដូចគ្នា គេបាន ៖
$$3x - 1 = 5$$
$$3x = 6 \Rightarrow x = 2$$
!!ដូចនេះ!!   $x = 2$ ជាឫសនៃសមីការ ។`, { size: 23 }),
        card(660, 210, 540, 370, 'ខ. 3ˣ²⁻³ˣ = 1/9', R`• បំប្លែង $\frac{1}{9}$ ជាស្វ័យគុណគោល $3$ ៖  $\frac{1}{9} = 3^{-2}$
$$3^{x^2 - 3x} = 3^{-2}$$
• ឲ្យនិទស្សន្តស្មើគ្នា ៖
$$x^2 - 3x = -2 \iff x^2 - 3x + 2 = 0$$
• រកឫសតាមផលបូកមេគុណ $a+b+c=0$ ៖
$$x_1 = 1, \quad x_2 = 2$$
!!ដូចនេះ!!   សមីការមានឫសពីរគឺ $x = 1$ ឬ $x = 2$ ។`, { size: 23 })
      ]),

      /* 13 */ page([
        sec('លំហាត់គំរូ ៤ ៖ សមីការតាងអថេរជំនួយ t = aˣ'),
        l(60, 150, 1180, R`ដោះស្រាយសមីការ  $4^x - 3 \cdot 2^x + 2 = 0$  (សៀវភៅពុម្ពទំព័រ ៦៣) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`សរសេរសមីការឡើងវិញ ៖  ដោយ $4^x = (2^2)^x = (2^x)^2$ គេបាន ៖`),
        s(80, 315, 1120, R`$(2^x)^2 - 3(2^x) + 2 = 0$`),
        s(60, 370, 1180, R`តាង  $t = 2^x$  ដែល  !!$t > 0$!!  សមីការក្លាយជា ៖  $t^2 - 3t + 2 = 0$`),
        s(80, 425, 1120, R`ដោយ $a + b + c = 1 - 3 + 2 = 0 \Rightarrow t_1 = 1 > 0$ (យក)  និង  $t_2 = 2 > 0$ (យក)`),
        s(60, 480, 1180, R`ជំនួស $t$ ត្រឡប់មកវិញ ៖`),
        s(100, 530, 1080, R`• ចំពោះ $t = 1 \Rightarrow 2^x = 1 = 2^0 \Rightarrow x = 0$
• ចំពោះ $t = 2 \Rightarrow 2^x = 2^1 \Rightarrow x = 1$`),
        S.box(120, 600, 1040, 65, R`!!ដូចនេះ!!   សមីការមានសំណុំចម្លើយ  $S = \{0, 1\}$`, { size: 26, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('លំហាត់គំរូ ៥ ៖ សមីការ 9ˣ - 2·3ˣ⁺¹ - 27 = 0'),
        l(60, 150, 1180, R`ដោះស្រាយសមីការ  $9^x - 2 \cdot 3^{x+1} - 27 = 0$  (លំហាត់សៀវភៅពុម្ព) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`បំប្លែងតួ ៖  $9^x = (3^x)^2$  និង  $3^{x+1} = 3^x \cdot 3^1 = 3 \cdot 3^x$ ៖`),
        s(80, 315, 1120, R`$(3^x)^2 - 2(3 \cdot 3^x) - 27 = 0 \iff (3^x)^2 - 6(3^x) - 27 = 0$`),
        s(60, 370, 1180, R`តាង $t = 3^x$ ($t > 0$) ៖  $t^2 - 6t - 27 = 0$`),
        s(80, 425, 1120, R`$\Delta' = (-3)^2 - (1)(-27) = 9 + 27 = 36 = 6^2$
$t_1 = 3 + 6 = 9 > 0$ (យក)  ;   $t_2 = 3 - 6 = -3 < 0$ (មិនយក ព្រោះ $t > 0$)`),
        s(60, 490, 1180, R`ចំពោះ $t = 9 \Rightarrow 3^x = 9 = 3^2 \Rightarrow x = 2$`),
        S.box(160, 545, 960, 75, R`!!ដូចនេះ!!   ឫសតែមួយគត់នៃសមីការគឺ   $x = 2$`, { size: 28, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('៤.១ គោលការណ៍ដោះស្រាយវិសមីការអិចស្ប៉ូណង់ស្យែល'),
        tip(80, 150, 1120, 80, '!!ចំណាំសំខាន់បំផុត ៖!! ត្រូវពិនិត្យតម្លៃគោល $a$ ជាមុនសិន ដើម្បីដឹងថាត្រូវរក្សា ឬប្តូរទិសដៅវិសមភាព!', { size: 24 }),
        card(80, 250, 540, 280, 'ករណីទី ១ ៖ គោល a > 1 (រក្សាទិសដៅ)', R`ដោយសារ $y = a^x$ ជាអនុគមន៍កើន ៖
$$a^{f(x)} > a^{g(x)} \iff f(x) > g(x)$$
$$a^{f(x)} < a^{g(x)} \iff f(x) < g(x)$$
«ទិសដៅនៃវិសមភាពរក្សាទុកដូចដើម»
ឧទាហរណ៍ ៖  $2^x > 8 \iff 2^x > 2^3 \iff x > 3$`, { size: 23 }),
        card(660, 250, 540, 280, 'ករណីទី ២ ៖ គោល 0 < a < 1 (ប្តូរទិសដៅ)', R`ដោយសារ $y = a^x$ ជាអនុគមន៍ចុះ ៖
$$a^{f(x)} > a^{g(x)} \iff f(x) < g(x)$$
$$a^{f(x)} < a^{g(x)} \iff f(x) > g(x)$$
«ទិសដៅនៃវិសមភាពត្រូវ!!ត្រឡប់បញ្ច្រាស!!»
ឧទាហរណ៍ ៖  $(\frac{1}{2})^x > \frac{1}{4} \iff (\frac{1}{2})^x > (\frac{1}{2})^2 \iff x < 2$`, { size: 23 }),
        kids()
      ]),

      /* 16 */ page([
        sec('លំហាត់គំរូ ៦ ៖ វិសមីការករណី a > 1 និង 0 < a < 1'),
        l(60, 150, 1180, R`ដោះស្រាយវិសមីការខាងក្រោម (សៀវភៅពុម្ពទំព័រ ៦៤) ៖`, { size: 26 }),
        card(80, 210, 540, 360, 'ក. 2²ˣ⁺¹ > 16  (គោល 2 > 1)', R`• បំប្លែង $16 = 2^4$ ៖
$$2^{2x+1} > 2^4$$
• ដោយគោល $a = 2 > 1$ (អនុគមន៍កើន) រក្សាទិសដៅ ៖
$$2x + 1 > 4$$
$$2x > 3 \Rightarrow x > \frac{3}{2}$$
!!ដូចនេះ!!   សំណុំចម្លើយគឺ  $x \in \left(\dfrac{3}{2}, +\infty\right)$`, { size: 23 }),
        card(660, 210, 540, 360, 'ខ. (1/3)³ˣ⁻² ≥ 1/27  (គោល 0 < a < 1)', R`• បំប្លែង $\frac{1}{27} = (\frac{1}{3})^3$ ៖
$$\left(\frac{1}{3}\right)^{3x-2} \ge \left(\frac{1}{3}\right)^3$$
• ដោយគោល $a = \frac{1}{3} < 1$ (អនុគមន៍ចុះ) !!ប្តូរទិសដៅ!! ៖
$$3x - 2 \le 3$$
$$3x \le 5 \Rightarrow x \le \frac{5}{3}$$
!!ដូចនេះ!!   សំណុំចម្លើយគឺ  $x \in \left(-\infty, \dfrac{5}{3}\right]$`, { size: 23 })
      ]),

      /* 17 */ page([
        sec('លំហាត់គំរូ ៧ ៖ វិសមីការតាមវិធីតាងអថេរជំនួយ'),
        l(60, 150, 1180, R`ដោះស្រាយវិសមីការ  $4^x - 5 \cdot 2^x + 4 < 0$  (លំហាត់សៀវភៅពុម្ព) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`សរសេរវិសមីការជា ៖  $(2^x)^2 - 5(2^x) + 4 < 0$`),
        s(60, 315, 1180, R`តាង  $t = 2^x$ ($t > 0$) ៖  វិសមីការក្លាយជា  $t^2 - 5t + 4 < 0$`),
        s(80, 370, 1120, R`សមីការ $t^2 - 5t + 4 = 0$ មានឫស  $t_1 = 1, t_2 = 4$`),
        s(80, 425, 1120, R`សញ្ញានៃត្រីធាដឺក្រេទី ២ (យកចន្លោះឫសព្រោះ $< 0$) ៖  $1 < t < 4$`),
        s(60, 480, 1180, R`ជំនួស $t = 2^x$ ចូលវិញ ៖  $1 < 2^x < 4 \iff 2^0 < 2^x < 2^2$`),
        s(80, 535, 1120, R`ដោយគោល $2 > 1$ គេបាន ៖  $0 < x < 2$`),
        S.box(140, 595, 1000, 65, R`!!ដូចនេះ!!   សំណុំចម្លើយនៃវិសមីការគឺ  $x \in (0, 2)$`, { size: 26, align: 'center', anim: true })
      ]),

      /* 18 */ page([
        sec('៥.១ ការអនុវត្តជាក់ស្តែង — ការប្រាក់សមាស (Compound Interest)'),
        S.box(80, 150, 1120, 145, R`!!__រូបមន្តការប្រាក់សមាស__ ៖!!
$$A = P\left(1 + \frac{r}{n}\right)^{nt}$$
ដែល ៖ $P$ ជាប្រាក់ដើម, $r$ ជាអត្រាការប្រាក់ប្រចាំឆ្នាំ (គិតជាទសភាគ),
$n$ ជាចំនួនលើកនៃការគិតការប្រាក់ក្នុង ១ ឆ្នាំ, $t$ ជារយៈពេលគិតជាឆ្នាំ, $A$ ជាប្រាក់សរុប ។`, { size: 24 }),
        card(80, 315, 540, 265, 'ករណីគិតការប្រាក់បន្តបន្ទាប់ (Continuously)', R`កាលណា $n \to +\infty$ គេបានរូបមន្ត ៖
$$A = P e^{rt}$$
ដែល $e \approx 2.71828...$ ជាគោលលោការីតធម្មជាតិ ។
• $1$ ដងក្នុង ១ ឆ្នាំ $\Rightarrow n = 1$
• $1$ ឆមាសម្តង $\Rightarrow n = 2$
• $1$ ត្រីមាសម្តង $\Rightarrow n = 4$
• $1$ ខែម្តង $\Rightarrow n = 12$`, { size: 22 }),
        card(660, 315, 540, 265, 'លំហាត់អនុវត្តន៍ (សៀវភៅពុម្ពទំព័រ ៦៥)', R`ពូសុខទិញប័ណ្ណសន្សំប្រាក់ $P = 50\,000$ រៀល អត្រា $r = 6\% = 0.06$ ក្នុង ១ ឆ្នាំ ($n = 1$) ។ គណនាប្រាក់សរុបក្រោយពេល $t = 3$ ឆ្នាំ ៖
$$A = 50\,000(1 + 0.06)^3$$
$$A = 50\,000(1.06)^3$$
$$A = 50\,000 \times 1.191016 = 59\,550.8 \text{ ៛}$$
!!ដូចនេះ!! គាត់ទទួលបានប្រាក់សរុប $59\,551$ រៀល ។`, { size: 21 })
      ]),

      /* 19 */ page([
        sec('៥.២ ការអនុវត្តជាក់ស្តែង — កំណើនប្រជាជន & បាក់តេរី'),
        l(60, 150, 1180, R`អនុគមន៍អិចស្ប៉ូណង់ស្យែលពណ៌នាអំពីការកើនឡើងឥតឈប់ឈរនៃសារពាង្គកាយមានជីវិត ៖`, { size: 26 }),
        card(80, 205, 540, 335, 'រូបមន្តកំណើនទូទៅ (Malthus)', R`$$N(t) = N_0 e^{kt}$$
• $N_0$ ៖ ចំនួនដំបូងពេលចាប់ផ្តើម ($t = 0$)
• $k > 0$ ៖ អត្រាកំណើនប្រចាំ
• $t$ ៖ រយៈពេលកន្លងផុត
• $N(t)$ ៖ ចំនួនសរុបក្រោយពេល $t$`, { size: 25 }),
        card(640, 205, 560, 335, 'រូបមន្តកើនទ្វេដង (Doubling Time)', R`$$N(t) = N_0 \cdot 2^{\frac{t}{d}}$$
• $d$ ៖ រយៈពេលដែលចំនួនកើនទ្វេដង
• បាក់តេរីកើនទ្វេដងរៀងរាល់ $30\text{ នាទី}$ ($d = 30$)
  បើដំបូងមាន $100$ នោះក្រោយ $2\text{ ម៉ោង}$ ($t = 120$) ៖
  $$N(120) = 100 \cdot 2^4 = 1\,600$$`, { size: 24 }),
        S.box(80, 555, 1120, 75, R`!!ការបំបែកវិទ្យុសកម្ម (Radioactive Decay)!! ៖   $m(t) = m_0 \left(\dfrac{1}{2}\right)^{\frac{t}{h}}$   ($h$ ជាកន្លះជីវិត Half-life)`, { size: 25, align: 'center' })
      ]),

      /* 20 */ page([
        sec('សង្ខេបជំពូកទី ២ មេរៀនទី ១ ៖ រូបមន្តគន្លឹះ'),
        card(60, 150, 365, 365, '១. អនុគមន៍ y = aˣ', R`• គោល $a > 0 \, , \, a \ne 1$
• ដែនកំណត់ ៖ $D = \mathbb{R}$
• សំណុំតម្លៃ ៖ $R_f = (0, +\infty)$
• ក្រាបកាត់ចំណុច $(0, 1)$
• អាស៊ីមតូតដេក ៖ $y = 0$
• $a > 1$ ៖ អនុគមន៍កើន ↗
• $0 < a < 1$ ៖ អនុគមន៍ចុះ ↘`, { size: 24 }),
        card(455, 150, 370, 365, '២. សមីការអិចស្ប៉ូណង់ស្យែល', R`• **សម្រួលគោល** ៖
  $a^{f(x)} = a^{g(x)} \iff f(x) = g(x)$
• **តាងអថេរ** ៖
  $t = a^x \quad (t > 0)$
• **បំពាក់លោការីត** ៖
  $a^x = b \iff x = \log_a b$`, { size: 24 }),
        card(855, 150, 365, 365, '៣. វិសមីការអិចស្ប៉ូណង់ស្យែល', R`• **បើ $a > 1$ (រក្សាទិស)** ៖
  $a^{f(x)} > a^{g(x)} \iff f(x) > g(x)$
• **បើ $0 < a < 1$ (ប្តូរទិស)** ៖
  $a^{f(x)} > a^{g(x)} \iff f(x) < g(x)$`, { size: 24 }),
        S.box(60, 535, 1160, 85, R`!!អនុវត្តន៍!! ៖   ការប្រាក់សមាស  $A = P\left(1 + \dfrac{r}{n}\right)^{nt}$   និង   កំណើនបន្តបន្ទាប់  $A = P e^{rt}$`, { size: 26, align: 'center', anim: true })
      ]),

      /* 21 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`តើអនុគមន៍ណាខ្លះជាអនុគមន៍ចុះលើ $\mathbb{R}$?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', '$y = 3^x$', { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', '$y = (0.4)^x$', { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', '$y = (1.5)^x$', { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', '$y = 2^{x+1}$', { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះគោល $a = 0.4$ ស្ថិតក្នុងចន្លោះ $0 < a < 1$ នាំឱ្យក្រាបចុះ)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 22 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`ដោះស្រាយសមីការ  $3^{2x-1} = 27$  ។ តើតម្លៃ $x$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', '$x = 1$', { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', '$x = 2$', { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', '$x = 3$', { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', '$x = 4$', { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $27 = 3^3 \Rightarrow 2x - 1 = 3 \Rightarrow 2x = 4 \Rightarrow x = 2$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 23 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`ដោះស្រាយវិសមីការ  $\left(\dfrac{1}{2}\right)^x < \dfrac{1}{8}$  ។ សំណុំចម្លើយគឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', '$x < 3$', { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', '$x > 3$', { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$x \le 3$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$x \ge 3$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះគោល $\frac{1}{2} < 1$ ត្រូវប្តូរទិសដៅវិសមភាព $(\frac{1}{2})^x < (\frac{1}{2})^3 \Rightarrow x > 3$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 24 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ៦៨–៧១)'),
        S.box(80, 160, 1120, 340, R`!!១.!! ដោះស្រាយសមីការអិចស្ប៉ូណង់ស្យែល ៖
    ក. $5^{x+1} = 125$
    ខ. $2^{x^2 - x} = 4$
    គ. $4^x - 10 \cdot 2^x + 16 = 0$
    ឃ. $3^{2x+1} - 28 \cdot 3^x + 9 = 0$
!!២.!! ដោះស្រាយវិសមីការអិចស្ប៉ូណង់ស្យែល ៖
    ក. $3^{2x-5} > 27$
    ខ. $\left(\dfrac{1}{4}\right)^{x-1} \ge \left(\dfrac{1}{4}\right)^3$
    គ. $9^x - 4 \cdot 3^x + 3 < 0$`, { size: 24, lh: '1.6' })
      ]),

      /* 25 */ S.homework(R`!!១.!! សង់ក្រាបនៃអនុគមន៍  $y = 2^{x-2} - 1$  រួចកំណត់ដែនកំណត់ សំណុំតម្លៃ និងអាស៊ីមតូត ។
!!២.!! ដោះស្រាយសមីការ  $4^{x+1} + 4^{1-x} = 10$  លើ $\mathbb{R}$ ។
!!៣.!! គេដាក់ប្រាក់សន្សំ $10\,000$ ដុល្លារ ដោយទទួលបានអត្រាការប្រាក់សមាស $5\%$ ក្នុងមួយឆ្នាំ ដោយគិតការប្រាក់រៀងរាល់ត្រីមាស ($n = 4$) ។ គណនាប្រាក់សរុបក្រោយពេល $5$ ឆ្នាំ ។`),

      /* 26 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក២ មេរៀនទី១ អនុគមន៍អិចស្ប៉ូណង់ស្យែល (២៦ ស្លាយ)',
      grade: '11',
      chapterNum: 2,
      chapter: 'ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងលោការីត',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. និយមន័យអនុគមន៍អិចស្ប៉ូណង់ស្យែល', slide: 3 },
        { title: '២. ក្រាប និងលក្ខណៈនៃអនុគមន៍', slide: 5 },
        { title: '៣. សមីការអិចស្ប៉ូណង់ស្យែល', slide: 10 },
        { title: '៤. វិសមីការអិចស្ប៉ូណង់ស្យែល', slide: 14 },
        { title: '៥. ការអនុវត្តជាក់ស្តែង (ការប្រាក់ & កំណើន)', slide: 17 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 19 }
      ],
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      slides: slides
    };
  }


  // ថ្នាក់ទី១១ ជំពូកទី២ មេរៀនទី២ ៖ អនុគមន៍លោការីត — book pages 72–89
  function logarithm(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card, expGraph = K.expGraph, logGraph = K.logGraph;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី២==        មេរៀនទី២', 'អនុគមន៍លោការីត', K.info),

      /* 2 */ K.toc([
        '==១. និយមន័យ & ក្រាបនៃអនុគមន៍លោការីត==',
        '២. លក្ខណៈនៃលោការីត & រូបមន្តប្តូរគោល',
        '==៣. សមីការលោការីត==',
        '៤. វិសមីការលោការីត',
        '==៥. លោការីតគោល ១០ & លោការីតនេពែ==',
        '៦. ការអនុវត្តជាក់ស្តែង & កិច្ចការផ្ទះ'
      ], 38),

      /* 3 */ S.objective([
        R`យល់ច្បាស់ពីទំនាក់ទំនងច្រាសរវាងអិចស្ប៉ូណង់ស្យែល និងលោការីត $y = \log_a x \iff a^y = x$ ($a > 0, a \ne 1, x > 0$)`,
        R`ចេះសង់ក្រាប រកដែនកំណត់ ($D = (0, +\infty)$) សំណុំតម្លៃ ($R_f = \mathbb{R}$) និងអាស៊ីមតូតឈរ $x = 0$`,
        R`ចេះប្រើប្រាស់លក្ខណៈលោការីត និងរូបមន្តប្តូរគោលក្នុងការគណនា និងសម្រួលកន្សោម`,
        R`ចេះដោះស្រាយសមីការ និងវិសមីការលោការីតដោយផ្ទៀងផ្ទាត់លក្ខខណ្ឌអត្ថិភាពយ៉ាងត្រឹមត្រូវ`,
        R`ចេះអនុវត្តគណនាក្នុងវិទ្យាសាស្ត្រជាក់ស្តែង ៖ កម្រិតសំឡេង Decibel រញ្ជួយដី Richter និងកំហាប់ pH`
      ]),

      /* 4 */ page([
        sec('១.១ និយមន័យនៃលោការីត (Definition of Logarithm)'),
        S.box(80, 155, 1120, 160, R`!!__និយមន័យ ៖__!!
ចំពោះ $a > 0$ និង $a \ne 1$ ព្រមទាំង $x > 0$ លោការីតគោល $a$ នៃ $x$ កំណត់ដោយ ៖
$$y = \log_a x \iff a^y = x$$
«លោការីតគឺជា!!និទស្សន្ត!! $y$ ដែលត្រូវលើកគោល $a$ ឱ្យឡើងដល់ស្មើនឹង $x$»`, { size: 26, align: 'center' }),
        card(80, 335, 540, 240, 'លក្ខខណ្ឌចាំបាច់', R`• គោល $a > 0$ និង $a \ne 1$
• កន្សោមក្នុងលោការីត !!$x > 0$!! (វិជ្ជមានដាច់ខាត)
• លោការីតនៃចំនួនអវិជ្ជមាន ឬសូន្យ !!គ្មានន័យទេ!!
  (ឧ. $\log_2(-4)$ និង $\log_3(0)$ គ្មានន័យ)`, { size: 22 }),
        card(660, 335, 540, 240, 'លទ្ធផលផ្ទាល់ពីនិយមន័យ', R`• $\log_a 1 = 0$  (ព្រោះ $a^0 = 1$)
• $\log_a a = 1$  (ព្រោះ $a^1 = a$)
• $\log_a(a^x) = x$  (ចំពោះគ្រប់ $x \in \mathbb{R}$)
• $a^{\log_a x} = x$  (ចំពោះគ្រប់ $x > 0$)`, { size: 22 }),
        kids()
      ]),

      /* 5 */ page([
        sec('១.២ ឧទាហរណ៍គណនាតម្លៃលោការីតគ្រឹះ'),
        l(60, 150, 1180, R`គណនាតម្លៃនៃលោការីតខាងក្រោមតាមនិយមន័យ (សៀវភៅពុម្ពទំព័រ ៧២) ៖`, { size: 26 }),
        card(80, 215, 350, 340, 'ក. គោលជាចំនួនគត់', R`• $\log_2 8 = 3$
  (ព្រោះ $2^3 = 8$)

• $\log_3 81 = 4$
  (ព្រោះ $3^4 = 81$)

• $\log_5 125 = 3$
  (ព្រោះ $5^3 = 125$)`, { size: 24 }),
        card(465, 215, 350, 340, 'ខ. កន្សោមជាប្រភាគ', R`• $\log_3\left(\dfrac{1}{9}\right) = -2$
  (ព្រោះ $3^{-2} = \frac{1}{9}$)

• $\log_2\left(\dfrac{1}{16}\right) = -4$
  (ព្រោះ $2^{-4} = \frac{1}{16}$)

• $\log_{10}(0.001) = -3$
  (ព្រោះ $10^{-3} = 0.001$)`, { size: 24 }),
        card(850, 215, 350, 340, 'គ. កន្សោមជាឫស', R`• $\log_2\sqrt{2} = \dfrac{1}{2}$
  (ព្រោះ $2^{1/2} = \sqrt{2}$)

• $\log_3\sqrt[3]{9} = \dfrac{2}{3}$
  (ព្រោះ $3^{2/3} = \sqrt[3]{9}$)

• $\log_7 1 = 0$
  (ព្រោះ $7^0 = 1$)`, { size: 24 }),
        kids()
      ]),

      /* 6 */ page([
        sec('១.៣ ក្រាបនៃអនុគមន៍លោការីត — ករណី a > 1 និង 0 < a < 1'),
        card(60, 155, 660, 375, 'លក្ខណៈក្រាប y = logₐ x', R`• **ករណី $a > 1$ (ក្រាបបៃតង $y = \log_2 x$)** ៖
  - ក្រាបកើនពីឆ្វេងទៅស្តាំ (កើនលើ $(0, +\infty)$)
  - កាត់អ័ក្សអាប់ស៊ីស $(Ox)$ ត្រង់ចំណុច $(1, 0)$
  - អ័ក្សឈរ $x = 0$ ($Oy$) ជា!!អាស៊ីមតូតឈរ!!ខាងក្រោម ($x \to 0^+$)
• **ករណី $0 < a < 1$ (ក្រាបស្វាយ $y = \log_{1/2} x$)** ៖
  - ក្រាបចុះពីឆ្វេងទៅស្តាំ (ចុះលើ $(0, +\infty)$)
  - អ័ក្សឈរ $x = 0$ ($Oy$) ជា!!អាស៊ីមតូតឈរ!!ខាងលើ ($x \to 0^+$)
  - ក្រាបទាំងពីរឆ្លុះគ្នាធៀបនឹងអ័ក្សអាប់ស៊ីស $(Ox)$`, { size: 23 }),
        logGraph(740, 155, 480, 375, 'both'),
        S.box(60, 545, 1160, 80, R`!!លក្ខណៈកាត់រួម!! ៖  គ្រប់ក្រាបនៃអនុគមន៍ $y = \log_a x$ តែងតែកាត់អ័ក្ស $(Ox)$ ត្រង់ចំណុច $(1, 0)$ ជានិច្ច ព្រោះ $\log_a 1 = 0$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('១.៤ សង្ខេបលក្ខណៈទូទៅនៃអនុគមន៍ y = logₐ x'),
        card(60, 155, 660, 375, 'លក្ខណៈគ្រឹះទាំង ៥ នៃអនុគមន៍ y = logₐ x', R`• **ដែនកំណត់** ៖ $D = (0, +\infty)$ (អថេរ $x > 0$ ជានិច្ច)
• **សំណុំតម្លៃ** ៖ $R_f = \mathbb{R} = (-\infty, +\infty)$
• **ចំណុចកាត់អ័ក្ស** ៖ ក្រាបកាត់អ័ក្ស $(Ox)$ ត្រង់ចំណុច $(1, 0)$
• **អាស៊ីមតូតឈរ** ៖ បន្ទាត់ $x = 0$ (អ័ក្សឈរ $Oy$)
• **ទិសដៅអថេរភាព** ៖
  - បើ $a > 1$ ៖ អនុគមន៍កើនដាច់ខាត (ក្រាបបៃតង ↗)
  - បើ $0 < a < 1$ ៖ អនុគមន៍ចុះដាច់ខាត (ក្រាបស្វាយ ↘)
• **លក្ខណៈ 1-to-1** ៖ $\log_a u = \log_a v \iff u = v$`, { size: 23 }),
        logGraph(740, 155, 480, 375, 'inc'),
        S.box(60, 545, 1160, 80, R`!!លក្ខណៈមួយទល់មួយ!! ៖  ចំពោះ $u, v > 0$ ៖   $\log_a u > \log_a v \iff u > v$ (បើ $a > 1$)   និង   $\iff u < v$ (បើ $0 < a < 1$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('លំហាត់គំរូ ១ ៖ សង់ក្រាប y = log₂(x - 1) និង y = log₂ x + 1'),
        l(60, 150, 1180, R`សង់ក្រាប និងវិភាគលក្ខណៈ (សៀវភៅពុម្ពទំព័រ ៧៤) ៖`, { size: 26 }),
        card(80, 210, 540, 360, 'ក. ក្រាប y = log₂(x - 1)', R`• លក្ខខណ្ឌ ៖  $x - 1 > 0 \Rightarrow x > 1$
  $\Rightarrow$ ដែនកំណត់ ៖  $D = (1, +\infty)$
• បម្លែងក្រាប ៖  បានមកពីការរំកិលក្រាប $y = \log_2 x$ !!ទៅស្តាំ ១ ឯកតា!! ស្របនឹងអ័ក្ស $Ox$
• អាស៊ីមតូតឈរ ៖  បន្ទាត់  $x = 1$
• ចំណុចកាត់អ័ក្ស $Ox$ ៖
  $\log_2(x - 1) = 0 \Rightarrow x - 1 = 1 \Rightarrow (2, 0)$`, { size: 23 }),
        card(660, 210, 540, 360, 'ខ. ក្រាប y = log₂ x + 1', R`• លក្ខខណ្ឌ ៖  $x > 0$
  $\Rightarrow$ ដែនកំណត់ ៖  $D = (0, +\infty)$
• បម្លែងក្រាប ៖  បានមកពីការរំកិលក្រាប $y = \log_2 x$ !!ឡើងលើ ១ ឯកតា!! ស្របនឹងអ័ក្ស $Oy$
• អាស៊ីមតូតឈរ ៖  បន្ទាត់  $x = 0$ (អ័ក្ស $Oy$)
• ចំណុចកាត់អ័ក្ស $Ox$ ៖
  $\log_2 x + 1 = 0 \Rightarrow \log_2 x = -1 \Rightarrow (\frac{1}{2}, 0)$`, { size: 23 })
      ]),

      /* 9 */ page([
        sec('២.១ លក្ខណៈសំខាន់ៗនៃលោការីត (Properties of Logarithms)'),
        l(60, 150, 1180, R`ចំពោះគ្រប់ $a > 0, a \ne 1$ និងចំនួនពិតវិជ្ជមាន $x, y > 0$ យើងមាន ៖`, { size: 26 }),
        card(80, 215, 350, 250, '១. ផលគុណទៅជាផលបូក', R`$$\log_a(xy) = \log_a x + \log_a y$$
ឧទាហរណ៍ ៖
$\log_2(4 \times 8) = \log_2 4 + \log_2 8$
$= 2 + 3 = 5 = \log_2 32$ ✓`, { size: 23 }),
        card(465, 215, 350, 250, '២. ផលចែកទៅជាផលសង', R`$$\log_a\left(\frac{x}{y}\right) = \log_a x - \log_a y$$
ឧទាហរណ៍ ៖
$\log_3\left(\frac{81}{9}\right) = \log_3 81 - \log_3 9$
$= 4 - 2 = 2 = \log_3 9$ ✓`, { size: 23 }),
        card(850, 215, 350, 250, '៣. ស្វ័យគុណទម្លាក់មេគុណ', R`$$\log_a(x^k) = k \cdot \log_a x$$
($\forall k \in \mathbb{R}$)
ឧទាហរណ៍ ៖
$\log_2(8^5) = 5 \log_2 8$
$= 5 \times 3 = 15$ ✓`, { size: 23 }),
        tip(100, 490, 1080, 80, R`!!ការយល់ច្រឡំជាញឹកញាប់ ៖!!  $\log_a(x + y) \ne \log_a x + \log_a y$  និង  $\dfrac{\log_a x}{\log_a y} \ne \log_a(x - y)$`, { size: 22 })
      ]),

      /* 10 */ page([
        sec('លំហាត់គំរូ ២ ៖ គណនា និងសម្រួលកន្សោមលោការីត'),
        l(60, 150, 1180, R`គណនាតម្លៃនៃកន្សោមខាងក្រោម (សៀវភៅពុម្ពទំព័រ ៧៥) ៖`, { size: 26 }),
        card(80, 210, 540, 360, 'ក. A = log₂ 80 - log₂ 5', R`• អនុវត្តរូបមន្តផលសងទៅជាផលចែក ៖
$$A = \log_2\left(\frac{80}{5}\right)$$
• សម្រួលផលចែក ៖  $\dfrac{80}{5} = 16$
$$A = \log_2 16 = \log_2(2^4) = 4$$
!!ដូចនេះ!!   $A = 4$`, { size: 24 }),
        card(660, 210, 540, 360, 'ខ. B = log₃ 6 + log₃ 4.5', R`• អនុវត្តរូបមន្តផលបូកទៅជាផលគុណ ៖
$$B = \log_3(6 \times 4.5)$$
• គណនាផលគុណ ៖  $6 \times 4.5 = 27$
$$B = \log_3 27 = \log_3(3^3) = 3$$
!!ដូចនេះ!!   $B = 3$`, { size: 24 })
      ]),

      /* 11 */ page([
        sec('២.២ រូបមន្តប្តូរគោលនៃលោការីត (Change of Base Formula)'),
        S.box(80, 155, 1120, 150, R`!!__ទ្រឹស្តីបទរូបមន្តប្តូរគោល ៖__!!
បើ $a, b, x$ ជាចំនួនពិតវិជ្ជមាន ហើយ $a \ne 1$ និង $b \ne 1$ នោះគេបាន ៖
$$\log_a x = \frac{\log_b x}{\log_b a}$$
«រូបមន្តនេះអនុញ្ញាតឱ្យយើងប្តូរពីគោល $a$ ចាស់ ទៅជាគោល $b$ ថ្មីតាមតម្រូវការ»`, { size: 25, align: 'center' }),
        card(80, 330, 540, 240, 'រូបមន្តបំបែកពិសេសទី ១', R`• ករណីប្តូរគោលទៅជា $x$ ៖
$$\log_a b = \frac{1}{\log_b a}$$
ឧទាហរណ៍ ៖
$$\log_8 2 = \frac{1}{\log_2 8} = \frac{1}{3}$$`, { size: 24 }),
        card(660, 330, 540, 240, 'រូបមន្តបំបែកពិសេសទី ២', R`• ករណីគោលជាស្វ័យគុណ $a^n$ ៖
$$\log_{a^n} b = \frac{1}{n} \log_a b$$
$$\log_{a^n}(b^m) = \frac{m}{n} \log_a b$$
ឧទាហរណ៍ ៖  $\log_4 8 = \log_{2^2}(2^3) = \frac{3}{2}$`, { size: 24 })
      ]),

      /* 12 */ page([
        sec('លំហាត់គំរូ ៣ ៖ អនុវត្តរូបមន្តប្តូរគោល'),
        l(60, 150, 1180, R`គណនាតម្លៃនៃកន្សោមខាងក្រោម (សៀវភៅពុម្ពទំព័រ ៧៦) ៖`, { size: 26 }),
        card(80, 210, 540, 360, 'ក. គណនា C = log₂ 3 · log₃ 4 · log₄ 8', R`• ប្តូរគោលទាំងអស់ទៅជាគោល $10$ (ឬគោល $2$) ៖
$$C = \frac{\log 3}{\log 2} \times \frac{\log 4}{\log 3} \times \frac{\log 8}{\log 4}$$
• សម្រួលកត្តាដូចគ្នាខ្វែង ៖
$$C = \frac{\log 8}{\log 2} = \log_2 8 = 3$$
!!ដូចនេះ!!   $C = 3$`, { size: 24 }),
        card(660, 210, 540, 360, 'ខ. គណនា D = log₄ 9 · log₃ 2', R`• សរសេរ $4 = 2^2$ និង $9 = 3^2$ ៖
$$\log_4 9 = \log_{2^2}(3^2) = \frac{2}{2} \log_2 3 = \log_2 3$$
• ជំនួសចូល ៖
$$D = \log_2 3 \times \log_3 2 = \log_2 3 \times \frac{1}{\log_2 3} = 1$$
!!ដូចនេះ!!   $D = 1$`, { size: 24 })
      ]),

      /* 13 */ page([
        sec('៣.១ គោលការណ៍ដោះស្រាយសមីការលោការីត'),
        tip(80, 150, 1120, 75, '!!ជំហានទី ១ (ខានមិនបាន) ៖!! ត្រូវកំណត់លក្ខខណ្ឌឱ្យកន្សោមក្នុងលោការីតវិជ្ជមានដាច់ខាត ($> 0$) ជាមុនសិន!', { size: 24 }),
        card(80, 245, 540, 290, 'ទម្រង់ទី ១ ៖ logₐ f(x) = logₐ g(x)', R`• លក្ខខណ្ឌ ៖  $f(x) > 0$ និង $g(x) > 0$
• ដោះស្រាយ ៖  $f(x) = g(x)$
• ផ្ទៀងផ្ទាត់ ៖  យកឫសណាដែលផ្ទៀងផ្ទាត់លក្ខខណ្ឌ
ឧទាហរណ៍ ៖  $\log_3(x + 1) = \log_3 4$
$\Rightarrow x + 1 = 4 \Rightarrow x = 3$ (ផ្ទៀងផ្ទាត់ $3 + 1 = 4 > 0$)`, { size: 22 }),
        card(660, 245, 540, 290, 'ទម្រង់ទី ២ ៖ logₐ f(x) = b', R`• លក្ខខណ្ឌ ៖  $f(x) > 0$
• តាមនិយមន័យ ៖  $f(x) = a^b$
  (ស្វ័យគុណ $a^b > 0$ ជានិច្ច ដូច្នេះលក្ខខណ្ឌតែងផ្ទៀង)
ឧទាហរណ៍ ៖  $\log_2(x - 3) = 4$
$\Rightarrow x - 3 = 2^4 = 16 \Rightarrow x = 19$`, { size: 22 }),
        kids()
      ]),

      /* 14 */ page([
        sec('លំហាត់គំរូ ៤ ៖ សមីការលោការីត log₂ x + log₂(x - 2) = 3'),
        l(60, 150, 1180, R`ដោះស្រាយសមីការ  $\log_2 x + \log_2(x - 2) = 3$  (សៀវភៅពុម្ពទំព័រ ៧៧) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`១. លក្ខខណ្ឌអត្ថិភាព ៖  $\begin{cases} x > 0 \\ x - 2 > 0 \end{cases} \iff x > 2$`),
        s(60, 315, 1180, R`២. បង្រួមផលបូកទៅជាផលគុណ ៖  $\log_2[x(x - 2)] = 3$`),
        s(80, 370, 1120, R`តាមនិយមន័យ ៖  $x(x - 2) = 2^3 = 8 \iff x^2 - 2x - 8 = 0$`),
        s(80, 425, 1120, R`ដោះស្រាយសមីការដឺក្រេទី ២ ៖  $(x - 4)(x + 2) = 0 \Rightarrow x_1 = 4, \quad x_2 = -2$`),
        s(60, 480, 1180, R`៣. ផ្ទៀងផ្ទាត់លក្ខខណ្ឌ $x > 2$ ៖`),
        s(100, 530, 1080, R`• $x_1 = 4 > 2$  !!(យក)!!
• $x_2 = -2 < 2$  !!(មិនយក / ច្រានចោល)!!`),
        S.box(160, 595, 960, 65, R`!!ដូចនេះ!!   ឫសតែមួយគត់នៃសមីការគឺ   $x = 4$`, { size: 28, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('លំហាត់គំរូ ៥ ៖ សមីការតាងអថេរជំនួយ t = logₐ x'),
        l(60, 150, 1180, R`ដោះស្រាយសមីការ  $\log_3^2 x - 4\log_3 x + 3 = 0$  (សៀវភៅពុម្ពទំព័រ ៧៨) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`១. លក្ខខណ្ឌអត្ថិភាព ៖  $x > 0$`),
        s(60, 315, 1180, R`២. តាង  $t = \log_3 x$  (ចំណាំ ៖ $t \in \mathbb{R}$ មិនចាំបាច់វិជ្ជមានទេ) ៖`),
        s(80, 370, 1120, R`សមីការក្លាយជា ៖  $t^2 - 4t + 3 = 0$`),
        s(80, 425, 1120, R`ដោយ $a + b + c = 1 - 4 + 3 = 0 \Rightarrow t_1 = 1, \quad t_2 = 3$`),
        s(60, 480, 1180, R`៣. ជំនួសតម្លៃ $t$ ត្រឡប់មកវិញ ៖`),
        s(100, 530, 1080, R`• ចំពោះ $t = 1 \Rightarrow \log_3 x = 1 \Rightarrow x = 3^1 = 3 > 0$ (យក)
• ចំពោះ $t = 3 \Rightarrow \log_3 x = 3 \Rightarrow x = 3^3 = 27 > 0$ (យក)`),
        S.box(140, 595, 1000, 65, R`!!ដូចនេះ!!   សមីការមានសំណុំចម្លើយ   $S = \{3, 27\}$`, { size: 28, align: 'center', anim: true })
      ]),

      /* 16 */ page([
        sec('៤.១ គោលការណ៍ដោះស្រាយវិសមីការលោការីត'),
        tip(80, 150, 1120, 75, '!!ច្បាប់មាស ៖!! ១. រកលក្ខខណ្ឌ $f(x) > 0, g(x) > 0$  |  ២. បើ $a > 1$ រក្សាទិសដៅ  |  ៣. បើ $0 < a < 1$ ប្តូរទិសដៅ!', { size: 23 }),
        card(80, 245, 540, 290, 'ករណីទី ១ ៖ គោល a > 1 (រក្សាទិសដៅ)', R`ដោយ $y = \log_a x$ ជាអនុគមន៍កើន ៖
$$\log_a f(x) > \log_a g(x) \iff f(x) > g(x) > 0$$
$$\log_a f(x) < \log_a g(x) \iff 0 < f(x) < g(x)$$
«ទិសដៅនៃវិសមភាពរក្សាទុកដូចដើម»
ឧទាហរណ៍ ៖  $\log_2 x > 3 \iff x > 2^3 = 8$`, { size: 22 }),
        card(660, 245, 540, 290, 'ករណីទី ២ ៖ គោល 0 < a < 1 (ប្តូរទិសដៅ)', R`ដោយ $y = \log_a x$ ជាអនុគមន៍ចុះ ៖
$$\log_a f(x) > \log_a g(x) \iff 0 < f(x) < g(x)$$
$$\log_a f(x) < \log_a g(x) \iff f(x) > g(x) > 0$$
«ទិសដៅនៃវិសមភាពត្រូវ!!ត្រឡប់បញ្ច្រាស!!»
ឧទាហរណ៍ ៖  $\log_{1/2} x > 2 \iff 0 < x < (\frac{1}{2})^2 = \frac{1}{4}$`, { size: 22 }),
        kids()
      ]),

      /* 17 */ page([
        sec('លំហាត់គំរូ ៦ ៖ វិសមីការលោការីតករណី a > 1 និង 0 < a < 1'),
        l(60, 150, 1180, R`ដោះស្រាយវិសមីការខាងក្រោម (សៀវភៅពុម្ពទំព័រ ៧៩) ៖`, { size: 26 }),
        card(80, 210, 540, 360, 'ក. log₂(2x - 4) < 3  (គោល 2 > 1)', R`• លក្ខខណ្ឌអត្ថិភាព ៖  $2x - 4 > 0 \Rightarrow x > 2$
• បំប្លែង $3 = \log_2(2^3) = \log_2 8$ ៖
$$\log_2(2x - 4) < \log_2 8$$
• ដោយគោល $2 > 1$ រក្សាទិសដៅ ៖
$$2x - 4 < 8 \Rightarrow 2x < 12 \Rightarrow x < 6$$
• ប្រសព្វជាមួយលក្ខខណ្ឌ $x > 2$ ៖
$$2 < x < 6$$
!!ដូចនេះ!!   សំណុំចម្លើយគឺ  $x \in (2, 6)$`, { size: 23 }),
        card(660, 210, 540, 360, 'ខ. log₁/₃(x - 2) ≥ -1  (គោល 0 < a < 1)', R`• លក្ខខណ្ឌអត្ថិភាព ៖  $x - 2 > 0 \Rightarrow x > 2$
• បំប្លែង $-1 = \log_{1/3}(\frac{1}{3})^{-1} = \log_{1/3} 3$ ៖
$$\log_{1/3}(x - 2) \ge \log_{1/3} 3$$
• ដោយគោល $\frac{1}{3} < 1$ !!ប្តូរទិសដៅ!! ៖
$$x - 2 \le 3 \Rightarrow x \le 5$$
• ប្រសព្វជាមួយលក្ខខណ្ឌ $x > 2$ ៖
$$2 < x \le 5$$
!!ដូចនេះ!!   សំណុំចម្លើយគឺ  $x \in (2, 5]$`, { size: 23 })
      ]),

      /* 18 */ page([
        sec('៥.១ លោការីតគោល ១០ និងលោការីតនេពែ'),
        card(80, 160, 540, 300, 'លោការីតគោល ១០ (Common Log)', R`• ជានិមិត្តសញ្ញា ៖  $$\log_{10} x = \log x$$
  (សរសេរ $\log$ ដោយមិនបាច់ដាក់គោល $10$)
• លក្ខណៈពិសេស ៖
  $\log 10 = 1$  ;  $\log 100 = 2$  ;  $\log 1\,000 = 3$
  $\log 0.1 = -1$  ;  $\log 0.01 = -2$
• ប្រើប្រាស់ទូទៅក្នុងវិទ្យាសាស្ត្រ និងតារាងគណិតវិទ្យា`, { size: 23 }),
        card(660, 160, 540, 300, 'លោការីតនេពែ / ធម្មជាតិ (Natural Log)', R`• ជានិមិត្តសញ្ញា ៖  $$\log_e x = \ln x$$
  (ដែលគោល $e \approx 2.71828...$ ជាចំនួនអសនិទាន)
• លក្ខណៈពិសេស ៖
  $$\ln e = 1 \quad ; \quad \ln 1 = 0$$
  $$e^{\ln x} = x \quad (x > 0) \quad ; \quad \ln(e^x) = x$$
• ប្តូរគោល ៖  $\log_a x = \dfrac{\ln x}{\ln a}$`, { size: 23 }),
        S.box(100, 485, 1080, 80, R`!!អនុវត្តដោះស្រាយសមីការអិចស្ប៉ូណង់ស្យែល!! ៖   $2^x = 5 \iff \ln(2^x) = \ln 5 \iff x\ln 2 = \ln 5 \iff x = \dfrac{\ln 5}{\ln 2} \approx 2.322$`, { size: 24, align: 'center', anim: true })
      ]),

      /* 19 */ page([
        sec('៦.១ ការអនុវត្តជាក់ស្តែង — កម្រិតសំឡេង & រញ្ជួយដី & pH'),
        card(60, 155, 370, 360, 'កម្រិតសំឡេង Decibel', R`$$\beta = 10 \log\left(\frac{I}{I_0}\right)$$
• $\beta$ ៖ កម្រិតសំឡេង (dB)
• $I$ ៖ អាំងតង់ស៊ីតេសំឡេង ($\text{W/m}^2$)
• $I_0 = 10^{-12}\text{ W/m}^2$ ៖ កម្រិតខ្សោយបំផុត
• សំឡេងធម្មតា $\approx 60\text{ dB}$
• សំឡេងយន្តហោះ $\approx 120\text{ dB}$`, { size: 24 }),
        card(455, 155, 370, 360, 'កម្រិតរញ្ជួយដី Richter', R`$$M = \log\left(\frac{A}{A_0}\right)$$
• $M$ ៖ រ៉ិចទ័រ (Richter scale)
• $A$ ៖ អំព្លីទុតរលកវាស់ដោយ seismograph
• $A_0$ ៖ អំព្លីទុតយោង
• $M$ កើន $1$ កម្រិត $\Rightarrow$ អំព្លីទុតកើន $10$ ដង ហើយថាមពលកើនប្រហែល $31.6$ ដង!`, { size: 23 }),
        card(850, 155, 370, 360, 'កំហាប់ pH ក្នុងគីមីវិទ្យា', R`$$\text{pH} = -\log[H^+]$$
• $[H^+]$ ៖ កំហាប់អ៊ីយ៉ុង $H^+$ (mol/L)
• $\text{pH} = 7$ ៖ អព្យាក្រឹត (ទឹកបរិសុទ្ធ)
• $\text{pH} < 7$ ៖ អាស៊ីត (Acidic)
• $\text{pH} > 7$ ៖ បាស (Basic)
• ឈាមមនុស្សមាន $\text{pH} \approx 7.4$`, { size: 24 })
      ]),

      /* 20 */ page([
        sec('សង្ខេបជំពូកទី ២ ៖ តារាងប្រៀបធៀប aˣ និង logₐ x'),
        l(60, 150, 1180, R`លក្ខណៈឆ្លុះគ្នានៃអនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត ៖`, { size: 26 }),
        card(70, 205, 550, 310, 'អនុគមន៍អិចស្ប៉ូណង់ស្យែល y = aˣ', R`• ដែនកំណត់ ៖  $D = \mathbb{R}$
• សំណុំតម្លៃ ៖  $R_f = (0, +\infty)$
• កាត់អ័ក្ស $(Oy)$ ត្រង់ចំណុច  $(0, 1)$
• អាស៊ីមតូតដេក ៖  បន្ទាត់  $y = 0$
• កើនបើ $a > 1$  ;  ចុះបើ $0 < a < 1$`, { size: 25 }),
        card(660, 205, 550, 310, 'អនុគមន៍លោការីត y = logₐ x', R`• ដែនកំណត់ ៖  $D = (0, +\infty)$
• សំណុំតម្លៃ ៖  $R_f = \mathbb{R}$
• កាត់អ័ក្ស $(Ox)$ ត្រង់ចំណុច  $(1, 0)$
• អាស៊ីមតូតឈរ ៖  បន្ទាត់  $x = 0$
• កើនបើ $a > 1$  ;  ចុះបើ $0 < a < 1$`, { size: 25 }),
        S.box(70, 535, 1140, 85, R`!!ទំនាក់ទំនងច្រាស!! ៖   $\log_a(a^x) = x \quad (\forall x \in \mathbb{R}) \qquad \text{និង} \qquad a^{\log_a x} = x \quad (\forall x > 0)$`, { size: 25, align: 'center', anim: true })
      ]),

      /* 21 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`តើដែនកំណត់នៃអនុគមន៍  $y = \log_3(x - 5)$  ជាចន្លោះណា?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$D = \mathbb{R}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$D = (5, +\infty)$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$D = [5, +\infty)$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$D = (0, +\infty)$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះលក្ខខណ្ឌកន្សោមក្នុងលោការីតគឺ $x - 5 > 0 \iff x > 5$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 22 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`តម្លៃនៃកន្សោម  $\log_2 24 - \log_2 3$  ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', '$2$', { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', '$3$', { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', '$4$', { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', '$8$', { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $\log_2 24 - \log_2 3 = \log_2(24/3) = \log_2 8 = 3$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 23 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`ដោះស្រាយសមីការ  $\log_3(2x - 1) = 2$  ។ តើតម្លៃ $x$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', '$x = 4$', { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', '$x = 5$', { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', '$x = 9$', { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', '$x = 10$', { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $2x - 1 = 3^2 = 9 \Rightarrow 2x = 10 \Rightarrow x = 5$)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 24 MCQ 4 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៤)'),
        l(60, 155, 1180, R`ដោះស្រាយវិសមីការ  $\log_{1/2}(x - 3) \ge -2$  ។ សំណុំចម្លើយគឺ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$x \le 7$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$3 < x \le 7$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', '$x > 3$', { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$x \ge 7$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (លក្ខខណ្ឌ $x > 3$ ; គោល $\frac{1}{2} < 1$ ប្តូរទិស $x - 3 \le (\frac{1}{2})^{-2} = 4 \Rightarrow 3 < x \le 7$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 25 */ page([
        sec('លំហាត់ជំពូកទី ២ ពីសៀវភៅពុម្ព (ទំព័រ ៨៦–៨៩)'),
        S.box(80, 160, 1120, 340, R`!!១.!! ដោះស្រាយសមីការលោការីត ៖
    ក. $\log_5(x^2 - 4) = \log_5(3x)$
    ខ. $\log_2(x + 2) + \log_2(x - 2) = 5$
    គ. $\log_2^2 x - 3\log_2 x + 2 = 0$
    ឃ. $\log_x 8 = 3$
!!២.!! ដោះស្រាយវិសមីការលោការីត ៖
    ក. $\log_3(3x - 2) < 2$
    ខ. $\log_{0.5}(2x - 1) \ge \log_{0.5}(x + 4)$
    គ. $\log_2(x^2 - x - 2) \le 2$`, { size: 24, lh: '1.6' })
      ]),

      /* 26 */ S.homework(R`!!១.!! សង់ក្រាបនៃអនុគមន៍  $y = \log_3(x + 2) - 1$  រួចរកដែនកំណត់ សំណុំតម្លៃ និងអាស៊ីមតូតឈរ ។
!!២.!! ដោះស្រាយសមីការ  $\log_2 x + \log_4 x + \log_8 x = 11$  (ប្រើរូបមន្តប្តូរគោល) ។
!!៣.!! សូលុយស្យុងមួយមានកំហាប់អ៊ីយ៉ុង $[H^+] = 2.5 \times 10^{-4}\text{ mol/L}$ ។ គណនាតម្លៃ $\text{pH}$ នៃសូលុយស្យុងនោះ (ដឹងថា $\log 2.5 \approx 0.398$) ។`),

      /* 27 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១១ · ជំពូក២ មេរៀនទី២ អនុគមន៍លោការីត (២៧ ស្លាយ)',
      grade: '11',
      chapterNum: 2,
      chapter: 'ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងលោការីត',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ អនុគមន៍លោការីត',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. និយមន័យ & ក្រាបនៃអនុគមន៍លោការីត', slide: 3 },
        { title: '២. លក្ខណៈនៃលោការីត & រូបមន្តប្តូរគោល', slide: 8 },
        { title: '៣. សមីការលោការីត', slide: 12 },
        { title: '៤. វិសមីការលោការីត', slide: 15 },
        { title: '៥. លោការីតគោល ១០ & លោការីតនេពែ', slide: 17 },
        { title: '៦. ការអនុវត្តជាក់ស្តែង & សង្ខេប', slide: 18 },
        { title: 'សំណួរ MCQ & កិច្ចការផ្ទះ', slide: 20 }
      ],
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      slides: slides
    };
  }


  // =========================================================================
  // GRADE 10 — CHAPTER 1: POLYNOMIALS (ពហុធា)
  // =========================================================================

  function polynomials(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១០', '==ជំពូកទី១==        មេរៀនទី១', 'ពហុធា', K.info),

      /* 2 */ K.toc([
        '==១. សញ្ញាណនៃឯកធា & ពហុធា==',
        '២. ដឺក្រេ និងទម្រង់ស្តង់ដានៃពហុធា',
        '==៣. ប្រមាណវិធីលើពហុធា (បូក ដក គុណ)==',
        '៤. រូបមន្តពន្លាតសំខាន់ៗ & ត្រីកោណប៉ាស្កាល់',
        '==៥. វិធីសាស្ត្រដាក់ជាផលគុណកត្តា==',
        '៦. សំណួរ MCQ & កិច្ចការផ្ទះ'
      ]),

      /* 3 */ S.objective([
        R`យល់ដឹងច្បាស់ពីសញ្ញាណឯកធា ពហុធា ដឺក្រេ និងអនុវត្តប្រមាណវិធីបូក ដក គុណលើពហុធា`,
        R`ចេះប្រើប្រាស់រូបមន្តពន្លាត និងស្ទាត់ជំនាញក្នុងការដាក់កន្សោមពីជគណិតជាផលគុណកត្តា`
      ]),

      /* 4 */ page([
        sec('១.១ សញ្ញាណ និងសមាសភាគនៃឯកធា (Monomials)'),
        card(60, 160, 560, 360, 'និយមន័យ & សមាសភាគឯកធា', R`• **និយមន័យ** ៖ ឯកធា គឺជាចំនួនពិត មួយអថេរ ឬផលគុណរវាងចំនួនពិត និងអថេរដែលមាន **និទស្សន្តជាចំនួនគត់មិនអវិជ្ជមាន** ($0, 1, 2, \dots$) ។
• **សមាសភាគនៃឯកធា** ៖
  - **មេគុណ (Coefficient)** ៖ ចំនួនពិតនៅខាងមុខអថេរ
  - **ផ្នែកអថេរ (Variable part)** ៖ អថេរ និងស្វ័យគុណរបស់វា
• **ឧទាហរណ៍** ៖ ចំពោះឯកធា $-5x^3y^2$ ៖
  - មេគុណគឺ $-5$
  - ផ្នែកអថេរគឺ $x^3y^2$
• **ចំណាំ** ៖ ចំនួនពិត $c 
eq 0$ ជាឯកធាដឺក្រេ $0$ ($c = c x^0$) ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ឯកធាដូចគ្នា & ការបូកដកឯកធា', R`• **ឯកធាដូចគ្នា** ៖ ជាឯកធាទាំងឡាយណាដែលមាន **ផ្នែកអថេរដូចគ្នាទាំងស្រុង** (អថេរដូចគ្នា និងនិទស្សន្តត្រូវគ្នាស្មើគ្នា) ។
  - *ឧទាហរណ៍* ៖ $3x^2y$ និង $-7x^2y$ ជាឯកធាដូចគ្នា
  - $2x^3$ និង $2x^2$ **មិនដូចគ្នាទេ** (និទស្សន្តខុសគ្នា)
• **ការបូក ដក ឯកធាដូចគ្នា** ៖
  $$	ext{បូក/ដកមេគុណ} 	imes 	ext{ផ្នែកអថេរដដែល}$$
• **ឧទាហរណ៍** ៖
  $$5x^2y - 8x^2y + 2x^2y = (5 - 8 + 2)x^2y = -x^2y$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំសំខាន់!! ៖ កន្សោមដែលមានអថេរនៅភាគបែងដូចជា $\dfrac{3}{x}$ ឬមានរ៉ាឌីកាល់ $\sqrt{x}$ **មិនមែនជាឯកធាទេ**!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('១.២ សញ្ញាណនៃពហុធា (Polynomials) & ទម្រង់ស្តង់ដា'),
        card(60, 160, 560, 360, 'និយមន័យ & ប្រភេទនៃពហុធា', R`• **និយមន័យ** ៖ ពហុធា គឺជាផលបូកពីជគណិតនៃឯកធាពីរ ឬច្រើន ។ ឯកធានីមួយៗហៅថា **តួនៃពហុធា** ។
• **ឈ្មោះតាមចំនួនតួ** ៖
  - មាន $1$ តួ ហៅថា **ឯកធា** (Monomial) ៖ $4x^2$
  - មាន $2$ តួ ហៅថា **ទ្វេធា** (Binomial) ៖ $2x - 5$
  - មាន $3$ តួ ហៅថា **ត្រីធា** (Trinomial) ៖ $x^2 - 4x + 3$
• **ទម្រង់ស្តង់ដានៃពហុធាមួយអថេរ** ៖
  $$P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0$$
  ដែលរៀបតាមលំដាប់ **និទស្សន្តចុះ** ($a_n 
eq 0$) ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ដឺក្រេ & តួសំខាន់ៗនៃពហុធា', R`ពិនិត្យពហុធា $P(x) = a_n x^n + \dots + a_1 x + a_0$ ($a_n 
eq 0$) ៖
• **ដឺក្រេនៃពហុធា ($\deg P$)** ៖ ជានិទស្សន្តធំបំផុតនៃអថេរក្នុងពហុធា (គឺ $n$) ។
• **មេគុណនាំមុខ (Leading Coefficient)** ៖ មេគុណនៃតួដែលមាននិទស្សន្តធំបំផុត (គឺ $a_n$) ។
• **តួថេរ (Constant Term)** ៖ តួដែលគ្មានអថេរ (គឺ $a_0$) ។
• **ឧទាហរណ៍** ៖ ចំពោះ $P(x) = -4x^5 + 7x^3 - 2x + 9$ ៖
  - ដឺក្រេ ៖ $\deg(P) = 5$
  - មេគុណនាំមុខ ៖ $-4$
  - តួថេរ ៖ $9$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖ ពហុធាសូន្យ $P(x) = 0$ គ្មានដឺក្រេទេ ។ ពហុធាថេរ $P(x) = c$ ($c 
eq 0$) មានដឺក្រេស្មើ $0$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ ការរៀបទម្រង់ស្តង់ដា & កំណត់ដឺក្រេ'),
        card(60, 160, 560, 360, 'ដំណោះស្រាយ ៖ បង្រួម & រៀបទម្រង់ស្តង់ដា', R`• **បម្រាប់** ៖ $P(x) = 3x^2 - 5x^4 + 7 - x + 2x^4 - 8x^2$
• **ជំហានទី ១ (ផ្ដុំតួដឺក្រេដូចគ្នា)** ៖
$$P(x) = (-5x^4 + 2x^4) + (3x^2 - 8x^2) - x + 7$$
• **ជំហានទី ២ (គណនាមេគុណ)** ៖
$$\mathbf{P(x) = -3x^4 - 5x^2 - x + 7}$$
*(តម្រៀបស្វ័យគុណនៃអថេរពីធំទៅតូច ៖ $4 \to 2 \to 1 \to 0$)*`, { size: 23 }),
        card(660, 160, 560, 360, 'កំណត់លក្ខណៈសម្គាល់នៃពហុធា P(x)', R`• **ទម្រង់ស្តង់ដា** ៖
$$P(x) = -3x^4 - 5x^2 - x + 7$$
• **ដឺក្រេនៃពហុធា** ៖ $\deg(P) = 4$ (ស្វ័យគុណធំបំផុត)
• **មេគុណនាំមុខ (Leading Coeff.)** ៖ $-3$ (មេគុណនៃតួ $x^4$)
• **តួថេរ (Constant Term)** ៖ $7$ (តួគ្មានអថេរ $x$)
• **ចំនួនតួនៃពហុធា** ៖ មាន $4$ តួ (ពហុធា ៤ តួ)`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចម្លើយ!! ៖  $P(x) = -3x^4 - 5x^2 - x + 7$ មានដឺក្រេ ៤ មេគុណនាំមុខ $-3$ និងតួថេរ $7$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('២.១ វិធីបូក និងវិធីដកពហុធា (Addition & Subtraction)'),
        card(60, 160, 560, 360, 'វិធីបូក និងដកពហុធា', R`• **ក្បួនគណនា** ៖
  1. សរសេរពហុធាក្នុងវង់ក្រចក $A(x) \pm B(x)$
  2. លុបវង់ក្រចក (បើខាងមុខមានសញ្ញា $-$ ត្រូវ **ប្តូរសញ្ញាគ្រប់តួ** ក្នុងវង់ក្រចកនោះ)
  3. ផ្ដុំឯកធាដូចគ្នា រួចបូក/ដកមេគុណ ។
• **ឧទាហរណ៍** ៖ បើ $A = 3x^2 - 2x + 1$ និង $B = x^2 + 4x - 5$ ៖
$$A - B = (3x^2 - 2x + 1) - (x^2 + 4x - 5)$$
$$= 3x^2 - 2x + 1 - x^2 - 4x + 5$$
$$= 2x^2 - 6x + 6$$`, { size: 23 }),
        card(660, 160, 560, 360, 'វិធីគណនាតាមជួរឈរ', R`គេអាចរៀបតួដូចគ្នាតាមជួរឈរឱ្យត្រូវគ្នា រួចបូកដក ៖
$$egin{array}{rrrr}
  & 3x^2 & - 2x & + 1 \
- & (\phantom{3}x^2 & + 4x & - 5) \
\hline
  & 2x^2 & - 6x & + 6
\end{array}$$
• **លក្ខណៈសំខាន់ៗនៃវិធីបូក** ៖
  - លក្ខណៈត្រឡប់ ៖ $P + Q = Q + P$
  - លក្ខណៈផ្តុំ ៖ $(P + Q) + R = P + (Q + R)$
  - ធាតុណឺត ៖ $P + 0 = P$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ!! ៖ ពេលធ្វើវិធីដក ត្រូវប្រយ័ត្នសញ្ញា — ប្តូរសញ្ញាគ្រប់តួនៃពហុធាដកជានិច្ច!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('២.២ វិធីគុណពហុធា (Multiplication of Polynomials)'),
        card(60, 160, 560, 360, 'ក្បួនគុណពហុធា', R`• **ច្បាប់ស្វ័យគុណ** ៖  $x^m \cdot x^n = x^{m+n}$
• **ឯកធាគុណពហុធា** ៖ ប្រើលក្ខណៈបំបែក
  $$a(b + c) = ab + ac$$
  *ឧទាហរណ៍* ៖ $2x^2(3x - 5) = 6x^3 - 10x^2$
• **ពហុធាគុណពហុធា** ៖ យកគ្រប់តួនៃពហុធាទី ១ ទៅគុណនឹងគ្រប់តួនៃពហុធាទី ២ រួចបូកបង្រួមតួដូចគ្នា ៖
  $$(a + b)(c + d) = ac + ad + bc + bd$$
• **ដឺក្រេនៃផលគុណ** ៖
  $$\deg(P \cdot Q) = \deg(P) + \deg(Q)$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍គំរូនៃវិធីគុណ', R`គណនាផលគុណ $(2x - 3)(x^2 + 4x - 1)$ ៖
• **ពង្រាយតាមលក្ខណៈបំបែក** ៖
$$= 2x(x^2 + 4x - 1) - 3(x^2 + 4x - 1)$$
$$= (2x^3 + 8x^2 - 2x) - (3x^2 + 12x - 3)$$
$$= 2x^3 + 8x^2 - 2x - 3x^2 - 12x + 3$$
• **បង្រួមតួដូចគ្នា** ៖
$$= 2x^3 + (8 - 3)x^2 + (-2 - 12)x + 3$$
$$= 2x^3 + 5x^2 - 14x + 3$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ចងចាំ!! ៖ ដឺក្រេនៃផលគុណស្មើផលបូកដឺក្រេនៃពហុធាកត្តានីមួយៗ ៖ $\deg(P 	imes Q) = \deg P + \deg Q$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('៣.១ រូបមន្តពន្លាតសំខាន់ៗ ៖ ការ៉េ & ផលសងការ៉េ'),
        card(60, 160, 560, 360, 'រូបមន្តការ៉េនៃទ្វេធា', R`ចំពោះគ្រប់កន្សោមពីជគណិត $A$ និង $B$ ៖
• **ការ៉េនៃផលបូកទ្វេធា** ៖
$$(A + B)^2 = A^2 + 2AB + B^2$$
• **ការ៉េនៃផលសងទ្វេធា** ៖
$$(A - B)^2 = A^2 - 2AB + B^2$$
• **ឧទាហរណ៍** ៖
  - $(2x + 3)^2 = (2x)^2 + 2(2x)(3) + 3^2$
    $$= 4x^2 + 12x + 9$$
  - $(3x - 5y)^2 = 9x^2 - 30xy + 25y^2$`, { size: 23 }),
        card(660, 160, 560, 360, 'ផលសងការ៉េ & ការ៉េនៃត្រីធា', R`• **ផលសងការ៉េពីរតួ** ៖
$$A^2 - B^2 = (A - B)(A + B)$$
• **ឧទាហរណ៍** ៖
  - $(3x - 4)(3x + 4) = (3x)^2 - 4^2 = 9x^2 - 16$
  - $(x^2 - 9) = (x - 3)(x + 3)$
• **ការ៉េនៃត្រីធា (ផលបូក ៣ តួ)** ៖
$$(A + B + C)^2 = A^2 + B^2 + C^2 + 2(AB + BC + CA)$$
• **ឧទាហរណ៍** ៖
  $(x + y + 2)^2 = x^2 + y^2 + 4 + 2xy + 4y + 4x$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ប្រយ័ត្នច្រឡំ!! ៖  $(A + B)^2 
eq A^2 + B^2$  (ខ្វះតួកណ្តាល $2AB$) ជានិច្ច!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៣.២ រូបមន្តពន្លាតសំខាន់ៗ ៖ គូបនៃទ្វេធា & ផលបូក/សងគូប'),
        card(60, 160, 560, 360, 'គូបនៃទ្វេធា (Cubes of Binomials)', R`• **គូបនៃផលបូក** ៖
$$(A + B)^3 = A^3 + 3A^2B + 3AB^2 + B^3$$
$$= A^3 + B^3 + 3AB(A + B)$$
• **គូបនៃផលសង** ៖
$$(A - B)^3 = A^3 - 3A^2B + 3AB^2 - B^3$$
$$= A^3 - B^3 - 3AB(A - B)$$
• **ឧទាហរណ៍** ៖
$$(x + 2)^3 = x^3 + 3(x^2)(2) + 3(x)(2^2) + 2^3$$
$$= x^3 + 6x^2 + 12x + 8$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ផលបូក និងផលសងគូប', R`• **ផលបូកគូបពីរតួ** ៖
$$A^3 + B^3 = (A + B)(A^2 - AB + B^2)$$
• **ផលសងគូបពីរតួ** ៖
$$A^3 - B^3 = (A - B)(A^2 + AB + B^2)$$
• **ឧទាហរណ៍** ៖
  - $x^3 + 8 = x^3 + 2^3 = (x + 2)(x^2 - 2x + 4)$
  - $8x^3 - 27 = (2x)^3 - 3^3$
    $$= (2x - 3)(4x^2 + 6x + 9)$$
• *ចំណាំ* ៖ $A^2 \pm AB + B^2$ ហៅថាត្រីធាមិនពេញលេញ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនសញ្ញា!! ៖ ផលបូកគូប $(+)$ សញ្ញាវង់ក្រចកតូចគឺ $(+)$, តួកណ្តាល $(-)$ ៖ $(A+B)(A^2-AB+B^2)$ ។`, { size: 25, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('៣.៣ ត្រីកោណប៉ាស្កាល់ & ស្វ័យគុណទ្វេធា (Pascal\'s Triangle)'),
        card(60, 160, 560, 360, 'រចនាសម្ព័ន្ធត្រីកោណប៉ាស្កាល់', R`ជួរនីមួយៗផ្តល់មេគុណនៃពន្លាត $(a + b)^n$ ៖
$$egin{array}{rcccccc}
n=0: & & & 1 & & & \
n=1: & & 1 & & 1 & & \
n=2: & 1 & & 2 & & 1 & \
n=3: & 1 & 3 & & 3 & 1 \
n=4: & 1 \quad 4 & 6 & 4 \quad 1
\end{array}$$
• លេខនីមួយៗស្មើផលបូកនៃលេខពីរដែលនៅចំពីលើវា ។
• ផលបូកលេខក្នុងជួរទី $n$ ស្មើ $2^n$ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ការអនុវត្តពន្លាត (a + b)⁴', R`តាមជួរ $n = 4$ មេគុណគឺ $1, 4, 6, 4, 1$ ៖
$$(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4$$
• **ឧទាហរណ៍ ៖ ពន្លាត $(x - 2)^4$** ៖
$$= x^4 + 4x^3(-2) + 6x^2(-2)^2 + 4x(-2)^3 + (-2)^4$$
$$= x^4 - 8x^3 + 24x^2 - 32x + 16$$
• ស្វ័យគុណនៃ $x$ ថយចុះពី $4 	o 0$
• ស្វ័យគុណនៃ $(-2)$ កើនឡើងពី $0 	o 4$ ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!គន្លឹះ!! ៖ ត្រីកោណប៉ាស្កាល់ជួយសរសេរពន្លាតស្វ័យគុណខ្ពស់ $(a \pm b)^n$ បានយ៉ាងរហ័សដោយមិនបាច់គុណពង្រាយ!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('៤.១ ការដាក់ជាផលគុណកត្តា ៖ កត្តារួម & ការផ្ដុំតួ'),
        card(60, 160, 560, 360, 'វិធីទាញកត្តារួម (Common Factor)', R`• **ក្បួន** ៖ រកកត្តារួមធំបំផុតរវាងមេគុណ និងអថេរ រួចទាញចេញក្រៅវង់ក្រចក ៖
$$A \cdot B + A \cdot C = A(B + C)$$
• **ឧទាហរណ៍** ៖
- $6x^3 - 9x^2 = 3x^2(2x - 3)$
- $5x(x - 2) + 3(x - 2) = (x - 2)(5x + 3)$
- $2x(a - b) - y(b - a) = (a - b)(2x + y)$`, { size: 23 }),
        card(660, 160, 560, 360, 'វិធីផ្ដុំតួ (Factoring by Grouping)', R`• **ក្បួន** ៖ ប្រើពេលពហុធាមាន $4$ តួ ឬច្រើន ដោយបែងចែកជាក្រុមដែលមានកត្តារួម ៖
• **ឧទាហរណ៍ទី ១** ៖
$$P = ax + ay + bx + by = a(x + y) + b(x + y) = (x + y)(a + b)$$
• **ឧទាហរណ៍ទី ២** ៖
$$Q = x^3 - 3x^2 + 2x - 6 = x^2(x - 3) + 2(x - 3) = (x - 3)(x^2 + 2)$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!គន្លឹះគ្រឹះ!! ៖ មុននឹងប្រើវិធីផ្សេង ត្រូវពិនិត្យរកមើល **កត្តារួមចេញក្រៅមុនគេបង្អស់** ជានិច្ច!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 13 */ page([
        sec('៤.២ ការដាក់ជាផលគុណកត្តា ៖ ប្រើរូបមន្តពន្លាត'),
        card(60, 160, 560, 360, 'រូបមន្តការ៉េ & ផលសងការ៉េ', R`• **ផលសងការ៉េ** ៖
$$A^2 - B^2 = (A - B)(A + B)$$
  *ឧទាហរណ៍* ៖ $4x^2 - 25 = (2x)^2 - 5^2 = (2x - 5)(2x + 5)$
• **ការ៉េនៃទ្វេធា** ៖
$$A^2 + 2AB + B^2 = (A + B)^2$$
$$A^2 - 2AB + B^2 = (A - B)^2$$
  *ឧទាហរណ៍* ៖
  $x^2 - 6x + 9 = x^2 - 2(x)(3) + 3^2 = (x - 3)^2$`, { size: 23 }),
        card(660, 160, 560, 360, 'ផលបូក និងផលសងគូប', R`• **ផលបូកគូប** ៖
$$A^3 + B^3 = (A + B)(A^2 - AB + B^2)$$
  *ឧទាហរណ៍* ៖
  $x^3 + 27 = x^3 + 3^3 = (x + 3)(x^2 - 3x + 9)$
• **ផលសងគូប** ៖
$$A^3 - B^3 = (A - B)(A^2 + AB + B^2)$$
  *ឧទាហរណ៍* ៖
  $8x^3 - 1 = (2x)^3 - 1^3 = (2x - 1)(4x^2 + 2x + 1)$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំ!! ៖ $A^2 + B^2$ (ផលបូកការ៉េ) មិនអាចដាក់ជាផលគុណកត្តាក្នុងសំណុំចំនួនពិត $\mathbb{R}$ បានទេ!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('៤.៣ ដាក់ត្រីធាដឺក្រេទី ២ ជាផលគុណកត្តា ៖ x² + Sx + P'),
        card(60, 160, 560, 360, 'ទម្រង់ x² + bx + c (មេគុណ a = 1)', R`• **ក្បួនស្វែងរក** ៖ រកពីរចំនួន $u$ និង $v$ ដែល ៖
  $$egin{cases} u \cdot v = c & (	ext{ផលគុណស្មើ } c) \ u + v = b & (	ext{ផលបូកស្មើ } b) \end{cases}$$
• **ទម្រង់កត្តា** ៖
$$x^2 + bx + c = (x + u)(x + v)$$
• **ឧទាហរណ៍** ៖ ដាក់ $x^2 - 5x + 6$ ជាផលគុណកត្តា ៖
  - រកពីរចំនួនដែលគុណស្មើ $6$ ហើយបូកស្មើ $-5$ ៖
    គឺ $u = -2, \ v = -3$
  - $\implies x^2 - 5x + 6 = (x - 2)(x - 3)$`, { size: 23 }),
        card(660, 160, 560, 360, 'ទម្រង់ ax² + bx + c (មេគុណ a ≠ 1)', R`• **វិធីបំបែកតួកណ្តាល $bx$** ៖
  1. គណនាផលគុណ $a \cdot c$
  2. រកពីរចំនួន $u, v$ ដែល $u \cdot v = ac$ និង $u + v = b$
  3. សរសេរ $bx = ux + vx$ រួចប្រើវិធីផ្ដុំតួ ។
• **ឧទាហរណ៍ ៖ $2x^2 + 7x + 3$** ៖
  - $a \cdot c = 2 \cdot 3 = 6$
  - រកបាន $u = 1, \ v = 6$ ($1 \cdot 6 = 6, 1 + 6 = 7$)
  - បំបែក ៖ $2x^2 + 6x + x + 3$
    $$= 2x(x + 3) + 1(x + 3) = (x + 3)(2x + 1)$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!គន្លឹះ!! ៖ ពិនិត្យសញ្ញាតួថេរ $c$ ៖ បើ $c > 0$ នោះ $u, v$ មានសញ្ញាដូចគ្នា; បើ $c < 0$ នោះ $u, v$ មានសញ្ញាផ្ទុយគ្នា!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ ការដាក់កន្សោមស៊ាំញ៉ាំជាផលគុណកត្តា'),
        card(60, 160, 560, 360, 'កន្សោម A ៖ វិធីផ្ដុំតួ & ផលសងការ៉េ', R`• **ផ្ដុំពីរតួដំបូង និងពីរតួចុងក្រោយ** ៖
$$A = (x^3 - 4x^2) - (x - 4)$$
• **ទាញកត្តារួមនៃក្រុមនីមួយៗ** ៖
$$= x^2(x - 4) - 1(x - 4)$$
• **ទាញកត្តារួម $(x - 4)$** ៖
$$= (x - 4)(x^2 - 1)$$
• **បំបែកផលសងការ៉េ $x^2 - 1 = (x - 1)(x + 1)$** ៖
$$\mathbf{A = (x - 4)(x - 1)(x + 1)}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'កន្សោម B ៖ រូបមន្តផលសងការ៉េ X² − Y²', R`• **សរសេរជាទម្រង់ $X^2 - Y^2$ ដោយ $4x^2 = (2x)^2$** ៖
$$B = (x^2 + 1)^2 - (2x)^2$$
• **អនុវត្ត $X^2 - Y^2 = (X - Y)(X + Y)$** ៖
$$= [(x^2 + 1) - 2x][(x^2 + 1) + 2x]$$
$$= (x^2 - 2x + 1)(x^2 + 2x + 1)$$
• **ចូលរូបមន្តការ៉េនៃទ្វេធា** ៖
$$\mathbf{B = (x - 1)^2 (x + 1)^2}$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចម្លើយ!! ៖  $A = (x - 4)(x - 1)(x + 1)$  និង  $B = (x - 1)^2(x + 1)^2$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 16 */ page([
        sec('សង្ខេបជំពូកទី ១ មេរៀនទី ១ ៖ រូបមន្តគន្លឹះនៃពហុធា'),
        card(60, 160, 560, 360, 'រូបមន្តពន្លាត & កត្តា', R`• $(A \pm B)^2 = A^2 \pm 2AB + B^2$
• $A^2 - B^2 = (A - B)(A + B)$
• $(A \pm B)^3 = A^3 \pm 3A^2B + 3AB^2 \pm B^3$
• $A^3 \pm B^3 = (A \pm B)(A^2 \mp AB + B^2)$
• $(A + B + C)^2 = A^2 + B^2 + C^2 + 2(AB+BC+CA)$`, { size: 23 }),
        card(660, 160, 560, 360, 'លំដាប់លំដោយក្នុងការដាក់កត្តា', R`1. **កត្តារួម** ៖ ទាញកត្តារួមចេញក្រៅមុនគេ
2. **ចំនួនតួ** ៖
   - $2$ តួ ៖ ផលសងការ៉េ $A^2 - B^2$ ឬផលបូក/សងគូប
   - $3$ តួ ៖ ការ៉េនៃទ្វេធា ឬបំបែក $ax^2 + bx + c$
   - $4$ តួ ៖ ផ្ដុំជាពីរគូ ឬ $3$ ផ្ដុំនឹង $1$ ($A^2 - B^2$)
3. ពិនិត្យមើលថាតើកត្តានីមួយៗអាចបំបែកបន្តបានទៀតឬទេ ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!គោលការណ៍!! ៖ ការដាក់ជាផលគុណកត្តាសម្រេចបានពេញលេញ លុះត្រាតែកត្តានីមួយៗមិនអាចបំបែកបន្តទៀតបាន!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 17 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`តើកន្សោមមួយណាខាងក្រោមនេះជាពហុធាដឺក្រេទី ៣ មានមេគុណនាំមុខស្មើ $-2$?`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$P(x) = 3x^2 - 2x^3 + 5$`, { size: 25, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$Q(x) = -2x^2 + 3x - 1$`, { size: 25, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$R(x) = 2x^3 - 4x + 1$`, { size: 25, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$S(x) = -2x^4 + x^3 - 3$`, { size: 25, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $P(x) = -2x^3 + 3x^2 + 5$ មានតួដឺក្រេខ្ពស់ជាងគេគឺ $x^3$ និងមេគុណ $-2$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 18 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`ពន្លាតនៃកន្សោម $(2x - 3y)^2$ ស្មើនឹង ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$4x^2 - 9y^2$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$4x^2 - 6xy + 9y^2$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$4x^2 - 12xy + 9y^2$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$4x^2 + 12xy + 9y^2$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ C!! (តាមរូបមន្ត $(A-B)^2 = A^2 - 2AB + B^2 = (2x)^2 - 2(2x)(3y) + (3y)^2$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 19 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`ដាក់ត្រីធា $x^2 - 7x + 12$ ជាផលគុណកត្តា ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$(x - 2)(x - 6)$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$(x - 3)(x - 4)$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$(x + 3)(x + 4)$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$(x - 1)(x - 12)$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះ $(-3) 	imes (-4) = 12$ និង $(-3) + (-4) = -7$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 20 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ៥–១២)'),
        S.box(80, 160, 1120, 350, R`!!១.!! គណនា និងបង្រួមផលបូក ផលដក និងផលគុណនៃពហុធា ៖
    ក. $A(x) = (3x^3 - 2x^2 + 5x - 1) - (x^3 + 4x^2 - 2x + 6)$
    ខ. $B(x) = (2x - 3)(3x^2 - x + 4)$
!!២.!! គណនាពន្លាតដោយប្រើរូបមន្ត ៖
    ក. $(3x + 2y)^2$  និង  $(2x - 5)^3$
    ខ. $(x + 2y - z)^2$  និង  $(x^2 - 3)(x^2 + 3)$
!!៣.!! ដាក់កន្សោមខាងក្រោមជាផលគុណកត្តា ៖
    ក. $4x^2 - 25y^2$  និង  $8x^3 + 27$
    ខ. $x^2 - 8x + 15$  និង  $3x^2 + 5x - 2$
    គ. $x^3 - 3x^2 - 4x + 12$`, { size: 24, lh: '1.6' })
      ]),

      /* 21 */ S.homework(R`!!១.!! រៀបពហុធា $P(x) = 5x^2 - 3x^5 + 2x - 8 + x^5 - 4x^2$ ជាទម្រង់ស្តង់ដា រួចកំណត់ដឺក្រេ មេគុណនាំមុខ និងតួថេរ ។
!!២.!! ដាក់ជាផលគុណកត្តា ៖
    ក. $2x^3 - 16$
    ខ. $6x^2 - 7x - 3$
    គ. $(x^2 - 4)^2 - (x + 2)^2$
!!៣.!! បង្ហាញថាចំពោះគ្រប់ចំនួនគត់ $n$ កន្សោម $A = (n + 1)^2 - (n - 1)^2$ តែងតែចែកដាច់នឹង $4$ ។`),

      /* 22 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១០ · ជំពូក១ មេរៀនទី១ ពហុធា (២២ ស្លាយ)',
      grade: '10',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ពហុធា',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ ពហុធា',
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណនៃពហុធា & ឯកធា', slide: 3 },
        { title: '២. ប្រមាណវិធីលើពហុធា', slide: 6 },
        { title: '៣. រូបមន្តពន្លាតសំខាន់ៗ', slide: 8 },
        { title: '៤. ការដាក់ជាផលគុណកត្តា', slide: 11 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 16 }
      ],
      slides: slides
    };
  }

  function polyDivision(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, kids = K.kids, line = K.line, step = K.step,
        title = K.title, tip = K.tip, card = K.card;
    var sec = function (text, y) { return title(text, { x: 60, y: y || 100, size: 34, color: 'brand' }); };
    var s = function (x, y, w, text, o) { var e = step(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var l = function (x, y, w, text, o) { var e = line(x, y, w, text, { size: 25, h: 46 }); for (var k in o) e[k] = o[k]; return e; };
    var R = String.raw;

    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១០', '==ជំពូកទី១==        មេរៀនទី២', 'ប្រមាណវិធីចែកពហុធា', K.info),

      /* 2 */ K.toc([
        '==១. វិធីចែកវែងនៃពហុធា & ទំនាក់ទំនងចែក==',
        '២. វិធីចែកកាត់ហ័រន័រ (Horner)',
        '==៣. ទ្រឹស្តីបទសំណល់ & ទ្រឹស្តីបទកត្តា==',
        '៤. PGCD & PPCM នៃពហុធា',
        '==៥. ប្រមាណវិធីលើប្រភាគសនិទាន==',
        '៦. សំណួរ MCQ & កិច្ចការផ្ទះ'
      ]),

      /* 3 */ S.objective([
        R`ចេះអនុវត្តវិធីចែកវែង និងវិធីចែកកាត់ហ័រន័រដើម្បីរកផលចែក និងសំណល់នៃពហុធា`,
        R`ប្រើទ្រឹស្តីបទសំណល់ និងទ្រឹស្តីបទកត្តាក្នុងការកំណត់ឫស និងគណនាលើប្រភាគសនិទាន`
      ]),

      /* 4 */ page([
        sec('១.១ វិធីចែកវែងនៃពហុធា (Polynomial Long Division)'),
        card(60, 160, 560, 360, 'និយមន័យ & ទំនាក់ទំនងចែក', R`• **ទំនាក់ទំនងចែក** ៖ បើចែកពហុធា $A(x)$ នឹងពហុធា $B(x)$ ($B(x) 
eq 0$) គេបានពហុធាផលចែក $Q(x)$ និងសំណល់ $R(x)$ តែមួយគត់ដែល ៖
  $$\mathbf{A(x) = B(x) \cdot Q(x) + R(x)}$$
  $$rac{A(x)}{B(x)} = Q(x) + rac{R(x)}{B(x)}$$
• **លក្ខខណ្ឌនៃសំណល់** ៖
  - ឬ $R(x) = 0$ (វិធីចែកដាច់)
  - ឬ $\deg(R) < \deg(B)$ (ដឺក្រេសំណល់តូចជាងដឺក្រេតួចែកដាច់ខាត)
• **ឈ្មោះតួ** ៖ $A(x)$ តំណាងចែក, $B(x)$ តួចែក, $Q(x)$ ផលចែក, $R(x)$ សំណល់ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ជំហានក្នុងការធ្វើវិធីចែកវែង', R`1. **រៀបពហុធា** ទាំងពីរជាទម្រង់ស្តង់ដា (ស្វ័យគុណចុះ) ។ បើតួណាខ្វះ ត្រូវជំនួសដោយមេគុណ $0$ (ឧទាហរណ៍ ៖ $0x^2$) ។
2. **ចែកតួទី ១** នៃតំណាងចែក នឹងតួទី ១ នៃតួចែក ដើម្បីបានតួទី ១ នៃផលចែក ។
3. **គុណត្រឡប់** តួផលចែកនោះនឹងតួចែក រួចយកទៅដកពីតំណាងចែក ។
4. **ទម្លាក់តួបន្ទាប់** រួចធ្វើដូចដើមរហូតទាល់តែដឺក្រេនៃសំណល់តូចជាងដឺក្រេនៃតួចែក ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនទន្ទេញ!! ៖ **ចែក $	o$ គុណ $	o$ ដក $	o$ ទម្លាក់** — ធ្វើដដែលៗរហូតដល់ដឺក្រេសំណល់តូចជាងតួចែក!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 5 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ វិធីចែកវែងនៃពហុធា'),
        card(60, 160, 560, 360, 'ដំណាក់កាលគណនា ៖ ជំហានទី ១ & ២', R`• **បម្រាប់** ៖ $(2x^3 - 5x^2 + 4x - 6) \div (x - 2)$
• **ជំហានទី ១** ៖ ចែកតួដំបូង $\dfrac{2x^3}{x} = 2x^2$
  - គុណត្រឡប់ ៖ $2x^2(x - 2) = 2x^3 - 4x^2$
  - ដក ៖ $(2x^3 - 5x^2) - (2x^3 - 4x^2) = -x^2$
  - ទម្លាក់តួបន្ទាប់ $+4x \implies -x^2 + 4x$
• **ជំហានទី ២** ៖ ចែក $\dfrac{-x^2}{x} = -x$
  - គុណត្រឡប់ ៖ $-x(x - 2) = -x^2 + 2x$
  - ដក ៖ $(-x^2 + 4x) - (-x^2 + 2x) = 2x$`, { size: 22 }),
        card(660, 160, 560, 360, 'ដំណាក់កាលគណនា ៖ ជំហានទី ៣ & លទ្ធផល', R`• **ជំហានទី ៣** ៖ ទម្លាក់តួ $-6 \implies 2x - 6$
  - ចែក ៖ $\dfrac{2x}{x} = 2$ (តួចុងក្រោយនៃផលចែក)
  - គុណត្រឡប់ ៖ $2(x - 2) = 2x - 4$
  - ដក ៖ $(2x - 6) - (2x - 4) = \mathbf{-2}$
• **លទ្ធផលចែក** ៖
  - ផលចែក ៖ $Q(x) = 2x^2 - x + 2$
  - សំណល់ ៖ $R = -2$
• **សមភាពវិធីចែក** ៖
  $$2x^3 - 5x^2 + 4x - 6 = (x - 2)(2x^2 - x + 2) - 2$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!សន្និដ្ឋាន!! ៖  ផលចែក $Q(x) = 2x^2 - x + 2$  និង  សំណល់ $R = -2$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 6 */ page([
        sec('២.១ វិធីចែកកាត់ហ័រន័រ (Horner\'s Synthetic Division)'),
        card(60, 160, 560, 360, 'លក្ខខណ្ឌ & គោលការណ៍ហ័រន័រ', R`• **លក្ខខណ្ឌប្រើប្រាស់** ៖ ប្រើបាននៅពេល **តួចែកជាទ្វេធាដឺក្រេទី ១** មានរាង $x - c$ (ឬ $ax - b$) ។
• **លក្ខណៈពិសេស** ៖ គណនាតែលើមេគុណប៉ុណ្ណោះ មិនបាច់សរសេរអថេរ $x$ នាំឱ្យការគណនាលឿន និងងាយស្រួលបំផុត ។
• **ទម្រង់តារាង** ៖
  - ជួរទី ១ ៖ តម្លៃ $c$ និងមេគុណទាំងអស់នៃតំណាងចែក
  - ជួរទី ២ ៖ ផលគុណរវាង $c$ នឹងផលបូកខាងក្រោម
  - ជួរទី ៣ ៖ មេគុណនៃផលចែក និងលេខចុងក្រោយជាសំណល់ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ក្បួនគណនាតាមតារាងហ័រន័រ', R`• **ក្បួនប្រតិបត្តិ** ៖
  1. **ទម្លាក់** មេគុណទី ១ ចុះក្រោម
  2. យកលេខទម្លាក់នោះ **គុណនឹង $c$** រួចដាក់ក្រោមមេគុណបន្ទាប់
  3. **បូក** បញ្ចូលគ្នាតាមជួរឈរ
  4. ធ្វើដដែលៗរហូតដល់តួចុងក្រោយ ។
• **ករណីតួចែក $ax - b$** ៖
  - ប្រើ $c = rac{b}{a}$ ក្នុងតារាង
  - សំណល់ $R$ នៅដដែល
  - **ផលចែកពិតប្រាកដ** ត្រូវយកមេគុណផលចែកចែកនឹង $a$ ៖
    $$Q(x) = rac{Q_{	ext{តារាង}}(x)}{a}$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនទន្ទេញហ័រន័រ!! ៖ **«ទម្លាក់មេគុណទី ១ $	o$ គុណនឹង $c$ $	o$ បូកតាមជួរឈរ»** រហូតដល់ចប់!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 7 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ វិធីចែកកាត់ហ័រន័រ'),
        card(60, 160, 560, 360, 'តារាងហ័រន័រ (Horner\'s Scheme)', R`• តួចែក $x - 2 \implies c = 2$
• មេគុណនៃ $P(x)$ គឺ ៖ $3, \ -4, \ 2, \ -5$
• **រៀបតារាង និងប្រតិបត្តិការ** ៖
$$\begin{array}{c|rrrr}
  & 3 & -4 & 2 & -5 \\
c = 2 & \downarrow & 6 & 4 & 12 \\
\hline
  & 3 & 2 & 6 & \mathbf{7}
\end{array}$$
*(ទម្លាក់ $3 \to$ គុណ $2 \times 3 = 6 \to$ បូក $-4 + 6 = 2 \dots$)*`, { size: 23 }),
        card(660, 160, 560, 360, 'ទាញរកផលចែក & សំណល់', R`• **មេគុណផលចែក** ៖ គឺ $3, \ 2, \ 6$
  - ដឺក្រេនៃ $P(x)$ គឺ $3$ នាំឱ្យ $Q(x)$ មានដឺក្រេ $2$
  - ផលចែក ៖ $\mathbf{Q(x) = 3x^2 + 2x + 6}$
• **សំណល់** ៖ គឺលេខក្នុងជួរឈរចុងក្រោយ ៖
  - សំណល់ ៖ $\mathbf{R = 7}$
• **ផ្ទៀងផ្ទាត់សមភាព** ៖
  $$(x - 2)(3x^2 + 2x + 6) + 7 = 3x^3 - 4x^2 + 2x - 5$$`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចម្លើយ!! ៖  ផលចែកគឺ  $Q(x) = 3x^2 + 2x + 6$  និង  សំណល់  $R = 7$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 8 */ page([
        sec('៣.១ ទ្រឹស្តីបទសំណល់ (Remainder Theorem)'),
        card(60, 160, 560, 360, 'ខ្លឹមសារទ្រឹស្តីបទសំណល់', R`• **ទ្រឹស្តីបទ** ៖ សំណល់នៃការចែកពហុធា $P(x)$ នឹងទ្វេធា $x - c$ គឺស្មើនឹងតម្លៃនៃពហុធាត្រង់ $x = c$ ៖
  $$\mathbf{R = P(c)}$$
• **សម្រាយបញ្ជាក់** ៖
  តាមទំនាក់ទំនងចែក ៖
  $$P(x) = (x - c) Q(x) + R$$
  ជំនួស $x = c$ ចូល ៖
  $$P(c) = (c - c) Q(c) + R = 0 \cdot Q(c) + R$$
  $$\implies \mathbf{R = P(c)}$$
• **ករណីចែកនឹង $ax - b$** ៖
  $$R = P\left(rac{b}{a}
ight)$$`, { size: 23 }),
        card(660, 160, 560, 360, 'សារប្រយោជន៍នៃទ្រឹស្តីបទសំណល់', R`• **គុណសម្បត្តិ** ៖ អាចរកសំណល់ $R$ នៃការចែកបាន **ភ្លាមៗដោយមិនបាច់ធ្វើវិធីចែកវែង ឬហ័រន័រឡើយ**!
• **ឧទាហរណ៍** ៖ រកសំណល់នៃការចែក $P(x) = x^4 - 3x^2 + 5x - 2$ នឹង $x + 2$ ៖
  - តួចែក $x + 2 = x - (-2) \implies c = -2$
  - គណនា $R = P(-2)$ ៖
    $$R = (-2)^4 - 3(-2)^2 + 5(-2) - 2$$
    $$= 16 - 3(4) - 10 - 2 = 16 - 12 - 12 = -8$$
  - $\implies$ សំណល់គឺ $R = -8$ ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំ!! ៖ ដើម្បីរកសំណល់ពេលចែកនឹង $x - c$ គ្រាន់តែជំនួស $x = c$ ចូលក្នុង $P(x)$ រួចគណនាតម្លៃលេខ!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 9 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ កំណត់ប៉ារ៉ាម៉ែត្រ m តាមទ្រឹស្តីបទសំណល់'),
        card(60, 160, 560, 360, 'អនុវត្តទ្រឹស្តីបទសំណល់', R`• **ទ្រឹស្តីបទ** ៖ សំណល់នៃការចែក $P(x)$ នឹង $x - c$ គឺ $R = P(c)$
• នៅទីនេះតួចែកគឺ $x - 1 \implies c = 1$
• នាំឱ្យសំណល់គឺ ៖
$$R = P(1)$$
• **គណនាតម្លៃលេខ $P(1)$** ៖
$$P(1) = 2(1)^3 + m(1)^2 - 4(1) + 5$$
$$= 2 + m - 4 + 5$$
$$\mathbf{P(1) = m + 3}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ដោះស្រាយរកតម្លៃ m & ផ្ទៀងផ្ទាត់', R`• **តាមបម្រាប់** ៖ សំណល់ស្មើ $7$ នាំឱ្យ ៖
$$R = 7 \iff m + 3 = 7$$
$$\implies m = 7 - 3 = \mathbf{4}$$
• **ផ្ទៀងផ្ទាត់ឡើងវិញ** ៖
  - ជំនួស $m = 4$ ចូល $P(x)$ ៖
  $$P(x) = 2x^3 + 4x^2 - 4x + 5$$
  - គណនា $P(1) = 2(1) + 4(1) - 4(1) + 5 = 7$ (ពិត)`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!ចម្លើយ!! ៖  តម្លៃប៉ារ៉ាម៉ែត្រដែលត្រូវរកគឺ  $m = 4$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 10 */ page([
        sec('៣.២ ទ្រឹស្តីបទកត្តា (Factor Theorem) & ឫសនៃពហុធា'),
        card(60, 160, 560, 360, 'ខ្លឹមសារទ្រឹស្តីបទកត្តា', R`• **ទ្រឹស្តីបទ** ៖ ទ្វេធា $x - c$ ជាកត្តានៃពហុធា $P(x)$ លុះត្រាតែ $P(c) = 0$ (សំណល់ $R = 0$) ៖
  $$\mathbf{(x - c) 	ext{ ជាកត្តានៃ } P(x) \iff P(c) = 0}$$
• **ការបកស្រាយ** ៖
  - បើ $P(c) = 0$ នោះ $P(x) = (x - c) \cdot Q(x)$
  - គេថា $P(x)$ ចែកដាច់នឹង $x - c$
• **ករណីទូទៅ** ៖
  $$(ax - b) 	ext{ ជាកត្តានៃ } P(x) \iff P\left(rac{b}{a}
ight) = 0$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ទំនាក់ទំនងជាមួយឫសនៃសមីការ', R`• **និយមន័យឫស** ៖ ចំនួន $c$ ជាឫសនៃពហុធា $P(x)$ លុះត្រាតែ $P(c) = 0$ ។
• **លទ្ធផលផ្ទាល់** ៖
  $$c 	ext{ ជាឫសនៃ } P(x) = 0 \iff (x - c) 	ext{ ជាកត្តានៃ } P(x)$$
• **វិធីស្វែងរកឫសសនិទាន** ៖
  ឫសសនិទាន $c = rac{p}{q}$ (បើមាន) ត្រូវតែមាន ៖
  - $p$ ជាតួចែកនៃតួថេរ $a_0$
  - $q$ ជាតួចែកនៃមេគុណនាំមុខ $a_n$ ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!សារសំខាន់!! ៖ ទ្រឹស្តីបទកត្តាជាឧបករណ៍ដ៏មានឥទ្ធិពលបំផុតក្នុងការទាញរកឫស និងដាក់ពហុធាដឺក្រេខ្ពស់ជាផលគុណកត្តា!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 11 */ page([
        sec('ឧទាហរណ៍គំរូ ៖ ដាក់ពហុធាដឺក្រេទី ៣ ជាផលគុណកត្តា'),
        card(60, 160, 560, 360, 'ជំហានទី ១ & ២ ៖ រកឫសទី១ & ហ័រន័រ', R`• **ជំហានទី ១ (ទាយរកឫសទី ១ ពីតួចែកនៃ $6$)** ៖
  - តួចែកនៃ $6$ គឺ $\pm 1, \pm 2, \pm 3, \pm 6$
  - $P(-1) = (-1)^3 - 4(-1)^2 + (-1) + 6 = 0$
  $\implies x = -1$ ជាឫស នាំឱ្យ **$(x + 1)$ ជាកត្តា**
• **ជំហានទី ២ (ហ័រន័រចែក $P(x)$ នឹង $x + 1$)** ៖
$$\begin{array}{c|rrrr}
  & 1 & -4 & 1 & 6 \\
c = -1 & \downarrow & -1 & 5 & -6 \\
\hline
  & 1 & -5 & 6 & \mathbf{0}
\end{array}$$
$\implies$ ផលចែកគឺ $Q(x) = x^2 - 5x + 6$`, { size: 22 }),
        card(660, 160, 560, 360, 'ជំហានទី ៣ ៖ បំបែកផលចែកជាកត្តា', R`• **បំបែកត្រីធាដឺក្រេទី ២** ៖ $Q(x) = x^2 - 5x + 6$
  - រកពីរចំនួនដែល ៖
  $$\begin{cases} u \cdot v = 6 \\ u + v = -5 \end{cases} \implies u = -2, \ v = -3$$
  - នាំឱ្យ ៖ $Q(x) = (x - 2)(x - 3)$
• **សរសេរ $P(x)$ ជាផលគុណកត្តាពេញលេញ** ៖
$$\mathbf{P(x) = (x + 1)(x - 2)(x - 3)}$$
• **ឫសទាំង ៣ នៃពហុធា** ៖ $x = -1, \ 2, \ 3$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ចម្លើយ!! ៖  $P(x) = (x + 1)(x - 2)(x - 3)$  មានឫស  $x \in \{-1, 2, 3\}$ ។`, { size: 26, align: 'center', anim: true })
      ]),

      /* 12 */ page([
        sec('៤.១ តួចែករួមធំបំផុត (PGCD / GCD) នៃពហុធា'),
        card(60, 160, 560, 360, 'និយមន័យ PGCD', R`• **និយមន័យ** ៖ តួចែករួមធំបំផុត (PGCD) នៃពីរ ឬច្រើនពហុធា គឺជាពហុធាដែលមានដឺក្រេធំបំផុត ដែលចែកដាច់ពហុធាទាំងនោះ ។
• **វិធីសាស្ត្រស្វែងរក PGCD** ៖
  1. ដាក់ពហុធានីមួយៗជាផលគុណកត្តាបឋម
  2. ជ្រើសរើសយក **កត្តារួមទាំងអស់**
  3. យកស្វ័យគុណដែល **តូចជាងគេ** នៃកត្តារួមនីមួយៗ
  4. គុណកត្តាទាំងនោះបញ្ចូលគ្នា ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍គណនា PGCD', R`រក $	ext{PGCD}(A, B)$ ដោយដឹងថា ៖
$$A(x) = (x - 2)^3 (x + 1)^2 (x - 3)$$
$$B(x) = (x - 2)^2 (x + 1)^4 (x + 5)$$
• **កត្តារួម** ៖ $(x - 2)$ និង $(x + 1)$
• **ស្វ័យគុណតូចជាងគេ** ៖
  - ចំពោះ $(x - 2)$ គឺស្វ័យគុណ $2$
  - ចំពោះ $(x + 1)$ គឺស្វ័យគុណ $2$
• $\implies \mathbf{	ext{PGCD}(A, B) = (x - 2)^2 (x + 1)^2}$ ។
• *ចំណាំ* ៖ PGCD ប្រើសម្រាប់សម្រួលប្រភាគសនិទាន ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ PGCD!! ៖ យកតែ **«កត្តារួម»** ជាមួយ **«ស្វ័យគុណតូចជាងគេ»** ប៉ុណ្ណោះ!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 13 */ page([
        sec('៤.២ ពហុគុណរួមតូចបំផុត (PPCM / LCM) នៃពហុធា'),
        card(60, 160, 560, 360, 'និយមន័យ PPCM & ទំនាក់ទំនង', R`• **និយមន័យ** ៖ ពហុគុណរួមតូចបំផុត (PPCM) នៃពហុធា គឺជាពហុធាដែលមានដឺក្រេតូចបំផុត ដែលចែកដាច់នឹងពហុធាទាំងនោះ ។
• **វិធីសាស្ត្រស្វែងរក PPCM** ៖
  1. ដាក់ពហុធានីមួយៗជាផលគុណកត្តា
  2. យក **គ្រប់កត្តាទាំងអស់ (រួមផង មិនរួមផង)**
  3. យកស្វ័យគុណដែល **ធំជាងគេ** នៃកត្តានីមួយៗ ។
• **ទំនាក់ទំនងសំខាន់រវាង PGCD និង PPCM** ៖
  $$\mathbf{	ext{PGCD}(A, B) 	imes 	ext{PPCM}(A, B) = A(x) 	imes B(x)}$$`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍គណនា PPCM', R`រក $	ext{PPCM}(A, B)$ នៃឧទាហរណ៍មុន ៖
$$A(x) = (x - 2)^3 (x + 1)^2 (x - 3)$$
$$B(x) = (x - 2)^2 (x + 1)^4 (x + 5)$$
• **គ្រប់កត្តាទាំងអស់** ៖
  $(x - 2), \ (x + 1), \ (x - 3), \ (x + 5)$
• **ស្វ័យគុណធំជាងគេ** ៖
  $\implies \mathbf{	ext{PPCM} = (x-2)^3 (x+1)^4 (x-3)(x+5)}$
• *ចំណាំ* ៖ PPCM ប្រើជា **ភាគបែងរួម** ក្នុងការបូក-ដកប្រភាគសនិទាន ។`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ក្បួនចងចាំ PPCM!! ៖ យក **«គ្រប់កត្តាទាំងអស់»** ជាមួយ **«ស្វ័យគុណធំជាងគេ»** ជានិច្ច!`, { size: 26, align: 'center', anim: true })
      ]),

      /* 14 */ page([
        sec('៥.១ ប្រមាណវិធីលើប្រភាគសនិទាន ៖ សម្រួល គុណ និងចែក'),
        card(60, 160, 560, 360, 'សម្រួលប្រភាគសនិទាន', R`• **និយមន័យ** ៖ ប្រភាគសនិទានមានរាង $\dfrac{P(x)}{Q(x)}$ ($Q(x) 
eq 0$) ។
• **ក្បួនសម្រួល** ៖
  1. ដាក់ភាគយក និងភាគបែងជាផលគុណកត្តា
  2. សម្រួលកត្តារួម (PGCD) ចោល ។
• **ឧទាហរណ៍** ៖
$$rac{x^2 - 4}{x^2 - 4x + 4} = rac{(x - 2)(x + 2)}{(x - 2)^2} = rac{x + 2}{x - 2}$$
*(លក្ខខណ្ឌ ៖ $x 
eq 2$)*`, { size: 23 }),
        card(660, 160, 560, 360, 'គុណ និងចែកប្រភាគសនិទាន', R`• **វិធីគុណ** ៖ គុណភាគយកនឹងភាគយក ភាគបែងនឹងភាគបែង ៖
  $$rac{A}{B} \cdot rac{C}{D} = rac{A \cdot C}{B \cdot D}$$
• **វិធីចែក** ៖ គុណនឹងប្រភាគត្រឡប់ ៖
  $$rac{A}{B} \div rac{C}{D} = rac{A}{B} \cdot rac{D}{C} = rac{A \cdot D}{B \cdot C}$$
• **ឧទាហរណ៍** ៖
  $$rac{x-1}{x+2} \cdot rac{x^2-4}{x^2-1} = rac{(x-1)(x-2)(x+2)}{(x+2)(x-1)(x+1)} = rac{x-2}{x+1}$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!លក្ខខណ្ឌកំណត់!! ៖ ត្រូវកំណត់ដែនកំណត់ (ភាគបែងខុសពីសូន្យ) មុនពេលសម្រួលកត្តាចោល!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 15 */ page([
        sec('៥.២ វិធីបូក និងវិធីដកប្រភាគសនិទាន'),
        card(60, 160, 560, 360, 'ក្បួនបូក និងដកប្រភាគសនិទាន', R`• **ករណីភាគបែងដូចគ្នា** ៖
  $$rac{A}{M} \pm rac{B}{M} = rac{A \pm B}{M}$$
• **ករណីភាគបែងខុសគ្នា** ៖
  1. ដាក់ភាគបែងទាំងអស់ជាផលគុណកត្តា
  2. រកភាគបែងរួម $\mathbf{	ext{LCD} = 	ext{PPCM}}$
  3. គុណភាគយកនីមួយៗនឹងកត្តាបន្ថែម
  4. បូក/ដកភាគយក រួចសម្រួលលទ្ធផលចុងក្រោយ ។`, { size: 23 }),
        card(660, 160, 560, 360, 'ឧទាហរណ៍គំរូនៃការបូកដក', R`គណនា $E = \dfrac{2}{x - 1} - \dfrac{4}{x^2 - 1}$ ៖
• ដាក់ភាគបែងជាកត្តា ៖
  $x^2 - 1 = (x - 1)(x + 1)$
• ភាគបែងរួម ៖ $	ext{LCD} = (x - 1)(x + 1)$
• តម្រូវភាគបែង ៖
$$E = rac{2(x + 1) - 4}{(x - 1)(x + 1)} = rac{2x + 2 - 4}{(x - 1)(x + 1)}$$
$$= rac{2x - 2}{(x - 1)(x + 1)} = rac{2(x - 1)}{(x - 1)(x + 1)} = rac{2}{x + 1}$$`, { size: 22 }),
        S.box(60, 545, 1160, 80, R`!!ចំណាំ!! ៖ ក្រោយពីបូកដកភាគយករួច ត្រូវតែដាក់ភាគយកជាកត្តាដើម្បីពិនិត្យសម្រួលនឹងភាគបែង!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 16 */ page([
        sec('សង្ខេបជំពូកទី ១ មេរៀនទី ២ ៖ រូបមន្តគន្លឹះនៃការចែកពហុធា'),
        card(60, 160, 560, 360, 'ទ្រឹស្តីបទសំខាន់ៗនៃការចែក', R`• **ទំនាក់ទំនងចែក** ៖
  $A(x) = B(x) Q(x) + R(x)$
  *(ដែល $\deg R < \deg B$ ឬ $R = 0$)*
• **ទ្រឹស្តីបទសំណល់** ៖
  ចែក $P(x)$ នឹង $x - c \implies R = P(c)$
• **ទ្រឹស្តីបទកត្តា** ៖
  $(x - c)$ ជាកត្តានៃ $P(x) \iff P(c) = 0$
  $\iff c$ ជាឫសនៃសមីការ $P(x) = 0$`, { size: 23 }),
        card(660, 160, 560, 360, 'PGCD, PPCM & ប្រភាគសនិទាន', R`• **PGCD** ៖ ផលគុណកត្តារួម ស្វ័យគុណតូចជាងគេ (សម្រួលប្រភាគ)
• **PPCM** ៖ ផលគុណគ្រប់កត្តា ស្វ័យគុណធំជាងគេ (ភាគបែងរួម LCD)
• **ទំនាក់ទំនង** ៖
  $	ext{PGCD} 	imes 	ext{PPCM} = A(x) \cdot B(x)$
• **ប្រភាគសនិទាន** ៖ សម្រួលបានលុះត្រាតែបំបែកជាកត្តារួមទាំងភាគយក និងភាគបែង ។`, { size: 23 }),
        S.box(60, 545, 1160, 80, R`!!គោលការណ៍មាស!! ៖ ដើម្បីដោះស្រាយលំហាត់ពហុធាស្មុគស្មាញ ត្រូវចងចាំវិធីហ័រន័រ និងទ្រឹស្តីបទកត្តាជានិច្ច!`, { size: 25, align: 'center', anim: true })
      ]),

      /* 17 MCQ 1 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ១)'),
        l(60, 155, 1180, R`សំណល់នៃការចែកពហុធា $P(x) = 2x^3 - 3x^2 + 4x - 5$ នឹង $x - 2$ ស្មើនឹង ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$R = 5$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$R = 7$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$R = -5$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$R = 9$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (តាមទ្រឹស្តីបទសំណល់ $R = P(2) = 2(8) - 3(4) + 4(2) - 5 = 16 - 12 + 8 - 5 = 7$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 18 MCQ 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`បើទ្វេធា $(x - 3)$ ជាកត្តានៃពហុធា $P(x) = x^3 - 2x^2 + mx - 6$ នោះតម្លៃ $m$ ស្មើ ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$m = -1$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$m = 1$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$m = -3$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$m = 3$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (តាមទ្រឹស្តីបទកត្តា $P(3) = 0 \iff 27 - 18 + 3m - 6 = 0 \implies 3m + 3 = 0 \implies m = -1$)`, { size: 23, align: 'center', anim: true })
      ]),

      /* 19 MCQ 3 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ៣)'),
        l(60, 155, 1180, R`សម្រួលប្រភាគសនិទាន  $\dfrac{x^2 - 9}{2x + 6}$  បានលទ្ធផល ៖`, { size: 28 }),
        card(100, 230, 480, 100, 'A', R`$\dfrac{x - 3}{2}$`, { size: 26, align: 'center' }),
        card(640, 230, 480, 100, 'B', R`$\dfrac{x + 3}{2}$`, { size: 26, align: 'center' }),
        card(100, 350, 480, 100, 'C', R`$x - 3$`, { size: 26, align: 'center' }),
        card(640, 350, 480, 100, 'D', R`$\dfrac{x - 9}{6}$`, { size: 26, align: 'center' }),
        S.box(100, 495, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ A!! (ព្រោះ $\dfrac{x^2 - 9}{2x + 6} = \dfrac{(x-3)(x+3)}{2(x+3)} = \dfrac{x-3}{2}$)`, { size: 24, align: 'center', anim: true })
      ]),

      /* 20 */ page([
        sec('លំហាត់អនុវត្តន៍ពីសៀវភៅពុម្ព (ទំព័រ ១៣–២០)'),
        S.box(80, 160, 1120, 350, R`!!១.!! ធ្វើវិធីចែកវែង និងវិធីចែកកាត់ហ័រន័រ រួចកំណត់ផលចែក និងសំណល់ ៖
    ក. $(3x^3 - 5x^2 + 7x - 4) \div (x - 2)$
    ខ. $(2x^4 - 3x^2 + 1) \div (x + 1)$
!!២.!! ប្រើទ្រឹស្តីបទសំណល់ និងទ្រឹស្តីបទកត្តា ៖
    ក. រកសំណល់នៃការចែក $P(x) = 4x^3 - 6x^2 + 2x - 7$ នឹង $2x - 1$
    ខ. រកតម្លៃ $k$ ដើម្បីឱ្យ $(x - 2)$ ជាកត្តានៃ $P(x) = x^3 - kx^2 + 3x - 2$
!!៣.!! គណនាប្រមាណវិធីលើប្រភាគសនិទាន ៖
    ក. $\dfrac{x^2 - 16}{x^2 + x - 12} \cdot \dfrac{x + 4}{x^2 - 4x}$
    ខ. $\dfrac{3}{x - 2} - \dfrac{2}{x + 2} - \dfrac{x}{x^2 - 4}$`, { size: 24, lh: '1.6' })
      ]),

      /* 21 */ S.homework(R`!!១.!! ប្រើវិធីហ័រន័រដោះស្រាយសមីការដឺក្រេទី ៣ ៖  $x^3 - 6x^2 + 11x - 6 = 0$ ។
!!២.!! គេឱ្យពហុធា $P(x) = x^4 + ax^3 - 7x^2 + bx + 6$ ។ កំណត់ $a$ និង $b$ ដោយដឹងថា $P(x)$ ចែកដាច់នឹង $(x - 1)$ និង $(x + 2)$ ។
!!៣.!! គណនា និងសម្រួលកន្សោមប្រភាគ ៖  $A = \dfrac{1}{x(x+1)} + \dfrac{1}{(x+1)(x+2)} + \dfrac{1}{(x+2)(x+3)}$ ។`),

      /* 22 */ S.thanks()
    ];

    return {
      name: 'ថ្នាក់ទី១០ · ជំពូក១ មេរៀនទី២ ប្រមាណវិធីចែកពហុធា (២២ ស្លាយ)',
      grade: '10',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ពហុធា',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ ប្រមាណវិធីចែកពហុធា',
      theme: 'school',
      school: K.info.school,
      school2: K.info.school2,
      school3: K.info.school3,
      teacher: K.info.teacher,
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. វិធីចែកវែងនៃពហុធា', slide: 3 },
        { title: '២. វិធីចែកកាត់ហ័រន័រ', slide: 5 },
        { title: '៣. ទ្រឹស្តីបទសំណល់ & កត្តា', slide: 7 },
        { title: '៤. PGCD & PPCM នៃពហុធា', slide: 11 },
        { title: '៥. ប្រមាណវិធីលើប្រភាគសនិទាន', slide: 13 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 16 }
      ],
      slides: slides
    };
  }

  window.KPSlideTemplates = [
    {
      id: 'g10-polynomials',
      ver: 3,
      grade: '10',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ពហុធា',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ ពហុធា',
      name: 'ថ្នាក់ទី១០ · ជំពូក១ មេរៀនទី១ ពហុធា (២២ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណនៃពហុធា & ឯកធា', slide: 3 },
        { title: '២. ប្រមាណវិធីលើពហុធា', slide: 6 },
        { title: '៣. រូបមន្តពន្លាតសំខាន់ៗ', slide: 8 },
        { title: '៤. ការដាក់ជាផលគុណកត្តា', slide: 11 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 16 }
      ],
      build: polynomials
    },
    {
      id: 'g10-poly-division',
      ver: 2,
      grade: '10',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ពហុធា',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ ប្រមាណវិធីចែកពហុធា',
      name: 'ថ្នាក់ទី១០ · ជំពូក១ មេរៀនទី២ ប្រមាណវិធីចែកពហុធា (២២ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. វិធីចែកវែងនៃពហុធា', slide: 3 },
        { title: '២. វិធីចែកកាត់ហ័រន័រ', slide: 5 },
        { title: '៣. ទ្រឹស្តីបទសំណល់ & កត្តា', slide: 7 },
        { title: '៤. PGCD & PPCM នៃពហុធា', slide: 11 },
        { title: '៥. ប្រមាណវិធីលើប្រភាគសនិទាន', slide: 13 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 16 }
      ],
      build: polyDivision
    },
    {
      id: 'g11-sequences',
      ver: 12,
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ ស៊ីតចំនួនពិត',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី១ ស៊ីតចំនួនពិត (៤៣ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 2 },
        { title: '១. និយមន័យស៊ីតចំនួនពិត', slide: 5 },
        { title: '២. ការកំណត់ន័យនៃស៊ីត', slide: 12 },
        { title: '៣. អថេរភាព (ស៊ីតកើន-ចុះ)', slide: 22 },
        { title: '៤. ភាពម៉ូណូតូននៃស៊ីត', slide: 32 },
        { title: 'កិច្ចការផ្ទះ & សង្ខេប', slide: 41 }
      ],
      build: sequences
    },
    {
      id: 'g11-arith',
      ver: 10,
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ ស៊ីតនព្វន្ត',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី២ ស៊ីតនព្វន្ត (៣៩ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 2 },
        { title: '១. និយមន័យនៃស៊ីតនព្វន្ត', slide: 3 },
        { title: '២. តួទី n នៃស៊ីតនព្វន្ត', slide: 5 },
        { title: '៣.១ ផលបូកតួស្មើចម្ងាយពីតួចុង', slide: 21 },
        { title: '៣.២ មធ្យមនព្វន្ត', slide: 24 },
        { title: '៣.៣ រូបមន្តផលបូក n តួដំបូង', slide: 27 },
        { title: '៤. សំណួរពង្រឹងពុទ្ធិ & កិច្ចការផ្ទះ', slide: 36 }
      ],
      build: arithmetic
    },
    {
      id: 'g11-geom',
      ver: 10,
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 3,
      lesson: 'មេរៀនទី ៣ ៖ ស៊ីតធរណីមាត្រ',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី៣ ស៊ីតធរណីមាត្រ (៤០ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 2 },
        { title: '១. និយមន័យស៊ីតធរណីមាត្រ', slide: 5 },
        { title: '២. តួទី n នៃស៊ីតធរណីមាត្រ', slide: 6 },
        { title: '៣. មធ្យមធរណីមាត្រ', slide: 11 },
        { title: '៤. ផលបូក n តួដំបូង', slide: 25 },
        { title: '៥. ផលបូកស៊ីតធរណីមាត្រអនន្ត', slide: 31 },
        { title: 'កិច្ចការផ្ទះ & សង្ខេប', slide: 37 }
      ],
      build: geometric
    },
    {
      id: 'g11-sums',
      ver: 10,
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 4,
      lesson: 'មេរៀនទី ៤ ៖ ផលបូកតួនៃស៊ីតផ្សេងៗ',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី៤ ផលបូកតួនៃស៊ីតផ្សេងៗ (៤៧ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 2 },
        { title: '១. ផលបូកតួតាមវិធីបំបែកតួ (Telescoping)', slide: 4 },
        { title: '២. និមិត្តសញ្ញាផលបូក Sigma', slide: 11 },
        { title: '៣. ផលសងតួលំដាប់ទី ១', slide: 26 },
        { title: '៤. ផលសងតួលំដាប់ទី ២', slide: 33 },
        { title: '៥. សង្ខេប & កិច្ចការផ្ទះ', slide: 41 }
      ],
      build: sums
    },
    {
      id: 'g11-recur',
      ver: 6,
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 5,
      lesson: 'មេរៀនទី ៥ ៖ ទំនាក់ទំនងតួនៃស៊ីត',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី៥ ទំនាក់ទំនងតួនៃស៊ីត (៣២ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 2 },
        { title: '១. ទំនាក់ទំនងលំដាប់ ១', slide: 4 },
        { title: '២. ទំនាក់ទំនងរវាង an និង Sn', slide: 10 },
        { title: '៣. ទំនាក់ទំនងលំដាប់ ២ (សមីការសម្គាល់)', slide: 20 },
        { title: '៤. លំហាត់សៀវភៅពុម្ព & កិច្ចការផ្ទះ', slide: 25 }
      ],
      build: recurrence
    },
    {
      id: 'g11-induction',
      ver: 7,
      grade: '11',
      chapterNum: 1,
      chapter: 'ជំពូកទី ១ ៖ ស៊ីត និងអនុមានរួមគណិតវិទ្យា',
      lessonNum: 6,
      lesson: 'មេរៀនទី ៦ ៖ វិចារអនុមានរួមគណិតវិទ្យា',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី៦ វិចារអនុមានរួមគណិតវិទ្យា (៣២ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. គោលការណ៍នៃវិចារអនុមានរួម', slide: 3 },
        { title: '២. ស្រាយបញ្ជាក់សមភាពផលបូក', slide: 7 },
        { title: '៣. ស្រាយបញ្ជាក់វិសមភាព', slide: 13 },
        { title: '៤. ស្រាយបញ្ជាក់ភាពចែកដាច់', slide: 16 },
        { title: '៥. ត្រីកោណប៉ាស្កាល់ & ទ្វេធាញូតុន', slide: 19 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 27 }
      ],
      build: induction
    },
    {
      id: 'g11-exponential',
      ver: 9,
      grade: '11',
      chapterNum: 2,
      chapter: 'ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងលោការីត',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល',
      name: 'ថ្នាក់ទី១១ · ជំពូក២ មេរៀនទី១ អនុគមន៍អិចស្ប៉ូណង់ស្យែល (២៦ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. និយមន័យអនុគមន៍អិចស្ប៉ូណង់ស្យែល', slide: 3 },
        { title: '២. ក្រាប និងលក្ខណៈនៃអនុគមន៍', slide: 5 },
        { title: '៣. សមីការអិចស្ប៉ូណង់ស្យែល', slide: 10 },
        { title: '៤. វិសមីការអិចស្ប៉ូណង់ស្យែល', slide: 14 },
        { title: '៥. ការអនុវត្តជាក់ស្តែង (ការប្រាក់ & កំណើន)', slide: 17 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 19 }
      ],
      build: exponential
    },
    {
      id: 'g11-logarithm',
      ver: 8,
      grade: '11',
      chapterNum: 2,
      chapter: 'ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងលោការីត',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ អនុគមន៍លោការីត',
      name: 'ថ្នាក់ទី១១ · ជំពូក២ មេរៀនទី២ អនុគមន៍លោការីត (២៧ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. និយមន័យ & ក្រាបនៃអនុគមន៍លោការីត', slide: 3 },
        { title: '២. លក្ខណៈនៃលោការីត & រូបមន្តប្តូរគោល', slide: 8 },
        { title: '៣. សមីការលោការីត', slide: 12 },
        { title: '៤. វិសមីការលោការីត', slide: 15 },
        { title: '៥. លោការីតគោល ១០ & លោការីតនេពែ', slide: 17 },
        { title: '៦. ការអនុវត្តជាក់ស្តែង & សង្ខេប', slide: 18 },
        { title: 'សំណួរ MCQ & កិច្ចការផ្ទះ', slide: 20 }
      ],
      build: logarithm
    },
    {
      id: 'g11-trig-functions',
      ver: 2,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី១ អនុគមន៍ត្រីកោណមាត្រ (២៥ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. រង្វាស់មុំ & រង្វង់ត្រីកោណមាត្រ', slide: 3 },
        { title: '២. អនុគមន៍ត្រីកោណមាត្រ & តារាងមុំពិសេស', slide: 6 },
        { title: '៣. ទំនាក់ទំនងគ្រឹះ & មុំផ្តុំ', slide: 9 },
        { title: '៤. អថេរភាព និងក្រាបរលក sin, cos, tan', slide: 13 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 18 }
      ],
      build: trigFunctions
    },
    {
      id: 'g11-trig-formulas',
      ver: 2,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ រូបមន្តត្រីកោណមាត្រ',
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី២ រូបមន្តត្រីកោណមាត្រ (២១ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. រូបមន្តផលបូក និងផលដក', slide: 3 },
        { title: '២. រូបមន្តមុំឌុប & មុំ ៣ គុណ', slide: 6 },
        { title: '៣. រូបមន្តកន្លះមុំ & អថេរ t', slide: 9 },
        { title: '៤. បម្លែងផលគុណ ↔ ផលបូក', slide: 11 },
        { title: '៥. អនុវត្តក្នុងត្រីកោណ ABC', slide: 13 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 14 }
      ],
      build: trigFormulas
    },
    {
      id: 'g11-trig-inverse',
      ver: 1,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 3,
      lesson: 'មេរៀនទី ៣ ៖ អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ',
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី៣ អនុគមន៍ច្រាសនៃអនុគមន៍ត្រីកោណមាត្រ (១៧ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណនៃអនុគមន៍ច្រាស', slide: 3 },
        { title: '២. អនុគមន៍ arcsin x, arccos x, arctan x', slide: 4 },
        { title: '៣. លក្ខណៈ & ក្រាបនៃអនុគមន៍ច្រាស', slide: 7 },
        { title: '៤. ឧទាហរណ៍គំរូ & អនុវត្តជាក់ស្តែង', slide: 10 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 13 }
      ],
      build: trigInverse
    },
    {
      id: 'g11-trig-basic-eq',
      ver: 1,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 4,
      lesson: 'មេរៀនទី ៤ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រ',
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី៤ សមីការនិងវិសមីការត្រីកោណមាត្រ (១៧ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សមីការត្រីកោណមាត្រគ្រឹះ sin x = a, cos x = a', slide: 3 },
        { title: '២. សមីការ tan x = a, cot x = a', slide: 6 },
        { title: '៣. សមីការពិសេស & វិសមីការត្រីកោណមាត្រគ្រឹះ', slide: 9 },
        { title: '៤. លំហាត់គំរូ & ការអនុវត្ត', slide: 12 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 14 }
      ],
      build: trigBasicEq
    },
    {
      id: 'g11-trig-advanced-eq',
      ver: 1,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 5,
      lesson: 'មេរៀនទី ៥ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត',
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ មេរៀនទី៥ សមីការនិងវិសមីការត្រីកោណមាត្រផ្សេងទៀត (១៦ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សមីការលីនេអ៊ែរ a sin x + b cos x = c', slide: 3 },
        { title: '២. សមីការដឺក្រេទី ២ ធៀបនឹងអនុគមន៍ត្រីកោណមាត្រ', slide: 6 },
        { title: '៣. សមីការអូម៉ូសែនដឺក្រេទី ២', slide: 8 },
        { title: '៤. ប្រព័ន្ធសមីការ និងវិសមីការកម្រិតខ្ពស់', slide: 10 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 13 }
      ],
      build: trigAdvancedEq
    },
    {
      id: 'g11-trig',
      ver: 6,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 4,
      lesson: 'មេរៀនទី ៤ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រ (ចាស់)',
      name: 'ថ្នាក់ទី១១ · ជំពូក៣ សមីការនិងវិសមីការត្រីកោណមាត្រ',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សមីការត្រីកោណមាត្រគ្រឹះ', slide: 3 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 14 }
      ],
      build: trigBasicEq
    },
    {
      id: 'g11-matrices',
      ver: 25,
      grade: '11',
      chapterNum: 4,
      chapter: 'ជំពូកទី ៤ ៖ ម៉ាទ្រីស និងដេទែរមីណង់',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ ម៉ាទ្រីស',
      name: 'ថ្នាក់ទី១១ · ជំពូក៤ មេរៀនទី១ ម៉ាទ្រីស (២៤ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណ & ប្រភេទនៃម៉ាទ្រីស', slide: 3 },
        { title: '២. ម៉ាទ្រីសស្មើគ្នា', slide: 7 },
        { title: '៣. ប្រមាណវិធីលើម៉ាទ្រីស (បូក ដក គុណ)', slide: 9 },
        { title: '៤. ម៉ាទ្រីសច្រាស & សមីការម៉ាទ្រីស', slide: 15 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 19 }
      ],
      build: matrices
    },
    {
      id: 'g11-determinants',
      ver: 25,
      grade: '11',
      chapterNum: 4,
      chapter: 'ជំពូកទី ៤ ៖ ម៉ាទ្រីស និងដេទែរមីណង់',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ ដេទែរមីណង់',
      name: 'ថ្នាក់ទី១១ · ជំពូក៤ មេរៀនទី២ ដេទែរមីណង់ (១៩ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. ដេទែរមីណង់លំដាប់ ២', slide: 3 },
        { title: '២. ដេទែរមីណង់លំដាប់ ៣ (សារុស & មីន័រ)', slide: 5 },
        { title: '៣. លក្ខណៈសំខាន់ៗនៃដេទែរមីណង់', slide: 9 },
        { title: '៤. រូបមន្តក្រាម័រ (ប្រព័ន្ធសមីការ)', slide: 10 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 14 }
      ],
      build: determinants
    },
    {
      id: 'g11-linear-trans',
      ver: 25,
      grade: '11',
      chapterNum: 4,
      chapter: 'ជំពូកទី ៤ ៖ ម៉ាទ្រីស និងដេទែរមីណង់',
      lessonNum: 3,
      lesson: 'មេរៀនទី ៣ ៖ ការបំប្លែងលីនេអ៊ែរ',
      name: 'ថ្នាក់ទី១១ · ជំពូក៤ មេរៀនទី៣ ការបំប្លែងលីនេអ៊ែរ (១៨ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'មាតិកា & វត្ថុបំណង', slide: 1 },
        { title: '១. សញ្ញាណ & ចំណុចឥតប្រែប្រួល', slide: 3 },
        { title: '២. ការបំប្លែងឆ្លុះ (Reflections)', slide: 7 },
        { title: '៣. ការបំប្លែងចាំងកែង (Projections)', slide: 11 },
        { title: '៤. ការបំប្លែងវិល (Rotations)', slide: 12 },
        { title: '៥. ការបំប្លែងបណ្ដាក់ & ត្រីកោណមាត្រ', slide: 15 },
        { title: 'សង្ខេប MCQ & កិច្ចការផ្ទះ', slide: 18 }
      ],
      build: linearTrans
    },
    {
      id: 'g11-limits',
      ver: 2,
      grade: '11',
      chapterNum: 5,
      chapter: 'ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ',
      lessonNum: 1,
      lesson: 'មេរៀនទី ១ ៖ លីមីតនៃអនុគមន៍',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី១ លីមីតនៃអនុគមន៍ (១០ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 1 },
        { title: '១. លីមីតត្រង់ចំនួនកំណត់', slide: 2 },
        { title: '២. ប្រមាណវិធីលើលីមីត', slide: 3 },
        { title: '៣. លីមីតរាងមិនកំណត់ 0/0', slide: 4 },
        { title: '៤. លីមីតរាងមិនកំណត់ inf/inf', slide: 6 },
        { title: 'លំហាត់អនុវត្ត & កិច្ចការផ្ទះ', slide: 7 }
      ],
      build: limits
    },
    {
      id: 'g11-derivatives',
      ver: 3,
      grade: '11',
      chapterNum: 5,
      chapter: 'ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ',
      lessonNum: 2,
      lesson: 'មេរៀនទី ២ ៖ ដេរីវេនៃអនុគមន៍',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី២ ដេរីវេនៃអនុគមន៍ (៩ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 1 },
        { title: '១. និយមន័យដេរីវេត្រង់មួយចំណុច', slide: 2 },
        { title: '២. រូបមន្តដេរីវេងាយៗ', slide: 3 },
        { title: '៣. សមីការបន្ទាត់ប៉ះក្រាប', slide: 4 },
        { title: '៤. ដេរីវេ និងទិសដៅអថេរភាព', slide: 5 },
        { title: 'លំហាត់អនុវត្ត & កិច្ចការផ្ទះ', slide: 6 }
      ],
      build: derivatives
    }
  ];
})();
