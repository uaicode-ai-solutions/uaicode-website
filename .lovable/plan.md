

# Ajuste no Menu Lateral - Mover Leads para Marketing

## Resumo

Mover o item "Lead Management" do subsistema Sales para Marketing e renomear para "Leads".

## Alteracao

### Arquivo: `src/components/hero/HeroSidebar.tsx`

Na array `sidebarItems` (linha 18), alterar o item `sales-leads`:

**De:**
```
{ id: "sales-leads", label: "Lead Management", icon: UserCheck, subsystem: "sales" }
```

**Para:**
```
{ id: "sales-leads", label: "Leads", icon: UserCheck, subsystem: "marketing" }
```

O `id` permanece `"sales-leads"` para nao quebrar nenhuma referencia existente (como o `defaultView` no `HeroDash.tsx` e a query param `view=sales-leads`). Apenas o label e o subsystem mudam.

