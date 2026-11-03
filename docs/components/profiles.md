
---

### Step 4: Create `docs/components/profiles.md`
Create this file and paste this **exact** content:

```markdown
# Profile Components

The Consultant Offboarding Profile is the central hub for HR and Consultants. It combines identity, metrics, and actionable checklists.

## Info Card & Detail Grid
```html
<section class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
  <div class="flex flex-wrap items-start justify-between gap-6">
    <!-- Avatar & Identity -->
    <div class="flex items-start gap-[18px]">
      <div class="grid h-[72px] w-[72px] flex-none place-items-center rounded-full bg-brand text-2xl font-semibold tracking-[.02em] text-white">PN</div>
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="text-2xl font-semibold leading-tight text-ink">Priya Nair</h2>
          <span class="inline-flex items-center rounded-pill bg-[#0E5A8C] px-2.5 py-1 text-xs font-medium text-white">In Progress</span>
        </div>
        <p class="mt-1.5 text-[14.5px] leading-snug text-[#64758b]">OB-24094 · Payroll Specialist</p>
      </div>
    </div>
    
    <!-- Lifecycle Actions -->
    <div class="flex flex-wrap gap-3">
      <button class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-[rgba(179,55,63,.45)] bg-white px-[18px] text-[14.5px] font-medium text-[#B3373F] hover:bg-[#FDF5F6]">
        Archive Offboarding
      </button>
      <button class="inline-flex h-11 items-center gap-[9px] rounded-[10px] border border-brand bg-brand px-[18px] text-[14.5px] font-medium text-white hover:bg-[#0a4d73]">
        Send to Consultant
      </button>
    </div>
  </div>

  <!-- 4-Column Detail Grid -->
  <dl class="mt-[22px] grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl bg-[#EEF4F8] px-7 py-6 sm:grid-cols-2 lg:grid-cols-4">
    <div class="flex flex-col gap-1">
      <dt class="text-xs font-medium text-[#64758b]">Contract Group</dt>
      <dd class="text-[15px] font-semibold text-ink">GECO Asia Ltd</dd>
    </div>
    <div class="flex flex-col gap-1">
      <dt class="text-xs font-medium text-[#64758b]">Client</dt>
      <dd class="text-[15px] font-semibold text-ink">P&G Digital Ops</dd>
    </div>
    <div class="flex flex-col gap-1">
      <dt class="text-xs font-medium text-[#64758b]">Last Working Day</dt>
      <dd class="text-[15px] font-semibold text-ink">15 Oct 2026</dd>
    </div>
    <div class="flex flex-col gap-1">
      <dt class="text-xs font-medium text-[#64758b]">Assigned HR Representative</dt>
      <dd class="text-[15px] font-semibold text-ink">Mika Santos</dd>
    </div>
  </dl>
</section>