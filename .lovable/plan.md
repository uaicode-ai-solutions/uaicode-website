
# Plan: Change Submit Button Text in Wizard Step 5

## Change Summary
Update the final submission button text from "Get my SaaS Analysis" to "Is My Idea Viable?"

## File to Modify

**`src/components/planningmysaas/wizard/WizardLayout.tsx`**

### Change (line 130)

| Before | After |
|--------|-------|
| `🚀 Get my SaaS Analysis` | `🚀 Is My Idea Viable?` |

## Technical Details

Single line change at line 130:
```typescript
// Before
🚀 Get my SaaS Analysis

// After
🚀 Is My Idea Viable?
```

## What Stays Unchanged
- Button styling and classes
- Loading state text ("Generating...")
- Arrow icon
- All other wizard functionality
