<template>
  <div class="space-y-5">
    <div class="flex items-stretch gap-2">
      <div class="relative flex-shrink-0 pr-8">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:border-[#198754] hover:bg-[#198754] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          @click="openCreate"
        >
          Add Requirement checklist
          <AppIcon name="i-plus" class="h-4 w-4" />
        </button>
      </div>

      <div class="relative flex-1">
        <AppIcon name="i-search" class="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          v-model="search"
          type="text"
          placeholder="Search requirement name, description, or files..."
          class="h-[46px] w-full rounded-[10px] border border-[#d5dee8] bg-[#f8fafc] pl-[42px] pr-4 text-sm text-ink transition-[border-color,box-shadow,background] duration-150 placeholder:text-[#8a97a8] hover:border-[#b9c8d8] focus:border-[#122033] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(14,116,144,.25)]"
        />
      </div>
      
      <!-- ✅ PHASE 2: Interactive Filters Dropdown -->
      <div class="relative flex-shrink-0">
        <button
          type="button"
          class="inline-flex h-[46px] items-center gap-[9px] rounded-[10px] border border-[#d5dee8] bg-white px-[18px] text-sm font-semibold text-[#1f2937] shadow-sm transition-colors hover:bg-[#f2f6fa]"
          :aria-expanded="filterOpen"
          @click="filterOpen = !filterOpen"
        >
          <AppIcon name="i-sliders" class="h-4 w-4 text-[#334155]" />
          {{ statusFilterLabel }}
          <AppIcon name="i-chevron" class="h-3.5 w-3.5 text-[#334155] transition-transform duration-150" :class="filterOpen ? '-rotate-90' : 'rotate-90'" />
        </button>
        <div
          v-if="filterOpen"
          class="absolute right-0 top-[calc(100%+6px)] z-30 w-48 overflow-hidden rounded-[10px] border border-[#d5dee8] bg-white py-1 shadow-md"
        >
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            class="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#f2f6fa]"
            :class="statusFilter === opt.value ? 'text-[#0D5F8F] font-semibold' : 'text-ink-2'"
            @click="selectStatus(opt.value)"
          >
            {{ opt.label }}
            <AppIcon v-if="statusFilter === opt.value" name="i-check-circle" class="h-3.5 w-3.5" />
          </button>
        </div>
        <div v-if="filterOpen" class="fixed inset-0 z-20" @click="filterOpen = false"></div>
      </div>
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
          <!-- UNDO BAND ROW -->
          <tr v-if="undoState && undoState.kind === 'requirement'" class="bg-[#d7e0ea]">
            <td colspan="5" class="p-0">
              <div role="status" aria-live="polite" class="flex min-h-[56px] flex-wrap items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-ink">
                <span class="font-semibold">Item deleted</span>
                <button type="button" class="font-semibold text-brand hover:underline" @click="undoRestore">(undo)</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredConfigs.length === 0 && !(undoState && undoState.kind === 'requirement')">
            <td colspan="5" class="px-6 py-12 text-center text-ink-3">No configurations found.</td>
          </tr>
          <template v-for="config in filteredConfigs" :key="config.id">
            <!-- COLLAPSED SUMMARY ROW -->
            <tr v-show="!isExpanded(config.id)" class="transition-colors" :class="isPending(config.id) ? 'bg-[#d7e0ea]' : 'hover:bg-[#d7e0ea]/40'">
              
              <!-- ✅ UPDATED: Name Column with Compact Toggle Switch & Tooltip -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button type="button" class="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg text-ink-3 transition-colors hover:bg-[rgba(18,32,51,.08)] hover:text-ink focus-visible:outline-2 focus-visible:outline-brand" @click="toggleExpand(config.id)" aria-label="Show full details">
                    <AppIcon name="i-chevron" class="h-4 w-4" />
                  </button>
                  <span class="font-semibold" :class="isPending(config.id) ? 'text-ink-3' : 'text-ink'">{{ config.name }}</span>

                  <!-- Compact Toggle Switch with Tooltip -->
                  <div class="group relative ml-1">
                    <!-- Tooltip -->
                    <div class="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0f172a] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg transition-opacity group-hover:block z-20">
                      {{ config.is_active ? 'Click to make inactive' : 'Click to make active' }}
                      <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]"></div>
                    </div>
                    
                    <!-- Toggle Switch (8px height) -->
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="config.is_active"
                      :aria-label="`${config.name} status toggle`"
                      class="relative inline-block h-3 w-5 flex-shrink-0 rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#198754] focus-visible:ring-offset-2"
                      :class="config.is_active ? 'bg-[#198754]' : 'bg-[#e2e8f0]'"
                      @click="toggleActive(config)"
                    >
                      <span
                        class="absolute top-0 left-0 h-3 w-3 rounded-full bg-white border border-[#cbd5e1] shadow-sm transition-transform duration-300"
                        :class="config.is_active ? 'translate-x-2 border-[#198754]' : 'translate-x-0'"
                      ></span>
                    </button>
                  </div>
                </div>
              </td>

              <td class="truncate px-6 py-4 text-ink-3">{{ config.description }}</td>
              <td class="px-6 py-4 font-semibold" :class="isPending(config.id) ? 'text-ink-3' : 'text-ink'">{{ config.file_count }}</td>
              <td class="px-6 py-4">
                <ul v-if="config.sub_requirements?.length" class="flex flex-col gap-1">
                  <li v-for="sub in config.sub_requirements" :key="sub.id" class="text-sm leading-[1.45] before:mr-1.5 before:content-['•']" :class="isPending(config.id) ? 'text-ink-3' : 'text-ink'">{{ sub.title }}</li>
                </ul>
                <span v-else class="text-sm text-ink-3">—</span>
              </td>
              
              <!-- ✅ UPDATED: Actions Column (Only Edit & Delete) -->
              <td class="px-6 py-4">
                <div v-if="isPending(config.id)" class="flex flex-wrap items-center gap-2.5">
                  <span class="text-[13px] font-semibold text-[#C0392B]">Are you sure?</span>
                  <button type="button" class="h-9 rounded-lg border border-[#dc9797] bg-white px-4 text-[13px] font-semibold text-[#c14b4b] transition-colors hover:border-[#C24152] hover:bg-[#C24152] hover:text-white" @click="confirmReqDelete(config.id)">Yes</button>
                  <button type="button" class="h-9 rounded-lg border border-line bg-white px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-[#f2f6fa]" @click="pendingReqDeleteId = null">No</button>
                </div>
                <div v-else class="flex gap-2.5">
                  <button type="button" class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#a6c8dc] bg-white px-5 text-[13px] font-semibold text-[#0D5F8F] transition-colors hover:border-[#0D5F8F] hover:bg-[#0D5F8F] hover:text-white" @click="openEdit(config.id)">
                    Edit <AppIcon name="i-edit" class="h-4 w-4" />
                  </button>
                  <button type="button" class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#e4b4b4] bg-white px-5 text-[13px] font-semibold text-[#c14b4b] transition-colors hover:border-[#C24152] hover:bg-[#C24152] hover:text-white" @click="pendingReqDeleteId = config.id">
                    Delete <AppIcon name="i-trash" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- EXPANDED CHECKLIST PANEL -->
            <tr v-if="isExpanded(config.id)" class="bg-white">
              <td colspan="5" class="p-0">
                <div class="flex flex-col px-8 py-6">
                  <div class="mb-2 flex flex-wrap items-start justify-between gap-5">
                    <div class="min-w-0">
                      <div class="group inline-flex items-center gap-2">
                        <h3 class="text-xl font-bold tracking-[-0.01em] text-ink">{{ config.name }}</h3>
                        <!-- ✅ UPDATED: Compact Toggle Switch with Tooltip for Expanded Panel -->
                        <div class="group relative ml-1">
                          <!-- Tooltip -->
                          <div class="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0f172a] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg transition-opacity group-hover:block z-20">
                            {{ config.is_active ? 'Click to make inactive' : 'Click to make active' }}
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]"></div>
                          </div>
                          
                          <!-- Toggle Switch (8px height) -->
                          <button
                            type="button"
                            role="switch"
                            :aria-checked="config.is_active"
                            :aria-label="`${config.name} status toggle`"
                            class="relative inline-block h-3 w-5 flex-shrink-0 rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#198754] focus-visible:ring-offset-2"
                            :class="config.is_active ? 'bg-[#198754]' : 'bg-[#e2e8f0]'"
                            @click="toggleActive(config)"
                          >
                            <span
                              class="absolute top-0 left-0 h-3 w-3 rounded-full bg-white border border-[#cbd5e1] shadow-sm transition-transform duration-300"
                              :class="config.is_active ? 'translate-x-2 border-[#198754]' : 'translate-x-0'"
                            ></span>
                          </button>
                        </div>
                      </div>
                      <p class="mt-1.5 text-[13px] leading-[1.5] text-ink-3">{{ config.description }}</p>
                    </div>
                    <div class="ml-auto flex flex-wrap items-center gap-2.5">
                      <div v-if="isPending(config.id)" role="group" :aria-label="`Confirm deletion of ${config.name}`" class="inline-flex items-center gap-3 rounded-lg border border-[#e4b4b4] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#C24152]">
                        <span class="font-semibold">Are you sure?</span>
                        <button type="button" class="font-medium text-[#C24152] hover:underline" @click="confirmReqDelete(config.id)">Yes</button>
                        <button type="button" class="font-medium text-[#C24152] hover:underline" @click="pendingReqDeleteId = null">No</button>
                      </div>
                      <template v-else>
                        <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#0D5F8F] hover:text-white" @click="openEdit(config.id)">
                          Edit <AppIcon name="i-edit" class="h-3.5 w-3.5" />
                        </button>
                        <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#e4b4b4] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#C24152] hover:text-white" @click="pendingReqDeleteId = config.id">
                          Delete <AppIcon name="i-trash" class="h-3.5 w-3.5" />
                        </button>
                        <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-[#0D5F8F] px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-[#198754] hover:bg-[#198754]" @click="openEdit(config.id)">
                          Add Sub-requirement <AppIcon name="i-plus" class="h-3.5 w-3.5" />
                        </button>
                      </template>
                    </div>
                  </div>
                  <div class="my-4 flex items-center gap-2 rounded-xl bg-[#F1F5F9] px-3 py-2.5 text-[13px] font-medium text-[#5A6B7E]">
                    <AppIcon name="i-sliders" class="h-4 w-4 text-ink-3" />
                    {{ config.all_subs.length }} sub-requirement{{ config.all_subs.length === 1 ? '' : 's' }}
                  </div>
                  <div v-if="undoState && undoState.kind === 'sub' && undoState.reqId === config.id" role="status" aria-live="polite" class="mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#f4f7fb] px-4 py-3.5 text-[13.5px] text-ink">
                    <span class="font-semibold">Item deleted</span>
                    <button type="button" class="font-semibold text-brand hover:underline" @click="undoRestore">(undo)</button>
                  </div>
                  <ul class="mb-4 grid gap-4">
                    <li v-for="sub in config.all_subs" :key="sub.id" class="rounded-2xl border border-[#e6edf3] bg-[#f7fafc] p-6 transition-opacity">
                      <div v-if="pendingSubDeleteId === sub.id" class="mb-4 flex justify-end">
                        <div role="group" :aria-label="`Confirm deletion of ${sub.title}`" class="inline-flex items-center gap-3 rounded-lg border border-[#e4b4b4] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#C24152]">
                          <span class="font-semibold">Are you sure?</span>
                          <button type="button" class="font-medium text-[#C24152] hover:underline" @click="confirmSubDelete(sub, config.id)">Yes</button>
                          <button type="button" class="font-medium text-[#C24152] hover:underline" @click="pendingSubDeleteId = null">No</button>
                        </div>
                      </div>
                      <div :class="isDimmed(config.id, sub.id) ? 'is-dimmed opacity-55 grayscale select-none' : ''" :inert="isDimmed(config.id, sub.id) ? true : undefined">
                        <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
                          <h4 class="text-base font-medium" :class="sub.is_disabled ? 'text-ink-4' : 'text-ink'">
                            {{ sub.title }}
                            <span v-if="sub.is_disabled" class="ml-1 inline-flex items-center rounded-full border border-line bg-[#EDF1F5] px-3 py-1 text-xs font-medium text-ink-3">Disabled</span>
                          </h4>
                          <div v-if="editingSubId === sub.id" class="ml-auto flex flex-wrap items-center gap-2.5">
                            <button type="button" :disabled="savingSub" class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-[#0D5F8F] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-[#198754] hover:bg-[#198754] disabled:opacity-50" @click="saveSubEdit(sub)">
                              <AppIcon name="i-save" class="h-3.5 w-3.5" /> Save sub-requirement
                            </button>
                            <button type="button" class="rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-[#f2f6fa]" @click="cancelEdit">Cancel</button>
                            <button type="button" disabled class="cursor-not-allowed rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-4">Disable</button>
                            <button type="button" disabled class="inline-flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-4">
                              <AppIcon name="i-trash" class="h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
                          <div v-else class="ml-auto flex flex-wrap items-center gap-2.5">
                            <template v-if="!sub.is_disabled">
                              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-transparent px-3.5 py-2.5 text-[13px] font-medium text-[#0D5F8F] transition-colors hover:bg-[#0D5F8F] hover:text-white" @click="startEdit(sub)">
                                <AppIcon name="i-edit" class="h-3.5 w-3.5" /> Edit sub-requirement
                              </button>
                              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#dcb56f] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#b7791f] transition-colors hover:bg-[#b7791f] hover:text-white" @click="toggleSubDisabled(sub)">Disable</button>
                              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#dc9797] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#c14b4b] transition-colors hover:bg-[#C24152] hover:text-white" @click="pendingSubDeleteId = sub.id">
                                <AppIcon name="i-trash" class="h-3.5 w-3.5" /> Delete
                              </button>
                            </template>
                            <template v-else>
                              <button type="button" disabled class="inline-flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-4">
                                <AppIcon name="i-edit" class="h-3.5 w-3.5" /> Edit Sub-requirement
                              </button>
                              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-[#0D5F8F] bg-[#0D5F8F] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dk" @click="toggleSubDisabled(sub)">Enable</button>
                              <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-[#f2f6fa]" @click="pendingSubDeleteId = sub.id">
                                <AppIcon name="i-trash" class="h-3.5 w-3.5" /> Delete
                              </button>
                            </template>
                          </div>
                        </header>
                        <div v-if="editingSubId === sub.id && editDraft" class="space-y-5">
                          <section>
                            <h5 class="mb-2 text-xs font-medium tracking-[.02em] text-ink-3">Instructions</h5>
                            <textarea v-model="editDraft.instructions" rows="3" class="w-full resize-y rounded-lg border border-line bg-white px-4 py-3.5 text-[13.5px] leading-[1.55] text-ink-2 transition-[border-color,box-shadow] duration-150 focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]"></textarea>
                          </section>
                          <section>
                            <h5 class="mb-2 text-xs font-medium tracking-[.02em] text-ink-3">Resource Link</h5>
                            <input v-model="editDraft.resourceUrl" type="url" placeholder="https://..." class="w-full rounded-lg border border-line bg-white px-4 py-3.5 text-[13.5px] leading-[1.55] text-brand transition-[border-color,box-shadow] duration-150 focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]" />
                          </section>
                          <section>
                            <h5 class="mb-2 text-xs font-medium tracking-[.02em] text-ink-3">Attached Resources</h5>
                            <button type="button" :disabled="editDraft.uploading" class="rounded-lg border border-line bg-white px-3.5 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-[#f2f6fa] disabled:opacity-50" @click="triggerEditUpload(sub.id)">
                              {{ editDraft.uploading ? 'Uploading…' : 'Upload Files' }}
                            </button>
                            <input :ref="(el) => setEditUploadRef(sub.id, el)" type="file" multiple class="hidden" @change="(e) => onEditFilesPicked(e, sub)" />
                            <ul v-if="editDraft.files.length" class="mt-4 flex flex-wrap gap-4">
                              <li v-for="(file, fIdx) in editDraft.files" :key="file.id || `new-${fIdx}`" class="relative flex min-w-[250px] flex-[0_1_320px] items-center gap-3 rounded-lg border border-line bg-white px-3.5 py-3">
                                <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-ink-4" />
                                <span class="min-w-0 flex-1">
                                  <span class="block truncate text-[13px] font-semibold text-ink-2">{{ file.file_name }}</span>
                                  <span class="mt-0.5 block text-[11.5px] text-ink-4">{{ fileKind(file.file_name, file.file_type) }} · {{ formatFileSize(file.file_size) }}</span>
                                </span>
                                <button type="button" class="h-8 flex-shrink-0 rounded-lg bg-[#d9e7f2] px-4 text-[12.5px] font-semibold text-brand transition-colors hover:bg-[#c9ddee]" @click="openSigned(file.storage_path)">Open</button>
                                <button type="button" aria-label="Remove file" class="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[#c9d5e1] text-[#3c5064] transition-colors hover:bg-[#b8c7d6]" @click="dismissEditFile(Number(fIdx))">
                                  <AppIcon name="i-x" class="h-2 w-2" />
                                </button>
                              </li>
                            </ul>
                            <p v-else class="mt-4 rounded-lg border-[1.5px] border-dashed border-line px-4 py-[18px] text-[13px] text-ink-3">No files uploaded for this sub-requirement</p>
                          </section>
                        </div>
                        <div v-else class="space-y-5">
                          <section>
                            <h5 class="mb-2 text-xs font-medium tracking-[.02em] text-ink-3">Instructions</h5>
                            <p class="rounded-lg border border-line bg-[#fbfcfe] px-4 py-3.5 text-[13.5px] leading-[1.55]" :class="sub.is_disabled ? 'text-ink-4' : 'text-ink-2'">
                              {{ sub.instructions || 'No instructions provided' }}
                            </p>
                          </section>
                          <section>
                            <h5 class="mb-2 text-xs font-medium tracking-[.02em] text-ink-3">Resource Link</h5>
                            <p class="rounded-lg border border-line bg-[#fbfcfe] px-4 py-3.5 text-[13.5px] leading-[1.55]">
                              <a v-if="sub.resource_url" :href="sub.resource_url" target="_blank" rel="noopener" :class="sub.is_disabled ? 'break-all text-ink-4' : 'break-all text-[#2e7fae] hover:underline'">{{ sub.resource_url }}</a>
                              <span v-else :class="sub.is_disabled ? 'text-ink-4' : 'text-[#8a99a8]'">No resource URL configured</span>
                            </p>
                          </section>
                          <section>
                            <h5 class="mb-2 text-xs font-medium tracking-[.02em] text-ink-3">Attached Resources</h5>
                            <button type="button" :disabled="sub.is_disabled" class="rounded-lg border border-line bg-white px-3.5 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-[#f2f6fa] disabled:cursor-not-allowed disabled:text-ink-4" @click="triggerSubUpload(sub.id)">
                              Upload File(s)
                            </button>
                            <input :ref="(el) => setSubUploadRef(sub.id, el)" type="file" multiple class="hidden" @change="(e) => onSubFilesPicked(e, sub)" />
                            <ul v-if="sub.config_files?.length" class="mt-4 flex flex-wrap gap-4">
                              <li v-for="file in sub.config_files" :key="file.id" class="flex min-w-[250px] flex-[0_1_320px] items-center gap-3 rounded-lg border border-line bg-white px-3.5 py-3">
                                <AppIcon name="i-file" class="h-5 w-5 flex-shrink-0 text-ink-4" />
                                <span class="min-w-0 flex-1">
                                  <span class="block truncate text-[13px] font-semibold" :class="sub.is_disabled ? 'text-ink-4' : 'text-ink-2'">{{ file.file_name }}</span>
                                  <span class="mt-0.5 block text-[11.5px] text-ink-4">{{ fileKind(file.file_name, file.file_type) }} · {{ formatFileSize(file.file_size) }}</span>
                                </span>
                                <button type="button" class="h-8 flex-shrink-0 rounded-lg bg-[#d9e7f2] px-4 text-[12.5px] font-semibold text-brand transition-colors hover:bg-[#c9ddee]" @click="openSigned(file.storage_path)">Open</button>
                              </li>
                            </ul>
                            <p v-else class="mt-4 rounded-lg border-[1.5px] border-dashed border-line px-4 py-[18px] text-[13px]" :class="sub.is_disabled ? 'text-ink-4' : 'text-ink-3'">
                              No files uploaded for this sub-requirement
                            </p>
                          </section>
                        </div>
                      </div>
                    </li>
                    <li v-if="config.all_subs.length === 0" class="flex flex-col items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-[#b9c6d2] bg-[#f4f7fb] px-6 py-10 text-center text-ink-3">
                      No sub-requirements yet. Use "Add Sub-requirement" to create the first one.
                    </li>
                  </ul>
                  <button type="button" class="flex items-center gap-3 rounded-xl bg-[#f4f7fb] px-4 py-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-[#e9eef5]" @click="toggleExpand(config.id)">
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
    <RequirementModal :open="showModal" :edit-id="editId" kind="offboarding" @close="showModal = false" @saved="handleSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatFileSize, fileKind } from '@/lib/utils'
import RequirementModal from '@/components/config/RequirementModal.vue'

const auth = useAuthStore()

const search = ref('')
const configs = ref<any[]>([])
const showModal = ref(false)
const editId = ref<string | null>(null)
const expandedIds = ref<string[]>([])
const pendingReqDeleteId = ref<string | null>(null)
const pendingSubDeleteId = ref<string | null>(null)
const editingSubId = ref<string | null>(null)
const editDraft = ref<any>(null)
const savingSub = ref(false)
const subUploadRefs = new Map<string, HTMLInputElement>()
const editUploadRefs = new Map<string, HTMLInputElement>()

// ✅ PHASE 2: Filter state
const filterOpen = ref(false)
const statusFilter = ref('')

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const statusFilterLabel = computed(() => {
  if (!statusFilter.value) return 'Filters'
  return statusOptions.find((o) => o.value === statusFilter.value)?.label ?? 'Filters'
})

function selectStatus(value: string) {
  statusFilter.value = value
  filterOpen.value = false
}

type UndoState = {
  kind: 'sub' | 'requirement'
  reqId: string
  subId?: string
  snapshot: any
  subs?: any[]
  files: any[]
}
const undoState = ref<UndoState | null>(null)
let undoTimer: number | null = null

const UNDO_WINDOW_MS = 3000

onMounted(fetchConfigs)
onBeforeUnmount(() => { if (undoState.value) commitUndo() })

async function fetchConfigs() {
  const { data, error } = await supabase
    .from('config_requirements')
    .select(`
      id, name, description, is_active, sort_order, created_by,
      config_sub_requirements (
        id, title, is_disabled, instructions, resource_url, sort_order,
        config_files (id, file_name, file_type, file_size, storage_path)
      )
    `)
    .eq('kind', 'offboarding')
    .order('sort_order', { ascending: true })
    .order('sort_order', { ascending: true, referencedTable: 'config_sub_requirements' })

  if (error) { console.error('Error fetching configs:', error); return }

  configs.value = (data || []).map((row: any) => {
    const allSubs = row.config_sub_requirements || []
    const activeSubs = allSubs.filter((s: any) => !s.is_disabled)
    let fileCount = 0
    activeSubs.forEach((s: any) => { fileCount += s.config_files?.length || 0 })
    return { ...row, all_subs: allSubs, sub_requirements: activeSubs, file_count: fileCount }
  })
}

const filteredConfigs = computed(() => {
  let result = configs.value
  if (statusFilter.value === 'active') {
    result = result.filter((c) => c.is_active)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter((c) => !c.is_active)
  }
  if (!search.value) return result
  const term = search.value.toLowerCase()
  return result.filter((c) => {
    const inSubs = c.all_subs?.some((s: any) => s.title?.toLowerCase().includes(term))
    return c.name.toLowerCase().includes(term) || c.description?.toLowerCase().includes(term) || inSubs
  })
})

function isExpanded(id: string) { return expandedIds.value.includes(id) }
function toggleExpand(id: string) {
  const idx = expandedIds.value.indexOf(id)
  if (idx >= 0) expandedIds.value.splice(idx, 1)
  else expandedIds.value.push(id)
}

function openCreate() { editId.value = null; showModal.value = true }
function openEdit(id: string) { editId.value = id; showModal.value = true }
function handleSaved() { showModal.value = false; editId.value = null; fetchConfigs() }

function isPending(id: string) { return pendingReqDeleteId.value === id }
function isDimmed(reqId: string, subId: string) {
  return pendingReqDeleteId.value === reqId || pendingSubDeleteId.value === subId
}

function clearUndoTimer() {
  if (undoTimer !== null) { window.clearTimeout(undoTimer); undoTimer = null }
}
async function commitUndo() {
  const state = undoState.value
  clearUndoTimer()
  undoState.value = null
  if (state?.files?.length) {
    const paths = state.files.map((f: any) => f.storage_path).filter(Boolean)
    if (paths.length) await supabase.storage.from('config-files').remove(paths)
  }
}
function startUndoTimer() {
  clearUndoTimer()
  undoTimer = window.setTimeout(() => { commitUndo() }, UNDO_WINDOW_MS)
}
async function closePreviousUndo() {
  if (undoState.value) await commitUndo()
}

async function confirmReqDelete(id: string) {
  await closePreviousUndo()
  const config = configs.value.find((c) => c.id === id)
  if (config) {
    undoState.value = {
      kind: 'requirement',
      reqId: id,
      snapshot: { name: config.name, description: config.description, is_active: config.is_active, sort_order: config.sort_order, created_by: config.created_by },
      subs: (config.all_subs || []).map((s: any) => ({ id: s.id, title: s.title, instructions: s.instructions, resource_url: s.resource_url, is_disabled: s.is_disabled, sort_order: s.sort_order, files: (s.config_files || []).map((f: any) => ({ storage_path: f.storage_path, file_name: f.file_name, file_type: f.file_type, file_size: f.file_size })) })),
      files: (config.all_subs || []).flatMap((s: any) => (s.config_files || []).map((f: any) => ({ storage_path: f.storage_path }))),
    }
  }
  const { error } = await supabase.from('config_requirements').delete().eq('id', id)
  pendingReqDeleteId.value = null
  if (error) { console.error('Error deleting:', error); alert('Failed to delete.'); undoState.value = null; return }
  startUndoTimer()
  fetchConfigs()
}

async function confirmSubDelete(sub: any, reqId: string) {
  await closePreviousUndo()
  undoState.value = {
    kind: 'sub',
    reqId,
    subId: sub.id,
    snapshot: { title: sub.title, instructions: sub.instructions, resource_url: sub.resource_url, is_disabled: sub.is_disabled, sort_order: sub.sort_order },
    files: (sub.config_files || []).map((f: any) => ({ storage_path: f.storage_path, file_name: f.file_name, file_type: f.file_type, file_size: f.file_size })),
  }
  const { error } = await supabase.from('config_sub_requirements').delete().eq('id', sub.id)
  if (error) { console.error('Error deleting sub:', error); alert('Failed to delete sub-requirement.'); undoState.value = null; pendingSubDeleteId.value = null; return }
  if (editingSubId.value === sub.id) cancelEdit()
  pendingSubDeleteId.value = null
  startUndoTimer()
  fetchConfigs()
}

async function undoRestore() {
  const state = undoState.value
  if (!state) return
  clearUndoTimer()
  undoState.value = null

  try {
    if (state.kind === 'sub') {
      const { error } = await supabase.from('config_sub_requirements').insert({
        id: state.subId,
        requirement_id: state.reqId,
        title: state.snapshot.title,
        instructions: state.snapshot.instructions,
        resource_url: state.snapshot.resource_url,
        is_disabled: state.snapshot.is_disabled,
        sort_order: state.snapshot.sort_order,
      })
      if (error) throw error
      if (state.files.length) {
        const { error: fErr } = await supabase.from('config_files').insert(
          state.files.map((f: any) => ({ sub_requirement_id: state.subId, storage_path: f.storage_path, file_name: f.file_name, file_type: f.file_type, file_size: f.file_size, uploaded_by: auth.user?.id }))
        )
        if (fErr) throw fErr
      }
    } else {
      const { error } = await supabase.from('config_requirements').insert({
        id: state.reqId,
        name: state.snapshot.name,
        description: state.snapshot.description,
        is_active: state.snapshot.is_active,
        sort_order: state.snapshot.sort_order,
        created_by: state.snapshot.created_by,
        kind: 'offboarding',
      })
      if (error) throw error
      for (const s of state.subs || []) {
        const { error: sErr } = await supabase.from('config_sub_requirements').insert({
          id: s.id,
          requirement_id: state.reqId,
          title: s.title,
          instructions: s.instructions,
          resource_url: s.resource_url,
          is_disabled: s.is_disabled,
          sort_order: s.sort_order,
        })
        if (sErr) throw sErr
        if (s.files?.length) {
          const { error: fErr } = await supabase.from('config_files').insert(
            s.files.map((f: any) => ({ sub_requirement_id: s.id, storage_path: f.storage_path, file_name: f.file_name, file_type: f.file_type, file_size: f.file_size, uploaded_by: auth.user?.id }))
          )
          if (fErr) throw fErr
        }
      }
    }
  } catch (err) {
    console.error('Undo error:', err)
    alert('Failed to restore. The item could not be undone.')
  } finally {
    fetchConfigs()
  }
}

async function toggleSubDisabled(sub: any) {
  const { error } = await supabase.from('config_sub_requirements').update({ is_disabled: !sub.is_disabled }).eq('id', sub.id)
  if (error) { console.error('Error toggling sub:', error); alert('Failed to update.') }
  else fetchConfigs()
}

// --- Requirement Active/Inactive Toggle ---
async function toggleActive(config: any) {
  const newStatus = !config.is_active
  const { error } = await supabase
    .from('config_requirements')
    .update({ is_active: newStatus })
    .eq('id', config.id)

  if (error) {
    console.error('Error toggling status:', error)
    alert('Failed to update status.')
    return
  }
  
  // Optimistic UI update for instant feedback without refetching
  config.is_active = newStatus
}

function startEdit(sub: any) {
  editingSubId.value = sub.id
  editDraft.value = {
    instructions: sub.instructions || '',
    resourceUrl: sub.resource_url || '',
    files: (sub.config_files || []).map((f: any) => ({ ...f })),
    removedFiles: [] as any[],
    uploading: false,
  }
}
function cancelEdit() { editingSubId.value = null; editDraft.value = null }

function setEditUploadRef(id: string, el: any) { if (el) editUploadRefs.set(id, el as HTMLInputElement); else editUploadRefs.delete(id) }
function triggerEditUpload(subId: string) { editUploadRefs.get(subId)?.click() }

async function saveSubEdit(sub: any) {
  if (!editDraft.value) return
  savingSub.value = true
  try {
    const { error } = await supabase.from('config_sub_requirements').update({ instructions: editDraft.value.instructions || null, resource_url: editDraft.value.resourceUrl || null }).eq('id', sub.id)
    if (error) throw error

    const newFiles = editDraft.value.files.filter((f: any) => !f.id)
    if (newFiles.length) {
      const { error: fErr } = await supabase.from('config_files').insert(
        newFiles.map((f: any) => ({ sub_requirement_id: sub.id, storage_path: f.storage_path, file_name: f.file_name, file_type: f.file_type, file_size: f.file_size, uploaded_by: auth.user?.id }))
      )
      if (fErr) throw fErr
    }
    for (const f of editDraft.value.removedFiles) {
      await supabase.from('config_files').delete().eq('id', f.id)
      if (f.storage_path) await supabase.storage.from('config-files').remove([f.storage_path])
    }
    cancelEdit()
    fetchConfigs()
  } catch (err: any) {
    console.error('Save sub error:', err)
    alert(`Failed to save: ${err.message || 'Unknown error'}`)
  } finally {
    savingSub.value = false
  }
}

async function onEditFilesPicked(e: Event, sub: any) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length || !editDraft.value) return
  editDraft.value.uploading = true
  try {
    for (const f of Array.from(input.files)) {
      const path = `config-files/${sub.id}/${Date.now()}_${f.name}`
      const { error } = await supabase.storage.from('config-files').upload(path, f)
      if (error) throw error
      editDraft.value.files.push({ file_name: f.name, file_type: f.type, file_size: f.size, storage_path: path })
    }
  } catch (err) {
    console.error('Upload error:', err)
    alert('Failed to upload one or more files.')
  } finally {
    editDraft.value.uploading = false
    input.value = ''
  }
}
function dismissEditFile(idx: number) {
  const [f] = editDraft.value.files.splice(idx, 1)
  if (f?.id) editDraft.value.removedFiles.push(f)
}

function setSubUploadRef(id: string, el: any) { if (el) subUploadRefs.set(id, el as HTMLInputElement) }
function triggerSubUpload(subId: string) { subUploadRefs.get(subId)?.click() }
async function onSubFilesPicked(e: Event, sub: any) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  try {
    for (const f of Array.from(input.files)) {
      const path = `config-files/${sub.id}/${Date.now()}_${f.name}`
      const { error: upErr } = await supabase.storage.from('config-files').upload(path, f)
      if (upErr) throw upErr
      const { error: dbErr } = await supabase.from('config_files').insert({
        sub_requirement_id: sub.id, storage_path: path,
        file_name: f.name, file_type: f.type, file_size: f.size,
        uploaded_by: auth.user?.id,
      })
      if (dbErr) throw dbErr
    }
    fetchConfigs()
  } catch (err) { console.error('Upload error:', err); alert('Failed to upload.') }
  finally { input.value = '' }
}
async function openSigned(storagePath: string) {
  const { data, error } = await supabase.storage.from('config-files').createSignedUrl(storagePath, 60)
  if (error || !data?.signedUrl) {
    console.error('Signed URL error:', error)
    alert('This file exists in the record but not in Storage.\n\nTo fix: open Edit sub-requirement, dismiss this file with the × button, upload a replacement, then Save.')
    return
  }
  window.open(data.signedUrl, '_blank')
}
</script>