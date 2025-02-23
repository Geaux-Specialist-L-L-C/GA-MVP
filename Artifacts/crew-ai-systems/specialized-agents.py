from crewai import Agent, Task, Crew
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import logging
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StudyGroupAgent(Agent):
    """Agent responsible for forming and managing study groups"""
    
    def __init__(self):
        super().__init__(
            name="Study Group Coordinator",
            role="Collaborative Learning Specialist",
            goal="Create and manage effective study groups",
            backstory="Expert in peer learning and group dynamics"
        )
        self.active_groups = {}
        
    def form_study_group(
        self,
        students: List[Dict],
        topic: str,
        skill_level: str,
        group_size: int = 4
    ) -> Dict:
        """Form optimal study groups based on student profiles"""
        try:
            logger.info(f"Forming study group for {topic}")
            
            # Calculate compatibility scores
            compatibility_matrix = self._calculate_compatibility(students)
            
            # Group formation algorithm
            groups = self._create_balanced_groups(
                students,
                compatibility_matrix,
                group_size
            )
            
            # Assign roles within groups
            for group in groups:
                self._assign_group_roles(group)
            
            return {
                "topic": topic,
                "skill_level": skill_level,
                "groups": groups,
                "formation_time": datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error forming study group: {str(e)}")
            raise

    def _calculate_compatibility(
        self,
        students: List[Dict]
    ) -> np.ndarray:
        """Calculate compatibility scores between students"""
        n_students = len(students)
        compatibility = np.zeros((n_students, n_students))
        
        for i in range(n_students):
            for j in range(i+1, n_students):
                score = self._compute_student_compatibility(
                    students[i],
                    students[j]
                )
                compatibility[i][j] = score
                compatibility[j][i] = score
                
        return compatibility
        
    def _compute_student_compatibility(
        self,
        student1: Dict,
        student2: Dict
    ) -> float:
        """Compute compatibility score between two students"""
        factors = {
            'learning_style_match': 0.3,
            'skill_level_complement': 0.3,
            'schedule_compatibility': 0.2,
            'interest_overlap': 0.2
        }
        
        scores = {
            'learning_style_match': self._compare_learning_styles(
                student1.get('learning_style'),
                student2.get('learning_style')
            ),
            'skill_level_complement': self._compare_skill_levels(
                student1.get('skill_level'),
                student2.get('skill_level')
            ),
            'schedule_compatibility': self._compare_schedules(
                student1.get('schedule'),
                student2.get('schedule')
            ),
            'interest_overlap': self._compare_interests(
                student1.get('interests'),
                student2.get('interests')
            )
        }
        
        return sum(score * factors[factor] for factor, score in scores.items())

class PeerLearningAgent(Agent):
    """Agent responsible for facilitating peer learning interactions"""
    
    def __init__(self):
        super().__init__(
            name="Peer Learning Facilitator",
            role="Peer Learning Expert",
            goal="Facilitate effective peer learning interactions",
            backstory="Specialist in collaborative education"
        )
        
    def generate_discussion_prompts(
        self,
        topic: str,
        skill_levels: List[str],
        learning_objectives: List[str]
    ) -> List[Dict]:
        """Generate targeted discussion prompts"""
        try:
            prompts = []
            
            # Create opening prompts
            prompts.extend(self._create_opening_prompts(topic))
            
            # Add concept exploration prompts
            prompts.extend(
                self._create_concept_prompts(
                    topic,
                    learning_objectives
                )
            )
            
            # Add application prompts
            prompts.extend(self._create_application_prompts(topic))
            
            # Add reflection prompts
            prompts.extend(self._create_reflection_prompts())
            
            return prompts
            
        except Exception as e:
            logger.error(f"Error generating discussion prompts: {str(e)}")
            raise
            
    def monitor_group_interaction(
        self,
        group_id: str,
        interaction_data: Dict
    ) -> Dict:
        """Monitor and analyze group interactions"""
        try:
            analysis = {
                'participation_balance': self._analyze_participation(
                    interaction_data
                ),
                'discussion_quality': self._assess_discussion_quality(
                    interaction_data
                ),
                'learning_progress': self._evaluate_learning_progress(
                    interaction_data
                ),
                'collaboration_effectiveness': self._measure_collaboration(
                    interaction_data
                )
            }
            
            recommendations = self._generate_recommendations(analysis)
            
            return {
                'analysis': analysis,
                'recommendations': recommendations,
                'timestamp': datetime.now()
            }
            
        except Exception as e:
            logger.error(f"Error monitoring group interaction: {str(e)}")
            raise

class SchedulingAgent(Agent):
    """Agent responsible for intelligent schedule management"""
    
    def __init__(self):
        super().__init__(
            name="Schedule Optimizer",
            role="Educational Schedule Manager",
            goal="Create and optimize learning schedules",
            backstory="Expert in educational time management"
        )
        
    def create_learning_schedule(
        self,
        student_preferences: Dict,
        learning_goals: List[Dict],
        constraints: Dict
    ) -> Dict:
        """Create optimized learning schedule"""
        try:
            # Generate initial schedule
            base_schedule = self._generate_base_schedule(
                student_preferences,
                learning_goals
            )
            
            # Apply constraints
            constrained_schedule = self._apply_constraints(
                base_schedule,
                constraints
            )
            
            # Optimize schedule
            optimized_schedule = self._optimize_schedule(
                constrained_schedule,
                student_preferences
            )
            
            # Add flexibility options
            final_schedule = self._add_flexibility(optimized_schedule)
            
            return final_schedule
            
        except Exception as e:
            logger.error(f"Error creating learning schedule: {str(e)}")
            raise
            
    def adjust_schedule(
        self,
        current_schedule: Dict,
        new_events: List[Dict],
        priorities: Dict
    ) -> Dict:
        """Adjust existing schedule for new events"""
        try:
            # Identify conflicts
            conflicts = self._find_conflicts(current_schedule, new_events)
            
            # Resolve conflicts
            resolved_schedule = self._resolve_conflicts(
                current_schedule,
                conflicts,
                priorities
            )
            
            # Reoptimize schedule
            adjusted_schedule = self._reoptimize_schedule(resolved_schedule)
            
            return adjusted_schedule
            
        except Exception as e:
            logger.error(f"Error adjusting schedule: {str(e)}")
            raise

class ResourceCoordinatorAgent(Agent):
    """Agent responsible for coordinating learning resources"""
    
    def __init__(self):
        super().__init__(
            name="Resource Coordinator",
            role="Learning Resource Manager",
            goal="Coordinate and optimize resource allocation",
            backstory="Expert in educational resource management"
        )
        
    def allocate_resources(
        self,
        group_needs: Dict,
        available_resources: Dict,
        time_slots: List[Dict]
    ) -> Dict:
        """Allocate resources to learning groups"""
        try:
            # Analyze resource requirements
            requirements = self._analyze_requirements(group_needs)
            
            # Check resource availability
            availability = self._check_availability(
                available_resources,
                time_slots
            )
            
            # Create allocation plan
            allocation_plan = self._create_allocation_plan(
                requirements,
                availability
            )
            
            # Optimize resource usage
            optimized_allocation = self._optimize_allocation(allocation_plan)
            
            return optimized_allocation
            
        except Exception as e:
            logger.error(f"Error allocating resources: {str(e)}")
            raise

class CollaborativeLearningCrew:
    """Main class for orchestrating collaborative learning"""
    
    def __init__(self):
        """Initialize collaborative learning crew"""
        self.study_group_agent = StudyGroupAgent()
        self.peer_learning_agent = PeerLearningAgent()
        self.scheduling_agent = SchedulingAgent()
        self.resource_agent = ResourceCoordinatorAgent()
        
        self.crew = Crew(
            agents=[
                self.study_group_agent,
                self.peer_learning_agent,
                self.scheduling_agent,
                self.resource_agent
            ],
            tasks=self._define_tasks()
        )
        
    def _define_tasks(self) -> List[Task]:
        """Define the sequence of tasks for the crew"""
        tasks = [
            Task(
                description="Form and organize study groups",
                agent=self.study_group_agent
            ),
            Task(
                description="Facilitate peer learning interactions",
                agent=self.peer_learning_agent
            ),
            Task(
                description="Optimize learning schedules",
                agent=self.scheduling_agent
            ),
            Task(
                description="Coordinate resource allocation",
                agent=self.resource_agent
            )
        ]
        return tasks
        
    def orchestrate_learning_session(
        self,
        students: List[Dict],
        topic: str,
        duration: int
    ) -> Dict:
        """Orchestrate a complete collaborative learning session"""
        try:
            # Form study groups
            groups = self.study_group_agent.form_study_group(
                students,
                topic,
                "intermediate"
            )
            
            # Generate discussion prompts
            prompts = self.peer_learning_agent.generate_discussion_prompts(
                topic,
                ["beginner", "intermediate", "advanced"],
                ["understand_concepts", "apply_knowledge", "analyze_problems"]
            )
            
            # Create schedule
            schedule = self.scheduling_agent.create_learning_schedule(
                {"preferred_time": "evening", "session_length": 60},
                [{"topic": topic, "priority": "high"}],
                {"availability": ["weekday_evenings"]}
            )
            
            # Allocate resources
            resources = self.resource_agent.allocate_resources(
                {"group_size": len(students), "topic": topic},
                {"rooms": ["room1", "room2"], "materials": ["handouts", "tablets"]},
                [{"start": "18:00", "end": "19:00"}]
            )
            
            return {
                "groups": groups,
                "prompts": prompts,
                "schedule": schedule,
                "resources": resources
            }
            
        except Exception as e:
            logger.error(f"Error orchestrating learning session: {str(e)}")
            raise

# Example usage
if __name__ == "__main__":
    # Sample student data
    students = [
        {
            "id": "student1",
            "name": "Alice",
            "learning_style": "visual",
            "skill_level": "intermediate",
            "schedule": {"preferred_time": "evening"},
            "interests": ["math", "science"]
        },
        {
            "id": "student2",
            "name": "Bob",
            "learning_style": "auditory",
            "skill_level": "advanced",
            "schedule": {"preferred_time": "evening"},
            "interests": ["physics", "math"]
        }
    ]
    
    # Initialize crew
    collab_crew = CollaborativeLearningCrew()
    
    # Orchestrate learning session
    session = collab_crew.orchestrate_learning_session(
        students,
        "Advanced Algebra",
        60
    )
    
    print("Session organized:", session)