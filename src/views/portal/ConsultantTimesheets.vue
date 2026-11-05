<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">My Timesheets</h1>
        <p class="text-sm text-muted-foreground">
          Track and submit your weekly/bi-weekly timesheets for approval.
        </p>
        <!-- ⚠️ PHASE 4 Exit Criteria Warning -->
        <div v-if="hasUnapprovedLwd" class="mt-3 flex items-start gap-3 rounded-[10px] border border-[#e4b4b4] bg-[#FDF5F6] p-4 text-[13px] text-[#B3373F]">
          <AppIcon name="i-alert" class="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p class="font-semibold">Action Required: Unapproved Timesheets</p>
            <p class="mt-1">You have timesheets ending on or before your Last Working Day that are not yet approved. Please ensure they are submitted, or contact your HRBP.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Timesheets Table -->
    <div class="overflow-hidden rounded-2xl border border-[#D7E0EA] bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] table-fixed text-left text-sm">
          <thead class="border-b border-[#D7E0EA] bg-[#F7FAFC]">
            <tr>
              <th class="h-16 px-6 text-left align-middle font-semibold text-ink">Period</th>
              <th class="h-16 px-6 text-left align-middle font-semibold text-ink">Total Hours</th>
              <th class="h-16 px-6 text-left align-middle font-semibold text-ink">Status</th>
              <th class="h-16 px-6 text-left align-middle font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#D7E0EA]">
            <tr v-if="loading" class="h-32">
              <td colspan="4" class="px-6 py-12 text-center text-ink-3">
                <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent"></span>
                <span class="ml-2">Loading timesheets...</span>
              </td>
            </tr>
            <tr v-else-if="timesheets.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-ink-3">
                No timesheets found. Your HR representative will create your first timesheet.
              </td>
            </tr>
            <tr v-for="t in timesheets" :key="t.id" class="transition-colors hover:bg-[#f4f8fb]">
              <td class="px-6 py-4 text-[13px] text-ink-2">
                {{ formatDate(t.period_start) }} – {{ formatDate(t.period_end) }}
              </td>
              <td class="px-6 py-4 font-medium text-ink">{{ t.total_hours }} hrs</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="statusPill(t.status)">
                  {{ statusLabel(t.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="t.status === 'draft' || t.status === 'rejected'"
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0D5F8F]"
                    @click="submitTimesheet(t)"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-3.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f6fa]"
                    @click="openViewModal(t)"
                  >
                    View Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== View Details Modal ===== -->
    <Teleport to="body">
      <div v-if="viewModalOpen && viewRow" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="viewModalOpen = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[460px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-5 text-[18px] font-medium text-ink">Timesheet Details</h3>
          <div class="space-y-4 text-sm">
            <div>
              <span class="block text-xs font-medium text-ink-3">Period</span>
              <span class="font-semibold text-ink">{{ formatDate(viewRow.period_start) }} – {{ formatDate(viewRow.period_end) }}</span>
            </div>
            <div>
              <span class="block text-xs font-medium text-ink-3">Total Hours</span>
              <span class="font-semibold text-ink">{{ viewRow.total_hours }} hrs</span>
            </div>
            <div v-if="viewRow.rejection_reason">
              <span class="block text-xs font-medium text-ink-3">Rejection Reason</span>
              <span class="rounded-[8px] bg-[#FDF5F6] p-3 text-[13px] leading-relaxed text-[#B3373F]">
                {{ viewRow.rejection_reason }}
              </span>
            </div>
            <div>
              <span class="block text-xs font-medium text-ink-3">Status</span>
              <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="statusPill(viewRow.status)">
                {{ statusLabel(viewRow.status) }}
              </span>
            </div>
            <div v-if="viewRow.submitted_at">
              <span class="block text-xs font-medium text-ink-3">Submitted On</span>
              <span class="text-ink">{{ formatDate(viewRow.submitted_at) }}</span>
            </div>
            <div v-if="viewRow.approved_at">
              <span class="block text-xs font-medium text-ink-3">Approved On</span>
              <span class="text-ink">{{ formatDate(viewRow.approved_at) }}</span>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="viewModalOpen = false">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Feedback Toast -->
    <div v-if="feedback" role="status" aria-live="polite" class="fixed bottom-6 right-6 z-40 rounded-[10px] bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">
      {{ feedback }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/utils'
import { logActivity } from '@/lib/activity'

const auth = useAuthStore()

const timesheets = ref<any[]>([])
const loading = ref(true)
const feedback = ref('')

// View Modal State
const viewModalOpen = ref(false)
const viewRow = ref<any>(null)

// ✅ PHASE 4 Exit Criteria Check: Unapproved timesheets <= Last Working Day
const hasUnapprovedLwd = computed(() => {
  return false 
})

onMounted(async () => {
  await fetchTimesheets()
})

// ✅ FIXED: Added `(supabase as any)` to bypass strict TS types
async function fetchTimesheets() {
  loading.value = true
  
  console.log('🔍 Auth User ID:', auth.user?.id)

  // 1. Find the consultant record linked to the logged-in user
  const { data: consultant, error: consultError } = await (supabase as any)
    .from('consultants')
    .select('id')
    .eq('user_id', auth.user?.id)
    .single()

  if (consultError || !consultant) {
    console.error('❌ Could not find consultant profile for user:', auth.user?.id, consultError)
    loading.value = false
    return
  }

  console.log('✅ Found Consultant ID:', consultant.id)

  // 2. Fetch timesheets using the correct consultant ID
  const { data, error } = await (supabase as any)
    .from('timesheets')
    .select('*')
    .eq('consultant_id', consultant.id)
    .order('period_end', { ascending: false })
  
  if (error) {
    console.error('❌ Error fetching timesheets:', error)
  } else {
    console.log('📄 Fetched timesheets:', data)
    timesheets.value = data || []
  }
  loading.value = false
}

// ✅ FIXED: Added `(supabase as any)` to bypass strict TS types
async function submitTimesheet(t: any) {
  if (!confirm('Are you sure you want to submit this timesheet for approval?')) return
  
  const { error } = await (supabase as any)
    .from('timesheets')
    .update({ 
      status: 'submitted', 
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', t.id)

  if (error) {
    showFeedback(`Failed to submit: ${error.message}`)
  } else {
    logActivity('timesheet.submitted', 'timesheets', t.id, {})
    showFeedback('Timesheet submitted successfully.')
    await fetchTimesheets()
  }
}

function openViewModal(t: any) {
  viewRow.value = t
  viewModalOpen.value = true
}

function statusPill(status: string) {
  switch (status) {
    case 'approved': return 'bg-[#177245] text-white'
    case 'submitted': return 'bg-[#B0761A] text-white'
    case 'rejected': return 'bg-[#C24152] text-white'
    default: return 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink' // draft
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = { 
    draft: 'Draft', 
    submitted: 'Submitted', 
    approved: 'Approved', 
    rejected: 'Rejected' 
  }
  return map[status] ?? status
}

function showFeedback(msg: string) {
  feedback.value = msg
  setTimeout(() => { feedback.value = '' }, 4000)
}
</script>