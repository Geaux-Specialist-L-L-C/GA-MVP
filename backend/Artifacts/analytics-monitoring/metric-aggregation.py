# File: /backend/monitoring/aggregator.py
# Description: Metric aggregation and processing system

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pymongo import MongoClient, UpdateOne
import asyncio
from collections import defaultdict
import numpy as np
from fastapi import BackgroundTasks
import json

class MetricAggregator:
    def __init__(self, connection_string: str):
        self.client = MongoClient(connection_string)
        self.db = self.client.geaux_academy
        
        # Initialize metric thresholds
        self.thresholds = {
            "response_time": {
                "warning": 3.0,  # seconds
                "critical": 5.0
            },
            "error_rate": {
                "warning": 0.05,  # 5%
                "critical": 0.10
            },
            "memory_usage": {
                "warning": 0.80,  # 80%
                "critical": 0.90
            }
        }

    async def aggregate_metrics(self, time_window: int = 300) -> Dict:
        """Aggregate metrics for the specified time window (in seconds)"""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(seconds=time_window)
        
        pipeline = [
            {
                "$match": {
                    "timestamp": {
                        "$gte": start_time,
                        "$lte": end_time
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "agent_type": "$agent_type",
                        "metric_type": "$metric_type",
                        "minute": {
                            "$dateToString": {
                                "format": "%Y-%m-%d-%H-%M",
                                "date": "$timestamp"
                            }
                        }
                    },
                    "avg_value": {"$avg": "$value"},
                    "max_value": {"$max": "$value"},
                    "min_value": {"$min": "$value"},
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {
                    "_id.minute": 1
                }
            }
        ]
        
        results = await self.db.metrics.aggregate(pipeline).to_list(None)
        return self._format_aggregated_metrics(results)

    async def calculate_agent_health(self) -> Dict:
        """Calculate health scores for each agent"""
        pipeline = [
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
                    },
                    "avg_response_time": {"$avg": "$duration"},
                    "success_rate": {
                        "$avg": {"$cond": ["$success", 1, 0]}
                    }
                }
            }
        ]
        
        results = await self.db.agent_metrics.aggregate(pipeline).to_list(None)
        return self._calculate_health_scores(results)

    async def store_aggregated_metrics(self, metrics: Dict):
        """Store aggregated metrics for historical analysis"""
        operations = []
        timestamp = datetime.utcnow()
        
        for agent_type, agent_metrics in metrics.items():
            for metric_type, values in agent_metrics.items():
                operations.append(
                    UpdateOne(
                        {
                            "agent_type": agent_type,
                            "metric_type": metric_type,
                            "timestamp": timestamp
                        },
                        {
                            "$set": {
                                "values": values,
                                "aggregated_at": timestamp
                            }
                        },
                        upsert=True
                    )
                )
        
        if operations:
            await self.db.aggregated_metrics.bulk_write(operations)

    def _format_aggregated_metrics(self, results: List[Dict]) -> Dict:
        """Format aggregated metrics for the dashboard"""
        formatted_metrics = defaultdict(lambda: defaultdict(list))
        
        for result in results:
            agent_type = result["_id"]["agent_type"]
            metric_type = result["_id"]["metric_type"]
            minute = result["_id"]["minute"]
            
            formatted_metrics[agent_type][metric_type].append({
                "timestamp": minute,
                "average": result["avg_value"],
                "maximum": result["max_value"],
                "minimum": result["min_value"],
                "count": result["count"]
            })
        
        return dict(formatted_metrics)

    def _calculate_health_scores(self, results: List[Dict]) -> Dict:
        """Calculate health scores based on multiple metrics"""
        health_scores = {}
        
        for result in results:
            agent_type = result["_id"]
            
            # Calculate composite health score
            error_score = 1 - min(result["error_rate"] / self.thresholds["error_rate"]["critical"], 1)
            response_score = 1 - min(result["avg_response_time"] / self.thresholds["response_time"]["critical"], 1)
            success_score = result["success_rate"]
            
            # Weighted average of scores
            health_score = (error_score * 0.4 + response_score * 0.3 + success_score * 0.3)
            
            health_scores[agent_type] = {
                "health_score": health_score,
                "status": self._get_health_status(health_score),
                "metrics": {
                    "error_rate": result["error_rate"],
                    "response_time": result["avg_response_time"],
                    "success_rate": result["success_rate"]
                }
            }
        
        return health_scores

    def _get_health_status(self, health_score: float) -> str:
        """Determine health status based on score"""
        if health_score >= 0.9:
            return "healthy"
        elif health_score >= 0.7:
            return "warning"
        else:
            return "critical"

# File: /backend/monitoring/collector.py
# Description: Metric collection and processing system

class MetricCollector:
    def __init__(self, connection_string: str):
        self.client = MongoClient(connection_string)
        self.db = self.client.geaux_academy
        self.metric_buffer = []
        self.buffer_size = 100
        self.buffer_lock = asyncio.Lock()

    async def collect_metric(self, metric: Dict):
        """Collect a single metric with buffering"""
        async with self.buffer_lock:
            self.metric_buffer.append({
                **metric,
                "timestamp": datetime.utcnow()
            })
            
            if len(self.metric_buffer) >= self.buffer_size:
                await self._flush_buffer()

    async def _flush_buffer(self):
        """Flush metrics buffer to database"""
        if not self.metric_buffer:
            return
            
        try:
            await self.db.metrics.insert_many(self.metric_buffer)
            self.metric_buffer = []
        except Exception as e:
            print(f"Error flushing metrics buffer: {e}")

    async def collect_agent_metrics(self, agent_type: str, metrics: Dict):
        """Collect comprehensive agent metrics"""
        formatted_metrics = []
        timestamp = datetime.utcnow()
        
        for metric_type, value in metrics.items():
            formatted_metrics.append({
                "agent_type": agent_type,
                "metric_type": metric_type,
                "value": value,
                "timestamp": timestamp
            })
        
        await self.collect_metric(formatted_metrics)

    async def cleanup_old_metrics(self, days: int = 30):
        """Clean up metrics older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        await self.db.metrics.delete_many({
            "timestamp": {"$lt": cutoff_date}
        })
        
        await self.db.aggregated_metrics.delete_many({
            "timestamp": {"$lt": cutoff_date}
        })

# File: /backend/api/metrics.py
# Description: Metric collection API endpoints

from fastapi import APIRouter, BackgroundTasks, HTTPException
from typing import List

router = APIRouter()
collector = MetricCollector("mongodb://localhost:27017")
aggregator = MetricAggregator("mongodb://localhost:27017")

@router.post("/metrics/collect")
async def collect_metrics(
    metrics: List[Dict],
    background_tasks: BackgroundTasks
):
    """Collect metrics from agents"""
    try:
        for metric in metrics:
            await collector.collect_metric(metric)
        
        # Schedule aggregation in background
        background_tasks.add_task(
            aggregator.aggregate_metrics,
            time_window=300
        )
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/health")
async def get_agent_health():
    """Get agent health status"""
    try:
        health_scores = await aggregator.calculate_agent_health()
        return health_scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/aggregated")
async def get_aggregated_metrics(time_window: int = 300):
    """Get aggregated metrics for specified time window"""
    try:
        metrics = await aggregator.aggregate_metrics(time_window)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
