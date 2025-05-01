/**
 * Format price to currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format large numbers with K/M suffix
 */
export const formatCompactNumber = (num: number): string => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};

/**
 * Truncate text with ellipsis if it exceeds max length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Calculate bid increase suggestions (10%, 20%, 30% more than current bid)
 */
export const calculateBidSuggestions = (currentBid: number): number[] => {
  return [
    Math.ceil(currentBid * 1.1 / 10) * 10, // 10% increase rounded to nearest 10
    Math.ceil(currentBid * 1.2 / 10) * 10, // 20% increase rounded to nearest 10
    Math.ceil(currentBid * 1.3 / 10) * 10  // 30% increase rounded to nearest 10
  ];
};