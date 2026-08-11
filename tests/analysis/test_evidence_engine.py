"""Tests for the Evidence Fusion MVP."""

import json

from services.evidence_engine import CandidateProfile, UnifiedEvidence, fuse_evidence
from services.github_analyzer.models import (
    GitHubAnalysisResult,
    GitHubEvidence,
    GitHubRepositoryResult,
)
from services.resume_parser.models import (
    NormalizedResumeSkill,
    ResumeEvidence,
    ResumeParseResult,
)


def _resume_result():
    python_evidence = ResumeEvidence(
        skill_id="python",
        raw_term="Python",
        source_section="skills",
        evidence_text="Python",
        evidence_type="skill_claim",
    )
    sql_evidence = ResumeEvidence(
        skill_id="sql",
        raw_term="SQL",
        source_section="experience",
        evidence_text="Built SQL reports",
        evidence_type="experience_usage",
    )
    return ResumeParseResult(
        raw_text="Python SQL",
        normalized_skills=[
            NormalizedResumeSkill("python", [python_evidence]),
            NormalizedResumeSkill("sql", [sql_evidence]),
        ],
    )


def _github_result():
    repository = GitHubRepositoryResult(
        name="career-dna",
        url="https://github.com/example/career-dna",
        normalized_skills=["python", "docker"],
        evidence=[
            GitHubEvidence(
                skill_id="python",
                raw_term="Python",
                repository_name="career-dna",
                repository_url="https://github.com/example/career-dna",
                evidence_type="repository_language",
                evidence_text="Repository language: Python",
                source_ref="repository_language",
            ),
            GitHubEvidence(
                skill_id="docker",
                raw_term="docker",
                repository_name="career-dna",
                repository_url="https://github.com/example/career-dna",
                evidence_type="repository_structure",
                evidence_text="Repository structure: docker",
                file_path="Dockerfile",
                commit_sha="abc123",
                source_ref="repository_structure",
            ),
        ],
    )
    return GitHubAnalysisResult(
        username="example",
        profile_url="https://github.com/example",
        repositories_analyzed=1,
        repositories=[repository],
        all_normalized_skills=["python", "docker"],
    )


def test_fuse_merges_skills_in_stable_first_seen_order():
    profile = fuse_evidence(_resume_result(), _github_result())
    assert profile.normalized_skills == ["python", "sql", "docker"]


def test_fuse_preserves_resume_provenance():
    profile = fuse_evidence(_resume_result(), _github_result())
    item = profile.evidence[0]
    assert item.source == "resume"
    assert item.source_section == "skills"
    assert item.evidence_type == "skill_claim"
    assert item.repository_name is None


def test_fuse_preserves_github_provenance():
    profile = fuse_evidence(_resume_result(), _github_result())
    item = profile.evidence[-1]
    assert item.source == "github"
    assert item.repository_name == "career-dna"
    assert item.repository_url == "https://github.com/example/career-dna"
    assert item.file_path == "Dockerfile"
    assert item.commit_sha == "abc123"
    assert item.source_ref == "repository_structure"


def test_fuse_evidence_order_is_resume_then_repository_order():
    first = fuse_evidence(_resume_result(), _github_result()).to_dict()
    second = fuse_evidence(_resume_result(), _github_result()).to_dict()
    assert first == second
    assert [item["source"] for item in first["evidence"]] == ["resume", "resume", "github", "github"]


def test_fuse_empty_results():
    profile = fuse_evidence(
        ResumeParseResult(raw_text=""),
        GitHubAnalysisResult(username="example", profile_url=""),
    )
    assert profile == CandidateProfile()


def test_candidate_profile_is_plain_json_serializable():
    profile = fuse_evidence(_resume_result(), _github_result())
    loaded = json.loads(json.dumps(profile.to_dict()))
    assert loaded["normalized_skills"] == ["python", "sql", "docker"]
    assert isinstance(loaded["evidence"], list)


def test_public_models_are_constructible_without_scoring_fields():
    item = UnifiedEvidence(
        skill_id="python",
        source="resume",
        evidence_type="skill_claim",
        raw_term="Python",
        evidence_text="Python",
    )
    profile = CandidateProfile(normalized_skills=["python"], evidence=[item])
    assert "score" not in profile.to_dict()
    assert "recommendations" not in profile.to_dict()
