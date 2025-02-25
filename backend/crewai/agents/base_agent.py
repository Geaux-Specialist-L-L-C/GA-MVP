# backend/crewai/agents/base_agent.py
from cheshire_cat_sdk import CheshireCat
from typing import Dict, Any, List, Optional

class BaseAgent:
    def __init__(self, agent_id: str, name: str, role: str, cat_client: CheshireCat):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.cat_client = cat_client  # Cheshire Cat client for memory operations
    
    async def store_memory(self, content: str, metadata: Dict[str, Any]) -> str:
        """Store a memory in Cheshire Cat"""
        memory_id = await self.cat_client.memory.add_memory(
            content=content,
            metadata={
                "agent_id": self.agent_id,
                "agent_name": self.name,
                "agent_role": self.role,
                **metadata
            }
        )
        return memory_id
    
    async def recall_memories(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Recall relevant memories based on a query"""
        memories = await self.cat_client.memory.recall_memories(
            query=query,
            filters={
                "agent_id": self.agent_id
            },
            limit=limit
        )
        return memories
    
    async def process_task(self, task_input: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a task with the given input and context (to be implemented by child classes)"""
        raise NotImplementedError("Child classes must implement process_task")