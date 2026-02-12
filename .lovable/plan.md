
# Exibir Avatar do ICP no Target Customer Card

## Problema
O `TargetCustomerCard` sempre mostra um icone generico (`<User>`) em vez da foto do avatar gerada por IA. O campo `icp_avatar_url` existe no `reportData` mas nunca e passado ao componente.

## Correcao

### Arquivo 1: `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx`
- Passar `reportData?.icp_avatar_url` como nova prop `avatarUrl` ao `TargetCustomerCard`

```tsx
<TargetCustomerCard
  icp={icp}
  insight={aiInsights?.customer_insight}
  avatarUrl={reportData?.icp_avatar_url}
/>
```

### Arquivo 2: `src/components/planningmysaas/dashboard/businessplan/TargetCustomerCard.tsx`
- Adicionar prop `avatarUrl?: string | null` na interface
- Substituir o bloco do icone estatico (linhas 79-82) por um Avatar com fallback:
  - Se `avatarUrl` existir: exibir `<img>` com a foto do avatar
  - Se nao: manter o icone `<User>` como fallback

```tsx
// Antes (linhas 79-82):
<div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
  <User className="h-6 w-6 text-accent" />
</div>

// Depois:
{avatarUrl ? (
  <img
    src={avatarUrl}
    alt={personaName}
    className="h-12 w-12 rounded-full object-cover border border-border/20"
  />
) : (
  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
    <User className="h-6 w-6 text-accent" />
  </div>
)}
```

### Impacto na Tela Compartilhavel
O `SharedReportContext` ja mapeia `icp_avatar_url` corretamente no `reportData` (linha 80 do SharedReportContext.tsx). Como o `BusinessPlanTab` e reutilizado na tela publica, o avatar aparecera automaticamente em ambas as views.

### Resumo
- 2 arquivos editados
- 0 dependencias novas
- Avatar aparece no dashboard e na tela compartilhavel
