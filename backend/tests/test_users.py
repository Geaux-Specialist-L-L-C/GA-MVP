# File: /backend/tests/test_users.py
# Description: Unit test for user authentication and profile retrieval API.

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_user_profile():
    response = client.get("/users/me")
    assert response.status_code == 401  # Expect unauthorized without authentication
