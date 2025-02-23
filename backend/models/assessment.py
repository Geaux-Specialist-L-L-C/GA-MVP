# File: /backend/models/assessment.py
# Description: SQLAlchemy model for learning assessments
# Author: GitHub Copilot
# Created: 2024-02-20

from sqlalchemy import Column, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4

from .base import Base
from .mixins import TimestampMixin

class Assessment(Base, TimestampMixin):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    initiated_by = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")
    progress = Column(Float, nullable=False, default=0.0)
    learning_style = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    student = relationship("Student", back_populates="assessments")
    initiator = relationship("User", back_populates="initiated_assessments")

    @classmethod
    def create(cls, student_id: str, initiated_by: str, status: str = "pending") -> "Assessment":
        assessment = cls(
            student_id=student_id,
            initiated_by=initiated_by,
            status=status
        )
        assessment.save()
        return assessment

    def update_progress(self, progress: float, learning_style: dict = None) -> None:
        self.progress = progress
        if learning_style:
            self.learning_style = learning_style
            self.status = "completed"
            self.completed_at = datetime.utcnow()
        self.save()

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "student_id": self.student_id,
            "status": self.status,
            "progress": self.progress,
            "learning_style": self.learning_style,
            "recommendations": self.recommendations,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }