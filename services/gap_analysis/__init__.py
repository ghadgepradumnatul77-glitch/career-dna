"""Public API for Gap Analysis MVP."""

from services.gap_analysis.analyzer import analyze_skill_gap
from services.gap_analysis.models import SkillGap, SkillGapResult

__all__ = ["analyze_skill_gap", "SkillGap", "SkillGapResult"]
