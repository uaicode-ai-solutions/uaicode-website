
# Plano: Remover Seções Redundantes da Landing Page

## Objetivo

Simplificar a landing page `/planningmysaas` removendo duas seções que adicionam comprimento sem valor incremental significativo.

---

## Seções a Remover

| Seção | Componente | Motivo |
|-------|------------|--------|
| **Everything Included** | `PmsFeatures` | Redundante com How It Works |
| **Loved by Founders** | `PmsTestimonials` | Reduzir extensão da página |

---

## Estrutura Final

```
PmsHero
    ↓
PmsTrustedBy
    ↓
PmsPainPoints
    ↓
PmsHowItWorks
    ↓
PmsSampleReport
    ↓
PmsPricing
    ↓
PmsFaq
    ↓
PmsFooter
```

---

## Alteração

**Arquivo:** `src/pages/PlanningMySaas.tsx`

Remover imports e componentes:
- `PmsFeatures`
- `PmsTestimonials`

---

## Código Atual vs Novo

**Antes:**
```tsx
<PmsHowItWorks />
<PmsSampleReport />
<PmsFeatures />        // ← Remover
<PmsTestimonials />    // ← Remover
<PmsPricing />
```

**Depois:**
```tsx
<PmsHowItWorks />
<PmsSampleReport />
<PmsPricing />
```

---

## Impacto

- **Arquivos alterados:** 1 (`PlanningMySaas.tsx`)
- **Linhas removidas:** ~4 (2 imports + 2 componentes)
- **Resultado:** Landing page mais concisa e focada na conversão
- **Componentes mantidos:** Os arquivos `PmsFeatures.tsx` e `PmsTestimonials.tsx` permanecem no projeto caso queira reativar futuramente
