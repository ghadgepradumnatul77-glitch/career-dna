"""Tests for the production Career-DNA API pipeline wrapper."""

import json

import pytest

from services.api import (
    CareerDNAPipelineError,
    CareerDNAResponse,
    run_career_dna_pipeline,
)
from services.github_analyzer.models import (
    GitHubAnalysisResult,
    GitHubEvidence,
    GitHubRepositoryResult,
)


RESUME_TEXT = """SKILLS
Python, SQL

EXPERIENCE
Built Python and SQL services.
"""


def _mock_github_result(username="octocat"):
    repository = GitHubRepositoryResult(
        name="api-service",
        url=f"https://github.com/{username}/api-service",
        normalized_skills=["docker"],
        evidence=[
            GitHubEvidence(
                skill_id="docker",
                raw_term="Docker",
                repository_name="api-service",
                repository_url=f"https://github.com/{username}/api-service",
                evidence_type="repository_structure",
                evidence_text="docker",
                file_path="Dockerfile",
                source_ref="repository_structure",
            )
        ],
    )
    return GitHubAnalysisResult(
        username=username,
        profile_url=f"https://github.com/{username}",
        repositories_analyzed=1,
        repositories=[repository],
        all_normalized_skills=["docker"],
    )


def test_resume_only_pipeline(monkeypatch):
    def unexpected_github_call(username):
        raise AssertionError("GitHub analyzer must not run without a username")

    monkeypatch.setattr("services.api.pipeline.analyze_github_user", unexpected_github_call)
    response = run_career_dna_pipeline(RESUME_TEXT)
    assert isinstance(response, CareerDNAResponse)
    assert response.normalized_skills == ["python", "sql"]
    assert response.evidence_summary["github_evidence"] == 0


def test_resume_and_github_pipeline(monkeypatch):
    monkeypatch.setattr(
        "services.api.pipeline.analyze_github_user", lambda username: _mock_github_result(username)
    )
    response = run_career_dna_pipeline(RESUME_TEXT, "octocat")
    assert response.normalized_skills == ["python", "sql", "docker"]
    assert response.evidence_summary["github_evidence"] == 1
    present_ids = [item["skill_id"] for item in response.skill_gaps["present_skills"]]
    assert present_ids == ["sql", "docker", "python"]


@pytest.mark.parametrize("resume_text", ["", "   ", None])
def test_missing_resume_validation(resume_text):
    with pytest.raises(CareerDNAPipelineError) as captured:
        run_career_dna_pipeline(resume_text)
    assert captured.value.to_dict() == {"error": "resume_text_required"}


def test_github_failure_isolation(monkeypatch):
    def fail_github(username):
        raise RuntimeError("raw GitHub failure with secret-token-value")

    monkeypatch.setattr("services.api.pipeline.analyze_github_user", fail_github)
    response = run_career_dna_pipeline(RESUME_TEXT, "octocat")
    serialized = json.dumps(response.to_dict())
    assert response.normalized_skills == ["python", "sql"]
    assert response.report["warnings"] == ["github_analysis_unavailable"]
    assert "secret-token-value" not in serialized
    assert "raw GitHub failure" not in serialized


def test_json_serialization(monkeypatch):
    monkeypatch.setattr(
        "services.api.pipeline.analyze_github_user", lambda username: _mock_github_result(username)
    )
    response = run_career_dna_pipeline(RESUME_TEXT, "octocat")
    assert json.loads(json.dumps(response.to_dict())) == response.to_dict()


def test_deterministic_output(monkeypatch):
    monkeypatch.setattr(
        "services.api.pipeline.analyze_github_user", lambda username: _mock_github_result(username)
    )
    first = run_career_dna_pipeline(RESUME_TEXT, "octocat").to_dict()
    second = run_career_dna_pipeline(RESUME_TEXT, "octocat").to_dict()
    assert first == second
