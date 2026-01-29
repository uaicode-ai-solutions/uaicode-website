

# Plano: Alterar Sequência Price Intelligence ↔ ICP

## Resumo da Mudança

A ordem atual dos passos 6 e 7 será invertida para respeitar a dependência lógica:

| Antes | Depois |
|-------|--------|
| Step 6: Customer Profiling (ICP) | Step 6: Pricing Strategy (Price Intelligence) |
| Step 7: Pricing Strategy (Price Intelligence) | Step 7: Customer Profiling (ICP) |

---

## Arquivos Afetados

### 1. `supabase/functions/pms-orchestrate-report/index.ts`
**Alteração:** Trocar a ordem dos itens 6 e 7 no array `TOOLS_SEQUENCE`

```text
ANTES (linhas 28-29):
  { step: 6, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
  { step: 7, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },

DEPOIS:
  { step: 6, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },
  { step: 7, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
```

### 2. `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx`
**Alteração:** Trocar a ordem dos itens no array `STEPS` (linhas 16-17)

```text
ANTES:
  { label: "Customer Profiling", icon: Users },
  { label: "Pricing Strategy", icon: Tag },

DEPOIS:
  { label: "Pricing Strategy", icon: Tag },
  { label: "Customer Profiling", icon: Users },
```

---

## Arquivos NÃO Afetados (Auditoria)

| Arquivo | Motivo |
|---------|--------|
| `PmsLoading.tsx` | Usa parsing dinâmico (`Step X`) - não tem steps hardcoded |
| `ResumeOrRestartDialog.tsx` | Apenas exibe `currentStep` como número - não depende de labels |
| `src/lib/fallbackConfig.ts` | Referências a "Pricing Strategy" são textuais para descrição, não sequência |
| `src/lib/dataQualityUtils.ts` | Verifica campos, não ordem de execução |
| `FinancialProjections.tsx` | UI card label apenas |
| `PricingIntelligence.tsx` | UI card label apenas |

---

## Fluxo de Execução Após Mudança

```text
Step 1:  Initialize Report        (Create_Report_Row)
Step 2:  Investment Analysis      (Call_Get_Investment_Tool_)
Step 3:  Market Benchmarks        (Call_Get_Benchmark_Tool_)
Step 4:  Competitor Research      (Call_Get_Competitors_Tool_)
Step 5:  Market Opportunity       (Call_Get_Opportunity_Tool_)
Step 6:  Pricing Strategy         (Call_Get_Price_Tool_)        ← MOVIDO PARA CÁ
Step 7:  Customer Profiling       (Call_Get_ICP_Tool_)          ← MOVIDO PARA CÁ
Step 8:  Paid Media Analysis      (Call_Get_PaidMedia_Tool_)
Step 9:  Growth Projections       (Call_Get_Growth_Tool_)
Step 10: Executive Summary        (Call_Get_Summary_Tool_)
Step 11: Final Scoring            (Call_Get_Hero_Score_Tool_)
```

---

## Dependências Validadas

### Price Intelligence (novo Step 6) depende de:
- Wizard → `market_type`, `industry`
- Benchmark → `default_arpu`, `monthly_churn`
- Competitors → `pricing_range`, `pricing_model`
- Opportunity → `market_growth_rate`

### ICP (novo Step 7) agora terá acesso a:
- Price Intelligence → `recommended_arpu`, `pricing_tiers`, `typical_budget`

---

## Impacto no n8n

O n8n workflow de ICP precisará ser atualizado para:
1. Buscar dados de `price_intelligence_section` no Context Retrieval
2. Usar `recommended_arpu` para calcular `budget_timeline.typical_budget`

**Nota:** Esta alteração no n8n é separada e será feita após o deploy do código.

---

## Testes Recomendados

1. Gerar um novo relatório completo (Steps 1-11)
2. Verificar se a UI de loading exibe a ordem correta
3. Verificar se o status no banco segue a nova sequência
4. Testar retry em Step 6 (agora Pricing Strategy)
5. Testar retry em Step 7 (agora Customer Profiling)

