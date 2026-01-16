/**
 * Diagnosis types - can be customized
 * These are the keys used for translations
 */
export const DIAGNOSIS_TYPES = [
  'Cerebral palsy',
  'Developmental Delay Milestone',
  'ASD',
  'ADHD',
  'Syndromes',
  'Other',
];

/**
 * Get translated diagnosis types based on current language
 */
export const getTranslatedDiagnosisTypes = (t) => {
  return DIAGNOSIS_TYPES.map(type => ({
    key: type,
    label: t(`diagnosisTypes.${type}`, type), // Fallback to key if translation not found
  }));
};
