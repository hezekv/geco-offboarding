<template>
  <header class="flex h-16 items-center justify-between border-b bg-white px-8">
    <div>
      <h1 class="text-xl font-semibold text-foreground">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-right">
        <div class="text-sm font-medium">{{ auth.fullName }}</div>
        <div class="text-xs text-muted-foreground">
          {{ auth.role === 'super_admin' ? 'Super Admin' : 'HRBP' }} · All Regions
        </div>
      </div>
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold"
      >
        {{ initials }}
      </div>
      <button
        @click="handleSignOut"
        class="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const titleMap: Record<string, string> = {
  dashboard: 'Dashboard',
  consultants: 'Consultants',
  contacts: 'Contacts',
  performance: 'Performance',
  'offboarding-config': 'Offboarding Configurations',
  'offboarding-employees': 'Offboarding employees',
  'offboarding-profile': 'Offboarding employee profile',
}

const pageTitle = computed(() => {
  const name = (route.name as string) ?? ''
  return titleMap[name] ?? 'GECO Asia'
})

const initials = computed(() =>
  auth.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
)

async function handleSignOut() {
  await auth.signOut()
  router.push('/login')
}
</script>