from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CareerDNACreateUpdate(BaseModel):
    overall_score: Optional[float] = None
    readiness_level: Optional[str] = None
    primary_archetype: Optional[str] = None
    skill_matrix: Optional[Dict[str, float]] = None
    domain_breakdown: Optional[Dict[str, float]] = None
    trait_scores: Optional[Dict[str, float]] = None


class CareerDNAResponse(BaseModel):
    id: str
    user_id: str
    overall_score: float
    readiness_level: str
    primary_archetype: str
    skill_matrix: Optional[Dict[str, Any]] = {}
    domain_breakdown: Optional[Dict[str, Any]] = {}
    trait_scores: Optional[Dict[str, Any]] = {}
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
