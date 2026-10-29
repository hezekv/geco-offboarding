<template>
  <div v-if="auth.loading" class="flex h-screen items-center justify-center">
    <div class="text-sm text-muted-foreground">Loading…</div>
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>