from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class EvidenceCreate(BaseModel):
    skill_name: str
    evidence_type: str  # 'github_repo', 'commit', 'resume_bullet', 'project_demo'
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    confidence_score: Optional[float] = 1.0
    verification_status: Optional[str] = "verified"
    extra_metadata: Optional[Dict[str, Any]] = {}


class EvidenceResponse(BaseModel):
    id: str
    user_id: str
    skill_name: str
    evidence_type: str
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    confidence_score: float
    verification_status: str
    extra_metadata: Optional[Dict[str, Any]] = {}
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
