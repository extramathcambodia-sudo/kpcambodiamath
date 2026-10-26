/* KPCambodianmathematics — student portal (student.html) */
(function () {
  'use strict';
  var KP = window.KP, kh = KP.kh, esc = KP.esc;
  var $ = function (id) { return document.getElementById(id); };
  var store = KP.store(), SK = 'kp-student-session';
  var S = { cid: null, cls: null, students: [], me: null, pin: null, timer: null };
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function fail(e) { console.error(e); toast((e && e.message) || 'មានបញ្ហា'); }
  function step(id) { ['s-code', 's-login', 's-home', 's-exam'].forEach(function (x) { $(x).hidden = x !== id; }); window.scrollTo(0, 0); }

  function join(code) {
    code = (code || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!code) return;
    $('c-msg').textContent = 'កំពុងស្វែងរក…';
    store.joinClass(code).then(function (r) {
      if (!r) { $('c-msg').textContent = 'រកមិនឃើញថ្នាក់ដែលមានកូដ ' + code + ' ទេ ។'; return; }
      S.cid = code; S.cls = r.cls; S.students = r.students; $('c-msg').textContent = '';
      $('l-class').textContent = r.cls.name + ' · ថ្នាក់ទី ' + kh(r.cls.grade) + (r.cls.school ? ' · ' + r.cls.school : '');
      $('l-name').innerHTML = '<option value="">— ជ្រើសរើសឈ្មោះរបស់អ្នក —</option>' + r.students.map(function (s) { return '<option value="' + s.id + '">' + kh(s.no || '') + '. ' + esc(s.name) + '</option>'; }).join('');
      step('s-login');
    }, function (e) { $('c-msg').textContent = e.message; });
  }
  $('c-go').onclick = function (e) { e.preventDefault(); join($('c-code').value); };
  $('l-back').onclick = function () { step('s-code'); };
  $('l-go').onclick = function (e) {
    e.preventDefault();
    var sid = $('l-name').value, pin = $('l-pin').value.trim();
    if (!sid || !pin) { $('l-msg').textContent = 'សូមជ្រើសរើសឈ្មោះ និងបញ្ចូលលេខ PIN'; return; }
    store.studentLogin(S.cid, sid, pin).then(function (ok) {
      if (!ok) { $('l-msg').textContent = 'លេខ PIN មិនត្រឹមត្រូវ ។ សូមសួរលោកគ្រូ អ្នកគ្រូ ។'; return; }
      S.me = S.students.filter(function (s) { return s.id === sid; })[0]; S.pin = pin; $('l-msg').textContent = '';
      try { sessionStorage.setItem(SK, JSON.stringify({ cid: S.cid, sid: sid, pin: pin })); } catch (x) {}
      home();
    }, fail);
  };
  $('h-out').onclick = function () { try { sessionStorage.removeItem(SK); } catch (x) {} S.me = null; step('s-code'); };

  function home() {
    $('h-who').textContent = S.me.name + ' · ' + S.cls.name;
    step('s-home');
    $('h-open').innerHTML = '<p class="muted">កំពុងផ្ទុក…</p>';
    Promise.all([store.studentAssessments(S.cid), store.studentScores(S.cid, S.me.id)]).then(function (r) {
      var as = r[0], mine = {}; r[1].forEach(function (s) { mine[s.aid] = s; });
      var subj = {}; (S.cls.subjects || []).forEach(function (s) { subj[s.id] = s.name; });
      var open = as.filter(function (a) { return a.open && a.paperId; });
      $('h-open').innerHTML = open.length ? open.map(function (a) {
        var done = mine[a.id] && mine[a.id].answers;
        return '<div class="sv-row"><div><b>' + esc(a.title) + '</b><br><small class="muted">' + esc(subj[a.subjectId] || '') + ' · ' + kh(a.duration || 60) + ' នាទី · ពិន្ទុពេញ ' + kh(a.max) + '</small></div>' +
          (done ? '<span class="pill-s on">បានប្រគល់</span>' : '<button class="btn btn-primary btn-sm" data-take="' + a.id + '">ចាប់ផ្ដើមប្រឡង</button>') + '</div>';
      }).join('') : '<p class="muted">ឥឡូវនេះ មិនមានការប្រឡងដែលកំពុងបើកទេ ។</p>';
      var rows = as.filter(function (a) { return mine[a.id]; }).sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
      $('h-scores').innerHTML = rows.length ? '<div class="tbl-wrap"><table class="gb"><thead><tr><th class="l">ការប្រឡង</th><th>មុខវិជ្ជា</th><th>ពិន្ទុ</th></tr></thead><tbody>' + rows.map(function (a) {
        var s = mine[a.id], v = s.score != null ? kh(KP.round(s.score, 2)) + ' / ' + kh(a.max) : (s.answers ? '<span class="pill-s warn">រង់ចាំកែ</span>' : '—');
        var part = s.mcq != null && a.paperId ? ' <small class="muted">(ពហុជ្រើសរើស ' + kh(s.mcq) + (s.written != null ? ' + សរសេរ ' + kh(s.written) : '') + ')</small>' : '';
        return '<tr><td class="l">' + esc(a.title) + '</td><td>' + esc(subj[a.subjectId] || '') + '</td><td>' + v + part + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '<p class="muted">មិនទាន់មានពិន្ទុ ។</p>';
      $('h-open').onclick = function (e) { var b = e.target.closest('[data-take]'); if (b) take(as.filter(function (a) { return a.id === b.dataset.take; })[0]); };
    }, fail);
  }

  function take(a) {
    store.getPaper(a.paperId, false).then(function (p) {
      if (!p) { toast('រកមិនឃើញវិញ្ញាសា'); return; }
      S.exam = { a: a, p: p, answers: p.mcq.map(function () { return null; }), end: Date.now() + (a.duration || p.meta.duration || 60) * 60000 };
      var draftKey = 'kp-ans-' + S.cid + '-' + a.id + '-' + S.me.id;
      try { var d = JSON.parse(localStorage.getItem(draftKey) || 'null'); if (d && d.answers && d.answers.length === p.mcq.length) { S.exam.answers = d.answers; S.exam.end = d.end; } } catch (x) {}
      S.exam.key = draftKey;
      $('e-title').textContent = a.title;
      var h = '<div class="kp-head" style="color:#222;background:#fff;padding:14px;border-radius:12px;margin-bottom:12px"><h1 class="kp-title">' + esc(a.title) + '</h1><div class="kp-info">ថ្នាក់ទី ' + kh(p.grade) + ' · ' + kh(p.mcq.length) + ' សំណួរពហុជ្រើសរើស' + (p.written.length ? ' · ' + kh(p.written.length) + ' លំហាត់សរសេរ' : '') + '</div></div>';
      h += p.mcq.map(function (q, i) {
        return '<div class="st-q ls-paper" style="padding:14px 16px"><b>' + kh(i + 1) + '.</b> ' + q.s + '<div class="st-opts">' + q.o.map(function (o, j) {
          return '<label><input type="radio" name="q' + i + '" value="' + j + '"' + (S.exam.answers[i] === j ? ' checked' : '') + '><span><b>' + KP.KLET[j] + '.</b> ' + o + '</span></label>';
        }).join('') + '</div></div>';
      }).join('');
      if (p.written.length) {
        h += '<div class="st-q ls-paper"><h3 style="margin-top:0">ផ្នែកលំហាត់សរសេរ</h3><p class="note-box">ធ្វើលំហាត់ខាងក្រោមលើក្រដាស ហើយប្រគល់ឱ្យលោកគ្រូ អ្នកគ្រូ ។ ពិន្ទុផ្នែកនេះ លោកគ្រូអ្នកគ្រូនឹងបញ្ចូលក្រោយ ។</p>' +
          p.written.map(function (w, i) { return '<div style="margin:10px 0"><b>លំហាត់ទី ' + kh(i + 1) + '</b> <small class="muted">(' + kh(w.pts) + ' ពិន្ទុ)</small>' + w.q + '</div>'; }).join('') + '</div>';
      }
      $('e-body').innerHTML = h; KP.typeset($('e-body'));
      step('s-exam'); tick(); clearInterval(S.timer); S.timer = setInterval(tick, 1000); count();
    }, fail);
  }
  function count() {
    var n = S.exam.answers.filter(function (x) { return x != null; }).length;
    $('e-count').textContent = 'បានឆ្លើយ ' + kh(n) + '/' + kh(S.exam.answers.length);
  }
  function tick() {
    var left = Math.max(0, Math.round((S.exam.end - Date.now()) / 1000));
    var t = $('e-timer'); t.textContent = '⏱ ' + kh(Math.floor(left / 60)) + ':' + kh(('0' + left % 60).slice(-2));
    t.classList.toggle('low', left < 120);
    if (left <= 0) { clearInterval(S.timer); toast('អស់ម៉ោង — កំពុងប្រគល់វិញ្ញាសា'); submit(true); }
  }
  $('e-body').addEventListener('change', function (e) {
    var m = /^q(\d+)$/.exec(e.target.name || ''); if (!m) return;
    S.exam.answers[+m[1]] = +e.target.value; count();
    try { localStorage.setItem(S.exam.key, JSON.stringify({ answers: S.exam.answers, end: S.exam.end })); } catch (x) {}
  });
  function submit(force) {
    var n = S.exam.answers.filter(function (x) { return x == null; }).length;
    if (!force && n && !confirm('នៅសល់ ' + n + ' សំណួរមិនទាន់ឆ្លើយ ។ ប្រគល់វិញ្ញាសាឥឡូវនេះ?')) return;
    clearInterval(S.timer);
    $('e-submit').disabled = true;
    store.submit(S.cid, { aid: S.exam.a.id, sid: S.me.id, answers: S.exam.answers }).then(function (rec) {
      try { localStorage.removeItem(S.exam.key); } catch (x) {}
      $('e-submit').disabled = false;
      var msg = rec.mcq != null ? 'ពិន្ទុពហុជ្រើសរើសរបស់អ្នក ៖ ' + kh(rec.mcq) + ' (ត្រូវ ' + kh(rec.right) + '/' + kh(S.exam.answers.length) + ')' : 'បានប្រគល់រួចរាល់ ។ ពិន្ទុនឹងបង្ហាញ ពេលលោកគ្រូអ្នកគ្រូបើកតារាងពិន្ទុ ។';
      alertBox(msg); home();
    }, function (e) { $('e-submit').disabled = false; fail(e); });
  }
  function alertBox(msg) { $('h-msg').innerHTML = '<p class="note-box ok">' + esc(msg) + '</p>'; }
  $('e-submit').onclick = function () { submit(false); };

  /* start */
  store.studentInit().then(function () {
    var q = new URLSearchParams(location.search).get('c'), sess = null;
    try { sess = JSON.parse(sessionStorage.getItem(SK) || 'null'); } catch (x) {}
    if (sess && (!q || q.toUpperCase() === sess.cid)) {
      return store.joinClass(sess.cid).then(function (r) {
        if (!r) { step('s-code'); return; }
        S.cid = sess.cid; S.cls = r.cls; S.students = r.students;
        S.me = r.students.filter(function (s) { return s.id === sess.sid; })[0]; S.pin = sess.pin;
        return store.studentLogin(S.cid, sess.sid, sess.pin).then(function (ok) { if (ok && S.me) home(); else step('s-code'); });
      });
    }
    step('s-code');
    if (q) { $('c-code').value = q; join(q); }
  }).catch(function (e) { step('s-code'); $('c-msg').textContent = e.message; });
})();
