
# Plano: Simplificar "Try Again"

## O que fazer

Alterar o `handleRetry` para:
1. Chamar a Edge Function `pms-orchestrate-report`
2. Navegar para a mesma rota de loading (força re-mount do componente)

## Código

**Arquivo:** `src/pages/PmsLoading.tsx`

**Alterar linhas 72-86:**

```typescript
// Handle retry using new orchestrator Edge Function
const handleRetry = () => {
  // 1. Chamar Edge Function (fire-and-forget)
  supabase.functions.invoke('pms-orchestrate-report', {
    body: { wizard_id: wizardId }
  });
  
  // 2. Navegar para a mesma rota (força re-mount e reinicia polling)
  navigate(`/planningmysaas/loading/${wizardId}`, { replace: true });
  window.location.reload();
};
```

## Por que funciona

- `window.location.reload()` força o re-mount completo do componente
- O polling reinicia do zero
- A UI começa mostrando o skeleton (pois `status` inicial é `undefined`)
- Quando o polling pegar o novo status, a UI atualiza normalmente

## Alternativa sem reload

Se preferir evitar o reload da página, podemos usar um `key` no componente:

```typescript
const [retryKey, setRetryKey] = useState(0);

const handleRetry = () => {
  supabase.functions.invoke('pms-orchestrate-report', {
    body: { wizard_id: wizardId }
  });
  setRetryKey(prev => prev + 1); // Força re-render
  hasNavigated.current = false;
};
```

E no return, resetar os dados com `invalidateQueries` ou similar.

## Resultado

Ao clicar "Try Again":
1. Edge Function é chamada
2. Página recarrega
3. Skeleton aparece imediatamente
4. Polling monitora progresso
5. Quando completar, redireciona para dashboard
