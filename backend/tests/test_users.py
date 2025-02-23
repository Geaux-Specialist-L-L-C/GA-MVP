# File: /backend/tests/test_users.py
# Description: Unit test for user authentication and profile retrieval API.

from fastapi.testclient import TestClient
from main import app
from auth.jwt_handler import create_access_token

client = TestClient(app)

def test_get_user_profile():
    response = client.get("/users/me")
    assert response.status_code == 401  # Expect unauthorized without authentication

def test_get_user_profile_authorized():
    token = create_access_token({"sub": "testuser"})
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200  # Expect authorized access with valid token

def test_get_user_profile_invalid_token():
    headers = {"Authorization": "Bearer invalidtoken"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 401  # Expect unauthorized with invalid token
