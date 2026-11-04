import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export type ActivityAction =
  | 'offboarding.created' | 'offboarding.sent' | 'offboarding.archived' | 'offboarding.deleted'
  | 'onboarding.created' | 'onboarding.sent' | 'onboarding.archived' | 'onboarding.deleted'
  | 'task.completed' | 'task.reopened'
  | 'requirement.added' | 'requirement.renamed' | 'requirement.deleted'
  | 'file.uploaded' | 'file.removed'
  | 'consultant.created' | 'consultant.updated' | 'consultant.status_changed'
  | 'document.uploaded' | 'document.updated' | 'document.removed'

/** Fire-and-forget audit log. Never blocks the UI; failures are console-only. */
export function logActivity(
  action: ActivityAction,
  entityType: string,
  entityId: string | null,
  meta: Record<string, any> = {}
) {
  const auth = useAuthStore()
  supabase
    .from('activity_logs')
    .insert({
      actor_id: auth.user?.id ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      meta,
    })
    .then(({ error }) => {
      if (error) console.error('Activity log failed:', error)
    })
}