import React from 'react';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import styles from './ResumeDraftModal.module.css';

export const ResumeDraftModal = ({ 
  isOpen, 
  timestamp, 
  onResume, 
  onDiscard 
}) => {
  if (!isOpen) return null;

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <Clock size={48} className={styles.icon} />
        </div>
        
        <h2 id="modal-title" className={styles.title}>
          Resume Your Application?
        </h2>
        
        <p className={styles.message}>
          We found an incomplete registration saved {formatTimestamp(timestamp)}. 
          Would you like to continue where you left off?
        </p>
        
        <div className={styles.actions}>
          <Button 
            onClick={onDiscard} 
            variant="secondary"
            icon={<Trash2 size={18} />}
          >
            Start Fresh
          </Button>
          <Button 
            onClick={onResume}
            icon={<ArrowRight size={18} />}
          >
            Resume
          </Button>
        </div>

        <p className={styles.note}>
          Your data is stored locally on this device only.
        </p>
      </div>
    </div>
  );
};