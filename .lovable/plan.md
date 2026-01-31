
# Plan: Synchronize Countdown Timers

## Problem
The two "Offer expires in" countdown timers on the Report page are **not synchronized** because they use different localStorage keys:

| Component | localStorage Key |
|-----------|------------------|
| `NextStepsSection.tsx` | `pms_offer_expiry_24h` |
| `ScheduleCallSection.tsx` | `discountExpiry` |

## Solution
Unify both timers to use the **same localStorage key**: `pms_offer_expiry_24h`

## Files to Modify

**`src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx`**

Update the `useCountdownTimer` hook (lines 12-49) to use the same localStorage key as NextStepsSection:

- Line 16: Change `localStorage.getItem('discountExpiry')` to `localStorage.getItem('pms_offer_expiry_24h')`
- Line 23: Change `localStorage.setItem('discountExpiry', ...)` to `localStorage.setItem('pms_offer_expiry_24h', ...)`
- Line 33: Change `localStorage.setItem('discountExpiry', ...)` to `localStorage.setItem('pms_offer_expiry_24h', ...)`

## Technical Details

3 string replacements in `ScheduleCallSection.tsx`:

```typescript
// Before (3 occurrences)
'discountExpiry'

// After (3 occurrences)
'pms_offer_expiry_24h'
```

## Result
Both timers will now:
1. Read from the same expiry timestamp
2. Display identical countdown values
3. Stay perfectly synchronized

## What Stays Unchanged
- Timer logic and calculations
- Visual styling of both countdown sections
- All other functionality
