
# Plano: Mostrar Data Quality Banner Apenas para Admins e Contributors

## Objetivo

Alterar a condição de renderização do `DataQualityBanner` para que ele apareça **apenas** para usuários com role `admin` ou `contributor`.

## Situação Atual

O hook `useUserRoles` já está:
- Importado no arquivo (`src/pages/PmsDashboard.tsx:60`)
- Sendo usado no componente (`linha 76`)
- Retorna `isAdmin` (já usado para o Admin Panel)
- Retorna `isContributor` (disponível mas não usado ainda)

O banner atualmente é exibido para **todos os usuários** quando há issues:

```tsx
{!bannerDismissed && dataQualityIssues.length > 0 && (
  <DataQualityBanner ... />
)}
```

## Alteração Necessária

### Arquivo: `src/pages/PmsDashboard.tsx`

#### 1. Atualizar o destructuring do useUserRoles (linha 76)

**De:**
```tsx
const { isAdmin } = useUserRoles();
```

**Para:**
```tsx
const { isAdmin, isContributor } = useUserRoles();
```

#### 2. Atualizar a condição do banner (linhas 388-397)

**De:**
```tsx
{!bannerDismissed && dataQualityIssues.length > 0 && (
```

**Para:**
```tsx
{!bannerDismissed && dataQualityIssues.length > 0 && (isAdmin || isContributor) && (
```

## Resultado

| Role | Vê o Banner? |
|------|--------------|
| admin | Sim |
| contributor | Sim |
| user | Não |
| Sem role | Não |

## Por Que É Seguro

1. **Mínima alteração**: Apenas 2 linhas modificadas
2. **Reutiliza código existente**: O hook `useUserRoles` já está no componente
3. **Não afeta outros recursos**: Só adiciona uma condição AND à renderização
4. **Backward compatible**: Se o hook falhar, `isAdmin` e `isContributor` serão `false`, então o banner simplesmente não aparece (comportamento seguro)
