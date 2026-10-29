<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Welcome back, {{ auth.fullName }}</h1>
        <p class="text-sm text-muted-foreground">Here's what's happening with your offboardings today.</p>
      </div>
      <router-link
        to="/offboarding-employees/new"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
      >
        <Plus class="mr-2 h-4 w-4" /> New Offboarding
      </router-link>
    </div>

    <!-- Metrics Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Offboardings"
        :value="stats.active"
        description="Currently in progress"
        icon="UserCog"
        color="blue"
      />
      <MetricCard
        title="Completed This Month"
        :value="stats.completedThisMonth"
        description="Successfully offboarded"
        icon="CheckCircle"
        color="green"
      />
      <MetricCard
        title="Pending Tasks"
        :value="stats.pendingTasks"
        description="Awaiting completion"
        icon="Clock"
        color="amber"
      />
      <MetricCard
        title="Total Consultants"
        :value="stats.totalConsultants"
        description="In system"
        icon="Users"
        color="purple"
      />
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Recent Offboardings -->
      <div class="rounded-xl border bg-white shadow-sm">
        <div class="border-b px-6 py-4">
          <h2 class="text-lg font-semibold text-foreground">Recent Offboardings</h2>
        </div>
        <div class="p-6">
          <div v-if="recentOffboardings.length === 0" class="text-center text-sm text-muted-foreground py-4">
            No recent offboardings
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="ob in recentOffboardings" 
              :key="ob.id"
              class="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span class="text-sm font-semibold text-primary">{{ ob.consultant_name.charAt(0) }}</span>
                </div>
                <div>
                  <div class="font-medium text-foreground">{{ ob.consultant_name }}</div>
                  <div class="text-xs text-muted-foreground">{{ ob.ob_ref }} · {{ formatDate(ob.last_working_day) }}</div>
                </div>
              </div>
              <StatusBadge :status="ob.status" />
            </div>
          </div>
          <router-link 
            to="/offboarding-employees" 
            class="mt-4 block text-center text-sm font-medium text-primary hover:underline"
          >
            View all offboardings →
          </router-link>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-xl border bg-white shadow-sm">
        <div class="border-b px-6 py-4">
          <h2 class="text-lg font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div class="p-6 space-y-3">
          <router-link
            to="/offboarding-employees"
            class="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <List class="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div class="font-medium text-foreground">View All Offboardings</div>
              <div class="text-xs text-muted-foreground">Manage active and completed records</div>
            </div>
          </router-link>

          <router-link
            to="/offboarding-config"
            class="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Settings class="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div class="font-medium text-foreground">Manage Configurations</div>
              <div class="text-xs text-muted-foreground">Edit requirement templates</div>
            </div>
          </router-link>

          <router-link
            to="/offboarding-employees/new"
            class="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <UserPlus class="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div class="font-medium text-foreground">Create New Offboarding</div>
              <div class="text-xs text-muted-foreground">Start a new offboarding process</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/utils'
import { Plus, UserCog, CheckCircle, Clock, Users, List, Settings, UserPlus } from 'lucide-vue-next'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import MetricCard from '@/components/ui/MetricCard.vue'

const auth = useAuthStore()
const stats = ref({
  active: 0,
  completedThisMonth: 0,
  pendingTasks: 0,
  totalConsultants: 0
})
const recentOffboardings = ref<any[]>([])

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchRecentOffboardings()
  ])
})

async function fetchStats() {
  // 1. Active offboardings (draft, sent, in_progress)
  const { data: activeData } = await supabase
    .from('offboardings')
    .select('id', { count: 'exact' })
    .in('status', ['draft', 'sent', 'in_progress'])
  
  stats.value.active = activeData?.length || 0

  // 2. Completed this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data: completedData } = await supabase
    .from('offboardings')
    .select('id', { count: 'exact' })
    .eq('status', 'completed')
    .gte('completed_at', startOfMonth.toISOString())
  
  stats.value.completedThisMonth = completedData?.length || 0

  // 3. Pending tasks (sub-requirements not completed)
  const { data: tasksData } = await supabase
    .from('offboarding_sub_requirements')
    .select('id', { count: 'exact' })
    .in('status', ['pending'])
  
  stats.value.pendingTasks = tasksData?.length || 0

  // 4. Total consultants
  const { data: consultantsData } = await supabase
    .from('consultants')
    .select('id', { count: 'exact' })
  
  stats.value.totalConsultants = consultantsData?.length || 0
}

async function fetchRecentOffboardings() {
  const { data } = await supabase
    .from('offboardings')
    .select(`
      id, ob_ref, status, last_working_day,
      consultants:consultant_id (full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)
  
  recentOffboardings.value = (data || []).map((ob: any) => ({
    ...ob,
    consultant_name: ob.consultants?.full_name || 'Unknown'
  }))
}
</script>