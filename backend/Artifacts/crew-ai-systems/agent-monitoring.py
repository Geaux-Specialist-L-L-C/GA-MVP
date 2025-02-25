# File: /backend/monitoring/agent_metrics.py
# Description: Performance monitoring for the multi-agent system

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import asyncio
from prometheus_client import Counter, Histogram, Gauge
import logging
from pymongo import MongoClient
import json

# Initialize MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.geaux_academy

# Prometheus metrics
AGENT_LATENCY = Histogram(
    'agent_response_time_seconds',
    'Time spent processing agent tasks',
    ['agent_type', 'task_type']
)

AGENT_ERRORS = Counter(
    'agent_errors_total',
    'Total number of agent errors',
    ['agent_type', 'error_type']
)

CURRICULUM_QUALITY = Gauge(
    'curriculum_quality_score',
    'Quality score of generated curriculum',
    ['grade_level', 'subject']
)

class AgentMetrics:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)

    async def track_agent_performance(
        self,
        agent_type: str,
        task_type: str,
        start_time: datetime,
        end_time: datetime,
        success: bool,
        error: Optional[str] = None,
        metadata: Optional[Dict] = None
    ):
        """Track individual agent performance metrics"""
        duration = (end_time - start_time).total_seconds()
        
        # Record metrics
        AGENT_LATENCY.labels(agent_type=agent_type, task_type=task_type).observe(duration)
        
        if not success:
            AGENT_ERRORS.labels(agent_type=agent_type, error_type=error or 'unknown').inc()

        # Store in MongoDB for analysis
        await db.agent_metrics.insert_one({
            "agent_type": agent_type,
            "task_type": task_type,
            "duration": duration,
            "success": success,
            "error": error,
            "timestamp": datetime.utcnow(),
            "metadata": metadata or {}
        })

    async def evaluate_curriculum_quality(
        self,
        curriculum_id: str,
        grade_level: int,
        subject: str
    ) -> float:
        """Evaluate the quality of generated curriculum"""
        criteria = {
            "content_accuracy": 0.3,
            "grade_level_appropriateness": 0.3,
            "engagement_potential": 0.2,
            "learning_style_alignment": 0.2
        }
        
        scores = {}
        total_score = 0.0
        
        # Get curriculum content
        curriculum = await db.curricula.find_one({"_id": curriculum_id})
        if not curriculum:
            raise ValueError(f"Curriculum {curriculum_id} not found")
            
        # Evaluate each criterion
        for criterion, weight in criteria.items():
            score = await self._evaluate_criterion(
                curriculum,
                criterion,
                grade_level
            )
            scores[criterion] = score
            total_score += score * weight
            
        # Record quality score
        CURRICULUM_QUALITY.labels(
            grade_level=str(grade_level),
            subject=subject
        ).set(total_score)
        
        # Store detailed evaluation
        await db.curriculum_evaluations.insert_one({
            "curriculum_id": curriculum_id,
            "grade_level": grade_level,
            "subject": subject,
            "total_score": total_score,
            "criteria_scores": scores,
            "timestamp": datetime.utcnow()
        })
        
        return total_score

    async def _evaluate_criterion(
        self,
        curriculum: Dict,
        criterion: str,
        grade_level: int
    ) -> float:
        """Evaluate a specific quality criterion"""
        if criterion == "content_accuracy":
            # Check against educational standards
            return await self._check_content_accuracy(curriculum)
        elif criterion == "grade_level_appropriateness":
            # Verify grade level appropriateness
            return await self._check_grade_level(curriculum, grade_level)
        elif criterion == "engagement_potential":
            # Assess engagement features
            return await self._assess_engagement(curriculum)
        elif criterion == "learning_style_alignment":
            # Verify learning style adaptation
            return await self._check_learning_style_alignment(curriculum)
        return 0.0

    async def generate_performance_report(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        """Generate comprehensive performance report"""
        pipeline = [
            {
                "$match": {
                    "timestamp": {
                        "$gte": start_date,
                        "$lte": end_date
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "agent_type": "$agent_type",
                        "task_type": "$task_type"
                    },
                    "average_duration": {"$avg": "$duration"},
                    "success_rate": {
                        "$avg": {"$cond": ["$success", 1, 0]}
                    },
                    "total_tasks": {"$sum": 1},
                    "error_count": {
                        "$sum": {"$cond": ["$success", 0, 1]}
                    }
                }
            }
        ]
        
        results = await db.agent_metrics.aggregate(pipeline).to_list(None)
        
        # Calculate system-wide metrics
        curriculum_quality = await db.curriculum_evaluations.aggregate([
            {
                "$match": {
                    "timestamp": {
                        "$gte": start_date,
                        "$lte": end_date
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "average_quality": {"$avg": "$total_score"},
                    "total_evaluations": {"$sum": 1}
                }
            }
        ]).to_list(None)
        
        return {
            "agent_performance": results,
            "curriculum_quality": curriculum_quality[0] if curriculum_quality else None,
            "report_period": {
                "start": start_date,
                "end": end_date
            }
        }

# File: /backend/tests/integration/test_agent_orchestration.py (continued)

    # Test agent response times
    start_time = datetime.utcnow()
    response_times = []
    
    for task in result["tasks"]:
        task_duration = task["completion_time"] - task["start_time"]
        response_times.append(task_duration.total_seconds())
    
    # Verify response times are within acceptable range
    assert max(response_times) < 10.0  # Maximum 10 seconds per task
    
    # Test collaboration patterns
    agent_interactions = result["agent_interactions"]
    assert len(agent_interactions) > 0
    
    # Verify supervisor oversight
    supervisor_checks = [
        interaction for interaction in agent_interactions
        if interaction["agent_type"] == "supervisor"
    ]
    assert len(supervisor_checks) >= 2  # At least two supervisor checks
    
    # Verify content validation
    validation_results = [
        interaction for interaction in agent_interactions
        if interaction["task_type"] == "content_validation"
    ]
    assert len(validation_results) > 0
    assert all(result["success"] for result in validation_results)

@pytest.mark.asyncio
async def test_agent_error_handling():
    orchestrator = AgentOrchestrator()
    
    # Test invalid grade level
    with pytest.raises(ValueError):
        await orchestrator.create_curriculum(
            subject="Math",
            grade_level=13,  # Invalid grade level
            learning_style="visual"
        )
    
    # Test invalid subject
    with pytest.raises(ValueError):
        await orchestrator.create_curriculum(
            subject="",  # Empty subject
            grade_level=5,
            learning_style="visual"
        )
    
    # Test agent failure recovery
    # Simulate teacher agent failure
    orchestrator.teacher_agent.available = False
    result = await orchestrator.create_curriculum(
        subject="Science",
        grade_level=6,
        learning_style="visual"
    )
    
    # Verify backup agent took over
    assert result["agent_assignments"]["teacher"] != "primary_teacher"
    assert result["success"] == True
