from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..auth.jwt_handler import get_current_user, get_admin_user
from ..models.user import UserModel
from ..db.repositories.user_repository import UserRepository
from ..schemas.user import (
    UserCreate, 
    UserUpdate, 
    UserResponse, 
    UserWithLearningStyleResponse
)

router = APIRouter()

@router.get("/me", response_model=UserWithLearningStyleResponse)
async def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    """Get the current logged-in user's profile."""
    return current_user

@router.put("/me", response_model=UserWithLearningStyleResponse)
async def update_current_user_profile(
    user_data: UserUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    """Update the current user's profile."""
    updated_user = await UserRepository.update_user(
        str(current_user.id), 
        user_data.dict(exclude_unset=True)
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User update failed"
        )
        
    return updated_user

@router.get("/", response_model=List[UserResponse])
async def get_all_users(admin_user: UserModel = Depends(get_admin_user)):
    """Get all users (admin only)."""
    db = get_database()
    users = []
    async for user in db.users.find():
        users.append(UserModel(**user))
    return users