from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.revalidate import trigger_revalidate
from ..core.security import get_current_admin
from ..models import BlogPost
from ..schemas import BlogCreate, BlogOut, BlogUpdate

router = APIRouter(prefix="/api/blog", tags=["blog"])

REVALIDATE_PATHS = ["/blog", "/sitemap.xml"]


@router.get("", response_model=list[BlogOut])
def list_posts(all: bool = False, db: Session = Depends(get_db)):
    q = db.query(BlogPost)
    if not all:
        q = q.filter(BlogPost.published.is_(True))
    return q.order_by(BlogPost.published_at.desc()).all()


@router.get("/{slug}", response_model=BlogOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.published.is_(True)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("", response_model=BlogOut, dependencies=[Depends(get_current_admin)])
def create_post(body: BlogCreate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(BlogPost).filter(BlogPost.slug == body.slug).first():
        raise HTTPException(status_code=409, detail="Slug already exists")
    post = BlogPost(**body.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/blog/{post.slug}"])
    return post


@router.patch("/{post_id}", response_model=BlogOut, dependencies=[Depends(get_current_admin)])
def update_post(post_id: int, body: BlogUpdate, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(post, key, value)
    db.commit()
    db.refresh(post)
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/blog/{post.slug}"])
    return post


@router.delete("/{post_id}", dependencies=[Depends(get_current_admin)])
def delete_post(post_id: int, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    slug = post.slug
    db.delete(post)
    db.commit()
    tasks.add_task(trigger_revalidate, REVALIDATE_PATHS + [f"/blog/{slug}"])
    return {"ok": True}
