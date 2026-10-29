<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]"
      @click.self="emit('close')"
    >
      <!-- Modal shell -->
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="req-modal-title"
        class="relative flex max-h-[calc(100dvh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-lg"
      >
        <!-- Close button -->
        <button
          type="button"
          aria-label="Close dialog"
          class="absolute right-[14px] top-[14px] z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-[#f2f6fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          @click="emit('close')"
        >
          <AppIcon name="i-x" class="h-3.5 w-3.5" />
        </button>

        <!-- Scrollable body -->
        <div class="min-h-0 flex-1 overflow-y-auto px-[26px] py-6 pb-[26px]">
          <!-- Header -->
          <div class="mb-[22px] flex flex-wrap items-center gap-3 pr-9">
            <h2 id="req-modal-title" class="text-[18px] font-medium leading-[1.3] text-ink">
              {{ isEdit ? 'Edit requirement' : 'Create requirement' }}
            </h2>
            <span
              v-if="!isEdit"
              class="rounded-pill bg-status-draft px-3 py-1 text-xs font-normal leading-[1.2] text-ink"
            >
              Draft
            </span>
          </div>

          <!-- Requirement Name -->
          <label class="mb-5 block">
            <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Requirement Name</span>
            <input
              ref="nameInput"
              v-model="form.name"
              type="text"
              :class="fieldCls"
              placeholder="e.g., Timesheets & Billing Closure"
            />
            <span v-if="nameError" class="mt-1.5 block text-[12.5px] font-medium leading-[1.3] text-status-danger">
              {{ nameError }}
            </span>
          </label>

          <!-- Description -->
          <label class="mb-2 block">
            <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Description</span>
            <textarea
              v-model="form.description"
              :class="fieldCls"
              rows="4"
              class="min-h-[96px] resize-y leading-[1.5]"
            ></textarea>
          </label>

          <!-- Sub-requirement blocks -->
          <section v-for="(sub, i) in subReqs" :key="sub.key" class="mt-7">
            <h3 class="mb-4 text-[18px] font-semibold leading-[1.3] text-ink">
              Sub-requirement details, number {{ i + 1 }}
            </h3>

            <label class="mb-5 block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Sub-requirement Name</span>
              <input v-model="sub.name" type="text" :class="fieldCls" placeholder="e.g., Final Timesheet Approval" />
            </label>

            <label class="mb-5 block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Instructions</span>
              <textarea
                v-model="sub.instructions"
                :class="fieldCls"
                rows="3"
                class="min-h-[96px] resize-y leading-[1.5]"
              ></textarea>
            </label>

            <label class="mb-5 block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Resource URL</span>
              <input
                v-model="sub.resourceUrl"
                type="url"
                :class="fieldCls + ' text-brand'"
                placeholder="https://hr.geco.asia/..."
              />
            </label>

            <!-- Files -->
            <div class="mb-5">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Files to Send Consultant</span>

              <!-- Uploaded file chips -->
              <ul v-if="sub.files.length" class="mb-3 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
                <li
                  v-for="(file, fIdx) in sub.files"
                  :key="file.id || `${sub.key}-${fIdx}`"
                  class="relative flex items-center gap-2.5 rounded-[10px] border border-line bg-[#f7fafc] px-3.5 py-3"
                >
                  <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-ink-3" />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[13px] font-medium leading-[1.3] text-ink">
                      {{ file.file_name }}
                    </span>
                    <span class="mt-0.5 block text-xs leading-[1.3] text-ink-3">
                      {{ (file.file_type || 'file').split('/').pop()?.toUpperCase() }} · {{ formatFileSize(file.file_size) }}
                    </span>
                  </span>
                  <button
                    type="button"
                    class="flex-shrink-0 rounded-lg bg-[#dbe8f1] px-3.5 py-[7px] text-[13px] font-semibold leading-none text-brand transition-colors hover:bg-[#cfe0ed]"
                    @click="openFile(file.storage_path)"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    aria-label="Remove file"
                    class="absolute -right-[9px] -top-[9px] grid h-5 w-5 place-items-center rounded-full bg-[#cfe0ed] text-ink transition-colors hover:bg-[#bcd4e6]"
                    @click="dismissFile(sub, fIdx)"
                  >
                    <AppIcon name="i-x" class="h-2.5 w-2.5" />
                  </button>
                </li>
              </ul>

              <!-- Dropzone (Upload button inside, per design) -->
              <div
                class="grid cursor-pointer justify-items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-[#c6d3e0] bg-[#f8fafc] px-4 py-[26px] text-center transition-colors hover:border-brand hover:bg-[#f2f6fa]"
                @click="triggerUpload(sub)"
                @dragover.prevent
                @drop.prevent="(e) => onDrop(e, sub)"
              >
                <button
                  type="button"
                  :disabled="sub.uploading"
                  class="rounded-lg border border-line bg-white px-4 py-[9px] text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-[#f2f6fa] disabled:opacity-50"
                  @click.stop="triggerUpload(sub)"
                >
                  {{ sub.uploading ? 'Uploading…' : 'Upload File(s)' }}
                </button>
                <p class="text-[13px] leading-[1.4] text-ink-3">or Drag files here to upload</p>
                <input
                  :ref="(el) => setUploadRef(sub.key, el)"
                  type="file"
                  multiple
                  class="hidden"
                  @change="(e) => onFilesPicked(e, sub)"
                />
              </div>
            </div>
          </section>

          <!-- Centered actions -->
          <div class="my-[22px] flex flex-wrap justify-center gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-[10px] border border-brand bg-white px-[18px] py-[11px] text-sm font-semibold text-brand transition-colors hover:bg-[#eef5fa]"
              @click="addSub"
            >
              <AppIcon name="i-plus" class="h-4 w-4" />
              Add another sub-requirement
            </button>
            <button
              type="button"
              :disabled="subReqs.length <= 1"
              class="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-none px-[18px] py-[11px] text-sm font-semibold text-status-danger transition-colors hover:bg-status-danger-soft disabled:cursor-not-allowed disabled:opacity-50"
              @click="removeSub"
            >
              <AppIcon name="i-trash" class="h-4 w-4" />
              Remove sub-requirement
            </button>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink transition-colors hover:bg-[#f2f6fa]"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="saving"
              class="inline-flex items-center gap-2 rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-brand-dk disabled:opacity-50"
              @click="save"
            >
              <AppIcon name="i-save" class="h-4 w-4" />
              {{ saving ? 'Saving…' : 'Save requirement' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatFileSize } from '@/lib/utils'

const props = defineProps<{ open: boolean; editId?: string | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const auth = useAuthStore()

const isEdit = computed(() => !!props.editId)

const fieldCls =
  'w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-sm leading-[1.45] text-ink transition-[border-color,box-shadow,background] duration-150 placeholder:text-ink-3/75 hover:border-[#b9c8d8] focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]'

const saving = ref(false)
const nameError = ref('')
const nameInput = ref<HTMLInputElement | null>(null)
const form = ref({ name: '', description: '' })
const subReqs = ref<any[]>([])
const removedSubIds = ref<string[]>([])
const removedFiles = ref<any[]>([])
const uploadRefs = new Map<number, HTMLInputElement>()

let keySeq = 0
function newSub() {
  return {
    key: ++keySeq,
    id: undefined as string | undefined,
    name: '',
    instructions: '',
    resourceUrl: '',
    is_disabled: false,
    files: [] as any[],
    uploading: false,
  }
}
function setUploadRef(key: number, el: any) {
  if (el) uploadRefs.set(key, el as HTMLInputElement)
}
function triggerUpload(sub: any) {
  uploadRefs.get(sub.key)?.click()
}

// Reset / load whenever the modal opens
watch(() => props.open, async (isOpen) => {
  if (!isOpen) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onEsc)
    return
  }

  form.value = { name: '', description: '' }
  subReqs.value = [newSub()]
  removedSubIds.value = []
  removedFiles.value = []
  nameError.value = ''

  if (props.editId) await loadConfig(props.editId)

  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onEsc)
  nextTick(() => nameInput.value?.focus())
})

