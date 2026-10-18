/**
 * BOSS 獵殺區 · 讚好／負評（Abacus + localStorage）
 * Mount: <div data-boss-vote></div>  optional data-vote-slug="index"
 */
(function () {
  'use strict';

  var NS = 'hardcore-blessing-boss-hunt';
  var BASE = 'https://abacus.jasoncameron.dev';
  var LS_PREFIX = 'boss-hunt-vote:';

  function pageSlug(el) {
    var custom = el.getAttribute('data-vote-slug');
    if (custom) return custom.replace(/\.html$/i, '');
    var path = (location.pathname || '/').replace(/\/+$/, '');
    var leaf = path.split('/').pop() || 'index.html';
    if (!leaf || leaf === '' || leaf.indexOf('.') === -1 && path.endsWith('/')) {
      return 'index';
    }
    return leaf.replace(/\.html$/i, '') || 'index';
  }

  function lsKey(slug) {
    return LS_PREFIX + slug;
  }

  function getChoice(slug) {
    try {
      var v = localStorage.getItem(lsKey(slug));
      return v === 'like' || v === 'dislike' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function setChoice(slug, choice) {
    try {
      localStorage.setItem(lsKey(slug), choice);
    } catch (e) { /* private mode */ }
  }

  function fetchJson(url) {
    return fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store' })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        }).catch(function () {
          return { ok: res.ok, status: res.status, data: null };
        });
      });
  }

  function readCount(key) {
    return fetchJson(BASE + '/get/' + encodeURIComponent(NS) + '/' + encodeURIComponent(key))
      .then(function (r) {
        if (r.data && typeof r.data.value === 'number') return r.data.value;
        if (r.data && r.data.error) return 0;
        return 0;
      })
      .catch(function () { return null; });
  }

  function hitCount(key) {
    return fetchJson(BASE + '/hit/' + encodeURIComponent(NS) + '/' + encodeURIComponent(key))
      .then(function (r) {
        if (r.data && typeof r.data.value === 'number') return r.data.value;
        throw new Error('hit failed');
      });
  }

  function render(el) {
    var slug = pageSlug(el);
    var likeKey = slug + '-like';
    var dislikeKey = slug + '-dislike';
    var choice = getChoice(slug);

    el.className = (el.className ? el.className + ' ' : '') + 'boss-vote';
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', '本頁評價');
    el.innerHTML =
      '<span class="boss-vote-label">本頁評價</span>' +
      '<div class="boss-vote-btns">' +
      '  <button type="button" class="boss-vote-btn is-like" data-vote="like" aria-pressed="false">' +
      '    <span aria-hidden="true">👍</span> 讚好 <span class="boss-vote-count" data-count="like">…</span>' +
      '  </button>' +
      '  <button type="button" class="boss-vote-btn is-dislike" data-vote="dislike" aria-pressed="false">' +
      '    <span aria-hidden="true">👎</span> 負評 <span class="boss-vote-count" data-count="dislike">…</span>' +
      '  </button>' +
      '</div>' +
      '<span class="boss-vote-status" data-vote-status aria-live="polite"></span>';

    var btnLike = el.querySelector('[data-vote="like"]');
    var btnDislike = el.querySelector('[data-vote="dislike"]');
    var countLike = el.querySelector('[data-count="like"]');
    var countDislike = el.querySelector('[data-count="dislike"]');
    var status = el.querySelector('[data-vote-status]');

    function setStatus(msg, kind) {
      status.textContent = msg || '';
      status.classList.remove('is-err', 'is-ok');
      if (kind) status.classList.add(kind);
    }

    function paintChoice(c) {
      btnLike.classList.toggle('is-active', c === 'like');
      btnDislike.classList.toggle('is-active', c === 'dislike');
      btnLike.setAttribute('aria-pressed', c === 'like' ? 'true' : 'false');
      btnDislike.setAttribute('aria-pressed', c === 'dislike' ? 'true' : 'false');
    }

    function setBusy(busy) {
      btnLike.disabled = busy;
      btnDislike.disabled = busy;
    }

    function applyCounts(likeN, dislikeN) {
      countLike.textContent = likeN == null ? '—' : String(likeN);
      countDislike.textContent = dislikeN == null ? '—' : String(dislikeN);
    }

    paintChoice(choice);
    if (choice) {
      setStatus(choice === 'like' ? '你已讚好（可改負評）' : '你已負評（可改讚好）', 'is-ok');
    }

    Promise.all([readCount(likeKey), readCount(dislikeKey)]).then(function (vals) {
      var likeN = vals[0];
      var dislikeN = vals[1];
      if (likeN == null && dislikeN == null) {
        applyCounts(0, 0);
        setStatus('計數暫時離線', 'is-err');
      } else {
        applyCounts(likeN == null ? 0 : likeN, dislikeN == null ? 0 : dislikeN);
        if (!choice) setStatus('');
      }
    });

    function onVote(next) {
      var prev = getChoice(slug);
      if (prev === next) {
        setStatus(next === 'like' ? '已讚好' : '已負評', 'is-ok');
        return;
      }
      setBusy(true);
      setStatus('送出中…', null);
      var key = next === 'like' ? likeKey : dislikeKey;
      hitCount(key)
        .then(function (newVal) {
          setChoice(slug, next);
          paintChoice(next);
          if (next === 'like') countLike.textContent = String(newVal);
          else countDislike.textContent = String(newVal);
          setStatus(prev ? '已改為' + (next === 'like' ? '讚好' : '負評') : (next === 'like' ? '多謝讚好' : '收到負評'), 'is-ok');
        })
        .catch(function () {
          setStatus('送出失敗，稍後再試', 'is-err');
        })
        .then(function () {
          setBusy(false);
        });
    }

    btnLike.addEventListener('click', function () { onVote('like'); });
    btnDislike.addEventListener('click', function () { onVote('dislike'); });
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-boss-vote]');
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
