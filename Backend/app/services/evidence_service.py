from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.evidence import EvidenceItem
from app.schemas.evidence import EvidenceCreate
from app.services.dna_service import recalculate_user_career_dna


def add_evidence_item(db: Session, user_id: str, data: EvidenceCreate) -> EvidenceItem:
    """Create and persist an evidence item for a skill proof."""
    item = EvidenceItem(
        user_id=user_id,
        skill_name=data.skill_name,
        evidence_type=data.evidence_type,
        title=data.title,
        description=data.description,
        url=data.url,
        confidence_score=data.confidence_score or 1.0,
        verification_status=data.verification_status or "verified",
        extra_metadata=data.extra_metadata or {}
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Recalculate Career DNA with updated evidence
    recalculate_user_career_dna(db, user_id)
    return item


def get_user_evidence(db: Session, user_id: str, skill_name: Optional[str] = None) -> List[EvidenceItem]:
    """Retrieve all evidence items for a user, optionally filtered by skill."""
    query = db.query(EvidenceItem).filter(EvidenceItem.user_id == user_id)
    if skill_name:
        query = query.filter(EvidenceItem.skill_name.ilike(f"%{skill_name}%"))
    return query.order_by(EvidenceItem.created_at.desc()).all()
