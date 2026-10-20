import {
  TARGET_COUNT,
  pickNext,
  adjustDifficulty,
  evaluate,
  buildFallbackDeck,
} from "./placement-engine.js";

const STORAGE_KEY = "selfboost-placement-v1";
const POOL_SESSION_SIZE = 10;

const $ = (sel) => document.querySelector(sel);

let bank = [];
let state = null;

function loadPlacement() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePlacement(outcome) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...outcome, savedAt: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

function clearPlacement() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function normalizeFill(s) {
  return String(s)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*$/, ";");
}

function checkAnswer(q, userAnswer) {
  if (q.type === "fill") {
    const norm = normalizeFill(userAnswer);
    const targets = [q.correct, ...(q.accept || [])].map(normalizeFill);
    return targets.some((t) => t === norm);
  }
  return userAnswer === q.correct;
}

function isMcLike(q) {
  return q.type === "mc" || q.type === "read_code";
}

function topicLabel(topic) {
  const map = {
    basics: "基礎",
    conditionals: "條件",
    loops: "迴圈",
    arrays: "陣列",
    methods: "方法",
    oop: "OOP",
  };
  return map[topic] || topic || "Java";
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = el.id !== `screen-${id}`;
  });
}

function renderHome() {
  const saved = loadPlacement();
  const badge = $("#rank-badge");
  if (saved && saved.tierLabelZh) {
    badge.hidden = false;
    badge.textContent = `已定級：${saved.tierLabelZh} · ${saved.score} 分`;
  } else {
    badge.hidden = true;
  }
  showScreen("home");
}

function startPlacement() {
  state = {
    mode: "placement",
    targetDifficulty: 2,
    usedIds: new Set(),
    answers: [],
    current: null,
    index: 0,
    revealed: false,
    fallback: null,
  };
  nextPlacementQuestion();
  showScreen("quiz");
  renderQuiz();
}

function nextPlacementQuestion() {
  if (state.index >= TARGET_COUNT) return;
  let q = pickNext(bank, state.usedIds, state.targetDifficulty);
  if (!q) {
    if (!state.fallback) {
      state.fallback = buildFallbackDeck(bank, Date.now());
    }
    q = state.fallback.find((x) => !state.usedIds.has(x.id));
  }
  if (!q) {
    finishSession();
    return;
  }
  state.usedIds.add(q.id);
  state.current = q;
  state.revealed = false;
  state.userAnswer = null;
}

function startPool(pool) {
  const poolQs = bank.filter((q) => q.active && q.pool === pool);
  const shuffled = [...poolQs].sort(() => Math.random() - 0.5);
  const deck = shuffled.slice(0, POOL_SESSION_SIZE);
  if (deck.length === 0) {
    alert("題庫暫時冇題，請稍後再試。");
    return;
  }
  state = {
    mode: pool,
    deck,
    index: 0,
    answers: [],
    current: deck[0],
    revealed: false,
    userAnswer: null,
  };
  showScreen("quiz");
  renderQuiz();
}

function finishSession() {
  const correctCount = state.answers.filter((a) => a.correct).length;
  const totalXp = state.answers.reduce(
    (sum, a) => sum + (a.correct ? a.question.xp || 10 : 0),
    0
  );

  if (state.mode === "placement") {
    const outcome = evaluate(state.answers);
    savePlacement(outcome);
    $("#result-title").textContent = outcome.tierLabelZh;
    $("#result-score").textContent = `定級分數 ${outcome.score} / 100`;
    $("#result-explain").textContent = outcome.explanationZh;
    $("#result-stats").innerHTML = `
      <p>答對 <strong>${correctCount}</strong> / ${state.answers.length} 題</p>
      <p>建議池：<strong>${outcome.recommendedPool === "hardcore" ? "硬核" : "休閒"}</strong></p>
      <p>本輪獲得 <strong>${totalXp}</strong> XP（練習用）</p>
    `;
  } else {
    const poolName = state.mode === "hardcore" ? "硬核" : "休閒";
    $("#result-title").textContent = `${poolName}局結束`;
    $("#result-score").textContent = `${correctCount} / ${state.answers.length} 題正確`;
    $("#result-explain").textContent =
      correctCount === state.answers.length
        ? "全對！可以試硬核池或者重新定級挑戰。"
        : "睇返解析，錯題唔怕，再開一局鞏固。";
    $("#result-stats").innerHTML = `
      <p>本輪獲得 <strong>${totalXp}</strong> XP（練習用）</p>
    `;
  }
  showScreen("result");
}

