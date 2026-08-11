"""Public API for the GitHub Analyzer."""

from services.github_analyzer.client import GitHubClient
from services.github_analyzer.models import (
    GitHubEvidence,
    GitHubRepositoryResult,
    GitHubAnalysisResult,
    RepositoryActivity,
)
from services.github_analyzer.errors import GitHubAnalysisError
from services.github_analyzer.analyzer import analyze_github_user

__all__ = [
    "GitHubClient",
    "GitHubEvidence",
    "GitHubRepositoryResult",
    "GitHubAnalysisResult",
    "RepositoryActivity",
    "GitHubAnalysisError",
    "analyze_github_user",
]
