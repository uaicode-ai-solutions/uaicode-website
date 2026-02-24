

# Planning My SaaS - Admin Report Cards with Filters

## Overview

Replace the static placeholder `PlanningMySaasOverview` with a fully functional admin view that shows all PMS reports as cards, with search/filter capabilities by client email.

## Database Changes

Two new RLS policies are needed so Hero users can read PMS data:

```text
tb_pms_wizard  -->  hero_users_can_view_wizards (SELECT)
tb_pms_reports -->  hero_users_can_view_reports (SELECT)
```

Both policies use `get_hero_user_id() IS NOT NULL` (same pattern as the leads/content policies from the previous plan).

### SQL Migration

```sql
-- Allow Hero users to read wizard data (for admin overview)
CREATE POLICY "hero_users_can_view_wizards"
  ON public.tb_pms_wizard
  FOR SELECT
  TO authenticated
  USING (get_hero_user_id() IS NOT NULL);

-- Allow Hero users to read reports (for admin overview)
CREATE POLICY "hero_users_can_view_reports"
  ON public.tb_pms_reports
  FOR SELECT
  TO authenticated
  USING (get_hero_user_id() IS NOT NULL);
```

## UI Changes

### Rewrite `PlanningMySaasOverview.tsx`

The component will follow the same patterns as `LeadManagement.tsx`:

1. **Stats Row** - 4 summary cards at the top:
   - Total Reports (count of completed reports)
   - Average Score (mean viability score)
   - Total Users (distinct user_ids from wizards)
   - Completion Rate (completed / total)

2. **Filter Bar**:
   - Search input: filter by `client_email` or `saas_name` from `tb_pms_wizard`
   - Status dropdown: All / Completed / Pending / Failed
   - Clear filters button

3. **Report Cards Grid** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`):
   Each card displays:
   - Project name (`saas_name`)
   - Client email (`client_email`)
   - Industry
   - Viability score with color-coded progress bar
   - Verdict badge (Proceed / Caution / Reconsider)
   - Created date
   - Status indicator (completed / generating / failed)

4. **Pagination** - 9 items per page, same style as LeadManagement

### Data Fetching

Fetch from Supabase directly (same pattern as `LeadManagement`):

```text
tb_pms_wizard (all records) + tb_pms_reports (joined by wizard_id)
  --> merge into card data
  --> filter by client_email search term
  --> paginate
```

### Styling

All styles will match the existing Hero Dashboard dark theme:
- `bg-white/[0.02]`, `border-white/[0.06]`
- `text-white/80`, `text-white/40` for labels
- Gold accent (`uai-500`) for score highlights
- Same card hover effects as existing components

## Files Modified

| File | Action |
|---|---|
| `src/components/hero/mock/PlanningMySaasOverview.tsx` | Full rewrite |
| Database migration | Add 2 RLS policies |

## No New Dependencies

Uses only existing libraries: `supabase`, `lucide-react`, `date-fns`, and existing UI components.
