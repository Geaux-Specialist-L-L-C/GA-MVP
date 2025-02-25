# File: /backend/middleware/security.py
# Description: Security middleware for FERPA compliance and rate limiting

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import jwt
from typing import Dict, Optional
from pymongo import MongoClient, ASCENDING
from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.geaux_academy

# Create indexes for performance
db.audit_logs.create_index([("timestamp", ASCENDING)])
db.audit_logs.create_index([("user_id", ASCENDING)])
db.rate_limits.create_index([("ip", ASCENDING)])
db.rate_limits.create_index([("timestamp", ASCENDING)])

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

class SecurityMiddleware:
    def __init__(self, app: FastAPI):
        self.app = app
        self.security = HTTPBearer()
        
        # Add CORS middleware
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["https://geaux-academy.com"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    async def verify_token(self, credentials: HTTPAuthorizationCredentials) -> Dict:
        try:
            token = credentials.credentials
            payload = jwt.decode(token, "your-secret-key", algorithms=["HS256"])
            return payload
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

    async def log_audit_event(
        self,
        request: Request,
        user_id: str,
        action: str,
        resource: str,
        status: str,
        details: Optional[Dict] = None
    ):
        """Log audit events for FERPA compliance"""
        audit_entry = {
            "timestamp": datetime.utcnow(),
            "user_id": user_id,
            "ip_address": request.client.host,
            "action": action,
            "resource": resource,
            "status": status,
            "details": details or {},
            "headers": dict(request.headers),
            "method": request.method,
            "path": request.url.path
        }
        
        await db.audit_logs.insert_one(audit_entry)

    async def check_rate_limit(self, request: Request):
        """Implement rate limiting"""
        ip = request.client.host
        current_time = datetime.utcnow()
        window_start = current_time - timedelta(minutes=1)
        
        # Count requests in the last minute
        request_count = await db.rate_limits.count_documents({
            "ip": ip,
            "timestamp": {"$gte": window_start}
        })
        
        if request_count >= 100:  # 100 requests per minute limit
            raise HTTPException(
                status_code=429,
                detail="Too many requests"
            )
        
        # Log this request
        await db.rate_limits.insert_one({
            "ip": ip,
            "timestamp": current_time
        })

# File: /backend/middleware/input_validation.py
# Description: Input validation and sanitization

from pydantic import BaseModel, Field, validator
from typing import List, Optional
import re

class LearningStyleInput(BaseModel):
    visual: float = Field(..., ge=0, le=1)
    auditory: float = Field(..., ge=0, le=1)
    kinesthetic: float = Field(..., ge=0, le=1)
    reading_writing: float = Field(..., ge=0, le=1)

    @validator('*')
    def validate_percentages(cls, v):
        if not isinstance(v, float):
            raise ValueError('All values must be floats')
        return round(v, 2)

class CurriculumInput(BaseModel):
    subject: str = Field(..., min_length=1, max_length=100)
    grade_level: int = Field(..., ge=1, le=12)
    learning_style: str = Field(..., regex='^(visual|auditory|kinesthetic|reading_writing)$')
    
    @validator('subject')
    def sanitize_subject(cls, v):
        # Remove any special characters
        return re.sub(r'[^a-zA-Z0-9\s]', '', v)

# File: /backend/tests/test_security.py
# Description: Security middleware tests

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from ..middleware.security import SecurityMiddleware

@pytest.fixture
def test_app():
    from fastapi import FastAPI
    app = FastAPI()
    SecurityMiddleware(app)
    return app

@pytest.fixture
def client(test_app):
    return TestClient(test_app)

def test_rate_limiting(client):
    # Test rate limiting
    for _ in range(100):
        response = client.get("/api/test")
        assert response.status_code != 429
    
    response = client.get("/api/test")
    assert response.status_code == 429

def test_audit_logging(client):
    # Test audit logging
    response = client.get("/api/test", headers={"Authorization": "Bearer test-token"})
    
    # Verify audit log entry
    log_entry = db.audit_logs.find_one({"action": "GET /api/test"})
    assert log_entry is not None
    assert log_entry["user_id"] == "test-user"
