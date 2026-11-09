<template>
  <div class="flex min-h-screen bg-white" style="font-family: 'IBM Plex Sans', sans-serif;">
    <!-- Sticky Sidebar -->
    <aside class="fixed left-0 top-0 z-20 h-screen w-72 overflow-y-auto border-r border-[#e2e8f0] bg-[#fafafa] px-6 py-8">
      <router-link to="/styleguide" class="mb-8 flex items-center gap-2.5">
        <div class="grid h-9 w-9 place-items-center rounded-xl bg-[#12607A] text-white">
          <BriefcaseBusiness class="h-5 w-5" />
        </div>
        <div>
          <div class="text-sm font-bold text-[#122033]">GECO Design</div>
          <div class="text-[10px] text-[#8A9BB0]">v1.0 Documentation</div>
        </div>
      </router-link>

      <nav class="space-y-6 text-sm">
        <!-- Foundations -->
        <div>
          <h3 class="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9BB0]">Foundations</h3>
          <ul class="space-y-1">
            <li><a href="#introduction" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Introduction</a></li>
            <li><a href="#colors" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Colors</a></li>
            <li><a href="#typography" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Typography</a></li>
            <li><a href="#spacing" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Spacing & Shape</a></li>
            <li><a href="#iconography" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Iconography</a></li>
            <li><a href="#elevation" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Elevation & Motion</a></li>
          </ul>
        </div>

        <!-- Components -->
        <div>
          <h3 class="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9BB0]">Components</h3>
          <ul class="space-y-1">
            <li><a href="#buttons" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Buttons</a></li>
            <li><a href="#inputs" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Forms & Inputs</a></li>
            <li><a href="#badges" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Badges & Status Pills</a></li>
            <li><a href="#tables" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Tables & Lists</a></li>
            <li><a href="#cards" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Cards & Profiles</a></li>
            <li><a href="#checklists" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Checklists</a></li>
            <li><a href="#modals" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Modals & Overlays</a></li>
            <li><a href="#feedback" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Feedback & Alerts</a></li>
            <li><a href="#progress" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Progress Indicators</a></li>
            <li><a href="#pagination" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Pagination</a></li>
            <li><a href="#notifications" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Notifications</a></li>
            <li><a href="#states" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Empty & Loading States</a></li>
          </ul>
        </div>

        <!-- Patterns -->
        <div>
          <h3 class="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9BB0]">Patterns</h3>
          <ul class="space-y-1">
            <li><a href="#action-center" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Action Center</a></li>
            <li><a href="#exit-criteria" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Exit Criteria Validator</a></li>
            <li><a href="#csv-export" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">CSV Export</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9BB0]">Resources</h3>
          <ul class="space-y-1">
            <li><a href="#accessibility" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Accessibility</a></li>
            <li><a href="#conventions" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Data Conventions</a></li>
            <li><a href="#governance" class="block rounded-md px-3 py-1.5 text-[#475569] transition-colors hover:bg-[#f1f5f9] hover:text-[#12607A]">Contribution Guide</a></li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="ml-72 flex-1 px-12 py-16">
      <div class="mx-auto max-w-5xl">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { BriefcaseBusiness } from 'lucide-vue-next'
</script>