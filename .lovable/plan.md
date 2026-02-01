
# Plano: Adaptar KyleConsultantDialog (Voz) Baseado no KyleChatDialog

## Estratégia

Copiar a estrutura visual exata do `KyleChatDialog` para o `KyleConsultantDialog`, apenas trocando:
1. O hook de `useKyleChatElevenLabs` → `useKyleElevenLabs`
2. O footer (remover input/send, colocar botão mic)
3. Remover botão de refresh
4. Trocar texto do rodapé

## Arquivo a Modificar

`src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx`

## Mudanças Específicas

### 1. Imports
```typescript
// TROCAR:
import { useKyleChatElevenLabs } from "@/hooks/useKyleChatElevenLabs";
// POR:
import { useKyleElevenLabs } from "@/hooks/useKyleElevenLabs";

// REMOVER: Input, Send, RotateCcw
// ADICIONAR: Phone, PhoneOff
```

### 2. Hook
```typescript
// TROCAR:
const { ... } = useKyleChatElevenLabs({ wizardId });
// POR:
const { ... } = useKyleElevenLabs({ wizardId });
```

### 3. Remover Estado de Texto
```typescript
// REMOVER:
const [inputText, setInputText] = useState("");
const handleSend = useCallback(...);
const handleKeyPress = useCallback(...);
const handleReset = useCallback(...);
```

### 4. Header - Remover Botão Refresh
```typescript
// DE:
<div className="flex items-center gap-1">
  <Button onClick={handleReset}><RotateCcw /></Button>  // REMOVER ESTE
  <Button onClick={handleClose}><X /></Button>
</div>

// PARA:
<div className="flex items-center gap-1">
  <Button onClick={handleClose}><X /></Button>
</div>
```

### 5. Empty States - Ajustar Textos para Voz
```typescript
// Mensagem inicial quando conectado (linha 162-164):
"Hi! I'm Kyle, your sales consultant. Type a message to start chatting!"
// TROCAR POR:
"Hi! I'm Kyle, your sales consultant. I'm listening!"

// Estado não conectado (linha 173):
"Type a message to start chatting with Kyle"
// TROCAR POR:
"Click the button below to start talking with Kyle"
```

### 6. Typing Indicator - Trocar por Speaking
```typescript
// Linha 226: "Kyle is typing" → "Kyle is speaking"
```

### 7. Footer - Substituir Input por Botão Mic
```typescript
// DE (linhas 249-276):
<div className="p-4 border-t border-border/50 bg-muted/30">
  <div className="flex gap-2">
    <Input ... />
    <Button onClick={handleSend}>
      <Send />
    </Button>
  </div>
  <p>💬 Chat with Kyle • Free consultation</p>
</div>

// PARA:
<div className="p-4 border-t border-border/50 bg-muted/30">
  <div className="flex justify-center">
    <Button
      onClick={toggleCall}
      disabled={isConnecting}
      className={`px-4 ${
        isCallActive
          ? "bg-red-500 hover:bg-red-600"
          : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30"
      }`}
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCallActive ? (
        <PhoneOff className="h-4 w-4" />
      ) : (
        <Phone className="h-4 w-4" />
      )}
    </Button>
  </div>
  <p className="text-center text-xs text-muted-foreground mt-3">
    🎤 Voice powered by AI • Free consultation
  </p>
</div>
```

## Resumo Visual

| Elemento | Antes | Depois |
|----------|-------|--------|
| Hook | useKyleChatElevenLabs | useKyleElevenLabs |
| Header | [Sparkles] [↻] [X] | [Sparkles] [X] |
| Footer | [Input] [Send] | [Mic Button] |
| Texto rodapé | 💬 Chat with Kyle | 🎤 Voice powered by AI |
| Empty state | "Type a message..." | "Click the button..." |
| Typing | "Kyle is typing" | "Kyle is speaking" |

## O Que NÃO Será Alterado
- Todo o layout do dialog (altura, estrutura)
- Área de mensagens/transcripts (bolhas, estilo)
- Avatar do Kyle
- Status badges
- Lógica de auto-connect
- Hook useKyleElevenLabs (intocado - já funciona)
