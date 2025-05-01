/**
 * Format a date string into a more readable format
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Calculate time remaining until the end date
 */
export const getTimeRemaining = (endDateString: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} => {
  const total = new Date(endDateString).getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return { days, hours, minutes, seconds, total };
};

/**
 * Format the time remaining as a readable string
 */
export const formatTimeRemaining = (endDateString: string): string => {
  const time = getTimeRemaining(endDateString);
  
  if (time.total <= 0) {
    return 'Auction ended';
  }
  
  if (time.days > 0) {
    return `${time.days}d ${time.hours}h remaining`;
  }
  
  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m remaining`;
  }
  
  return `${time.minutes}m ${time.seconds}s remaining`;
};

/**
 * Check if an auction is ending soon (less than 24 hours)
 */
export const isEndingSoon = (endDateString: string): boolean => {
  const time = getTimeRemaining(endDateString);
  return time.total > 0 && time.total <= 24 * 60 * 60 * 1000;
};

/**
 * Check if an auction has ended
 */
export const hasEnded = (endDateString: string): boolean => {
  return new Date(endDateString).getTime() <= new Date().getTime();
};