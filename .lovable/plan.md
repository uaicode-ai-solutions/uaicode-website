
# Plan: Change Regenerate Button to Navigate to Wizard Step 5

## Current Behavior
The Regenerate button (lines 345-356 in `PmsDashboard.tsx`) calls `handleRegenerateReport()` which:
1. Updates report status to "preparing" in database
2. Invalidates React Query cache
3. Navigates to loading page

## Proposed Change
Replace the `handleRegenerateReport` function logic to simply navigate to wizard step 5.

## File to Modify

**`src/pages/PmsDashboard.tsx`**

### Change 1: Simplify `handleRegenerateReport` function (lines 125-156)

Replace the existing async function with a simple navigation:

```typescript
// Regenerate report handler - navigate to wizard step 5
const handleRegenerateReport = () => {
  // Update localStorage to set wizard at step 5
  const savedData = localStorage.getItem("pms-wizard-data");
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      parsed.currentStep = 5;
      localStorage.setItem("pms-wizard-data", JSON.stringify(parsed));
    } catch (e) {
      console.error("Error updating wizard step:", e);
    }
  }
  // Navigate to wizard (will open at step 5)
  navigate("/planningmysaas/wizard");
};
```

### Change 2: Update button to remove disabled state (lines 349)

Remove `disabled={isRegenerating}` since we no longer have async logic.

### Change 3: Remove unused state and imports

- Remove `isRegenerating` state (line 86) since it's no longer needed
- Remove `queryClient` usage if only used for regenerate (check other usages first)

## What Stays Unchanged
- All other buttons and functionality
- The button's visual appearance (icon, text, styling)
- All other files

## Technical Summary

| Before | After |
|--------|-------|
| Updates DB status | Just navigates |
| Invalidates cache | No cache logic |
| Navigates to loading page | Navigates to wizard |
| Async with loading state | Synchronous |

## Risk Assessment
- **Very low risk**: Only changing one button's onClick behavior
- **No data changes**: No database operations
- **No breaking changes**: Other components unaffected
