"""Data contracts for skill gap analysis."""

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List


@dataclass
class SkillGap:
    """Presence state and evidence sources for one required skill."""
    skill_id: str
    status: str
    evidence_sources: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class SkillGapResult:
    """Ordered present and missing skills for one role."""
    role_id: str
    present_skills: List[SkillGap] = field(default_factory=list)
    missing_skills: List[SkillGap] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
