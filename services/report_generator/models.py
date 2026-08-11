"""Data contract for the Career DNA report."""

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List


@dataclass
class CareerDNAReport:
    """Final unscored and JSON-compatible Career DNA report."""
    candidate_summary: Dict[str, Any] = field(default_factory=dict)
    skills: List[Dict[str, Any]] = field(default_factory=list)
    present_skills: List[Dict[str, Any]] = field(default_factory=list)
    missing_skills: List[Dict[str, Any]] = field(default_factory=list)
    evidence_summary: Dict[str, int] = field(default_factory=dict)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
