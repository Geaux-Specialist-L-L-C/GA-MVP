# File: /backend/monitoring/prediction_utils.py (continued)

    def calculate_forecast_accuracy(
        self,
        predictions: np.ndarray,
        actuals: np.ndarray
    ) -> Dict:
        """Calculate various accuracy metrics for forecasts"""
        try:
            # Mean Absolute Error
            mae = np.mean(np.abs(predictions - actuals))
            
            # Mean Squared Error
            mse = np.mean((predictions - actuals) ** 2)
            
            # Root Mean Squared Error
            rmse = np.sqrt(mse)
            
            # Mean Absolute Percentage Error
            mape = np.mean(np.abs((actuals - predictions) / actuals)) * 100
            
            # R-squared
            ss_res = np.sum((actuals - predictions) ** 2)
            ss_tot = np.sum((actuals - np.mean(actuals)) ** 2)
            r2 = 1 - (ss_res / ss_tot)
            
            # Theil's U statistic
            changes_pred = np.diff(predictions)
            changes_actual = np.diff(actuals)
            u_stat = np.sqrt(np.sum(changes_pred ** 2)) / np.sqrt(np.sum(changes_actual ** 2))
            
            return {
                "mae": mae,
                "mse": mse,
                "rmse": rmse,
                "mape": mape,
                "r2": r2,
                "theil_u": u_stat
            }
        except Exception as e:
            self.logger.error(f"Error calculating forecast accuracy: {e}")
            return {}

    def adaptive_prediction_window(
        self,
        data: pd.Series,
        min_window: int = 24,
        max_window: int = 168
    ) -> int:
        """Determine optimal prediction window based on data characteristics"""
        try:
            # Calculate volatility
            volatility = data.std() / data.mean()
            
            # Calculate autocorrelation at different lags
            acf = [stats.pearsonr(data[:-i], data[i:])[0] 
                   for i in range(1, min(len(data)//2, max_window))]
            
            # Find significant autocorrelation cutoff
            significant_lags = np.where(np.array(acf) > 0.3)[0]
            
            if len(significant_lags) > 0:
                optimal_lag = significant_lags[-1]
            else:
                optimal_lag = min_window
            
            # Adjust window based on volatility
            if volatility > 0.2:  # High volatility
                window = max(min_window, optimal_lag // 2)
            else:  # Low volatility
                window = min(max_window, optimal_lag * 2)
            
            return window
        except Exception as e:
            self.logger.error(f"Error determining prediction window: {e}")
            return min_window

    def detect_regime_changes(
        self,
        data: pd.Series,
        window_size: int = 30
    ) -> List[Dict]:
        """Detect changes in the underlying data generation process"""
        try:
            regime_changes = []
            
            # Calculate rolling statistics
            rolling_mean = data.rolling(window=window_size).mean()
            rolling_std = data.rolling(window=window_size).std()
            
            # Calculate rate of change
            rate_of_change = data.pct_change()
            
            # Detect mean shifts
            mean_shifts = self._detect_mean_shifts(
                data,
                rolling_mean,
                rolling_std
            )
            
            # Detect variance changes
            variance_changes = self._detect_variance_changes(
                data,
                rolling_std
            )
            
            # Combine and sort changes
            all_changes = mean_shifts + variance_changes
            all_changes.sort(key=lambda x: x['timestamp'])
            
            return all_changes
        except Exception as e:
            self.logger.error(f"Error detecting regime changes: {e}")
            return []

    def _detect_mean_shifts(
        self,
        data: pd.Series,
        rolling_mean: pd.Series,
        rolling_std: pd.Series
    ) -> List[Dict]:
        """Detect significant shifts in the mean"""
        shifts = []
        z_scores = (rolling_mean - data.mean()) / rolling_std
        
        # Detect significant shifts
        threshold = 2.0
        shift_points = np.where(np.abs(z_scores) > threshold)[0]
        
        for point in shift_points:
            shifts.append({
                "type": "mean_shift",
                "timestamp": data.index[point],
                "value": data.iloc[point],
                "significance": abs(z_scores[point])
            })
        
        return shifts

    def _detect_variance_changes(
        self,
        data: pd.Series,
        rolling_std: pd.Series
    ) -> List[Dict]:
        """Detect significant changes in variance"""
        changes = []
        overall_std = data.std()
        relative_std = rolling_std / overall_std
        
        # Detect significant variance changes
        threshold = 1.5
        change_points = np.where(np.abs(relative_std - 1) > threshold)[0]
        
        for point in change_points:
            changes.append({
                "type": "variance_change",
                "timestamp": data.index[point],
                "value": data.iloc[point],
                "significance": abs(relative_std.iloc[point] - 1)
            })
        
        return changes

    def optimize_prediction_model(
        self,
        model,
        X_train: np.ndarray,
        y_train: np.ndarray,
        param_grid: Dict
    ) -> Tuple[object, Dict]:
        """Optimize model hyperparameters"""
        try:
            from sklearn.model_selection import GridSearchCV
            
            # Perform grid search with cross-validation
            grid_search = GridSearchCV(
                model,
                param_grid,
                cv=5,
                scoring='neg_mean_squared_error',
                n_jobs=-1
            )
            
            grid_search.fit(X_train, y_train)
            
            # Get best model and parameters
            best_model = grid_search.best_estimator_
            best_params = grid_search.best_params_
            
            return best_model, best_params
        except Exception as e:
            self.logger.error(f"Error optimizing prediction model: {e}")
            return model, {}

    def generate_feature_importance(
        self,
        model,
        feature_names: List[str]
    ) -> List[Dict]:
        """Generate feature importance analysis"""
        try:
            importances = model.feature_importances_
            indices = np.argsort(importances)[::-1]
            
            feature_importance = []
            for f in range(len(feature_names)):
                feature_importance.append({
                    "feature": feature_names[indices[f]],
                    "importance": float(importances[indices[f]]),
                    "rank": f + 1
                })
            
            return feature_importance
        except Exception as e:
            self.logger.error(f"Error generating feature importance: {e}")
            return []

    def calculate_prediction_uncertainty(
        self,
        predictions: np.ndarray,
        model_uncertainty: float,
        data_uncertainty: float
    ) -> Dict:
        """Calculate total prediction uncertainty"""
        try:
            # Combined uncertainty using error propagation
            total_uncertainty = np.sqrt(model_uncertainty**2 + data_uncertainty**2)
            
            # Calculate uncertainty bounds
            lower_bound = predictions - 2 * total_uncertainty
            upper_bound = predictions + 2 * total_uncertainty
            
            return {
                "predictions": predictions.tolist(),
                "lower_bound": lower_bound.tolist(),
                "upper_bound": upper_bound.tolist(),
                "uncertainty": total_uncertainty
            }
        except Exception as e:
            self.logger.error(f"Error calculating prediction uncertainty: {e}")
            return {
                "predictions": predictions.tolist(),
                "lower_bound": predictions.tolist(),
                "upper_bound": predictions.tolist(),
                "uncertainty": 0.0
            }

class PredictionOptimizer:
    """Optimize prediction performance and resource usage"""
    
    def __init__(self, cache_client):
        self.cache = cache_client
        self.logger = logging.getLogger(__name__)

    async def optimize_prediction_pipeline(
        self,
        data: pd.DataFrame,
        prediction_config: Dict
    ) -> Dict:
        """Optimize the prediction pipeline for performance"""
        try:
            # Feature selection optimization
            selected_features = await self._optimize_feature_selection(
                data,
                prediction_config
            )
            
            # Batch size optimization
            optimal_batch_size = self._optimize_batch_size(data)
            
            # Cache strategy optimization
            cache_strategy = self._optimize_cache_strategy(
                data,
                prediction_config
            )
            
            return {
                "selected_features": selected_features,
                "optimal_batch_size": optimal_batch_size,
                "cache_strategy": cache_strategy
            }
        except Exception as e:
            self.logger.error(f"Error optimizing prediction pipeline: {e}")
            return {}

    async def _optimize_feature_selection(
        self,
        data: pd.DataFrame,
        config: Dict
    ) -> List[str]:
        """Optimize feature selection for predictions"""
        try:
            from sklearn.feature_selection import SelectKBest, f_regression
            
            # Separate features and target
            X = data[config['feature_columns']]
            y = data[config['target_column']]
            
            # Select top k features
            k = min(len(config['feature_columns']), 10)
            selector = SelectKBest(score_func=f_regression, k=k)
            selector.fit(X, y)
            
            # Get selected feature names
            selected_features = [
                config['feature_columns'][i]
                for i in range(len(config['feature_columns']))
                if selector.get_support()[i]
            ]
            
            return selected_features
        except Exception as e:
            self.logger.error(f"Error optimizing feature selection: {e}")
            return config['feature_columns']

    def _optimize_batch_size(self, data: pd.DataFrame) -> int:
        """Determine optimal batch size for predictions"""
        try:
            # Calculate based on data size and memory constraints
            total_size = data.memory_usage(deep=True).sum()
            available_memory = psutil.virtual_memory().available
            
            # Target using 10% of available memory
            target_memory = available_memory * 0.1
            
            # Calculate optimal batch size
            row_size = total_size / len(data)
            optimal_batch_size = int(target_memory / row_size)
            
            # Ensure batch size is within reasonable bounds
            return max(min(optimal_batch_size, 10000), 100)
        except Exception as e:
            self.logger.error(f"Error optimizing batch size: {e}")
            return 1000

    def _optimize_cache_strategy(
        self,
        data: pd.DataFrame,
        config: Dict
    ) -> Dict:
        """Optimize caching strategy for predictions"""
        try:
            # Determine cache TTL based on data update frequency
            update_frequency = config.get('update_frequency', 300)  # Default 5 minutes
            cache_ttl = max(update_frequency * 2, 60)  # At least 1 minute
            
            return {
                "enabled": True,
                "ttl": cache_ttl,
                "max_size": len(data) * 100,  # Cache up to 100 versions
                "strategy": "lru"  # Least Recently Used eviction
            }
        except Exception as e:
            self.logger.error(f"Error optimizing cache strategy: {e}")
            return {
                "enabled": False
            }