from fastapi import APIRouter
from app.api.routes import auth, ingestion, career_dna, evidence, skill_gap, recommendation

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(ingestion.router)
api_router.include_router(career_dna.router)
api_router.include_router(evidence.router)
api_router.include_router(skill_gap.router)
api_router.include_router(recommendation.router)
