/* KPCambodianmathematics — Admin page (admin.html)
 * Local mode : the admin password of this computer protects the teacher pages; overview of every class.
 * Firebase   : school admins (admins/{uid}) see every teacher and every class. */
(function () {
  'use strict';
  var KP = window.KP, kh = KP.kh, esc = KP.esc;
  var $ = function (id) { return document.getElementById(id); };
  var store = KP.store();
  function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function fail(e) { console.error(e); toast((e && e.message) || 'មានបញ្ហា'); }
  function show(id) { ['ad-setup', 'ad-login', 'ad-denied', 'ad-dash'].forEach(function (x) { $(x).hidden = x !== id; }); }

  /* ---------------------------------------------------------- local mode */
  function startLocal() {
    store.adminInfo().then(function (a) {
      var ok = false; try { ok = sessionStorage.getItem('kp-admin-ok') === '1'; } catch (e) {}
      if (!a.hasPw) { show('ad-setup'); return; }
      if (!ok) { show('ad-login'); $('al-email').closest('.fld').hidden = true; $('al-pw').focus(); return; }
      dashboard(a.name);
    });
  }
  $('as-ok').onclick = function (e) {
    e.preventDefault();
    var p1 = $('as-pw').value, p2 = $('as-pw2').value;
    if (p1.length < 4) { $('as-msg').textContent = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ តួ'; return; }
    if (p1 !== p2) { $('as-msg').textContent = 'ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នា'; return; }
    store.setAdmin(p1, $('as-name').value.trim()).then(function () {
      try { sessionStorage.setItem('kp-admin-ok', '1'); } catch (x) {}
      toast('បានបង្កើតគណនី Admin'); startLocal();
    }, fail);
  };
  $('al-ok').onclick = function (e) {
    e.preventDefault(); $('al-msg').textContent = '';
    if (store.mode === 'local') {
      store.checkAdmin($('al-pw').value).then(function (good) {
        if (!good) { $('al-msg').textContent = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ'; return; }
        try { sessionStorage.setItem('kp-admin-ok', '1'); } catch (x) {}
        startLocal();
      });
    } else {
      store.signIn($('al-email').value.trim(), $('al-pw').value).catch(function (er) { $('al-msg').textContent = 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ'; console.error(er); });
    }
  };

  /* ---------------------------------------------------------- dashboard */
  function dashboard(name) {
    show('ad-dash');
    $('ad-who').textContent = name ? 'Admin ៖ ' + name : 'Admin';
    var classesP = store.mode === 'local' ? store.listClasses() : store.listAllClasses();
    Promise.all([classesP, store.listPapers().catch(function () { return []; }),
      store.listTeachers ? store.listTeachers().catch(function () { return []; }) : Promise.resolve([])]).then(function (r) {
      var cls = r[0], papers = r[1], teachers = r[2];
      return Promise.all(cls.map(function (c) {
        return Promise.all([store.listStudents(c.id), store.listAssessments(c.id), store.listScores(c.id)]).then(function (x) {
          c._st = x[0].length; c._as = x[1].length; c._sc = x[2].length; c._open = x[1].filter(function (a) { return a.open; }).length;
          return c;
        }, function () { c._st = c._as = c._sc = c._open = 0; return c; });
      })).then(function (cls) { render(cls, papers, teachers); });
    }).catch(fail);
  }
  function render(cls, papers, teachers) {
    var st = cls.reduce(function (s, c) { return s + c._st; }, 0), as = cls.reduce(function (s, c) { return s + c._as; }, 0);
    var open = cls.reduce(function (s, c) { return s + c._open; }, 0);
    $('ad-stats').innerHTML = [[cls.length, 'ថ្នាក់'], [st, 'សិស្ស'], [as, 'ការប្រឡង'], [open, 'កំពុងបើកប្រឡងអនឡាញ'], [papers.length, 'វិញ្ញាសាបានរក្សាទុក']]
      .concat(store.mode === 'local' ? [] : [[teachers.length, 'គ្រូ']])
      .map(function (x) { return '<div class="stat"><b>' + kh(x[0]) + '</b><span>' + x[1] + '</span></div>'; }).join('');
    $('ad-classes').innerHTML = cls.length ? '<div class="tbl-wrap"><table class="gb"><thead><tr><th class="l">ថ្នាក់</th><th>កម្រិត</th><th>ឆ្នាំសិក្សា</th>' +
      (store.mode === 'local' ? '' : '<th class="l">គ្រូ</th>') + '<th>សិស្ស</th><th>ការប្រឡង</th><th>ពិន្ទុ</th><th>កូដ</th><th></th></tr></thead><tbody>' +
      cls.map(function (c) {
        return '<tr><td class="l"><b>' + esc(c.name) + '</b>' + (c.school ? '<br><small class="muted">' + esc(c.school) + '</small>' : '') + '</td><td>' + kh(c.grade) + '</td><td>' + esc(c.year || '') + '</td>' +
          (store.mode === 'local' ? '' : '<td class="l">' + esc(c.ownerName || c.teacher || '') + '</td>') +
          '<td>' + kh(c._st) + '</td><td>' + kh(c._as) + (c._open ? ' <span class="pill-s on">' + kh(c._open) + ' បើក</span>' : '') + '</td><td>' + kh(c._sc) + '</td><td><code>' + c.id + '</code></td>' +
          '<td><button class="btn btn-ghost btn-xs" data-open="' + c.id + '">បើក</button></td></tr>';
      }).join('') + '</tbody></table></div>' : '<div class="empty">មិនទាន់មានថ្នាក់ ។ <a href="classroom.html">បង្កើតថ្នាក់ថ្មី</a></div>';
    $('ad-teachers-box').hidden = store.mode === 'local';
    $('ad-teachers').innerHTML = teachers.map(function (t) { return '<div class="admin-row"><span>' + esc(t.name || '') + '</span><small>' + esc(t.email || '') + '</small></div>'; }).join('') || '<p class="muted">មិនទាន់មានគ្រូចុះឈ្មោះ ។</p>';
    $('ad-local-box').hidden = store.mode !== 'local';
  }
  $('ad-classes').onclick = function (e) {
    var b = e.target.closest('[data-open]'); if (!b) return;
    try { localStorage.setItem('kp-class-cur', b.dataset.open); } catch (x) {}
    location.href = 'classroom.html';
  };
  $('ad-lock').onclick = function () {
    try { sessionStorage.removeItem('kp-admin-ok'); } catch (e) {}
    if (store.mode === 'local') location.reload(); else store.signOut();
  };
  $('ad-chpw').onclick = function () {
    var p1 = prompt('ពាក្យសម្ងាត់ Admin ថ្មី (យ៉ាងតិច ៤ តួ)'); if (!p1) return;
    if (p1.length < 4) { toast('ពាក្យសម្ងាត់ខ្លីពេក'); return; }
    if (prompt('វាយពាក្យសម្ងាត់ថ្មីម្ដងទៀត') !== p1) { toast('ពាក្យសម្ងាត់មិនដូចគ្នា'); return; }
    store.adminInfo().then(function (a) { return store.setAdmin(p1, a.name); }).then(function () { toast('បានប្ដូរពាក្យសម្ងាត់'); }, fail);
  };
  $('ad-backup').onclick = function () {
    store.exportAll().then(function (d) { KP.download(new Blob([JSON.stringify(d)], { type: 'application/json' }), 'KP-backup-' + new Date().toISOString().slice(0, 10) + '.json'); }, fail);
  };
  $('ad-import').onchange = function () {
    var f = this.files[0]; if (!f) return;
    f.text().then(function (t) {
      var d = JSON.parse(t); if (!d.classes) throw new Error('ឯកសារមិនត្រឹមត្រូវ');
      if (!confirm('នាំចូលថ្នាក់ ' + Object.keys(d.classes).length + ' ពីឯកសារបម្រុងទុក?')) return;
      return store.importAll(d, true).then(function () { toast('បាននាំចូលរួចរាល់'); dashboard(); });
    }).catch(fail);
  };

  /* ---------------------------------------------------------- start */
  $('ad-mode').innerHTML = store.mode === 'firebase'
    ? '<span class="pill-s on">អនឡាញ · Firebase</span> Admin សាលាមើលឃើញគ្រូ និងថ្នាក់ទាំងអស់ ។'
    : '<span class="pill-s warn">Local</span> Admin គ្រប់គ្រងកុំព្យូទ័រនេះ ៖ ពាក្យសម្ងាត់ការពារទំព័រគ្រូ និងទិន្នន័យថ្នាក់ទាំងអស់ក្នុង browser នេះ ។';
  store.init().then(function () {
    if (store.mode === 'local') return startLocal();
    store.onAuth(function (u) {
      if (!u) { show('ad-login'); return; }
      store.isAdmin().then(function (a) { if (a) dashboard(u.name || u.email); else show('ad-denied'); });
    });
  }, fail);
})();
