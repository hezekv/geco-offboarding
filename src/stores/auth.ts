import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase-types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const profile = ref<Tables<'profiles'> | null>(null)
  const consultant = ref<any>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() => profile.value?.full_name ?? user.value?.email ?? 'User')
  const role = computed(() => profile.value?.role ?? null)
  const consultantId = computed<string | null>(() => consultant.value?.id ?? null)

  async function init() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null
      if (user.value) await loadProfile(user.value.id)
    } finally {
      loading.value = false
    }
  }

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    profile.value = data ?? null
    
    if (data?.role === 'consultant') {
      const { data: cons } = await supabase
        .from('consultants')
        .select('*')
        // ✅ QUICK FIX: Added 'as any' to bypass strict type checking for the new column
        .eq('user_id' as any, userId)
        .single()
      consultant.value = cons ?? null
    } else {
      consultant.value = null
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    if (data.user) await loadProfile(data.user.id)
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    consultant.value = null
  }

  // Listen for auth state changes (e.g., token refresh, sign-out from another tab)
  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user ?? null
    if (user.value) {
      await loadProfile(user.value.id)
    } else {
      profile.value = null
      consultant.value = null
    }
  })

  return { 
    user, 
    profile, 
    consultant, 
    loading, 
    isAuthenticated, 
    fullName, 
    role, 
    consultantId, 
    init, 
    signIn, 
    signOut 
  }
})