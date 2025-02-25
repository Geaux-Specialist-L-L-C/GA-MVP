from typing import Dict, List, Optional, Union
from datetime import datetime, timedelta
import uuid
from dataclasses import dataclass

class D2LRenderer(LMSRenderer):
    """Renderer for D2L (Brightspace) format"""
    
    def render_unit(self, unit_plan: Dict, settings: Dict) -> Dict:
        """Convert unit plan to D2L format"""
        modules = []
        
        # Create overview module
        modules.append({
            'title': 'Unit Overview',
            'type': 'module',
            'short_description': f"Overview for {unit_plan['title']}",
            'materials': [
                {
                    'type': 'content',
                    'title': 'Introduction',
                    'content': self._generate_overview_html(unit_plan),
                    'is_visible': True
                },
                {
                    'type': 'content',
                    'title': 'Learning Objectives',
                    'content': self._generate_objectives_html(unit_plan['objectives']),
                    'is_visible': True
                }
            ]
        })
        
        # Create activities module
        activity_module = {
            'title': 'Learning Activities',
            'type': 'module',
            'short_description': 'Unit activities and exercises',
            'materials': []
        }
        
        for idx, activity in enumerate(unit_plan['activities']):
            activity_content = LMSAssignment(
                id=f"act_{idx}",
                title=activity['title'],
                type='dropbox',  # D2L's term for assignments
                description=activity['description'],
                submission_type='file,text',
                points=100
            )
            activity_module['materials'].append(
                self.render_assignment(activity_content)
            )
            
        modules.append(activity_module)
        
        # Create assessments module if included
        if settings.get('includeAssessments', True):
            assessment_module = {
                'title': 'Assessments',
                'type': 'module',
                'short_description': 'Unit assessments and evaluations',
                'materials': []
            }
            
            for idx, assessment in enumerate(unit_plan['assessments']):
                assessment_content = LMSAssignment(
                    id=f"assess_{idx}",
                    title=assessment['title'],
                    type='dropbox',
                    description=assessment['description'],
                    submission_type='file,text',
                    points=100,
                    rubric=assessment.get('rubric')
                )
                assessment_module['materials'].append(
                    self.render_assignment(assessment_content)
                )
                
            modules.append(assessment_module)
            
        return {
            'course': {
                'title': unit_plan['title'],
                'code': f"UNIT-{unit_plan['grade_level']}",
                'modules': modules,
                'settings': {
                    'is_active': True,
                    'start_date': datetime.now().isoformat(),
                    'end_date': (datetime.now() + timedelta(days=90)).isoformat()
                }
            }
        }
        
    def render_assignment(self, assignment: LMSAssignment) -> Dict:
        """Render assignment for D2L"""
        return {
            'type': 'dropbox',
            'title': assignment.title,
            'instructions': assignment.description,
            'completion_type': 'score',
            'score': {
                'maximum': assignment.points,
                'minimum': 0,
                'is_bonus': False
            },
            'availability': {
                'start_date': None,
                'end_date': None,
                'is_hidden': False
            },
            'submission': {
                'type': assignment.submission_type.split(','),
                'files_allowed': 10,
                'file_types': ['.doc', '.docx', '.pdf', '.txt']
            },
            'rubric': self._convert_rubric_to_d2l(assignment.rubric) if assignment.rubric else None
        }
        
    def render_resource(self, resource: LMSResource) -> Dict:
        """Render resource for D2L"""
        return {
            'type': 'content',
            'title': resource.title,
            'description': resource.description,
            'content_type': resource.file_type,
            'url': resource.url,
            'is_visible': True
        }
        
    def render_quiz(self, quiz: LMSQuiz) -> Dict:
        """Render quiz for D2L"""
        return {
            'type': 'quiz',
            'title': quiz.title,
            'description': quiz.description,
            'instructions': '',
            'attempt_settings': {
                'time_limit': quiz.time_limit,
                'attempts_allowed': quiz.attempts_allowed
            },
            'assessment': {
                'category_id': None,
                'grade_item': {
                    'max_points': quiz.points
                }
            },
            'questions': self._convert_questions_to_d2l(quiz.questions)
        }
        
    def _convert_rubric_to_d2l(self, rubric: Dict) -> Dict:
        """Convert rubric to D2L format"""
        return {
            'name': 'Assignment Rubric',
            'criteria': [
                {
                    'name': criterion,
                    'description': '',
                    'levels': [
                        {
                            'name': f'Level {idx + 1}',
                            'points': idx + 1,
                            'description': level
                        }
                        for idx, level in enumerate(levels)
                    ]
                }
                for criterion, levels in rubric.items()
            ]
        }
        
    def _convert_questions_to_d2l(self, questions: List[Dict]) -> List[Dict]:
        """Convert questions to D2L format"""
        type_mapping = {
            'multiple_choice': 'multi-select',
            'true_false': 'true-false',
            'short_answer': 'short-answer',
            'essay': 'long-answer'
        }
        
        return [
            {
                'type': type_mapping.get(question.get('type'), 'multi-select'),
                'text': question['text'],
                'points': question.get('points', 1),
                'options': [
                    {
                        'text': ans['text'],
                        'is_correct': ans['correct'],
                        'feedback': ans.get('feedback', '')
                    }
                    for ans in question['answers']
                ]
            }
            for question in questions
        ]

