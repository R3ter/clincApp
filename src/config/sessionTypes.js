/**
 * Default session types - can be customized
 * These are the keys used for translations
 */
export const DEFAULT_SESSION_TYPES = [
  'CBT',
  'DBT',
  'Psychodynamic Therapy',
  'Family Therapy',
  'Group Therapy',
  'Individual Therapy',
  'Assessment',
  'Follow-up',
  'Consultation',
];

/**
 * Get translated session types based on current language
 */
export const getTranslatedSessionTypes = (t) => {
  return DEFAULT_SESSION_TYPES.map(type => ({
    key: type,
    label: t(`sessionTypes.${type}`, type), // Fallback to key if translation not found
  }));
};
