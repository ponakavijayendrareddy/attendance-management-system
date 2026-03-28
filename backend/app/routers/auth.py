from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.security import create_token, hash_password, verify_password
from app.core.config import settings
from app.core.database import get_db
from app.core.errors import AppError
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, RefreshRequest, RegisterRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    stmt = select(User).where(User.email == payload.email.lower())
    user = db.scalar(stmt)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise AppError(401, "Invalid email or password.", "auth_invalid_credentials")

    access_token = create_token(str(user.id), "access", settings.access_token_expire_minutes)
    refresh_token = create_token(str(user.id), "refresh", settings.refresh_token_expire_minutes)
    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.scalar(select(User).where((User.email == payload.email) | (User.enrollment_no == payload.enrollment_no)))
    if existing_user:
        raise AppError(409, "Email or enrollment number already exists.", "user_already_exists")

    user = User(
        name=payload.name,
        email=payload.email,
        enrollment_no=payload.enrollment_no,
        role=payload.role,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_token(str(user.id), "access", settings.access_token_expire_minutes)
    refresh_token = create_token(str(user.id), "refresh", settings.refresh_token_expire_minutes)
    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh")
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token, expected_type="refresh")
    user = db.get(User, int(decoded["sub"]))
    if not user:
        raise AppError(401, "User account no longer exists.", "auth_user_missing")

    access_token = create_token(str(user.id), "access", settings.access_token_expire_minutes)
    return {"access_token": access_token}
