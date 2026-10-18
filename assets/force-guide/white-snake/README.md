# Force-Guide · 大白蛇擋路（逼人看攻略）

**Zone id:** `force-guide-serpent`  
**Pack root (canonical):** `/workspace/boss-hunt-zone/assets/force-guide/white-snake/`  
**Live relative (page):** `assets/force-guide/white-snake/` → `/workspace/boss-hunt/assets/force-guide/white-snake/`

專區標題：**白蛇擋路攻略 · 逼人看攻略 · 不看不給玩**

語氣：粵語 zh-Hant-HK、搞笑吐槽 From「資訊＝進度」。**唔好**喺頁面寫任何院校名稱。

## 檔案

| 檔 | 用途 |
|---|---|
| `guide.json` | 步驟、圖、tips、meta joke、unlock 設定 |
| `quiz.json` | 5 題多選；全對先解鎖 |
| `guide-loop.mp4` / `guide-loop.webm` | ~26s muted 720p 幻燈（path-imgs 03→07＋大字幕） |
| `frames/f01.webp` … `f04.webp` | 關鍵幀（入口／擋路／小屋／毒池） |
| `imgs/*.png` | 本站既有 path 截圖副本（唔好另畫遊戲圖） |
| `intro.mp4` | 可選；父 agent 有 GenerateVideo 先放入 |

## 網頁大臣接入

1. **專區容器** `id="force-guide-serpent"`（或 `data-zone="force-guide-serpent"`），標題用上面專區名。
2. **攻略片** autoplay / muted / loop / playsinline：

```html
<video
  id="force-guide-serpent-video"
  autoplay muted loop playsinline preload="metadata"
  poster="assets/force-guide/white-snake/frames/f02.webp"
>
  <source src="assets/force-guide/white-snake/guide-loop.webm" type="video/webm" />
  <source src="assets/force-guide/white-snake/guide-loop.mp4" type="video/mp4" />
</video>
```

3. **步驟 UI**：`fetch('assets/force-guide/white-snake/guide.json')` → `steps[]`（`image` 相對本 pack）。
4. **智力鎖**：`fetch('.../quiz.json')`，全部 `correctChoiceId` 答啱先寫：

```js
localStorage.setItem('bossHunt.forceGuide.serpent.unlocked', '1');
```

5. **鎖住遊玩區**：若 `localStorage.getItem('bossHunt.forceGuide.serpent.unlocked') !== '1'`，遮罩／`pointer-events:none`／隱藏 `#boss` 或 play area（見 `guide.json` → `unlock.locks`）。答錯硬失敗：顯示 `failMessageZh`，唔寫 unlock。
6. **可選 intro**：若存在 `intro.mp4`，可先播一次再切 loop；冇檔就只用 loop。

**唔好改** `sekiro-guardian-ape.html` 以外由素材大臣亂接——頁面 wiring 歸網頁大臣。

## 玩法對齊（同頁 STEP 04）

1. 毒紀念商人後入洞  
2. 大白蛇擋路  
3. 左矮台驚恐猴 → 傀儡術引開  
4. 鉤入小屋  
5. 出口鎖 → 連續向上鉤 → 葦名之底毒池鬼佛  
6. 傀儡術＝仙峰寺屏風猿；未有：先仙峰寺，或投身之所跳入之底  

## 驗收

- [ ] pack 有 quiz.json + guide.json + guide-loop.mp4 + frames + README  
- [ ] `/workspace/boss-hunt/assets/force-guide/white-snake/` 可相對路徑載入  
- [ ] 答錯唔解鎖；全對寫 `bossHunt.forceGuide.serpent.unlocked=1`
