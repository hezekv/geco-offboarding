<template>
  <aside class="flex h-screen w-56 flex-shrink-0 flex-col bg-sidebar">
    <!-- Brand Area (no truncate — text wraps per design) -->
    <div class="mx-5 mt-3 p-3 flex items-center gap-3 border-b border-[#8fa0b3]">
      <div class="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-white text-sidebar">
        <BriefcaseBusiness class="h-6 w-6" />
      </div>
      <div class="flex min-w-0 flex-col gap-1">
        <strong class="text-sm font-bold leading-[1.35] text-white">
          HR Business Partner &nbsp;Portal
        </strong>
        <small class="text-xs leading-[1.5] text-sidebar-muted">
          Southeast Asia Operations
        </small>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="mt-4 pt-1 px-2 pb-2 flex-1 overflow-y-auto" aria-label="Main navigation">
      <ul class="flex flex-col gap-2">
        <!-- ===== Standalone links ===== -->
        <li v-for="item in standaloneItems" :key="item.to">
          <router-link
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            class="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm leading-snug transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
            :class="isActive(item.to)
              ? 'bg-sidebar-active font-semibold text-white shadow-[inset_3px_0_0_var(--c-accent)]'
              : 'font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white'"
          >
            <component
              v-if="typeof item.icon !== 'string'"
              :is="item.icon"
              class="h-5 w-5 flex-shrink-0 opacity-90"
            />
            <AppIcon v-else :name="getIconName(item.icon)" class="h-5 w-5 flex-shrink-0 opacity-90" />
            <span class="min-w-0">{{ item.label }}</span>
          </router-link>
        </li>

        <!-- ===== Hierarchical groups (parent + children) ===== -->
        <li v-for="group in navGroups" :key="group.key">
          <!-- Parent row: caret + icon + label -->
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm leading-snug transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
            :class="groupContainsActive(group)
              ? 'font-semibold text-white'
              : 'font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white'"
            :aria-expanded="isGroupOpen(group.key)"
            @click="toggleGroup(group.key)"
          >
            <component
              v-if="typeof group.icon !== 'string'"
              :is="group.icon"
              class="h-5 w-5 flex-shrink-0 opacity-90"
            />
            <AppIcon v-else :name="getIconName(group.icon)" class="h-5 w-5 flex-shrink-0 opacity-90" />
            <span class="min-w-0 flex-1 text-left">{{ group.label }}</span>
            <ChevronRight
              class="h-4 w-4 flex-shrink-0 opacity-70 transition-transform duration-200"
              :class="isGroupOpen(group.key) ? 'rotate-90' : ''"
            />
          </button>

          <!-- Children rows: indented, icon + label -->
          <ul v-show="isGroupOpen(group.key)" class="mt-1 flex flex-col gap-1 pl-2" :aria-label="group.label">
            <li v-for="child in group.children" :key="child.to">
              <router-link
                :to="child.to"
                :aria-current="isActive(child.to) ? 'page' : undefined"
                class="flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm leading-snug transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
                :class="isActive(child.to)
                  ? 'bg-sidebar-active font-semibold text-white shadow-[inset_3px_0_0_var(--c-accent)]'
                  : 'font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white'"
              >
                <component
                  v-if="typeof child.icon !== 'string'"
                  :is="child.icon"
                  class="h-[18px] w-[18px] flex-shrink-0 opacity-90"
                />
                <AppIcon v-else :name="getIconName(child.icon)" class="h-[18px] w-[18px] flex-shrink-0 opacity-90" />
                <span class="min-w-0">{{ child.label }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import {
  BriefcaseBusiness,
  Users,
  UserPlus,
  UserMinus,
  ClipboardList,
  ChevronRight,
} from 'lucide-vue-next'

const route = useRoute()

type NavItem = {
  label: string
  to: string
  icon: string | Component // string = sprite id, Component = Lucide
}

type NavGroup = {
  key: string
  label: string
  icon: string | Component
  children: NavItem[]
}

// ----- Standalone links -----
const standaloneItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-sliders' },
  { label: 'Consultants', to: '/consultants', icon: 'i-badge-check' },
  { label: 'Contacts', to: '/contacts', icon: 'i-edit' },
  { label: 'Performance', to: '/performance', icon: 'i-clock' },
]

// ----- Hierarchical groups -----
const navGroups: NavGroup[] = [
  {
    key: 'configurations',
    label: 'Configurations',
    icon: ClipboardList,
    children: [
      { label: 'Offboarding Configurations', to: '/offboarding-config', icon: 'i-sliders' },
      { label: 'Onboarding Configurations', to: '/onboarding-config', icon: UserPlus },
    ],
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: Users,
    children: [
      { label: 'Offboarding Employees', to: '/offboarding-employees', icon: UserMinus },
      { label: 'Onboarding Employees', to: '/onboarding-records', icon: UserPlus },
    ],
  },
]

// ----- Expand / collapse state (both open by default, like the reference) -----
const expandedGroups = ref<Record<string, boolean>>({
  configurations: false,
  employees: false,
})

function isGroupOpen(key: string) {
  return !!expandedGroups.value[key]
}

function toggleGroup(key: string) {
  expandedGroups.value[key] = !expandedGroups.value[key]
}

function groupContainsActive(group: NavGroup) {
  return group.children.some((c) => isActive(c.to))
}

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function getIconName(icon: string | Component): string {
  return typeof icon === 'string' ? icon : ''
}
</script>