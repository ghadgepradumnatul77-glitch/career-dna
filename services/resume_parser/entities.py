"""Structured entity extraction from resume sections."""

import re
from typing import List, Optional
from services.resume_parser.models import ProjectEntry, ExperienceEntry, EducationEntry
from services.resume_parser.matcher import extract_skill_ids
from services.skill_normalizer.normalizer import SkillNormalizer


# ----- Project extraction -----
def extract_projects(projects_text: str, normalizer: Optional[SkillNormalizer] = None) -> List[ProjectEntry]:
    """Parse the projects section into a list of ProjectEntry."""
    if not projects_text or not projects_text.strip():
        return []

    entries: List[ProjectEntry] = []
    lines = projects_text.splitlines()
    current_title: Optional[str] = None
    current_desc_lines: List[str] = []
    current_source_lines: List[str] = []

    def flush() -> None:
        nonlocal current_title, current_desc_lines, current_source_lines
        if current_title is not None:
            source = "\n".join(current_source_lines).strip()
            description = "\n".join(current_desc_lines).strip()
            technologies = extract_skill_ids(source, normalizer)
            entries.append(ProjectEntry(
                title=current_title.strip(),
                description=description,
                technologies=technologies,
                source_text=source,
            ))
        current_title = None
        current_desc_lines = []
        current_source_lines = []

    for line in lines:
        stripped = line.rstrip()
        # Detect a possible title: non-empty line, not starting with bullet, and next line is bullet or blank or end
        is_bullet = stripped.startswith(("-", "•", "*", "–"))
        if not is_bullet and stripped:
            # Heuristic: if we have a current title and this line looks like another title (short, no period), treat as new project
            if current_title is not None and len(stripped) < 80 and not stripped.endswith("."):
                # Could be a new project title
                flush()
                current_title = stripped
                current_source_lines = [stripped]
                continue
            if current_title is None:
                # start first project only if line looks like a title (short, no trailing period)
                if len(stripped) < 80 and not stripped.endswith("."):
                    current_title = stripped
                    current_source_lines = [stripped]
                    continue
                # otherwise treat as description of an untitled project
                current_desc_lines.append(stripped)
                current_source_lines.append(stripped)
                continue
        # Otherwise part of description
        if current_title is not None:
            current_desc_lines.append(stripped)
            current_source_lines.append(stripped)
        else:
            # No title yet, accumulate as description for untitled project
            current_desc_lines.append(stripped)
            current_source_lines.append(stripped)

    flush()
    # If no titles detected but there is content, create a single project with no title
    if not entries and projects_text.strip():
        source = projects_text.strip()
        technologies = extract_skill_ids(source, normalizer)
        entries.append(ProjectEntry(
            title=None,
            description=source,
            technologies=technologies,
            source_text=source,
        ))
    return entries


# ----- Experience extraction -----
_DATE_PATTERN = re.compile(
    r"(?i)(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}"
    r"|"
    r"\d{4}\s*[-–]\s*\d{4}"
    r"|"
    r"\d{4}\s*[-–]\s*(present|current)"
    r"|"
    r"(present|current)"
    r"|"
    r"\d{4}"
)


def _split_experience_blocks(text: str) -> List[str]:
    """Split experience section into blocks per role/organization."""
    if not text:
        return []
    lines = [ln.rstrip() for ln in text.splitlines() if ln.strip() != ""]
    blocks = []
    current = []
    for ln in lines:
        # Heuristic: a line containing a date likely starts a new block
        if _DATE_PATTERN.search(ln) and current:
            blocks.append("\n".join(current))
            current = [ln]
        else:
            current.append(ln)
    if current:
        blocks.append("\n".join(current))
    return blocks


