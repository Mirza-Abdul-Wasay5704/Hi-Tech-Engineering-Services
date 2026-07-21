from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---- Projects ----
class ProjectBase(BaseModel):
    name: str
    slug: str
    category: str = "Commercial"
    client_name: str = ""
    logo_url: str = ""
    image_url: str = ""
    location: str = "Karachi, Pakistan"
    scope_of_work: str = ""
    description: str = ""
    elevator_types: str = ""
    featured: bool = False
    show_logo: bool = True
    sort_order: int = 0
    published: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    client_name: Optional[str] = None
    logo_url: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    scope_of_work: Optional[str] = None
    description: Optional[str] = None
    elevator_types: Optional[str] = None
    featured: Optional[bool] = None
    show_logo: Optional[bool] = None
    sort_order: Optional[int] = None
    published: Optional[bool] = None


class ProjectOut(ProjectBase, ORMModel):
    id: int


# ---- Services ----
class ServiceBase(BaseModel):
    name: str
    slug: str
    summary: str = ""
    answer_block: str = ""
    body: str = ""
    icon: str = "wrench"
    scope_items: list[Any] = Field(default_factory=list)
    faq: list[Any] = Field(default_factory=list)
    seo_title: str = ""
    seo_description: str = ""
    sort_order: int = 0
    published: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    answer_block: Optional[str] = None
    body: Optional[str] = None
    icon: Optional[str] = None
    scope_items: Optional[list[Any]] = None
    faq: Optional[list[Any]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    sort_order: Optional[int] = None
    published: Optional[bool] = None


class ServiceOut(ServiceBase, ORMModel):
    id: int


# ---- Blog ----
class BlogBase(BaseModel):
    title: str
    slug: str
    excerpt: str = ""
    body: str = ""
    cover_url: str = ""
    tags: str = ""
    seo_title: str = ""
    seo_description: str = ""
    published: bool = False


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover_url: Optional[str] = None
    tags: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    published: Optional[bool] = None


class BlogOut(BlogBase, ORMModel):
    id: int
    published_at: datetime
    updated_at: datetime


# ---- Leads ----
class LeadCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    company: str = Field("", max_length=160)
    email: EmailStr
    phone: str = Field("", max_length=40)
    service: str = Field("", max_length=120)
    message: str = Field("", max_length=4000)
    website: str = Field("", max_length=200)  # honeypot — must stay empty


class LeadUpdate(BaseModel):
    status: str


class LeadOut(ORMModel):
    id: int
    name: str
    company: str
    email: str
    phone: str
    service: str
    message: str
    status: str
    created_at: datetime


# ---- Testimonials ----
class TestimonialBase(BaseModel):
    author: str
    role: str = ""
    company: str = ""
    quote: str
    sort_order: int = 0
    published: bool = True


class TestimonialOut(TestimonialBase, ORMModel):
    id: int


# ---- Settings ----
class SettingsOut(BaseModel):
    data: dict[str, Any]


# ---- Auth ----
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
