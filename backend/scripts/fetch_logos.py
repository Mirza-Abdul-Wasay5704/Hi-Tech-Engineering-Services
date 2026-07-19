"""Fetch client logos from Wikipedia infobox logo files and attach them to seeded projects.

Run from backend/:  .venv/Scripts/python scripts/fetch_logos.py [--reset]
Idempotent — skips projects that already have a logo_url. Projects without a
findable logo keep the styled text-mark fallback on the site.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx  # noqa: E402

from app.core.db import SessionLocal  # noqa: E402
from app.core.storage import store_image  # noqa: E402
from app.models import Project  # noqa: E402

# project slug -> English Wikipedia page title
WIKI_PAGES = {
    "avari-hotel": "Avari Hotels",
    "pearl-continental-hotel": "Pearl-Continental Hotels & Resorts",
    "pakistan-stock-exchange": "Pakistan Stock Exchange",
    "parco-pak-arab-refinery": "Pak-Arab Refinery",
    "faysal-bank-ahr-branch": "Faysal Bank",
    "faysal-house-shahrah-e-faisal": "Faysal Bank",
    "liaquat-national-hospital": "Liaquat National Hospital",
    "tabba-heart-institute": "Tabba Heart Institute",
    "tabba-heart-outreach-dha": "Tabba Heart Institute",
}

API = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "HiTechEngineeringWebsite/1.0 (logo wall; contact: hi.techengineering1971@gmail.com)"}


def find_logo_file(title: str) -> str | None:
    """Return the File: title of a logo image used on the page, if any."""
    r = httpx.get(
        API,
        params={"action": "query", "titles": title, "prop": "images", "imlimit": 50, "format": "json", "redirects": 1},
        headers=HEADERS,
        timeout=30,
    )
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for page in pages.values():
        for img in page.get("images", []):
            name = img.get("title", "")
            if "logo" in name.lower() and name.lower().endswith((".svg", ".png", ".jpg", ".jpeg", ".webp")):
                return name
    return None


def file_url(file_title: str) -> str | None:
    r = httpx.get(
        API,
        params={
            "action": "query",
            "titles": file_title,
            "prop": "imageinfo",
            "iiprop": "url",
            # rasterize SVGs to PNG at a sane width for the logo wall
            "iiurlwidth": 600,
            "format": "json",
        },
        headers=HEADERS,
        timeout=30,
    )
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for page in pages.values():
        info = page.get("imageinfo", [{}])[0]
        return info.get("thumburl") or info.get("url")
    return None


def main() -> None:
    reset = "--reset" in sys.argv
    db = SessionLocal()
    cache: dict[str, str] = {}
    try:
        if reset:
            for slug in WIKI_PAGES:
                p = db.query(Project).filter(Project.slug == slug).first()
                if p:
                    p.logo_url = ""
            db.commit()
            print("cleared existing logo urls")

        for slug, title in WIKI_PAGES.items():
            project = db.query(Project).filter(Project.slug == slug).first()
            if not project:
                print(f"skip (no project): {slug}")
                continue
            if project.logo_url:
                print(f"skip (has logo):  {slug}")
                continue
            try:
                if title in cache:
                    project.logo_url = cache[title]
                    print(f"reused:           {slug} <- {title}")
                    continue
                logo_file = find_logo_file(title)
                if not logo_file:
                    print(f"no logo file:     {title} (text card fallback)")
                    continue
                url = file_url(logo_file)
                if not url:
                    print(f"no file url:      {logo_file}")
                    continue
                img = httpx.get(url, headers=HEADERS, timeout=30, follow_redirects=True)
                img.raise_for_status()
                stored = store_image(img.content, f"{slug}-logo{Path(url.split('?')[0]).suffix or '.png'}", kind="logo")
                project.logo_url = stored
                cache[title] = stored
                print(f"fetched:          {slug} <- {logo_file}")
            except Exception as exc:  # noqa: BLE001 — one bad logo shouldn't stop the rest
                print(f"FAILED:           {slug}: {exc}")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
