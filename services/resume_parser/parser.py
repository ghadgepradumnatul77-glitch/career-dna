"""Resume parser orchestration: text and PDF input."""

import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional

from services.resume_parser.models import (
    ResumeParseResult,
    ResumeEvidence,
    NormalizedResumeSkill,
    EVIDENCE_TYPES,
)
from services.resume_parser.sections import detect_sections, CANONICAL_SECTIONS
from services.resume_parser.pdf_reader import extract_pdf_text
from services.resume_parser.errors import ResumeParseError
from services.resume_parser import entities
from services.resume_parser.matcher import _get_compiled_patterns
from services.skill_normalizer.normalizer import get_normalizer, SkillNormalizer


def _normalize_text(text: str) -> str:
    """Basic safe text normalization."""
    if not isinstance(text, str):
        raise ResumeParseError("Input must be a string")
    # Replace CRLF with LF
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Remove null characters
    text = text.replace("\x00", "")
    # Trim trailing whitespace on each line
    lines = [line.rstrip() for line in text.split("\n")]
    return "\n".join(lines)


def _extract_skills_from_sections(sections: Dict[str, str], normalizer: SkillNormalizer) -> Tuple[List[str], List[NormalizedResumeSkill]]:
    """
    Scan each section text for known skills.
    Returns candidate_skills (unique raw terms in order of first appearance)
    and normalized_skills (deduplicated by skill_id with aggregated evidence).
    """
    # Map skill_id -> NormalizedResumeSkill builder
    skill_map: Dict[str, NormalizedResumeSkill] = {}
    # Track candidate raw terms order
    candidate_order: List[str] = []
    seen_candidate: set = set()

    # Evidence type mapping per canonical section
    evidence_type_for_section = {
        "skills": "skill_claim",
        "projects": "project_usage",
        "experience": "experience_usage",
        "education": "education_usage",
        "summary": "skill_claim",
        "certifications": "skill_claim",
        "achievements": "skill_claim",
    }

    compiled = _get_compiled_patterns(normalizer)

    for section_name, text in sections.items():
        if not text:
            continue
        ev_type = evidence_type_for_section.get(section_name, "skill_claim")
        # Find all matches in this section
        matches = []  # list of (start, end, term, skill_id)
        for term, sid, regex in compiled:
            for m in regex.finditer(text):
                matches.append((m.start(), m.end(), m.group(0), sid))
        # Sort matches by start position, then by longer term first (already longer first in patterns)
        matches.sort(key=lambda x: (x[0], - (x[1] - x[0])))
        # Simple overlap removal: keep first match at each position (longer preferred)
        used_spans = []
        for start, end, matched_term, sid in matches:
            # Check overlap with already used spans
            overlap = any(not (end <= u_start or start >= u_end) for u_start, u_end in used_spans)
            if overlap:
                continue
            used_spans.append((start, end))
            # Candidate skill raw term (use matched_term as appears)
            if matched_term not in seen_candidate:
                seen_candidate.add(matched_term)
                candidate_order.append(matched_term)
            # Evidence snippet: the line containing the match
            line_start = text.rfind("\n", 0, start) + 1
            line_end = text.find("\n", end)
            if line_end == -1:
                line_end = len(text)
            evidence_snippet = text[line_start:line_end].strip()
            # Limit length
            if len(evidence_snippet) > 200:
                evidence_snippet = evidence_snippet[:197] + "..."
            # Build evidence
            evidence = ResumeEvidence(
                skill_id=sid,
                raw_term=matched_term,
                source_section=section_name,
                evidence_text=evidence_snippet,
                evidence_type=ev_type,
            )
            if sid not in skill_map:
                skill_map[sid] = NormalizedResumeSkill(skill_id=sid, evidence=[evidence])
            else:
                skill_map[sid].evidence.append(evidence)

    normalized_list = list(skill_map.values())
    return candidate_order, normalized_list


def parse_resume_text(text: str, normalizer: Optional[SkillNormalizer] = None) -> ResumeParseResult:
    """
    Parse plain-text resume into a structured ResumeParseResult.
    Includes skill extraction, evidence aggregation, and structured entity extraction.
    """
    if not text or not text.strip():
        raise ResumeParseError("Resume text is empty")

    if normalizer is None:
        normalizer = get_normalizer()

    normalized = _normalize_text(text)
    sections, warnings = detect_sections(normalized)

    candidate_skills, normalized_skills = _extract_skills_from_sections(sections, normalizer)

    # Structured extraction
    projects = entities.extract_projects(sections.get("projects", ""), normalizer)
    experience = entities.extract_experience(sections.get("experience", ""))
    education = entities.extract_education(sections.get("education", ""))

    return ResumeParseResult(
        raw_text=normalized,
        sections=sections,
        candidate_skills=candidate_skills,
        normalized_skills=normalized_skills,
        projects=projects,
        experience=experience,
        education=education,
        warnings=warnings,
    )


def parse_resume_pdf(path: str | Path, normalizer: Optional[SkillNormalizer] = None) -> ResumeParseResult:
    """
    Parse a PDF resume file.
    Pipeline: extract text -> parse_resume_text
    """
    text = extract_pdf_text(path)
    return parse_resume_text(text, normalizer)