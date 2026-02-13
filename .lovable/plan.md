
## Set Newsletter Default Sort to "Newest First"

Currently the Newsletter page initializes the sort direction as `"asc"` (Oldest First). The fix is a single-line change.

### Technical Details

**File:** `src/pages/Newsletter.tsx`, line 996

Change:
```ts
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
```
To:
```ts
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
```

This ensures posts are displayed newest first by default when the page loads. The toggle button will still work to switch between newest/oldest.
