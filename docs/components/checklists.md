
---

### Step 2: Create `docs/components/checklists.md`
Create this file and paste this **exact** content:

```markdown
# Checklist Components

Used in both the HR Profile view and the Consultant Portal. 

## Requirement Card
White card with a header, description, and a collapsible progress strip.

```html
<div class="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
  <!-- Header -->
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2.5">
        <h3 class="text-lg font-semibold leading-tight text-ink">Outstanding Items</h3>
        <span class="inline-flex items-center rounded-pill bg-[#0E5A8C] px-2.5 py-1 text-xs font-medium text-white">In Progress</span>
      </div>
      <p class="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-[#64758b]">
        Close all billable and administrative obligations before the final working day.
      </p>
    </div>
    <!-- Actions -->
    <div class="ml-auto flex flex-wrap gap-2.5">
      <button class="inline-flex items-center gap-2 rounded-[10px] border border-[#0D5F8F] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#0D5F8F] hover:bg-[#0D5F8F] hover:text-white">Edit</button>
      <button class="inline-flex items-center gap-2 rounded-[10px] border border-[#e4b4b4] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#c14b4b] hover:bg-[#C24152] hover:text-white">Delete</button>
      <button class="inline-flex items-center gap-2 rounded-[10px] border border-[#0D5F8F] bg-[#0D5F8F] px-3.5 py-2.5 text-[13px] font-medium text-white hover:bg-[#198754]">Add Sub-requirement</button>
    </div>
  </div>
  
  <!-- Progress Strip Toggle -->
  <button class="mt-4 flex w-full items-center justify-between gap-3 rounded-lg bg-[#f4f8fb] px-3.5 py-[11px] text-left transition-colors hover:bg-[#e9eef5]">
    <span class="flex items-center gap-[9px] text-[13px] font-medium text-[#243447]">
      1 of 2 completed
    </span>
    <span class="flex items-center gap-[7px] text-[13px] font-medium text-[#8a99a8]">
      Hide details 
      <svg class="h-4 w-4 flex-shrink-0 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </span>
  </button>
</div>