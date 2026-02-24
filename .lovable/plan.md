
# Refatoracao do NextStepsSection -- Card Unico com 3 Entregas

## Resumo

Substituir os 2 cards atuais (MVP Flash Deal + Complete Launch Bundle) por um **unico card "Your Complete SaaS Partnership"** que apresenta as 3 entregas da UaiCode e uma tabela de precos com 3 niveis de desconto baseados no timing de fechamento.

## O que sera removido

- Card 1 "MVP Flash Deal" (linhas 196-349)
- Card 2 "Complete Launch Bundle" (linhas 351-513)
- Secao "Marketing Billing Notice" (linhas 516-529)
- Calculos separados de marketing mensal/anual (`marketingMonthlyUaicode`, `marketingAnnualUaicode`, `suggestedPaidMedia`, etc.)
- Calculos de `mvpDevDiscountedPrice`, `mvpMarketingDiscountedPrice` e `mvpMarketingSavings`
- Referencia a `discountStrategy.bundle` e `discountStrategy.month`

## Novo Layout do Card

```text
+--------------------------------------------------------------+
|  [Star] YOUR COMPLETE SAAS PARTNERSHIP        [Tier Badge]    |
|                                                                |
|  ENTREGA 1: Strategic Meeting                 [COMPLETED]     |
|  -> AI-Powered Business Plan                                  |
|  -> Personalized Investment Proposal                          |
|                                                                |
|  ENTREGA 2: MVP + Marketing Launch Plan                       |
|  -> Complete SaaS Application                                 |
|  -> Branding & Brand Identity                                 |
|  -> Brand Manual                                              |
|  -> Optimized Landing Page                                    |
|  -> Paid Media Strategy                                       |
|  -> 8-12 Ad Creatives                                         |
|                                                                |
|  ENTREGA 3: Post-Launch Support (XX days)                     |
|  -> Bug fixes & performance monitoring                        |
|  -> Feature enhancements & technical guidance                  |
|  -> Marketing campaign metrics monitoring                     |
|  -> Monthly extension available after period                  |
|                                                                |
|  +---------------------------------------------------------+  |
|  |  INVESTMENT                                              |  |
|  |                                                         |  |
|  |  [Zap] Close Today      $XX,XXX  (25% OFF) [BEST DEAL] |  |
|  |  [Star] Close in 7 days $XX,XXX  (15% OFF)              |  |
|  |  [---] After 7 days     $XX,XXX  (Full Price)           |  |
|  +---------------------------------------------------------+  |
|                                                                |
|  Full source code ownership | 12 months hosting included      |
|                                                                |
|  [  CLOSE THE DEAL  ]         [  Send Proposal  ]             |
+--------------------------------------------------------------+
```

## Detalhes Tecnicos

### Dados utilizados (sem mudancas nas fontes)

| Dado | Fonte |
|------|-------|
| Preco cheio | `section_investment.investment_one_payment_cents` (ja inclui marketing) |
| Desconto 25% (flash) | `discountStrategy.flash_24h.price_cents` |
| Desconto 15% (week) | `discountStrategy.week.price_cents` |
| Tier do MVP | `sectionInvestment.mvp_tier` |
| Dias de suporte | `SUPPORT_DAYS_BY_TIER[mvpTier]` (45/90/120) |

### Calculos simplificados

```text
fullPrice = mvpPriceCents / 100  (preco unico ja com marketing embutido)
flashPrice = discountStrategy.flash_24h.price_cents / 100
weekPrice = discountStrategy.week.price_cents / 100
flashSavings = fullPrice - flashPrice
weekSavings = fullPrice - weekPrice
```

### Imports removidos

- `AlertCircle` (nao usado mais no Marketing Billing Notice)
- Referencia a `marketingTotals` do `useReportContext`

### Imports mantidos

- `Star`, `Zap`, `Check`, `Sparkles`, `Calendar`, `FileText`, `PlayCircle`, `Package`
- `getSectionInvestment`, `getDiscountStrategy`, `getDiscountSavings`
- `Badge`, `Button`, `Card`, `CardContent`, `InfoTooltip`

### Arquivo modificado

`src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` -- reescrita completa do JSX (linhas 176-531) mantendo a mesma interface de props e a mesma estrutura de export.
