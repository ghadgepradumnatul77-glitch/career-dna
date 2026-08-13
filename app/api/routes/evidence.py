from fastapi import APIRouter

from shared.schemas.evidence import SkillEvidence

router = APIRouter()


@router.post("/evidence", response_model=SkillEvidence)
def submit_evidence(evidence: SkillEvidence):
    """
    Ingest and validate a piece of skill evidence supporting a student's skill.
    """
    return evidence
