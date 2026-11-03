<template>
  <div v-if="loading" class="flex h-64 items-center justify-center gap-2.5 text-sm text-ink-3">
    <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden="true"></span>
    Loading consultant…
  </div>

  <div v-else-if="!consultant" class="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
    <h2 class="mb-2 text-lg font-semibold text-ink">Consultant not found</h2>
    <router-link to="/consultants" class="text-sm font-medium text-brand hover:underline">← Back to consultants</router-link>
  </div>

  <div v-else class="space-y-6">
    <router-link to="/consultants" class="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink">
      <AppIcon name="i-chevron" class="h-3.5 w-3.5 -rotate-90" />
      Back to consultants
    </router-link>

    <!-- Info card -->
    <section class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="flex items-start gap-[18px]">
          <div class="grid h-[72px] w-[72px] flex-none place-items-center rounded-full bg-brand text-2xl font-semibold text-white">{{ initials }}</div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-2xl font-semibold leading-tight text-ink">{{ consultant.full_name }}</h2>
              <span :class="[badgeBase, pill.cls]">{{ pill.label }}</span>
            </div>
            <p class="mt-1.5 text-[14.5px] leading-snug text-[#64758b]">{{ consultant.job_title }} · {{ consultant.email }}</p>
            <p class="mt-2 flex items-center gap-[7px] text-sm leading-snug text-[#64758b]">
              <AppIcon name="i-badge-check" class="h-4 w-4 flex-shrink-0" />
              {{ consultant.client || 'No client assigned' }}<template v-if="consultant.project"> / {{ consultant.project }}</template>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-if="consultant.status === 'active'"
            type="button"
            class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[#B0761A] bg-white px-[18px] text-[14.5px] font-medium text-[#B0761A] transition-colors hover:bg-[#FBF6EC]"
            @click="setStatus('on_bench')"
          >
            Move to Bench
          </button>
          <button
            v-if="consultant.status === 'on_bench' || consultant.status === 'prospect'"
            type="button"
            class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[#177245] bg-white px-[18px] text-[14.5px] font-medium text-[#177245] transition-colors hover:bg-[#EFF6F1]"
            @click="setStatus('active')"
          >
            Mark Active
          </button>
          <button
            type="button"
            class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[#0D5F8F] bg-white px-[18px] text-[14.5px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#F2F7FA]"
            @click="openEdit"
          >
            <AppIcon name="i-edit" class="h-4 w-4" /> Edit
          </button>
        </div>
      </div>

      <dl class="mt-[22px] grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl bg-[#EEF4F8] px-7 py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Client</dt><dd class="text-[15px] font-semibold text-ink">{{ consultant.client || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Project</dt><dd class="text-[15px] font-semibold text-ink">{{ consultant.project || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Department</dt><dd class="text-[15px] font-semibold text-ink">{{ consultant.department || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Country</dt><dd class="text-[15px] font-semibold text-ink">{{ consultant.country || '—' }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Engagement Start</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(consultant.engagement_start) }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Engagement End</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(consultant.engagement_end) }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Bench Since</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(consultant.bench_since) }}</dd></div>
        <div class="flex flex-col gap-1"><dt class="text-xs font-medium text-[#64758b]">Offboarded At</dt><dd class="text-[15px] font-semibold text-ink">{{ formatDate(consultant.offboarded_at) }}</dd></div>
      </dl>
    </section>

    <!-- Metrics -->
    <section class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div class="rounded-xl border border-[#e2e8f0] bg-white px-5 pb-5 pt-4 shadow-sm">
        <span class="text-sm font-medium text-[#3F5265]">Documents</span>
        <p class="mt-3.5 text-[21px] font-semibold leading-none text-[#5C7285]">{{ documents.length }} on file</p>
        <p class="mt-1.5 text-xs text-[#93A3B1]">{{ attentionCount }} needing attention (expiring/expired)</p>
      </div>
      <div class="rounded-xl border border-[#e2e8f0] bg-white px-5 pb-5 pt-4 shadow-sm">
        <span class="text-sm font-medium text-[#3F5265]">Offboarding Records</span>
        <p class="mt-3.5 text-[21px] font-semibold leading-none text-[#5C7285]">{{ offboardings.length }} total</p>
        <p class="mt-1.5 text-xs text-[#93A3B1]">{{ activeOffboardings }} active</p>
      </div>
      <div class="rounded-xl border border-[#e2e8f0] bg-white px-5 pb-5 pt-4 shadow-sm">
        <span class="text-sm font-medium text-[#3F5265]">Engagement</span>
        <p class="mt-3.5 text-[21px] font-semibold leading-none text-[#5C7285]">{{ engagementHint }}</p>
        <p class="mt-1.5 text-xs text-[#93A3B1]">Until engagement end date</p>
      </div>
    </section>

    <!-- Tabs -->
    <section class="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
      <div class="flex gap-1 border-b border-[#e2e8f0] px-4 pt-3">
        <button
          v-for="t in tabs"
          :key="t.key"
          type="button"
          class="rounded-t-[10px] px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
          :class="tab === t.key ? 'border border-b-0 border-[#e2e8f0] bg-[#f4f8fb] text-ink' : 'text-ink-3 hover:text-ink'"
          @click="tab = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Documents tab -->
      <div v-if="tab === 'docs'" class="p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-ink">Document Vault</h3>
          <div class="flex items-center gap-3">
            <button type="button" class="rounded-lg border border-[#d5dee7] bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-[#f2f6fa]" @click="triggerUpload">
              Upload document(s)
            </button>
            <input ref="uploadInput" type="file" multiple class="hidden" @change="onFilesPicked" />
          </div>
        </div>

        <ul v-if="documents.length" class="flex flex-col gap-3">
          <li v-for="d in documents" :key="d.id" class="flex flex-wrap items-center gap-3 rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] p-3.5">
            <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-[#8a99a8]" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13.5px] font-semibold text-[#243447]">{{ d.file_name }}</span>
              <span class="mt-0.5 block text-xs text-[#8a99a8]">
                {{ fileKind(d.file_name, d.file_type) }} · {{ formatFileSize(d.file_size) }}<template v-if="d.expires_at"> · expires {{ formatDate(d.expires_at) }}</template>
              </span>
            </span>
            <span class="rounded-pill bg-[#e5eaf1] px-2.5 py-1 text-xs font-medium text-[#5c7285]">{{ docTypeLabel(d.doc_type) }}</span>
            <span :class="[badgeBase, expiryBadge(expiryState(d.expires_at)).cls]">{{ expiryBadge(expiryState(d.expires_at)).label }}</span>
            <button type="button" class="h-8 rounded-lg border border-[#d5dee7] bg-white px-3 text-[13px] font-medium text-[#5c7285] hover:bg-[#f4f8fb]" @click="openMeta(d)">Details</button>
            <button type="button" class="h-8 rounded-lg bg-[#dce9f2] px-3.5 text-[13px] font-semibold text-[#23415a] hover:bg-[#cddfeb]" @click="openFile(d.storage_path)">Open</button>
            <button type="button" aria-label="Remove document" class="grid h-7 w-7 place-items-center rounded-full bg-[#cdd7de] text-[#3f4a55] hover:bg-[#b9c6cf]" @click="removeDoc(d)">
              <AppIcon name="i-x" class="h-3 w-3" />
            </button>
          </li>
        </ul>
        <p v-else class="rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-[#8a99a8]">
          No documents on file. Upload contracts, IDs, visas or NDAs to track compliance.
        </p>
      </div>

      <!-- Offboardings tab -->
      <div v-else class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-ink">Offboarding Records</h3>
        <ul v-if="offboardings.length" class="flex flex-col gap-3">
          <li v-for="o in offboardings" :key="o.id" class="flex flex-wrap items-center gap-3 rounded-[10px] border border-[#e2e8f0] bg-[#fbfdfe] p-3.5">
            <span class="text-[13.5px] font-semibold text-[#243447]">{{ o.ob_ref }}</span>
            <span :class="[badgeBase, offPill(o.status)]">{{ offLabel(o.status) }}</span>
            <span class="text-xs text-[#8a99a8]">Last working day {{ formatDate(o.last_working_day) }}</span>
            <router-link
              :to="{ name: 'offboarding-profile', params: { id: o.id } }"
              class="ml-auto inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-[#0D5F8F] bg-white px-3 text-[13px] font-medium text-[#0D5F8F] hover:bg-[#0D5F8F] hover:text-white"
            >
              Open profile
            </router-link>
          </li>
        </ul>
        <p v-else class="rounded-[10px] border-[1.5px] border-dashed border-[#d5dee7] px-4 py-[18px] text-[13px] text-[#8a99a8]">
          No offboarding records for this consultant yet.
        </p>
      </div>
    </section>

    <!-- Document meta modal -->
    <Teleport to="body">
      <div v-if="metaOpen" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="metaOpen = false">
        <div class="w-full max-w-[520px] rounded-[24px] border border-line bg-white p-[26px] shadow-lg">
          <h3 class="mb-5 text-[18px] font-medium text-ink">Document details</h3>
          <label class="mb-4 block">
            <span class="mb-2 block text-xs font-medium text-ink-3">Document type</span>
            <select v-model="metaForm.doc_type" class="h-11 w-full rounded-[10px] border border-line bg-white px-[14px] text-sm text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]">
              <option v-for="o in DOC_TYPE_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
          </label>
          <div class="mb-4 grid grid-cols-2 gap-4">
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Issued</span>
              <input v-model="metaForm.issued_at" type="date" class="h-11 w-full rounded-[10px] border border-line bg-white px-[14px] text-sm text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]" />
            </label>
            <label class="block">
              <span class="mb-2 block text-xs font-medium text-ink-3">Expires</span>
              <input v-model="metaForm.expires_at" type="date" class="h-11 w-full rounded-[10px] border border-line bg-white px-[14px] text-sm text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]" />
            </label>
          </div>
          <label class="mb-6 block">
            <span class="mb-2 block text-xs font-medium text-ink-3">Notes</span>
            <textarea v-model="metaForm.notes" rows="3" class="w-full rounded-[10px] border border-line bg-white px-[14px] py-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]"></textarea>
          </label>
          <div class="flex justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]" @click="metaOpen = false">Cancel</button>
            <button type="button" class="rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-brand-dk" @click="saveMeta">Save</button>
          </div>
        </div>
      </div>
    </Teleport>

    <ConsultantModal :open="editOpen" :consultant="consultant" @close="editOpen = false" @saved="onEdited" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatFileSize, fileKind } from '@/lib/utils'
import { DOC_TYPE_OPTIONS, docTypeLabel, expiryState, expiryBadge, consultantStatusPill, daysUntil } from '@/lib/documents'
import { logActivity } from '@/lib/activity'
import ConsultantModal from '@/components/consultants/ConsultantModal.vue'

const route = useRoute()
const auth = useAuthStore()

const badgeBase = 'inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-xs font-medium leading-tight'
const tabs = [
  { key: 'docs', label: 'Documents' },
  { key: 'offboardings', label: 'Offboarding Records' },
] as const

const loading = ref(true)
const tab = ref<'docs' | 'offboardings'>('docs')
const consultant = ref<any>(null)
const documents = ref<any[]>([])
const offboardings = ref<any[]>([])
const editOpen = ref(false)
const uploadInput = ref<HTMLInputElement | null>(null)

const metaOpen = ref(false)
const metaTarget = ref<any>(null)
const metaForm = ref({ doc_type: 'other', issued_at: '', expires_at: '', notes: '' })

const pill = computed(() => consultantStatusPill(consultant.value?.status))
const initials = computed(() =>
  (consultant.value?.full_name || '').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
)
const attentionCount = computed(() =>
  documents.value.filter((d) => ['expiring', 'expired'].includes(expiryState(d.expires_at))).length
)
const activeOffboardings = computed(() =>
  offboardings.value.filter((o) => ['draft', 'sent', 'in_progress'].includes(o.status)).length
)
const engagementHint = computed(() => {
  const days = daysUntil(consultant.value?.engagement_end)
  if (days === null) return 'No end date'
  if (days < 0) return 'Ended'
  return `${days} days left`
})

onMounted(fetchAll)

async function fetchAll() {
  loading.value = true
  const id = route.params.id as string

  const { data: c } = await supabase.from('consultants').select('*').eq('id', id).single()
  consultant.value = c

  if (c) {
    const { data: docs } = await supabase
      .from('consultant_documents')
      .select('*')
      .eq('consultant_id', id)
      .order('created_at', { ascending: false })
    documents.value = docs || []

    const { data: obs } = await supabase
      .from('offboardings')
      .select('id, ob_ref, status, last_working_day')
      .eq('consultant_id', id)
      .order('created_at', { ascending: false })
    offboardings.value = obs || []
  }
  loading.value = false
}

function offPill(status: string) {
  const map: Record<string, string> = {
    draft: 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink',
    sent: 'bg-[#B0761A] text-white',
    in_progress: 'bg-[#0E5A8C] text-white',
    completed: 'bg-[#177245] text-white',
    archived: 'bg-[#e5eaf1] text-[#7b8794]',
  }
  return map[status] ?? 'bg-[#e5eaf1] text-[#7b8794]'
}
function offLabel(status: string) {
  const map: Record<string, string> = { draft: 'Draft', sent: 'Pending', in_progress: 'In Progress', completed: 'Completed', archived: 'Archived' }
  return map[status] ?? status
}

// --- Status machine (manual transitions only; offboarding/offboarded are lifecycle-driven) ---
async function setStatus(status: string) {
  const patch: any = { status }
  if (status === 'on_bench') patch.bench_since = new Date().toISOString().slice(0, 10)
  if (status === 'active') patch.bench_since = null
  const { error } = await supabase.from('consultants').update(patch).eq('id', consultant.value.id)
  if (error) {
    console.error('Status update error:', error)
    return
  }
  logActivity('consultant.status_changed', 'consultant', consultant.value.id, { from: consultant.value.status, to: status, via: 'manual' })
  await fetchAll()
}

function openEdit() { editOpen.value = true }
async function onEdited() { editOpen.value = false; await fetchAll() }

// --- Documents ---
function triggerUpload() { uploadInput.value?.click() }

async function onFilesPicked(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const count = input.files.length
  try {
    for (const f of Array.from(input.files)) {
      const path = `consultants/${consultant.value.id}/${Date.now()}_${f.name}`
      const { error: upErr } = await supabase.storage.from('config-files').upload(path, f)
      if (upErr) throw upErr
      const { error: dbErr } = await supabase.from('consultant_documents').insert({
        consultant_id: consultant.value.id,
        doc_type: 'other',
        file_name: f.name,
        file_type: f.type,
        file_size: f.size,
        storage_path: path,
        uploaded_by: auth.user?.id ?? null,
      })
      if (dbErr) throw dbErr
    }
    logActivity('document.uploaded', 'consultant', consultant.value.id, { count })
    await fetchAll()
  } catch (err) {
    console.error('Document upload error:', err)
    alert('Failed to upload one or more documents.')
  } finally {
    input.value = ''
  }
}

function openMeta(d: any) {
  metaTarget.value = d
  metaForm.value = {
    doc_type: d.doc_type,
    issued_at: d.issued_at ?? '',
    expires_at: d.expires_at ?? '',
    notes: d.notes ?? '',
  }
  metaOpen.value = true
}

async function saveMeta() {
  const { error } = await supabase
    .from('consultant_documents')
    .update({
      doc_type: metaForm.value.doc_type,
      issued_at: metaForm.value.issued_at || null,
      expires_at: metaForm.value.expires_at || null,
      notes: metaForm.value.notes || null,
    })
    .eq('id', metaTarget.value.id)
  if (error) {
    console.error('Document update error:', error)
    return
  }
  logActivity('document.updated', 'document', metaTarget.value.id, { file_name: metaTarget.value.file_name })
  metaOpen.value = false
  await fetchAll()
}

async function removeDoc(d: any) {
  if (!confirm(`Remove "${d.file_name}" from the vault?`)) return
  const { error } = await supabase.from('consultant_documents').delete().eq('id', d.id)
  if (error) {
    console.error('Document delete error:', error)
    return
  }
  await supabase.storage.from('config-files').remove([d.storage_path])
  logActivity('document.removed', 'document', d.id, { file_name: d.file_name })
  await fetchAll()
}

async function openFile(storagePath: string) {
  const { data, error } = await supabase.storage.from('config-files').createSignedUrl(storagePath, 60)
  if (error || !data?.signedUrl) return
  window.open(data.signedUrl, '_blank')
}
</script>