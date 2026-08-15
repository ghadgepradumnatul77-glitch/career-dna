from typing import List
from pydantic import BaseModel, Field

from shared.schemas.skill import SkillProfile
from shared.schemas.gap import SkillGap
from shared.schemas.gap_priority import GapPriority
from shared.schemas.next_action import NextBestAction


class AnalysisRequest(BaseModel):
    """
    Request payload for triggering Career DNA analysis.
    """

    user_id: str = Field(
        ...,
        description="Unique identifier for the student"
    )

    target_role: str = Field(
        ...,
        description="Target career role, e.g. AI/ML Engineer, Software Engineer, Data Scientist"
    )

    skills: List[SkillProfile] = Field(
        default_factory=list,
        description="Current skill profiles of the student"
    )


class AnalysisResult(BaseModel):
    """
    Complete structured response returned by Career DNA analysis.
    """

    user_id: str = Field(
        ...,
        description="Unique identifier for the student"
    )

    target_role: str = Field(
        ...,
        description="Target career role evaluated"
    )

    readiness_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Calculated overall role readiness score"
    )

    skills: List[SkillProfile] = Field(
        default_factory=list,
        description="Student skill profiles evaluated"
    )

    strengths: List[str] = Field(
        default_factory=list,
        description="Skills where student meets or exceeds target requirement"
    )

    development_areas: List[str] = Field(
        default_factory=list,
        description="Skills requiring improvement or missing for target role"
    )

    skill_gaps: List[SkillGap] = Field(
        default_factory=list,
        description="Evaluated skill gaps comparing current level against role requirements"
    )

    gap_priorities: List[GapPriority] = Field(
        default_factory=list,
        description="Prioritized skill gaps ranked by urgency score"
    )

    next_best_actions: List[NextBestAction] = Field(
        default_factory=list,
        description="Recommended top-N action plan to resolve priority gaps"
    )

    summary: str = Field(
        ...,
        description="Human-readable deterministic summary of the Career DNA assessment"
    )
