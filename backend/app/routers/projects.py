from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.revalidate import trigger_revalidate
from ..core.security import get_current_admin
from ..models import Project
from ..schemas import ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(prefix="/api/projects", tags=["projects"])

REVALIDATE_PATHS = ["/", "/projects", "/sitemap.xml"]


@router.get("", response_model=list[ProjectOut])
def list_projects(all: bool = False, db: Session = Depends(get_db)):
    q = db.query(Project)
    if not all:
        q = q.filter(Project.published.is_(True))
    return q.order_by(Project.sort_order, Project.id).all()


@router.get("/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug, Project.published.is_(True)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
def create_project(body: ProjectCreate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(Project).filter(Project.slug == body.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    project = Project(**body.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/projects/{project.slug}"])
    return project


@router.patch("/{project_id}", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
def update_project(project_id: int, body: ProjectUpdate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/projects/{project.slug}"])
    return project


@router.delete("/{project_id}", dependencies=[Depends(get_current_admin)])
def delete_project(project_id: int, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    slug = project.slug
    db.delete(project)
    db.commit()
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/projects/{slug}"])
    return {"ok": True}
