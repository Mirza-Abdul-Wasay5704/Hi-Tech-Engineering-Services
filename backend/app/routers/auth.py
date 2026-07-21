from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.security import create_access_token, get_current_admin, verify_password
from ..models import AdminUser
from ..schemas import LoginRequest, TokenOut
from .leads import limiter  # reuse the shared slowapi limiter instance

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
@limiter.limit("6/minute")  # throttle brute-force attempts per IP
def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.email == body.email.lower().strip()).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenOut(access_token=create_access_token(user.email))


@router.get("/me")
def me(admin: AdminUser = Depends(get_current_admin)):
    return {"email": admin.email}
