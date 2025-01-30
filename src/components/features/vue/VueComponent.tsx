import React from 'react';
import VueComponentWrapper from './VueComponentWrapper';

interface VueComponentProps {
  // Add any props if needed
}

const VueComponent: React.FC<VueComponentProps> = () => {
  return (
    <div>
      <h1>React + Vue Integration</h1>
      <VueComponentWrapper />
    </div>
  );
};

export default VueComponent;
