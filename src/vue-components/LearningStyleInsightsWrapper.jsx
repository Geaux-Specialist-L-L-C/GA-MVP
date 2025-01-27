import React, { useEffect, useRef } from "react";
import { createApp } from "vue";
import LearningStyleInsights from "./LearningStyleInsights.vue";

const LearningStyleInsightsWrapper = () => {
  const vueContainer = useRef(null);

  useEffect(() => {
    const app = createApp(LearningStyleInsights);
    app.mount(vueContainer.current);

    return () => app.unmount();
  }, []);

  return <div ref={vueContainer}></div>;
};

export default LearningStyleInsightsWrapper;
