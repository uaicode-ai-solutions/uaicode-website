

# Ordenar Itens do Menu em Ordem Alfabetica

## Resumo

Reorganizar os itens da array `sidebarItems` para que fiquem em ordem alfabetica dentro de cada subsistema.

## Alteracao

### Arquivo: `src/components/hero/HeroSidebar.tsx`

Reordenar a array `sidebarItems` (linhas 16-20). Atualmente:

```
1. admin-users   | User Management  | admin
2. mkt-social    | Social Media     | marketing
3. sales-leads   | Leads            | marketing
4. sales-pms     | Planning My SaaS | sales
```

Ordem alfabetica por label dentro de cada subsistema:

```
1. admin-users   | User Management  | admin      (unico)
2. sales-leads   | Leads            | marketing  (L antes de S)
3. mkt-social    | Social Media     | marketing
4. sales-pms     | Planning My SaaS | sales      (unico)
```

Apenas trocar as linhas 2 e 3 de posicao na array.

