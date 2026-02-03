

# Plano: Corrigir FinancialProjectionsCard para Normalizar Cenários

## Problema Identificado

O componente `FinancialProjectionsCard.tsx` no Business Plan está quebrando porque:

1. **Banco de dados** retorna cenário com `name: "Base"`
2. **JCurveChart** espera `name: "Realistic"`
3. O mapeamento atual (linhas 33-40) assume que o nome já vem correto
4. O chart falha silenciosamente retornando array vazio

## Solução

Replicar a lógica do `FinancialReturnSection.tsx` que já funciona:

```text
ANTES (FinancialProjectionsCard):
┌─────────────────────────────────────────────────────┐
│  financialScenarios.map(s => ({                    │
│    name: s.name as 'Conservative' | 'Realistic'...  │ ← Assume nome correto
│  }))                                                │
└─────────────────────────────────────────────────────┘

DEPOIS (Corrigido):
┌─────────────────────────────────────────────────────┐
│  1. Buscar cada cenário pelo nome correto:         │
│     - conservativeDb = find(s => s.name === 'Conservative')
│     - baseDb = find(s => s.name === 'Base')        │ ← Busca "Base"
│     - optimisticDb = find(s => s.name === 'Optimistic')
│                                                     │
│  2. Construir array com nomes normalizados:        │
│     - { name: "Conservative", ...conservativeDb }   │
│     - { name: "Realistic", ...baseDb }             │ ← Renomeia!
│     - { name: "Optimistic", ...optimisticDb }      │
│                                                     │
│  3. Filtrar cenários com valores null              │
└─────────────────────────────────────────────────────┘
```

## Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/planningmysaas/dashboard/businessplan/FinancialProjectionsCard.tsx` | Normalizar nomes de cenários |

## Código Corrigido (Linhas 32-40)

```typescript
// Build scenarios for J-Curve - NORMALIZE "Base" to "Realistic"
const dbScenarios = financialMetrics.financialScenarios || [];
const conservativeDb = dbScenarios.find(s => s.name === 'Conservative');
const baseDb = dbScenarios.find(s => s.name === 'Base');
const optimisticDb = dbScenarios.find(s => s.name === 'Optimistic');

// Build chart scenarios with normalized names
const rawScenarios = [
  {
    name: "Conservative" as const,
    mrrMonth12: conservativeDb?.mrrMonth12 ?? null,
    breakEvenMonths: conservativeDb?.breakEven ?? null,
    probability: conservativeDb?.probability ?? "25%",
  },
  {
    name: "Realistic" as const, // UI name for "Base" from DB
    mrrMonth12: baseDb?.mrrMonth12 ?? null,
    breakEvenMonths: baseDb?.breakEven ?? null,
    probability: baseDb?.probability ?? "50%",
  },
  {
    name: "Optimistic" as const,
    mrrMonth12: optimisticDb?.mrrMonth12 ?? null,
    breakEvenMonths: optimisticDb?.breakEven ?? null,
    probability: optimisticDb?.probability ?? "25%",
  },
];

// Filter out scenarios with null values
const scenarios = rawScenarios
  .filter(s => s.mrrMonth12 !== null && s.breakEvenMonths !== null)
  .map(s => ({
    name: s.name,
    mrrMonth12: s.mrrMonth12!,
    breakEvenMonths: s.breakEvenMonths!,
    probability: s.probability,
  }));
```

## Verificação Adicional

Também validar se as métricas do grid (Year 1 ARR, Year 2 ARR, Break-even, LTV/CAC) estão aparecendo. Se não:

- Verificar se `growth?.financial_metrics` existe no banco
- Fallback para `financialMetrics` do hook já está implementado

## Resultado Esperado

1. J-Curve chart renderiza com 3 cenários (Conservative, Realistic, Optimistic)
2. Métricas do grid aparecem (ARR, Break-even, LTV/CAC)
3. ROI Year 1/2 aparecem

## Checklist de Implementação

1. [ ] Atualizar lógica de mapeamento de cenários no FinancialProjectionsCard
2. [ ] Buscar cada cenário pelo nome correto do banco ("Base")
3. [ ] Renomear "Base" → "Realistic" para compatibilidade com JCurveChart
4. [ ] Adicionar filtro para remover cenários com valores null
5. [ ] Testar no dashboard com report existente
6. [ ] Verificar que J-Curve chart renderiza corretamente

