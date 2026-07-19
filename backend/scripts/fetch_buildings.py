"""Fetch building photos from Wikipedia page images and attach them to projects.

Run from backend/:  .venv/Scripts/python scripts/fetch_buildings.py
Idempotent — skips projects that already have an image_url.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx  # noqa: E402

from app.core.db import SessionLocal  # noqa: E402
from app.core.storage import store_image  # noqa: E402
from app.models import Project  # noqa: E402

# project slug -> candidate Wikipedia page titles (first hit wins)
WIKI_PAGES = {
    "avari-hotel": ["Avari Towers", "Avari Hotels"],
    "pearl-continental-hotel": ["Pearl Continental Hotel, Karachi", "Pearl-Continental Hotels & Resorts"],
    "pakistan-stock-exchange": ["Pakistan Stock Exchange", "Karachi Stock Exchange"],
    "faysal-bank-ahr-branch": ["Faysal Bank"],
    "faysal-house-shahrah-e-faisal": ["Faysal Bank"],
    "liaquat-national-hospital": ["Liaquat National Hospital"],
    "tabba-heart-institute": ["Tabba Heart Institute"],
    "shaheen-complex": ["Shaheen Complex"],
    "al-tijarah-center-shahrah-e-faisal": ["Al-Tijarah Center"],
}

API = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "HiTechEngineeringWebsite/1.0 (project photos; contact: hi.techengineering1971@gmail.com)"}


def page_image_url(title: str) -> str | None:
    r = httpx.get(
        API,
        params={
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": 1000,
            "redirects": 1,
        },
        headers=HEADERS,
        timeout=30,
    )
    r.raise_for_status()
    for page in r.json().get("query", {}).get("pages", {}).values():
        thumb = page.get("thumbnail", {}).get("source")
        if thumb and not thumb.lower().endswith(".svg"):
            return thumb
    return None


def main() -> None:
    db = SessionLocal()
    cache: dict[str, str] = {}
    try:
        for slug, titles in WIKI_PAGES.items():
            project = db.query(Project).filter(Project.slug == slug).first()
            if not project:
                print(f"skip (no project): {slug}")
                continue
            if project.image_url:
                print(f"skip (has photo): {slug}")
                continue
            for title in titles:
                try:
                    if title in cache:
                        project.image_url = cache[title]
                        print(f"reused:   {slug} <- {title}")
                        break
                    url = page_image_url(title)
                    if not url:
                        continue
                    img = httpx.get(url, headers=HEADERS, timeout=30, follow_redirects=True)
                    img.raise_for_status()
                    stored = store_image(img.content, f"{slug}-building.jpg", kind="photo")
                    project.image_url = stored
                    cache[title] = stored
                    print(f"fetched:  {slug} <- {title} ({url.rsplit('/', 1)[-1]})")
                    break
                except Exception as exc:  # noqa: BLE001 — try the next candidate title
                    print(f"failed:   {slug} / {title}: {exc}")
            else:
                print(f"no photo: {slug}")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
