from pydantic import BaseModel


class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    error_code: str
