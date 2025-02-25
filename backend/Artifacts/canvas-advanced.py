from typing import Dict, List, Optional, Union
from dataclasses import dataclass
import json
import requests
from datetime import datetime
import base64
from pathlib import Path

@dataclass
class SpeedGraderConfig:
    rubric_id: str
    anonymous_grading: bool
    moderated_grading: bool
    graders: List[str]
    grade_group_students_individually: bool
    hide_student_names: bool
    grading_type: str = 'points'  # points, percent, letter_grade, etc.

@dataclass
class MasteryPath:
    assignment_id: str
    conditional_release_rules: List[Dict]
    scoring_ranges: List[Dict]
    required_mastery_level: float
    next_assignments: List[str]

class CanvasAdvancedIntegration:
    """Advanced Canvas LMS integration features"""
    
    def __init__(
        self,
        api_url: str,
        api_token: str,
        course_id: str
    ):
        self.api_url = api_url
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
        self.course_id = course_id
        
    def configure_speedgrader(
        self,
        assignment_id: str,
        config: SpeedGraderConfig
    ) -> Dict:
        """Configure SpeedGrader settings for an assignment"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/assignments/{assignment_id}"
        
        payload = {
            "assignment": {
                "anonymous_grading": config.anonymous_grading,
                "moderated_grading": config.moderated_grading,
                "grader_count": len(config.graders),
                "grader_names": config.graders,
                "grade_group_students_individually": config.grade_group_students_individually,
                "hide_student_names": config.hide_student_names,
                "grading_type": config.grading_type,
                "rubric_settings": {
                    "rubric_id": config.rubric_id,
                    "points_possible": self._get_rubric_points(config.rubric_id)
                }
            }
        }
        
        response = requests.put(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def create_mastery_path(
        self,
        path: MasteryPath
    ) -> Dict:
        """Create a mastery path with conditional assignments"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/assignments/{path.assignment_id}/mastery_paths"
        
        payload = {
            "mastery_path": {
                "conditional_release_rules": path.conditional_release_rules,
                "scoring_ranges": [
                    {
                        "lower_bound": range_data["lower"],
                        "upper_bound": range_data["upper"],
                        "assignment_sets": [
                            {
                                "assignment_set_associations": [
                                    {"assignment_id": assign_id}
                                    for assign_id in range_data["assignments"]
                                ]
                            }
                        ]
                    }
                    for range_data in path.scoring_ranges
                ],
                "required_mastery_level": path.required_mastery_level
            }
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def sync_outcomes(
        self,
        competencies: Dict[str, Dict]
    ) -> Dict[str, str]:
        """Sync competencies as Canvas outcomes"""
        outcome_map = {}
        
        for comp_id, comp_data in competencies.items():
            outcome = self._create_or_update_outcome(comp_data)
            outcome_map[comp_id] = outcome['id']
            
        return outcome_map
        
    def setup_outcome_proficiency(
        self,
        ratings: List[Dict[str, Union[str, float]]]
    ) -> Dict:
        """Set up outcome proficiency scales"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/outcome_proficiency"
        
        payload = {
            "ratings": [
                {
                    "description": rating["description"],
                    "points": rating["points"],
                    "mastery": rating.get("mastery", False),
                    "color": rating.get("color", "")
                }
                for rating in ratings
            ]
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def configure_outcome_calculation(
        self,
        method: str = 'highest',
        count: int = 5
    ) -> Dict:
        """Configure outcome calculation method"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/outcome_calculation_method"
        
        payload = {
            "calculation_method": method,
            "calculation_int": count,
            "workflow_state": "active"
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def create_module_sequence(
        self,
        modules: List[Dict],
        requirements: Dict
    ) -> List[Dict]:
        """Create module sequence with prerequisites"""
        created_modules = []
        
        for module in modules:
            # Create module
            module_data = self._create_module(module)
            
            # Add module items
            items = self._add_module_items(module_data['id'], module['items'])
            module_data['items'] = items
            
            # Set requirements if any
            if module['id'] in requirements:
                self._set_module_requirements(
                    module_data['id'],
                    requirements[module['id']]
                )
                
            created_modules.append(module_data)
            
        return created_modules
        
    def setup_differentiation(
        self,
        assignment_id: str,
        differentiation_config: Dict
    ) -> Dict:
        """Configure differentiated content and assignments"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/assignments/{assignment_id}/overrides"
        
        # Create assignment overrides for different groups
        overrides = []
        for group_id, config in differentiation_config['groups'].items():
            override = {
                "assignment_override": {
                    "assignment_id": assignment_id,
                    "group_id": group_id,
                    "title": config['title'],
                    "due_at": config.get('due_at'),
                    "unlock_at": config.get('unlock_at'),
                    "lock_at": config.get('lock_at')
                }
            }
            
            response = requests.post(endpoint, headers=self.headers, json=override)
            overrides.append(response.json())
            
        return {
            "assignment_id": assignment_id,
            "overrides": overrides
        }
        
    def configure_peer_reviews(
        self,
        assignment_id: str,
        peer_review_config: Dict
    ) -> Dict:
        """Set up peer review settings"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/assignments/{assignment_id}"
        
        payload = {
            "assignment": {
                "peer_reviews": True,
                "automatic_peer_reviews": peer_review_config.get('automatic', True),
                "peer_review_count": peer_review_config.get('count', 1),
                "anonymous_peer_reviews": peer_review_config.get('anonymous', True),
                "intra_group_peer_reviews": peer_review_config.get('intra_group', False)
            }
        }
        
        response = requests.put(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def _create_or_update_outcome(self, comp_data: Dict) -> Dict:
        """Create or update Canvas outcome from competency"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/outcomes"
        
        payload = {
            "title": comp_data['name'],
            "description": comp_data['description'],
            "mastery_points": 3,  # Default mastery level
            "ratings": [
                {
                    "description": "Exceeds Mastery",
                    "points": 4
                },
                {
                    "description": "Mastery",
                    "points": 3
                },
                {
                    "description": "Near Mastery",
                    "points": 2
                },
                {
                    "description": "Below Mastery",
                    "points": 1
                }
            ],
            "calculation_method": "highest",
            "calculation_int": 5
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def _create_module(self, module: Dict) -> Dict:
        """Create a Canvas module"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/modules"
        
        payload = {
            "module": {
                "name": module['name'],
                "position": module.get('position', 1),
                "prerequisite_module_ids": module.get('prerequisites', [])
            }
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def _add_module_items(
        self,
        module_id: str,
        items: List[Dict]
    ) -> List[Dict]:
        """Add items to a module"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/modules/{module_id}/items"
        added_items = []
        
        for item in items:
            payload = {
                "module_item": {
                    "title": item['title'],
                    "type": item['type'],
                    "content_id": item.get('content_id'),
                    "position": item.get('position', 1),
                    "indent": item.get('indent', 0),
                    "completion_requirement": {
                        "type": item.get('requirement_type', 'must_view')
                    }
                }
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload)
            added_items.append(response.json())
            
        return added_items
        
    def _set_module_requirements(
        self,
        module_id: str,
        requirements: Dict
    ) -> Dict:
        """Set module completion requirements"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/modules/{module_id}"
        
        payload = {
            "module": {
                "requirement_count": requirements.get('count', 1),
                "require_sequential_progress": requirements.get('sequential', True),
                "publish_final_grade": requirements.get('publish_final', False),
                "prerequisites": requirements.get('prerequisites', [])
            }
        }
        
        response = requests.put(endpoint, headers=self.headers, json=payload)
        return response.json()
        
    def _get_rubric_points(self, rubric_id: str) -> float:
        """Get total points possible for a rubric"""
        endpoint = f"{self.api_url}/courses/{self.course_id}/rubrics/{rubric_id}"
        
        response = requests.get(endpoint, headers=self.headers)
        rubric_data = response.json()
        
        return sum(
            criterion['points']
            for criterion in rubric_data.get('criteria', [])
        )

# Example usage
if __name__ == "__main__":
    # Initialize Canvas integration
    canvas = CanvasAdvancedIntegration(
        api_url="https://canvas.example.com/api/v1",
        api_token="your_token_here",
        course_id="12345"
    )
    
    # Configure SpeedGrader
    speed_grader_config = SpeedGraderConfig(
        rubric_id="789",
        anonymous_grading=True,
        moderated_grading=True,
        graders=["grader1", "grader2"],
        grade_group_students_individually=False,
        hide_student_names=True
    )
    
    canvas.configure_speedgrader("assignment_123", speed_grader_config)
    
    # Create mastery path
    mastery_path = MasteryPath(
        assignment_id="assignment_123",
        conditional_release_rules=[
            {
                "trigger_assignment_id": "assignment_123",
                "scoring_range": "80-100",
                "assignment_set_id": "set_1"
            }
        ],
        scoring_ranges=[
            {
                "lower": 80,
                "upper": 100,
                "assignments": ["assign_1", "assign_2"]
            }
        ],
        required_mastery_level=0.8,
        next_assignments=["assign_1", "assign_2"]
    )
    
    canvas.create_mastery_path(mastery_path)
    
    # Set up outcome proficiency
    proficiency_ratings = [
        {
            "description": "Exceeds Mastery",
            "points": 4,
            "mastery": True,
            "color": "#00FF00"
        },
        {
            "description": "Meets Mastery",
            "points": 3,
            "mastery": True,
            "color": "#0000FF"
        }
    ]
    
    canvas.setup_outcome_proficiency(proficiency_ratings)
    
    # Configure modules with requirements
    modules = [
        {
            "name": "Module 1",
            "items": [
                {
                    "title": "Introduction",
                    "type": "Page",
                    "requirement_type": "must_view"
                }
            ]
        }
    ]
    
    requirements = {
        "module_1": {
            "count": 1,
            "sequential": True
        }
    }
    
    canvas.create_module_sequence(modules, requirements)
