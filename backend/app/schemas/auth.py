import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.user import UserRole

GMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@gmail\.com$")
ENROLLMENT_REGEX = re.compile(r"^[A-Za-z0-9]+$")


class LoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not GMAIL_REGEX.match(value):
            raise ValueError("Only Gmail-style addresses are accepted.")
        return value.lower()


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str
    enrollment_no: str = Field(min_length=4, max_length=50)
    role: UserRole
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not GMAIL_REGEX.match(value):
            raise ValueError("Only Gmail-style addresses are accepted.")
        return value.lower()

    @field_validator("enrollment_no")
    @classmethod
    def validate_enrollment(cls, value: str) -> str:
        if not ENROLLMENT_REGEX.match(value):
            raise ValueError("Enrollment number must be alpha-numeric.")
        return value.upper()


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=10)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: UserRole


class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
