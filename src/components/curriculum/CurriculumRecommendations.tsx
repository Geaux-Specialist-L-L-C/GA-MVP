// File: /src/components/curriculum/CurriculumRecommendations.tsx
// Description: Component for generating and displaying AI-based curriculum recommendations.
// Author: GitHub Copilot
// Created: 2023-10-10

import React, { useState } from 'react';
import { generateCurriculum } from '../../services/curriculumService';
import styled from 'styled-components';

interface Props {
  assessmentId: string;
}

const CurriculumRecommendations: React.FC<Props> = ({ assessmentId }) => {
  const [curriculum, setCurriculum] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCurriculum = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCurriculum(assessmentId);
      setCurriculum(result.curriculum);
      setResources(result.resources);
    } catch (err) {
      setError("Failed to generate curriculum.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>AI-Generated Curriculum</h2>
      <button onClick={handleGenerateCurriculum} disabled={loading}>
        {loading ? "Generating..." : "Get Personalized Curriculum"}
      </button>
      {error && <ErrorText>{error}</ErrorText>}
      {curriculum.length > 0 && (
        <div>
          <h3>Recommended Learning Path</h3>
          <ul>{curriculum.map((item, index) => <li key={index}>{item}</li>)}</ul>
          <h3>Suggested Resources</h3>
          <ul>{resources.map((res, index) => <li key={index}>{res}</li>)}</ul>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ErrorText = styled.p`
  color: red;
`;

export default CurriculumRecommendations;
