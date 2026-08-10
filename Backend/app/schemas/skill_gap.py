from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class SkillGapAnalyzeRequest(BaseModel):
    target_role: str
    required_skills: Optional[List[str]] = None


class SkillGapResponse(BaseModel):
    id: str
    user_id: str
    target_role: str
    match_percentage: float
    existing_skills: Optional[List[str]] = []
    missing_skills: Optional[List[str]] = []
    gap_details: Optional[Dict[str, Any]] = {}
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
