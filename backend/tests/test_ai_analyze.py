import unittest

from fastapi.testclient import TestClient

from app.main import app


class AIAnalyzeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_analyze_text(self) -> None:
        response = self.client.post(
            "/ai/analyze",
            data={"text": "Customer Jane Smith reported a damaged bottle of Product A 100 mg from batch BATCH-002. The issue happened on 2024-03-01 and the expiry date is 2026-03-01. About 5 units were affected. Severity is high and priority urgent."},
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("summary", payload)
        self.assertIn("extracted_data", payload)
        self.assertIn("risk_badge", payload)


if __name__ == "__main__":
    unittest.main()
