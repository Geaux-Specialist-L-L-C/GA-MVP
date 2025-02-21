# File: /backend/monitoring/optimizations.py (continued)

    async def cache_recent_metrics(self, time_window: int = 300):
        """Cache recent metrics in Redis for fast access"""
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(seconds=time_window)
        
        # Fetch recent metrics
        metrics = await self.db.metrics.find({
            "timestamp": {"$gte": start_time}
        }).to_list(None)
        
        # Group metrics by agent and type
        grouped_metrics = {}
        for metric in metrics:
            key = f"{metric['agent_type']}:{metric['metric_type']}"
            if key not in grouped_metrics:
                grouped_metrics[key] = []
            grouped_metrics[key].append(metric)
        
        # Cache each group with expiration
        for key, group in grouped_metrics.items():
            cache_key = f"metrics:{key}"
            await self.redis.setex(
                cache_key,
                time_window,
                pickle.dumps(group)
            )
        
        return len(metrics)

    async def get_cached_metrics(
        self,
        agent_type: str,
        metric_type: str
    ) -> Optional[List[Dict]]:
        """Retrieve metrics from cache"""
        cache_key = f"metrics:{agent_type}:{metric_type}"
        cached_data = await self.redis.get(cache_key)
        
        if cached_data:
            return pickle.loads(cached_data)
        return None

    async def optimize_storage(self):
        """Optimize metric storage by aggregating old data"""
        now = datetime.utcnow()
        
        # Define time windows for different aggregation levels
        windows = [
            {
                "age": timedelta(days=7),
                "interval": timedelta(minutes=5),
                "collection": "metrics_5min"
            },
            {
                "age": timedelta(days=30),
                "interval": timedelta(hours=1),
                "collection": "metrics_1hour"
            },
            {
                "age": timedelta(days=90),
                "interval": timedelta(days=1),
                "collection": "metrics_1day"
            }
        ]
        
        for window in windows:
            cutoff_time = now - window["age"]
            
            # Aggregate metrics
            pipeline = [
                {
                    "$match": {
                        "timestamp": {
                            "$lt": cutoff_time,
                            "$gt": cutoff_time - window["age"]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "agent_type": "$agent_type",
                            "metric_type": "$metric_type",
                            "interval": {
                                "$dateTrunc": {
                                    "date": "$timestamp",
                                    "unit": "minute",
                                    "binSize": window["interval"].total_seconds() / 60
                                }
                            }
                        },
                        "avg_value": {"$avg": "$value"},
                        "max_value": {"$max": "$value"},
                        "min_value": {"$min": "$value"},
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            aggregated = await self.db.metrics.aggregate(pipeline).to_list(None)
            
            if aggregated:
                # Store aggregated data
                await self.db[window["collection"]].insert_many(aggregated)
                
                # Remove original metrics
                await self.db.metrics.delete_many({
                    "timestamp": {
                        "$lt": cutoff_time,
                        "$gt": cutoff_time - window["age"]
                    }
                })

    async def get_optimized_metrics(
        self,
        start_time: datetime,
        end_time: datetime,
        agent_type: Optional[str] = None,
        metric_type: Optional[str] = None
    ) -> List[Dict]:
        """Get metrics with optimal time resolution"""
        time_span = end_time - start_time
        
        # Determine appropriate collection based on time span
        if time_span <= timedelta(days=7):
            collection = "metrics"  # Raw metrics
        elif time_span <= timedelta(days=30):
            collection = "metrics_5min"
        elif time_span <= timedelta(days=90):
            collection = "metrics_1hour"
        else:
            collection = "metrics_1day"
        
        # Build query
        query = {
            "timestamp": {
                "$gte": start_time,
                "$lte": end_time
            }
        }
        
        if agent_type:
            query["agent_type"] = agent_type
        if metric_type:
            query["metric_type"] = metric_type
        
        # Fetch metrics
        metrics = await self.db[collection].find(query).to_list(None)
        return metrics

# File: /backend/monitoring/resource_monitor.py
# Description: System resource monitoring

import psutil
import platform
from typing import Dict
import asyncio

class ResourceMonitor:
    def __init__(self):
        self.system_info = {
            "platform": platform.system(),
            "platform_release": platform.release(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "processor": platform.processor()
        }

    async def get_system_metrics(self) -> Dict:
        """Get current system resource metrics"""
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "cpu": {
                "percent": cpu_percent,
                "count": psutil.cpu_count(),
                "frequency": psutil.cpu_freq().current if psutil.cpu_freq() else None
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent
            },
            "network": self._get_network_stats()
        }

    def _get_network_stats(self) -> Dict:
        """Get network statistics"""
        network = psutil.net_io_counters()
        return {
            "bytes_sent": network.bytes_sent,
            "bytes_recv": network.bytes_recv,
            "packets_sent": network.packets_sent,
            "packets_recv": network.packets_recv,
            "error_in": network.errin,
            "error_out": network.errout,
            "drop_in": network.dropin,
            "drop_out": network.dropout
        }

    async def monitor_resources(self, interval: int = 60):
        """Continuously monitor system resources"""
        while True:
            metrics = await self.get_system_metrics()
            
            # Store metrics in database
            await self.db.system_metrics.insert_one({
                "timestamp": datetime.utcnow(),
                "metrics": metrics
            })
            
            # Check resource thresholds
            await self._check_resource_thresholds(metrics)
            
            await asyncio.sleep(interval)

    async def _check_resource_thresholds(self, metrics: Dict):
        """Check if resource usage exceeds thresholds"""
        thresholds = {
            "cpu_percent": 80,
            "memory_percent": 85,
            "disk_percent": 90
        }
        
        alerts = []
        
        if metrics["cpu"]["percent"] > thresholds["cpu_percent"]:
            alerts.append({
                "type": "high_cpu_usage",
                "severity": "warning",
                "message": f"CPU usage at {metrics['cpu']['percent']}%"
            })
        
        if metrics["memory"]["percent"] > thresholds["memory_percent"]:
            alerts.append({
                "type": "high_memory_usage",
                "severity": "warning",
                "message": f"Memory usage at {metrics['memory']['percent']}%"
            })
        
        if metrics["disk"]["percent"] > thresholds["disk_percent"]:
            alerts.append({
                "type": "high_disk_usage",
                "severity": "warning",
                "message": f"Disk usage at {metrics['disk']['percent']}%"
            })
        
        # Store alerts if any
        if alerts:
            await self.db.monitoring_alerts.insert_many([
                {**alert, "timestamp": datetime.utcnow()}
                for alert in alerts
            ])
