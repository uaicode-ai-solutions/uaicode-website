

# Auditoria do Business Plan - Correcao de Dados Inconsistentes

## Problemas Encontrados

### Problema 1: J-Curve sem `baselineMarketingBudget` (CRITICO)
**Arquivo:** `FinancialProjectionsCard.tsx` (linha 122-129)
**Impacto:** O J-Curve do Business Plan usa o default `baselineMarketingBudget = 2000` (hardcoded no JCurveChart), enquanto o Report usa `MINIMUM_MARKETING_BASELINE = 6000`. Isso distorce completamente a curva de eficiencia de marketing, gerando valores diferentes entre as duas abas.

**Correcao:** Passar `baselineMarketingBudget={6000}` explicitamente, igual ao `FinancialReturnSection`.

---

### Problema 2: LTV/CAC usa `financialMetrics` calculado em vez do DB direto (MEDIO)
**Arquivos:** `ExecutiveSnapshotCard.tsx` (linhas 116-119), `FinancialProjectionsCard.tsx` (linhas 112-116)
**Impacto:** Ambos usam `financialMetrics.ltvCacCalculated` que e um valor recalculado pelo hook com caps e ajustes de mercado. O Report tab tambem usa o hook, entao neste caso os valores SAO consistentes. **Nao e um bug** - ambos usam a mesma fonte (o hook).

---

### Problema 3: Break-even com fallback para `financialMetrics.breakEvenMonths` (string) (BAIXO)
**Arquivo:** `FinancialProjectionsCard.tsx` (linhas 103-105), `ExecutiveSnapshotCard.tsx` (linhas 132-134)
**Impacto:** Usam `financialData?.break_even_months` (do growth_intelligence_section) como prioridade, e `financialMetrics.breakEvenMonths` como fallback. O Report faz o mesmo via hook. Consistente.

---

### Problema 4: ROI com fallback para `financialMetrics.roiYear1` (MEDIO)
**Arquivo:** `FinancialProjectionsCard.tsx` (linha 139), `ExecutiveSnapshotCard.tsx` (linha 153)
**Impacto:** Usam `financialData?.roi_year_1_formatted` (string do DB) como prioridade, com fallback para `financialMetrics.roiYear1`. O Report usa `metrics.roiYear1Num` (numerico do hook). Na pratica, se o campo `roi_year_1_formatted` existir no DB, ambos mostram o mesmo valor. Se nao existir, o Business Plan mostra o valor formatado do hook e o Report mostra o numerico - podem ter formatacao diferente mas valor igual.

---

### Problema 5: `marketingBudget` passa `financialMetrics.marketingBudgetMonthly` sem considerar selecoes do usuario (CRITICO)
**Arquivo:** `FinancialProjectionsCard.tsx` (linha 126)
**Impacto:** O Report (`FinancialReturnSection`) calcula `effectiveMarketingBudget` baseado nas selecoes de marketing do usuario (`marketingTotals`). O Business Plan ignora isso e passa `financialMetrics.marketingBudgetMonthly` (valor do DB ou estimado). Isso causa J-Curves completamente diferentes quando o usuario seleciona servicos de marketing.

**Correcao:** Usar a mesma logica do `FinancialReturnSection` para calcular `effectiveMarketingBudget` com base no `marketingTotals` do contexto.

---

### Problema 6: `mrrMonth12` e `breakEvenMonths` passados ao JCurveChart com fallback diferente (BAIXO)
**Arquivo:** `FinancialProjectionsCard.tsx` (linhas 124-125)
**Impacto:** Passa `financialData?.break_even_months || financialMetrics.breakEvenMonthsNum` e `financialData?.mrr_month_12 || financialMetrics.mrrMonth12Num`. O Report nao passa esses props individuais quando tem scenarios (o JCurveChart usa apenas os scenarios). Os props `mrrMonth12` e `breakEvenMonths` sao usados apenas quando NAO ha scenarios - entao impacto minimo.

---

## Plano de Correcao

### Arquivo: `src/components/planningmysaas/dashboard/businessplan/FinancialProjectionsCard.tsx`

1. Importar `useReportContext` e utilitarios de marketing (`calculateSuggestedPaidMedia`, `calculateTotalMarketingMonthly`)
2. Usar `marketingTotals` do contexto para calcular `effectiveMarketingBudget` exatamente como o `FinancialReturnSection`
3. Definir `MINIMUM_MARKETING_BASELINE = 6000` (igual ao Report)
4. Passar `baselineMarketingBudget={MINIMUM_MARKETING_BASELINE}` ao `JCurveChart`
5. Passar `marketingBudget={effectiveMarketingBudget}` ao `JCurveChart` (baseado nas selecoes do usuario)

### Arquivo: `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx`

1. Remover a prop `financialMetrics` dos componentes que nao precisam dela para calculo (manter apenas onde e necessario para display de metricas como LTV/CAC, Payback etc. - esses JA sao consistentes com o Report porque usam o mesmo hook)
2. Nenhuma mudanca estrutural necessaria - o `BusinessPlanTab` ja passa os dados corretamente para os sub-componentes

### Resumo do Impacto
- **1 arquivo editado**: `FinancialProjectionsCard.tsx`
- **Correcao principal**: J-Curve agora usara o mesmo `baselineMarketingBudget` (6000) e `effectiveMarketingBudget` (baseado em selecoes do usuario) que o Report
- **Resultado**: J-Curve e tooltip identicos entre Business Plan e Market Analysis

