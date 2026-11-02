<template>
  <div class="flex min-h-screen flex-col bg-[#EFF3F7]">
    <!-- Top bar -->
    <header class="sticky top-0 z-30 border-b border-line bg-[#f8fafc]">
      <div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <div class="flex items-center gap-3">
          <div class="grid h-9 w-9 place-items-center rounded-[10px] border border-line bg-white text-[#16202e]">
            <BriefcaseBusiness class="h-[18px] w-[18px]" />
          </div>
          <div>
            <div class="text-sm font-bold leading-tight text-ink">GECO Asia</div>
            <div class="text-[11px] leading-tight text-ink-3">Consultant Offboarding Portal</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-[13px] font-semibold leading-tight text-ink">{{ auth.fullName }}</div>
            <div class="text-[11px] leading-tight text-ink-3">Consultant</div>
          </div>
          <div class="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
            {{ initials }}
          </div>
          <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-[10px] border border-line bg-white px-3 text-[13px] font-semibold text-ink-2 transition-colors hover:bg-[#f2f6fa] hover:text-ink"
            @click="handleSignOut"
          >
            <LogOut class="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BriefcaseBusiness, LogOut } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const initials = computed(() =>
  (auth.fullName || '')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

async function handleSignOut() {
  await auth.signOut()
  router.push('/login')
}
</script>