import React, { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import VueParentDashboard from './ParentDashboard.vue';
import api from '../services/api';

const ParentDashboardWrapper = () => {
  const vueContainer = useRef(null);
  const vueAppRef = useRef(null);

  useEffect(() => {
    if (!vueAppRef.current) {
      vueAppRef.current = createApp(VueParentDashboard);
      
      // Provide api instance to Vue app
      vueAppRef.current.provide('api', api);
      
      vueAppRef.current.mount(vueContainer.current);
    }

    return () => {
      if (vueAppRef.current) {
        vueAppRef.current.unmount();
        vueAppRef.current = null;
      }
    };
  }, []);

  return <div className="dashboard-wrapper" ref={vueContainer}></div>;
};

export default ParentDashboardWrapper;
