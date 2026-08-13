from typing import List
from pydantic import BaseModel, Field


class NextBestAction(BaseModel):
    """
    Represents a concrete, actionable task or project for a student to address
    a specific high-priority skill gap.
    """

    skill: str = Field(
        ...,
        description="Canonical skill name, e.g. Machine Learning, SQL"
    )

    action_type: str = Field(
        ...,
        description="Type of action, e.g. project, practice, coursework"
    )

    title: str = Field(
        ...,
        description="Clear title for the recommended action"
    )

    description: str = Field(
        ...,
        description="Detailed description of what the student should build or do"
    )

    estimated_effort_hours: int = Field(
        ...,
        ge=1,
        description="Estimated effort required in hours"
    )

    expected_skill_gain: float = Field(
        ...,
        ge=0,
        le=100,
        description="Estimated proficiency gain upon successful completion"
    )

    priority_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Priority score of the underlying skill gap"
    )

    evidence_to_collect: List[str] = Field(
        default_factory=list,
        description="Specific artifacts/evidence to produce (e.g. GitHub repo, metrics)"
    )

    success_criteria: List[str] = Field(
        default_factory=list,
        description="Verification criteria to consider the action complete"
    )
