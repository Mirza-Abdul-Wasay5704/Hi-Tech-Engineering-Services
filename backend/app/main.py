from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .core.config import settings
from .core.db import Base, SessionLocal, engine
from .core.security import hash_password
from .core.storage import UPLOADS_DIR
from .models import AdminUser
from .routers import auth, blog, leads, misc, projects, services
from .routers.leads import limiter
from .seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(AdminUser).first():
            db.add(AdminUser(email=settings.admin_email.lower(), hashed_password=hash_password(settings.admin_password)))
            db.commit()
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Hi-Tech Engineering Services API", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(services.router)
app.include_router(blog.router)
app.include_router(leads.router)
app.include_router(misc.router)


@app.get("/health")
def health():
    return {"status": "ok"}
