from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.evidence import router as evidence_router
from app.api.routes.analyze import router as analyze_router
from app.api.routes.retrieval import router as retrieval_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(evidence_router, tags=["Evidence"])
api_router.include_router(analyze_router, tags=["Analysis"])
api_router.include_router(retrieval_router, tags=["Retrieval"])
