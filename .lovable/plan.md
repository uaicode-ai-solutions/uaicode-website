

# Alterar Nome da Aba: Business Plan → My Plan

## Resumo
Alterar o label da aba "Business Plan" para "My Plan" no dashboard de relatórios.

---

## Alteração

**Arquivo:** `src/pages/PmsDashboard.tsx`

**Linha 448** - Mudar o label de `"Business Plan"` para `"My Plan"`:

```typescript
// Antes:
{ id: "businessplan", label: "Business Plan", icon: Briefcase },

// Depois:
{ id: "businessplan", label: "My Plan", icon: Briefcase },
```

---

## Impacto
- Afeta apenas o texto visível na aba do dashboard
- O `id` permanece `"businessplan"` para manter compatibilidade com a lógica existente
- Nenhuma outra alteração necessária

