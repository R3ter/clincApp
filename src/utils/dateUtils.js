import { format, parse, differenceInMonths, isValid } from 'date-fns';

/**
 * Calculate age from birth date
 * @param {string|Date|number} birthDate - Birth date (string, Date, or milliseconds timestamp)
 * @returns {{years: number, months: number}|null} - Age in years and months or null if invalid
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    let date;
    if (typeof birthDate === 'string') {
      date = parse(birthDate, 'yyyy-MM-dd', new Date());
    } else if (typeof birthDate === 'number') {
      // Realtime Database timestamp (milliseconds)
      date = new Date(birthDate);
    } else if (birthDate.toDate) {
      // Firestore Timestamp (if still used)
      date = birthDate.toDate();
    } else {
      date = birthDate;
    }
    
    if (!isValid(date)) return null;
    
    const today = new Date();
    const totalMonths = differenceInMonths(today, date);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    return { years, months };
  } catch (error) {
    return null;
  }
};

/**
 * Format date for display
 * @param {string|Date|number} date - Date to format (string, Date, or milliseconds timestamp)
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    let dateObj;
    if (typeof date === 'string') {
      dateObj = parse(date, 'yyyy-MM-dd', new Date());
    } else if (typeof date === 'number') {
      // Realtime Database timestamp (milliseconds)
      dateObj = new Date(date);
    } else if (date.toDate) {
      // Firestore Timestamp (if still used)
      dateObj = date.toDate();
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, formatStr);
  } catch (error) {
    return '';
  }
};

/**
 * Format date for input field (yyyy-MM-dd)
 * @param {string|Date|number} date - Date to format (string, Date, or milliseconds timestamp)
 * @returns {string} - Formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  try {
    let dateObj;
    if (typeof date === 'string') {
      dateObj = parse(date, 'yyyy-MM-dd', new Date());
    } else if (typeof date === 'number') {
      // Realtime Database timestamp (milliseconds)
      dateObj = new Date(date);
    } else if (date.toDate) {
      // Firestore Timestamp (if still used)
      dateObj = date.toDate();
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};
