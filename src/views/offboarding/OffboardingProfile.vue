<template>
  <div v-if="loading" class="flex h-64 items-center justify-center gap-2.5 text-sm text-ink-3">
    <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden="true"></span>
    Loading offboarding record...
  </div>
  <div v-else-if="!onboarding" class="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
    <h2 class="mb-2 text-lg font-semibold text-ink">Record not found</h2>
    <router-link to="/offboarding-employees" class="text-sm font-medium text-brand hover:underline">
      ← Back to offboarding list
    </router-link>
  </div>
  <div v-else class="space-y-6">
    <router-link to="/offboarding-employees" class="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink">
      <AppIcon name="i-chevron" class="h-3.5 w-3.5 -rotate-90" />
      Back to list
    </router-link>

    <!-- ===== Hero card ===== -->
    <section class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="flex items-start gap-[18px]">
          <div class="grid h-[72px] w-[72px] flex-none place-items-center rounded-full bg-brand text-2xl font-semibold tracking-[.02em] text-white">
            {{ consultantInitials }}
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-2xl font-semibold leading-tight text-ink">{{ onboarding.consultants.full_name }}</h2>
              <span :class="[badgeBase, pillClass(onboarding.status)]">{{ statusLabel(onboarding.status) }}</span>
            </div>
            <p class="mt-1.5 text-[14.5px] leading-snug text-[#64758b]">
              {{ onboarding.ob_ref }} · {{ onboarding.consultants.job_title }}
            </p>
            <p class="mt-2 flex items-center gap-[7px] text-sm leading-snug text-[#64758b]">
              <AppIcon name="i-badge-check" class="h-4 w-4 flex-shrink-0" />
              {{ onboarding.consultants.client || 'No client yet' }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button v-if="canArchive" type="button" class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[rgba(179,55,63,.45)] bg-white px-[18px] text-[14.5px] font-medium text-[#B3373F] transition-colors hover:bg-[#FDF5F6]" @click="handleArchive">
            <Archive class="h-4 w-4" /> Archive Offboarding
          </button>
          <button v-if="isDraft" type="button" class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[rgba(13,95,143,.5)] bg-white px-[18px] text-[14.5px] font-medium text-brand transition-colors hover:bg-[#F2F7FA]" @click="handleSaveDraft">
            <AppIcon name="i-save" class="h-4 w-4" /> Save Draft
          </button>
          <button v-if="isDraft" type="button" class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-brand bg-brand px-[18px] text-[14.5px] font-medium text-white transition-colors hover:bg-[#0a4d73]" @click="handleSend">
            <AppIcon name="i-send" class="h-4 w-4" /> Send to Consultant
          </button>
          <button v-if="isDraft" type="button" class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[rgba(179,55,63,.45)] bg-white px-[18px] text-[14.5px] font-medium text-[#B3373F] transition-colors hover:bg-[#FDF5F6]" @click="handleDelete">
            <AppIcon name="i-trash" class="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
      <dl class="mt-[22px] grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl bg-[#EEF4F8] px-7 py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Contract Group</dt><dd class="text-[15px] font-semibold text-ink">GECO Asia Ltd</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Client</dt><dd class="text-[15px] font-semibold text-ink">{{ onboarding.consultants.client || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Department</dt><dd class="text-[15px] font-semibold text-ink">{{ onboarding.consultants.department || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Country</dt><dd class="text-[15px] font-semibold text-ink">{{ onboarding.consultants.country || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Engagement Start</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(onboarding.consultants.engagement_start) }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Engagement End</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(onboarding.consultants.engagement_end) }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Last Working Day</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(onboarding.last_working_day) }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Assigned HR Representative</dt><dd class="text-[15px] font-semibold text-ink">{{ onboarding.hr?.full_name || '—' }}</dd></div>
      </dl>
    </section>

    <!-- ✅ PHASE 4: Time & Leave Exit Criteria Warning Card -->
    <section v-if="hasTimeLeaveBlockers" class="rounded-2xl border border-[#e4b4b4] bg-[#FDF5F6] p-6 shadow-sm">
      <div class="flex items-start gap-4">
        <div class="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#FDF5F6] text-[#B3373F]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-[15px] font-semibold text-[#B3373F]">Action Required: Unapproved Timesheets</h3>
          <p class="mt-1 text-[13.5px] leading-relaxed text-[#B3373F]/90">
            This offboarding cannot be completed because there are unapproved timesheets ending on or before the Last Working Day ({{ formatDate(onboarding.last_working_day) }}). 
            Please review and approve them in the <router-link to="/time-leave" class="font-semibold underline hover:text-[#8a2530]">Time & Leave</router-link> page.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Metrics grid ===== -->
    <section class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-xl border border-brand bg-brand px-5 pb-5 pt-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <span class="text-sm font-medium text-white">Overall Progress</span>
          <AppIcon name="i-sliders" class="mt-px h-[18px] w-[18px] flex-shrink-0 text-white/90" />
        </div>
        <p class="mt-3.5 text-[21px] font-bold leading-none tracking-[-0.01em] text-white">{{ progressPercent }}%</p>
        <p class="mt-1.5 text-xs leading-snug text-white/80">{{ taskCounts.completed }} of {{ taskCounts.active }} active tasks complete</p>
      </div>
      <div class="rounded-xl border border-[#e2e8f0] bg-white px-5 pb-5 pt-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <span class="text-sm font-medium text-[#3F5265]">Completed requirements</span>
          <AppIcon name="i-check-circle" class="mt-px h-[18px] w-[18px] flex-shrink-0 text-[#7D8F9E]" />
        </div>
        <p class="mt-3.5 text-[21px] font-semibold leading-none tracking-[-0.01em] text-[#5C7285]">{{ completedReqsCount }} completed</p>
        <p class="mt-1.5 text-xs leading-snug text-[#93A3B1]">Across {{ requirements.length }} requirement groups</p>
      </div>
      <div class="rounded-xl border border-[#e2e8f0] bg-white px-5 pb-5 pt-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <span class="text-sm font-medium text-[#3F5265]">Outstanding Tasks</span>
          <AppIcon name="i-clock" class="mt-px h-[18px] w-[18px] flex-shrink-0 text-[#7D8F9E]" />
        </div>
        <p class="mt-3.5 text-[21px] font-semibold leading-none tracking-[-0.01em] text-[#5C7285]">{{ outstandingTasksCount }} outstanding</p>
        <p class="mt-1.5 text-xs leading-snug text-[#93A3B1]">Pending HR or consultant action</p>
      </div>
      <div class="rounded-xl border border-[#e2e8f0] bg-white px-5 pb-5 pt-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <span class="text-sm font-medium text-[#3F5265]">Current Lifecycle</span>
          <AppIcon name="i-badge-check" class="mt-px h-[18px] w-[18px] flex-shrink-0 text-[#7D8F9E]" />
        </div>
        <p class="mt-3.5 text-[21px] font-semibold leading-none tracking-[-0.01em] text-[#5C7285]">{{ statusLabel(onboarding.status) }}</p>
        <p class="mt-1.5 text-xs leading-snug text-[#93A3B1]">{{ lifecycleHint(onboarding.status) }}</p>
      </div>
    </section>

    <!-- ===== Phase 3: Assets & System Accounts Summary ===== -->
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-ink">Assigned Assets</h3>
          <span class="text-[12px] text-ink-3">{{ assets.length }} items</span>
        </div>
        <ul v-if="assets.length" class="flex flex-col gap-3">
          <li v-for="a in assets" :key="a.id" class="flex flex-wrap items-center gap-3 rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] p-3.5">
            <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-[#8a99a8]" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13.5px] font-semibold text-[#243447]">{{ a.asset_tag }}</span>
              <span class="mt-0.5 block text-xs text-[#8a99a8]">{{ a.category }} · {{ a.model || '—' }}</span>
            </span>
            <span class="rounded-pill px-2.5 py-1 text-xs font-medium" :class="assetPill(a.status)">{{ assetLabel(a.status) }}</span>
          </li>
        </ul>
        <p v-else class="rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-[#8a99a8]">
          No assets currently assigned to this consultant.
        </p>
      </div>

      <div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-ink">System Accounts</h3>
          <span class="text-[12px] text-ink-3">{{ accounts.length }} items</span>
        </div>
        <ul v-if="accounts.length" class="flex flex-col gap-3">
          <li v-for="s in accounts" :key="s.id" class="flex flex-wrap items-center gap-3 rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] p-3.5">
            <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-[#8a99a8]" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13.5px] font-semibold text-[#243447] capitalize">{{ (s.system || '').replace(/_/g, ' ') }}</span>
              <span class="mt-0.5 block text-xs text-[#8a99a8]">{{ s.identifier || '—' }}</span>
            </span>
            <span class="rounded-pill px-2.5 py-1 text-xs font-medium" :class="s.status === 'active' ? 'bg-[#B0761A] text-white' : 'bg-[#e5eaf1] text-[#7b8794]'">
              {{ s.status === 'active' ? 'Active' : 'Revoked' }}
            </span>
          </li>
        </ul>
        <p v-else class="rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-[#8a99a8]">
          No system accounts registered for this consultant.
        </p>
      </div>
    </section>

    <!-- ===== Requirements ===== -->
    <section class="flex flex-col gap-5">
      <div v-for="req in requirements" :key="req.id" class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2.5">
              <h3 class="text-lg font-semibold leading-tight text-ink">{{ req.name }}</h3>
              <span :class="[badgeBase, reqPill(reqStatus(req))]">{{ reqStatusLabel(reqStatus(req)) }}</span>
            </div>
            <p v-if="req.description" class="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-[#64758b]">{{ req.description }}</p>
          </div>
          <div v-if="!isLocked" class="ml-auto flex flex-wrap gap-2.5">
            <button type="button" class="inline-flex items-center gap-2 rounded-[10px] border border-[#0D5F8F] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#0D5F8F] hover:text-white" @click="openReqEdit(req)">Edit <AppIcon name="i-edit" class="h-3.5 w-3.5" /></button>
            <button type="button" class="inline-flex items-center gap-2 rounded-[10px] border border-[#e4b4b4] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#C24152] hover:text-white" @click="handleReqDelete(req)">Delete <AppIcon name="i-trash" class="h-3.5 w-3.5" /></button>
            <button type="button" class="inline-flex items-center gap-2 rounded-[10px] border border-[#0D5F8F] bg-[#0D5F8F] px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-[#198754] hover:bg-[#198754]" @click="openReqAddSub(req)">Add Task <AppIcon name="i-plus" class="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <button type="button" class="mt-4 flex w-full items-center justify-between gap-3 rounded-lg bg-[#f4f8fb] px-3.5 py-[11px] text-left transition-colors hover:bg-[#e9eef5]" :aria-expanded="expandedRequirements.has(req.id)" @click="toggleRequirement(req.id)">
          <span class="flex items-center gap-[9px] text-[13px] font-medium text-[#243447]">
            <AppIcon name="i-sliders" class="h-4 w-4 flex-shrink-0 text-[#5b6b7a]" />
            {{ reqProgressText(req) }}
          </span>
          <span class="flex items-center gap-[7px] text-[13px] font-medium text-[#8a99a8]">
            {{ expandedRequirements.has(req.id) ? 'Hide tasks' : 'View tasks' }}
            <AppIcon name="i-chevron" class="h-4 w-4 flex-shrink-0 transition-transform duration-200" :class="expandedRequirements.has(req.id) ? '-rotate-90' : 'rotate-90'" />
          </span>
        </button>
        <div v-show="expandedRequirements.has(req.id)" class="mt-4 flex flex-col gap-4">
          <div v-for="sub in req.offboarding_sub_requirements" :key="sub.id" class="rounded-xl border border-[#e6edf3] bg-[#EEF4F8] p-5">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex flex-wrap items-center gap-2.5">
                <h4 class="text-base font-semibold text-ink">{{ sub.title }}</h4>
                <span :class="[badgeBase, subPill(sub.status)]">{{ subLabel(sub.status) }}</span>
              </div>
              <div v-if="!isLocked && sub.status !== 'disabled'" class="ml-auto flex flex-wrap gap-2.5">
                <button type="button" class="inline-flex h-9 items-center gap-[7px] rounded-[9px] border px-3.5 text-[13.5px] font-semibold transition-colors" :class="sub.status === 'pending' ? 'border-[#b7791f] bg-[#b7791f] text-white hover:bg-[#97641a]' : 'border-[#d5dee7] bg-white text-[#5c7285] hover:bg-[#f4f8fb]'" @click="setSubStatus(sub, 'pending')">
                  Pending <AppIcon name="i-undo" class="h-[15px] w-[15px]" />
                </button>
                <button type="button" class="inline-flex h-9 items-center gap-[7px] rounded-[9px] border px-3.5 text-[13.5px] font-semibold transition-colors" :class="sub.status === 'completed' ? 'border-[#198754] bg-[#198754] text-white hover:bg-[#146c43]' : 'border-[#d5dee7] bg-white text-[#5c7285] hover:bg-[#f4f8fb]'" @click="setSubStatus(sub, 'completed')">
                  Mark Complete <AppIcon name="i-check-circle" class="h-[15px] w-[15px]" />
                </button>
              </div>
            </div>
            <div class="mt-4 flex flex-col gap-3.5">
              <div>
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">Instructions</span>
                <p class="rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] px-4 py-3 text-sm leading-relaxed text-[#243447]">{{ sub.instructions || 'No instructions provided' }}</p>
              </div>
              <div>
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">Resource Link</span>
                <p class="rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] px-4 py-3 text-sm leading-relaxed">
                  <a v-if="sub.resource_url" :href="sub.resource_url" target="_blank" rel="noopener" class="break-all text-[#1f6f9f] hover:underline">{{ sub.resource_url }}</a>
                  <span v-else class="text-[#8a99a8]">No resource URL configured</span>
                </p>
              </div>
              <div>
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">Attached Resources</span>
                <div v-if="!isLocked" class="flex flex-wrap items-center gap-3">
                  <button type="button" class="rounded-lg border border-[#d5dee7] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-[#f2f6fa]" @click="triggerSubUpload(sub.id)">Upload Files</button>
                  <input :ref="(el) => setSubUploadRef(sub.id, el)" type="file" multiple class="hidden" @change="(e) => onSubFilesPicked(e, sub)" />
                </div>
                <ul v-if="sub.offboarding_files?.length" class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
                  <li v-for="file in sub.offboarding_files" :key="file.id" class="relative flex items-center gap-2.5 rounded-[9px] border border-[#e2e8f0] bg-white p-3">
                    <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-[#8a99a8]" />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-[13.5px] font-semibold text-[#243447]">{{ file.file_name }}</span>
                      <span class="mt-0.5 block text-xs text-[#8a99a8]">{{ fileKind(file.file_name, file.file_type) }} · {{ formatFileSize(file.file_size) }}</span>
                    </span>
                    <button type="button" class="h-8 flex-shrink-0 rounded-lg bg-[#dce9f2] px-3.5 text-[13px] font-semibold text-[#23415a] transition-colors hover:bg-[#cddfeb]" @click="openFile(file.storage_path)">Open</button>
                    <button v-if="!isLocked" type="button" aria-label="Remove file" class="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#cdd7de] text-[#3f4a55] transition-colors hover:bg-[#b9c6cf]" @click="handleRemoveFile(file)">
                      <AppIcon name="i-x" class="h-2.5 w-2.5" />
                    </button>
                  </li>
                </ul>
                <p v-else class="mt-3 rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-[#8a99a8]">No files uploaded for this task</p>
              </div>
            </div>
          </div>
          <p v-if="!req.offboarding_sub_requirements?.length" class="rounded-xl border-[1.5px] border-dashed border-[#b9c6d2] bg-[#f4f8fb] px-5 py-[18px] text-sm text-[#64758b]">
            No tasks yet. Use "Add Task" to create the first one.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Feedback Toast ===== -->
    <div v-if="feedbackMessage" role="status" aria-live="polite" class="fixed bottom-6 right-6 z-40 rounded-[10px] bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">
      {{ feedbackMessage }}
    </div>

    <!-- ===== Offboarding Requirement Modal ===== -->
    <OffboardingRequirementModal 
      :open="showReqModal" 
      :edit-id="editingReqId" 
      :offboarding-id="offboardingId" 
      @close="showReqModal = false" 
      @saved="handleReqSaved" 
    />

    <!-- ✅ PHASE 4: Blocking Modal for Exit Criteria -->
    <Teleport to="body">
      <div v-if="showBlockerModal" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="showBlockerModal = false">
        <div role="dialog" aria-modal="true" class="w-full max-w-[460px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-2 text-[18px] font-medium text-ink">Cannot Complete Offboarding</h3>
          <p class="mb-5 text-[13px] text-ink-3">
            There are unapproved timesheets ending on or before the Last Working Day. Please approve them in the Time & Leave page before archiving this record.
          </p>
          <div class="flex justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="showBlockerModal = false">
              Close
            </button>
            <router-link to="/time-leave" class="rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-brand-dk">
              Go to Time & Leave
            </router-link>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatFileSize, fileKind } from '@/lib/utils'
import { Archive } from 'lucide-vue-next'
import { logActivity } from '@/lib/activity'
// ✅ PHASE 4: Import validator
import { hasUnapprovedTimesheets } from '@/lib/validators'
import OffboardingRequirementModal from '@/components/offboarding/OffboardingRequirementModal.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const onboarding = ref<any>(null)
const requirements = ref<any[]>([])
const assets = ref<any[]>([])
const accounts = ref<any[]>([])
const loading = ref(true)
const expandedRequirements = ref<Set<string>>(new Set())
const feedbackMessage = ref('')

// ✅ PHASE 4: Validator state
const hasTimeLeaveBlockers = ref(false)
const showBlockerModal = ref(false)

const showReqModal = ref(false)
const editingReqId = ref<string | null>(null)
const offboardingId = computed(() => route.params.id as string)

const badgeBase = 'inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium leading-tight'

function pillClass(status: string) {
  switch (status) {
    case 'in_progress': return 'bg-[#0E5A8C] text-white'
    case 'completed': return 'bg-[#177245] text-white'
    case 'sent': return 'bg-[#B0761A] text-white'
    case 'draft': return 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink'
    default: return 'bg-[#e5eaf1] text-[#7b8794]'
  }
}
function statusLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', sent: 'Pending', in_progress: 'In Progress', completed: 'Completed', archived: 'Archived' }
  return map[status] ?? status
}
function subPill(status: string) {
  switch (status) {
    case 'completed': return 'bg-[#177245] text-white'
    case 'disabled': return 'bg-[#e5eaf1] text-[#7b8794]'
    default: return 'bg-[#B0761A] text-white'
  }
}
function subLabel(status: string) {
  const map: Record<string, string> = { completed: 'Completed', pending: 'Pending', disabled: 'Disabled' }
  return map[status] ?? status
}
function reqStatus(req: any): 'completed' | 'in_progress' | 'pending' {
  const subs = (req.offboarding_sub_requirements || []).filter((s: any) => s.status !== 'disabled')
  if (subs.length === 0) return 'pending'
  const done = subs.filter((s: any) => s.status === 'completed').length
  if (done === subs.length) return 'completed'
  return done > 0 ? 'in_progress' : 'pending'
}
function reqPill(status: string) {
  switch (status) {
    case 'completed': return 'bg-[#177245] text-white'
    case 'in_progress': return 'bg-[#0E5A8C] text-white'
    default: return 'bg-[#B0761A] text-white'
  }
}
function reqStatusLabel(status: string) {
  const map: Record<string, string> = { completed: 'Completed', in_progress: 'In Progress', pending: 'Pending' }
  return map[status] ?? status
}
function reqProgressText(req: any) {
  const subs = (req.offboarding_sub_requirements || []).filter((s: any) => s.status !== 'disabled')
  const done = subs.filter((s: any) => s.status === 'completed').length
  return `${done} of ${subs.length} completed`
}
function lifecycleHint(status: string) {
  const map: Record<string, string> = {
    draft: 'Awaiting first send to consultant',
    sent: 'Sent to consultant, tasks pending',
    in_progress: 'Tasks in flight before Day One',
    completed: 'Locked — read only',
    archived: 'Archived record',
  }
  return map[status] ?? ''
}

function assetPill(status: string) {
  switch (status) {
    case 'assigned': return 'bg-[#0E5A8C] text-white'
    case 'in_stock': return 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink'
    case 'maintenance': return 'bg-[#B0761A] text-white'
    default: return 'bg-[#e5eaf1] text-[#7b8794]'
  }
}
function assetLabel(status: string) {
  const map: Record<string, string> = { in_stock: 'In Stock', assigned: 'Assigned', maintenance: 'Maintenance', retired: 'Retired' }
  return map[status] ?? status
}

const isDraft = computed(() => onboarding.value?.status === 'draft')
const isLocked = computed(() => ['completed', 'archived'].includes(onboarding.value?.status))
const canArchive = computed(() => ['sent', 'in_progress'].includes(onboarding.value?.status))

const consultantInitials = computed(() =>
  (onboarding.value?.consultants?.full_name || '').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
)

const taskCounts = computed(() => {
  let active = 0, completed = 0
  requirements.value.forEach((req) => {
    req.offboarding_sub_requirements?.forEach((sub: any) => {
      if (sub.status !== 'disabled') { active++; if (sub.status === 'completed') completed++ }
    })
  })
  return { active, completed }
})

const progressPercent = computed(() => {
  const { active, completed } = taskCounts.value
  return active === 0 ? 0 : Math.round((completed / active) * 100)
})

const completedReqsCount = computed(() => requirements.value.filter((req) => reqStatus(req) === 'completed').length)

const outstandingTasksCount = computed(() => {
  let count = 0
  requirements.value.forEach((req) => {
    req.offboarding_sub_requirements?.forEach((sub: any) => {
      if (sub.status !== 'disabled' && sub.status !== 'completed') count++
    })
  })
  return count
})

onMounted(async () => {
  await fetchData()
  if (requirements.value.length > 0) expandedRequirements.value.add(requirements.value[0].id)
})

async function fetchData() {
  loading.value = true
  const obId = route.params.id as string
  
  const { data: obData, error: obError } = await supabase
    .from('offboardings')
    .select(`
      id, ob_ref, status, last_working_day, consultant_id,
      consultants:consultant_id (full_name, job_title, email, client, project, department, country, engagement_start, engagement_end),
      hr:assigned_hr_id (full_name)
    `)
    .eq('id', obId)
    .single() as any

  if (obError || !obData) { 
    console.error('Error fetching offboarding:', obError)
    loading.value = false
    return 
  }
  
  onboarding.value = obData

  // ✅ PHASE 4: Check for unapproved timesheets <= LWD
  if (obData.consultant_id && obData.last_working_day) {
    hasTimeLeaveBlockers.value = await hasUnapprovedTimesheets(obData.consultant_id, obData.last_working_day)
  }

  // Phase 3: Fetch Assets & System Accounts
  if (obData.consultant_id) {
    const [assetsRes, accountsRes] = await Promise.all([
      supabase.from('assets').select('*').eq('assigned_to', obData.consultant_id).order('created_at', { ascending: false }),
      supabase.from('system_accounts').select('*').eq('consultant_id', obData.consultant_id).order('created_at', { ascending: false })
    ])
    assets.value = assetsRes.data || []
    accounts.value = accountsRes.data || []
  }

  const { data: reqsData, error: reqsError } = await supabase
    .from('offboarding_requirements')
    .select(`
      id, name, description, sort_order,
      offboarding_sub_requirements (
        id, title, instructions, resource_url, status, completed_at, sort_order,
        offboarding_files (id, file_name, file_type, file_size, storage_path)
      )
    `)
    .eq('offboarding_id', obId)
    .order('sort_order', { ascending: true })
    .order('sort_order', { ascending: true, referencedTable: 'offboarding_sub_requirements' })

  if (reqsError) console.error('Error fetching requirements:', reqsError)
  else requirements.value = reqsData || []
  
  loading.value = false
}

function toggleRequirement(id: string) {
  if (expandedRequirements.value.has(id)) expandedRequirements.value.delete(id)
  else expandedRequirements.value.add(id)
}

async function setSubStatus(sub: any, status: 'pending' | 'completed') {
  if (sub.status === status) return
  const { error } = await supabase
    .from('offboarding_sub_requirements')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      completed_by: status === 'completed' ? auth.user?.id : null,
    })
    .eq('id', sub.id)
  if (error) { console.error(error); showFeedback('Failed to update status'); return }
  logActivity(status === 'completed' ? 'task.completed' : 'task.reopened', 'offboarding_sub_requirement', sub.id, { title: sub.title })
  showFeedback(status === 'completed' ? 'Marked as completed' : 'Marked as pending')
  await fetchData()
}

function openReqEdit(req: any) {
  editingReqId.value = req.id
  showReqModal.value = true
}

function openReqAddSub(req: any) {
  editingReqId.value = req.id
  showReqModal.value = true
}

function handleReqSaved() {
  showReqModal.value = false
  editingReqId.value = null
  fetchData()
}

async function handleReqDelete(req: any) {
  if (!confirm(`Delete requirement "${req.name}" and all its tasks from this offboarding?`)) return
  const reqId = req.id
  const subIds = (req.offboarding_sub_requirements || []).map((s: any) => s.id)
  try {
    if (subIds.length > 0) {
      const { error: filesErr } = await supabase.from('offboarding_files').delete().in('offboarding_sub_requirement_id', subIds)
      if (filesErr) throw filesErr
      const { error: subsErr } = await supabase.from('offboarding_sub_requirements').delete().in('id', subIds)
      if (subsErr) throw subsErr
    }
    const { error: reqErr } = await supabase.from('offboarding_requirements').delete().eq('id', reqId)
    if (reqErr) throw reqErr
    logActivity('requirement.deleted', 'offboarding_requirement', reqId, { name: req.name })
    showFeedback('Requirement deleted'); await fetchData()
  } catch (err: any) { console.error(err); showFeedback(`Failed to delete: ${err.message || 'Unknown error'}`) }
}

const subUploadRefs = new Map<string, HTMLInputElement>()
function setSubUploadRef(id: string, el: any) {
  if (el) subUploadRefs.set(id, el as HTMLInputElement)
  else subUploadRefs.delete(id)
}
function triggerSubUpload(subId: string) { subUploadRefs.get(subId)?.click() }

async function onSubFilesPicked(e: Event, sub: any) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const count = input.files.length
  try {
    for (const f of Array.from(input.files)) {
      const path = `offboarding/${sub.id}/${Date.now()}_${f.name}`
      const { error: upErr } = await supabase.storage.from('config-files').upload(path, f)
      if (upErr) throw upErr
      const { error: dbErr } = await supabase.from('offboarding_files').insert({
        offboarding_sub_requirement_id: sub.id, source_file_id: null,
        storage_path: path, file_name: f.name, file_type: f.type, file_size: f.size,
      })
      if (dbErr) throw dbErr
    }
    logActivity('file.uploaded', 'offboarding_sub_requirement', sub.id, { count })
    showFeedback('File(s) uploaded'); await fetchData()
  } catch (err) { console.error(err); showFeedback('Failed to upload one or more files') }
  finally { input.value = '' }
}

async function handleRemoveFile(file: any) {
  if (!confirm(`Remove "${file.file_name}" from this offboarding?`)) return
  const { error } = await supabase.from('offboarding_files').delete().eq('id', file.id)
  if (error) { console.error(error); showFeedback('Failed to remove file'); return }
  logActivity('file.removed', 'offboarding_file', file.id, { file_name: file.file_name })
  showFeedback('File removed'); await fetchData()
}

async function openFile(storagePath: string) {
  const { data, error } = await supabase.storage.from('config-files').createSignedUrl(storagePath, 60)
  if (error || !data?.signedUrl) { console.error(error); showFeedback('Failed to open file.'); return }
  window.open(data.signedUrl, '_blank')
}

async function handleSend() {
  const { error } = await supabase
    .from('offboardings')
    .update({ status: 'sent', sent_at: new Date().toISOString(), sent_by: auth.user?.id })
    .eq('id', onboarding.value.id)
  if (error) { console.error(error); showFeedback('Failed to send offboarding'); return }
  logActivity('offboarding.sent', 'offboarding', onboarding.value.id, { ob_ref: onboarding.value.ob_ref })
  showFeedback('Sent to consultant successfully'); await fetchData()
}

function handleSaveDraft() { showFeedback('Offboarding saved as draft') }

// ✅ PHASE 4: Block archive if timesheet validators fail
async function handleArchive() {
  if (hasTimeLeaveBlockers.value) {
    showBlockerModal.value = true
    return
  }

  const { error } = await supabase.from('offboardings').update({ status: 'archived' }).eq('id', onboarding.value.id)
  if (error) { console.error(error); showFeedback('Failed to archive'); return }
  logActivity('offboarding.archived', 'offboarding', onboarding.value.id, { ob_ref: onboarding.value.ob_ref })
  showFeedback('Record archived'); router.push('/offboarding-employees')
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this draft? This cannot be undone.')) return
  const obId = onboarding.value.id
  const obRef = onboarding.value.ob_ref
  try {
    const { data: reqs, error: reqsErr } = await supabase.from('offboarding_requirements').select('id').eq('offboarding_id', obId)
    if (reqsErr) throw reqsErr
    const reqIds = (reqs || []).map((r: any) => r.id)
    if (reqIds.length > 0) {
      const { data: subs, error: subsErr } = await supabase.from('offboarding_sub_requirements').select('id').in('offboarding_requirement_id', reqIds)
      if (subsErr) throw subsErr
      const subIds = (subs || []).map((s: any) => s.id)
      if (subIds.length > 0) {
        const { error: filesErr } = await supabase.from('offboarding_files').delete().in('offboarding_sub_requirement_id', subIds)
        if (filesErr) throw filesErr
        const { error: subsDelErr } = await supabase.from('offboarding_sub_requirements').delete().in('id', subIds)
        if (subsDelErr) throw subsDelErr
      }
      const { error: reqsDelErr } = await supabase.from('offboarding_requirements').delete().in('id', reqIds)
      if (reqsDelErr) throw reqsDelErr
    }
    const { error: obErr } = await supabase.from('offboardings').delete().eq('id', obId)
    if (obErr) throw obErr
    logActivity('offboarding.deleted', 'offboarding', obId, { ob_ref: obRef })
    showFeedback('Record deleted'); router.push('/offboarding-employees')
  } catch (err: any) { console.error(err); showFeedback(`Failed to delete: ${err.message || 'Unknown error'}`) }
}

function showFeedback(msg: string) {
  feedbackMessage.value = msg
  setTimeout(() => { feedbackMessage.value = '' }, 3000)
}
</script>