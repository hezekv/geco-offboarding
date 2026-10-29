<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link to="/offboarding-config" class="text-muted-foreground hover:text-foreground">
          <ArrowLeft class="h-5 w-5" />
        </router-link>
        <h1 class="text-2xl font-bold text-foreground">
          {{ isEditing ? 'Edit Requirement Checklist' : 'New Requirement Checklist' }}
        </h1>
      </div>
      <button
        @click="saveConfig"
        :disabled="saving"
        class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 disabled:opacity-50"
      >
        <Save class="mr-2 h-4 w-4" /> {{ saving ? 'Saving...' : 'Save Configuration' }}
      </button>
    </div>

    <!-- Parent Requirement Form -->
    <div class="rounded-xl border bg-white p-6 shadow-sm space-y-4">
      <h2 class="text-lg font-semibold">Requirement Details</h2>
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input v-model="form.name" type="text" class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g., Outstanding Items" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="form.description" rows="3" class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Brief description of this requirement group..."></textarea>
      </div>
      <div class="flex items-center gap-2">
        <input v-model="form.is_active" type="checkbox" id="active" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
        <label for="active" class="text-sm font-medium">Active (visible in new offboardings)</label>
      </div>
    </div>

    <!-- Sub-requirements List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Sub-requirements</h2>
        <button @click="addSubRequirement" class="text-sm text-primary hover:underline font-medium">+ Add Sub-requirement</button>
      </div>

      <div v-for="(sub, index) in form.sub_requirements" :key="index" class="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-medium text-foreground">Sub-requirement #{{ index + 1 }}</h3>
          <button @click="removeSubRequirement(index)" class="text-xs text-destructive hover:underline">Remove</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Title</label>
            <input v-model="sub.title" type="text" class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Instructions (Plain Text)</label>
            <textarea v-model="sub.instructions" rows="2" class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Resource URL / Link</label>
            <input v-model="sub.resource_url" type="url" class="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="https://..." />
          </div>
          <div class="flex items-center gap-2">
            <input v-model="sub.is_disabled" type="checkbox" :id="`disabled-${index}`" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label :for="`disabled-${index}`" class="text-sm font-medium">Disable this sub-requirement</label>
          </div>
        </div>

        <!-- File Upload Section -->
        <div class="border-t pt-4 mt-4">
          <label class="block text-sm font-medium mb-2">Attached Files (to send to consultant)</label>
          
          <!-- Existing Files -->
          <div v-if="sub.files && sub.files.length > 0" class="space-y-2 mb-3">
            <div v-for="(file, fIndex) in sub.files" :key="fIndex" class="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs">
              <div class="flex items-center gap-2">
                <FileText class="h-4 w-4 text-muted-foreground" />
                <span>{{ file.file_name }}</span>
                <span class="text-muted-foreground">({{ formatFileSize(file.file_size) }})</span>
              </div>
              <button @click="removeFile(index, fIndex)" class="text-destructive hover:underline">Remove</button>
            </div>
          </div>

          <!-- Upload Input -->
          <div class="flex items-center gap-2">
            <input 
              type="file" 
              multiple 
              @change="(e) => handleFileUpload(e, index)" 
              class="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            <span v-if="sub.uploading" class="text-xs text-muted-foreground animate-pulse">Uploading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { formatFileSize } from '@/lib/utils'
import { ArrowLeft, Save, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)

// Form State
const form = ref({
  name: '',
  description: '',
  is_active: true,
  sub_requirements: [] as any[]
})

onMounted(async () => {
  if (isEditing.value) {
    await loadConfig(route.params.id as string)
  } else {
    // Start with one empty sub-requirement
    addSubRequirement()
  }
})

async function loadConfig(id: string) {
  const { data, error } = await supabase
    .from('config_requirements')
    .select(`
      *,
      config_sub_requirements (
        *,
        config_files (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error loading config:', error)
    router.push('/offboarding-config')
    return
  }

  form.value.name = data.name
  form.value.description = data.description || ''
  form.value.is_active = data.is_active
  
  // Map sub-requirements and their files
  form.value.sub_requirements = (data.config_sub_requirements || []).map((sub: any) => ({
    ...sub,
    files: sub.config_files || []
  }))
}

function addSubRequirement() {
  form.value.sub_requirements.push({
    title: '',
    instructions: '',
    resource_url: '',
    is_disabled: false,
    files: [],
    uploading: false
  })
}

function removeSubRequirement(index: number) {
  form.value.sub_requirements.splice(index, 1)
}

async function handleFileUpload(event: Event, subIndex: number) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const sub = form.value.sub_requirements[subIndex]
  sub.uploading = true

  try {
    for (const file of Array.from(target.files)) {
      // Generate a unique path: config-files/{tempId}/{filename}
      // We use a temp ID because we don't have the DB ID yet if it's new.
      const tempId = isEditing.value ? route.params.id : 'new'
      const filePath = `config-files/${tempId}/${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('config-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Add to local state
      sub.files.push({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: filePath,
        isNew: true // Flag to know we need to insert this into DB later
      })
    }
  } catch (err) {
    console.error('Upload error:', err)
    alert('Failed to upload one or more files.')
  } finally {
    sub.uploading = false
    target.value = '' // Reset input
  }
}

function removeFile(subIndex: number, fileIndex: number) {
  form.value.sub_requirements[subIndex].files.splice(fileIndex, 1)
}

async function saveConfig() {
  if (!form.value.name.trim()) {
    alert('Requirement Name is required.')
    return
  }

  saving.value = true
  try {
    const userId = auth.user?.id

    // 1. Save Parent Requirement
    let requirementId = route.params.id as string
    
    if (isEditing.value) {
      const { error } = await supabase
        .from('config_requirements')
        .update({ name: form.value.name, description: form.value.description, is_active: form.value.is_active })
        .eq('id', requirementId)
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('config_requirements')
        .insert({ name: form.value.name, description: form.value.description, is_active: form.value.is_active, created_by: userId })
        .select()
        .single()
      if (error) throw error
      requirementId = data.id
    }

    // 2. Save Sub-requirements & Files
    // For MVP simplicity: Delete existing sub-reqs and re-insert. 
    // (In production, you'd diff and upsert, but this is robust for an MVP).
    if (isEditing.value) {
      // Get existing sub-req IDs to delete their files from storage if needed (skipping for MVP brevity)
      await supabase.from('config_sub_requirements').delete().eq('requirement_id', requirementId)
    }

    for (let i = 0; i < form.value.sub_requirements.length; i++) {
      const sub = form.value.sub_requirements[i]
      
      // Insert Sub-requirement
      const { data: subData, error: subError } = await supabase
        .from('config_sub_requirements')
        .insert({
          requirement_id: requirementId,
          title: sub.title,
          instructions: sub.instructions,
          resource_url: sub.resource_url,
          is_disabled: sub.is_disabled,
          sort_order: i
        })
        .select()
        .single()
      
      if (subError) throw subError

      // Insert Files
      for (const file of sub.files) {
        // Only insert if it's a new file (has isNew flag) or if we are re-creating everything
        const { error: fileError } = await supabase
          .from('config_files')
          .insert({
            sub_requirement_id: subData.id,
            storage_path: file.storage_path,
            file_name: file.file_name,
            file_type: file.file_type,
            file_size: file.file_size,
            uploaded_by: userId
          })
        if (fileError) throw fileError
      }
    }

    alert('Configuration saved successfully!')
    router.push('/offboarding-config')

  } catch (err: any) {
    console.error('Save error:', err)
    alert(`Failed to save: ${err.message || 'Unknown error'}`)
  } finally {
    saving.value = false
  }
}
</script>