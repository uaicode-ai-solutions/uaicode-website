
# Plano de Auditoria: Remover Fallbacks e Usar 100% Dados do Banco

## Resumo do Objetivo
Simplificar a UI do dashboard para ler dados **exclusivamente** de `tb_pms_reports` (JSONB) + `tb_pms_wizard`, removendo toda a infraestrutura de fallback inteligente (SmartFallback, FallbackAgent) e o hook `useFinancialMetrics` onde os dados já existem prontos no banco.

## Regras Confirmadas
- **Fonte**: `tb_pms_reports` + `tb_pms_wizard` (ambos via ReportContext)
- **Cálculos permitidos**: Formatação (moeda, %, "mo") + cálculos visuais (barras de progresso, percentuais para UI)
- **Fallback visual**: Skeleton durante loading inicial → depois sempre "..." para dados ausentes
- **Remover**: Tudo que o banco já fornece (hooks de fallback, cálculos redundantes)

---

## Parte 1: Arquivos a REMOVER completamente

| Arquivo | Motivo |
|---------|--------|
| `src/hooks/useSmartFallbackField.ts` | Não será mais usado |
| `src/hooks/useFallbackAgent.ts` | Não será mais usado |
| `src/lib/fallbackConfig.ts` | Não será mais usado |
| `supabase/functions/pms-smart-fallback/index.ts` | Edge function sem uso |

---

## Parte 2: Simplificar ReportContext

**Arquivo**: `src/contexts/ReportContext.tsx`

**Remover**:
- Import e uso de `useFallbackAgent`
- Campo `fallbackAgent` do contexto
- Campo `refreshReportData` (usado apenas pelo fallback)

**Manter**:
- `report` (wizard data)
- `reportData` (report data)
- `wizardId`, `pmsReportId`
- `selectedMarketingIds`, `marketingTotals` (interação de UI)

---

## Parte 3: Componentes a Simplificar (10 arquivos)

### 3.1. ReportHero.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/ReportHero.tsx`

**Remover**:
- Import `useSmartFallbackField`
- Import `FallbackSkeleton`
- Chamadas `useSmartFallbackField` (linhas 52-70)
- Estados `isLoading` dos fallbacks

**Simplificar**:
- Score: ler direto de `heroScoreData?.score ?? 0`
- Tagline: ler direto de `heroScoreData?.tagline ?? "..."`
- TAM: ler direto de `opportunityData?.tam_value ?? "..."`

**Manter**:
- `useFinancialMetrics` para LTV/CAC e Payback (ainda precisa formatar/calcular dos dados brutos)
- Formatação `formatMarketValue()`

### 3.2. ExecutiveVerdict.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/ExecutiveVerdict.tsx`

**Remover**:
- Import `useSmartFallbackField`
- Import `FallbackSkeleton`, `CardContentSkeleton`
- Chamadas `useSmartFallbackField` (linhas 25-35)

**Simplificar**:
- Verdict: `summaryData?.verdict ?? "..."`
- Verdict Summary: `summaryData?.verdict_summary ?? "..."`

**Manter**:
- `useFinancialMetrics` para sync de métricas no texto (função `syncMetricsInText`)

### 3.3. MarketingIntelligenceSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/MarketingIntelligenceSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 32)
- Import `InlineValueSkeleton` (linha 33)
- Chamada `useSmartFallbackField` (linhas 345-348)

**Simplificar**:
- Usar `rawIcpData` direto, sem fallback
- Helper `getValue()` já retorna "..." para valores ausentes

### 3.4. InvestmentSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/InvestmentSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 16)
- Import `InlineValueSkeleton` (linha 17)
- Chamadas `useSmartFallbackField` (linhas 89-100+)

**Simplificar**:
- Ler valores direto de `mvpBreakdown` sem fallback
- Se valor null/0 → mostrar "..."

### 3.5. NextStepsSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 44)
- Import `InlineValueSkeleton` (linha 45)
- Chamadas `useSmartFallbackField` (linhas 137-153)

**Simplificar**:
- Score: `heroScoreData?.score ?? 0`
- Tagline: `heroScoreData?.tagline ?? "..."`

### 3.6. CompetitorsDifferentiationSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/CompetitorsDifferentiationSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 12)
- Import `CardContentSkeleton` (linha 13)
- Chamada `useSmartFallbackField` (linhas 38-41)
- Loading skeleton condicional (linhas 57-79)

**Simplificar**:
- Usar `rawCompetitiveData` direto
- Se null → mostrar estado vazio com "..." nos campos

### 3.7. PivotScenariosSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/PivotScenariosSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 7)
- Import `InlineValueSkeleton`, `CardContentSkeleton` (linha 8)
- Chamadas `useSmartFallbackField` (linhas 26-35)
- Loading skeleton condicional (linhas 58-77)

**Simplificar**:
- Usar `rawPivotScenarios` direto
- Score: `rawPivotScenarios?.readinessScore ?? 0`

### 3.8. SuccessMetricsSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/SuccessMetricsSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 7)
- Import `InlineValueSkeleton`, `CardContentSkeleton` (linha 8)
- Chamada `useSmartFallbackField` (linhas 32-35)
- Loading skeleton condicional (linhas 58-77)

