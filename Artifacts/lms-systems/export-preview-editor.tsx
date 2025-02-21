import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pencil, Save, X, Eye, Layout, FileText, Book, Code, ChevronRight, RefreshCw } from 'lucide-react';

const PreviewEditor = ({ unitPlan, onUpdate, exportSettings, format }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(null);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setEditedContent(structuredClone(unitPlan));
  }, [unitPlan]);

  const handleEdit = (section, field, value) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdate(editedContent);
    setEditMode(false);
    setPreviewRefreshKey(prev => prev + 1);
  };

  const EditableField = ({ value, onChange, multiline = false }) => {
    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  const SectionEditor = ({ section, title, fields }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {editMode && (
          <button
            onClick={() => setActiveSection(section)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {fields.map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <EditableField
            value={editedContent[section][field.key]}
            onChange={(value) => handleEdit(section, field.key, value)}
            multiline={field.multiline}
          />
        </div>
      ))}
    </div>
  );

  const PreviewControls = () => (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`
            px-3 py-1 rounded flex items-center gap-2
            ${editMode ? 'bg-gray-100' : 'bg-blue-100 text-blue-700'}
          `}
        >
          {editMode ? (
            <>
              <Eye className="w-4 h-4" /> View
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" /> Edit
            </>
          )}
        </button>
        <button
          onClick={() => setPreviewRefreshKey(prev => prev + 1)}
          className="px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      {editMode && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setEditedContent(structuredClone(unitPlan));
            }}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  const FormatPreview = () => {
    switch (format) {
      case 'html':
        return (
          <div className="prose max-w-none">
            <h1>{editedContent.title}</h1>
            <div className="metadata">
              <p>Grade Level: {editedContent.grade_level}</p>
              <p>Duration: {editedContent.duration}</p>
              <p>Subjects: {editedContent.subjects.join(', ')}</p>
            </div>
            {/* Additional HTML preview content */}
          </div>
        );
        
      case 'markdown':
        return (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {`# ${editedContent.title}

## Overview
- Grade Level: ${editedContent.grade_level}
- Duration: ${editedContent.duration}
- Subjects: ${editedContent.subjects.join(', ')}

## Objectives
${editedContent.objectives.map(obj => `- ${obj.description}`).join('\n')}
`}
          </pre>
        );
        
      default:
        return (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(editedContent, null, 2)}
          </pre>
        );
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Preview and Edit Unit Plan
          </div>
          <div className="text-sm text-gray-500">
            Format: {format.toUpperCase()}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <PreviewControls />

        {editMode ? (
          <>
            <SectionEditor
              section="overview"
              title="Overview"
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', multiline: true },
                { key: 'grade_level', label: 'Grade Level' },
                { key: 'duration', label: 'Duration' }
              ]}
            />
            
            <SectionEditor
              section="objectives"
              title="Learning Objectives"
              fields={editedContent.objectives.map((_, index) => ({
                key: `objectives.${index}.description`,
                label: `Objective ${index + 1}`,
                multiline: true
              }))}
            />
            
            {/* Additional section editors */}
          </>
        ) : (
          <div key={previewRefreshKey}>
            <FormatPreview />
          </div>
        )}

        {editMode && (
          <Alert className="mt-4">
            <AlertDescription>
              Make your changes above and click Save Changes to update the preview.
              All changes will be reflected in the final export.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewEditor;