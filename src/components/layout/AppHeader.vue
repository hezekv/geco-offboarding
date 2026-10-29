<template>
  <header class="flex items-center justify-between gap-6 border-b border-border bg-[#ffffff] px-8 py-[18px]">
    <!-- Left: Breadcrumb + Page Title -->
    <div class="min-w-0">
      <span class="block text-xs font-regular tracking-[.2px] text-ink-3">
        HR Business Partner Portal
      </span>
      <h1 class="mt-1 truncate text-xl font-bold leading-tight text-ink">
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Right: User Card (click to open menu) -->
    <div class="relative flex-shrink-0">
      <button
        type="button"
        class="flex items-center gap-3 rounded-xl border border-border bg-[#eef2f7] py-2 pl-2 pr-5 transition-colors hover:bg-[#e3eaf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-haspopup="menu"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <!-- Avatar -->
        <span class="grid h-10 w-10 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-[#cbd5e1] text-[#5b6b7f]">
          <User class="h-5 w-5" fill="currentColor" stroke="none" />
        </span>

        <!-- Name + Role -->
        <span class="flex flex-col text-left">
          <span class="text-sm font-semibold leading-tight text-[#1e293b]">
            {{ auth.fullName }}
          </span>
          <span class="mt-0.5 text-xs leading-tight text-ink-3">
            {{ formattedRole }} · All Regions
          </span>
        </span>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="menuOpen"
        role="menu"
        class="absolute right-0 top-[calc(100%+6px)] z-30 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-lg"
      >
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-[#f1f5f9]"
          @click="handleSignOut"
        >
          <LogOut class="h-4 w-4" />
          Sign out
        </button>
      </div>

      <!-- Click-outside backdrop -->
      <div v-if="menuOpen" class="fixed inset-0 z-20" @click="menuOpen = false"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

const titleMap: Record<string, string> = {
  dashboard: 'Dashboard',
  consultants: 'Consultants',
  contacts: 'Contacts',
  performance: 'Performance',
  'offboarding-config': 'Offboarding Configurations',
  'offboarding-config-new': 'New Configuration',
  'offboarding-config-edit': 'Edit Configuration',
  'offboarding-employees': 'Offboarding Employees',
  'offboarding-new': 'New Offboarding Record',
  'offboarding-profile': 'Offboarding Employee Profile',
}

const pageTitle = computed(() => {
  const name = (route.name as string) ?? ''
  return titleMap[name] ?? 'Dashboard'
})

const formattedRole = computed(() => {
  return auth.role === 'super_admin' ? 'Super Admin' : 'HRBP'
})

async function handleSignOut() {
  menuOpen.value = false
  await auth.signOut()
  router.push('/login')
}
</script>