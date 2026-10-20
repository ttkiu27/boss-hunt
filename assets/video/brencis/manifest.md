# Brencis boss-guide local clips

Dir: `/workspace/brencis-clips/`  
Encoded: H.264 + AAC, `+faststart`  
- Main fight pack (p1/p2): **640×360 @ 30fps, CRF 33, AAC 64k** (re-slimmed for CloudAgent 15 MB attach limit)  
- Other clips: 854×480 @ 30fps, CRF 30 (unchanged; already under limit)  
Pack total (mp4 only): **~32.7 MB**

## HTML hang note (for parent / CloudAgent)

When wiring `dawnwalker-brencis.html`:

- Prefer local via `data-clip-src` (hydrateMoveClips already does this).
- **KEEP** existing YouTube `data-yt-id` / `data-yt-start` / `data-yt-end` (or equivalent) as **backup**.
- Local clip wins when the file is present; if the clip is missing, fall back to YT timestamp jump.
- Do **not** strip YT attributes when adding local sources.

Suggested mapping (verify against live page card ids):

| Clip file | Role | Suggested data-clip-src |
|-----------|------|-------------------------|
| `p1-knyaz.mp4` | P1 Knyaz / marks / fight | `clips/brencis/p1-knyaz.mp4` (path TBD by parent) |
| `p2-ascendant.mp4` | P2 Ascendant | same folder |
| `defeat.mp4` | Defeat / outro | same folder |
| `wraiths-full-battle.mp4` | Clear wraiths overview (short) | same folder |
| `patricide-open.mp4` | Patricide open (shortened) | same folder |

## Clips

### 1. p1-knyaz.mp4 — SUCCESS (re-slimmed)

| Field | Value |
|-------|-------|
| Source YT | `H365eLChcFM` (No Damage Duelist) |
| Absolute start–end | 329–530 s (5:29–8:50) |
| Duration | 201.0 s |
| Size | **5.5 MB** (5,667,581 bytes) — was 14 MB |
| Codec | h264 / aac, **640×360** @ 30fps, CRF 33, AAC 64k |
| Playable | yes |

### 2. p2-ascendant.mp4 — SUCCESS (re-slimmed)

| Field | Value |
|-------|-------|
| Source YT | `H365eLChcFM` |
| Absolute start–end | 530–693 s (8:50–11:33) |
| Duration | 163.0 s |
| Size | **7.8 MB** (8,177,999 bytes) — was 20 MB |
| Codec | h264 / aac, **640×360** @ 30fps, CRF 33, AAC 64k |
| Playable | yes |
| Note | Full 530–693 kept; no time trim needed after CRF/scale |

### 3. defeat.mp4 — SUCCESS

| Field | Value |
|-------|-------|
| Source YT | `H365eLChcFM` |
| Absolute start–end | 693–750 s (11:33–12:30) |
| Duration | 57.0 s |
| Size | 5.1 MB (5,266,754 bytes) |
| Codec | h264 / aac, 854×480 @ 30fps |
| Playable | yes |
| Note | Cap at 750 as planned; outro window may need a slight trim after visual QA |

### 4. wraiths-full-battle.mp4 — SUCCESS (short overview)

| Field | Value |
|-------|-------|
| Source YT | `u54buF7T97o` |
| Absolute start–end | 294–450 s (requested overview; full chapter was 294–707) |
| Duration | 160.0 s |
| Size | 8.7 MB (9,023,336 bytes) |
| Codec | h264 / aac, 854×480 @ 30fps |
| Playable | yes |
| Note | Intentionally shorter than full 294–707 chapter to keep pack size down |

### 5. patricide-open.mp4 — SUCCESS (optional, shortened)

| Field | Value |
|-------|-------|
| Source YT | `Or_P84_IGJ0` |
| Absolute start–end | 331–450 s (full optional window was 331–735; shortened for size) |
| Duration | 120.0 s |
| Size | 5.6 MB (5,855,949 bytes) |
| Codec | h264 / aac, 854×480 @ 30fps |
| Playable | yes |

## Per-card short clips (`clips/`)

Cut 2026-10 for `dawnwalker-brencis.html` path steps + move cards (local `<video>`; YT attrs are tight backup only).

| File | Source | In-point | Length | Wired to |
|------|--------|----------|--------|----------|
| `clips/step-01-read-marks.mp4` | `p1-knyaz.mp4` | 0s | 22s | STEP 01 · READ MARKS |
| `clips/step-02-clear-wraiths.mp4` | `wraiths-full-battle.mp4` | 25s | 28s | STEP 02 |
| `clips/step-03-p1-punish.mp4` | `patricide-open.mp4` | 45s | 25s | STEP 03 |
| `clips/step-04-p2-ascendant.mp4` | `p2-ascendant.mp4` | 0s | 32s | STEP 04 |
| `clips/step-05-defeat.mp4` | `defeat.mp4` | 0s | 22s | STEP 05 |
| `clips/move-p1-phase.mp4` | `p1-knyaz.mp4` | 30s | 48s | move P1 card |
| `clips/move-p2-phase.mp4` | `p2-ascendant.mp4` | 40s | 48s | move P2 card |
| `clips/move-full-battle.mp4` | `wraiths-full-battle.mp4` | 55s | 42s | full battle card |
| `clips/move-lacra-confront.mp4` | `patricide-open.mp4` | 8s | 38s | Lacra confront card |

**Still YT-only (~48s embed window, no local file):** `move-lacra-fight`, `move-lacra-short`, `move-emmie`, `move-early-p1`, `move-early-p2`, all `move-ending-*`, `move-lacra-full` (yt-dlp blocked in CI; add local cuts when a source mp4 is available).

## Summary

| Clip | Status | Size | Duration | Under 14 MB |
|------|--------|------|----------|-------------|
| p1-knyaz.mp4 | OK (slim) | **5.5 MB** | 201 s | yes |
| p2-ascendant.mp4 | OK (slim) | **7.8 MB** | 163 s | yes |
| defeat.mp4 | OK | 5.1 MB | 57 s | yes |
| wraiths-full-battle.mp4 | OK | 8.7 MB | 160 s | yes |
| patricide-open.mp4 | OK | 5.6 MB | 120 s | yes |
| **Pack total** | | **~32.7 MB** | | all <14 MB |

Re-slim: 640×360, CRF 33, AAC 64k for p1/p2 only. No git commit / PR from this agent.
