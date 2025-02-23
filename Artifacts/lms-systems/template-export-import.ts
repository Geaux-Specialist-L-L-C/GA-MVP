import { z } from 'zod';
import yaml from 'js-yaml';
import { Agent, Task } from 'crewai';
import { storage } from 'firebase/storage';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { Template, ExportFormat, ImportResult } from '../types/templates';

// Schema for exported template package
const TemplatePackageSchema = z.object({
  version: z.string(),
  metadata: z.object({
    exportedAt: z.string(),
    exportedBy: z.string(),
    format: z.enum(['json', 'yaml', 'pdf']),
    checksum: z.string()
  }),
  templates: z.array(z.any())  // Validated during processing
});

class TemplateExportImport {
  private readonly agent: Agent;
  private readonly firestore: FirebaseFirestore.Firestore;
  private readonly storage: FirebaseStorage;

  constructor(
    firestore: FirebaseFirestore.Firestore,
    storage: FirebaseStorage,
    agent: Agent
  ) {
    this.firestore = firestore;
    this.storage = storage;
    this.agent = agent;
  }

  /**
   * Export templates to specified format
   * @param templates - Templates to export
   * @param format - Export format
   * @param options - Export options
   */
  public async exportTemplates(
    templates: Template[],
    format: ExportFormat,
    options: ExportOptions = {}
  ): Promise<Blob | string> {
    try {
      // Validate templates using agent
      const validationTask = new Task({
        description: 'Validate templates for export',
        parameters: { templates, format }
      });
      await this.agent.execute(validationTask);

      // Create export package
      const exportPackage = {
        version: '1.0.0',
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: options.userId || 'system',
          format,
          checksum: this.generateChecksum(templates)
        },
        templates: await this.processTemplatesForExport(templates)
      };

      // Validate package structure
      TemplatePackageSchema.parse(exportPackage);

      // Generate output in specified format
      switch (format) {
        case 'json':
          return new Blob(
            [JSON.stringify(exportPackage, null, 2)],
            { type: 'application/json' }
          );
        case 'yaml':
          return new Blob(
            [yaml.dump(exportPackage)],
            { type: 'application/x-yaml' }
          );
        case 'pdf':
          return await this.generatePDF(exportPackage);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  /**
   * Import templates from file
   * @param file - File to import
   * @param options - Import options
   */
  public async importTemplates(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    try {
      // Parse file content
      const content = await this.parseImportFile(file);
      
      // Validate package structure
      TemplatePackageSchema.parse(content);

      // Process templates using agent
      const processingTask = new Task({
        description: 'Process and validate imported templates',
        parameters: { templates: content.templates }
      });
      const processedTemplates = await this.agent.execute(processingTask);

      // Check for duplicates
      const duplicates = await this.checkDuplicates(processedTemplates);

      if (duplicates.length > 0 && !options.overwrite) {
        return {
          success: false,
          error: 'Duplicate templates found',
          duplicates
        };
      }

      // Save templates to Firebase
      const result = await this.saveImportedTemplates(
        processedTemplates,
        options.overwrite
      );

      // Generate import report
      return {
        success: true,
        imported: result.imported,
        updated: result.updated,
        failed: result.failed
      };
    } catch (error) {
      console.error('Import failed:', error);
      return {
        success: false,
        error: `Import failed: ${error.message}`
      };
    }
  }

  private async processTemplatesForExport(
    templates: Template[]
  ): Promise<Template[]> {
    // Clean and normalize templates
    return templates.map(template => ({
      ...template,
      metadata: {
        ...template.metadata,
        exportedAt: new Date().toISOString()
      }
    }));
  }

  private generateChecksum(templates: Template[]): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(templates))
      .digest('hex');
  }

  private async generatePDF(
    exportPackage: any
  ): Promise<Blob> {
    // Implement PDF generation
    throw new Error('PDF export not implemented');
  }

  private async parseImportFile(file: File): Promise<any> {
    const content = await file.text();
    
    switch (file.type) {
      case 'application/json':
        return JSON.parse(content);
      case 'application/x-yaml':
        return yaml.load(content);
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }
  }

  private async checkDuplicates(
    templates: Template[]
  ): Promise<Template[]> {
    const duplicates: Template[] = [];
    
    for (const template of templates) {
      const q = query(
        collection(this.firestore, 'templates'),
        where('name', '==', template.name)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        duplicates.push(template);
      }
    }
    
    return duplicates;
  }

  private async saveImportedTemplates(
    templates: Template[],
    overwrite: boolean = false
  ): Promise<ImportStats> {
    const stats = {
      imported: 0,
      updated: 0,
      failed: 0
    };

    const batch = writeBatch(this.firestore);

    for (const template of templates) {
      try {
        const templateRef = doc(
          collection(this.firestore, 'templates'),
          template.id
        );

        if (overwrite) {
          batch.set(templateRef, template);
          stats.updated++;
        } else {
          batch.create(templateRef, template);
          stats.imported++;
        }
      } catch (error) {
        console.error(`Failed to save template ${template.id}:`, error);
        stats.failed++;
      }
    }

    await batch.commit();
    return stats;
  }
}

// React hook for template export/import
export const useTemplateExportImport = (
  firestore: FirebaseFirestore.Firestore,
  storage: FirebaseStorage,
  agent: Agent
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportImport = useMemo(
    () => new TemplateExportImport(firestore, storage, agent),
    [firestore, storage, agent]
  );

  const exportTemplates = useCallback(async (
    templates: Template[],
    format: ExportFormat,
    options?: ExportOptions
  ): Promise<Blob | string> => {
    setIsProcessing(true);
    setError(null);

    try {
      return await exportImport.exportTemplates(templates, format, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [exportImport]);

  const importTemplates = useCallback(async (
    file: File,
    options?: ImportOptions
  ): Promise<ImportResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      return await exportImport.importTemplates(file, options);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [exportImport]);

  return {
    exportTemplates,
    importTemplates,
    isProcessing,
    error
  };
};
