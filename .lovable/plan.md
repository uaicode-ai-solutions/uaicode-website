
# Fix: Redirect prematuro no PmsCloserFlow

## Problema

O `useEffect` no `PmsCloserFlow.tsx` (linha 36-40) redireciona o usuario para `/planningmysaas/reports` **antes** dos roles terminarem de carregar do Supabase.

**Sequencia atual:**
1. Pagina carrega, `pmsUser` existe
2. `useUserRoles` inicia a query async para buscar roles
3. Enquanto carrega: `isAdmin = false`, `isContributor = false`
4. O `useEffect` ve `pmsUser` + `!isAdmin` + `!isContributor` e redireciona imediatamente
5. Os roles chegam do banco (tarde demais)

## Correcao

Usar o `isLoadingRoles` (ja disponivel no hook `useUserRoles`) para aguardar o carregamento antes de decidir:

**Arquivo:** `src/pages/PmsCloserFlow.tsx`

**Mudanca 1** -- Desestruturar `isLoadingRoles` do hook (linha 24):
```ts
const { isAdmin, isContributor, isLoadingRoles } = useUserRoles();
```

**Mudanca 2** -- Adicionar guard no useEffect (linhas 36-40):
```ts
useEffect(() => {
  if (pmsUser && !isLoadingRoles && !isAdmin && !isContributor) {
    navigate("/planningmysaas/reports");
  }
}, [pmsUser, isAdmin, isContributor, isLoadingRoles, navigate]);
```

**Mudanca 3** -- Mostrar loading enquanto roles carregam (linhas 59-65):
```ts
if (!pmsUser || isLoadingRoles) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
```

Sao 3 linhas alteradas no total. Nenhum arquivo novo, nenhuma dependencia nova.
