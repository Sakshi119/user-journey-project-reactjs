import { useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/helpers';

export const useAutoSave = (data, key, delay = 2000) => {
  const isInitialMount = useRef(true);
  const lastSavedData = useRef(null);

  // Debounced save function
  const debouncedSave = useRef(
    debounce((dataToSave) => {
      try {
        // Don't save if data is empty on all fields
        const isEmpty = 
          !dataToSave.mobile &&
          Object.keys(dataToSave.personal || {}).length === 0 &&
          Object.keys(dataToSave.nominee || {}).length === 0 &&
          Object.keys(dataToSave.bank || {}).length === 0 &&
          Object.keys(dataToSave.documents || {}).length === 0;

        if (isEmpty) {
          console.log('⏭️ Skipping save - no data to save');
          return;
        }

        const serialized = JSON.stringify(dataToSave);
        
        // Only save if data has actually changed
        if (serialized === lastSavedData.current) {
          console.log('⏭️ Skipping save - data unchanged');
          return;
        }

        localStorage.setItem(key, serialized);
        const timestamp = new Date().toISOString();
        localStorage.setItem(`${key}_timestamp`, timestamp);
        lastSavedData.current = serialized;
        
        console.log('✅ Auto-saved:', key, 'at', new Date(timestamp).toLocaleTimeString());
      } catch (error) {
        console.error('❌ Failed to save data:', error);
        
        // Handle quota exceeded
        if (error.name === 'QuotaExceededError') {
          console.warn('⚠️ Storage quota exceeded. Clearing old data...');
          clearOldData();
        }
      }
    }, delay)
  ).current;

  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Save data when it changes
    if (data && typeof data === 'object') {
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  // Load saved data
  const loadSavedData = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (saved) {
        const data = JSON.parse(saved);
        lastSavedData.current = saved; // Store to prevent immediate re-save
        console.log('📦 Loaded saved data from', new Date(timestamp).toLocaleString());
        return { data, timestamp };
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to load saved data:', error);
      return null;
    }
  }, [key]);

  // Clear saved data - ONLY when explicitly called
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
      lastSavedData.current = null;
      console.log('🗑️ Cleared saved data:', key);
    } catch (error) {
      console.error('❌ Failed to clear saved data:', error);
    }
  }, [key]);

  return { loadSavedData, clearSavedData };
};

// Clear old data if quota exceeded
const clearOldData = () => {
  const keys = Object.keys(localStorage);
  const timestampKeys = keys.filter(k => k.endsWith('_timestamp'));
  
  if (timestampKeys.length === 0) return;
  
  // Sort by timestamp and remove oldest
  timestampKeys.sort((a, b) => {
    const timeA = new Date(localStorage.getItem(a));
    const timeB = new Date(localStorage.getItem(b));
    return timeA - timeB;
  });
  
  // Remove oldest entry (but not current draft)
  const oldestKey = timestampKeys[0].replace('_timestamp', '');
  if (oldestKey !== 'registration_draft') {
    localStorage.removeItem(oldestKey);
    localStorage.removeItem(`${oldestKey}_timestamp`);
    console.log('🗑️ Removed old draft:', oldestKey);
  }
};