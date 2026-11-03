# Table & List Components

Tables are wrapped in a `24px` radius card with a `#D7E0EA` border. Rows are `88px` (`h-[5.5rem]`) tall to allow for multi-line consultant meta text.

## Hover Choreography
A signature interaction: on row hover (`>= 701px`), the progress text fades out, the status pill slides left, and the "Open profile" action button fades in at a locked 8px gap.

```html
<tr class="group">
  <!-- Consultant Column Example -->
  <td class="h-[5.5rem] bg-white px-4 align-middle transition-colors duration-150 group-hover:bg-[#D7E0EA]">
    <span class="block font-semibold leading-snug text-ink">Priya Nair</span>
    <span class="mt-0.5 block text-xs font-normal leading-snug text-[#5A6B80]">OB-24094 · Payroll Specialist</span>
  </td>

  <!-- Status Column with Hover Choreography -->
  <td class="h-[5.5rem] bg-white px-4 align-middle transition-colors duration-150 group-hover:bg-[#D7E0EA] relative">
    <!-- Status Pill (slides left on hover) -->
    <span class="relative z-[2] inline-flex items-center rounded-pill bg-[#0E5A8C] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-transform duration-200 group-hover:translate-x-[calc(-100%-2px)]">
      In Progress
    </span>
    
    <!-- Action Button (fades in on hover) -->
    <a href="/offboarding-employees/1" class="absolute left-[22px] top-1/2 inline-flex -translate-y-1/2 translate-x-[6px] items-center gap-1.5 rounded-pill border border-[#122033] bg-[#F7FAFC] px-3 py-1.5 text-[13px] font-semibold text-[#122033] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
      Open profile 
      <svg class="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>
  </td>
</tr>