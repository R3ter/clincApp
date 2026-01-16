/**
 * Draft/Autosave manager using LocalStorage
 */

const DRAFT_PREFIX = 'clinic_draft_';

export const DraftKeys = {
  PATIENT_CREATE: 'patient_create',
  PATIENT_EDIT: (patientId) => `patient_edit_${patientId}`,
  SESSION_CREATE: (patientId) => `session_create_${patientId}`,
  SESSION_EDIT: (patientId, sessionId) => `session_edit_${patientId}_${sessionId}`,
};

/**
 * Save draft to LocalStorage
 * @param {string} key - Draft key
 * @param {object} data - Data to save
 */
export const saveDraft = (key, data) => {
  try {
    const storageKey = `${DRAFT_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

/**
 * Load draft from LocalStorage
 * @param {string} key - Draft key
 * @returns {object|null} - Draft data or null
 */
export const loadDraft = (key) => {
  try {
    const storageKey = `${DRAFT_PREFIX}${key}`;
    const item = localStorage.getItem(storageKey);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    return parsed.data;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

/**
 * Clear draft from LocalStorage
 * @param {string} key - Draft key
 */
export const clearDraft = (key) => {
  try {
    const storageKey = `${DRAFT_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

/**
 * Check if draft exists
 * @param {string} key - Draft key
 * @returns {boolean} - True if draft exists
 */
export const hasDraft = (key) => {
  try {
    const storageKey = `${DRAFT_PREFIX}${key}`;
    return localStorage.getItem(storageKey) !== null;
  } catch (error) {
    return false;
  }
};
