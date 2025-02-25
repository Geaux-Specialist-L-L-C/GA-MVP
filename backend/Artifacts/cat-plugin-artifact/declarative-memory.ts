// File: src/services/declarativeMemory.ts
import { cheshireService } from './cheshireService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, storage } from '@/firebase/config';

interface DocumentMetadata {
  title: string;
  subject: string;
  gradeLevel: number;
  type: 'lesson' | 'assessment' | 'resource';
  tags: string[];
  author: string;
  createdAt: Date;
  status: 'draft' | 'published' | 'archived';
}

interface ChunkingConfig {
  chunkSize: number;
  chunkOverlap: number;
  includeMetadata: boolean;
}

export class DeclarativeMemoryService {
  private static DEFAULT_CHUNK_CONFIG: ChunkingConfig = {
    chunkSize: 1000,
    chunkOverlap: 200,
    includeMetadata: true
  };

  /**
   * Processes and stores curriculum materials in both Cheshire Cat and Firebase
   */
  async storeCurriculumMaterial(
    file: File,
    metadata: DocumentMetadata,
    config: Partial<ChunkingConfig> = {}
  ) {
    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `curriculum/${metadata.subject}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Create FormData for Rabbit Hole ingestion
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chunk_size', String(config.chunkSize || this.DEFAULT_CHUNK_CONFIG.chunkSize));
      formData.append('chunk_overlap', String(config.chunkOverlap || this.DEFAULT_CHUNK_CONFIG.chunkOverlap));
      formData.append('metadata', JSON.stringify({
        ...metadata,
        source_url: downloadURL
      }));

      // Process through Rabbit Hole pipeline
      await cheshireService.post('/rabbithole/', formData);

      // Store reference in Firestore
      await addDoc(collection(db, 'curriculum_materials'), {
        ...metadata,
        fileUrl: downloadURL,
        createdAt: new Date(),
        status: metadata.status || 'draft'
      });

      return true;
    } catch (error) {
      console.error('Failed to store curriculum material:', error);
      throw error;
    }
  }

  /**
   * Retrieves relevant curriculum materials based on semantic search
   */
  async searchCurriculumMaterials(
    query: string,
    filters: Partial<DocumentMetadata> = {}
  ) {
    try {
      // Search Cheshire Cat's declarative memory
      const cheshireResponse = await cheshireService.post('/memory/recall', {
        text: query,
        metadata: filters,
        k: 5
      });

      // Get detailed metadata from Firestore
      const materialRefs = cheshireResponse.data.map(
        (item: any) => item.metadata.source_url
      );

      const firestoreQuery = query(
        collection(db, 'curriculum_materials'),
        where('fileUrl', 'in', materialRefs)
      );

      const firestoreDocs = await getDocs(firestoreQuery);
      const materials = firestoreDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Merge Cheshire Cat and Firestore data
      return cheshireResponse.data.map((item: any) => ({
        ...item,
        metadata: {
          ...item.metadata,
          ...materials.find(m => m.fileUrl === item.metadata.source_url)
        }
      }));
    } catch (error) {
      console.error('Failed to search curriculum materials:', error);
      throw error;
    }
  }

  /**
   * Updates metadata for existing curriculum material
   */
  async updateMaterialMetadata(
    materialId: string,
    updates: Partial<DocumentMetadata>
  ) {
    try {
      // Update in Cheshire Cat memory
      const material = await this.searchCurriculumMaterials('', { id: materialId });
      if (material.length > 0) {
        await cheshireService.put(
          `/memory/collections/declarative/points/${material[0].id}`,
          { metadata: { ...material[0].metadata, ...updates } }
        );
      }

      // Update in Firestore
      const materialRef = collection(db, 'curriculum_materials');
      await addDoc(materialRef, {
        id: materialId,
        ...updates,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Failed to update material metadata:', error);
      throw error;
    }
  }

  /**
   * Retrieves curriculum materials by grade level and subject
   */
  async getMaterialsByGradeAndSubject(
    gradeLevel: number,
    subject: string,
    type?: DocumentMetadata['type']
  ) {
    try {
      const filters: Partial<DocumentMetadata> = {
        gradeLevel,
        subject,
        status: 'published'
      };

      if (type) {
        filters.type = type;
      }

      return await this.searchCurriculumMaterials('', filters);
    } catch (error) {
      console.error('Failed to get materials by grade and subject:', error);
      throw error;
    }
  }

  /**
   * Gets related materials based on semantic similarity
   */
  async getRelatedMaterials(materialId: string, limit: number = 3) {
    try {
      const material = await this.searchCurriculumMaterials('', { id: materialId });
      if (material.length === 0) {
        throw new Error('Material not found');
      }

      return await this.searchCurriculumMaterials(
        material[0].content,
        {
          status: 'published',
          id: { $ne: materialId }
        }
      );
    } catch (error) {
      console.error('Failed to get related materials:', error);
      throw error;
    }
  }
}

export const declarativeMemory = new DeclarativeMemoryService();