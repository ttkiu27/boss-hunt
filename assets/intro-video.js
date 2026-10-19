(function () {
  var video = document.getElementById("hub-intro-video");
  if (!video) return;

  function ageCleared() {
    try { return localStorage.getItem("boss-hunt-age-ok") === "1"; } catch (e) { return false; }
  }

  function gateUp() {
    return document.body.classList.contains("age-gate-lock");
  }

  function hold() {
    video.autoplay = false;
    video.removeAttribute("autoplay");
    video.pause();
    try {
      if (video.currentTime > 0) video.currentTime = 0;
    } catch (e) {}
  }

  function start() {
    if (!ageCleared() || gateUp()) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.autoplay = true;
    video.setAttribute("autoplay", "");
    var pending = video.play();
    if (pending && typeof pending.catch === "function") pending.catch(function () {});
  }

  video.addEventListener("play", function () {
    if (!ageCleared() || gateUp()) hold();
  });

  if (!ageCleared() || gateUp()) {
    hold();
    var obs = new MutationObserver(function () {
      if (ageCleared() && !gateUp()) {
        obs.disconnect();
        start();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.closest || !target.closest("[data-age-yes]")) return;
      start();
    });
    return;
  }

  start();
})();
