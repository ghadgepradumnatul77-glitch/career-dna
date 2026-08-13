from pydantic import BaseModel, Field


class GapPriority(BaseModel):
    """
    Represents a prioritized skill gap indicating priority score, priority level,
    and a deterministic rationale.
    """

    skill: str = Field(
        ...,
        description="Canonical skill name, e.g. Python, Machine Learning"
    )

    priority_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Calculated priority score on a 0-100 scale"
    )

    priority_level: str = Field(
        ...,
        description="Priority level classification: HIGH, MEDIUM, LOW"
    )

    gap: float = Field(
        ...,
        ge=0,
        le=100,
        description="Numerical skill gap"
    )

    importance: float = Field(
        ...,
        ge=0,
        le=1,
        description="Importance weight of the skill for the target role"
    )

    reason: str = Field(
        ...,
        description="Deterministic human-readable explanation for the priority"
    )
