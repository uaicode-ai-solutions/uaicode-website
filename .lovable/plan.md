

# Increase Founder Avatar & Credentials Size in Step 04

You're right — the founder photo and credentials are too small inside the step card. They need more visual weight to create the authority/desire effect your marketing team wants.

## Changes in `src/components/pms/lp01/LpHowItWorks.tsx`

**Lines 95-113** — Increase sizes in the founder inline block:

- **Avatar**: `w-16 h-16` → `w-20 h-20` (matching the step number boxes)
- **Name**: `text-sm` → `text-base`
- **Title**: `text-xs` → `text-sm`
- **Badge**: `text-xs` → `text-sm`, icon `w-3 h-3` → `w-4 h-4`
- **Gap**: `gap-4` → `gap-5`

This gives the founder block the same visual prominence it had in the standalone section while keeping it integrated within the step card.

