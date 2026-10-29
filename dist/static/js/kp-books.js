/* KPCambodianmathematics — PDF book shop (books.html) and download codes
 * Flow: buyer fills the order form → pays by KHQR → sends the receipt on Telegram →
 * the teacher makes a download code in admin.html → buyer opens the code link → the book is
 * decrypted in the browser, stamped with the buyer's name on every page, and saved.
 * Code = "KPB1." + base64url(iv | AES-GCM(siteKey, {b, k, n, o, t})).  Book file = iv | AES-GCM(bookKey, pdf). */
(function () {
  'use strict';
  var KB = window.KPBooks = {};
  var KHD = '០១២៣៤៥៦៧៨៩';
  var kh = KB.kh = function (n) { return String(n).replace(/\d/g, function (d) { return KHD[d]; }); };
  var esc = KB.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var money = KB.money = function (n) { return kh(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };
  var enc = new TextEncoder(), dec = new TextDecoder();
  function b64u(buf) { var s = '', a = new Uint8Array(buf); for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  KB.b64u = b64u; KB.unb64u = unb64u;
  function siteKey(use) {
    return crypto.subtle.digest('SHA-256', enc.encode('KPCambodianmathematics/books/v1')).then(function (h) {
      return crypto.subtle.importKey('raw', h, 'AES-GCM', false, [use]);
    });
  }
  KB.ready = !!(window.crypto && crypto.subtle);

  /* ---- make a code (admin) ---- */
  KB.makeCode = function (o) {   // o = {b, k (base64), n, o, t}
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return siteKey('encrypt').then(function (key) {
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(JSON.stringify(o)));
    }).then(function (ct) {
      var all = new Uint8Array(12 + ct.byteLength); all.set(iv); all.set(new Uint8Array(ct), 12);
      return 'KPB1.' + b64u(all);
    });
  };
  /* ---- read a code (buyer) ---- */
  KB.readCode = function (code) {
    code = String(code || '').trim().replace(/^.*[#?&]code=/, '').replace(/\s+/g, '');
    if (code.indexOf('KPB1.') !== 0) return Promise.reject(new Error('bad'));
    var all;
    try { all = unb64u(code.slice(5)); } catch (e) { return Promise.reject(new Error('bad')); }
    return siteKey('decrypt').then(function (key) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12) }, key, all.slice(12));
    }).then(function (pt) { return JSON.parse(dec.decode(pt)); }, function () { throw new Error('bad'); });
  };
  KB.orderId = function (book) {
    var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
    return (book.code || 'KP') + '-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + (1000 + Math.floor(Math.random() * 9000));
  };
  KB.latin = function (s) { return String(s || '').normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim(); };

  /* ---- open the book ---- */
  KB.unlock = function (info, book, onStep) {
    onStep = onStep || function () {};
    onStep('កំពុងទាញយកសៀវភៅ…');
    return fetch('static/books/' + book.id + '.bin', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('fetch'); return r.arrayBuffer();
    }, function () { throw new Error('fetch'); }).then(function (buf) {
      onStep('កំពុងដោះសោ…');
      var all = new Uint8Array(buf);
      return crypto.subtle.importKey('raw', unb64u(info.k.replace(/\+/g, '-').replace(/\//g, '_')), 'AES-GCM', false, ['decrypt']).then(function (key) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12), additionalData: enc.encode(book.id) }, key, all.slice(12));
      }).catch(function () { throw new Error('key'); });
    }).then(function (pdf) { return stamp(pdf, info, book, onStep); });
  };
  function stamp(pdf, info, book, onStep) {
    if (!window.PDFLib) return new Blob([pdf], { type: 'application/pdf' });
    onStep('កំពុងដាក់ឈ្មោះអ្នកទិញលើទំព័រនីមួយៗ…');
    var L = window.PDFLib, who = KB.latin(info.n) || 'Buyer';
    var line = 'Licensed to ' + who + '  |  Order ' + KB.latin(info.o) + '  |  KPCambodianmathematics - do not share';
    return L.PDFDocument.load(pdf).then(function (doc) {
      return doc.embedFont(L.StandardFonts.Helvetica).then(function (font) {
        doc.getPages().forEach(function (pg) {
          var h = pg.getHeight(), size = 7.5, tw = font.widthOfTextAtSize(line, size);
          pg.drawRectangle({ x: 5, y: h - tw - 96, width: 11, height: tw + 12, color: L.rgb(1, 1, 1), opacity: 0.8 });
          pg.drawText(line, { x: 13, y: h - tw - 90, size: size, font: font, rotate: L.degrees(90), color: L.rgb(0.42, 0.38, 0.55), opacity: 0.9 });
        });
        doc.setTitle(book.title_en + ' - ' + who);
        doc.setSubject('Order ' + info.o + ' - licensed to ' + who);
        return doc.save();
      });
    }).then(function (bytes) { return new Blob([bytes], { type: 'application/pdf' }); }, function (e) {
      console.warn(e); return new Blob([pdf], { type: 'application/pdf' });
    });
  }
  KB.save = function (blob, name) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  };
  KB.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return true; }, fallback);
    return Promise.resolve(fallback());
    function fallback() { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} t.remove(); return ok; }
  };

  /* ================================================================ shop page */
  var root = document.getElementById('book-shop');
  if (!root) return;
  var books = window.KP_BOOKS || [], TG = root.dataset.tg || 'https://t.me/KHEMPUTHY';
  var $ = function (id) { return document.getElementById(id); };
  function toast(m) { var t = $('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* order dialog */
  var dlg = $('order-dlg'), cur = null;
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-buy]'); if (!b) return;
    cur = books.filter(function (x) { return x.id === b.dataset.buy; })[0]; if (!cur) return;
    var last = store('kp-buyer') || {};
    $('od-book').textContent = cur.title; $('od-price').innerHTML = money(cur.price_khr) + ' ៛ <small>(ឬ $' + cur.price_usd + ')</small>';
    $('od-name').value = last.n || ''; $('od-phone').value = last.p || '';
    step(1); dlg.showModal(); setTimeout(function () { $('od-name').focus(); }, 50);
  });
  function step(n) { [1, 2].forEach(function (i) { $('od-step' + i).hidden = i !== n; }); }
  $('od-next').onclick = function (e) {
    e.preventDefault();
    var n = $('od-name').value.trim(), p = $('od-phone').value.trim();
    if (!KB.latin(n)) { $('od-msg').textContent = 'សូមវាយឈ្មោះជាអក្សរឡាតាំង (ឧ. Sok Dara) ។ ឈ្មោះនេះនឹងបោះពុម្ពលើសៀវភៅរបស់អ្នក ។'; return; }
    if (p.replace(/\D/g, '').length < 8 && p.indexOf('@') !== 0) { $('od-msg').textContent = 'សូមវាយលេខទូរស័ព្ទ ឬ Telegram (@username)'; return; }
    $('od-msg').textContent = '';
    store('kp-buyer', { n: n, p: p });
    var oid = KB.orderId(cur);
    var orders = store('kp-orders') || []; orders.unshift({ o: oid, b: cur.id, n: n, p: p, t: Date.now() }); store('kp-orders', orders.slice(0, 20));
    $('od-oid').textContent = oid; $('od-amount').innerHTML = money(cur.price_khr) + ' ៛ <small>ឬ $' + cur.price_usd + '</small>';
    var msg = 'សួស្ដីលោកគ្រូ ខ្ញុំបានបង់ប្រាក់ទិញសៀវភៅ PDF ៖\n' +
      '📘 ' + cur.title + ' (' + cur.code + ')\n🧾 លេខបញ្ជាទិញ ៖ ' + oid + '\n👤 ឈ្មោះ ៖ ' + n + '\n📞 ទំនាក់ទំនង ៖ ' + p +
      '\n💵 ចំនួនទឹកប្រាក់ ៖ ' + cur.price_khr + ' ៛\n(ភ្ជាប់រូបវិក្កយបត្រខាងក្រោម)';
    $('od-tg-text').value = msg;
    step(2);
  };
  $('od-copy-oid').onclick = function () { KB.copy($('od-oid').textContent).then(function () { toast('បានចម្លងលេខបញ្ជាទិញ'); }); };
  $('od-tg').onclick = function () {
    KB.copy($('od-tg-text').value).then(function () { toast('បានចម្លងសារ — បិទភ្ជាប់ (Paste) ក្នុង Telegram'); });
  };
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  /* QR tabs */
  document.querySelectorAll('.qr-tabs button').forEach(function (b) {
    b.onclick = function () {
      document.querySelectorAll('.qr-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      document.querySelectorAll('.qr-pane').forEach(function (p) { p.hidden = p.dataset.qr !== b.dataset.qr; });
    };
  });

  /* redeem */
  var box = $('redeem-box'), inp = $('rd-code'), msg = $('rd-msg'), go = $('rd-go');
  function say(t, cls) { msg.className = 'rd-msg' + (cls ? ' ' + cls : ''); msg.innerHTML = t; }
  function redeem() {
    if (!KB.ready) { say('កម្មវិធីរុករកនេះចាស់ពេក ។ សូមប្រើ Chrome ឬ Safari ថ្មី ។', 'bad'); return; }
    var code = inp.value; if (!code.trim()) { say('សូមបិទភ្ជាប់កូដដែលលោកគ្រូផ្ញើឱ្យ ។', 'bad'); return; }
    go.disabled = true;
    KB.readCode(code).then(function (info) {
      var book = books.filter(function (x) { return x.id === info.b; })[0];
      if (!book) throw new Error('book');
      say('សួស្ដី <b>' + esc(info.n) + '</b> · ' + esc(book.title) + ' · លេខបញ្ជាទិញ ' + esc(info.o));
      return KB.unlock(info, book, function (s) { say(s); }).then(function (blob) {
        KB.save(blob, (book.file || book.id) + '_' + (KB.latin(info.n).replace(/\s+/g, '_') || 'KP') + '.pdf');
        say('✅ បានទាញយក <b>' + esc(book.title) + '</b> រួចរាល់ ។ រកមើលក្នុងថត Downloads ។ សៀវភៅនេះមានឈ្មោះ <b>' + esc(info.n) + '</b> នៅបាតទំព័រនីមួយៗ — សូមកុំចែករំលែក ។', 'ok');
      });
    }).catch(function (e) {
      var m = e && e.message;
      say(m === 'fetch' ? 'មិនអាចទាញយកឯកសារបាន ។ សូមភ្ជាប់អ៊ីនធឺណិត ហើយបើកពីគេហទំព័រ (មិនមែនពីឯកសារក្នុងកុំព្យូទ័រ) ។'
        : m === 'book' ? 'កូដនេះសម្រាប់សៀវភៅដែលមិនមានទៀតទេ ។ សូមទាក់ទងលោកគ្រូ ។'
          : m === 'key' ? 'កូដនេះជាកូដចាស់ ។ សូមទាក់ទងលោកគ្រូ ដើម្បីទទួលកូដថ្មី ។'
            : 'កូដមិនត្រឹមត្រូវ ។ សូមចម្លងកូដទាំងមូលម្ដងទៀត ។', 'bad');
    }).then(function () { go.disabled = false; });
  }
  go.onclick = function (e) { e.preventDefault(); redeem(); };
  function fromHash() {
    var m = location.hash.match(/code=([^&]+)/); if (!m) return;
    inp.value = decodeURIComponent(m[1]); box.scrollIntoView({ block: 'center' }); say('កូដរបស់អ្នករួចរាល់ ។ ចុច «ទាញយកសៀវភៅ» ។');
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
  }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
