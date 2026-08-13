import unittest
from typing import Dict

from shared.schemas.skill import SkillProfile
from shared.schemas.gap import SkillGap
from shared.taxonomy.roles import SkillRequirement, get_role_requirements
from services.gap_engine.gap_engine import calculate_skill_gaps, get_unresolved_gaps


class TestGapEngine(unittest.TestCase):

    def setUp(self):
        self.requirements: Dict[str, SkillRequirement] = {
            "Python": SkillRequirement(required_level=85, importance=1.00, category="programming"),
            "Machine Learning": SkillRequirement(required_level=85, importance=1.00, category="machine_learning"),
            "Statistics": SkillRequirement(required_level=75, importance=0.80, category="mathematics"),
            "SQL": SkillRequirement(required_level=70, importance=0.70, category="data"),
            "Docker": SkillRequirement(required_level=60, importance=0.55, category="deployment"),
        }

    def test_missing_skills(self):
        """Test that skills not present in SkillProfile map to status 'missing'."""
        skills: Dict[str, SkillProfile] = {}
        gaps = calculate_skill_gaps(skills, self.requirements)

        self.assertEqual(len(gaps), 5)
        for gap in gaps:
            self.assertEqual(gap.status, "missing")
            self.assertEqual(gap.current_level, 0.0)
            self.assertEqual(gap.gap, gap.required_level)
            self.assertEqual(gap.confidence, 0.0)
            self.assertEqual(gap.evidence_count, 0)
            self.assertIn("No demonstrated evidence for", gap.explanation)

    def test_partial_proficiency_needs_improvement(self):
        """Test skill below target requirement maps to 'needs_improvement'."""
        skills = {
            "Python": SkillProfile(
                skill="Python",
                proficiency=55.0,
                confidence=80.0,
                evidence_count=2,
                evidence_sources=["github", "resume"],
                summary="Moderate Python skills"
            )
        }
        gaps = calculate_skill_gaps(skills, self.requirements)
        python_gap = next(g for g in gaps if g.skill == "Python")

        self.assertEqual(python_gap.status, "needs_improvement")
        self.assertEqual(python_gap.current_level, 55.0)
        self.assertEqual(python_gap.required_level, 85.0)
        self.assertEqual(python_gap.gap, 30.0)
        self.assertIn("Python is at 55/85. The student is 30 points below the target requirement.", python_gap.explanation)

    def test_meets_requirement(self):
        """Test skill meeting requirement maps to 'meets_requirement'."""
        skills = {
            "Statistics": SkillProfile(
                skill="Statistics",
                proficiency=75.0,
                confidence=90.0,
                evidence_count=3,
                evidence_sources=["coursework"],
                summary="Solid statistics background"
            )
        }
        gaps = calculate_skill_gaps(skills, self.requirements)
        stats_gap = next(g for g in gaps if g.skill == "Statistics")

        self.assertEqual(stats_gap.status, "meets_requirement")
        self.assertEqual(stats_gap.current_level, 75.0)
        self.assertEqual(stats_gap.required_level, 75.0)
        self.assertEqual(stats_gap.gap, 0.0)
        self.assertIn("meets the target requirement", stats_gap.explanation)

    def test_strong_skills(self):
        """Test skill exceeding requirement by >= 10 points maps to 'strong'."""
        skills = {
            "SQL": SkillProfile(
                skill="SQL",
                proficiency=85.0,  # 85 >= 70 + 10
                confidence=95.0,
                evidence_count=4,
                evidence_sources=["projects"],
                summary="Expert SQL practitioner"
            )
        }
        gaps = calculate_skill_gaps(skills, self.requirements)
        sql_gap = next(g for g in gaps if g.skill == "SQL")

        self.assertEqual(sql_gap.status, "strong")
        self.assertEqual(sql_gap.current_level, 85.0)
        self.assertEqual(sql_gap.required_level, 70.0)
        self.assertEqual(sql_gap.gap, 0.0)
        self.assertIn("exceeds the target requirement by 15 points", sql_gap.explanation)

    def test_sorting_behavior(self):
        """Test sorting order: unresolved first -> higher importance first -> larger gap first."""
        skills = {
            "Python": SkillProfile(skill="Python", proficiency=55.0, confidence=80.0, evidence_count=2, summary=""),
            "Machine Learning": SkillProfile(skill="Machine Learning", proficiency=95.0, confidence=90.0, evidence_count=5, summary=""),  # Strong (resolved)
            "Statistics": SkillProfile(skill="Statistics", proficiency=60.0, confidence=70.0, evidence_count=1, summary=""),  # needs_improvement (gap 15, imp 0.8)
        }
        # Docker: missing, imp 0.55, gap 60
        # SQL: missing, imp 0.70, gap 70
        # Python: needs_improvement, imp 1.00, gap 30
        # Statistics: needs_improvement, imp 0.80, gap 15
        # Machine Learning: strong, imp 1.00, gap 0

        gaps = calculate_skill_gaps(skills, self.requirements)

        # First 4 must be unresolved
        unresolved_statuses = {"missing", "needs_improvement"}
        self.assertIn(gaps[0].status, unresolved_statuses)
        self.assertIn(gaps[1].status, unresolved_statuses)
        self.assertIn(gaps[2].status, unresolved_statuses)
        self.assertIn(gaps[3].status, unresolved_statuses)
        self.assertEqual(gaps[4].status, "strong")

        # Among unresolved: Python (imp 1.0) comes before SQL (imp 0.7) and Statistics (imp 0.8)
        self.assertEqual(gaps[0].skill, "Python")
        self.assertEqual(gaps[1].skill, "Statistics")
        self.assertEqual(gaps[2].skill, "SQL")
        self.assertEqual(gaps[3].skill, "Docker")

    def test_get_unresolved_gaps_helper(self):
        """Test filtering only unresolved gaps."""
        skills = {
            "Python": SkillProfile(skill="Python", proficiency=95.0, confidence=90.0, evidence_count=5, summary=""),
            "Statistics": SkillProfile(skill="Statistics", proficiency=50.0, confidence=70.0, evidence_count=1, summary=""),
        }
        all_gaps = calculate_skill_gaps(skills, self.requirements)
        unresolved = get_unresolved_gaps(all_gaps)

        self.assertTrue(all(g.status in ("missing", "needs_improvement") for g in unresolved))
        self.assertNotIn("Python", [g.skill for g in unresolved])
        self.assertIn("Statistics", [g.skill for g in unresolved])

    def test_integration_with_ai_ml_engineer(self):
        """Test gap engine using canonical AI/ML Engineer role taxonomy."""
        ai_ml_reqs = get_role_requirements("AI/ML Engineer")
        skills = {
            "Python": SkillProfile(skill="Python", proficiency=85.0, confidence=90.0, evidence_count=3, summary=""),
            "Machine Learning": SkillProfile(skill="Machine Learning", proficiency=55.0, confidence=80.0, evidence_count=2, summary=""),
        }

        gaps = calculate_skill_gaps(skills, ai_ml_reqs)
        unresolved = get_unresolved_gaps(gaps)

        self.assertEqual(len(gaps), len(ai_ml_reqs))

        # Check Python meets requirement
        py_gap = next(g for g in gaps if g.skill == "Python")
        self.assertEqual(py_gap.status, "meets_requirement")

        # Check Machine Learning needs improvement
        ml_gap = next(g for g in gaps if g.skill == "Machine Learning")
        self.assertEqual(ml_gap.status, "needs_improvement")
        self.assertEqual(ml_gap.gap, 30.0)

        # Unresolved count should exclude Python
        self.assertEqual(len(unresolved), len(ai_ml_reqs) - 1)


if __name__ == "__main__":
    unittest.main()
