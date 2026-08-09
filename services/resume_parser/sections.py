"""Deterministic section detection for resume text."""

from typing import Dict, List, Tuple

# Mapping from normalized heading to canonical internal name
HEADING_ALIASES = {
    "summary": "summary",
    "profile": "summary",
    "objective": "summary",
    "skills": "skills",
    "technical skills": "skills",
    "technologies": "skills",
    "core skills": "skills",
    "projects": "projects",
    "academic projects": "projects",
    "personal projects": "projects",
    "experience": "experience",
    "work experience": "experience",
    "professional experience": "experience",
    "employment": "experience",
    "education": "education",
    "academic background": "education",
    "certifications": "certifications",
    "certificates": "certifications",
    "achievements": "achievements",
    "awards": "achievements",
}

# Ordered list of canonical section names for stable iteration
CANONICAL_SECTIONS = [
    "summary",
    "skills",
    "projects",
    "experience",
    "education",
    "certifications",
    "achievements",
]


def _normalize_heading(line: str) -> str:
    """Normalize a heading line for lookup."""
    # strip whitespace, remove trailing colon, lower case
    stripped = line.strip()
    if stripped.endswith(":"):
        stripped = stripped[:-1]
    return stripped.casefold()


def detect_sections(text: str) -> Tuple[Dict[str, str], List[str]]:
    """
    Split resume text into sections based on known headings.

    Returns:
        sections: dict mapping canonical section name -> concatenated text
        warnings: list of warning identifiers
    """
    lines = text.splitlines()
    sections: Dict[str, List[str]] = {name: [] for name in CANONICAL_SECTIONS}
    current_section: Optional[str] = None
    warnings: List[str] = []

    for line in lines:
        norm = _normalize_heading(line)
        if norm in HEADING_ALIASES:
            # start a new section
            current_section = HEADING_ALIASES[norm]
            continue
        if current_section is not None:
            sections[current_section].append(line)
        # lines before any heading are ignored (could be header info)

    # Join collected lines
    result: Dict[str, str] = {}
    for name, collected in sections.items():
        if collected:
            result[name] = "\n".join(collected).strip()

    # If no sections were recognized but there is content, warn
    if not result and text.strip():
        warnings.append("no_recognized_sections")

    return result, warnings


# For type hint
from typing import Optional