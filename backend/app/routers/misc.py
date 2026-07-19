from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.revalidate import trigger_revalidate
from ..core.security import get_current_admin
from ..core.storage import store_image
from ..models import SiteSettings, Testimonial
from ..schemas import TestimonialBase, TestimonialOut

router = APIRouter(prefix="/api", tags=["misc"])

ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    row = db.get(SiteSettings, 1)
    return row.data if row else {}


@router.put("/settings", dependencies=[Depends(get_current_admin)])
def update_settings(data: dict, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    row = db.get(SiteSettings, 1)
    if not row:
        row = SiteSettings(id=1, data=data)
        db.add(row)
    else:
        row.data = data
    db.commit()
    tasks.add_task(trigger_revalidate, ["/", "/about", "/contact", "/services", "/projects"])
    return row.data


@router.get("/testimonials", response_model=list[TestimonialOut])
def list_testimonials(all: bool = False, db: Session = Depends(get_db)):
    q = db.query(Testimonial)
    if not all:
        q = q.filter(Testimonial.published.is_(True))
    return q.order_by(Testimonial.sort_order, Testimonial.id).all()


@router.post("/testimonials", response_model=TestimonialOut, dependencies=[Depends(get_current_admin)])
def create_testimonial(body: TestimonialBase, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    t = Testimonial(**body.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    tasks.add_task(trigger_revalidate, ["/"])
    return t


@router.delete("/testimonials/{t_id}", dependencies=[Depends(get_current_admin)])
def delete_testimonial(t_id: int, db: Session = Depends(get_db)):
    t = db.get(Testimonial, t_id)
    if not t:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(t)
    db.commit()
    return {"ok": True}


@router.post("/uploads", dependencies=[Depends(get_current_admin)])
async def upload_image(file: UploadFile = File(...), kind: str = Form("photo")):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Only image uploads are allowed")
    if kind not in ("photo", "logo"):
        raise HTTPException(status_code=422, detail="kind must be photo or logo")
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 8MB)")
    try:
        url = store_image(data, file.filename or "upload", kind)
    except Exception:
        raise HTTPException(status_code=500, detail="Upload failed")
    return {"url": url}
