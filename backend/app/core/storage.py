import io
import re
import time
from pathlib import Path

import httpx
from PIL import Image

from .config import settings

UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"

MAX_DIMENSION = 1600
LOGO_MAX_DIMENSION = 480


def _slugify(name: str) -> str:
    stem = Path(name).stem.lower()
    return re.sub(r"[^a-z0-9]+", "-", stem).strip("-") or "file"


def process_image(data: bytes, kind: str = "photo") -> tuple[bytes, str]:
    """Resize and convert to webp (photos) or keep png for logos with alpha."""
    img = Image.open(io.BytesIO(data))
    max_dim = LOGO_MAX_DIMENSION if kind == "logo" else MAX_DIMENSION
    img.thumbnail((max_dim, max_dim), Image.LANCZOS)
    out = io.BytesIO()
    if kind == "logo" and (img.mode in ("RGBA", "LA", "P")):
        img.save(out, format="PNG", optimize=True)
        return out.getvalue(), "png"
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    img.save(out, format="WEBP", quality=82)
    return out.getvalue(), "webp"


def store_image(data: bytes, filename: str, kind: str = "photo") -> str:
    """Store the image and return its public URL.

    Uses Supabase Storage when configured, otherwise the local ./uploads dir
    (served at /uploads in dev).
    """
    if filename.lower().endswith(".svg") or data[:200].lstrip().startswith((b"<svg", b"<?xml")):
        processed, ext, content_type = data, "svg", "image/svg+xml"
    else:
        processed, ext = process_image(data, kind)
        content_type = "image/png" if ext == "png" else "image/webp"
    key = f"{kind}s/{_slugify(filename)}-{int(time.time())}.{ext}"

    if settings.supabase_url and settings.supabase_service_key:
        resp = httpx.post(
            f"{settings.supabase_url}/storage/v1/object/{settings.supabase_bucket}/{key}",
            content=processed,
            headers={
                "Authorization": f"Bearer {settings.supabase_service_key}",
                "Content-Type": content_type,
                "x-upsert": "true",
            },
            timeout=30,
        )
        resp.raise_for_status()
        return f"{settings.supabase_url}/storage/v1/object/public/{settings.supabase_bucket}/{key}"

    dest = UPLOADS_DIR / key
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(processed)
    return f"/uploads/{key}"
