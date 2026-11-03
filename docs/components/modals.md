
---

### Step 3: Create `docs/components/modals.md`
Create this file and paste this **exact** content:

```markdown
# Modal Components

Modals use a backdrop blur, a `760px` max-width shell, and a `24px` border radius. The body is scrollable, while the header and footer remain accessible.

## Structure
```html
<!-- Overlay -->
<div class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[rgba(18,32,51,.45)] p-6 backdrop-blur-[3px]">
  <!-- Shell -->
  <div class="relative flex max-h-[calc(100dvh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-line bg-white shadow-lg">
    
    <!-- Close Button -->
    <button class="absolute right-[14px] top-[14px] z-10 grid h-7 w-7 place-items-center rounded-full border border-line bg-white hover:bg-[#f2f6fa]">
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <!-- Scrollable Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-[26px] py-6 pb-[26px]">
      <div class="mb-[22px] flex flex-wrap items-center gap-3 pr-9">
        <h2 class="text-[18px] font-medium leading-[1.3] text-ink">New Offboarding Record</h2>
        <span class="rounded-pill bg-[#E4EEF6] border border-[#A9C4DC] px-3 py-1 text-xs font-normal text-ink">Draft</span>
      </div>
      
      <!-- Form Field Example -->
      <label class="mb-5 block">
        <span class="mb-2 block text-xs font-medium tracking-[.2px] text-ink-3">Consultant</span>
        <select class="h-11 w-full rounded-[10px] border border-line bg-white px-[14px] py-[11px] text-sm text-ink focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-[rgba(18,96,142,.18)]">
          <option>Select a consultant…</option>
        </select>
      </label>
    </div>

    <!-- Sticky Footer -->
    <div class="border-t border-line bg-white px-[26px] py-4 flex flex-wrap justify-end gap-3">
      <button class="rounded-[10px] border border-line bg-white px-[18px] py-[11px] text-sm font-semibold text-ink hover:bg-[#f2f6fa]">Cancel</button>
      <button class="inline-flex items-center gap-2 rounded-[10px] border border-brand bg-brand px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-brand-dk">
        Create Offboarding Record
      </button>
    </div>
  </div>
</div>