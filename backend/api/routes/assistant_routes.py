# File: /backend/app/api/routes/assistant_routes.py
# Description: API endpoints for AI assistant functionality
# Author: evopimp
# Created: 2025-02-27

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.cheshire_cat_service import CheshireCatService
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()

class ChatMessage(BaseModel):
    content: str
    
class ChatResponse(BaseModel):
    message: str
    sources: Optional[List[Dict[str, Any]]] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    cat_service: CheshireCatService = Depends(lambda: CheshireCatService())
):
    """
    Send a message to the AI assistant and get a response
    """
    try:
        user_id = str(current_user.id)
        result = await cat_service.send_message(user_id, message.content)
        
        # Extract the response and sources from the result
        response_text = result.get("content", "I'm unable to respond right now.")
        sources = result.get("sources", [])
        
        return ChatResponse(
            message=response_text,
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_learning_material(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    course_id: str = Form(...),
    lesson_id: Optional[str] = Form(None),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    cat_service: CheshireCatService = Depends(lambda: CheshireCatService())
):
    """
    Upload learning material to the AI assistant's knowledge base
    """
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Only instructors can upload learning materials")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Create metadata
        metadata = {
            "course_id": course_id,
            "title": title,
            "uploaded_by": str(current_user.id),
            "type": "learning_material"
        }
        
        if lesson_id:
            metadata["lesson_id"] = lesson_id
            
        if description:
            metadata["description"] = description
        
        # Upload document in background task to avoid timeout
        background_tasks.add_task(
            cat_service.upload_document,
            file_content,
            file.filename,
            metadata
        )
        
        return {"message": "Document upload started", "status": "processing"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))