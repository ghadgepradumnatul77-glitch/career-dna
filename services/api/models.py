"""Public request, response, and safe error contracts for the Career-DNA API layer."""

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class CareerDNARequest:
    """Input accepted by the Career-DNA pipeline wrapper."""

    resume_text: str
    github_username: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class CareerDNAResponse:
    """JSON-compatible output returned by the Career-DNA pipeline wrapper."""

    report: Dict[str, Any] = field(default_factory=dict)
    evidence_summary: Dict[str, int] = field(default_factory=dict)
    skill_gaps: Dict[str, List[Dict[str, Any]]] = field(default_factory=dict)
    normalized_skills: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class CareerDNAPipelineError(ValueError):
    """Deterministic public pipeline error that excludes internal details."""

    def __init__(self, code: str) -> None:
        self.code = code
        super().__init__(code)

    def to_dict(self) -> Dict[str, str]:
        return {"error": self.code}
