import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdvancedAnalytics } from '../hooks/useAdvancedAnalytics';
import { AnalyticsConfig, CompetencyData, Report } from '../types';

interface AnalyticsDashboardProps {
    courseId: string;
    initialConfig: AnalyticsConfig;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
    courseId, 
    initialConfig 
}) => {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [reportTemplate, setReportTemplate] = useState<ReportTemplate>({
        type: 'detailed',
        metrics: ['mastery', 'progress', 'engagement'],
        timeframe: 'month'
    });

    const { 
        analytics, 
        generateReport, 
        isLoading, 
        error 
    } = useAdvancedAnalytics(courseId, initialConfig);

    const handleGenerateReport = useCallback(async () => {
        const report = await generateReport(reportTemplate);
        // Handle report generation
    }, [generateReport, reportTemplate]);

    const CompetencyInsights = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <MetricCard
                    title="Overall Mastery"
                    value={`${analytics.overallMastery}%`}
                    trend={analytics.masteryTrend}
                />
                <MetricCard
                    title="Active Learners"
                    value={analytics.activeLearners}
                    trend={analytics.learnersTrend}
                />
                <MetricCard
                    title="Completion Rate"
                    value={`${analytics.completionRate}%`}
                    trend={analytics.completionTrend}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mastery Progression</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.progressionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="mastery"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expected"
                                    stroke="#82ca9d"
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const LearnerAnalysis = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {analytics.learnerGroups.map((group, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Average Mastery</span>
                                    <span>{group.avgMastery}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Completion Rate</span>
                                    <span>{group.completionRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Engagement Score</span>
                                    <span>{group.engagementScore}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const PredictiveAnalytics = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Success Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.predictions.map((prediction, index) => (
                            <div 
                                key={index}
                                className="p-4 border rounded-lg"
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">
                                        {prediction.competency}
                                    </h4>
                                    <span 
                                        className={`px-2 py-1 rounded ${
                                            prediction.likelihood > 0.7 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {Math.round(prediction.likelihood * 100)}% 
                                        Success Rate
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    {prediction.recommendation}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Learning Analytics</h2>
                <button
                    onClick={handleGenerateReport}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isLoading}
                >
                    Generate Report
                </button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="learners">Learner Analysis</TabsTrigger>
                    <TabsTrigger value="predictive">
                        Predictive Analytics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <CompetencyInsights />
                </TabsContent>

                <TabsContent value="learners">
                    <LearnerAnalysis />
                </TabsContent>

                <TabsContent value="predictive">
                    <PredictiveAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalyticsDashboard;