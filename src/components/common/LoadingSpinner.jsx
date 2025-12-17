import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;