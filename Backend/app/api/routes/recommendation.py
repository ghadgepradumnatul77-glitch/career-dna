from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.recommendation import RecommendationResponse
from app.services import recommendation_service
from app.api.routes.ingestion import _get_effective_user_id

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post("/generate", response_model=List[RecommendationResponse], status_code=status.HTTP_201_CREATED)
def generate_recs(
    target_role: Optional[str] = Query(None),
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Generate recommendations to bridge skill gaps."""
    user_id = _get_effective_user_id(db, current_user_id)
    return recommendation_service.generate_recommendations_for_user(db, user_id, target_role=target_role)


@router.get("", response_model=List[RecommendationResponse])
def get_recs(
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve existing user recommendations."""
    user_id = _get_effective_user_id(db, current_user_id)
    return recommendation_service.get_user_recommendations(db, user_id)


@router.patch("/{rec_id}/toggle", response_model=RecommendationResponse)
def toggle_rec(
    rec_id: str,
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Mark recommendation as completed or pending."""
    user_id = _get_effective_user_id(db, current_user_id)
    updated = recommendation_service.toggle_recommendation_completion(db, rec_id, user_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found")
    return updated
