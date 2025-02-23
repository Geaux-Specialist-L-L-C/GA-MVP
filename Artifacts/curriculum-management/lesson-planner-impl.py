from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Activity:
    """Structure for learning activities"""
    name: str
    description: str
    duration: int  # in minutes
    type: str  # "introduction", "practice", "assessment", etc.
    materials: List[str]
    learning_objectives: List[str]
    difficulty_level: str
    prerequisites: Optional[List[str]] = None

@dataclass
class Assessment:
    """Structure for learning assessments"""
    type: str  # "quiz", "project", "discussion", etc.
    questions: List[Dict]
    rubric: Optional[Dict] = None
    passing_score: Optional[int] = None

class LessonPlanner:
    """Enhanced implementation of the Lesson Planner agent"""
    
    def __init__(self):
        self.activity_templates = self._initialize_activity_templates()
        self.assessment_templates = self._initialize_assessment_templates()

    def _initialize_activity_templates(self) -> Dict[str, List[Activity]]:
        """Initialize database of activity templates"""
        return {
            "math": {
                "fractions": [
                    Activity(
                        name="Fraction Visual Introduction",
                        description="Use pizza slices to introduce fraction concepts",
                        duration=20,
                        type="introduction",
                        materials=["Pizza fraction manipulatives", "Worksheets"],
                        learning_objectives=[
                            "Understand fractions as parts of a whole",
                            "Visualize fraction equivalence"
                        ],
                        difficulty_level="beginner"
                    ),
                    # Add more activities...
                ]
            }
        }

    def _initialize_assessment_templates(self) -> Dict[str, List[Assessment]]:
        """Initialize database of assessment templates"""
        return {
            "math": {
                "fractions": [
                    Assessment(
                        type="quiz",
                        questions=[
                            {
                                "type": "multiple_choice",
                                "question": "Which fraction is equivalent to 1/2?",
                                "options": ["2/4", "3/4", "1/4", "1/3"],
                                "correct_answer": "2/4"
                            }
                        ],
                        passing_score=80
                    ),
                    # Add more assessments...
                ]
            }
        }

    def create_lesson_plan(
        self, 
        topic: str, 
        standards: Dict, 
        resources: List[Dict]
    ) -> Dict:
        """
        Generate a detailed lesson plan
        
        Args:
            topic: The specific topic for the lesson
            standards: Educational standards to be covered
            resources: Available learning resources
            
        Returns:
            Dictionary containing the complete lesson plan
        """
        try:
            logger.info(f"Creating lesson plan for topic: {topic}")
            
            # Extract learning objectives from standards
            learning_objectives = self._extract_learning_objectives(standards)
            
            # Create lesson structure
            lesson_plan = {
                "topic": topic,
                "duration": 60,  # default 60 minutes
                "learning_objectives": learning_objectives,
                "materials_needed": [],
                "preparation": [],
                "activities": [],
                "assessments": [],
                "extensions": [],
                "accommodations": []
            }
            
            # Add opening activity
            opening_activity = self._create_opening_activity(topic, learning_objectives)
            lesson_plan["activities"].append(opening_activity)
            lesson_plan["duration"] += opening_activity["duration"]
            
            # Add main learning activities
            main_activities = self._create_main_activities(
                topic, learning_objectives, resources
            )
            lesson_plan["activities"].extend(main_activities)
            lesson_plan["duration"] += sum(act["duration"] for act in main_activities)
            
            # Add assessment
            assessment = self._create_assessment(topic, learning_objectives)
            lesson_plan["assessments"].append(assessment)
            lesson_plan["duration"] += assessment["duration"]
            
            # Add materials needed
            lesson_plan["materials_needed"] = self._compile_materials_list(
                lesson_plan["activities"]
            )
            
            # Add preparation steps
            lesson_plan["preparation"] = self._create_preparation_steps(
                lesson_plan["activities"], 
                lesson_plan["materials_needed"]
            )
            
            # Add accommodations and modifications
            lesson_plan["accommodations"] = self._create_accommodations(
                topic, learning_objectives
            )
            
            # Add extension activities
            lesson_plan["extensions"] = self._create_extensions(
                topic, learning_objectives
            )
            
            return lesson_plan
            
        except Exception as e:
            logger.error(f"Error creating lesson plan: {str(e)}")
            raise

    def _extract_learning_objectives(self, standards: Dict) -> List[str]:
        """Extract learning objectives from standards"""
        objectives = []
        for standard in standards.get("standards", []):
            objectives.extend(standard.get("learning_objectives", []))
        return objectives

    def _create_opening_activity(
        self,
        topic: str,
        learning_objectives: List[str]
    ) -> Dict:
        """Create an engaging opening activity for the lesson"""
        try:
            # Find topic-specific opening activities
            topic_activities = self.activity_templates.get(topic, [])
            
            # If no specific activities found, create a generic one
            if not topic_activities:
                return {
                    "name": "Topic Introduction",
                    "type": "warm_up",
                    "description": f"Interactive discussion about {topic}",
                    "duration": 10,
                    "materials": ["Discussion prompts"],
                    "instructions": [
                        "Ask students what they know about the topic",
                        "Create a mind map of student responses",
                        "Introduce key vocabulary"
                    ]
                }
            
            # Select appropriate opening activity
            opening = topic_activities[0]  # In production, would use more sophisticated selection
            
            return {
                "name": opening.name,
                "type": "warm_up",
                "description": opening.description,
                "duration": opening.duration,
                "materials": opening.materials,
                "instructions": self._generate_activity_instructions(opening)
            }
            
        except Exception as e:
            logger.error(f"Error creating opening activity: {str(e)}")
            raise

    def _create_main_activities(
        self,
        topic: str,
        learning_objectives: List[str],
        resources: List[Dict]
    ) -> List[Dict]:
        """Create the main learning activities"""
        try:
            activities = []
            
            # Create direct instruction activity
            instruction = {
                "name": f"{topic} Direct Instruction",
                "type": "instruction",
                "description": "Teacher-led instruction with examples",
                "duration": 20,
                "materials": ["Presentation slides", "Examples"],
                "instructions": [
                    "Present key concepts",
                    "Show worked examples",
                    "Guide student practice"
                ]
            }
            activities.append(instruction)
            
            # Create guided practice
            practice = {
                "name": "Guided Practice",
                "type": "practice",
                "description": "Students work on problems with teacher support",
                "duration": 15,
                "materials": ["Practice worksheets", "Manipulatives"],
                "instructions": [
                    "Distribute practice problems",
                    "Monitor student work",
                    "Provide individual help"
                ]
            }
            activities.append(practice)
            
            # Create independent work
            independent = {
                "name": "Independent Practice",
                "type": "independent_work",
                "description": "Students apply learning independently",
                "duration": 15,
                "materials": ["Workbook", "Reference sheets"],
                "instructions": [
                    "Assign independent work",
                    "Students complete problems",
                    "Review answers as class"
                ]
            }
            activities.append(independent)
            
            return activities
            
        except Exception as e:
            logger.error(f"Error creating main activities: {str(e)}")
            raise

    def _create_assessment(
        self,
        topic: str,
        learning_objectives: List[str]
    ) -> Dict:
        """Create an appropriate assessment"""
        try:
            # Get topic-specific assessment template
            topic_assessments = self.assessment_templates.get(topic, [])
            
            if topic_assessments:
                assessment = topic_assessments[0]  # In production, would select based on objectives
                
                return {
                    "name": f"{topic} Assessment",
                    "type": assessment.type,
                    "duration": 15,
                    "questions": assessment.questions,
                    "rubric": assessment.rubric,
                    "passing_score": assessment.passing_score
                }
            
            # Create generic assessment if no template exists
            return {
                "name": f"{topic} Check for Understanding",
                "type": "quick_check",
                "duration": 10,
                "questions": [
                    {
                        "type": "short_answer",
                        "prompt": f"Explain the main concepts of {topic}",
                        "points": 5
                    }
                ],
                "passing_score": 80
            }
            
        except Exception as e:
            logger.error(f"Error creating assessment: {str(e)}")
            raise

    def _compile_materials_list(self, activities: List[Dict]) -> List[str]:
        """Compile a complete list of required materials"""
        try:
            materials = set()
            for activity in activities:
                materials.update(activity.get("materials", []))
            return sorted(list(materials))
            
        except Exception as e:
            logger.error(f"Error compiling materials list: {str(e)}")
            raise

    def _create_preparation_steps(
        self,
        activities: List[Dict],
        materials: List[str]
    ) -> List[str]:
        """Create preparation steps for the lesson"""
        try:
            steps = [
                "Review lesson plan and objectives",
                f"Gather materials: {', '.join(materials)}",
                "Set up classroom space"
            ]
            
            # Add activity-specific prep steps
            for activity in activities:
                if activity.get("type") == "warm_up":
                    steps.append("Prepare opening discussion prompts")
                elif activity.get("type") == "instruction":
                    steps.append("Review presentation materials")
                elif activity.get("type") == "practice":
                    steps.append("Make copies of practice worksheets")
                    
            return steps
            
        except Exception as e:
            logger.error(f"Error creating preparation steps: {str(e)}")
            raise

    def _create_accommodations(
        self,
        topic: str,
        learning_objectives: List[str]
    ) -> List[Dict]:
        """Create accommodations for different learners"""
        try:
            return [
                {
                    "type": "visual_learners",
                    "modifications": [
                        "Provide visual aids and diagrams",
                        "Use color coding for important concepts",
                        "Create graphic organizers"
                    ]
                },
                {
                    "type": "auditory_learners",
                    "modifications": [
                        "Include verbal explanations",
                        "Use rhythm or music mnemonics",
                        "Allow think-pair-share discussions"
                    ]
                },
                {
                    "type": "kinesthetic_learners",
                    "modifications": [
                        "Include hands-on activities",
                        "Use physical manipulatives",
                        "Incorporate movement into learning"
                    ]
                }
            ]
            
        except Exception as e:
            logger.error(f"Error creating accommodations: {str(e)}")
            raise

    def _create_extensions(
        self,
        topic: str,
        learning_objectives: List[str]
    ) -> List[Dict]:
        """Create extension activities for advanced learners"""
        try:
            return [
                {
                    "name": "Challenge Problems",
                    "description": f"Advanced {topic} problems",
                    "duration": 15,
                    "materials": ["Challenge worksheet"]
                },
                {
                    "name": "Real-World Application",
                    "description": f"Apply {topic} to real situations",
                    "duration": 20,
                    "materials": ["Project guidelines"]
                },
                {
                    "name": "Peer Tutoring",
                    "description": "Help other students master concepts",
                    "duration": 15,
                    "materials": ["Review materials"]
                }
            ]
            
        except Exception as e:
            logger.error(f"Error creating extensions: {str(e)}")
            raise

    def _generate_activity_instructions(self, activity: Activity) -> List[str]:
        """Generate step-by-step instructions for an activity"""
        try:
            # Basic instruction template - would be more sophisticated in production
            instructions = [
                f"Introduce {activity.name}",
                "Demonstrate key concepts",
                "Guide student practice",
                "Check for understanding"
            ]
            
            return instructions
            
        except Exception as e:
            logger.error(f"Error generating activity instructions: {str(e)}")
            raise