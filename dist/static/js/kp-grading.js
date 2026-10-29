/* KPCambodianmathematics — gradebook arithmetic (Cambodian MoEYS style)
 *   subject score  : every result is converted to the subject's full score (max)
 *   monthly average: total of subject scores ÷ total of coefficients            (coef = max ÷ 50 by default)
 *   semester       : (average of the monthly averages + semester-exam average) ÷ 2
 *   year           : (semester 1 + semester 2) ÷ 2
 * Lesson / chapter tests can be blended into the monthly subject score with settings.lessonWeight (0–1).
 */
(function (G) {
  'use strict';
  var KP = G.KP = G.KP || {};
  KP.DEFAULT_SETTINGS = function () {
    return {
      semMonths: { 1: [10, 11, 0, 1], 2: [3, 4, 5, 6] },   // វិច្ឆិកា ធ្នូ មករា កុម្ភៈ | មេសា ឧសភា មិថុនា កក្កដា
      semExamMonth: { 1: 2, 2: 7 },                        // មីនា | សីហា
      lessonWeight: 0,
      absentZero: true,
      pass: 50,
      thresholds: [{ g: 'A', min: 90, t: 'ល្អប្រសើរ' }, { g: 'B', min: 80, t: 'ល្អណាស់' }, { g: 'C', min: 70, t: 'ល្អ' },
        { g: 'D', min: 60, t: 'ល្អបង្គួរ' }, { g: 'E', min: 50, t: 'មធ្យម' }, { g: 'F', min: 0, t: 'ខ្សោយ' }]
    };
  };
  KP.SUBJECT_PRESETS = [
    ['ភាសាខ្មែរ', 100], ['គណិតវិទ្យា', 100], ['រូបវិទ្យា', 50], ['គីមីវិទ្យា', 50], ['ជីវវិទ្យា', 50], ['ផែនដីវិទ្យា', 50],
    ['ប្រវត្តិវិទ្យា', 50], ['ភូមិវិទ្យា', 50], ['សីលធម៌-ពលរដ្ឋវិជ្ជា', 50], ['ភាសាអង់គ្លេស', 50], ['គេហវិទ្យា', 50], ['អប់រំកាយ និងកីឡា', 50]
  ];
  KP.TYPES = { lesson: 'តេស្តមេរៀន', chapter: 'តេស្តជំពូក', monthly: 'ប្រឡងប្រចាំខែ', semester: 'ប្រឡងឆមាស' };
  KP.settingsOf = function (cls) {
    var d = KP.DEFAULT_SETTINGS(), s = (cls && cls.settings) || {};
    Object.keys(s).forEach(function (k) { if (s[k] != null) d[k] = s[k]; });
    return d;
  };
  KP.semesterOfMonth = function (cls, m) {
    var s = KP.settingsOf(cls);
    if (s.semMonths[1].indexOf(m) >= 0 || s.semExamMonth[1] === m) return 1;
    if (s.semMonths[2].indexOf(m) >= 0 || s.semExamMonth[2] === m) return 2;
    return 0;
  };
  KP.letter = function (cls, pct) {
    if (pct == null) return { g: '', t: '' };
    var th = KP.settingsOf(cls).thresholds.slice().sort(function (a, b) { return b.min - a.min; });
    for (var i = 0; i < th.length; i++) if (pct >= th[i].min - 1e-9) return th[i];
    return th[th.length - 1];
  };
  function mean(a) { a = a.filter(function (x) { return x != null && !isNaN(x); }); return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }
  KP.mean = mean;
  function rank(map) { // {sid: value} -> {sid: rank}
    var ids = Object.keys(map).filter(function (k) { return map[k] != null; }).sort(function (a, b) { return map[b] - map[a]; });
    var r = {}, prev = null, pr = 0;
    ids.forEach(function (k, i) { var v = Math.round(map[k] * 1000); if (v !== prev) { pr = i + 1; prev = v; } r[k] = pr; });
    return r;
  }
  KP.rank = rank;
  KP.round = function (x, n) { if (x == null || isNaN(x)) return null; var p = Math.pow(10, n == null ? 2 : n); return Math.round(x * p) / p; };

  KP.compute = function (cls, students, assessments, scores) {
    var S = KP.settingsOf(cls), subs = (cls.subjects || []), subById = {};
    subs.forEach(function (s) { subById[s.id] = s; });
    var sc = {}; scores.forEach(function (x) { sc[x.aid + '_' + x.sid] = x; });
    function val(a, sid) {
      var r = sc[a.id + '_' + sid];
      if (!r) return null;
      var v = r.score != null ? +r.score : (r.mcq != null || r.written != null ? (+r.mcq || 0) + (+r.written || 0) : null);
      return v == null || isNaN(v) ? null : v;
    }
    function norm(a, sid) { var v = val(a, sid), s = subById[a.subjectId]; if (v == null || !s || !a.max) return null; return v / a.max * s.max; }
    function meanFor(list, sid) {
      if (!list.length) return undefined;              // nothing given
      var vs = list.map(function (a) { var v = norm(a, sid); return v == null && S.absentZero ? 0 : v; });
      return mean(vs);
    }
    // group the assessments
    var byKey = {};
    assessments.forEach(function (a) {
      if (!subById[a.subjectId]) return;
      var k = a.type === 'semester' ? 'S' + (a.semester || 1) : 'M' + a.month;
      var g = byKey[k] = byKey[k] || {};
      var s = g[a.subjectId] = g[a.subjectId] || { exam: [], quiz: [] };
      (a.type === 'monthly' || a.type === 'semester' ? s.exam : s.quiz).push(a);
    });
    function block(k) { // monthly-style average over the subjects that have results in group k
      var g = byKey[k]; if (!g) return null;
      var used = subs.filter(function (s) { return g[s.id]; });
      var out = { subjects: used.map(function (s) { return s.id; }), by: {} };
      var w = Math.max(0, Math.min(1, +S.lessonWeight || 0));
      students.forEach(function (st) {
        var subj = {}, total = 0, coef = 0, max = 0, any = false;
        used.forEach(function (s) {
          var e = meanFor(g[s.id].exam, st.id), q = meanFor(g[s.id].quiz, st.id), v;
          if (e !== undefined && q !== undefined && w > 0) v = e == null && q == null ? null : (1 - w) * (e || 0) + w * (q || 0);
          else if (e !== undefined) v = e; else v = q;
          subj[s.id] = v;
          if (v != null) any = true;
          if (v != null || S.absentZero) { total += v || 0; coef += +s.coef || 0; max += +s.max || 0; }
        });
        var avg = any && coef ? total / coef : null;
        out.by[st.id] = { subj: subj, total: any ? total : null, coef: coef, max: max, avg: avg, pct: any && max ? total / max * 100 : null };
      });
      var rk = rank(map(out.by, 'avg'));
      students.forEach(function (st) { var r = out.by[st.id]; r.rank = rk[st.id] || null; r.letter = KP.letter(cls, r.pct); });
      return out;
    }
    function map(by, f) { var m = {}; Object.keys(by).forEach(function (k) { m[k] = by[k][f]; }); return m; }
    var res = { months: {}, sem: {}, year: { by: {} }, settings: S, subById: subById };
    for (var m = 0; m < 12; m++) { var b = block('M' + m); if (b) res.months[m] = b; }
    [1, 2].forEach(function (s) {
      var months = S.semMonths[s].filter(function (m) { return res.months[m]; });
      var ex = block('S' + s);
      if (!months.length && !ex) return;
      var out = { months: months, exam: ex, by: {} };
      students.forEach(function (st) {
        var mAvgs = {}, subjM = {};
        months.forEach(function (m) { var r = res.months[m].by[st.id]; mAvgs[m] = r.avg; });
        var mAvg = mean(months.map(function (m) { return mAvgs[m]; }));
        var mPct = mean(months.map(function (m) { return res.months[m].by[st.id].pct; }));
        var e = ex ? ex.by[st.id] : null;
        var avg = e && e.avg != null ? (mAvg != null ? (mAvg + e.avg) / 2 : e.avg) : mAvg;
        var pct = e && e.pct != null ? (mPct != null ? (mPct + e.pct) / 2 : e.pct) : mPct;
        // per subject
        var subj = {};
        subs.forEach(function (sj) {
          var mv = mean(months.map(function (m) { return res.months[m].by[st.id].subj[sj.id]; }));
          var ev = e ? e.subj[sj.id] : null;
          subj[sj.id] = ev != null ? (mv != null ? (mv + ev) / 2 : ev) : mv;
          subjM[sj.id] = mv;
        });
        out.by[st.id] = { monthAvgs: mAvgs, mAvg: mAvg, exam: e ? e.avg : null, avg: avg, pct: pct, subj: subj, subjMonths: subjM };
      });
      var rk = rank(map(out.by, 'avg'));
      students.forEach(function (st) { var r = out.by[st.id]; r.rank = rk[st.id] || null; r.letter = KP.letter(cls, r.pct); });
      res.sem[s] = out;
    });
    students.forEach(function (st) {
      var a = res.sem[1] && res.sem[1].by[st.id], b = res.sem[2] && res.sem[2].by[st.id];
      var s1 = a ? a.avg : null, s2 = b ? b.avg : null;
      var subj = {};
      subs.forEach(function (sj) { subj[sj.id] = mean([a ? a.subj[sj.id] : null, b ? b.subj[sj.id] : null]); });
      res.year.by[st.id] = { s1: s1, s2: s2, avg: mean([s1, s2]), pct: mean([a ? a.pct : null, b ? b.pct : null]), subj: subj };
    });
    var yr = rank(map(res.year.by, 'avg'));
    students.forEach(function (st) {
      var r = res.year.by[st.id]; r.rank = yr[st.id] || null; r.letter = KP.letter(cls, r.pct);
      r.pass = r.pct == null ? null : r.pct >= S.pass;
    });
    // class statistics helper
    res.stats = function (by) {
      var v = Object.keys(by).map(function (k) { return by[k].avg; }).filter(function (x) { return x != null; });
      var p = Object.keys(by).map(function (k) { return by[k].pct; }).filter(function (x) { return x != null; });
      return { n: v.length, mean: mean(v), max: v.length ? Math.max.apply(null, v) : null, min: v.length ? Math.min.apply(null, v) : null,
        pass: p.filter(function (x) { return x >= S.pass; }).length };
    };
    return res;
  };
})(window);
