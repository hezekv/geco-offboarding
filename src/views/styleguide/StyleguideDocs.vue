<template>
  <article class="prose prose-slate max-w-none">
    
    <!-- INTRODUCTION -->
    <section id="introduction" class="mb-16 scroll-mt-8">
      <h1 class="text-4xl font-bold tracking-tight text-[#122033]">GECO Asia Design System</h1>
      <p class="mt-4 text-lg text-[#64758b]">
        Welcome to the official style guide for the GECO Asia HR Business Partner Portal. This document outlines the visual language, typography, color palette, and core UI components used to build a cohesive, accessible, and professional experience for our Southeast Asia operations.
      </p>
      <div class="mt-6 rounded-xl border border-[#12607A]/20 bg-[#12607A]/5 p-4 text-sm text-[#12607A]">
        <strong>Version 1.0:</strong> Built with Vue 3, Tailwind CSS, and Lucide Icons. Optimized for IBM Plex Sans typography.
      </div>
    </section>

    <!-- TYPOGRAPHY -->
    <section id="typography" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Typography</h2>
      <p class="mt-4 text-[#475569]">We use <strong>IBM Plex Sans</strong> as our primary typeface. It provides excellent legibility at small sizes (like data tables) while maintaining a modern, geometric feel at large display sizes.</p>
      
      <div class="mt-8 space-y-6">
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-4xl font-bold text-[#122033]">Heading 1</span>
          <code class="text-xs text-[#8A9BB0]">text-4xl font-bold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-2xl font-bold text-[#122033]">Heading 2</span>
          <code class="text-xs text-[#8A9BB0]">text-2xl font-bold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-lg font-semibold text-[#122033]">Heading 3</span>
          <code class="text-xs text-[#8A9BB0]">text-lg font-semibold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-base text-[#475569]">Body Text (Base)</span>
          <code class="text-xs text-[#8A9BB0]">text-base text-[#475569]</code>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="text-sm text-[#8A9BB0]">Muted / Metadata</span>
          <code class="text-xs text-[#8A9BB0]">text-sm text-[#8A9BB0]</code>
        </div>
      </div>
    </section>

    <!-- COLORS -->
    <section id="colors" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Color Palette</h2>
      <p class="mt-4 text-[#475569]">Our palette is anchored by a deep corporate navy and a vibrant teal for primary actions, supplemented by semantic status colors.</p>
      
      <h3 class="mt-8 text-lg font-semibold text-[#122033]">Brand Colors</h3>
      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div v-for="color in brandColors" :key="color.name" class="overflow-hidden rounded-xl border border-[#e2e8f0]">
          <div class="h-24" :style="{ backgroundColor: color.hex }"></div>
          <div class="p-3">
            <p class="text-sm font-bold text-[#122033]">{{ color.name }}</p>
            <p class="font-mono text-xs text-[#8A9BB0]">{{ color.hex }}</p>
          </div>
        </div>
      </div>

      <h3 class="mt-8 text-lg font-semibold text-[#122033]">Semantic Status Colors</h3>
      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div v-for="color in statusColors" :key="color.name" class="overflow-hidden rounded-xl border border-[#e2e8f0]">
          <div class="h-24" :style="{ backgroundColor: color.hex }"></div>
          <div class="p-3">
            <p class="text-sm font-bold text-[#122033]">{{ color.name }}</p>
            <p class="font-mono text-xs text-[#8A9BB0]">{{ color.hex }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SPACING -->
    <section id="spacing" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Spacing & Radius</h2>
      <p class="mt-4 text-[#475569]">We use a 4px base grid system via Tailwind's default spacing scale. Border radii are standardized to maintain a soft, approachable, yet professional enterprise feel.</p>
      <div class="mt-6 grid grid-cols-3 gap-6">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 rounded-[10px] bg-[#12607A]/10 border-2 border-dashed border-[#12607A]"></div>
          <p class="mt-2 text-sm font-bold">Standard</p>
          <code class="text-xs text-[#8A9BB0]">rounded-[10px]</code>
        </div>
        <div class="text-center">
          <div class="mx-auto h-16 w-16 rounded-2xl bg-[#12607A]/10 border-2 border-dashed border-[#12607A]"></div>
          <p class="mt-2 text-sm font-bold">Cards</p>
          <code class="text-xs text-[#8A9BB0]">rounded-2xl</code>
        </div>
        <div class="text-center">
          <div class="mx-auto h-16 w-16 rounded-full bg-[#12607A]/10 border-2 border-dashed border-[#12607A]"></div>
          <p class="mt-2 text-sm font-bold">Avatars</p>
          <code class="text-xs text-[#8A9BB0]">rounded-full</code>
        </div>
      </div>
    </section>

    <!-- COMPONENTS: SHARED CONTROLS -->
    <section id="controls" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Shared Layout & Controls</h2>
      
      <h3 class="mt-8 text-lg font-semibold text-[#122033]">Buttons</h3>
      <div class="mt-4 flex flex-wrap gap-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-8">
        <button class="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#12607A] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0E4C63]">Primary Action</button>
        <button class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-4 text-sm font-semibold text-[#122033] hover:bg-[#f2f6fa]">Secondary</button>
        <button class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#C24152] bg-[#C24152] px-4 text-sm font-semibold text-white hover:bg-[#a03542]">Destructive</button>
        <button class="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-sm font-semibold text-[#12607A] hover:bg-[#12607A]/5">Ghost Link</button>
      </div>

      <h3 class="mt-8 text-lg font-semibold text-[#122033]">Form Inputs</h3>
      <div class="mt-4 grid gap-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-8 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-[#475569]">Email Address</label>
          <input type="text" placeholder="you@geco.asia" class="h-10 w-full rounded-[10px] border border-[#d5dee8] bg-white px-3 text-sm focus:border-[#12607A] focus:outline-none focus:ring-2 focus:ring-[#12607A]/20" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-[#475569]">Disabled Input</label>
          <input type="text" disabled value="Read-only data" class="h-10 w-full rounded-[10px] border border-[#e2e8f0] bg-[#f1f5f9] px-3 text-sm text-[#8A9BB0]" />
        </div>
      </div>
    </section>

    <!-- COMPONENTS: TABLES -->
    <section id="tables" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Table & List Components</h2>
      <p class="mt-4 text-[#475569]">Data tables use a fixed layout with subtle dividers and hover states for row interactivity.</p>
      
      <div class="mt-6 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-[#e2e8f0] bg-[#f8fafc]">
            <tr>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#8A9BB0]">Consultant</th>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#8A9BB0]">Status</th>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#8A9BB0]">Role</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#f1f5f9]">
            <tr class="hover:bg-[#f8fafc]">
              <td class="px-6 py-4 font-medium text-[#122033]">Priya Nair</td>
              <td class="px-6 py-4"><span class="inline-flex rounded-full bg-[#177245]/10 px-2.5 py-0.5 text-xs font-semibold text-[#177245]">Active</span></td>
              <td class="px-6 py-4 text-[#475569]">Payroll Specialist</td>
            </tr>
            <tr class="hover:bg-[#f8fafc]">
              <td class="px-6 py-4 font-medium text-[#122033]">Kyay Mon</td>
              <td class="px-6 py-4"><span class="inline-flex rounded-full bg-[#B0761A]/10 px-2.5 py-0.5 text-xs font-semibold text-[#B0761A]">Offboarding</span></td>
              <td class="px-6 py-4 text-[#475569]">Senior Business Analyst</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- COMPONENTS: PROFILES -->
    <section id="profiles" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Profile Components</h2>
      <p class="mt-4 text-[#475569]">Hero cards used at the top of detail pages to provide immediate context.</p>
      
      <div class="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div class="flex items-center gap-5">
          <div class="grid h-16 w-16 place-items-center rounded-full bg-[#12607A] text-xl font-bold text-white">PN</div>
          <div>
            <h3 class="text-xl font-bold text-[#122033]">Priya Nair</h3>
            <p class="text-sm text-[#64758b]">OB-24094 · Payroll Specialist at P&G Digital Ops</p>
          </div>
          <div class="ml-auto">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-[#12607A]/10 px-3 py-1 text-xs font-bold text-[#12607A]">
              <span class="h-2 w-2 rounded-full bg-[#12607A]"></span> In Progress
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPONENTS: CHECKLISTS -->
    <section id="checklists" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">Checklist Components</h2>
      <p class="mt-4 text-[#475569]">Requirement cards used in the Offboarding Profile to track sub-tasks.</p>
      
      <div class="mt-6 space-y-4">
        <!-- Completed Task -->
        <div class="rounded-xl border border-[#177245]/30 bg-[#177245]/5 p-5">
          <div class="flex items-start gap-4">
            <div class="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[#177245] text-white">
              <Check class="h-4 w-4" />
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-[#122033]">Pending Expense Reconciliation</h4>
              <p class="mt-1 text-sm text-[#475569]">Review all expenses submitted in the last 60 days and add comments for any disputed reimbursement.</p>
            </div>
            <span class="text-xs font-bold text-[#177245]">Completed</span>
          </div>
        </div>
        <!-- Pending Task -->
        <div class="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="mt-0.5 h-6 w-6 rounded-full border-2 border-[#d5dee8]"></div>
            <div class="flex-1">
              <h4 class="font-semibold text-[#122033]">Client Confirmation with Signature</h4>
              <p class="mt-1 text-sm text-[#475569]">Request the project manager confirmation letter and upload the signed document.</p>
            </div>
            <span class="text-xs font-bold text-[#B0761A]">Pending</span>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPONENTS: FILES & MODALS -->
    <section id="files-modals" class="mb-16 scroll-mt-8">
      <h2 class="border-b border-[#e2e8f0] pb-4 text-2xl font-bold text-[#122033]">File & Modal Components</h2>
      
      <h3 class="mt-8 text-lg font-semibold text-[#122033]">File Upload Zone</h3>
      <div class="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d5dee8] bg-[#f8fafc] p-8 text-center">
        <Upload class="h-8 w-8 text-[#8A9BB0]" />
        <p class="mt-3 text-sm font-semibold text-[#122033]">Drop files here or click to upload</p>
        <p class="mt-1 text-xs text-[#8A9BB0]">PDF, DOCX, XLSX up to 10MB</p>
      </div>

      <h3 class="mt-8 text-lg font-semibold text-[#122033]">Modals (Teleported)</h3>
      <p class="mt-2 text-sm text-[#475569]">Modals use a backdrop blur and a centered, 24px rounded card. They are teleported to the body to avoid z-index stacking context issues.</p>
      <div class="mt-4 relative h-64 overflow-hidden rounded-xl bg-[#122033]/40 p-6 backdrop-blur-sm flex items-center justify-center">
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <h4 class="text-lg font-bold text-[#122033]">Confirm Action</h4>
          <p class="mt-2 text-sm text-[#64758b]">Are you sure you want to archive this offboarding record?</p>
          <div class="mt-6 flex justify-end gap-3">
            <button class="rounded-lg px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#f1f5f9]">Cancel</button>
            <button class="rounded-lg bg-[#C24152] px-4 py-2 text-sm font-semibold text-white">Archive</button>
          </div>
        </div>
      </div>
    </section>

  </article>
</template>

<script setup lang="ts">
import { Check, Upload } from 'lucide-vue-next'

const brandColors = [
  { name: 'Brand Teal', hex: '#12607A' },
  { name: 'Deep Navy', hex: '#122033' },
  { name: 'Ink (Text)', hex: '#16202e' },
  { name: 'Muted Slate', hex: '#8A9BB0' },
]

const statusColors = [
  { name: 'Success', hex: '#177245' },
  { name: 'Warning', hex: '#B0761A' },
  { name: 'Danger', hex: '#C24152' },
  { name: 'Info', hex: '#0284c7' },
]
</script>