

# Plano: Corrigir Comportamento do Mute e Padronizar Altura do KyleChatDialog

## Problema Identificado

O botão do microfone atualmente **encerra a chamada** ao invés de apenas mutar o microfone. E quando a chamada não está ativa, desabilita o envio de texto completamente.

### Código atual problemático:

```tsx
// Linha 376-377: Input desabilitado quando não está em chamada
disabled={!isCallActive || isConnecting}

// Linha 384: Send desabilitado quando não está em chamada  
disabled={!isCallActive || isConnecting || !inputText.trim()}
```

O fluxo atual:
1. Usuário clica no mic → Inicia chamada de voz
2. Usuário quer mutar → Clica no mic (que mostra MicOff)
3. Resultado: Chamada é encerrada, input fica desabilitado

## Solução Proposta

### 1. Mudar o comportamento do botão do microfone

O botão deve ter 3 estados:

| Estado | Ícone | Cor | Ação ao clicar |
|--------|-------|-----|----------------|
| Inativo (sem chamada) | `Mic` | Amber/dourado | Iniciar chamada |
| Ativo (chamada ativa) | `Mic` | Verde | Mutar microfone |
| Mutado (mic silenciado) | `MicOff` | Vermelho | Desmutar microfone |

### 2. Adicionar botão separado para encerrar chamada (opcional)

Ou manter o X do dialog para encerrar, mas o mic passa a ser só para mutar.

### 3. Permitir enviar texto mesmo sem chamada ativa

Mas para isso precisa que o ElevenLabs suporte `sendUserMessage` sem chamada ativa. Vou verificar se isso é possível ou se precisa manter a chamada ativa.

**Decisão**: Manter chamada ativa para enviar texto (como está), mas o botão do mic **muta o microfone**, não encerra a chamada.

### 4. Padronizar altura do dialog

Adicionar altura fixa similar ao EmailKyleDialog (que tem conteúdo de ~500px):

```tsx
<DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20 h-[580px] flex flex-col">
```

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useKyleElevenLabs.ts` | Adicionar estados e funções de mute |
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Corrigir lógica do botão de mic e padronizar altura |

## Mudanças Detalhadas

### useKyleElevenLabs.ts

Adicionar:
```typescript
const [isMicMuted, setIsMicMuted] = useState(false);

// Função para mutar/desmutar microfone
const toggleMicMute = useCallback(() => {
  setIsMicMuted(prev => !prev);
  // O ElevenLabs SDK suporta isso via setVolume ou controlando o stream de áudio
}, []);

return {
  // ... existing
  isMicMuted,
  toggleMicMute,
};
```

### KyleChatDialog.tsx

1. **Corrigir lógica do botão de mic**:

```tsx
// ANTES: Botão alterna entre iniciar/encerrar chamada
<Button onClick={handleToggleVoice}>
  {isCallActive ? <MicOff /> : <Mic />}
</Button>

// DEPOIS: Botão inicia chamada OU muta/desmuta quando ativo
<Button onClick={isCallActive ? toggleMicMute : handleToggleVoice}>
  {isCallActive 
    ? (isMicMuted ? <MicOff /> : <Mic />) 
    : <Mic />
  }
</Button>
```

2. **Adicionar botão para encerrar chamada** (no header ou na área de voice):

```tsx
{isCallActive && (
  <Button 
    variant="ghost" 
    size="sm"
    onClick={endCall}
    className="text-red-400 hover:text-red-500"
  >
    End Call
  </Button>
)}
```

3. **Padronizar altura**:

```tsx
<DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20 h-[580px] flex flex-col">
```

E remover `min-h` e `max-h` da área de mensagens:
```tsx
// ANTES
<div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">

// DEPOIS  
<div className="flex-1 overflow-y-auto p-4 space-y-3">
```

## Layout Visual Atualizado

```
┌────────────────────────────────────────────────────┐
│ [Kyle Avatar] Kyle ✨                        [🔄] │
│               🟢 Online        [End Call]         │
├────────────────────────────────────────────────────┤
│                                                    │
│  [Área de mensagens - flex-1, sem altura fixa]    │
│                                                    │
├────────────────────────────────────────────────────┤
│  [💰 Pricing] [📅 Schedule] [📦 Services]        │
├────────────────────────────────────────────────────┤
│     ▂ ▄ ▆ █ ▆ ▄ ▂ ▂ ▄ ▆ ▄ ▂                      │
│           ● Listening...                           │
├────────────────────────────────────────────────────┤
│ [🎤]  [Type your message...]             [Send]   │  ← Mic muta, não encerra
│    "Type a message or tap 🎤 to mute"             │
└────────────────────────────────────────────────────┘
          Altura padronizada: 580px
```

## Estados do Botão de Microfone

| Condição | Ícone | Cor | Ação |
|----------|-------|-----|------|
| `!isCallActive && !isConnecting` | `Mic` | Amber com pulse | Iniciar chamada |
| `isConnecting` | `Loader2` (spinning) | Amber 50% | Desabilitado |
| `isCallActive && !isMicMuted` | `Mic` | Verde | Mutar microfone |
| `isCallActive && isMicMuted` | `MicOff` | Vermelho | Desmutar microfone |

## Helper Text Atualizado

```typescript
const getHelperText = () => {
  if (error) return "Connection error. Try again.";
  if (isConnecting) return "Establishing connection...";
  if (isCallActive) {
    if (isMicMuted) return "Microphone muted. Tap 🎤 to unmute";
    return isSpeaking 
      ? "Kyle is responding..." 
      : "Listening... Tap 🎤 to mute";
  }
  return "Tap 🎤 to start voice or type a message";
};
```

## Ordem de Implementação

1. Atualizar `useKyleElevenLabs.ts`:
   - Adicionar estado `isMicMuted`
   - Adicionar função `toggleMicMute` (pode usar `setVolume({ volume: 0 })` para silenciar input)
   - Expor novos valores no retorno

2. Atualizar `KyleChatDialog.tsx`:
   - Importar `isMicMuted` e `toggleMicMute` do hook
   - Padronizar altura do DialogContent para `h-[580px]`
   - Remover `min-h` e `max-h` da área de mensagens
   - Corrigir lógica do botão de microfone
   - Adicionar botão "End Call" na voice visualization
   - Atualizar helper text
   - Ajustar cores do botão de mic baseado no estado

