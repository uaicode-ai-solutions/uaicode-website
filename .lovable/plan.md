
# Plan: Expose "Simulate Your Scenario" Section (Remove Dropdown)

## Current Behavior
The "Simulate Your Scenario" section is currently hidden behind a collapsible button. Users must click to expand and see the `WhatIfScenarios` component with the sliders.

## Proposed Change
Remove the toggle/dropdown behavior and always show the `WhatIfScenarios` content directly on the page, with a clean header matching the existing visual style.

## Files to Modify

**1. `src/components/planningmysaas/dashboard/sections/GrowthPotentialSection.tsx`**

Changes:
- Remove the `showWhatIf` state (line 37)
- Remove the `ChevronDown` and `ChevronUp` icon imports (lines 12-13)
- Replace the `Button` toggle wrapper (lines 298-319) with a static header div
- Remove the conditional rendering `{showWhatIf && ...}` (line 321) - always render `WhatIfScenarios`
- Keep all visual styling (border, rounded corners, icons, text) exactly as they are

## Visual Result

Before:
```text
┌──────────────────────────────────────────┐
│ [icon] Simulate Your Scenario      [▼]  │  ← Click to expand
└──────────────────────────────────────────┘
```

After:
```text
┌──────────────────────────────────────────┐
│ [icon] Simulate Your Scenario            │  ← Static header
├──────────────────────────────────────────┤
│                                          │
│  [ARPU slider]                           │
│  [Churn slider]         [Results cards]  │
│  [CAC slider]                            │
│                                          │
└──────────────────────────────────────────┘
```

## Technical Details

The change involves:
1. Removing state: `const [showWhatIf, setShowWhatIf] = useState(false);`
2. Removing unused imports: `ChevronDown`, `ChevronUp`
3. Converting the `Button` element to a static `div` with the same styling
4. Removing the conditional `{showWhatIf && ...}` wrapper - `WhatIfScenarios` is always rendered

## What Stays Unchanged
- All visual styling (colors, borders, icons, text)
- The `WhatIfScenarios` component and its functionality
- All other sections in `GrowthPotentialSection`
- All other files in the project

## Risk Assessment
- **Low risk**: This is a UI-only change
- **No data changes**: The sliders and calculations remain identical
- **No breaking changes**: Only removing toggle functionality
