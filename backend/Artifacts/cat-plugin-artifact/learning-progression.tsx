import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompetencyProgression } from '@/hooks/useCompetencyProgression';
import { BookOpen, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface ProgressionTrackerProps {
  subject: string;
}

export const ProgressionTracker: React.FC<ProgressionTrackerProps> = ({
  subject
}) => {
  const {
    dueReviews,
    learningPath,
    recordAssessment,
    loading,
    error
  } = useCompetencyProgression(subject);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Due Reviews Section */}
      {dueReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Topics Due for Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dueReviews.map((review, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{review.topic}</h4>
                    <p className="text-sm text-gray-500">
                      Last reviewed: {new Date(review.lastReview).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.href = `/review/${review.topic}`}
                    className="px-4 py-2 bg-