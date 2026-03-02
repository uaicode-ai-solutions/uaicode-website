

# Remove Verdict Column and Fix Scrolling

## Changes (single file: `PlanningMySaasOverview.tsx`)

### 1. Remove Verdict column
- Remove the `<th>` for "Verdict" (line 346)
- Remove the `<td>` block rendering the verdict badge (lines 372-378)

### 2. Remove vertical scrollbar
- On the table wrapper div (line 335), change `overflow-x-auto` to `overflow-x-auto overflow-y-hidden` to prevent any vertical scrollbar from appearing. The table height is naturally controlled by pagination (max 10 rows), so no vertical scroll is needed.

### 3. Pagination
- Already implemented with 10 items per page and Previous/Next controls -- no changes needed here.

### Cleanup
- The `getVerdictStyle` helper function (lines 61-66) can be removed since it's no longer used.
- The `verdict` field can remain in the data interfaces since it may be used elsewhere or in the future.

