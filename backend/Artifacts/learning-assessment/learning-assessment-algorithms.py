from typing import Dict, List, Tuple, Optional
import numpy as np
from datetime import datetime
from textblob import TextBlob
import json

class AdaptiveDifficultyEngine:
    def __init__(self):
        self.difficulty_levels = {
            "elementary_lower": {
                "easy": {"score_range": (0, 60), "question_complexity": 1},
                "medium": {"score_range": (61, 85), "question_complexity": 2},
                "hard": {"score_range": (86, 100), "question_complexity": 3}
            },
            "elementary_upper": {
                "easy": {"score_range": (0, 65), "question_complexity": 2},
                "medium": {"score_range": (66, 88), "question_complexity": 3},
                "hard": {"score_range": (89, 100), "question_complexity": 4}
            },
            "middle_school": {
                "easy": {"score_range": (0, 70), "question_complexity": 3},
                "medium": {"score_range": (71, 90), "question_complexity": 4},
                "hard": {"score_range": (91, 100), "question_complexity": 5}
            },
            "high_school": {
                "easy": {"score_range": (0, 75), "question_complexity": 4},
                "medium": {"score_range": (76, 92), "question_complexity": 5},
                "hard": {"score_range": (93, 100), "question_complexity": 6}
            }
        }
        
    def adjust_difficulty(self, 
                         student_score: float, 
                         confidence_level: int, 
                         response_time: float,
                         grade_level: str,
                         current_difficulty: str) -> Tuple[str, Dict]:
        """
        Adjusts difficulty based on multiple factors including score, confidence, and response time.
        
        Args:
            student_score: Percentage score (0-100)
            confidence_level: Self-reported confidence (1-5)
            response_time: Time taken to answer in seconds
            grade_level: Student's grade level category
            current_difficulty: Current difficulty setting
            
        Returns:
            Tuple of (new_difficulty_level, adjustment_metrics)
        """
        # Normalize confidence to 0-1 scale
        confidence_normalized = confidence_level / 5.0
        
        # Calculate composite performance score
        performance_weight = 0.5
        confidence_weight = 0.3
        time_weight = 0.2
        
        # Normalize response time (assuming average time is 30 seconds)
        time_score = max(0, min(1, 1 - (response_time / 30)))
        
        composite_score = (
            student_score * performance_weight +
            confidence_normalized * 100 * confidence_weight +
            time_score * 100 * time_weight
        )
        
        # Get grade-specific difficulty settings
        grade_settings = self.difficulty_levels[grade_level]
        
        # Determine new difficulty level
        new_difficulty = current_difficulty
        for level, settings in grade_settings.items():
            if settings["score_range"][0] <= composite_score <= settings["score_range"][1]:
                new_difficulty = level
                break
                
        adjustment_metrics = {
            "composite_score": composite_score,
            "performance_contribution": student_score * performance_weight,
            "confidence_contribution": confidence_normalized * 100 * confidence_weight,
            "time_contribution": time_score * 100 * time_weight,
            "previous_difficulty": current_difficulty,
            "new_difficulty": new_difficulty
        }
        
        return new_difficulty, adjustment_metrics

