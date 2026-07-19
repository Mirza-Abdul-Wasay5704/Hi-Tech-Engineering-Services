import logging

import httpx

from .config import settings

logger = logging.getLogger(__name__)


def trigger_revalidate(paths: list[str]) -> None:
    """Ask the Next.js frontend to re-render the given paths. Best-effort."""
    try:
        httpx.post(
            f"{settings.frontend_url}/api/revalidate",
            json={"secret": settings.revalidate_secret, "paths": paths},
            timeout=10,
        )
    except Exception as exc:  # noqa: BLE001 — revalidation must never break admin saves
        logger.warning("Revalidation call failed: %s", exc)
