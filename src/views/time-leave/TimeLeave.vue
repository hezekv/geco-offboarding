<template>
  <div class="space-y-6">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Consultant Filter Combobox -->
      <div class="relative min-w-[260px] flex-1" @click.stop>
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="consultantComboOpen"
          class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-white pl-4 pr-10 text-sm text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
          :value="consultantComboText"
          placeholder="All consultants (full catalog)"
          @focus="onConsultantComboFocus"
          @input="onConsultantComboInput($event)"
          @blur="onConsultantComboBlur"
          @keydown.esc.prevent="onConsultantComboEscape"
        />
        <button
          type="button"
          tabindex="-1"
          aria-label="Toggle consultant options"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
          @mousedown.prevent
          @click="onConsultantComboToggle"
        >
          <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="consultantComboOpen ? 'rotate-180' : ''" />
        </button>
        <div
          v-show="consultantComboOpen"
          class="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-[10px] border border-line bg-white p-1 shadow-xl"
          role="listbox"
        >
          <div
            v-for="opt in filteredConsultantOptions"
            :key="opt.id"
            class="cursor-pointer rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-[#f2f6fa] focus:bg-[#e9eef5] focus:outline-none"
            role="option"
            tabindex="0"
            :aria-selected="consultantFilter === opt.id"
            @mousedown.prevent
            @click="selectConsultantCombo(opt)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="flex-1" :class="consultantFilter === opt.id ? 'font-semibold text-ink' : 'text-ink-2'">{{ opt.name }}</span>
              <Check v-if="consultantFilter === opt.id" class="h-4 w-4 flex-shrink-0 text-brand" />
            </div>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="relative min-w-[240px] flex-1 sm:max-w-[320px]">
        <AppIcon name="i-search" class="pointer-events-none absolute left-[12px] top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          v-model="search"
          type="text"
          placeholder="Search period, reason..."
          class="h-10 w-full rounded-[10px] border border-[#d5dee8] bg-[#f8fafc] pl-[36px] pr-9 text-[13px] text-ink transition-[border-color,box-shadow,background] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
        />
        <button
          v-if="search"
          type="button"
          aria-label="Clear search"
          class="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors hover:bg-[#e9eef5] hover:text-ink"
          @click="search = ''"
        >
          <AppIcon name="i-x" class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- ===== Timesheets Table ===== -->
    <div class="overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <h2 class="text-[15px] font-semibold text-ink">Timesheets</h2>
          <span class="text-[12px] text-ink-3">{{ searchedTimesheets.length }} records</span>
        </div>
      </div>
      <div class="overflow-x-auto rounded-[24px] border border-line bg-white shadow-sm">
        <table class="w-full table-fixed text-left text-sm">
          <thead class="border-b border-line bg-[#f7fafc] text-ink">
            <tr>
              <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">Consultant</th>
              <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">Period</th>
              <th class="h-16 w-[15%] px-6 text-left align-middle font-semibold">Total Hours</th>
              <th class="h-16 w-[15%] px-6 text-left align-middle font-semibold">Status</th>
              <th class="h-16 w-[20%] px-6 text-left align-middle font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-if="searchedTimesheets.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-ink-3">
                <template v-if="search">No timesheets match "{{ search }}".</template>
                <template v-else>No timesheets found.</template>
              </td>
            </tr>
            <tr v-for="t in pagedTimesheets" :key="t.id" class="transition-colors hover:bg-[#d7e0ea]/40">
              <td class="px-6 py-4 font-semibold text-ink">{{ consultantName(t.consultant_id) }}</td>
              <td class="px-6 py-4 text-[13px] text-ink-3">{{ formatDate(t.period_start) }} – {{ formatDate(t.period_end) }}</td>
              <td class="px-6 py-4 text-[13px] font-medium text-ink">{{ t.total_hours }} hrs</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="statusPill(t.status)">{{ statusLabel(t.status) }}</span>
              </td>
              <td class="px-6 py-4">
                <button
                  type="button"
                  class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-3.5 text-[13px] font-semibold text-ink-2 shadow-sm transition-colors hover:bg-[#f2f6fa]"
                  :aria-expanded="openTsMenu === t.id"
                  aria-haspopup="menu"
                  @click.stop="toggleTsMenu(t.id, $event)"
                >
                  Actions
                  <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200" :class="openTsMenu === t.id ? 'rotate-180' : ''" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div v-if="searchedTimesheets.length > 0" class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5">
          <span class="text-[12.5px] text-ink-3">
            Showing {{ tsRangeStart }}–{{ tsRangeEnd }} of {{ searchedTimesheets.length }} records
          </span>
          <div class="flex items-center gap-1.5">
            <button type="button" :disabled="tsPage === 1" class="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:opacity-45" @click="goToTsPage(tsPage - 1)">
              <ChevronDown class="h-4 w-4 rotate-90" />
            </button>
            <template v-for="(p, idx) in tsPageButtons" :key="idx">
              <span v-if="p === '…'" class="px-1 text-[13px] text-ink-4">…</span>
              <button v-else type="button" :class="p === tsPage ? 'h-9 min-w-[36px] rounded-[10px] border border-[#12607A] bg-[#12607A] px-2 text-[13px] font-semibold text-white' : 'h-9 min-w-[36px] rounded-[10px] border border-[#d5dee8] bg-white px-2 text-[13px] font-semibold text-ink-2 hover:bg-[#f2f6fa]'" @click="goToTsPage(Number(p))">{{ p }}</button>
            </template>
            <button type="button" :disabled="tsPage === tsTotalPages" class="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:opacity-45" @click="goToTsPage(tsPage + 1)">
              <ChevronDown class="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Leave Requests Table ===== -->
    <div class="overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <h2 class="text-[15px] font-semibold text-ink">Leave Requests</h2>
          <span class="text-[12px] text-ink-3">{{ searchedLeaves.length }} records</span>
        </div>
      </div>
      <div class="overflow-x-auto rounded-[24px] border border-line bg-white shadow-sm">
        <table class="w-full table-fixed text-left text-sm">
          <thead class="border-b border-line bg-[#f7fafc] text-ink">
            <tr>
              <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">Consultant</th>
              <th class="h-16 w-[20%] px-6 text-left align-middle font-semibold">Leave Type</th>
              <th class="h-16 w-[20%] px-6 text-left align-middle font-semibold">Dates</th>
              <th class="h-16 w-[15%] px-6 text-left align-middle font-semibold">Status</th>
              <th class="h-16 w-[20%] px-6 text-left align-middle font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-if="searchedLeaves.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-ink-3">
                <template v-if="search">No leave requests match "{{ search }}".</template>
                <template v-else>No leave requests found.</template>
              </td>
            </tr>
            <tr v-for="l in pagedLeaves" :key="l.id" class="transition-colors hover:bg-[#d7e0ea]/40">
              <td class="px-6 py-4 font-semibold text-ink">{{ consultantName(l.consultant_id) }}</td>
              <td class="px-6 py-4 capitalize text-ink-2">{{ (l.leave_type || '').replace('_', ' ') }}</td>
              <td class="px-6 py-4 text-[13px] text-ink-3">{{ formatDate(l.start_date) }} – {{ formatDate(l.end_date) }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="statusPill(l.status)">{{ statusLabel(l.status) }}</span>
              </td>
              <td class="px-6 py-4">
                <button
                  type="button"
                  class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-3.5 text-[13px] font-semibold text-ink-2 shadow-sm transition-colors hover:bg-[#f2f6fa]"
                  :aria-expanded="openLeaveMenu === l.id"
                  aria-haspopup="menu"
                  @click.stop="toggleLeaveMenu(l.id, $event)"
                >
                  Actions
                  <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200" :class="openLeaveMenu === l.id ? 'rotate-180' : ''" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div v-if="searchedLeaves.length > 0" class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5">
          <span class="text-[12.5px] text-ink-3">
            Showing {{ leaveRangeStart }}–{{ leaveRangeEnd }} of {{ searchedLeaves.length }} records
          </span>
          <div class="flex items-center gap-1.5">
            <button type="button" :disabled="leavePage === 1" class="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:opacity-45" @click="goToLeavePage(leavePage - 1)">
              <ChevronDown class="h-4 w-4 rotate-90" />
            </button>
            <template v-for="(p, idx) in leavePageButtons" :key="idx">
              <span v-if="p === '…'" class="px-1 text-[13px] text-ink-4">…</span>
              <button v-else type="button" :class="p === leavePage ? 'h-9 min-w-[36px] rounded-[10px] border border-[#12607A] bg-[#12607A] px-2 text-[13px] font-semibold text-white' : 'h-9 min-w-[36px] rounded-[10px] border border-[#d5dee8] bg-white px-2 text-[13px] font-semibold text-ink-2 hover:bg-[#f2f6fa]'" @click="goToLeavePage(Number(p))">{{ p }}</button>
            </template>
            <button type="button" :disabled="leavePage === leaveTotalPages" class="grid h-9 w-9 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:opacity-45" @click="goToLeavePage(leavePage + 1)">
              <ChevronDown class="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Teleported Menus ===== -->
    <div v-if="openTsMenu || openLeaveMenu" class="fixed inset-0 z-40" @click="closeMenus"></div>
    <Teleport to="body">
      <div v-if="openTsMenu && openTsRow" role="menu" class="fixed z-50 w-44 overflow-hidden rounded-[10px] border border-[#d5dee8] bg-white py-1 shadow-lg" :style="{ top: `${tsMenuPos.top}px`, left: `${tsMenuPos.left}px` }">
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f6fa]" @click="menuViewTs">
          <AppIcon name="i-eye" class="h-3.5 w-3.5" /> View Details
        </button>
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#177245] transition-colors hover:bg-[#f2f6fa]" @click="handleApproveTs">
          <Check class="h-3.5 w-3.5" /> Approve
        </button>
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#f2f6fa]" @click="handleRejectTs">
          <XCircle class="h-3.5 w-3.5" /> Reject
        </button>
      </div>
      <div v-if="openLeaveMenu && openLeaveRow" role="menu" class="fixed z-50 w-44 overflow-hidden rounded-[10px] border border-[#d5dee8] bg-white py-1 shadow-lg" :style="{ top: `${leaveMenuPos.top}px`, left: `${leaveMenuPos.left}px` }">
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f6fa]" @click="menuViewLeave">
          <AppIcon name="i-eye" class="h-3.5 w-3.5" /> View Details
        </button>
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#177245] transition-colors hover:bg-[#f2f6fa]" @click="handleApproveLeave">
          <Check class="h-3.5 w-3.5" /> Approve
        </button>
        <button type="button" role="menuitem" class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#f2f6fa]" @click="handleRejectLeave">
          <XCircle class="h-3.5 w-3.5" /> Reject
        </button>
      </div>
    </Teleport>

    <!-- ===== Reject Modal ===== -->
    <Teleport to="body">
      <div v-if="rejectModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="rejectModalOpen = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[460px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-2 text-[18px] font-medium text-ink">Reject {{ rejectType === 'ts' ? 'Timesheet' : 'Leave Request' }}</h3>
          <p class="mb-5 text-[13px] text-ink-3">Please provide a reason for rejection.</p>
          <label class="block">
            <textarea v-model="rejectReason" rows="4" class="w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-sm leading-[1.45] text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]" placeholder="Enter rejection reason..."></textarea>
          </label>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="rejectModalOpen = false">Cancel</button>
            <button type="button" class="rounded-[10px] border border-[#C24152] bg-[#C24152] px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-[#a03542]" @click="confirmReject">Reject</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== Revert Approval Modal ===== -->
    <Teleport to="body">
      <div v-if="revertModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="revertModalOpen = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[460px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-2 text-[18px] font-medium text-ink">Revert Approval?</h3>
          <p class="mb-5 text-[13px] text-ink-3">
            This {{ revertType === 'ts' ? 'timesheet' : 'leave request' }} is already approved. Are you sure you want to revert it to Rejected status?
          </p>
          <div class="flex justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="revertModalOpen = false">Cancel</button>
            <button type="button" class="rounded-[10px] border border-[#C24152] bg-[#C24152] px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-[#a03542]" @click="confirmRevert">Yes, Revert</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== View Details Modal ===== -->
    <Teleport to="body">
      <div v-if="viewModalOpen && viewRow" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="viewModalOpen = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[460px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-5 text-[18px] font-medium text-ink">{{ viewRowType === 'ts' ? 'Timesheet' : 'Leave Request' }} Details</h3>
          <div class="space-y-4 text-sm">
            <div><span class="block text-xs font-medium text-ink-3">Consultant</span><span class="font-semibold text-ink">{{ consultantName(viewRow.consultant_id) }}</span></div>
            <div v-if="viewRowType === 'ts'">
              <span class="block text-xs font-medium text-ink-3">Period</span>
              <span class="font-semibold text-ink">{{ formatDate(viewRow.period_start) }} – {{ formatDate(viewRow.period_end) }}</span>
            </div>
            <div v-else>
              <span class="block text-xs font-medium text-ink-3">Leave Type</span>
              <span class="font-semibold text-ink capitalize">{{ (viewRow.leave_type || '').replace('_', ' ') }}</span>
            </div>
            <div v-if="viewRowType === 'ts'">
              <span class="block text-xs font-medium text-ink-3">Total Hours</span>
              <span class="font-semibold text-ink">{{ viewRow.total_hours }} hrs</span>
            </div>
            <div v-else>
              <span class="block text-xs font-medium text-ink-3">Dates</span>
              <span class="font-semibold text-ink">{{ formatDate(viewRow.start_date) }} – {{ formatDate(viewRow.end_date) }}</span>
            </div>
            <div v-if="viewRow.reason">
              <span class="block text-xs font-medium text-ink-3">Reason</span>
              <span class="text-ink">{{ viewRow.reason }}</span>
            </div>
            <div v-if="viewRow.rejection_reason">
              <span class="block text-xs font-medium text-ink-3">Rejection Reason</span>
              <span class="text-[#c14b4b]">{{ viewRow.rejection_reason }}</span>
            </div>
            <div>
              <span class="block text-xs font-medium text-ink-3">Status</span>
              <span class="inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium" :class="statusPill(viewRow.status)">{{ statusLabel(viewRow.status) }}</span>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="viewModalOpen = false">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="feedback" role="status" aria-live="polite" class="fixed bottom-6 right-6 z-40 rounded-[10px] bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">{{ feedback }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/utils'
import { logActivity } from '@/lib/activity'
import { ChevronDown, Check, XCircle } from 'lucide-vue-next'

const auth = useAuthStore()

// ----- State -----
const consultants = ref<any[]>([])
const timesheets = ref<any[]>([])
const leaves = ref<any[]>([])
const search = ref('')
const consultantFilter = ref('')
const feedback = ref('')

// ----- Consultant Combobox -----
const consultantComboOpen = ref(false)
const consultantComboText = ref('All consultants (full catalog)')
const consultantComboEditing = ref(false)

const consultantOptions = computed(() => {
  const base = [{ id: '', name: 'All consultants (full catalog)' }]
  const mapped = consultants.value.map((c: any) => ({ id: c.id, name: `${c.full_name} — ${c.job_title || 'No title'}` }))
  return [...base, ...mapped]
})

const filteredConsultantOptions = computed(() => {
  if (!consultantComboEditing.value) return consultantOptions.value
  const q = (consultantComboText.value || '').trim().toLowerCase()
  if (!q) return consultantOptions.value
  return consultantOptions.value.filter((o: any) => o.name.toLowerCase().includes(q))
})

function consultantName(id: string) { return consultants.value.find((c) => c.id === id)?.full_name || '—' }

function onConsultantComboFocus() { consultantComboEditing.value = true; consultantComboOpen.value = true }
function onConsultantComboInput(e: Event) { consultantComboText.value = (e.target as HTMLInputElement).value; consultantComboEditing.value = true; consultantComboOpen.value = true }
function onConsultantComboToggle() {
  if (consultantComboOpen.value) { closeConsultantCombo(); return }
  consultantComboEditing.value = false
  consultantComboText.value = consultantFilter.value ? consultantName(consultantFilter.value) : 'All consultants (full catalog)'
  consultantComboOpen.value = true
}
function selectConsultantCombo(opt: { id: string; name: string }) {
  consultantFilter.value = opt.id
  consultantComboText.value = opt.name
  consultantComboEditing.value = false
  consultantComboOpen.value = false
}
function closeConsultantCombo() {
  const text = (consultantComboText.value || '').trim()
  const exact = consultantOptions.value.find((o: any) => o.name.toLowerCase() === text.toLowerCase())
  if (exact) { consultantFilter.value = exact.id; consultantComboText.value = exact.name }
  else if (!text) { consultantFilter.value = ''; consultantComboText.value = 'All consultants (full catalog)' }
  else { consultantComboText.value = consultantFilter.value ? consultantName(consultantFilter.value) : 'All consultants (full catalog)' }
  consultantComboEditing.value = false; consultantComboOpen.value = false
}
function onConsultantComboBlur() { closeConsultantCombo() }
function onConsultantComboEscape() { consultantComboText.value = consultantFilter.value ? consultantName(consultantFilter.value) : 'All consultants (full catalog)'; consultantComboEditing.value = false; consultantComboOpen.value = false }

// ----- Filtering & Pagination -----
const PAGE_SIZE = 10
const tsPage = ref(1)
const leavePage = ref(1)

const searchedTimesheets = computed(() => {
  const q = search.value.trim().toLowerCase()
  return timesheets.value.filter((t) => {
    if (consultantFilter.value && t.consultant_id !== consultantFilter.value) return false
    if (!q) return true
    const name = consultantName(t.consultant_id).toLowerCase()
    const period = `${formatDate(t.period_start)} ${formatDate(t.period_end)}`.toLowerCase()
    return name.includes(q) || period.includes(q)
  })
})

const searchedLeaves = computed(() => {
  const q = search.value.trim().toLowerCase()
  return leaves.value.filter((l) => {
    if (consultantFilter.value && l.consultant_id !== consultantFilter.value) return false
    if (!q) return true
    const name = consultantName(l.consultant_id).toLowerCase()
    const reason = (l.reason || '').toLowerCase()
    return name.includes(q) || reason.includes(q)
  })
})

const tsTotalPages = computed(() => Math.max(1, Math.ceil(searchedTimesheets.value.length / PAGE_SIZE)))
const leaveTotalPages = computed(() => Math.max(1, Math.ceil(searchedLeaves.value.length / PAGE_SIZE)))

const pagedTimesheets = computed(() => {
  const start = (tsPage.value - 1) * PAGE_SIZE
  return searchedTimesheets.value.slice(start, start + PAGE_SIZE)
})
const pagedLeaves = computed(() => {
  const start = (leavePage.value - 1) * PAGE_SIZE
  return searchedLeaves.value.slice(start, start + PAGE_SIZE)
})

const tsRangeStart = computed(() => (searchedTimesheets.value.length === 0 ? 0 : (tsPage.value - 1) * PAGE_SIZE + 1))
const tsRangeEnd = computed(() => Math.min(searchedTimesheets.value.length, tsPage.value * PAGE_SIZE))
const leaveRangeStart = computed(() => (searchedLeaves.value.length === 0 ? 0 : (leavePage.value - 1) * PAGE_SIZE + 1))
const leaveRangeEnd = computed(() => Math.min(searchedLeaves.value.length, leavePage.value * PAGE_SIZE))

const tsPageButtons = computed<(number | '…')[]>(() => {
  const total = tsTotalPages.value; const current = tsPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
})
const leavePageButtons = computed<(number | '…')[]>(() => {
  const total = leaveTotalPages.value; const current = leavePage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
})

function goToTsPage(p: number) { if (Number.isFinite(p)) tsPage.value = Math.min(Math.max(1, p), tsTotalPages.value) }
function goToLeavePage(p: number) { if (Number.isFinite(p)) leavePage.value = Math.min(Math.max(1, p), leaveTotalPages.value) }

watch([search, consultantFilter], () => { tsPage.value = 1; leavePage.value = 1 })
watch(tsTotalPages, (max) => { if (tsPage.value > max) tsPage.value = max })
watch(leaveTotalPages, (max) => { if (leavePage.value > max) leavePage.value = max })

// ----- Status Helpers -----
function statusPill(status: string) {
  switch (status) {
    case 'approved': return 'bg-[#177245] text-white'
    case 'submitted': return 'bg-[#B0761A] text-white'
    case 'rejected': return 'bg-[#C24152] text-white'
    default: return 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink' // draft
  }
}
function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', submitted: 'Submitted', approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled' }
  return map[status] ?? status
}

// ----- Menus -----
const MENU_WIDTH = 176
const openTsMenu = ref<string | null>(null)
const openLeaveMenu = ref<string | null>(null)
const tsMenuPos = ref({ top: 0, left: 0 })
const leaveMenuPos = ref({ top: 0, left: 0 })

const openTsRow = computed(() => timesheets.value.find((t) => t.id === openTsMenu.value) || null)
const openLeaveRow = computed(() => leaves.value.find((l) => l.id === openLeaveMenu.value) || null)

function placeMenu(rect: DOMRect, approxHeight: number) {
  let left = rect.right - MENU_WIDTH; if (left < 8) left = 8
  let top = rect.bottom + 4; if (top + approxHeight > window.innerHeight - 8) top = rect.top - 4 - approxHeight
  if (top < 8) top = 8
  return { top, left }
}

function toggleTsMenu(id: string, event: MouseEvent) {
  if (openTsMenu.value === id) { openTsMenu.value = null; return }
  openLeaveMenu.value = null
  tsMenuPos.value = placeMenu((event.currentTarget as HTMLElement).getBoundingClientRect(), 140)
  openTsMenu.value = id
}
function toggleLeaveMenu(id: string, event: MouseEvent) {
  if (openLeaveMenu.value === id) { openLeaveMenu.value = null; return }
  openTsMenu.value = null
  leaveMenuPos.value = placeMenu((event.currentTarget as HTMLElement).getBoundingClientRect(), 140)
  openLeaveMenu.value = id
}
function closeMenus() { openTsMenu.value = null; openLeaveMenu.value = null }

// ----- Modals -----
const rejectModalOpen = ref(false)
const rejectType = ref<'ts' | 'leave'>('ts')
const rejectRow = ref<any>(null)
const rejectReason = ref('')

const revertModalOpen = ref(false)
const revertType = ref<'ts' | 'leave'>('ts')
const revertRow = ref<any>(null)

const viewModalOpen = ref(false)
const viewRowType = ref<'ts' | 'leave'>('ts')
const viewRow = ref<any>(null)

function openRejectModal(type: 'ts' | 'leave', row: any) {
  rejectType.value = type; rejectRow.value = row; rejectReason.value = ''; rejectModalOpen.value = true; closeMenus()
}

function handleApproveTs() {
  if (openTsRow.value?.status === 'approved') return showFeedback('This timesheet is already approved.')
  menuApproveTs()
}
function handleRejectTs() {
  if (openTsRow.value?.status === 'approved') {
    revertType.value = 'ts'
    revertRow.value = openTsRow.value
    revertModalOpen.value = true
    closeMenus()
  } else {
    openRejectModal('ts', openTsRow.value)
  }
}
function handleApproveLeave() {
  if (openLeaveRow.value?.status === 'approved') return showFeedback('This leave request is already approved.')
  menuApproveLeave()
}
function handleRejectLeave() {
  if (openLeaveRow.value?.status === 'approved') {
    revertType.value = 'leave'
    revertRow.value = openLeaveRow.value
    revertModalOpen.value = true
    closeMenus()
  } else {
    openRejectModal('leave', openLeaveRow.value)
  }
}

// ✅ FIX: Added `(supabase as any)` to bypass strict TS types
async function confirmRevert() {
  const table = revertType.value === 'ts' ? 'timesheets' : 'leave_requests'
  const { error } = await (supabase as any).from(table).update({ 
    status: 'rejected', 
    rejection_reason: 'Reverted from approved status by HR Admin.', 
    updated_at: new Date().toISOString() 
  }).eq('id', revertRow.value.id)
  
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity(`${revertType.value}.reverted`, table, revertRow.value.id, { previous_status: 'approved' })
  revertModalOpen.value = false
  showFeedback('Approval reverted successfully.')
  await refreshAll()
}

// ✅ FIX: Added `(supabase as any)` to bypass strict TS types
async function confirmReject() {
  if (!rejectReason.value.trim()) return showFeedback('Please provide a rejection reason.')
  const table = rejectType.value === 'ts' ? 'timesheets' : 'leave_requests'
  const { error } = await (supabase as any).from(table).update({ status: 'rejected', rejection_reason: rejectReason.value.trim(), updated_at: new Date().toISOString() }).eq('id', rejectRow.value.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity(`${rejectType.value}.rejected`, table, rejectRow.value.id, { reason: rejectReason.value })
  rejectModalOpen.value = false; showFeedback('Rejected successfully.'); await refreshAll()
}

function menuViewTs() { viewRowType.value = 'ts'; viewRow.value = openTsRow.value; viewModalOpen.value = true; closeMenus() }
function menuViewLeave() { viewRowType.value = 'leave'; viewRow.value = openLeaveRow.value; viewModalOpen.value = true; closeMenus() }

// ✅ FIX: Added `(supabase as any)` to bypass strict TS types
async function menuApproveTs() {
  const { error } = await (supabase as any).from('timesheets').update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: auth.user?.id }).eq('id', openTsRow.value.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity('timesheet.approved', 'timesheets', openTsRow.value.id, {})
  closeMenus(); showFeedback('Timesheet approved.'); await refreshAll()
}

// ✅ FIX: Added `(supabase as any)` to bypass strict TS types
async function menuApproveLeave() {
  const { error } = await (supabase as any).from('leave_requests').update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: auth.user?.id }).eq('id', openLeaveRow.value.id)
  if (error) return showFeedback(`Failed: ${error.message}`)
  logActivity('leave.approved', 'leave_requests', openLeaveRow.value.id, {})
  closeMenus(); showFeedback('Leave request approved.'); await refreshAll()
}

// ----- Data Loading -----
onMounted(async () => {
  const { data: cons } = await supabase.from('consultants').select('id, full_name, job_title').order('full_name')
  consultants.value = cons || []
  await refreshAll()
})

// ✅ FIX: Added `(supabase as any)` to bypass strict TS types
async function refreshAll() {
  const [t, l] = await Promise.all([
    (supabase as any).from('timesheets').select('*').order('created_at', { ascending: false }),
    (supabase as any).from('leave_requests').select('*').order('created_at', { ascending: false }),
  ])
  timesheets.value = t.data || []
  leaves.value = l.data || []
}

function showFeedback(msg: string) { feedback.value = msg; setTimeout(() => { feedback.value = '' }, 4000) }

onMounted(() => { window.addEventListener('scroll', closeMenus, true); window.addEventListener('resize', closeMenus) })
onBeforeUnmount(() => { window.removeEventListener('scroll', closeMenus, true); window.removeEventListener('resize', closeMenus) })
</script>