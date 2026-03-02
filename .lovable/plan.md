
# Atualizar Rodapé do Relatório

## Alteração
**Arquivo:** `src/components/planningmysaas/public/SharedReportFooter.tsx`

Substituir o texto "Powered by PlanningMySaaS" (com link para `/planningmysaas`) por "Powered by UAICode" mantendo apenas o link externo para `uaicode.ai`. Remover o link interno para a rota antiga.

**Antes:**
```
Powered by PlanningMySaaS | uaicode.ai
```

**Depois:**
```
Powered by uaicode.ai
```

O link para `uaicode.ai` continua abrindo em nova aba. O separador "|" e o link para `/planningmysaas` serão removidos.
