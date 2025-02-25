import React, { useState, useCallback } from 'react';
import { useFirestore, useStorage } from 'reactfire';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTemplateExportImport } from '../hooks/useTemplateExportImport';
import { Download, Upload, FileText, File, CheckCircle, X, Loader2 } from 'lucide-react';
import type { Template, ExportFormat, ImportResult } from '../types/templates';

interface ExportImportProps {
  templates: Template[];
  onImportComplete: (result: ImportResult) => void;
}

export const ExportImportInterface: React.FC<ExportImportProps> = ({
  templates,
  onImportComplete
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [importFile, setImportFile] = useState<File | null>(null);
  const [overwriteMode, setOverwriteMode] = useState(false);

  const firestore = useFirestore();
  const storage = useStorage();
  const agent = useAgent();  // CrewAI agent instance

  const {
    exportTemplates,
    importTemplates,
    isProcessing,
    error
  } = useTemplateExportImport(firestore, storage, agent);

  const handleExport = async () => {
    try {
      const selectedTemplatesToExport = templates.filter(
        t => selectedTemplates.has(t.id)
      );

      const result = await exportTemplates(
        selectedTemplatesToExport,
        selectedFormat,
        { userId: 'current-user' }  // TODO: Get from auth context
      );

      // Handle blob or string result
      if (result instanceof Blob) {
        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        a.download = `templates_${Date.now()}.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Handle string result (e.g., for PDF)
        console.log('Export result:', result);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      const result = await importTemplates(importFile, {
        overwrite: overwriteMode
      });

      onImportComplete(result);

      if (result.success) {
        setImportFile(null);
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  const ExportSection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-4">Export Format</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['json', 'yaml', 'pdf'] as ExportFormat[]).map(format => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`
                p-4 border rounded-lg text-center transition-colors
                ${format === selectedFormat 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-gray-400'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <span className="uppercase">{format}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Select Templates</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {templates.map(template => (
            <label
              key={template.id}
              className="flex items-center p-3 border rounded hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedTemplates.has(template.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedTemplates);
                  if (e.target.checked) {
                    newSelected.add(template.id);
                  } else {
                    newSelected.delete(template.id);
                  }
                  setSelectedTemplates(newSelected);
                }}
                className="mr-3"
              />
              <div>
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-600">
                  {template.type} | Grade {template.gradeLevel}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={isProcessing || selectedTemplates.size === 0}
        className={`
          w-full py-2 px-4 rounded font-medium flex items-center justify-center gap-2
          ${isProcessing || selectedTemplates.size === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Downloa