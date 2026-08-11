from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.db import get_db
from ..core.security import create_access_token, get_current_admin, hash_password, verify_password
from ..models import AdminUser
from ..schemas import ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, TokenOut
from .leads import limiter  # reuse the shared slowapi limiter instance

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _normalise(email: str) -> str:
    return email.lower().strip()


def _is_authorised(email: str) -> bool:
    return _normalise(email) == _normalise(settings.reset_allowed_email)


@router.post("/login", response_model=TokenOut)
@limiter.limit("30/minute")  # generous for humans, still stops bot brute-force
def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.email == _normalise(body.email)).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenOut(access_token=create_access_token(user.email))


@router.get("/me")
def me(admin: AdminUser = Depends(get_current_admin)):
    return {"email": admin.email}


@router.post("/forgot-password")
@limiter.limit("20/minute")
def forgot_password(request: Request, body: ForgotPasswordRequest):
    """Step 1 — check the address. Only RESET_ALLOWED_EMAIL may reset the password."""
    if not _is_authorised(body.email):
        raise HTTPException(status_code=403, detail="This email is not authorised to reset the password.")
    return {"authorised": True, "email": _normalise(body.email)}


@router.post("/reset-password")
@limiter.limit("20/minute")
def reset_password(request: Request, body: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Step 2 — set the new admin password for the authorised address."""
    if not _is_authorised(body.email):
        raise HTTPException(status_code=403, detail="This email is not authorised to reset the password.")

    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="No admin account found.")

    admin.hashed_password = hash_password(body.new_password)
    db.commit()
    return {"reset": True}
