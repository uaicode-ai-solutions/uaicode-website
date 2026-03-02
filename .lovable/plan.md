

# Convert Report Cards to Table List View

## What changes
Replace the 3-column card grid (lines 335-389) with a compact table/list layout showing 10 rows per page.

## Single file change: `PlanningMySaasOverview.tsx`

### 1. Change pagination constant
- `ITEMS_PER_PAGE` from `9` to `10` (line 113)

### 2. Replace the cards grid with a styled table
Remove the `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` card layout and replace with a table inside a rounded border container:

**Columns:**
| SaaS Name | Name | Email | Country/Region | Industry | Model | Score | Verdict | Status | Date |
|---|---|---|---|---|---|---|---|---|---|

- Each row is a single line with `text-xs`/`text-sm` sizing
- Score shown as number + small inline progress bar
- Status and Verdict as small badges (reusing existing `getStatusStyle`/`getVerdictStyle`)
- Hover effect on rows (`hover:bg-white/[0.04]`)
- Table header with `text-white/40` labels
- Responsive: horizontal scroll wrapper on small screens (`overflow-x-auto`)

### 3. Keep everything else intact
- Stats cards (4 insight cards) -- no change
- Filters bar -- no change
- Pagination controls -- no change (just updated count per page)
- Loading and empty states -- no change
- All data fetching, filtering, and helper functions -- no change

