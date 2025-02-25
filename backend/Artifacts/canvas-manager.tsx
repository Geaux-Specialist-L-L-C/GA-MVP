import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Settings, GitBranch, Users, BarChart, Save, Plus, Trash } from 'lucide-react';

const CanvasManager = ({ courseId, initialSettings }) => {
  const [activeTab, setActiveTab] = useState('speedgrader');
  const [speedGraderConfig, setSpeedGraderConfig] = useState({
    anonymous: false,
    moderated: false,
    graders: [],
    hideNames: false,
    gradingType: 'points'
  });
  
  const [masteryPaths, setMasteryPaths] = useState([]);
  const [outcomeSettings, setOutcomeSettings] = useState({
    proficiencyRatings: [],
    calculationMethod: 'highest',
    requiredCount: 5
  });
  
  const SpeedGraderConfig = () => {
    const [newGrader, setNewGrader] = useState('');
    
    const addGrader = () => {
      if (newGrader.trim()) {
        setSpeedGraderConfig(prev => ({
          ...prev,
          graders: [...prev.graders, newGrader.trim()]
        }));
        setNewGrader('');
      }
    };
    
    const removeGrader = (index) => {
      setSpeedGraderConfig(prev => ({
        ...prev,
        graders: prev.graders.filter((_, i) => i !== index)
      }));
    };
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Grading Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={speedGraderConfig.anonymous}
                  onChange={(e) => setSpeedGraderConfig(prev => ({
                    ...prev,
                    anonymous: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span>Anonymous Grading</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={speedGraderConfig.moderated}
                  onChange={(e) => setSpeedGraderConfig(prev => ({
                    ...prev,
                    moderated: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span>Moderated Grading</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={speedGraderConfig.hideNames}
                  onChange={(e) => setSpeedGraderConfig(prev => ({
                    ...prev,
                    hideNames: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span>Hide Student Names</span>
              </label>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Grading Type</h3>
            <select
              value={speedGraderConfig.gradingType}
              onChange={(e) => setSpeedGraderConfig(prev => ({
                ...prev,
                gradingType: e.target.value
              }))}
              className="w-full p-2 border rounded"
            >
              <option value="points">Points</option>
              <option value="percent">Percentage</option>
              <option value="letter_grade">Letter Grade</option>
              <option value="gpa_scale">GPA Scale</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-4">Graders</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newGrader}
              onChange={(e) => setNewGrader(e.target.value)}
              placeholder="Enter grader name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addGrader}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {speedGraderConfig.graders.map((grader, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <span>{grader}</span>
                <button
                  onClick={() => removeGrader(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const MasteryPathsConfig = () => {
    const [editingPath, setEditingPath] = useState(null);
    
    const addMasteryPath = () => {
      const newPath = {
        id: `path_${Date.now()}`,
        triggerAssignment: '',
        scoringRanges: [
          { lower: 0, upper: 69, assignments: [] },
          { lower: 70, upper: 89, assignments: [] },
          { lower: 90, upper: 100, assignments: [] }
        ],
        requiredMastery: 0.8
      };
      
      setMasteryPaths(prev => [...prev, newPath]);
      setEditingPath(newPath.id);
    };
    
    const updatePath = (pathId, updates) => {
      setMasteryPaths(prev => prev.map(path => 
        path.id === pathId ? { ...path, ...updates } : path
      ));
    };
    
    return (
      <div className="space-y-6">
        <button
          onClick={addMasteryPath}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Mastery Path
        </button>
        
        <div className="space-y-4">
          {masteryPaths.map(path => (
            <div key={path.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Mastery Path</h3>
                <button
                  onClick={() => setEditingPath(editingPath === path.id ? null : path.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              {editingPath === path.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Trigger Assignment
                    </label>
                    <input
                      type="text"
                      value={path.triggerAssignment}
                      onChange={(e) => updatePath(path.id, {
                        triggerAssignment: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Scoring Ranges</h4>
                    {path.scoringRanges.map((range, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="number"
                          value={range.lower}
                          onChange={(e) => {
                            const ranges = [...path.scoringRanges];
                            ranges[idx].lower = parseInt(e.target.value);
                            updatePath(path.id, { scoringRanges: ranges });
                          }}
                          className="w-20 p-2 border rounded"
                        />
                        <span className="self-center">to</span>
                        <input
                          type="number"
                          value={range.upper}
                          onChange={(e) => {
                            const ranges = [...path.scoringRanges];
                            ranges[idx].upper = parseInt(e.target.value);
                            updatePath(path.id, { scoringRanges: ranges });
                          }}
                          className="w-20 p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Required Mastery Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={path.requiredMastery}
                      onChange={(e) => updatePath(path.id, {
                        requiredMastery: parseFloat(e.target.value)
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p>Trigger: {path.triggerAssignment}</p>
                  <p>Ranges: {path.scoringRanges.length} defined</p>
                  <p>Required Mastery: {path.requiredMastery * 100}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const OutcomeSettings = () => {
    const [newRating, setNewRating] = useState({
      description: '',
      points: 0,
      mastery: false,
      color: '#000000'
    });
    
    const addRating = () => {
      if (newRating.description) {
        setOutcomeSettings(prev => ({
          ...prev,
          proficiencyRatings: [...prev.proficiencyRatings, { ...newRating }]
        }));
        setNewRating({
          description: '',
          points: 0,
          mastery: false,
          color: '#000000'
        });
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Calculation Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Calculation Method
                </label>
                <select
                  value={outcomeSettings.calculationMethod}
                  onChange={(e) => setOutcomeSettings(prev => ({
                    ...prev,
                    calculationMethod: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="highest">Highest Score</option>
                  <option value="latest">Latest Score</option>
                  <option value="average">Average Score</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Required Assessments
                </label>
                <input
                  type="number"
                  min="1"
                  value={outcomeSettings.requiredCount}
                  onChange={(e) => setOutcomeSettings(prev => ({
                    ...prev,
                    requiredCount: parseInt(e.target.value)
                  }))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Proficiency Ratings</h3>
            <div className="space-y-4">
              {outcomeSettings.proficiencyRatings.map((rating, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: rating.color }}
                  />
                  <span className="flex-1">{rating.description}</span>
                  <span className="text-sm text-gray-600">{rating.points} pts</span>
                  {rating.mastery && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRating.description}
                  onChange={(e) => setNewRating(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Rating description"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={addRating}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Canvas Integration Settings</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="speedgrader" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              SpeedGrader
            </TabsTrigger>
            <TabsTrigger value="mastery" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Mastery Paths
            </TabsTrigger>
            <TabsTrigger value="outcomes" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Outcomes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="speedgrader">
            <SpeedGraderConfig />
          </TabsContent>

          <TabsContent value="mastery">
            <MasteryPathsConfig />
          </TabsContent>

          <TabsContent value="outcomes">
            <OutcomeSettings />
          </TabsContent>
        </Tabs>

        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium mb-1">Save Changes</h3>
              <p className="text-sm text-gray-600">
                Update Canvas integration settings for this course
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>

        {saveStatus && (
          <Alert className={`mt-4 ${saveStatus.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <AlertDescription className="flex items-center gap-2">
              {saveStatus.success ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              {saveStatus.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const PreviewModal = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Preview Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">SpeedGrader Configuration</h3>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(settings.speedGrader, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Mastery Paths</h3>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(settings.masteryPaths, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Outcome Settings</h3>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(settings.outcomes, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for handling Canvas API integration
const useCanvasAPI = (courseId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveSettings = async (settings) => {
    setIsLoading(true);
    setError(null);

    try {
      // SpeedGrader settings
      await fetch(`/api/canvas/courses/${courseId}/speedgrader`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings.speedGrader)
      });

      // Mastery paths
      await fetch(`/api/canvas/courses/${courseId}/mastery_paths`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings.masteryPaths)
      });

      // Outcome settings
      await fetch(`/api/canvas/courses/${courseId}/outcomes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings.outcomes)
      });

      return { success: true, message: 'Settings updated successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: `Error updating settings: ${err.message}` };
    } finally {
      setIsLoading(false);
    }
  };

  return { saveSettings, isLoading, error };
};

// Example usage:
export const CanvasIntegrationManager = () => {
  const courseId = '12345'; // Get from props or context
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { saveSettings, isLoading } = useCanvasAPI(courseId);

  const handleSaveSettings = async () => {
    const settings = {
      speedGrader: speedGraderConfig,
      masteryPaths,
      outcomes: outcomeSettings
    };

    const result = await saveSettings(settings);
    setSaveStatus(result);
  };

  return (
    <>
      <CanvasManager
        courseId={courseId}
        onSave={handleSaveSettings}
        isLoading={isLoading}
        saveStatus={saveStatus}
        onPreview={() => setIsPreviewOpen(true)}
      />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        settings={{
          speedGrader: speedGraderConfig,
          masteryPaths,
          outcomes: outcomeSettings
        }}
      />
    </>
  );
};

export default CanvasIntegrationManager;
          