<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-lg font-bold text-ink">Welcome back, {{ auth.fullName }}.</h1>
      <p class="text-sm text-ink-3">Here's what's happening in your portal today.</p>
    </div>

    <!-- ===== PHASE 5: Analytics & Metrics Widgets ===== -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[18px] font-semibold text-ink">Analytics & Insights</h2>
        <span class="text-xs font-medium text-ink-3 bg-[#f1f5f9] px-2.5 py-1 rounded-full">Operational Health</span>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        
        <!-- Widget 1: Upcoming LWDs (30 Days) -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#12607A]/10 text-[#12607A]">
              <CalendarDays class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-[#177245] bg-[#177245]/10 px-2 py-0.5 rounded-full">30 Days</span>
          </div>
          <div class="mt-4">
            <p class="text-[28px] font-bold leading-none tracking-tight text-ink">
              {{ analyticsLoading ? '...' : analytics.upcomingLwds30 }}
            </p>
            <p class="mt-2 text-[13px] font-medium text-ink-3">Upcoming Last Working Days</p>
          </div>
        </div>

        <!-- Widget 2: Avg Cycle Time -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#B0761A]/10 text-[#B0761A]">
              <TrendingUp class="h-5 w-5" />
            </div>
            <span class="text-xs font-medium text-ink-3">Avg Duration</span>
          </div>
          <div class="mt-4">
            <p class="text-[28px] font-bold leading-none tracking-tight text-ink">
              {{ analyticsLoading ? '...' : `${analytics.avgCycleTime} d` }}
            </p>
            <p class="mt-2 text-[13px] font-medium text-ink-3">Offboarding Cycle Time</p>
          </div>
        </div>

        <!-- Widget 3: Assets Pending Return -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#C24152]/10 text-[#C24152]">
              <Package class="h-5 w-5" />
            </div>
            <span v-if="analytics.assetsPending > 0" class="text-xs font-medium text-[#C24152] bg-[#C24152]/10 px-2 py-0.5 rounded-full">Action</span>
          </div>
          <div class="mt-4">
            <p class="text-[28px] font-bold leading-none tracking-tight text-ink">
              {{ analyticsLoading ? '...' : analytics.assetsPending }}
            </p>
            <p class="mt-2 text-[13px] font-medium text-ink-3">Assets Pending Return</p>
          </div>
        </div>

        <!-- Widget 4: Expiring Documents -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#8A9BB0]/10 text-[#8A9BB0]">
              <FileText class="h-5 w-5" />
            </div>
            <span v-if="analytics.expiringDocs > 0" class="text-xs font-medium text-[#B0761A] bg-[#B0761A]/10 px-2 py-0.5 rounded-full">Expiring</span>
          </div>
          <div class="mt-4">
            <p class="text-[28px] font-bold leading-none tracking-tight text-ink">
              {{ analyticsLoading ? '...' : analytics.expiringDocs }}
            </p>
            <p class="mt-2 text-[13px] font-medium text-ink-3">Expiring Documents (30d)</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== PHASE 5: Action Center (Exit Criteria) ===== -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[18px] font-semibold text-ink">Action Center</h2>
        <span class="text-xs font-medium text-ink-3 bg-[#f1f5f9] px-2.5 py-1 rounded-full">This Week</span>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- LEFT: Pending Approvals -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-[15px] font-semibold text-ink">Pending Approvals</h3>
            <span class="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-[#B0761A]/10 text-[#B0761A] text-xs font-bold">
              {{ pendingApprovals.length }}
            </span>
          </div>

          <div v-if="actionCenterLoading" class="py-8 text-center text-sm text-ink-3">Loading actions...</div>
          
          <ul v-else-if="pendingApprovals.length > 0" class="flex flex-col gap-3">
            <li v-for="item in pendingApprovals" :key="item.id" class="flex items-center justify-between rounded-xl border border-[#f1f5f9] bg-[#fafbfc] p-3.5 transition-colors hover:bg-[#f1f5f9]">
              <div class="flex items-center gap-3 min-w-0">
                <div class="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#B0761A]/10 text-[#B0761A]">
                  <AppIcon name="i-clock" class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-[13.5px] font-semibold text-ink">{{ item.name }}</p>
                  <p class="truncate text-xs text-ink-3 capitalize">{{ item.detail }}</p>
                </div>
              </div>
              <router-link 
                to="/time-leave" 
                class="flex-none rounded-lg border border-[#d5dee8] bg-white px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-[#f2f6fa]"
              >
                Review
              </router-link>
            </li>
          </ul>

          <div v-else class="rounded-xl border-[1.5px] border-dashed border-[#d5dee7] p-6 text-center">
            <p class="text-sm font-medium text-[#177245]">🎉 All caught up!</p>
            <p class="mt-1 text-xs text-ink-3">No pending approvals right now.</p>
          </div>
        </div>

        <!-- RIGHT: Upcoming Last Working Days (Next 7 Days) -->
        <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-[15px] font-semibold text-ink">Upcoming Last Working Days</h3>
            <span class="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-[#12607A]/10 text-[#12607A] text-xs font-bold">
              {{ upcomingLwds.length }}
            </span>
          </div>

          <div v-if="actionCenterLoading" class="py-8 text-center text-sm text-ink-3">Loading actions...</div>
          
          <ul v-else-if="upcomingLwds.length > 0" class="flex flex-col gap-3">
            <li v-for="ob in upcomingLwds" :key="ob.id" class="flex items-center justify-between rounded-xl border border-[#f1f5f9] bg-[#fafbfc] p-3.5 transition-colors hover:bg-[#f1f5f9]">
              <div class="flex items-center gap-3 min-w-0">
                <div class="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#12607A]/10 text-[#12607A]">
                  <AppIcon name="i-calendar" class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-[13.5px] font-semibold text-ink">{{ ob.name }}</p>
                  <p class="truncate text-xs text-ink-3">{{ ob.ref }} · LWD: {{ formatDate(ob.lwd) }}</p>
                </div>
              </div>
              <router-link 
                :to="`/offboarding-employees/${ob.id}`" 
                class="flex-none rounded-lg border border-[#d5dee8] bg-white px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-[#f2f6fa]"
              >
                View Profile
              </router-link>
            </li>
          </ul>

          <div v-else class="rounded-xl border-[1.5px] border-dashed border-[#d5dee7] p-6 text-center">
            <p class="text-sm font-medium text-ink">No upcoming LWDs</p>
            <p class="mt-1 text-xs text-ink-3">No offboardings ending in the next 7 days.</p>
          </div>
        </div>

      </div>
    </section>

    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { CalendarDays, TrendingUp, Package, FileText } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const stats = ref({
  active: 0,
  completedThisMonth: 0,
  pendingTasks: 0,
  totalConsultants: 0
})

// ===== PHASE 5: Action Center State =====
const pendingApprovals = ref<any[]>([])
const upcomingLwds = ref<any[]>([])
const actionCenterLoading = ref(true)

// ===== PHASE 5: Analytics State =====
const analytics = ref({
  upcomingLwds30: 0,
  avgCycleTime: 0,
  assetsPending: 0,
  expiringDocs: 0
})
const analyticsLoading = ref(true)

async function fetchActionItems() {
  actionCenterLoading.value = true
  
  try {
    // 1. Fetch Pending Timesheet & Leave Approvals
    const [tsRes, leaveRes] = await Promise.all([
      (supabase as any)
        .from('timesheets')
        .select('id, period_end, total_hours, consultants(full_name)')
        .eq('status', 'submitted'),
      (supabase as any)
        .from('leave_requests')
        .select('id, start_date, leave_type, consultants(full_name)')
        .eq('status', 'submitted')
    ])

    const approvals: any[] = []
    
    if (tsRes.data) {
      tsRes.data.forEach((t: any) => approvals.push({
        id: t.id,
        type: 'timesheet',
        name: t.consultants?.full_name || 'Unknown Consultant',
        detail: `${t.total_hours} hrs ending ${formatDate(t.period_end)}`,
        urgency: 'amber'
      }))
    }

    if (leaveRes.data) {
      leaveRes.data.forEach((l: any) => approvals.push({
        id: l.id,
        type: 'leave',
        name: l.consultants?.full_name || 'Unknown Consultant',
        detail: `${l.leave_type.replace('_', ' ')} starting ${formatDate(l.start_date)}`,
        urgency: 'amber'
      }))
    }
    pendingApprovals.value = approvals

    // 2. Fetch Upcoming Last Working Days (Next 7 Days)
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data: obData } = await (supabase as any)
      .from('offboardings')
      .select('id, ob_ref, last_working_day, consultants(full_name)')
      .in('status', ['sent', 'in_progress'])
      .gte('last_working_day', today)
      .lte('last_working_day', nextWeek)

    if (obData) {
      upcomingLwds.value = obData.map((ob: any) => ({
        id: ob.id,
        ref: ob.ob_ref,
        name: ob.consultants?.full_name || 'Unknown Consultant',
        lwd: ob.last_working_day,
        urgency: 'teal'
      }))
    }
  } catch (err) {
    console.error('Failed to fetch action items:', err)
  } finally {
    actionCenterLoading.value = false
  }
}

