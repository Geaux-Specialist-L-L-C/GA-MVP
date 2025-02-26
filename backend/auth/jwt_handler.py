from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import os
from ..db.repositories.user_repository import UserRepository
from ..models.user import UserModel

# Initialize Firebase Admin SDK
cred = credentials.Certificate(os.environ.get("FIREBASE_ADMIN_CREDENTIALS_PATH"))
firebase_app = firebase_admin.initialize_app(cred)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserModel:
    """Validate Firebase JWT and return the associated user."""
    token = credentials.credentials
    
    try:
        # Verify the token with Firebase
        decoded_token = auth.verify_id_token(token)
        firebase_uid = decoded_token['uid']
        
        # Get user from MongoDB
        user = await UserRepository.get_user_by_firebase_uid(firebase_uid)
        
        # If user exists in Firebase but not in our DB, create them
        if not user:
            email = decoded_token.get('email', '')
            name = decoded_token.get('name', 'User')
            picture = decoded_token.get('picture', '')
            
            user_data = {
                "firebase_uid": firebase_uid,
                "email": email,
                "display_name": name,
                "avatar_url": picture,
                "role": "student"  # Default role
            }
            
            user = await UserRepository.create_user(user_data)
            
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_admin_user(user: UserModel = Depends(get_current_user)) -> UserModel:
    """Verify the user has admin privileges."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action"
        )
    return user