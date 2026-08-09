import unittest
from typing import List

from shared.schemas.gap import SkillGap
from shared.schemas.gap_priority import GapPriority
from shared.schemas.skill import SkillProfile
from shared.taxonomy.roles import get_role_requirements
from services.gap_engine.gap_engine import calculate_skill_gaps
from services.gap_engine.priority_engine import calculate_gap_priorities, get_top_priority_gap


class TestPriorityEngine(unittest.TestCase):

    def test_high_priority_gap(self):
        """Test a critical missing skill yields HIGH priority (>= 70)."""
        gap = SkillGap(
            skill="Machine Learning",
            current_level=0.0,
            required_level=85.0,
            gap=85.0,
            importance=1.00,
            category="machine_learning",
            status="missing",
            confidence=0.0,
            evidence_count=0,
            explanation="No evidence found."
        )
        priorities = calculate_gap_priorities([gap])

        self.assertEqual(len(priorities), 1)
        p = priorities[0]
        self.assertEqual(p.priority_level, "HIGH")
        self.assertEqual(p.priority_score, 100.0)
        self.assertIn("high priority", p.reason)

    def test_medium_priority_gap(self):
        """Test a moderate gap yields MEDIUM priority (40 <= score < 70)."""
        gap = SkillGap(
            skill="SQL",
            current_level=40.0,
            required_level=70.0,
            gap=30.0,
            importance=0.70,
            category="data",
            status="needs_improvement",
            confidence=80.0,
            evidence_count=2,
            explanation="SQL below requirement."
        )
        priorities = calculate_gap_priorities([gap])

        self.assertEqual(len(priorities), 1)
        p = priorities[0]
        self.assertEqual(p.priority_level, "MEDIUM")
        self.assertTrue(40.0 <= p.priority_score < 70.0)
        self.assertIn("medium priority", p.reason)

    def test_low_priority_gap(self):
        """Test a minor gap with lower importance yields LOW priority (< 40)."""
        gap = SkillGap(
            skill="Docker",
            current_level=55.0,
            required_level=60.0,
            gap=5.0,
            importance=0.30,
            category="deployment",
            status="needs_improvement",
            confidence=90.0,
            evidence_count=3,
            explanation="Minor docker gap."
        )
        priorities = calculate_gap_priorities([gap])

        self.assertEqual(len(priorities), 1)
        p = priorities[0]
        self.assertEqual(p.priority_level, "LOW")
        self.assertTrue(p.priority_score < 40.0)
        self.assertIn("low priority", p.reason)

    def test_sorting(self):
        """Test priorities are sorted by priority_score descending."""
        gaps = [
            SkillGap(
                skill="LowSkill",
                current_level=55.0,
                required_level=60.0,
                gap=5.0,
                importance=0.30,
                category="tools",
                status="needs_improvement",
                confidence=80.0,
                evidence_count=1,
                explanation=""
            ),
            SkillGap(
                skill="HighSkill",
                current_level=0.0,
                required_level=85.0,
                gap=85.0,
                importance=1.00,
                category="machine_learning",
                status="missing",
                confidence=0.0,
                evidence_count=0,
                explanation=""
            ),
            SkillGap(
                skill="MedSkill",
                current_level=40.0,
                required_level=70.0,
                gap=30.0,
                importance=0.70,
                category="data",
                status="needs_improvement",
                confidence=80.0,
                evidence_count=2,
                explanation=""
            ),
        ]
        priorities = calculate_gap_priorities(gaps)

        self.assertEqual(len(priorities), 3)
        self.assertEqual(priorities[0].skill, "HighSkill")
        self.assertEqual(priorities[1].skill, "MedSkill")
        self.assertEqual(priorities[2].skill, "LowSkill")
        self.assertTrue(priorities[0].priority_score >= priorities[1].priority_score >= priorities[2].priority_score)

    def test_resolved_skills_excluded(self):
        """Test resolved skills ('meets_requirement' and 'strong') are excluded."""
        gaps = [
            SkillGap(
                skill="Python",
                current_level=85.0,
                required_level=85.0,
                gap=0.0,
                importance=1.00,
                category="programming",
                status="meets_requirement",
                confidence=90.0,
                evidence_count=4,
                explanation="Meets req."
            ),
            SkillGap(
                skill="Statistics",
                current_level=90.0,
                required_level=75.0,
                gap=0.0,
                importance=0.80,
                category="mathematics",
                status="strong",
                confidence=95.0,
                evidence_count=5,
                explanation="Strong."
            ),
            SkillGap(
                skill="ML",
                current_level=50.0,
                required_level=85.0,
                gap=35.0,
                importance=1.00,
                category="machine_learning",
                status="needs_improvement",
                confidence=80.0,
                evidence_count=2,
                explanation="Needs imp."
            ),
        ]
        priorities = calculate_gap_priorities(gaps)

        self.assertEqual(len(priorities), 1)
        self.assertEqual(priorities[0].skill, "ML")

    def test_deterministic_explanations(self):
        """Test reason strings contain expected deterministic rationale."""
        gap = SkillGap(
            skill="Machine Learning",
            current_level=20.0,
            required_level=85.0,
            gap=65.0,
            importance=1.00,
            category="machine_learning",
            status="needs_improvement",
            confidence=80.0,
            evidence_count=2,
            explanation=""
        )
        priorities = calculate_gap_priorities([gap])
        self.assertEqual(priorities[0].priority_level, "HIGH")
        self.assertIn("Machine Learning has a high priority because it is a critical target skill with a significant proficiency gap of 65 points.", priorities[0].reason)


    def test_empty_input(self):
        """Test empty gaps input returns empty list."""
        self.assertEqual(calculate_gap_priorities([]), [])
        self.assertIsNone(get_top_priority_gap([]))

    def test_get_top_priority_gap(self):
        """Test get_top_priority_gap returns top gap or None."""
        gaps = [
            SkillGap(skill="Python", current_level=85.0, required_level=85.0, gap=0.0, importance=1.0, category="prog", status="meets_requirement", confidence=90.0, evidence_count=3, explanation=""),
        ]
        # All resolved -> None
        self.assertIsNone(get_top_priority_gap(gaps))

        gaps.append(
            SkillGap(skill="ML", current_level=50.0, required_level=85.0, gap=35.0, importance=1.0, category="ml", status="needs_improvement", confidence=80.0, evidence_count=2, explanation="")
        )
        top = get_top_priority_gap(gaps)
        self.assertIsNotNone(top)
        self.assertEqual(top.skill, "ML")

    def test_integration_ai_ml_engineer_priorities(self):
        """Test end-to-end flow from AI/ML Engineer requirements to priorities."""
        ai_ml_reqs = get_role_requirements("AI/ML Engineer")
        skills = {
            "Python": SkillProfile(skill="Python", proficiency=85.0, confidence=90.0, evidence_count=3, summary=""),
            "Machine Learning": SkillProfile(skill="Machine Learning", proficiency=55.0, confidence=75.0, evidence_count=2, summary=""),
        }
        gaps = calculate_skill_gaps(skills, ai_ml_reqs)
        priorities = calculate_gap_priorities(gaps)
        top_gap = get_top_priority_gap(gaps)

        # Machine Learning (gap 30, imp 1.0) or Data Processing (missing gap 75, imp 0.85) should be top
        self.assertIsNotNone(top_gap)
        self.assertIn(top_gap.skill, ["Machine Learning", "Data Processing"])
        self.assertTrue(all(p.priority_level in ("HIGH", "MEDIUM", "LOW") for p in priorities))


if __name__ == "__main__":
    unittest.main()
