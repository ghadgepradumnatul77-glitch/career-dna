from pydantic import BaseModel, Field
from typing import List


class SkillProfile(BaseModel):
    """
    Represents the combined understanding of a student's skill
    after analyzing multiple pieces of evidence.
    """

    skill: str = Field(
        ...,
        description="Canonical skill name, e.g. Python, SQL, FastAPI"
    )

    proficiency: float = Field(
        ...,
        ge=0,
        le=100,
        description="Estimated demonstrated proficiency in the skill"
    )

    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Confidence in the proficiency estimate"
    )

    evidence_count: int = Field(
        ...,
        ge=0,
        description="Number of evidence items supporting this skill"
    )

    evidence_sources: List[str] = Field(
        default_factory=list,
        description="Sources contributing evidence, e.g. resume, github, project"
    )

    summary: str = Field(
        ...,
        description="Short explanation of why this skill has this profile"
    )