# File: /backend/services/supabase_service.py
# Description: Supabase integration service for FastAPI backend
# Author: evopimp
# Created: 2025-02-26

import os
from typing import Dict, List, Optional, Any, Union
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import HTTPException

load_dotenv()

class SupabaseService:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        supabase_ssl = os.getenv("SUPABASE_SSL", "false").lower() == "true"
        
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL and key must be provided in environment variables")
        
        options = {
            "schema": "public",
            "headers": {},
            "autoRefreshToken": True,
            "persistSession": True,
            "detectSessionInUrl": True,
        }
        
        if supabase_ssl:
            options["ssl"] = {"rejectUnauthorized": True}
        
        self.client: Client = create_client(supabase_url, supabase_key, options)
    
    async def get_user(self, user_id: str) -> Dict[str, Any]:
        """Retrieve user data by user ID."""
        response = self.client.table("profiles").select("*").eq("id", user_id).execute()
        
        if response.error:
            raise HTTPException(status_code=500, detail=f"Database error: {response.error.message}")
        
        if not response.data:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
            
        return response.data[0]
    
    async def get_courses(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Retrieve all courses with pagination."""
        response = self.client.table("courses").select("*").order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        
        if response.error:
            raise HTTPException(status_code=500, detail=f"Database error: {response.error.message}")
            
        return response.data
    
    async def get_course(self, course_id: str) -> Dict[str, Any]:
        """Retrieve a specific course by ID."""
        response = self.client.table("courses").select("*, lessons(*)").eq("id", course_id).single().execute()
        
        if response.error:
            if "Results contain 0 rows" in response.error.message:
                raise HTTPException(status_code=404, detail=f"Course with ID {course_id} not found")
            raise HTTPException(status_code=500, detail=f"Database error: {response.error.message}")
            
        return response.data
    
    async def get_user_progress(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve learning progress for a user."""
        response = self.client.table("user_progress").select("*").eq("user_id", user_id).execute()
        
        if response.error:
            raise HTTPException(status_code=500, detail=f"Database error: {response.error.message}")
            
        return response.data
    
    async def update_user_progress(self, user_id: str, lesson_id: str, is_completed: bool) -> Dict[str, Any]:
        """Update user progress on a specific lesson."""
        response = self.client.table("user_progress").upsert({
            "user_id": user_id,
            "lesson_id": lesson_id,
            "is_completed": is_completed,
            "last_updated": "now()"
        }).execute()
        
        if response.error:
            raise HTTPException(status_code=500, detail=f"Database error: {response.error.message}")
            
        return response.data[0] if response.data else {}
