
# Add Report Preview from Hero Dashboard

## Overview
Add a view icon to each row in the PMS table that opens the client's report in a new browser tab. The preview page will be a new route (`/hero/report/:reportId`) that reuses the existing report components (BusinessPlanTab, SharedReportHeader, SharedReportHero, SharedReportFooter) with a dedicated provider that fetches data by report ID using hero user authentication.

## Why a new route instead of using the existing shared route?
The existing `/planningmysaas/shared/:shareToken` requires `share_enabled=true` and a valid `share_token`. Not all reports may have sharing enabled. A dedicated hero route ensures admins can always preview any report.

## Changes

### 1. Update data fetching in `PlanningMySaasOverview.tsx`
- Also fetch `share_token` and `share_enabled` from `tb_pms_reports` (not strictly needed for the new route, but useful for context)
- Add an `Eye` icon button as the last column in the table
- Clicking opens `/hero/report/:reportId` in a new tab via `window.open()`

### 2. Create `src/hooks/useHeroReportPreview.ts`
A new hook that fetches report data by report ID (hero users have RLS SELECT access to `tb_pms_reports`). Returns the same shape as `useSharedReport` but queries by `id` instead of `share_token`.

### 3. Create `src/contexts/HeroReportPreviewContext.tsx`
A provider similar to `SharedReportProvider` that:
- Fetches report data by report ID
- Fetches the corresponding `tb_pms_lp_wizard` data for the wizard snapshot
- Provides data through the same context shape so `useReportContext()` works seamlessly

### 4. Create `src/pages/hero/HeroReportPreview.tsx`
New page component that:
- Reads `:reportId` from URL params
- Wraps content with `HeroReportPreviewContext`
- Renders: SharedReportHeader (with Kyle chat), SharedReportHero (score + project name), BusinessPlanTab (full report), SharedReportFooter
- Requires hero authentication (wrapped in HeroRoute)

### 5. Add route in `App.tsx`
```text
/hero/report/:reportId -> <HeroRoute><HeroReportPreview /></HeroRoute>
```

## Technical Details

### Data Flow
```text
HeroReportPreview page
  -> HeroReportPreviewProvider (fetches by report ID)
    -> useReportContext() (falls back to this provider)
      -> SharedReportHeader (Kyle chat)
      -> SharedReportHero (score banner)
      -> BusinessPlanTab (full business plan)
      -> SharedReportFooter (CTA)
```

### Table Column Addition
A new "Actions" column with an `Eye` icon will be added as the last column. Only completed reports will have a clickable icon.

### Context Integration
The `useReportContext` hook already supports fallback from `ReportContext` to `SharedReportContext`. The new provider will register itself in the `SharedReportContext` so all existing components work without modification.

## Files Changed
1. `src/components/hero/mock/PlanningMySaasOverview.tsx` -- add Eye icon column
2. `src/hooks/useHeroReportPreview.ts` -- new hook to fetch by report ID
3. `src/contexts/HeroReportPreviewContext.tsx` -- new provider
4. `src/pages/hero/HeroReportPreview.tsx` -- new page
5. `src/App.tsx` -- add route
