<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link to="/offboarding-employees" class="text-muted-foreground hover:text-foreground">
        <ArrowLeft class="h-5 w-5" />
      </router-link>
      <h1 class="text-2xl font-bold text-foreground">New Offboarding Record</h1>
    </div>

    <!-- Creation Form -->
    <div class="rounded-xl border bg-white p-6 shadow-sm space-y-6">
      <div>
        <label class="block text-sm font-medium mb-1">Consultant <span class="text-destructive">*</span></label>
        <select 
          v-model="form.consultant_id" 
          class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="" disabled>Select a consultant...</option>
          <option v-for="c in consultants" :key="c.id" :value="c.id">
            {{ c.full_name }} ({{ c.job_title || 'No Title' }})
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">HR in Charge <span class="text-destructive">*</span></label>
        <select 
          v-model="form.assigned_hr_id" 
          class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="" disabled>Select HR...</option>
          <option v-for="hr in hrProfiles" :key="hr.id" :value="hr.id">
            {{ hr.full_name }} ({{ hr.role }})
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Last Working Day <span class="text-destructive">*</span></label>
        <input 
          v-model="form.last_working_day" 
          type="date" 
          class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t">
        <router-link to="/offboarding-employees" class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          Cancel
        </router-link>
        <button
          @click="handleCreate"
          :disabled="isSubmitting || !isFormValid"
          class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 disabled:opacity-50"
        >
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSubmitting ? 'Creating & Snapshotting...' : 'Create Offboarding Record' }}
        </button>
      </div>
      
      <p v-if="error" class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const consultants = ref<any[]>([])
const hrProfiles = ref<any[]>([])
const isSubmitting = ref(false)
const error = ref('')

const form = ref({
  consultant_id: '',
  assigned_hr_id: '',
  last_working_day: ''
})

const isFormValid = computed(() => 
  form.value.consultant_id && form.value.assigned_hr_id && form.value.last_working_day
)

onMounted(async () => {
  // 1. Fetch consultants and check if they already have an active offboarding
  const { data: consultantsData } = await supabase
    .from('consultants')
    .select(`
      id, full_name, job_title,
      offboardings!left (id, status)
    `)
    .order('full_name');

  // 2. Filter out consultants who are already in an active state
  consultants.value = (consultantsData || []).filter(c => {
    const hasActive = c.offboardings?.some(ob => 
      ['draft', 'sent', 'in_progress'].includes(ob.status)
    );
    return !hasActive; // Only keep consultants with NO active offboarding
  });

  // 3. Fetch HR profiles
  const { data: hrData } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .order('full_name');
  
  hrProfiles.value = hrData || [];
})

async function handleCreate() {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  error.value = ''

  try {
    // 1. Create the Offboarding Record
    const { data: newOb, error: obError } = await supabase
      .from('offboardings')
      .insert({
        consultant_id: form.value.consultant_id,
        assigned_hr_id: form.value.assigned_hr_id,
        last_working_day: form.value.last_working_day,
        created_by: auth.user?.id
      })
      .select()
      .single()

    if (obError || !newOb) throw obError || new Error('Failed to create record')
    const newObId = newOb.id

    // 2. Fetch Active Configurations to Snapshot
    const { data: configs, error: configError } = await supabase
      .from('config_requirements')
      .select('id, name, description, sort_order')
      .eq('is_active', true)
      .order('sort_order')

    if (configError) throw configError

    if (configs && configs.length > 0) {
      // 3. Snapshot Requirements
      const reqsToInsert = configs.map(c => ({
        offboarding_id: newObId,
        source_config_id: c.id,
        name: c.name,
        description: c.description,
        sort_order: c.sort_order
      }))

      const { data: newReqs, error: reqError } = await supabase
        .from('offboarding_requirements')
        .insert(reqsToInsert)
        .select()

      if (reqError) throw reqError

      // 4. Snapshot Sub-Requirements
      const configReqIds = configs.map(c => c.id)
      const { data: configSubs, error: subConfigError } = await supabase
        .from('config_sub_requirements')
        .select('id, requirement_id, title, instructions, resource_url, is_disabled, sort_order')
        .in('requirement_id', configReqIds)

      if (subConfigError) throw subConfigError

      if (configSubs && configSubs.length > 0) {
        // Map old config req ID to new offboarding req ID
        const reqIdMap = new Map(newReqs.map(r => [r.source_config_id, r.id]))
        
        const subsToInsert = configSubs.map(s => ({
          offboarding_requirement_id: reqIdMap.get(s.requirement_id),
          title: s.title,
          instructions: s.instructions,
          resource_url: s.resource_url,
          status: s.is_disabled ? 'disabled' : 'pending',
          sort_order: s.sort_order
        }))

        const { data: newSubs, error: subError } = await supabase
          .from('offboarding_sub_requirements')
          .insert(subsToInsert)
          .select()

        if (subError) throw subError

        // 5. Snapshot Files (Metadata only, reusing storage paths)
        const configSubIds = configSubs.map(s => s.id)
        const { data: configFiles, error: fileConfigError } = await supabase
          .from('config_files')
          .select('id, sub_requirement_id, storage_path, file_name, file_type, file_size')
          .in('sub_requirement_id', configSubIds)

        if (fileConfigError) throw fileConfigError

        if (configFiles && configFiles.length > 0 && newSubs && newSubs.length > 0) {
          const filesToInsert = []
          
          // Create an inverse map: new_offboarding_req_id -> original_config_req_id
          const inverseReqMap = new Map()
          reqIdMap.forEach((newReqId, oldConfigReqId) => {
            inverseReqMap.set(newReqId, oldConfigReqId)
          })

          for (const newSub of newSubs) {
            const originalConfigReqId = inverseReqMap.get(newSub.offboarding_requirement_id)
            
            if (originalConfigReqId) {
              // Find the original config sub-requirement that matches this new sub
              const originalConfigSub = configSubs.find(cs => 
                cs.requirement_id === originalConfigReqId && 
                cs.title === newSub.title
              )
              
              if (originalConfigSub) {
                const filesForThisSub = configFiles.filter(f => f.sub_requirement_id === originalConfigSub.id)
                for (const f of filesForThisSub) {
                  filesToInsert.push({
                    offboarding_sub_requirement_id: newSub.id,
                    source_file_id: f.id,
                    storage_path: f.storage_path,
                    file_name: f.file_name,
                    file_type: f.file_type,
                    file_size: f.file_size
                  })
                }
              }
            }
          }

          if (filesToInsert.length > 0) {
            const { error: fileError } = await supabase
              .from('offboarding_files')
              .insert(filesToInsert)
            if (fileError) throw fileError
          }
        }
      }
    }

    // Success! Redirect to the new profile
    router.push(`/offboarding-employees/${newObId}`)

  } catch (err: any) {
    console.error('Creation error:', err)
    error.value = err.message || 'An unexpected error occurred during creation.'
  } finally {
    isSubmitting.value = false
  }
}
</script>