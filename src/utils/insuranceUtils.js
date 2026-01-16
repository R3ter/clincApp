import { INSURANCE_TYPES } from '../config/insuranceTypes';

// Get all insurance translations
const INSURANCE_TRANSLATIONS = {
  'Private': { en: 'Private', ar: 'خاص' },
  'Maccabi': { en: 'Maccabi', ar: 'مكابي' },
  'Clalit': { en: 'Clalit', ar: 'كلاليت' },
  'Meuhedet': { en: 'Meuhedet', ar: 'مئوحيدت' },
  'Leumit': { en: 'Leumit', ar: 'ليؤوميت' },
  'Palestinian Authority': { en: 'Palestinian Authority', ar: 'سلطة فلسطينية' },
};

/**
 * Convert insurance key to insurance object with translations
 * @param {string} key - Insurance key (e.g., "Private", "Maccabi")
 * @returns {object} - Insurance object { en, ar }
 */
export const getInsuranceObject = (key) => {
  if (!key) return null;
  
  // If it's a predefined insurance type
  if (INSURANCE_TRANSLATIONS[key]) {
    return INSURANCE_TRANSLATIONS[key];
  }
  
  // If it's already an object, return as is (for backward compatibility)
  if (typeof key === 'object' && key.en && key.ar) {
    return key;
  }
  
  // Fallback: treat as text in both languages
  return { en: key, ar: key };
};

/**
 * Get insurance display text based on current language
 * @param {object|string} insurance - Insurance object { en, ar } or string (for backward compatibility)
 * @param {string} language - Current language ('en' or 'ar')
 * @returns {string} - Display text in current language
 */
export const getInsuranceDisplayText = (insurance, language = 'en') => {
  if (!insurance) return '';
  
  // If it's an object with en/ar
  if (typeof insurance === 'object' && insurance.en !== undefined) {
    return insurance[language] || insurance.en || '';
  }
  
  // Backward compatibility: if it's a string, return as is
  return insurance || '';
};

/**
 * Get insurance key from insurance object or string
 * @param {object|string} insurance - Insurance object { en, ar } or string (for backward compatibility)
 * @param {function} t - Translation function
 * @returns {string} - Insurance key
 */
export const getInsuranceKeyFromObject = (insurance, t) => {
  if (!insurance) return '';
  
  // If it's a string (backward compatibility)
  if (typeof insurance === 'string') {
    // Check if it matches any predefined type
    for (const key of INSURANCE_TYPES) {
      const enTranslation = INSURANCE_TRANSLATIONS[key]?.en || key;
      const arTranslation = INSURANCE_TRANSLATIONS[key]?.ar || key;
      const currentTranslation = t(`insuranceTypes.${key}`, key);
      
      if (insurance === key || insurance === enTranslation || insurance === arTranslation || insurance === currentTranslation) {
        return key;
      }
    }
    // If string doesn't match any predefined, return as is
    return insurance;
  }
  
  // If it's an object
  if (typeof insurance === 'object' && insurance.en !== undefined) {
    // Check if it matches any predefined type
    for (const key of INSURANCE_TYPES) {
      const translations = INSURANCE_TRANSLATIONS[key];
      if (translations && insurance.en === translations.en && insurance.ar === translations.ar) {
        return key;
      }
    }
    // If not predefined, return en value
    return insurance.en || insurance.ar || '';
  }
  
  return '';
};
