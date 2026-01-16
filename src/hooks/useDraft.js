import { useState, useEffect, useCallback, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft, hasDraft as checkHasDraft } from '../utils/draftManager';

/**
 * Helper function to check if data has any meaningful content
 * @param {object} dataObj - Data object to check
 * @returns {boolean} - True if at least one field has a non-empty value
 */
const hasMeaningfulData = (dataObj) => {
  if (!dataObj || typeof dataObj !== 'object') return false;
  return Object.values(dataObj).some(value => {
    // Check if value is a non-empty string or number
    if (typeof value === 'string' && value.trim().length > 0) return true;
    if (typeof value === 'number' && value > 0) return true;
    return false;
  });
};

/**
 * Hook for managing draft/autosave functionality
 * @param {string} draftKey - Key for the draft
 * @param {object} initialData - Initial form data
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {object} - Draft management functions and state
 */
export const useDraft = (draftKey, initialData = {}, debounceMs = 800) => {
  const [data, setData] = useState(initialData);
  const [hasDraft, setHasDraft] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const debounceTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const isRestoringRef = useRef(false);
  const userHasInteractedRef = useRef(false); // Track if user has actually changed any field
  const previousDataRef = useRef(initialData); // Track previous data to detect changes

  // Initialize previousDataRef with initial data
  useEffect(() => {
    previousDataRef.current = initialData;
  }, [initialData]); // Update when initialData changes

  // Check for draft on mount and show dialog
  useEffect(() => {
    if (draftKey && checkHasDraft(draftKey)) {
      setHasDraft(true);
      setShowRestoreDialog(true);
    }
    // Don't set isInitialLoadRef to false here - wait until user interacts
  }, [draftKey]);

  // Autosave on data change - ONLY save after user has interacted with the form
  useEffect(() => {
    // Skip if:
    // - No draft key
    // - Still on initial load (before user interaction)
    // - Currently restoring a draft
    // - User hasn't interacted yet
    if (!draftKey || isInitialLoadRef.current || isRestoringRef.current || !userHasInteractedRef.current) {
      if (isRestoringRef.current) {
        // Reset the flag after restoration completes
        setTimeout(() => {
          isRestoringRef.current = false;
          // After restore, user has interacted (they restored the data)
          userHasInteractedRef.current = true;
        }, 100);
      }
      return;
    }

    // Check if data actually changed (not just a re-render)
    const dataChanged = JSON.stringify(previousDataRef.current) !== JSON.stringify(data);
    if (!dataChanged) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      // Update previous data reference AFTER we've confirmed it changed
      previousDataRef.current = data;
      
      // Only save if there's meaningful data (at least one non-empty field)
      if (hasMeaningfulData(data)) {
        console.log('Autosaving draft:', data); // Debug log
        saveDraft(draftKey, data);
        setHasDraft(true);
      } else {
        // If all fields are empty, clear any existing draft
        if (checkHasDraft(draftKey)) {
          clearDraft(draftKey);
          setHasDraft(false);
        }
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, draftKey, debounceMs]);

  // Wrapper for setData that tracks user interaction
  const setDataWithInteraction = useCallback((newDataOrUpdater) => {
    // Mark that user has interacted
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
    userHasInteractedRef.current = true;
    
    // Just call setData - we'll track the change in the effect
    setData(newDataOrUpdater);
  }, []);

  const restoreDraft = useCallback(() => {
    if (draftKey) {
      const draft = loadDraft(draftKey);
      console.log('Restoring draft for key:', draftKey, 'Draft data:', draft); // Debug log
      if (draft && Object.keys(draft).length > 0) {
        isRestoringRef.current = true;
        // Mark that we're restoring, so autosave won't trigger
        userHasInteractedRef.current = false;
        // Close dialog first
        setShowRestoreDialog(false);
        // Restore the draft data to the form - ensure we have a fresh object
        const restoredData = { ...initialData, ...draft };
        console.log('Setting restored data:', restoredData); // Debug log
        previousDataRef.current = restoredData; // Update previous data ref
        setData(restoredData);
        // Clear the draft from localStorage after restoring
        clearDraft(draftKey);
        setHasDraft(false);
        // Reset the flag after a brief delay to allow state update
        setTimeout(() => {
          isRestoringRef.current = false;
          // After restore, user has interacted (they restored the data)
          userHasInteractedRef.current = true;
          isInitialLoadRef.current = false;
          console.log('Restore complete, data should be visible now'); // Debug log
        }, 200);
      } else {
        // No valid draft, just close dialog
        console.log('No draft found or draft is empty for key:', draftKey); // Debug log
        setShowRestoreDialog(false);
        setHasDraft(false);
      }
    } else {
      setShowRestoreDialog(false);
    }
  }, [draftKey, initialData]);

  const discardDraft = useCallback(() => {
    if (draftKey) {
      clearDraft(draftKey);
    }
    setHasDraft(false);
    setShowRestoreDialog(false);
  }, [draftKey]);

  const clearDraftData = useCallback(() => {
    if (draftKey) {
      clearDraft(draftKey);
    }
    setHasDraft(false);
  }, [draftKey]);

  return {
    data,
    setData: setDataWithInteraction, // Return the wrapper that tracks interaction
    hasDraft,
    showRestoreDialog,
    restoreDraft,
    discardDraft,
    clearDraftData,
  };
};
