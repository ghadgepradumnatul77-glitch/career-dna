from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.skill_gap import SkillGapAnalyzeRequest, SkillGapResponse
from app.services import skill_gap_service
from app.api.routes.ingestion import _get_effective_user_id

router = APIRouter(prefix="/skill-gap", tags=["Skill Gap Analysis"])


@router.post("/analyze", response_model=SkillGapResponse, status_code=status.HTTP_201_CREATED)
def analyze_gap(
    payload: SkillGapAnalyzeRequest,
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Analyze missing skills and match percentage for target role."""
    user_id = _get_effective_user_id(db, current_user_id)
    return skill_gap_service.analyze_user_skill_gap(
        db=db,
        user_id=user_id,
        target_role=payload.target_role,
        custom_required_skills=payload.required_skills
    )


@router.get("/history", response_model=List[SkillGapResponse])
def get_gap_history(
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get history of generated skill gap reports."""
    user_id = _get_effective_user_id(db, current_user_id)
    return skill_gap_service.get_user_skill_gaps(db, user_id)
