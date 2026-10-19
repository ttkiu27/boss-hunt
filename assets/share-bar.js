/**
 * BOSS 獵殺區 · 分享列
 * Mount: <div data-boss-share></div>
 * 文字 = document.title + location.href（完整 URL，點擊當下再讀）
 * 平台只開分享 URL，唔裝 SDK。
 */
(function () {
  'use strict';

  var PLATFORMS = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'x', label: 'X' },
    { id: 'line', label: 'LINE' }
  ];

  function currentShare() {
    return {
      title: document.title || 'BOSS 獵殺區',
      url: location.href
    };
  }

  function shareText(title, url) {
    return title + '\n' + url;
  }

  /**
   * 平台分享 URL。title、url 都經 encodeURIComponent。
   * WhatsApp / LINE：一條文字（標題 + 換行 + URL）
   * Telegram / X：text=標題、url=頁面
   * Facebook：u=頁面、quote=標題
   */
  function platformHref(id, title, url) {
    var text = shareText(title, url);
    switch (id) {
      case 'whatsapp':
        return 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
      case 'telegram':
        return 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
      case 'facebook':
        return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(title);
      case 'x':
        return 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
      case 'line':
        return 'https://line.me/R/msg/text/?' + encodeURIComponent(text);
      default:
        return url;
    }
  }

  function canNativeShare() {
    return typeof navigator.share === 'function';
  }

  function escAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function copyText(value) {
    function legacy() {
      return new Promise(function (resolve, reject) {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        var ok = false;
        try {
          ok = document.execCommand('copy');
        } catch (e) {
          ok = false;
        }
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error('copy failed'));
      });
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(value).catch(function () {
        return legacy();
      });
    }
    return legacy();
  }

  function render(el) {
    if (el.getAttribute('data-boss-share-ready') === '1') return;
    el.setAttribute('data-boss-share-ready', '1');

    var nativeOk = canNativeShare();
    el.className = (el.className ? el.className + ' ' : '') + 'boss-share' + (nativeOk ? ' has-native' : '');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', '分享本頁');

    var html = '<span class="boss-share-label">轉發呢頁</span>';
    if (nativeOk) {
      html += '<button type="button" class="boss-share-btn boss-share-native" data-share-native>系統分享</button>';
    }
    html += '<div class="boss-share-actions">';
    html += '<button type="button" class="boss-share-btn boss-share-copy" data-share-copy>複製連結</button>';
    for (var i = 0; i < PLATFORMS.length; i++) {
      var p = PLATFORMS[i];
      var snap = currentShare();
      html += '<a class="boss-share-btn boss-share-plat" data-share-plat="' + p.id + '" href="' +
        escAttr(platformHref(p.id, snap.title, snap.url)) +
        '" target="_blank" rel="noopener noreferrer">' + p.label + '</a>';
    }
    html += '</div><span class="boss-share-status" data-share-status role="status" aria-live="polite"></span>';
    el.innerHTML = html;

    var statusEl = el.querySelector('[data-share-status]');
    var copyBtn = el.querySelector('[data-share-copy]');
    var statusTimer = null;

    function setStatus(msg, kind) {
      statusEl.textContent = msg;
      statusEl.className = 'boss-share-status' + (kind ? ' ' + kind : '');
      if (statusTimer) clearTimeout(statusTimer);
      if (msg) {
        statusTimer = setTimeout(function () {
          statusEl.textContent = '';
          statusEl.className = 'boss-share-status';
          copyBtn.classList.remove('is-done');
        }, 1600);
      }
    }

    copyBtn.addEventListener('click', function () {
      var url = currentShare().url;
      copyText(url).then(function () {
        copyBtn.classList.add('is-done');
        setStatus('已複製', 'is-ok');
      }).catch(function () {
        setStatus('複製唔到', 'is-err');
      });
    });

    var nativeBtn = el.querySelector('[data-share-native]');
    if (nativeBtn) {
      nativeBtn.addEventListener('click', function () {
        var snap = currentShare();
        var ret = navigator.share({
          title: snap.title,
          text: snap.title,
          url: snap.url
        });
        if (ret && typeof ret.then === 'function') {
          ret.then(function () {
            setStatus('已分享', 'is-ok');
          }).catch(function (err) {
            if (err && err.name === 'AbortError') return;
            setStatus('分享唔到，試下複製連結', 'is-err');
          });
        }
      });
    }

    function refreshPlat(anchor) {
      var id = anchor.getAttribute('data-share-plat');
      var snap = currentShare();
      anchor.href = platformHref(id, snap.title, snap.url);
    }

    var links = el.querySelectorAll('[data-share-plat]');
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener('pointerdown', function (ev) {
        refreshPlat(ev.currentTarget);
      });
      links[j].addEventListener('click', function (ev) {
        refreshPlat(ev.currentTarget);
      });
    }
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-boss-share]');
    for (var i = 0; i < nodes.length; i++) render(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  if (typeof window !== 'undefined') {
    window.BossShareBar = {
      platformHref: platformHref,
      shareText: shareText
    };
  }
})();
