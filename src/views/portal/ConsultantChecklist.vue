<template>
  <div v-if="loading" class="flex h-64 items-center justify-center gap-2.5 text-sm text-ink-3">
    <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden="true"></span>
    Loading your offboarding checklist...
  </div>

  <!-- Empty state: nothing sent yet -->
  <div
    v-else-if="!record"
    class="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white px-8 py-16 text-center shadow-sm"
  >
    <AppIcon name="i-inbox" class="h-10 w-10 text-[#9aa8ba]" />
    <h2 class="text-lg font-semibold text-ink">No offboarding checklist yet</h2>
    <p class="max-w-[46ch] text-sm leading-relaxed text-ink-3">
      Your HR representative will send your offboarding checklist once it is prepared.
      You'll see it here the moment it arrives.
    </p>
  </div>

  <div v-else class="space-y-6">
    <!-- Read-only banner -->
    <div
      v-if="isLocked"
      role="status"
      class="flex items-center gap-2.5 rounded-xl border border-[#bfe3d0] bg-[#eaf6ef] px-4 py-3 text-[13.5px] font-medium text-[#177245]"
    >
      <AppIcon name="i-check-circle" class="h-4 w-4 flex-shrink-0" />
      This offboarding is completed — the checklist is read-only.
    </div>

    <!-- Hero card -->
    <section class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="flex items-start gap-[18px]">
          <div class="grid h-[64px] w-[64px] flex-none place-items-center rounded-full bg-brand text-xl font-semibold text-white">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl font-semibold leading-tight text-ink">{{ record.consultants.full_name }}</h1>
              <span :class="[badgeBase, pillClass(record.status)]">{{ statusLabel(record.status) }}</span>
            </div>
            <p class="mt-1.5 text-[14.5px] leading-snug text-[#64758b]">
              {{ record.ob_ref }} · {{ record.consultants.job_title }}
            </p>
            <p class="mt-2 flex items-center gap-[7px] text-sm leading-snug text-[#64758b]">
              <AppIcon name="i-badge-check" class="h-4 w-4 flex-shrink-0" />
              {{ record.consultants.client }}<template v-if="record.consultants.project"> / {{ record.consultants.project }}</template>
            </p>
          </div>
        </div>

        <div class="rounded-xl bg-[#EEF4F8] px-5 py-4">
          <div class="text-xs font-medium text-[#64758b]">Last working day</div>
          <div class="mt-1 text-lg font-semibold leading-none text-ink">{{ formatDate(record.last_working_day) }}</div>
          <div class="mt-3 text-xs font-medium text-[#64758b]">Your HR contact</div>
          <div class="mt-1 text-[13.5px] font-semibold leading-tight text-ink">{{ record.hr?.full_name || '—' }}</div>
        </div>
      </div>

      <!-- Progress strip -->
      <div class="mt-6">
        <div class="flex items-center justify-between text-[13px] font-medium">
          <span class="text-ink-2">{{ taskCounts.completed }} of {{ taskCounts.active }} tasks complete</span>
          <span class="font-semibold text-brand">{{ progressPercent }}%</span>
        </div>
        <div class="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
          <div class="h-full rounded-full bg-[#0D5F8F] transition-all duration-300" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>
    </section>

    <!-- Checklist -->
    <section class="flex flex-col gap-5">
      <div
        v-for="req in requirements"
        :key="req.id"
        class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
      >
        <!-- Requirement header -->
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2.5">
            <h2 class="text-lg font-semibold leading-tight text-ink">{{ req.name }}</h2>
            <span :class="[badgeBase, reqPill(reqStatus(req))]">{{ reqStatusLabel(reqStatus(req)) }}</span>
          </div>
          <p v-if="req.description" class="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-[#64758b]">{{ req.description }}</p>
        </div>

        <!-- Progress strip / toggle -->
        <button
          type="button"
          class="mt-4 flex w-full items-center justify-between gap-3 rounded-lg bg-[#f4f8fb] px-3.5 py-[11px] text-left transition-colors hover:bg-[#e9eef5]"
          :aria-expanded="expanded.has(req.id)"
          @click="toggle(req.id)"
        >
          <span class="flex items-center gap-[9px] text-[13px] font-medium text-[#243447]">
            <AppIcon name="i-sliders" class="h-4 w-4 flex-shrink-0 text-[#5b6b7a]" />
            {{ reqProgressText(req) }}
          </span>
          <span class="flex items-center gap-[7px] text-[13px] font-medium text-[#8a99a8]">
            {{ expanded.has(req.id) ? 'Hide tasks' : 'View tasks' }}
            <AppIcon name="i-chevron" class="h-4 w-4 flex-shrink-0 transition-transform duration-200" :class="expanded.has(req.id) ? '-rotate-90' : 'rotate-90'" />
          </span>
        </button>

        <!-- Sub-requirements -->
        <div v-show="expanded.has(req.id)" class="mt-4 flex flex-col gap-4">
          <div
            v-for="sub in req.offboarding_sub_requirements"
            :key="sub.id"
            class="rounded-xl border border-[#e6edf3] bg-[#EEF4F8] p-5"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex flex-wrap items-center gap-2.5">
                <h3 class="text-base font-semibold text-ink">{{ sub.title }}</h3>
                <span :class="[badgeBase, subPill(sub.status)]">{{ subLabel(sub.status) }}</span>
              </div>

              <div v-if="!isLocked && sub.status !== 'disabled'" class="ml-auto flex flex-wrap gap-2.5">
                <button
                  type="button"
                  class="inline-flex h-9 items-center gap-[7px] rounded-[9px] border px-3.5 text-[13.5px] font-semibold transition-colors"
                  :class="sub.status === 'pending'
                    ? 'border-[#b7791f] bg-[#b7791f] text-white hover:bg-[#97641a]'
                    : 'border-[#d5dee7] bg-white text-[#5c7285] hover:bg-[#f4f8fb]'"
                  @click="setSubStatus(sub, 'pending')"
                >
                  Reopen <AppIcon name="i-undo" class="h-[15px] w-[15px]" />
                </button>
                <button
                  type="button"
                  class="inline-flex h-9 items-center gap-[7px] rounded-[9px] border px-3.5 text-[13.5px] font-semibold transition-colors"
                  :class="sub.status === 'completed'
                    ? 'border-[#198754] bg-[#198754] text-white hover:bg-[#146c43]'
                    : 'border-[#d5dee7] bg-white text-[#5c7285] hover:bg-[#f4f8fb]'"
                  @click="setSubStatus(sub, 'completed')"
                >
                  Mark Complete <AppIcon name="i-check-circle" class="h-[15px] w-[15px]" />
                </button>
              </div>
            </div>

            <div class="mt-4 flex flex-col gap-3.5">
              <div v-if="sub.instructions">
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">Instructions</span>
                <p class="rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] px-4 py-3 text-sm leading-relaxed text-[#243447]">
                  {{ sub.instructions }}
                </p>
              </div>

              <div v-if="sub.resource_url">
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">Resource Link</span>
                <p class="rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] px-4 py-3 text-sm leading-relaxed">
                  <a :href="sub.resource_url" target="_blank" rel="noopener" class="break-all text-[#1f6f9f] hover:underline">{{ sub.resource_url }}</a>
                </p>
              </div>

              <!-- HR-provided files -->
              <div v-if="hrFiles(sub).length">
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">Resources from HR</span>
                <ul class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
                  <li v-for="file in hrFiles(sub)" :key="file.id" class="flex items-center gap-2.5 rounded-[9px] border border-[#e2e8f0] bg-white p-3">
                    <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-[#8a99a8]" />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-[13.5px] font-semibold text-[#243447]">{{ file.file_name }}</span>
                      <span class="mt-0.5 block text-xs text-[#8a99a8]">{{ fileKind(file.file_name, file.file_type) }} · {{ formatFileSize(file.file_size) }}</span>
                    </span>
                    <button type="button" class="h-8 flex-shrink-0 rounded-lg bg-[#dce9f2] px-3.5 text-[13px] font-semibold text-[#23415a] transition-colors hover:bg-[#cddfeb]" @click="openFile(file.storage_path)">Open</button>
                  </li>
                </ul>
              </div>

              <!-- Consultant uploads -->
              <div>
                <span class="mb-1.5 block text-xs font-semibold text-[#64758b]">My uploads</span>
                <div v-if="!isLocked" class="flex flex-wrap items-center gap-3">
                  <button type="button" class="rounded-lg border border-[#d5dee7] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-[#f2f6fa]" @click="triggerUpload(sub.id)">
                    Upload my file(s)
                  </button>
                  <input :ref="(el) => setUploadRef(sub.id, el)" type="file" multiple class="hidden" @change="(e) => onFilesPicked(e, sub)" />
                </div>
                <ul v-if="myFiles(sub).length" class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
                  <li v-for="file in myFiles(sub)" :key="file.id" class="relative flex items-center gap-2.5 rounded-[9px] border border-[#e2e8f0] bg-white p-3">
                    <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-[#8a99a8]" />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-[13.5px] font-semibold text-[#243447]">{{ file.file_name }}</span>
                      <span class="mt-0.5 block text-xs text-[#8a99a8]">{{ fileKind(file.file_name, file.file_type) }} · {{ formatFileSize(file.file_size) }}</span>
                    </span>
                    <button type="button" class="h-8 flex-shrink-0 rounded-lg bg-[#dce9f2] px-3.5 text-[13px] font-semibold text-[#23415a] transition-colors hover:bg-[#cddfeb]" @click="openFile(file.storage_path)">Open</button>
                    <button
                      v-if="!isLocked"
                      type="button"
                      aria-label="Remove file"
                      class="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#cdd7de] text-[#3f4a55] transition-colors hover:bg-[#b9c6cf]"
                      @click="removeFile(file)"
                    >
                      <AppIcon name="i-x" class="h-2.5 w-2.5" />
                    </button>
                  </li>
                </ul>
                <p v-else class="mt-3 rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-[#8a99a8]">
                  No files uploaded yet for this task.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feedback toast -->
    <div
      v-if="feedback"
      role="status"
      aria-live="polite"
      class="fixed bottom-6 right-6 z-40 rounded-[10px] bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      {{ feedback }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatFileSize, fileKind } from '@/lib/utils'

const auth = useAuthStore()

const record = ref<any>(null)
const requirements = ref<any[]>([])
const loading = ref(true)
const expanded = ref<Set<string>>(new Set())
const feedback = ref('')

const badgeBase = 'inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium leading-tight'

const initials = computed(() =>
  (record.value?.consultants?.full_name || '')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

const isLocked = computed(() => ['completed', 'archived'].includes(record.value?.status))

const taskCounts = computed(() => {
  let active = 0
  let completed = 0
  requirements.value.forEach((req) => {
    (req.offboarding_sub_requirements || []).forEach((s: any) => {
      if (s.status !== 'disabled') {
        active++
        if (s.status === 'completed') completed++
      }
    })
  })
  return { active, completed }
})

const progressPercent = computed(() => {
  const { active, completed } = taskCounts.value
  return active === 0 ? 0 : Math.round((completed / active) * 100)
})

function pillClass(status: string) {
  switch (status) {
    case 'in_progress': return 'bg-[#0E5A8C] text-white'
    case 'completed': return 'bg-[#177245] text-white'
    case 'sent': return 'bg-[#B0761A] text-white'
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
  if (!subs.length) return 'pending'
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

// Snapshot files came from configs ('config-files/...'); consultant uploads use 'offboarding/...'
function hrFiles(sub: any) {
  return (sub.offboarding_files || []).filter((f: any) => !f.storage_path?.startsWith('offboarding/'))
}
function myFiles(sub: any) {
  return (sub.offboarding_files || []).filter((f: any) => f.storage_path?.startsWith('offboarding/'))
}

function toggle(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

onMounted(fetchAll)

async function fetchAll() {
  loading.value = true
  const cid = auth.consultantId
  if (!cid) { loading.value = false; return }

  const { data: obs } = await supabase
    .from('offboardings')
    .select(`
      id, ob_ref, status, last_working_day,
      consultants:consultant_id (full_name, job_title, client, project),
      hr:assigned_hr_id (full_name, email)
    `)
    .eq('consultant_id', cid)
    .order('created_at', { ascending: false })

  const list = obs || []
  record.value =
    list.find((o: any) => ['sent', 'in_progress'].includes(o.status)) ??
    list.find((o: any) => o.status === 'completed') ??
    null

  if (record.value) {
    const { data: reqs } = await supabase
      .from('offboarding_requirements')
      .select(`
        id, name, description, sort_order,
        offboarding_sub_requirements (
          id, title, instructions, resource_url, status, sort_order,
          offboarding_files (id, file_name, file_type, file_size, storage_path)
        )
      `)
      .eq('offboarding_id', record.value.id)
      .order('sort_order', { ascending: true })
      .order('sort_order', { ascending: true, referencedTable: 'offboarding_sub_requirements' })

    requirements.value = reqs || []
    expanded.value = new Set(requirements.value.map((r: any) => r.id))
  } else {
    requirements.value = []
  }

  loading.value = false
}

// --- Task state + lifecycle transitions ---
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

  if (error) {
    console.error('Error updating task:', error)
    showFeedback('Failed to update task')
    return
  }
  sub.status = status
  await syncRecordStatus()
  await fetchAll()
}

async function syncRecordStatus() {
  const subs = requirements.value
    .flatMap((r: any) => r.offboarding_sub_requirements || [])
    .filter((s: any) => s.status !== 'disabled')
  const done = subs.filter((s: any) => s.status === 'completed').length

  let next = record.value.status
  if (next === 'sent' && done > 0) next = 'in_progress'
  if (['sent', 'in_progress'].includes(next) && subs.length > 0 && done === subs.length) next = 'completed'

  if (next !== record.value.status) {
    const { error } = await supabase.from('offboardings').update({ status: next }).eq('id', record.value.id)
    if (error) console.error('Error syncing status:', error)
    else showFeedback(next === 'completed' ? 'All tasks completed — offboarding finalized' : 'Progress saved')
  } else {
    showFeedback(done > 0 ? 'Task updated' : 'Task reopened')
  }
}

// --- Consultant uploads ---
const uploadRefs = new Map<string, HTMLInputElement>()
function setUploadRef(id: string, el: any) {
  if (el) uploadRefs.set(id, el as HTMLInputElement)
  else uploadRefs.delete(id)
}
function triggerUpload(subId: string) {
  uploadRefs.get(subId)?.click()
}

async function onFilesPicked(e: Event, sub: any) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  try {
    for (const f of Array.from(input.files)) {
      const path = `offboarding/${sub.id}/${Date.now()}_${f.name}`
      const { error: upErr } = await supabase.storage.from('config-files').upload(path, f)
      if (upErr) throw upErr
      
      // FIXED: Added source_file_id: null to satisfy the generated Insert type
      const { error: dbErr } = await supabase.from('offboarding_files').insert({
        offboarding_sub_requirement_id: sub.id,
        source_file_id: null,
        storage_path: path,
        file_name: f.name,
        file_type: f.type,
        file_size: f.size,
      })
      if (dbErr) throw dbErr
    }
    showFeedback('File(s) uploaded')
    await fetchAll()
  } catch (err) {
    console.error('Upload error:', err)
    showFeedback('Failed to upload one or more files')
  } finally {
    input.value = ''
  }
}

async function removeFile(file: any) {
  if (!confirm(`Remove "${file.file_name}"?`)) return
  const { error } = await supabase.from('offboarding_files').delete().eq('id', file.id)
  if (error) {
    console.error('Error removing file:', error)
    showFeedback('Failed to remove file')
  } else {
    await supabase.storage.from('config-files').remove([file.storage_path])
    showFeedback('File removed')
    await fetchAll()
  }
}

async function openFile(storagePath: string) {
  const { data, error } = await supabase.storage.from('config-files').createSignedUrl(storagePath, 60)
  if (error || !data?.signedUrl) {
    console.error('Signed URL error:', error)
    showFeedback('Failed to open file.')
    return
  }
  window.open(data.signedUrl, '_blank')
}

function showFeedback(msg: string) {
  feedback.value = msg
  setTimeout(() => { feedback.value = '' }, 3000)
}
</script>