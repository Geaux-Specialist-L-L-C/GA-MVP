from typing import Dict, List, Tuple, Set
import networkx as nx
from dataclasses import dataclass
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from enum import Enum

class ConnectionType(Enum):
    PREREQUISITE = "prerequisite"
    REINFORCEMENT = "reinforcement"
    APPLICATION = "application"
    SYNTHESIS = "synthesis"

@dataclass
class CrossSubjectConnection:
    source_standard: str
    target_standard: str
    connection_type: ConnectionType
    strength: float
    description: str

class CrossSubjectMapper:
    def __init__(self):
        """Initialize the cross-subject connection mapper"""
        self.nlp = spacy.load("en_core_web_lg")
        self.encoder = SentenceTransformer('all-mpnet-base-v2')
        self.graph = nx.DiGraph()
        self.connections: Dict[str, List[CrossSubjectConnection]] = {}
        
        # Define common cross-subject themes
        self.themes = {
            "data_analysis": [
                "statistics", "graphs", "charts", "analysis",
                "interpretation", "data", "patterns"
            ],
            "systems_thinking": [
                "system", "cycle", "interaction", "feedback",
                "cause", "effect", "relationship"
            ],
            "modeling": [
                "model", "represent", "simulate", "diagram",
                "sketch", "illustration", "demonstration"
            ],
            "problem_solving": [
                "solve", "solution", "strategy", "approach",
                "method", "technique", "process"
            ]
        }
        
    def identify_connections(
        self,
        standards: Dict[str, Dict]
    ) -> List[CrossSubjectConnection]:
        """
        Identify potential cross-subject connections
        
        Args:
            standards: Dictionary of standard IDs to their details
            
        Returns:
            List[CrossSubjectConnection]: List of identified connections
        """
        connections = []
        standard_texts = {
            id: f"{std['description']} {std.get('objectives', '')}"
            for id, std in standards.items()
        }
        
        # Encode all standards
        encodings = {
            id: self.encoder.encode(text)
            for id, text in standard_texts.items()
        }
        
        # Compare all pairs of standards from different subjects
        for id1, enc1 in encodings.items():
            subject1 = standards[id1]['subject']
            
            for id2, enc2 in encodings.items():
                subject2 = standards[id2]['subject']
                
                if subject1 != subject2:
                    # Calculate similarity
                    similarity = cosine_similarity(
                        [enc1], [enc2]
                    )[0][0]
                    
                    if similarity > 0.6:  # Threshold for connection
                        connection_type = self._determine_connection_type(
                            standard_texts[id1],
                            standard_texts[id2]
                        )
                        
                        connection = CrossSubjectConnection(
                            source_standard=id1,
                            target_standard=id2,
                            connection_type=connection_type,
                            strength=float(similarity),
                            description=self._generate_connection_description(
                                standards[id1],
                                standards[id2],
                                connection_type
                            )
                        )
                        
                        connections.append(connection)
                        
        return connections
    
    def _determine_connection_type(
        self,
        source_text: str,
        target_text: str
    ) -> ConnectionType:
        """Determine the type of connection between standards"""
        source_doc = self.nlp(source_text.lower())
        target_doc = self.nlp(target_text.lower())
        
        # Check for prerequisite indicators
        prerequisite_indicators = {
            "require", "need", "must", "before", "prior"
        }
        if any(token.text in prerequisite_indicators for token in target_doc):
            return ConnectionType.PREREQUISITE
            
        # Check for application indicators
        application_indicators = {
            "apply", "use", "implement", "practice", "demonstrate"
        }
        if any(token.text in application_indicators for token in target_doc):
            return ConnectionType.APPLICATION
            
        # Check for synthesis indicators
        synthesis_indicators = {
            "combine", "integrate", "synthesize", "create", "design"
        }
        if any(token.text in synthesis_indicators for token in target_doc):
            return ConnectionType.SYNTHESIS
            
        # Default to reinforcement
        return ConnectionType.REINFORCEMENT
    
    def _generate_connection_description(
        self,
        source_standard: Dict,
        target_standard: Dict,
        connection_type: ConnectionType
    ) -> str:
        """Generate a description of the connection"""
        templates = {
            ConnectionType.PREREQUISITE: (
                f"Knowledge of {source_standard['subject']} concepts helps "
                f"prepare for {target_standard['subject']} learning"
            ),
            ConnectionType.REINFORCEMENT: (
                f"Skills practiced in {source_standard['subject']} support "
                f"similar processes in {target_standard['subject']}"
            ),
            ConnectionType.APPLICATION: (
                f"Concepts from {source_standard['subject']} can be applied "
                f"to solve problems in {target_standard['subject']}"
            ),
            ConnectionType.SYNTHESIS: (
                f"Deep understanding requires integrating knowledge "
                f"from both {source_standard['subject']} and "
                f"{target_standard['subject']}"
            )
        }
        return templates[connection_type]
    
    def suggest_integration_activities(
        self,
        connection: CrossSubjectConnection,
        standards: Dict[str, Dict]
    ) -> List[str]:
        """
        Suggest activities that integrate connected standards
        
        Args:
            connection: Cross-subject connection
            standards: Dictionary of standard details
            
        Returns:
            List[str]: Suggested integration activities
        """
        source_std = standards[connection.source_standard]
        target_std = standards[connection.target_standard]
        
        activities = []
        
        if connection.connection_type == ConnectionType.APPLICATION:
            activities.extend([
                f"Create problems in {target_std['subject']} that require "
                f"applying {source_std['subject']} concepts",
                f"Develop real-world scenarios that bridge "
                f"{source_std['subject']} and {target_std['subject']}"
            ])
            
        elif connection.connection_type == ConnectionType.SYNTHESIS:
            activities.extend([
                f"Design a project that combines methods from both "
                f"{source_std['subject']} and {target_std['subject']}",
                f"Create presentations explaining how concepts connect "
                f"across both subjects"
            ])
            
        elif connection.connection_type == ConnectionType.REINFORCEMENT:
            activities.extend([
                f"Practice skills in parallel across both subjects",
                f"Create comparison charts showing how processes are "
                f"similar in both subjects"
            ])
            
        return activities
    
    def generate_integration_unit(
        self,
        connections: List[CrossSubjectConnection],
        standards: Dict[str, Dict]
    ) -> Dict:
        """
        Generate an integrated unit plan
        
        Args:
            connections: List of cross-subject connections
            standards: Dictionary of standard details
            
        Returns:
            Dict: Integrated unit plan
        """
        unit = {
            'title': self._generate_unit_title(connections, standards),
            'duration': '2-3 weeks',
            'objectives': [],
            'activities': [],
            'assessments': []
        }
        
        # Generate objectives
        for conn in connections:
            source_std = standards[conn.source_standard]
            target_std = standards[conn.target_standard]
            
            unit['objectives'].append(
                f"Students will integrate {source_std['subject']} and "
                f"{target_std['subject']} concepts through {conn.connection_type.value}"
            )
            
            # Add suggested activities
            unit['activities'].extend(
                self.suggest_integration_activities(conn, standards)
            )
            
        # Generate assessments
        unit['assessments'] = [
            "Performance task requiring integration of multiple subjects",
            "Portfolio demonstrating connections across subjects",
            "Reflection on cross-subject applications"
        ]
        
        return unit
    
    def _generate_unit_title(
        self,
        connections: List[CrossSubjectConnection],
        standards: Dict[str, Dict]
    ) -> str:
        """Generate an appropriate title for the integrated unit"""
        subjects = set()
        themes = []
        
        for conn in connections:
            subjects.add(standards[conn.source_standard]['subject'])
            subjects.add(standards[conn.target_standard]['subject'])
            
        # Identify common themes
        all_text = " ".join([
            standards[conn.source_standard]['description'] +
            standards[conn.target_standard]['description']
            for conn in connections
        ]).lower()
        
        for theme, keywords in self.themes.items():
            if any(keyword in all_text for keyword in keywords):
                themes.append(theme.replace('_', ' ').title())
                
        if themes:
            return f"{' & '.join(subjects)}: Exploring {themes[0]}"
        else:
            return f"Integrated {' & '.join(subjects)} Unit"

# Example usage
if __name__ == "__main__":
    mapper = CrossSubjectMapper()
    
    # Example standards
    standards = {
        "MATH.7.SP.1": {
            "subject": "MATH",
            "description": "Use random sampling to draw inferences about a population"
        },
        "SCI.7.PS.1": {
            "subject": "SCIENCE",
            "description": "Analyze and interpret data on properties of substances"
        }
    }
    
    # Find connections
    connections = mapper.identify_connections(standards)
    
    # Generate integrated unit
    unit = mapper.generate_integration_unit(connections, standards)
    
    print("Integrated Unit Plan:")
    print(f"Title: {unit['title']}")
    print("\nObjectives:")
    for obj in unit['objectives']:
        print(f"- {obj}")
