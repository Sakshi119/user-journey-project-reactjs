import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import styles from './DataConflictModal.module.css';

export const DataConflictModal = ({
  isOpen,
  localData,
  serverData,
  onUseLocal,
  onUseServer,
  onMerge
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={48} className={styles.icon} />
        </div>

        <h2 className={styles.title}>Data Conflict Detected</h2>

        <p className={styles.message}>
          We found different versions of your registration data. 
          Which version would you like to keep?
        </p>

        <div className={styles.options}>
          <div className={styles.option}>
            <h3>Local Data</h3>
            <p>Saved on this device</p>
            <p className={styles.timestamp}>
              {new Date(localData.timestamp).toLocaleString()}
            </p>
          </div>

          <div className={styles.option}>
            <h3>Server Data</h3>
            <p>Saved online</p>
            <p className={styles.timestamp}>
              {new Date(serverData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={onUseLocal} variant="secondary">
            Use Local
          </Button>
          <Button onClick={onMerge} variant="secondary">
            Merge Both
          </Button>
          <Button onClick={onUseServer}>
            Use Server
          </Button>
        </div>
      </div>
    </div>
  );
};