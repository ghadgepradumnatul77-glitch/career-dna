import unittest
import httpx

from app.main import app


class TestHealthEndpoint(unittest.IsolatedAsyncioTestCase):

    async def test_health_check(self):
        """Test GET /health returns status 200 and {'status': 'ok'}."""
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.get("/health")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), {"status": "ok"})


if __name__ == "__main__":
    unittest.main()
