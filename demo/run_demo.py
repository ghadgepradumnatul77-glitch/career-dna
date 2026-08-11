"""Run the complete Career-DNA pipeline using deterministic in-memory fixtures."""

import base64
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from services.evidence_engine import CandidateProfile, fuse_evidence
from services.gap_analysis import analyze_skill_gap
from services.github_analyzer import analyze_github_user
from services.report_generator import generate_report
from services.resume_parser import parse_resume_text


RESUME_FIXTURE = """SKILLS
Python, SQL, FastAPI, Docker

PROJECTS
Career API
- Built a FastAPI service with Docker.

EXPERIENCE
Software Engineer | Example Corp | 2024-2026
Built Python and SQL reporting services.
"""


ROLE_REQUIREMENT = {
    "id": "software_engineer",
    "requirements": [
        {"skill_id": "python"},
        {"skill_id": "fastapi"},
        {"skill_id": "docker"},
        {"skill_id": "sql"},
        {"skill_id": "javascript"},
    ],
}


def _base64_text(text: str) -> str:
    return base64.b64encode(text.encode("utf-8")).decode("ascii")


class MockGitHubClient:
    """GitHubClient-compatible in-memory fixture with no network behavior."""

    def get_user(self, username: str) -> Dict[str, Any]:
        return {
            "login": username,
            "html_url": f"https://github.com/{username}",
            "public_repos": 1,
        }

    def list_user_repositories(
        self, username: str, max_repositories: int = 100
    ) -> List[Dict[str, Any]]:
        repositories = [
            {
                "name": "career-api",
                "owner": {"login": username},
                "html_url": f"https://github.com/{username}/career-api",
                "description": "Deterministic Career-DNA demo repository",
                "language": "Python",
                "fork": False,
                "archived": False,
                "pushed_at": "2026-01-15T12:00:00Z",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2026-01-15T12:00:00Z",
                "default_branch": "main",
                "stargazers_count": 3,
                "forks_count": 0,
            }
        ]
        return repositories[:max_repositories]

    def get_repository_languages(self, owner: str, repo: str) -> Dict[str, int]:
        return {"Python": 2400}

    def get_repository_contents(self, owner: str, repo: str, path: str = "") -> Any:
        if path == "":
            return [
                {"name": "Dockerfile", "path": "Dockerfile", "type": "file"},
                {"name": "app.py", "path": "app.py", "type": "file"},
                {"name": "requirements.txt", "path": "requirements.txt", "type": "file"},
            ]
        if path == "requirements.txt":
            return {
                "encoding": "base64",
                "content": _base64_text("fastapi==0.115.0\n"),
            }
        if path == "app.py":
            source = """from fastapi import FastAPI

app = FastAPI()

@app.get(\"/health\")
def health():
    return {\"status\": \"ok\"}
"""
            return {"encoding": "base64", "content": _base64_text(source)}
        return []

    def get_readme(self, owner: str, repo: str) -> Dict[str, Any]:
        return {
            "encoding": "base64",
            "content": _base64_text(
                "# Career API\nA Python FastAPI service packaged with Docker."
            ),
            "path": "README.md",
        }

    def list_repository_commits(
        self, owner: str, repo: str, max_commits: int = 30
    ) -> List[Dict[str, Any]]:
        commits = [
            {"commit": {"author": {"date": "2026-01-15T12:00:00Z"}}},
            {"commit": {"author": {"date": "2026-01-10T09:00:00Z"}}},
        ]
        return commits[:max_commits]


def _group_evidence(profile: CandidateProfile) -> Dict[str, List[Dict[str, Any]]]:
    grouped: Dict[str, List[Dict[str, Any]]] = {"resume": [], "github": []}
    for item in profile.evidence:
        if item.source in grouped:
            rendered = {
                "skill_id": item.skill_id,
                "evidence_type": item.evidence_type,
                "evidence_text": item.evidence_text,
            }
            if item.source_section:
                rendered["source_section"] = item.source_section
            if item.repository_name:
                rendered["repository_name"] = item.repository_name
            if item.file_path:
                rendered["file_path"] = item.file_path
            grouped[item.source].append(rendered)
    return grouped


def run_demo() -> Dict[str, Any]:
    """Execute every Career-DNA stage and return a JSON-compatible payload."""

    resume_result = parse_resume_text(RESUME_FIXTURE)
    github_result = analyze_github_user(
        "career-dna-demo",
        client=MockGitHubClient(),
        max_deep_repositories=1,
    )
    candidate_profile = fuse_evidence(resume_result, github_result)
    candidate_profile.projects = resume_result.projects
    candidate_profile.experience = resume_result.experience
    skill_gap_result = analyze_skill_gap(candidate_profile, ROLE_REQUIREMENT)
    report = generate_report(candidate_profile, skill_gap_result)

    return {
        "career_dna_report": report.to_dict(),
        "evidence": _group_evidence(candidate_profile),
    }


def main() -> None:
    """Print the deterministic demonstration payload as formatted JSON."""

    print(json.dumps(run_demo(), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