def _parse_experience_block(block: str) -> ExperienceEntry:
    lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
    role = None
    organization = None
    date_text = None
    desc_lines = []

    # Try pipe-separated first line
    if lines and "|" in lines[0]:
        parts = [p.strip() for p in lines[0].split("|")]
        if len(parts) >= 3:
            role, organization, date_text = parts[0], parts[1], parts[2]
            desc_lines = lines[1:]
        elif len(parts) == 2:
            role, organization = parts[0], parts[1]
            # maybe next line has date
            if len(lines) > 1 and _DATE_PATTERN.search(lines[1]):
                date_text = lines[1]
                desc_lines = lines[2:]
            else:
                desc_lines = lines[1:]
    else:
        # Look for "Role at Organization" pattern
        if lines and " at " in lines[0]:
            parts = lines[0].split(" at ", 1)
            role = parts[0].strip()
            organization = parts[1].strip()
            if len(lines) > 1 and _DATE_PATTERN.search(lines[1]):
                date_text = lines[1]
                desc_lines = lines[2:]
            else:
                desc_lines = lines[1:]
        else:
            # Fallback: first line role, second line org, third line date if matches
            if lines:
                # If only one line and no date pattern, treat as description only
                if len(lines) == 1 and not _DATE_PATTERN.search(lines[0]):
                    role = None
                    organization = None
                    date_text = None
                    desc_lines = lines
                else:
                    role = lines[0]
                    if len(lines) > 1 and not _DATE_PATTERN.search(lines[1]):
                        organization = lines[1]
                        if len(lines) > 2 and _DATE_PATTERN.search(lines[2]):
                            date_text = lines[2]
                            desc_lines = lines[3:]
                        else:
                            desc_lines = lines[2:]
                    elif len(lines) > 1 and _DATE_PATTERN.search(lines[1]):
                        date_text = lines[1]
                        organization = None
                        desc_lines = lines[2:]
                    else:
                        desc_lines = lines[1:]

    description = "\n".join(desc_lines).strip()
    return ExperienceEntry(
        organization=organization,
        role=role,
        date_text=date_text,
        description=description,
        source_text=block.strip(),
    )


def extract_experience(experience_text: str) -> List[ExperienceEntry]:
    """Parse the experience section into ordered entries."""
    if not experience_text or not experience_text.strip():
        return []
    blocks = _split_experience_blocks(experience_text)
    entries = [_parse_experience_block(b) for b in blocks]
    return entries


# ----- Education extraction -----
_DEGREE_KEYWORDS = [
    "bachelor", "b.tech", "btech", "b.e.", "be", "bsc", "b.sc",
    "master", "m.tech", "mtech", "m.e.", "me", "msc", "m.sc",
    "phd", "ph.d", "doctor", "diploma", "associate"
]

_INSTITUTION_KEYWORDS = ["university", "college", "institute", "school"]


def _split_education_blocks(text: str) -> List[str]:
    if not text:
        return []
    lines = [ln.rstrip() for ln in text.splitlines() if ln.strip() != ""]
    # If pipe separated lines, treat each line as block
    if any("|" in ln for ln in lines):
        return lines
    # Otherwise group by blank lines (already removed) -> each line could be separate entry, but we'll treat whole as one block
    return ["\n".join(lines)]


def _parse_education_block(block: str) -> EducationEntry:
    lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
    degree = None
    institution = None
    date_text = None

    # Pipe separated
    if lines and "|" in lines[0]:
        parts = [p.strip() for p in lines[0].split("|")]
        if len(parts) >= 3:
            degree, institution, date_text = parts[0], parts[1], parts[2]
        elif len(parts) == 2:
            degree, institution = parts[0], parts[1]
    else:
        # Heuristic: find degree line
        degree_found = False
        for i, ln in enumerate(lines):
            low = ln.lower()
            if any(kw in low for kw in _DEGREE_KEYWORDS):
                degree = ln
                degree_found = True
                # next line maybe institution
                if i + 1 < len(lines) and any(kw in lines[i+1].lower() for kw in _INSTITUTION_KEYWORDS):
                    institution = lines[i+1]
                    if i + 2 < len(lines) and _DATE_PATTERN.search(lines[i+2]):
                        date_text = lines[i+2]
                elif i + 1 < len(lines) and _DATE_PATTERN.search(lines[i+1]):
                    date_text = lines[i+1]
                break
        # If no degree found, maybe first line degree, second institution, third date
        if not degree_found:
            if len(lines) == 1:
                # Single ambiguous line -> treat as no structured fields
                degree = None
                institution = None
                date_text = None
            else:
                degree = lines[0]
                if len(lines) > 1:
                    institution = lines[1]
                if len(lines) > 2 and _DATE_PATTERN.search(lines[2]):
                    date_text = lines[2]

    return EducationEntry(
        institution=institution,
        degree=degree,
        date_text=date_text,
        source_text=block.strip(),
    )


def extract_education(education_text: str) -> List[EducationEntry]:
    """Parse the education section into ordered entries."""
    if not education_text or not education_text.strip():
        return []
    blocks = _split_education_blocks(education_text)
    entries = [_parse_education_block(b) for b in blocks]
    return entries
