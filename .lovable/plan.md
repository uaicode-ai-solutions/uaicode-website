
# Manter nome PlanningMySaaS mas remover links

## Alteracoes

### 1. Rodape (SharedReportFooter.tsx)
Recolocar o nome "PlanningMySaaS" no texto do rodape, mas como texto simples (sem link). Manter o link externo para uaicode.ai.

**Resultado:**
```
Powered by PlanningMySaaS | uaicode.ai
```
- "PlanningMySaaS" sera texto puro com estilo accent (sem `<Link>` ou `<a>`)
- "uaicode.ai" continua como link externo

### 2. Cabecalho (SharedReportHeader.tsx)
O logo + nome "PlanningMySaaS" no cabecalho esta envolvido em um `<Link to="/planningmysaas">`. Trocar o `<Link>` por uma `<div>` simples, mantendo o visual identico mas sem navegacao.

## Arquivos Alterados
1. `src/components/planningmysaas/public/SharedReportFooter.tsx` -- recolocar "PlanningMySaaS" como texto, sem link
2. `src/components/planningmysaas/public/SharedReportHeader.tsx` -- trocar `<Link>` do logo por `<div>`
