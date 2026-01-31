
# Plano: Corrigir Validação do Banner Data Quality Notice

## Problema Identificado

O banner "Data Quality Notice" está exibindo alertas falsos porque a função `checkDataQuality()` em `src/lib/dataQualityUtils.ts` valida estruturas de dados que:

1. **Não correspondem à estrutura real do n8n** (ex: espera `competitors` como array, mas é objeto)
2. **Valida campos que NÃO são usados na UI** (ex: `benchmark_section.market_benchmarks`)
3. **Usa critérios incorretos** (ex: `score === 0` como inválido quando 0 pode ser válido)

## Mudanças Necessárias

### 1. `hero_score_section` (linhas 76-87)
**Problema**: Trata `score === 0` como erro  
**Correção**: Apenas `null` ou `undefined` é erro

```typescript
// DE:
if (typeof heroScore.score !== 'number' || heroScore.score === 0)

// PARA:
if (typeof heroScore.score !== 'number')
```

### 2. `competitive_analysis_section` (linhas 264-276)
**Problema**: Espera `competitors` como array, mas n8n envia como objeto `{competitor_1: {...}, competitor_2: {...}}`  
**Correção**: Verificar se é objeto com chaves ou array

```typescript
// DE:
const competitors = competitive.competitors as unknown[] | undefined;
if (!competitors || competitors.length === 0)

// PARA:
const competitors = competitive.competitors;
const hasCompetitors = Array.isArray(competitors)
  ? competitors.length > 0
  : (competitors && typeof competitors === 'object' && Object.keys(competitors).length > 0);
if (!hasCompetitors)
```

### 3. `icp_intelligence_section` (linhas 295-307)
**Problema**: Verifica apenas `primary_personas`, mas a UI também usa `persona` e `demographics`  
**Correção**: Aceitar estrutura completa (persona + demographics OU primary_personas)

```typescript
// DE:
const personas = icp.primary_personas as unknown[] | undefined;
if (!personas || personas.length === 0)

// PARA:
const hasPersonas = icp.primary_personas && (icp.primary_personas as unknown[]).length > 0;
const hasLegacyPersona = icp.persona && typeof icp.persona === 'object';
const hasDemographics = icp.demographics && typeof icp.demographics === 'object';
if (!hasPersonas && !hasLegacyPersona && !hasDemographics)
```

### 4. `price_intelligence_section` (linhas 326-337)
**Problema**: Verifica `pricing_strategy` que NÃO é usado na UI  
**Correção**: Verificar `unit_economics` que É usado na UI via `useFinancialMetrics`

```typescript
// DE:
if (!price.pricing_strategy)

// PARA:
const hasUnitEconomics = price.unit_economics && typeof price.unit_economics === 'object';
const hasRecommendedModel = price.recommended_model && String(price.recommended_model).trim() !== '';
if (!hasUnitEconomics && !hasRecommendedModel)
```

### 5. `paid_media_intelligence_section` (linhas 356-368)
**Problema**: Verifica `channels` que NÃO existe - o campo é `channel_recommendations`, mas também NÃO é usado na UI visível  
**Correção**: Verificar `performance_targets` e `budget_strategy` que SÃO usados via `useFinancialMetrics`

```typescript
// DE:
const channels = paidMedia.channels as unknown[] | undefined;
if (!channels || channels.length === 0)

// PARA:
const hasPerformanceTargets = paidMedia.performance_targets && typeof paidMedia.performance_targets === 'object';
const hasBudgetStrategy = paidMedia.budget_strategy && typeof paidMedia.budget_strategy === 'object';
if (!hasPerformanceTargets && !hasBudgetStrategy)

// TAMBÉM: Mudar mensagem de "Paid media channels list is empty" para "Paid media targets are missing"
```

### 6. `growth_intelligence_section` (linhas 387-398)
**Problema**: Verifica apenas `growth_targets`, mas a UI usa principalmente `financial_metrics`  
**Correção**: Aceitar `financial_metrics` OU `growth_targets`

```typescript
// DE:
if (!growth.growth_targets)

// PARA:
const hasFinancialMetrics = growth.financial_metrics && typeof growth.financial_metrics === 'object';
const hasGrowthTargets = growth.growth_targets && typeof growth.growth_targets === 'object';
if (!hasFinancialMetrics && !hasGrowthTargets)

// TAMBÉM: Mudar mensagem para "Financial metrics and growth targets are missing"
```

### 7. `benchmark_section` (linhas 404-429)
**Problema**: Valida esta seção inteira que NÃO é usada na UI (é 100% interno do n8n)  
**Correção**: **REMOVER COMPLETAMENTE** a validação de `benchmark_section`

```typescript
// DELETAR linhas 401-429 completamente
// ========================================
// 10. BENCHMARK SECTION
// ========================================
// (TUDO REMOVIDO - benchmark_section é interno do n8n, não aparece na UI)
```

### 8. `opportunity_section` - demand_signals (linhas 185-221)
**Problema**: Verifica `demand_signals.monthly_searches_numeric` que nem sempre existe  
**Correção**: Verificar se existe texto `monthly_searches` OU campos no root do opportunity

```typescript
// A validação de demand_signals é muito restritiva
// Remover verificação de monthly_searches_numeric pois o campo texto já é suficiente
```

---

## Seção Técnica

### Arquivo a Modificar
- `src/lib/dataQualityUtils.ts`

### Estrutura Real do Banco (n8n v1.7.0+)

| Seção | Campo Verificado | Estrutura Real |
|-------|------------------|----------------|
| `competitive_analysis` | `competitors` | `{competitor_1: {...}, competitor_2: {...}}` (objeto) |
| `icp_intelligence` | `primary_personas` | Array, MAS também usa `persona` + `demographics` |
| `price_intelligence` | `pricing_strategy` | NÃO USADO - UI usa `unit_economics` |
| `paid_media` | `channels` | NÃO EXISTE - campo é `channel_recommendations` |
| `growth_intelligence` | `growth_targets` | Usado, MAS `financial_metrics` é prioridade |
| `benchmark_section` | `market_benchmarks` | **0% usado na UI** - remover validação |

### Resumo das Ações

1. **Linha 76**: Remover `|| heroScore.score === 0` da condição
2. **Linhas 264-276**: Aceitar `competitors` como objeto ou array
3. **Linhas 295-307**: Aceitar `persona` + `demographics` além de `primary_personas`
4. **Linhas 326-337**: Trocar `pricing_strategy` por `unit_economics` ou `recommended_model`
5. **Linhas 356-368**: Trocar `channels` por `performance_targets` ou `budget_strategy`
6. **Linhas 387-398**: Aceitar `financial_metrics` OU `growth_targets`
7. **Linhas 401-429**: **DELETAR** validação de `benchmark_section` completamente
8. **Linhas 185-221**: Simplificar validação de demand_signals

### Resultado Esperado

Após estas correções:
- ✅ Banner não aparecerá quando os dados do n8n estão completos
- ✅ Banner aparecerá apenas para dados realmente faltantes
- ✅ Mensagens de erro serão precisas e acionáveis
- ✅ Nenhum alerta falso por estruturas de dados diferentes
