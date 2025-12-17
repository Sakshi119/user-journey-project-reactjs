import React, { useState, useEffect } from 'react';
import { Cloud, Check, AlertCircle } from 'lucide-react';
import styles from './AutoSaveIndicator.module.css';

export const AutoSaveIndicator = ({ lastSaved, error }) => {
  const [status, setStatus] = useState('saved'); // 'saving', 'saved', 'error'

  useEffect(() => {
    if (error) {
      setStatus('error');
      return;
    }

    if (lastSaved) {
      setStatus('saving');
      const timer = setTimeout(() => setStatus('saved'), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, error]);

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    
    const date = new Date(lastSaved);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className={`${styles.indicator} ${styles[status]}`}>
      {status === 'saving' && (
        <>
          <Cloud size={16} className={styles.spin} />
          <span>Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <Check size={16} />
          <span>Saved {formatLastSaved()}</span>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle size={16} />
          <span>Save failed</span>
        </>
      )}
    </div>
  );
};