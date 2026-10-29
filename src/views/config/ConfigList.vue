<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Offboarding Configurations</h1>
        <p class="text-sm text-muted-foreground">Define requirement templates for offboarding checklists.</p>
      </div>
      <router-link
        to="/offboarding-config/new"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
      >
        <Plus class="mr-2 h-4 w-4" /> Add Requirement checklist
      </router-link>
    </div>

    <!-- Search -->
    <div class="relative w-full max-w-sm">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        v-model="search"
        type="text"
        placeholder="Search requirements..."
        class="w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- Data Table -->
    <div class="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-6 py-3 font-medium">Name</th>
            <th class="px-6 py-3 font-medium">Description</th>
            <th class="px-6 py-3 font-medium text-center">Files to Send</th>
            <th class="px-6 py-3 font-medium">Sub-requirements</th>
            <th class="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="filteredConfigs.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground">
              No configurations found.
            </td>
          </tr>
          <tr v-for="config in filteredConfigs" :key="config.id" class="hover:bg-muted/30 transition-colors">
            <td class="px-6 py-4 font-medium text-foreground">{{ config.name }}</td>
            <td class="px-6 py-4 text-muted-foreground max-w-md truncate">{{ config.description }}</td>
            <td class="px-6 py-4 text-center">
              <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {{ config.file_count }}
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-muted-foreground">
              <div class="flex flex-wrap gap-1">
                <span v-for="sub in config.sub_requirements" :key="sub.id" class="bg-gray-100 px-2 py-0.5 rounded">
                  {{ sub.title }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <router-link :to="`/offboarding-config/${config.id}/edit`" class="text-primary hover:underline text-xs font-medium">Edit</router-link>
              <button @click="handleDelete(config.id)" class="text-destructive hover:underline text-xs font-medium">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Plus, Search } from 'lucide-vue-next'

const search = ref('')
const configs = ref<any[]>([])

onMounted(fetchConfigs)

async function fetchConfigs() {
  const { data, error } = await supabase
    .from('config_requirements')
    .select(`
      id, name, description, is_active,
      config_sub_requirements (
        id, title, is_disabled,
        config_files (id)
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching configs:', error)
    return
  }

  // Flatten and calculate counts in JavaScript
  configs.value = (data || []).map((row: any) => {
    let fileCount = 0
    const activeSubs = []

    if (row.config_sub_requirements) {
      for (const sub of row.config_sub_requirements) {
        // Only count active (non-disabled) sub-requirements and their files
        if (!sub.is_disabled) {
          activeSubs.push(sub)
          fileCount += sub.config_files?.length || 0
        }
      }
    }

    return {
      ...row,
      file_count: fileCount,
      sub_requirements: activeSubs
    }
  })
}

const filteredConfigs = computed(() => {
  if (!search.value) return configs.value
  const term = search.value.toLowerCase()
  return configs.value.filter(c => 
    c.name.toLowerCase().includes(term) || c.description?.toLowerCase().includes(term)
  )
})

async function handleDelete(id: string) {
  if (!confirm('Delete this requirement checklist? This will not affect existing offboarding records.')) return
  
  const { error } = await supabase.from('config_requirements').delete().eq('id', id)
  if (error) {
    console.error('Error deleting:', error)
    alert('Failed to delete.')
  } else {
    fetchConfigs()
  }
}
</script>