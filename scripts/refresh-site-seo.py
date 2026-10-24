#!/usr/bin/env python3
"""Regenerate sitemap.xml and inject shared head SEO blocks into public HTML pages."""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

BASE_URL = "https://ttkiu27.github.io/boss-hunt"
DEFAULT_OG_IMAGE = f"{BASE_URL}/assets/art/type-portrait-knight-helm.jpg"
SITE_NAME = "BOSS 獵殺區"

ROOT = Path(__file__).resolve().parent.parent

SEO_BEGIN = "<!-- site-seo:begin -->"
SEO_END = "<!-- site-seo:end -->"

# Public HTML paths relative to site root (POSIX-style).
HTML_GLOBS = (
    "*.html",
    "qigong-bios/*.html",
    "games/selfboost/index.html",
    "games/selfboost-app/index.html",
)

FALLBACK_DESCRIPTIONS: dict[str, str] = {
    "games/selfboost-app/index.html": (
        "SelfBoost 網頁版題庫：瀏覽器即開即玩。玩家社群整理，非遊戲官方。"
    ),
}


def discover_html_files() -> list[Path]:
    found: set[Path] = set()
    for pattern in HTML_GLOBS:
        for path in ROOT.glob(pattern):
            if path.is_file() and path.suffix.lower() == ".html":
                found.add(path)
    return sorted(found, key=lambda p: p.as_posix())


def rel_site_path(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return ""
    return rel


def page_url(path: Path) -> str:
    rel = rel_site_path(path)
    if not rel:
        return f"{BASE_URL}/"
    return f"{BASE_URL}/{rel}"


def extract_tag_content(source: str, tag: str) -> str | None:
    # <title>...</title> or meta name="description" content="..."
    if tag == "title":
        m = re.search(r"<title[^>]*>(.*?)</title>", source, re.I | re.S)
        return html.unescape(m.group(1).strip()) if m else None
    m = re.search(
        r'<meta\s+[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']',
        source,
        re.I | re.S,
    )
    if not m:
        m = re.search(
            r'<meta\s+[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']',
            source,
            re.I | re.S,
        )
    return html.unescape(m.group(1).strip()) if m else None


def ensure_description(source: str, rel_path: str) -> tuple[str, str]:
    desc = extract_tag_content(source, "description")
    if desc:
        return source, desc
    fallback = FALLBACK_DESCRIPTIONS.get(rel_path)
    if not fallback:
        raise ValueError(f"Missing meta description: {rel_path}")
    insert_after = re.search(r"<meta\s+name=[\"']viewport[\"'][^>]*/>\s*", source, re.I)
    if not insert_after:
        raise ValueError(f"Cannot insert description (no viewport meta): {rel_path}")
    pos = insert_after.end()
    snippet = f'<meta name="description" content="{html.escape(fallback, quote=True)}" />\n'
    source = source[:pos] + snippet + source[pos:]
    return source, fallback


def build_json_ld(path: Path, title: str, description: str, url: str) -> dict:
    if path.relative_to(ROOT).as_posix() == "index.html":
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": f"{BASE_URL}/",
            "description": description,
        }
    schema_type = "Article" if "qigong-bios/" in path.as_posix() else "WebPage"
    doc: dict = {
        "@context": "https://schema.org",
        "@type": schema_type,
        "name": title,
        "url": url,
        "description": description,
        "isPartOf": {
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": f"{BASE_URL}/",
        },
    }
    return doc


def build_seo_block(path: Path, title: str, description: str) -> str:
    url = page_url(path)
    esc_title = html.escape(title, quote=True)
    esc_desc = html.escape(description, quote=True)
    esc_url = html.escape(url, quote=True)
    esc_image = html.escape(DEFAULT_OG_IMAGE, quote=True)
    ld = json.dumps(build_json_ld(path, title, description, url), ensure_ascii=False, separators=(",", ":"))
    lines = [
        SEO_BEGIN,
        f'<link rel="canonical" href="{esc_url}" />',
        f'<meta property="og:title" content="{esc_title}" />',
        f'<meta property="og:description" content="{esc_desc}" />',
        f'<meta property="og:url" content="{esc_url}" />',
        f'<meta property="og:type" content="website" />',
        f'<meta property="og:image" content="{esc_image}" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{esc_title}" />',
        f'<meta name="twitter:description" content="{esc_desc}" />',
        f'<meta name="twitter:image" content="{esc_image}" />',
        f'<script type="application/ld+json">{ld}</script>',
        SEO_END,
    ]
    return "\n".join(lines) + "\n"


def inject_seo(source: str, block: str) -> str:
    pattern = re.compile(
        rf"{re.escape(SEO_BEGIN)}.*?{re.escape(SEO_END)}\s*",
        re.S,
    )
    if pattern.search(source):
        return pattern.sub(block, source, count=1)
    # Insert after meta description when present.
    m = re.search(
        r'(<meta\s+[^>]*name=["\']description["\'][^>]*/>\s*)',
        source,
        re.I,
    )
    if m:
        return source[: m.end()] + block + source[m.end() :]
    raise ValueError("Could not find insertion point for SEO block")


def write_sitemap(paths: list[Path]) -> None:
    entries: list[tuple[str, float]] = []
    for path in paths:
        rel = rel_site_path(path)
        loc = page_url(path)
        if rel == "":
            priority = 1.0
        elif "onimusha-sasaki-ganryu-altered" in rel or "onimusha-shuten-doji" in rel or "onimusha-yoshitsune" in rel:
            priority = 0.9
        else:
            priority = 0.6
        entries.append((loc, priority))
    entries.sort(key=lambda x: x[0])

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, priority in entries:
        lines.append(
            f"  <url><loc>{loc}</loc><changefreq>weekly</changefreq><priority>{priority:.1f}</priority></url>"
        )
    lines.append("</urlset>")
    lines.append("")
    (ROOT / "sitemap.xml").write_text("\n".join(lines), encoding="utf-8")


def process_file(path: Path) -> None:
    rel_path = path.relative_to(ROOT).as_posix()
    source = path.read_text(encoding="utf-8")
    source, description = ensure_description(source, rel_path)
    title = extract_tag_content(source, "title")
    if not title:
        raise ValueError(f"Missing <title>: {rel_path}")
    block = build_seo_block(path, title, description)
    updated = inject_seo(source, block)
    if updated != source:
        path.write_text(updated, encoding="utf-8")


def main() -> int:
    paths = discover_html_files()
    for path in paths:
        process_file(path)
    write_sitemap(paths)
    print(f"Updated {len(paths)} HTML pages and sitemap.xml")
    return 0


if __name__ == "__main__":
    sys.exit(main())
