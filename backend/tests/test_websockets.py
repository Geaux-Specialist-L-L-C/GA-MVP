# backend/tests/test_websockets.py
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from unittest.mock import AsyncMock, patch, MagicMock
import pytest
import json
from ..api.websockets import router, ConnectionManager, RateLimiter
from datetime import datetime, timedelta

@pytest.fixture
def test_app():
    from fastapi import FastAPI
    app = FastAPI()
    app.include_router(router)
    return app

@pytest.fixture
def test_client(test_app):
    return TestClient(test_app)

@pytest.fixture
def connection_manager():
    return ConnectionManager()

@pytest.mark.asyncio
async def test_connection_manager_connect():
    manager = ConnectionManager()
    websocket = AsyncMock(spec=WebSocket)
    user_id = "test_user"
    
    await manager.connect(websocket, user_id)
    
    assert user_id in manager.active_connections
    assert websocket in manager.active_connections[user_id]
    websocket.accept.assert_called_once()

@pytest.mark.asyncio
async def test_connection_manager_disconnect():
    manager = ConnectionManager()
    websocket = AsyncMock(spec=WebSocket)
    user_id = "test_user"
    
    # First connect
    await manager.connect(websocket, user_id)
    assert user_id in manager.active_connections
    
    # Then disconnect
    await manager.disconnect(websocket, user_id)
    assert user_id not in manager.active_connections

@pytest.mark.asyncio
async def test_rate_limiter():
    rate_limiter = RateLimiter(max_requests=2, window_seconds=1)
    user_id = "test_user"
    
    # First two requests should be allowed
    assert rate_limiter.is_allowed(user_id) is True
    assert rate_limiter.is_allowed(user_id) is True
    
    # Third request should be blocked
    assert rate_limiter.is_allowed(user_id) is False
    
    # Wait for window to expire
    await asyncio.sleep(1)
    
    # Should be allowed again
    assert rate_limiter.is_allowed(user_id) is True

@pytest.mark.asyncio
async def test_websocket_endpoint_invalid_token():
    websocket = AsyncMock(spec=WebSocket)
    
    with patch('..dependencies.verify_token', side_effect=Exception("Invalid token")):
        await websocket_endpoint(websocket, "invalid_token", MagicMock())
        
    websocket.close.assert_called_once_with(code=1008, reason="Invalid authentication token")

@pytest.mark.asyncio
async def test_websocket_endpoint_subscribe_task():
    websocket = AsyncMock(spec=WebSocket)
    user_id = "test_user"
    task_id = "test_task"
    
    # Mock dependencies
    with patch('..dependencies.verify_token', return_value=user_id), \
         patch('asyncio.create_task') as mock_create_task:
        
        # Mock receive_text to return a subscription message then raise WebSocketDisconnect
        websocket.receive_text = AsyncMock(side_effect=[
            json.dumps({"type": "subscribe_task", "task_id": task_id}),
            WebSocketDisconnect()
        ])
        
        await websocket_endpoint(websocket, "valid_token", MagicMock())
        
        # Verify subscription acknowledgment was sent
        websocket.send_text.assert_called_with(
            json.dumps({
                "type": "subscription_ack",
                "task_id": task_id
            })
        )
        
        # Verify monitoring task was created
        mock_create_task.assert_called_once()

@pytest.mark.asyncio
async def test_monitor_task_status():
    orchestrator = MagicMock()
    user_id = "test_user"
    task_id = "test_task"
    
    # Mock orchestrator responses
    orchestrator.get_task_status = AsyncMock(side_effect=[
        {"status": "in_progress"},
        {"status": "completed"}
    ])
    
    orchestrator.cat_client.memory.recall_memories = AsyncMock(return_value=[
        {"content": '{"result": "test result"}'}
    ])
    
    # Mock the manager's send_status_update
    with patch('..api.websockets.manager.send_status_update') as mock_send_update:
        await monitor_task_status(orchestrator, task_id, user_id)
        
        # Verify status updates were sent
        assert mock_send_update.call_count == 2
        mock_send_update.assert_any_call(user_id, {
            "type": "task_update",
            "task_id": task_id,
            "status": {"status": "in_progress"}
        })
        mock_send_update.assert_any_call(user_id, {
            "type": "task_result",
            "task_id": task_id,
            "result": {"result": "test result"}
        })