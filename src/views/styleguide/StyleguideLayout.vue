<template>
  <div class="flex min-h-screen bg-[#f8fafc]" style="font-family: 'IBM Plex Sans', sans-serif;">
    <!-- Sticky Sidebar -->
    <aside class="fixed left-0 top-0 z-20 h-screen w-64 overflow-y-auto border-r border-[#e2e8f0] bg-white px-6 py-8">
      <router-link to="/styleguide" class="mb-8 flex items-center gap-2">
        <div class="grid h-8 w-8 place-items-center rounded-lg bg-[#12607A] text-white">
          <BriefcaseBusiness class="h-4 w-4" />
        </div>
        <span class="text-lg font-bold text-[#122033]">GECO Design</span>
      </router-link>

      <nav class="space-y-6 text-sm">
        <div>
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wider text-[#8A9BB0]">Getting Started</h3>
          <ul class="space-y-1.5">
            <li><a href="#introduction" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Introduction</a></li>
            <li><a href="#typography" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Typography</a></li>
            <li><a href="#colors" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Colors</a></li>
            <li><a href="#spacing" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Spacing</a></li>
          </ul>
        </div>

        <div>
          <h3 class="mb-2 text-xs font-bold uppercase tracking-wider text-[#8A9BB0]">Components</h3>
          <ul class="space-y-1.5">
            <li><a href="#controls" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Shared Layout & Controls</a></li>
            <li><a href="#tables" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Table & List</a></li>
            <li><a href="#profiles" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Profile Components</a></li>
            <li><a href="#checklists" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">Checklist Components</a></li>
            <li><a href="#files-modals" class="block rounded-md px-3 py-1.5 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#12607A]">File & Modal</a></li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="ml-64 flex-1 px-12 py-16">
      <div class="mx-auto max-w-4xl">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { BriefcaseBusiness } from 'lucide-vue-next'
</script>