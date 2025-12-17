import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import styles from './OfflineBanner.module.css';

export const OfflineBanner = ({ isOnline, wasOffline }) => {
  if (isOnline && !wasOffline) return null;

  return (
    <div 
      className={`${styles.banner} ${isOnline ? styles.online : styles.offline}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        {isOnline ? (
          <>
            <Wifi size={20} />
            <span>You're back online! Your data will be saved.</span>
          </>
        ) : (
          <>
            <WifiOff size={20} />
            <span>You're offline. Your progress is being saved locally.</span>
          </>
        )}
      </div>
    </div>
  );
};