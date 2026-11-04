// src/lib/activity.ts

/**
 * Audit logging utility.
 * Currently uses a safe console mock to prevent build/runtime crashes.
 * 
 * To enable real database logging later:
 * 1. Create an `audit_logs` table in Supabase.
 * 2. Import supabase and auth here.
 * 3. Replace the console.log with a supabase.from('audit_logs').insert(...) call.
 */
export async function logActivity(
  event: string,
  table: string,
  recordId: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    // Safe mock for deployment (Logs to browser console)
    console.log(
      `[Audit] ${new Date().toISOString()} | ${event} on ${table} (${recordId})`,
      metadata
    );
    
    /* 
    // --- FUTURE: Real Supabase Implementation ---
    // import { supabase } from './supabase'
    // import { useAuthStore } from '@/stores/auth'
    // 
    // const auth = useAuthStore()
    // const { error } = await supabase.from('audit_logs').insert({
    //   event,
    //   table_name: table,
    //   record_id: recordId,
    //   metadata,
    //   user_id: auth.user?.id || null,
    //   created_at: new Date().toISOString(),
    // })
    // if (error) console.error('Failed to write audit log:', error)
    */
    
  } catch (err) {
    // Swallow errors so audit logging never breaks the UI
    console.error('Audit logging failed:', err)
  }
}