"""Run the complete Career-DNA pipeline from deterministic offline fixtures."""

import base64
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

ROOT = Path(__file__).resolve().parents[1]
DEMO_DIR = Path(__file__).resolve().parent
RESUME_PATH = DEMO_DIR / "sample_resume.txt"
GITHUB_PATH = DEMO_DIR / "sample_github.json"
DEFAULT_OUTPUT_PATH = DEMO_DIR / "demo_output.json"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from services.evidence_engine import CandidateProfile, fuse_evidence
from services.gap_analysis import SkillGapResult, analyze_skill_gap
from services.github_analyzer import analyze_github_user
from services.report_generator import generate_report
from services.resume_parser import parse_resume_text


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


class OfflineGitHubClient:
    """GitHubClient-compatible adapter backed only by a local JSON fixture."""

    def __init__(self, fixture: Dict[str, Any]) -> None:
        self.fixture = fixture

    def get_user(self, username: str) -> Dict[str, Any]:
        return dict(self.fixture["user"])

    def list_user_repositories(
        self, username: str, max_repositories: int = 100
    ) -> List[Dict[str, Any]]:
        return [dict(repo) for repo in self.fixture["repositories"][:max_repositories]]

    def get_repository_languages(self, owner: str, repo: str) -> Dict[str, int]:
        return dict(self.fixture["languages"].get(repo, {}))

    def get_repository_contents(self, owner: str, repo: str, path: str = "") -> Any:
        dependencies = self.fixture["dependency_files"].get(repo, {})
        sources = self.fixture["source_files"].get(repo, {})
        if path == "":
            entries = [
                {"name": name, "path": name, "type": "file"}
                for name in sorted([*dependencies, *sources])
            ]
            entries.append({"name": "Dockerfile", "path": "Dockerfile", "type": "file"})
            return entries
        if path in dependencies:
            return {"encoding": "base64", "content": _base64_text(dependencies[path])}
        if path in sources:
            return {"encoding": "base64", "content": _base64_text(sources[path])}
        return []

    def get_readme(self, owner: str, repo: str) -> Dict[str, Any]:
        readme = self.fixture["readmes"][repo]
        return {
            "encoding": "base64",
            "content": _base64_text(readme["content"]),
            "path": readme["path"],
        }

    def list_repository_commits(
        self, owner: str, repo: str, max_commits: int = 30
    ) -> List[Dict[str, Any]]:
        return list(self.fixture["commits"].get(repo, [])[:max_commits])


def _load_fixtures() -> Tuple[str, Dict[str, Any]]:
    resume_text = RESUME_PATH.read_text(encoding="utf-8")
    github_fixture = json.loads(GITHUB_PATH.read_text(encoding="utf-8"))
    return resume_text, github_fixture


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


def _run_pipeline() -> Tuple[CandidateProfile, SkillGapResult, Dict[str, Any]]:
    resume_text, github_fixture = _load_fixtures()
    resume_result = parse_resume_text(resume_text)
    username = github_fixture["user"]["login"]
    github_result = analyze_github_user(
        username,
        client=OfflineGitHubClient(github_fixture),
        max_deep_repositories=1,
    )
    candidate_profile = fuse_evidence(resume_result, github_result)
    candidate_profile.projects = resume_result.projects
    candidate_profile.experience = resume_result.experience
    skill_gap_result = analyze_skill_gap(candidate_profile, ROLE_REQUIREMENT)
    report = generate_report(candidate_profile, skill_gap_result)
    return candidate_profile, skill_gap_result, report.to_dict()


def run_demo() -> Dict[str, Any]:
    """Return the original presentation payload for existing demo consumers."""

    profile, _gap_result, report = _run_pipeline()
    return {"career_dna_report": report, "evidence": _group_evidence(profile)}


def generate_demo_output(output_path: Optional[Path] = None) -> Dict[str, Any]:
    """Run offline analysis, save expanded JSON, and return the saved payload."""

    profile, gap_result, report = _run_pipeline()
    evidence_sources = _group_evidence(profile)
    payload = {
        "candidate_profile": profile.to_dict(),
        "detected_skills": list(profile.normalized_skills),
        "evidence_sources": evidence_sources,
        "missing_skills": [gap.to_dict() for gap in gap_result.missing_skills],
        "career_report": report,
    }
    target = Path(output_path) if output_path is not None else DEFAULT_OUTPUT_PATH
    target.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return payload


def main() -> None:
    """Generate the offline JSON artifact and print a stable success message."""

    generate_demo_output()
    print("Career DNA report generated successfully.")


if __name__ == "__main__":
    main()
