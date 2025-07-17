/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Safely converts a date value to a Date object
 * @param date - Date value (Date object, string, or timestamp)
 * @returns Date object or null if invalid
 */
export const toDate = (date: any): Date | null => {
  try {
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? null : date
    }
    
    if (typeof date === 'string' || typeof date === 'number') {
      const d = new Date(date)
      return isNaN(d.getTime()) ? null : d
    }
    
    // Handle Firestore Timestamp objects
    if (date && typeof date === 'object' && date.toDate) {
      return date.toDate()
    }
    
    return null
  } catch (error) {
    return null
  }
}

/**
 * Formats a date for display
 * @param date - Date value to format
 * @returns Formatted date string or 'Invalid date' if invalid
 */
export const formatDate = (date: any): string => {
  const d = toDate(date)
  if (!d) return 'Invalid date'
  
  return d.toLocaleDateString()
}

/**
 * Formats a date with time for display
 * @param date - Date value to format
 * @returns Formatted date and time string or 'Invalid date' if invalid
 */
export const formatDateTime = (date: any): string => {
  const d = toDate(date)
  if (!d) return 'Invalid date'
  
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

/**
 * Formats a date with full time for display
 * @param date - Date value to format
 * @returns Formatted date and time string or 'Invalid date' if invalid
 */
export const formatFullDateTime = (date: any): string => {
  const d = toDate(date)
  if (!d) return 'Invalid date'
  
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

/**
 * Gets the timestamp from a date value
 * @param date - Date value
 * @returns Timestamp in milliseconds or 0 if invalid
 */
export const getTimestamp = (date: any): number => {
  const d = toDate(date)
  return d ? d.getTime() : 0
}

/**
 * Checks if a date is valid
 * @param date - Date value to check
 * @returns True if valid, false otherwise
 */
export const isValidDate = (date: any): boolean => {
  return toDate(date) !== null
}