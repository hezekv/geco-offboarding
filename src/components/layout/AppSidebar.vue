<template>
  <aside class="flex w-64 flex-col border-r bg-white">
    <div class="flex h-16 items-center gap-2 border-b px-6">
      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white font-bold">G</div>
      <div>
        <div class="text-sm font-semibold text-foreground">GECO Asia</div>
        <div class="text-xs text-muted-foreground">HR Business Partner Portal</div>
      </div>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-4">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
        :class="isActive(item.to)
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'"
      >
        <component :is="item.icon" class="h-4 w-4" />
        {{ item.label }}
      </router-link>
    </nav>

    <div class="border-t px-6 py-3 text-xs text-muted-foreground">
      Southeast Asia Operations
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, Users, Contact, TrendingUp,
  Settings, UserCog
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Consultants', to: '/consultants', icon: Users },
  { label: 'Contacts', to: '/contacts', icon: Contact },
  { label: 'Performance', to: '/performance', icon: TrendingUp },
  { label: 'Offboarding Configurations', to: '/offboarding-config', icon: Settings },
  { label: 'Offboarding Employees', to: '/offboarding-employees', icon: UserCog },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>