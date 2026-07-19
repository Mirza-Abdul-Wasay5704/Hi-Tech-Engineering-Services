import logging

import httpx

from .config import settings

logger = logging.getLogger(__name__)


def send_lead_notification(lead: dict) -> None:
    """Email the owner about a new inquiry via Resend. Best-effort."""
    if not settings.resend_api_key:
        logger.info("RESEND_API_KEY not set — skipping lead email")
        return
    html = (
        f"<h2>New inquiry from the website</h2>"
        f"<p><b>Name:</b> {lead.get('name', '')}</p>"
        f"<p><b>Company:</b> {lead.get('company', '')}</p>"
        f"<p><b>Email:</b> {lead.get('email', '')}</p>"
        f"<p><b>Phone:</b> {lead.get('phone', '')}</p>"
        f"<p><b>Service:</b> {lead.get('service', '')}</p>"
        f"<p><b>Message:</b></p><p>{lead.get('message', '')}</p>"
    )
    try:
        httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json={
                "from": settings.lead_from_email,
                "to": [settings.lead_notify_email],
                "subject": f"New website inquiry — {lead.get('name', '')}",
                "html": html,
            },
            timeout=15,
        )
    except Exception as exc:  # noqa: BLE001 — email failure must not lose the lead
        logger.warning("Lead email failed: %s", exc)
