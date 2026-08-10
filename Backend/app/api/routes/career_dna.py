from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.career_dna import CareerDNAResponse
from app.services import dna_service
from app.api.routes.ingestion import _get_effective_user_id

router = APIRouter(prefix="/career-dna", tags=["Career DNA Core"])


@router.get("", response_model=CareerDNAResponse)
def get_career_dna(
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve user's Career DNA profile metrics and skill matrix."""
    user_id = _get_effective_user_id(db, current_user_id)
    return dna_service.get_user_career_dna(db, user_id)


@router.post("/recalculate", response_model=CareerDNAResponse)
def recalculate_dna(
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Trigger an on-demand recalculation of user's Career DNA profile."""
    user_id = _get_effective_user_id(db, current_user_id)
    return dna_service.recalculate_user_career_dna(db, user_id)
