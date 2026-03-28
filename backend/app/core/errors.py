import logging
from uuid import uuid4

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

logger = logging.getLogger("ams.api")


class AppError(Exception):
    def __init__(self, status_code: int, message: str, error_code: str):
        self.status_code = status_code
        self.message = message
        self.error_code = error_code
        super().__init__(message)


def build_error(status_code: int, message: str, error_code: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "message": message,
            "error_code": error_code,
        },
    )


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError):
        return build_error(exc.status_code, exc.message, exc.error_code)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(_: Request, exc: RequestValidationError):
        logger.warning("Validation error", extra={"errors": exc.errors()})
        return build_error(
            status.HTTP_400_BAD_REQUEST,
            "Request validation failed.",
            "request_validation_error",
        )

    @app.exception_handler(IntegrityError)
    async def handle_integrity_error(_: Request, exc: IntegrityError):
        logger.warning("Integrity error", extra={"detail": str(exc.orig)})
        return build_error(
            status.HTTP_409_CONFLICT,
            "The requested operation conflicts with existing data.",
            "data_conflict",
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception):
        trace_id = str(uuid4())
        logger.exception("Unhandled error", extra={"trace_id": trace_id})
        return build_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Unexpected server error. Reference: {trace_id}",
            "internal_server_error",
        )
