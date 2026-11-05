import { supabase } from './supabase'

/**
 * Checks if a consultant has any unapproved timesheets ending on or before their Last Working Day.
 * Returns true if blockers exist (preventing offboarding completion).
 */
export async function hasUnapprovedTimesheets(
  consultantId: string, 
  lastWorkingDay: string | Date
): Promise<boolean> {
  if (!consultantId || !lastWorkingDay) return false

  const lwdString = lastWorkingDay instanceof Date 
    ? lastWorkingDay.toISOString().split('T')[0] 
    : lastWorkingDay

  // ✅ FIX: Added `as any` to bypass strict TS types for the new 'timesheets' table
  const { count, error } = await supabase
    .from('timesheets')
    .select('id', { count: 'exact', head: true })
    .eq('consultant_id', consultantId)
    .lte('period_end', lwdString)
    .neq('status', 'approved') as any

  if (error) {
    console.error('Validator error:', error)
    return false // Fail safe: don't block if query fails, but log it
  }

  return (count ?? 0) > 0
}