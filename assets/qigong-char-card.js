/* 本地 TCG 卡牌風頭像優先。data-fallback-src（YouTube／Commons）失敗先試一次，再退回首字。 */
(function () {
  function toInitials(img) {
    img.hidden = true;
    var box = img.closest(".char-avatar");
    if (box) box.classList.add("is-fallback");
  }

  function onError(img) {
    var next = img.getAttribute("data-fallback-src");
    if (next) {
      img.removeAttribute("data-fallback-src");
      img.hidden = false;
      var box = img.closest(".char-avatar");
      if (box) box.classList.remove("is-fallback");
      img.src = next;
      return;
    }
    toInitials(img);
  }

  document.querySelectorAll(".char-avatar img").forEach(function (img) {
    img.addEventListener("error", function () { onError(img); });
    if (img.complete && img.getAttribute("src") && img.naturalWidth === 0) onError(img);
  });
})();
