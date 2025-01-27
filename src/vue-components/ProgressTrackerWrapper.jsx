import React, { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import ProgressTracker from './ProgressTracker.vue';

const ProgressTrackerWrapper = () => {
  const vueContainer = useRef(null);

  useEffect(() => {
    // Mount the Vue component dynamically
    const app = createApp(ProgressTracker);
    app.mount(vueContainer.current);

    // Cleanup Vue instance on unmount
    return () => {
      app.unmount();
    };
  }, []);

  return (
    <div>
      <h2>Progress Tracker (Vue)</h2>
      <div ref={vueContainer}></div>
    </div>
  );
};

export default ProgressTrackerWrapper;
