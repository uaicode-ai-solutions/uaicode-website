
# Plano: Iniciar Conversa Automaticamente ao Abrir o Dialog

## Problema Identificado

Atualmente, quando o `KyleChatDialog` abre, ele mostra a tela de apresentação ("Hi! I'm Kyle...") e espera o usuário clicar no botão do microfone para iniciar a chamada.

O usuário quer que a conversa inicie **automaticamente** assim que o dialog abrir, sem mostrar a tela de apresentação.

## Solução

Adicionar um `useEffect` que detecta quando o dialog é aberto (`open === true`) e automaticamente inicia a chamada de voz via `startCall()`.

## Mudanças Necessárias

### Arquivo: `src/components/planningmysaas/dashboard/KyleChatDialog.tsx`

**Adicionar useEffect para auto-iniciar:**

```tsx
// Auto-start call when dialog opens
useEffect(() => {
  if (open && !isCallActive && !isConnecting) {
    // Small delay to ensure dialog is fully mounted
    const timer = setTimeout(() => {
      handleToggleVoice();
    }, 300);
    return () => clearTimeout(timer);
  }
}, [open]);
```

**Atualizar Empty State:**

Como a chamada inicia automaticamente, o empty state pode mostrar "Connecting..." ao invés da apresentação do Kyle. Podemos simplificar para mostrar apenas o loading/connecting state:

```tsx
{/* Connecting State - shows while connecting */}
{messages.length === 0 && (isConnecting || (!isCallActive && open)) ? (
  <div className="flex flex-col items-center justify-center h-full">
    <KyleAvatar isActive={true} isSpeaking={false} size="lg" />
    <p className="text-muted-foreground mt-4">
      {isConnecting ? "Connecting to Kyle..." : "Starting conversation..."}
    </p>
    <div className="flex gap-1.5 mt-4">
      <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
) : null}
```

### Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Adicionar useEffect para auto-start e atualizar empty state |

## Fluxo Atualizado

```
┌────────────────────────────────────────────┐
│ Usuário clica em "Talk to Kyle"            │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ Dialog abre                                │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ useEffect detecta open === true            │
│ Chama handleToggleVoice() automaticamente  │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ Mostra "Connecting to Kyle..."             │
│ com avatar e animação de loading           │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ Conexão estabelecida                       │
│ Kyle começa a falar automaticamente        │
│ Voice visualization aparece                │
└────────────────────────────────────────────┘
```

## Considerações

1. **Delay de 300ms**: Pequeno delay para garantir que o dialog está montado antes de iniciar a chamada
2. **Permissão do microfone**: O browser vai pedir permissão do microfone automaticamente
3. **Tratamento de erro**: Se a conexão falhar, o usuário pode tentar novamente clicando no botão do mic
4. **Reset**: O botão de reset (`RotateCcw`) encerra a chamada atual e reinicia automaticamente

## Código Final

```tsx
// Auto-start voice call when dialog opens
useEffect(() => {
  if (open && !isCallActive && !isConnecting) {
    const timer = setTimeout(() => {
      handleToggleVoice();
    }, 300);
    return () => clearTimeout(timer);
  }
}, [open, isCallActive, isConnecting, handleToggleVoice]);
```
