"""Production wrapper around the existing Career-DNA intelligence pipeline."""

from pathlib import Path
from typing import Any, Dict, Optional

import yaml

from services.api.models import CareerDNAPipelineError, CareerDNAResponse
from services.evidence_engine import fuse_evidence
from services.gap_analysis import analyze_skill_gap
from services.github_analyzer import GitHubAnalysisResult, analyze_github_user
from services.report_generator import generate_report
from services.resume_parser import parse_resume_text


DEFAULT_ROLE_ID = "software_engineer"
ROLE_REQUIREMENTS_PATH = (
    Path(__file__).resolve().parents[2] / "shared" / "taxonomy" / "role_requirements.yaml"
)


def _load_default_role_requirement() -> Dict[str, Any]:
    """Load the existing Software Engineer role definition deterministically."""

    try:
        with open(ROLE_REQUIREMENTS_PATH, "r", encoding="utf-8") as role_file:
            data = yaml.safe_load(role_file) or {}
    except Exception:
        raise CareerDNAPipelineError("pipeline_configuration_error") from None

    roles = data.get("roles")
    if not isinstance(roles, list):
        raise CareerDNAPipelineError("pipeline_configuration_error")
    for role in roles:
        if isinstance(role, dict) and role.get("id") == DEFAULT_ROLE_ID:
            return role
    raise CareerDNAPipelineError("pipeline_configuration_error")


def _empty_github_result(username: str = "") -> GitHubAnalysisResult:
    return GitHubAnalysisResult(
        username=username,
        profile_url=f"https://github.com/{username}" if username else "",
    )


def run_career_dna_pipeline(
    resume_text: str,
    github_username: Optional[str] = None,
) -> CareerDNAResponse:
    """Run the existing MVP pipeline and return a safe API response contract."""

    if not isinstance(resume_text, str) or not resume_text.strip():
        raise CareerDNAPipelineError("resume_text_required")
    if github_username is not None and not isinstance(github_username, str):
        raise CareerDNAPipelineError("github_username_invalid")

    normalized_username = github_username.strip() if github_username else ""
    try:
        resume_result = parse_resume_text(resume_text)
    except Exception:
        raise CareerDNAPipelineError("resume_analysis_failed") from None

    github_warning: Optional[str] = None
    if normalized_username:
        try:
            github_result = analyze_github_user(normalized_username)
        except Exception:
            github_result = _empty_github_result(normalized_username)
            github_warning = "github_analysis_unavailable"
    else:
        github_result = _empty_github_result()

    try:
        candidate_profile = fuse_evidence(resume_result, github_result)
        candidate_profile.projects = resume_result.projects
        candidate_profile.experience = resume_result.experience
        gap_result = analyze_skill_gap(candidate_profile, _load_default_role_requirement())
        if github_warning:
            gap_result.warnings.append(github_warning)
        report = generate_report(candidate_profile, gap_result)
    except CareerDNAPipelineError:
        raise
    except Exception:
        raise CareerDNAPipelineError("pipeline_processing_failed") from None

    return CareerDNAResponse(
        report=report.to_dict(),
        evidence_summary=dict(report.evidence_summary),
        skill_gaps={
            "present_skills": [item.to_dict() for item in gap_result.present_skills],
            "missing_skills": [item.to_dict() for item in gap_result.missing_skills],
        },
        normalized_skills=list(candidate_profile.normalized_skills),
    )
