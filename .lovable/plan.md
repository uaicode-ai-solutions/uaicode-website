
# Plano: Atualizar Interface PaidMediaIntelligenceSection

## Objetivo
Adicionar o campo `calculated_metrics` à interface TypeScript para suportar os valores pré-calculados pelo n8n, eliminando a necessidade de cálculos no frontend.

## Arquivo a Modificar
`src/types/report.ts`

## Alterações

### 1. Adicionar interface `PaidMediaCalculatedMetrics`
Criar nova interface para tipar os valores calculados:

```typescript
export interface PaidMediaCalculatedMetrics {
  competitive_position?: {
    label: string;           // "Strong" | "Moderate" | "Emerging"
    percent: number;         // 0-100
    gaps_count: number;      // Número de gaps exploráveis
  };
  expected_roas_percent?: number;  // 300 = 3.0x
}
```

### 2. Atualizar `PaidMediaIntelligenceSection`
Adicionar o campo `calculated_metrics` e expandir `_metadata`:

```typescript
export interface PaidMediaIntelligenceSection {
  performance_targets?: { ... };
  budget_strategy?: { ... };
  channel_recommendations?: Array<{ ... }>;
  competitive_positioning?: { ... };
  ninety_day_plan?: { ... };
  
  // NOVO: Métricas pré-calculadas pelo n8n
  calculated_metrics?: PaidMediaCalculatedMetrics;
  
  // ATUALIZAR: Expandir _metadata
  _metadata?: {
    citations?: string[];
    citations_count?: number;
    raw_values?: {
      target_cac?: number;
      ltv_cac_ratio?: number;
      budget_monthly?: number | string;  // Suporta "$5,600" ou 5600
    };
    // NOVOS campos de versão
    parser_version?: string;
    calculator_version?: string;
    calculated_at?: string;
    input_type?: string;
    perplexity_model?: string;
    perplexity_cost?: number;
  };
}
```

## Benefícios

1. **Type Safety**: O TypeScript validará o acesso a `calculated_metrics.competitive_position`
2. **IntelliSense**: Autocompletar funcionará para os novos campos
3. **Eliminação de Cálculos**: Os componentes poderão usar valores do banco diretamente em vez de recalcular no frontend
4. **Compatibilidade**: Campos opcionais (`?`) garantem que registros antigos continuem funcionando

## Compatibilidade com UI

### Componentes que se beneficiarão:
- **MarketingIntelligenceSection.tsx**: Usar `calculated_metrics.competitive_position` e `expected_roas_percent`
- **PaidMediaCards.tsx**: Usar `budget_strategy.recommended_marketing_budget_monthly` diretamente

## Seção Técnica

### Localização da Mudança
- **Arquivo**: `src/types/report.ts`
- **Linhas**: 570-630 (interface `PaidMediaIntelligenceSection`)

### Impacto
- Nenhuma quebra de funcionalidade (campos são opcionais)
- Componentes existentes continuarão funcionando
- Novos componentes poderão usar os valores pré-calculados

### Próximos Passos (Fora do Escopo)
Após esta atualização, os componentes podem ser otimizados para consumir diretamente os `calculated_metrics` ao invés de recalcular no frontend.
