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
      var e = T(x, y, w, h, text, { size: 22, fill: '#fff4e6', border: '#f68c1f', bw: 2, radius: 14, valign: 'middle' });
      for (var k in o) e[k] = o[k];
      return e;
    };
    K.card = function (x, y, w, h, text, o) {
      var e = T(x, y, w, h, text, { size: 24, fill: '#f5f8fc', border: '#c5d3e8', bw: 2, radius: 16, valign: 'middle' });
      for (var k in o) e[k] = o[k];
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
        title = K.title, tip = K.tip, card = K.card;
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
        S.box(60, 525, 1180, 80, 'ដើម្បីបញ្ជាក់ថារូបមន្តនេះពិតចំពោះគ្រប់ $n \in \mathbb{N}$ គេត្រូវប្រើ «វិចារអនុមានរួមគណិតវិទ្យា» ។', { size: 24, align: 'center', anim: true }),
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
        l(60, 155, 1180, 'ដើម្បីស្រាយបញ្ជាក់ថាសំណើ $P(n)$ ពិតចំពោះគ្រប់ចំនួនគត់ $n \ge 1$ គេត្រូវអនុវត្ត ៣ ជំហាន ៖', { size: 26 }),
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
        tip(60, 160, 1180, 80, 'ចំណាំ ៖ ពេលបង្ហាញ $P(k+1)$ ក្នុងវិសមភាព គេច្រើនប្រើលក្ខណៈឆ្លង ៖ បើ $A > B$ និង $B \ge C$ នោះនាំឲ្យ $A > C$ ។', { size: 24 }),
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
        tip(60, 160, 1180, 80, 'និយមន័យ ៖ $A$ ជាពហុគុណនៃ $m$ (ចែកដាច់នឹង $m$) លុះត្រាតែមានចំនួនគត់ $q$ ដែល $A = m \times q$ ។', { size: 24 }),
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

      /* 20 section 5: Pascal's triangle intro */ page([
        sec("៥. ត្រីកោណប៉ាស្កាល់ (Pascal's Triangle)"),
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
        s(80, 465, 1120, R`!!• ទំនាក់ទំនងទៅនឹងបន្ទំ ៖!!   មេគុណនីមួយៗគឺ  ${}_nC_r = \dbinom{n}{r} = \dfrac{n!}{(n - r)!\,r!}$`),
        s(80, 520, 1120, R`• ជួរទី $5$ ៖  ${}_5C_0 = 1,\ {}_5C_1 = 5,\ {}_5C_2 = 10,\ {}_5C_3 = 10,\ {}_5C_4 = 5,\ {}_5C_5 = 1$`, { color: 'brand' }),
        kids()
      ]),

      /* 22 binomial theorem formula */ page([
        sec('៥. ទ្រឹស្តីបទទ្វេធាញូតុន (Binomial Theorem)'),
        S.box(80, 160, 1120, 160, R`!!__ទ្រឹស្តីបទទ្វេធាញូតុន ៖__!!
$$(x + y)^n = \sum_{r=0}^{n} {}_nC_r\,x^{n-r}y^r = {}_nC_0\,x^n + {}_nC_1\,x^{n-1}y + {}_nC_2\,x^{n-2}y^2 + \ldots + {}_nC_n\,y^n$$`, { size: 25, align: 'center' }),
        card(80, 345, 540, 240, 'រូបមន្តតួទូទៅ (General Term)', R`តួទី $r + 1$ នៃពន្លាតទ្វេធាកំណត់ដោយ ៖
$$T_{r+1} = {}_nC_r\,x^{n-r}y^r$$
(ចំណាំ ៖ តួទី ១ ត្រូវនឹង $r = 0$, តួទី ២ ត្រូវនឹង $r = 1$, តួទី $k$ ត្រូវនឹង $r = k - 1$)`, { size: 21 }),
        card(660, 345, 540, 240, 'មេគុណបន្ទំ (Combinations)', R`$${}_nC_r = \frac{n!}{(n - r)!\,r!}$$
លក្ខណៈឆ្លុះ ៖ ${}_nC_r = {}_nC_{n-r}$
ផលបូកមេគុណ ៖ $\sum_{r=0}^n {}_nC_r = 2^n$`, { size: 21 })
      ]),

      /* 23 expansion example 1 */ page([
        sec('លំហាត់គំរូ ៨ ៖ ពន្លាតកន្សោម (1 + 3x)⁴'),
        l(60, 150, 1180, R`ដោយប្រើទ្រឹស្តីបទទ្វេធាចូរពន្លាតកន្សោម  $(1 + 3x)^4$  (សៀវភៅពុម្ពទំព័រ ៤៨) ។`, { size: 26 }),
        K.solTitle(440, 206),
        s(60, 260, 1180, R`អនុវត្តរូបមន្ត $(x + y)^n$ ដោយយក $x = 1,\ y = 3x,\ n = 4$ ៖`),
        s(80, 315, 1120, R`$(1 + 3x)^4 = {}_4C_0(1)^4 + {}_4C_1(1)^3(3x) + {}_4C_2(1)^2(3x)^2 + {}_4C_3(1)(3x)^3 + {}_4C_4(3x)^4$`),
        s(80, 385, 1120, R`គណនាមេគុណ ៖  ${}_4C_0 = 1,\ {}_4C_1 = 4,\ {}_4C_2 = 6,\ {}_4C_3 = 4,\ {}_4C_4 = 1$`),
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
        s(120, 440, 1040, R`គណនា ${}_{13}C_3 = \dfrac{13 \times 12 \times 11}{3 \times 2 \times 1} = 13 \times 2 \times 11 = 286$`),
        S.box(160, 515, 880, 76, R`!!ដូចនេះ!!   តួទី ៤ គឺ   $T_4 = 286x^{10}y^3$`, { size: 30, align: 'center', anim: true })
      ]),

      /* 26 finding specific term 2 */ page([
        sec('លំហាត់គំរូ ១១ ៖ កំណត់តួទី ៦ នៃ (x² - 2y)⁷'),
        l(60, 150, 1180, R`កំណត់តួទី $6$ នៃពន្លាតកន្សោម  $(x^2 - 2y)^7$  (លំហាត់ ២៦ ទំព័រ ៥២) ។`, { size: 26 }),
        K.solTitle(440, 210),
        s(60, 265, 1180, R`យើងមាន $n = 7$ ។ តួទី $6 \Rightarrow r + 1 = 6 \Rightarrow r = 5$ ៖`),
        s(120, 325, 1040, R`$T_6 = {}_7C_5\,(x^2)^{7-5}(-2y)^5 = {}_7C_5\,(x^2)^2(-32y^5)$`),
        s(120, 395, 1040, R`គណនា ${}_7C_5 = {}_7C_2 = \dfrac{7 \times 6}{2 \times 1} = 21$`),
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
        l(60, 155, 1180, 'តើពន្លាតទ្វេធា $(2a + b)^8$ មានចំនួនប៉ុន្មានតួ?', { size: 28 }),
        card(100, 230, 480, 110, 'A', '៧ តួ', { size: 24 }),
        card(640, 230, 480, 110, 'B', '៨ តួ', { size: 24 }),
        card(100, 360, 480, 110, 'C', '៩ តួ', { size: 24 }),
        card(640, 360, 480, 110, 'D', '១៦ តួ', { size: 24 }),
        S.box(100, 500, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ C!! (ព្រោះពន្លាត $(x+y)^n$ តែងមាន $(n + 1)$ តួ គឺ $8 + 1 = 9$ តួ)`, { size: 25, align: 'center', anim: true })
      ]),

      /* 30 quick quiz 2 */ page([
        sec('សំណួរត្រួតពិនិត្យការយល់ដឹង (MCQ ២)'),
        l(60, 155, 1180, R`ដើម្បីកំណត់ «តួទី ៥» នៃពន្លាត $(x + y)^{10}$ តើតម្លៃ $r$ ស្មើនឹងប៉ុន្មាន?`, { size: 28 }),
        card(100, 230, 480, 110, 'A', '$r = 5$', { size: 24 }),
        card(640, 230, 480, 110, 'B', '$r = 4$', { size: 24 }),
        card(100, 360, 480, 110, 'C', '$r = 6$', { size: 24 }),
        card(640, 360, 480, 110, 'D', '$r = 10$', { size: 24 }),
        S.box(100, 500, 1020, 80, R`!!ចម្លើយត្រឹមត្រូវ ៖ B!! (ព្រោះតួទី $k$ ត្រូវនឹង $r = k - 1$ ដូច្នេះតួទី ៥ ត្រូវនឹង $r = 4$)`, { size: 25, align: 'center', anim: true })
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

  function trigEquations(A) {
    var K = kit(A), T = K.T, shape = K.shape, page = K.page, S = K.S, info = K.info, kids = K.kids, line = K.line,
        step = K.step, solTitle = K.solTitle, title = K.title, card = K.card;
    var slides = [
      /* 1 */ S.cover('==គណិតវិទ្យា== ថ្នាក់ទី១១', '==ជំពូកទី៣==        មេរៀនទី១២', 'សមីការនិងវិសមីការត្រីកោណមាត្រ'),
      /* 2 */ S.objective([
        R`ដោះស្រាយសមីការត្រីកោណមាត្រគ្រឹះ $\sin x = a,\ \cos x = a,\ \tan x = a$`,
        R`ដោះស្រាយសមីការលីនេអ៊ែរទម្រង់ $a\sin x + b\cos x = c$`,
        R`ដោះស្រាយវិសមីការត្រីកោណមាត្រលើរង្វង់ត្រីកោណមាត្រ`
      ]),
      /* 3 */ page([
        title('១. សមីការត្រីកោណមាត្រគ្រឹះ'),
        S.box(60, 180, 1160, 260, R`!!__១. សមីការស៊ីនុស__!! ៖
• $\sin x = \sin \alpha \iff \begin{cases} x = \alpha + 2k\pi \\ x = \pi - \alpha + 2k\pi \end{cases} \quad (k \in \mathbb{Z})$
• បើ $|a| > 1$ នោះសមីការ $\sin x = a$ គ្មានចម្លើយទេព្រោះ $-1 \le \sin x \le 1$ ។`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 4 */ page([
        title('ឧទាហរណ៍ទី១ ៖ សមីការស៊ីនុស'),
        S.box(60, 170, 1160, 80, R`ដោះស្រាយសមីការ $\sin x = \dfrac{1}{2}$ លើ $\mathbb{R}$ ។`, { size: 28 }),
        solTitle(440, 270),
        S.box(160, 340, 960, 260, R`យើងមាន $\dfrac{1}{2} = \sin\dfrac{\pi}{6}$ នោះ $\sin x = \sin\dfrac{\pi}{6}$
នាំឲ្យ $\begin{cases} x = \dfrac{\pi}{6} + 2k\pi \\ x = \pi - \dfrac{\pi}{6} + 2k\pi = \dfrac{5\pi}{6} + 2k\pi \end{cases} \quad (k \in \mathbb{Z})$
!!ដូចនេះ!!  $x \in \left\{ \dfrac{\pi}{6} + 2k\pi, \dfrac{5\pi}{6} + 2k\pi \right\}, k \in \mathbb{Z}$`, { size: 26, lh: '1.6', align: 'center', anim: true })
      ]),
      /* 5 */ page([
        title('២. សមីការកូស៊ីនុស'),
        S.box(60, 180, 1160, 260, R`!!__២. សមីការកូស៊ីនុស__!! ៖
• $\cos x = \cos \alpha \iff x = \pm \alpha + 2k\pi \quad (k \in \mathbb{Z})$
• សម្គាល់ ៖ បើ $|a| > 1$ នោះសមីការ $\cos x = a$ គ្មានចម្លើយទេ ។`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 6 */ page([
        title('ឧទាហរណ៍ទី២ ៖ សមីការកូស៊ីនុស'),
        S.box(60, 170, 1160, 80, R`ដោះស្រាយសមីការ $\cos 2x = \dfrac{\sqrt{3}}{2}$ ។`, { size: 28 }),
        solTitle(440, 270),
        S.box(160, 340, 960, 260, R`ដោយ $\dfrac{\sqrt{3}}{2} = \cos\dfrac{\pi}{6}$ នោះ $\cos 2x = \cos\dfrac{\pi}{6}$
នាំឲ្យ $2x = \pm\dfrac{\pi}{6} + 2k\pi \iff x = \pm\dfrac{\pi}{12} + k\pi \quad (k \in \mathbb{Z})$
!!ដូចនេះ!!  $x = \pm\dfrac{\pi}{12} + k\pi \quad (k \in \mathbb{Z})$`, { size: 26, lh: '1.6', align: 'center', anim: true })
      ]),
      /* 7 */ page([
        title('៣. សមីការតង់សង់'),
        S.box(60, 180, 1160, 260, R`!!__៣. សមីការតង់សង់__!! ៖
• $\tan x = \tan \alpha \iff x = \alpha + k\pi \quad (k \in \mathbb{Z})$
• លក្ខខណ្ឌកំណត់ ៖ $x \neq \dfrac{\pi}{2} + k\pi$ ។`, { size: 26, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 8 */ page([
        title(R`៤. សមីការទម្រង់ $a\sin x + b\cos x = c$`),
        S.box(60, 180, 1160, 320, R`!!__វិធីដោះស្រាយ__!! ៖
១. លក្ខខណ្ឌមានចម្លើយ ៖ $a^2 + b^2 \ge c^2$
២. ចែកអង្គទាំងពីរនឹង $\sqrt{a^2 + b^2}$ ៖
   $$\dfrac{a}{\sqrt{a^2+b^2}}\sin x + \dfrac{b}{\sqrt{a^2+b^2}}\cos x = \dfrac{c}{\sqrt{a^2+b^2}}$$
៣. តាង $\cos\varphi = \dfrac{a}{\sqrt{a^2+b^2}}$ និង $\sin\varphi = \dfrac{b}{\sqrt{a^2+b^2}}$
   សមីការក្លាយជា $\sin(x + \varphi) = \dfrac{c}{\sqrt{a^2+b^2}}$ រួចដោះស្រាយតាមសមីការគ្រឹះ ។`, { size: 24, lh: '1.5' })
      ]),
      /* 9 */ page([
        title('៥. វិសមីការត្រីកោណមាត្រគ្រឹះ'),
        S.box(60, 180, 1160, 300, R`!!__របៀបដោះស្រាយលើរង្វង់ត្រីកោណមាត្រ__!! ៖
• ជំហានទី១ ៖ ដោះស្រាយសមីការត្រីកោណមាត្រដែលត្រូវគ្នាដើម្បីរកចំណុចកាត់លើរង្វង់ ។
• ជំហានទី២ ៖ សម្គាល់ធ្នូដែលផ្ទៀងផ្ទាត់វិសមីការលើរង្វង់ត្រីកោណមាត្រ ។
• ជំហានទី៣ ៖ សរសេរចន្លោះចម្លើយ និងបន្ថែមខួប $2k\pi$ (ចំពោះ $\sin, \cos$) ឬ $k\pi$ (ចំពោះ $\tan$) ។`, { size: 24, lh: '1.6' }),
        kids(1100, 526, 150)
      ]),
      /* 10 */ page([
        title('លំហាត់អនុវត្ត'),
        S.box(60, 170, 1160, 320, R`ចូរដោះស្រាយសមីការ និងវិសមីការខាងក្រោម ៖
!!ក.!! $\sin 2x = -\dfrac{1}{2}$
!!ខ.!! $\cos\left(x - \dfrac{\pi}{3}\right) = \dfrac{\sqrt{2}}{2}$
!!គ.!! $\sqrt{3}\sin x + \cos x = \sqrt{2}$
!!ឃ.!! $\cos x > \dfrac{1}{2}$ លើចន្លោះ $[0, 2\pi]$`, { size: 26, lh: '1.7' })
      ]),
      /* 11 */ S.homework(R`!!១.!! ដោះស្រាយសមីការ $2\cos^2 x - 3\cos x + 1 = 0$ លើ $\mathbb{R}$ ។
!!២.!! ដោះស្រាយសមីការ $\sin x + \cos x = 1$ ។
!!៣.!! ដោះស្រាយវិសមីការ $\sin x \le \dfrac{\sqrt{3}}{2}$ លើ $[0, 2\pi]$ ។`),
      /* 12 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី១២ សមីការនិងវិសមីការត្រីកោណមាត្រ', theme: 'school', school: K.info.school, school2: K.info.school2, school3: K.info.school3,
             teacher: K.info.teacher, slides: slides };
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

  window.KPSlideTemplates = [
    {
      id: 'g11-sequences',
      ver: 10,
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
      ver: 8,
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
      ver: 8,
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
      ver: 8,
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
      ver: 4,
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
      ver: 2,
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
      id: 'g11-trig',
      ver: 2,
      grade: '11',
      chapterNum: 3,
      chapter: 'ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ',
      lessonNum: 12,
      lesson: 'មេរៀនទី ១២ ៖ សមីការនិងវិសមីការត្រីកោណមាត្រ',
      name: 'ថ្នាក់ទី១១ · មេរៀនទី១២ សមីការនិងវិសមីការត្រីកោណមាត្រ (១២ ស្លាយ)',
      sections: [
        { title: 'ក្របមេរៀន (Cover)', slide: 0 },
        { title: 'វត្ថុបំណងមេរៀន', slide: 1 },
        { title: '១. សមីការស៊ីនុស', slide: 2 },
        { title: '២. សមីការកូស៊ីនុស', slide: 4 },
        { title: '៣. សមីការតង់សង់', slide: 6 },
        { title: '៤. សមីការទម្រង់ a sin x + b cos x = c', slide: 7 },
        { title: '៥. វិសមីការត្រីកោណមាត្រ', slide: 8 },
        { title: 'លំហាត់អនុវត្ត & កិច្ចការផ្ទះ', slide: 9 }
      ],
      build: trigEquations
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
      ver: 2,
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
