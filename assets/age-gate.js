(function () {
  var KEY = "boss-hunt-age-ok";
  var DENY = "boss-hunt-age-deny";

  function alreadyOk() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function wasDenied() {
    try { return localStorage.getItem(DENY) === "1"; } catch (e) { return false; }
  }
  function setOk() {
    try {
      localStorage.setItem(KEY, "1");
      localStorage.removeItem(DENY);
    } catch (e) {}
  }
  function setDeny() {
    try { localStorage.setItem(DENY, "1"); } catch (e) {}
  }

  function unlock() {
    document.body.classList.remove("age-gate-lock");
    var gate = document.getElementById("age-gate");
    if (gate) gate.hidden = true;
  }

  function showBlocked(card) {
    card.innerHTML =
      '<div class="age-gate-kicker">硬核祝福</div>' +
      '<div class="age-gate-blocked">' +
      "<h3>未滿 18 歲唔適合</h3>" +
      "<p>呢度係成人向硬核攻略區。未夠歲就唔好入——去啱你年齡嘅地方。</p>" +
      '<a class="age-gate-leave" href="https://www.google.com/" rel="noopener noreferrer">離開呢度 →</a>' +
      "</div>";
  }

  function build() {
    if (document.getElementById("age-gate")) return;
    var gate = document.createElement("div");
    gate.id = "age-gate";
    gate.className = "age-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "age-gate-title");
    gate.innerHTML =
      '<div class="age-gate-card" data-age-card>' +
      '<div class="age-gate-kicker">AGE CHECK</div>' +
      '<h2 id="age-gate-title">你是否已滿 <em>18</em> 歲？</h2>' +
      '<p class="age-gate-lead">夠唔夠 18 歲？有血腥暴力同恐怖內容。確認先入硬核區。</p>' +
      '<div class="age-gate-actions">' +
      '<button type="button" class="age-gate-btn age-gate-yes" data-age-yes>係，已滿 18 歲 — 入去</button>' +
      '<button type="button" class="age-gate-btn age-gate-no" data-age-no>唔係／未滿 18</button>' +
      "</div></div>";
    document.body.appendChild(gate);
    document.body.classList.add("age-gate-lock");

    var card = gate.querySelector("[data-age-card]");
    gate.querySelector("[data-age-yes]").addEventListener("click", function () {
      setOk();
      unlock();
    });
    gate.querySelector("[data-age-no]").addEventListener("click", function () {
      setDeny();
      showBlocked(card);
    });
  }

  function boot() {
    if (alreadyOk()) return;
    if (wasDenied()) {
      build();
      var card = document.querySelector("[data-age-card]");
      if (card) showBlocked(card);
      return;
    }
    build();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
