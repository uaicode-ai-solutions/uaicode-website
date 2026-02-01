
# Plano: Colocar Botões Fechar e Refresh Lado a Lado

## Resumo

Adicionar um botão de fechar (X) explícito ao lado do botão de refresh no header do chat.

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Adicionar botão X ao lado do refresh |

## Mudança Técnica

### Header Atual (linhas 130-146):
```typescript
<div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Sparkles className="h-5 w-5 text-amber-400" />
      <span className="font-semibold text-foreground">AI Sales Consultant</span>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      className="text-muted-foreground hover:text-foreground"
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
  </div>
</div>
```

### Header Novo:
```typescript
<div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Sparkles className="h-5 w-5 text-amber-400" />
      <span className="font-semibold text-foreground">AI Sales Consultant</span>
    </div>
    {/* Botões lado a lado */}
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
</div>
```

### Adicionar Import:
```typescript
import { Sparkles, RotateCcw, Loader2, AlertCircle, Send, MessageSquare, X } from "lucide-react";
```

### Ocultar X Padrão do Dialog:
Adicionar classe para esconder o botão X padrão do DialogContent:
```typescript
<DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20 [&>button]:hidden">
```

## Visual Final

```
┌────────────────────────────────────────────────┐
│  ✨ AI Sales Consultant          [↻]  [✕]     │
├────────────────────────────────────────────────┤
│                    ...                         │
└────────────────────────────────────────────────┘
```

## Resumo

- Adicionar import do ícone `X`
- Criar div wrapper com `flex items-center gap-1` para os dois botões
- Adicionar botão de fechar com `onClick={handleClose}`
- Ocultar o X padrão do DialogContent com `[&>button]:hidden`
