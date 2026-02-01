
# Plano: Corrigir Chat do Kyle - Mostrar Mensagens e Melhorar Aparência

## Problema Identificado

1. **Mensagens do usuário não aparecem** - O `sendUserMessage` do ElevenLabs envia a mensagem, mas o callback `onMessage` pode não retornar a mensagem do usuário (ou retornar com delay). Precisamos adicionar a mensagem manualmente.

2. **Aparência diferente do chat da Eve** - O chat da Eve usa componentes estilizados com avatares, enquanto o Kyle usa divs simples.

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useKyleChatElevenLabs.ts` | Criar wrapper para `sendUserMessage` que adiciona mensagem ao array |
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Atualizar aparência para ficar igual à Eve |

## GARANTIA: Arquivos INTOCÁVEIS

- `src/hooks/useKyleElevenLabs.ts` - NÃO SERÁ MODIFICADO
- `supabase/functions/kyle-conversation-token/index.ts` - NÃO SERÁ MODIFICADO
- `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` - NÃO SERÁ MODIFICADO

---

## Mudanças Técnicas

### 1. useKyleChatElevenLabs.ts - Wrapper para sendUserMessage

Criar uma função wrapper que adiciona a mensagem do usuário ao array ANTES de enviar:

```typescript
// Novo wrapper para sendUserMessage
const sendMessage = useCallback((text: string) => {
  if (!text.trim()) return;
  
  // Adiciona mensagem do usuário ao array IMEDIATAMENTE
  const userMessage: Message = { role: "user", content: text.trim() };
  setMessages(prev => [...prev, userMessage]);
  onMessageRef.current?.(userMessage);
  
  // Envia para o ElevenLabs
  conversationHook.sendUserMessage(text.trim());
}, [conversationHook]);

// No return, trocar sendUserMessage por sendMessage
return {
  // ... outros campos
  sendUserMessage: sendMessage, // Usar o wrapper ao invés do original
};
```

### 2. KyleChatDialog.tsx - Atualizar Aparência

Aplicar o mesmo estilo do chat da Eve:

**Área de mensagens (substituir o mapeamento atual):**
```typescript
{messages.map((message, index) => (
  <div
    key={index}
    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} ${
      index === messages.length - 1 ? "animate-fade-in-up" : ""
    }`}
  >
    {/* Kyle Avatar - só para mensagens do assistente */}
    {message.role === "assistant" && (
      <div className="flex-shrink-0 mt-1">
        <KyleAvatar size="sm" isActive={isCallActive} />
      </div>
    )}

    {/* Message bubble */}
    <div className="flex flex-col max-w-[80%]">
      <div
        className={`rounded-2xl px-4 py-3 ${
          message.role === "user"
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-br-md"
            : "bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-bl-md border border-border/50"
        } ${index === messages.length - 1 && message.role === "assistant" ? "shadow-[0_0_20px_rgba(250,204,21,0.1)]" : ""}`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  </div>
))}
```

**Typing indicator (quando Kyle está "pensando"):**
```typescript
{/* Typing indicator - quando enviou mensagem e aguarda resposta */}
{messages.length > 0 && messages[messages.length - 1].role === "user" && (
  <div className="flex gap-3 justify-start animate-fade-in-up">
    <div className="flex-shrink-0 mt-1">
      <KyleAvatar size="sm" isActive />
    </div>
    <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Kyle is typing</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
)}
```

## Visual Final

```
┌────────────────────────────────────────┐
│     ✨ AI Sales Consultant             │
├────────────────────────────────────────┤
│           [Kyle Avatar]                │
│              Kyle                      │
│         ● Connected                    │
├────────────────────────────────────────┤
│                                        │
│  [Kyle]  Hi! How can I help you?       │
│                                        │
│           What services do you offer?  │  ← Mensagem do usuário (amber)
│                                        │
│  [Kyle]  We offer three main packages  │
│          ...                           │
│                                        │
│  [Kyle]  Kyle is typing ● ● ●          │  ← Typing indicator
│                                        │
├────────────────────────────────────────┤
│  [Input] Type your message... [Send]   │
└────────────────────────────────────────┘
```

## Resumo das Alterações

- **useKyleChatElevenLabs.ts**: Adicionar wrapper que insere mensagem do usuário no array antes de enviar
- **KyleChatDialog.tsx**: Aplicar estilo igual ao chat da Eve com avatares e bolhas estilizadas

## Por que isso resolve?

1. **Mensagens do usuário aparecem imediatamente** - não dependemos do callback do ElevenLabs
2. **Aparência consistente** - mesmo padrão visual do chat da Eve
3. **Feedback visual** - typing indicator mostra que Kyle está processando
