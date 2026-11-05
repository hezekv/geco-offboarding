import { supabase } from './supabase'
import { useAuthStore } from '@/stores/auth'

/**
 * Logs a user action to the activity_logs table.
 */
export async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  meta: any = {}
) {
  const auth = useAuthStore()
  if (!auth.user) return

  // ✅ Cast as any to prevent TS build errors
  await (supabase as any)
    .from('activity_logs')
    .insert({
      actor_id: auth.user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      meta
    })
}