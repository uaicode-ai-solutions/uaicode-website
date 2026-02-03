
# Plano: Corrigir Erro de Tela Preta no Link Compartilhável

## Problema Identificado

O `SharedReportContent.tsx` cria um objeto `reportData` manualmente para passar ao hook `useFinancialMetrics`, mas está **faltando o campo `benchmark_section`**, que é obrigatório na interface `ReportData`.

**Arquivo:** `src/components/planningmysaas/public/SharedReportContent.tsx`
**Linhas:** 50-74

```typescript
// PROBLEMA - Falta benchmark_section
const reportData = {
  id: "",
  wizard_id: "",
  // ... outros campos
  // benchmark_section: null, ← FALTA ESTE CAMPO
} as const;

const financialMetrics = useFinancialMetrics(reportData as Parameters<typeof useFinancialMetrics>[0]);
```

A interface `ReportData` (linha 796 de types/report.ts) exige:
```typescript
benchmark_section: unknown | null;
```

Quando o campo está ausente, o TypeScript pode compilar, mas em runtime o hook pode lançar um erro ao acessar propriedades do `reportData`, causando o crash (tela preta).

---

## Solução

Adicionar o campo `benchmark_section: null` ao objeto `reportData` criado no `SharedReportContent.tsx`.

### Mudança no Código

**Arquivo:** `src/components/planningmysaas/public/SharedReportContent.tsx`

Adicionar na linha 59 (entre `business_plan_section` e `icp_avatar_url`):

```typescript
const reportData = {
  id: "",
  wizard_id: "",
  status: "completed",
  created_at: "",
  updated_at: "",
  hero_score_section: null,
  summary_section: null,
  benchmark_section: null,  // ← ADICIONAR ESTA LINHA
  business_plan_section: null,
  icp_avatar_url: null,
  paid_media_intelligence_section: null,
  share_enabled: true,
  share_token: null,
  share_url: null,
  share_created_at: null,
  opportunity_section: opportunity,
  growth_intelligence_section: growth,
  section_investment: investment,
  price_intelligence_section: pricing,
  icp_intelligence_section: icp,
  competitive_analysis_section: competitive,
};
```

Também remover o `as const` que pode causar conflitos de tipo:

```typescript
// Antes
} as const;
const financialMetrics = useFinancialMetrics(reportData as Parameters<typeof useFinancialMetrics>[0]);

// Depois (mais simples e seguro)
} as ReportData;
const financialMetrics = useFinancialMetrics(reportData);
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/planningmysaas/public/SharedReportContent.tsx` | Adicionar `benchmark_section: null` e simplificar o cast de tipo |

---

## Resultado Esperado

- A tela não vai mais piscar/ficar preta
- O link compartilhável vai mostrar todas as 9 seções do Business Plan
