(function () {
  var video = document.getElementById("hub-intro-video");
  if (!video) return;

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
})();