function renderQuiz() {
  const q = state.current;
  if (!q) {
    finishSession();
    return;
  }

  const total =
    state.mode === "placement" ? TARGET_COUNT : state.deck.length;
  const done = state.index;
  $("#quiz-mode").textContent =
    state.mode === "placement"
      ? "定級排位"
      : state.mode === "hardcore"
        ? "硬核池"
        : "休閒池";
  $("#quiz-progress").textContent = `${done + 1} / ${total}`;
  $("#progress-fill").style.width = `${((done + 1) / total) * 100}%`;

  $("#q-topic").textContent = `${topicLabel(q.topic)} · 難度 ${q.difficulty}`;
  $("#q-stem").textContent = q.stem;

  const codeEl = $("#q-code");
  if (q.code) {
    codeEl.hidden = false;
    codeEl.textContent = q.code;
  } else {
    codeEl.hidden = true;
  }

  const opts = $("#q-options");
  const fill = $("#q-fill");
  const fb = $("#q-feedback");
  fb.hidden = true;

  $("#btn-submit").hidden = false;
  $("#btn-submit").disabled = true;
  $("#btn-next").hidden = true;

  if (isMcLike(q)) {
    fill.hidden = true;
    opts.hidden = false;
    opts.innerHTML = "";
    (q.options || []).forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt-btn";
      btn.dataset.id = opt.id;
      btn.innerHTML = `<span class="opt-label">${opt.id}</span>${escapeHtml(opt.text)}`;
      btn.addEventListener("click", () => selectMc(opt.id, btn));
      opts.appendChild(btn);
    });
  } else if (q.type === "fill") {
    opts.hidden = true;
    fill.hidden = false;
    const input = $("#fill-input");
    input.value = "";
    input.disabled = state.revealed;
    input.oninput = () => {
      $("#btn-submit").disabled = !input.value.trim();
    };
    setTimeout(() => input.focus(), 50);
  } else {
    opts.hidden = true;
    fill.hidden = true;
    $("#q-stem").textContent += "（此題型暫未支援）";
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function selectMc(id, btn) {
  if (state.revealed) return;
  state.userAnswer = id;
  $("#q-options").querySelectorAll(".opt-btn").forEach((b) => {
    b.classList.toggle("selected", b === btn);
  });
  $("#btn-submit").disabled = false;
}

function reveal() {
  const q = state.current;
  if (!q || state.revealed) return;

  let userAnswer = state.userAnswer;
  if (q.type === "fill") {
    userAnswer = $("#fill-input").value;
  }
  if (userAnswer == null || userAnswer === "") return;

  const ok = checkAnswer(q, userAnswer);
  state.revealed = true;
  state.answers.push({ question: q, correct: ok });

  const fb = $("#q-feedback");
  fb.hidden = false;
  fb.className = "feedback " + (ok ? "ok" : "bad");
  fb.innerHTML = ok
    ? `✓ 正確！<div class="xp">+${q.xp || 10} XP</div>`
    : `✗ 唔係呢個。正確：${escapeHtml(formatCorrect(q))}`;
  const explain = q.explain ? `<p style="margin-top:8px;color:var(--muted)">${escapeHtml(q.explain)}</p>` : "";
  fb.innerHTML += explain;

  if (isMcLike(q)) {
    $("#q-options").querySelectorAll(".opt-btn").forEach((b) => {
      b.disabled = true;
      const id = b.dataset.id;
      if (id === q.correct) b.classList.add("correct");
      else if (id === userAnswer && !ok) b.classList.add("wrong");
    });
  } else {
    $("#fill-input").disabled = true;
  }

  $("#btn-submit").hidden = true;
  $("#btn-next").hidden = false;

  if (state.mode === "placement") {
    state.targetDifficulty = adjustDifficulty(state.targetDifficulty, ok);
  }
}

function formatCorrect(q) {
  if (q.type === "fill") return q.correct;
  const opt = (q.options || []).find((o) => o.id === q.correct);
  return opt ? `${q.correct}. ${opt.text}` : q.correct;
}

function advance() {
  state.index += 1;
  if (state.mode === "placement") {
    if (state.index >= TARGET_COUNT) {
      finishSession();
      return;
    }
    nextPlacementQuestion();
    renderQuiz();
    return;
  }
  if (state.index >= state.deck.length) {
    finishSession();
    return;
  }
  state.current = state.deck[state.index];
  state.revealed = false;
  state.userAnswer = null;
  renderQuiz();
}

async function init() {
  $("#btn-placement").addEventListener("click", startPlacement);
  $("#btn-casual").addEventListener("click", () => startPool("casual"));
  $("#btn-hardcore").addEventListener("click", () => startPool("hardcore"));
  $("#btn-redo-placement").addEventListener("click", () => {
    clearPlacement();
    startPlacement();
  });
  $("#btn-home").addEventListener("click", renderHome);
  $("#btn-result-home").addEventListener("click", renderHome);
  $("#btn-submit").addEventListener("click", reveal);
  $("#btn-next").addEventListener("click", advance);
  $("#btn-quit").addEventListener("click", () => {
    if (confirm("確定退出本局？")) renderHome();
  });

  $("#fill-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !$("#btn-submit").disabled && !$("#btn-submit").hidden) {
      reveal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!$("#screen-quiz").hidden && isMcLike(state?.current) && !state?.revealed) {
      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key)) {
        const btn = $(`#q-options .opt-btn[data-id="${key}"]`);
        if (btn) selectMc(key, btn);
      }
      if (e.key === "Enter" && state.userAnswer) reveal();
    }
  });

  try {
    const res = await fetch("questions.json");
    const data = await res.json();
    bank = (data.questions || []).filter((q) => q.active !== false);
  } catch (err) {
    console.error(err);
    $("#load-error").hidden = false;
    return;
  }

  renderHome();
}

init();
