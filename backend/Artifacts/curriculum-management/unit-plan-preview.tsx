import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Layout, FileText, Book, Code, ChevronRight, ChevronDown, Clock, Target, CheckSquare, Users } from 'lucide-react';

const UnitPlanPreview = ({ unitPlan, exportSettings, format }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));
  const [previewMode, setPreviewMode] = useState('rendered'); // 'rendered' or 'source'

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSection(newExpanded);
  };

  const PreviewHeader = () => (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">{unitPlan.title}</h2>
        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
          Grade {unitPlan.grade_level}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setPreviewMode('rendered')}
          className={`px-3 py-1 rounded ${
            previewMode === 'rendered' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Layout className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPreviewMode('source')}
          className={`px-3 py-1 rounded ${
            previewMode === 'source' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const PreviewSection = ({ title, icon, children, id }) => (
    <div className="border rounded-lg mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {expandedSections.has(id) ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
      {expandedSections.has(id) && (
        <div className="px-4 py-3 border-t bg-white">{children}</div>
      )}
    </div>
  );

  const MetadataRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const ObjectivesList = ({ objectives }) => (
    <div className="space-y-3">
      {objectives.map((objective, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{objective.subject}</span>
          </div>
          <p className="text-sm">{objective.description}</p>
          {objective.assessment_criteria && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Assessment Criteria: </span>
              {objective.assessment_criteria.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const ActivityList = ({ activities }) => (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{activity.title}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {activity.duration}
            </div>
          </div>
          <p className="text-sm mb-3">{activity.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Materials:</span>
              <ul className="mt-1 list-disc list-inside text-gray-600">
                {activity.materials.map((material, idx) => (
                  <li key={idx}>{material}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium">Grouping:</span>
              <div className="mt-1 flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                {activity.grouping}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const AssessmentList = ({ assessments }) => (
    <div className="space-y-4">
      {assessments.map((assessment, index) => (
        <div key={index} className="border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{assessment.title}</h4>
            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
              {assessment.type}
            </span>
          </div>
          <p className="text-sm mb-3">{assessment.description}</p>
          {assessment.rubric && (
            <div className="mt-3">
              <h5 className="font-medium text-sm mb-2">Rubric</h5>
              <div className="border rounded overflow-hidden">
                {Object.entries(assessment.rubric).map(([criterion, levels], idx) => (
                  <div
                    key={idx}
                    className={`flex text-sm ${
                      idx > 0 ? 'border-t' : ''
                    }`}
                  >
                    <div className="w-1/3 p-2 bg-gray-50 font-medium">
                      {criterion}
                    </div>
                    <div className="w-2/3 p-2">
                      {levels.join(' → ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSourceView = () => {
    let source = '';
    switch (format) {
      case 'markdown':
        source = `# ${unitPlan.title}

## Overview
- Grade Level: ${unitPlan.grade_level}
- Duration: ${unitPlan.duration}
- Subjects: ${unitPlan.subjects.join(', ')}

## Objectives
${unitPlan.objectives.map(obj => `- ${obj.description}`).join('\n')}

## Activities
${unitPlan.activities.map(act => `### ${act.title}
${act.description}
- Duration: ${act.duration}
- Materials: ${act.materials.join(', ')}
`).join('\n')}`;
        break;
      case 'html':
        source = `<h1>${unitPlan.title}</h1>
<div class="overview">
  <p>Grade Level: ${unitPlan.grade_level}</p>
  <p>Duration: ${unitPlan.duration}</p>
  <p>Subjects: ${unitPlan.subjects.join(', ')}</p>
</div>
...`;
        break;
      default:
        source = JSON.stringify(unitPlan, null, 2);
    }

    return (
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        {source}
      </pre>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-6 h-6" />
          Preview Unit Plan
        </CardTitle>
      </CardHeader>

      <CardContent>
        <PreviewHeader />

        {previewMode === 'source' ? (
          renderSourceView()
        ) : (
          <>
            <PreviewSection
              id="overview"
              title="Overview"
              icon={<Layout className="w-5 h-5" />}
            >
              <div className="space-y-2">
                <MetadataRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Duration"
                  value={unitPlan.duration}
                />
                <MetadataRow
                  icon={<Book className="w-4 h-4" />}
                  label="Subjects"
                  value={unitPlan.subjects.join(', ')}
                />
                <MetadataRow
                  icon={<CheckSquare className="w-4 h-4" />}
                  label="Standards"
                  value={unitPlan.standards.length}
                />
              </div>
            </PreviewSection>

            <PreviewSection
              id="objectives"
              title="Learning Objectives"
              icon={<Target className="w-5 h-5" />}
            >
              <ObjectivesList objectives={unitPlan.objectives} />
            </PreviewSection>

            <PreviewSection
              id="activities"
              title="Activities"
              icon={<Users className="w-5 h-5" />}
            >
              <ActivityList activities={unitPlan.activities} />
            </PreviewSection>

            {exportSettings.includeAssessments && (
              <PreviewSection
                id="assessments"
                title="Assessments"
                icon={<CheckSquare className="w-5 h-5" />}
              >
                <AssessmentList assessments={unitPlan.assessments} />
              </PreviewSection>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitPlanPreview;