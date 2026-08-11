"""Tests for Career DNA Report Generator MVP."""

import json

from services.evidence_engine import CandidateProfile, UnifiedEvidence
from services.gap_analysis import SkillGap, SkillGapResult
from services.report_generator import CareerDNAReport, generate_report


def _evidence(skill_id, source):
    return UnifiedEvidence(
        skill_id=skill_id,
        source=source,
        evidence_type="skill_claim",
        raw_term=skill_id,
        evidence_text=skill_id,
    )


def _inputs():
    candidate = CandidateProfile(
        normalized_skills=["python", "sql", "docker"],
        evidence=[
            _evidence("python", "resume"),
            _evidence("python", "github"),
            _evidence("python", "github"),
            _evidence("sql", "resume"),
            _evidence("docker", "github"),
        ],
    )
    gap = SkillGapResult(
        role_id="software_engineer",
        present_skills=[
            SkillGap("python", "present", ["resume", "github"]),
            SkillGap("sql", "present", ["resume"]),
        ],
        missing_skills=[SkillGap("java", "missing")],
    )
    return candidate, gap


def test_report_generation():
    candidate, gap = _inputs()
    candidate.projects = [{"title": "Career DNA"}]
    candidate.experience = [{"organization": "Example"}, {"organization": "Other"}]
    report = generate_report(candidate, gap)
    assert isinstance(report, CareerDNAReport)
    assert report.candidate_summary == {
        "total_skills_detected": 3,
        "evidence_sources_count": 2,
        "project_count": 1,
        "experience_count": 2,
    }


def test_skill_summary():
    report = generate_report(*_inputs())
    assert report.skills == [
        {"skill_id": "python", "sources": ["resume", "github"], "evidence_count": 3},
        {"skill_id": "sql", "sources": ["resume"], "evidence_count": 1},
        {"skill_id": "docker", "sources": ["github"], "evidence_count": 1},
    ]


def test_missing_skills_added():
    report = generate_report(*_inputs())
    assert report.missing_skills == [
        {"skill_id": "java", "status": "missing", "evidence_sources": []}
    ]


def test_evidence_counts():
    report = generate_report(*_inputs())
    assert report.evidence_summary == {"resume_evidence": 2, "github_evidence": 3}


def test_warning_merge():
    candidate, gap = _inputs()
    candidate.warnings = ["resume_partial", "shared_warning"]
    gap.warnings = ["shared_warning", "role_partial"]
    report = generate_report(candidate, gap)
    assert report.warnings == ["resume_partial", "shared_warning", "role_partial"]


def test_json_serialization():
    report = generate_report(*_inputs())
    loaded = json.loads(json.dumps(report.to_dict()))
    assert loaded["candidate_summary"]["total_skills_detected"] == 3
    assert loaded["present_skills"][0]["skill_id"] == "python"


def test_deterministic_output():
    candidate, gap = _inputs()
    first = generate_report(candidate, gap).to_dict()
    second = generate_report(candidate, gap).to_dict()
    assert first == second