**Simplificar**:
- Usar `rawSuccessMetrics` direto

### 3.9. ResourceRequirementsSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/ResourceRequirementsSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 7)
- Import `CardContentSkeleton` (linha 8)
- Chamada `useSmartFallbackField` (linhas 30-33)
- Loading skeleton condicional (linhas 54-79)

**Simplificar**:
- Usar `rawResourceRequirements` direto

### 3.10. ExecutionPlanSection.tsx
**Localização**: `src/components/planningmysaas/dashboard/sections/ExecutionPlanSection.tsx`

**Remover**:
- Import `useSmartFallbackField` (linha 7)
- Import `InlineValueSkeleton` (linha 8)

**Verificar**: Se há chamadas de useSmartFallbackField no restante do arquivo

---

## Parte 4: useFinancialMetrics - Manter ou Simplificar?

**Decisão**: Manter parcialmente, mas refatorar para priorizar dados do banco.

O banco agora traz:
- `growth_intelligence_section.financial_metrics` (MRR, ARR, ROI, break-even, LTV/CAC, payback)
- `growth_intelligence_section.financial_scenarios` (cenários prontos)
- `growth_intelligence_section.year_evolution` (evolução anual)

**Refatorar useFinancialMetrics.ts**:
1. **Priorizar** valores numéricos diretos de `financial_metrics` (n8n v1.7.0+)
2. **Eliminar** fallbacks de cálculo local quando dados do banco existirem
3. **Manter** apenas formatação e cálculos visuais (progresso, comparações)

**Componentes que usam useFinancialMetrics**:
- `ReportHero.tsx` - LTV/CAC, Payback (manter, formata dados)
- `FinancialReturnSection.tsx` - Cenários, J-Curve, métricas (manter, usa projection_data do banco)
- `GrowthPotentialSection.tsx` - Métricas de progresso (manter, cálculo visual)
- `ComparableSuccessesSection.tsx` - TAM comparison (manter, cálculo visual)
- `ExecutiveVerdict.tsx` - Sync de texto (manter, formatação)

---

## Parte 5: Checklist de Verificação Pós-Implementação

Para cada componente alterado, verificar:

- [ ] Não há import de `useSmartFallbackField`
- [ ] Não há import de `useFallbackAgent`
- [ ] Não há import de `fallbackConfig`
- [ ] Dados vêm de `reportData` ou `report` (contexto)
- [ ] Campos ausentes mostram "..." (não erro, não skeleton após loading)
- [ ] Skeleton só aparece durante `isLoading` inicial
- [ ] Nenhum cálculo de métricas financeiras (ROI, LTV, etc.) que o banco já fornece
- [ ] Formatação de moeda/% permitida

---

## Parte 6: Ordem de Execução

1. **Deletar arquivos** (Parte 1)
2. **Simplificar ReportContext** (Parte 2)
3. **Refatorar useFinancialMetrics** (Parte 4)
4. **Simplificar componentes** na ordem:
   - ReportHero (crítico - é o hero)
   - ExecutiveVerdict
   - NextStepsSection
   - InvestmentSection
   - MarketingIntelligenceSection
   - CompetitorsDifferentiationSection
   - FinancialReturnSection
   - GrowthPotentialSection
   - ComparableSuccessesSection
   - PivotScenariosSection
   - SuccessMetricsSection
   - ResourceRequirementsSection
   - ExecutionPlanSection
5. **Testar dashboard completo**
6. **Verificar console** - nenhum erro de undefined

---

## Seção Técnica

### Padrão de código para leitura de dados

```tsx
// ANTES (com SmartFallback)
const { value: score, isLoading } = useSmartFallbackField({
  fieldPath: "hero_score_section.score",
  currentValue: heroScoreData?.score,
});

// DEPOIS (direto do banco)
const score = heroScoreData?.score ?? null;
// Na UI:
<span>{score !== null ? score : "..."}</span>
```

### Padrão para formatação

```tsx
// Permitido: formatação de moeda
const formatCurrency = (cents: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(cents / 100);

// Permitido: cálculo visual (barra de progresso)
const progress = targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;

// NÃO permitido: recalcular LTV quando banco já tem
// const ltv = arpu / (churnMonthly / 100); ❌
// Usar: financial_metrics.ltv_used ✓
```

### Estrutura de dados do banco (referência)

```typescript
// tb_pms_reports.hero_score_section
{ score: number, tagline: string }

// tb_pms_reports.summary_section  
{ verdict: string, verdict_summary: string }

// tb_pms_reports.growth_intelligence_section.financial_metrics
{ 
  mrr_month_12: number,
  arr_year_1: number,
  roi_year_1: number,
  break_even_months: number,
  payback_months: number,
  ltv_cac_ratio: number,
  arpu_used: number,
  ltv_used: number,
  cac_used: number
}

// tb_pms_reports.growth_intelligence_section.financial_scenarios
[{ name: string, mrrMonth12: number, arrYear1: number, breakEven: number, probability: string }]
```
