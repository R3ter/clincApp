import { DEFAULT_SESSION_TYPES } from '../config/sessionTypes';

// Get all session type translations
const SESSION_TYPE_TRANSLATIONS = {
  'CBT': { en: 'CBT', ar: 'العلاج المعرفي السلوكي' },
  'DBT': { en: 'DBT', ar: 'العلاج السلوكي الجدلي' },
  'Psychodynamic Therapy': { en: 'Psychodynamic Therapy', ar: 'العلاج النفسي الديناميكي' },
  'Family Therapy': { en: 'Family Therapy', ar: 'العلاج الأسري' },
  'Group Therapy': { en: 'Group Therapy', ar: 'العلاج الجماعي' },
  'Individual Therapy': { en: 'Individual Therapy', ar: 'العلاج الفردي' },
  'Assessment': { en: 'Assessment', ar: 'التقييم' },
  'Follow-up': { en: 'Follow-up', ar: 'المتابعة' },
  'Consultation': { en: 'Consultation', ar: 'استشارة' },
};

/**
 * Convert session type key to session type object with translations
 * @param {string} key - Session type key (e.g., "CBT", "Individual Therapy")
 * @param {string} customText - Custom text for custom session types (optional)
 * @returns {object} - Session type object { en, ar }
 */
export const getSessionTypeObject = (key, customText = '') => {
  if (!key) return null;
  
  // If it's a predefined session type
  if (SESSION_TYPE_TRANSLATIONS[key]) {
    return SESSION_TYPE_TRANSLATIONS[key];
  }
  
  // If it's already an object, return as is (for backward compatibility)
  if (typeof key === 'object' && key.en && key.ar) {
    return key;
  }
  
  // Fallback: treat as custom text in both languages (user typed it, we don't know which language)
  const textToUse = customText || key;
  return { en: textToUse, ar: textToUse };
};

/**
 * Get session type display text based on current language
 * @param {object|string} sessionType - Session type object { en, ar } or string (for backward compatibility)
 * @param {string} language - Current language ('en' or 'ar')
 * @returns {string} - Display text in current language
 */
export const getSessionTypeDisplayText = (sessionType, language = 'en') => {
  if (!sessionType) return '';
  
  // If it's an object with en/ar
  if (typeof sessionType === 'object' && sessionType.en !== undefined) {
    return sessionType[language] || sessionType.en || '';
  }
  
  // Backward compatibility: if it's a string, return as is
  return sessionType || '';
};

/**
 * Get session type key from session type object or string
 * @param {object|string} sessionType - Session type object { en, ar } or string (for backward compatibility)
 * @param {function} t - Translation function
 * @returns {string} - Session type key or the custom text
 */
export const getSessionTypeKeyFromObject = (sessionType, t) => {
  if (!sessionType) return '';
  
  // If it's a string (backward compatibility)
  if (typeof sessionType === 'string') {
    // Check if it matches any predefined type
    for (const key of DEFAULT_SESSION_TYPES) {
      const enTranslation = SESSION_TYPE_TRANSLATIONS[key]?.en || key;
      const arTranslation = SESSION_TYPE_TRANSLATIONS[key]?.ar || key;
      const currentTranslation = t(`sessionTypes.${key}`, key);
      
      if (sessionType === key || sessionType === enTranslation || sessionType === arTranslation || sessionType === currentTranslation) {
        return key;
      }
    }
    // It's a custom session type
    return sessionType;
  }
  
  // If it's an object
  if (typeof sessionType === 'object' && sessionType.en !== undefined) {
    // Check if it matches any predefined type
    for (const key of DEFAULT_SESSION_TYPES) {
      const translations = SESSION_TYPE_TRANSLATIONS[key];
      if (translations && sessionType.en === translations.en && sessionType.ar === translations.ar) {
        return key;
      }
    }
    // It's a custom session type (user typed it)
    return sessionType.en || sessionType.ar || '';
  }
  
  return '';
};
