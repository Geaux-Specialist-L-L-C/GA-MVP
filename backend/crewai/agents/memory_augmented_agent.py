# backend/crewai/agents/memory_augmented_agent.py
from typing import Dict, Any, List, Optional
from cheshire_cat_sdk import CheshireCat
from crewai import Agent as CrewAgent

class MemoryAugmentedAgent:
    """
    A specialized agent that integrates CrewAI's Agent with Cheshire Cat memory capabilities.
    This enables long-term memory persistence and retrieval.
    """
    
    def __init__(
        self, 
        agent_id: str,
        name: str,
        role: str,
        cat_client: CheshireCat,
        crew_agent: CrewAgent
    ):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.cat_client = cat_client
        self.crew_agent = crew_agent
    
    async def store_interaction(self, task_input: Dict[str, Any], result: Dict[str, Any]) -> str:
        """
        Store an agent interaction (input and output) in Cheshire Cat memory
        for future reference and learning.
        """
        content = f"Task: {str(task_input)}\nResult: {str(result)}"
        
        memory_id = await self.cat_client.memory.add_memory(
            content=content,
            metadata={
                "agent_id": self.agent_id,
                "agent_name": self.name,
                "agent_role": self.role,
                "task_type": task_input.get("task_type", "unknown"),
                "subject": task_input.get("subject", ""),
                "grade_level": task_input.get("grade_level", ""),
                "learning_style": task_input.get("learning_style", ""),
                "interaction_type": "task_completion"
            }
        )
        
        return memory_id
    
    async def build_prompt_context(self, task_input: Dict[str, Any]) -> str:
        """
        Build context for the agent's prompt by retrieving relevant memories.
        This enhances the agent's ability to provide personalized and contextually
        relevant responses.
        """
        # Construct a relevant query based on task parameters
        query_terms = []
        
        if "subject" in task_input:
            query_terms.append(task_input["subject"])
        
        if "grade_level" in task_input:
            query_terms.append(task_input["grade_level"])
        
        if "learning_style" in task_input:
            query_terms.append(task_input["learning_style"])
        
        query = " ".join(query_terms)
        
        # Recall relevant memories
        memories = await self.cat_client.memory.recall_memories(
            query=query,
            filters={"agent_role": self.role},
            limit=3
        )
        
        # Extract and format memories as context
        context_blocks = []
        
        for memory in memories:
            context_blocks.append(f"PREVIOUS INTERACTION:\n{memory['content']}\n")
        
        if context_blocks:
            return "RELEVANT CONTEXT:\n" + "\n".join(context_blocks)
        else:
            return ""
    
    async def run_task(self, task_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a task using the CrewAI agent with memory augmentation.
        """
        # Build memory-enhanced context for the agent
        context = await self.build_prompt_context(task_input)
        
        # Add context to the task input
        task_input_with_context = {
            **task_input,
            "memory_context": context
        }
        
        # Execute the task with CrewAI
        result = await self.crew_agent.execute_task(task_input_with_context)
        
        # Store the interaction in memory
        memory_id = await self.store_interaction(task_input, result)
        
        # Add memory reference to the result
        result["memory_id"] = memory_id
        
        return result