class SentimentAnalyzer:
    def __init__(self):
        self.sentiment_history = []
        self.engagement_threshold = 0.3
        self.frustration_threshold = -0.3
        
    def analyze_response(self, 
                        text_response: str, 
                        response_time: float,
                        confidence_level: int) -> Dict:
        """
        Analyzes student response for sentiment and engagement indicators.
        
        Args:
            text_response: Student's text response
            response_time: Time taken to respond in seconds
            confidence_level: Self-reported confidence (1-5)
            
        Returns:
            Dictionary containing sentiment analysis results
        """
        # Perform sentiment analysis
        blob = TextBlob(text_response)
        sentiment_score = blob.sentiment.polarity
        
        # Calculate engagement score
        engagement_factors = {
            "sentiment": sentiment_score,
            "response_length": len(text_response) / 100,  # Normalized by 100 chars
            "confidence": confidence_level / 5,
            "response_time": min(1, 30 / max(response_time, 1))  # Normalized, capped at 1
        }
        
        engagement_weights = {
            "sentiment": 0.3,
            "response_length": 0.2,
            "confidence": 0.3,
            "response_time": 0.2
        }
        
        engagement_score = sum(
            score * engagement_weights[factor] 
            for factor, score in engagement_factors.items()
        )
        
        # Update sentiment history
        self.sentiment_history.append(sentiment_score)
        
        # Determine emotional state
        emotional_state = self._determine_emotional_state(
            sentiment_score, 
            engagement_score,
            confidence_level
        )
        
        return {
            "sentiment_score": sentiment_score,
            "engagement_score": engagement_score,
            "emotional_state": emotional_state,
            "engagement_factors": engagement_factors,
            "requires_intervention": emotional_state == "frustrated",
            "sentiment_trend": self._calculate_sentiment_trend()
        }
    
    def _determine_emotional_state(self, 
                                 sentiment: float, 
                                 engagement: float,
                                 confidence: int) -> str:
        """Determines student's emotional state based on multiple factors"""
        if sentiment < self.frustration_threshold and confidence <= 2:
            return "frustrated"
        elif engagement > self.engagement_threshold and confidence >= 4:
            return "engaged"
        elif abs(sentiment) < 0.2 and confidence == 3:
            return "neutral"
        else:
            return "mixed"
    
    def _calculate_sentiment_trend(self) -> str:
        """Analyzes trend in sentiment over last few responses"""
        if len(self.sentiment_history) < 3:
            return "insufficient_data"
            
        recent_sentiments = self.sentiment_history[-3:]
        trend = np.polyfit(range(3), recent_sentiments, 1)[0]
        
        if trend > 0.1:
            return "improving"
        elif trend < -0.1:
            return "declining"
        else:
            return "stable"

class PersonalizedLearningPathGenerator:
    def __init__(self):
        self.learning_styles = {
            "visual": {
                "elementary_lower": [
                    "Picture books and illustrated stories",
                    "Educational videos with animations",
                    "Drawing and coloring activities",
                    "Visual puzzle games"
                ],
                "elementary_upper": [
                    "Mind mapping tools",
                    "Educational infographics",
                    "Video tutorials with diagrams",
                    "Visual note-taking techniques"
                ],
                "middle_school": [
                    "Scientific diagrams and models",
                    "Historical timelines and maps",
                    "Visual programming environments",
                    "Graphic organizers for writing"
                ],
                "high_school": [
                    "Advanced visualization software",
                    "3D modeling programs",
                    "Data visualization tools",
                    "Visual study guides and summaries"
                ]
            },
            "auditory": {
                "elementary_lower": [
                    "Educational songs and rhymes",
                    "Story time with discussion",
                    "Phonics exercises",
                    "Musical learning games"
                ],
                # Additional grade levels and styles...
            }
        }
        
    def generate_learning_path(self,
                             assessment_results: Dict,
                             grade_level: str,
                             subject_performance: Dict) -> Dict:
        """
        Generates personalized learning path based on assessment results.
        
        Args:
            assessment_results: Dictionary containing learning style scores and preferences
            grade_level: Student's grade level category
            subject_performance: Dictionary of subject scores and difficulties
            
        Returns:
            Comprehensive learning path recommendations
        """
        # Determine dominant learning style
        dominant_style = max(
            assessment_results["learning_style_scores"].items(),
            key=lambda x: x[1]
        )[0]
        
        # Get grade-appropriate recommendations
        style_recommendations = self.learning_styles[dominant_style][grade_level]
        
        # Identify areas needing improvement
        weak_subjects = [
            subject for subject, data in subject_performance.items()
            if data["score"] < 70
        ]
        
        # Generate personalized strategies
        learning_strategies = self._generate_strategies(
            dominant_style,
            grade_level,
            weak_subjects
        )
        
        return {
            "learning_style": {
                "primary": dominant_style,
                "scores": assessment_results["learning_style_scores"]
            },
            "recommended_resources": style_recommendations,
            "improvement_areas": weak_subjects,
            "learning_strategies": learning_strategies,
            "assessment_summary": {
                "confidence_trend": assessment_results["confidence_trend"],
                "engagement_level": assessment_results["engagement_level"],
                "recommended_difficulty": assessment_results["recommended_difficulty"]
            },
            "next_steps": self._generate_next_steps(weak_subjects, grade_level),
            "generation_date": datetime.now().isoformat()
        }
    
    def _generate_strategies(self,
                           learning_style: str,
                           grade_level: str,
                           weak_subjects: List[str]) -> Dict:
        """Generates subject-specific learning strategies"""
        # Implementation details for strategy generation...
        pass
    
    def _generate_next_steps(self,
                           weak_subjects: List[str],
                           grade_level: str) -> List[str]:
        """Generates concrete next steps for improvement"""
        # Implementation details for next steps generation...
        pass
