<template>
  <header class="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-6 bg-white px-8">
    <!-- ===== Left: portal label + dynamic page title ===== -->
    <div class="min-w-0">
      <p class="text-[11px] font-medium uppercase tracking-[.18em] text-ink-3">
        HR Business Partner Portal
      </p>
      <h1 class="mt-0.5 truncate text-xl font-semibold leading-tight text-ink">
        {{ pageTitle }}
      </h1>
    </div>

    <!-- ===== Right: Notifications + Account side by side ===== -->
    <div class="flex flex-shrink-0 items-center gap-3">
      <!-- Notifications -->
      <NotificationBell />

      <!-- Account card (default state) + dropdown (clicked state) -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-3 rounded-[12px] border-l border-[#e4eaf0] bg-white py-2.5 pl-3 pr-4 text-left shadow-sm transition-colors duration-150 hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[#e8edf3] text-[#94a3b8]">
            <User class="h-5 w-5" />
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="truncate text-[14px] font-bold leading-[1.3] text-ink">
              {{ auth.fullName }}
            </span>
            <span class="truncate text-[12.5px] leading-[1.4] text-[#94a3b8]">
              {{ formattedRole }} · All Regions
            </span>
          </span>
        </button>

        <!-- Clicked state: sign-out panel below the card -->
        <div
          v-if="menuOpen"
          role="menu"
          aria-label="Account menu"
          class="absolute right-0 top-[calc(100%+8px)] z-40 w-[240px] overflow-hidden rounded-[12px] border border-[#e4eaf0] bg-white py-1.5 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-[#f6f9fc]"
            @click="handleSignOut"
          >
            <LogOut class="h-4 w-4" />
            Sign out
          </button>
        </div>

        <!-- Click-away layer -->
        <div v-if="menuOpen" class="fixed inset-0 z-30" @click="menuOpen = false"></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogOut, User } from 'lucide-vue-next'
import NotificationBell from '@/components/NotificationBell.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

// ✅ Aligned with the DB enum (super_admin | hrbp | consultant) + legacy aliases
const formattedRole = computed(() => {
  const map: Record<string, string> = {
    super_admin: 'Super Admin',
    hrbp: 'HRBP',
    consultant: 'Consultant',
    admin: 'Super Admin',
    hr: 'HRBP',
  }
  return map[auth.role || ''] || 'HRBP'
})

// ✅ Dynamic page title (includes Phase 3 route)
const pageTitle = computed(() => {
  const map: Record<string, string> = {
    dashboard: 'Dashboard',
    consultants: 'Consultants',
    'consultant-detail': 'Consultant Profile',
    contacts: 'Contacts',
    performance: 'Performance',
    'offboarding-config': 'Offboarding Configurations',
    'onboarding-config': 'Onboarding Configurations',
    'offboarding-employees': 'Offboarding Employees',
    'offboarding-profile': 'Offboarding Profile',
    'onboarding-records': 'Onboarding Employees',
    'onboarding-profile': 'Onboarding Profile',
    'assets-access': 'Assets & Access',
    'portal-checklist': 'My Offboarding',
    'portal-onboarding': 'My Onboarding',
  }
  return map[route.name as string] || 'HR Portal'
})

async function handleSignOut() {
  menuOpen.value = false
  await auth.signOut()
  router.push('/login')
}
</script>