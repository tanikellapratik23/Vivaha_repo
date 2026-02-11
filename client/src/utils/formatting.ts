/**
 * Formatting utilities for displaying numbers with commas
 */

/**
 * Format a number with comma separators
 * @param num - The number to format
 * @returns Formatted string with commas (e.g., "1,234,567")
 */
export const formatNumberWithCommas = (num: number | string): string => {
  if (num === null || num === undefined) return '0';
  
  const numStr = typeof num === 'string' ? num : num.toString();
  
  // Handle negative numbers
  const isNegative = numStr.startsWith('-');
  const absoluteStr = isNegative ? numStr.slice(1) : numStr;
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = absoluteStr.split('.');
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Reconstruct the number
  let result = formattedInteger;
  if (decimalPart) {
    result += '.' + decimalPart;
  }
  
  return isNegative ? '-' + result : result;
};

/**
 * Format currency value with commas and dollar sign
 * @param amount - The amount to format
 * @param includeDecimals - Whether to include decimal places (default: true)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount: number, includeDecimals: boolean = true): string => {
  if (amount === null || amount === undefined) return '$0';
  
  const formatted = formatNumberWithCommas(Math.abs(amount));
  const prefix = amount < 0 ? '-$' : '$';
  
  if (!includeDecimals) {
    return prefix + formatted.split('.')[0];
  }
  
  return prefix + formatted;
};

/**
 * Format a percentage value
 * @param value - The value to format (0-100 or decimal 0-1)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "45.5%")
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  if (value === null || value === undefined) return '0%';
  
  // If value is between 0-1, convert to percentage
  const percentage = value > 1 ? value : value * 100;
  
  return percentage.toFixed(decimals) + '%';
};
