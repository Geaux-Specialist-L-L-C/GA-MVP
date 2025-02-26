from typing import List, Optional, Dict, Any
from ..connection import get_database
from ...models.user import UserModel
from bson import ObjectId

class UserRepository:
    @staticmethod
    async def create_user(user_data: Dict[str, Any]) -> UserModel:
        """Create a new user."""
        db = get_database()
        user_dict = {k: v for k, v in user_data.items() if v is not None}
        result = await db.users.insert_one(user_dict)
        
        # Retrieve the newly created user
        user = await db.users.find_one({"_id": result.inserted_id})
        return UserModel(**user)
    
    @staticmethod
    async def get_user_by_firebase_uid(firebase_uid: str) -> Optional[UserModel]:
        """Get a user by Firebase UID."""
        db = get_database()
        user = await db.users.find_one({"firebase_uid": firebase_uid})
        if user:
            return UserModel(**user)
        return None
        
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserModel]:
        """Get a user by MongoDB ID."""
        db = get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserModel(**user)
        return None
    
    @staticmethod
    async def update_user(user_id: str, update_data: Dict[str, Any]) -> Optional[UserModel]:
        """Update a user's information."""
        db = get_database()
        update_data = {k: v for k, v in update_data.items() if v is not None}
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            return UserModel(**user)
        return None
    
    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete a user."""
        db = get_database()
        result = await db.users.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0