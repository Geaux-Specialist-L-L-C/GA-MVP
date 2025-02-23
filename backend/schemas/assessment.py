# File: /backend/schemas/assessment.py
# Description: Pydantic models for learning assessment data validation
# Author: GitHub Copilot
# Created: 2024-02-20

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from datetime import datetime
import uuid

class LearningStyle(BaseModel):
    primary: Literal['visual', 'auditory', 'reading', 'kinesthetic']
    scores: dict[Literal['visual', 'auditory', 'reading', 'kinesthetic'], float]
    confidence: float = Field(..., ge=0.0, le=1.0)

    @validator('scores')
    def validate_scores(cls, v):
        if not all(0 <= score <= 1 for score in v.values()):
            raise ValueError("All scores must be between 0 and 1")
        if not all(style in v for style in ['visual', 'auditory', 'reading', 'kinesthetic']):
            raise ValueError("Must include scores for all learning styles")
        return v

class AssessmentRequest(BaseModel):
    student_id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    
    @validator('student_id')
    def validate_uuid(cls, v):
        try:
            uuid.UUID(v)
            return v
        except ValueError:
            raise ValueError("Invalid UUID format")

class AssessmentResponse(BaseModel):
    assessment_id: str
    student_id: str
    status: Literal['started', 'in_progress', 'completed', 'failed']
    timestamp: datetime
    learning_style: Optional[LearningStyle] = None
    recommendations: Optional[List[str]] = None

class AssessmentProgress(BaseModel):
    assessment_id: str
    completed: bool
    progress: float = Field(..., ge=0.0, le=100.0)
    learning_style: Optional[LearningStyle] = None

class AssessmentResult(BaseModel):
    assessment_id: str
    student_id: str
    learning_style: LearningStyle
    recommendations: List[str]
    completed_at: datetime
    metrics: dict[str, float] = Field(
        default_factory=dict,
        description="Assessment performance metrics"
    )