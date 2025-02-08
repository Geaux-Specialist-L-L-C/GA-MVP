/src/components/features/learning/LearningStyleInsightsWrapper.tsx

import React from 'react';
import VueWrapper from '../vue/VueWrapper';
import LearningStyleInsights from './LearningStyleInsights.vue';

interface LearningStyleInsightsWrapperProps {
  studentData?: any; // Add proper typing based on your Vue component props
}

const LearningStyleInsightsWrapper: React.FC<LearningStyleInsightsWrapperProps> = ({ studentData }) => {
  return <VueWrapper component={LearningStyleInsights} props={{ studentData }} />;
};

export default LearningStyleInsightsWrapper;
