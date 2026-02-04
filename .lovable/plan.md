

# Alterações de Texto no Dashboard

## Mudanças Solicitadas

| Local | Atual | Novo |
|-------|-------|------|
| Cabeçalho (header) | "Viability Report" | "Viability Analysis" |
| Aba 1 | "Report" | "Market Analysis" |
| Aba 2 | "My Plan" | "Business Plan" |

## Arquivo a Modificar

**`src/pages/PmsDashboard.tsx`**

### 1. Cabeçalho (linha 357)

```tsx
// De:
<p className="text-xs text-muted-foreground">Viability Report</p>

// Para:
<p className="text-xs text-muted-foreground">Viability Analysis</p>
```

### 2. Tabs (linhas 484-485)

```tsx
// De:
{ id: "report", label: "Report", icon: FileText },
{ id: "businessplan", label: "My Plan", icon: Briefcase },

// Para:
{ id: "report", label: "Market Analysis", icon: FileText },
{ id: "businessplan", label: "Business Plan", icon: Briefcase },
```

## Resultado Visual

**Cabeçalho:**
```text
[Logo] Nome do Projeto
       Viability Analysis  ← atualizado
```

**Tabs:**
```text
┌─────────────────┬─────────────────┬─────────────┐
│ Market Analysis │ Business Plan   │ Next Steps  │
│    (ativo)      │                 │             │
└─────────────────┴─────────────────┴─────────────┘
```

