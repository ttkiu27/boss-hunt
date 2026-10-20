/**
 * BOSS 獵殺區 · per-card move/step video mount
 * Local data-clip-src wins; YouTube data-yt-* is fallback with optional end cap.
 */
(function () {
  "use strict";

  function hydrateMoveClips(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll(".move-clip").forEach(function (slot) {
      if (slot.getAttribute("data-clip-mounted") === "1") return;

      var clipSrc = (slot.getAttribute("data-clip-src") || "").trim();
      var ytId = (slot.getAttribute("data-yt-id") || "").trim();
      var ytStart = (slot.getAttribute("data-yt-start") || "").trim();
      var ytEnd = (slot.getAttribute("data-yt-end") || "").trim();

      if (!clipSrc && ytStart === "" && !ytId) return;

      slot.classList.add("is-filled");
      slot.innerHTML = "";
      slot.setAttribute("data-clip-mounted", "1");

      if (clipSrc) {
        var v = document.createElement("video");
        v.src = clipSrc;
        v.controls = true;
        v.playsInline = true;
        v.preload = "metadata";
        var label = slot.closest(".path-step, .move-card");
        if (label) {
          var title =
            label.querySelector(".path-step-num, .mc-name");
          if (title) v.title = title.textContent.trim();
        }
        slot.appendChild(v);
        return;
      }

      if (!ytId) return;

      var startNum = parseFloat(ytStart, 10);
      if (isNaN(startNum)) startNum = 0;
      var endNum = ytEnd === "" ? NaN : parseFloat(ytEnd, 10);
      if (isNaN(endNum)) {
        endNum = startNum + 48;
      }

      var params = ["start=" + encodeURIComponent(String(startNum))];
      if (!isNaN(endNum)) params.push("end=" + encodeURIComponent(String(endNum)));
      params.push("rel=0");

      var ifr = document.createElement("iframe");
      ifr.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(ytId) +
        "?" +
        params.join("&");
      ifr.title = "招式／步驟短片";
      ifr.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      ifr.allowFullscreen = true;
      ifr.loading = "lazy";
      slot.appendChild(ifr);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hydrateMoveClips(document);
    });
  } else {
    hydrateMoveClips(document);
  }

  if (typeof window !== "undefined") {
    window.BossMoveClips = { hydrate: hydrateMoveClips };
  }
})();
