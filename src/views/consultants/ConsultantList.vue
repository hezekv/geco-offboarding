<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-wrap items-center justify-end gap-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-5 py-3 text-sm font-bold text-white transition-colors hover:border-[#198754] hover:bg-[#198754]"
        @click="openCreate"
      >
        Add Consultant <AppIcon name="i-plus" class="h-4 w-4" />
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 rounded-2xl">
      <!-- Search -->
      <div class="relative min-w-[240px] flex-1">
        <svg
          class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a99a8]"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="search"
          type="search"
          placeholder="Search consultants..."
          class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-[#f8fafc] pl-11 pr-4 text-sm text-ink transition-all duration-150 focus:border-[#12607A] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.25)]"
        />
      </div>

      <!-- Record count -->
      <span class="whitespace-nowrap text-[13px] text-ink-3">
        {{ filtered.length }} of {{ consultants.length }} records
      </span>

      <!-- Filter Status dropdown -->
      <div class="relative">
        <button
          type="button"
          class="inline-flex h-[46px] items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-4 text-[13px] font-bold text-ink transition-colors hover:bg-[#f2f6fa]"
          :aria-expanded="filterOpen"
          aria-haspopup="true"
          @click="filterOpen = !filterOpen"
        >
          <svg
            class="h-4 w-4 transition-transform duration-150"
            :class="filterOpen ? 'rotate-180' : ''"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          Filter Status
        </button>

        <!-- Dropdown panel -->
        <div
          v-if="filterOpen"
          class="absolute right-0 top-[calc(100%+6px)] z-30 w-52 overflow-hidden rounded-[10px] border border-line bg-white py-1.5 shadow-lg"
        >
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            class="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-[#f4f8fb]"
            :class="statusFilter === opt.value ? 'font-semibold text-brand' : 'font-medium text-ink-2'"
            @click="selectStatus(opt.value)"
          >
            {{ opt.label }}
            <svg
              v-if="statusFilter === opt.value"
              class="h-3.5 w-3.5 flex-shrink-0"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>

        <!-- Click-away layer -->
        <div v-if="filterOpen" class="fixed inset-0 z-20" @click="filterOpen = false"></div>
      </div>
    </div>

    <!-- Table card -->
    <div class="overflow-hidden rounded-2xl border border-[#D7E0EA] bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr class="border-b border-[#D7E0EA] bg-[#F7FAFC]">
              <th class="h-20 px-4 text-[13px] font-semibold text-ink">Consultant</th>
              <th class="h-20 px-4 text-[13px] font-semibold text-ink">Role</th>
              <th class="h-20 px-4 text-[13px] font-semibold text-ink">Client / Project</th>
              <th class="h-20 px-4 text-[13px] font-semibold text-ink">Engagement End</th>
              <th class="h-20 px-4 text-[13px] font-semibold text-ink">Status</th>
              <th class="h-20 px-4 text-[13px] font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id" class="border-b border-[#e6edf3] last:border-0 hover:bg-[#f4f8fb]">
              <td class="h-[5.5rem] px-4 align-middle">
                <span class="block font-semibold leading-snug text-ink">{{ c.full_name }}</span>
                <span class="mt-0.5 block text-xs leading-snug text-[#5A6B80]">{{ c.email }}</span>
              </td>
              <td class="h-[5.5rem] px-4 align-middle">
                <span class="block text-[13px] leading-snug text-ink-2">{{ c.job_title }}</span>
                <span class="mt-0.5 block text-xs leading-snug text-[#5A6B80]">{{ c.department || '—' }}</span>
              </td>
              <td class="h-[5.5rem] px-4 align-middle">
                <span class="block text-[13px] leading-snug text-ink-2">{{ c.client || '—' }}</span>
                <span class="mt-0.5 block text-xs leading-snug text-[#5A6B80]">{{ c.project || '' }}</span>
              </td>
              <td class="h-[5.5rem] px-4 align-middle text-[13px] text-ink-2">{{ formatDate(c.engagement_end) }}</td>
              <td class="h-[5.5rem] px-4 align-middle">
                <span :class="[badgeBase, consultantStatusPill(c.status).cls]">{{ consultantStatusPill(c.status).label }}</span>
              </td>
              <td class="h-[5.5rem] px-4 align-middle">
                <div class="flex flex-wrap gap-4">
                  <router-link
                    :to="{ name: 'consultant-detail', params: { id: c.id } }"
                    class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#a6c8dc] bg-white px-5 text-[14px] font-semibold text-[#0D5F8F] transition-colors hover:border-[#0D5F8F] hover:bg-[#0D5F8F] hover:text-white"
                  >
                    Open <ChevronRight class="h-3.5 w-3.5" />
                  </router-link>
                  <button
                    type="button"
                    class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#122033] bg-[#F7FAFC] px-5 text-[14px] font-medium text-[#122033] transition-colors hover:border-[#198754] hover:bg-[#198754] hover:text-white"
                    @click="openEdit(c)"
                  >
                    Edit <AppIcon name="i-edit" class="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="6" class="px-4 py-16 text-center">
                <p class="text-sm font-semibold text-ink">No matching consultants</p>
                <p class="mt-1 text-[13px] text-ink-3">Try a different keyword, or clear the filters.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConsultantModal :open="modalOpen" :consultant="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { consultantStatusPill } from '@/lib/documents'
import { ChevronRight } from 'lucide-vue-next'
import ConsultantModal from '@/components/consultants/ConsultantModal.vue'

const badgeBase = 'inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium leading-tight'

const consultants = ref<any[]>([])
const search = ref('')
const statusFilter = ref('')
const filterOpen = ref(false)
const modalOpen = ref(false)
const editing = ref<any | null>(null)

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'active', label: 'Active' },
  { value: 'on_bench', label: 'On Bench' },
  { value: 'offboarding', label: 'Offboarding' },
  { value: 'offboarded', label: 'Offboarded' },
]

onMounted(fetchAll)

async function fetchAll() {
  const { data: cons } = await supabase.from('consultants').select('*').order('full_name')
  consultants.value = cons || []
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return consultants.value.filter((c) => {
    if (statusFilter.value && c.status !== statusFilter.value) return false
    if (!q) return true
    return [c.full_name, c.email, c.client].some((v) => (v || '').toLowerCase().includes(q))
  })
})

function selectStatus(value: string) {
  statusFilter.value = value
  filterOpen.value = false
}

function openCreate() { editing.value = null; modalOpen.value = true }
function openEdit(c: any) { editing.value = c; modalOpen.value = true }
async function onSaved() { modalOpen.value = false; await fetchAll() }
</script>