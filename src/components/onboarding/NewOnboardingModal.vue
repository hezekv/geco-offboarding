<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]" @click.self="emit('close')">
      <div role="dialog" aria-modal="true" aria-labelledby="new-on-title" class="relative flex max-h-[calc(100dvh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-lg">
        <button type="button" aria-label="Close dialog" class="absolute right-[14px] top-[14px] z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-[#f2f6fa]" @click="emit('close')">
          <AppIcon name="i-x" class="h-3.5 w-3.5" />
        </button>
        <div class="min-h-0 flex-1 overflow-y-auto px-[26px] py-6 pb-[26px]">
          <div class="mb-[22px] flex flex-wrap items-center gap-3 pr-9">
            <h2 id="new-on-title" class="text-[18px] font-medium leading-[1.3] text-ink">Start Onboarding</h2>
            <span class="rounded-pill bg-status-draft px-3 py-1 text-xs font-normal leading-[1.2] text-ink">Draft</span>
          </div>

          <label class="mb-5 block">
            <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Consultant</span>
            <select ref="firstField" v-model="form.consultantId" :class="fieldCls">
              <option value="" disabled>Select a consultant…</option>
              <option v-for="c in consultants" :key="c.id" :value="c.id">
                {{ c.full_name }} — {{ c.job_title }} ({{ eligibilityWord(c.status) }})
              </option>
            </select>
            <span v-if="errors.consultant" class="mt-1.5 block text-[12.5px] font-medium leading-[1.3] text-status-danger">{{ errors.consultant }}</span>
            <span class="mt-1.5 block text-[12px] text-ink-3">Eligible: Prospects (new hires) and Offboarded consultants (re-hires).</span>
          </label>

          <label class="mb-5 block">
            <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Assigned HR Representative</span>
            <select v-model="form.hrId" :class="fieldCls">
              <option value="" disabled>Select HR representative…</option>
              <option v-for="h in hrProfiles" :key="h.id" :value="h.id">{{ h.full_name }}</option>
            </select>
            <span v-if="errors.hr" class="mt-1.5 block text-[12.5px] font-medium leading-[1.3] text-status-danger">{{ errors.hr }}</span>
          </label>

          <label class="mb-2 block">
            <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Day One Date</span>
            <input v-model="form.dayOne" type="date" :class="fieldCls" />
            <span v-if="errors.date" class="mt-1.5 block text-[12.5px] font-medium leading-[1.3] text-status-danger">{{ errors.date }}</span>
          </label>

          <p class="mt-6 rounded-[10px] border border-line bg-[#f7fafc] px-4 py-3 text-[13px] leading-relaxed text-ink-3">
            On create, every active checklist from
            <strong class="font-semibold text-ink-2">Onboarding Configurations</strong>
            is snapshotted into this record — tasks, instructions, resource links and attached files included.
          </p>

          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button type="button" class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink transition-colors hover:bg-[#f2f6fa]" @click="emit('close')">Cancel</button>
            <button type="button" :disabled="saving" class="inline-flex items-center gap-2 rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-brand-dk disabled:opacity-50" @click="handleCreate">
              <AppIcon name="i-save" class="h-4 w-4" />
              {{ saving ? 'Creating…' : 'Create Onboarding Record' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { supabase } from '@/lib/supabase'
import { logActivity } from '@/lib/activity'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const fieldCls = 'h-11 w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-sm leading-[1.45] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3/75 hover:border-[#b9c8d8] focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]'

const saving = ref(false)
const consultants = ref<any[]>([])
const hrProfiles = ref<any[]>([])
const firstField = ref<HTMLSelectElement | null>(null)
const form = ref({ consultantId: '', hrId: '', dayOne: '' })
const errors = ref({ consultant: '', hr: '', date: '' })

watch(() => props.open, async (isOpen) => {
  if (!isOpen) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onEsc)
    return
  }
  form.value = { consultantId: '', hrId: '', dayOne: '' }
  errors.value = { consultant: '', hr: '', date: '' }
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onEsc)
  nextTick(() => firstField.value?.focus())
  await loadOptions()
})

