

# Plan: Restrict Regenerate Button to Admins and Contributors

## Problem
The "Regenerate" button in the dashboard header is currently visible to **all users**. It should only be shown to users with `admin` or `contributor` roles.

## Current State
- `useUserRoles` hook already provides `isAdmin` and `isContributor` booleans
- These are already imported in `PmsDashboard.tsx` (line 102)
- The Regenerate button is at lines 328-336, rendered unconditionally

## Solution
Wrap the Regenerate button with a conditional check: `{(isAdmin || isContributor) && ( ... )}`

## File to Modify

**`src/pages/PmsDashboard.tsx`**

Lines 327-337: Add conditional rendering around the Regenerate button

```typescript
// Before (lines 327-337)
{/* Regenerate Button */}
<Button
  variant="outline"
  size="sm"
  onClick={handleRegenerateReport}
  className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
>
  <RefreshCw className="h-4 w-4" />
  <span className="hidden sm:inline">Regenerate</span>
</Button>

// After
{/* Regenerate Button - Admin/Contributor only */}
{(isAdmin || isContributor) && (
  <Button
    variant="outline"
    size="sm"
    onClick={handleRegenerateReport}
    className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
  >
    <RefreshCw className="h-4 w-4" />
    <span className="hidden sm:inline">Regenerate</span>
  </Button>
)}
```

## What Changes
| Element | Before | After |
|---------|--------|-------|
| Regenerate button visibility | All users | Only `admin` or `contributor` roles |

## What Stays Unchanged
- All other header buttons (New Report, Share, User menu)
- The `handleRegenerateReport` function logic
- Role-checking logic (already implemented)
- Admin Panel link visibility (already role-gated)

