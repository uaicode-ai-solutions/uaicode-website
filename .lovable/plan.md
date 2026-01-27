
# Correção: Renomear isProcessing para isRetrying

## Mudança Simples

Renomear o estado e garantir que ele seja resetado para `false` após a atualização do banco, antes do reload.

## Arquivo: `src/pages/PmsLoading.tsx`

### Mudanças:

| Linha | Antes | Depois |
|-------|-------|--------|
| 52 | `const [isProcessing, setIsProcessing] = useState(false);` | `const [isRetrying, setIsRetrying] = useState(false);` |
| 78 | `setIsProcessing(true);` | Remover (não é usado para retry) |
| 168 | `setIsProcessing(true);` | `setIsRetrying(true);` |
| 170-177 | Atualiza banco e chama orchestrator | Atualiza banco, seta `isRetrying = false`, faz reload |
| 251 | `disabled={isProcessing}` | `disabled={isRetrying}` |
| 253 | `${isProcessing ? 'animate-spin' : ''}` | `${isRetrying ? 'animate-spin' : ''}` |
| 254 | `{isProcessing ? "Retrying..." : ...}` | `{isRetrying ? "Preparing..." : ...}` |

### Código Final do handleRetryFailedStep:

```typescript
const handleRetryFailedStep = useCallback(async () => {
  if (!wizardId) return;
  
  setIsRetrying(true);
  
  // Update status to "preparing" before reloading
  const { error } = await supabase
    .from("tb_pms_reports")
    .update({ status: "preparing" })
    .eq("wizard_id", wizardId);
  
  // Reset state before reload
  setIsRetrying(false);
  
  if (!error) {
    console.log("[PmsLoading] Status reset to 'preparing' for retry, reloading...");
    window.location.reload();
  } else {
    console.error("[PmsLoading] Failed to update status for retry:", error);
  }
}, [wizardId]);
```

### Código Final do Botão:

```tsx
<Button
  className="flex-1"
  onClick={handleRetryFailedStep}
  disabled={isRetrying}
>
  <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
  {isRetrying ? "Preparing..." : `Retry Step ${failedStepInfo?.stepNumber || ''}`}
</Button>
```

## Nota sobre `setIsProcessing(true)` na linha 78

O `triggerOrchestrator` ainda usa `setIsProcessing(true)` na linha 78, mas como estamos removendo o estado `isProcessing`, essa linha também deve ser removida. O `triggerOrchestrator` é chamado internamente e não precisa de estado de UI.

## Resumo

- Renomear `isProcessing` → `isRetrying`
- `isRetrying` só é usado no contexto do botão Retry
- Garantir `setIsRetrying(false)` antes do `window.location.reload()`
- Texto do botão: "Preparing..." durante o estado de loading
