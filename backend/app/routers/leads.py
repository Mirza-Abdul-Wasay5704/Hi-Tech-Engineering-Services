from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.email import send_lead_notification
from ..core.security import get_current_admin
from ..models import Lead
from ..schemas import LeadCreate, LeadOut, LeadUpdate

router = APIRouter(prefix="/api/leads", tags=["leads"])
limiter = Limiter(key_func=get_remote_address)


@router.post("", response_model=LeadOut)
@limiter.limit("5/minute")
def create_lead(request: Request, body: LeadCreate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if body.website:  # honeypot filled → bot
        raise HTTPException(status_code=400, detail="Invalid submission")
    lead = Lead(**body.model_dump(exclude={"website"}))
    db.add(lead)
    db.commit()
    db.refresh(lead)
    tasks.add_task(send_lead_notification, body.model_dump(exclude={"website"}))
    return lead


@router.get("", response_model=list[LeadOut], dependencies=[Depends(get_current_admin)])
def list_leads(db: Session = Depends(get_db)):
    return db.query(Lead).order_by(Lead.created_at.desc()).all()


@router.patch("/{lead_id}", response_model=LeadOut, dependencies=[Depends(get_current_admin)])
def update_lead(lead_id: int, body: LeadUpdate, db: Session = Depends(get_db)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if body.status not in ("new", "contacted", "closed"):
        raise HTTPException(status_code=422, detail="Invalid status")
    lead.status = body.status
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}", dependencies=[Depends(get_current_admin)])
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return {"ok": True}
