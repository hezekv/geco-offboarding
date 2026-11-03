# Spacing & Layout

Consistent spacing creates rhythm and reduces cognitive load. We rely on Tailwind's 4px base grid.

## Common Spacing Tokens
| Token | Pixels | Usage |
|---|---|---|
| `gap-2` / `p-2` | 8px | Tight grouping (e.g., icon + text in buttons) |
| `gap-3` / `p-3` | 12px | Standard component padding (e.g., file chips) |
| `gap-4` / `p-4` | 16px | Card padding, form field spacing |
| `gap-6` / `p-6` | 24px | Section spacing, large card padding |

## Layout Constraints
- **Sidebar Width**: `w-56` (14rem / 224px)
- **Modal Max Width**: `max-w-[760px]`
- **Table Min Width**: `min-w-[960px]` (prevents hover choreography clipping)
- **Content Max Width**: `max-w-5xl` (for portal/dashboard main areas)

## Border Radius
- **Small**: `rounded-[9px]` or `rounded-[10px]` (Buttons, inputs, file chips)
- **Medium**: `rounded-xl` or `rounded-2xl` (Cards, modals, table containers)
- **Full**: `rounded-full` (Avatars, status pills)