"""Public API for the Evidence Fusion MVP."""

from services.evidence_engine.fusion import fuse_evidence
from services.evidence_engine.models import CandidateProfile, UnifiedEvidence

__all__ = ["CandidateProfile", "UnifiedEvidence", "fuse_evidence"]
