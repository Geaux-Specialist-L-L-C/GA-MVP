from typing import Dict, List, Set, Tuple, Optional
import networkx as nx
from dataclasses import dataclass
import spacy
from sentence_transformers import SentenceTransformer
import numpy as np
from enum import Enum

class DOKLevel(Enum):
    RECALL = 1
    SKILL_CONCEPT = 2
    STRATEGIC_THINKING = 3
    EXTENDED_THINKING = 4

@dataclass
class LearningStandard:
    id: str
    description: str
    grade_level: int
    subject: str
    dok_level: DOKLevel
    prerequisites: List[str]

@dataclass
class LearningActivity:
    id: str
    standard_id: str
    description: str
    activity_type: str
    difficulty: float
    engagement_score: float
    accessibility_score: float

class CurriculumKnowledgeGraph:
    def __init__(self):
        """Initialize the knowledge graph with NLP models and validation tools"""
        self.graph = nx.DiGraph()
        self.nlp = spacy.load("en_core_web_lg")
        self.encoder = SentenceTransformer('all-mpnet-base-v2')
        self.standards: Dict[str, LearningStandard] = {}
        self.activities: Dict[str, List[LearningActivity]] = {}
        
    def add_standard(self, standard: LearningStandard) -> bool:
        """
        Add a learning standard to the knowledge graph with validation
        
        Args:
            standard: LearningStandard object containing standard information
            
        Returns:
            bool: True if standard was successfully added
        """
        try:
            # Validate prerequisites exist
            for prereq in standard.prerequisites:
                if prereq not in self.standards:
                    raise ValueError(f"Prerequisite standard {prereq} not found")
            
            # Add node to graph
            self.graph.add_node(
                standard.id,
                grade=standard.grade_level,
                subject=standard.subject,
                dok=standard.dok_level
            )
            
            # Add prerequisite edges
            for prereq in standard.prerequisites:
                self.graph.add_edge(prereq, standard.id)
            
            self.standards[standard.id] = standard
            return True
            
        except Exception as e:
            print(f"Error adding standard: {e}")
            return False
    
    def validate_progression(self, standard_ids: List[str]) -> Tuple[bool, List[str]]:
        """
        Validate a learning progression sequence
        
        Args:
            standard_ids: List of standard IDs in proposed sequence
            
        Returns:
            Tuple[bool, List[str]]: (valid, list of issues)
        """
        issues = []
        
        # Check if all standards exist
        if not all(sid in self.standards for sid in standard_ids):
            missing = [sid for sid in standard_ids if sid not in self.standards]
            issues.append(f"Standards not found: {missing}")
            return False, issues
            
        # Check grade level progression
        prev_grade = None
        for sid in standard_ids:
            curr_grade = self.standards[sid].grade_level
            if prev_grade and curr_grade < prev_grade:
                issues.append(f"Invalid grade progression: {prev_grade} -> {curr_grade}")
            prev_grade = curr_grade
            
        # Validate DOK levels follow reasonable progression
        prev_dok = None
        for sid in standard_ids:
            curr_dok = self.standards[sid].dok_level
            if prev_dok and curr_dok.value < prev_dok.value - 1:
                issues.append(f"Sharp DOK level drop: {prev_dok} -> {curr_dok}")
            prev_dok = curr_dok
            
        # Check prerequisite satisfaction
        for i, sid in enumerate(standard_ids):
            prereqs = set(self.standards[sid].prerequisites)
            covered = set(standard_ids[:i])
            missing_prereqs = prereqs - covered
            if missing_prereqs:
                issues.append(f"Missing prerequisites for {sid}: {missing_prereqs}")
                
        return len(issues) == 0, issues
    
    def find_learning_path(
        self, 
        start_standard: str, 
        target_standard: str,
        max_path_length: int = 5
    ) -> Optional[List[str]]:
        """
        Find optimal learning path between standards
        
        Args:
            start_standard: Starting standard ID
            target_standard: Target standard ID
            max_path_length: Maximum allowed path length
            
        Returns:
            Optional[List[str]]: List of standard IDs or None if no path found
        """
        try:
            # Validate standards exist
            if not (start_standard in self.standards and target_standard in self.standards):
                return None
                
            # Find shortest path
            path = nx.shortest_path(
                self.graph,
                source=start_standard,
                target=target_standard
            )
            
            if len(path) > max_path_length:
                return None
                
            return path
            
        except nx.NetworkXNoPath:
            return None
    
    def suggest_activities(
        self,
        standard_id: str,
        learning_style: str,
        difficulty_range: Tuple[float, float] = (0.0, 1.0)
    ) -> List[LearningActivity]:
        """
        Suggest learning activities for a standard
        
        Args:
            standard_id: Standard ID
            learning_style: Preferred learning style
            difficulty_range: Acceptable difficulty range
            
        Returns:
            List[LearningActivity]: Suggested activities
        """
        if standard_id not in self.activities:
            return []
            
        activities = self.activities[standard_id]
        
        # Filter by difficulty
        activities = [
            a for a in activities 
            if difficulty_range[0] <= a.difficulty <= difficulty_range[1]
        ]
        
        # Score activities based on learning style preference
        def score_activity(activity: LearningActivity) -> float:
            style_match = 1.0 if activity.activity_type == learning_style else 0.5
            return (
                0.4 * style_match +
                0.3 * activity.engagement_score +
                0.3 * activity.accessibility_score
            )
            
        # Sort by score
        activities.sort(key=score_activity, reverse=True)
        
        return activities
    
    def find_gaps(self, standard_ids: List[str]) -> List[str]:
        """
        Identify potential gaps in standard coverage
        
        Args:
            standard_ids: List of standard IDs to analyze
            
        Returns:
            List[str]: List of potentially missing standard IDs
        """
        gaps = []
        standards_set = set(standard_ids)
        
        # Check prerequisites
        for sid in standard_ids:
            prereqs = set(self.standards[sid].prerequisites)
            missing = prereqs - standards_set
            gaps.extend(missing)
            
        # Check grade-level coverage
        grade_levels = {self.standards[sid].grade_level for sid in standard_ids}
        for grade in range(min(grade_levels), max(grade_levels) + 1):
            grade_standards = {
                sid for sid in self.standards 
                if self.standards[sid].grade_level == grade
            }
            essential_standards = {
                sid for sid in grade_standards
                if len(self.graph.in_edges(sid)) > 2  # Standards with multiple prerequisites
            }
            missing = essential_standards - standards_set
            gaps.extend(missing)
            
        return list(set(gaps))  # Remove duplicates

    def export_graph(self, format: str = 'graphml') -> str:
        """
        Export knowledge graph in specified format
        
        Args:
            format: Export format ('graphml' or 'json')
            
        Returns:
            str: Serialized graph
        """
        if format == 'graphml':
            return nx.generate_graphml(self.graph)
        elif format == 'json':
            return nx.node_link_data(self.graph)
        else:
            raise ValueError(f"Unsupported export format: {format}")

# Example usage
if __name__ == "__main__":
    # Initialize knowledge graph
    kg = CurriculumKnowledgeGraph()
    
    # Add some standards
    standard1 = LearningStandard(
        id="MATH.K.CC.1",
        description="Count to 100 by ones and by tens",
        grade_level=0,
        subject="MATH",
        dok_level=DOKLevel.SKILL_CONCEPT,
        prerequisites=[]
    )
    
    standard2 = LearningStandard(
        id="MATH.1.OA.1",
        description="Use addition and subtraction within 20",
        grade_level=1,
        subject="MATH",
        dok_level=DOKLevel.STRATEGIC_THINKING,
        prerequisites=["MATH.K.CC.1"]
    )
    
    kg.add_standard(standard1)
    kg.add_standard(standard2)
    
    # Validate progression
    valid, issues = kg.validate_progression(["MATH.K.CC.1", "MATH.1.OA.1"])
    print(f"Progression valid: {valid}")
    if not valid:
        print(f"Issues found: {issues}")
