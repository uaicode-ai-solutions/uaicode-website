
# Plan: Unify Monetary Value Formatting

## Problem Summary
Currently, the Business Plan tab displays exact monetary values (e.g., `$4,580`, `$109,920`) while the Report tab uses rounded/abbreviated formatting (e.g., `$5K`, `$110K`). This creates inconsistency in the user experience.

## Analysis

### Current Formatting Sources

| Location | Function | Example Output |
|----------|----------|----------------|
| `financialParsingUtils.ts` | `formatCurrency()` | `$5K`, `$110K`, `$1.5M` |
| `reportDataUtils.ts` | `formatCurrency()` | `$4,580`, `$109,920` |
| Business Plan (n8n) | Raw values from AI | `$4,580`, `$109,920` |

### Decision: Which Format to Standardize On?

**Recommended: Keep exact values for precision**

Rationale:
- Business plans and investor reports benefit from precision
- Exact values (`$109,920`) convey more credibility than rounded (`$110K`)
- Rounding can cause confusion when comparing metrics across tabs
- The Business Plan markdown already uses exact values from n8n

## Implementation Steps

### Step 1: Create Unified Formatting Utility
Create a new utility function that provides both formatting options with a clear API:

```text
src/lib/currencyFormatter.ts (NEW)
├── formatCurrencyExact()    → $4,580 / $109,920 / $1,450,000
├── formatCurrencyCompact()  → $5K / $110K / $1.5M
└── formatCurrency()         → Default to exact (breaking change handled)
```

### Step 2: Update Report Tab Components
Modify components that display financial values to use exact formatting:

- `FinancialReturnSection.tsx` - Investment, ARR, MRR values
- `ReportHero.tsx` - TAM, LTV/CAC display
- `UnitEconomics.tsx` - ARPU, LTV, CAC values  
- `GrowthPotentialSection.tsx` - ARR evolution values
- `InvestmentSection.tsx` - Investment breakdowns
- `BusinessModelSection.tsx` - MRR projections

### Step 3: Update `financialParsingUtils.ts`
Refactor `formatCurrency()` to use exact formatting by default, add `formatCurrencyCompact()` for cases where abbreviations are preferred (e.g., chart axis labels).

### Step 4: Verify Business Plan Alignment
Ensure `BusinessPlanTab.tsx` chart components also use exact formatting for consistency.

## Technical Details

### New Utility Function
```text
Location: src/lib/currencyFormatter.ts

export function formatCurrencyExact(
  value: number | string | null, 
  fallback = "..."
): string {
  // Handle null/undefined
  // Handle scientific notation strings
  // Return formatted: $4,580 or $109,920
}

export function formatCurrencyCompact(
  value: number | string | null,
  fallback = "..."
): string {
  // Existing K/M/B abbreviation logic
}

// Alias for backwards compatibility
export const formatCurrency = formatCurrencyExact;
```

### Import Updates
Components will import from the new unified location:
```text
- import { formatCurrency } from "@/lib/financialParsingUtils";
+ import { formatCurrency } from "@/lib/currencyFormatter";
```

### Files to Modify

1. **Create** `src/lib/currencyFormatter.ts`
   - New unified formatting module

2. **Update** `src/lib/financialParsingUtils.ts`
   - Remove `formatCurrency()` (moved to new module)
   - Add re-export for backwards compatibility

3. **Update** `src/components/planningmysaas/dashboard/sections/FinancialReturnSection.tsx`
   - Switch import to use exact formatting

4. **Update** `src/components/planningmysaas/dashboard/sections/ReportHero.tsx`
   - Ensure TAM formatting uses exact values

5. **Update** `src/components/planningmysaas/dashboard/WhatIfScenarios.tsx`
   - Update sliders to show exact values

6. **Update** `src/hooks/useFinancialMetrics.ts`
   - Update formatted string outputs to use exact format

7. **Update** Chart components (optional)
   - Keep compact format for axis labels (readability)
   - Use exact format for tooltips and data labels

## Edge Cases

1. **Very large numbers** (billions): Keep abbreviation for readability
   - Rule: Values ≥ $1B use `$1.5B` format
   - Values < $1B use exact format `$450,000,000`

2. **Scientific notation from DB**: Already handled in existing parsing logic

3. **Null/undefined values**: Continue showing "..." fallback

## Testing Checklist

After implementation:
- [ ] Business Plan and Report Tab show matching values for same metrics
- [ ] Investment breakdown matches across tabs
- [ ] MRR/ARR values consistent between J-Curve chart and text
- [ ] PDF export maintains exact formatting
- [ ] Chart tooltips show exact values
- [ ] No regressions in existing financial displays

## Rollback Plan

If issues arise, the changes can be reverted by:
1. Restore original `formatCurrency()` in `financialParsingUtils.ts`
2. Remove new `currencyFormatter.ts` module
3. Revert import statements
