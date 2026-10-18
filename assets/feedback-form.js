/**
 * BOSS 獵殺區 · Netlify Forms enhance（AJAX 留喺本頁；無 JS 仍可原生 POST）
 */
(function () {
  'use strict';

  function pageLabel(form) {
    var hidden = form.querySelector('[name="page"]');
    if (hidden && hidden.value) return hidden.value;
    var path = location.pathname || '/';
    var leaf = path.split('/').pop() || 'index.html';
    if (!leaf || leaf.indexOf('.') === -1) leaf = 'index.html';
    var title = (document.title || '').trim();
    return leaf + (title ? ' · ' + title : '');
  }

  function encodeBody(form) {
    var fd = new FormData(form);
    // Netlify AJAX needs form-name
    if (!fd.get('form-name')) fd.set('form-name', 'boss-hunt-feedback');
    var params = new URLSearchParams();
    fd.forEach(function (value, key) {
      params.append(key, value == null ? '' : String(value));
    });
    return params.toString();
  }

  function bootForm(section) {
    var form = section.querySelector('[data-boss-feedback]');
    if (!form) return;
    var thanks = section.querySelector('[data-feedback-thanks]');
    var statusEl = section.querySelector('[data-feedback-status]');
    var again = section.querySelector('[data-feedback-again]');
    var pageInput = form.querySelector('[name="page"]');
    if (pageInput && !pageInput.value) pageInput.value = pageLabel(form);
    else if (pageInput) {
      // keep explicit value; still enrich empty
    }

    function setStatus(msg, ok) {
      if (!statusEl) return;
      statusEl.textContent = msg || '';
      statusEl.className = 'feedback-status' + (msg ? ' show ' + (ok ? 'ok' : 'err') : '');
    }

    function showThanks() {
      if (thanks) {
        thanks.hidden = false;
        thanks.classList.add('show');
      }
      form.hidden = true;
      setStatus('', true);
    }

    function showForm() {
      if (thanks) {
        thanks.hidden = true;
        thanks.classList.remove('show');
      }
      form.hidden = false;
      setStatus('');
      var msg = form.querySelector('[name="message"]');
      if (msg) msg.focus();
    }

    if (again) again.addEventListener('click', showForm);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('');
      var msg = form.querySelector('[name="message"]');
      var text = msg ? String(msg.value || '').trim() : '';
      if (!text) {
        setStatus('請寫低意見先再送出。', false);
        if (msg) msg.focus();
        return;
      }
      if (pageInput) pageInput.value = pageInput.value || pageLabel(form);

      var btn = form.querySelector('.feedback-submit');
      if (btn) btn.disabled = true;
      setStatus('送出中…', true);

      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeBody(form)
      })
        .then(function (res) {
          if (!res.ok && res.status !== 200) throw new Error('HTTP ' + res.status);
          form.reset();
          if (pageInput) pageInput.value = pageLabel(form);
          showThanks();
        })
        .catch(function () {
          setStatus('送出失敗。檢查網絡後再試；或者再開一次頁重送。', false);
        })
        .then(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  function boot() {
    var sections = document.querySelectorAll('section.feedback[data-netlify-feedback], section.feedback#feedback');
    if (!sections.length) {
      // any form with data-boss-feedback
      document.querySelectorAll('[data-boss-feedback]').forEach(function (form) {
        var section = form.closest('section') || form.parentElement;
        if (section) bootForm(section);
      });
      return;
    }
    for (var i = 0; i < sections.length; i++) bootForm(sections[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
