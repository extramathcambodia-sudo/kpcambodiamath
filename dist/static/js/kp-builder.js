/* KPCambodianmathematics — exam paper studio (exam-builder.html) */
(function () {
  'use strict';
  var KP = window.KP, kh = KP.kh, esc = KP.esc;
  var $ = function (id) { return document.getElementById(id); };
  var store = KP.store();
  var bank = null, paper = null, view = 'paper', version = 0, kind = 'monthly';
  var DRAFT = 'kp-builder-draft';

  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2600); }
  KP.toast = toast;

  /* -------------------------------------------------------- form */
  function fill(sel, items, val) { sel.innerHTML = items.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join(''); }
  fill($('b-month'), KP.MONTHS.map(function (m, i) { return [m, m]; }), KP.MONTHS[new Date().getMonth()]);
  fill($('b-font'), KP.FONTS.map(function (f) { return [f, f]; }), 'Khmer OS Siemreap');
  var y = new Date().getFullYear(), m0 = new Date().getMonth();
  $('b-year').value = m0 >= 9 ? kh(y) + '–' + kh(y + 1) : kh(y - 1) + '–' + kh(y);
  try { var saved = JSON.parse(localStorage.getItem('kp-builder-meta') || 'null'); if (saved) ['office', 'school', 'year'].forEach(function (k) { if (saved[k]) $('b-' + k).value = saved[k]; }); } catch (e) {}

  function track() { return +$('b-grade').value === 11 ? $('b-track').value : ''; }
  function selected() { return Array.prototype.filter.call(document.querySelectorAll('#b-lessons input[data-num]'), function (c) { return c.checked; }).map(function (c) { return +c.dataset.num; }); }

  function setKind(k, keepCounts) {
    kind = k;
    Array.prototype.forEach.call(document.querySelectorAll('#b-kind button'), function (b) { b.classList.toggle('on', b.dataset.kind === k); });
    $('f-month').hidden = k !== 'monthly'; $('f-sem').hidden = k !== 'semester';
    if (!keepCounts) {
      var p = KP.KINDS[k];
      $('b-nmcq').value = p.mcq; $('b-nwr').value = p.written; $('b-total').value = p.total; $('b-duration').value = p.duration; $('b-mcqpts').value = p.mcqPts;
    }
    $('b-scope-hint').textContent = {
      lesson: 'ជ្រើសរើសមេរៀនមួយ (ឬច្រើន) ។', chapter: 'ចុចលើឈ្មោះជំពូក ដើម្បីជ្រើសមេរៀនទាំងអស់ក្នុងជំពូកនោះ ។',
      monthly: 'ជ្រើសរើសមេរៀនដែលបានបង្រៀនក្នុងខែនេះ ។', semester: 'ជ្រើសរើសមេរៀនទាំងអស់ក្នុងឆមាស ។', custom: 'ជ្រើសរើសមេរៀនណាក៏បាន ។'
    }[k];
    updateAvail();
  }
  function renderLessons() {
    var g = +$('b-grade').value;
    $('f-track').hidden = g !== 11;
    if (!bank) { $('b-lessons').innerHTML = '<p class="muted">កំពុងផ្ទុក…</p>'; return; }
    var chs = KP.chaptersOf(KP.lessonsOf(bank, track()));
    $('b-lessons').innerHTML = chs.map(function (c, ci) {
      return '<details open><summary><label class="chk" style="display:inline-flex;margin:0"><input type="checkbox" data-ch="' + ci + '"> ' + esc(c.title || 'មេរៀន') + '</label></summary>' +
        c.lessons.map(function (l) {
          return '<label class="chk"><input type="checkbox" data-num="' + l.num + '" data-chi="' + ci + '"> មេរៀនទី ' + kh(l.num) + ' ' + esc(l.title) + ' <small>(' + kh(l.mcq.length) + '/' + kh(l.ex.length) + ')</small></label>';
        }).join('') + '</details>';
    }).join('') || '<p class="muted">មិនមានមេរៀន</p>';
    updateAvail();
  }
  function loadGrade() {
    bank = null; renderLessons();
    KP.loadBank(+$('b-grade').value).then(function (b) { bank = b; renderLessons(); $('b-all').click(); }, function () { $('b-lessons').innerHTML = '<p class="note-box">មិនអាចផ្ទុកកម្រងសំណួរបានទេ ។ សូមពិនិត្យថាមានថត static/bank នៅជាមួយទំព័រនេះ ។</p>'; });
  }
  function updateAvail() {
    if (!bank) return;
    var nums = selected(), a = KP.availability(bank, nums, $('b-fig').checked);
    var g = +$('b-grade').value;
    var t = 'បានជ្រើស ' + kh(nums.length) + ' មេរៀន · មាន ' + kh(a.mcq) + ' សំណួរពហុជ្រើសរើស និង ' + kh(a.written) + ' លំហាត់សរសេរ';
    if (a.written < +$('b-nwr').value) t += ' (លំហាត់សរសេរដែលខ្វះ នឹងយកពីសំណួរបើកចំហ ' + kh(a.open) + ')';
    $('b-avail').textContent = t;
    $('b-avail').className = 'muted' + (a.mcq < +$('b-nmcq').value ? ' warn-t' : '');
    var mp = +$('b-nmcq').value * +$('b-mcqpts').value;
    $('b-split').textContent = 'ពហុជ្រើសរើស ' + kh(mp) + ' ពិន្ទុ · លំហាត់សរសេរ ' + kh(Math.max(0, +$('b-total').value - mp)) + ' ពិន្ទុ';
    if (g === 12 && a.written === 0) $('b-avail').textContent += ' — សៀវភៅថ្នាក់ទី ១២ មិនមានលំហាត់សរសេរ ដូច្នេះលំហាត់សរសេរយកពីសំណួរបើកចំហ ។';
  }
  $('b-lessons').addEventListener('change', function (e) {
    var c = e.target;
    if (c.dataset.ch != null) Array.prototype.forEach.call(document.querySelectorAll('#b-lessons input[data-chi="' + c.dataset.ch + '"]'), function (x) { x.checked = c.checked; });
    else if (c.dataset.chi != null) {
      var all = document.querySelectorAll('#b-lessons input[data-chi="' + c.dataset.chi + '"]'), on = Array.prototype.filter.call(all, function (x) { return x.checked; }).length;
      var h = document.querySelector('#b-lessons input[data-ch="' + c.dataset.chi + '"]'); h.checked = on === all.length; h.indeterminate = on > 0 && on < all.length;
    }
    updateAvail();
  });
  $('b-lessons').addEventListener('click', function (e) { if (e.target.closest('summary label')) e.stopPropagation(); }, true);
  $('b-all').onclick = function () { Array.prototype.forEach.call(document.querySelectorAll('#b-lessons input'), function (x) { x.checked = true; x.indeterminate = false; }); updateAvail(); };
  $('b-none').onclick = function () { Array.prototype.forEach.call(document.querySelectorAll('#b-lessons input'), function (x) { x.checked = false; x.indeterminate = false; }); updateAvail(); };
  $('b-grade').onchange = loadGrade; $('b-track').onchange = function () { renderLessons(); $('b-all').click(); };
  ['b-nmcq', 'b-nwr', 'b-mcqpts', 'b-total', 'b-fig'].forEach(function (id) { $(id).addEventListener('input', updateAvail); $(id).addEventListener('change', updateAvail); });
  $('b-kind').onclick = function (e) { var b = e.target.closest('button'); if (b) setKind(b.dataset.kind); };

  function scopeLabel(nums) {
    var ls = bank.lessons.filter(function (l) { return nums.indexOf(l.num) >= 0; });
    if (ls.length === 1) return 'មេរៀនទី ' + kh(ls[0].num) + ' ' + ls[0].title;
    var parts = []; ls.forEach(function (l) { if (parts.indexOf(l.part) < 0) parts.push(l.part); });
    if (parts.length === 1 && parts[0]) return parts[0];
    return 'មេរៀនទី ' + kh(ls[0].num) + '–' + kh(ls[ls.length - 1].num);
  }
  function meta() {
    var m = {
      kind: kind, month: $('b-month').value, semester: +$('b-sem').value, office: $('b-office').value.trim(), school: $('b-school').value.trim(),
      year: $('b-year').value.trim(), date: $('b-date').value.trim(), subject: $('b-subject').value.trim() || 'គណិតវិទ្យា',
      duration: +$('b-duration').value || 60, instructions: $('b-instr').value.trim(), kingdom: $('b-kingdom').checked,
      studentLine: $('b-student').checked, answerGrid: $('b-grid').checked
    };
    try { localStorage.setItem('kp-builder-meta', JSON.stringify({ office: m.office, school: m.school, year: m.year })); } catch (e) {}
    return m;
  }
  $('b-gen').onclick = function () {
    if (!bank) return;
    var nums = selected();
    if (!nums.length) { toast('សូមជ្រើសរើសមេរៀនយ៉ាងហោចណាស់មួយ'); return; }
    var m = meta(); m.scope = scopeLabel(nums);
    if ($('b-title').value.trim()) m.title = $('b-title').value.trim();
    paper = KP.generate(bank, { grade: +$('b-grade').value, track: track(), lessons: nums, nMcq: +$('b-nmcq').value || 0, nWritten: +$('b-nwr').value || 0,
      mcqPts: +$('b-mcqpts').value || 1, total: +$('b-total').value || 0, seed: Date.now(), allowFig: $('b-fig').checked, meta: m });
    paper.versions = Math.max(1, Math.min(4, +$('b-versions').value || 1));
    version = 0;
    var short = [];
    if (paper.mcq.length < +$('b-nmcq').value) short.push('សំណួរពហុជ្រើសរើសមានត្រឹម ' + kh(paper.mcq.length));
    if (paper.written.length < +$('b-nwr').value) short.push('លំហាត់សរសេរមានត្រឹម ' + kh(paper.written.length));
    if (short.length) toast(short.join(' · '));
    else toast('បានបង្កើតវិញ្ញាសារួចរាល់');
    saveDraft(); show();
    if (window.innerWidth < 980) $('pv').scrollIntoView({ behavior: 'smooth' });
  };
  function saveDraft() { try { localStorage.setItem(DRAFT, JSON.stringify(paper)); } catch (e) {} }

  /* -------------------------------------------------------- preview */
  function cur() { return KP.variant(paper, version); }
  function show() {
    var pv = $('pv');
    $('pv-tools').hidden = !paper;
    if (!paper) { pv.innerHTML = '<div class="empty">ជ្រើសរើសថ្នាក់ មេរៀន និងចំនួនសំណួរ រួចចុច <b>បង្កើតវិញ្ញាសា</b> ។</div>'; return; }
    var vs = $('pv-ver'); vs.innerHTML = ''; for (var i = 0; i < (paper.versions || 1); i++) vs.innerHTML += '<option value="' + i + '"' + (i === version ? ' selected' : '') + '>' + KP.versionLabel(i) + '</option>';
    $('pv-ver-wrap').hidden = (paper.versions || 1) < 2;
    var p = cur(), h = '';
    if (view !== 'key') h += KP.renderPaper(p, { tools: version === 0, answers: view === 'both' });
    if (view !== 'paper') h += KP.renderKey(p);
    $('pv-sum').textContent = kh(p.mcq.length) + ' សំណួរពហុជ្រើសរើស · ' + kh(p.written.length) + ' លំហាត់សរសេរ · ពិន្ទុសរុប ' + kh(KP.total(p));
    pv.innerHTML = h; KP.typeset(pv);
  }
  $('pv-view').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; view = b.dataset.v; Array.prototype.forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); }); show(); };
  $('pv-ver').onchange = function () { version = +this.value; show(); };
  $('pv').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !paper) return;
    var i = +b.dataset.i;
    if (b.dataset.swap) { if (!KP.swap(bank, paper, b.dataset.swap, i, $('b-fig').checked)) toast('មិនមានសំណួរផ្សេងទៀតក្នុងមេរៀននេះទេ'); }
    else if (b.dataset.del) { (b.dataset.del === 'mcq' ? paper.mcq : paper.written).splice(i, 1); }
    else return;
    saveDraft(); show();
  });
  $('pv').addEventListener('change', function (e) {
    var t = e.target; if (t.dataset.pts == null || !paper) return;
    paper.written[+t.dataset.pts].pts = Math.max(0, +t.value || 0); saveDraft(); show();
  });

  /* -------------------------------------------------------- export */
  function fname(ext, suffix) {
    var m = paper.meta, base = (KP.paperTitle(m) + ' ថ្នាក់ទី' + kh(paper.grade) + (version ? ' ' + KP.versionLabel(version) : '') + (suffix || '')).replace(/[\\/:*?"<>|៖]+/g, ' ').replace(/\s+/g, '_');
    return base.slice(0, 90) + ext;
  }
  function printPapers(withKey) {
    var area = $('print-area'), h = '', n = paper.versions || 1, which = $('x-allver').checked ? Array.apply(null, Array(n)).map(function (_, i) { return i; }) : [version];
    which.forEach(function (v, i) {
      var p = KP.variant(paper, v);
      h += '<div class="pb">' + KP.renderPaper(p, { answers: false }) + '</div>';
      if (withKey) h += '<div class="pb">' + KP.renderKey(p) + '</div>';
    });
    area.innerHTML = h; KP.typeset(area);
    document.body.classList.add('printing');
    var old = document.title; document.title = fname('').replace(/_/g, ' ');
    setTimeout(function () { window.print(); }, 250);
    var done = function () { document.body.classList.remove('printing'); area.innerHTML = ''; document.title = old; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
  }
  $('x-pdf').onclick = function () { if (paper) printPapers($('x-key').checked); };
  $('x-tex').onclick = function () {
    if (!paper) return;
    KP.latexZip(cur(), { key: $('x-key').checked, font: $('b-font').value, base: 'exam' }).then(function (r) {
      if (r.hasImages) { KP.download(r.zip, fname('.zip', '_LaTeX')); toast('ទាញយក .zip (exam.tex + រូបភាព) — compile ដោយ XeLaTeX'); }
      else { KP.download(new Blob([r.tex], { type: 'application/x-tex' }), fname('.tex')); toast('ទាញយក .tex — compile ដោយ XeLaTeX'); }
    });
  };
  $('x-texshow').onclick = function () {
    if (!paper) return;
    var r = KP.toLatex(cur(), { key: $('x-key').checked, font: $('b-font').value });
    $('tex-code').value = r.tex; $('dlg-tex').showModal();
  };
  $('tex-copy').onclick = function () { $('tex-code').select(); try { navigator.clipboard.writeText($('tex-code').value); } catch (e) { document.execCommand('copy'); } toast('បានចម្លងកូដ LaTeX'); };
  $('x-docx').onclick = function () {
    if (!paper) return;
    toast('កំពុងបង្កើតឯកសារ Word…');
    KP.toDocx(cur(), { key: $('x-key').checked, font: $('b-font').value }).then(function (b) { KP.download(b, fname('.docx')); toast('ទាញយកឯកសារ Word រួចរាល់'); }, function (e) { console.error(e); toast('បង្កើត Word មិនបាន ៖ ' + e.message); });
  };

  /* -------------------------------------------------------- save / assign */
  function needLogin() {
    if (store.mode === 'firebase' && !store.user()) { toast('សូមចូលគណនីគ្រូនៅទំព័រ «ថ្នាក់រៀនរបស់ខ្ញុំ» ជាមុនសិន'); return true; }
    return false;
  }
  $('x-save').onclick = function () {
    if (!paper || needLogin()) return;
    store.savePaper(paper).then(function () { saveDraft(); toast('បានរក្សាទុកវិញ្ញាសា'); listSaved(); }, function (e) { toast(e.message); });
  };
  function listSaved() {
    if (store.mode === 'firebase' && !store.user()) { $('saved').innerHTML = '<p class="muted">ចូលគណនីគ្រូ ដើម្បីមើលវិញ្ញាសាដែលបានរក្សាទុក ។</p>'; return; }
    store.listPapers().then(function (l) {
      $('saved').innerHTML = l.length ? l.map(function (p) {
        return '<div class="sv-row"><div><b>' + esc((p.meta && (p.meta.title || KP.paperTitle(p.meta))) || 'វិញ្ញាសា') + '</b><small class="muted"> · ថ្នាក់ទី ' + kh(p.grade) + ' · ' + kh(p.nMcq) + '+' + kh(p.nWritten) + ' · ' + new Date(p.created).toLocaleDateString('km-KH') + '</small></div>' +
          '<span><button class="btn btn-ghost btn-xs" data-open="' + p.id + '">បើក</button> <button class="btn btn-danger btn-xs" data-delp="' + p.id + '">លុប</button></span></div>';
      }).join('') : '<p class="muted">មិនទាន់មានវិញ្ញាសាដែលបានរក្សាទុក ។</p>';
    }, function (e) { $('saved').innerHTML = '<p class="muted">' + esc(e.message) + '</p>'; });
  }
  $('saved').onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.open) store.getPaper(b.dataset.open, true).then(function (p) { if (!p) return; openPaper(p); toast('បានបើកវិញ្ញាសា'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (b.dataset.delp && confirm('លុបវិញ្ញាសានេះ?')) store.deletePaper(b.dataset.delp).then(listSaved);
  };
  function openPaper(p) {
    paper = p; paper.used = paper.used || {}; version = 0;
    $('b-grade').value = p.grade; if (p.track) $('b-track').value = p.track;
    setKind((p.meta && p.meta.kind) || 'custom', true);
    KP.loadBank(p.grade).then(function (b) {
      bank = b; renderLessons();
      Array.prototype.forEach.call(document.querySelectorAll('#b-lessons input[data-num]'), function (c) { c.checked = p.lessons.indexOf(+c.dataset.num) >= 0; });
      updateAvail();
    });
    show();
  }
  /* assign to a class: creates an assessment linked to this paper */
  $('x-assign').onclick = function () {
    if (!paper || needLogin()) return;
    store.listClasses().then(function (cls) {
      if (!cls.length) { toast('សូមបង្កើតថ្នាក់នៅទំព័រ «ថ្នាក់រៀនរបស់ខ្ញុំ» ជាមុនសិន'); return; }
      fill($('a-class'), cls.map(function (c) { return [c.id, c.name + ' (ថ្នាក់ទី ' + kh(c.grade) + ')']; }), cls[0].id);
      $('a-class').onchange = function () { var c = cls.filter(function (x) { return x.id === $('a-class').value; })[0]; fill($('a-subject'), (c.subjects || []).map(function (s) { return [s.id, s.name]; }), ((c.subjects || []).filter(function (s) { return /គណិត/.test(s.name); })[0] || {}).id); };
      $('a-class').onchange();
      var t = paper.meta.kind === 'semester' ? 'semester' : (paper.meta.kind === 'monthly' ? 'monthly' : (paper.meta.kind === 'chapter' ? 'chapter' : 'lesson'));
      $('a-type').value = t;
      var mi = KP.MONTHS.indexOf(paper.meta.month);
      fill($('a-month'), KP.MONTHS.map(function (m, i) { return [i, m]; }), mi >= 0 ? mi : new Date().getMonth());
      $('a-sem').value = paper.meta.semester || 1;
      $('a-title').value = paper.meta.title || KP.paperTitle(paper.meta);
      $('a-type').onchange = function () { $('a-f-month').hidden = $('a-type').value === 'semester'; $('a-f-sem').hidden = $('a-type').value !== 'semester'; };
      $('a-type').onchange();
      $('dlg-assign').showModal();
    }, function (e) { toast(e.message); });
  };
  $('a-ok').onclick = function (e) {
    e.preventDefault();
    var cid = $('a-class').value;
    store.savePaper(paper).then(function (r) {
      return store.saveAssessment(cid, { type: $('a-type').value, subjectId: $('a-subject').value, month: +$('a-month').value, semester: +$('a-sem').value,
        title: $('a-title').value.trim() || KP.paperTitle(paper.meta), max: KP.total(paper), mcqMax: paper.mcq.length * paper.mcqPts, paperId: r.id,
        duration: paper.meta.duration, open: $('a-open').checked, date: new Date().toISOString().slice(0, 10) });
    }).then(function () { $('dlg-assign').close(); listSaved(); toast('បានដាក់វិញ្ញាសាឱ្យថ្នាក់ — មើលពិន្ទុក្នុង «ថ្នាក់រៀនរបស់ខ្ញុំ»'); }, function (e) { toast(e.message); });
  };
  Array.prototype.forEach.call(document.querySelectorAll('dialog [data-close]'), function (b) { b.onclick = function () { b.closest('dialog').close(); }; });

  /* -------------------------------------------------------- start */
  KP.teacherLock(function () {});
  var q = new URLSearchParams(location.search);
  if (q.get('g')) $('b-grade').value = q.get('g');
  setKind(q.get('kind') || 'monthly');
  var draft = null; try { draft = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (e) {}
  if (draft && draft.mcq && !q.get('g')) openPaper(draft); else { loadGrade(); show(); }
  store.init().then(function () {
    if (store.mode === 'firebase') store.onAuth(function () { listSaved(); }); else listSaved();
  }, function (e) { $('saved').innerHTML = '<p class="muted">' + esc(e.message) + '</p>'; });
  $('mode-note').innerHTML = store.mode === 'firebase' ? 'ទិន្នន័យរក្សាទុកលើ <b>Firebase (អនឡាញ)</b>' : 'ទិន្នន័យរក្សាទុកក្នុង <b>កម្មវិធីរុករកនេះ</b> (Local)';
})();
