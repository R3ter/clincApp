/**
 * Validates Israeli ID number (9 digits with checksum)
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid
 */
export const validateIsraeliId = (id) => {
  if (!id) return false;
  
  // Remove any non-digit characters
  const cleanId = id.replace(/\D/g, '');
  
  // Must be 9 digits
  if (cleanId.length !== 9) return false;
  
  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleanId[i], 10);
    // Multiply by 1 or 2 alternately
    if (i % 2 === 0) {
      sum += digit;
    } else {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
      sum += digit;
    }
  }
  
  // Valid if sum is divisible by 10
  return sum % 10 === 0;
};

/**
 * Cleans Israeli ID input (removes non-digits, limits to 9 digits)
 * @param {string} id - The ID to clean
 * @returns {string} - Cleaned ID (up to 9 digits, no padding)
 */
export const cleanIsraeliId = (id) => {
  if (!id) return '';
  const cleanId = id.replace(/\D/g, '');
  // Limit to 9 digits max
  return cleanId.slice(0, 9);
};

/**
 * Formats Israeli ID to 9 digits (pads with leading zeros if needed)
 * Only use this when the user is done typing (on blur/submit)
 * @param {string} id - The ID to format
 * @returns {string} - Formatted 9-digit ID
 */
export const formatIsraeliId = (id) => {
  if (!id) return '';
  const cleanId = id.replace(/\D/g, '');
  return cleanId.padStart(9, '0');
};
