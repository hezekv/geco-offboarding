<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 p-6">
    <div class="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white font-bold">G</div>
        <div>
          <div class="font-semibold">GECO Asia</div>
          <div class="text-xs text-muted-foreground">HR Business Partner Portal</div>
        </div>
      </div>

      <h1 class="mb-1 text-xl font-semibold">Sign in</h1>
      <p class="mb-6 text-sm text-muted-foreground">Use your HR account to continue.</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
        >
          {{ submitting ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <div class="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground">
        <div class="font-medium mb-1">Demo accounts (seed data)</div>
        <div>tricia.almodiente@geco.asia / Geco@2026</div>
        <div>mika.santos@geco.asia / Geco@2026</div>
        <div>ramon.cruz@geco.asia / Geco@2026</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.signIn(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/offboarding-employees'
    router.push(redirect)
  } catch (e: any) {
    error.value = e.message || 'Invalid credentials'
  } finally {
    submitting.value = false
  }
}
</script>