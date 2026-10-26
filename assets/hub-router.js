/**
 * BOSS 獵殺區 · index hub panel routing
 * Supports main's multi-step panels (sekiro-boss, onimusha-boss, …) and
 * in-page #anchors (#feedback, etc.) without resetting to the games panel.
 */
(function () {
  "use strict";

  var panels = {};
  document.querySelectorAll("section.panel[id^='panel-']").forEach(function (el) {
    panels[el.id.replace(/^panel-/, "")] = el;
  });

  var panelSteps = [
    "sekiro",
    "sekiro-boss",
    "sekiro-lost",
    "sekiro-puzzle",
    "onimusha",
    "onimusha-boss",
    "arc-raiders",
    "dawnwalker",
    "cs2",
    "hellraiser",
    "gzw",
    "qigong",
    "online-games"
  ];

  var hashAliases = {
    "sekiro-lost-zone": "sekiro-lost"
  };

  var suppressHash = false;

  function resolveStep(hash) {
    if (!hash) return "games";
    if (hashAliases[hash]) hash = hashAliases[hash];
    return panelSteps.indexOf(hash) >= 0 ? hash : null;
  }

  function setHash(hash, replace) {
    var next = hash ? "#" + hash : "#";
    suppressHash = true;
    try {
      if (replace) history.replaceState(null, "", next);
      else history.pushState(null, "", next);
    } catch (e) {
      location.hash = hash || "";
    }
    requestAnimationFrame(function () {
      suppressHash = false;
    });
  }

  function scrollToEl(el, block) {
    if (!el) return;
    requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: "smooth", block: block || "start" });
    });
  }

  function panelStepForAnchor(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var panel = el.closest(".panel");
    if (!panel || !panel.id) return null;
    var step = panel.id.replace(/^panel-/, "");
    return panels[step] ? step : null;
  }

  function show(step, opts) {
    opts = opts || {};
    var target = resolveStep(step);
    if (!target) target = "games";

    Object.keys(panels).forEach(function (key) {
      if (panels[key]) panels[key].hidden = key !== target;
    });

    if (opts.updateHash !== false) {
      if (target === "games") setHash("", true);
      else setHash(target, true);
    }

    if (opts.scroll === false) return;

    if (target === "games") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (panels[target]) scrollToEl(panels[target], "start");
  }

  function routeFromHash() {
    if (suppressHash) return;

    var hash = (location.hash || "").replace(/^#/, "");

    if (!hash) {
      show("games", { scroll: false });
      return;
    }

    var step = resolveStep(hash);
    if (step) {
      show(step);
      return;
    }

    var anchor = document.getElementById(hash);
    if (anchor) {
      var parentStep = panelStepForAnchor(hash);
      if (parentStep) show(parentStep, { scroll: false, updateHash: false });
      scrollToEl(anchor, "start");
      return;
    }

    /* Unknown fragment: leave current panel visible. */
  }

  document.querySelectorAll("[data-go]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      show(btn.getAttribute("data-go"));
    });
  });

  document.querySelectorAll("[data-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      show(btn.getAttribute("data-back"));
    });
  });

  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();
})();
