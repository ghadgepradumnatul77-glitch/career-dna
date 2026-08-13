from pydantic import BaseModel, Field
from typing import List

from shared.schemas.skill import SkillProfile


class CareerDNA(BaseModel):
    """
    Represents a student's overall Career DNA for a target role.
    """

    user_id: str = Field(
        ...,
        description="Unique identifier for the student"
    )

    target_role: str = Field(
        ...,
        description="Target career role, e.g. AI/ML Engineer"
    )

    readiness_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Overall readiness for the selected target role"
    )

    skills: List[SkillProfile] = Field(
        default_factory=list,
        description="Skill profiles contributing to the Career DNA"
    )

    strengths: List[str] = Field(
        default_factory=list,
        description="Skills or areas where the student is strongest"
    )

    development_areas: List[str] = Field(
        default_factory=list,
        description="Skills that need improvement for the target role"
    )

    summary: str = Field(
        ...,
        description="Human-readable summary of the student's Career DNA"
    )