import React, { useEffect, useCallback, useRef } from 'react';
import { LineChart, RadarChart, ResponsiveContainer } from 'recharts';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentContext } from '@/contexts/AgentContext';
import { useAssessmentState } from '@/hooks/useAssessmentState';

/**
 * LearningPathVisualizer - Interactive visualization of student learning path
 * Displays progress, milestones, and adaptive recommendations
 */
export const LearningPathVisualizer: React.FC<LearningPathProps> = ({
  studentId,
  pathData,
  assessmentMetrics
}) => {
  const { path: pathAgent } = React.useContext(AgentContext);
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);

  // Real-time path data subscription
  const pathQuery = useFirestore()
    .collection('learningPaths')
    .doc(studentId)
    .collection('pathNodes');
  
  const { data: pathNodes } = useFirestoreCollectionData(pathQuery, {
    idField: 'id'
  });

  // Handle node selection and detail display
  const handleNodeClick = useCallback(async (node: PathNode) => {
    setSelectedNode(node);
    const nodeDetails = await pathAgent.getNodeDetails(node.id);
    setNodeDetails(nodeDetails);
  }, [pathAgent]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="h-96 w-full" ref={chartRef}>
        <ResponsiveContainer>
          <PathGraph
            nodes={pathNodes}
            selectedNode={selectedNode}
            onNodeClick={handleNodeClick}
            metrics={assessmentMetrics}
          />
        </ResponsiveContainer>
      </div>
      <AnimatePresence>
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * SkillRadarChart - Displays multi-dimensional skill assessment
 * Updates in real-time based on assessment results
 */
export const SkillRadarChart: React.FC<SkillRadarProps> = ({
  skills,
  currentLevel,
  targetLevel,
  onSkillSelect
}) => {
  const theme = useTheme();
  const gradientId = useId();

  const chartData = useMemo(() => {
    return skills.map(skill => ({
      name: skill.name,
      current: skill.level,
      target: skill.targetLevel,
      gap: Math.max(0, skill.targetLevel - skill.level)
    }));
  }, [skills]);

  return (
    <div className="relative h-80 w-full">
      <ResponsiveContainer>
        <RadarChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={theme.colors.primary[400]} />
              <stop offset="100%" stopColor={theme.colors.primary[600]} />
            </linearGradient>
          </defs>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis domain={[0, 5]} />
          <Radar
            name="Current Level"
            dataKey="current"
            fill={`url(#${gradientId})`}
            fillOpacity={0.6}
          />
          <Radar
            name="Target Level"
            dataKey="target"
            stroke={theme.colors.secondary[500]}
            fill="none"
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * ProgressTimeline - Visualizes learning progress over time
 * Includes milestones, interventions, and achievements
 */
export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  progressData,
  interventions,
  milestones
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const timelineData = useMemo(() => {
    return combineTimelineEvents(progressData, interventions, milestones);
  }, [progressData, interventions, milestones]);

  return (
    <div className="relative">
      <motion.div
        className="timeline-container"
        ref={timelineRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {timelineData.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            isActive={activeSection === event.id}
            onSelect={() => setActiveSection(event.id)}
            index={index}
          />
        ))}
      </motion.div>
      <TimelineConnectors events={timelineData} />
    </div>
  );
};

/**
 * AdaptiveContentDisplay - Shows dynamically adapted learning content
 * Responds to real-time assessment and engagement metrics
 */
export const AdaptiveContentDisplay: React.FC<AdaptiveContentProps> = ({
  content,
  studentMetrics,
  onInteraction
}) => {
  const { content: contentAgent } = React.useContext(AgentContext);
  const [adaptedContent, setAdaptedContent] = useState(content);

  useEffect(() => {
    const adaptContent = async () => {
      const optimizedContent = await contentAgent.optimizeContent(
        content,
        studentMetrics
      );
      setAdaptedContent(optimizedContent);
    };

    adaptContent();
  }, [content, studentMetrics, contentAgent]);

  return (
    <motion.div
      className="adaptive-content"
      layout
      transition={{ duration: 0.3 }}
    >
      <ContentHeader
        difficulty={adaptedContent.difficulty}
        style={adaptedContent.presentationStyle}
      />
      <DynamicContent
        content={adaptedContent}
        onInteraction={onInteraction}
      />
      <ContentControls
        adaptations={adaptedContent.adaptations}
        onAdjust={handleContentAdjustment}
      />
    </motion.div>
  );
};

/**
 * AssessmentMetricsPanel - Comprehensive metrics dashboard
 * Real-time updates and interactive filtering
 */
export const AssessmentMetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  timeRange,
  onFilterChange
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [aggregationType, setAggregationType] = useState<'daily' | 'weekly'>('daily');

  const aggregatedData = useMemo(() => {
    return aggregateMetrics(metrics, aggregationType);
  }, [metrics, aggregationType]);

  return (
    <div className="metrics-panel">
      <MetricsHeader
        selectedMetrics={selectedMetrics}
        onMetricToggle={toggleMetric}
        aggregationType={aggregationType}
        onAggregationChange={setAggregationType}
      />
      <div className="metrics-grid">
        <MetricCard
          title="Learning Style Confidence"
          value={metrics.styleConfidence}
          trend={metrics.confidenceTrend}
          chart={
            <TrendLineChart
              data={aggregatedData.confidence}
              color={theme.colors.primary[500]}
            />
          }
        />
        <MetricCard
          title="Engagement Score"
          value={metrics.engagementScore}
          trend={metrics.engagementTrend}
          chart={
            <TrendLineChart
              data={aggregatedData.engagement}
              color={theme.colors.secondary[500]}
            />
          }
        />
        <MetricCard
          title="Progress Rate"
          value={metrics.progressRate}
          trend={metrics.progressTrend}
          chart={
            <TrendLineChart
              data={aggregatedData.progress}
              color={theme.colors.tertiary[500]}
            />
          }
        />
      </div>
      <MetricsFooter
        timeRange={timeRange}
        onTimeRangeChange={onFilterChange}
      />
    </div>
  );
};

/**
 * Custom hook for managing assessment visualization state
 */
const useAssessmentVisualization = (studentId: string) => {
  const [visualState, setVisualState] = useState<VisualizationState>({
    activeMetrics: [],
    timeRange: 'week',
    view: 'standard'
  });

  const updateVisualization = useCallback((
    updates: Partial<VisualizationState>
  ) => {
    setVisualState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return {
    visualState,
    updateVisualization
  };
};

/**
 * Main assessment visualization container
 */
export const AssessmentVisualizer: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { visualState, updateVisualization } = useAssessmentVisualization(studentId);

  return (
    <div className="assessment-visualizer">
      <VisualizerHeader
        state={visualState}
        onStateChange={updateVisualization}
      />
      <div className="grid grid-cols-2 gap-4">
        <LearningPathVisualizer
          studentId={studentId}
          view={visualState.view}
        />
        <SkillRadarChart
          skills={visualState.activeMetrics}
          timeRange={visualState.timeRange}
        />
      </div>
      <div className="mt-4">
        <ProgressTimeline
          studentId={studentId}
          timeRange={visualState.timeRange}
        />
      </div>
      <div className="mt-4">
        <AssessmentMetricsPanel
          metrics={visualState.activeMetrics}
          timeRange={visualState.timeRange}
          onFilterChange={updateVisualization}
        />
      </div>
    </div>
  );
};
