import React from 'react';
import styles from './shared.module.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles.spinner} />
    </div>
  );
};

export default LoadingSpinner;