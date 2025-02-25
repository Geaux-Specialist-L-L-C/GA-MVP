# backend/api/routes/user_routes.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from ..dependencies import get_current_user, get_mongodb_client
from pymongo import MongoClient
from bson import ObjectId

router = APIRouter()

class UserProfile(BaseModel):
    name: str
    email: str
    role: str = "student"
    preferences: Dict[str, Any] = {}

class LearningStyle(BaseModel):
    style: str
    results: Dict[str, Any] = {}
    timestamp: Optional[str] = None

class CurriculumCreate(BaseModel):
    title: str
    subject: str
    grade_level: str
    learning_style: str
    modules: List[Dict[str, Any]]
    recommendations: List[str] = []

# Helper to convert MongoDB ObjectId to string in responses
def serialize_mongodb_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

@router.get("/users/{user_id}", response_model=Dict[str, Any])
async def get_user_profile(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    mongodb: MongoClient = Depends(get_mongodb_client)
):
    """Get a user's profile from MongoDB"""
    # Ensure user can only access their own profile
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this profile")
    
    users_collection = mongodb.get_database("geaux_academy").get_collection("users")
    
    # Find user by Firebase UID
    user = users_collection.find_one({"firebase_uid": user_id})
    
    if not user:
        # Create user profile if it doesn't exist
        new_user = {
            "firebase_uid": user_id,
            "email": current_user["email"],
            "name": current_user.get("displayName", ""),
            "role": "student",
            "created_at": datetime.utcnow(),
            "preferences": {}
        }
        
        result = users_collection.insert_one(new_user)
        user = users_collection.find_one({"_id": result.inserted_id})
    
    return serialize_mongodb_doc(user)

@router.put("/users/{user_id}", response_model=Dict[str, Any])
async def update_user_profile(
    user_id: str,
    profile_data: UserProfile,
    current_user: Dict[str, Any] = Depends(get_current_user),
    mongodb: MongoClient = Depends(get_mongodb_client)
):
    """Update a user's profile in MongoDB"""
    # Ensure user can only update their own profile
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    users_collection = mongodb.get_database("geaux_academy").get_collection("users")
    
    # Update user profile
    users_collection.update_one(
        {"firebase_uid": user_id},
        {"$set": {
            "name": profile_data.name,
            "email": profile_data.email,
            "role": profile_data.role,
            "preferences": profile_data.preferences,
            "updated_at": datetime.utcnow()
        }},
        upsert=True
    )
    
    # Get updated user
    updated_user = users_collection.find_one({"firebase_uid": user_id})
    
    return serialize_mongodb_doc(updated_user)

@router.post("/users/{user_id}/learning-style", response_model=Dict[str, Any])
async def save_learning_style(
    user_id: str,
    learning_style: LearningStyle,
    current_user: Dict[str, Any] = Depends(get_current_user),
    mongodb: MongoClient = Depends(get_mongodb_client)
):
    """Save a user's learning style assessment results"""
    # Ensure user can only update their own learning style
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    users_collection = mongodb.get_database("geaux_academy").get_collection("users")
    learning_styles_collection = mongodb.get_database("geaux_academy").get_collection("learning_styles")
    
    # Create learning style document
    style_doc = {
        "user_id": user_id,
        "style": learning_style.style,
        "results": learning_style.results,
        "timestamp": datetime.utcnow(),
        "created_at": datetime.utcnow()
    }
    
    result = learning_styles_collection.insert_one(style_doc)
    
    # Update user profile with learning style reference
    users_collection.update_one(
        {"firebase_uid": user_id},
        {"$set": {
            "learning_style": learning_style.style,
            "learning_style_id": result.inserted_id,
            "updated_at": datetime.utcnow()
        }}
    )
    
    style_doc["id"] = str(result.inserted_id)
    del style_doc["_id"]
    
    return style_doc

@router.get("/users/{user_id}/learning-style", response_model=Dict[str, Any])
async def get_learning_style(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    mongodb: MongoClient = Depends(get_mongodb_client)
):
    """Get a user's learning style"""
    # Ensure user can only access their own learning style
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this data")
    
    learning_styles_collection = mongodb.get_database("geaux_academy").get_collection("learning_styles")
    
    # Get latest learning style
    learning_style = learning_styles_collection.find_one(
        {"user_id": user_id},
        sort=[("timestamp", -1)]
    )
    
    if not learning_style:
        raise HTTPException(status_code=404, detail="Learning style not found")
    
    return serialize_mongodb_doc(learning_style)

@router.post("/users/{user_id}/curriculum", response_model=Dict[str, Any])
async def save_curriculum(
    user_id: str,
    curriculum: CurriculumCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    mongodb: MongoClient = Depends(get_mongodb_client)
):
    """Save a generated curriculum"""
    # Ensure user can only save to their own account
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    curriculum_collection = mongodb.get_database("geaux_academy").get_collection("curriculums")
    
    # Create curriculum document
    curriculum_doc = {
        "user_id": user_id,
        "title": curriculum.title,
        "subject": curriculum.subject,
        "grade_level": curriculum.grade_level,
        "learning_style": curriculum.learning_style,
        "modules": curriculum.modules,
        "recommendations": curriculum.recommendations,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = curriculum_collection.insert_one(curriculum_doc)
    
    curriculum_doc["id"] = str(result.inserted_id)
    del curriculum_doc["_id"]
    
    return curriculum_doc
