import unittest
import httpx

from app.main import app


class TestEvidenceRoute(unittest.IsolatedAsyncioTestCase):

    async def test_valid_evidence_submission(self):
        """Test POST /evidence with valid payload returns 200 OK and validated object."""
        payload = {
            "skill": "Python",
            "source": "github",
            "evidence_type": "code_usage",
            "source_ref": "github.com/example/project",
            "strength": 85.0,
            "confidence": 90.0,
            "relevance": 95.0,
            "recency": 80.0,
            "description": "Python used extensively in multiple project files"
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/evidence", json=payload)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["skill"], "Python")
            self.assertEqual(data["source"], "github")
            self.assertEqual(data["strength"], 85.0)

    async def test_missing_required_field(self):
        """Test POST /evidence missing 'skill' field returns 422 Unprocessable Entity."""
        payload = {
            "source": "github",
            "evidence_type": "code_usage",
            "strength": 85.0,
            "confidence": 90.0,
            "relevance": 95.0,
            "recency": 80.0,
            "description": "Missing skill field"
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/evidence", json=payload)
            self.assertEqual(response.status_code, 422)

    async def test_invalid_numeric_values(self):
        """Test POST /evidence with strength > 100 returns 422 Unprocessable Entity."""
        payload = {
            "skill": "Python",
            "source": "github",
            "evidence_type": "code_usage",
            "strength": 150.0,  # Invalid: > 100
            "confidence": 90.0,
            "relevance": 95.0,
            "recency": 80.0,
            "description": "Invalid strength score"
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/evidence", json=payload)
            self.assertEqual(response.status_code, 422)

    async def test_invalid_evidence_payload(self):
        """Test POST /evidence with invalid non-numeric strength returns 422."""
        payload = {
            "skill": "Python",
            "source": "github",
            "evidence_type": "code_usage",
            "strength": "not_a_number",  # Invalid float
            "confidence": 90.0,
            "relevance": 95.0,
            "recency": 80.0,
            "description": "Invalid payload format"
        }
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post("/evidence", json=payload)
            self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
