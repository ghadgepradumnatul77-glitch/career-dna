import unittest
import httpx

from app.main import app
from shared.schemas.skill import SkillProfile


class TestAnalyzeRoute(unittest.IsolatedAsyncioTestCase):

    async def test_valid_ai_ml_engineer_analysis(self):
        """Test POST /analyze with valid AI/ML Engineer profile returns full analysis."""
        payload = {
            "user_id": "usr_test1",
            "target_role": "AI/ML Engineer",
            "skills": [
                {
                    "skill": "Python",
                    "proficiency": 85.0,
                    "confidence": 90.0,
                    "evidence_count": 4,
                    "evidence_sources": ["github"],
                    "summary": "Proficient Python"
                },
                {
                    "skill": "Machine Learning",
                    "proficiency": 55.0,
                    "confidence": 75.0,
                    "evidence_count": 2,
                    "evidence_sources": ["resume"],
                    "summary": "Basic ML"
                }
            ]
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/analyze", json=payload)
            self.assertEqual(response.status_code, 200)

            data = response.json()
            self.assertEqual(data["user_id"], "usr_test1")
            self.assertEqual(data["target_role"], "AI/ML Engineer")
            self.assertTrue("readiness_score" in data)
            self.assertTrue(data["readiness_score"] > 0)
            self.assertTrue(len(data["skill_gaps"]) > 0)
            self.assertTrue(len(data["gap_priorities"]) > 0)
            self.assertTrue(len(data["next_best_actions"]) > 0)

            # Check strengths & development areas
            self.assertIn("Python", data["strengths"])
            self.assertIn("Machine Learning", data["development_areas"])

    async def test_unknown_role(self):
        """Test POST /analyze with an invalid target role returns 404 Not Found."""
        payload = {
            "user_id": "usr_test2",
            "target_role": "Quantum Physicist",
            "skills": []
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/analyze", json=payload)
            self.assertEqual(response.status_code, 404)

    async def test_empty_skill_profile(self):
        """Test POST /analyze with empty skills list yields 0.0 readiness and all missing gaps."""
        payload = {
            "user_id": "usr_test3",
            "target_role": "Software Engineer",
            "skills": []
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/analyze", json=payload)
            self.assertEqual(response.status_code, 200)

            data = response.json()
            self.assertEqual(data["readiness_score"], 0.0)
            self.assertTrue(all(g["status"] == "missing" for g in data["skill_gaps"]))

    async def test_correct_readiness_score_calculation(self):
        """Test POST /analyze calculates exact deterministic readiness score."""
        payload = {
            "user_id": "usr_test4",
            "target_role": "AI/ML Engineer",
            "skills": [
                {"skill": "Python", "proficiency": 85.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "Machine Learning", "proficiency": 85.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "Statistics", "proficiency": 75.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "SQL", "proficiency": 70.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "Data Processing", "proficiency": 75.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "Git", "proficiency": 65.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "APIs", "proficiency": 65.0, "confidence": 90.0, "evidence_count": 3, "summary": ""},
                {"skill": "Docker", "proficiency": 60.0, "confidence": 90.0, "evidence_count": 3, "summary": ""}
            ]
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/analyze", json=payload)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["readiness_score"], 100.0)
            self.assertEqual(len(data["gap_priorities"]), 0)

    async def test_gap_priority_action_integrations(self):
        """Test integration across Gaps, Priorities, and Action plan."""
        payload = {
            "user_id": "usr_test5",
            "target_role": "Data Scientist",
            "skills": [
                {"skill": "Python", "proficiency": 85.0, "confidence": 90.0, "evidence_count": 4, "summary": ""}
            ]
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/analyze", json=payload)
            self.assertEqual(response.status_code, 200)

            data = response.json()
            # Verify Python is strength
            self.assertIn("Python", data["strengths"])

            # Verify unresolved gaps appear in priorities and actions
            top_priority = data["gap_priorities"][0]
            top_action = data["next_best_actions"][0]
            self.assertIsNotNone(top_priority)
            self.assertIsNotNone(top_action)


if __name__ == "__main__":
    unittest.main()
