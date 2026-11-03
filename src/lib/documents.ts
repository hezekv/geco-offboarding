/** Document vault helpers: type labels + expiry state machine (60-day warning window). */

export const DOC_TYPE_OPTIONS = [
  { value: 'contract', label: 'Contract' },
  { value: 'id', label: 'Government ID' },
  { value: 'visa', label: 'Visa / Work Permit' },
  { value: 'nda', label: 'NDA' },
  { value: 'certification', label: 'Certification' },
  { value: 'other', label: 'Other' },
] as const

export function docTypeLabel(value: string): string {
  return DOC_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? 'Other'
}

export type ExpiryState = 'expired' | 'expiring' | 'valid' | 'none'

export const EXPIRY_WARNING_DAYS = 60

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export function expiryState(expiresAt: string | null): ExpiryState {
  const days = daysUntil(expiresAt)
  if (days === null) return 'none'
  if (days < 0) return 'expired'
  if (days <= EXPIRY_WARNING_DAYS) return 'expiring'
  return 'valid'
}

export function expiryBadge(state: ExpiryState): { label: string; cls: string } {
  switch (state) {
    case 'expired': return { label: 'Expired', cls: 'bg-[#C24152] text-white' }
    case 'expiring': return { label: 'Expiring soon', cls: 'bg-[#B0761A] text-white' }
    case 'valid': return { label: 'Valid', cls: 'bg-[#177245] text-white' }
    default: return { label: 'No expiry', cls: 'bg-[#e5eaf1] text-[#7b8794]' }
  }
}

/** Consultant lifecycle pill styles (shared by list + detail). */
export function consultantStatusPill(status: string): { label: string; cls: string } {
  switch (status) {
    case 'prospect': return { label: 'Prospect', cls: 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink' }
    case 'active': return { label: 'Active', cls: 'bg-[#177245] text-white' }
    case 'on_bench': return { label: 'On Bench', cls: 'bg-[#B0761A] text-white' }
    case 'offboarding': return { label: 'Offboarding', cls: 'bg-[#0E5A8C] text-white' }
    case 'offboarded': return { label: 'Offboarded', cls: 'bg-[#e5eaf1] text-[#7b8794]' }
    default: return { label: status, cls: 'bg-[#e5eaf1] text-[#7b8794]' }
  }
}