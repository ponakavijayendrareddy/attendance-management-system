from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.core.errors import register_error_handlers
from app.routers import attendance, faculty, health


def create_application() -> FastAPI:
    app = FastAPI(
        title="Attendance Management System API",
        version="1.0.0",
        docs_url="/docs" if settings.app_env != "production" else None,
        redoc_url="/redoc" if settings.app_env != "production" else None,
    )

    Base.metadata.create_all(bind=engine)
    register_error_handlers(app)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(attendance.router)
    app.include_router(faculty.router)
    app.include_router(health.router)
    return app


app = create_application()
