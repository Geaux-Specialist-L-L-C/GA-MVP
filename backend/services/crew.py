# File: /backend/services/crew.py
# Description: CrewAI service for learning assessment
# Author: GitHub Copilot
# Created: 2024-02-20

from typing import Dict, Optional
from datetime import datetime
from crewai import Crew, Agent, Task
from fastapi import HTTPException
from openai import AsyncOpenAI
import asyncio
import json

from models.assessment import Assessment
from models.student import Student
from schemas.assessment import LearningStyle
from core.config import settings
from core.exceptions import AssessmentError

class LearningAssessmentCrew:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize the specialized AI agents for the assessment process."""
        self.conversation_agent = Agent(
            name="Conversation Specialist",
            role="Conducts natural conversations to assess learning preferences",
            goal="Gather information about learning style through conversation",
            backstory="Expert in educational psychology and conversational assessment",
            tools=["conversation"],
            model=settings.OPENAI_MODEL_NAME,
            allow_delegation=False
        )

        self.analysis_agent = Agent(
            name="Learning Style Analyst",
            role="Analyzes conversation data to determine learning style",
            goal="Accurately assess learning style based on conversation",
            backstory="Expert in VARK learning style analysis and pattern recognition",
            tools=["analysis"],
            model=settings.OPENAI_MODEL_NAME,
            allow_delegation=False
        )

        self.recommendation_agent = Agent(
            name="Learning Path Advisor",
            role="Generates personalized learning recommendations",
            goal="Create tailored learning strategies based on style assessment",
            backstory="Expert in educational content adaptation and learning strategies",
            tools=["recommendation"],
            model=settings.OPENAI_MODEL_NAME,
            allow_delegation=True
        )

    async def run_assessment(self, assessment_id: str, student_id: str) -> Dict:
        """Run the complete learning style assessment process."""
        try:
            assessment = Assessment.get(assessment_id)
            if not assessment:
                raise AssessmentError(f"Assessment {assessment_id} not found")

            student = Student.get(student_id)
            if not student:
                raise AssessmentError(f"Student {student_id} not found")

            # Create assessment crew with specialized agents
            crew = Crew(
                agents=[
                    self.conversation_agent,
                    self.analysis_agent,
                    self.recommendation_agent
                ],
                tasks=[
                    Task(
                        description="Conduct learning style assessment conversation",
                        agent=self.conversation_agent,
                        expected_output="Conversation analysis for learning style"
                    ),
                    Task(
                        description="Analyze conversation data and determine learning style",
                        agent=self.analysis_agent,
                        expected_output="VARK learning style classification"
                    ),
                    Task(
                        description="Generate personalized learning recommendations",
                        agent=self.recommendation_agent,
                        expected_output="List of tailored learning strategies"
                    )
                ],
                process="sequential"
            )

            # Execute assessment tasks
            assessment.update_progress(33.0)  # Starting conversation
            conversation_result = await crew.tasks[0].execute()
            
            assessment.update_progress(66.0)  # Analyzing results
            analysis_result = await crew.tasks[1].execute(
                context={"conversation": conversation_result}
            )
            
            # Parse learning style from analysis
            learning_style = self._parse_learning_style(analysis_result)
            
            # Generate recommendations
            recommendations = await crew.tasks[2].execute(
                context={"learning_style": learning_style}
            )

            # Update assessment with final results
            assessment.update_progress(
                100.0,
                learning_style=learning_style,
                recommendations=recommendations
            )

            # Update student's current learning style
            student.update_learning_style(learning_style)

            return {
                "completed": True,
                "learning_style": learning_style,
                "recommendations": recommendations
            }

        except Exception as e:
            assessment.status = "failed"
            assessment.save()
            raise AssessmentError(f"Assessment failed: {str(e)}")

    def _parse_learning_style(self, analysis_result: Dict) -> Dict:
        """Parse and validate the learning style analysis results."""
        try:
            style_data = json.loads(analysis_result["learning_style"])
            return {
                "primary": style_data["primary"],
                "scores": {
                    "visual": float(style_data["scores"]["visual"]),
                    "auditory": float(style_data["scores"]["auditory"]),
                    "reading": float(style_data["scores"]["reading"]),
                    "kinesthetic": float(style_data["scores"]["kinesthetic"])
                },
                "confidence": float(style_data["confidence"])
            }
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            raise AssessmentError(f"Failed to parse learning style data: {str(e)}")

learning_assessment_crew = LearningAssessmentCrew()