# File: /backend/db/indexes.py
# Description: MongoDB index creation and optimization

from pymongo import MongoClient, ASCENDING, DESCENDING, TEXT
from typing import List, Dict

class DatabaseOptimizer:
    def __init__(self, connection_string: str):
        self.client = MongoClient(connection_string)
        self.db = self.client.geaux_academy

    def create_indexes(self):
        """Create all required indexes for optimal performance"""
        
        # User collection indexes
        self.db.users.create_indexes([
            # Compound index for user lookup by email and status
            [("email", ASCENDING), ("status", ASCENDING)],
            # Text index for user search
            [("name", TEXT), ("email", TEXT)],
            # Index for quick access by creation date
            [("created_at", DESCENDING)]
        ])

        # Learning styles collection indexes
        self.db.learning_styles.create_indexes([
            # Compound index for user learning styles
            [("user_id", ASCENDING), ("updated_at", DESCENDING)],
            # Index for analysis queries
            [("style_type", ASCENDING), ("score", DESCENDING)]
        ])

        # Curriculum collection indexes
        self.db.curricula.create_indexes([
            # Compound index for curriculum lookup
            [("subject", ASCENDING), ("grade_level", ASCENDING)],
            # Index for quick access by creation date
            [("created_at", DESCENDING)],
            # Text index for curriculum search
            [("content", TEXT)]
        ])

        # Performance metrics collection indexes
        self.db.performance_metrics.create_indexes([
            # Compound index for user performance metrics
            [("user_id", ASCENDING), ("timestamp", DESCENDING)],
            # Index for aggregation queries
            [("metric_type", ASCENDING), ("value", DESCENDING)]
        ])

    def optimize_collections(self):
        """Optimize collection settings for better performance"""
        
        # Configure collection settings
        self.db.command({
            "collMod": "users",
            "validator": {
                "$jsonSchema": {
                    "bsonType": "object",
                    "required": ["email", "status", "created_at"],
                    "properties": {
                        "email": {"bsonType": "string"},
                        "status": {"enum": ["active", "inactive", "suspended"]},
                        "created_at": {"bsonType": "date"}
                    }
                }
            }
        })

        # Set up capped collection for audit logs
        if "audit_logs" not in self.db.list_collection_names():
            self.db.create_collection(
                "audit_logs",
                capped=True,
                size=500000000,  # 500MB size limit
                max=1000000  # Maximum 1 million documents
            )

    async def create_aggregation_views(self):
        """Create materialized views for common aggregation queries"""
        
        # Create view for user learning progress
        self.db.command({
            "create": "user_progress_view",
            "viewOn": "performance_metrics",
            "pipeline": [
                {
                    "$group": {
                        "_id": "$user_id",
                        "average_score": {"$avg": "$value"},
                        "total_activities": {"$sum": 1},
                        "last_activity": {"$max": "$timestamp"}
                    }
                }
            ]
        })

        # Create view for curriculum effectiveness
        self.db.command({
            "create": "curriculum_effectiveness_view",
            "viewOn": "performance_metrics",
            "pipeline": [
                {
                    "$lookup": {
                        "from": "curricula",
                        "localField": "curriculum_id",
                        "foreignField": "_id",
                        "as": "curriculum"
                    }
                },
                {
                    "$group": {
                        "_id": "$curriculum_id",
                        "average_performance": {"$avg": "$value"},
                        "total_students": {"$sum": 1},
                        "learning_styles": {
                            "$addToSet": "$learning_style"
                        }
                    }
                }
            ]
        })

# File: /backend/db/cache.py
# Description: Caching layer for database queries

from functools import wraps
from typing import Any, Callable
import redis
import json
from datetime import timedelta

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(expire_time: int = 300):
    """Cache decorator for database query results"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            # Generate cache key from function name and arguments
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Try to get cached result
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            redis_client.setex(
                cache_key,
                timedelta(seconds=expire_time),
                json.dumps(result)
            )
            
            return result
        return wrapper
    return decorator
