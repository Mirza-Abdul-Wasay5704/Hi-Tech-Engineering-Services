from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .core.db import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(50), default="Commercial")  # Hospitals/Hotels/Commercial/Financial/Industrial/Residential
    client_name: Mapped[str] = mapped_column(String(200), default="")
    logo_url: Mapped[str] = mapped_column(String(500), default="")
    image_url: Mapped[str] = mapped_column(String(500), default="")
    location: Mapped[str] = mapped_column(String(200), default="Karachi, Pakistan")
    scope_of_work: Mapped[str] = mapped_column(Text, default="")
    description: Mapped[str] = mapped_column(Text, default="")
    elevator_types: Mapped[str] = mapped_column(String(300), default="")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    show_logo: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    summary: Mapped[str] = mapped_column(Text, default="")
    answer_block: Mapped[str] = mapped_column(Text, default="")  # direct-answer paragraph for SEO/LLMs
    body: Mapped[str] = mapped_column(Text, default="")  # markdown
    icon: Mapped[str] = mapped_column(String(50), default="wrench")
    scope_items: Mapped[list] = mapped_column(JSON, default=list)  # [{label, detail}]
    faq: Mapped[list] = mapped_column(JSON, default=list)  # [{q, a}]
    seo_title: Mapped[str] = mapped_column(String(200), default="")
    seo_description: Mapped[str] = mapped_column(String(300), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    published: Mapped[bool] = mapped_column(Boolean, default=True)


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    excerpt: Mapped[str] = mapped_column(Text, default="")
    body: Mapped[str] = mapped_column(Text, default="")  # markdown
    cover_url: Mapped[str] = mapped_column(String(500), default="")
    tags: Mapped[str] = mapped_column(String(300), default="")  # comma-separated
    seo_title: Mapped[str] = mapped_column(String(200), default="")
    seo_description: Mapped[str] = mapped_column(String(300), default="")
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    company: Mapped[str] = mapped_column(String(200), default="")
    email: Mapped[str] = mapped_column(String(200), default="")
    phone: Mapped[str] = mapped_column(String(50), default="")
    service: Mapped[str] = mapped_column(String(200), default="")
    message: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="new")  # new/contacted/closed
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(200), default="")
    company: Mapped[str] = mapped_column(String(200), default="")
    quote: Mapped[str] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    published: Mapped[bool] = mapped_column(Boolean, default=True)


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)  # always 1
    data: Mapped[dict] = mapped_column(JSON, default=dict)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(200))
