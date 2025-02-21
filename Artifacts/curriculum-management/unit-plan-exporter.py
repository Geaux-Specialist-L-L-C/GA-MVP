from typing import Dict, List, Optional
import json
from dataclasses import dataclass, asdict
from datetime import datetime
import yaml
from jinja2 import Template
import markdown
import pandas as pd
from pathlib import Path

@dataclass
class LearningObjective:
    description: str
    subject: str
    standards: List[str]
    bloom_level: str
    assessment_criteria: List[str]

@dataclass
class Activity:
    title: str
    description: str
    duration: str
    materials: List[str]
    grouping: str
    differentiation: Dict[str, str]
    subjects: List[str]

@dataclass
class Assessment:
    title: str
    description: str
    rubric: Dict[str, List[str]]
    standards: List[str]
    type: str

@dataclass
class UnitPlan:
    title: str
    grade_level: str
    duration: str
    subjects: List[str]
    objectives: List[LearningObjective]
    activities: List[Activity]
    assessments: List[Assessment]
    materials: List[str]
    standards: List[str]
    differentiation_strategies: Dict[str, List[str]]
    
class UnitPlanExporter:
    def __init__(self, template_dir: str = "templates"):
        """Initialize the unit plan exporter with templates"""
        self.template_dir = Path(template_dir)
        
        # Load templates
        self.templates = {
            'html': self._load_template('unit_plan.html'),
            'markdown': self._load_template('unit_plan.md'),
            'docx': self._load_template('unit_plan.docx.j2')
        }
        
    def _load_template(self, template_name: str) -> Template:
        """Load a Jinja2 template from file"""
        template_path = self.template_dir / template_name
        with open(template_path, 'r') as f:
            return Template(f.read())
            
    def export_html(self, unit: UnitPlan, output_path: str) -> str:
        """
        Export unit plan as HTML
        
        Args:
            unit: UnitPlan object
            output_path: Path to save HTML file
            
        Returns:
            str: Path to generated file
        """
        # Convert unit plan to template context
        context = self._prepare_context(unit)
        
        # Render HTML
        html = self.templates['html'].render(**context)
        
        # Add CSS styling
        styled_html = self._add_html_styling(html)
        
        # Save to file
        output_file = Path(output_path) / f"{unit.title.replace(' ', '_')}.html"
        with open(output_file, 'w') as f:
            f.write(styled_html)
            
        return str(output_file)
        
    def export_markdown(self, unit: UnitPlan, output_path: str) -> str:
        """
        Export unit plan as Markdown
        
        Args:
            unit: UnitPlan object
            output_path: Path to save Markdown file
            
        Returns:
            str: Path to generated file
        """
        context = self._prepare_context(unit)
        md_content = self.templates['markdown'].render(**context)
        
        output_file = Path(output_path) / f"{unit.title.replace(' ', '_')}.md"
        with open(output_file, 'w') as f:
            f.write(md_content)
            
        return str(output_file)
        
    def export_google_classroom(self, unit: UnitPlan, credentials_path: str) -> str:
        """
        Export unit plan to Google Classroom
        
        Args:
            unit: UnitPlan object
            credentials_path: Path to Google API credentials
            
        Returns:
            str: URL of created course materials
        """
        # Format content for Google Classroom
        course_content = self._format_for_classroom(unit)
        
        # TODO: Implement Google Classroom API integration
        raise NotImplementedError("Google Classroom export not yet implemented")
        
    def export_canvas(self, unit: UnitPlan, api_token: str, course_id: str) -> str:
        """
        Export unit plan to Canvas LMS
        
        Args:
            unit: UnitPlan object
            api_token: Canvas API token
            course_id: Target course ID
            
        Returns:
            str: URL of created module
        """
        # Format content for Canvas
        module_content = self._format_for_canvas(unit)
        
        # TODO: Implement Canvas API integration
        raise NotImplementedError("Canvas export not yet implemented")
        
    def _prepare_context(self, unit: UnitPlan) -> Dict:
        """Prepare unit plan data for template rendering"""
        context = asdict(unit)
        
        # Add metadata
        context['export_date'] = datetime.now().strftime('%Y-%m-%d')
        context['total_activities'] = len(unit.activities)
        context['total_objectives'] = len(unit.objectives)
        
        # Generate summary stats
        context['stats'] = {
            'subjects': len(unit.subjects),
            'total_duration': self._calculate_duration(unit.activities),
            'standards_coverage': len(unit.standards),
            'assessment_types': len({a.type for a in unit.assessments})
        }
        
        return context
        
    def _calculate_duration(self, activities: List[Activity]) -> str:
        """Calculate total unit duration from activities"""
        # Convert durations to minutes
        total_minutes = 0
        for activity in activities:
            duration = activity.duration.lower()
            if 'hour' in duration:
                minutes = int(duration.split()[0]) * 60
            elif 'min' in duration:
                minutes = int(duration.split()[0])
            total_minutes += minutes
            
        # Convert back to hours and minutes
        hours = total_minutes // 60
        minutes = total_minutes % 60
        return f"{hours}h {minutes}m"
        
    def _add_html_styling(self, html: str) -> str:
        """Add CSS styling to HTML export"""
        css = """
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #2c5282; border-bottom: 2px solid #2c5282; padding-bottom: 10px; }
            h2 { color: #4a5568; margin-top: 30px; }
            .objective { background: #ebf8ff; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .activity { background: #f0fff4; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .assessment { background: #fff5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metadata { color: #718096; font-size: 0.9em; }
            .materials { background: #fffaf0; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
        """
        return f"{css}\n{html}"
        
    def _format_for_classroom(self, unit: UnitPlan) -> Dict:
        """Format unit plan for Google Classroom"""
        return {
            'name': unit.title,
            'description': self._generate_description(unit),
            'materials': [
                {
                    'title': activity.title,
                    'description': activity.description,
                    'type': 'MATERIAL'
                }
                for activity in unit.activities
            ],
            'assignments': [
                {
                    'title': assessment.title,
                    'description': assessment.description,
                    'type': 'ASSIGNMENT'
                }
                for assessment in unit.assessments
            ]
        }
        
    def _format_for_canvas(self, unit: UnitPlan) -> Dict:
        """Format unit plan for Canvas LMS"""
        return {
            'module': {
                'name': unit.title,
                'items': [
                    {
                        'type': 'Page',
                        'title': 'Unit Overview',
                        'content': self._generate_overview_page(unit)
                    },
                    *[
                        {
                            'type': 'Assignment',
                            'title': assessment.title,
                            'content': assessment.description,
                            'points_possible': 100  # Default points
                        }
                        for assessment in unit.assessments
                    ]
                ]
            }
        }
        
    def _generate_overview_page(self, unit: UnitPlan) -> str:
        """Generate unit overview content for LMS"""
        overview = f"""
        # {unit.title}
        
        ## Overview
        This integrated unit covers the following subjects: {', '.join(unit.subjects)}
        
        ## Learning Objectives
        {self._format_objectives(unit.objectives)}
        
        ## Activities
        {self._format_activities(unit.activities)}
        
        ## Assessments
        {self._format_assessments(unit.assessments)}
        """
        return markdown.markdown(overview)
        
    def _format_objectives(self, objectives: List[LearningObjective]) -> str:
        """Format objectives for markdown"""
        return '\n'.join([
            f"- {obj.description} ({obj.subject})"
            for obj in objectives
        ])
        
    def _format_activities(self, activities: List[Activity]) -> str:
        """Format activities for markdown"""
        return '\n'.join([
            f"### {activity.title}\n{activity.description}\n"
            f"- Duration: {activity.duration}\n"
            f"- Materials: {', '.join(activity.materials)}"
            for activity in activities
        ])
        
    def _format_assessments(self, assessments: List[Assessment]) -> str:
        """Format assessments for markdown"""
        return '\n'.join([
            f"### {assessment.title}\n{assessment.description}\n"
            f"- Type: {assessment.type}\n"
            f"- Standards: {', '.join(assessment.standards)}"
            for assessment in assessments
        ])

