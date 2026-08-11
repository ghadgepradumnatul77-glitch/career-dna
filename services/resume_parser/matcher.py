"""Skill matching utilities shared between parser and entity extraction."""

import re
import weakref
from typing import List, Tuple, Optional
from services.skill_normalizer.normalizer import SkillNormalizer, get_normalizer


def _build_skill_patterns(normalizer: SkillNormalizer) -> List[Tuple[str, str]]:
    patterns: List[Tuple[str, str]] = normalizer.get_match_terms()
    seen = set()
    uniq = []
    for term, sid in patterns:
        if term not in seen:
            seen.add(term)
            uniq.append((term, sid))
    uniq.sort(key=lambda x: len(x[0]), reverse=True)
    return uniq


def _compile_pattern(term: str) -> re.Pattern:
    flags = 0 if len(term) == 1 else re.IGNORECASE
    escaped = re.escape(term)
    pattern = r"(?<![A-Za-z0-9_])" + escaped + r"(?![A-Za-z0-9_])"
    return re.compile(pattern, flags=flags)


# Cache compiled patterns per normalizer instance using WeakKeyDictionary
_COMPILED_CACHE: weakref.WeakKeyDictionary[SkillNormalizer, List[Tuple[str, str, re.Pattern]]] = weakref.WeakKeyDictionary()


def get_compiled_patterns(normalizer: SkillNormalizer) -> List[Tuple[str, str, re.Pattern]]:
    """Return cached taxonomy match patterns for a normalizer instance."""
    if normalizer not in _COMPILED_CACHE:
        skill_patterns = _build_skill_patterns(normalizer)
        _COMPILED_CACHE[normalizer] = [(term, sid, _compile_pattern(term)) for term, sid in skill_patterns]
    return _COMPILED_CACHE[normalizer]


# Backward-compatible private alias for existing internal consumers.
_get_compiled_patterns = get_compiled_patterns


def extract_skill_ids(text: str, normalizer: Optional[SkillNormalizer] = None) -> List[str]:
    """Return a list of unique canonical skill_ids found in text, in order of first appearance."""
    if not text:
        return []
    if normalizer is None:
        normalizer = get_normalizer()
    compiled = get_compiled_patterns(normalizer)
    matches = []
    for term, sid, regex in compiled:
        for m in regex.finditer(text):
            matches.append((m.start(), m.end(), sid))
    matches.sort(key=lambda x: (x[0], -(x[1] - x[0])))
    used_spans = []
    skill_ids = []
    seen = set()
    for start, end, sid in matches:
        overlap = any(not (end <= u_start or start >= u_end) for u_start, u_end in used_spans)
        if overlap:
            continue
        used_spans.append((start, end))
        if sid not in seen:
            seen.add(sid)
            skill_ids.append(sid)
    return skill_ids
