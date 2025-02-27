# File: /backend/app/services/crew_service.py
# Description: Service for managing CrewAI agents for educational content generation
# Author: evopimp
# Created: 2025-02-27

from typing import Dict, Any, List
from crewai import Agent, Task, Crew, Process
from langchain.tools import Tool
from app.services.cheshire_cat_service import CheshireCatService

class CrewService:
    """Service for managing CrewAI agents for educational content generation"""
    
    def __init__(self, cat_service: CheshireCatService):
        self.cat_service = cat_service
        
    def generate_curriculum(self, subject: str, grade_level: str, learning_style: str) -> Dict[str, Any]:
        """Generate a curriculum using a crew of specialized AI agents"""
        
        # Define tools that agents can use
        tools = [
            Tool(
                name="SearchEducationalContent",
                func=self._search_educational_content,
                description="Searches for educational content on a specific subject"
            ),
            Tool(
                name="FetchLearningStyleGuidelines",
                func=self._fetch_learning_style_guidelines,
                description="Fetches guidelines for adapting content to a specific learning style"
            ),
            Tool(
                name="ValidateCurriculumStandards",
                func=self._validate_curriculum_standards,
                description="Validates if curriculum meets educational standards for a grade level"
            )
        ]
        
        # Define specialized agents
        researcher = Agent(
            role="Educational Researcher",
            goal="Find accurate and relevant educational content",
            backstory="You're an expert educational researcher with decades of experience finding the best learning resources.",
            tools=tools,
            verbose=True
        )
        
        curriculum_designer = Agent(
            role="Curriculum Designer",
            goal="Create engaging and effective learning modules",
            backstory="You're a master curriculum designer who knows how to structure educational content for optimal learning.",
            tools=tools,
            verbose=True
        )
        
        learning_specialist = Agent(
            role="Learning Style Specialist",
            goal=f"Adapt content to {learning_style} learning style",
            backstory=f"You're an expert in {learning_style} learning styles and know how to tailor content for these learners.",
            tools=tools,
            verbose=True
        )
        
        # Define tasks for the agents
        research_task = Task(
            description=f"""Research comprehensive information about {subject} appropriate for {grade_level} level.
            Focus on key concepts, common misconceptions, and engaging examples.
            Provide a detailed research report with citations to reliable sources.""",
            agent=researcher
        )
        
        design_task = Task(
            description=f"""Design a curriculum for {subject} at {grade_level} level.
            Use the research report to create well-structured learning modules.
            Include learning objectives, key concepts, activities, and assessments.
            Ensure the curriculum follows educational standards and best practices.""",
            agent=curriculum_designer,
            dependencies=[research_task]
        )
        
        adaptation_task = Task(
            description=f"""Adapt the curriculum to {learning_style} learning style.
            Modify activities, examples, and assessments to match this learning style.
            Provide specific recommendations for how to present the material.
            Ensure all adaptations maintain the educational objectives and standards.""",
            agent=learning_specialist,
            dependencies=[design_task]
        )
        
        # Create and run the crew
        crew = Crew(
            agents=[researcher, curriculum_designer, learning_specialist],
            tasks=[research_task, design_task, adaptation_task],
            process=Process.sequential,
            verbose=2
        )
        
        result = crew.kickoff()
        
        # Process and structure the result
        return self._process_curriculum_result(result, subject, grade_level, learning_style)
    
    def _search_educational_content(self, query: str) -> str:
        """Search for educational content using the AI's knowledge"""
        # In a real implementation, this would connect to educational databases
        # For now, we'll leverage the cat_service's memory capabilities
        return f"Educational content for: {query}"
    
    def _fetch_learning_style_guidelines(self, learning_style: str) -> str:
        """Fetch guidelines for adapting content to a specific learning style"""
        guidelines = {
            "visual": "Use diagrams, charts, and videos. Emphasize color coding and spatial organization.",
            "auditory": "Include discussions, audio recordings, and verbal explanations. Use rhythm and patterns.",
            "reading/writing": "Provide written materials, note-taking activities, and text-based resources.",
            "kinesthetic": "Incorporate hands-on activities, movement, and practical applications."
        }
        return guidelines.get(learning_style.lower(), "No specific guidelines available for this learning style.")
    
    def _validate_curriculum_standards(self, curriculum: str, grade_level: str) -> str:
        """Validate if curriculum meets educational standards for a grade level"""
        # This would connect to educational standards databases in a real implementation
        return f"Curriculum validated against {grade_level} standards."
    
    def _process_curriculum_result(self, result: str, subject: str, grade_level: str, learning_style: str) -> Dict[str, Any]:
        """Process and structure the raw curriculum result from CrewAI"""
        # In a real implementation, this would parse and structure the result
        # For now, we'll return a simple structured format
        return {
            "subject": subject,
            "grade_level": grade_level,
            "learning_style": learning_style,
            "content": result,
            "modules": [
                {"title": "Introduction", "content": "Introduction content..."},
                {"title": "Core Concepts", "content": "Core concepts content..."},
                {"title": "Activities", "content": "Activities content..."},
                {"title": "Assessment", "content": "Assessment content..."}
            ]
        }