

# Auditoria Completa: SharedReportContext vs Dashboard

## Resultado da Auditoria

Analisei todos os componentes renderizados na tela compartilhavel (`PmsSharedReport` -> `BusinessPlanTab` + `SharedReportHero` + `SharedReportHeader`).

### Campos `report?.X` usados na tela compartilhavel

| Campo | Mapeado no SharedReportContext? | Usado por |
|-------|-------------------------------|-----------|
| `saas_name` | Sim | SharedReportHero, ReportHero |
| `market_type` | Sim | BusinessPlanTab (useFinancialMetrics) |
| `industry` | Sim | - |
| `description` | Sim | - |
| `budget` | **NAO** | FinancialProjectionsCard (J-Curve) |

### Conclusao

Existe **apenas 1 campo faltante**: `budget`. Os demais dados do Business Plan vem do `reportData` (JSONB sections como `opportunity_section`, `growth_intelligence_section`, etc.), que ja estao todos corretamente mapeados no `SharedReportContext`.

Os outros campos do wizard (`selected_features`, `next_steps`, `execution_timeline`, `geographic_region`, etc.) sao usados apenas nas abas Report, Marketing e Next Steps -- que **nao** sao renderizadas na tela compartilhavel (que exibe somente o `BusinessPlanTab`).

## Correcao

### Arquivo: `src/contexts/SharedReportContext.tsx` (linha 59)

Adicionar o campo `budget` ao mapeamento do `wizard_snapshot`:

```
budget: wizardSnapshot.budget ? String(wizardSnapshot.budget) : null,
```

Isso garante que o calculo de `suggestedPaidMedia` no `FinancialProjectionsCard` use o orcamento real do usuario em vez do fallback generico, produzindo um J-Curve identico ao do dashboard autenticado.

Uma unica linha adicionada, sem mudanca estrutural.
