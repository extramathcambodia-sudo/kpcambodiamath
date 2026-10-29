/* KPCambodianmathematics — admin.html «លក់សៀវភៅ PDF»: make a download code for each buyer after checking the payment.
 * The book keys come from books_private/keys.json (made by make_books.py) and stay in this browser only. */
(function () {
  'use strict';
  var KB = window.KPBooks, books = window.KP_BOOKS || [];
  var $ = function (id) { return document.getElementById(id); };
  if (!KB || !$('ad-books')) return;
  var SITE = 'https://kpcmath.netlify.app';
  var kh = KB.kh, esc = KB.esc;
  function get(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function toast(m) { var t = $('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function base() { return /^https?:/.test(location.protocol) ? location.origin + location.pathname.replace(/[^/]*$/, '') : SITE + '/'; }
  function title(id) { var b = books.filter(function (x) { return x.id === id; })[0]; return b ? b.title : id; }

  function render() {
    var keys = get('kp-book-keys', null), has = keys && books.some(function (b) { return keys[b.id]; });
    $('bk-nokey').hidden = !!has; $('bk-form').hidden = !has; $('bk-tools').hidden = !has;
    $('bk-book').innerHTML = books.filter(function (b) { return keys && keys[b.id]; })
      .map(function (b) { return '<option value="' + b.id + '">' + esc(b.title) + ' — ' + kh(b.price_khr) + ' ៛</option>'; }).join('');
    var sales = get('kp-sales', []);
    $('bk-sales').innerHTML = sales.length ? '<div class="tbl-wrap"><table class="gb"><thead><tr><th>ថ្ងៃ</th><th class="l">អ្នកទិញ</th><th class="l">សៀវភៅ</th><th>លេខបញ្ជាទិញ</th><th>ប្រាក់</th><th></th></tr></thead><tbody>' +
      sales.map(function (s, i) {
        return '<tr><td>' + kh(new Date(s.t).toLocaleDateString('en-GB')) + '</td><td class="l"><b>' + esc(s.n) + '</b><br><small class="muted">' + esc(s.c || '') + '</small></td><td class="l">' + esc(title(s.b)) +
          '</td><td><code>' + esc(s.o) + '</code></td><td>' + esc(s.paid || '') + '</td><td><button class="btn btn-ghost btn-xs" data-again="' + i + '">ផ្ញើម្ដងទៀត</button></td></tr>';
      }).join('') + '</tbody></table></div>' : '<p class="muted">មិនទាន់មានការលក់ ។</p>';
  }
  function message(s) {
    var link = base() + 'books.html#code=' + s.code;
    return 'សួស្ដី ' + s.n + ' 🙏 អរគុណសម្រាប់ការទិញសៀវភៅ «' + title(s.b) + '» ។\n' +
      'លេខបញ្ជាទិញ ៖ ' + s.o + '\n\nចុចតំណនេះ ដើម្បីទាញយកសៀវភៅ PDF ៖\n' + link +
      '\n\nឬបើក ' + base() + 'books.html ហើយបិទភ្ជាប់កូដ ៖\n' + s.code +
      '\n\nសូមរក្សាកូដនេះទុក ។ សៀវភៅមានឈ្មោះរបស់អ្នក — សូមកុំចែករំលែក ។';
  }
  function show(s) {
    $('bk-msg').value = message(s); $('bk-test').href = base() + 'books.html#code=' + s.code;
    $('bk-out').hidden = false; $('bk-out').scrollIntoView({ block: 'nearest' });
  }

  $('bk-keyfile').onchange = function () {
    var f = this.files[0]; if (!f) return;
    f.text().then(function (t) {
      var k = JSON.parse(t), ok = books.filter(function (b) { return typeof k[b.id] === 'string'; });
      if (!ok.length) throw new Error('ឯកសារនេះមិនមែនជា keys.json របស់សៀវភៅទេ');
      put('kp-book-keys', k); toast('បាននាំចូលកូនសោសៀវភៅ ' + kh(ok.length)); render();
    }).catch(function (e) { toast(e.message || 'ឯកសារមិនត្រឹមត្រូវ'); });
    this.value = '';
  };
  $('bk-make').onclick = function (e) {
    e.preventDefault();
    var keys = get('kp-book-keys', {}), b = $('bk-book').value, n = $('bk-name').value.trim(), o = $('bk-oid').value.trim();
    if (!KB.latin(n)) { toast('សូមវាយឈ្មោះអ្នកទិញជាអក្សរឡាតាំង'); return; }
    if (!o) o = KB.orderId(books.filter(function (x) { return x.id === b; })[0] || {});
    var t = new Date().toISOString().slice(0, 10);
    KB.makeCode({ b: b, k: keys[b], n: KB.latin(n), o: o, t: t }).then(function (code) {
      var s = { t: Date.now(), b: b, n: KB.latin(n), o: o, c: $('bk-contact').value.trim(), paid: $('bk-paid').value.trim(), code: code };
      var sales = get('kp-sales', []); sales.unshift(s); put('kp-sales', sales);
      ['bk-name', 'bk-oid', 'bk-contact', 'bk-paid'].forEach(function (id) { $(id).value = ''; });
      render(); show(s); toast('បានបង្កើតកូដ');
    }, function (er) { console.error(er); toast('បង្កើតកូដមិនបាន'); });
  };
  $('bk-copy').onclick = function () { KB.copy($('bk-msg').value).then(function () { toast('បានចម្លង — បិទភ្ជាប់ក្នុង Telegram'); }); };
  $('bk-sales').onclick = function (e) {
    var b = e.target.closest('[data-again]'); if (!b) return;
    show(get('kp-sales', [])[+b.dataset.again]);
  };
  $('bk-csv').onclick = function () {
    var rows = [['date', 'buyer', 'contact', 'book', 'order', 'paid', 'code']].concat(get('kp-sales', []).map(function (s) {
      return [new Date(s.t).toISOString().slice(0, 10), s.n, s.c, s.b, s.o, s.paid, s.code];
    }));
    var csv = '﻿' + rows.map(function (r) { return r.map(function (x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    KB.save(new Blob([csv], { type: 'text/csv' }), 'KP-book-sales-' + new Date().toISOString().slice(0, 10) + '.csv');
  };
  $('bk-forget').onclick = function () {
    if (!confirm('លុបកូនសោសៀវភៅពី browser នេះ? (បញ្ជីលក់នៅដដែល)')) return;
    try { localStorage.removeItem('kp-book-keys'); } catch (e) {} render();
  };
  render();
})();
