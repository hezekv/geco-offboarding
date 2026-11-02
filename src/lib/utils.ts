import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** Short MIME shortcuts for files without a usable extension */
const MIME_SHORT: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.ms-powerpoint': 'PPT',
  'text/plain': 'TXT',
  'text/csv': 'CSV',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/gif': 'GIF',
  'image/webp': 'WEBP',
  'image/svg+xml': 'SVG',
}

/**
 * Human-friendly file kind for chips, e.g. "DOCX", "PDF", "XLSX".
 * Prefers the real extension from the file name (always accurate),
 * falls back to known MIME shortcuts, and guards against long
 * vendor MIME strings like application/vnd.openxmlformats-...
 */
export function fileKind(fileName?: string | null, mimeType?: string | null): string {
  const ext = fileName && fileName.includes('.') ? fileName.split('.').pop() || '' : ''
  if (ext && ext.length <= 5) return ext.toUpperCase()
  if (mimeType && MIME_SHORT[mimeType]) return MIME_SHORT[mimeType]
  const seg = (mimeType || 'file').split('/').pop() || 'file'
  return seg.length > 8 ? 'FILE' : seg.toUpperCase()
}