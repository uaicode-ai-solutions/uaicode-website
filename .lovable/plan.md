

# Plano: Adicionar Bundle Marketing no InvestmentAskCard

## Contexto

O usuário quer mostrar no card "Investment Ask" (Business Plan) uma opção para o usuário ver o investimento caso opte por contratar marketing junto com o MVP.

## Dados Disponíveis

### Dados já no banco (section_investment)
| Campo | Valor Exemplo |
|-------|---------------|
| `investment_one_payment_cents` | $145,000 (MVP only) |
| `discount_strategy.bundle.price_cents` | $101,500 (MVP + Marketing 30% off) |
| `discount_strategy.bundle.percent` | 30% |
| `discount_strategy.bundle.name` | "MVP + Marketing Bundle" |
| `discount_strategy.bundle.bonus_support_days` | 30 |

### Serviços de Marketing (tb_pms_mkt_tier)
| Serviço | Uaicode/mês | Tradicional/mês |
|---------|-------------|-----------------|
| Project Manager | $1,200 | $6,000 |
| Paid Media Manager | $1,800 | $3,000 |
| Digital Media | $1,800 | $3,500 |
| Social Media | $900 | $2,000 |
| CRM Pipeline | $300 | $2,000 |

**Total mensal marketing (todos serviços recomendados):** ~$4,800/mês

## Solução

Adicionar uma seção "MVP + Marketing Bundle" abaixo do Total Investment atual, mostrando:

1. **Preço do Bundle** com desconto aplicado
2. **Economia vs comprar separado** 
3. **Serviços de marketing incluídos** (lista resumida)
4. **Bônus extra** (dias de suporte adicional)

## Layout Proposto

```
┌─────────────────────────────────────────────────────────────┐
│  Investment Ask                                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │  MVP Only                                               ││
│  │  $145K                                                   ││
│  │  [Save 50% vs Traditional]                              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  🚀 MVP + Marketing Bundle          [BEST VALUE]        ││
│  │  $101.5K                                                 ││
│  │  [Save 30% + 30 bonus support days]                     ││
│  │                                                          ││
│  │  Includes monthly marketing:                            ││
│  │  ✓ Project Manager  ✓ Paid Media  ✓ Digital Media      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  [Investment Breakdown]                                     │
│  [What's Included]                                          │
└─────────────────────────────────────────────────────────────┘
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/planningmysaas/dashboard/businessplan/InvestmentAskCard.tsx` | Adicionar seção de Bundle Marketing |

## Detalhes Técnicos

### 1. Extrair dados do discount_strategy.bundle

```typescript
// Extrair bundle do discount_strategy
const discountStrategy = investment.discount_strategy as DiscountStrategyMap | undefined;
const bundle = discountStrategy?.bundle;
const bundlePriceCents = bundle?.price_cents;
const bundlePercent = bundle?.percent;
const bundleBonusDays = bundle?.bonus_support_days;
```

### 2. Calcular economia do bundle

```typescript
const bundleSavingsCents = totalCents && bundlePriceCents 
  ? totalCents - bundlePriceCents 
  : 0;
```

### 3. Lista de serviços de marketing incluídos

Usar lista estática baseada nos serviços `is_recommended = true`:
- Project Manager
- Paid Media Manager
- Digital Media

### 4. UI do Bundle Card

- Background diferenciado (gradient verde/accent para destacar)
- Badge "BEST VALUE" ou "RECOMMENDED"
- Preço com desconto bem visível
- Lista compacta de serviços incluídos
- Bônus de support days destacado

## Resultado Esperado

1. Usuário vê duas opções claras de investimento
2. Bundle aparece destacado como "melhor valor"
3. Economia e benefícios extras ficam evidentes
4. Informação vem do banco (discount_strategy.bundle)

## Checklist de Implementação

1. [ ] Importar tipo DiscountStrategyMap de sectionInvestmentUtils
2. [ ] Extrair dados do bundle do discount_strategy
3. [ ] Adicionar seção visual do Bundle abaixo do MVP Only
4. [ ] Mostrar preço, desconto, economia e bônus
5. [ ] Listar serviços de marketing incluídos
6. [ ] Aplicar estilo diferenciado para destacar Bundle
7. [ ] Testar renderização com dados reais

