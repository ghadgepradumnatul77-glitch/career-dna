import os
import unittest
import httpx

# Force in-memory database for testing
os.environ["CAREER_DNA_DB_PATH"] = ":memory:"

from app.main import app
from services.db_service import reset_in_memory_db


class TestPersistenceRoutes(unittest.IsolatedAsyncioTestCase):

    def setUp(self):
        reset_in_memory_db()

    async def test_post_analyze_persists_and_retrieves(self):
        """Test POST /analyze persists results, and GET endpoints retrieve them successfully."""
        user_id = "usr_persist_test1"
        payload = {
            "user_id": user_id,
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
            # 1. Trigger POST /analyze
            analyze_res = await client.post("/analyze", json=payload)
            self.assertEqual(analyze_res.status_code, 200)

            # 2. Test GET /career-dna/{user_id}
            dna_res = await client.get(f"/career-dna/{user_id}")
            self.assertEqual(dna_res.status_code, 200)
            dna_data = dna_res.json()
            self.assertEqual(dna_data["user_id"], user_id)
            self.assertEqual(dna_data["target_role"], "AI/ML Engineer")
            self.assertIn("Python", dna_data["strengths"])

            # 3. Test GET /gaps/{user_id}
            gaps_res = await client.get(f"/gaps/{user_id}")
            self.assertEqual(gaps_res.status_code, 200)
            gaps_data = gaps_res.json()
            self.assertEqual(gaps_data["user_id"], user_id)
            self.assertTrue(len(gaps_data["gaps"]) > 0)

            # Test GET /gaps/{user_id}?unresolved_only=true
            unresolved_gaps_res = await client.get(f"/gaps/{user_id}?unresolved_only=true")
            self.assertEqual(unresolved_gaps_res.status_code, 200)
            unresolved_gaps_data = unresolved_gaps_res.json()
            self.assertTrue(all(g["status"] in ("missing", "needs_improvement") for g in unresolved_gaps_data["gaps"]))

            # 4. Test GET /priorities/{user_id}
            prio_res = await client.get(f"/priorities/{user_id}")
            self.assertEqual(prio_res.status_code, 200)
            prio_data = prio_res.json()
            self.assertEqual(prio_data["user_id"], user_id)
            self.assertTrue(len(prio_data["priorities"]) > 0)

            # 5. Test GET /actions/{user_id}
            act_res = await client.get(f"/actions/{user_id}?limit=2")
            self.assertEqual(act_res.status_code, 200)
            act_data = act_res.json()
            self.assertEqual(act_data["user_id"], user_id)
            self.assertEqual(len(act_data["actions"]), 2)

    async def test_unknown_user_retrieval_returns_404(self):
        """Test GET endpoints for non-existent user_id return 404 Not Found."""
        unknown_id = "usr_non_existent"
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            self.assertEqual((await client.get(f"/career-dna/{unknown_id}")).status_code, 404)
            self.assertEqual((await client.get(f"/gaps/{unknown_id}")).status_code, 404)
            self.assertEqual((await client.get(f"/priorities/{unknown_id}")).status_code, 404)
            self.assertEqual((await client.get(f"/actions/{unknown_id}")).status_code, 404)


if __name__ == "__main__":
    unittest.main()
