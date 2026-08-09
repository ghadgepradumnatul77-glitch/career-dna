from pydantic import BaseModel, Field


class SkillGap(BaseModel):
    """
    Represents a skill gap assessment comparing a student's current proficiency
    against target role requirements.
    """

    skill: str = Field(
        ...,
        description="Canonical skill name, e.g. Python, Machine Learning"
    )

    current_level: float = Field(
        ...,
        ge=0,
        le=100,
        description="Current demonstrated proficiency level"
    )

    required_level: float = Field(
        ...,
        ge=0,
        le=100,
        description="Target required proficiency level for the role"
    )

    gap: float = Field(
        ...,
        ge=0,
        le=100,
        description="Numerical skill gap calculated as max(required_level - current_level, 0)"
    )

    importance: float = Field(
        ...,
        ge=0,
        le=1,
        description="Importance weight of the skill for the target role"
    )

    category: str = Field(
        ...,
        description="Skill taxonomy category, e.g. programming, machine_learning, data"
    )

    status: str = Field(
        ...,
        description="Gap classification status: missing, needs_improvement, meets_requirement, strong"
    )

    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Confidence level in the current proficiency estimate"
    )

    evidence_count: int = Field(
        ...,
        ge=0,
        description="Number of evidence items supporting this skill"
    )

    explanation: str = Field(
        ...,
        description="Human-readable deterministic explanation of the skill gap"
    )
