import React, { useState, useEffect } from 'react';
import { useFirestore } from 'reactfire';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { Template } from '../types/templates';
import { PlusCircle, Edit, Copy, Trash, Save } from 'lucide-react';

interface TemplateManagerProps {
  onTemplateSelect: (template: Template) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  onTemplateSelect
}) => {
  const [activeTab, setActiveTab] = useState<string>('lessons');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firestore = useFirestore();
  const { createTemplate, adaptTemplate, templateUpdates } = useTemplateManager(firestore);

  useEffect(() => {
    const subscription = templateUpdates.subscribe({
      next: (template) => {
        // Handle template updates
        setSelectedTemplate(template);
      },
      error: (err) => {
        setError(err.message);
      }
    });

    return () => subscription.unsubscribe();
  }, [templateUpdates]);

  const handleCreateTemplate = async (type: 'lesson' | 'activity' | 'assessment') => {
    try {
      const newTemplate = await createTemplate(type, {
        gradeLevel: 'K-12',
        subject: 'General',
        standards: []
      });
      setSelectedTemplate(newTemplate);
      setEditMode(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
    }
  };

  const handleAdaptTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const adaptedTemplates = await adaptTemplate({
        baseTemplate: selectedTemplate,
        adaptations: ['basic', 'advanced'],
        context: {
          purpose: 'differentiation',
          targetLevels: ['remedial', 'standard', 'enrichment']
        }
      });

      // Handle adapted templates
      console.log('Templates adapted:', adaptedTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adapt template');
    }
  };

  const TemplateList = ({ templates, type }: { templates: Template[]; type: string }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{type} Templates</h3>
        <button
          onClick={() => handleCreateTemplate(type as any)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <PlusCircle className="w-4 h-4" />
          New Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:border-gray-400'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-600">
                  Grade: {template.gradeLevel} | Subject: {template.subject}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(true);
                  }}
                  className="p-1 text-gray-600 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdaptTemplate();
                  }}
                  className="p-1 text-gray-600 hover:text-green-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TemplateEditor = ({ template }: { template: Template }) => {
    const [editedTemplate, setEditedTemplate] = useState(template);

    const handleSave = async () => {
      try {
        // Save template changes
        console.log('Saving template:', editedTemplate);
        setEditMode(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save template');
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Template</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              type="text"
              value={editedTemplate.name}
              onChange={(e) => setEditedTemplate({
                ...editedTemplate,
                name: e.target.value
              })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Grade Level</label>
              <input
                type="text"
                value={editedTemplate.gradeLevel}
                onChange={(e) => setEditedTemplate({
                  ...editedTemplate,
                  gradeLevel: e.target.value
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={editedTemplate.subject}
                onChange={(e) => setEditedTemplate({
                  ...editedTemplate,
                  subject: e.target.value
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Standards</label>
            <div className="space-y-2">
              {editedTemplate.standards.map((standard, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={standard}
                    onChange={(e) => {
                      const newStandards = [...editedTemplate.standards];
                      newStandards[index] = e.target.value;
                      setEditedTemplate({
                        ...editedTemplate,
                        standards: newStandards
                      });
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={() => {
                      const newStandards = editedTemplate.standards.filter(
                        (_, i) => i !== index
                      );
                      setEditedTemplate({
                        ...editedTemplate,
                        standards: newStandards
                      });
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setEditedTemplate({
                  ...editedTemplate,
                  standards: [...editedTemplate.standards, '']
                })}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Standard
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Structure</label>
            <StructureEditor
              structure={editedTemplate.structure}
              onChange={(newStructure) => setEditedTemplate({
                ...editedTemplate,
                structure: newStructure
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Metadata</label>
            <MetadataEditor
              metadata={editedTemplate.metadata}
              onChange={(newMetadata) => setEditedTemplate({
                ...editedTemplate,
                metadata: newMetadata
              })}
            />
          </div>
        </div>
      </div>
    );
  };

  const StructureEditor: React.FC<{
    structure: Record<string, any>;
    onChange: (structure: Record<string, any>) => void;
  }> = ({ structure, onChange }) => {
    const handleSectionChange = (
      sectionKey: string,
      newContent: any[]
    ) => {
      onChange({
        ...structure,
        [sectionKey]: newContent
      });
    };

    return (
      <div className="space-y-4">
        {Object.entries(structure).map(([key, content]) => (
          <div key={key} className="p-4 border rounded">
            <h4 className="font-medium mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <ContentBlockEditor
              content={content as any[]}
              onChange={(newContent) => handleSectionChange(key, newContent)}
            />
          </div>
        ))}
      </div>
    );
  };

  const ContentBlockEditor: React.FC<{
    content: any[];
    onChange: (content: any[]) => void;
  }> = ({ content, onChange }) => {
    const handleBlockChange = (index: number, newBlock: any) => {
      const newContent = [...content];
      newContent[index] = newBlock;
      onChange(newContent);
    };

    return (
      <div className="space-y-2">
        {content.map((block, index) => (
          <div key={index} className="flex items-start gap-2">
            <select
              value={block.type}
              onChange={(e) => handleBlockChange(index, {
                ...block,
                type: e.target.value
              })}
              className="p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="media">Media</option>
              <option value="interactive">Interactive</option>
              <option value="assessment">Assessment</option>
            </select>
            <textarea
              value={block.content}
              onChange={(e) => handleBlockChange(index, {
                ...block,
                content: e.target.value
              })}
              className="flex-1 p-2 border rounded"
              rows={2}
            />
            <button
              onClick={() => {
                const newContent = content.filter((_, i) => i !== index);
                onChange(newContent);
              }}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([
            ...content,
            { type: 'text', content: '', metadata: {} }
          ])}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Block
        </button>
      </div>
    );
  };

  const MetadataEditor: React.FC<{
    metadata: Record<string, any>;
    onChange: (metadata: Record<string, any>) => void;
  }> = ({ metadata, onChange }) => {
    const handleFieldChange = (key: string, value: any) => {
      onChange({
        ...metadata,
        [key]: value
      });
    };

    return (
      <div className="space-y-2">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                const newMetadata = { ...metadata };
                delete newMetadata[key];
                newMetadata[e.target.value] = value;
                onChange(newMetadata);
              }}
              className="w-1/3 p-2 border rounded"
              placeholder="Field name"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Value"
            />
            <button
              onClick={() => {
                const newMetadata = { ...metadata };
                delete newMetadata[key];
                onChange(newMetadata);
              }}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange({
            ...metadata,
            newField: ''
          })}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Field
        </button>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Template Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6">
            {editMode && selectedTemplate ? (
              <TemplateEditor template={selectedTemplate} />
            ) : (
              <TabsContent value={activeTab}>
                <TemplateList
                  templates={[]} // TODO: Fetch templates based on type
                  type={activeTab}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TemplateManager;