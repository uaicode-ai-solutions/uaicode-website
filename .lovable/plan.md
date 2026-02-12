
# Remover card B2B2C do Step 3 (Target Market)

## Mudança
Remover a opção "B2B2C" do array `marketTypes` no componente `StepTargetMarket.tsx`.

## Detalhes Técnicos

**Arquivo**: `src/components/planningmysaas/wizard/StepTargetMarket.tsx`

Remover o terceiro item do array `marketTypes` (linha 46):
```
{ id: "b2b2c", title: "B2B2C", description: "Business to Business to Consumer", icon: Users },
```

O array ficará apenas com B2B e B2C. O grid de 3 colunas (`grid-cols-3`) será ajustado para `grid-cols-2` para melhor layout com apenas 2 cards.
