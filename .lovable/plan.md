
# Plano: Corrigir Botão Reset para Reiniciar Sessão

## Problema

O `handleReset` atual:
```typescript
const handleReset = useCallback(() => {
  if (isCallActive) {
    endCall();  // ← Encerra
  }
  resetMessages();  // ← Limpa mensagens
  setInputText("");
}, [isCallActive, endCall, resetMessages]);
```

Ele encerra e limpa, mas **não reconecta**. O usuário fica com a sessão encerrada.

## Solução

Modificar `handleReset` para:
1. Encerrar a sessão atual
2. Limpar mensagens
3. **Reconectar automaticamente** após um pequeno delay

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Ajustar `handleReset` para reconectar após encerrar |

## Código Novo

```typescript
const handleReset = useCallback(async () => {
  // Encerra a sessão atual se estiver ativa
  if (isCallActive) {
    await endCall();
  }
  
  // Limpa mensagens e input
  resetMessages();
  setInputText("");
  
  // Reconecta após um pequeno delay
  setTimeout(() => {
    if (wizardId) {
      toggleCall();
    }
  }, 500);
}, [isCallActive, endCall, resetMessages, wizardId, toggleCall]);
```

## Comportamento Final

| Ação | Antes | Depois |
|------|-------|--------|
| Clicar no ↻ | Encerra sessão e fica desconectado | Encerra, limpa e **reconecta automaticamente** |

## Resumo

- Apenas 1 mudança no `handleReset`
- Adiciona `async/await` para garantir que o `endCall` termine
- Adiciona `setTimeout` para reconectar após 500ms
- Adiciona `wizardId` e `toggleCall` às dependências do `useCallback`
