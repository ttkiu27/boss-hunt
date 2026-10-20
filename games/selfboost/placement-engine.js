/**
 * Adaptive placement (~10 questions) — mirrors PlacementEngine.kt
 */
export const TARGET_COUNT = 10;
const PLACEMENT_POOLS = new Set(["casual", "hardcore"]);

export function pickNext(allQuestions, usedIds, targetDifficulty) {
  const pool = allQuestions.filter(
    (q) => q.active && !usedIds.has(q.id) && PLACEMENT_POOLS.has(q.pool)
  );
  if (pool.length === 0) return null;
  const band = pool.filter((q) => Math.abs(q.difficulty - targetDifficulty) <= 1);
  const candidates = band.length > 0 ? band : pool;
  let best = null;
  let bestDist = Infinity;
  for (const q of candidates) {
    const d = Math.abs(q.difficulty - targetDifficulty);
    if (d < bestDist) {
      bestDist = d;
      best = q;
    }
  }
  return best ?? candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}

export function adjustDifficulty(current, correct) {
  if (correct) return Math.min(4, current + 1);
  return Math.max(1, current - 1);
}

export function evaluate(answers) {
  if (!answers.length) return outcomeForScore(0);
  let earned = 0;
  let possible = 0;
  for (const { question: q, correct: ok } of answers) {
    const w = Math.min(4, Math.max(1, q.difficulty));
    possible += w * 10;
    earned += ok ? w * 10 : w * 2;
  }
  const score = Math.min(
    100,
    Math.max(0, Math.round((earned / Math.max(1, possible)) * 100))
  );
  return outcomeForScore(score);
}

function outcomeForScore(score) {
  if (score < 36) {
    return {
      tierLabelZh: "新手",
      explanationZh:
        "基礎語法同變數仲需要多啲練習。建議由休閒池同「基礎入門」主題慢慢跟。",
      rankId: "iron_iv",
      recommendedPool: "casual",
      recommendedLevelId: "lv_basics_01",
      score,
    };
  }
  if (score < 56) {
    return {
      tierLabelZh: "入門",
      explanationZh:
        "已掌握基本題型，但讀碼同陷阱題仍會失手。休閒每日池最啱你穩定上分。",
      rankId: "bronze_iv",
      recommendedPool: "casual",
      recommendedLevelId: "lv_basics_01",
      score,
    };
  }
  if (score < 73) {
    return {
      tierLabelZh: "進階",
      explanationZh:
        "多數中難度題答得穩，可以開始挑戰硬核池同條件／迴圈主題。",
      rankId: "silver_iv",
      recommendedPool: "casual",
      recommendedLevelId: "lv_conditionals_01",
      score,
    };
  }
  if (score < 89) {
    return {
      tierLabelZh: "高手",
      explanationZh:
        "高難度題表現唔錯，適合硬核每日池同陣列／方法主題關。",
      rankId: "gold_iv",
      recommendedPool: "hardcore",
      recommendedLevelId: "lv_arrays_01",
      score,
    };
  }
  return {
    tierLabelZh: "王者試練",
    explanationZh:
      "定級表現極佳！建議直接開硬核池，主題可挑方法或 OOP 關卡。",
    rankId: "platinum_iv",
    recommendedPool: "hardcore",
    recommendedLevelId: "lv_methods_01",
    score,
  };
}

export function buildFallbackDeck(all, seed) {
  const pool = all.filter((q) => q.active && PLACEMENT_POOLS.has(q.pool));
  const shuffled = shuffleSeeded(pool, seed);
  return shuffled.slice(0, TARGET_COUNT);
}

function shuffleSeeded(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