async function loadConfig(id: string) {
  const { data, error } = await supabase
    .from('config_requirements')
    .select(`
      id, name, description,
      config_sub_requirements (
        id, title, instructions, resource_url, is_disabled, sort_order,
        config_files (id, file_name, file_type, file_size, storage_path)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error loading config for edit:', error)
    return
  }

  form.value.name = data.name || ''
  form.value.description = data.description || ''

  const subs = (data.config_sub_requirements || []).slice().sort((a: any, b: any) => a.sort_order - b.sort_order)
  subReqs.value = subs.length
    ? subs.map((s: any) => ({
        key: ++keySeq,
        id: s.id,
        name: s.title,
        instructions: s.instructions || '',
        resourceUrl: s.resource_url || '',
        is_disabled: s.is_disabled,
        files: (s.config_files || []).map((f: any) => ({ ...f })),
        uploading: false,
      }))
    : [newSub()]
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

function addSub() {
  subReqs.value.push(newSub())
}
function removeSub() {
  if (subReqs.value.length <= 1) return
  const popped = subReqs.value.pop()
  if (popped?.id) {
    removedSubIds.value.push(popped.id)
    removedFiles.value.push(...(popped.files || []).filter((f: any) => f.id))
  }
}

// --- File handling ---
function dismissFile(sub: any, idx: number) {
  const [file] = sub.files.splice(idx, 1)
  if (file) removedFiles.value.push(file)
}
async function onFilesPicked(e: Event, sub: any) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) await uploadFiles(sub, Array.from(input.files))
  input.value = ''
}
async function onDrop(e: DragEvent, sub: any) {
  if (e.dataTransfer?.files?.length) await uploadFiles(sub, Array.from(e.dataTransfer.files))
}
async function uploadFiles(sub: any, files: File[]) {
  sub.uploading = true
  try {
    for (const f of files) {
      const scope = sub.id || 'new'
      const path = `config-files/${scope}/${Date.now()}_${f.name}`
      const { error } = await supabase.storage.from('config-files').upload(path, f)
      if (error) throw error
      sub.files.push({ file_name: f.name, file_type: f.type, file_size: f.size, storage_path: path })
    }
  } catch (err) {
    console.error('Upload error:', err)
    alert('Failed to upload one or more files.')
  } finally {
    sub.uploading = false
  }
}
async function openFile(storagePath: string) {
  const { data, error } = await supabase.storage.from('config-files').createSignedUrl(storagePath, 60)
  if (error || !data?.signedUrl) {
    console.error('Signed URL error:', error)
    return
  }
  window.open(data.signedUrl, '_blank')
}

// --- Save (create or update) ---
async function save() {
  if (!form.value.name.trim()) {
    nameError.value = 'Requirement Name is required.'
    return
  }
  saving.value = true
  try {
    let requirementId = props.editId as string

    if (isEdit.value) {
      const { error } = await supabase
        .from('config_requirements')
        .update({ name: form.value.name.trim(), description: form.value.description || null })
        .eq('id', requirementId)
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('config_requirements')
        .insert({
          name: form.value.name.trim(),
          description: form.value.description || null,
          is_active: true,
          created_by: auth.user?.id,
        })
        .select()
        .single()
      if (error) throw error
      requirementId = data.id
    }

    // Upsert sub-requirements + their new files
    for (let i = 0; i < subReqs.value.length; i++) {
      const s = subReqs.value[i]
      const payload = {
        title: s.name.trim() || 'Untitled sub-requirement',
        instructions: s.instructions || null,
        resource_url: s.resourceUrl || null,
        is_disabled: !!s.is_disabled,
        sort_order: i,
      }

      let subId = s.id as string | undefined
      if (subId) {
        const { error } = await supabase.from('config_sub_requirements').update(payload).eq('id', subId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('config_sub_requirements')
          .insert({ ...payload, requirement_id: requirementId })
          .select()
          .single()
        if (error) throw error
        subId = data.id
      }

      const newFiles = s.files.filter((f: any) => !f.id)
      if (newFiles.length) {
        const { error } = await supabase.from('config_files').insert(
          newFiles.map((f: any) => ({
            sub_requirement_id: subId,
            storage_path: f.storage_path,
            file_name: f.file_name,
            file_type: f.file_type,
            file_size: f.file_size,
            uploaded_by: auth.user?.id,
          }))
        )
        if (error) throw error
      }
    }

    // Delete removed sub-requirements (DB files cascade)
    for (const id of removedSubIds.value) {
      await supabase.from('config_sub_requirements').delete().eq('id', id)
    }

    // Delete removed files (DB row + storage object)
    for (const f of removedFiles.value) {
      if (f.id) await supabase.from('config_files').delete().eq('id', f.id)
      if (f.storage_path) await supabase.storage.from('config-files').remove([f.storage_path])
    }

    emit('saved')
  } catch (err: any) {
    console.error('Save error:', err)
    alert(`Failed to save: ${err.message || 'Unknown error'}`)
  } finally {
    saving.value = false
  }
}
</script>