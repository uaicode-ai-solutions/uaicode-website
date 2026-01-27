
# Correção: Remover Tela em Branco Durante Retry

## Problema

O fluxo atual:
1. Clica em Retry → `setIsRetrying(true)` → botão anima
2. `await supabase.update()` → aguarda banco
3. `setIsRetrying(false)` → **PARA a animação** ❌
4. `window.location.reload()` → inicia reload
5. **Tela em branco** enquanto a página recarrega

O `setIsRetrying(false)` na linha 176 está causando o problema - ele reseta o estado visual ANTES do reload completar.

## Solução

Remover `setIsRetrying(false)` completamente. Uma vez que o reload acontece, o estado é destruído de qualquer forma. Manter a animação até o último momento garante feedback visual contínuo.

## Arquivo: `src/pages/PmsLoading.tsx`

### Mudança na função `handleRetryFailedStep` (linhas 163-186)

**Antes:**
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
  setIsRetrying(false);  // ❌ PROBLEMA: para a animação
  
  if (!error) {
    console.log("[PmsLoading] Status reset to 'preparing' for retry, reloading...");
    window.location.reload();
  } else {
    console.error("[PmsLoading] Failed to update status for retry:", error);
  }
}, [wizardId]);
```

**Depois:**
```typescript
const handleRetryFailedStep = useCallback(async () => {
  if (!wizardId) return;
  
  setIsRetrying(true);
  
  // Update status to "preparing" before reloading
  const { error } = await supabase
    .from("tb_pms_reports")
    .update({ status: "preparing" })
    .eq("wizard_id", wizardId);
  
  if (!error) {
    console.log("[PmsLoading] Status reset to 'preparing' for retry, reloading...");
    window.location.reload();
    // Não resetar isRetrying - o reload vai destruir o estado de qualquer forma
    // Manter a animação garante feedback visual contínuo
  } else {
    console.error("[PmsLoading] Failed to update status for retry:", error);
    // Só resetar em caso de erro, para permitir nova tentativa
    setIsRetrying(false);
  }
}, [wizardId]);
```

## Fluxo Corrigido

```text
Clica em Retry
     │
     ▼
setIsRetrying(true) → botão mostra "Preparing..." com spinner
     │
     ▼
await supabase.update() → aguarda banco (botão continua animando)
     │
     ▼
Sucesso? ──┬── Sim → window.location.reload() 
           │         (animação continua até página recarregar)
           │
           └── Não → setIsRetrying(false) → botão volta para "Retry"
                     (usuário pode tentar novamente)
```

## Resumo

| Cenário | Antes | Depois |
|---------|-------|--------|
| Sucesso | Para animação → tela branca → reload | Animação contínua → reload |
| Erro | Para animação → fica travado | Para animação → pode tentar novamente |
