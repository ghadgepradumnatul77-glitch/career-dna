"""Data contracts for the GitHub Analyzer."""

from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Any


# ---- Evidence type vocabulary ----
GITHUB_EVIDENCE_TYPES = (
    "repository_language",
    "dependency_declared",
    "code_import",
    "code_usage",
    "repository_structure",
    "readme_claim",
)


@dataclass
class GitHubEvidence:
    """One normalized skill observation from a GitHub repository."""
    skill_id: str
    raw_term: str
    repository_name: str
    repository_url: str
    evidence_type: str
    evidence_text: str
    file_path: Optional[str] = None
    commit_sha: Optional[str] = None
    source_ref: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class RepositoryActivity:
    """Bounded repository activity metadata; never skill evidence."""

    commit_count: int = 0
    latest_commit_at: Optional[str] = None
    earliest_commit_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class GitHubRepositoryResult:
    """Metadata and evidence collected for one repository."""
    name: str
    url: str
    description: Optional[str] = None
    primary_language: Optional[str] = None
    languages: Dict[str, int] = field(default_factory=dict)
    stars: int = 0
    forks: int = 0
    fork: bool = False
    archived: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    pushed_at: Optional[str] = None
    default_branch: Optional[str] = None
    has_readme: bool = False
    dependency_files: List[str] = field(default_factory=list)
    evidence: List[GitHubEvidence] = field(default_factory=list)
    normalized_skills: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    activity: RepositoryActivity = field(default_factory=RepositoryActivity)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class GitHubAnalysisResult:
    """Complete deterministic GitHub analysis result."""
    username: str
    profile_url: str
    public_repos: int = 0
    repositories_analyzed: int = 0
    repositories: List[GitHubRepositoryResult] = field(default_factory=list)
    all_normalized_skills: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Return a JSON‑compatible dictionary representation."""
        return asdict(self)