async function fetchAnalytics() {
  analyticsLoading.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // 1. Upcoming LWDs (Next 30 Days)
    const { count: lwdCount } = await (supabase as any)
      .from('offboardings')
      .select('*', { count: 'exact', head: true })
      .in('status', ['sent', 'in_progress'])
      .gte('last_working_day', today)
      .lte('last_working_day', nextMonth)
    analytics.value.upcomingLwds30 = lwdCount || 0

    // 2. Avg Cycle Time (Days from created_at to archived_at)
    const { data: archivedObs } = await (supabase as any)
      .from('offboardings')
      .select('created_at, archived_at')
      .eq('status', 'archived')
    
    if (archivedObs && archivedObs.length > 0) {
      const totalDays = archivedObs.reduce((acc: number, ob: any) => {
        if (ob.created_at && ob.archived_at) {
          const start = new Date(ob.created_at).getTime()
          const end = new Date(ob.archived_at).getTime()
          return acc + Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        }
        return acc
      }, 0)
      analytics.value.avgCycleTime = Math.round(totalDays / archivedObs.length)
    } else {
      analytics.value.avgCycleTime = 0
    }

    // 3. Assets Pending Return
    const { count: assetCount } = await (supabase as any)
      .from('assets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'assigned')
    analytics.value.assetsPending = assetCount || 0

    // 4. Expiring Documents (Next 30 Days)
    const { count: docCount } = await (supabase as any)
      .from('consultant_documents')
      .select('*', { count: 'exact', head: true })
      .gte('expiry_date', today)
      .lte('expiry_date', nextMonth)
    analytics.value.expiringDocs = docCount || 0

  } catch (err) {
    console.error('Failed to fetch analytics:', err)
  } finally {
    analyticsLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchActionItems(),
    fetchAnalytics()
  ])
})
</script>