# backend/api/websockets.py
from fastapi import WebSocket, WebSocketDisconnect, Depends, APIRouter
from typing import Dict, List, Any
import json
import asyncio
from ..dependencies import get_orchestrator, verify_token
from ...crewai.orchestrator.task_manager import TaskOrchestrator

router = APIRouter()

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
    
    async def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def send_status_update(self, user_id: str, message: Dict[str, Any]):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_text(json.dumps(message))

manager = ConnectionManager()

@router.websocket("/ws/tasks/{token}")
async def websocket_endpoint(
    websocket: WebSocket, 
    token: str,
    orchestrator: TaskOrchestrator = Depends(get_orchestrator)
):
    # Verify the token and get the user ID
    try:
        user_id = await verify_token(token)
    except Exception as e:
        await websocket.close(code=1008, reason="Invalid authentication token")
        return
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "subscribe_task":
                task_id = message.get("task_id")
                if task_id:
                    # Start a background task to monitor the task status
                    asyncio.create_task(
                        monitor_task_status(orchestrator, task_id, user_id)
                    )
                    
                    # Send immediate acknowledgment
                    await websocket.send_text(json.dumps({
                        "type": "subscription_ack",
                        "task_id": task_id
                    }))
    except WebSocketDisconnect:
        await manager.disconnect(websocket, user_id)

async def monitor_task_status(orchestrator: TaskOrchestrator, task_id: str, user_id: str):
    """Monitor a task's status and send updates via WebSocket"""
    prev_status = None
    
    while True:
        try:
            # Get current task status
            status = await orchestrator.get_task_status(task_id)
            
            # If status changed, send update
            if prev_status != status["status"]:
                prev_status = status["status"]
                await manager.send_status_update(user_id, {
                    "type": "task_update",
                    "task_id": task_id,
                    "status": status
                })
            
            # If task is completed or failed, stop monitoring
            if status["status"] in ["completed", "failed"]:
                # Send final update with result for completed tasks
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
                            result = eval(memories[0]["content"])
                        except:
                            result = {"content": memories[0]["content"]}
                        
                        await manager.send_status_update(user_id, {
                            "type": "task_result",
                            "task_id": task_id,
                            "result": result
                        })
                
                break
            
            # Wait before checking again
            await asyncio.sleep(2)
        except Exception as e:
            print(f"Error monitoring task: {str(e)}")
            break