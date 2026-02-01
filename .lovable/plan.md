
# Plano Simplificado: Kyle Chat + Voice (Mesmo Agente ElevenLabs)

## Resumo

Usar o **mesmo agente ElevenLabs** para ambos os cards. A diferença é apenas a interface:
- **KyleChatDialog**: Input de texto → `sendUserMessage()`
- **KyleConsultantDialog**: Input de voz (microfone)

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useKyleElevenLabs.ts` | Modificar - adicionar `sendUserMessage` |
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Modificar - usar texto ao invés de microfone |

**NÃO precisa criar:**
- ~~kyle-chat edge function~~
- ~~useKyleChat hook~~
- ~~Lovable AI Gateway integration~~

## Fase 1: Atualizar Hook `useKyleElevenLabs`

Adicionar método `sendUserMessage` que o ElevenLabs conversation hook já expõe:

```typescript
// src/hooks/useKyleElevenLabs.ts

return {
  // ... existing returns
  sendUserMessage: conversationHook.sendUserMessage, // NOVO
};
```

## Fase 2: Atualizar `KyleChatDialog` (Chat de Texto)

### Mudanças no Visual

O layout atual será **preservado**. Apenas a área de controle inferior muda:

**Antes (microfone):**
```
┌────────────────────────────────────┐
│     [Botão Microfone Grande]       │
│   "Tap to start voice chat"        │
└────────────────────────────────────┘
```

**Depois (input texto):**
```
┌────────────────────────────────────┐
│ [Input de texto........] [Enviar] │
│   💬 Chat with Kyle                │
└────────────────────────────────────┘
```

### Mudanças no Código

1. **Manter**: Header, Kyle Info, Messages area, Quick Replies (visual)
2. **Remover**: Botão de microfone grande, texto "Tap to start voice chat"
3. **Adicionar**: 
   - `<Input>` para digitar mensagem
   - `<Button>` Send com ícone
   - Estado local `inputText`
   - Função `handleSend()` que chama `sendUserMessage(inputText)`

4. **Auto-conectar**: Quando o dialog abre, conectar automaticamente ao ElevenLabs
5. **Quick Replies**: Ao clicar, chamar `sendUserMessage(quickReply)`

### Estrutura do Componente

```typescript
const KyleChatDialog = ({ open, onOpenChange, wizardId }: Props) => {
  const [inputText, setInputText] = useState("");
  
  const {
    isCallActive,
    isConnecting,
    isSpeaking,
    error,
    messages,
    toggleCall,
    endCall,
    sendUserMessage,  // NOVO
    resetMessages,
  } = useKyleElevenLabs({ wizardId });

  // Auto-conectar ao abrir
  useEffect(() => {
    if (open && wizardId && !isCallActive && !isConnecting) {
      toggleCall();
    }
  }, [open, wizardId]);

  const handleSend = () => {
    if (inputText.trim() && isCallActive) {
      sendUserMessage(inputText);
      setInputText("");
    }
  };

  const handleQuickReply = (reply: string) => {
    if (isCallActive) {
      sendUserMessage(reply);
    }
  };

  // ... rest of component (visual mantido)
};
```

## Fase 3: KyleConsultantDialog (Voz)

**Já está funcionando corretamente!** Não precisa de mudanças.

Ele usa o mesmo `useKyleElevenLabs` hook, mas com interface de microfone.

## Fluxo Final

```
┌─────────────────────────────────────────────────────────────┐
│                      Mesmo Agente Kyle                       │
│                  ELEVENLABS_KYLE_AGENT_ID                    │
│                                                              │
│    ┌─────────────────────┐     ┌─────────────────────┐      │
│    │   Chat with Kyle    │     │     Call Kyle       │      │
│    │                     │     │                     │      │
│    │  [Digita texto]     │     │  [Fala no mic]      │      │
│    │        ↓            │     │        ↓            │      │
│    │  sendUserMessage()  │     │  Auto via WebRTC    │      │
│    │        ↓            │     │        ↓            │      │
│    │  Kyle responde      │     │  Kyle responde      │      │
│    │  (áudio + texto)    │     │  (áudio)            │      │
│    └─────────────────────┘     └─────────────────────┘      │
│                                                              │
│              Mesma edge function: kyle-conversation-token    │
│              Mesmo hook: useKyleElevenLabs                   │
└─────────────────────────────────────────────────────────────┘
```

## Elementos Preservados no KyleChatDialog

- Header com Sparkles e "AI Sales Consultant"
- Botão Reset (RotateCcw)
- Kyle Info section com avatar e badge de status
- Messages area com bolhas estilizadas (user gradient amarelo, assistant bg-muted)
- Speaking indicator (3 dots animados)
- Quick Replies badges
- Footer com texto "Chat powered by AI"

## Ordem de Implementação

1. Atualizar `useKyleElevenLabs.ts` - expor `sendUserMessage`
2. Atualizar `KyleChatDialog.tsx` - trocar microfone por input de texto
3. Testar ambos os diálogos
