# backend/crewai/tools/prompt_chaining.py
from typing import Dict, Any, List, Callable

class PromptChain:
    """Chain multiple prompts together with state management"""
    
    def __init__(self):
        self.steps: List[Callable] = []
        self.state: Dict[str, Any] = {}
    
    def add_step(self, step_func: Callable):
        """Add a step to the chain"""
        self.steps.append(step_func)
        return self
    
    async def execute(self, initial_input: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the full chain"""
        self.state = initial_input.copy()
        
        for step in self.steps:
            step_result = await step(self.state)
            self.state.update(step_result)
        
        return self.state

# Example usage for curriculum generation
async def research_subject(state: Dict[str, Any]) -> Dict[str, Any]:
    """Research step to gather information about a subject"""
    subject = state.get("subject", "")
    grade_level = state.get("grade_level", "")
    
    # Perform research using CrewAI agent
    research_data = {
        "key_concepts": ["..."],
        "resources": ["..."],
        "difficulty_level": "medium"
    }
    
    return {"research_data": research_data}

async def design_curriculum(state: Dict[str, Any]) -> Dict[str, Any]:
    """Design curriculum based on research and learning style"""
    research_data = state.get("research_data", {})
    learning_style = state.get("learning_style", "visual")
    
    # Generate curriculum with CrewAI agent
    curriculum = {
        "modules": ["..."],
        "activities": ["..."]
    }
    
    return {"curriculum": curriculum}

async def personalize_content(state: Dict[str, Any]) -> Dict[str, Any]:
    """Personalize content for specific learning style"""
    curriculum = state.get("curriculum", {})
    learning_style = state.get("learning_style", "visual")
    
    # Personalize with CrewAI agent
    personalized = {
        "adaptations": ["..."],
        "recommendations": ["..."]
    }
    
    return {"personalized_content": personalized}

# Create a chain for curriculum generation
curriculum_chain = PromptChain()
curriculum_chain.add_step(research_subject)
curriculum_chain.add_step(design_curriculum)
curriculum_chain.add_step(personalize_content)

# Usage
result = await curriculum_chain.execute({
    "subject": "Mathematics",
    "grade_level": "elementary",
    "learning_style": "visual"
})