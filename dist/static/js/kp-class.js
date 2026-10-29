/* KPCambodianmathematics — class management & gradebook (classroom.html) */
(function () {
  'use strict';
  var KP = window.KP, kh = KP.kh, esc = KP.esc, R = KP.round;
  var $ = function (id) { return document.getElementById(id); };
  var store = KP.store();
  var S = { user: null, classes: [], cls: null, students: [], pins: {}, as: [], scores: [], tab: 'students', res: null, keys: {} };
  var MONTHS = KP.MONTHS;

  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function fmt(x, n) { if (x == null || isNaN(x)) return '—'; return kh(R(x, n == null ? 2 : n)); }
  function num(x) { return x == null || isNaN(x) ? '' : String(R(x, 2)); }
  function opt(items, val) { return items.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join(''); }
  function fail(e) { console.error(e); toast((e && e.message) || 'មានបញ្ហា'); }
  function pin4() { return String(Math.floor(1000 + Math.random() * 9000)); }
  function subj(id) { return (S.cls.subjects || []).filter(function (s) { return s.id === id; })[0]; }
  function sidName(a) { var s = subj(a.subjectId); return s ? s.name : '?'; }
  function aWhen(a) { return a.type === 'semester' ? 'ឆមាសទី ' + kh(a.semester || 1) : 'ខែ' + MONTHS[a.month]; }
  function download(text, name, type) { KP.download(new Blob([text], { type: type || 'text/plain;charset=utf-8' }), name); }
  function csv(rows) { return '﻿' + rows.map(function (r) { return r.map(function (c) { c = c == null ? '' : String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\r\n'); }
  function printHtml(h) {
    var area = $('print-area'); area.innerHTML = h; document.body.classList.add('printing');
    setTimeout(function () { window.print(); }, 200);
    var done = function () { document.body.classList.remove('printing'); area.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
  }
  function headBlock(title, sub) {
    var c = S.cls;
    return '<div class="kp-head" style="color:#222"><div class="kp-kingdom"><b>ព្រះរាជាណាចក្រកម្ពុជា</b><b>ជាតិ សាសនា ព្រះមហាក្សត្រ</b><span class="kp-orn">❧❧❧</span></div>' +
      '<div class="kp-org">' + (c.office ? esc(c.office) + '<br>' : '') + (c.school ? '<b>' + esc(c.school) + '</b>' : '') + '</div>' +
      '<h1 class="kp-title">' + esc(title) + '</h1><div class="kp-info">ថ្នាក់ ' + esc(c.name) + ' · ឆ្នាំសិក្សា ' + esc(c.year || '') + (sub ? ' · ' + sub : '') + '</div></div>';
  }

  /* ============================================================ auth */
  function boot() {
    $('mode').innerHTML = store.mode === 'firebase'
      ? '<span class="pill-s on">អនឡាញ · Firebase</span> គណនីគ្រូ និងពិន្ទុរក្សាទុកលើអ៊ីនធឺណិត ។ សិស្សធ្វើតេស្តពីទូរស័ព្ទរបស់ខ្លួន ហើយពិន្ទុចូលដោយស្វ័យប្រវត្តិ ។'
      : '<span class="pill-s warn">Local</span> ទិន្នន័យរក្សាទុកតែក្នុងកម្មវិធីរុករក (browser) នេះប៉ុណ្ណោះ ។ សូមចុច «ទាញយកឯកសារបម្រុងទុក» ជាប្រចាំ ។ ដើម្បីប្រើអនឡាញ (គ្រូ Login និងសិស្សប្រឡងពីទូរស័ព្ទ) សូមមើល FIREBASE_SETUP.md ។';
    store.init().then(function () {
      store.onAuth(function (u, err) {
        if (err) { $('auth').hidden = false; $('auth-msg').textContent = err.message; return; }
        S.user = u;
        $('auth').hidden = !!u; $('app').hidden = !u;
        $('who').innerHTML = u ? (u.local ? '' : esc(u.name || u.email) + ' · <button class="btn btn-ghost btn-xs" id="signout">ចាកចេញ</button>') : '';
        if ($('signout')) $('signout').onclick = function () { store.signOut(); };
        if (u) store.isAdmin().then(function (a) { S.admin = a; adminBox(); loadClasses(); });
      });
    }, function (e) { $('auth').hidden = false; $('auth-msg').textContent = e.message; });
    $('auth-in').onclick = function (e) { e.preventDefault(); $('auth-msg').textContent = ''; store.signIn($('au-email').value.trim(), $('au-pw').value).catch(authErr); };
    $('auth-up').onclick = function (e) {
      e.preventDefault(); $('auth-msg').textContent = '';
      if (!$('au-name').value.trim()) { $('auth-msg').textContent = 'សូមបញ្ចូលឈ្មោះគ្រូ (សម្រាប់ចុះឈ្មោះថ្មី)'; return; }
      store.signUp($('au-email').value.trim(), $('au-pw').value, $('au-name').value.trim()).catch(authErr);
    };
    $('auth-reset').onclick = function (e) { e.preventDefault(); store.resetPassword($('au-email').value.trim()).then(function () { $('auth-msg').textContent = 'បានផ្ញើអ៊ីមែលសម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី ។'; }, authErr); };
  }
  /* ============================================================ admin */
  function adminBox() {
    var el = $('admin-box'); if (!el) return;
    if (store.mode === 'local') {
      store.adminInfo().then(function (a) {
        el.innerHTML = '<h3>Admin</h3><p class="muted">' + (a.hasPw ? 'បានកំណត់ពាក្យសម្ងាត់ Admin ។ សិស្សមិនអាចបើកទំព័រគ្រូបានទេ ។' : 'មិនទាន់មានពាក្យសម្ងាត់ ។ កំណត់ពាក្យសម្ងាត់ ដើម្បីការពារទំព័រគ្រូ (បង្កើតវិញ្ញាសា និងថ្នាក់រៀន) នៅពេលសិស្សប្រើកុំព្យូទ័រនេះ ។') + '</p>' +
          (a.name ? '<p class="muted">Admin ៖ <b>' + esc(a.name) + '</b></p>' : '') +
          '<div class="btns"><button class="btn btn-ghost btn-xs" id="ad-set">' + (a.hasPw ? 'ប្ដូរពាក្យសម្ងាត់' : 'កំណត់ពាក្យសម្ងាត់') + '</button>' +
          (a.hasPw ? '<button class="btn btn-ghost btn-xs" id="ad-lock">🔒 ចាក់សោ</button><button class="btn btn-danger btn-xs" id="ad-off">លុបពាក្យសម្ងាត់</button>' : '') + '</div>';
        $('ad-set').onclick = function () { $('dlg-admin').showModal(); $('ad-name').value = a.name || ''; $('ad-pw').value = ''; $('ad-pw2').value = ''; $('ad-msg').textContent = ''; };
        if ($('ad-lock')) $('ad-lock').onclick = function () { try { sessionStorage.removeItem('kp-admin-ok'); } catch (e) {} location.reload(); };
        if ($('ad-off')) $('ad-off').onclick = function () { if (confirm('លុបពាក្យសម្ងាត់ Admin? (អ្នកណាក៏បើកទំព័រគ្រូបាន)')) store.setAdmin('', a.name).then(adminBox); };
      });
    } else if (S.admin) {
      el.innerHTML = '<h3>Admin សាលា</h3><label class="chk"><input type="checkbox" id="ad-all"' + (S.allMode ? ' checked' : '') + '> បង្ហាញថ្នាក់ទាំងអស់របស់គ្រូគ្រប់រូប</label><div id="ad-teachers" class="muted"></div>';
      $('ad-all').onchange = function () { S.allMode = this.checked; S.cls = null; loadClasses(); };
      store.listTeachers().then(function (t) {
        $('ad-teachers').innerHTML = '<b>គ្រូ (' + kh(t.length) + ')</b>' + t.map(function (x) { return '<div class="admin-row"><span>' + esc(x.name || '') + '</span><small>' + esc(x.email || '') + '</small></div>'; }).join('');
      }, function () {});
    } else el.innerHTML = '<h3>Admin</h3><p class="muted">គណនីនេះជាគណនីគ្រូ ។ ដើម្បីធ្វើជា Admin សាលា (មើលថ្នាក់គ្រប់គ្រូ) សូមមើល FIREBASE_SETUP.md ផ្នែក Admin ។</p>';
  }
  if ($('ad-ok')) $('ad-ok').onclick = function (e) {
    e.preventDefault();
    var p1 = $('ad-pw').value, p2 = $('ad-pw2').value;
    if (p1.length < 4) { $('ad-msg').textContent = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ តួ'; return; }
    if (p1 !== p2) { $('ad-msg').textContent = 'ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នា'; return; }
    store.setAdmin(p1, $('ad-name').value.trim()).then(function () { try { sessionStorage.setItem('kp-admin-ok', '1'); } catch (x) {} $('dlg-admin').close(); toast('បានកំណត់ពាក្យសម្ងាត់ Admin'); adminBox(); }, fail);
  };
  function authErr(e) {
    var c = (e && e.code) || '', m = {
      'auth/invalid-credential': 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ', 'auth/wrong-password': 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ', 'auth/user-not-found': 'មិនមានគណនីនេះទេ',
      'auth/email-already-in-use': 'អ៊ីមែលនេះមានគណនីរួចហើយ', 'auth/weak-password': 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួ', 'auth/invalid-email': 'អ៊ីមែលមិនត្រឹមត្រូវ'
    }[c];
    $('auth-msg').textContent = m || (e && e.message) || 'មានបញ្ហា';
  }

  /* ============================================================ classes */
  function loadClasses(select) {
    return (S.allMode ? store.listAllClasses() : store.listClasses()).then(function (l) {
      S.classes = l;
      var want = select || (S.cls && S.cls.id) || (function () { try { return localStorage.getItem('kp-class-cur'); } catch (e) { return null; } })();
      renderClassList();
      var c = l.filter(function (x) { return x.id === want; })[0] || l[0];
      if (c) openClass(c.id); else { S.cls = null; $('main').innerHTML = '<div class="empty">មិនទាន់មានថ្នាក់ ។ ចុច <b>+ បង្កើតថ្នាក់ថ្មី</b> ដើម្បីចាប់ផ្ដើម ។</div>'; }
    }, fail);
  }
  function renderClassList() {
    $('cls-list').innerHTML = S.classes.map(function (c) {
      return '<li><button type="button" data-cid="' + c.id + '" class="' + (S.cls && S.cls.id === c.id ? 'on' : '') + '"><b>' + esc(c.name) + '</b><small>' + (S.allMode && c.ownerName ? esc(c.ownerName) + ' · ' : '') + 'ថ្នាក់ទី ' + kh(c.grade) + ' · ' + esc(c.year || '') + ' · កូដ ' + c.id + '</small></button></li>';
    }).join('');
  }
  $('cls-list').onclick = function (e) { var b = e.target.closest('button[data-cid]'); if (b) openClass(b.dataset.cid); };
  $('new-cls').onclick = function () { $('dlg-new').showModal(); };
  (function () {
    var y = new Date().getFullYear(), m = new Date().getMonth();
    $('n-year').value = m >= 9 ? y + '-' + (y + 1) : (y - 1) + '-' + y;
  })();
  $('n-ok').onclick = function (e) {
    e.preventDefault();
    var name = $('n-name').value.trim(); if (!name) { $('n-name').focus(); return; }
    var subjects = $('n-subjects').value === 'all'
      ? KP.SUBJECT_PRESETS.map(function (p, i) { return { id: 's' + (i + 1), name: p[0], max: p[1], coef: p[1] / 50 }; })
      : [{ id: 's1', name: 'គណិតវិទ្យា', max: 100, coef: 2 }];
    var c = { name: name, grade: +$('n-grade').value, year: $('n-year').value.trim(), school: $('n-school').value.trim(), office: '', teacher: $('n-teacher').value.trim() || (S.user && S.user.name) || '',
      subjects: subjects, settings: KP.DEFAULT_SETTINGS() };
    store.saveClass(c).then(function (c2) { $('dlg-new').close(); $('n-name').value = ''; toast('បានបង្កើតថ្នាក់ ' + c2.name); loadClasses(c2.id); }, fail);
  };
  Array.prototype.forEach.call(document.querySelectorAll('dialog [data-close]'), function (b) { b.onclick = function () { b.closest('dialog').close(); }; });

  function openClass(cid) {
    try { localStorage.setItem('kp-class-cur', cid); } catch (e) {}
    $('main').innerHTML = '<p class="muted">កំពុងផ្ទុក…</p>';
    return Promise.all([store.getClass(cid), store.listStudents(cid), store.getPins(cid), store.listAssessments(cid), store.listScores(cid)]).then(function (r) {
      S.cls = r[0]; S.students = r[1]; S.pins = r[2]; S.as = r[3]; S.scores = r[4];
      if (!S.cls.subjects || !S.cls.subjects.length) S.cls.subjects = [{ id: 's1', name: 'គណិតវិទ្យា', max: 100, coef: 2 }];
      renderClassList();
      return autoGrade();
    }).then(function () { render(); }, fail);
  }
  function reload() {
    var cid = S.cls.id;
    return Promise.all([store.listStudents(cid), store.getPins(cid), store.listAssessments(cid), store.listScores(cid)]).then(function (r) {
      S.students = r[0]; S.pins = r[1]; S.as = r[2]; S.scores = r[3]; return autoGrade();
    }).then(render, fail);
  }
  /* online submissions that still need a score (Firebase mode keeps the answer key away from students) */
  function autoGrade() {
    var pending = S.scores.filter(function (s) { return s.answers && s.score == null; });
    if (!pending.length) return Promise.resolve();
    var byA = {}; S.as.forEach(function (a) { byA[a.id] = a; });
    var need = {}; pending.forEach(function (s) { var a = byA[s.aid]; if (a && a.paperId) need[a.paperId] = 1; });
    return Promise.all(Object.keys(need).map(function (pid) { return S.keys[pid] ? null : store.getKey(pid).then(function (k) { S.keys[pid] = k; }); })).then(function () {
      var upd = [];
      pending.forEach(function (s) {
        var a = byA[s.aid], k = a && S.keys[a.paperId]; if (!k) return;
        var g = KP.gradeAnswers(s.answers, k);
        s.mcq = g.mcq; s.right = g.right; s.score = g.mcq + (+s.written || 0);
        upd.push({ aid: s.aid, sid: s.sid, mcq: s.mcq, right: s.right, score: s.score });
      });
      if (upd.length) { toast('បានកែពិន្ទុពហុជ្រើសរើសដោយស្វ័យប្រវត្តិ ' + kh(upd.length) + ' សន្លឹក'); return store.saveScores(S.cls.id, upd); }
    });
  }

  /* ============================================================ layout */
  var TABS = [['students', 'សិស្ស'], ['assess', 'ការប្រឡង'], ['grade', 'បញ្ចូលពិន្ទុ'], ['month', 'លទ្ធផលប្រចាំខែ'], ['sem', 'ប្រចាំឆមាស'], ['year', 'ប្រចាំឆ្នាំ'], ['settings', 'ការកំណត់']];
  function render() {
    var c = S.cls;
    S.res = KP.compute(c, S.students, S.as, S.scores);
    var link = location.href.replace(/classroom\.html.*$/, 'student.html?c=' + c.id);
    var h = '<div class="card-p"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">' +
      '<div><h2 style="margin:0">' + esc(c.name) + ' <small class="muted">ថ្នាក់ទី ' + kh(c.grade) + ' · ' + esc(c.year || '') + '</small></h2>' +
      '<span class="muted">' + kh(S.students.length) + ' សិស្ស · ' + kh(S.as.length) + ' ការប្រឡង · ' + kh((c.subjects || []).length) + ' មុខវិជ្ជា</span></div>' +
      '<div style="text-align:right"><span class="muted">កូដថ្នាក់សម្រាប់សិស្ស</span><br><span class="code-big">' + c.id + '</span> <button class="btn btn-ghost btn-xs" id="copy-link" data-link="' + esc(link) + '">ចម្លងតំណសិស្ស</button></div></div></div>';
    h += '<nav class="tabs" id="tabs" style="margin-top:14px">' + TABS.map(function (t) { return '<button type="button" data-t="' + t[0] + '" class="' + (S.tab === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</nav><div id="panel"></div>';
    $('main').innerHTML = h;
    $('copy-link').onclick = function () { var l = this.dataset.link; try { navigator.clipboard.writeText(l); } catch (e) {} toast('តំណ ៖ ' + l); };
    $('tabs').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.tab = b.dataset.t; render(); };
    ({ students: pStudents, assess: pAssess, grade: pGrade, month: pMonth, sem: pSem, year: pYear, settings: pSettings })[S.tab]($('panel'));
  }

  /* ============================================================ students */
  function pStudents(el) {
    var h = '<div class="card-p"><h3>បន្ថែមសិស្ស</h3><p class="muted">បិទភ្ជាប់បញ្ជីឈ្មោះ (មួយបន្ទាត់មួយនាក់) ។ អាចដាក់ភេទបន្ទាប់ពីសញ្ញាក្បៀស ឧ. <code>សុខ ចាន់ធី, ស</code> ។ ប្រព័ន្ធបង្កើតលេខ PIN ៤ ខ្ទង់ដោយស្វ័យប្រវត្តិ ។</p>' +
      '<textarea class="inp" id="st-bulk" rows="4" placeholder="ចាន់ សុភា, ស&#10;សុខ វិចិត្រ, ប"></textarea><div class="btns"><button class="btn btn-primary btn-sm" id="st-add">បន្ថែម</button></div></div>';
    h += '<div class="card-p"><div class="pv-bar"><h3 style="margin:0">បញ្ជីសិស្ស (' + kh(S.students.length) + ')</h3><span class="btns" style="margin:0">' +
      '<button class="btn btn-ghost btn-xs" id="st-cards">បោះពុម្ពប័ណ្ណចូលប្រព័ន្ធ</button><button class="btn btn-ghost btn-xs" id="st-repin">បង្កើត PIN ថ្មីទាំងអស់</button><button class="btn btn-ghost btn-xs" id="st-csv">CSV</button></span></div>';
    h += '<div class="tbl-wrap"><table class="gb"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th><th>ភេទ</th><th>PIN</th><th></th></tr></thead><tbody>' +
      S.students.map(function (s, i) {
        return '<tr data-sid="' + s.id + '"><td><input class="sc" style="width:52px" type="number" value="' + (s.no || i + 1) + '" data-f="no"></td><td class="l"><input class="sc" style="width:220px;text-align:left" value="' + esc(s.name) + '" data-f="name"></td>' +
          '<td><select class="sc" style="width:64px" data-f="sex">' + opt([['', '—'], ['ប', 'ប'], ['ស', 'ស']], s.sex || '') + '</select></td><td><code>' + esc(S.pins[s.id] || '—') + '</code></td>' +
          '<td><button class="btn btn-danger btn-xs" data-del="' + s.id + '">លុប</button></td></tr>';
      }).join('') + '</tbody></table></div>' + (S.students.length ? '' : '<p class="muted">មិនទាន់មានសិស្ស ។</p>') + '</div>';
    el.innerHTML = h;
    $('st-add').onclick = function () {
      var lines = $('st-bulk').value.split(/\n/).map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return;
      var n0 = S.students.reduce(function (m, s) { return Math.max(m, s.no || 0); }, 0);
      var list = lines.map(function (l, i) {
        var p = l.split(/[,\t;]/), sex = (p[1] || '').trim();
        sex = /^(ស|ស្រី|f|F)/.test(sex) ? 'ស' : (/^(ប|ប្រុស|m|M)/.test(sex) ? 'ប' : '');
        return { name: p[0].replace(/^\d+[.)\s]+/, '').trim(), sex: sex, no: n0 + i + 1 };
      });
      store.saveStudents(S.cls.id, list).then(function (saved) {
        var pins = {}; saved.forEach(function (s) { pins[s.id] = pin4(); });
        return store.setPins(S.cls.id, pins);
      }).then(function () { toast('បានបន្ថែមសិស្ស ' + kh(list.length) + ' នាក់'); reload(); }, fail);
    };
    el.querySelector('tbody').addEventListener('change', function (e) {
      var tr = e.target.closest('tr'), f = e.target.dataset.f; if (!tr || !f) return;
      var s = S.students.filter(function (x) { return x.id === tr.dataset.sid; })[0];
      s[f] = f === 'no' ? +e.target.value : e.target.value.trim();
      store.saveStudents(S.cls.id, [s]).then(function () { toast('បានរក្សាទុក'); }, fail);
    });
    el.querySelector('tbody').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-del]'); if (!b) return;
      var s = S.students.filter(function (x) { return x.id === b.dataset.del; })[0];
      if (confirm('លុបសិស្ស «' + s.name + '» និងពិន្ទុទាំងអស់របស់គាត់?')) store.deleteStudent(S.cls.id, s.id).then(reload, fail);
    });
    $('st-repin').onclick = function () {
      if (!confirm('បង្កើតលេខ PIN ថ្មីសម្រាប់សិស្សទាំងអស់? (PIN ចាស់នឹងប្រើលែងបាន)')) return;
      var pins = {}; S.students.forEach(function (s) { pins[s.id] = pin4(); });
      store.setPins(S.cls.id, pins).then(reload, fail);
    };
    $('st-csv').onclick = function () {
      download(csv([['ល.រ', 'ឈ្មោះ', 'ភេទ', 'PIN']].concat(S.students.map(function (s) { return [s.no, s.name, s.sex, S.pins[s.id] || '']; }))), S.cls.name + '_students.csv', 'text/csv;charset=utf-8');
    };
    $('st-cards').onclick = function () {
      var link = location.href.replace(/classroom\.html.*$/, 'student.html');
      printHtml('<div class="cards-print">' + S.students.map(function (s) {
        return '<div class="login-card"><b>' + esc(s.name) + '</b><br>ថ្នាក់ ៖ ' + esc(S.cls.name) + '<br>កូដថ្នាក់ ៖ <b>' + S.cls.id + '</b> · PIN ៖ <b>' + esc(S.pins[s.id] || '') + '</b><br><small>' + esc(link) + '</small></div>';
      }).join('') + '</div>');
    };
  }

  /* ============================================================ assessments */
  function pAssess(el) {
    var c = S.cls, st = KP.settingsOf(c), curM = new Date().getMonth();
    var h = '<div class="card-p"><h3>បង្កើតការប្រឡងថ្មី</h3><div class="row3">' +
      '<label class="fld"><span>ប្រភេទ</span><select id="na-type">' + opt(Object.keys(KP.TYPES).map(function (k) { return [k, KP.TYPES[k]]; }), 'monthly') + '</select></label>' +
      '<label class="fld"><span>មុខវិជ្ជា</span><select id="na-subj">' + opt(c.subjects.map(function (s) { return [s.id, s.name]; }), c.subjects[0].id) + '</select></label>' +
      '<label class="fld" id="na-fm"><span>ខែ</span><select id="na-month">' + opt(MONTHS.map(function (m, i) { return [i, m]; }), curM) + '</select></label>' +
      '<label class="fld" id="na-fs" hidden><span>ឆមាស</span><select id="na-sem">' + opt([[1, 'ឆមាសទី ១'], [2, 'ឆមាសទី ២']], KP.semesterOfMonth(c, curM) || 1) + '</select></label>' +
      '<label class="fld"><span>ចំណងជើង</span><input id="na-title" placeholder="ឧ. ប្រឡងប្រចាំខែវិច្ឆិកា"></label>' +
      '<label class="fld"><span>ពិន្ទុពេញ</span><input id="na-max" type="number" min="1" value="' + c.subjects[0].max + '"></label></div>' +
      '<div class="btns"><button class="btn btn-primary btn-sm" id="na-ok">បង្កើត (បញ្ចូលពិន្ទុដោយដៃ)</button><a class="btn btn-ghost btn-sm" href="exam-builder.html?g=' + c.grade + '">បង្កើតវិញ្ញាសាពីកម្រងសំណួរ ហើយដាក់ឱ្យសិស្សប្រឡងអនឡាញ →</a></div></div>';
    var list = S.as.slice().sort(function (a, b) { return order(a) - order(b) || (a.createdAt || 0) - (b.createdAt || 0); });
    function order(a) { var mm = a.type === 'semester' ? st.semExamMonth[a.semester || 1] : a.month; return (mm - 10 + 12) % 12 * 10 + (a.type === 'semester' ? 9 : a.type === 'monthly' ? 5 : 1); }
    var cnt = {}; S.scores.forEach(function (s) { cnt[s.aid] = cnt[s.aid] || { n: 0, on: 0 }; if (s.score != null || s.mcq != null) cnt[s.aid].n++; if (s.answers) cnt[s.aid].on++; });
    h += '<div class="card-p"><h3>បញ្ជីការប្រឡង (' + kh(S.as.length) + ')</h3><div class="tbl-wrap"><table class="gb"><thead><tr><th class="l">ចំណងជើង</th><th>ប្រភេទ</th><th>មុខវិជ្ជា</th><th>ពេល</th><th>ពិន្ទុពេញ</th><th>បានពិន្ទុ</th><th>អនឡាញ</th><th></th></tr></thead><tbody>' +
      list.map(function (a) {
        var k = cnt[a.id] || { n: 0, on: 0 };
        return '<tr><td class="l">' + esc(a.title) + '</td><td>' + KP.TYPES[a.type] + '</td><td>' + esc(sidName(a)) + '</td><td>' + aWhen(a) + '</td><td>' + kh(a.max) + '</td><td>' + kh(k.n) + '/' + kh(S.students.length) + '</td>' +
          '<td>' + (a.paperId ? '<button class="btn btn-xs ' + (a.open ? 'btn-primary' : 'btn-ghost') + '" data-tog="' + a.id + '">' + (a.open ? 'កំពុងបើក' : 'បិទ') + '</button> <small class="muted">' + kh(k.on) + ' ប្រគល់</small>' : '<small class="muted">ក្រដាស</small>') + '</td>' +
          '<td><button class="btn btn-ghost btn-xs" data-gb="' + a.id + '">ពិន្ទុ</button> ' + (a.paperId ? '<a class="btn btn-ghost btn-xs" href="exam-builder.html" data-paper="' + a.paperId + '">វិញ្ញាសា</a> ' : '') + '<button class="btn btn-danger btn-xs" data-dela="' + a.id + '">លុប</button></td></tr>';
      }).join('') + '</tbody></table></div>' + (S.as.length ? '' : '<p class="muted">មិនទាន់មានការប្រឡង ។</p>') + '</div>';
    el.innerHTML = h;
    var sync = function () {
      var t = $('na-type').value; $('na-fm').hidden = t === 'semester'; $('na-fs').hidden = t !== 'semester';
      var s = subj($('na-subj').value); if (s && (t === 'monthly' || t === 'semester')) $('na-max').value = s.max;
      $('na-title').placeholder = t === 'semester' ? 'ប្រឡងឆមាសទី ' + kh($('na-sem').value) : (KP.TYPES[t] + ' ខែ' + MONTHS[$('na-month').value]);
    };
    ['na-type', 'na-subj', 'na-month', 'na-sem'].forEach(function (id) { $(id).onchange = sync; }); sync();
    $('na-ok').onclick = function () {
      var t = $('na-type').value;
      store.saveAssessment(c.id, { type: t, subjectId: $('na-subj').value, month: +$('na-month').value, semester: +$('na-sem').value,
        title: $('na-title').value.trim() || $('na-title').placeholder, max: +$('na-max').value || 100, open: false, date: new Date().toISOString().slice(0, 10) })
        .then(function (a) { S.tab = 'grade'; S.gradeAid = a.id; toast('បានបង្កើត ៖ ' + a.title); reload(); }, fail);
    };
    el.querySelector('tbody').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tog],[data-gb],[data-dela],[data-paper]'); if (!b) return;
      if (b.dataset.paper) { e.preventDefault(); store.getPaper(b.dataset.paper, true).then(function (p) { try { localStorage.setItem('kp-builder-draft', JSON.stringify(p)); } catch (x) {} location.href = 'exam-builder.html'; }); return; }
      var a = S.as.filter(function (x) { return x.id === (b.dataset.tog || b.dataset.gb || b.dataset.dela); })[0];
      if (b.dataset.tog) { a.open = !a.open; store.saveAssessment(c.id, a).then(function () { toast(a.open ? 'សិស្សអាចចូលប្រឡងបានហើយ' : 'បានបិទការប្រឡង'); render(); }, fail); }
      if (b.dataset.gb) { S.tab = 'grade'; S.gradeAid = a.id; render(); }
      if (b.dataset.dela && confirm('លុប «' + a.title + '» និងពិន្ទុទាំងអស់របស់វា?')) store.deleteAssessment(c.id, a.id).then(reload, fail);
    });
  }

  /* ============================================================ gradebook entry */
  function pGrade(el) {
    if (!S.as.length) { el.innerHTML = '<div class="empty">សូមបង្កើតការប្រឡងនៅផ្ទាំង «ការប្រឡង» ជាមុនសិន ។</div>'; return; }
    var a = S.as.filter(function (x) { return x.id === S.gradeAid; })[0] || S.as[S.as.length - 1]; S.gradeAid = a.id;
    var online = !!a.paperId, wmax = online ? a.max - (a.mcqMax || 0) : 0;
    var sc = {}; S.scores.forEach(function (s) { if (s.aid === a.id) sc[s.sid] = s; });
    var h = '<div class="card-p"><div class="row2"><label class="fld"><span>ការប្រឡង</span><select id="g-a">' + opt(S.as.map(function (x) { return [x.id, x.title + ' — ' + sidName(x) + ' (' + aWhen(x) + ')']; }), a.id) + '</select></label>' +
      '<div class="fld"><span>ព័ត៌មាន</span><div class="muted">' + KP.TYPES[a.type] + ' · ' + esc(sidName(a)) + ' · ពិន្ទុពេញ ' + kh(a.max) + (online ? ' (ពហុជ្រើសរើស ' + kh(a.mcqMax || 0) + ' ពិន្ទុ គណនាស្វ័យប្រវត្តិ + សរសេរ ' + kh(wmax) + ' ពិន្ទុ)' : '') + '</div></div></div>' +
      (online ? '<p class="note-box ok">សិស្សដែលបានប្រឡងអនឡាញ ពិន្ទុពហុជ្រើសរើសចូលដោយស្វ័យប្រវត្តិ ។ លោកគ្រូអ្នកគ្រូគ្រាន់តែបញ្ចូលពិន្ទុផ្នែកសរសេរ ។ សិស្សដែលប្រឡងលើក្រដាស អាចវាយពិន្ទុសរុបដោយផ្ទាល់ ។</p>' : '') + '</div>';
    h += '<div class="card-p"><div class="tbl-wrap"><table class="gb" id="g-tab"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th>' + (online ? '<th>ពហុជ្រើសរើស</th><th>សរសេរ /' + kh(wmax) + '</th>' : '') + '<th>ពិន្ទុសរុប /' + kh(a.max) + '</th><th>ស្ថានភាព</th></tr></thead><tbody>' +
      S.students.map(function (s, i) {
        var r = sc[s.id] || {};
        return '<tr data-sid="' + s.id + '"><td>' + kh(s.no || i + 1) + '</td><td class="l">' + esc(s.name) + '</td>' +
          (online ? '<td>' + (r.mcq != null ? kh(r.mcq) + (r.right != null ? ' <small class="muted">(' + kh(r.right) + ' ត្រូវ)</small>' : '') : '—') + '</td><td><input class="sc" type="number" step="0.25" min="0" max="' + wmax + '" data-f="written" value="' + num(r.written) + '"></td>' : '') +
          '<td><input class="sc" type="number" step="0.25" min="0" max="' + a.max + '" data-f="score" value="' + num(r.score) + '"></td>' +
          '<td>' + (r.submittedAt ? '<span class="pill-s on">អនឡាញ ' + new Date(r.submittedAt).toLocaleString('km-KH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</span>' : (r.score != null ? '<span class="pill-s">ដៃ</span>' : '')) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="btns"><button class="btn btn-primary btn-sm" id="g-save">រក្សាទុកពិន្ទុ</button><button class="btn btn-ghost btn-sm" id="g-paste">បិទភ្ជាប់ពិន្ទុពី Excel</button><button class="btn btn-ghost btn-sm" id="g-csv">CSV</button></div>' +
      '<div id="g-pastebox" hidden><p class="muted">បិទភ្ជាប់ជួរឈរពិន្ទុសរុប (មួយបន្ទាត់មួយសិស្ស តាមលំដាប់បញ្ជីខាងលើ) ៖</p><textarea class="inp" id="g-pastetx" rows="6"></textarea><div class="btns"><button class="btn btn-primary btn-xs" id="g-pasteok">ដាក់ចូលតារាង</button></div></div></div>';
    el.innerHTML = h;
    $('g-a').onchange = function () { S.gradeAid = this.value; render(); };
    var tab = $('g-tab');
    tab.addEventListener('input', function (e) {
      var t = e.target; if (!t.dataset.f) return;
      var mx = +t.max, v = t.value === '' ? null : +t.value;
      t.classList.toggle('bad', v != null && (v < 0 || v > mx));
      if (t.dataset.f === 'written') {
        var tr = t.closest('tr'), r = sc[tr.dataset.sid] || {}, tot = tr.querySelector('[data-f=score]');
        if (r.mcq != null || v != null) tot.value = num((+r.mcq || 0) + (v || 0));
      }
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || !e.target.dataset.f) return;
      e.preventDefault(); var tr = e.target.closest('tr').nextElementSibling; if (tr) { var n = tr.querySelector('[data-f="' + e.target.dataset.f + '"]'); if (n) n.focus(); }
    });
    $('g-save').onclick = function () {
      var bad = tab.querySelector('.bad'); if (bad) { bad.focus(); toast('មានពិន្ទុលើសពិន្ទុពេញ ឬអវិជ្ជមាន'); return; }
      var list = [];
      Array.prototype.forEach.call(tab.querySelectorAll('tbody tr'), function (tr) {
        var sid = tr.dataset.sid, r = sc[sid] || {}, sv = tr.querySelector('[data-f=score]').value, w = tr.querySelector('[data-f=written]');
        var score = sv === '' ? null : +sv, written = w ? (w.value === '' ? null : +w.value) : r.written;
        if (score === (r.score == null ? null : r.score) && written === (r.written == null ? null : r.written)) return;
        list.push({ aid: a.id, sid: sid, score: score, written: written == null ? null : written, mcq: r.mcq == null ? null : r.mcq, answers: r.answers || null, source: r.source || 'manual' });
      });
      if (!list.length) { toast('គ្មានការផ្លាស់ប្ដូរ'); return; }
      store.saveScores(S.cls.id, list).then(function () { toast('បានរក្សាទុកពិន្ទុ ' + kh(list.length) + ' នាក់'); reload(); }, fail);
    };
    $('g-paste').onclick = function () { $('g-pastebox').hidden = !$('g-pastebox').hidden; };
    $('g-pasteok').onclick = function () {
      var v = $('g-pastetx').value.split(/\r?\n/).map(function (x) { return x.trim().replace(',', '.'); });
      Array.prototype.forEach.call(tab.querySelectorAll('[data-f=score]'), function (inp, i) { if (v[i] != null && v[i] !== '' && !isNaN(+v[i])) { inp.value = v[i]; inp.dispatchEvent(new Event('input', { bubbles: true })); } });
      $('g-pastebox').hidden = true; toast('ចុច «រក្សាទុកពិន្ទុ» ដើម្បីរក្សាទុក');
    };
    $('g-csv').onclick = function () {
      download(csv([['ល.រ', 'ឈ្មោះ', 'ពិន្ទុ', 'ពិន្ទុពេញ']].concat(S.students.map(function (s) { var r = sc[s.id] || {}; return [s.no, s.name, r.score == null ? '' : r.score, a.max]; }))), a.title + '.csv', 'text/csv;charset=utf-8');
    };
  }

  /* ============================================================ results */
  function gradeCell(r) { return r && r.letter && r.letter.g ? '<span class="g-' + r.letter.g + '">' + r.letter.g + '</span>' : '—'; }
  function statsHtml(by) {
    var s = S.res.stats(by);
    return '<div class="stat-row"><div class="stat"><b>' + kh(s.n) + '</b><span>សិស្សមានពិន្ទុ</span></div><div class="stat"><b>' + fmt(s.mean) + '</b><span>មធ្យមភាគថ្នាក់</span></div>' +
      '<div class="stat"><b>' + fmt(s.max) + '</b><span>ខ្ពស់បំផុត</span></div><div class="stat"><b>' + fmt(s.min) + '</b><span>ទាបបំផុត</span></div><div class="stat"><b>' + kh(s.pass) + '/' + kh(s.n) + '</b><span>ជាប់ (≥' + kh(S.res.settings.pass) + '%)</span></div></div>';
  }
  function sortedStudents(by) {
    var mode = S.sortRank;
    var l = S.students.slice();
    if (mode) l.sort(function (a, b) { var x = by[a.id] && by[a.id].rank, y = by[b.id] && by[b.id].rank; return (x || 1e9) - (y || 1e9); });
    return l;
  }
  function resultBar(extra) {
    return '<div class="pv-bar no-print">' + extra + '<span class="btns" style="margin:0"><label class="chk"><input type="checkbox" id="r-sort"' + (S.sortRank ? ' checked' : '') + '> តម្រៀបតាមចំណាត់ថ្នាក់</label>' +
      '<button class="btn btn-ghost btn-xs" id="r-print">បោះពុម្ព</button><button class="btn btn-ghost btn-xs" id="r-csv">CSV / Excel</button></span></div>';
  }
  function wireResult(title, tableId, csvRows) {
    $('r-sort').onchange = function () { S.sortRank = this.checked; render(); };
    $('r-print').onclick = function () { printHtml('<div class="report-card" style="max-width:none;border:0;padding:0">' + headBlock(title) + $(tableId).outerHTML + '</div>'); };
    $('r-csv').onclick = function () { download(csv(csvRows()), S.cls.name + '_' + title + '.csv', 'text/csv;charset=utf-8'); };
  }
  function pMonth(el) {
    var months = Object.keys(S.res.months).map(Number).sort(function (a, b) { return (a - 10 + 12) % 12 - (b - 10 + 12) % 12; });
    if (!months.length) { el.innerHTML = '<div class="empty">មិនទាន់មានពិន្ទុប្រចាំខែ ។ បង្កើតការប្រឡង (ប្រចាំខែ ឬតេស្តមេរៀន) ហើយបញ្ចូលពិន្ទុ ។</div>'; return; }
    var m = months.indexOf(S.month) >= 0 ? S.month : months[months.length - 1]; S.month = m;
    var b = S.res.months[m], subs = b.subjects.map(subj);
    var h = resultBar('<label class="fld" style="margin:0;min-width:180px"><select id="r-m">' + opt(months.map(function (x) { return [x, 'ខែ' + MONTHS[x]]; }), m) + '</select></label>') + statsHtml(b.by);
    var maxT = subs.reduce(function (s, x) { return s + x.max; }, 0), coefT = subs.reduce(function (s, x) { return s + (+x.coef || 0); }, 0);
    h += '<div class="tbl-wrap"><table class="gb" id="r-tab"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th><th>ភេទ</th>' + subs.map(function (s) { return '<th>' + esc(s.name) + '<br><small>/' + kh(s.max) + '</small></th>'; }).join('') +
      '<th>ពិន្ទុសរុប<br><small>/' + kh(maxT) + '</small></th><th>មធ្យមភាគ<br><small>÷' + fmt(coefT) + '</small></th><th>ចំណាត់ថ្នាក់</th><th>និទ្ទេស</th></tr></thead><tbody>' +
      sortedStudents(b.by).map(function (st, i) {
        var r = b.by[st.id];
        return '<tr><td>' + kh(st.no || i + 1) + '</td><td class="l">' + esc(st.name) + '</td><td>' + esc(st.sex || '') + '</td>' + subs.map(function (s) { return '<td>' + fmt(r.subj[s.id]) + '</td>'; }).join('') +
          '<td>' + fmt(r.total) + '</td><td class="avg">' + fmt(r.avg) + '</td><td>' + (r.rank ? kh(r.rank) : '—') + '</td><td>' + gradeCell(r) + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="muted">មធ្យមភាគប្រចាំខែ = ពិន្ទុសរុប ÷ មេគុណសរុប ។ ' + (S.res.settings.lessonWeight > 0 ? 'តេស្តមេរៀនរាប់ ' + kh(Math.round(S.res.settings.lessonWeight * 100)) + '% នៃពិន្ទុមុខវិជ្ជា ។' : 'បើគ្មានការប្រឡងប្រចាំខែទេ ពិន្ទុមុខវិជ្ជាយកមធ្យមនៃតេស្តមេរៀន ។') + '</p>';
    el.innerHTML = h;
    $('r-m').onchange = function () { S.month = +this.value; render(); };
    wireResult('លទ្ធផលប្រចាំខែ' + MONTHS[m], 'r-tab', function () {
      return [['ល.រ', 'ឈ្មោះ', 'ភេទ'].concat(subs.map(function (s) { return s.name + ' /' + s.max; }), ['ពិន្ទុសរុប', 'មធ្យមភាគ', 'ចំណាត់ថ្នាក់', 'និទ្ទេស'])].concat(sortedStudents(b.by).map(function (st) {
        var r = b.by[st.id]; return [st.no, st.name, st.sex].concat(subs.map(function (s) { return num(r.subj[s.id]); }), [num(r.total), num(r.avg), r.rank || '', r.letter.g]);
      }));
    });
  }
  function pSem(el) {
    var sems = [1, 2].filter(function (s) { return S.res.sem[s]; });
    if (!sems.length) { el.innerHTML = '<div class="empty">មិនទាន់មានពិន្ទុក្នុងឆមាសណាមួយ ។ សូមពិនិត្យខែនៃឆមាសនៅ «ការកំណត់» ។</div>'; return; }
    var s = sems.indexOf(S.sem) >= 0 ? S.sem : sems[sems.length - 1]; S.sem = s;
    var b = S.res.sem[s], per = !!S.semPer;
    var h = resultBar('<span class="seg" id="r-s">' + sems.map(function (x) { return '<button type="button" data-s="' + x + '" class="' + (x === s ? 'on' : '') + '">ឆមាសទី ' + kh(x) + '</button>'; }).join('') + '</span>' +
      '<span class="seg" id="r-per"><button type="button" data-p="0" class="' + (per ? '' : 'on') + '">សរុប</button><button type="button" data-p="1" class="' + (per ? 'on' : '') + '">តាមមុខវិជ្ជា</button></span>') + statsHtml(b.by);
    var subs = S.cls.subjects, rows;
    if (!per) {
      h += '<div class="tbl-wrap"><table class="gb" id="r-tab"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th>' + b.months.map(function (m) { return '<th>ខែ' + MONTHS[m] + '</th>'; }).join('') +
        '<th>មធ្យមភាគ<br>ប្រចាំខែ</th><th>ប្រឡង<br>ឆមាស</th><th>មធ្យមភាគ<br>ឆមាស</th><th>ចំណាត់ថ្នាក់</th><th>និទ្ទេស</th></tr></thead><tbody>' +
        sortedStudents(b.by).map(function (st, i) {
          var r = b.by[st.id];
          return '<tr><td>' + kh(st.no || i + 1) + '</td><td class="l">' + esc(st.name) + '</td>' + b.months.map(function (m) { return '<td>' + fmt(r.monthAvgs[m]) + '</td>'; }).join('') +
            '<td>' + fmt(r.mAvg) + '</td><td>' + fmt(r.exam) + '</td><td class="avg">' + fmt(r.avg) + '</td><td>' + (r.rank ? kh(r.rank) : '—') + '</td><td>' + gradeCell(r) + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="muted">មធ្យមភាគឆមាស = (មធ្យមភាគនៃមធ្យមភាគប្រចាំខែ + មធ្យមភាគប្រឡងឆមាស) ÷ ២</p>';
      rows = function () {
        return [['ល.រ', 'ឈ្មោះ'].concat(b.months.map(function (m) { return 'ខែ' + MONTHS[m]; }), ['មធ្យមភាគប្រចាំខែ', 'ប្រឡងឆមាស', 'មធ្យមភាគឆមាស', 'ចំណាត់ថ្នាក់', 'និទ្ទេស'])].concat(sortedStudents(b.by).map(function (st) {
          var r = b.by[st.id]; return [st.no, st.name].concat(b.months.map(function (m) { return num(r.monthAvgs[m]); }), [num(r.mAvg), num(r.exam), num(r.avg), r.rank || '', r.letter.g]);
        }));
      };
    } else {
      h += '<div class="tbl-wrap"><table class="gb" id="r-tab"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th>' + subs.map(function (x) { return '<th>' + esc(x.name) + '<br><small>/' + kh(x.max) + '</small></th>'; }).join('') + '<th>មធ្យមភាគ</th><th>ចំណាត់ថ្នាក់</th></tr></thead><tbody>' +
        sortedStudents(b.by).map(function (st, i) {
          var r = b.by[st.id];
          return '<tr><td>' + kh(st.no || i + 1) + '</td><td class="l">' + esc(st.name) + '</td>' + subs.map(function (x) { return '<td>' + fmt(r.subj[x.id]) + '</td>'; }).join('') + '<td class="avg">' + fmt(r.avg) + '</td><td>' + (r.rank ? kh(r.rank) : '—') + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="muted">ពិន្ទុមុខវិជ្ជាប្រចាំឆមាស = (មធ្យមនៃពិន្ទុប្រចាំខែ + ពិន្ទុប្រឡងឆមាស) ÷ ២ (តាមពិន្ទុពេញនៃមុខវិជ្ជា)</p>';
      rows = function () {
        return [['ល.រ', 'ឈ្មោះ'].concat(subs.map(function (x) { return x.name; }), ['មធ្យមភាគ', 'ចំណាត់ថ្នាក់'])].concat(sortedStudents(b.by).map(function (st) {
          var r = b.by[st.id]; return [st.no, st.name].concat(subs.map(function (x) { return num(r.subj[x.id]); }), [num(r.avg), r.rank || '']);
        }));
      };
    }
    el.innerHTML = h;
    $('r-s').onclick = function (e) { var x = e.target.closest('button'); if (x) { S.sem = +x.dataset.s; render(); } };
    $('r-per').onclick = function (e) { var x = e.target.closest('button'); if (x) { S.semPer = x.dataset.p === '1'; render(); } };
    wireResult('លទ្ធផលឆមាសទី' + kh(s), 'r-tab', rows);
  }
  function pYear(el) {
    var y = S.res.year, subs = S.cls.subjects, per = !!S.yearPer;
    if (!S.res.sem[1] && !S.res.sem[2]) { el.innerHTML = '<div class="empty">មិនទាន់មានលទ្ធផលឆមាស ។</div>'; return; }
    var h = resultBar('<span class="seg" id="r-per"><button type="button" data-p="0" class="' + (per ? '' : 'on') + '">សរុប</button><button type="button" data-p="1" class="' + (per ? 'on' : '') + '">តាមមុខវិជ្ជា</button></span><button class="btn btn-primary btn-xs" id="r-cards">បោះពុម្ពព្រឹត្តិបត្រពិន្ទុ</button>') + statsHtml(y.by);
    var rows;
    if (!per) {
      h += '<div class="tbl-wrap"><table class="gb" id="r-tab"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th><th>ភេទ</th><th>ឆមាសទី ១</th><th>ឆមាសទី ២</th><th>មធ្យមភាគប្រចាំឆ្នាំ</th><th>ចំណាត់ថ្នាក់</th><th>និទ្ទេស</th><th>លទ្ធផល</th></tr></thead><tbody>' +
        sortedStudents(y.by).map(function (st, i) {
          var r = y.by[st.id];
          return '<tr><td>' + kh(st.no || i + 1) + '</td><td class="l">' + esc(st.name) + '</td><td>' + esc(st.sex || '') + '</td><td>' + fmt(r.s1) + '</td><td>' + fmt(r.s2) + '</td><td class="avg">' + fmt(r.avg) + '</td><td>' + (r.rank ? kh(r.rank) : '—') + '</td><td>' + gradeCell(r) + '</td>' +
            '<td>' + (r.pass == null ? '—' : r.pass ? '<span class="g-A">ជាប់</span>' : '<span class="g-F">ធ្លាក់</span>') + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="muted">មធ្យមភាគប្រចាំឆ្នាំ = (ឆមាសទី ១ + ឆមាសទី ២) ÷ ២</p>';
      rows = function () {
        return [['ល.រ', 'ឈ្មោះ', 'ភេទ', 'ឆមាសទី១', 'ឆមាសទី២', 'មធ្យមភាគប្រចាំឆ្នាំ', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'លទ្ធផល']].concat(sortedStudents(y.by).map(function (st) {
          var r = y.by[st.id]; return [st.no, st.name, st.sex, num(r.s1), num(r.s2), num(r.avg), r.rank || '', r.letter.g, r.pass == null ? '' : r.pass ? 'ជាប់' : 'ធ្លាក់'];
        }));
      };
    } else {
      h += '<div class="tbl-wrap"><table class="gb" id="r-tab"><thead><tr><th>ល.រ</th><th class="l">ឈ្មោះ</th>' + subs.map(function (x) { return '<th>' + esc(x.name) + '<br><small>/' + kh(x.max) + '</small></th>'; }).join('') + '<th>មធ្យមភាគ</th></tr></thead><tbody>' +
        sortedStudents(y.by).map(function (st, i) {
          var r = y.by[st.id];
          return '<tr><td>' + kh(st.no || i + 1) + '</td><td class="l">' + esc(st.name) + '</td>' + subs.map(function (x) { return '<td>' + fmt(r.subj[x.id]) + '</td>'; }).join('') + '<td class="avg">' + fmt(r.avg) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      rows = function () {
        return [['ល.រ', 'ឈ្មោះ'].concat(subs.map(function (x) { return x.name; }), ['មធ្យមភាគ'])].concat(sortedStudents(y.by).map(function (st) {
          var r = y.by[st.id]; return [st.no, st.name].concat(subs.map(function (x) { return num(r.subj[x.id]); }), [num(r.avg)]);
        }));
      };
    }
    el.innerHTML = h;
    $('r-per').onclick = function (e) { var x = e.target.closest('button'); if (x) { S.yearPer = x.dataset.p === '1'; render(); } };
    $('r-cards').onclick = reportCards;
    wireResult('លទ្ធផលប្រចាំឆ្នាំ', 'r-tab', rows);
  }
  function reportCards() {
    var res = S.res, subs = S.cls.subjects, n = S.students.length;
    var h = S.students.map(function (st) {
      var y = res.year.by[st.id], a = res.sem[1] && res.sem[1].by[st.id], b = res.sem[2] && res.sem[2].by[st.id];
      var t = '<div class="report-card pb">' + headBlock('ព្រឹត្តិបត្រពិន្ទុប្រចាំឆ្នាំ', '') +
        '<p style="margin:8px 0">ឈ្មោះសិស្ស ៖ <b>' + esc(st.name) + '</b> &nbsp; ភេទ ៖ ' + esc(st.sex || '—') + ' &nbsp; លេខរៀង ៖ ' + kh(st.no || '') + '</p>' +
        '<table><tr><th class="l">មុខវិជ្ជា</th><th>ពិន្ទុពេញ</th><th>ឆមាសទី ១</th><th>ឆមាសទី ២</th><th>ប្រចាំឆ្នាំ</th></tr>' +
        subs.map(function (x) { return '<tr><td class="l">' + esc(x.name) + '</td><td>' + kh(x.max) + '</td><td>' + fmt(a && a.subj[x.id]) + '</td><td>' + fmt(b && b.subj[x.id]) + '</td><td>' + fmt(y.subj[x.id]) + '</td></tr>'; }).join('') +
        '<tr><th class="l">មធ្យមភាគ</th><td></td><th>' + fmt(a && a.avg) + '</th><th>' + fmt(b && b.avg) + '</th><th>' + fmt(y.avg) + '</th></tr>' +
        '<tr><th class="l">ចំណាត់ថ្នាក់</th><td></td><td>' + (a && a.rank ? kh(a.rank) + '/' + kh(n) : '—') + '</td><td>' + (b && b.rank ? kh(b.rank) + '/' + kh(n) : '—') + '</td><td>' + (y.rank ? kh(y.rank) + '/' + kh(n) : '—') + '</td></tr>' +
        '<tr><th class="l">និទ្ទេស</th><td></td><td>' + ((a && a.letter.g) || '—') + '</td><td>' + ((b && b.letter.g) || '—') + '</td><td>' + (y.letter.g ? y.letter.g + ' (' + y.letter.t + ')' : '—') + '</td></tr></table>' +
        '<p>លទ្ធផល ៖ <b>' + (y.pass == null ? '—' : y.pass ? 'ជាប់' : 'ធ្លាក់') + '</b></p>' +
        '<div class="sign-row"><div>បានឃើញ<br>នាយកសាលា<br><br><br>.....................</div><div>ថ្ងៃទី.....ខែ.....ឆ្នាំ.......<br>គ្រូប្រចាំថ្នាក់<br><br><br>' + esc(S.cls.teacher || '.....................') + '</div></div></div>';
      return t;
    }).join('');
    printHtml(h);
  }

  /* ============================================================ settings */
  function pSettings(el) {
    var c = S.cls, st = KP.settingsOf(c);
    var monthChecks = function (s) {
      return MONTHS.map(function (m, i) { return '<label class="chk" style="display:inline-flex;margin-right:10px"><input type="checkbox" data-sm="' + s + '" value="' + i + '"' + (st.semMonths[s].indexOf(i) >= 0 ? ' checked' : '') + '> ' + m + '</label>'; }).join('');
    };
    var h = '<div class="card-p"><h3>ព័ត៌មានថ្នាក់</h3><div class="row3">' +
      '<label class="fld"><span>ឈ្មោះថ្នាក់</span><input id="c-name" value="' + esc(c.name) + '"></label>' +
      '<label class="fld"><span>កម្រិតថ្នាក់</span><select id="c-grade">' + opt([7, 8, 9, 10, 11, 12].map(function (g) { return [g, 'ថ្នាក់ទី ' + kh(g)]; }), c.grade) + '</select></label>' +
      '<label class="fld"><span>ឆ្នាំសិក្សា</span><input id="c-year" value="' + esc(c.year || '') + '"></label>' +
      '<label class="fld"><span>មន្ទីរ / ការិយាល័យអប់រំ</span><input id="c-office" value="' + esc(c.office || '') + '"></label>' +
      '<label class="fld"><span>សាលារៀន</span><input id="c-school" value="' + esc(c.school || '') + '"></label>' +
      '<label class="fld"><span>គ្រូប្រចាំថ្នាក់</span><input id="c-teacher" value="' + esc(c.teacher || '') + '"></label></div></div>';
    h += '<div class="card-p"><h3>មុខវិជ្ជា ពិន្ទុពេញ និងមេគុណ</h3><p class="muted">មធ្យមភាគ = ពិន្ទុសរុប ÷ មេគុណសរុប ។ ជាទូទៅ មេគុណ = ពិន្ទុពេញ ÷ ៥០ (ឧ. ពិន្ទុពេញ ១០០ → មេគុណ ២) ដូច្នេះមធ្យមភាគគិតលើ ៥០ ។</p>' +
      '<div class="tbl-wrap"><table class="gb" id="c-subs"><thead><tr><th class="l">មុខវិជ្ជា</th><th>ពិន្ទុពេញ</th><th>មេគុណ</th><th></th></tr></thead><tbody>' +
      c.subjects.map(function (s) { return subRow(s); }).join('') + '</tbody></table></div>' +
      '<div class="btns"><button class="btn btn-ghost btn-xs" id="c-addsub">+ មុខវិជ្ជា</button><button class="btn btn-ghost btn-xs" id="c-preset">ដាក់មុខវិជ្ជាទាំងអស់តាមក្រសួង</button></div></div>';
    h += '<div class="card-p"><h3>ខែនៃឆមាស</h3><p><b>ឆមាសទី ១ ៖</b><br>' + monthChecks(1) + '</p><label class="fld" style="max-width:260px"><span>ខែប្រឡងឆមាសទី ១</span><select id="c-ex1">' + opt(MONTHS.map(function (m, i) { return [i, m]; }), st.semExamMonth[1]) + '</select></label>' +
      '<p><b>ឆមាសទី ២ ៖</b><br>' + monthChecks(2) + '</p><label class="fld" style="max-width:260px"><span>ខែប្រឡងឆមាសទី ២</span><select id="c-ex2">' + opt(MONTHS.map(function (m, i) { return [i, m]; }), st.semExamMonth[2]) + '</select></label></div>';
    h += '<div class="card-p"><h3>វិធីគណនា</h3><div class="row3">' +
      '<label class="fld"><span>ទម្ងន់តេស្តមេរៀនក្នុងពិន្ទុខែ (%)</span><input id="c-lw" type="number" min="0" max="100" value="' + Math.round(st.lessonWeight * 100) + '"></label>' +
      '<label class="fld"><span>ពិន្ទុជាប់ (% នៃពិន្ទុពេញ)</span><input id="c-pass" type="number" min="0" max="100" value="' + st.pass + '"></label>' +
      '<label class="fld"><span>សិស្សអវត្តមាន</span><select id="c-abs">' + opt([['1', 'គិតពិន្ទុ ០'], ['0', 'មិនគិតបញ្ចូល']], st.absentZero ? '1' : '0') + '</select></label></div>' +
      '<p class="muted">០% = ពិន្ទុខែយកតែការប្រឡងប្រចាំខែ (បើគ្មាន ទើបយកតេស្តមេរៀន) ។ ឧ. ៣០% = ៧០% ប្រឡងខែ + ៣០% មធ្យមតេស្តមេរៀន ។</p>' +
      '<b>និទ្ទេស (% នៃពិន្ទុពេញ)</b><div class="row3" id="c-th">' + st.thresholds.map(function (t, i) {
        return '<label class="fld"><span>' + esc(t.g) + ' — ' + esc(t.t) + '</span><input type="number" min="0" max="100" data-th="' + i + '" value="' + t.min + '"></label>';
      }).join('') + '</div></div>';
    h += '<div class="card-p"><h3>រក្សាទុក និងបម្រុងទុក</h3><div class="btns"><button class="btn btn-primary btn-sm" id="c-save">រក្សាទុកការកំណត់</button>' +
      '<button class="btn btn-ghost btn-sm" id="c-backup">ទាញយកឯកសារបម្រុងទុក (.json)</button><label class="btn btn-ghost btn-sm" style="cursor:pointer">នាំចូលឯកសារបម្រុងទុក<input type="file" id="c-import" accept=".json" hidden></label>' +
      '<button class="btn btn-danger btn-sm" id="c-del">លុបថ្នាក់នេះ</button></div></div>';
    el.innerHTML = h;
    function subRow(s) { return '<tr data-id="' + esc(s.id) + '"><td class="l"><input class="sc" style="width:220px;text-align:left" data-k="name" value="' + esc(s.name) + '"></td><td><input class="sc" type="number" min="1" data-k="max" value="' + s.max + '"></td><td><input class="sc" type="number" min="0" step="0.5" data-k="coef" value="' + s.coef + '"></td><td><button class="btn btn-danger btn-xs" data-rm>លុប</button></td></tr>'; }
    var tb = el.querySelector('#c-subs tbody');
    tb.addEventListener('input', function (e) { if (e.target.dataset.k === 'max') { var tr = e.target.closest('tr'); tr.querySelector('[data-k=coef]').value = R(+e.target.value / 50, 2); } });
    tb.addEventListener('click', function (e) { if (e.target.closest('[data-rm]')) e.target.closest('tr').remove(); });
    $('c-addsub').onclick = function () { tb.insertAdjacentHTML('beforeend', subRow({ id: 's' + Date.now().toString(36), name: '', max: 50, coef: 1 })); };
    $('c-preset').onclick = function () {
      var have = Array.prototype.map.call(tb.querySelectorAll('[data-k=name]'), function (i) { return i.value.trim(); });
      KP.SUBJECT_PRESETS.forEach(function (p, i) { if (have.indexOf(p[0]) < 0) tb.insertAdjacentHTML('beforeend', subRow({ id: 's' + Date.now().toString(36) + i, name: p[0], max: p[1], coef: p[1] / 50 })); });
    };
    $('c-save').onclick = function () {
      var subs = Array.prototype.map.call(tb.querySelectorAll('tr'), function (tr) {
        return { id: tr.dataset.id, name: tr.querySelector('[data-k=name]').value.trim(), max: +tr.querySelector('[data-k=max]').value || 50, coef: +tr.querySelector('[data-k=coef]').value || 0 };
      }).filter(function (s) { return s.name; });
      if (!subs.length) { toast('ត្រូវមានមុខវិជ្ជាយ៉ាងហោចណាស់មួយ'); return; }
      var sm = { 1: [], 2: [] };
      Array.prototype.forEach.call(el.querySelectorAll('[data-sm]'), function (c) { if (c.checked) sm[c.dataset.sm].push(+c.value); });
      var th = st.thresholds.map(function (t, i) { return { g: t.g, t: t.t, min: +el.querySelector('[data-th="' + i + '"]').value }; });
      Object.assign(c, { name: $('c-name').value.trim() || c.name, grade: +$('c-grade').value, year: $('c-year').value.trim(), office: $('c-office').value.trim(), school: $('c-school').value.trim(), teacher: $('c-teacher').value.trim(), subjects: subs });
      c.settings = Object.assign({}, st, { semMonths: sm, semExamMonth: { 1: +$('c-ex1').value, 2: +$('c-ex2').value }, lessonWeight: Math.max(0, Math.min(100, +$('c-lw').value || 0)) / 100,
        pass: +$('c-pass').value || 50, absentZero: $('c-abs').value === '1', thresholds: th });
      store.saveClass(c).then(function () { toast('បានរក្សាទុកការកំណត់'); loadClasses(c.id); }, fail);
    };
    $('c-backup').onclick = function () {
      store.exportAll().then(function (d) { download(JSON.stringify(d), 'KP-classroom-backup-' + new Date().toISOString().slice(0, 10) + '.json', 'application/json'); }, fail);
    };
    $('c-import').onchange = function () {
      var f = this.files[0]; if (!f) return;
      f.text().then(function (t) {
        var d = JSON.parse(t); if (!d.classes) throw new Error('ឯកសារមិនត្រឹមត្រូវ');
        if (!confirm('នាំចូលថ្នាក់ ' + Object.keys(d.classes).length + ' ពីឯកសារបម្រុងទុក? (ទិន្នន័យដែលមានស្រាប់ នឹងបញ្ចូលគ្នា)')) return;
        return store.importAll(d, true).then(function () { toast('បាននាំចូលរួចរាល់'); loadClasses(); });
      }).catch(fail);
    };
    $('c-del').onclick = function () {
      var n = prompt('ដើម្បីលុបថ្នាក់ «' + c.name + '» និងពិន្ទុទាំងអស់ សូមវាយកូដថ្នាក់ ' + c.id);
      if (n && n.trim().toUpperCase() === c.id) store.deleteClass(c.id).then(function () { S.cls = null; toast('បានលុបថ្នាក់'); loadClasses(); }, fail);
    };
  }

  KP.teacherLock(boot);
})();
