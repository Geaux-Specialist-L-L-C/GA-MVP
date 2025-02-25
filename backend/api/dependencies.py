# backend/api/dependencies.py
from fastapi import Depends, HTTPException, Request
from firebase_admin import auth, credentials, initialize_app
import firebase_admin
from typing import Dict, Any
from pymongo import MongoClient
import os

# Initialize Firebase Admin SDK
cred = credentials.Certificate(os.getenv("FIREBASE_ADMIN_SDK_PATH"))
try:
    firebase_app = initialize_app(cred)
except ValueError:
    # App already initialized
    firebase_app = firebase_admin.get_app()

# MongoDB connection
mongodb_client = MongoClient(os.getenv("MONGODB_URI"))

def get_mongodb_client():
    """Dependency to get MongoDB client"""
    return mongodb_client

async def verify_token(token: str) -> str:
    """Verify Firebase ID token and return user ID"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication token: {str(e)}"
        )

async def get_current_user(request: Request) -> Dict[str, Any]:
    """Dependency to get the current user from a Firebase ID token in headers"""
    authorization = request.headers.get("Authorization")
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header"
        )
    
    token = authorization.split("Bearer ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication token: {str(e)}"
        )