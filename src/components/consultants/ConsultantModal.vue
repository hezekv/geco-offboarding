<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]"
      @click.self="emit('close')"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultant-modal-title"
        class="relative flex max-h-[calc(100dvh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-lg"
      >
        <button
          type="button"
          aria-label="Close dialog"
          class="absolute right-[14px] top-[14px] z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-[#f2f6fa]"
          @click="emit('close')"
        >
          <AppIcon name="i-x" class="h-3.5 w-3.5" />
        </button>

        <div class="min-h-0 flex-1 overflow-y-auto px-[26px] py-6 pb-[26px]">
          <div class="mb-[22px] flex flex-wrap items-center gap-3 pr-9">
            <h2 id="consultant-modal-title" class="text-[18px] font-medium leading-[1.3] text-ink">
              {{ isEdit ? 'Edit Consultant' : 'Add Consultant' }}
            </h2>
            <span class="rounded-pill bg-status-draft px-3 py-1 text-xs font-normal leading-[1.2] text-ink">
              Master record
            </span>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Full name</span>
              <input v-model="form.full_name" type="text" :class="fieldCls" placeholder="e.g. Priya Nair" />
              <span v-if="errors.full_name" class="mt-1.5 block text-[12.5px] font-medium text-status-danger">{{ errors.full_name }}</span>
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Email</span>
              <input v-model="form.email" type="email" :class="fieldCls" placeholder="name@geco.asia" />
              <span v-if="errors.email" class="mt-1.5 block text-[12.5px] font-medium text-status-danger">{{ errors.email }}</span>
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Job title</span>
              <input v-model="form.job_title" type="text" :class="fieldCls" placeholder="e.g. Payroll Specialist" />
              <span v-if="errors.job_title" class="mt-1.5 block text-[12.5px] font-medium text-status-danger">{{ errors.job_title }}</span>
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Status</span>
              <select v-model="form.status" :class="fieldCls" :disabled="lifecycleLocked">
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="on_bench">On Bench</option>
                <option v-if="lifecycleLocked" :value="form.status">{{ form.status }}</option>
              </select>
              <span v-if="lifecycleLocked" class="mt-1.5 block text-[12px] text-ink-3">
                "{{ form.status }}" is driven by the offboarding lifecycle and cannot be edited manually.
              </span>
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Client</span>
              <input v-model="form.client" type="text" :class="fieldCls" placeholder="e.g. P&G Digital Ops" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Project</span>
              <input v-model="form.project" type="text" :class="fieldCls" placeholder="e.g. Payroll Transformation" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Department</span>
              <input v-model="form.department" type="text" :class="fieldCls" placeholder="e.g. Technology Consulting" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Country</span>
              <input v-model="form.country" type="text" :class="fieldCls" placeholder="e.g. Philippines" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Engagement start</span>
              <input v-model="form.engagement_start" type="date" :class="fieldCls" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Engagement end</span>
              <input v-model="form.engagement_end" type="date" :class="fieldCls" />
            </label>
          </div>
        </div>

        <div class="flex flex-wrap justify-end gap-3 border-t border-line bg-white px-[26px] py-4">
          <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink transition-colors hover:bg-[#f2f6fa]" @click="emit('close')">
            Cancel
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-brand-dk disabled:opacity-50"
            @click="handleSave"
          >
            <AppIcon name="i-save" class="h-4 w-4" />
            {{ saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Consultant' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { logActivity } from '@/lib/activity'

const props = defineProps<{ open: boolean; consultant: any | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const fieldCls =
  'h-11 w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-sm leading-[1.45] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3/75 hover:border-[#b9c8d8] focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]'

const saving = ref(false)
const form = ref(emptyForm())
const errors = ref({ full_name: '', email: '', job_title: '' })

const isEdit = computed(() => !!props.consultant)
const lifecycleLocked = computed(() => ['offboarding', 'offboarded'].includes(form.value.status))

function emptyForm() {
  return {
    full_name: '', email: '', job_title: '', status: 'prospect',
    client: '', project: '', department: '', country: '',
    engagement_start: '', engagement_end: '',
  }
}

watch(() => props.open, (isOpen) => {
  if (!isOpen) return
  errors.value = { full_name: '', email: '', job_title: '' }
  form.value = props.consultant
    ? {
        full_name: props.consultant.full_name ?? '',
        email: props.consultant.email ?? '',
        job_title: props.consultant.job_title ?? '',
        status: props.consultant.status ?? 'active',
        client: props.consultant.client ?? '',
        project: props.consultant.project ?? '',
        department: props.consultant.department ?? '',
        country: props.consultant.country ?? '',
        engagement_start: props.consultant.engagement_start ?? '',
        engagement_end: props.consultant.engagement_end ?? '',
      }
    : emptyForm()
})

async function handleSave() {
  errors.value = { full_name: '', email: '', job_title: '' }
  let ok = true
  if (!form.value.full_name.trim()) { errors.value.full_name = 'Full name is required.'; ok = false }
  if (!form.value.email.trim() || !/^\S+@\S+\.\S+$/.test(form.value.email)) { errors.value.email = 'A valid email is required.'; ok = false }
  if (!form.value.job_title.trim()) { errors.value.job_title = 'Job title is required.'; ok = false }
  if (!ok) return

  saving.value = true
  try {
    const payload = {
      full_name: form.value.full_name.trim(),
      email: form.value.email.trim().toLowerCase(),
      job_title: form.value.job_title.trim(),
      status: form.value.status,
      client: form.value.client.trim() || null,
      project: form.value.project.trim() || null,
      department: form.value.department.trim() || null,
      country: form.value.country.trim() || null,
      engagement_start: form.value.engagement_start || null,
      engagement_end: form.value.engagement_end || null,
    }

    if (isEdit.value) {
      const before = props.consultant
      const { error } = await supabase.from('consultants').update(payload).eq('id', before.id)
      if (error) throw error
      logActivity('consultant.updated', 'consultant', before.id, { name: payload.full_name })
      if (before.status !== payload.status) {
        logActivity('consultant.status_changed', 'consultant', before.id, { from: before.status, to: payload.status, via: 'manual' })
      }
    } else {
      const { data, error } = await supabase.from('consultants').insert(payload).select().single()
      if (error) throw error
      logActivity('consultant.created', 'consultant', data.id, { name: payload.full_name, status: payload.status })
    }
    emit('saved')
  } catch (err: any) {
    console.error('Consultant save error:', err)
    alert(`Failed to save consultant: ${err.message || 'Unknown error'}`)
  } finally {
    saving.value = false
  }
}
</script>