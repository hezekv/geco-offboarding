<template>
  <span :class="[baseClass, variantClass]">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// ✅ FIX: status unions now live in the regeneration-proof domain-types module
import type { OffboardingStatus, SubRequirementStatus } from '@/lib/domain-types'

const props = withDefaults(
  defineProps<{
    /** Any lifecycle or task status; unknown values render as a neutral pill */
    status: OffboardingStatus | SubRequirementStatus | string
    /** sm = profile/table-compact pills, md = default table pills */
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' }
)

const baseClass = computed(() =>
  [
    'inline-flex items-center whitespace-nowrap rounded-pill font-semibold',
    props.size === 'sm'
      ? 'px-2.5 py-1 text-xs font-medium leading-tight'
      : 'px-3.5 py-1.5 text-[13px] leading-tight',
  ].join(' ')
)

const label = computed(() => {
  const map: Record<string, string> = {
    // Offboarding lifecycle
    draft: 'Draft',
    sent: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    archived: 'Archived',
    // Sub-requirement (task) states
    pending: 'Pending',
    disabled: 'Disabled',
  }
  return map[props.status] ?? String(props.status)
})

const variantClass = computed(() => {
  switch (props.status) {
    case 'draft':
      return 'border border-[#A9C4DC] bg-[#E4EEF6] text-ink'
    case 'sent':
    case 'pending':
      return 'bg-[#B0761A] text-white'
    case 'in_progress':
      return 'bg-[#0E5A8C] text-white'
    case 'completed':
      return 'bg-[#177245] text-white'
    case 'archived':
    case 'disabled':
      return 'bg-[#e5eaf1] text-[#7b8794]'
    default:
      return 'bg-[#e5eaf1] text-[#7b8794]'
  }
})
</script>