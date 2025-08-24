"""
NoteGuard Backend - FastAPI Application
Main entry point for the NoteGuard API server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router as api_router
from app.api.auth import router as auth_router
from app.core.config import settings
from app.db.session import engine
from app.middleware.logging import LoggingMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine

# Create FastAPI application instance
app = FastAPI(
    title="NoteGuard API",
    description="Metin analiz ve iyileştirme platformu API'si",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)



# Include API routes
app.include_router(api_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NoteGuard API'ye Hoş Geldiniz!",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "noteguard-api"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    ) 


@app.on_event("startup")
async def on_startup() -> None:
    # Eagerly test DB connectivity on startup (non-fatal if unavailable during local dev?)
    try:
        test_engine: AsyncEngine = engine
        # Try a lightweight connection
        async with test_engine.begin() as conn:  # type: ignore[func-returns-value]
            await conn.run_sync(lambda _: None)
    except Exception:
        # We avoid raising to not block non-DB flows during initial setup
        pass