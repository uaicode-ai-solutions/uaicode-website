
# Corrigir Avatar no Target Customer Card

## Causa Raiz

O campo `icp_avatar_url` esta `NULL` no banco de dados para este relatorio -- o avatar por IA nunca foi gerado. A aba Marketing/Report funciona porque usa um **avatar estatico** do bucket `icp-avatars` baseado em regiao + genero (ex: `us-male.png`), sem depender do campo `icp_avatar_url`.

O `TargetCustomerCard` so exibe avatar se `icp_avatar_url` tiver valor, caso contrario mostra o icone generico `<User>`.

## Solucao

Aplicar a mesma logica de avatar estatico como fallback no `TargetCustomerCard`:

1. Se `icp_avatar_url` existir (avatar gerado por IA) -> usa ele
2. Senao, monta URL estatica a partir de regiao + genero do ICP -> usa o avatar pre-gerado do bucket
3. Se nenhum dado disponivel -> fallback para icone `<User>`

## Arquivos

### 1. `src/components/planningmysaas/dashboard/businessplan/TargetCustomerCard.tsx`

- Adicionar prop `region?: string | null` na interface
- Criar funcao `getStaticAvatarUrl` (mesma logica do MarketingIntelligenceSection)
- Usar `avatarUrl || getStaticAvatarUrl(region, persona?.gender)` como src da imagem

### 2. `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx`

- Passar `report?.geographic_region` como prop `region` ao TargetCustomerCard

```tsx
<TargetCustomerCard
  icp={icp}
  insight={aiInsights?.customer_insight}
  avatarUrl={reportData?.icp_avatar_url}
  region={report?.geographic_region}
/>
```

### Impacto na Tela Compartilhavel

O `SharedReportContext` precisara mapear `geographic_region` do `wizard_snapshot` para o objeto `report`. Verificarei se ja esta mapeado; caso contrario, adicionarei.

### Resultado

Avatar visivel em todas as telas: Report, Business Plan e Compartilhavel -- usando a mesma cascata de prioridade (IA gerado > estatico > icone fallback).
