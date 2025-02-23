# File: /backend/models/student.py
# Description: SQLAlchemy model for student data
# Author: GitHub Copilot
# Created: 2024-02-20

from sqlalchemy import Column, String, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4
from typing import Optional

from .base import Base
from .mixins import TimestampMixin

class Student(Base, TimestampMixin):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    grade_level = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    preferences = Column(JSON, nullable=True)
    current_learning_style = Column(JSON, nullable=True)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    assessments = relationship("Assessment", back_populates="student")

    def can_access_student(self, student_id: str) -> bool:
        """Check if the current user can access a student's data."""
        # Students can only access their own data
        return self.id == student_id

    def update_learning_style(self, learning_style: dict) -> None:
        """Update the student's current learning style."""
        self.current_learning_style = learning_style
        self.save()

    def get_latest_assessment(self) -> Optional["Assessment"]:
        """Get the student's most recent assessment."""
        if not self.assessments:
            return None
        return max(self.assessments, key=lambda a: a.created_at)

    def to_dict(self) -> dict:
        """Convert student model to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "grade_level": self.grade_level,
            "active": self.active,
            "preferences": self.preferences,
            "current_learning_style": self.current_learning_style,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }