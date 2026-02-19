

# Fix: Booking Page Calendar Scrollbar

## Problem
The `/booking` page already reuses the `<Schedule />` component from the homepage, and the copy is already updated to SPICED ("Book Your Free Strategy Call"). The screenshots show the old copy which was from before our update.

The remaining issue is the **visible scrollbar** on the Cal.com embed, caused by `overflow: scroll` in the inline style and `overflow-auto` on the container div.

## Change (1 file)

### Schedule.tsx (lines 45, 49)

Replace the scrollbar-causing styles:

| Line | Current | New |
|------|---------|-----|
| 45 | `className="w-full h-[500px] md:h-[700px] overflow-auto"` | `className="w-full h-[500px] md:h-[700px] overflow-hidden"` |
| 49 | `style={{ width: "100%", height: "100%", overflow: "scroll" }}` | `style={{ width: "100%", height: "100%", overflow: "hidden" }}` |

This hides the scrollbar while keeping the Cal.com embed fully functional (Cal.com handles its own internal scrolling).

## What is NOT changing
- No copy changes (already correct)
- No structural changes
- The `/booking` page (`Booking.tsx`) stays the same -- it already reuses `<Schedule />`
