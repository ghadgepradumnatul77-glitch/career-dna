"""Data contracts for the Resume Parser."""

from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Any


@dataclass
class ResumeEvidence:
    skill_id: str
    raw_term: str
    source_section: str
    evidence_text: str
    evidence_type: str  # one of EVIDENCE_TYPES


@dataclass
class NormalizedResumeSkill:
    skill_id: str
    evidence: List[ResumeEvidence] = field(default_factory=list)


@dataclass
class ProjectEntry:
    title: Optional[str] = None
    description: str = ""
    technologies: List[str] = field(default_factory=list)
    source_text: str = ""


@dataclass
class ExperienceEntry:
    organization: Optional[str] = None
    role: Optional[str] = None
    date_text: Optional[str] = None
    description: str = ""
    source_text: str = ""


@dataclass
class EducationEntry:
    institution: Optional[str] = None
    degree: Optional[str] = None
    date_text: Optional[str] = None
    source_text: str = ""


@dataclass
class ResumeParseResult:
    raw_text: str
    sections: Dict[str, str] = field(default_factory=dict)
    candidate_skills: List[str] = field(default_factory=list)
    normalized_skills: List[NormalizedResumeSkill] = field(default_factory=list)
    projects: List[ProjectEntry] = field(default_factory=list)
    experience: List[ExperienceEntry] = field(default_factory=list)
    education: List[EducationEntry] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Return a JSON‑compatible dictionary representation."""
        return asdict(self)


# Allowed evidence type vocabulary
EVIDENCE_TYPES = (
    "skill_claim",
    "project_usage",
    "experience_usage",
    "education_usage",
)