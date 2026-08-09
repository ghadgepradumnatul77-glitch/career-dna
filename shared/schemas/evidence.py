from pydantic import BaseModel, Field
from typing import Optional


class SkillEvidence(BaseModel):
    """
    Represents one piece of evidence supporting a student's skill.
    """

    skill: str = Field(
        ...,
        description="Canonical skill name, e.g. Python, SQL, FastAPI"
    )

    source: str = Field(
        ...,
        description="Where the evidence came from: resume, github, project, etc."
    )

    evidence_type: str = Field(
        ...,
        description="Type of evidence, e.g. skill_claim, code_usage, project"
    )

    source_ref: Optional[str] = Field(
        default=None,
        description="Reference to the original evidence, such as repository URL"
    )

    strength: float = Field(
        ...,
        ge=0,
        le=100,
        description="How strongly this evidence demonstrates the skill"
    )

    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Confidence that the evidence is reliable"
    )

    relevance: float = Field(
        ...,
        ge=0,
        le=100,
        description="How relevant this evidence is to the target career"
    )

    recency: float = Field(
        ...,
        ge=0,
        le=100,
        description="How recent the evidence is"
    )

    description: str = Field(
        ...,
        description="Human-readable explanation of what the evidence shows"
    )