// src/lib/autoSource.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import { logActivity } from '@/lib/activity'

/**
 * Rule grammar:
 *   assets:returned_all            → no assets with status 'assigned' for the consultant
 *   assets:<category>:returned_all → no assets of that category still assigned
 *   accounts:revoked_all           → no system_accounts with status 'active'
 */
export type ParsedRule =
  | { kind: 'assets'; category?: string }
  | { kind: 'accounts' }

export function parseRule(rule: string): ParsedRule | null {
  const parts = String(rule || '').trim().split(':').filter(Boolean)
  if (parts[0] === 'accounts' && parts[1] === 'revoked_all') return { kind: 'accounts' }
  if (parts[0] === 'assets' && parts[parts.length - 1] === 'returned_all') {
    return parts.length === 3 ? { kind: 'assets', category: parts[1] } : { kind: 'assets' }
  }
  return null
}

export async function isRuleSatisfied(
  sb: SupabaseClient,
  rule: string,
  consultantId: string
): Promise<boolean> {
  const parsed = parseRule(rule)
  if (!parsed || !consultantId) return false

  if (parsed.kind === 'assets') {
    let q = sb
      .from('assets')
      .select('id', { count: 'exact', head: true })
      .eq('assigned_to', consultantId)
      .eq('status', 'assigned')
    if (parsed.category) q = q.eq('category', parsed.category)
    const { count, error } = await q
    if (error) return false
    return (count ?? 0) === 0
  }

  const { count, error } = await sb
    .from('system_accounts')
    .select('id', { count: 'exact', head: true })
    .eq('consultant_id', consultantId)
    .eq('status', 'active')
  if (error) return false
  return (count ?? 0) === 0
}

/**
 * Re-evaluates every pending auto-sourced task on the consultant's active
 * offboardings. Returns the titles of tasks it auto-completed.
 * One-way by design: tasks are never auto-reopened.
 */
export async function evaluateAutoSources(
  sb: SupabaseClient,
  consultantId: string,
  onlyOffboardingId?: string | null
): Promise<string[]> {
  const completedTitles: string[] = []

  let obQuery = sb
    .from('offboardings')
    .select('id, consultant_id')
    .in('status', ['sent', 'in_progress'])
  if (onlyOffboardingId) obQuery = obQuery.eq('id', onlyOffboardingId)
  else obQuery = obQuery.eq('consultant_id', consultantId)

  const { data: obs } = await obQuery
  for (const ob of obs || []) {
    const { data: reqs } = await sb
      .from('offboarding_requirements')
      .select('id')
      .eq('offboarding_id', ob.id)
    const reqIds = (reqs || []).map((r: any) => r.id)
    if (!reqIds.length) continue

    const { data: subs } = await sb
      .from('offboarding_sub_requirements')
      .select('id, title, auto_source')
      .in('offboarding_requirement_id', reqIds)
      .eq('status', 'pending')
      .not('auto_source', 'is', null)

    for (const sub of subs || []) {
      if (!sub.auto_source) continue
      const satisfied = await isRuleSatisfied(sb, sub.auto_source, ob.consultant_id)
      if (!satisfied) continue

      const { error } = await sb
        .from('offboarding_sub_requirements')
        .update({ status: 'completed', completed_at: new Date().toISOString(), completed_by: null })
        .eq('id', sub.id)
      if (error) continue

      completedTitles.push(sub.title)
      logActivity('task.auto_completed', 'offboarding_sub_requirement', sub.id, {
        title: sub.title,
        rule: sub.auto_source,
        via: 'auto_source',
      })
    }

    await syncOffboardingLifecycle(sb, ob.id)
  }

  return completedTitles
}

/** sent → in_progress → completed (+ finalize consultant), same rules as the portal. */
export async function syncOffboardingLifecycle(sb: SupabaseClient, offboardingId: string) {
  const { data: ob } = await sb
    .from('offboardings')
    .select('id, status, consultant_id')
    .eq('id', offboardingId)
    .single()
  if (!ob || !['sent', 'in_progress'].includes(ob.status)) return

  const { data: reqs } = await sb
    .from('offboarding_requirements')
    .select('id')
    .eq('offboarding_id', ob.id)
  const reqIds = (reqs || []).map((r: any) => r.id)
  if (!reqIds.length) return

  const { data: subs } = await sb
    .from('offboarding_sub_requirements')
    .select('status')
    .in('offboarding_requirement_id', reqIds)
  const active = (subs || []).filter((s: any) => s.status !== 'disabled')
  const done = active.filter((s: any) => s.status === 'completed').length

  let next = ob.status
  if (next === 'sent' && done > 0) next = 'in_progress'
  if (active.length > 0 && done === active.length) next = 'completed'
  if (next === ob.status) return

  const { error } = await sb.from('offboardings').update({ status: next }).eq('id', ob.id)
  if (error) return
  logActivity('offboarding.status_changed', 'offboarding', ob.id, { to: next, via: 'auto_source' })

  if (next === 'completed') {
    await sb
      .from('consultants')
      .update({ status: 'offboarded', offboarded_at: new Date().toISOString() })
      .eq('id', ob.consultant_id)
    logActivity('consultant.status_changed', 'consultant', ob.consultant_id, {
      to: 'offboarded',
      via: 'offboarding.completed',
    })
  }
}