import { useEffect, useRef, useCallback, useState } from 'react';
import { debounce } from '../utils/helpers';
import { StorageManager } from '../utils/storageManager';

export const useAutoSaveWithSync = (data, key, options = {}) => {
  const {
    delay = 2000,
    syncToServer = false,
    onSyncSuccess = null,
    onSyncError = null
  } = options;

  const isInitialMount = useRef(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Save to localStorage
  const saveLocal = useCallback((dataToSave) => {
    try {
      const serialized = JSON.stringify(dataToSave);
      localStorage.setItem(key, serialized);
      const timestamp = new Date().toISOString();
      localStorage.setItem(`${key}_timestamp`, timestamp);
      setLastSaved(timestamp);
      setSaveError(null);
      console.log('✅ Saved locally:', key);
      return true;
    } catch (error) {
      console.error('Failed to save locally:', error);
      setSaveError(error.message);
      
      if (error.name === 'QuotaExceededError') {
        StorageManager.cleanOldDrafts();
        // Try again after cleaning
        try {
          const serialized = JSON.stringify(dataToSave);
          localStorage.setItem(key, serialized);
          return true;
        } catch (retryError) {
          console.error('Still failed after cleanup:', retryError);
        }
      }
      return false;
    }
  }, [key]);

  // Sync to server (if online)
  const syncToServerFunc = useCallback(async (dataToSync) => {
    if (!syncToServer || !navigator.onLine) return;

    setIsSyncing(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          data: dataToSync,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Server sync failed');

      const result = await response.json();
      console.log('☁️ Synced to server:', result);
      onSyncSuccess?.(result);
    } catch (error) {
      console.error('Server sync error:', error);
      onSyncError?.(error);
      // Continue with local save even if server sync fails
    } finally {
      setIsSyncing(false);
    }
  }, [key, syncToServer, onSyncSuccess, onSyncError]);

  // Debounced save function
  const debouncedSave = useRef(
    debounce(async (dataToSave) => {
      const localSaved = saveLocal(dataToSave);
      if (localSaved && syncToServer) {
        await syncToServerFunc(dataToSave);
      }
    }, delay)
  ).current;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (data && Object.keys(data).length > 0) {
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  // Load saved data
  const loadSavedData = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      
      if (saved) {
        return { data: JSON.parse(saved), timestamp };
      }
      return null;
    } catch (error) {
      console.error('Failed to load saved data:', error);
      return null;
    }
  }, [key]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
      setLastSaved(null);
      console.log('🗑️ Cleared saved data');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }, [key]);

  return {
    loadSavedData,
    clearSavedData,
    lastSaved,
    saveError,
    isSyncing
  };
};
