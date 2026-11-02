<template>
  <aside class="flex h-screen w-56 flex-shrink-0 flex-col bg-sidebar">
    <!-- Brand Area (no truncate — text wraps per design) -->
    <div class="mx-3 mt-3 flex items-center gap-3.5 rounded-xl border border-white/14 p-3.5">
      <div class="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-white text-sidebar">
        <BriefcaseBusiness class="h-6 w-6" />
      </div>
      <div class="flex min-w-0 flex-col gap-1.5">
        <strong class="text-sm font-bold leading-[1.35] text-white">
          HR Business Partner Portal
        </strong>
        <small class="text-xs leading-[1.5] text-sidebar-muted">
          Southeast Asia Operations
        </small>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="mt-7 flex-1 overflow-y-auto px-3 pb-4" aria-label="Main navigation">
      <ul class="flex flex-col gap-2">
        <li v-for="item in navItems" :key="item.to">
          <router-link
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            class="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm leading-snug transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
            :class="isActive(item.to)
              ? 'bg-sidebar-active font-semibold text-white shadow-[inset_3px_0_0_var(--c-accent)]'
              : 'font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white'"
          >
            <!-- Hybrid icons: Lucide component OR sprite string -->
            <component
              v-if="typeof item.icon !== 'string'"
              :is="item.icon"
              class="h-5 w-5 flex-shrink-0 opacity-90"
            />
            <AppIcon v-else :name="item.icon" class="h-5 w-5 flex-shrink-0 opacity-90" />
            <span class="min-w-0">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import { BriefcaseBusiness, Users } from 'lucide-vue-next'

const route = useRoute()

type NavItem = {
  label: string
  to: string
  icon: string | Component // string = sprite id, Component = Lucide
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-sliders' },
  { label: 'Consultants', to: '/consultants', icon: 'i-badge-check' },
  { label: 'Contacts', to: '/contacts', icon: 'i-edit' },
  { label: 'Performance', to: '/performance', icon: 'i-clock' },
  { label: 'Offboarding Configurations', to: '/offboarding-config', icon: 'i-sliders' },
  { label: 'Offboarding Employees', to: '/offboarding-employees', icon: Users },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>