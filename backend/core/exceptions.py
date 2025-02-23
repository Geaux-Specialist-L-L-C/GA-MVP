# File: /backend/core/exceptions.py
# Description: Custom exception classes for backend service
# Author: GitHub Copilot
# Created: 2024-02-20

from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class AssessmentError(Exception):
    """Base exception for assessment-related errors."""
    def __init__(self, message: str, code: Optional[str] = None):
        self.message = message
        self.code = code or "ASSESSMENT_ERROR"
        super().__init__(self.message)

class StudentNotFoundError(HTTPException):
    """Raised when a student record is not found."""
    def __init__(self, student_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found"
        )

class AssessmentNotFoundError(HTTPException):
    """Raised when an assessment record is not found."""
    def __init__(self, assessment_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment with ID {assessment_id} not found"
        )

class InvalidLearningStyleError(HTTPException):
    """Raised when learning style data is invalid."""
    def __init__(self, details: Dict[str, Any]):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Invalid learning style data",
                "details": details
            }
        )

class UnauthorizedAccessError(HTTPException):
    """Raised when a user tries to access unauthorized resources."""
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message
        )

class AssessmentInProgressError(HTTPException):
    """Raised when trying to start an assessment while another is in progress."""
    def __init__(self, assessment_id: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Assessment {assessment_id} is already in progress"
        )

class AIServiceError(HTTPException):
    """Raised when there's an error with the AI service."""
    def __init__(self, message: str, service: str = "AI Service"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "message": message,
                "service": service
            }
        )

class ValidationError(HTTPException):
    """Raised when data validation fails."""
    def __init__(self, errors: Dict[str, Any]):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Validation error",
                "errors": errors
            }
        )

class DatabaseError(HTTPException):
    """Raised when database operations fail."""
    def __init__(self, operation: str, details: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": f"Database operation '{operation}' failed",
                "details": details
            }
        )