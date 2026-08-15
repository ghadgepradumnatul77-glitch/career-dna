import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import init_db, Base, engine

client = TestClient(app)


class TestBackendE2E(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()

    def test_01_health_and_root(self):
        r1 = client.get("/")
        self.assertEqual(r1.status_code, 200)
        self.assertIn("Career DNA API is running", r1.json()["message"])

        r2 = client.get("/health")
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()["status"], "healthy")

    def test_02_auth_signup_and_login(self):
        signup_payload = {
            "email": "engineer@careerdna.ai",
            "password": "Password123!",
            "full_name": "Test Backend Engineer"
        }
        r1 = client.post("/api/v1/auth/signup", json=signup_payload)
        self.assertIn(r1.status_code, [201, 400])

        login_payload = {
            "email": "engineer@careerdna.ai",
            "password": "Password123!"
        }
        r2 = client.post("/api/v1/auth/login", json=login_payload)
        self.assertEqual(r2.status_code, 200)
        data = r2.json()
        self.assertIn("access_token", data)
        self.assertIn("user_id", data)

    def test_03_ingest_resume_and_github(self):
        resume_payload = {
            "raw_text": "Experienced Python Backend Engineer proficient in FastAPI, PostgreSQL, SQLAlchemy, Docker, and REST API design.",
            "file_name": "resume_test.pdf",
            "parsed_skills": ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker"]
        }
        r1 = client.post("/api/v1/ingest/resume", json=resume_payload)
        self.assertEqual(r1.status_code, 201)
        res_data = r1.json()
        self.assertEqual(res_data["source_type"], "resume")
        self.assertIn("Python", res_data["extracted_skills"])

        github_payload = {
            "github_username": "testdeveloper",
            "repos": [{"name": "career-dna-backend", "stars": 12}],
            "top_languages": {"Python": 8500, "TypeScript": 3200}
        }
        r2 = client.post("/api/v1/ingest/github", json=github_payload)
        self.assertEqual(r2.status_code, 201)
        gh_data = r2.json()
        self.assertEqual(gh_data["source_type"], "github")

    def test_04_career_dna_retrieval(self):
        r = client.get("/api/v1/career-dna")
        self.assertEqual(r.status_code, 200)
        dna = r.json()
        self.assertGreater(dna["overall_score"], 0)
        self.assertIn("Python", dna["skill_matrix"])

    def test_05_evidence_retrieval(self):
        r = client.get("/api/v1/evidence")
        self.assertEqual(r.status_code, 200)
        evidence_list = r.json()
        self.assertGreater(len(evidence_list), 0)

    def test_06_skill_gap_analysis(self):
        gap_payload = {
            "target_role": "Senior Backend Engineer"
        }
        r = client.post("/api/v1/skill-gap/analyze", json=gap_payload)
        self.assertEqual(r.status_code, 201)
        gap = r.json()
        self.assertEqual(gap["target_role"], "Senior Backend Engineer")
        self.assertGreater(gap["match_percentage"], 0)

    def test_07_recommendations(self):
        r1 = client.post("/api/v1/recommendations/generate?target_role=Senior Backend Engineer")
        self.assertEqual(r1.status_code, 201)
        recs = r1.json()
        self.assertGreater(len(recs), 0)

        rec_id = recs[0]["id"]
        r2 = client.patch(f"/api/v1/recommendations/{rec_id}/toggle")
        self.assertEqual(r2.status_code, 200)
        self.assertTrue(r2.json()["is_completed"])


if __name__ == "__main__":
    unittest.main()
