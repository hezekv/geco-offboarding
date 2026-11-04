// src/lib/utils.ts

/**
 * Format a date string into a readable format (e.g., "15 Oct 2026")
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Format file size in bytes to human-readable format (e.g., "318 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Determine file type/kind from filename or MIME type
 * Returns uppercase extension or MIME type subtype
 */
export function fileKind(fileName: string, mimeType?: string): string {
  // If MIME type is provided, use it
  if (mimeType) {
    const parts = mimeType.split('/')
    if (parts.length === 2 && parts[1] && parts[1] !== '*') {
      return parts[1].toUpperCase()
    }
  }
  
  // Fallback to file extension
  const ext = fileName.split('.').pop()
  return ext ? ext.toUpperCase() : 'FILE'
}

/**
 * Generate initials from a full name (e.g., "John Doe" → "JD")
 */
export function getInitials(fullName: string): string {
  if (!fullName) return ''
  
  return fullName
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Check if a value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Clamp a number between min and max values
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}