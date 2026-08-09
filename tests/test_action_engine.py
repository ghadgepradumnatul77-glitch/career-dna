import unittest

from shared.schemas.gap_priority import GapPriority
from shared.schemas.next_action import NextBestAction
from shared.schemas.skill import SkillProfile
from shared.taxonomy.roles import get_role_requirements
from services.gap_engine.gap_engine import calculate_skill_gaps
from services.gap_engine.priority_engine import calculate_gap_priorities
from services.gap_engine.action_engine import generate_next_best_action, generate_action_plan


class TestActionEngine(unittest.TestCase):

    def setUp(self):
        self.ml_priority = GapPriority(
            skill="Machine Learning",
            priority_score=85.0,
            priority_level="HIGH",
            gap=30.0,
            importance=1.00,
            reason="Critical ML gap."
        )
        self.dp_priority = GapPriority(
            skill="Data Processing",
            priority_score=94.75,
            priority_level="HIGH",
            gap=75.0,
            importance=0.85,
            reason="Missing Data Processing."
        )
        self.sql_priority = GapPriority(
            skill="SQL",
            priority_score=55.0,
            priority_level="MEDIUM",
            gap=30.0,
            importance=0.70,
            reason="Moderate SQL gap."
        )
        self.docker_priority = GapPriority(
            skill="Docker",
            priority_score=35.0,
            priority_level="LOW",
            gap=10.0,
            importance=0.55,
            reason="Minor Docker gap."
        )
        self.apis_priority = GapPriority(
            skill="APIs",
            priority_score=87.75,
            priority_level="HIGH",
            gap=65.0,
            importance=0.65,
            reason="Missing APIs."
        )

    def test_data_processing_action(self):
        """Test Data Processing catalog action template generation."""
        action = generate_next_best_action(self.dp_priority)

        self.assertEqual(action.skill, "Data Processing")
        self.assertEqual(action.action_type, "project")
        self.assertEqual(action.title, "Build a data preprocessing pipeline")
        self.assertIn("Pandas and NumPy", action.description)
        self.assertIn("preprocessing code", action.evidence_to_collect)
        self.assertEqual(action.estimated_effort_hours, 25)
        self.assertEqual(action.expected_skill_gain, 20.0)

    def test_machine_learning_action(self):
        """Test Machine Learning catalog action template generation."""
        action = generate_next_best_action(self.ml_priority)

        self.assertEqual(action.skill, "Machine Learning")
        self.assertEqual(action.action_type, "project")
        self.assertEqual(action.title, "Build an end-to-end machine learning project")
        self.assertIn("model evaluation metrics", action.evidence_to_collect)
        self.assertEqual(action.estimated_effort_hours, 25)
        self.assertEqual(action.expected_skill_gain, 20.0)

    def test_sql_action(self):
        """Test SQL catalog action template generation."""
        action = generate_next_best_action(self.sql_priority)

        self.assertEqual(action.skill, "SQL")
        self.assertEqual(action.action_type, "practice")
        self.assertEqual(action.title, "Build a SQL analytics project")
        self.assertIn("SQL scripts", action.evidence_to_collect)
        self.assertEqual(action.estimated_effort_hours, 15)  # MEDIUM priority
        self.assertEqual(action.expected_skill_gain, 15.0)

    def test_docker_action(self):
        """Test Docker catalog action template generation."""
        action = generate_next_best_action(self.docker_priority)

        self.assertEqual(action.skill, "Docker")
        self.assertEqual(action.action_type, "project")
        self.assertEqual(action.title, "Containerize an existing project")
        self.assertIn("Dockerfile", action.evidence_to_collect)
        self.assertEqual(action.estimated_effort_hours, 8)  # LOW priority
        self.assertEqual(action.expected_skill_gain, 8.0)

    def test_apis_action(self):
        """Test APIs catalog action template generation."""
        action = generate_next_best_action(self.apis_priority)

        self.assertEqual(action.skill, "APIs")
        self.assertEqual(action.action_type, "project")
        self.assertEqual(action.title, "Build and document a REST API")
        self.assertIn("FastAPI service", action.description)
        self.assertIn("OpenAPI documentation", action.evidence_to_collect)

    def test_unknown_skill_fallback(self):
        """Test fallback action generation for an unknown/custom skill."""
        unknown_priority = GapPriority(
            skill="Rust",
            priority_score=75.0,
            priority_level="HIGH",
            gap=80.0,
            importance=0.80,
            reason="Missing Rust."
        )
        action = generate_next_best_action(unknown_priority)

        self.assertEqual(action.skill, "Rust")
        self.assertEqual(action.title, "Build a practical Rust project")
        self.assertIn("Rust", action.description)
        self.assertIn("GitHub repository", action.evidence_to_collect)

    def test_action_plan_sorting(self):
        """Test action plan selects and orders actions by priority_score descending."""
        priorities = [self.docker_priority, self.dp_priority, self.sql_priority]
        plan = generate_action_plan(priorities, limit=3)

        self.assertEqual(len(plan), 3)
        self.assertEqual(plan[0].skill, "Data Processing")  # Score 94.75
        self.assertEqual(plan[1].skill, "SQL")              # Score 55.0
        self.assertEqual(plan[2].skill, "Docker")           # Score 35.0

    def test_limit_parameter(self):
        """Test limit parameter caps the returned action plan length."""
        priorities = [self.dp_priority, self.apis_priority, self.ml_priority, self.sql_priority]
        plan = generate_action_plan(priorities, limit=2)

        self.assertEqual(len(plan), 2)
        self.assertEqual(plan[0].skill, "Data Processing")
        self.assertEqual(plan[1].skill, "APIs")

    def test_deterministic_properties(self):
        """Test deterministic calculations of gain and effort."""
        action_high = generate_next_best_action(self.dp_priority)
        action_med = generate_next_best_action(self.sql_priority)
        action_low = generate_next_best_action(self.docker_priority)

        self.assertEqual((action_high.expected_skill_gain, action_high.estimated_effort_hours), (20.0, 25))
        self.assertEqual((action_med.expected_skill_gain, action_med.estimated_effort_hours), (15.0, 15))
        self.assertEqual((action_low.expected_skill_gain, action_low.estimated_effort_hours), (8.0, 8))

    def test_end_to_end_ai_ml_action_plan(self):
        """Test full pipeline: Taxonomy -> Gaps -> Priorities -> 3-Action Plan."""
        ai_ml_reqs = get_role_requirements("AI/ML Engineer")
        skills = {
            "Python": SkillProfile(skill="Python", proficiency=85.0, confidence=90.0, evidence_count=4, summary=""),
            "Machine Learning": SkillProfile(skill="Machine Learning", proficiency=55.0, confidence=75.0, evidence_count=2, summary=""),
        }

        gaps = calculate_skill_gaps(skills, ai_ml_reqs)
        priorities = calculate_gap_priorities(gaps)
        action_plan = generate_action_plan(priorities, limit=3)

        self.assertEqual(len(action_plan), 3)
        for action in action_plan:
            self.assertIsInstance(action, NextBestAction)
            self.assertTrue(len(action.evidence_to_collect) > 0)
            self.assertTrue(len(action.success_criteria) > 0)


if __name__ == "__main__":
    unittest.main()
