<template>
  <div>
    <div class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ label }}</div>
    <div class="mt-1 text-sm font-medium text-foreground">{{ value || '—' }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | null | undefined
}>()
</script>