
# Plano: Fazer o Link Compartilhável Mostrar Todas as Seções

## O Problema (Simples)

O Dashboard busca dados de **7 colunas** do banco.
O Link Compartilhável busca dados de **1 coluna** apenas.

Por isso faltam 6 seções no link compartilhável.

---

## A Solução (Simples)

### Passo 1: Expandir a query do hook

**Arquivo:** `src/hooks/useSharedReport.ts`

Mudar linha 19 de:
```typescript
.select("business_plan_section, wizard_id")
```

Para:
```typescript
.select(`
  business_plan_section,
  opportunity_section,
  competitive_analysis_section,
  icp_intelligence_section,
  price_intelligence_section,
  growth_intelligence_section,
  section_investment,
  wizard_id
`)
```

E expandir a interface `SharedReportData` para incluir todas as seções.

---

### Passo 2: Atualizar o componente para usar os mesmos cards do Dashboard

**Arquivo:** `src/components/planningmysaas/public/SharedReportContent.tsx`

Importar e usar os mesmos componentes que o Dashboard usa:
- `ExecutiveSnapshotCard`
- `ExecutiveNarrativeCard`
- `MarketAnalysisCard`
- `CompetitiveLandscapeCard`
- `TargetCustomerCard`
- `BusinessModelCard`
- `FinancialProjectionsCard`
- `InvestmentAskCard`
- `StrategicVerdictCard`

---

### Passo 3: Passar os dados da página para o componente

**Arquivo:** `src/pages/PmsSharedReport.tsx`

Passar todas as seções como props para `SharedReportContent`.

---

## Arquivos a Modificar

| Arquivo | O que fazer |
|---------|-------------|
| `useSharedReport.ts` | Adicionar mais colunas na query |
| `SharedReportContent.tsx` | Usar os mesmos componentes do Dashboard |
| `PmsSharedReport.tsx` | Passar as novas props |

---

## Resultado

O link compartilhável vai mostrar **exatamente as mesmas 9 seções** do Dashboard.
