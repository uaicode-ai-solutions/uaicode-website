

# Plano: Unificar Valores de Marketing e Investment Ask

## Resumo das Mudanças

O objetivo é padronizar a exibição de valores de investimento entre as 3 telas:
1. **Report > The Investment > Marketing Investment** - Fixar todos os serviços selecionados
2. **Business Plan > Investment Ask** - Mostrar valor combinado MVP + Marketing anual
3. **Next Steps > Complete Launch Bundle** - Usar valor de marketing máximo automaticamente

---

## 1. Report > Marketing Investment (Display Only)

### Situação Atual
- Cards de serviços são clicáveis e permitem seleção/deseleção
- O valor em "Your Marketing Investment" muda conforme seleção do usuário

### Mudança Proposta
- **Remover interatividade** dos cards de serviço
- **Fixar todos os serviços como selecionados** visualmente (mas sem estilo de seleção ativa)
- **Exibir valor total** (~$6,000/mês Uaicode = ~$72K/ano)

### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/planningmysaas/dashboard/marketing/MarketingServiceSelector.tsx` | Adicionar prop `readOnly` para desabilitar interatividade |
| `src/components/planningmysaas/dashboard/sections/InvestmentSection.tsx` | Passar `readOnly={true}` e calcular totais com todos os serviços |

### Detalhes Técnicos

```typescript
// MarketingServiceSelector.tsx - Adicionar prop readOnly
interface MarketingServiceSelectorProps {
  onSelectionChange?: (selectedIds: string[], totals: MarketingTotals) => void;
  defaultSelectRecommended?: boolean;
  readOnly?: boolean; // NEW: Disable selection
}

// ServiceCard - Quando readOnly, não mostrar checkbox e não permitir clique
// Estilo: bg-muted/30 (como "não selecionado" mas com todos os dados)
```

```typescript
// InvestmentSection.tsx - Selecionar todos automaticamente
// Quando readOnly, inicializar com todos os service_ids
useEffect(() => {
  if (services.length > 0 && !initialized) {
    const allServiceIds = services.map(s => s.service_id);
    setSelectedMarketingIds(allServiceIds);
    // Calculate totals with all services
    const totals = calculateMarketingTotals(allServiceIds, services);
    setMarketingTotals(totals);
  }
}, [services]);
```

---

## 2. Business Plan > Investment Ask

### Situação Atual
- **MVP Only**: $145K
- **MVP + Marketing Bundle**: $101.5K (apenas preço do MVP com desconto)
- Badge mostra "Save 30%" (desconto Uaicode)

### Mudança Proposta

**Card MVP Only:**
- Manter preço $145K
- Adicionar badges com itens de "What's Included" (Full source code, Responsive design, etc.)
- Remover seção "What's Included" separada (move para badges)

**Card MVP + Marketing Bundle:**
- Valor: $145K + $72K = **$217K** (MVP + Marketing anual)
- Badge: "Save X% vs Traditional" (comparar com agências tradicionais)
- Manter lista de serviços de marketing inclusos

### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/planningmysaas/dashboard/businessplan/InvestmentAskCard.tsx` | Refatorar ambos os cards |

### Detalhes Técnicos

```typescript
// Importar contexto para acessar marketingTotals
import { useReportContext } from "@/contexts/ReportContext";

// Obter marketing annual total (todos os serviços)
const { marketingTotals } = useReportContext();
const marketingAnnualCents = marketingTotals.uaicodeTotal * 12;

// Valor do bundle = MVP full price + Marketing anual
const bundleTotalCents = totalCents + marketingAnnualCents;

// Calcular savings vs Traditional
// MVP Traditional: traditionalMaxCents (~$290K)
// Marketing Traditional: marketingTotals.traditionalMaxTotal * 12 (~$210K)
const traditionalTotalCents = traditionalMaxCents + (marketingTotals.traditionalMaxTotal * 12);
const savingsVsTraditionalPercent = Math.round(
  ((traditionalTotalCents - bundleTotalCents) / traditionalTotalCents) * 100
);
```

### Layout Visual Proposto

```
┌─────────────────────────────────────────────────────────────┐
│  MVP Only                                                    │
│  $145K                                                       │
│  [Save 50% vs Traditional]                                  │
│                                                             │
│  [Full Source] [Responsive] [API Integrations] [30-day]    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  MVP + Marketing Bundle                    [BEST VALUE]     │
│  $217K                                                       │
│  [Save 57% vs Traditional]                                  │
│                                                             │
│  Includes monthly marketing:                                │
│  ✓ Project Manager  ✓ Paid Media  ✓ Digital Media          │
│  ✓ Social Media     ✓ CRM Pipeline                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Next Steps > Complete Launch Bundle

### Situação Atual
- Usa `marketingTotals` do contexto (vem da seleção do Report)
- Se o usuário desmarcar serviços no Report, o valor aqui diminui

### Mudança Proposta
- **Garantir que marketingTotals sempre contenha todos os serviços**
- Como o Report agora será `readOnly` com todos os serviços, o valor será automaticamente o máximo (~$72K/ano)

### Arquivos a Modificar

Nenhuma mudança direta necessária - a mudança no InvestmentSection.tsx resolve automaticamente.

### Validação
- Verificar que `marketingAnnualUaicode` sempre reflete todos os serviços
- O valor exibido deve ser consistente com Business Plan

---

## Resumo de Arquivos

| Arquivo | Alterações |
|---------|------------|
| `MarketingServiceSelector.tsx` | Adicionar prop `readOnly`, ajustar estilo para display-only |
| `InvestmentSection.tsx` | Passar `readOnly={true}`, inicializar com todos os serviços |
| `InvestmentAskCard.tsx` | Refatorar cards: adicionar badges no MVP Only, calcular bundle com marketing anual |

---

## Checklist de Implementação

1. [ ] Adicionar prop `readOnly` em `MarketingServiceSelector.tsx`
2. [ ] Atualizar `ServiceCard` para estilo display-only quando `readOnly`
3. [ ] Modificar `InvestmentSection.tsx` para sempre selecionar todos os serviços
4. [ ] Importar `useReportContext` em `InvestmentAskCard.tsx`
5. [ ] Calcular `bundleTotalCents` = MVP + Marketing anual
6. [ ] Calcular `savingsVsTraditional` para badge do bundle
7. [ ] Adicionar badges de "What's Included" no card MVP Only
8. [ ] Remover seção "What's Included" separada (agora são badges)
9. [ ] Testar valores em todas as 3 telas (Report, Business Plan, Next Steps)

