# File: /backend/api/monitoring.py
# Description: FastAPI endpoints for monitoring system

from fastapi import APIRouter, WebSocket, Depends, HTTPException, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import asyncio
from pymongo import MongoClient
from ..monitoring.agent_metrics import AgentMetrics
import json

router = APIRouter()
security = HTTPBearer()
metrics = AgentMetrics()

# Initialize MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.geaux_academy

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                self.disconnect(connection)

manager = ConnectionManager()

@router.get("/metrics")
async def get_metrics(
    time_range: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get agent performance metrics"""
    try:
        # Calculate time range
        end_time = datetime.utcnow()
        if time_range == "1h":
            start_time = end_time - timedelta(hours=1)
        elif time_range == "24h":
            start_time = end_time - timedelta(days=1)
        elif time_range == "7d":
            start_time = end_time - timedelta(days=7)
        else:
            raise HTTPException(status_code=400, detail="Invalid time range")

        # Generate performance report
        report = await metrics.generate_performance_report(start_time, end_time)

        # Format response
        return {
            "response_times": format_response_times(report),
            "quality_scores": format_quality_scores(report),
            "errors": format_error_rates(report),
            "time_range": {
                "start": start_time.isoformat(),
                "end": end_time.isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/metrics")
async def websocket_metrics(websocket: WebSocket):
    """WebSocket endpoint for real-time metrics updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Generate and broadcast metrics every 10 seconds
            report = await metrics.generate_performance_report(
                datetime.utcnow() - timedelta(minutes=5),
                datetime.utcnow()
            )
            
            await websocket.send_json({
                "timestamp": datetime.utcnow().isoformat(),
                "metrics": format_realtime_metrics(report)
            })
            
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        await websocket.close(code=1001, reason=str(e))

@router.get("/alerts")
async def get_alerts(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get active monitoring alerts"""
    try:
        # Query active alerts from MongoDB
        alerts = await db.monitoring_alerts.find({
            "status": "active",
            "created_at": {
                "$gte": datetime.utcnow() - timedelta(days=1)
            }
        }).to_list(None)

        return {"alerts": format_alerts(alerts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Utility functions for formatting metrics
def format_response_times(report: Dict) -> List[Dict]:
    """Format agent response times for visualization"""
    response_times = []
    for metric in report["agent_performance"]:
        if metric["_id"]["task_type"] == "response_time":
            response_times.append({
                "agent_type": metric["_id"]["agent_type"],
                "average_duration": metric["average_duration"],
                "timestamp": metric["_id"].get("timestamp", datetime.utcnow())
            })
    return response_times

def format_quality_scores(report: Dict) -> Dict:
    """Format curriculum quality scores"""
    quality = report.get("curriculum_quality", {})
    return {
        "average": quality.get("average_quality", 0),
        "total_evaluations": quality.get("total_evaluations", 0)
    }

def format_error_rates(report: Dict) -> Dict:
    """Format agent error rates"""
    error_rates = {}
    for metric in report["agent_performance"]:
        agent_type = metric["_id"]["agent_type"]
        error_rates[agent_type] = {
            "error_rate": 1 - metric["success_rate"],
            "total_errors": metric["error_count"],
            "total_tasks": metric["total_tasks"]
        }
    return error_rates

def format_realtime_metrics(report: Dict) -> Dict:
    """Format metrics for real-time updates"""
    return {
        "response_times": format_response_times(report),
        "current_load": {
            "teacher_agent": get_agent_load("teacher"),
            "research_agent": get_agent_load("research"),
            "supervisor_agent": get_agent_load("supervisor")
        },
        "active_tasks": get_active_tasks()
    }

def format_alerts(alerts: List[Dict]) -> List[Dict]:
    """Format monitoring alerts"""
    return [{
        "id": str(alert["_id"]),
        "type": alert["type"],
        "severity": alert["severity"],
        "message": alert["message"],
        "created_at": alert["created_at"].isoformat(),
        "status": alert["status"]
    } for alert in alerts]

async def get_agent_load(agent_type: str) -> float:
    """Get current load for an agent type"""
    active_tasks = await db.agent_tasks.count_documents({
        "agent_type": agent_type,
        "status": "in_progress"
    })
    return min(active_tasks / 10, 1.0)  # Normalize to 0-1 range

async def get_active_tasks() -> List[Dict]:
    """Get currently active tasks"""
    tasks = await db.agent_tasks.find({
        "status": "in_progress"
    }).to_list(None)
    
    return [{
        "id": str(task["_id"]),
        "agent_type": task["agent_type"],
        "task_type": task["task_type"],
        "start_time": task["start_time"].isoformat()
    } for task in tasks]

# File: /backend/monitoring/alerts.py
# Description: Alert generation for monitoring system

from typing import Optional
from datetime import datetime
import asyncio

class AlertGenerator:
    def __init__(self, db):
        self.db = db
        self.thresholds = {
            "response_time": 5.0,  # seconds
            "error_rate": 0.1,     # 10%
            "quality_score": 0.8   # 80%
        }

    async def check_metrics(self):
        """Check metrics against thresholds and generate alerts"""
        while True:
            try:
                await self._check_response_times()
                await self._check_error_rates()
                await self._check_quality_scores()
                await asyncio.sleep(60)  # Check every minute
            except Exception as e:
                print(f"Error in alert generation: {e}")
                await asyncio.sleep(60)

    async def _create_alert(
        self,
        alert_type: str,
        severity: str,
        message: str,
        metadata: Optional[Dict] = None
    ):
        """Create a new alert in the database"""
        alert = {
            "type": alert_type,
            "severity": severity,
            "message": message,
            "metadata": metadata or {},
            "status": "active",
            "created_at": datetime.utcnow()
        }
        
        await self.db.monitoring_alerts.insert_one(alert)
        return alert

    async def _check_response_times(self):
        """Check agent response times"""
        metrics = await self.db.agent_metrics.aggregate([
            {
                "$match": {
                    "timestamp": {
                        "$gte": datetime.utcnow() - timedelta(minutes=5)
                    }
                }
            },
            {
                "$group": {
                    "_id": "$agent_type",
                    "avg_duration": {"$avg": "$duration"}
                }
            }
        ]).to_list(None)

        for metric in metrics:
            if metric["avg_duration"] > self.thresholds["response_time"]:
                await self._create_alert(
                    "high_response_time",
                    "warning",
                    f"High response time for {metric['_id']}: {metric['avg_duration']:.2f}s",
                    {"agent_type": metric["_id"]}
                )

    async def _check_error_rates(self):
        """Check agent error rates"""
        metrics = await self.db.agent_metrics.aggregate([
            {
                "$match": {
                    "timestamp": {
                        "$gte": datetime.utcnow() - timedelta(minutes=5)
                    }
                }
            },
            {
                "$group": {
                    "_id": "$agent_type",
                    "error_rate": {
                        "$avg": {"$cond": ["$success", 0, 1]}
                    }
                }
            }
        ]).to_list(None)

        for metric in metrics:
            if metric["error_rate"] > self.thresholds["error_rate"]:
                await self._create_alert(
                    "high_error_rate",
                    "error",
                    f"High error rate for {metric['_id']}: {metric['error_rate']*100:.1f}%",
                    {"agent_type": metric["_id"]}
                )

    async def _check_quality_scores(self):
        """Check curriculum quality scores"""
        metrics = await self.db.curriculum_evaluations.aggregate([
            {
                "$match": {
                    "timestamp": {
                        "$gte": datetime.utcnow() - timedelta(minutes=5)
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "avg_quality": {"$avg": "$total_score"}
                }
            }
        ]).to_list(None)

        if metrics and metrics[0]["avg_quality"] < self.thresholds["quality_score"]:
            await self._create_alert(
                "low_quality_score",
                "warning",
                f"Low curriculum quality score: {metrics[0]['avg_quality']*100:.1f}%"
            )
