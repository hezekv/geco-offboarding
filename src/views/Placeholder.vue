<template>
  <div class="rounded-xl border bg-white p-12 text-center">
    <h2 class="mb-2 text-lg font-semibold">{{ title }}</h2>
    <p class="text-sm text-muted-foreground">This module is coming in v2. Use the sidebar to access the offboarding features available in this MVP.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>