// frontend/src/components/memory/MemoryViewer.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { memoryService } from '../../services/memoryService';
import styled from 'styled-components';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface Memory {
  id: string;
  content: string;
  metadata: {
    type: string;
    interaction_type?: string;
    task_type?: string;
    subject?: string;
    created_at: string;
    [key: string]: any;
  };
}

const MemoryViewer: React.FC = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  useEffect(() => {
    if (user?.uid) {
      loadMemories();
    }
  }, [user?.uid]);
  
  const loadMemories = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await memoryService.getUserMemories(user.uid);
      setMemories(response);
    } catch (err) {
      setError('Failed to load memories');
      console.error('Error loading memories:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!user?.uid || !searchQuery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await memoryService.searchMemories(user.uid, searchQuery, typeFilter);
      setMemories(response);
    } catch (err) {
      setError('Search failed');
      console.error('Error searching memories:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredMemories = memories.filter(memory => {
    if (typeFilter === 'all') return true;
    return memory.metadata.type === typeFilter;
  });
  
  return (
    <ViewerContainer>
      <h2>Learning Memory</h2>
      
      <SearchBar>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your learning history..."
        />
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="curriculum">Curriculum</option>
          <option value="assessment">Assessments</option>
          <option value="task_result">Task Results</option>
        </select>
        <Button onClick={handleSearch} variant="secondary">Search</Button>
      </SearchBar>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <MemoryGrid>
          {filteredMemories.length > 0 ? (
            filteredMemories.map(memory => (
              <MemoryCard 
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                isSelected={selectedMemory?.id === memory.id}
              >
                <MemoryType>{memory.metadata.type}</MemoryType>
                <MemoryPreview>
                  {memory.content.substring(0, 100)}...
                </MemoryPreview>
                <MemoryDate>
                  {new Date(memory.metadata.created_at).toLocaleDateString()}
                </MemoryDate>
              </MemoryCard>
            ))
          ) : (
            <EmptyState>No memories found</EmptyState>
          )}
        </MemoryGrid>
      )}
      
      {selectedMemory && (
        <MemoryDetail>
          <MemoryHeader>
            <h3>{selectedMemory.metadata.type}</h3>
            <Button 
              variant="text"
              onClick={() => setSelectedMemory(null)}
            >
              Close
            </Button>
          </MemoryHeader>
          
          <MemoryContent>
            {selectedMemory.content}
          </MemoryContent>
          
          <MemoryMetadata>
            <h4>Metadata</h4>
            <ul>
              {Object.entries(selectedMemory.metadata)
                .filter(([key]) => key !== 'type')
                .map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))
              }
            </ul>
          </MemoryMetadata>
        </MemoryDetail>
      )}
    </ViewerContainer>
  );
};

// Styled components omitted for brevity...

export default MemoryViewer;