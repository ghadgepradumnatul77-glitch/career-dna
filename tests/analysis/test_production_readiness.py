"""Cross-service production-readiness regression tests."""

import json

import httpx
import pytest

from services.evidence_engine import CandidateProfile, UnifiedEvidence
from services.gap_analysis import SkillGap, SkillGapResult, analyze_skill_gap
from services.github_analyzer import (
    GitHubAnalysisResult,
    GitHubClient,
    GitHubEvidence,
    GitHubRepositoryResult,
    RepositoryActivity,
)
from services.github_analyzer.errors import GitHubAnalysisError
from services.report_generator import CareerDNAReport, generate_report
from services.resume_parser.models import (
    EducationEntry,
    ExperienceEntry,
    NormalizedResumeSkill,
    ProjectEntry,
    ResumeEvidence,
    ResumeParseResult,
)


def test_all_data_contracts_serialize_independently():
    resume_evidence = ResumeEvidence("python", "Python", "skills", "Python", "skill_claim")
    github_evidence = GitHubEvidence(
        "python", "Python", "repo", "https://github.com/o/repo",
        "repository_language", "Repository language: Python",
    )
    objects = [
        resume_evidence,
        NormalizedResumeSkill("python", [resume_evidence]),
        ProjectEntry(),
        ExperienceEntry(),
        EducationEntry(),
        ResumeParseResult(raw_text=""),
        github_evidence,
        RepositoryActivity(),
        GitHubRepositoryResult("repo", "https://github.com/o/repo"),
        GitHubAnalysisResult("o", "https://github.com/o"),
        UnifiedEvidence("python", "resume", "skill_claim", "Python", "Python"),
        CandidateProfile(),
        SkillGap("python", "present", ["resume"]),
        SkillGapResult("role"),
        CareerDNAReport(),
    ]
    for item in objects:
        assert json.loads(json.dumps(item.to_dict())) == item.to_dict()


def test_mutable_defaults_are_isolated_between_instances():
    first_profile, second_profile = CandidateProfile(), CandidateProfile()
    first_profile.normalized_skills.append("python")
    assert second_profile.normalized_skills == []

    first_gap, second_gap = SkillGapResult("one"), SkillGapResult("two")
    first_gap.warnings.append("warning")
    assert second_gap.warnings == []

    first_report, second_report = CareerDNAReport(), CareerDNAReport()
    first_report.skills.append({"skill_id": "python"})
    assert second_report.skills == []


def test_malformed_downstream_collections_fail_closed():
    candidate = {"normalized_skills": "not-a-list", "evidence": {"bad": "shape"}}
    role = {"id": "role", "requirements": "not-a-list"}
    gap = analyze_skill_gap(candidate, role)
    report = generate_report(candidate, {"present_skills": "bad", "missing_skills": None})
    assert gap.to_dict() == {
        "role_id": "role", "present_skills": [], "missing_skills": [], "warnings": []
    }
    assert report.skills == []
    assert report.present_skills == []
    assert report.missing_skills == []


def test_duplicate_evidence_is_counted_but_sources_are_deduplicated():
    evidence = UnifiedEvidence("python", "resume", "skill_claim", "Python", "Python")
    candidate = CandidateProfile(["python"], [evidence, evidence])
    gap = analyze_skill_gap(candidate, {"id": "role", "requirements": [{"skill_id": "python"}]})
    report = generate_report(candidate, gap)
    assert gap.present_skills[0].evidence_sources == ["resume"]
    assert report.skills[0] == {
        "skill_id": "python", "sources": ["resume"], "evidence_count": 2
    }


def test_transport_exception_does_not_leak_raw_request_details():
    secret = "sensitive-query-value"

    def fail(request):
        raise httpx.ConnectError(f"failed URL containing {secret}", request=request)

    http_client = httpx.Client(transport=httpx.MockTransport(fail))
    client = GitHubClient(token=None, client=http_client, max_retries=0)
    with pytest.raises(GitHubAnalysisError) as captured:
        client.get_user("octocat")
    assert captured.value.code == "github_api_error"
    assert secret not in str(captured.value)
    http_client.close()
