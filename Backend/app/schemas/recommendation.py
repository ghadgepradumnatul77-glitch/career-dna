from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class RecommendationCreate(BaseModel):
    target_role: Optional[str] = None
    category: str  # 'project', 'course', 'certification'
    title: str
    description: Optional[str] = None
    target_skill: str
    priority: Optional[str] = "medium"
    resource_url: Optional[str] = None
    estimated_hours: Optional[int] = 10


class RecommendationResponse(BaseModel):
    id: str
    user_id: str
    target_role: Optional[str] = None
    category: str
    title: str
    description: Optional[str] = None
    target_skill: str
    priority: str
    resource_url: Optional[str] = None
    estimated_hours: int
    is_completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
