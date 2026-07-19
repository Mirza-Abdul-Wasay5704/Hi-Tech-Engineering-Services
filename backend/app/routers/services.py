from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.revalidate import trigger_revalidate
from ..core.security import get_current_admin
from ..models import Service
from ..schemas import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter(prefix="/api/services", tags=["services"])

REVALIDATE_PATHS = ["/", "/services", "/sitemap.xml"]


@router.get("", response_model=list[ServiceOut])
def list_services(all: bool = False, db: Session = Depends(get_db)):
    q = db.query(Service)
    if not all:
        q = q.filter(Service.published.is_(True))
    return q.order_by(Service.sort_order, Service.id).all()


@router.get("/{slug}", response_model=ServiceOut)
def get_service(slug: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.slug == slug, Service.published.is_(True)).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.post("", response_model=ServiceOut, dependencies=[Depends(get_current_admin)])
def create_service(body: ServiceCreate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(Service).filter(Service.slug == body.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    service = Service(**body.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/services/{service.slug}"])
    return service


@router.patch("/{service_id}", response_model=ServiceOut, dependencies=[Depends(get_current_admin)])
def update_service(service_id: int, body: ServiceUpdate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(service, key, value)
    db.commit()
    db.refresh(service)
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/services/{service.slug}"])
    return service


@router.delete("/{service_id}", dependencies=[Depends(get_current_admin)])
def delete_service(service_id: int, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    slug = service.slug
    db.delete(service)
    db.commit()
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/services/{slug}"])
    return {"ok": True}
