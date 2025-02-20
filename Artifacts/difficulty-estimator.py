from typing import Dict, List, Optional
import spacy
from textstat import textstat
from dataclasses import dataclass
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import MinMaxScaler

@dataclass
class ContentMetrics:
    readability_score: float
    concept_density: float
    prerequisite_count: int
    cognitive_depth: float
    total_difficulty: float

class DifficultyEstimator:
    def __init__(self):
        """Initialize the difficulty estimation system"""
        self.nlp = spacy.load("en_core_web_lg")
        self.encoder = SentenceTransformer('all-mpnet-base-v2')
        self.scaler = MinMaxScaler()
        
        # Concept complexity database (could be expanded)
        self.concept_complexity = {
            "addition": 1.0,
            "subtraction": 1.2,
            "multiplication": 1.5,
            "division": 1.8,
            "fractions": 2.0,
            "algebra": 2.5,
            "calculus": 3.0
        }
        
    def estimate_readability(self, text: str) -> float:
        """
        Estimate text readability using multiple metrics
        
        Args:
            text: Content text
            
        Returns:
            float: Normalized readability score (0-1)
        """
        metrics = [
            textstat.flesch_reading_ease(text),
            textstat.smog_index(text),
            textstat.coleman_liau_index(text),
            textstat.automated_readability_index(text)
        ]
        
        # Normalize and combine metrics
        normalized = self.scaler.fit_transform(
            np.array(metrics).reshape(-1, 1)
        )
        return float(np.mean(normalized))
        
    def estimate_concept_density(self, text: str) -> float:
        """
        Estimate the density of complex concepts
        
        Args:
            text: Content text
            
        Returns:
            float: Concept density score (0-1)
        """
        doc = self.nlp(text)
        
        # Extract key concepts
        concepts = []
        for token in doc:
            if token.pos_ in ['NOUN', 'VERB'] and not token.is_stop:
                concepts.append(token.text.lower())
                
        # Calculate complexity scores
        scores = []
        for concept in concepts:
            # Check direct matches
            if concept in self.concept_complexity:
                scores.append(self.concept_complexity[concept])
            else:
                # Find closest match using word vectors
                max_similarity = 0
                for known_concept in self.concept_complexity:
                    similarity = doc.vocab[concept].similarity(
                        doc.vocab[known_concept]
                    )
                    if similarity > max_similarity:
                        max_similarity = similarity
                        closest_concept = known_concept
                
                if max_similarity > 0.7:  # Threshold for considering similar concepts
                    scores.append(
                        self.concept_complexity[closest_concept] * max_similarity
                    )
                else:
                    scores.append(1.0)  # Default complexity
                    
        return np.mean(scores) if scores else 0.0
        
    def estimate_cognitive_depth(self, text: str) -> float:
        """
        Estimate cognitive processing depth required
        
        Args:
            text: Content text
            
        Returns:
            float: Cognitive depth score (0-1)
        """
        # Keywords indicating cognitive complexity
        cognitive_indicators = {
            'analyze': 0.7,
            'evaluate': 0.8,
            'create': 0.9,
            'synthesize': 0.9,
            'compare': 0.6,
            'explain': 0.5,
            'describe': 0.3,
            'list': 0.2,
            'identify': 0.2,
            'recall': 0.1
        }
        
        doc = self.nlp(text.lower())
        scores = []
        
        for token in doc:
            if token.text in cognitive_indicators:
                scores.append(cognitive_indicators[token.text])
                
        # Consider sentence complexity
        for sent in doc.sents:
            # Depth indicators
            if len(sent.root.children) > 3:  # Complex sentence structure
                scores.append(0.6)
            if any(token.dep_ == 'advcl' for token in sent):  # Advanced clauses
                scores.append(0.7)
                
        return np.mean(scores) if scores else 0.3  # Default to moderate complexity
        
    def analyze_content(
        self, 
        content: str,
        prerequisite_count: int = 0
    ) -> ContentMetrics:
        """
        Perform comprehensive content difficulty analysis
        
        Args:
            content: Educational content text
            prerequisite_count: Number of prerequisites
            
        Returns:
            ContentMetrics: Detailed difficulty metrics
        """
        # Calculate individual metrics
        readability = self.estimate_readability(content)
        concept_density = self.estimate_concept_density(content)
        cognitive_depth = self.estimate_cognitive_depth(content)
        
        # Normalize prerequisite count (0-1)
        norm_prerequisites = min(prerequisite_count / 5.0, 1.0)
        
        # Calculate total difficulty score
        # Weighted combination of all factors
        weights = {
            'readability': 0.3,
            'concept_density': 0.3,
            'prerequisites': 0.2,
            'cognitive_depth': 0.2
        }
        
        total_difficulty = (
            weights['readability'] * readability +
            weights['concept_density'] * concept_density +
            weights['prerequisites'] * norm_prerequisites +
            weights['cognitive_depth'] * cognitive_depth
        )
        
        return ContentMetrics(
            readability_score=readability,
            concept_density=concept_density,
            prerequisite_count=prerequisite_count,
            cognitive_depth=cognitive_depth,
            total_difficulty=total_difficulty
        )
        
    def suggest_modifications(
        self, 
        content: str,
        target_difficulty: float,
        current_metrics: ContentMetrics
    ) -> List[str]:
        """
        Suggest content modifications to achieve target difficulty
        
        Args:
            content: Current content text
            target_difficulty: Desired difficulty level (0-1)
            current_metrics: Current content metrics
            
        Returns:
            List[str]: List of suggested modifications
        """
        suggestions = []
        
        # Compare current difficulty with target
        diff = target_difficulty - current_metrics.total_difficulty
        
        if abs(diff) < 0.1:  # Within acceptable range
            return ["Content difficulty is appropriate for target level"]
            
        if diff > 0:  # Need to increase difficulty
            if current_metrics.readability_score < 0.7:
                suggestions.append(
                    "Consider using more complex sentence structures and vocabulary"
                )
            if current_metrics.concept_density < 0.7:
                suggestions.append(
                    "Introduce more advanced concepts and their relationships"
                )
            if current_metrics.cognitive_depth < 0.7:
                suggestions.append(
                    "Add more analysis and evaluation tasks"
                )
                suggestions.append(
                    "Include open-ended problem-solving activities"
                )
        else:  # Need to decrease difficulty
            if current_metrics.readability_score > 0.3:
                suggestions.append(
                    "Simplify sentence structures and use more common vocabulary"
                )
            if current_metrics.concept_density > 0.3:
                suggestions.append(
                    "Break down complex concepts into simpler components"
                )
            if current_metrics.cognitive_depth > 0.3:
                suggestions.append(
                    "Include more scaffolding and guided practice"
                )
                
        return suggestions

    def adjust_content_difficulty(
        self, 
        content: str,
        target_difficulty: float
    ) -> str:
        """
        Automatically adjust content to match target difficulty
        
        Args:
            content: Original content text
            target_difficulty: Desired difficulty level (0-1)
            
        Returns:
            str: Modified content
        """
        current_metrics = self.analyze_content(content)
        doc = self.nlp(content)
        
        # Initialize modified content
        modified_sentences = []
        
        for sent in doc.sents:
            sentence = sent.text
            
            # Adjust based on target difficulty
            if target_difficulty > current_metrics.total_difficulty:
                # Increase complexity
                sentence = self._increase_complexity(sentence)
            else:
                # Decrease complexity
                sentence = self._decrease_complexity(sentence)
                
            modified_sentences.append(sentence)
            
        return " ".join(modified_sentences)
        
    def _increase_complexity(self, sentence: str) -> str:
        """Helper method to increase sentence complexity"""
        doc = self.nlp(sentence)
        
        # Add academic vocabulary
        academic_replacements = {
            "use": "utilize",
            "make": "construct",
            "show": "demonstrate",
            "tell": "explain",
            "find": "determine"
        }
        
        words = []
        for token in doc:
            if token.text.lower() in academic_replacements:
                words.append(academic_replacements[token.text.lower()])
            else:
                words.append(token.text)
                
        return " ".join(words)
        
    def _decrease_complexity(self, sentence: str) -> str:
        """Helper method to decrease sentence complexity"""
        doc = self.nlp(sentence)
        
        # Simplify vocabulary
        simple_replacements = {
            "utilize": "use",
            "construct": "make",
            "demonstrate": "show",
            "determine": "find",
            "examine": "look at"
        }
        
        words = []
        for token in doc:
            if token.text.lower() in simple_replacements:
                words.append(simple_replacements[token.text.lower()])
            else:
                words.append(token.text)
                
        return " ".join(words)

# Example usage
if __name__ == "__main__":
    estimator = DifficultyEstimator()
    
    content = """
    Students will analyze the relationship between force and motion 
    by conducting experiments and evaluating the results using 
    mathematical models. They will synthesize their findings to 
    create explanations of real-world phenomena.
    """
    
    # Analyze current content
    metrics = estimator.analyze_content(content, prerequisite_count=2)
    print(f"Content Metrics:\n{metrics}")
    
    # Get suggestions for modification
    suggestions = estimator.suggest_modifications(
        content,
        target_difficulty=0.7,
        current_metrics=metrics
    )
    print("\nSuggested Modifications:")
    for suggestion in suggestions:
        print(f"- {suggestion}")
        
    # Adjust content difficulty
    modified = estimator.adjust_content_difficulty(content, target_difficulty=0.6)
    print(f"\nModified Content:\n{modified}")
