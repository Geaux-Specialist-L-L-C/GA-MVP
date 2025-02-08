import React, { useEffect, useRef } from 'react';
import { createApp, App } from 'vue';

interface VueWrapperProps {
  component: any; // Vue component
  props?: Record<string, any>;
}

const VueWrapper: React.FC<VueWrapperProps> = ({ component, props = {} }) => {
  const vueRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!vueRef.current || !component) return;

    if (!appRef.current) {
      appRef.current = createApp(component, props);
      appRef.current.mount(vueRef.current);
    }

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component, props]);

  return <div ref={vueRef} />;
};

export default VueWrapper;