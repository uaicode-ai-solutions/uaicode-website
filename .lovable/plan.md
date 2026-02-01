
## Objetivo
Fazer o botão de refresh (↻) **reiniciar a sessão em 1 clique**, sem exigir “1 clique para encerrar + 1 clique para iniciar”.

## Diagnóstico (por que hoje precisa de 2 cliques)
No `KyleChatDialog.tsx`, o `handleReset` faz:
1) `await endCall()`  
2) depois chama `toggleCall()` com `setTimeout`.

O problema é que o `toggleCall()` (no hook `useKyleChatElevenLabs`) decide “encerrar vs iniciar” baseado em `conversationHook.status`. Em muitos casos, **mesmo após `await endSession()`**, o status ainda está momentaneamente como `"connected"`.  
Resultado: o `toggleCall()` entende que ainda está conectado e **encerra de novo**, ao invés de iniciar. Aí você precisa clicar novamente.

## Solução (robusta, 1 clique sempre)
Em vez de usar `toggleCall()` para reiniciar, vamos criar uma ação explícita de “restart” no hook que:
1) encerra a sessão se estiver conectada  
2) **aguarda o status realmente ficar `disconnected`** (com polling e timeout)  
3) inicia uma nova sessão (startChat)  
4) bloqueia cliques repetidos durante o restart (guard)

Isso elimina a corrida de estado (“race condition”) do status.

---

## Mudanças propostas

### 1) `src/hooks/useKyleChatElevenLabs.ts`
Adicionar:
- `statusRef` para sempre ler o status mais recente dentro de loops assíncronos.
- `isRestartingRef` para impedir múltiplos restarts simultâneos.
- Função `restartCall` (ou `restartChat`) que faz **end → wait disconnected → start**.

Implementação (conceito):
- `statusRef.current = conversationHook.status` a cada render.
- `restartCall`:
  - se já estiver reiniciando: retorna (no-op)
  - se `statusRef.current === "connected"`: `await endChat()`
  - loop com timeout (ex.: até 3s): enquanto `statusRef.current !== "disconnected"`, aguarda 50ms
  - chama `await startChat()`

E expor no `return` do hook:
- `restartCall`

Observação importante: manteremos `toggleCall` existente para outras interações, mas o refresh vai usar o `restartCall`.

### 2) `src/components/planningmysaas/dashboard/KyleChatDialog.tsx`
Ajustar o `handleReset` para usar o método novo:
- Desestruturar `restartCall` do hook.
- `handleReset` vira:
  - limpar `inputText`
  - chamar `await restartCall()` (sem `toggleCall`, sem `setTimeout`)

Opcional (recomendado):
- Desabilitar o botão ↻ enquanto `isConnecting` for true para evitar spam (ele já existe; só garantir que o refresh respeita isso, se ainda não respeitar).

---

## Critérios de aceite (como vamos testar)
1) Abrir o dialog do Kyle e conectar.
2) Enviar uma mensagem (ver ela aparecer).
3) Clicar **uma vez** no ↻.
4) Esperado:
   - Mensagens limpam
   - Status passa por “Disconnected/Connecting…”
   - Reconecta sozinho
   - Não precisa clicar novamente
5) Repetir o teste 3 vezes seguidas para garantir que não há intermitência.

## Riscos / cuidados
- O polling de status precisa de timeout para não travar (ex.: 3s). Se estourar, ainda tentamos `startChat()` (ou mostramos erro amigável).
- Garantir que nada disso mexe no voice (`useKyleElevenLabs.ts` e edge function `kyle-conversation-token`) — isso fica intacto.

## Resultado final
O refresh (↻) vira um “reiniciar sessão” real: **um clique = encerra corretamente + reconecta automaticamente**, sempre.
