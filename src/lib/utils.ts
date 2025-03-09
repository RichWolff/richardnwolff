import { format, parseISO } from 'date-fns';

/**
 * Format a date string into ISO format (YYYY-MM-DD)
 * @param dateString - ISO date string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'yyyy-MM-dd');
}

/**
 * Calculate reading time for a given text
 * @param text - The text content
 * @returns Reading time in minutes as a string
 */
export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
} 