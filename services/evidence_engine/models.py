"""Data contracts for deterministic cross-source evidence fusion."""

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class UnifiedEvidence:
    """One evidence item with its original source provenance."""

    skill_id: str
    source: str
    evidence_type: str
    raw_term: str
    evidence_text: str
    source_section: Optional[str] = None
    repository_name: Optional[str] = None
    repository_url: Optional[str] = None
    file_path: Optional[str] = None
    commit_sha: Optional[str] = None
    source_ref: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class CandidateProfile:
    """Unscored collection of normalized skills and supporting evidence."""

    normalized_skills: List[str] = field(default_factory=list)
    evidence: List[UnifiedEvidence] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
