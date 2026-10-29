<template>
  <span :class="badgeClass">
    <span class="mr-1.5 h-1.5 w-1.5 rounded-full" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { OffboardingStatus } from '@/lib/supabase-types'

const props = defineProps<{
  status: OffboardingStatus
}>()

const config: Record<OffboardingStatus, { label: string; badge: string; dot: string }> = {
  draft: { 
    label: 'Draft', 
    badge: 'bg-gray-100 text-gray-700 border-gray-200', 
    dot: 'bg-gray-400' 
  },
  sent: { 
    label: 'Pending', 
    badge: 'bg-blue-50 text-blue-700 border-blue-200', 
    dot: 'bg-blue-500' 
  },
  in_progress: { 
    label: 'In Progress', 
    badge: 'bg-amber-50 text-amber-700 border-amber-200', 
    dot: 'bg-amber-500' 
  },
  completed: { 
    label: 'Completed', 
    badge: 'bg-green-50 text-green-700 border-green-200', 
    dot: 'bg-green-500' 
  },
  archived: { 
    label: 'Archived', 
    badge: 'bg-slate-100 text-slate-600 border-slate-200', 
    dot: 'bg-slate-400' 
  }
}

const label = computed(() => config[props.status]?.label || props.status)
const badgeClass = computed(() => 
  cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors', config[props.status]?.badge)
)
const dotClass = computed(() => config[props.status]?.dot)
</script>