# Example usage
if __name__ == "__main__":
    # Create sample unit plan
    unit = UnitPlan(
        title="Data Analysis Across Disciplines",
        grade_level="7",
        duration="3 weeks",
        subjects=["Math", "Science", "ELA"],
        objectives=[
            LearningObjective(
                description="Apply statistical methods to scientific data",
                subject="Math/Science",
                standards=["MATH.7.SP.1", "SCI.7.PS.1"],
                bloom_level="Analyze",
                assessment_criteria=["Accuracy", "Method Selection"]
            )
        ],
        activities=[
            Activity(
                title="Population Sampling Study",
                description="Students collect and analyze ecological data",
                duration="2 hours",
                materials=["Sampling tools", "Data sheets"],
                grouping="Small groups",
                differentiation={
                    "visual": "Data visualization tools",
                    "kinesthetic": "Physical sampling practice"
                },
                subjects=["Math", "Science"]
            )
        ],
        assessments=[
            Assessment(
                title="Cross-Disciplinary Data Analysis Project",
                description="Students analyze and present scientific data",
                rubric={
                    "Data Analysis": ["Basic", "Proficient", "Advanced"],
                    "Communication": ["Basic", "Proficient", "Advanced"]
                },
                standards=["MATH.7.SP.1", "SCI.7.PS.1"],
                type="Performance Task"
            )
        ],
        materials=["Calculators", "Science Equipment", "Writing Materials"],
        standards=["MATH.7.SP.1", "SCI.7.PS.1", "ELA.7.W.1"],
        differentiation_strategies={
            "visual": ["Graphs", "Charts"],
            "auditory": ["Discussions", "Presentations"],
            "kinesthetic": ["Hands-on Activities"]
        }
    )
    
    # Initialize exporter
    exporter = UnitPlanExporter()
    
    # Export in different formats
    html_path = exporter.export_html(unit, "exports")
    md_path = exporter.export_markdown(unit, "exports")
    
    print(f"Unit plan exported to:\n- HTML: {html_path}\n- Markdown: {md_path}")
