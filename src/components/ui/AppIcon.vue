<template>
  <svg
    :class="cn('h-4 w-4 flex-shrink-0', props.class)"
    aria-hidden="true"
    focusable="false"
  >
    <use :href="`#${props.name}`" />
  </svg>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  name: string
  class?: string
}>()
</script>