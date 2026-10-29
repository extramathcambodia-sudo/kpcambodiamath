/* KPCambodianmathematics — data store for classes, students, assessments, scores and exam papers.
 * Two back-ends with the same promise API:
 *   local    : everything in localStorage (this browser only)
 *   firebase : Firebase Auth + Cloud Firestore (window.KP_FIREBASE set in kp-config.js)
 */
(function (G) {
  'use strict';
  var KP = G.KP = G.KP || {};
  var CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  function code(n) { var s = ''; for (var i = 0; i < (n || 6); i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]; return s; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  KP.newCode = code;
  /* paper without answers / solutions (what students may see) */
  KP.publicPaper = function (p) {
    var q = clone(p); delete q.used;
    q.mcq.forEach(function (m) { m.a = -1; m.e = ''; });
    q.written.forEach(function (w) { w.s = ''; });
    return q;
  };
  KP.paperKey = function (p) { return { a: p.mcq.map(function (m) { return m.a; }), pts: p.mcqPts }; };
  /* MCQ score from answers + key */
  KP.gradeAnswers = function (answers, key) {
    var right = 0; (key.a || []).forEach(function (a, i) { if (answers && answers[i] === a) right++; });
    return { right: right, n: (key.a || []).length, mcq: right * (key.pts || 1) };
  };

  /* ================================================================ local */
  var LKEY = 'kp-db-v1';
  function Local() { this.mode = 'local'; }
  Local.prototype._db = function () {
    var d; try { d = JSON.parse(localStorage.getItem(LKEY) || 'null'); } catch (e) { d = null; }
    d = d || {};
    ['classes', 'students', 'pins', 'assessments', 'scores', 'papers', 'keys', 'admin'].forEach(function (k) { d[k] = d[k] || {}; });
    return d;
  };
  Local.prototype._save = function (d) {
    try { localStorage.setItem(LKEY, JSON.stringify(d)); }
    catch (e) { throw new Error('ទំហំផ្ទុកក្នុងកម្មវិធីរុករកពេញហើយ ។ សូមទាញយកឯកសារបម្រុងទុក ហើយលុបវិញ្ញាសាចាស់ៗ ។'); }
  };
  Local.prototype._tx = function (fn) {
    var self = this;
    return new Promise(function (res, rej) {
      try { var d = self._db(), r = fn(d); self._save(d); res(clone(r)); } catch (e) { rej(e); }
    });
  };
  Local.prototype._get = function (fn) {
    var self = this;
    return new Promise(function (res) { res(clone(fn(self._db()))); });
  };
  Local.prototype.init = function () { return Promise.resolve(this); };
  Local.prototype.onAuth = function (cb) { cb({ uid: 'local', email: '', name: 'គ្រូ (ឧបករណ៍នេះ)', local: true }); };
  Local.prototype.signIn = Local.prototype.signUp = Local.prototype.signOut = function () { return Promise.resolve(); };
  Local.prototype.user = function () { return { uid: 'local', local: true }; };
  function vals(o) { return Object.keys(o || {}).map(function (k) { return o[k]; }); }
  Local.prototype.listClasses = function () { return this._get(function (d) { return vals(d.classes).sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); }); }); };
  Local.prototype.getClass = function (cid) { return this._get(function (d) { return d.classes[cid] || null; }); };
  Local.prototype.saveClass = function (c) {
    return this._tx(function (d) {
      if (!c.id) { do { c.id = code(6); } while (d.classes[c.id]); c.createdAt = Date.now(); c.owner = 'local'; }
      d.classes[c.id] = c; return c;
    });
  };
  Local.prototype.deleteClass = function (cid) {
    return this._tx(function (d) { ['classes', 'students', 'pins', 'assessments', 'scores'].forEach(function (k) { delete d[k][cid]; }); });
  };
  Local.prototype.listStudents = function (cid) { return this._get(function (d) { return vals(d.students[cid]).sort(function (a, b) { return (a.no || 0) - (b.no || 0); }); }); };
  Local.prototype.saveStudents = function (cid, list) {
    return this._tx(function (d) {
      d.students[cid] = d.students[cid] || {};
      list.forEach(function (s) { if (!s.id) s.id = uid(); d.students[cid][s.id] = s; });
      return list;
    });
  };
  Local.prototype.deleteStudent = function (cid, sid) {
    return this._tx(function (d) {
      if (d.students[cid]) delete d.students[cid][sid];
      if (d.pins[cid]) delete d.pins[cid][sid];
      var sc = d.scores[cid] || {}; Object.keys(sc).forEach(function (k) { if (sc[k].sid === sid) delete sc[k]; });
    });
  };
  Local.prototype.getPins = function (cid) { return this._get(function (d) { return d.pins[cid] || {}; }); };
  Local.prototype.setPins = function (cid, map) {
    return this._tx(function (d) { d.pins[cid] = d.pins[cid] || {}; Object.keys(map).forEach(function (k) { d.pins[cid][k] = map[k]; }); });
  };
  Local.prototype.listAssessments = function (cid) { return this._get(function (d) { return vals(d.assessments[cid]).sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); }); }); };
  Local.prototype.saveAssessment = function (cid, a) {
    return this._tx(function (d) { d.assessments[cid] = d.assessments[cid] || {}; if (!a.id) { a.id = uid(); a.createdAt = Date.now(); } d.assessments[cid][a.id] = a; return a; });
  };
  Local.prototype.deleteAssessment = function (cid, aid) {
    return this._tx(function (d) {
      if (d.assessments[cid]) delete d.assessments[cid][aid];
      var sc = d.scores[cid] || {}; Object.keys(sc).forEach(function (k) { if (sc[k].aid === aid) delete sc[k]; });
    });
  };
  Local.prototype.listScores = function (cid) { return this._get(function (d) { return vals(d.scores[cid]); }); };
  Local.prototype.saveScores = function (cid, list) {
    return this._tx(function (d) {
      d.scores[cid] = d.scores[cid] || {};
      list.forEach(function (s) {
        var k = s.aid + '_' + s.sid;
        if (s.score == null && s.mcq == null && s.written == null && !s.answers) delete d.scores[cid][k];
        else d.scores[cid][k] = Object.assign({}, d.scores[cid][k] || {}, s, { updatedAt: Date.now() });
      });
    });
  };
  Local.prototype.listPapers = function () {
    return this._get(function (d) { return vals(d.papers).map(function (p) { return { id: p.id, created: p.created, meta: p.meta, grade: p.grade, track: p.track, nMcq: p.mcq.length, nWritten: p.written.length, total: KP.total ? KP.total(p) : 0 }; }).sort(function (a, b) { return b.created - a.created; }); });
  };
  Local.prototype.savePaper = function (p) {
    return this._tx(function (d) { if (!p.id) p.id = uid(); d.papers[p.id] = p; d.keys[p.id] = KP.paperKey(p); return { id: p.id }; });
  };
  Local.prototype.getPaper = function (id, withKey) { return this._get(function (d) { var p = d.papers[id]; return p ? (withKey ? p : KP.publicPaper(p)) : null; }); };
  Local.prototype.getKey = function (id) { return this._get(function (d) { return d.keys[id] || null; }); };
  Local.prototype.deletePaper = function (id) { return this._tx(function (d) { delete d.papers[id]; delete d.keys[id]; }); };
  /* ---- admin password (local mode): keeps students away from the teacher pages on a shared computer */
  function hash(t) { var h = 2166136261; t = 'kp#' + t; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }
  KP.hashPw = hash;
  Local.prototype.adminInfo = function () { return this._get(function (d) { return { hasPw: !!(d.admin && d.admin.pw), name: (d.admin && d.admin.name) || '' }; }); };
  Local.prototype.checkAdmin = function (pw) { return this._get(function (d) { return !(d.admin && d.admin.pw) || d.admin.pw === hash(pw); }); };
  Local.prototype.setAdmin = function (pw, name) { return this._tx(function (d) { d.admin = d.admin || {}; d.admin.pw = pw ? hash(pw) : ''; if (name != null) d.admin.name = name; }); };
  Local.prototype.isAdmin = function () { return Promise.resolve(true); };
  Local.prototype.listAllClasses = function () { return this.listClasses(); };
  Local.prototype.exportAll = function () { return this._get(function (d) { return d; }); };
  Local.prototype.importAll = function (obj, merge) {
    return this._tx(function (d) {
      ['classes', 'students', 'pins', 'assessments', 'scores', 'papers', 'keys'].forEach(function (k) {
        if (!obj[k]) return;
        if (!merge) d[k] = obj[k];
        else Object.keys(obj[k]).forEach(function (x) {
          if (typeof obj[k][x] === 'object' && d[k][x] && k !== 'classes' && k !== 'papers' && k !== 'keys') Object.assign(d[k][x], obj[k][x]);
          else d[k][x] = obj[k][x];
        });
      });
    });
  };
  /* ---- student side (same browser) */
  Local.prototype.studentInit = function () { return Promise.resolve(); };
  Local.prototype.joinClass = function (cid) {
    var self = this;
    return this._get(function (d) {
      var c = d.classes[cid]; if (!c) return null;
      return { cls: { id: c.id, name: c.name, grade: c.grade, year: c.year, school: c.school, teacher: c.teacher, subjects: c.subjects },
        students: vals(d.students[cid]).map(function (s) { return { id: s.id, name: s.name, no: s.no }; }).sort(function (a, b) { return (a.no || 0) - (b.no || 0); }) };
    });
  };
  Local.prototype.studentLogin = function (cid, sid, pin) {
    return this._get(function (d) { return !!(d.pins[cid] && String(d.pins[cid][sid]) === String(pin)); });
  };
  Local.prototype.studentAssessments = function (cid) { return this.listAssessments(cid); };
  Local.prototype.studentScores = function (cid, sid) { return this._get(function (d) { return vals(d.scores[cid]).filter(function (s) { return s.sid === sid; }); }); };
  Local.prototype.submit = function (cid, sub) {
    return this._tx(function (d) {
      var a = (d.assessments[cid] || {})[sub.aid]; if (!a || !a.open) throw new Error('ការប្រឡងនេះបានបិទហើយ ។');
      d.scores[cid] = d.scores[cid] || {};
      var k = sub.aid + '_' + sub.sid, old = d.scores[cid][k];
      if (old && old.answers) throw new Error('អ្នកបានប្រគល់វិញ្ញាសានេះរួចហើយ ។');
      var key = a.paperId && d.keys[a.paperId], g = key ? KP.gradeAnswers(sub.answers, key) : null;
      var rec = Object.assign({}, old || {}, sub, { source: 'online', submittedAt: Date.now() });
      if (g) { rec.mcq = g.mcq; rec.right = g.right; rec.score = g.mcq + (+((old || {}).written) || 0); }
      d.scores[cid][k] = rec; return rec;
    });
  };

  /* ================================================================ firebase */
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  function load(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('មិនអាចភ្ជាប់ទៅ Firebase បានទេ (ពិនិត្យអ៊ីនធឺណិត)')); }; document.head.appendChild(s); }); }
  function Fire(cfg) { this.mode = 'firebase'; this.cfg = cfg; }
  Fire.prototype.init = function () {
    var self = this;
    if (this._init) return this._init;
    this._init = load(SDK + 'firebase-app-compat.js').then(function () {
      return Promise.all([load(SDK + 'firebase-auth-compat.js'), load(SDK + 'firebase-firestore-compat.js')]);
    }).then(function () {
      self.app = G.firebase.initializeApp(self.cfg);
      self.auth = G.firebase.auth(); self.db = G.firebase.firestore();
      return self;
    });
    return this._init;
  };
  Fire.prototype.onAuth = function (cb) {
    var self = this;
    this.init().then(function () {
      self.auth.onAuthStateChanged(function (u) {
        if (!u || u.isAnonymous) return cb(null);
        cb({ uid: u.uid, email: u.email, name: u.displayName || u.email });
      });
    }, function (e) { cb(null, e); });
  };
  Fire.prototype.user = function () { return this.auth && this.auth.currentUser; };
  Fire.prototype.signIn = function (email, pw) { var s = this; return this.init().then(function () { return s.auth.signInWithEmailAndPassword(email, pw); }); };
  Fire.prototype.signUp = function (email, pw, name) {
    var s = this;
    return this.init().then(function () { return s.auth.createUserWithEmailAndPassword(email, pw); }).then(function (c) {
      return c.user.updateProfile({ displayName: name || '' }).then(function () { return s.db.collection('teachers').doc(c.user.uid).set({ name: name || '', email: email, createdAt: Date.now() }); });
    });
  };
  Fire.prototype.resetPassword = function (email) { var s = this; return this.init().then(function () { return s.auth.sendPasswordResetEmail(email); }); };
  Fire.prototype.signOut = function () { return this.auth ? this.auth.signOut() : Promise.resolve(); };
  function docs(q) { return q.get().then(function (r) { return r.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); }); }
  Fire.prototype.C = function (cid) { return this.db.collection('classes').doc(cid); };
  /* admins: documents admins/{uid} created by hand in the Firebase console (see FIREBASE_SETUP.md) */
  Fire.prototype.isAdmin = function () {
    var u = this.user(); if (!u) return Promise.resolve(false);
    return this.db.collection('admins').doc(u.uid).get().then(function (d) { return d.exists; }, function () { return false; });
  };
  Fire.prototype.listAllClasses = function () {
    return docs(this.db.collection('classes')).then(function (l) { return l.sort(function (a, b) { return String(a.ownerName || '').localeCompare(String(b.ownerName || '')) || (b.createdAt || 0) - (a.createdAt || 0); }); });
  };
  Fire.prototype.listTeachers = function () { return docs(this.db.collection('teachers')); };
  Fire.prototype.adminInfo = function () { return Promise.resolve({ hasPw: false }); };
  Fire.prototype.checkAdmin = function () { return Promise.resolve(true); };
  Fire.prototype.listClasses = function () {
    return docs(this.db.collection('classes').where('owner', '==', this.user().uid)).then(function (l) { return l.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); }); });
  };
  Fire.prototype.getClass = function (cid) { return this.C(cid).get().then(function (d) { return d.exists ? Object.assign({ id: d.id }, d.data()) : null; }); };
  Fire.prototype.saveClass = function (c) {
    var self = this, data = clone(c);
    if (c.id) { delete data.id; return this.C(c.id).set(data).then(function () { return c; }); }
    function tryCode(n) {
      var id = code(6), ref = self.C(id);
      return ref.get().then(function (d) {
        if (d.exists) { if (n > 5) throw new Error('code'); return tryCode(n + 1); }
        data.owner = self.user().uid; data.ownerName = self.user().displayName || self.user().email || ''; data.createdAt = Date.now();
        return ref.set(data).then(function () { c.id = id; c.owner = data.owner; c.createdAt = data.createdAt; return c; });
      }, function () { // permission-denied on an existing class of someone else
        if (n > 5) throw new Error('code'); return tryCode(n + 1);
      });
    }
    return tryCode(0);
  };
  Fire.prototype._delAll = function (col) {
    return col.get().then(function (r) {
      var b = col.firestore.batch(), n = 0, ps = [];
      r.docs.forEach(function (d) { b.delete(d.ref); n++; if (n % 450 === 0) { ps.push(b.commit()); b = col.firestore.batch(); } });
      ps.push(b.commit()); return Promise.all(ps);
    });
  };
  Fire.prototype.deleteClass = function (cid) {
    var self = this, C = this.C(cid);
    return Promise.all(['students', 'pins', 'assessments', 'scores', 'links'].map(function (k) { return self._delAll(C.collection(k)); })).then(function () { return C.delete(); });
  };
  Fire.prototype.listStudents = function (cid) { return docs(this.C(cid).collection('students')).then(function (l) { return l.sort(function (a, b) { return (a.no || 0) - (b.no || 0); }); }); };
  Fire.prototype._batchSet = function (col, list, keyFn, merge) {
    var b = this.db.batch(), ps = [], n = 0, self = this;
    list.forEach(function (x) {
      var id = keyFn(x), data = clone(x); delete data.id;
      b.set(col.doc(id), data, merge ? { merge: true } : undefined); n++;
      if (n % 450 === 0) { ps.push(b.commit()); b = self.db.batch(); }
    });
    ps.push(b.commit()); return Promise.all(ps);
  };
  Fire.prototype.saveStudents = function (cid, list) {
    var col = this.C(cid).collection('students');
    list.forEach(function (s) { if (!s.id) s.id = col.doc().id; });
    return this._batchSet(col, list, function (s) { return s.id; }).then(function () { return list; });
  };
  Fire.prototype.deleteStudent = function (cid, sid) {
    var C = this.C(cid), self = this;
    return Promise.all([C.collection('students').doc(sid).delete(), C.collection('pins').doc(sid).delete(),
      C.collection('scores').where('sid', '==', sid).get().then(function (r) { var b = self.db.batch(); r.docs.forEach(function (d) { b.delete(d.ref); }); return b.commit(); })]);
  };
  Fire.prototype.getPins = function (cid) { return docs(this.C(cid).collection('pins')).then(function (l) { var m = {}; l.forEach(function (p) { m[p.id] = p.pin; }); return m; }); };
  Fire.prototype.setPins = function (cid, map) {
    var list = Object.keys(map).map(function (k) { return { id: k, pin: String(map[k]) }; });
    return this._batchSet(this.C(cid).collection('pins'), list, function (x) { return x.id; });
  };
  Fire.prototype.listAssessments = function (cid) { return docs(this.C(cid).collection('assessments')).then(function (l) { return l.sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); }); }); };
  Fire.prototype.saveAssessment = function (cid, a) {
    var col = this.C(cid).collection('assessments');
    if (!a.id) { a.id = col.doc().id; a.createdAt = Date.now(); }
    var data = clone(a); delete data.id;
    return col.doc(a.id).set(data).then(function () { return a; });
  };
  Fire.prototype.deleteAssessment = function (cid, aid) {
    var C = this.C(cid), self = this;
    return C.collection('scores').where('aid', '==', aid).get().then(function (r) {
      var b = self.db.batch(); r.docs.forEach(function (d) { b.delete(d.ref); }); b.delete(C.collection('assessments').doc(aid)); return b.commit();
    });
  };
  Fire.prototype.listScores = function (cid) { return docs(this.C(cid).collection('scores')); };
  Fire.prototype.saveScores = function (cid, list) {
    var col = this.C(cid).collection('scores'), b = this.db.batch(), ps = [], n = 0, self = this;
    list.forEach(function (s) {
      var ref = col.doc(s.aid + '_' + s.sid);
      if (s.score == null && s.mcq == null && s.written == null && !s.answers) b.delete(ref);
      else { var d = clone(s); d.updatedAt = Date.now(); delete d.id; b.set(ref, d, { merge: true }); }
      n++; if (n % 450 === 0) { ps.push(b.commit()); b = self.db.batch(); }
    });
    ps.push(b.commit()); return Promise.all(ps);
  };
  Fire.prototype.listPapers = function () {
    return docs(this.db.collection('papers').where('owner', '==', this.user().uid)).then(function (l) {
      return l.map(function (d) { var p = d.paper || {}; return { id: d.id, created: p.created, meta: p.meta, grade: p.grade, track: p.track, nMcq: (p.mcq || []).length, nWritten: (p.written || []).length, total: KP.total ? KP.total(p) : 0 }; }).sort(function (a, b) { return b.created - a.created; });
    });
  };
  Fire.prototype.savePaper = function (p) {
    var self = this, ref = p.id ? this.db.collection('papers').doc(p.id) : this.db.collection('papers').doc();
    p.id = ref.id;
    var uidv = this.user().uid, full = clone(p); delete full.used;
    return Promise.all([
      ref.set({ owner: uidv, paper: KP.publicPaper(p), updatedAt: Date.now() }),
      self.db.collection('keys').doc(p.id).set({ owner: uidv, key: KP.paperKey(p), full: full })
    ]).then(function () { return { id: p.id }; });
  };
  Fire.prototype.getPaper = function (id, withKey) {
    var self = this;
    if (withKey) return this.db.collection('keys').doc(id).get().then(function (d) { return d.exists ? d.data().full : null; });
    return this.db.collection('papers').doc(id).get().then(function (d) { return d.exists ? d.data().paper : null; });
  };
  Fire.prototype.getKey = function (id) { return this.db.collection('keys').doc(id).get().then(function (d) { return d.exists ? d.data().key : null; }); };
  Fire.prototype.deletePaper = function (id) { return Promise.all([this.db.collection('papers').doc(id).delete(), this.db.collection('keys').doc(id).delete()]); };
  Fire.prototype.exportAll = function () {
    var self = this, out = { classes: {}, students: {}, pins: {}, assessments: {}, scores: {}, papers: {}, keys: {} };
    return this.listClasses().then(function (cs) {
      return Promise.all(cs.map(function (c) {
        out.classes[c.id] = c;
        return Promise.all([self.listStudents(c.id), self.getPins(c.id), self.listAssessments(c.id), self.listScores(c.id)]).then(function (r) {
          out.students[c.id] = {}; r[0].forEach(function (s) { out.students[c.id][s.id] = s; });
          out.pins[c.id] = r[1];
          out.assessments[c.id] = {}; r[2].forEach(function (a) { out.assessments[c.id][a.id] = a; });
          out.scores[c.id] = {}; r[3].forEach(function (s) { out.scores[c.id][s.aid + '_' + s.sid] = s; });
        });
      }));
    }).then(function () { return out; });
  };
  Fire.prototype.importAll = function (obj) {
    var self = this;
    return Promise.all(Object.keys(obj.classes || {}).map(function (cid) {
      var c = clone(obj.classes[cid]); c.owner = self.user().uid; var data = clone(c); delete data.id;
      var C = self.C(cid);
      return C.set(data).then(function () {
        var st = Object.keys(obj.students[cid] || {}).map(function (k) { return Object.assign({ id: k }, obj.students[cid][k]); });
        var as = Object.keys(obj.assessments[cid] || {}).map(function (k) { return Object.assign({ id: k }, obj.assessments[cid][k]); });
        var sc = Object.keys(obj.scores[cid] || {}).map(function (k) { return obj.scores[cid][k]; });
        return Promise.all([self.saveStudents(cid, st), self.setPins(cid, obj.pins[cid] || {}),
          self._batchSet(C.collection('assessments'), as, function (a) { return a.id; }), self.saveScores(cid, sc)]);
      });
    })).then(function () {
      return Promise.all(Object.keys(obj.papers || {}).map(function (id) { return self.savePaper(obj.papers[id]); }));
    });
  };
  /* ---- student side: anonymous sign-in + class code + PIN */
  Fire.prototype.studentInit = function () {
    var s = this;
    return this.init().then(function () {
      if (s.auth.currentUser) return s.auth.currentUser;
      return s.auth.signInAnonymously().then(function (c) { return c.user; });
    });
  };
  Fire.prototype.joinClass = function (cid) {
    var s = this;
    return this.studentInit().then(function () {
      return Promise.all([s.C(cid).get(), docs(s.C(cid).collection('students'))]);
    }).then(function (r) {
      if (!r[0].exists) return null;
      var c = r[0].data();
      return { cls: { id: cid, name: c.name, grade: c.grade, year: c.year, school: c.school, teacher: c.teacher, subjects: c.subjects },
        students: r[1].map(function (x) { return { id: x.id, name: x.name, no: x.no }; }).sort(function (a, b) { return (a.no || 0) - (b.no || 0); }) };
    }).catch(function (e) { if (/permission|not-found/i.test(String(e && (e.code || e.message)))) return null; throw e; });
  };
  Fire.prototype.studentLogin = function (cid, sid, pin) {
    var s = this;
    return this.studentInit().then(function (u) {
      return s.C(cid).collection('links').doc(u.uid).set({ sid: sid, pin: String(pin), at: Date.now() });
    }).then(function () { return true; }, function (e) { if (/permission/i.test(String(e && (e.code || e.message)))) return false; throw e; });
  };
  Fire.prototype.studentAssessments = function (cid) { return docs(this.C(cid).collection('assessments')); };
  Fire.prototype.studentScores = function (cid, sid) { return docs(this.C(cid).collection('scores').where('sid', '==', sid)); };
  Fire.prototype.submit = function (cid, sub) {
    var rec = Object.assign({}, sub, { source: 'online', submittedAt: Date.now(), score: null });
    return this.C(cid).collection('scores').doc(sub.aid + '_' + sub.sid).set(rec).then(function () { return rec; }, function (e) {
      if (/permission/i.test(String(e && (e.code || e.message)))) throw new Error('មិនអាចប្រគល់បានទេ ៖ ការប្រឡងបានបិទ ឬអ្នកបានប្រគល់រួចហើយ ។');
      throw e;
    });
  };

  /* lock a teacher page behind the admin password (local mode only) */
  KP.teacherLock = function (onOpen) {
    var st = KP.store();
    if (st.mode !== 'local') return onOpen();
    var ok = false; try { ok = sessionStorage.getItem('kp-admin-ok') === '1'; } catch (e) {}
    st.adminInfo().then(function (a) {
      if (!a.hasPw || ok) return onOpen();
      var box = document.createElement('div');
      box.className = 'kp-lock';
      box.innerHTML = '<form class="card-p"><h2>🔒 ទំព័រសម្រាប់គ្រូ</h2><p class="muted">សូមវាយពាក្យសម្ងាត់ Admin ដើម្បីបន្ត ។</p>' +
        '<label class="fld"><span>ពាក្យសម្ងាត់</span><input type="password" autocomplete="current-password"></label><p class="muted kp-lock-msg"></p>' +
        '<div class="btns"><button class="btn btn-primary btn-sm">ចូល</button><a class="btn btn-ghost btn-sm" href="student.html">ទំព័រសិស្ស</a></div></form>';
      document.body.appendChild(box);
      var inp = box.querySelector('input'); inp.focus();
      box.querySelector('form').onsubmit = function (e) {
        e.preventDefault();
        st.checkAdmin(inp.value).then(function (good) {
          if (!good) { box.querySelector('.kp-lock-msg').textContent = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ'; inp.select(); return; }
          try { sessionStorage.setItem('kp-admin-ok', '1'); } catch (x) {}
          box.remove(); onOpen();
        });
      };
    });
  };

  KP.store = function () {
    if (KP._store) return KP._store;
    KP._store = G.KP_FIREBASE && G.KP_FIREBASE.apiKey ? new Fire(G.KP_FIREBASE) : new Local();
    return KP._store;
  };
})(window);
