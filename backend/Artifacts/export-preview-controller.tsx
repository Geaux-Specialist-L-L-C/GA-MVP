import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Download } from 'lucide-react';

import ExportInterface from './ExportInterface';
import UnitPlanPreview from './UnitPlanPreview';

const ExportPreviewController = ({ unitPlan }) => {
  const [activeTab, setActiveTab] = useState('customize');
  const [exportSettings, setExportSettings] = useState({
    includeRubrics: true,
    includeMaterials: true,
    includeAssessments: true,
    includeDifferentiation: true
  });
  const [selectedFormat, setSelectedFormat] = useState('html');

  const handleExportSettingsChange = (newSettings) => {
    setExportSettings(newSettings);
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="customize" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Customize Export
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customize">
          <ExportInterface
            unitPlan={unitPlan}
            settings={exportSettings}
            onSettingsChange={handleExportSettingsChange}
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
          />
        </TabsContent>

        <TabsContent value="preview">
          <UnitPlanPreview
            unitPlan={unitPlan}
            exportSettings={exportSettings}
            format={selectedFormat}
          />
          
          <Alert className="mt-4">
            <AlertDescription>
              This is a preview of how your unit plan will appear when exported. 
              Switch back to the Customize tab to make changes.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportPreviewController;