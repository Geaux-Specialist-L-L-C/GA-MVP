# backend/api/websockets.py
from fastapi import WebSocket, WebSocketDisconnect, Depends, APIRouter, HTTPException
from typing import Dict, List, Any
import json
import asyncio
from datetime import datetime, timedelta
from ..dependencies import get_orchestrator, verify_token
from ...crewai.orchestrator.task_manager import TaskOrchestrator

router = APIRouter()

class RateLimiter:
    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[datetime]] = {}

    def is_allowed(self, user_id: str) -> bool:
        now = datetime.now()
        if user_id not in self.requests:
            self.requests[user_id] = []

        # Remove old timestamps
        self.requests[user_id] = [
            ts for ts in self.requests[user_id]
            if ts > now - timedelta(seconds=self.window_seconds)
        ]

        # Check if under limit
        if len(self.requests[user_id]) < self.max_requests:
            self.requests[user_id].append(now)
            return True
        return False

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.rate_limiter = RateLimiter()
    
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
        if not self.rate_limiter.is_allowed(user_id):
            return  # Skip sending if rate limit exceeded

        if user_id in self.active_connections:
            dead_connections = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    dead_connections.append(connection)
            
            # Clean up dead connections
            for dead in dead_connections:
                await self.disconnect(dead, user_id)

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
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if not manager.rate_limiter.is_allowed(user_id):
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "error": "Rate limit exceeded. Please wait before sending more messages."
                    }))
                    continue
                
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
                elif message.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "error": "Invalid message format"
                }))
    except WebSocketDisconnect:
        await manager.disconnect(websocket, user_id)
    except Exception as e:
        await websocket.send_text(json.dumps({
            "type": "error",
            "error": f"An error occurred: {str(e)}"
        }))
        await manager.disconnect(websocket, user_id)

async def monitor_task_status(orchestrator: TaskOrchestrator, task_id: str, user_id: str):
    """Monitor a task's status and send updates via WebSocket"""
    prev_status = None
    error_count = 0
    max_errors = 3
    
    while True:
        try:
            # Get current task status
            status = await orchestrator.get_task_status(task_id)
            
            # Reset error count on successful status check
            error_count = 0
            
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
            error_count += 1
            print(f"Error monitoring task: {str(e)}")
            
            # Send error notification to client
            await manager.send_status_update(user_id, {
                "type": "error",
                "task_id": task_id,
                "error": f"Error monitoring task: {str(e)}"
            })
            
            # Stop monitoring if too many errors occur
            if error_count >= max_errors:
                await manager.send_status_update(user_id, {
                    "type": "task_update",
                    "task_id": task_id,
                    "status": {
                        "status": "failed",
                        "details": "Monitoring stopped due to repeated errors"
                    }
                })
                break
            
            # Wait longer before retrying after an error
            await asyncio.sleep(5)