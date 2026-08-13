from fastapi import FastAPI

from app.api.routes import api_router

app = FastAPI(
    title="Career DNA API",
    description="AI-powered career intelligence system analyzing student evidence and computing readiness.",
    version="1.0.0",
)

app.include_router(api_router)
