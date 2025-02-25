# backend/api/routes/agent_routes.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Dict, Any
from pydantic import BaseModel
from firebase_admin import auth
from ..dependencies import get_orchestrator, get_current_user
from ...crewai.orchestrator.task_manager import TaskOrchestrator

router = APIRouter()

class TaskRequest(BaseModel):
    task_type: str
    subject: str
    grade_level: str
    learning_style: str
    custom_params: Dict[str, Any] = {}

class TaskResponse(BaseModel):
    task_id: str
    status: str

class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    details: str = None
    result: Dict[str, Any] = None

@router.post("/tasks", response_model=TaskResponse)
async def create_task(
    request: TaskRequest,
    background_tasks: BackgroundTasks,
    orchestrator: TaskOrchestrator = Depends(get_orchestrator),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new agent task"""
    
    # Prepare task input with user information
    task_input = {
        **request.dict(),
        "user_id": current_user["uid"],
        "user_email": current_user["email"]
    }
    
    # Start task execution asynchronously
    task_id = await orchestrator.execute_async_task(task_input)
    
    return {"task_id": task_id, "status": "in_progress"}

@router.get("/tasks/{task_id}/status", response_model=TaskStatusResponse)
async def get_task_status(
    task_id: str,
    orchestrator: TaskOrchestrator = Depends(get_orchestrator),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get the status of a task"""
    status = await orchestrator.get_task_status(task_id)
    
    if status["status"] == "unknown":
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
    
    # If task is completed, get the full result
    result = None
    if status["status"] == "completed":
        memories = await orchestrator.cat_client.memory.recall_memories(
            query="",
            filters={
                "type": "task_result",
                "task_id": task_id
            },
            limit=1
        )
        if memories:
            try:
                result = eval(memories[0]["content"])  # Convert string representation back to dict
            except:
                result = {"content": memories[0]["content"]}
    
    return {
        "task_id": task_id,
        "status": status["status"],
        "details": status.get("details", ""),
        "result": result
    }