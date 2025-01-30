import React, { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import LearningStyleInsights from './LearningStyleInsights.vue';

interface LearningStyleInsightsWrapperProps {
  // Add any props if needed
}

const LearningStyleInsightsWrapper: React.FC<LearningStyleInsightsWrapperProps> = () => {
  const vueContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vueContainer.current) return;
    
    const app = createApp(LearningStyleInsights);
    app.mount(vueContainer.current);

    return () => app.unmount();
  }, []);

  return <div ref={vueContainer}></div>;
};

export default LearningStyleInsightsWrapper;
