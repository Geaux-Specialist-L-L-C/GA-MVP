# File: /backend/agents/orchestrator.py
# Description: Core agent orchestration system using CrewAI

from crewai import Agent, Task, Crew
from typing import Dict, List
import asyncio
from fastapi import FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pymongo import MongoClient
from datetime import datetime

# Initialize FastAPI app
app = FastAPI()
security = HTTPBearer()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client.geaux_academy

class AgentOrchestrator:
    def __init__(self):
        # Initialize core agents
        self.teacher_agent = Agent(
            role="Teacher",
            goal="Create and validate personalized curriculum content",
            backstory="AI teacher specialized in adaptive learning",
            allow_delegation=True
        )
        
        self.research_agent = Agent(
            role="Researcher",
            goal="Validate content accuracy and educational standards",
            backstory="Expert in educational standards and content validation",
            allow_delegation=True
        )
        
        self.supervisor_agent = Agent(
            role="Supervisor",
            goal="Ensure quality and coordination between agents",
            backstory="Oversees multi-agent operations and maintains standards",
            allow_delegation=True
        )

    async def create_curriculum(self, subject: str, grade_level: int, learning_style: str) -> Dict:
        # Create curriculum generation task
        curriculum_task = Task(
            description=f"Create curriculum for {subject} at grade {grade_level}",
            agent=self.teacher_agent
        )

        # Create validation task
        validation_task = Task(
            description="Validate curriculum against standards",
            agent=self.research_agent
        )

        # Create supervision task
        supervision_task = Task(
            description="Review and approve final curriculum",
            agent=self.supervisor_agent
        )

        # Create crew for this workflow
        crew = Crew(
            agents=[self.teacher_agent, self.research_agent, self.supervisor_agent],
            tasks=[curriculum_task, validation_task, supervision_task]
        )

        # Execute workflow
        result = await crew.kickoff()
        
        # Store result in MongoDB
        db.curricula.insert_one({
            "subject": subject,
            "grade_level": grade_level,
            "learning_style": learning_style,
            "content": result,
            "created_at": datetime.utcnow()
        })

        return result

# API Routes
@app.post("/api/curriculum/generate")
async def generate_curriculum(
    subject: str,
    grade_level: int,
    learning_style: str,
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    try:
        orchestrator = AgentOrchestrator()
        result = await orchestrator.create_curriculum(subject, grade_level, learning_style)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# File: /backend/agents/differentiation_manager.py
# Description: Handles learning style assessment and differentiation

from fastapi import APIRouter, Depends
from typing import Dict, List
import json
from pydantic import BaseModel

router = APIRouter()

class LearningStyle(BaseModel):
    visual: float
    auditory: float
    kinesthetic: float
    reading_writing: float

class DifferentiationStrategy(BaseModel):
    style: str
    strategies: List[str]
    resources: List[str]

class DifferentiationManager:
    def __init__(self):
        self.strategies_db = self._load_strategies()

    def _load_strategies(self) -> Dict:
        with open("data/differentiation_strategies.json", "r") as f:
            return json.load(f)

    def generate_strategies(self, learning_style: LearningStyle) -> List[DifferentiationStrategy]:
        # Determine dominant learning style
        styles = {
            "visual": learning_style.visual,
            "auditory": learning_style.auditory,
            "kinesthetic": learning_style.kinesthetic,
            "reading_writing": learning_style.reading_writing
        }
        
        dominant_style = max(styles.items(), key=lambda x: x[1])[0]
        
        # Get strategies for dominant style
        strategies = self.strategies_db.get(dominant_style, [])
        
        return DifferentiationStrategy(
            style=dominant_style,
            strategies=strategies["strategies"],
            resources=strategies["resources"]
        )

@router.post("/learning-style/analyze")
async def analyze_learning_style(learning_style: LearningStyle):
    manager = DifferentiationManager()
    strategies = manager.generate_strategies(learning_style)
    return strategies
