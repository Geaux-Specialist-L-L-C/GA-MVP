# File: /backend/routes/learning_assessment.py
# Description: FastAPI routes for handling learning style assessments
# Author: GitHub Copilot
# Created: 2024-02-20

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Dict, Optional
from datetime import datetime

from models.assessment import Assessment
from models.student import Student
from schemas.assessment import (
    AssessmentRequest,
    AssessmentResponse,
    AssessmentProgress,
    LearningStyle
)
from services.crew import learning_assessment_crew
from auth.jwt import get_current_user
from core.exceptions import AssessmentError

router = APIRouter(prefix="/api/learning-assessment", tags=["assessment"])

@router.post("/start")
async def start_assessment(
    request: AssessmentRequest,
    background_tasks: BackgroundTasks,
    current_user: Student = Depends(get_current_user)
) -> AssessmentResponse:
    """Start a new learning style assessment."""
    try:
        # Validate student access
        if not current_user.can_access_student(request.student_id):
            raise HTTPException(
                status_code=403,
                detail="Not authorized to assess this student"
            )

        # Create new assessment record
        assessment = Assessment.create(
            student_id=request.student_id,
            initiated_by=current_user.id,
            status="pending"
        )

        # Start assessment in background
        background_tasks.add_task(
            learning_assessment_crew.run_assessment,
            assessment.id,
            request.student_id
        )

        return AssessmentResponse(
            assessment_id=assessment.id,
            student_id=request.student_id,
            status="started",
            timestamp=datetime.utcnow()
        )

    except AssessmentError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{assessment_id}/progress")
async def get_assessment_progress(
    assessment_id: str,
    current_user: Student = Depends(get_current_user)
) -> AssessmentProgress:
    """Get the progress of an ongoing assessment."""
    try:
        assessment = Assessment.get(assessment_id)
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")

        # Validate access
        if not current_user.can_access_student(assessment.student_id):
            raise HTTPException(
                status_code=403,
                detail="Not authorized to view this assessment"
            )

        return AssessmentProgress(
            assessment_id=assessment_id,
            completed=assessment.status == "completed",
            progress=assessment.progress,
            learning_style=assessment.learning_style if assessment.status == "completed" else None
        )

    except AssessmentError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")