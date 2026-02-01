
# Plano: Remover Sugestões de Perguntas

## Resumo

Remover completamente as sugestões de perguntas ("Try asking:") que estão aparecendo e sumindo no chat do Kyle.

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Remover Quick Replies |

## O Que Será Removido

### 1. Constante QUICK_REPLIES (linhas 16-20)
```typescript
const QUICK_REPLIES = [
  "Tell me about pricing",
  "I want to schedule a call",
  "What services do you offer?"
];
```

### 2. Função handleQuickReply (linhas 65-69)
```typescript
const handleQuickReply = useCallback((reply: string) => {
  if (isCallActive && sendUserMessage) {
    sendUserMessage(reply);
  }
}, [isCallActive, sendUserMessage]);
```

### 3. Bloco de Renderização (linhas 251-268)
```typescript
{/* Quick Replies - only show when connected and no messages yet */}
{isCallActive && messages.length === 0 && !isSpeaking && (
  <div className="px-4 pb-2">
    <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
    <div className="flex flex-wrap gap-2">
      {QUICK_REPLIES.map((reply, index) => (
        <Badge
          key={index}
          variant="outline"
          className="text-xs hover:bg-amber-500/10 hover:border-amber-500/50 cursor-pointer transition-colors"
          onClick={() => handleQuickReply(reply)}
        >
          "{reply}"
        </Badge>
      ))}
    </div>
  </div>
)}
```

## Visual Antes vs Depois

| Antes | Depois |
|-------|--------|
| Mostra "Try asking:" com 3 sugestões que aparecem/somem | Interface limpa sem sugestões |

## Resultado Final

O chat do Kyle ficará mais limpo, sem as sugestões de perguntas que estavam causando o comportamento de aparecer e sumir.
