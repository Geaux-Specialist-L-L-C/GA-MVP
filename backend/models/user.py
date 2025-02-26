from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
        
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firebase_uid: str
    email: EmailStr
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    learning_style: Optional[Dict[str, float]] = None
    role: str = "student"
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
        schema_extra = {
            "example": {
                "firebase_uid": "5fE2Abc3DeF4gHi5Jkl6Mno7",
                "email": "student@example.com",
                "display_name": "John Doe",
                "bio": "Computer Science Student",
                "avatar_url": "https://example.com/avatar.jpg",
                "learning_style": {
                    "visual": 0.7,
                    "auditory": 0.4,
                    "reading": 0.5,
                    "kinesthetic": 0.8
                },
                "role": "student"
            }
        }