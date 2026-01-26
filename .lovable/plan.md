
# Plano: Reorganizar Steps da Tela de Loading por Coluna

## Objetivo

Reorganizar a ordem dos steps na tela de geração de relatório para que sejam exibidos **por coluna** (vertical) em vez de **por linha** (horizontal).

## Problema Atual

O grid CSS `grid-cols-2` renderiza os items na ordem natural do array (1→2→3→4...), resultando em:

```text
┌─────────────────────┬─────────────────────┐
│ 1. Investment       │ 2. Benchmarks       │
│ 3. Competitor       │ 4. Opportunity      │
│ 5. ICP              │ 6. Pricing          │
│ 7. Paid Media       │ 8. Growth           │
│ 9. Summary          │ 10. Final           │
└─────────────────────┴─────────────────────┘
```

## Resultado Desejado

Preenchimento por coluna (esquerda completa, depois direita):

```text
┌─────────────────────┬─────────────────────┐
│ 1. Investment       │ 6. Pricing          │
│ 2. Benchmarks       │ 7. Paid Media       │
│ 3. Competitor       │ 8. Growth           │
│ 4. Opportunity      │ 9. Summary          │
│ 5. ICP              │ 10. Final           │
└─────────────────────┴─────────────────────┘
```

## Solução

Há duas abordagens possíveis:

### Opção A: Reordenar o Array (Recomendada)
Reorganizar a ordem dos items no array `steps` para que, quando renderizados pelo grid row-by-row, apareçam visualmente por coluna.

Nova ordem do array: `[1, 6, 2, 7, 3, 8, 4, 9, 5, 10]`

### Opção B: Usar CSS Grid `grid-flow-col`
Usar `grid-flow-col` com `grid-rows-5` para forçar o preenchimento por coluna.

**Vou usar a Opção A** pois é mais simples e mantém compatibilidade com o layout responsivo (1 coluna no mobile).

## Alteração

### Arquivo: `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx`

Reorganizar o array `steps` (linhas 9-20) para a nova ordem que resulta no layout correto:

**De:**
```tsx
const steps = [
  { id: 1, label: "Investment analysis", icon: DollarSign, statusKey: "investment" },
  { id: 2, label: "Market benchmarks", icon: Target, statusKey: "benchmark" },
  { id: 3, label: "Competitor research", icon: BarChart3, statusKey: "competitors" },
  { id: 4, label: "Market opportunity", icon: TrendingUp, statusKey: "opportunity" },
  { id: 5, label: "Customer profiling (ICP)", icon: Users, statusKey: "icp" },
  { id: 6, label: "Pricing strategy", icon: Tag, statusKey: "price" },
  { id: 7, label: "Paid media analysis", icon: Megaphone, statusKey: "paid media" },
  { id: 8, label: "Growth projections", icon: Rocket, statusKey: "growth" },
  { id: 9, label: "Executive summary", icon: FileText, statusKey: "summary" },
  { id: 10, label: "Final scoring", icon: Trophy, statusKey: "hero score" },
];
```

**Para:**
```tsx
// Steps ordered for column-first display in 2-column grid
// Visual order: left column (1-5), right column (6-10)
// Array order: [1,6], [2,7], [3,8], [4,9], [5,10] for row-by-row grid rendering
const steps = [
  { id: 1, label: "Investment analysis", icon: DollarSign, statusKey: "investment" },
  { id: 6, label: "Pricing strategy", icon: Tag, statusKey: "price" },
  { id: 2, label: "Market benchmarks", icon: Target, statusKey: "benchmark" },
  { id: 7, label: "Paid media analysis", icon: Megaphone, statusKey: "paid media" },
  { id: 3, label: "Competitor research", icon: BarChart3, statusKey: "competitors" },
  { id: 8, label: "Growth projections", icon: Rocket, statusKey: "growth" },
  { id: 4, label: "Market opportunity", icon: TrendingUp, statusKey: "opportunity" },
  { id: 9, label: "Executive summary", icon: FileText, statusKey: "summary" },
  { id: 5, label: "Customer profiling (ICP)", icon: Users, statusKey: "icp" },
  { id: 10, label: "Final scoring", icon: Trophy, statusKey: "hero score" },
];
```

## Resultado Visual

```text
Desktop (2 colunas):
┌─────────────────────┬─────────────────────┐
│ 1. Investment    ✓  │ 6. Pricing          │
│ 2. Benchmarks    ✓  │ 7. Paid Media       │
│ 3. Competitor    ✓  │ 8. Growth           │
│ 4. Opportunity   ✓  │ 9. Summary          │
│ 5. ICP      (loading)│ 10. Final          │
└─────────────────────┴─────────────────────┘

Mobile (1 coluna):
┌─────────────────────┐
│ 1. Investment    ✓  │
│ 6. Pricing          │
│ 2. Benchmarks    ✓  │
│ ...                 │
└─────────────────────┘
```

**Nota sobre mobile:** No mobile o layout ficará um pouco diferente (alternando entre colunas), mas isso é aceitável já que os steps continuam seguindo a progressão numérica correta (1-10).

## Impacto

- **Nenhuma alteração de lógica**: Os IDs continuam os mesmos, apenas a ordem visual muda
- **Parsing de status continua funcionando**: O `parseCurrentStep` usa o número do step, não a posição no array
- **Responsividade mantida**: Layout de 1 coluna no mobile continua funcionando
