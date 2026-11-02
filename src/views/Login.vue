<template>
  <div class="flex min-h-screen items-center justify-center bg-[#EFF3F7] px-4 py-10">
    <div class="w-full max-w-[420px]">
      <!-- Brand -->
      <div class="mb-8 flex flex-col items-center gap-4">
        <div class="grid h-12 w-12 place-items-center rounded-xl border border-line bg-white text-[#16202e] shadow-sm">
          <AppIcon name="i-file" class="h-6 w-6" />
        </div>
        <div class="text-center">
          <h1 class="text-xl font-bold leading-tight text-ink">GECO Asia</h1>
          <p class="mt-1 text-[13px] text-ink-3">HR Business Partner Portal · Southeast Asia Operations</p>
        </div>
      </div>

      <!-- Sign-in card -->
      <form
        class="rounded-[16px] border border-line bg-white p-7 shadow-md"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-lg font-semibold text-ink">Sign in</h2>
        <p class="mb-6 mt-1 text-[13px] text-ink-3">Use your GECO credentials to continue.</p>

        <!-- Error banner -->
        <div
          v-if="error"
          role="alert"
          class="mb-5 rounded-[10px] border border-[#e4b4b4] bg-status-danger-soft px-4 py-3 text-[13px] font-medium text-[#c14b4b]"
        >
          {{ error }}
        </div>

        <!-- Email -->
        <label class="mb-4 block">
          <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Email</span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="username"
            placeholder="you@geco.asia"
            class="h-11 w-full rounded-[10px] border border-[#d5dee8] bg-white px-4 text-sm text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-4 hover:border-[#b9c8d8] focus:border-[#12607A] focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]"
          />
        </label>

        <!-- Password -->
        <label class="mb-6 block">
          <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Password</span>
          <span class="relative block">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="h-11 w-full rounded-[10px] border border-[#d5dee8] bg-white px-4 pr-11 text-sm text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-4 hover:border-[#b9c8d8] focus:border-[#12607A] focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-ink-3 transition-colors hover:text-ink"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </span>
        </label>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading || !email || !password"
          class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[#12607A] bg-[#12607A] text-sm font-semibold text-white transition-colors hover:border-[#0E4C63] hover:bg-[#0E4C63] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <AppIcon v-if="!loading" name="i-send" class="h-4 w-4" />
          <span
            v-else
            class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          ></span>
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <p class="mt-5 text-center text-xs text-ink-4">
          HR: tricia.almodiente@geco.asia · Consultant: kyay.mon@geco.asia · Geco@2026
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (loading.value) return

  loading.value = true
  error.value = ''

  try {
    await auth.signIn(email.value.trim(), password.value)

    // ✅ OPTION 2 FIX: Clean comparison, no type casting needed!
    router.push(auth.role === 'consultant' ? '/portal' : '/dashboard')
  } catch (err: any) {
    const msg = err?.message || ''
    error.value = msg.includes('Invalid login credentials')
      ? 'Invalid email or password. Please try again.'
      : msg || 'Sign-in failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>