class ExtendedCanvasRenderer(LMSRenderer):
    """Enhanced renderer for Canvas LMS with additional features"""
    
    def render_unit(self, unit_plan: Dict, settings: Dict) -> Dict:
        """Convert unit plan to Canvas format with enhanced features"""
        modules = []
        
        # Overview module
        modules.append({
            'name': 'Unit Overview',
            'position': 1,
            'items': [
                {
                    'type': 'Page',
                    'title': 'Introduction',
                    'content': self._generate_overview_html(unit_plan),
                    'published': True
                },
                {
                    'type': 'Page',
                    'title': 'Learning Objectives',
                    'content': self._generate_objectives_html(unit_plan['objectives']),
                    'published': True
                }
            ]
        })
        
        # Activities module
        activity_module = {
            'name': 'Learning Activities',
            'position': 2,
            'items': []
        }
        
        for idx, activity in enumerate(unit_plan['activities']):
            activity_content = LMSAssignment(
                id=f"act_{idx}",
                title=activity['title'],
                type='Assignment',
                description=activity['description'],
                submission_type='online_upload,online_text_entry',
                points=100,
                grade_category='Activities'
            )
            activity_module['items'].append(
                self.render_assignment(activity_content)
            )
            
        modules.append(activity_module)
        
        # Assessments module
        if settings.get('includeAssessments', True):
            assessment_module = {
                'name': 'Assessments',
                'position': 3,
                'items': []
            }
            
            for idx, assessment in enumerate(unit_plan['assessments']):
                assessment_content = LMSAssignment(
                    id=f"assess_{idx}",
                    title=assessment['title'],
                    type='Assignment',
                    description=assessment['description'],
                    submission_type='online_upload',
                    points=100,
                    grade_category='Assessments',
                    rubric=assessment.get('rubric')
                )
                assessment_module['items'].append(
                    self.render_assignment(assessment_content)
                )
                
            modules.append(assessment_module)
            
        # Add differentiation content if enabled
        if settings.get('includeDifferentiation', True):
            differentiation_module = self._create_differentiation_module(unit_plan)
            modules.append(differentiation_module)
            
        return {
            'course': {
                'name': unit_plan['title'],
                'course_code': f"UNIT-{unit_plan['grade_level']}",
                'modules': modules,
                'settings': {
                    'allow_student_discussion_topics': True,
                    'allow_student_organized_groups': True,
                    'hide_distribution_graphs': False
                }
            }
        }
        
    def render_assignment(self, assignment: LMSAssignment) -> Dict:
        """Render assignment for Canvas with enhanced features"""
        return {
            'type': 'Assignment',
            'title': assignment.title,
            'description': assignment.description,
            'points_possible': assignment.points,
            'grading_type': 'points',
            'submission_types': assignment.submission_type.split(','),
            'grade_group_category_id': None,
            'peer_reviews': {
                'enabled': False,
                'count': 0
            },
            'grading': {
                'grading_type': 'rubric' if assignment.rubric else 'points',
                'rubric': self._convert_rubric_to_canvas(assignment.rubric) if assignment.rubric else None
            },
            'allowed_extensions': ['doc', 'docx', 'pdf', 'txt'],
            'turnitin_enabled': True,
            'group_category_id': None
        }
        
    def render_resource(self, resource: LMSResource) -> Dict:
        """Render resource for Canvas with enhanced features"""
        return {
            'type': 'File' if resource.url else 'Page',
            'title': resource.title,
            'content': resource.description,
            'published': True,
            'file_data': {
                'url': resource.url,
                'content_type': resource.file_type
            } if resource.url else None
        }
        
    def render_quiz(self, quiz: LMSQuiz) -> Dict:
        """Render quiz for Canvas with enhanced features"""
        return {
            'type': 'Quizzes::Quiz',
            'title': quiz.title,
            'description': quiz.description,
            'quiz_type': 'assignment',
            'points_possible': quiz.points,
            'time_limit': quiz.time_limit,
            'allowed_attempts': quiz.attempts_allowed,
            'scoring_policy': 'keep_highest',
            'shuffle_answers': True,
            'hide_results': 'until_after_last_attempt',
            'show_correct_answers': True,
            'show_correct_answers_last_attempt': True,
            'questions': self._convert_questions_to_canvas(quiz.questions)
        }
        
    def _create_differentiation_module(self, unit_plan: Dict) -> Dict:
        """Create differentiation module with support materials"""
        return {
            'name': 'Additional Resources',
            'position': 4,
            'items': [
                {
                    'type': 'Page',
                    'title': 'Support Materials',
                    'content': self._generate_support_materials_html(unit_plan),
                    'published': True
                },
                {
                    'type': 'Page',
                    'title': 'Extension Activities',
                    'content': self._generate_extension_activities_html(unit_plan),
                    'published': True
                }
            ]
        }
        
    def _generate_support_materials_html(self, unit_plan: Dict) -> str:
        """Generate HTML content for support materials"""
        materials = unit_plan.get('differentiation_strategies', {}).get('support', [])
        return f"""
        <div class="support-materials">
            <h2>Support Materials</h2>
            <div class="materials-list">
                {''.join(f'''
                    <div class="material-item">
                        <h3>{material['title']}</h3>
                        <p>{material['description']}</p>
                        <ul>
                            {''.join(f'<li>{resource}</li>' for resource in material['resources'])}
                        </ul>
                    </div>
                ''' for material in materials)}
            </div>
        </div>
        """
        
    def _generate_extension_activities_html(self, unit_plan: Dict) -> str:
        """Generate HTML content for extension activities"""
        activities = unit_plan.get('differentiation_strategies', {}).get('extension', [])
        return f"""
        <div class="extension-activities">
            <h2>Extension Activities</h2>
            <div class="activities-list">
                {''.join(f'''
                    <div class="activity-item">
                        <h3>{activity['title']}</h3>
                        <p>{activity['description']}</p>
                        <div class="activity-details">
                            <p><strong>Duration:</strong> {activity.get('duration', 'N/A')}</p>
                            <p><strong>Skills:</strong> {', '.join(activity.get('skills', []))}</p>
                        </div>
                    </div>
                ''' for activity in activities)}
            </div>
        </div>
        """