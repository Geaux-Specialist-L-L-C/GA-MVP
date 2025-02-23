from enum import Enum
from typing import Dict, List, Optional, Union
from dataclasses import dataclass
import numpy as np
from datetime import datetime
import json

class ScoreCategory(Enum):
    ACCURACY = "accuracy"
    COMPREHENSION = "comprehension"
    ENGAGEMENT = "engagement"
    SPEED = "speed"
    COMPLEXITY = "complexity"

@dataclass
class ScoringWeights:
    accuracy: float = 0.4
    comprehension: float = 0.3
    engagement: float = 0.2
    speed: float = 0.1

@dataclass
class PerformanceMetrics:
    response_time: float
    accuracy_score: float
    engagement_level: float
    complexity_achieved: int
    retry_attempts: int

class AssessmentScoring:
    def __init__(self, grade_level: str, subject: str):
        self.grade_level = grade_level
        self.subject = subject
        self.weights = self._initialize_weights()
        self.scoring_rubrics = self._initialize_rubrics()
        
    def _initialize_weights(self) -> Dict[str, ScoringWeights]:
        """
        Initialize subject and grade-specific scoring weights
        """
        return {
            "math": {
                "elementary_lower": ScoringWeights(
                    accuracy=0.35,
                    comprehension=0.35,
                    engagement=0.20,
                    speed=0.10
                ),
                "middle_school": ScoringWeights(
                    accuracy=0.40,
                    comprehension=0.30,
                    engagement=0.15,
                    speed=0.15
                ),
                "high_school": ScoringWeights(
                    accuracy=0.45,
                    comprehension=0.30,
                    engagement=0.10,
                    speed=0.15
                )
            },
            "science": {
                "elementary_lower": ScoringWeights(
                    accuracy=0.30,
                    comprehension=0.40,
                    engagement=0.20,
                    speed=0.10
                ),
                "middle_school": ScoringWeights(
                    accuracy=0.35,
                    comprehension=0.35,
                    engagement=0.15,
                    speed=0.15
                )
            }
            # Additional subjects...
        }

    def _initialize_rubrics(self) -> Dict:
        """
        Initialize detailed scoring rubrics for each subject and test type
        """
        return {
            "math": {
                "visual_tests": {
                    "pattern_recognition": {
                        "accuracy": {
                            5: "All patterns correctly identified with proper reasoning",
                            4: "Most patterns identified with minor errors in reasoning",
                            3: "Some patterns identified with partial reasoning",
                            2: "Few patterns identified with limited reasoning",
                            1: "Minimal pattern recognition"
                        },
                        "comprehension": {
                            5: "Deep understanding of pattern principles",
                            4: "Good understanding with minor gaps",
                            3: "Basic understanding of patterns",
                            2: "Limited understanding",
                            1: "Minimal understanding"
                        },
                        "timing_benchmarks": {
                            "elementary_lower": {"fast": 30, "medium": 45, "slow": 60},
                            "middle_school": {"fast": 20, "medium": 35, "slow": 50}
                        }
                    },
                    "geometry_visualization": {
                        "accuracy": {
                            5: "All properties correctly identified and relationships understood",
                            4: "Most properties identified with minor misconceptions",
                            3: "Basic properties identified",
                            2: "Limited property identification",
                            1: "Minimal understanding of properties"
                        }
                    }
                }
            },
            "science": {
                "experimental_design": {
                    "accuracy": {
                        5: "Hypothesis clearly stated, variables properly identified",
                        4: "Clear hypothesis, most variables identified",
                        3: "Basic hypothesis, some variables identified",
                        2: "Unclear hypothesis, few variables identified",
                        1: "Minimal experimental understanding"
                    },
                    "timing_benchmarks": {
                        "middle_school": {"fast": 180, "medium": 240, "slow": 300}
                    }
                }
            }
        }

    async def calculate_score(self, 
                            test_type: str,
                            metrics: PerformanceMetrics,
                            learning_style: str) -> Dict:
        """
        Calculate comprehensive score based on performance metrics
        """
        # Get appropriate weights for grade and subject
        weights = self.weights.get(self.subject, {}).get(self.grade_level)
        
        # Calculate component scores
        accuracy_score = await self._calculate_accuracy_score(
            test_type, 
            metrics.accuracy_score
        )
        
        comprehension_score = await self._calculate_comprehension_score(
            test_type,
            metrics.complexity_achieved,
            metrics.retry_attempts
        )
        
        engagement_score = await self._calculate_engagement_score(
            metrics.engagement_level,
            metrics.retry_attempts
        )
        
        speed_score = await self._calculate_speed_score(
            test_type,
            metrics.response_time
        )
        
        # Calculate weighted final score
        final_score = (
            accuracy_score * weights.accuracy +
            comprehension_score * weights.comprehension +
            engagement_score * weights.engagement +
            speed_score * weights.speed
        )
        
        # Apply learning style adjustments
        final_score = await self._apply_style_adjustments(
            final_score,
            learning_style,
            metrics
        )
        
        return {
            "final_score": final_score,
            "component_scores": {
                "accuracy": accuracy_score,
                "comprehension": comprehension_score,
                "engagement": engagement_score,
                "speed": speed_score
            },
            "learning_style_alignment": await self._calculate_style_alignment(
                learning_style,
                metrics
            ),
            "recommendations": await self._generate_recommendations(
                final_score,
                metrics,
                learning_style
            )
        }

    async def _calculate_accuracy_score(self, 
                                      test_type: str, 
                                      raw_accuracy: float) -> float:
        """
        Calculate accuracy score with grade-appropriate scaling
        """
        # Get rubric for test type
        rubric = self.scoring_rubrics.get(self.subject, {}).get(test_type, {})
        
        # Apply grade-specific scaling
        grade_scaling = {
            "elementary_lower": 0.9,  # More lenient scoring
            "middle_school": 0.95,
            "high_school": 1.0  # Strict scoring
        }
        
        scaled_accuracy = raw_accuracy * grade_scaling.get(self.grade_level, 1.0)
        
        # Apply difficulty adjustment
        if scaled_accuracy >= 0.95:
            return 5.0
        elif scaled_accuracy >= 0.85:
            return 4.0
        elif scaled_accuracy >= 0.75:
            return 3.0
        elif scaled_accuracy >= 0.60:
            return 2.0
        else:
            return 1.0

    async def _calculate_comprehension_score(self,
                                           test_type: str,
                                           complexity_level: int,
                                           retry_attempts: int) -> float:
        """
        Calculate comprehension score based on complexity achieved and retries
        """
        # Base score from complexity level (1-5)
        base_score = complexity_level
        
        # Adjust for retry attempts
        retry_penalty = min(retry_attempts * 0.2, 1.0)
        adjusted_score = base_score - retry_penalty
        
        # Apply grade-specific adjustments
        grade_factors = {
            "elementary_lower": 1.1,  # Bonus for attempting complex problems
            "middle_school": 1.0,
            "high_school": 0.9  # Higher expectations
        }
        
        return max(1.0, adjusted_score * grade_factors.get(self.grade_level, 1.0))

    async def _calculate_engagement_score(self,
                                        engagement_level: float,
                                        retry_attempts: int) -> float:
        """
        Calculate engagement score based on interaction metrics
        """
        # Base score from engagement level (0-1)
        base_score = engagement_level * 5
        
        # Positive adjustment for persistent retries (up to 3)
        retry_bonus = min(retry_attempts, 3) * 0.2
        
        return min(5.0, base_score + retry_bonus)

    async def _calculate_speed_score(self,
                                   test_type: str,
                                   response_time: float) -> float:
        """
        Calculate speed score with grade-appropriate benchmarks
        """
        # Get timing benchmarks for test type and grade
        benchmarks = self.scoring_rubrics.get(self.subject, {}) \
                        .get(test_type, {}) \
                        .get("timing_benchmarks", {}) \
                        .get(self.grade_level, {})
        
        if not benchmarks:
            return 3.0  # Default middle score if no benchmarks
            
        if response_time <= benchmarks["fast"]:
            return 5.0
        elif response_time <= benchmarks["medium"]:
            return 4.0
        elif response_time <= benchmarks["slow"]:
            return 3.0
        else:
            return 2.0

    async def _apply_style_adjustments(self,
                                     score: float,
                                     learning_style: str,
                                     metrics: PerformanceMetrics) -> float:
        """
        Apply learning style-specific adjustments to final score
        """
        style_factors = {
            "visual": {
                "pattern_recognition": 1.1,
                "spatial_reasoning": 1.1
            },
            "auditory": {
                "verbal_comprehension": 1.1,
                "sequential_processing": 1.1
            },
            "kinesthetic": {
                "hands_on_tasks": 1.1,
                "interactive_elements": 1.1
            }
        }
        
        # Get style-specific adjustment factor
        adjustment = style_factors.get(learning_style, {}).get(
            metrics.complexity_achieved,
            1.0
        )
        
        return min(5.0, score * adjustment)

    async def _calculate_style_alignment(self,
                                       learning_style: str,
                                       metrics: PerformanceMetrics) -> Dict:
        """
        Calculate how well the student's performance aligns with the learning style
        """
        # Analysis of performance patterns
        style_indicators = {
            "visual": {
                "pattern_recognition": metrics.accuracy_score,
                "speed": metrics.response_time
            },
            "auditory": {
                "sequential_processing": metrics.accuracy_score,
                "comprehension": metrics.complexity_achieved
            },
            "kinesthetic": {
                "engagement": metrics.engagement_level,
                "interaction": metrics.retry_attempts
            }
        }
        
        # Calculate alignment score
        style_metrics = style_indicators.get(learning_style, {})
        alignment_score = sum(style_metrics.values()) / len(style_metrics) if style_metrics else 0.5
        
        return {
            "alignment_score": alignment_score,
            "confidence": min(1.0, alignment_score + 0.2),
            "supporting_evidence": style_metrics
        }

    async def _generate_recommendations(self,
                                      final_score: float,
                                      metrics: PerformanceMetrics,
                                      learning_style: str) -> List[str]:
        """
        Generate personalized recommendations based on performance
        """
        recommendations = []
        
        # Score-based recommendations
        if final_score < 3.0:
            recommendations.append(
                "Consider additional practice with basic concepts"
            )
        elif final_score > 4.0:
            recommendations.append(
                "Ready for more advanced material"
            )
            
        # Learning style-specific recommendations
        style_recommendations = {
            "visual": [
                "Use diagrams and charts for complex concepts",
                "Create visual summaries",
                "Practice with geometric representations"
            ],
            "auditory": [
                "Utilize verbal explanations",
                "Practice concept articulation",
                "Engage in mathematical discussions"
            ],
            "kinesthetic": [
                "Use manipulatives for problem-solving",
                "Create physical models",
                "Practice with interactive simulations"
            ]
        }
        
        recommendations.extend(style_recommendations.get(learning_style, []))
        
        return recommendations

# Usage example:
async def score_assessment():
    scorer = AssessmentScoring(
        grade_level="middle_school",
        subject="math"
    )
    
    metrics = PerformanceMetrics(
        response_time=45.0,
        accuracy_score=0.85,
        engagement_level=0.9,
        complexity_achieved=4,
        retry_attempts=2
    )
    
    results = await scorer.calculate_score(
        test_type="pattern_recognition",
        metrics=metrics,
        learning_style="visual"
    )
    
    return results
