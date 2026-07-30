import os
import unittest
from pathlib import Path

os.environ["DATABASE_URL"] = f"sqlite:///{Path(__file__).resolve().parent / 'test_complaints.db'}"

from fastapi.testclient import TestClient

from app.main import app


class ComplaintAPITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_create_and_fetch_complaints(self) -> None:
        payload = {
            "complaint_id": "CMP-1001",
            "customer_name": "Jane Smith",
            "complaint_source": "Email",
            "product_name": "Product A",
            "product_strength": "100 mg",
            "batch_number": "BATCH-001",
            "manufacturing_date": "2024-01-01",
            "expiry_date": "2026-01-01",
            "quantity": 10,
            "complaint_category": "Packaging",
            "complaint_description": "Damaged packaging received.",
            "severity": "moderate",
            "priority": "high",
            "status": "open",
        }

        create_response = self.client.post("/complaints", json=payload)
        self.assertEqual(create_response.status_code, 201)
        created = create_response.json()
        self.assertEqual(created["complaint_id"], payload["complaint_id"])

        list_response = self.client.get("/complaints")
        self.assertEqual(list_response.status_code, 200)
        self.assertGreaterEqual(len(list_response.json()), 1)


if __name__ == "__main__":
    unittest.main()
