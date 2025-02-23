# File: /backend/monitoring/predictive.py
# Description: Predictive analytics for performance monitoring

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pandas as pd
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import joblib
import asyncio
from dataclasses import dataclass

@dataclass
class PredictionResult:
    metric: str
    predicted_value: float
    confidence: float
    trend: str
    warning_threshold: float
    critical_threshold: float
    time_to_threshold: Optional[int] = None

class PerformancePredictor:
    def __init__(self, db):
        self.db = db
        self.scaler = StandardScaler()
        self.models = {}
        self.metrics = [
            "cpu_usage",
            "memory_usage",
            "disk_usage",
            "network_latency",
            "response_time"
        ]
        
        # Initialize models for each metric
        for metric in self.metrics:
            self._init_model(metric)

    def _init_model(self, metric: str):
        """Initialize or load pre-trained model for a metric"""
        try:
            # Try to load existing model
            self.models[metric] = joblib.load(f"models/{metric}_predictor.joblib")
        except:
            # Create new model if none exists
            self.models[metric] = RandomForestRegressor(
                n_estimators=100,
                random_state=42
            )

    async def train_models(self):
        """Train prediction models using historical data"""
        for metric in self.metrics:
            # Fetch historical data
            data = await self._get_historical_data(metric)
            
            if len(data) < 100:  # Require minimum amount of data
                continue
                
            # Prepare features and target
            X, y = self._prepare_training_data(data)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train model
            self.models[metric].fit(X_scaled, y)
            
            # Save model
            joblib.dump(self.models[metric], f"models/{metric}_predictor.joblib")

    async def predict_performance(
        self,
        horizon: int = 24  # hours
    ) -> List[PredictionResult]:
        """Predict future performance metrics"""
        predictions = []
        
        for metric in self.metrics:
            # Get recent data
            recent_data = await self._get_recent_data(metric)
            
            if not recent_data:
                continue
                
            # Prepare features
            X = self._prepare_prediction_features(recent_data)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            predicted_values = self.models[metric].predict(X_scaled)
            
            # Calculate confidence
            confidence = self._calculate_prediction_confidence(
                metric,
                predicted_values
            )
            
            # Analyze trend
            trend = self._analyze_trend(predicted_values)
            
            # Get thresholds
            warning_threshold, critical_threshold = await self._get_thresholds(metric)
            
            # Calculate time to threshold
            time_to_threshold = self._calculate_time_to_threshold(
                predicted_values,
                critical_threshold
            )
            
            predictions.append(PredictionResult(
                metric=metric,
                predicted_value=predicted_values[-1],
                confidence=confidence,
                trend=trend,
                warning_threshold=warning_threshold,
                critical_threshold=critical_threshold,
                time_to_threshold=time_to_threshold
            ))
        
        return predictions

    async def _get_historical_data(self, metric: str) -> List[Dict]:
        """Fetch historical data for training"""
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        
        data = await self.db.performance_metrics.find({
            "metric": metric,
            "timestamp": {"$gte": cutoff_date}
        }).sort("timestamp", 1).to_list(None)
        
        return data

    async def _get_recent_data(self, metric: str) -> List[Dict]:
        """Fetch recent data for prediction"""
        cutoff_date = datetime.utcnow() - timedelta(hours=24)
        
        data = await self.db.performance_metrics.find({
            "metric": metric,
            "timestamp": {"$gte": cutoff_date}
        }).sort("timestamp", 1).to_list(None)
        
        return data

    def _prepare_training_data(
        self,
        data: List[Dict]
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare data for model training"""
        df = pd.DataFrame(data)
        
        # Create time-based features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Create lag features
        for lag in [1, 3, 6, 12, 24]:
            df[f'lag_{lag}'] = df['value'].shift(lag)
        
        # Create rolling statistics
        for window in [6, 12, 24]:
            df[f'rolling_mean_{window}'] = df['value'].rolling(window).mean()
            df[f'rolling_std_{window}'] = df['value'].rolling(window).std()
        
        # Drop rows with NaN values
        df = df.dropna()
        
        # Prepare features and target
        feature_columns = [col for col in df.columns if col not in ['timestamp', 'value']]
        X = df[feature_columns].values
        y = df['value'].values
        
        return X, y

    def _prepare_prediction_features(self, data: List[Dict]) -> np.ndarray:
        """Prepare features for prediction"""
        df = pd.DataFrame(data)
        
        # Create same features as in training
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        for lag in [1, 3, 6, 12, 24]:
            df[f'lag_{lag}'] = df['value'].shift(lag)
        
        for window in [6, 12, 24]:
            df[f'rolling_mean_{window}'] = df['value'].rolling(window).mean()
            df[f'rolling_std_{window}'] = df['value'].rolling(window).std()
        
        # Drop rows with NaN values
        df = df.dropna()
        
        feature_columns = [col for col in df.columns if col not in ['timestamp', 'value']]
        return df[feature_columns].values

    def _calculate_prediction_confidence(
        self,
        metric: str,
        predictions: np.ndarray
    ) -> float:
        """Calculate confidence score for predictions"""
        # Get feature importances
        importances = self.models[metric].feature_importances_
        
        # Calculate weighted variance of predictions
        weighted_variance = np.average(
            np.var(predictions),
            weights=importances
        )
        
        # Convert to confidence score (0-1)
        confidence = 1 / (1 + weighted_variance)
        
        return confidence

    def _analyze_trend(self, predictions: np.ndarray) -> str:
        """Analyze trend in predictions"""
        if len(predictions) < 2:
            return "stable"
            
        slope = (predictions[-1] - predictions[0]) / len(predictions)
        
        if slope > 0.05:
            return "increasing"
        elif slope < -0.05:
            return "decreasing"
        else:
            return "stable"

    async def _get_thresholds(self, metric: str) -> Tuple[float, float]:
        """Get warning and critical thresholds for metric"""
        config = await self.db.monitoring_config.find_one({"metric": metric})
        
        if not config:
            # Default thresholds
            return 0.7, 0.9
            
        return config["warning_threshold"], config["critical_threshold"]

    def _calculate_time_to_threshold(
        self,
        predictions: np.ndarray,
        threshold: float
    ) -> Optional[int]:
        """Calculate estimated time until threshold is reached"""
        if predictions[-1] >= threshold:
            return 0
            
        # Find first prediction that crosses threshold
        for i, pred in enumerate(predictions):
            if pred >= threshold:
                return i
        
        return None

    async def analyze_seasonality(self, metric: str) -> Dict:
        """Analyze seasonal patterns in metric"""
        data = await self._get_historical_data(metric)
        df = pd.DataFrame(data)
        
        # Daily seasonality
        daily_pattern = df.groupby(df['timestamp'].dt.hour)['value'].mean()
        
        # Weekly seasonality
        weekly_pattern = df.groupby(df['timestamp'].dt.dayofweek)['value'].mean()
        
        return {
            "daily_pattern": daily_pattern.to_dict(),
            "weekly_pattern": weekly_pattern.to_dict(),
            "peak_hour": daily_pattern.idxmax(),
            "peak_day": weekly_pattern.idxmax()
        }

    async def detect_anomalies(self, metric: str) -> List[Dict]:
        """Detect anomalies in recent data"""
        data = await self._get_recent_data(metric)
        df = pd.DataFrame(data)
        
        # Calculate rolling statistics
        rolling_mean = df['value'].rolling(window=12).mean()
        rolling_std = df['value'].rolling(window=12).std()
        
        # Define anomaly thresholds
        upper_bound = rolling_mean + 2 * rolling_std
        lower_bound = rolling_mean - 2 * rolling_std
        
        # Detect anomalies
        anomalies = df[
            (df['value'] > upper_bound) | 
            (df['value'] < lower_bound)
        ]
        
        return anomalies.to_dict('records')
