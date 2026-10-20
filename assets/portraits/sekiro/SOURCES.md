# Sekiro hub BOSS portraits — sources

Collected 2026-10-20 (Asia/Hong_Kong). Game-original / wiki character renders (in-game model shots used as infobox/memory art). **Not** watercolor substitutes, **not** route-map screenshots.

## Slug mapping (live hub https://ttkiu27.github.io/boss-hunt/)

| Hub label (zh) | English | Page slug | Portrait file |
|---|---|---|---|
| 枷鎖鬼 | Chained Ogre | `sekiro-chained-ogre` | `sekiro-chained-ogre-portrait.{png,jpg}` |
| 鬼形部正孝 | Gyoubu Masataka Oniwa | `sekiro-gyoubu` | `sekiro-gyoubu-portrait.{png,jpg}` |
| 蝴蝶夫人 | Lady Butterfly | `sekiro-lady-butterfly` | `sekiro-lady-butterfly-portrait.{png,jpg}` |
| 葦名弦一郎 | Genichiro Ashina | `sekiro-genichiro` | `sekiro-genichiro-portrait.{png,jpg}` |
| 獅猿 | Guardian Ape | `sekiro-guardian-ape` | `sekiro-guardian-ape-portrait.{png,jpg}` |

### Name note: 「義生」
「義生」 is **not** a standard Sekiro CN/JP boss name. On the live hub the slot between 枷鎖鬼 and 蝴蝶夫人 is **鬼形部正孝** (`sekiro-gyoubu`). That is how this pack treats the second request. It is **not** Isshin (一心), **not** Owl (梟), **not** Genichiro (弦一郎). 枷鎖鬼 is **Chained Ogre**, not Gyoubu.

## Primary sources (PNG + JPEG copies)

1. **sekiro-chained-ogre-portrait**
   - URL: https://static.wikia.nocookie.net/shadowsdietwice/images/0/0d/Chained_Ogre.png/revision/latest?cb=20190427165630
   - Page: https://sekiro-shadows-die-twice.fandom.com/wiki/Chained_Ogre
   - Notes: Vertical 480×650 in-game character shot (wiki infobox style). Clear red-eyed ogre + cangue.

2. **sekiro-gyoubu-portrait**
   - URL: https://static.wikia.nocookie.net/sekiro/images/1/15/Gyoubu_Masataka_Oniwa.png/revision/latest?cb=20190427204739&path-prefix=es
   - Page: Spanish Sekiro Fandom / EN wiki character set
   - Notes: Vertical 480×650 half-body rider+horse (antler kabuto). Preferred over wide Reflection splash for card headers.

3. **sekiro-lady-butterfly-portrait**
   - URL: https://static.wikia.nocookie.net/shadowsdietwice/images/f/f6/Lady_Butterfly_Infobox.png/revision/latest?cb=20190502190530
   - Page: https://sekiro-shadows-die-twice.fandom.com/wiki/Lady_Butterfly (File:Lady Butterfly Infobox.png)
   - Notes: Vertical 480×650 full-body in-game model in Hirata chamber; kunai pose.

4. **sekiro-genichiro-portrait**
   - URL: https://static.wikia.nocookie.net/shadowsdietwice/images/6/60/Genichiro_Ashina.png/revision/latest?cb=20190418124558
   - Page: https://sekiro-shadows-die-twice.fandom.com/wiki/Genichiro_Ashina
   - Notes: Vertical 480×650 armored Genichiro (kabuto + jinbaori + bow) — matches hub 「天守閣」 first fight, not Way of Tomoe shirtless form. CDN re-encodes aggressively (~36–42 KB); usable but softer than siblings. Tomoe/Memory alternatives kept under `candidates/` if needed later.

5. **sekiro-guardian-ape-portrait**
   - URL: https://static.wikia.nocookie.net/shadowsdietwice/images/7/74/Guardian_Ape.png/revision/latest?cb=20190505203058
   - Page: https://sekiro-shadows-die-twice.fandom.com/wiki/Guardian_Ape
   - Notes: Vertical 480×650 in-game model (white fur, sword in neck). Clear, no HUD.

## Bonus square crops (card header)

Same subjects, LANCZOS upscaled to 1024×1024 JPEG (upper/center crop):

- `sekiro-*-portrait-square.jpg`

## Rejected / not used as primary

- Reflection / ButterflyMenu wide splashes (1312×768): cinematic, less crop-friendly for hub thumbs.
- Gameplay shots with FPS overlay (`Genichiro_01.png`).
- Biligame fan painting of Genichiro (signed “Ogamiya Jin”).
- Biligame hitbox/wireframe ape dump.
- Watercolor hub banners (`boss-hunt-art/*watercolor*`).

## Onimusha Way of the Sword — existing under /workspace

**No dedicated `onimusha-wots-*-portrait` image files found.** Related assets only:

| Path | Notes |
|---|---|
| `/workspace/onimusha-wots-boss-rematch-roster-2026-10-18.md` | roster notes |
| `/workspace/onimusha-wots-priority-bosses-page-assets-2026-10-18.md` | page asset notes |
| `/workspace/boss-hunt-art/cards/card-onimusha-square.jpg` | watercolor-style game card (not boss portrait) |
| `/workspace/boss-hunt-art/banners/banner-onimusha-watercolor.jpg` | watercolor banner |
| `/workspace/onimusha-clips/...` | gameplay clip frames (not official portraits) |

## Repo paths (this site)

```
assets/portraits/sekiro/sekiro-*-portrait.jpg
assets/portraits/sekiro/sekiro-*-portrait-square.jpg   ← hub BOSS card thumbs
assets/portraits/sekiro/SOURCES.md
```

Miss list: **none** for the five hub bosses (all five delivered). Genichiro is the softest file due to CDN compression.
