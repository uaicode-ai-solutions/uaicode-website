

# Fix: Booking Page Layout to Match Homepage

## Problem

Both pages use the same `<Schedule />` component, but `Booking.tsx` wraps it in `flex flex-col items-center justify-center` which constrains the Cal.com embed width, forcing a vertical/stacked layout instead of the horizontal 3-column layout seen on the homepage.

## Change

**File: `src/pages/Booking.tsx`** -- remove flex centering:

```tsx
// From:
<div className="min-h-screen bg-background flex flex-col items-center justify-center">

// To:
<div className="min-h-screen bg-background">
```

One class change. Nothing else.

