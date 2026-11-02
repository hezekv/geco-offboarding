<template>
  <div class="space-y-5">
    <!-- Row 1: Right-aligned primary action (opens modal) -->
    <div class="flex justify-end">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-5 py-3 text-sm font-bold text-white transition-colors hover:border-[#198754] hover:bg-[#198754] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        @click="showNewModal = true"
      >
        New Offboarding Record
        <AppIcon name="i-plus" class="h-4 w-4" />
      </button>
    </div>

    <!-- Row 2: Full-width search + Filter Status + Show archived -->
    <div class="flex items-stretch gap-3.5">
      <div class="relative flex-1">
        <AppIcon name="i-search" class="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          v-model="search"
          type="text"
          placeholder="Search offboarding records..."
          class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-[#f8fafc] pl-[42px] pr-4 text-sm text-ink transition-[border-color,box-shadow,background] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
        />
      </div>

      <!-- Filter Status dropdown -->
      <div class="relative flex-shrink-0">
        <button
          type="button"
          class="inline-flex h-[46px] items-center gap-[9px] rounded-[10px] border border-[#d5dee8] bg-white px-[18px] text-sm font-semibold text-[#1f2937] shadow-sm transition-colors hover:bg-[#f2f6fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-haspopup="listbox"
          :aria-expanded="statusMenuOpen"
          @click="statusMenuOpen = !statusMenuOpen"
        >
          <AppIcon name="i-chevron" class="h-4 w-4 rotate-90 text-[#334155]" />
          {{ statusFilterLabel }}
        </button>

        <div
          v-if="statusMenuOpen"
          role="listbox"
          aria-label="Filter by status"
          class="absolute right-0 top-[calc(100%+6px)] z-30 w-48 overflow-hidden rounded-[10px] border border-[#d5dee8] bg-white py-1 shadow-md"
        >
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            role="option"
            :aria-selected="statusFilter === opt.value"
            class="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#f2f6fa]"
            :class="statusFilter === opt.value ? 'text-[#0D5F8F]' : 'text-ink-2'"
            @click="selectStatus(opt.value)"
          >
            {{ opt.label }}
            <AppIcon v-if="statusFilter === opt.value" name="i-check-circle" class="h-3.5 w-3.5" />
          </button>
        </div>

        <div v-if="statusMenuOpen" class="fixed inset-0 z-20" @click="statusMenuOpen = false"></div>
      </div>

      <!-- Show / hide archived history -->
      <button
        type="button"
        class="inline-flex h-[46px] flex-shrink-0 items-center gap-[9px] rounded-[10px] border border-[#d5dee8] bg-white px-[18px] text-sm font-semibold text-[#1f2937] shadow-sm transition-colors hover:bg-[#f2f6fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        :aria-pressed="showArchived"
        @click="showArchived = !showArchived"
      >
        <Eye v-if="showArchived" class="h-4 w-4 text-[#334155]" />
        <EyeOff v-else class="h-4 w-4 text-[#334155]" />
        {{ showArchived ? 'Hide archived' : 'Show archived' }}
      </button>
    </div>

    <!-- ===== Table card ===== -->
    <div class="overflow-hidden rounded-[24px] border border-[#D7E0EA] bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[960px] table-fixed text-left text-sm">
          <thead>
            <tr>
              <th class="h-20 w-[24%] whitespace-nowrap border-b border-[#D7E0EA] bg-[#F7FAFC] px-4 text-left align-middle text-[14px] font-semibold text-ink">Consultant</th>
              <th class="h-20 w-[18%] whitespace-nowrap border-b border-[#D7E0EA] bg-[#F7FAFC] px-4 text-left align-middle text-[14px] font-semibold text-ink">Client / Project</th>
              <th class="h-20 w-[15%] whitespace-nowrap border-b border-[#D7E0EA] bg-[#F7FAFC] px-4 text-left align-middle text-[14px] font-semibold text-ink">Last working day</th>
              <th class="h-20 w-[17%] whitespace-nowrap border-b border-[#D7E0EA] bg-[#F7FAFC] px-4 text-left align-middle text-[14px] font-semibold text-ink">HR in charge</th>
              <th class="h-20 w-[12%] whitespace-nowrap border-b border-[#D7E0EA] bg-[#F7FAFC] px-4 text-left align-middle text-[14px] font-semibold text-ink">Progress</th>
              <th class="h-20 w-[14%] whitespace-nowrap border-b border-[#D7E0EA] bg-[#F7FAFC] px-4 text-left align-middle text-[14px] font-semibold text-ink">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#D7E0EA]">
            <!-- Empty state -->
            <tr v-if="filteredRecords.length === 0">
              <td colspan="6" class="bg-white px-6 py-14">
                <div class="flex flex-col items-center gap-1.5 text-center">
                  <AppIcon name="i-inbox" class="mb-1.5 h-8 w-8 text-[#9aa8ba]" />
                  <p class="text-[15px] font-bold text-[#334155]">No matching records</p>
                  <p class="text-[13px] text-[#5A6B80]">Try a different keyword, or clear the search.</p>
                  <button
                    v-if="search || statusFilter || showArchived === false"
                    type="button"
                    class="mt-2.5 rounded-lg border border-[#122033] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#122033] transition-colors hover:bg-[#122033] hover:text-white"
                    @click="clearFilters"
                  >
                    Clear search
                  </button>
                </div>
              </td>
            </tr>

            <!-- Data rows (default + hover choreography) -->
            <tr v-for="record in filteredRecords" :key="record.offboarding_id" class="group">
              <!-- Consultant -->
              <td :class="tdCls">
                <span class="block font-semibold leading-snug text-ink">{{ record.consultant_name }}</span>
                <span class="mt-0.5 block text-xs font-normal leading-snug text-[#5A6B80]">
                  {{ record.ob_ref }} · {{ record.job_title }}
                </span>
              </td>

              <!-- Client / Project -->
              <td :class="tdCls">
                {{ record.client }}<template v-if="record.project"> / {{ record.project }}</template>
              </td>

              <!-- Last working day -->
              <td :class="tdCls">{{ formatDate(record.last_working_day) }}</td>

              <!-- HR in charge -->
              <td :class="tdCls">{{ record.hr_name || '—' }}</td>

              <!-- Progress (text fades on row hover) -->
              <td :class="tdCls + ' relative'">
                <span class="transition-opacity duration-200 min-[701px]:group-hover:opacity-0 min-[701px]:group-focus-within:opacity-0">
                  {{ record.completed_tasks }}/{{ record.active_tasks }} tasks
                </span>
              </td>

              <!-- Status pill + hover-revealed Open profile -->
              <td :class="tdCls + ' relative'">
                <span :class="[pillCls, statusPill(record.status)]">
                  {{ statusLabel(record.status) }}
                </span>
                <router-link :to="`/offboarding-employees/${record.offboarding_id}`" :class="openProfileCls">
                  Open profile
                  <ExternalLink class="h-3.5 w-3.5 flex-shrink-0" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Offboarding Record modal -->
    <NewOffboardingModal :open="showNewModal" @close="showNewModal = false" @saved="handleCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
// UPDATED: Eye / EyeOff for the archived toggle
import { ExternalLink, Eye, EyeOff } from 'lucide-vue-next'
import NewOffboardingModal from '@/components/offboarding/NewOffboardingModal.vue'

// --- Shared cell / pill / hover-button classes ---
const tdCls =
  'h-[5.5rem] bg-white px-4 align-middle text-[14px] text-ink transition-colors duration-150 group-hover:bg-[#D7E0EA] group-focus-within:bg-[#D7E0EA]'

const pillCls =
  'relative z-[2] inline-flex items-center justify-center whitespace-nowrap rounded-pill border border-transparent px-3.5 py-1.5 text-[13px] font-semibold leading-none transition-transform duration-200 min-[701px]:group-hover:translate-x-[calc(-100%-2px)] min-[701px]:group-focus-within:translate-x-[calc(-100%-2px)]'

const openProfileCls =
  'absolute left-[22px] top-1/2 inline-flex -translate-y-1/2 translate-x-[6px] items-center gap-1.5 whitespace-nowrap rounded-pill border border-[#122033] bg-[#F7FAFC] px-3 py-1.5 text-[13px] font-semibold text-[#122033] opacity-0 transition-[opacity,transform] duration-200 hover:bg-[#eef2f7] focus-visible:translate-x-0 focus-visible:opacity-100 min-[701px]:group-hover:translate-x-0 min-[701px]:group-hover:opacity-100 min-[701px]:group-focus-within:translate-x-0 min-[701px]:group-focus-within:opacity-100 max-[700px]:static max-[700px]:ml-2 max-[700px]:translate-x-0 max-[700px]:translate-y-0 max-[700px]:opacity-100'

// --- State ---
const search = ref('')
const statusFilter = ref('')
const statusMenuOpen = ref(false)
const showNewModal = ref(false)
// UPDATED: archived history hidden by default
const showArchived = ref(false)
const records = ref<any[]>([])
const loading = ref(true)

// --- Status filter dropdown ---
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const statusFilterLabel = computed(() => {
  if (!statusFilter.value) return 'Filter Status'
  return statusOptions.find((o) => o.value === statusFilter.value)?.label ?? 'Filter Status'
})

function selectStatus(value: string) {
  statusFilter.value = value
  statusMenuOpen.value = false
}

// --- Status pill styling (mockup colors) ---
function statusPill(status: string) {
  switch (status) {
    case 'in_progress': return 'bg-[#0E5A8C] text-white'
    case 'completed': return 'bg-[#177245] text-white'
    case 'sent': return 'bg-[#B0761A] text-white'
    case 'draft': return 'border-[#A9C4DC] bg-[#E4EEF6] text-ink'
    default: return 'bg-[#e5eaf1] text-[#7b8794]'
  }
}
function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: 'Draft', sent: 'Pending', in_progress: 'In Progress', completed: 'Completed', archived: 'Archived',
  }
  return map[status] ?? status
}

