/**
 * Insurance types - can be customized
 * These are the keys used for translations
 */
export const INSURANCE_TYPES = [
  'Private',
  'Maccabi',
  'Clalit',
  'Meuhedet',
  'Leumit',
  'Palestinian Authority',
];

/**
 * Get translated insurance types based on current language
 */
export const getTranslatedInsuranceTypes = (t) => {
  return INSURANCE_TYPES.map(type => ({
    key: type,
    label: t(`insuranceTypes.${type}`, type), // Fallback to key if translation not found
  }));
};
