<template>
  <!-- ✅ GECO Brand Dark Theme: Deep Navy Base -->
  <div class="flex min-h-screen w-full bg-[#122033] text-white" style="font-family: 'IBM Plex Sans', sans-serif;">
    
    <!-- ===== Left Panel: Sign In Form ===== -->
    <div class="flex w-full flex-col bg-[#1b2534] justify-center px-8 py-12 lg:w-1/2 lg:px-24 xl:px-32">
      
      <!-- Logo -->
      <div class="mb-12 flex items-center gap-3">
        <div class="grid h-24 w-24 place-items-center rounded-xl bg-[#12607A] text-white shadow-lg shadow-[#12607A]/20">
          <BriefcaseBusiness class="h-16 w-16" />
        </div>
        <span class="text-5xl font-bold tracking-tight text-white">HR Asia</span>
      </div>

      <!-- Error Banner -->
      <div
        v-if="error"
        role="alert"
        class="mb-6 rounded-xl border border-[#C24152]/30 bg-[#C24152]/10 px-4 py-3 text-sm font-medium text-[#FF8A9B]"
      >
        {{ error }}
      </div>

      <!-- Form -->
      <form class="space-y-6" novalidate @submit.prevent="handleSubmit">
        <!-- Email -->
        <div>
          <label class="mb-2 block text-sm font-medium text-[#A0B0C0]">Email Address</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              required
              autocomplete="username"
              placeholder="you@geco.asia"
              class="h-12 w-full rounded-xl border border-[#2A3A4A] bg-[#1A2A3A] px-4 text-sm text-white transition-all placeholder:text-[#5A6A7A] focus:border-[#12607A] focus:bg-[#1E3048] focus:outline-none focus:ring-4 focus:ring-[#12607A]/20"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="mb-2 block text-sm font-medium text-[#A0B0C0]">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="h-12 w-full rounded-xl border border-[#2A3A4A] bg-[#1A2A3A] px-4 pr-12 text-sm text-white transition-all placeholder:text-[#5A6A7A] focus:border-[#12607A] focus:bg-[#1E3048] focus:outline-none focus:ring-4 focus:ring-[#12607A]/20"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A6A7A] transition-colors hover:text-[#12607A]"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Submit Button (Brand Teal) -->
        <button
          type="submit"
          :disabled="loading || !email || !password"
          class="flex h-12 w-full items-center justify-center rounded-xl bg-[#12607A] text-sm font-bold text-white shadow-lg shadow-[#12607A]/25 transition-all hover:bg-[#0E4C63] hover:shadow-[#12607A]/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2"></span>
          {{ loading ? 'Signing in…' : 'Sign in to Portal' }}
        </button>
      </form>

      <!-- Footer / Demo Credentials -->
      <div class="mt-12 border-t border-[#2A3A4A] pt-6">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5A6A7A]">Demo Environment</p>
        <div class="flex flex-col gap-y-2 text-xs text-[#8A9BB0]">
          
          <p class="text-sm"><span class="font-semibold text-[#12607A]">HR:</span> tricia.almodiente@geco.asia · mika.santos@geco.asia · ramon.cruz@geco.asia</p>
          <p class="text-sm"><span class="font-semibold text-[#12607A]">Consultant:</span> kyay.mon@geco.asia · daniel.ong@geco.asia · angela.reyes@geco.asia</p>
          <p class="text-sm">
            <span class="font-semibold text-[#5A6A7A]">Password:</span> 
            <span class="font-mono bg-[#1A2A3A] px-2 py-0.5 rounded text-[#A0B0C0]">Geco@2026</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ===== Right Panel: Visual / Illustration ===== -->
    <div class="hidden w-1/2 flex-col justify-center bg-[#0B1320] lg:flex relative overflow-hidden">
      <!-- Abstract Background Grid (Brand Tinted) -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#12607A 1px, transparent 1px); background-size: 32px 32px;"></div>
      
      <!-- Brand Glow Effects -->
      <div class="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#12607A]/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#177245]/10 blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

      <!-- Floating "Dashboard" Composition -->
      <div class="relative z-10 mx-auto w-full max-w-lg px-12">
        <div class="relative mx-auto aspect-square w-full max-w-md">
          
          <!-- Base Circle -->
          <div class="absolute bottom-0 left-1/2 h-32 w-[120%] -translate-x-1/2 rounded-[50%] border border-[#1E3048] bg-[#0F1A29] shadow-2xl"></div>
          
          <!-- Floating Card 1 (Top Left - Amber Accent) -->
          <div class="absolute top-10 left-0 h-24 w-32 rounded-2xl border border-[#1E3048] bg-[#152233] p-4 shadow-xl transform -rotate-6 animate-float-slow">
            <div class="h-2 w-12 rounded bg-[#B0761A]/60 mb-2"></div>
            <div class="h-2 w-20 rounded bg-[#2A3A4A]"></div>
            <div class="h-2 w-16 rounded bg-[#2A3A4A] mt-2"></div>
          </div>

          <!-- Floating Card 2 (Top Right - Success Accent) -->
          <div class="absolute top-20 right-0 h-20 w-24 rounded-2xl border border-[#1E3048] bg-[#152233] p-3 shadow-xl transform rotate-12 animate-float-delayed">
            <div class="h-8 w-8 rounded-full bg-[#177245]/20 flex items-center justify-center mb-2">
              <div class="h-3 w-3 rounded-full bg-[#177245]"></div>
            </div>
            <div class="h-2 w-12 rounded bg-[#2A3A4A]"></div>
          </div>

          <!-- Central "Screen" (Brand Teal Focus) -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-80 rounded-3xl border border-[#2A3A4A] bg-[#122033] shadow-2xl p-6 flex flex-col justify-between">
            <!-- Window Controls -->
            <div class="flex items-center gap-2 mb-4">
              <div class="h-3 w-3 rounded-full bg-[#C24152]/60"></div>
              <div class="h-3 w-3 rounded-full bg-[#B0761A]/60"></div>
              <div class="h-3 w-3 rounded-full bg-[#177245]/60"></div>
            </div>
            <!-- Screen Content -->
            <div class="space-y-3">
              <div class="h-4 w-3/4 rounded bg-[#1E3048]"></div>
              <div class="h-4 w-1/2 rounded bg-[#1E3048]"></div>
              <!-- Teal Highlight Block -->
              <div class="h-20 w-full rounded-xl bg-gradient-to-br from-[#12607A]/20 to-[#12607A]/5 border border-[#12607A]/30 flex items-center justify-center">
                <div class="h-8 w-8 rounded-lg bg-[#12607A] shadow-lg shadow-[#12607A]/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff, BriefcaseBusiness } from 'lucide-vue-next'

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

<style>
/* Import IBM Plex Sans from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
</style>

<style scoped>
/* Custom animations for floating elements */
@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50% { transform: translateY(-15px) rotate(-6deg); }
}
@keyframes float-delayed {
  0%, 100% { transform: translateY(0) rotate(12deg); }
  50% { transform: translateY(-10px) rotate(12deg); }
}
.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite 1s;
}
</style>