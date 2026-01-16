import { DIAGNOSIS_TYPES } from '../config/diagnosisTypes';

// Get all diagnosis translations
const DIAGNOSIS_TRANSLATIONS = {
  'Cerebral palsy': { en: 'Cerebral palsy', ar: 'شلل دماغي' },
  'Developmental Delay Milestone': { en: 'Developmental Delay Milestone', ar: 'تأخر النمو والتطور' },
  'ASD': { en: 'ASD', ar: 'طيف التوحد' },
  'ADHD': { en: 'ADHD', ar: 'اضطراب فرط الحركة ونقص الانتباه' },
  'Syndromes': { en: 'Syndromes', ar: 'متلازمات' },
  'Other': { en: 'Other', ar: 'أخرى' },
};

/**
 * Convert diagnosis key to diagnosis object with translations
 * @param {string} key - Diagnosis key (e.g., "Cerebral palsy", "Other")
 * @param {string} customText - Custom text for "Other" (optional)
 * @returns {object} - Diagnosis object { en, ar }
 */
export const getDiagnosisObject = (key, customText = '') => {
  if (!key) return null;
  
  // If it's "Other" with custom text
  if (key === 'Other' && customText) {
    // Store custom text in both languages (user typed it, we don't know which language)
    return { en: customText, ar: customText };
  }
  
  // If it's a predefined diagnosis
  if (DIAGNOSIS_TRANSLATIONS[key]) {
    return DIAGNOSIS_TRANSLATIONS[key];
  }
  
  // If it's already an object, return as is (for backward compatibility)
  if (typeof key === 'object' && key.en && key.ar) {
    return key;
  }
  
  // Fallback: treat as text in both languages
  return { en: key, ar: key };
};

/**
 * Get diagnosis display text based on current language
 * @param {object|string} diagnosis - Diagnosis object { en, ar } or string (for backward compatibility)
 * @param {string} language - Current language ('en' or 'ar')
 * @returns {string} - Display text in current language
 */
export const getDiagnosisDisplayText = (diagnosis, language = 'en') => {
  if (!diagnosis) return '';
  
  // If it's an object with en/ar
  if (typeof diagnosis === 'object' && diagnosis.en !== undefined) {
    return diagnosis[language] || diagnosis.en || '';
  }
  
  // Backward compatibility: if it's a string, return as is
  return diagnosis || '';
};

/**
 * Check if diagnosis is a predefined type key
 * @param {string} value - Diagnosis value (could be translated string or key)
 * @param {function} t - Translation function
 * @returns {string|null} - Diagnosis key or null
 */
export const getDiagnosisKeyFromValue = (value, t) => {
  if (!value) return null;
  
  // Check if it matches any translation
  for (const key of DIAGNOSIS_TYPES) {
    const enTranslation = DIAGNOSIS_TRANSLATIONS[key]?.en || key;
    const arTranslation = DIAGNOSIS_TRANSLATIONS[key]?.ar || key;
    const currentTranslation = t(`diagnosisTypes.${key}`, key);
    
    if (value === key || value === enTranslation || value === arTranslation || value === currentTranslation) {
      return key;
    }
  }
  
  return null;
};

/**
 * Get diagnosis key and custom text from diagnosis object
 * @param {object|string} diagnosis - Diagnosis object { en, ar } or string (for backward compatibility)
 * @param {function} t - Translation function
 * @returns {{key: string, customText: string}} - Diagnosis key and custom text
 */
export const getDiagnosisKeyFromObject = (diagnosis, t) => {
  if (!diagnosis) return { key: '', customText: '' };
  
  // If it's already a string (backward compatibility)
  if (typeof diagnosis === 'string') {
    const key = getDiagnosisKeyFromValue(diagnosis, t);
    if (key && key !== 'Other') {
      return { key, customText: '' };
    }
    return { key: 'Other', customText: diagnosis };
  }
  
  // If it's an object
  if (typeof diagnosis === 'object' && diagnosis.en !== undefined) {
    // Check if en and ar are the same and match a predefined type
    for (const key of DIAGNOSIS_TYPES) {
      const translations = DIAGNOSIS_TRANSLATIONS[key];
      if (translations && diagnosis.en === translations.en && diagnosis.ar === translations.ar) {
        return { key, customText: '' };
      }
    }
    
    // Check if it's "Other"
    if (diagnosis.en === 'Other' && diagnosis.ar === 'أخرى') {
      return { key: 'Other', customText: '' };
    }
    
    // It's custom text (Other with custom input)
    // The custom text is stored in both en and ar (same value)
    return { key: 'Other', customText: diagnosis.en || diagnosis.ar || '' };
  }
  
  return { key: '', customText: '' };
};
