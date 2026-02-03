
# Correção: CAGR 0.2% vs 17.7% - ExecutiveSnapshotCard

## Problema Identificado

O campo `market_growth_rate_numeric` é armazenado em **formato decimal** (0.177 = 17.7%), mas a função `formatPercentage()` não converte corretamente:

| Campo | Valor no DB | Exibição Atual | Correto |
|-------|-------------|----------------|---------|
| `market_growth_rate_numeric` | `0.177` | `0.2%` | `17.7%` |
| `market_growth_rate` | `"17.7% CAGR"` | - | `17.7%` |

## Escopo

Como ambas as páginas (Dashboard e Shared Report) usam o mesmo componente `BusinessPlanTab` → `ExecutiveSnapshotCard`, a correção será aplicada **uma única vez** e refletirá em ambos os locais.

## Solução

Atualizar a função `formatPercentage()` para detectar valores decimais (< 1) e multiplicar por 100 antes de formatar.

## Arquivo a Modificar

**`src/components/planningmysaas/dashboard/businessplan/ExecutiveSnapshotCard.tsx`**

### Função formatPercentage (linhas 37-41)

**Antes:**
```typescript
const formatPercentage = (value: string | number | null | undefined): string => {
  if (!value) return "...";
  if (typeof value === "number") return `${value.toFixed(1)}%`;
  return value;
};
```

**Depois:**
```typescript
const formatPercentage = (value: string | number | null | undefined): string => {
  if (!value) return "...";
  if (typeof value === "number") {
    // Se o valor for decimal (< 1), multiplica por 100 para converter para porcentagem
    // Ex: 0.177 → 17.7%
    const percentage = value < 1 ? value * 100 : value;
    return `${percentage.toFixed(1)}%`;
  }
  // Remove sufixos como " CAGR" do string para manter consistência visual
  return value.replace(/\s*CAGR\s*/i, '');
};
```

## Resultado Esperado

| Página | Antes | Depois |
|--------|-------|--------|
| Dashboard - Executive Snapshot | 0.2% | 17.7% |
| Shared Report - Executive Snapshot | 0.2% | 17.7% |
| Dashboard - Market Analysis | 17.7% CAGR | 17.7% CAGR (sem mudança) |

## Observação Técnica

A lógica `value < 1` é segura porque taxas de crescimento de mercado realistas raramente excedem 100% ao ano. Se o valor já vier como número inteiro (ex: 17.7), será formatado diretamente.
