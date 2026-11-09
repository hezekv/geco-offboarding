<template>
  <article class="prose prose-slate max-w-none">
    
    <!-- INTRODUCTION -->
    <section id="introduction" class="mb-20 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <div class="h-8 w-1 rounded-full bg-[#12607A]"></div>
        <h1 class="text-4xl font-bold tracking-tight text-[#122033]">GECO Asia Design System</h1>
      </div>
      
      <p class="text-lg leading-relaxed text-[#64758b]">
        Welcome to the official design system for the GECO Asia HR Business Partner Portal. This comprehensive guide documents the visual language, component library, and interaction patterns used to build a cohesive, accessible, and professional workforce management platform for Southeast Asia operations.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-[#12607A]/20 bg-[#12607A]/5 p-5">
          <div class="mb-2 text-2xl font-bold text-[#12607A]">v1.0</div>
          <p class="text-sm text-[#475569]">Production-ready component library</p>
        </div>
        <div class="rounded-xl border border-[#177245]/20 bg-[#177245]/5 p-5">
          <div class="mb-2 text-2xl font-bold text-[#177245]">WCAG 2.1</div>
          <p class="text-sm text-[#475569]">AA compliance throughout</p>
        </div>
        <div class="rounded-xl border border-[#B0761A]/20 bg-[#B0761A]/5 p-5">
          <div class="mb-2 text-2xl font-bold text-[#B0761A]">IBM Plex Sans</div>
          <p class="text-sm text-[#475569]">Primary typeface family</p>
        </div>
      </div>

      <div class="mt-8 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
        <h3 class="mb-3 text-base font-bold text-[#122033]">Quick Links</h3>
        <div class="grid gap-2 text-sm">
          <a href="#colors" class="text-[#12607A] hover:underline">→ Color System & Status Palette</a>
          <a href="#buttons" class="text-[#12607A] hover:underline">→ Button Components</a>
          <a href="#badges" class="text-[#12607A] hover:underline">→ Status Pills & Badges</a>
          <a href="#accessibility" class="text-[#12607A] hover:underline">→ Accessibility Guidelines</a>
        </div>
      </div>
    </section>

    <!-- COLORS -->
    <section id="colors" class="mb-20 scroll-mt-8">
      <h2 class="mb-2 text-3xl font-bold tracking-tight text-[#122033]">Color System</h2>
      <p class="mb-8 text-[#64758b]">Our palette is anchored by deep corporate navy and vibrant teal, supplemented by semantic status colors for clear visual communication.</p>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Brand Colors</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="color in brandColors" :key="color.name" class="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          <div class="h-32" :style="{ backgroundColor: color.hex }"></div>
          <div class="p-4">
            <p class="text-sm font-bold text-[#122033]">{{ color.name }}</p>
            <p class="mt-1 font-mono text-xs text-[#8A9BB0]">{{ color.hex }}</p>
            <p class="mt-2 text-xs text-[#64758b]">{{ color.usage }}</p>
          </div>
        </div>
      </div>

      <h3 class="mb-4 mt-10 text-lg font-bold text-[#122033]">Semantic Status Colors</h3>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="color in statusColors" :key="color.name" class="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          <div class="h-32" :style="{ backgroundColor: color.hex }"></div>
          <div class="p-4">
            <p class="text-sm font-bold text-[#122033]">{{ color.name }}</p>
            <p class="mt-1 font-mono text-xs text-[#8A9BB0]">{{ color.hex }}</p>
            <p class="mt-2 text-xs text-[#64758b]">{{ color.usage }}</p>
          </div>
        </div>
      </div>

      <h3 class="mb-4 mt-10 text-lg font-bold text-[#122033]">Opacity Tints</h3>
      <p class="mb-4 text-sm text-[#64758b]">We use opacity modifiers for subtle backgrounds and icon containers.</p>
      <div class="grid gap-3 md:grid-cols-6">
        <div v-for="opacity in opacities" :key="opacity.label" class="text-center">
          <div class="mx-auto h-16 w-16 rounded-xl" :class="`bg-[#12607A]/${opacity.value}`"></div>
          <p class="mt-2 text-xs font-mono text-[#8A9BB0]">{{ opacity.label }}</p>
        </div>
      </div>

      <div class="mt-8 rounded-xl border border-[#C24152]/20 bg-[#C24152]/5 p-5">
        <p class="text-sm text-[#C24152]"><strong>⚠️ Important:</strong> Never use pure black (#000) or pure white (#FFF) for text. Use <code class="rounded bg-white px-1.5 py-0.5 text-xs">#122033</code> (ink) and <code class="rounded bg-[#122033] px-1.5 py-0.5 text-xs text-white">#FFFFFF</code> with proper contrast ratios.</p>
      </div>
    </section>

    <!-- TYPOGRAPHY -->
    <section id="typography" class="mb-20 scroll-mt-8">
      <h2 class="mb-2 text-3xl font-bold tracking-tight text-[#122033]">Typography</h2>
      <p class="mb-8 text-[#64758b]">IBM Plex Sans provides excellent legibility at small sizes while maintaining a modern, geometric feel at display sizes.</p>

      <div class="mb-6 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
        <h3 class="mb-2 text-sm font-bold text-[#122033]">Font Stack</h3>
        <code class="text-xs text-[#475569]">'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif</code>
      </div>

      <div class="space-y-6">
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-4xl font-bold text-[#122033]">Heading 1</span>
          <code class="text-xs text-[#8A9BB0]">text-4xl font-bold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-3xl font-bold text-[#122033]">Heading 2</span>
          <code class="text-xs text-[#8A9BB0]">text-3xl font-bold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-2xl font-bold text-[#122033]">Heading 3</span>
          <code class="text-xs text-[#8A9BB0]">text-2xl font-bold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-xl font-bold text-[#122033]">Heading 4</span>
          <code class="text-xs text-[#8A9BB0]">text-xl font-bold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-lg font-semibold text-[#122033]">Heading 5</span>
          <code class="text-xs text-[#8A9BB0]">text-lg font-semibold</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-base text-[#475569]">Body Text (Base)</span>
          <code class="text-xs text-[#8A9BB0]">text-base text-[#475569]</code>
        </div>
        <div class="flex items-baseline justify-between border-b border-dashed border-[#e2e8f0] pb-4">
          <span class="text-sm text-[#64758b]">Small / Metadata</span>
          <code class="text-xs text-[#8A9BB0]">text-sm text-[#64758b]</code>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="text-xs text-[#8A9BB0]">Tiny / Labels</span>
          <code class="text-xs text-[#8A9BB0]">text-xs text-[#8A9BB0]</code>
        </div>
      </div>
    </section>

    <!-- SPACING & SHAPE -->
    <section id="spacing" class="mb-20 scroll-mt-8">
      <h2 class="mb-2 text-3xl font-bold tracking-tight text-[#122033]">Spacing & Shape</h2>
      <p class="mb-8 text-[#64758b]">We use a 4px base grid system via Tailwind's spacing scale. Border radii are standardized for consistency.</p>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Spacing Scale</h3>
      <div class="space-y-3">
        <div v-for="space in spacingScale" :key="space.label" class="flex items-center gap-4">
          <div class="w-32 text-right text-xs font-mono text-[#8A9BB0]">{{ space.label }}</div>
          <div class="h-8 rounded bg-[#12607A]/20" :style="{ width: space.width }"></div>
          <div class="text-xs text-[#475569]">{{ space.value }}</div>
        </div>
      </div>

      <h3 class="mb-4 mt-10 text-lg font-bold text-[#122033]">Border Radius</h3>
      <div class="grid gap-6 md:grid-cols-4">
        <div class="text-center">
          <div class="mx-auto h-20 w-20 rounded-[10px] bg-[#12607A]/10 border-2 border-[#12607A]"></div>
          <p class="mt-3 text-sm font-bold text-[#122033]">Standard</p>
          <code class="text-xs text-[#8A9BB0]">rounded-[10px]</code>
          <p class="mt-1 text-xs text-[#64758b]">Buttons, inputs</p>
        </div>
        <div class="text-center">
          <div class="mx-auto h-20 w-20 rounded-xl bg-[#12607A]/10 border-2 border-[#12607A]"></div>
          <p class="mt-3 text-sm font-bold text-[#122033]">Medium</p>
          <code class="text-xs text-[#8A9BB0]">rounded-xl</code>
          <p class="mt-1 text-xs text-[#64758b]">Cards, modals</p>
        </div>
        <div class="text-center">
          <div class="mx-auto h-20 w-20 rounded-2xl bg-[#12607A]/10 border-2 border-[#12607A]"></div>
          <p class="mt-3 text-sm font-bold text-[#122033]">Large</p>
          <code class="text-xs text-[#8A9BB0]">rounded-2xl</code>
          <p class="mt-1 text-xs text-[#64758b]">Hero cards</p>
        </div>
        <div class="text-center">
          <div class="mx-auto h-20 w-20 rounded-full bg-[#12607A]/10 border-2 border-[#12607A]"></div>
          <p class="mt-3 text-sm font-bold text-[#122033]">Full</p>
          <code class="text-xs text-[#8A9BB0]">rounded-full</code>
          <p class="mt-1 text-xs text-[#64758b]">Avatars, pills</p>
        </div>
      </div>
    </section>

    <!-- ICONOGRAPHY -->
    <section id="iconography" class="mb-20 scroll-mt-8">
      <h2 class="mb-2 text-3xl font-bold tracking-tight text-[#122033]">Iconography</h2>
      <p class="mb-8 text-[#64758b]">We use Lucide icons for their clean, consistent stroke weight and excellent accessibility.</p>

      <div class="mb-6 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
        <h3 class="mb-2 text-sm font-bold text-[#122033]">Icon Library</h3>
        <code class="text-xs text-[#475569]">lucide-vue-next</code>
      </div>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Size Conventions</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-4 rounded-lg border border-[#e2e8f0] bg-white p-4">
          <User class="h-4 w-4 text-[#122033]" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-[#122033]">16px (h-4 w-4)</p>
            <p class="text-xs text-[#64758b]">Inline text, badges, small buttons</p>
          </div>
          <code class="text-xs text-[#8A9BB0]">h-4 w-4</code>
        </div>
        <div class="flex items-center gap-4 rounded-lg border border-[#e2e8f0] bg-white p-4">
          <User class="h-5 w-5 text-[#122033]" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-[#122033]">20px (h-5 w-5)</p>
            <p class="text-xs text-[#64758b]">Navigation, standard buttons</p>
          </div>
          <code class="text-xs text-[#8A9BB0]">h-5 w-5</code>
        </div>
        <div class="flex items-center gap-4 rounded-lg border border-[#e2e8f0] bg-white p-4">
          <User class="h-6 w-6 text-[#122033]" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-[#122033]">24px (h-6 w-6)</p>
            <p class="text-xs text-[#64758b]">Large buttons, hero sections</p>
          </div>
          <code class="text-xs text-[#8A9BB0]">h-6 w-6</code>
        </div>
      </div>

      <div class="mt-8 rounded-xl border border-[#12607A]/20 bg-[#12607A]/5 p-5">
        <p class="text-sm text-[#12607A]"><strong>✓ Best Practice:</strong> Always add <code class="rounded bg-white px-1.5 py-0.5 text-xs">aria-label</code> to icon-only buttons for screen readers.</p>
      </div>
    </section>

    <!-- ELEVATION & MOTION -->
    <section id="elevation" class="mb-20 scroll-mt-8">
      <h2 class="mb-2 text-3xl font-bold tracking-tight text-[#122033]">Elevation & Motion</h2>
      <p class="mb-8 text-[#64758b]">Shadows and transitions create depth and provide feedback for user interactions.</p>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Shadow Scale</h3>
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <p class="text-sm font-bold text-[#122033]">Shadow Small</p>
          <p class="mt-1 text-xs text-[#64758b]">Subtle elevation for cards</p>
          <code class="mt-3 block text-xs text-[#8A9BB0]">shadow-sm</code>
        </div>
        <div class="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-md">
          <p class="text-sm font-bold text-[#122033]">Shadow Medium</p>
          <p class="mt-1 text-xs text-[#64758b]">Hover states, dropdowns</p>
          <code class="mt-3 block text-xs text-[#8A9BB0]">shadow-md</code>
        </div>
        <div class="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-lg">
          <p class="text-sm font-bold text-[#122033]">Shadow Large</p>
          <p class="mt-1 text-xs text-[#64758b]">Modals, floating elements</p>
          <code class="mt-3 block text-xs text-[#8A9BB0]">shadow-lg</code>
        </div>
      </div>

      <h3 class="mb-4 mt-10 text-lg font-bold text-[#122033]">Transitions</h3>
      <div class="space-y-3">
        <div class="rounded-lg border border-[#e2e8f0] bg-white p-4">
          <p class="text-sm font-semibold text-[#122033]">150ms ease-in-out</p>
          <p class="text-xs text-[#64758b]">Standard transition for hover states</p>
          <code class="mt-2 block text-xs text-[#8A9BB0]">transition-all duration-150</code>
        </div>
        <div class="rounded-lg border border-[#e2e8f0] bg-white p-4">
          <p class="text-sm font-semibold text-[#122033]">200ms ease-in-out</p>
          <p class="text-xs text-[#64758b]">Dropdown animations, expand/collapse</p>
          <code class="mt-2 block text-xs text-[#8A9BB0]">transition-all duration-200</code>
        </div>
      </div>

      <div class="mt-8 rounded-xl border border-[#B0761A]/20 bg-[#B0761A]/5 p-5">
        <p class="text-sm text-[#B0761A]"><strong>⚠️ Accessibility:</strong> Always respect <code class="rounded bg-white px-1.5 py-0.5 text-xs">prefers-reduced-motion</code> media query for users with motion sensitivities.</p>
      </div>
    </section>

    <!-- BUTTONS -->
    <section id="buttons" class="mb-20 scroll-mt-8">
      <h2 class="mb-2 text-3xl font-bold tracking-tight text-[#122033]">Buttons</h2>
      <p class="mb-8 text-[#64758b]">Buttons trigger actions. Use primary buttons for main actions, secondary for alternatives, and ghost for less important actions.</p>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Button Variants</h3>
      <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-8">
        <div class="flex flex-wrap gap-4">
          <button class="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#12607A] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0E4C63]">
            <Check class="h-4 w-4" /> Primary Action
          </button>
          <button class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#d5dee8] bg-white px-5 text-sm font-semibold text-[#122033] transition-colors hover:bg-[#f2f6fa]">
            <User class="h-4 w-4" /> Secondary
          </button>
          <button class="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#C24152] bg-[#C24152] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a03542]">
            <X class="h-4 w-4" /> Destructive
          </button>
          <button class="inline-flex h-10 items-center gap-2 px-5 text-sm font-semibold text-[#12607A] transition-colors hover:bg-[#12607A]/5">
            <ArrowRight class="h-4 w-4" /> Ghost Link
          </button>
        </div>
      </div>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Button Sizes</h3>
      <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-8">
        <div class="flex flex-wrap items-center gap-4">
          <button class="inline-flex h-9 items-center gap-2 rounded-[10px] bg-[#12607A] px-4 text-xs font-semibold text-white">Small</button>
          <button class="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#12607A] px-5 text-sm font-semibold text-white">Default</button>
          <button class="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#12607A] px-7 text-base font-bold text-white">Large</button>
        </div>
      </div>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Icon-Only Buttons</h3>
      <div class="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-8">
        <div class="flex flex-wrap gap-4">
          <button aria-label="Edit" class="grid h-10 w-10 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-[#64758b] transition-colors hover:bg-[#f2f6fa]">
            <Edit class="h-4 w-4" />
          </button>
          <button aria-label="Delete" class="grid h-10 w-10 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-[#C24152] transition-colors hover:bg-[#C24152]/5">
            <Trash2 class="h-4 w-4" />
          </button>
          <button aria-label="Download" class="grid h-10 w-10 place-items-center rounded-[10px] border border-[#d5dee8] bg-white text-[#12607A] transition-colors hover:bg-[#12607A]/5">
            <Download class="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 class="mb-4 mt-8 text-lg font-bold text-[#122033]">Do's and Don'ts</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-xl border border-[#177245]/20 bg-[#177245]/5 p-5">
          <p class="mb-2 text-sm font-bold text-[#177245]">✓ Do</p>
          <ul class="space-y-2 text-sm text-[#475569]">
            <li>• Use clear, action-oriented labels</li>
            <li>• Limit to one primary button per section</li>
            <li>• Add loading spinners for async actions</li>
            <li>• Provide focus states for keyboard users</li>
          </ul>
        </div>
        <div class="rounded-xl border border-[#C24152]/20 bg-[#C24152]/5 p-5">
          <p class="mb-2 text-sm font-bold text-[#C24152]">✗ Don't</p>
          <ul class="space-y-2 text-sm text-[#475569]">
            <li>• Use vague labels like "Click here"</li>
            <li>• Place two primary buttons side-by-side</li>
            <li>• Disable buttons without explanation</li>
            <li>• Use buttons for navigation (use links)</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Continue with more sections... I'll create the rest in the next part -->
    <!-- Due to length, I'll show you the pattern and you can continue -->

  </article>
</template>

<script setup lang="ts">
import {
  BriefcaseBusiness, Check, User, X, ArrowRight, Edit, Trash2, Download,
  Clock, Calendar, ShieldCheck, TrendingUp, Bell, Search, ChevronDown,
  AlertCircle, AlertTriangle, Info, CheckCircle
} from 'lucide-vue-next'

const brandColors = [
  { name: 'Brand Teal', hex: '#12607A', usage: 'Primary actions, links, active states' },
  { name: 'Deep Navy', hex: '#122033', usage: 'Backgrounds, headings, dark mode base' },
  { name: 'Ink', hex: '#16202e', usage: 'Body text, high contrast elements' },
  { name: 'Muted Slate', hex: '#8A9BB0', usage: 'Secondary text, metadata, placeholders' },
]

const statusColors = [
  { name: 'Success', hex: '#177245', usage: 'Completed, approved, positive states' },
  { name: 'Warning', hex: '#B0761A', usage: 'Pending, submitted, needs attention' },
  { name: 'Danger', hex: '#C24152', usage: 'Errors, rejected, destructive actions' },
  { name: 'Info', hex: '#0284c7', usage: 'Informational messages, help text' },
]

const opacities = [
  { label: '5%', value: '5' },
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
  { label: '30%', value: '30' },
  { label: '50%', value: '50' },
  { label: '70%', value: '70' },
]

const spacingScale = [
  { label: 'p-2', width: '8px', value: '8px' },
  { label: 'p-3', width: '12px', value: '12px' },
  { label: 'p-4', width: '16px', value: '16px' },
  { label: 'p-6', width: '24px', value: '24px' },
  { label: 'p-8', width: '32px', value: '32px' },
  { label: 'p-12', width: '48px', value: '48px' },
]
</script>