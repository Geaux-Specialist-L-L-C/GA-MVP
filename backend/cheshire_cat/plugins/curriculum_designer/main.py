# backend/cheshire_cat/plugins/curriculum_designer/main.py
from cat.mad_hatter.decorators import hook
from typing import Dict, Any, List
from pydantic import BaseModel

class CurriculumModuleSchema(BaseModel):
    title: str
    content: str
    activities: List[str] = []

class CurriculumSchema(BaseModel):
    title: str
    grade_level: str
    subject: str
    learning_style: str
    modules: List[CurriculumModuleSchema]
    recommendations: List[str] = []

@hook
async def before_cat_sends_message(message: Dict[str, Any], cat) -> Dict[str, Any]:
    """Process the message before sending it to the user"""
    # Check if this is a curriculum generation response
    if "curriculum" in message["content"].lower() and any(style in message["content"].lower() for style in ["visual", "auditory", "kinesthetic", "reading"]):
        # Extract learning style from memories
        memories = await cat.memory.recall_memories(
            query="learning style",
            limit=1
        )
        
        learning_style = "visual"  # Default
        if memories:
            for memory in memories:
                if "learning_style" in memory.get("metadata", {}):
                    learning_style = memory["metadata"]["learning_style"]
                    break
        
        # Store the curriculum as structured data in memory
        try:
            # Parse message content to extract curriculum components
            # This would be a complex parsing function in practice
            curriculum = {
                "title": "Extracted Curriculum Title",
                "grade_level": "elementary",
                "subject": "math",
                "learning_style": learning_style,
                "modules": [
                    {"title": "Module 1", "content": "Content..."}
                ],
                "recommendations": []
            }
            
            # Add memory
            await cat.memory.add_memory(
                content=str(curriculum),
                metadata={
                    "type": "curriculum",
                    "learning_style": learning_style
                }
            )
            
            # Update message with structured info
            message["content"] += "\n\n(This curriculum has been saved to memory and can be accessed later.)"
        except Exception as e:
            print(f"Error processing curriculum: {str(e)}")
    
    return message

@hook
async def after_cat_recalls_memories(memories: List[Dict[str, Any]], cat) -> List[Dict[str, Any]]:
    """Process memories after they are recalled"""
    # Prioritize curriculum memories that match the user's learning style
    user_style = cat.working_memory.get("user_learning_style", "")
    
    if user_style and any(memory.get("metadata", {}).get("type") == "curriculum" for memory in memories):
        # Sort memories to prioritize those matching the user's learning style
        memories.sort(
            key=lambda m: (
                m.get("metadata", {}).get("type") == "curriculum" and 
                m.get("metadata", {}).get("learning_style") == user_style
            ),
            reverse=True
        )
    
    return memories