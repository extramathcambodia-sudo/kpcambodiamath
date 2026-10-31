/* KP AI Teaching Assistant — talks to the Netlify Function at /api/ai (streams plain text) */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var form = $('#ai-form'), out = $('#ai-out'), btn = $('#ai-send'), stopBtn = $('#ai-stop');
  if (!form) return;
  var history = [], ctrl = null;

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  $('#ai-code').value = store('kp-ai-code') || '';

  // pick a mode chip -> fills the placeholder with an example
  var EX = {
    plan: 'ឧ. មេរៀន «សមីការដឺក្រេទី១ មួយអញ្ញាត» រយៈពេល ៥០ នាទី',
    exercises: 'ឧ. លំហាត់ ១០ លើ «ទ្រឹស្តីបទពីតាករ» ពីងាយទៅពិបាក',
    quiz: 'ឧ. សំណួរ MCQ ១០ លើ «អនុគមន៍លីនេអ៊ែរ»',
    solve: 'ឧ. ដោះស្រាយ $x^2 - 5x + 6 = 0$',
    explain: 'ឧ. ពន្យល់ «លីមីត» ដល់សិស្សថ្នាក់ទី ១២ ដែលទើបរៀនដំបូង',
    chat: 'សរសេរសំណួរ ឬសំណើរបស់អ្នក…'
  };
  function mode() { var m = form.querySelector('input[name=mode]:checked'); return m ? m.value : 'chat'; }
  form.addEventListener('change', function (e) { if (e.target.name === 'mode') $('#ai-prompt').placeholder = EX[mode()]; });
  $('#ai-prompt').placeholder = EX[mode()];

  // --- tiny Markdown renderer (input is escaped first; only our own tags are produced)
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function inl(s) {
    return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<i>$2</i>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function md(src) {
    var maths = [];
    // keep LaTeX untouched by the Markdown pass
    src = src.replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, function (m) { maths.push(m); return '\u0000' + (maths.length - 1) + '\u0000'; });
    var lines = esc(src).split('\n'), html = [], list = null, table = [];
    function closeList() { if (list) { html.push('</' + list + '>'); list = null; } }
    function flushTable() {
      if (!table.length) return;
      var rows = table.filter(function (r) { return !/^\|?\s*:?-{2,}/.test(r); });
      html.push('<div class="ai-tbl"><table>' + rows.map(function (r, i) {
        var c = r.replace(/^\||\|$/g, '').split('|');
        var t = i === 0 ? 'th' : 'td';
        return '<tr>' + c.map(function (x) { return '<' + t + '>' + inl(x.trim()) + '</' + t + '>'; }).join('') + '</tr>';
      }).join('') + '</table></div>');
      table = [];
    }
    lines.forEach(function (ln) {
      var m;
      if (/^\s*\|.*\|\s*$/.test(ln)) { closeList(); table.push(ln.trim()); return; }
      flushTable();
      if ((m = ln.match(/^(#{1,4})\s+(.*)/))) { closeList(); var h = Math.min(m[1].length + 1, 5); html.push('<h' + h + '>' + inl(m[2]) + '</h' + h + '>'); }
      else if ((m = ln.match(/^\s*[-*]\s+(.*)/))) { if (list !== 'ul') { closeList(); html.push('<ul>'); list = 'ul'; } html.push('<li>' + inl(m[1]) + '</li>'); }
      else if ((m = ln.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== 'ol') { closeList(); html.push('<ol>'); list = 'ol'; } html.push('<li>' + inl(m[1]) + '</li>'); }
      else if (/^\s*(---|\*\*\*)\s*$/.test(ln)) { closeList(); html.push('<hr>'); }
      else if (ln.trim()) { closeList(); html.push('<p>' + inl(ln) + '</p>'); }
      else closeList();
    });
    closeList(); flushTable();
    return html.join('').replace(/\u0000(\d+)\u0000/g, function (_, i) { return esc(maths[+i]); });
  }
  function typeset(el) {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
      } catch (e) { /* leave raw TeX */ }
    }
  }

  function bubble(cls, content) {
    var d = document.createElement('div');
    d.className = 'ai-msg ' + cls;
    d.innerHTML = content;
    out.appendChild(d);
    out.hidden = false;
    d.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return d;
  }
  function busy(on) { btn.disabled = on; stopBtn.hidden = !on; btn.classList.toggle('is-busy', on); }

  var TAIL = { '[[TRUNCATED]]': 'ចម្លើយវែងពេក ហើយត្រូវបានកាត់ ។ សូមសុំជាផ្នែកតូចៗ ។', '[[REFUSAL]]': 'AI មិនអាចឆ្លើយសំណើនេះបានទេ ។', '[[ERROR]]': 'មានបញ្ហាពេលកំពុងបង្កើតចម្លើយ ។ សូមព្យាយាមម្ដងទៀត ។' };

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var prompt = $('#ai-prompt').value.trim(), code = $('#ai-code').value.trim();
    if (!code) { $('#ai-code').focus(); return; }
    if (!prompt) { $('#ai-prompt').focus(); return; }
    store('kp-ai-code', code);
    bubble('ai-user', esc(prompt).replace(/\n/g, '<br>'));
    var box = bubble('ai-bot', '<p class="ai-wait">AI កំពុងសរសេរ…</p>'), text = '';
    busy(true);
    ctrl = new AbortController();
    try {
      var res = await fetch('/api/ai', {
        method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, mode: mode(), grade: $('#ai-grade').value, prompt: prompt, history: history })
      });
      if (!res.ok || !res.body) throw new Error(await res.text() || ('HTTP ' + res.status));
      var reader = res.body.getReader(), dec = new TextDecoder(), last = 0;
      for (;;) {
        var r = await reader.read();
        if (r.done) break;
        text += dec.decode(r.value, { stream: true });
        if (Date.now() - last > 120) { box.innerHTML = md(text); last = Date.now(); }
      }
      var note = '';
      Object.keys(TAIL).forEach(function (k) { if (text.indexOf(k) > -1) { text = text.replace(k, '').trim(); note = TAIL[k]; } });
      box.innerHTML = md(text) + (note ? '<p class="ai-note">' + note + '</p>' : '');
      if (text) { history.push({ role: 'user', content: prompt }, { role: 'assistant', content: text }); $('#ai-prompt').value = ''; }
    } catch (err) {
      if (err.name === 'AbortError') box.innerHTML = md(text) + '<p class="ai-note">បានបញ្ឈប់ ។</p>';
      else box.innerHTML = '<p class="ai-note">' + esc(String(err.message || err)) + '</p>';
    }
    typeset(box);
    if (text) addTools(box, text);
    busy(false);
  });
  stopBtn.addEventListener('click', function () { if (ctrl) ctrl.abort(); });

  function addTools(box, text) {
    var bar = document.createElement('div');
    bar.className = 'ai-tools';
    bar.innerHTML = '<button type="button" class="btn btn-sm btn-ghost" data-a="copy">ចម្លង</button><button type="button" class="btn btn-sm btn-ghost" data-a="print">បោះពុម្ព</button>';
    bar.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-a');
      if (a === 'copy' && navigator.clipboard) navigator.clipboard.writeText(text).then(function () { e.target.textContent = 'បានចម្លង ✓'; });
      if (a === 'print') {
        document.querySelectorAll('.ai-msg').forEach(function (m) { m.classList.toggle('ai-print', m === box); });
        document.body.classList.add('ai-printing');
        window.print();
        document.body.classList.remove('ai-printing');
      }
    });
    box.appendChild(bar);
  }

  $('#ai-new').addEventListener('click', function () { history = []; out.innerHTML = ''; out.hidden = true; $('#ai-prompt').focus(); });
})();
