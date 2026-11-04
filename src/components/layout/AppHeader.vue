<template>
  <header class="flex items-center justify-between border-b border-[#e2e8f0] bg-white px-8 py-4">
    <!-- Left: Page Title -->
    <div>
      <p class="text-xs font-medium text-[#64748b]">HR Business Partner Portal</p>
      <h1 class="text-xl font-bold text-[#0f172a]">{{ pageTitle }}</h1>
    </div>

    <!-- Right: User Menu -->
    <div class="relative">
      <!-- User Profile Card (Clickable) -->
      <button
        type="button"
        class="flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 transition-colors hover:bg-[#f1f5f9]"
        :aria-expanded="menuOpen"
        aria-haspopup="menu"
        @click="toggleMenu"
      >
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e8f0] text-[#64748b]">
          <User class="h-4 w-4" />
        </div>
        <div class="text-left">
          <p class="text-sm font-semibold text-[#0f172a]">{{ auth.fullName }}</p>
          <p class="text-xs text-[#64748b]">{{ formattedRole }} · All Regions</p>
        </div>
      </button>

      <!-- Dropdown Menu (appears on click) -->
      <div
        v-if="menuOpen"
        role="menu"
        class="absolute right-0 top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white shadow-lg"
      >
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9]"
          @click="handleSignOut"
        >
          <LogOut class="h-4 w-4" />
          Sign out
        </button>
      </div>

      <!-- Click-away layer -->
      <div v-if="menuOpen" class="fixed inset-0 z-30" @click="menuOpen = false"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    consultants: 'Consultants',
    'consultant-detail': 'Consultant Profile',
    contacts: 'Contacts',
    performance: 'Performance',
    'offboarding-config': 'Checklist Configurations',
    'offboarding-employees': 'Offboarding Employees',
    'offboarding-profile': 'Offboarding Profile',
    'onboarding-records': 'Onboarding Records',
    'onboarding-profile': 'Onboarding Profile',
  }
  return titles[route.name as string] || 'Dashboard'
})

const formattedRole = computed(() => {
  const map: Record<string, string> = {
    super_admin: 'Super Admin',
    hrbp: 'HRBP',
    consultant: 'Consultant',
  }
  return map[auth.role || ''] || 'User'
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

async function handleSignOut() {
  menuOpen.value = false
  await auth.signOut()
  router.push('/login')
}
</script>