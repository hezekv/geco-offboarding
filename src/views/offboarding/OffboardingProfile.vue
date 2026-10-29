<template>
  <div v-if="loading" class="flex h-64 items-center justify-center">
    <div class="text-sm text-muted-foreground">Loading offboarding record...</div>
    <div class="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
  </div>

  <div v-else-if="!offboarding" class="rounded-xl border bg-white p-12 text-center">
    <h2 class="mb-2 text-lg font-semibold">Record not found</h2>
    <router-link to="/offboarding-employees" class="text-sm text-primary hover:underline">
      ← Back to offboarding list
    </router-link>
  </div>

  <div v-else class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <router-link to="/offboarding-employees" class="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <AppIcon name="i-chevron" class="mr-1 h-4 w-4 -rotate-90" /> Back to list
      </router-link>
      
      <div class="flex gap-2">
        <button 
          v-if="offboarding.status === 'draft'"
          @click="handleSend" 
          class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
        >
          <AppIcon name="i-send" class="mr-2 h-4 w-4" /> Send to Consultant
        </button>
        <button 
          v-if="offboarding.status !== 'draft' && offboarding.status !== 'archived'"
          @click="handleArchive" 
          class="inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
        >
          Archive
        </button>
        <button 
          v-if="offboarding.status === 'draft'"
          @click="handleDelete" 
          class="inline-flex items-center rounded-md border border-destructive bg-white px-4 py-2 text-sm font-medium text-destructive shadow-sm hover:bg-destructive/10"
        >
          <AppIcon name="i-trash" class="mr-2 h-4 w-4" /> Delete
        </button>
      </div>
    </div>

    <!-- Top Half: Consultant Info Card -->
    <div class="rounded-xl border bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">{{ offboarding.consultants.full_name }}</h1>
          <p class="text-sm text-muted-foreground">{{ offboarding.ob_ref }} · {{ offboarding.consultants.job_title }}</p>
        </div>
        <StatusBadge :status="offboarding.status" />
      </div>

      <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
        <InfoField label="Client" :value="offboarding.consultants.client" />
        <InfoField label="Department" :value="offboarding.consultants.department" />
        <InfoField label="Country" :value="offboarding.consultants.country" />
        <InfoField label="HR in Charge" :value="offboarding.hr?.full_name" />
        <InfoField label="Engagement Start" :value="formatDate(offboarding.consultants.engagement_start)" />
        <InfoField label="Engagement End" :value="formatDate(offboarding.consultants.engagement_end)" />
        <InfoField label="Last Working Day" :value="formatDate(offboarding.last_working_day)" />
        <InfoField label="Consultant Email" :value="offboarding.consultants.email" />
      </div>
    </div>

    <!-- Metrics Bar -->
    <div class="grid grid-cols-3 gap-4">
      <div class="rounded-xl border bg-white p-4 shadow-sm">
        <div class="text-sm text-muted-foreground">Overall Progress</div>
        <div class="mt-1 text-2xl font-bold text-foreground">
          {{ progressPercent }}%
        </div>
        <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div class="h-full bg-primary transition-all" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>
      <div class="rounded-xl border bg-white p-4 shadow-sm">
        <div class="text-sm text-muted-foreground">Completed Requirements</div>
        <div class="mt-1 text-2xl font-bold text-green-600">{{ completedReqsCount }}</div>
      </div>
      <div class="rounded-xl border bg-white p-4 shadow-sm">
        <div class="text-sm text-muted-foreground">Outstanding Tasks</div>
        <div class="mt-1 text-2xl font-bold text-amber-600">{{ outstandingTasksCount }}</div>
      </div>
    </div>

    <!-- Bottom Half: Nested Requirements Accordion -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">Offboarding Checklist</h2>
      
      <div v-for="req in requirements" :key="req.id" class="overflow-hidden rounded-xl border bg-white shadow-sm">
        <!-- Requirement Header (Clickable to expand) -->
        <button 
          @click="toggleRequirement(req.id)" 
          class="flex w-full items-center justify-between bg-muted/30 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <AppIcon 
              name="i-chevron" 
              class="h-5 w-5 text-muted-foreground transition-transform duration-200" 
              :class="{ 'rotate-90': expandedRequirements.has(req.id) }" 
            />
            <span class="font-semibold text-foreground">{{ req.name }}</span>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {{ getReqProgress(req) }}
            </span>
          </div>
        </button>

        <!-- Sub-requirements List -->
        <div v-show="expandedRequirements.has(req.id)" class="border-t px-6 py-4">
          <p v-if="req.description" class="mb-4 text-sm text-muted-foreground">{{ req.description }}</p>
          
          <div class="space-y-4">
            <div 
              v-for="sub in req.offboarding_sub_requirements" 
              :key="sub.id" 
              class="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-start md:justify-between"
              :class="{ 'bg-muted/30 opacity-75': sub.status === 'disabled' }"
            >
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-foreground">{{ sub.title }}</h4>
                  <StatusBadge :status="sub.status === 'disabled' ? 'draft' : sub.status" />
                </div>
                
                <p v-if="sub.instructions" class="text-sm text-muted-foreground">{{ sub.instructions }}</p>
                
                <a 
                  v-if="sub.resource_url" 
                  :href="sub.resource_url" 
                  target="_blank" 
                  class="inline-flex items-center text-xs font-medium text-primary hover:underline"
                >
                  <Link class="mr-1 h-3 w-3" /> {{ sub.resource_url }}
                </a>

                <!-- Attached Files -->
                <div v-if="sub.offboarding_files && sub.offboarding_files.length > 0" class="mt-2 space-y-2">
                  <div class="text-xs font-medium text-muted-foreground">Attached Files:</div>
                  <div 
                    v-for="file in sub.offboarding_files" 
                    :key="file.id" 
                    class="flex items-center justify-between rounded-md border bg-white px-3 py-2 text-xs"
                  >
                    <div class="flex items-center gap-2 truncate">
                      <AppIcon name="i-file" class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span class="truncate">{{ file.file_name }}</span>
                      <span class="text-muted-foreground">({{ formatFileSize(file.file_size) }})</span>
                    </div>
                    <button 
                      @click="openFile(file.storage_path)" 
                      :disabled="fileLoading"
                      class="ml-2 flex-shrink-0 text-primary hover:underline disabled:opacity-50"
                    >
                      {{ fileLoading ? 'Loading...' : 'Open' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Mark Complete Toggle -->
              <div class="flex flex-shrink-0 items-center gap-3 md:mt-0">
                <label class="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    :checked="sub.status === 'completed'"
                    :disabled="offboarding.status === 'completed' || offboarding.status === 'archived' || sub.status === 'disabled'"
                    @change="toggleSubRequirementComplete(sub)"
                    class="peer sr-only"
                  />
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50"></div>
                </label>
                <span class="text-sm font-medium text-foreground">
                  {{ sub.status === 'completed' ? 'Completed' : 'Mark Complete' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Message -->
    <div v-if="feedbackMessage" class="fixed bottom-6 right-6 rounded-md bg-foreground px-4 py-3 text-sm text-white shadow-lg">
      {{ feedbackMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Link } from 'lucide-vue-next' // Kept because 'link/url' isn't in the sprite
import StatusBadge from '@/components/ui/StatusBadge.vue'
import InfoField from '@/components/ui/InfoField.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const offboarding = ref<any>(null)
const requirements = ref<any[]>([])
const loading = ref(true)
const fileLoading = ref(false)
const expandedRequirements = ref<Set<string>>(new Set())
const feedbackMessage = ref('')

// --- Metrics ---
const progressPercent = computed(() => {
  let total = 0, completed = 0
  requirements.value.forEach(req => {
    req.offboarding_sub_requirements.forEach((sub: any) => {
      if (sub.status !== 'disabled') {
        total++
        if (sub.status === 'completed') completed++
      }
    })
  })
  return total === 0 ? 0 : Math.round((completed / total) * 100)
})

const completedReqsCount = computed(() => {
  return requirements.value.filter(req => 
    req.offboarding_sub_requirements.every((sub: any) => sub.status === 'completed' || sub.status === 'disabled')
  ).length
})

const outstandingTasksCount = computed(() => {
  let count = 0
  requirements.value.forEach(req => {
    req.offboarding_sub_requirements.forEach((sub: any) => {
      if (sub.status !== 'disabled' && sub.status !== 'completed') count++
    })
  })
  return count
})

// --- Data Fetching ---
onMounted(async () => {
  await fetchData()
  if (requirements.value.length > 0) {
    expandedRequirements.value.add(requirements.value[0].id)
  }
})

async function fetchData() {
  loading.value = true
  const obId = route.params.id as string

  const { data: obData, error: obError } = await supabase
    .from('offboardings')
    .select(`
      id, ob_ref, status, last_working_day,
      consultants:consultant_id (full_name, job_title, email, client, project, department, country, engagement_start, engagement_end),
      hr:assigned_hr_id (full_name)
    `)
    .eq('id', obId)
    .single()

  if (obError || !obData) {
    console.error('Error fetching offboarding:', obError)
    loading.value = false
    return
  }
  offboarding.value = obData

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

  if (reqsError) {
    console.error('Error fetching requirements:', reqsError)
  } else {
    requirements.value = reqsData || []
  }

  loading.value = false
}

// --- Actions ---
function toggleRequirement(id: string) {
  if (expandedRequirements.value.has(id)) {
    expandedRequirements.value.delete(id)
  } else {
    expandedRequirements.value.add(id)
  }
}

function getReqProgress(req: any) {
  let total = 0, completed = 0
  req.offboarding_sub_requirements.forEach((sub: any) => {
    if (sub.status !== 'disabled') {
      total++
      if (sub.status === 'completed') completed++
    }
  })
  return total === 0 ? '0/0' : `${completed}/${total}`
}

async function toggleSubRequirementComplete(sub: any) {
  const newStatus = sub.status === 'completed' ? 'pending' : 'completed'
  const updateData: any = { 
    status: newStatus,
    completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
    completed_by: newStatus === 'completed' ? auth.user?.id : null
  }

  const { error } = await supabase
    .from('offboarding_sub_requirements')
    .update(updateData)
    .eq('id', sub.id)

  if (error) {
    console.error('Error updating sub-requirement:', error)
    showFeedback('Failed to update status')
  } else {
    sub.status = newStatus
    sub.completed_at = updateData.completed_at
    showFeedback(newStatus === 'completed' ? 'Marked as completed' : 'Marked as pending')
    await fetchData()
  }
}

async function openFile(storagePath: string) {
  fileLoading.value = true
  try {
    const { data, error } = await supabase.storage
      .from('config-files')
      .createSignedUrl(storagePath, 60)

    if (error) throw error
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  } catch (err) {
    console.error('Error generating signed URL:', err)
    showFeedback('Failed to open file. Ensure it exists in Storage.')
  } finally {
    fileLoading.value = false
  }
}

async function handleSend() {
  const { error } = await supabase
    .from('offboardings')
    .update({ 
      sent_at: new Date().toISOString(), 
      sent_by: auth.user?.id 
    })
    .eq('id', offboarding.value.id)

  if (error) {
    console.error('Error sending:', error)
    showFeedback('Failed to send offboarding')
  } else {
    showFeedback('Sent to consultant successfully')
    await fetchData()
  }
}

async function handleArchive() {
  const { error } = await supabase
    .from('offboardings')
    .update({ status: 'archived' })
    .eq('id', offboarding.value.id)

  if (error) {
    console.error('Error archiving:', error)
    showFeedback('Failed to archive')
  } else {
    showFeedback('Record archived')
    router.push('/offboarding-employees')
  }
}

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this draft? This cannot be undone.')) return

  const { error } = await supabase
    .from('offboardings')
    .delete()
    .eq('id', offboarding.value.id)

  if (error) {
    console.error('Error deleting:', error)
    showFeedback('Failed to delete. Only drafts can be deleted.')
  } else {
    showFeedback('Record deleted')
    router.push('/offboarding-employees')
  }
}

function showFeedback(msg: string) {
  feedbackMessage.value = msg
  setTimeout(() => { feedbackMessage.value = '' }, 3000)
}
</script>