// --- Data fetching ---
onMounted(fetchRecords)

async function fetchRecords() {
  loading.value = true

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

  const progressMap = new Map()
  if (subReqs) {
    for (const req of subReqs) {
      const obId = req.offboarding_requirements.offboarding_id
      if (!progressMap.has(obId)) progressMap.set(obId, { active: 0, completed: 0 })
      const counts = progressMap.get(obId)
      if (req.status !== 'disabled') {
        counts.active += 1
        if (req.status === 'completed') counts.completed += 1
      }
    }
  }

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

// --- Filtering (UPDATED: archived hidden by default) ---
const filteredRecords = computed(() => {
  return records.value.filter((record) => {
    // Archived = historical rows: hidden unless toggled on or explicitly filtered
    if (record.status === 'archived' && !showArchived.value && statusFilter.value !== 'archived') {
      return false
    }

    const matchesSearch =
      !search.value ||
      record.consultant_name.toLowerCase().includes(search.value.toLowerCase()) ||
      record.ob_ref.toLowerCase().includes(search.value.toLowerCase()) ||
      record.client?.toLowerCase().includes(search.value.toLowerCase())

    const matchesStatus = !statusFilter.value || record.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

function clearFilters() {
  search.value = ''
  statusFilter.value = ''
}

// --- Modal wiring ---
function handleCreated() {
  showNewModal.value = false
  fetchRecords()
}
</script>