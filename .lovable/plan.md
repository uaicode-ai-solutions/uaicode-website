
# Planning My SaaS - Report Cards with Filters

## Overview
Refactor the `PlanningMySaasOverview` component to display report cards from `tb_pms_reports` joined with `tb_pms_lp_wizard` (landing page leads), adding granular filters and 4 insight cards.

## Current State
The component currently fetches from `tb_pms_wizard` (authenticated users). The user wants to show reports linked to `tb_pms_lp_wizard` (lead wizard from landing page). The DB query confirmed the join works: `tb_pms_reports.wizard_id` references `tb_pms_lp_wizard.id`.

## Data Source
- **Primary**: `tb_pms_reports` (report data, score, status)
- **Join**: `tb_pms_lp_wizard` (lead info: full_name, email, phone, country, geographic_region, industry, industry_other, ideal_business_model, saas_name)
- RLS already allows hero users to view both tables

## Changes

### 1. Update `PlanningMySaasOverview.tsx`

**Data Fetching:**
- Fetch `tb_pms_reports` with all fields needed (id, wizard_id, status, hero_score_section, summary_section, created_at)
- Fetch `tb_pms_lp_wizard` with filter-relevant fields (id, full_name, email, phone, country, geographic_region, industry, industry_other, ideal_business_model, saas_name, saas_type)
- Merge by `report.wizard_id === lp_wizard.id`

**4 Insight Cards:**
1. **Total Reports** -- count of completed reports
2. **Avg. Score** -- average viability score from hero_score_section
3. **Top Industry** -- most frequent industry among reports
4. **Top Region** -- most frequent geographic_region

**Filters (Select dropdowns):**
- Search input (searches full_name, email, saas_name)
- Country dropdown (distinct values from data)
- Geographic Region dropdown
- Industry dropdown (combines industry + industry_other)
- Ideal Business Model dropdown
- Status dropdown (existing)
- Clear filters button

**Card Layout:**
- Keep existing card design (saas_name, score, verdict, status badge)
- Add: full_name, email, phone, country, region, industry, business model display
- Keep pagination

### Technical Details

```text
+--------------------------------------------------+
|  Planning My SaaS                                |
+--------------------------------------------------+
| [Total Reports] [Avg Score] [Top Industry] [Top Region] |
+--------------------------------------------------+
| [Search...] [Country v] [Region v] [Industry v] [Model v] [Status v] [Clear] |
+--------------------------------------------------+
| Card 1        | Card 2        | Card 3          |
| - SaaS Name   | - SaaS Name   | - SaaS Name     |
| - Full Name   | - Full Name   | - Full Name      |
| - Email/Phone | - Email/Phone | - Email/Phone    |
| - Country/Reg | - Country/Reg | - Country/Reg    |
| - Industry    | - Industry    | - Industry       |
| - Biz Model   | - Biz Model   | - Biz Model      |
| - Score bar   | - Score bar   | - Score bar      |
| - Verdict     | - Verdict     | - Verdict        |
+--------------------------------------------------+
| Pagination                                       |
+--------------------------------------------------+
```

All filter dropdowns will be dynamically populated from the fetched data (distinct values). No database changes needed -- RLS policies already grant hero users SELECT access to both tables.
