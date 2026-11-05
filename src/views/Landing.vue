<template>
  <div class="min-h-screen bg-white text-[#122033]" style="font-family: 'IBM Plex Sans', sans-serif;">

    <!-- ===== Navbar ===== -->
    <header class="sticky top-0 z-40 border-b border-white/10 bg-[#122033]/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <router-link to="/landing" class="flex items-center gap-2.5">
          <div class="grid h-9 w-9 place-items-center rounded-xl bg-[#12607A] text-white">
            <BriefcaseBusiness class="h-4.5 w-4.5 h-5 w-5" />
          </div>
          <span class="text-lg font-bold text-white">HR Asia</span>
        </router-link>

        <nav class="hidden items-center gap-8 text-sm font-medium text-white/70 lg:flex">
          <a href="#features" class="transition-colors hover:text-white">Why HR Asia</a>
          <a href="#platform" class="transition-colors hover:text-white">Platform</a>
          <a href="#solutions" class="transition-colors hover:text-white">Solutions</a>
          <a href="#testimonials" class="transition-colors hover:text-white">Testimonials</a>
        </nav>

        <div class="flex items-center gap-3">
          <router-link to="/login" class="rounded-[10px] border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
            Sign in
          </router-link>
          <router-link to="/login" class="hidden rounded-[10px] bg-[#12607A] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#12607A]/30 transition-colors hover:bg-[#0E4C63] sm:block">
            Get Started
          </router-link>
        </div>
      </div>
    </header>

    <!-- ===== Hero ===== -->
    <section class="relative overflow-hidden bg-[#122033] pb-40 pt-24 text-white">
      <!-- Grid pattern -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 44px 44px;"></div>
      <!-- Glow blobs -->
      <div class="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#12607A]/25 blur-[120px]"></div>
      <div class="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#177245]/15 blur-[120px]"></div>

      <div class="relative mx-auto max-w-4xl px-6 text-center">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
          <Sparkles class="h-3.5 w-3.5 text-[#5EB1D6]" /> HR Workforce Platform · Southeast Asia
        </span>
        <h1 class="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Save Hours with our<br class="hidden sm:block" />
          All-in-One HR Workforce Software
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          From configurable offboarding checklists to time & leave approvals and asset tracking — HR Asia helps HR Business Partners run seamless workforce cycles with zero spreadsheet chaos.
        </p>
        <div class="mt-9 flex flex-wrap items-center justify-center gap-4">
          <router-link to="/login" class="inline-flex h-12 items-center rounded-[10px] bg-[#12607A] px-7 text-base font-bold text-white shadow-xl shadow-[#12607A]/40 transition-all hover:bg-[#0E4C63]">
            Try the Portal <ArrowRight class="h-5 w-12" />
          </router-link>
        </div>
      </div>

      <!-- Floating Dashboard Mockup -->
      <div class="relative mx-auto mt-16 max-w-5xl px-6">
        <div class="overflow-hidden rounded-2xl border border-white/10 bg-white text-left shadow-2xl shadow-black/40">
          <!-- Window chrome -->
          <div class="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-3">
            <div class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-[#C24152]/70"></span>
              <span class="h-3 w-3 rounded-full bg-[#B0761A]/70"></span>
              <span class="h-3 w-3 rounded-full bg-[#177245]/70"></span>
            </div>
            <span class="text-xs font-semibold text-[#8A9BB0]">GECO HR Portal — Dashboard</span>
            <div class="flex items-center gap-2">
              <div class="grid h-6 w-6 place-items-center rounded-full bg-[#12607A] text-[10px] font-bold text-white">TA</div>
            </div>
          </div>

          <div class="flex">
            <!-- Mock sidebar -->
            <div class="hidden w-44 flex-shrink-0 border-r border-[#e2e8f0] bg-[#f8fafc] p-4 sm:block">
              <div v-for="(item, i) in mockNav" :key="item" class="mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold" :class="i === 0 ? 'bg-[#12607A]/10 text-[#12607A]' : 'text-[#8A9BB0]'">
                <span class="h-1.5 w-1.5 rounded-full" :class="i === 0 ? 'bg-[#12607A]' : 'bg-[#cbd5e1]'"></span>
                {{ item }}
              </div>
            </div>

            <!-- Mock main -->
            <div class="flex-1 p-5">
              <!-- Metric cards -->
              <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div v-for="m in mockMetrics" :key="m.label" class="rounded-xl border border-[#e2e8f0] p-3">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-semibold text-[#8A9BB0]">{{ m.label }}</span>
                    <span class="text-[9px] font-bold" :class="m.trendUp ? 'text-[#177245]' : 'text-[#C24152]'">{{ m.trend }}</span>
                  </div>
                  <p class="mt-1 text-xl font-bold text-[#122033]">{{ m.value }}</p>
                </div>
              </div>

              <!-- Chart + table -->
              <div class="mt-4 grid gap-3 lg:grid-cols-5">
                <div class="rounded-xl border border-[#e2e8f0] p-4 lg:col-span-3">
                  <p class="mb-3 text-[10px] font-semibold text-[#8A9BB0]">Offboarding analytics</p>
                  <div class="flex h-24 items-end gap-2">
                    <div v-for="(h, i) in mockBars" :key="i" class="flex-1 rounded-t-md bg-gradient-to-t from-[#12607A] to-[#5EB1D6]" :style="{ height: h + '%' , opacity: 0.55 + (i % 4) * 0.15 }"></div>
                  </div>
                </div>
                <div class="rounded-xl border border-[#e2e8f0] p-4 lg:col-span-2">
                  <p class="mb-3 text-[10px] font-semibold text-[#8A9BB0]">Recent offboardings</p>
                  <div v-for="r in mockRows" :key="r.name" class="mb-2 flex items-center justify-between">
                    <span class="text-[11px] font-semibold text-[#122033]">{{ r.name }}</span>
                    <span class="rounded-full px-2 py-0.5 text-[9px] font-bold" :class="r.pill">{{ r.status }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Logo Cloud ===== -->
    <section class="border-b border-[#e2e8f0] bg-white py-14">
      <p class="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8A9BB0]">Trusted by HR teams across Southeast Asia</p>
      <div class="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-6 px-6 sm:grid-cols-4">
        <span v-for="logo in clientLogos" :key="logo" class="text-center text-lg font-bold tracking-tight text-[#94a3b8] transition-colors hover:text-[#122033]">{{ logo }}</span>
      </div>
    </section>

    <!-- ===== Feature 1: Checklist ===== -->
    <section id="features" class="scroll-mt-20 bg-[#f8fafc] py-24">
      <div class="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Run offboarding exactly<br />the way your policy demands.
          </h2>
          <p class="mt-5 text-base leading-relaxed text-[#64758b]">
            Build configurable requirement templates with nested sub-requirements, instructions, and reference URLs. Every checklist adapts to the consultant's role, client, and region.
          </p>
          <ul class="mt-8 space-y-4">
            <li v-for="f in featureOneList" :key="f" class="flex items-start gap-3">
              <span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[#12607A]/10 text-[#12607A]">
                <Check class="h-3.5 w-3.5" />
              </span>
              <span class="text-sm font-medium text-[#334155]">{{ f }}</span>
            </li>
          </ul>
          <router-link to="/login" class="mt-9 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#12607A] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0E4C63]">
            Learn More <ArrowRight class="h-4 w-4" />
          </router-link>
        </div>

        <!-- Checklist mockup -->
        <div class="space-y-4">
          <div class="rounded-2xl border border-[#177245]/30 bg-[#177245]/5 p-5 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[#177245] text-white"><Check class="h-3.5 w-3.5" /></span>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-[#122033]">Pending Expense Reconciliation</h4>
                <p class="mt-1 text-xs leading-relaxed text-[#64758b]">Review expenses from the last 60 days and comment on disputed reimbursements.</p>
              </div>
              <span class="text-[10px] font-bold text-[#177245]">Completed</span>
            </div>
          </div>
          <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div class="flex items-start gap-4">
              <span class="mt-0.5 h-6 w-6 flex-none rounded-full border-2 border-[#d5dee8]"></span>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-[#122033]">Client Confirmation with Signature</h4>
                <p class="mt-1 text-xs leading-relaxed text-[#64758b]">Request the PM confirmation letter and upload the signed document.</p>
                <div class="mt-3 flex gap-2">
                  <span class="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-semibold text-[#64758b]">📎 2 files</span>
                  <span class="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-[10px] font-semibold text-[#64758b]">🔗 Reference URL</span>
                </div>
              </div>
              <span class="text-[10px] font-bold text-[#B0761A]">Pending</span>
            </div>
          </div>
          <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[#8A9BB0]">Checklist progress</span>
              <span class="text-xs font-bold text-[#12607A]">68%</span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
              <div class="h-full w-[68%] rounded-full bg-[#12607A]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Feature 2: Time & Leave ===== -->
    <section id="platform" class="scroll-mt-20 bg-white py-24">
      <div class="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <!-- Mockup first on desktop -->
        <div class="order-2 lg:order-1">
          <div class="relative">
            <div class="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl">
              <div class="border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-3 text-xs font-bold text-[#64758b]">Time & Leave — Approvals</div>
              <div class="divide-y divide-[#f1f5f9]">
                <div v-for="row in approvalRows" :key="row.name" class="flex items-center justify-between px-5 py-4">
                  <div>
                    <p class="text-sm font-bold text-[#122033]">{{ row.name }}</p>
                    <p class="text-[11px] text-[#8A9BB0]">{{ row.detail }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="rounded-full px-2.5 py-1 text-[10px] font-bold" :class="row.pill">{{ row.status }}</span>
                    <span class="grid h-7 w-7 place-items-center rounded-full bg-[#177245]/10 text-[#177245]"><Check class="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Floating badge -->
            <div class="absolute -right-4 -top-5 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-lg">
              <p class="text-[10px] font-semibold text-[#8A9BB0]">Cycle time</p>
              <p class="text-lg font-bold text-[#177245]">−38%</p>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <h2 class="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Get faster, easier time & leave approvals, all in one place
          </h2>
          <p class="mt-5 text-base leading-relaxed text-[#64758b]">
            Consultants submit timesheets from the portal; HRBPs approve, reject with reasons, or revert — with built-in exit-criteria validators that block archiving until every timesheet before the Last Working Day is approved.
          </p>
          <ul class="mt-8 space-y-4">
            <li v-for="f in featureTwoList" :key="f" class="flex items-start gap-3">
              <span class="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[#12607A]/10 text-[#12607A]"><Check class="h-3.5 w-3.5" /></span>
              <span class="text-sm font-medium text-[#334155]">{{ f }}</span>
            </li>
          </ul>
          <router-link to="/login" class="mt-9 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#12607A] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0E4C63]">
            Learn More <ArrowRight class="h-4 w-4" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===== Testimonials ===== -->
    <section id="testimonials" class="scroll-mt-20 bg-[#f8fafc] py-24">
      <div class="mx-auto max-w-3xl px-6 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Testimonials</h2>
        <p class="mt-4 text-sm text-[#64758b]">Hear from the HR Business Partners running Southeast Asia operations on GECO.</p>

        <div class="relative mt-12">
          <div class="rounded-2xl border border-[#e2e8f0] bg-white p-10 shadow-sm">
            <Quote class="mx-auto h-8 w-8 text-[#12607A]/30" />
            <p class="mt-6 text-base leading-relaxed text-[#334155]">"{{ testimonials[activeT].quote }}"</p>
            <div class="mt-8 flex items-center justify-center gap-3">
              <div class="grid h-11 w-11 place-items-center rounded-full bg-[#12607A] text-sm font-bold text-white">{{ testimonials[activeT].initials }}</div>
              <div class="text-left">
                <p class="text-sm font-bold text-[#122033]">{{ testimonials[activeT].name }}</p>
                <p class="text-xs text-[#8A9BB0]">{{ testimonials[activeT].role }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-center gap-3">
            <button type="button" aria-label="Previous testimonial" class="grid h-9 w-9 place-items-center rounded-full border border-[#d5dee8] bg-white text-[#64758b] transition-colors hover:bg-[#f2f6fa]" @click="prevT">
              <ChevronLeft class="h-4 w-4" />
            </button>
            <div class="flex gap-1.5">
              <button v-for="(t, i) in testimonials" :key="t.name" type="button" :aria-label="'Go to testimonial ' + (i + 1)" class="h-2 rounded-full transition-all" :class="i === activeT ? 'w-6 bg-[#12607A]' : 'w-2 bg-[#cbd5e1]'" @click="activeT = i"></button>
            </div>
            <button type="button" aria-label="Next testimonial" class="grid h-9 w-9 place-items-center rounded-full border border-[#d5dee8] bg-white text-[#64758b] transition-colors hover:bg-[#f2f6fa]" @click="nextT">
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Speedy Solutions ===== -->
    <section id="solutions" class="scroll-mt-20 bg-white py-24">
      <div class="mx-auto max-w-6xl px-6 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Speedy Solutions</h2>
        <p class="mx-auto mt-4 max-w-xl text-sm text-[#64758b]">Purpose-built modules that remove the busywork from every workforce cycle.</p>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div v-for="s in solutions" :key="s.title" class="rounded-2xl border border-[#e2e8f0] bg-white p-7 text-left shadow-sm transition-shadow hover:shadow-md">
            <div class="grid h-11 w-11 place-items-center rounded-xl" :class="s.iconBg">
              <component :is="s.icon" class="h-5 w-5" :class="s.iconColor" />
            </div>
            <h3 class="mt-5 text-base font-bold text-[#122033]">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#64758b]">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA Banner ===== -->
    <section class="bg-white pb-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="relative overflow-hidden rounded-3xl bg-[#12607A] px-8 py-16 text-center text-white shadow-2xl shadow-[#12607A]/30">
          <div class="pointer-events-none absolute inset-0 opacity-10" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 36px 36px;"></div>
          <h2 class="relative text-3xl font-bold tracking-tight sm:text-4xl">Sign in to your HR workspace today!</h2>
          <p class="relative mx-auto mt-4 max-w-xl text-sm text-white/80">Join the HRBPs and consultants already running seamless offboarding, onboarding, and time tracking on GECO Asia.</p>
          <div class="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <router-link to="/login" class="inline-flex h-12 items-center rounded-[10px] bg-white px-7 text-sm font-bold text-[#12607A] transition-colors hover:bg-[#e4eef6]">Start Now</router-link>
            <router-link to="/login" class="inline-flex h-12 items-center rounded-[10px] border border-white/40 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10">Talk with Experts</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Footer ===== -->
    <footer class="bg-[#122033] pb-10 pt-16 text-white/60">
      <div class="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-6">
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2.5">
            <div class="grid h-9 w-9 place-items-center rounded-xl bg-[#12607A] text-white"><BriefcaseBusiness class="h-5 w-5" /></div>
            <span class="text-lg font-bold text-white">GECO Asia</span>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-relaxed">The HR Business Partner Portal for seamless offboarding, onboarding, and workforce operations across Southeast Asia.</p>
          <div class="mt-6 flex gap-3">
            <a v-for="s in socials" :key="s.label" href="#" :aria-label="s.label" class="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
              <component :is="s.icon" class="h-4 w-4" />
            </a>
          </div>
        </div>

        <div v-for="col in footerCols" :key="col.title">
          <h4 class="text-sm font-bold text-white">{{ col.title }}</h4>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li v-for="link in col.links" :key="link">
              <a href="#" class="transition-colors hover:text-white">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mx-auto mt-14 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 pt-6 text-xs">
        <p>© 2026 GECO Asia. All rights reserved.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white">Cookies</a>
          <a href="#" class="hover:text-white">Privacy Policy</a>
          <a href="#" class="hover:text-white">Terms of Conditions</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BriefcaseBusiness, ArrowRight, Check, Sparkles, Quote,
  ChevronLeft, ChevronRight, ShieldCheck, Clock, TrendingUp,
  Linkedin, Twitter, Facebook, Instagram,
} from 'lucide-vue-next'

// ----- Hero mock data -----
const mockNav = ['Dashboard', 'Consultants', 'Offboarding', 'Onboarding', 'Time & Leave', 'Assets']
const mockMetrics = [
  { label: 'Total Consultants', value: '300', trend: '+12%', trendUp: true },
  { label: 'Active Offboardings', value: '24', trend: '+4%', trendUp: true },
  { label: 'Pending Approvals', value: '8', trend: '−2', trendUp: false },
  { label: 'Assets Tracked', value: '156', trend: '+9%', trendUp: true },
]
const mockBars = [42, 68, 55, 82, 60, 74, 66, 92, 70, 86, 58, 78]
const mockRows = [
  { name: 'Kyay Mon', status: 'In Progress', pill: 'bg-[#12607A]/10 text-[#12607A]' },
  { name: 'Priya Nair', status: 'Approved', pill: 'bg-[#177245]/10 text-[#177245]' },
  { name: 'Daniel Ong', status: 'Pending', pill: 'bg-[#B0761A]/10 text-[#B0761A]' },
]

// ----- Logo cloud -----
const clientLogos = ['SONY', 'P&G', 'Shopee', 'Grab', 'Lazada', 'Traveloka', 'Astra', 'GoTo']

// ----- Features -----
const featureOneList = [
  'Configurable requirement templates with nested sub-requirements',
  'Multi-file uploads with instructions and reference URLs',
  'Enable, disable, and delete controls per requirement',
  'Read-only, tamper-proof archives for completed records',
]
const featureTwoList = [
  'Consultant self-service timesheet & leave submission',
  'One-click approve, reject-with-reason, and revert flows',
  'Exit-criteria validators that block premature archiving',
  'Unified CSV exports for payroll and compliance reporting',
]
const approvalRows = [
  { name: 'Kyay Mon', detail: 'Timesheet · Oct 23 – Nov 6 · 80 hrs', status: 'Submitted', pill: 'bg-[#B0761A]/10 text-[#B0761A]' },
  { name: 'Angela Reyes', detail: 'Sick leave · Nov 1 – Nov 3', status: 'Approved', pill: 'bg-[#177245]/10 text-[#177245]' },
  { name: 'Daniel Ong', detail: 'Timesheet · Nov 6 – Nov 19 · 40 hrs', status: 'Draft', pill: 'bg-[#E4EEF6] text-[#122033]' },
]

// ----- Testimonials -----
const testimonials = [
  { quote: 'GECO cut our offboarding cycle time by more than a third. The exit-criteria validator alone has saved us from countless compliance gaps.', name: 'Tricia Almodiente', role: 'HRBP, Southeast Asia', initials: 'TA' },
  { quote: 'The configurable checklists mean every client engagement follows the exact policy it needs — no more copy-pasted spreadsheet templates.', name: 'Mika Santos', role: 'Senior HR Operations', initials: 'MS' },
  { quote: 'As a consultant, submitting timesheets and tracking my offboarding tasks from one portal is effortless. Everything I need is right there.', name: 'Kyay Mon', role: 'Senior Business Analyst', initials: 'KM' },
]
const activeT = ref(0)
function nextT() { activeT.value = (activeT.value + 1) % testimonials.length }
function prevT() { activeT.value = (activeT.value - 1 + testimonials.length) % testimonials.length }

// ----- Solutions -----
const solutions = [
  { title: 'Compliance on autopilot', desc: 'Validators and read-only archives keep every completed offboarding audit-ready and tamper-proof.', icon: ShieldCheck, iconBg: 'bg-[#12607A]/10', iconColor: 'text-[#12607A]' },
  { title: 'Save 5 hours per cycle', desc: 'Automated checklists, approvals, and CSV exports remove the manual busywork from every workforce cycle.', icon: Clock, iconBg: 'bg-[#C24152]/10', iconColor: 'text-[#C24152]' },
  { title: 'Scales with your business', desc: 'From 10 to 1,000 consultants across regions — one portal, one source of truth, zero spreadsheet chaos.', icon: TrendingUp, iconBg: 'bg-[#177245]/10', iconColor: 'text-[#177245]' },
]

// ----- Footer -----
const socials = [
  { label: 'Twitter', icon: Twitter },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'Facebook', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
]
const footerCols = [
  { title: 'Product', links: ['Offboarding', 'Onboarding', 'Time & Leave', 'Assets & Access', 'Analytics'] },
  { title: 'Company', links: ['About', 'Careers', 'Newsroom', 'Contact'] },
  { title: 'Resources', links: ['Help Center', 'Style Guide', 'Business Guides', 'FAQs'] },
  { title: 'Support', links: ['Talk to HR Ops', 'Partner Directory', 'Sign in'] },
]
</script>