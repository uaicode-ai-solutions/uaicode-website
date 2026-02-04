
# Atualização da Aba no Sample Report

## Mudança Solicitada

Trocar o nome da primeira aba na seção Sample Report de "Viability Report" para "Market Analysis".

## Arquivo a Modificar

**`src/components/planningmysaas/PmsSampleReport.tsx`** - linha 17

### De:
```tsx
const tabs = [
  { id: "report", label: "Viability Report", icon: FileText },
  { id: "businessplan", label: "Business Plan", icon: Briefcase },
  { id: "nextsteps", label: "Next Steps", icon: Rocket },
];
```

### Para:
```tsx
const tabs = [
  { id: "report", label: "Market Analysis", icon: FileText },
  { id: "businessplan", label: "Business Plan", icon: Briefcase },
  { id: "nextsteps", label: "Next Steps", icon: Rocket },
];
```

## Contexto

Esta mudança alinha a nomenclatura da seção Sample Report com as abas do dashboard real, que agora usa "Market Analysis" em vez de "Report", mantendo consistência em toda a landing page e produto.

## Resultado Visual

```text
┌──────────────────┬─────────────────┬─────────────┐
│ Market Analysis  │ Business Plan   │ Next Steps  │
│    (ativo)       │                 │             │
└──────────────────┴─────────────────┴─────────────┘
```
