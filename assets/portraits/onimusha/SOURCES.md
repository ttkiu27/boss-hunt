# Onimusha: Way of the Sword — Boss portrait sources

Collected 2026-10-21 (Asia/Hong_Kong) for boss-hunt site.
Preference: Capcom official character art / studio renders. No watercolor / AI substitutes.

License note: All Capcom assets © CAPCOM. For fan site / editorial use of publicly released promotional art. Creative Uncut hosts Capcom-released official art galleries.

## Existing on disk (NOT used as replacements)
- `/workspace/boss-hunt-art/banners/banner-onimusha-watercolor.jpg` — watercolor banner (superseded)
- `/workspace/boss-hunt-art/cards/card-onimusha-square.jpg` — watercolor card (superseded)
- `/workspace/onimusha-clips/` — motion/clips only, no boss portraits

---

## GOT — official Capcom character art / studio renders

| slug | files | source | URL |
|------|-------|--------|-----|
| byakue | `onimusha-byakue-portrait.png` + `-square.jpg` | Creative Uncut official art gallery (Capcom) | https://www.creativeuncut.com/gallery-50/owots-byakue.html → `gallery-50/art/owots-byakue.jpg` |
| dohatsu-ten | `onimusha-dohatsu-ten-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-dohatsu-ten.html |
| sasaki-ganryu | `onimusha-sasaki-ganryu-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-sasaki-ganryu.html |
| sasaki-ganryu (extra artwork) | `onimusha-sasaki-ganryu-artwork-portrait.png` + `-square.jpg` | Creative Uncut artwork variant | https://www.creativeuncut.com/gallery-50/owots-sasaki-ganryu-artwork.html |
| daidara | `onimusha-daidara-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-daidara.html |
| rasho-gan | `onimusha-rasho-gan-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-rasho-gan.html |
| greater-nue | `onimusha-greater-nue-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-greater-nue.html |
| dokyo | `onimusha-dokyo-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-dokyo.html |
| shuten-doji | `onimusha-shuten-doji-portrait.png` + `-square.jpg` | Creative Uncut official art | https://www.creativeuncut.com/gallery-50/owots-shuten-doji.html |
| ifuu | `onimusha-ifuu-portrait.png` + `-square.jpg` | Capcom PR Times #5964 studio render (6th trailer press; 畏風) | https://prtimes.jp/main/html/rd/p/000005964.000013450.html → `13450-5964-d446e64a…-1080x903.png` |
| burai | `onimusha-burai-portrait.png` + `-square.jpg` | Capcom PR Times #5964 studio render (撫雷; naginata) | same PR → `13450-5964-5128efed…-1800x1504.png` |
| ifuu-burai | `onimusha-ifuu-burai-portrait.png` + `-square.jpg` | Duo: wiki in-game still (solos above preferred for cards) | https://onimushawiki.com/_astro/ifuu-burai-duo.DdS7gbBy.jpg |

Also archived Capcom PR character-intro promos (JP text overlays) under `extras-*-prpromo.jpg` from https://prtimes.jp/main/html/rd/p/000005950.000013450.html (Rasho-gan, Daidara, Dokyo, Shuten Doji, Ganryu).

Raw CU downloads: `raw/owots-*.jpg`. PR kit: `pr-extra/`, `prtimes/`.

---

## FALLBACK — clear in-game (no separate official portrait page found)

| slug | files | source | note |
|------|-------|--------|------|
| nue-blue-red | `onimusha-nue-blue-red-portrait.png` + `-square.jpg` | onimushawiki Nue guide still | Official CU art exists for **Greater Nue** only; Blue+Red duo has no standalone Capcom character-art page in CU gallery |
| benkei | `onimusha-benkei-portrait.png` + `-square.jpg` | onimushawiki Benkei guide | Not on Capcom 20-character public sheet / CU gallery |
| yoshitsune | `onimusha-yoshitsune-portrait.png` + `-square.jpg` | onimushawiki Yoshitsune guide | Final boss; no CU official portrait found |

Wiki originals also in `wiki/`.

---

## MISS — no official portrait file found this pass

| slug | status |
|------|--------|
| sasaki-ganryu-altered (異形巖流) | **MISS** standalone official still. Capcom Curious Cases / site copy describes transformed Ganryu; Reddit claims official images exist, but Capcom CDN age-gated (CloudFront 403 from this box) and no CU gallery entry. Do **not** watercolor. Use base `sasaki-ganryu` art + note, or wait for Capcom character CDN. |
| nue-blue / nue-red as separate solos | **MISS** — only Greater Nue official art + duo gameplay still |

Capcom official character pages (`capcom-games.com/onimusha/ws/*/character/`) returned CloudFront 403 from this environment; CU + Capcom PR Times used as public Capcom-released mirrors.

---

## Inventory (hub repo)

```
assets/portraits/onimusha/onimusha-*-portrait.png
assets/portraits/onimusha/onimusha-*-portrait-square.jpg
assets/portraits/onimusha/SOURCES.md
```

Hub card for `sasaki-ganryu-altered` reuses `onimusha-sasaki-ganryu-portrait-square.jpg` (slight blur) until standalone official art is available — see MISS table above.

Square crops are 1024×1024 JPEG for card headers.
