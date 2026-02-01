
# Plano: Remover Mensagens Placeholder Duplicadas

## Problema
Ambos os dialogs (Chat e Voz) têm uma mensagem hardcoded que aparece brevemente antes da mensagem real do agente chegar, causando um "flash" visual indesejado.

## Arquivos a Modificar

| Arquivo | Linhas a Remover |
|---------|------------------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | 155-167 |
| `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` | 123-135 |

## Código a Remover

### KyleChatDialog.tsx (linhas 155-167)
```tsx
{/* Initial prompt when no messages and connected */}
{messages.length === 0 && isCallActive && (
  <div className="flex gap-3 justify-start animate-fade-in-up">
    <div className="flex-shrink-0 mt-1">
      <KyleAvatar size="sm" isActive={isCallActive} />
    </div>
    <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
      <p className="text-sm whitespace-pre-wrap leading-relaxed">
        Hi! I'm Kyle, your sales consultant. Type a message to start chatting!
      </p>
    </div>
  </div>
)}
```

### KyleConsultantDialog.tsx (linhas 123-135)
```tsx
{/* Initial prompt when no messages and connected */}
{messages.length === 0 && isCallActive && (
  <div className="flex gap-3 justify-start animate-fade-in-up">
    <div className="flex-shrink-0 mt-1">
      <KyleAvatar size="sm" isActive={isCallActive} />
    </div>
    <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
      <p className="text-sm whitespace-pre-wrap leading-relaxed">
        Hi! I'm Kyle, your sales consultant. I'm listening!
      </p>
    </div>
  </div>
)}
```

## Comportamento Após a Mudança

| Estado | O que mostra |
|--------|--------------|
| Não conectado | "Click the button..." ou "Type a message..." |
| Conectando | Loader + "Connecting to Kyle..." |
| Conectado, aguardando agente | (área vazia por breve momento) |
| Mensagem do agente chega | Mensagem real do ElevenLabs |

## O Que NÃO Será Alterado
- Hooks (useKyleChatElevenLabs, useKyleElevenLabs) - intocados
- Lógica de auto-connect
- Layout/visual geral
- Estados de erro, desconectado ou conectando
- Área de mensagens reais
