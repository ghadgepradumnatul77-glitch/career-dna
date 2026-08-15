from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.schemas.evidence import EvidenceCreate, EvidenceResponse
from app.services import evidence_service
from app.api.routes.ingestion import _get_effective_user_id

router = APIRouter(prefix="/evidence", tags=["Evidence Persistence"])


@router.post("", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
def create_evidence(
    payload: EvidenceCreate,
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Add and persist a new proof/evidence item for a skill."""
    user_id = _get_effective_user_id(db, current_user_id)
    return evidence_service.add_evidence_item(db, user_id, payload)


@router.get("", response_model=List[EvidenceResponse])
def list_evidence(
    skill: Optional[str] = Query(None, description="Optional skill name filter"),
    current_user_id: Optional[str] = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Retrieve all evidence proof items for user."""
    user_id = _get_effective_user_id(db, current_user_id)
    return evidence_service.get_user_evidence(db, user_id, skill)
