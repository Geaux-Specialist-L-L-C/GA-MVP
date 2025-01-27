import React, { useEffect, useRef } from "react";
import { createApp } from "vue";
import CurriculumApproval from "./CurriculumApproval.vue";

const CurriculumApprovalWrapper = () => {
  const vueContainer = useRef(null);

  useEffect(() => {
    // Mount the Vue component dynamically
    const app = createApp(CurriculumApproval);
    app.mount(vueContainer.current);

    // Cleanup when unmounting React component
    return () => {
      app.unmount();
    };
  }, []);

  return (
    <div>
      <h2>Curriculum Approval (Vue)</h2>
      <div ref={vueContainer}></div>
    </div>
  );
};

export default CurriculumApprovalWrapper;
