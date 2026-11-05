<template>
  <div class="relative">
    <button
      type="button"
      class="relative grid h-9 w-9 place-items-center bg-white text-ink-2 transition-colors hover:bg-[#f2f6fa]"
      :aria-expanded="open"
      aria-haspopup="true"
      aria-label="Notifications"
      @click="toggle"
    >
      <Bell class="h-4 w-4" />
      <span
        v-if="unread"
        class="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#C24152] px-1 text-[10px] font-bold text-white"
      >{{ unread > 9 ? '9+' : unread }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-[calc(100%+8px)] z-40 w-80 overflow-hidden rounded-[12px] border border-line bg-white shadow-lg"
    >
      <div class="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span class="text-[13px] font-semibold text-ink">Notifications</span>
        <button v-if="unread" type="button" class="text-[12px] font-medium text-brand hover:underline" @click="markAllRead">
          Mark all read
        </button>
      </div>
      <ul class="max-h-80 divide-y divide-line overflow-y-auto">
        <li v-for="n in items" :key="n.id">
          <button
            type="button"
            class="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[#f6f9fc]"
            :class="{ 'bg-[#f2f7fb]': !n.read_at }"
            @click="openNotification(n)"
          >
            <span class="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <span v-if="!n.read_at" class="h-1.5 w-1.5 flex-none rounded-full bg-brand"></span>
              {{ n.title }}
            </span>
            <span v-if="n.body" class="text-[12px] leading-snug text-ink-3">{{ n.body }}</span>
            <span class="text-[11px] text-ink-4">{{ timeAgo(n.created_at) }}</span>
          </button>
        </li>
        <li v-if="!items.length" class="px-4 py-8 text-center text-[13px] text-ink-3">No notifications yet</li>
      </ul>
    </div>

    <div v-if="open" class="fixed inset-0 z-30" @click="open = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { Bell } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const open = ref(false)
const items = ref<any[]>([])
const unread = ref(0)

onMounted(refresh)

async function refresh() {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', auth.user?.id)
    .order('created_at', { ascending: false })
    .limit(30)
  items.value = data || []
  unread.value = items.value.filter((n) => !n.read_at).length
}

function toggle() {
  open.value = !open.value
  if (open.value) refresh()
}

async function openNotification(n: any) {
  if (!n.read_at) {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', n.id)
    n.read_at = new Date().toISOString()
    unread.value = Math.max(0, unread.value - 1)
  }
  if (n.link) {
    open.value = false
    router.push(n.link)
  }
}

async function markAllRead() {
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', auth.user?.id)
    .is('read_at', null)
  await refresh()
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
</script>