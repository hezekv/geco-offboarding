<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      type="button"
      class="relative grid h-10 w-10 place-items-center rounded-full border border-[#e4eaf0] bg-white text-[#64758b] transition-colors hover:bg-[#f6f9fc] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      :aria-expanded="isOpen"
      aria-label="Open notifications"
      @click="toggleDropdown"
    >
      <Bell class="h-4 w-4" />
      <!-- Unread Badge -->
      <span 
        v-if="unreadCount > 0" 
        class="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C24152] px-1 text-[10px] font-bold text-white ring-2 ring-white"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      role="menu"
      aria-label="Notifications"
      class="absolute right-0 top-[calc(100%+8px)] z-40 w-[340px] overflow-hidden rounded-[12px] border border-[#e4eaf0] bg-white shadow-lg"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-[#f1f5f9] px-4 py-3">
        <h3 class="text-sm font-semibold text-ink">Notifications</h3>
        <button 
          v-if="notifications.length > 0"
          type="button" 
          class="text-xs font-medium text-[#12607A] hover:underline"
          @click="markAllRead"
        >
          Mark all as read
        </button>
      </div>

      <!-- List -->
      <div class="max-h-[360px] overflow-y-auto">
        <div v-if="loading" class="px-4 py-8 text-center text-xs text-ink-3">
          Loading notifications...
        </div>
        
        <ul v-else-if="notifications.length > 0" class="divide-y divide-[#f1f5f9]">
          <li 
            v-for="notif in notifications" 
            :key="notif.id" 
            class="flex gap-3 px-4 py-3 transition-colors hover:bg-[#f8fafc]"
          >
            <!-- Icon -->
            <div 
              class="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full"
              :class="getIconBg(notif.action)"
            >
              <component :is="getIcon(notif.action)" class="h-3.5 w-3.5" :class="getIconColor(notif.action)" />
            </div>
            
            <!-- Content -->
            <div class="min-w-0 flex-1">
              <p class="text-[13px] leading-snug text-ink">
                <span class="font-semibold">{{ notif.actorName }}</span> 
                {{ notif.message }}
              </p>
              <p class="mt-1 text-[11px] text-ink-3">{{ notif.timeAgo }}</p>
            </div>
          </li>
        </ul>

        <!-- Empty State -->
        <div v-else class="px-4 py-8 text-center">
          <Bell class="mx-auto h-8 w-8 text-[#d5dee8]" />
          <p class="mt-2 text-sm font-medium text-ink-3">No new notifications</p>
          <p class="mt-1 text-xs text-ink-4">You're all caught up!</p>
        </div>
      </div>
    </div>

    <!-- Backdrop to close dropdown -->
    <div v-if="isOpen" class="fixed inset-0 z-30" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { 
  Bell, 
  CheckCheck, 
  UserPlus, 
  UserMinus, 
  FileText, 
  Calendar
} from 'lucide-vue-next'

const auth = useAuthStore()
const isOpen = ref(false)
const notifications = ref<any[]>([])
const loading = ref(true)

const unreadCount = computed(() => notifications.value.length)

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value && notifications.value.length === 0) {
    fetchNotifications()
  }
}

function markAllRead() {
  notifications.value = []
  isOpen.value = false
}

// Helper to map actions to friendly messages
function formatNotification(log: any) {
  let message = 'performed an action.'
  // Fallback to 'Someone' if the profile join failed or user was deleted
  let actorName = log.profiles?.full_name || 'Someone' 

  const action = log.action || ''
  const entity = log.entity_type || 'record'

  if (action.includes('approved')) message = `approved a ${entity.replace('_', ' ')}.`
  else if (action.includes('rejected')) message = `rejected a ${entity.replace('_', ' ')}.`
  else if (action.includes('submitted')) message = `submitted a ${entity.replace('_', ' ')}.`
  else if (action.includes('archived')) message = `archived an ${entity.replace('_', ' ')}.`
  else if (action.includes('created')) message = `created a new ${entity.replace('_', ' ')}.`
  
  return { message, actorName }
}

// Helper for relative time
function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Icon mapping
function getIcon(action: string) {
  if (action?.includes('approved')) return CheckCheck
  if (action?.includes('rejected')) return UserMinus
  if (action?.includes('submitted') || action?.includes('created')) return UserPlus
  if (action?.includes('timesheet') || action?.includes('leave')) return Calendar
  return FileText
}

function getIconBg(action: string) {
  if (action?.includes('approved')) return 'bg-[#177245]/10'
  if (action?.includes('rejected')) return 'bg-[#C24152]/10'
  return 'bg-[#12607A]/10'
}

function getIconColor(action: string) {
  if (action?.includes('approved')) return 'text-[#177245]'
  if (action?.includes('rejected')) return 'text-[#C24152]'
  return 'text-[#12607A]'
}

// ✅ FIX: Bulletproof fetch that doesn't rely on PostgREST schema cache joins
async function fetchNotifications() {
  loading.value = true
  try {
    // 1. Fetch logs WITHOUT the profiles join
    const { data: logs, error } = await (supabase as any)
      .from('activity_logs')
      .select('id, action, entity_type, created_at, actor_id')
      .neq('actor_id', auth.user?.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    if (!logs || logs.length === 0) {
      notifications.value = []
      return
    }

    // 2. Get unique actor IDs from the logs
    const actorIds = [...new Set(logs.map((l: any) => l.actor_id))]

    // 3. Fetch the profiles for those specific actors
    const { data: profiles } = await (supabase as any)
      .from('profiles')
      .select('id, full_name')
      .in('id', actorIds)

    // Create a quick lookup map for names
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p.full_name]))

    // 4. Map and format the notifications
    notifications.value = logs.map((log: any) => {
      // Inject the profile data into the log object so our existing helper works
      const logWithProfile = { 
        ...log, 
        profiles: { full_name: profileMap.get(log.actor_id) || 'Someone' } 
      }
      
      const { message, actorName } = formatNotification(logWithProfile)
      
      return {
        id: log.id,
        action: log.action,
        message,
        actorName,
        timeAgo: timeAgo(log.created_at)
      }
    })
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>