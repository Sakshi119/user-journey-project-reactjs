import { useState, useEffect, useCallback } from 'react';
import { useAutoSave } from './useAutoSave';

const STORAGE_KEY = 'registration_draft';

export const useRegistrationData = () => {
  const [registrationData, setRegistrationData] = useState({
    mobile: '',
    personal: {},
    nominee: {},
    bank: {},
    documents: {}
  });

  const [hasDraft, setHasDraft] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState(null);

  const { loadSavedData, clearSavedData } = useAutoSave(
    registrationData,
    STORAGE_KEY,
    2000 // Auto-save after 2 seconds of no changes
  );

  // Check for draft on mount (only once)
  useEffect(() => {
    const saved = loadSavedData();
    if (saved) {
      setHasDraft(true);
      setDraftTimestamp(saved.timestamp);
    }
  }, []); // Empty dependency array - run only once

  // Restore draft data
  const restoreDraft = useCallback(() => {
    const saved = loadSavedData();
    if (saved) {
      console.log('♻️ Restoring draft:', saved.data);
      setRegistrationData(saved.data);
      setHasDraft(false);
      return true;
    }
    return false;
  }, [loadSavedData]);

  // Discard draft
  const discardDraft = useCallback(() => {
    clearSavedData();
    setHasDraft(false);
    setDraftTimestamp(null);
  }, [clearSavedData]);

  // Update registration data - memoized to prevent re-renders
  const updateData = useCallback((section, data) => {
    setRegistrationData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  // Clear all data (after successful submission)
  const clearAll = useCallback(() => {
    setRegistrationData({
      mobile: '',
      personal: {},
      nominee: {},
      bank: {},
      documents: {}
    });
    clearSavedData();
  }, [clearSavedData]);

  return {
    registrationData,
    updateData,
    clearAll,
    hasDraft,
    draftTimestamp,
    restoreDraft,
    discardDraft
  };
};
