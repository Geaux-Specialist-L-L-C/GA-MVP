# backend/crewai/orchestrator/task_manager.py
from typing import Dict, Any, List
import asyncio
from ..agents.teacher_agent import TeacherAgent
from ..agents.researcher_agent import ResearcherAgent
from ..agents.supervisor_agent import SupervisorAgent
from cheshire_cat_sdk import CheshireCat

class TaskOrchestrator:
    """Orchestrates tasks between multiple agents"""
    
    def __init__(self, cat_client: CheshireCat):
        self.cat_client = cat_client
        # Initialize agents
        self.teacher = TeacherAgent(
            agent_id="teacher-001", 
            name="Teacher",
            role="curriculum_creation",
            cat_client=cat_client
        )
        self.researcher = ResearcherAgent(
            agent_id="researcher-001",
            name="Researcher",
            role="content_research",
            cat_client=cat_client
        )
        self.supervisor = SupervisorAgent(
            agent_id="supervisor-001",
            name="Supervisor",
            role="quality_control",
            cat_client=cat_client
        )
    
    async def execute_task_flow(self, task_input: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a full task flow using multiple agents"""
        # 1. Store the original task request in memory
        task_id = await self.cat_client.memory.add_memory(
            content=str(task_input),
            metadata={
                "type": "task_request",
                "task_id": task_input.get("task_id", "unknown")
            }
        )
        
        # 2. Start with research to gather information
        research_output = await self.researcher.process_task(task_input)
        
        # 3. Teacher creates educational content based on research
        teacher_input = {**task_input, "research": research_output["content"]}
        teacher_output = await self.teacher.process_task(teacher_input)
        
        # 4. Supervisor reviews and finalizes the output
        supervisor_input = {
            **task_input,
            "research_output": research_output["content"],
            "teacher_output": teacher_output["content"]
        }
        final_output = await self.supervisor.process_task(supervisor_input)
        
        # 5. Store the final output in memory
        await self.cat_client.memory.add_memory(
            content=str(final_output),
            metadata={
                "type": "task_result",
                "task_id": task_input.get("task_id", "unknown"),
                "status": "completed"
            }
        )
        
        return final_output
    
    async def execute_async_task(self, task_input: Dict[str, Any]) -> str:
        """
        Starts a task asynchronously and returns a task ID
        This allows for long-running tasks without blocking
        """
        task_id = task_input.get("task_id") or str(uuid.uuid4())
        
        # Store task status as "in progress"
        await self.cat_client.memory.add_memory(
            content="Task started",
            metadata={
                "type": "task_status",
                "task_id": task_id,
                "status": "in_progress"
            }
        )
        
        # Start task execution in background
        asyncio.create_task(self._execute_and_update(task_id, task_input))
        
        return task_id
    
    async def _execute_and_update(self, task_id: str, task_input: Dict[str, Any]) -> None:
        """Internal method to execute a task and update its status"""
        try:
            result = await self.execute_task_flow(task_input)
            # Update task status to "completed"
            await self.cat_client.memory.add_memory(
                content=str(result),
                metadata={
                    "type": "task_status",
                    "task_id": task_id,
                    "status": "completed"
                }
            )
        except Exception as e:
            # Update task status to "failed"
            await self.cat_client.memory.add_memory(
                content=str(e),
                metadata={
                    "type": "task_status",
                    "task_id": task_id,
                    "status": "failed",
                    "error": str(e)
                }
            )
    
    async def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Get the current status of a task"""
        memories = await self.cat_client.memory.recall_memories(
            query="",  # Empty query to use only filters
            filters={
                "type": "task_status",
                "task_id": task_id
            },
            limit=1,
            sort_by="created_at",
            sort_order="desc"
        )
        
        if not memories:
            return {"status": "unknown", "task_id": task_id}
        
        latest_status = memories[0]
        return {
            "status": latest_status["metadata"]["status"],
            "task_id": task_id,
            "last_updated": latest_status["created_at"],
            "details": latest_status.get("content", "")
        }