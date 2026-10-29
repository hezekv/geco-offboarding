<template>
  <div class="space-y-6">
    <!-- Header & Actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Offboarding employees</h1>
        <p class="text-sm text-muted-foreground">Manage active and completed offboarding records.</p>
      </div>
      <router-link
        to="/offboarding-employees/new"
        class="inline-flex items-center justify-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
      >
        <AppIcon name="i-plus" class="mr-2 h-4 w-4" />
        New Offboarding
      </router-link>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-sm">
        <AppIcon name="i-search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="search"
          type="text"
          placeholder="Search offboarding records..."
          class="w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div class="flex gap-2">
        <select
          v-model="statusFilter"
          class="w-full rounded-md px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <div class="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-6 py-3 font-medium">Consultant</th>
            <th class="px-6 py-3 font-medium">Client / Project</th>
            <th class="px-6 py-3 font-medium">Last working day</th>
            <th class="px-6 py-3 font-medium">HR in charge</th>
            <th class="px-6 py-3 font-medium">Progress</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="filteredRecords.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-muted-foreground">
              <p class="font-medium">No matching records</p>
              <p class="text-xs">Try a different keyword, or clear the search.</p>
              <button 
                v-if="search || statusFilter" 
                @click="clearFilters" 
                class="mt-2 text-xs font-medium text-primary hover:underline"
              >
                Clear search
              </button>
            </td>
          </tr>
          <tr v-for="record in filteredRecords" :key="record.offboarding_id" class="hover:bg-muted/30 transition-colors">
            <!-- Consultant -->
            <td class="px-6 py-4">
              <div class="font-medium text-foreground">{{ record.consultant_name }}</div>
              <div class="text-xs text-muted-foreground">
                {{ record.ob_ref }} · {{ record.job_title }}
              </div>
            </td>
            
            <!-- Client / Project -->
            <td class="px-6 py-4 text-foreground">
              {{ record.client }}
              <span v-if="record.project" class="text-muted-foreground">/ {{ record.project }}</span>
            </td>
            
            <!-- Last Working Day -->
            <td class="px-6 py-4 text-foreground">
              {{ formatDate(record.last_working_day) }}
            </td>
            
            <!-- HR in charge -->
            <td class="px-6 py-4 text-foreground">
              {{ record.hr_name || '—' }}
            </td>
            
            <!-- Progress -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="h-2 w-24 overflow-hidden rounded-full bg-muted">
                  <div 
                    class="h-full bg-primary transition-all" 
                    :style="{ width: `${getProgressPercent(record)}%` }"
                  ></div>
                </div>
                <span class="text-xs text-muted-foreground">
                  {{ record.completed_tasks }}/{{ record.active_tasks }} tasks
                </span>
              </div>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4">
              <StatusBadge :status="record.status" />
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <router-link
                :to="`/offboarding-employees/${record.offboarding_id}`"
                class="inline-flex items-center text-xs font-medium text-primary hover:underline"
              >
                Open profile
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge.vue'

// --- State ---
const search = ref('')
const statusFilter = ref('')
const records = ref<any[]>([])
const loading = ref(true)

// --- Data Fetching ---
onMounted(async () => {
  await fetchRecords()
})

async function fetchRecords() {
  loading.value = true
  
  // 1. Fetch base offboarding records with consultant and HR info
  const { data: offboardings, error: obError } = await supabase
    .from('offboardings')
    .select(`
      id,
      ob_ref,
      status,
      last_working_day,
      consultants:consultant_id (full_name, job_title, client, project),
      hr:assigned_hr_id (full_name)
    `)
    .order('created_at', { ascending: false })

  if (obError) {
    console.error('Error fetching offboardings:', obError)
    loading.value = false
    return
  }

  if (!offboardings || offboardings.length === 0) {
    records.value = []
    loading.value = false
    return
  }

  // 2. Fetch all sub-requirements for these specific offboardings to calculate progress
  const obIds = offboardings.map((ob: any) => ob.id)
  
  const { data: subReqs, error: subError } = await supabase
    .from('offboarding_sub_requirements')
    .select(`
      status,
      offboarding_requirements!inner (
        offboarding_id
      )
    `)
    .in('offboarding_requirements.offboarding_id', obIds)

  if (subError) {
    console.error('Error fetching sub-requirements:', subError)
  }

  // 3. Aggregate progress in JavaScript
  const progressMap = new Map()
  if (subReqs) {
    for (const req of subReqs) {
      const obId = req.offboarding_requirements.offboarding_id
      if (!progressMap.has(obId)) {
        progressMap.set(obId, { active: 0, completed: 0 })
      }
      const counts = progressMap.get(obId)
      
      if (req.status !== 'disabled') {
        counts.active += 1
        if (req.status === 'completed') {
          counts.completed += 1
        }
      }
    }
  }

  // 4. Combine base data with calculated progress
  records.value = offboardings.map((ob: any) => {
    const counts = progressMap.get(ob.id) || { active: 0, completed: 0 }
    return {
      offboarding_id: ob.id,
      status: ob.status,
      active_tasks: counts.active,
      completed_tasks: counts.completed,
      ob_ref: ob.ob_ref,
      last_working_day: ob.last_working_day,
      consultant_name: ob.consultants?.full_name || 'Unknown',
      job_title: ob.consultants?.job_title || '',
      client: ob.consultants?.client || '',
      project: ob.consultants?.project || '',
      hr_name: ob.hr?.full_name || null,
    }
  })
  
  loading.value = false
}

// --- Computed Filters ---
const filteredRecords = computed(() => {
  return records.value.filter((record) => {
    const matchesSearch = 
      !search.value || 
      record.consultant_name.toLowerCase().includes(search.value.toLowerCase()) ||
      record.ob_ref.toLowerCase().includes(search.value.toLowerCase()) ||
      record.client?.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus = !statusFilter.value || record.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

function getProgressPercent(record: any) {
  if (record.active_tasks === 0) return 0
  return Math.round((record.completed_tasks / record.active_tasks) * 100)
}

function clearFilters() {
  search.value = ''
  statusFilter.value = ''
}
</script>