function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') emit('close') }
function eligibilityWord(s: string) { return s === 'offboarded' ? 'Re-hire' : 'Prospect' }

async function loadOptions() {
  // ✅ Onboarding eligibility: prospect (new hire) OR offboarded (re-hire)
  // Enforces one-active-per-consultant
  const { data: cons } = await supabase
    .from('consultants')
    .select(`
      id, full_name, job_title, client, status,
      onboardings!left (id, status)
    `)
    .in('status', ['prospect', 'offboarded'])
    .order('full_name')

  consultants.value = (cons || []).filter((c: any) => {
    const hasActive = (c.onboardings || []).some((o: any) =>
      ['draft', 'sent', 'in_progress'].includes(o.status)
    )
    return !hasActive
  })

  const { data: hrs } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .order('full_name')
  hrProfiles.value = hrs || []
}

async function nextOnRef() {
  const { count } = await supabase
    .from('onboardings')
    .select('id', { count: 'exact', head: true })
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `ON-${yy}${mm}${(count ?? 0) + 1}`
}

async function snapshotConfigs(onboardingId: string) {
  const { data: configs, error } = await supabase
    .from('config_requirements')
    .select(`
      id, name, description, sort_order,
      config_sub_requirements (
        id, title, instructions, resource_url, is_disabled, sort_order,
        config_files (id, storage_path, file_name, file_type, file_size)
      )
    `)
    .eq('is_active', true)
    .eq('kind', 'onboarding') // ✅ Only snapshot onboarding templates
    .order('sort_order', { ascending: true })
  if (error) throw error

  for (const cfg of configs || []) {
    const { data: reqRow, error: reqErr } = await supabase
      .from('onboarding_requirements')
      .insert({
        onboarding_id: onboardingId,
        name: cfg.name,
        description: cfg.description,
        sort_order: cfg.sort_order,
      })
      .select()
      .single()
    if (reqErr) throw reqErr

    const subs = (cfg.config_sub_requirements || []).filter((s: any) => !s.is_disabled)
    for (const s of subs) {
      const { data: subRow, error: subErr } = await supabase
        .from('onboarding_sub_requirements')
        .insert({
          onboarding_requirement_id: reqRow.id,
          title: s.title,
          instructions: s.instructions,
          resource_url: s.resource_url,
          status: 'pending',
          sort_order: s.sort_order,
        })
        .select()
        .single()
      if (subErr) throw subErr

      const files = s.config_files || []
      if (files.length) {
        const { error: fErr } = await supabase.from('onboarding_files').insert(
          files.map((f: any) => ({
            onboarding_sub_requirement_id: subRow.id,
            source_file_id: f.id,
            storage_path: f.storage_path,
            file_name: f.file_name,
            file_type: f.file_type,
            file_size: f.file_size,
          }))
        )
        if (fErr) throw fErr
      }
    }
  }
}

async function handleCreate() {
  errors.value = { consultant: '', hr: '', date: '' }
  let ok = true
  if (!form.value.consultantId) { errors.value.consultant = 'Please select a consultant.'; ok = false }
  if (!form.value.hrId) { errors.value.hr = 'Please assign an HR representative.'; ok = false }
  if (!form.value.dayOne) { errors.value.date = 'Please pick the Day One date.'; ok = false }
  if (!ok) return

  saving.value = true
  try {
    const onRef = await nextOnRef()
    const payload: Record<string, any> = {
      on_ref: onRef,
      consultant_id: form.value.consultantId,
      assigned_hr_id: form.value.hrId,
      day_one_date: form.value.dayOne,
      status: 'draft',
    }
    const { data: ob, error } = await supabase
      .from('onboardings')
      .insert(payload as any)
      .select()
      .single()
    if (error) throw error

    await snapshotConfigs(ob.id)
    logActivity('onboarding.created', 'onboarding', ob.id, { on_ref: ob.on_ref })
    emit('saved')
  } catch (err: any) {
    console.error('Creation error:', err)
    alert(`Failed to create onboarding: ${err.message || 'Unknown error'}`)
  } finally {
    saving.value = false
  }
}
</script>