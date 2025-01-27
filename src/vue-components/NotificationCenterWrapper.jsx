import React, { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import NotificationCenter from './NotificationCenter.vue';

const NotificationCenterWrapper = () => {
  const vueContainer = useRef(null);

  useEffect(() => {
    const app = createApp(NotificationCenter);
    app.mount(vueContainer.current);

    return () => {
      app.unmount();
    };
  }, []);

  return (
    <div>
      <h2>Vue Notification Center</h2>
      <div ref={vueContainer}></div>
    </div>
  );
};

export default NotificationCenterWrapper;
