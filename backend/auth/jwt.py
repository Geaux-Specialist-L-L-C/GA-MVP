# File: /backend/auth/jwt.py
# Description: JWT authentication handler for API security
# Author: GitHub Copilot
# Created: 2024-02-20

from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel

from core.config import settings
from models.student import Student
from core.exceptions import UnauthorizedAccessError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    firebase_uid: str
    exp: datetime

async def create_access_token(
    firebase_uid: str,
    expires_delta: Optional[timedelta] = None
) -> Token:
    """Create a new JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "sub": firebase_uid,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return Token(
        access_token=encoded_jwt,
        token_type="bearer",
        expires_in=int((expire - datetime.utcnow()).total_seconds())
    )

async def verify_token(token: str = Depends(oauth2_scheme)) -> TokenData:
    """Verify the JWT token and return the token data."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        firebase_uid: str = payload.get("sub")
        if firebase_uid is None:
            raise credentials_exception
        
        exp = datetime.fromtimestamp(payload.get("exp"))
        return TokenData(firebase_uid=firebase_uid, exp=exp)
    
    except JWTError:
        raise credentials_exception

async def get_current_user(token_data: TokenData = Depends(verify_token)) -> dict:
    """Get the current user from Firebase using the token data."""
    try:
        # Verify the user exists in Firebase
        user = firebase_auth.get_user(token_data.firebase_uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name,
            "email_verified": user.email_verified
        }
    except firebase_auth.UserNotFoundError:
        raise UnauthorizedAccessError("User not found")
    except Exception as e:
        raise UnauthorizedAccessError(f"Authentication failed: {str(e)}")

async def get_current_student(
    current_user: dict = Depends(get_current_user)
) -> Student:
    """Get the current student profile."""
    student = Student.get_by_user_id(current_user["uid"])
    if not student:
        raise UnauthorizedAccessError("Student profile not found")
    return student

def verify_firebase_token(token: str) -> dict:
    """Verify a Firebase ID token."""
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False)
        }
    except Exception as e:
        raise UnauthorizedAccessError(f"Invalid Firebase token: {str(e)}")

def require_role(allowed_roles: list[str]):
    """Decorator to check if the current user has the required role."""
    async def role_checker(current_user: dict = Depends(get_current_user)):
        try:
            # Get user's custom claims from Firebase
            user = firebase_auth.get_user(current_user["uid"])
            user_roles = user.custom_claims.get("roles", []) if user.custom_claims else []
            
            if not any(role in allowed_roles for role in user_roles):
                raise UnauthorizedAccessError(
                    "User does not have the required role(s)"
                )
            return current_user
        except Exception as e:
            raise UnauthorizedAccessError(f"Role verification failed: {str(e)}")
    
    return role_checker