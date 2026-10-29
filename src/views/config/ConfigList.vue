<template>
  <div class="space-y-5">
    <!-- Row 1: Right-aligned primary action -->
    <div class="flex justify-end">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:border-[#198754] hover:bg-[#198754] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        @click="openCreate"
      >
        Add Requirement checklist
        <AppIcon name="i-plus" class="h-4 w-4" />
      </button>
    </div>

    <!-- Row 2: Full-width search + Filters -->
    <div class="flex items-stretch gap-3.5">
      <div class="relative flex-1">
        <AppIcon
          name="i-search"
          class="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Search requirement name, description, or files..."
          class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-[#f8fafc] pl-[42px] pr-4 text-sm text-ink transition-[border-color,box-shadow,background] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
        />
      </div>

      <button
        type="button"
        class="inline-flex h-[46px] flex-shrink-0 items-center gap-[9px] rounded-[10px] border border-[#d5dee8] bg-white px-[18px] text-sm font-semibold text-[#1f2937] shadow-sm transition-colors hover:bg-[#f2f6fa]"
      >
        <AppIcon name="i-sliders" class="h-4 w-4 text-[#334155]" />
        Filters
      </button>
    </div>

    <!-- Data Table -->
    <div class="overflow-hidden rounded-card border border-line bg-white shadow-sm">
      <table class="w-full table-fixed text-left text-sm">
        <thead class="border-b border-line bg-[#f7fafc] text-ink">
          <tr>
            <th class="h-16 w-[20%] px-6 text-left align-middle font-semibold">Name</th>
            <th class="h-16 w-[28%] px-6 text-left align-middle font-semibold">Description</th>
            <th class="h-16 w-[9%] px-6 text-left align-middle font-semibold">Files to Send</th>
            <th class="h-16 w-[25%] px-6 text-left align-middle font-semibold">Requirements</th>
            <th class="h-16 w-[18%] px-6 text-left align-middle font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-if="filteredConfigs.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-ink-3">No configurations found.</td>
          </tr>

          <template v-for="config in filteredConfigs" :key="config.id">
            <!-- ===== COLLAPSED SUMMARY ROW ===== -->
            <tr
              v-show="!isExpanded(config.id)"
              class="transition-colors"
              :class="isPending(config.id) ? 'bg-[#d7e0ea]' : 'hover:bg-[#d7e0ea]/40'"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    class="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg text-ink-3 transition-colors hover:bg-[rgba(18,32,51,.08)] hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                    :aria-expanded="false"
                    :aria-controls="`checklist-${config.id}`"
                    aria-label="Show full details"
                    @click="toggleExpand(config.id)"
                  >
                    <AppIcon name="i-chevron" class="h-4 w-4" />
                  </button>
                  <span class="font-semibold" :class="isPending(config.id) ? 'text-ink-3' : 'text-ink'">
                    {{ config.name }}
                  </span>
                </div>
              </td>
              <td class="truncate px-6 py-4 text-ink-3">
                {{ config.description }}
              </td>
              <td class="px-6 py-4 font-semibold" :class="isPending(config.id) ? 'text-ink-3' : 'text-ink'">
                {{ config.file_count }}
              </td>
              <td class="px-6 py-4">
                <ul v-if="config.sub_requirements?.length" class="flex flex-col gap-1">
                  <li
                    v-for="sub in config.sub_requirements"
                    :key="sub.id"
                    class="text-sm leading-[1.45] before:mr-1.5 before:content-['•']"
                    :class="isPending(config.id) ? 'text-ink-3' : 'text-ink'"
                  >
                    {{ sub.title }}
                  </li>
                </ul>
                <span v-else class="text-sm text-ink-3">—</span>
              </td>

              <!-- Actions cell: buttons OR inline delete confirmation -->
              <td class="px-6 py-4">
                <div v-if="isPending(config.id)" class="flex flex-wrap items-center gap-2.5">
                  <span class="text-[13px] font-semibold text-[#C0392B]">Are you sure?</span>
                  <button
                    type="button"
                    class="h-9 rounded-lg border border-[#dc9797] bg-white px-4 text-[13px] font-semibold text-[#c14b4b] transition-colors hover:border-[#C24152] hover:bg-[#C24152] hover:text-white"
                    @click="confirmDelete(config.id)"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    class="h-9 rounded-lg border border-line bg-white px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-[#f2f6fa]"
                    @click="pendingDeleteId = null"
                  >
                    No
                  </button>
                </div>
                <div v-else class="flex gap-2.5">
                  <button
                    type="button"
                    class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#a6c8dc] bg-white px-5 text-[13px] font-semibold text-[#0D5F8F] transition-colors hover:border-[#0D5F8F] hover:bg-[#0D5F8F] hover:text-white"
                    @click="openEdit(config.id)"
                  >
                    Edit <AppIcon name="i-edit" class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#e4b4b4] bg-white px-5 text-[13px] font-semibold text-[#c14b4b] transition-colors hover:border-[#C24152] hover:bg-[#C24152] hover:text-white"
                    @click="pendingDeleteId = config.id"
                  >
                    Delete <AppIcon name="i-trash" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- ===== EXPANDED CHECKLIST PANEL ===== -->
            <tr v-if="isExpanded(config.id)" :id="`checklist-${config.id}`" class="bg-white">
              <td colspan="5" class="p-0">
                <div class="flex flex-col px-8 py-6">
                  <!-- Checklist header -->
                  <div class="mb-2 flex flex-wrap items-start justify-between gap-5">
                    <div class="min-w-0">
                      <h3 class="text-xl font-bold tracking-[-0.01em] text-ink">{{ config.name }}</h3>
                      <p class="mt-1.5 text-[13px] leading-[1.5] text-ink-3">{{ config.description }}</p>
                    </div>
                    <div class="ml-auto flex flex-wrap items-center gap-2.5">
                      <!-- Inline confirm replaces panel actions while pending -->
                      <template v-if="isPending(config.id)">
                        <span class="text-[13px] font-semibold text-[#C0392B]">Are you sure?</span>
                        <button
                          type="button"
                          class="h-9 rounded-lg border border-[#dc9797] bg-white px-4 text-[13px] font-semibold text-[#c14b4b] transition-colors hover:border-[#C24152] hover:bg-[#C24152] hover:text-white"
                          @click="confirmDelete(config.id)"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          class="h-9 rounded-lg border border-line bg-white px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-[#f2f6fa]"
                          @click="pendingDeleteId = null"
                        >
                          No
                        </button>
                      </template>
                      <template v-else>
                        <button
                          type="button"
                          class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#0D5F8F] hover:text-white"
                          @click="openEdit(config.id)"
                        >
                          Edit <AppIcon name="i-edit" class="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center gap-2 rounded-lg border border-[#e4b4b4] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#C24152] hover:text-white"
                          @click="pendingDeleteId = config.id"
                        >
                          Delete <AppIcon name="i-trash" class="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-[#0D5F8F] px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-[#198754] hover:bg-[#198754]"
                          @click="openEdit(config.id)"
                        >
                          Add Sub-requirement <AppIcon name="i-plus" class="h-3.5 w-3.5" />
                        </button>
                      </template>
                    </div>
                  </div>

                  <!-- Meta band -->
                  <div class="my-4 flex items-center gap-2 rounded-xl bg-[#F1F5F9] px-3 py-2.5 text-[13px] font-medium text-[#5A6B7E]">
                    <AppIcon name="i-sliders" class="h-4 w-4 text-ink-3" />
                    {{ config.all_subs.length }} sub-requirement{{ config.all_subs.length === 1 ? '' : 's' }}
                  </div>

                  <!-- Sub-requirement cards -->
                  <div class="mb-4 grid gap-4">
                    <div
                      v-for="sub in config.all_subs"
                      :key="sub.id"
                      class="rounded-2xl border border-[#e6edf3] bg-[#f7fafc] p-6"
                    >
                      <!-- Card header -->
                      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div class="flex flex-wrap items-center gap-3">
                          <h4 class="text-base font-medium" :class="sub.is_disabled ? 'text-ink-3' : 'text-ink'">
                            {{ sub.title }}
                          </h4>
                          <span
                            v-if="sub.is_disabled"
                            class="rounded-full border border-line bg-[#EDF1F5] px-3 py-1 text-xs font-medium text-ink-3"
                          >
                            Disabled
                          </span>
                        </div>
                        <div class="ml-auto flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            :class="sub.is_disabled
                              ? 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#e9eef5]'
                              : 'inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#0D5F8F] hover:text-white'"
                            @click="openEdit(config.id)"
                          >
                            Edit sub-requirement <AppIcon name="i-edit" class="h-3.5 w-3.5" />
                          </button>
                          <button
                            v-if="!sub.is_disabled"
                            type="button"
                            class="inline-flex items-center gap-2 rounded-lg border border-[#dcb56f] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#b7791f] transition-colors hover:bg-[#b7791f] hover:text-white"
                            @click="toggleSubDisabled(sub)"
                          >
                            Disable
                          </button>
                          <button
                            v-else
                            type="button"
                            class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-[#0D5F8F] px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-dk"
                            @click="toggleSubDisabled(sub)"
                          >
                            Enable
                          </button>
                          <button
                            type="button"
                            class="inline-flex items-center gap-2 rounded-lg border border-[#dc9797] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#C24152] hover:text-white"
                            @click="handleDeleteSub(sub)"
                          >
                            Delete <AppIcon name="i-trash" class="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <!-- Field blocks -->
                      <div class="space-y-4">
                        <div>
                          <span class="mb-1.5 block text-xs font-medium tracking-[.02em] text-ink-3">Instructions</span>
                          <div
                            class="rounded-[10px] border border-line bg-[#fbfdfe] px-4 py-3 text-[13.5px] leading-[1.55]"
                            :class="sub.is_disabled ? 'text-ink-3' : 'text-ink-2'"
                          >
                            {{ sub.instructions || 'No instructions provided' }}
                          </div>
                        </div>

                        <div>
                          <span class="mb-1.5 block text-xs font-medium tracking-[.02em] text-ink-3">Resource Link</span>
                          <div class="rounded-[10px] border border-line bg-[#fbfdfe] px-4 py-3 text-[13.5px] leading-[1.55]">
                            <a
                              v-if="sub.resource_url"
                              :href="sub.resource_url"
                              target="_blank"
                              class="break-all text-[#1f6f9f] hover:underline"
                            >{{ sub.resource_url }}</a>
                            <span v-else class="text-[#8a99a8]">No resource URL configured</span>
                          </div>
                        </div>

                        <div>
                          <span class="mb-1.5 block text-xs font-medium tracking-[.02em] text-ink-3">Attached Resources</span>
                          <div class="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              class="rounded-lg border border-line bg-white px-3.5 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-[#f2f6fa]"
                              @click="triggerSubUpload(sub.id)"
                            >
                              Upload Files
                            </button>
                            <input
                              :ref="(el) => setSubUploadRef(sub.id, el)"
                              type="file"
                              multiple
                              class="hidden"
                              @change="(e) => onSubFilesPicked(e, sub)"
                            />
                          </div>

                          <ul v-if="sub.config_files?.length" class="mt-4 flex flex-wrap gap-4">
                            <li
                              v-for="file in sub.config_files"
                              :key="file.id"
                              class="relative flex min-w-[250px] flex-[0_1_320px] items-center gap-3 rounded-[10px] border border-line bg-white p-3"
                            >
                              <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-ink-3" />
                              <span class="min-w-0 flex-1">
                                <span class="block truncate text-[13px] font-medium text-ink">{{ file.file_name }}</span>
                                <span class="mt-0.5 block text-xs text-ink-3">
                                  {{ (file.file_type || 'file').split('/').pop()?.toUpperCase() }} · {{ formatFileSize(file.file_size) }}
                                </span>
                              </span>
                              <button
                                type="button"
                                class="h-8 flex-shrink-0 rounded-lg bg-[#dce9f2] px-3.5 text-[12.5px] font-semibold text-[#23415a] transition-colors hover:bg-[#cddfeb]"
                                @click="openSigned(file.storage_path)"
                              >
                                Open
                              </button>
                              <button
                                type="button"
                                aria-label="Remove file"
                                class="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#c9d5e1] text-[#3c5064] transition-colors hover:bg-[#b8c7d6]"
                                @click="handleRemoveFile(file)"
                              >
                                <AppIcon name="i-x" class="h-2 w-2" />
                              </button>
                            </li>
                          </ul>
                          <div
                            v-else
                            class="mt-4 rounded-[10px] border-[1.5px] border-dashed border-line px-4 py-[18px] text-[13px] text-ink-3"
                          >
                            No files uploaded for this sub-requirement
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer toggle -->
                  <button
                    type="button"
                    class="flex items-center gap-3 rounded-xl bg-[#f4f7fb] px-4 py-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-[#e9eef5]"
                    @click="toggleExpand(config.id)"
                  >
                    <AppIcon name="i-chevron-up" class="h-4 w-4" />
                    Hide full details
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Requirement Modal -->
    <RequirementModal :open="showModal" :edit-id="editId" @close="showModal = false" @saved="handleSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatFileSize } from '@/lib/utils'
import RequirementModal from '@/components/config/RequirementModal.vue'

const auth = useAuthStore()

const search = ref('')
const configs = ref<any[]>([])
const showModal = ref(false)
const editId = ref<string | null>(null)
const expandedIds = ref<string[]>([])
const pendingDeleteId = ref<string | null>(null)
const subUploadRefs = new Map<string, HTMLInputElement>()

onMounted(fetchConfigs)

async function fetchConfigs() {
  const { data, error } = await supabase
    .from('config_requirements')
    .select(`
      id, name, description, is_active,
      config_sub_requirements (
        id, title, is_disabled, instructions, resource_url, sort_order,
        config_files (id, file_name, file_type, file_size, storage_path)
      )
    `)
    .order('sort_order', { ascending: true })
    .order('sort_order', { ascending: true, referencedTable: 'config_sub_requirements' })

  if (error) {
    console.error('Error fetching configs:', error)
    return
  }

  configs.value = (data || []).map((row: any) => {
    const allSubs = row.config_sub_requirements || []
    const activeSubs = allSubs.filter((s: any) => !s.is_disabled)
    let fileCount = 0
    activeSubs.forEach((s: any) => { fileCount += s.config_files?.length || 0 })
    return { ...row, all_subs: allSubs, sub_requirements: activeSubs, file_count: fileCount }
  })
}

const filteredConfigs = computed(() => {
  if (!search.value) return configs.value
  const term = search.value.toLowerCase()
  return configs.value.filter((c) => {
    const inSubs = c.all_subs?.some((s: any) => s.title?.toLowerCase().includes(term))
    return (
      c.name.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      inSubs
    )
  })
})

// --- Expand / Collapse ---
function isExpanded(id: string) {
  return expandedIds.value.includes(id)
}
function toggleExpand(id: string) {
  const idx = expandedIds.value.indexOf(id)
  if (idx >= 0) expandedIds.value.splice(idx, 1)
  else expandedIds.value.push(id)
}

// --- Modal (create / edit) ---
function openCreate() {
  editId.value = null
  showModal.value = true
}
function openEdit(id: string) {
  editId.value = id
  showModal.value = true
}
function handleSaved() {
  showModal.value = false
  editId.value = null
  fetchConfigs()
}

// --- Inline delete confirmation ---
function isPending(id: string) {
  return pendingDeleteId.value === id
}
async function confirmDelete(id: string) {
  const { error } = await supabase.from('config_requirements').delete().eq('id', id)
  pendingDeleteId.value = null
  if (error) {
    console.error('Error deleting:', error)
    alert('Failed to delete.')
  } else {
    fetchConfigs()
  }
}

// --- Sub-requirement actions ---
async function toggleSubDisabled(sub: any) {
  const { error } = await supabase
    .from('config_sub_requirements')
    .update({ is_disabled: !sub.is_disabled })
    .eq('id', sub.id)
  if (error) {
    console.error('Error toggling sub-requirement:', error)
    alert('Failed to update sub-requirement.')
  } else {
    fetchConfigs()
  }
}

async function handleDeleteSub(sub: any) {
  if (!confirm(`Delete sub-requirement "${sub.title}"? Its uploaded files will also be removed.`)) return
  const { error } = await supabase.from('config_sub_requirements').delete().eq('id', sub.id)
  if (error) {
    console.error('Error deleting sub-requirement:', error)
    alert('Failed to delete sub-requirement.')
  } else {
    fetchConfigs()
  }
}

// --- File actions (expanded panel) ---
function setSubUploadRef(id: string, el: any) {
  if (el) subUploadRefs.set(id, el as HTMLInputElement)
}
function triggerSubUpload(subId: string) {
  subUploadRefs.get(subId)?.click()
}
async function onSubFilesPicked(e: Event, sub: any) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const files = Array.from(input.files)
  try {
    for (const f of files) {
      const path = `config-files/${sub.id}/${Date.now()}_${f.name}`
      const { error: upErr } = await supabase.storage.from('config-files').upload(path, f)
      if (upErr) throw upErr
      // FIXED: include uploaded_by (required by config_files Insert type)
      const { error: dbErr } = await supabase.from('config_files').insert({
        sub_requirement_id: sub.id,
        storage_path: path,
        file_name: f.name,
        file_type: f.type,
        file_size: f.size,
        uploaded_by: auth.user?.id,
      })
      if (dbErr) throw dbErr
    }
    fetchConfigs()
  } catch (err) {
    console.error('Upload error:', err)
    alert('Failed to upload one or more files.')
  } finally {
    input.value = ''
  }
}
async function openSigned(storagePath: string) {
  const { data, error } = await supabase.storage.from('config-files').createSignedUrl(storagePath, 60)
  if (error || !data?.signedUrl) {
    console.error('Signed URL error:', error)
    return
  }
  window.open(data.signedUrl, '_blank')
}
async function handleRemoveFile(file: any) {
  if (!confirm(`Remove "${file.file_name}"?`)) return
  const { error } = await supabase.from('config_files').delete().eq('id', file.id)
  if (error) {
    console.error('Error removing file:', error)
    alert('Failed to remove file.')
    return
  }
  await supabase.storage.from('config-files').remove([file.storage_path])
  fetchConfigs()
}
</script>