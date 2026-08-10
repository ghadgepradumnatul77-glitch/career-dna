import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.routes.router import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    logger.info("Initializing database tables...")
    try:
        init_db()
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database tables: {e}")
    yield
    logger.info("Shutting down Career DNA API application.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Career DNA Backend API — Ingestion, Evidence Persistence, DNA Profile, Skill Gap Analysis & Recommendations.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware for Frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API V1 Routers
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "Career DNA API is running",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }