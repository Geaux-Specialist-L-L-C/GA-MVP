import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Book, Cloud, Check, X, Loader2 } from 'lucide-react';

const ExportInterface = ({ unitPlan }) => {
  const [exportStatus, setExportStatus] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSettings, setExportSettings] = useState({
    includeRubrics: true,
    includeMaterials: true,
    includeAssessments: true,
    includeDifferentiation: true
  });

  const exportFormats = [
    { 
      id: 'html', 
      label: 'HTML Document', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Export as a formatted HTML document for web viewing'
    },
    { 
      id: 'markdown', 
      label: 'Markdown', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Export as Markdown for easy editing and version control'
    },
    { 
      id: 'classroom', 
      label: 'Google Classroom', 
      icon: <Cloud className="w-5 h-5" />,
      description: 'Upload directly to Google Classroom as course material'
    },
    { 
      id: 'canvas', 
      label: 'Canvas LMS', 
      icon: <Book className="w-5 h-5" />,
      description: 'Create a new module in Canvas LMS'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare export summary
      const summary = {
        format: selectedFormat,
        timestamp: new Date().toISOString(),
        settings: exportSettings,
        unitDetails: {
          title: unitPlan.title,
          subjects: unitPlan.subjects,
          objectives: unitPlan.objectives.length,
          activities: unitPlan.activities.length
        }
      };
      
      setExportStatus({
        success: true,
        message: `Successfully exported "${unitPlan.title}" as ${selectedFormat.toUpperCase()}`,
        summary
      });
    } catch (error) {
      setExportStatus({
        success: false,
        message: `Export failed: ${error.message}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  const ExportSummary = ({ summary }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium mb-2">Export Summary</h4>
      <div className="space-y-2 text-sm">
        <p>Format: {summary.format.toUpperCase()}</p>
        <p>Time: {new Date(summary.timestamp).toLocaleString()}</p>
        <p>Unit: {summary.unitDetails.title}</p>
        <p>Content: {summary.unitDetails.objectives} objectives, {summary.unitDetails.activities} activities</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Download className="w-6 h-6" />
          Export Unit Plan
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-colors
                  ${selectedFormat === format.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}
                `}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {format.icon}
                  <span className="font-medium">{format.label}</span>
                </div>
                <p className="text-sm text-gray-600">{format.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Export Settings</h3>
          <div className="space-y-2">
            {Object.entries(exportSettings).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setExportSettings({
                    ...exportSettings,
                    [key]: e.target.checked
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">
                  Include {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {exportStatus && (
          <Alert variant={exportStatus.success ? "default" : "destructive"} className="mb-4">
            <div className="flex items-center gap-2">
              {exportStatus.success ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <AlertDescription>{exportStatus.message}</AlertDescription>
            </div>
            {exportStatus.success && exportStatus.summary && (
              <ExportSummary summary={exportStatus.summary} />
            )}
          </Alert>
        )}

        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`
            w-full py-2 px-4 rounded-lg font-medium text-white
            ${isExporting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
            flex items-center justify-center gap-2
          `}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export Unit Plan
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
};

export default ExportInterface;