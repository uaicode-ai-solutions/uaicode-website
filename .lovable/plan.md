

# Plan: Create /code/wizard — Copy of PMS Wizard

## What changes
1. **New page `src/pages/CodeLeadWizard.tsx`** — Copy of `PmsLeadWizard.tsx` with:
   - `TOTAL_STEPS = 13` (was 14, logo step removed)
   - Remove `saasLogo` from form state
   - Remove LogoStep import and rendering
   - Adjust step numbering: steps 0–10 stay the same, step 11 (logo) removed, GeographicRegion becomes step 11, ThankYou becomes step 12
   - Submission payload removes `saas_logo_url`

2. **New step `src/components/code-lead-wizard/steps/SaasTypeStep.tsx`** — Copy of PMS version with one change:
   - Replace `{ id: "platform", title: "Platform", description: "Multi-sided marketplace", icon: Layers }` with `{ id: "erp", title: "ERP", description: "Enterprise resource planning", icon: Layers }`

3. **Reuse all other step components** from `src/components/pms-lead-wizard/steps/` (WelcomeStep, FullNameStep, EmailStep, etc.) and `LeadWizardLayout` + `LeadWizardStep` — no copies needed since they're generic.

4. **Route in `App.tsx`** — Add `<Route path="/code/wizard" element={<CodeLeadWizard />} />` in the public routes section.

## Files created/modified
| File | Action |
|------|--------|
| `src/pages/CodeLeadWizard.tsx` | Create (based on PmsLeadWizard, 13 steps, no logo) |
| `src/components/code-lead-wizard/steps/SaasTypeStep.tsx` | Create (Platform → ERP) |
| `src/App.tsx` | Add route `/code/wizard` |

