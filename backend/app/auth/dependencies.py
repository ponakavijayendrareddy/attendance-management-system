from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.auth.security import decode_token
from app.core.database import get_db
from app.core.errors import AppError
from app.models.user import User, UserRole

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise AppError(401, "Authentication is required.", "auth_credentials_missing")

    payload = decode_token(credentials.credentials, expected_type="access")
    user = db.get(User, int(payload["sub"]))
    if not user:
        raise AppError(401, "User account no longer exists.", "auth_user_missing")
    return user


def require_faculty(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.FACULTY:
        raise AppError(403, "Faculty role is required for this action.", "faculty_role_required")
    return current_user
